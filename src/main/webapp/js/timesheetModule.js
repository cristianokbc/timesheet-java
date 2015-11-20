angular.module("timesheetModule", ["angular-hal", "ngRoute", "sticky", "ui.utils.masks", "ngAnimate"])
angular.module("timesheetModule")
    .config(function ($routeProvider) {
        var res = {
            rec_time: function ($http, $location, apiClient) {
                return apiClient.$get($location.url());
            }
        };
        $routeProvider
            .when("/", {
                template: ""
            })
            .when("/timesheet", {
                reloadOnSearch: false,
                resolve: res,
                templateUrl: "html/timesheet.html",
                controller: "timesheetController"
            })
            .when("/search/form", {
                reloadOnSearch: false,
                //resolve: res,
                templateUrl: "html/searchForm.html"
                //controller: "timesheetController"
            })
            .otherwise({
                redirectTo: "/timesheet"
            })
    })
