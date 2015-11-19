angular.module("timesheetModule").controller("timesheetController", function ($http, $location, $scope, rec_time, halClient) {

    $scope.$on("$routeUpdate", function () {
        halClient.$get("/api" + $location.url())
            .then(function (resource) {
                $scope.rec_time = resource;
            })
    })

    $scope.$on("searchStarted", function () {
        console.log(arguments)
    })

    $scope.handleSearch = function (param) {
        console.log("oooooooooooooooe" + param);
    }


    $scope.filterProjectRow = function (projectRow) {
        if ($scope.filterProj && $scope.projectName) {
            return projectRow.project.toLowerCase().indexOf($scope.projectName) >= 0;
        } else {
            return true;
        }
    }
    $scope.filterTaskRow = function (taskRow) {
        if ($scope.filterTask && $scope.taskName) {
            return taskRow.task.toLowerCase().indexOf($scope.taskName) >= 0;
        } else {
            return true;
        }
    }


    console.log(rec_time);
    $scope.rec_time = rec_time;// .data;

    $scope.saveEntry = function ($event, projectRow, taskRow, entryCell) {
        console.log(arguments);

        if ($event.keyCode == 13) {
            console.log('enter');
            var timesheet = {
                projectRows: [{
                    id: projectRow.id,
                    taskRows: [{
                        id: taskRow.id,
                        entryCells: [{
                            column: entryCell.column,
                            time: entryCell.time
                        }]
                    }]
                }]
            };

            console.log(timesheet);
            resource.$patch("save", null, timesheet);// segundo argumento sao os parametros
        }
    };

})
