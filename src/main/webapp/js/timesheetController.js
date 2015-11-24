angular.module("timesheetModule").controller("timesheetController", function ($http, $location, $scope, resource, apiClient) {

    var labels = ["Download Sales", "In-Store Sales", "Mail-Order Sales"];
    var data = [300, 500, 100];

    $scope.getLabels = function() {
        labels.length = 0;
        _.each($scope.resource.projectRows, function(projectRow) {
            labels.push(projectRow.project);
        });
        return labels;
    }

    $scope.getData = function() {
        data.length = 0;
        _.each($scope.resource.projectRows, function(projectRow) {
            var total = 0;
            _.each(projectRow.taskRows, function(taskRow) {
                _.each(taskRow.entryCells, function(entryCell) {
                    if (entryCell.time) {
                        total += entryCell.time;
                    }
                });
            });
            data.push(total);
        });
        return data;
    }

    $scope.$on("$routeUpdate", function () {
        apiClient.$get($location.url())
            .then(function (resource) {
                $scope.resource = resource;
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


    //console.log(resource);
    $scope.resource = resource;// .data;

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

    var broker = Stomp.over(new SockJS("/stomp"));
    broker.debug = function(message) {
    };

    broker.connect({}, function() {
        console.log("Connected!!");
        broker.subscribe("/topic/timesheet/patch", function(message) {
            var timesheet = JSON.parse(message.body);
            //console.log(timesheet);
            $scope.$apply(function() {
                $scope.resource.projectRows[0].taskRows[0].entryCells[0].time = timesheet.projectRows[0].taskRows[0].entryCells[0].time;
            });
        })
    })
})
