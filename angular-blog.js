angular.module('angular-blog', [])
.directive('blog', function() {
    return {
        restrict: 'E',
        scope: {
            posts: '=posts'
        },
        controller: function($scope, $sanitize) {

            $scope.output = [];
            $scope.converter = new Showdown.converter();

            $scope.convertMDToHTML = function(string) {
                return $scope.converter.makeHtml(string);
            };

            $scope.getFile = function(path_to_file) {
                var xmlhttp;
                // code for IE7+, Firefox, Chrome, Opera, Safari
                if (window.XMLHttpRequest) {
                    xmlhttp = new XMLHttpRequest();

                }
                // code for IE6, IE5 
                else {
                    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                }

                xmlhttp.onreadystatechange = function() {
                    // ON SUCCESS OF AJAX CALL
                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                        $scope.$apply(function() {
                            var html_string = $scope.convertMDToHTML(xmlhttp.responseText);
                            $scope.output.push(html_string + '<br><br><hr class=\'blog-hr\'>');
                        });
                    }
                };

                // SETUP AND MAKE AJAX CALL
                xmlhttp.open("GET", path_to_file, true);
                xmlhttp.send();
            };

            // RUN AJAX FOR ALL FILES
            for (var i = 0; i < $scope.posts.length; i++) {
                $scope.getFile($scope.posts[i]);
            }

        },
        template: [
            "<div>",
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