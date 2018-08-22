$.ajax({
    url: "/analytics/chain-store-nav-init",
    type: "GET",
    success: function (data) {
        if(data.success === 1){
            for (var i = 0; i < data.data.length; i++) {
                $("#sidebar").append("<div>\
                    <div class='title'>\
                        <img src='" + data.data[i].img_src + "' alt='' draggable='false'>\
                        <a>" + data.data[i].name + "</a>\
                    </div>\
                    <div class='options'>\
                    </div>\
                </div>");
                for (var j = 0; j < data.data[i].pages.length; j++){
                    $(".options:eq(" + i +")").append("<a href='" + data.data[i].pages[j].href + "' value='" + data.data[i].pages[j].value + "'>" + data.data[i].pages[j].name + "</a>");
                }
                $("a[value='" + window.page +"']").addClass("sidebar-color");
            }
        }
    }
});

$(document).ready(function(){
    $("a").click(function(){
        ga('send', {
            hitType: 'event',
            eventCategory: 'page',
            eventAction: 'jumping',
            eventLabel: $(this).attr("value")
        });
    });
});
