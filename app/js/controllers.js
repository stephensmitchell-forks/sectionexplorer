'use strict';

/* Controllers */

// function PhoneListCtrl($scope, $http) {
// $http.get('phones/phones.json').success(function(data) {
//   $scope.phones = data;
// });


function SectionListCtrl($scope, Phone) {

    $scope.phones = Phone.query(function (phones) {
        // console.log(phones[0])
        //   var arr = [];
        //     for (var key in phones[0]) if (phones[0].hasOwnProperty(key)) {
        //         arr.push(phones[0][key]);
        //     }
        //     console.log(phones[0])
        //     console.log(arr)
        //     console.log(phones[0].keys);
        //     // return arr;
        $scope.sectionProperties = [];
        // many of the values in the json file are null, i.e. for a wf, D/t does not make sense therefore
        // it is null, I skip over these and do not push them to the properties array.
        var j = 0;
        for (var i in phones[0]) if (phones[0].hasOwnProperty(i)) if (phones[0][i] != null) {

            // var arr=[];
            var key = i;
            var val = phones[0][i];
            // console.log(val);
            // console.log(i)
            $scope.sectionProperties[j] = i;
            j++;

            // for(var j in val){

            //     var sub_key = j;
            //     var sub_val = val.j;
            //     console.log(sub_key);

            // }

        }
        console.log($scope.sectionProperties)

    });







    // var keyNames = function (obj) {
    //     var arr = [];
    //     for (var x in obj) if (obj.hasOwnProperty(x)) {
    //         arr.push(obj[x]);
    //     }
    //     console.log(arr)
    //     return arr;
    // };

    // var what = keyNames($scope.phones)


    $scope.showLabel = true
    // $scope.showWeight=true

    $scope.showFlangeWidth = true
    $scope.showFlangeThickness = true
    $scope.maxbf = 20
    $scope.minbf = 0
    $scope.maxdepth = 60
    $scope.mindepth = 0


    // http://jsfiddle.net/rdarder/pnSNj/10/
    // https://groups.google.com/forum/#!msg/angular/45jNmQucSCE/hL8x48-JfZIJ
    // somewhat indepth discussion of why child variables don't propogate up
    // requires soem retooling of code because I am showing show properties
    // through a child inthe accordian directive

$scope.resetDepthFilter = function() {
  $scope.data.maxdepth = 60;
  $scope.data.mindepth = 0;
  $scope.data.depthValue = null;
  var $slider = $("#depthSlider");
  $slider.slider("values", 0, $scope.data.mindepth);
  $slider.slider("values", 1, $scope.data.maxdepth);
  // #depthSlider{:max => "100", :min => "20", :slider => ""} 
}
$scope.change = function() {
    $scope.data.maxdepth = $scope.data.depthValue * 1.2;
    $scope.data.mindepth = $scope.data.depthValue - 0.8;
      var $slider = $("#depthSlider");
  $slider.slider("values", 0, $scope.data.mindepth);
  $slider.slider("values", 1, $scope.data.maxdepth);
  };

    $scope.data = {
        showDepth: true,
        showWeight: true,
        showIx: true,
        maxdepth: 46,
        mindepth: 0,
        showDepthSlider: "true",
        // showDepthInput: "true",
        depthValue: function () {
            // $scope.data.maxdepth = $scope.data.depthValue + 0.2 * $scope.data.depthValue;
            // $scope.data.mindepth = $scope.data.depthValue - 0.2 * $scope.data.depthValue;
      
    
        }


    }



}

// PhoneListCtrl.$inject = ['$scope', '$http'];


