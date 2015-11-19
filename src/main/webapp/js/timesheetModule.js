(function() {
var module = angular.module("timesheetModule", ["angular-hal", "ngRoute", "ui.utils.masks"]);

    module.filter("hateoasHref", function(){
       return function(href){
           if(href){
               href = URI(href).resource();
               var index = href.indexOf("/",1);
               href = href.substring(index);
               console.log(href);
               return "#" + href;
           }
           else
           return null;

       };
    });

    module.config(function ($routeProvider) {
        var res =  {
            rec_time: function($http, $location, halClient){
              /*  return $http({
                    method:"GET",
                    url: "/api" + $location.url()
                });

                */

                return halClient.$get("/api" + $location.url());
            }
        };
        $routeProvider.when("/timesheets/:start", {
            resolve: res,
            controller: function($http, $location,  $scope, rec_time){

                $scope.handleSearch = function(param) {
                    console.log("oooooooooooooooe" + param);
                }


                $scope.filterProjectRow = function(projectRow){
                    if($scope.filterProj && $scope.projectName){
                        return projectRow.project.toLowerCase().indexOf($scope.projectName) >= 0;
                    } else {
                        return true;
                    }
                }
                $scope.filterTaskRow = function(taskRow){
                    if($scope.filterTask && $scope.taskName){
                        return taskRow.task.toLowerCase().indexOf($scope.taskName) >= 0;
                    } else {
                        return true;
                    }
                }


                console.log(rec_time);
                $scope.rec_time = rec_time;// .data;

                $scope.saveEntry = function($event, projectRow, taskRow, entryCell){
                    console.log(arguments);

                    if($event.keyCode == 13){
                        console.log('enter');
                        var timesheet = {
                            projectRows:[{
                                id:projectRow.id,
                                taskRows: [{
                                    id: taskRow.id,
                                    entryCells : [{
                                        column: entryCell.column,
                                        time: entryCell.time
                                    }]
                                }]
                            }]
                        };

                        console.log(timesheet);
                      /*  $http({
                            method:"PATCH",
                            url: $scope.rec_time._links.save.href,
                            data: timesheet
                        });
                        */
                        resource.$patch("save", null, timesheet);// segundo argumento sao os parametros
                    }
                };

            },
            templateUrl:"html/timesheet.html"
        })

        .otherwise({
            redirectTo:"/timesheets/today"
        })
    })
})();





