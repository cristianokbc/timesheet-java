angular.module("timesheetModule").directive("hateoasA", function(){
    return {
        templateUrl: "html/hateoasA.html",
        scope: {
            resA:"=", //um objeto... no html: res-a
            rel:"@" //uma constante
        },
        transclude: true //recebe codigo como parametro
    }
})