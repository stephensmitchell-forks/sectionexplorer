'use strict';



angular.module('directives', [])
    .directive('slider', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            // console.log(attrs.id)
            if (attrs.id == "flangeWidthSlider") {
                element.slider({
                    range: true,
                    min: 0,
                    max: scope.maxbf,
                    step: 0.1,
                    values: [0, scope.maxbf],
                    slide: function (event, ui) {
                        if (event.target.id == "flangeWidthSlider") {
                            // scope.hello = ui.value;  
                            // $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
                            scope.minbf = ui.values[0]
                            scope.maxbf = ui.values[1]
                        }
                        // else if(event.target.id == "slider2"){
                        //  // scope.goodbye = ui.value;
                        //  scope.maxbf= ui.value
                        // }

                        scope.$apply();
                    }
                });
            } else if (attrs.id == "depthSlider") {
                element.slider({
                    range: true,
                    min: 0,
                    max: scope.data.maxdepth,
                    step: 0.1,
                    values: [scope.data.mindepth, scope.data.maxdepth],
                    slide: function (event, ui) {
                        if (event.target.id == "depthSlider") {
                            // scope.hello = ui.value;  
                            // $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
                            scope.data.mindepth = ui.values[0]
                            scope.data.maxdepth = ui.values[1]
                        }
                        // else if(event.target.id == "slider2"){
                        //  // scope.goodbye = ui.value;
                        //  scope.maxbf= ui.value
                        // }

                        scope.$apply();
                    }
                });


            }
        }
    };
})
    .directive('suLabel', function () {

    return {
        restrict: 'E',
        replace: true,
        transclude: true,
        scope: {
            title: '@tooltip',
            value: '@value'
        },

        // template: '<label><a href="#" rel="tooltip" title="{{title}}" data-placement="right" ng-transclude></a></label>',
        // template :'<a ui-jq="tooltip" href="" class="ng-binding" data-original-title="{{title}}" >{{value}}</a>',
        template: '<a data-content="{{title}}" ui-jq="popover" href="" class="ng-binding" title="{{value}}">Type</a>',
        // I removed title="{{title}}" from the template above
        link: function (scope, element, attrs) {
            if (attrs.tooltip) {
                element.addClass('tooltip-title');

            }
        },
    }
})
    .directive('plotsection', function () {
    return {
        restrict: 'E',
        scope: {
            properties: '@properties',
            size: '@size'
        },
        link: function (scope, element, attrs) {
            scope.$watch(function () {
                return attrs.properties
            }, function () {
                // scope.value = attrs.properties;
                function k1ToNum(k1) {
                    // the AISC spreadsheet gives the k1 in a string
                    // this function takes that string, breaks it up based on spaces
                    // it iterates over the pieces
                    // if the piece is a space it disregards it
                    // if the piece is a string, then it evals the string
                    // this turns values such as 1/8 into 0.125
                    // it adds all these pieces up and returns the k1 numberical value
                    if (attrs.properties) {
                        var k1Split = k1.split(" ")
                        console.log(k1Split)
                        var k1Num = 0;
                        for (var i = 0; i < k1Split.length; i++) {

                            if (eval(k1Split[i]) != undefined) {
                                k1Num += eval(k1Split[i])
                            }
                        }
                        return k1Num;
                    }
                }

                if (attrs.properties) {

                    var sectionProperties = jQuery.parseJSON(attrs.properties)
                    // console.log(attrs.size)

                    var tw = sectionProperties.tw //thickness of web
                    var tf = sectionProperties.tf //thickness of flange
                    var d = sectionProperties.d //section depth
                    var bf = sectionProperties.bf //flange width
                    var k = sectionProperties.kdes

                    //algorithm to draw wf
                    // start in upper left corner, go clockwise around section
                    // go to the positive x direction by width of flange, bf
                    //go negative y direction by flange thickness, tf
                    // go negative x direction by width of flange /2  - thickness of web / 2, bf/2- tw/2
                    //go negative y direction by section depth - 2*flange thickness, d - 2*tf
                    // go positive x direction by flange width /2 - thickness of web/2 , bf/2 - tw/2
                    // go negative y direction by flange thickness, tf
                    // go negative x directin by flange width, bf



                    // var k1Num = parseFloat(sectionProperties.k1.split(" ")[0]) + sectionProperties.k1.split(" ")[1] + sectionProperties.k1.split(" ")[2]
                    // console.log( k1Num)
                    var k1Num = k1ToNum(sectionProperties.k1)
                    // console.log(k1Num)
                    var graph = d3.select(element[0]).append("svg:svg").attr("width", attrs.size).attr("height", attrs.size);
                    // X scale will fit values from 0-10 within pixels 0-100
                    var xScale = d3.scale.linear().domain([0, bf]).range([0, attrs.size * bf / d *(d/44)]);
                    // Y scale will fit values from 0-10 within pixels 0-100
                    var yScale = d3.scale.linear().domain([0, d]).range([0, attrs.size*(d/44)]);
                    // http://jsfiddle.net/Wexcode/CrDUy/


                    var topFlangePath = [{
                        x: (bf / 2 - tw / 2 - k1Num),
                        y: tf
                    }, {
                        x: 0,
                        y: tf
                    },

                    {
                        x: 0,
                        y: 0
                    }, // start in upper left corner, go clockwise around section
                    {
                        x: bf,
                        y: 0
                    }, // go to the positive x direction by width of flange, bf
                    {
                        x: bf,
                        y: tf
                    }, //go negative y direction by flange thickness, tf
                    {
                        x: (bf / 2 + tw / 2 + k1Num),
                        y: tf
                    }, // go negative x direction by width of flange /2  - thickness of web / 2, bf/2- tw/2
                    ]

                    var bottomFlangePath = [{
                        x: (bf / 2 - tw / 2 - k1Num),
                        y: d - tf
                    }, {
                        x: 0,
                        y: d - tf
                    },

                    {
                        x: 0,
                        y: d
                    }, // start in upper left corner, go clockwise around section
                    {
                        x: bf,
                        y: d
                    }, // go to the positive x direction by width of flange, bf
                    {
                        x: bf,
                        y: d - tf
                    }, //go negative y direction by flange thickness, tf
                    {
                        x: (bf / 2 + tw / 2 + k1Num),
                        y: d - tf
                    } // go negative x direction by width of flange /2  - thickness of web / 2, bf/2- tw/2
                    ]

                    var webPathLeft = [{
                        x: (bf / 2 - tw / 2),
                        y: k
                    }, {
                        x: (bf / 2 - tw / 2),
                        y: d - k
                    }
                    // {x: 0, y: 0}

                    ];

                    var webPathRight = [{
                        x: (bf / 2 + tw / 2),
                        y: k
                    }, {
                        x: (bf / 2 + tw / 2),
                        y: d - k
                    }
                    // {x: 0, y: 0}

                    ];



                    var filletPathTopLeft = [{
                        x: (bf / 2 - tw / 2 - k1Num),
                        y: tf
                    }, {
                        x: (bf / 2 - tw / 2),
                        y: tf
                    }, {
                        x: (bf / 2 - tw / 2),
                        y: k
                    }

                    ];

                    var topFlange = d3.svg.line()
                        .x(function (d) {
                        return xScale(d.x);
                    })
                        .y(function (d) {
                        return yScale(d.y);
                    })
                        .interpolate("linear");
                    graph.append("svg:path").attr("d", topFlange(topFlangePath));


                    var bottomFlange = d3.svg.line()
                        .x(function (d) {
                        return xScale(d.x);
                    })
                        .y(function (d) {
                        return yScale(d.y);
                    })
                        .interpolate("linear");
                    graph.append("svg:path").attr("d", bottomFlange(bottomFlangePath));



                    var webRight = d3.svg.line()
                        .x(function (d) {
                        return xScale(d.x);
                    })
                        .y(function (d) {
                        return yScale(d.y);
                    })
                        .interpolate("linear");
                    graph.append("svg:path").attr("d", webRight(webPathRight));



                    var webLeft = d3.svg.line()
                        .x(function (d) {
                        return xScale(d.x);
                    })
                        .y(function (d) {
                        return yScale(d.y);
                    })
                        .interpolate("linear");
                    graph.append("svg:path").attr("d", webLeft(webPathLeft));




                    var filletPathBottomLeft = [{
                        x: (bf / 2 - tw / 2),
                        y: d - k
                    }, {
                        x: (bf / 2 - tw / 2),
                        y: d - tf
                    }, {
                        x: (bf / 2 - tw / 2 - k1Num),
                        y: d - tf
                    }

                    ];



                    var filletBottomLeft = d3.svg.line()
                        .interpolate("basis")
                        .x(function (d) {
                        return xScale(d.x);
                    })
                        .y(function (d) {
                        return yScale(d.y);
                    });


                    graph.append("svg:path")
                        .attr("d", function (d) {
                        return filletBottomLeft.tension(d)(filletPathBottomLeft)
                    })







                    var filletPathBottomRight = [{
                        x: (bf / 2 + tw / 2),
                        y: d - k
                    }, {
                        x: (bf / 2 + tw / 2),
                        y: d - tf
                    }, {
                        x: (bf / 2 + tw / 2 + k1Num),
                        y: d - tf
                    }

                    ];



                    var filletBottomRight = d3.svg.line()
                        .interpolate("basis")
                        .x(function (d) {
                        return xScale(d.x);
                    })
                        .y(function (d) {
                        return yScale(d.y);
                    });


                    graph.append("svg:path")
                        .attr("d", function (d) {
                        return filletBottomRight.tension(d)(filletPathBottomRight)
                    })







                    var filletPathTopLeft = [{
                        x: (bf / 2 - tw / 2 - k1Num),
                        y: tf
                    }, {
                        x: (bf / 2 - tw / 2),
                        y: tf
                    }, {
                        x: (bf / 2 - tw / 2),
                        y: k
                    }

                    ];



                    var filletTopLeft = d3.svg.line()
                        .interpolate("basis")
                        .x(function (d) {
                        return xScale(d.x);
                    })
                        .y(function (d) {
                        return yScale(d.y);
                    });


                    graph.append("svg:path")
                        .attr("d", function (d) {
                        return filletTopLeft.tension(d)(filletPathTopLeft)
                    })



                    var filletPathTopRight = [{
                        x: (bf / 2 + tw / 2 + k1Num),
                        y: tf
                    }, {
                        x: (bf / 2 + tw / 2),
                        y: tf
                    }, {
                        x: (bf / 2 + tw / 2),
                        y: k
                    }

                    ];



                    var filletTopRight = d3.svg.line()
                        .interpolate("basis")
                        .x(function (d) {
                        return xScale(d.x);
                    })
                        .y(function (d) {
                        return yScale(d.y);
                    });


                    graph
                    .append("svg:path")
                        .attr("d", function (d) {
                        return filletTopRight.tension(d)(filletPathTopRight)
                    })






                    //         var fillet = Math.sqrt( 
                    //             Math.pow( 

                    //                     ( bf/2- tw/2-k1Num) -
                    //                     ( bf/2- tw/2)  
                    //                 ,2) 
                    //             + 
                    //             Math.pow(
                    //                 (tf-k)
                    //                 ,2)

                    //             );
                    //         var data = d3.range(50).map(function(i) {
                    //   return Math.sqrt( Math.pow(fillet,2) - Math.pow(i/50,2));
                    // });
                    // //       var data = d3.range(120).map(function(i) {
                    // //   return .8 + Math.sin(i / 3 * Math.PI) / 6;
                    // // });
                    //     console.log(fillet)
                    //         console.log(data)
                    //         var radius = d3.scale.linear()
                    //     .domain([0, 50])
                    //     .range([0 , 500 ]);

                    //     var angle = d3.scale.linear()
                    //     .domain([0, data.length])
                    //     .range([0, Math.PI/2]);


                    // var filletTopLeft = d3.svg.line.radial()
                    //     .interpolate("basis")
                    //     .radius(radius)
                    //     .angle(function(d, i) { return angle(i); });




                    //     graph.append("svg:path")
                    //     .datum(data)
                    //     .attr("class", "line")
                    //     .attr("d", filletTopLeft)
                    //     // .attr("transform", "translate(" + ((radius ) + ( bf/2- tw/2-k1Num))+", " + ((radius) + tf)+")");
                    //     .attr("transform", "translate("+ xScale(bf/2 - tw/2 - k1Num) + "," + yScale(fillet/2 + tf)+ ")");

                }



                // console.log(scope.value.Type)
            });


            // // create an SVG element inside the #graph div that fills 100% of the div
            // var graph = d3.select(element[0]).append("svg:svg").attr("width", "100%").attr("height", "100%");

            // // create a simple data array that we'll plot with a line (this array represents only the Y values, X will just be the index location)
            // var data = [3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 9, 3, 6, 3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 9, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 9, 3, 6, 2, 7, 5, 2, 1, 3, 8, 9, 2, 5, 9];

            // // X scale will fit values from 0-10 within pixels 0-100
            // var x = d3.scale.linear().domain([0, 10]).range([0, 50]);
            // // Y scale will fit values from 0-10 within pixels 0-100
            // var y = d3.scale.linear().domain([0, 10]).range([0, 30]);

            // // create a line object that represents the SVN line we're creating
            // var line = d3.svg.line()
            //     // assign the X function to plot our line as we wish
            //     .x(function(d,i) { 
            //         // verbose logging to show what's actually being done
            //         // console.log('Plotting X value for data point: ' + d + ' using index: ' + i + ' to be at: ' + x(i) + ' using our xScale.');
            //         // return the X coordinate where we want to plot this datapoint
            //         return x(i); 
            //     })
            //     .y(function(d) { 
            //         // verbose logging to show what's actually being done
            //         // console.log('Plotting Y value for data point: ' + d + ' to be at: ' + y(d) + " using our yScale.");
            //         // return the Y coordinate where we want to plot this datapoint
            //         return y(d); 
            //     })

            //     // display the line by appending an svg:path element with the data line we created above
            //     graph.append("svg:path").attr("d", line(data));

        }

    }
})