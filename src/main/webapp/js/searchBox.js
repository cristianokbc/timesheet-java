angular.module("timesheetModule").directive("searchBox", function(){
    var contro = function($scope, $element, $timeout) {
        $scope.showSearch = function () {
            $scope.searching = true;

            $scope.onSearch();

            // Propaga em direção à raiz
            $scope.$emit("searchStarted", {
                message: "Search started"
            })

            // Propaga em direção às folhas

            console.log($element);
            $timeout(function(){
                $element.find("input")[0].focus();
            }, 300)
        };
        $scope.hideSearch = function () {
            $scope.searching = false;
        }


    }

    return {
        templateUrl: "html/searchBox.html",
        scope: {
            label: "@", //recebendo um literal como atributo da diretiva
            searchText:"=", //
            searching: "=", // recebendo um objeto como atributo da diretiva
            onSearch: "&" // recebendo uma funcao como atributo da diretiva
        },
        controller: contro
    }
})