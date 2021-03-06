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
                            scope.minbf = ui.values[0]
                            scope.maxbf = ui.values[1]
                        }


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
                            scope.data.mindepth = ui.values[0]
                            scope.data.maxdepth = ui.values[1]
                        }


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
    // http://jsfiddle.net/PJZmv/801/

    .directive('clearableinput', function () {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            scope: {
                model: '@model'
            },
            template: '<span class="clearable"><input ng-model="query" type="text" class="data_field"  /><span class="icon_clear">x</span></span>',
            
            // <input ng-model="query" type="text" class="ng-pristine ng-valid">
            //name="data_field" value=""
            link: function (scope, element, attrs) {
                $(document).on('propertychange keyup input paste', 'input.data_field', function(){
                    var io = $(this).val().length ? 1 : 0;
                    $(this).next('.icon_clear').stop().fadeTo(300,io);
                    // console.log(element)
                })
                .on('click', '.icon_clear', function() {
                    $(this).delay(300).fadeTo(300,0).prev('input').val('');
                })
            
            },

        }
    })









    .directive('plotsection', function () {
    return {
        restrict: 'E',
        scope: {
            properties: '@properties',
            size: '@size',
            display: '@display'
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
                        // console.log(k1Split)
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

                    // X scale will fit values from 0-10 within pixels 0-100
                    if (attrs.display == "individual") {
                        var graph = d3.select(element[0])
                            .append("svg:svg")
                            .attr("width", parseInt(attrs.size) + 50)
                            .attr("height", parseInt(attrs.size) + 50);
                        var xScale = d3.scale.linear().domain([0, d]).range([0, attrs.size - 100]);
                        // Y scale will fit values from 0-10 within pixels 0-100
                        var yScale = d3.scale.linear().domain([0, d]).range([0, attrs.size - 100]);

                    } else {

                        var graph = d3.select(element[0])
                            .append("svg:svg")
                            .attr("width", parseInt(attrs.size))
                            .attr("height", parseInt(attrs.size));
                        var xScale = d3.scale.linear().domain([0, bf]).range([0, attrs.size * bf / d * (d / 44)]);
                        // Y scale will fit values from 0-10 within pixels 0-100
                        var yScale = d3.scale.linear().domain([0, d]).range([0, attrs.size * (d / 44)]);



                    }
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
                    } // go negative x direction by width of flange /2  - thickness of web / 2, bf/2- tw/2
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


                    graph.append("svg:path")
                        .attr("d", function (d) {
                        return filletTopRight.tension(d)(filletPathTopRight)
                    })

                    var xOffset = (attrs.size - xScale(bf)) / 2
                    var yOffset = (attrs.size - yScale(d)) / 2

                    graph.selectAll('path')
                        .attr("transform", "translate(" + xOffset + "," + yOffset + ")");



                    var scaleBarPath = [{
                        x: 0,
                        y: d
                    }, {
                        x: (bf / 2 - tw / 2),
                        y: d
                    }

                    ];





                    if (attrs.display == "individual") {
                        if (bf > d) {

                            var x = d3.scale.linear().range([0, xScale(bf)]).domain([0, Math.round(bf)]),
                                xAxis = d3.svg.axis().scale(x).tickSize(5)
                        } else {
                            var x = d3.scale.linear().range([0, Math.round(yScale(d))]).domain([0, Math.round(d)]),
                                xAxis = d3.svg.axis().scale(x).tickSize(5)
                        }
                        graph.append("svg:g")
                            .attr("class", "x axis")
                            .attr("transform", "translate(50," + (yScale(d) + 75) + ")")
                            .attr("stroke", "#696969")
                            .call(xAxis);


                        graph.append("text")
                            .attr("text-anchor", "middle") // this makes it easy to centre the text as the transform is applied to the anchor
                            .attr("transform", "translate(" + (50 + 15) + "," + (yScale(d) + 120) + ")") // text is drawn off the screen top left, move down and out and rotate
                            .text("inches");

                    }

                }
            });
        }
    }
})