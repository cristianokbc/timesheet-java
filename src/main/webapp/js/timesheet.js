(function () {
    "use strict"

    angular.module("timesheet", ["angular-hal", "angular-loading-bar", "angular-search-box", "chart.js", "LocalStorageModule", "ngRoute", "sticky", "ui.utils.masks"])

    angular.module("timesheet").controller("rootController", ["$http", "$scope", "halClient", function ($http, $scope, halClient) {
        halClient.$get("/api").then(function (resource) {
            $scope.resource = resource
        })
    }])

    angular.module("timesheet").controller("projectSearchOptionsFormController", ["$scope", "resource", function ($scope, resource) {
        $scope.filterTasks = function (task) {
            if ($scope.filteringTasks && $scope.taskNameSubstring) {
                return task.name.toLowerCase().indexOf($scope.taskNameSubstring.toLowerCase()) >= 0
            }
            return true
        }

        $scope.resource = resource

        resource.$get("tasks").then(function (tasks) {
            $scope.tasks = tasks
        })
    }])

    angular.module("timesheet").controller("projectSearchResultController", ["$location", "$scope", "resource", function ($location, $scope, resource) {
        $scope.getLinkClass = function (rel) {
            if (new URI($location.url().substring(1)).equals($scope.resource.$href(rel))) {
                return "active"
            } else {
                return null
            }
        }

        $scope.resource = resource

        $scope.rels = []
        var index = 1
        var rel = index.toString()
        while (resource.$has(rel)) {
            $scope.rels.push(rel)
            ++index
            rel = index.toString()
        }

        resource.$get("projects").then(function (projects) {
            $scope.projects = projects
        })
    }])

    angular.module("timesheet").controller("projectFormController", ["$location", "$routeParams", "$scope", "alertService", "resource", function ($location, $routeParams, $scope, alertService, resource) {
        $scope.hasTask = function (task) {
            return hasTaskUri(task.$href("self"))
        }

        function hasTaskUri(taskUri) {
            return $scope.project && _.contains($scope.project.tasks, taskUri)
        }

        $scope.toggleTask = function (task) {
            var taskUri = task.$href("self")
            if (hasTaskUri(taskUri)) {
                _.pull($scope.project.tasks, taskUri)
            } else {
                $scope.project.tasks.push(taskUri)
            }
        }

        $scope.filterTasks = function (task) {
            if ($scope.filteringTasks && $scope.taskNameSubstring) {
                return task.name.toLowerCase().indexOf($scope.taskNameSubstring.toLowerCase()) >= 0
            }
            return true
        }

        $scope.save = function () {
            var request
            if ($routeParams.id === "new") {
                request = $scope.resource.$post
            } else {
                request = $scope.resource.$put
            }
            request("save", null, $scope.project).then(function () {
                alertService.addAlert({
                    type: alertService.SUCCESS,
                    message: "Project successfully saved"
                })
            })
        }

        $scope.delete = function () {
            console.log($scope.originalProject.$href("self"))
            $scope.originalProject.$del("self").then(function () {
                alertService.addAlert({
                    type: alertService.SUCCESS,
                    message: "Project successfully deleted"
                })
            })
        }

        $scope.resource = resource

        resource.$get("project").then(function (project) {
            function toDate(milliseconds) {
                if (milliseconds === null) {
                    return null
                } else {
                    return moment.utc(milliseconds).toDate()
                }
            }

            $scope.originalProject = project
            $scope.project = _.clone(project)
            $scope.project.startDate = toDate($scope.project.startDate)
            $scope.project.endDate = toDate($scope.project.endDate)
        })

        resource.$get("tasks").then(function (tasks) {
            $scope.tasks = tasks
        })
    }])

    angular.module("timesheet").controller("timesheetController", ["$scope", "localStorageService", "resource", function ($scope, localStorageService, resource) {
        $scope.saveEntryCell = function ($event, projectRow, taskRow, entryCell) {
            if ($event.keyCode == 13) {
                $scope.resource.$patch("self", null, {
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
                }).then(function () {
                    $event.target.blur()
                    $scope.updateChart()
                })
            }
        }

        $scope.togglePinning = function ($event) {
            $event.preventDefault()

            $scope.pinning = !$scope.pinning
        }

        function getRowState(key) {
            var state = localStorageService.get(key)
            if (!state) {
                state = {
                    visible: true
                }
                localStorageService.set(key, state)
            }
            return state
        }

        function setRowState(key, state) {
            localStorageService.set(key, state)
        }

        function toggleRowVisibility($event, key) {
            $event.preventDefault()

            var state = getRowState(key)
            state.visible = !state.visible
            setRowState(key, state)
        }

        function getProjectRowKey(projectRow) {
            return JSON.stringify(projectRow.id)
        }

        $scope.getProjectRowState = function (projectRow) {
            return getRowState(getProjectRowKey(projectRow))
        }

        $scope.toggleProjectRowVisibility = function ($event, projectRow) {
            toggleRowVisibility($event, getProjectRowKey(projectRow))
        }

        function getTaskRowKey(projectRow, taskRow) {
            return JSON.stringify([projectRow.id, taskRow.id])
        }

        $scope.getTaskRowState = function (projectRow, taskRow) {
            return getRowState(getTaskRowKey(projectRow, taskRow))
        }

        $scope.toggleTaskRowVisibility = function ($event, projectRow, taskRow) {
            toggleRowVisibility($event, getTaskRowKey(projectRow, taskRow))
        }

        $scope.filterProjectRow = function (projectRow) {
            if ($scope.pinning || $scope.getProjectRowState(projectRow).visible) {
                if ($scope.filteringProjectRow && $scope.projectNameSubstring) {
                    return projectRow.project.toLowerCase().indexOf($scope.projectNameSubstring.toLowerCase()) >= 0
                } else {
                    return true
                }
            } else {
                return false
            }
        }

        $scope.filterTaskRow = function (projectRow) {
            return function (taskRow) {
                if ($scope.pinning || $scope.getTaskRowState(projectRow, taskRow).visible) {
                    if ($scope.filteringTaskRow && $scope.taskNameSubstring) {
                        return taskRow.task.toLowerCase().indexOf($scope.taskNameSubstring.toLowerCase()) >= 0
                    } else {
                        return true
                    }
                } else {
                    return false
                }
            }
        }

        $scope.toggleChartVisibility = function ($event) {
            $event.preventDefault()

            $scope.chart.visible = !$scope.chart.visible
        }

        $scope.updateChart = function () {
            $scope.chart.labels = _.map($scope.resource.projectRows, function (projectRow) {
                return projectRow.project
            })

            $scope.chart.data = []
            _.forEach($scope.resource.projectRows, function (projectRow) {
                var time = 0
                _.forEach(projectRow.taskRows, function (taskRow) {
                    _.forEach(taskRow.entryCells, function (entryCell) {
                        time += entryCell.time
                    })
                })
                $scope.chart.data.push(time)
            })
        }

        $scope.patchTimesheet = function (timesheet) {
            _.each(timesheet.projectRows, function (projectRow) {
                _.each(projectRow.taskRows, function (taskRow) {
                    _.each(taskRow.entryCells, function (entryCell) {
                        var date = moment.utc(timesheet.dates[0]).add(entryCell.column, "days").valueOf()
                        patchEntryCell(projectRow.id, taskRow.id, date, entryCell.time);
                    })
                })
            })

            function patchEntryCell(projectRowId, taskRowId, date, time) {
                _.each($scope.resource.projectRows, function (projectRow) {
                    if (projectRow.id === projectRowId) {
                        _.each(projectRow.taskRows, function (taskRow) {
                            if (taskRow.id === taskRowId) {
                                _.each($scope.resource.dates, function (d, index) {
                                    if (d === date) {
                                        taskRow.entryCells[index].time = time
                                        $scope.updateChart()
                                    }
                                })
                            }
                        })
                    }
                })
            }
        }

        $scope.resource = resource

        $scope.chart = {}
        $scope.updateChart()

        var broker = Stomp.over(new SockJS("/stomp"))
        broker.debug = function (message) {
//            console.log(message)
        }

        broker.connect({}, function () {
            broker.subscribe("/topic/timesheet/patch", function (content) {
//          broker.subscribe("/user/queue/timesheet/patch", function(content) {
                $scope.$apply(function () {
                    $scope.patchTimesheet(JSON.parse(content.body));
                })
            })
        })
    }])

    angular.module("timesheet").factory("interceptors", ["$locale", "alertService", "authenticationService", "errorService", function ($locale, alertService, authenticationService, errorService) {
        return {
            request: function (request) {
                alertService.clearAlerts()
                errorService.clearErrors()
                if (!request.headers["Accept-Language"]) {
                    var id = $locale.id
                    var index = id.indexOf("-")
                    if (index < 0) {
                        request.headers["Accept-Language"] = id
                    } else {
                        request.headers["Accept-Language"] = id.substring(0, index) + "-" + id.substring(index + 1).toUpperCase()
                    }
                }
                return request
            },

            responseError: function (response) {
                if (response.status == 401) {
                    if (!response.config.bypassAuthenticationInterceptor) {
                        return authenticationService.$http(response.config)
                    } else {
                        return response;
                    }
                } else {
                    if (response.data) {
                        errorService.setErrors(response.data)
                        _.each(response.data.globalErrors, function (error) {
                            alertService.addAlert({
                                type: alertService.DANGER,
                                message: error.message
                            })
                        })
                    } else {
                        alertService.addAlert({
                            type: alertService.DANGER,
                            message: "An unknown error has occurred"
                        })
                    }
                    return response
                }
            }
        }
    }])

    angular.module("timesheet").config(["$httpProvider", "$routeProvider", "cfpLoadingBarProvider", function ($httpProvider, $routeProvider, cfpLoadingBarProvider) {
        $httpProvider.interceptors.push("interceptors");

        var resolve = {
            resource: ["$location", "halClient", function ($location, halClient) {
                return halClient.$get($location.url().substring(1))
            }]
        }

        $routeProvider
            .when("/", {})
            .when("/" + document.location.origin + "/api/projects/search/options/form", {
                controller: "projectSearchOptionsFormController",
                resolve: resolve,
                templateUrl: "html/project/searchOptionsForm.html"
            })
            .when("/" + document.location.origin + "/api/projects/search/result", {
                controller: "projectSearchResultController",
                resolve: resolve,
                templateUrl: "html/project/searchResult.html"
            })
            .when("/" + document.location.origin + "/api/projects/:id/form", {
                controller: "projectFormController",
                resolve: resolve,
                templateUrl: "html/project/form.html"
            })
            .when("/" + document.location.origin + "/api/timesheets/:start", {
                controller: "timesheetController",
                resolve: resolve,
                templateUrl: "html/timesheet.html"
            })
            .when("/notFound", {
                templateUrl: "html/notFound.html"
            })
            .otherwise({
                redirectTo: "/notFound"
            })

        cfpLoadingBarProvider.includeSpinner = false
    }])
})()