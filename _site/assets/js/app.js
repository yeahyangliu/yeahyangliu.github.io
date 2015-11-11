$(function () {
    $("#sidebar").addClass("img-" + Math.round((Math.random() * 2 + 1)));

    if (window.location.href == "http://yeahyangliu.github.io/") {
        $("#sidebar").css({width: '100%'});
        $("#btnblog").click(function () {
            $("#sidebar").animate({width: '33.3333%'}, 'slow');
        });
    }

    $('#article_body a').attr("target", "_blank");
});