function WDetailCtrl($scope, $routeParams, Phone) {


    $scope.phones = Phone.query(function (phones) {
        $scope.sectionProperties = [];


        var k;
        for (k = 0; k < phones.length; ++k) {
            if (phones[k].AISC_Manual_Label == $routeParams.phoneId) {
                $scope.phoneProperties = phones[k]

                //lots of nulls in the json file.  remove them.
                for (i in $scope.phoneProperties) {
                    if ($scope.phoneProperties[i] === null || $scope.phoneProperties[i] === undefined) {
                        delete $scope.phoneProperties[i];
                    }
                }
            }
        }



        var j = 0;
        for (var i in $scope.phoneProperties) if ($scope.phoneProperties.hasOwnProperty(i)) if ($scope.phoneProperties[i] != null) {

            $scope.sectionProperties[j] = i;
            j++;


        }


  $scope.propertyDefinitions = {
        A: "cross sectional area, in^2",
        AISC_Manual_Label: "the shape designation as seen in the AISC Steel Construction Manual, 14th Edition.  The exception to this is the designation for double angles. There is a separate listing (row) for each back-to-back spacing and configuration. Therefore, the shape designation reflects these two variables. The listings for double angles follow the convention specified in the AISC Naming Convention for Structural Steel Products for Use in Electronic Data Interchange (EDI), June 25, 2001.",
        Cw: "Warping constant, in.^6",
        Ix: "Moment of inertia about the x-axis, in.^4",
        Iy: "Moment of inertia about the y-axis, in.^4",
        J: 74.7,
        PA: "Shape perimeter minus one flange surface, as used in Design Guide 19, in.",
        PB: "Shape perimeter, as used in Design Guide 19, in.",
        Qf: 278,
        Qw: 805,
        Sw1: 1180,
        Sx: "Elastic section modulus about the x-axis, in.^3",
        Sy: 150,
        T_F: "F",
        Type: "the shape type, e.g., W, C, L, etc.",
        W: "Nominal weight, lb/ft",
        Wno: 168,
        Zx: "Plastic section modulus about the x-axis, in.^3",
        Zy: "Plastic section modulus about the y-axis, in.^3",
        bf: "Flange width, in.",
        "bf/2tf": "Slenderness ratio",
        bfdet: "Detailing value of flange width, in",
        d: "Overall depth of member, or width of shorter leg for angles, or width of the outstanding legs of long legs back-to-back double angles, or the width of the back-to-back legs of short legs back-to-back double angles, in.",
        ddet: "Detailing value of member depth, in.",
        "h/tw": "Slenderness ratio ",
        ho: "Distance between the flange centroids, in.",
        k1: "- Detailing distance from center of web to flange toe of fillet, in.",
        kdes: "Design distance from outer face of flange to web toe of fillet, in.",
        kdet: "Detailing distance from outer face of flange to web toe of fillet, in.",
        rts: 4.24,
        rx: "Radius of gyration about the x-axis, in.",
        ry: 3.49,
        tf: 1.77,
        tfdet: "1  3/4 ",
        tw: 1.03,
        twdet: "1      ",
        "twdet/2": "  1/2 ",

        };

    var k = 0;
    $scope.master = [];
    for (var i in $scope.phoneProperties) if ($scope.phoneProperties.hasOwnProperty(i)) {
      var what
      what = {
        name : i,
        value: $scope.phoneProperties[i],
        description: $scope.propertyDefinitions[i]
      }
      $scope.master.push(what)
      


    }

// http://stackoverflow.com/questions/979256/how-to-sort-an-array-of-javascript-objects
        $scope.sortedIx = ($scope.phones.sort(function(a,b) { return parseFloat(a.Ix) - parseFloat(b.Ix) } ))
        // extract ix from each phone array to determine index in which it occurs

for (var i in $scope.sorted) if ($scope.phoneProperties.hasOwnProperty(i)) {


}

        // console.log($.inArray($scope.phoneProperties.Ix,$scope.sortedIx))
        // console.log($scope.sortedIx)

        // console.log($scope.phoneProperties.Ix)


        // console.log($scope.phoneProperties)
        // console.log($scope.sectionProperties)
        // console.log($scope.master)

    })

}

//PhoneDetailCtrl.$inject = ['$scope', '$routeParams', '$http'];