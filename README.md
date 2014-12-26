angular-blog
============

A markdown based blog for angular

See the working demo [here](http://louisbichard.github.io/angular-blog/)

#Installation

     bower install angular-blog

## Notes

* Not currently tested
* Dynamic SPA based content will have issues with SEO

##HTML

    <blog posts="posts"></blog>

##Config object

* Array of objects
* `title`: {String} - Title of the article
* `path`: {String} - Path to the markdown file
* `author`: {String} - Author of the article
* `date`: {String} - String to be used as the date
* `tags`: {Array} - of tag strings

###Example

	$scope.posts = [{
        path: 'ablog1.md',
        author: 'Louis John Bichard',
        date: '14th December 2014',
        title: 'Some blog 1',
        tags: ['Brogrammer, Patience']
    }];
