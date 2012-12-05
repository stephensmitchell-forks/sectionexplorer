'use strict';

/* Filters */

// http://jsfiddle.net/pkozlowski_opensource/myr4a/1/
// http://jsfiddle.net/2ZzZB/10/
// http://jsfiddle.net/pkozlowski_opensource/JtAZM/1/
// http://jsfiddle.net/tUyyx/

// angular.module('phonecat',[]).filter('minFlangeWidth', function(){
angular.module('filters', []).
filter('minFlangeWidth', function () {

    return function (items, minbf) {

        if (minbf == undefined) {
            return items;
        }

        if (minbf != undefined) {


            if (items != undefined) {
                var arrayToReturn = [];
                for (var i = 0; i < items.length; i++) {
                    if (items[i].bf >= minbf) {
                        arrayToReturn.push(items[i]);
                    }
                }
            }

            return arrayToReturn;
        };
    }
}).
filter('maxFlangeWidth', function () {


    return function (items, maxbf) {
        if (maxbf == '') {
            return items;
        }

        if (maxbf == undefined) {
            return items;
        }

        if (maxbf != undefined) {
            if (items != undefined) {

                var arrayToReturn = [];
                for (var i = 0; i < items.length; i++) {
                    if (items[i].bf <= maxbf) {
                        arrayToReturn.push(items[i]);
                    }
                }
            }

            return arrayToReturn;
        };
    }
}).
filter('maxDepth', function () {
    // var scope = this;

    return function (items, maxdepth) {
        // console.log(maxdepth)

        if (maxdepth == '') {
            return items;
        }
        if (maxdepth == undefined) {
            return items;
        }

        if (maxdepth != undefined) {
            // console.log(maxdepth)
            if (items != undefined) {


                var arrayToReturn = [];
                for (var i = 0; i < items.length; i++) {
                    if (items[i].d < maxdepth) {
                        arrayToReturn.push(items[i]);
                    }
                }
            }
            // if (!scope.maxdepth) return true;
            return arrayToReturn;
        };
    }
}).
filter('minDepth', function () {
    // var scope = this;

    return function (items, mindepth) {
        // console.log(maxdepth)

        if (mindepth == '') {
            return items;
        }
        if (mindepth == undefined) {
            return items;
        }

        if (mindepth != undefined) {
            // console.log(maxdepth)
            if (items != undefined) {


                var arrayToReturn = [];
                for (var i = 0; i < items.length; i++) {
                    if (items[i].d > mindepth) {
                        arrayToReturn.push(items[i]);
                    }
                }
            }
            // if (!scope.maxdepth) return true;
            return arrayToReturn;
        };
    }
});