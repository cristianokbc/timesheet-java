/*
Remove ao prefixo /api de uma URL, mantendo-a compatível com o padrão que escolhemos dos links HATEOAS serem iguais
às rotas do Angular mas sem esse prefixo.
 */

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
