angular.module("timesheetModule", ["angular-hal", "ngRoute", "sticky", "ui.utils.masks", "ngAnimate"])
angular.module("timesheetModule")
    .config(function ($routeProvider) {
        var res = {
            rec_time: function ($http, $location, halClient) {
                return halClient.$get("/api" + $location.url());
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
            .otherwise({
                redirectTo: "/timesheet"
            })
    })
