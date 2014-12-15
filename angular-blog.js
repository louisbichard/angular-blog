angular.module('angular-blog', [])
    .directive('blog', function() {
        return {
            restrict: 'E',
            scope: {
                posts: '=posts',
                search: '@',
                share_url: '=shareUrl'
            },
            controller: function($scope) {

                $scope.$watch('search', function() {
                    $scope.searchText = $scope.search;
                });

                $scope.output = [];
                $scope.converter = new Showdown.converter();

                $scope.getHttp = function() {
                    // IF WINDOW HAS XMLHTTP (IE7+, FFOX, CHROME, OPERA) REQUEST USE IT IF NOT POLYFILL FOR IE6 AND 5
                    return (window.XMLHttpRequest) ? new XMLHttpRequest() : new ActiveXObject("Microsoft.XMLHTTP");
                };

                $scope.pushToOuput = function(args, markdown_content) {
                    $scope.$apply(function() {
                        $scope.output.push(args.title_html + args.data_string + args.click_to_copy + '<hr>' + markdown_content + '<hr class=\'blog-hr\'>');
                    });
                };

                $scope.setupXmlHttp = function(xmlhttp, args) {
                    xmlhttp.onreadystatechange = function() {
                        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                            var markdown_content = $scope.converter.makeHtml(xmlhttp.responseText);
                            $scope.pushToOuput(args, markdown_content);
                        }
                    };
                    xmlhttp.open("GET", args.path, true);
                    xmlhttp.send();
                };

                $scope.convertTagsToString = function(args) {

                    var tag_string;

                    // CONSTRUCT TAG STRING
                    var curr_tags = args.tags || [];
                    var blog_id = "&nbsp;||&nbsp;" + args.id || "";
                    args.data_string = "<p class=\'blog-metadata\'>" + args.author + "&nbsp;||&nbsp;" + args.date + "&nbsp;||&nbsp" + curr_tags.join(', ') + blog_id + "</p>";
                    args.click_to_copy = ($scope.share_url) ? "<p> Share this: " + "<span class='blog-link' >" + $scope.share_url + args.id + "</spam></p>" : "";

                    return args;
                };

                $scope.convertTitleToHTML = function(title) {
                    return '<h1>' + title + '</h1>';
                };

                $scope.getFile = function(args) {
                    args.title_html = $scope.convertTitleToHTML(args.title);
                    args = $scope.convertTagsToString(args);

                    var xmlhttp = $scope.getHttp();

                    $scope.setupXmlHttp(xmlhttp, args);
                };

                // RUN AJAX FOR ALL FILES
                for (var i = 0; i < $scope.posts.length; i++) {
                    $scope.getFile($scope.posts[i]);
                }

            },
            template: [
                "<div class='angular-blog'>",
                "<input ng-model='searchText' class='blog-search' type='text' placeholder='Search'/>",
                "<br><br>",
                "<p> Results: {{results.length}}</p>",
                // ITERATE OVER ALL OF THE BLOG POSTS
                "<div ng-repeat='post in results = (output | filter:searchText)'>",
                // FOR EACH POST RENDER THE HTML STRING AS OUTPUT HTML
                "<div ng-bind-html='post'>",
                "</div>",
                "</div>",
                "</div>"
            ].join('')
        };
    });
