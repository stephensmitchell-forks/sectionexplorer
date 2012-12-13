'use strict';

/* App Module */

angular.module('phonecat', ['filters', 'directives', 'phonecatServices', 'ui', 'SharedServices','ui.bootstrap.accordion' ]).
config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
    when('/', {
        templateUrl: 'partials/query.html',
        controller: QueryCtrl
    }).
    when('/W/all/', {
        templateUrl: 'partials/sections-all.html',
        controller: SectionListCtrl
    }).
    when('/W/:phoneId', {
        templateUrl: 'partials/w-detail.html',
        controller: WDetailCtrl
    }).
        when('/about', {
        templateUrl: 'partials/about.html',
        controller: AboutCtrl,
    }).
    otherwise({
        redirectTo: '/'
    });
}])


// https://github.com/climboid/angular-slider
.value('ui.config', {
    // The ui-jq directive namespace
    jq: {
        // The Tooltip namespace
        tooltip: {
            // Tooltip options. This object will be used as the defaults
            placement: 'right',
            html: true
        },
        popover: {
            // Tooltip options. This object will be used as the defaults
            placement: 'top',
            trigger: 'hover',
            html: true
        }
        // ,
        // popover: {
        //  placement: 'right',
        //  html: true
        // }
    }
});

// http://jsfiddle.net/dBR2r/38/
// http://stackoverflow.com/questions/11673559/angular-js-data-not-populated-from-asynchronous-http-request

angular.module('SharedServices', [])
    .config(function ($httpProvider) {
    $httpProvider.responseInterceptors.push('myHttpInterceptor');
    var spinnerFunction = function (data, headersGetter) {
        // todo start the spinner here

        var opts = {
            lines: 9, // The number of lines to draw
            length: 13, // The length of each line
            width: 7, // The line thickness
            radius: 14, // The radius of the inner circle
            corners: 1, // Corner roundness (0..1)
            rotate: 90, // The rotation offset
            color: '#BEBEBE', // #rgb or #rrggbb
            speed: 2.2, // Rounds per second
            trail: 87, // Afterglow percentage
            shadow: false, // Whether to render a shadow
            hwaccel: false, // Whether to use hardware acceleration
            className: 'spinner', // The CSS class to assign to the spinner
            zIndex: 2e9, // The z-index (defaults to 2000000000)
            top: 'auto', // Top position relative to parent in px
            left: 'auto' // Left position relative to parent in px
        };
        // http://fgnass.github.com/spin.js/#?lines=9&length=13&width=7&radius=14&corners=1.0&rotate=90&trail=87&speed=0.8
        var target = document.getElementById('loading');
        var spinner = new Spinner(opts).spin(target);
        $(target).data('spinner', spinner);

        $('#loading').show();
        $('#section-table').hide();
        return data;
    };
    $httpProvider.defaults.transformRequest.push(spinnerFunction);
})
// register the interceptor as a service, intercepts ALL angular ajax http calls
.factory('myHttpInterceptor', function ($q, $window) {
    return function (promise) {
        return promise.then(function (response) {
            // do something on success
            // todo hide the spinner


            $('#loading').hide();
            // $('#loading').data('spinner').stop();
            $('#section-table').show();








            return response;

        }, function (response) {
            // do something on error
            // todo hide the spinner
            $('#loading').hide();
            return $q.reject(response);
        });
    };
})

// directive for datatables
// http://jsfiddle.net/zdam/pb9ba/
//https://groups.google.com/forum/#!msg/angular/vM2DEMK_NMA/nnd_-5BujyEJ