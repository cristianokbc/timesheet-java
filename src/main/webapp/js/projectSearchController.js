angular.module("timesheetModule").controller("projectSearchController", function ($route, $location, $scope, resource, apiClient) {

    $scope.resource = resource;

    $scope.search = function() {

        // Solucao 1
        $scope.resource.options.t = new Date().getTime()
        $scope.resource.options.page = 0;
        $location.search($scope.resource.options);

        // Solucao 2 - alternativa
        //$location.search($scope.resource.options);
        //$route.reload();
    }

    function getResults() {
        var search = $location.search();
        $scope.resource.options.name = search.name;
        $scope.resource.options.description = search.description;
        $scope.resource.options.tasks = search.tasks;

        if (search.page !== undefined) {
            console.log("Gettings results");
            $scope.resource.$get("otherResults", search).then(function(resultResource) {
                console.log(resultResource);
            })
        }
    }

    function setResource(resource) {
        $scope.resource = resource;

        $scope.resource.$get("tasks")
            .then(function(tasks) {
                $scope.tasks = tasks;
            });

        getResults();
    }

    setResource(resource);

    $scope.$on("$routeUpdate", getResults);

})