/**
 * Created by deinf.crk on 19/11/2015.
 */
angular.module("timesheetModule")
    .controller("rootController", function($scope, halClient, apiClient) {
        apiClient.$get("").then(function(resource) {
            console.log(resource);
            $scope.resource = resource;
        })
    })