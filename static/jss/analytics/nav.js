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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhbmFseXRpY3MvbmF2LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiQuYWpheCh7XG4gICAgdXJsOiBcIi9hbmFseXRpY3MvY2hhaW4tc3RvcmUtbmF2LWluaXRcIixcbiAgICB0eXBlOiBcIkdFVFwiLFxuICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIGlmKGRhdGEuc3VjY2VzcyA9PT0gMSl7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEuZGF0YS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICQoXCIjc2lkZWJhclwiKS5hcHBlbmQoXCI8ZGl2PlxcXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9J3RpdGxlJz5cXFxuICAgICAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9J1wiICsgZGF0YS5kYXRhW2ldLmltZ19zcmMgKyBcIicgYWx0PScnIGRyYWdnYWJsZT0nZmFsc2UnPlxcXG4gICAgICAgICAgICAgICAgICAgICAgICA8YT5cIiArIGRhdGEuZGF0YVtpXS5uYW1lICsgXCI8L2E+XFxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz0nb3B0aW9ucyc+XFxcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XFxcbiAgICAgICAgICAgICAgICA8L2Rpdj5cIik7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBkYXRhLmRhdGFbaV0ucGFnZXMubGVuZ3RoOyBqKyspe1xuICAgICAgICAgICAgICAgICAgICAkKFwiLm9wdGlvbnM6ZXEoXCIgKyBpICtcIilcIikuYXBwZW5kKFwiPGEgaHJlZj0nXCIgKyBkYXRhLmRhdGFbaV0ucGFnZXNbal0uaHJlZiArIFwiJyB2YWx1ZT0nXCIgKyBkYXRhLmRhdGFbaV0ucGFnZXNbal0udmFsdWUgKyBcIic+XCIgKyBkYXRhLmRhdGFbaV0ucGFnZXNbal0ubmFtZSArIFwiPC9hPlwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJChcImFbdmFsdWU9J1wiICsgd2luZG93LnBhZ2UgK1wiJ11cIikuYWRkQ2xhc3MoXCJzaWRlYmFyLWNvbG9yXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSk7XG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgJChcImFcIikuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgZ2EoJ3NlbmQnLCB7XG4gICAgICAgICAgICBoaXRUeXBlOiAnZXZlbnQnLFxuICAgICAgICAgICAgZXZlbnRDYXRlZ29yeTogJ3BhZ2UnLFxuICAgICAgICAgICAgZXZlbnRBY3Rpb246ICdqdW1waW5nJyxcbiAgICAgICAgICAgIGV2ZW50TGFiZWw6ICQodGhpcykuYXR0cihcInZhbHVlXCIpXG4gICAgICAgIH0pO1xuICAgIH0pO1xufSk7XG4iXSwiZmlsZSI6ImFuYWx5dGljcy9uYXYuanMifQ==
