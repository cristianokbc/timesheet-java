(function () {
    "use strict";

    var controller = ["$element", "$scope", "$timeout", function ($element, $scope, $timeout) {
        $scope.showSearchBox = function ($event) {
            if ($event) {
                $event.preventDefault();
            }

            $scope.searching = true;

            $timeout(function () {
                $element.find("input")[0].focus();
            });
        };

        $scope.hideSearchBox = function ($event) {
            if ($event) {
                $event.preventDefault();
            }

            $scope.searching = false;
        };

        $scope.handleBlur = function() {
            if (!$scope.model) {
                $scope.hideSearchBox();
            }
        };

        $scope.handleKeyDown = function ($event) {
            if ($event.keyCode === 27) {
                $scope.hideSearchBox();
            }
        };
    }];

    angular.module("angular-search-box", []).directive("searchBox", function () {
        return {
            controller: controller,
            scope: {
                label: "@",
                model: "=",
                searching: "="
            },
            templateUrl: "../html/angular-search-box.html"
        };
    });
})();