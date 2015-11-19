angular.module("timesheetModule").filter("hateoasHref", function () {
    return function (href) {
        if (href) {
            href = URI(href).resource();
            var index = href.indexOf("/", 1);
            href = href.substring(index);
            console.log(href);
            return "#" + href;
        }
        else
            return null;
    };
});
