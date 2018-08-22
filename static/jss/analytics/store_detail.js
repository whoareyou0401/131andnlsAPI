function fillData(action) {
    var termRange, arg, selectedChart, sort, order, name;
    // var store_id = window.location.href.split("/")[window.location.href.split("/").length-1];
    var store_id = window.store_id;
    switch (action) {
        case "storedetail-base":
            termRange = $(".basic-indexes-module .date .date-choiced").attr("value");
            $.ajax({
                url: "/analytics/chain-store",
                data: {"action": action, "term_range": termRange, "store_id": store_id},
                type: "GET",
                success: function (data) {
                    if (data.success == 1) {
                        $(".hierarchy span:eq(0)").text(data.data.name);
                        // $(".hierarchy span:eq(0)").text("xxxxx");

                        $(".total-items").children("li:eq(0)").find("p:eq(1)").text(data.data.target_sales);
                        $(".total-items").children("li:eq(1)").find("p:eq(1)").text(data.data.completeness);
                        $(".total-items").children("li:eq(2)").find("p:eq(1)").text(data.data.difference);
                        $(".total-items").children("li:eq(3)").find("p:eq(1)").text(data.data.turnover);
                        $(".basic-indexes-module .options-tab").children("li:eq(0)").find("span:eq(1)").text(data.data.sales);
                        $(".basic-indexes-module .options-tab").children("li:eq(1)").find("span:eq(1)").text(data.data.gross_profit);
                        $(".basic-indexes-module .options-tab").children("li:eq(2)").find("span:eq(1)").text(data.data.num_trades);
                        $(".basic-indexes-module .options-tab").children("li:eq(3)").find("span:eq(1)").text(data.data.unit_trade);
                        $(".basic-indexes-module .total-items .basic-list div:eq(0) p span:eq(0)").text(data.data.term);
                        $(".basic-indexes-module .total-items .basic-list div:eq(1) p span:eq(0)").text(data.data.term);
                        $(".basic-indexes-module .total-items .basic-list div:eq(2) p span:eq(0)").text(data.data.term);
                        $(".basic-indexes-module .total-items .basic-list div:eq(0) p span:eq(1)").text(data.data.term_on_term_target_sales);
                        $(".basic-indexes-module .total-items .basic-list div:eq(1) p span:eq(1)").text(data.data.term_on_term_completeness);
                        $(".basic-indexes-module .total-items .basic-list div:eq(2) p span:eq(1)").text(data.data.term_on_term_difference);
                    } else {
                        location.href = "/logout";
                    }
                }
            });
            break;
        case "storedetail-chart":
            termRange = $(".basic-indexes-module .date .date-choiced").attr("value");
            selectedChart = $(".basic-indexes-module .graph-color").attr("value");
            $.ajax({
                url: "/analytics/chain-store",
                data: {
                    "action": action, "term_range": termRange, "arg": selectedChart, "store_id": store_id
                },
                type: "GET",
                success: function (data) {
                    if (data.success == 1) {
                        var option = {
                            tooltip: {
                                show: true,
                                trigger: 'axis',
                                padding: 10,
                                textStyle: {
                                    fontFamily: 'PingFangSC-Regular',
                                }
                            },
                            legend: {
                                right: "10%",
                                data: [{
                                        name: data.data.name,
                                        textStyle: {
                                            color: "#ff5422",
                                        }
                                    },
                                    {
                                        name: data.data.term_on_term_name,
                                        textStyle: {
                                            color: "#9160ff"
                                        }
                                    }
                                ]
                            },
                            grid: {
                                left: "3%",
                                right: "4%",
                                bottom: "3%",
                                containLabel: true
                            },
                            xAxis: {
                                type: "category",
                                boundaryGap: false,
                                data: data.data.x_indices,
                                axisLabel: {
                                    show: true,
                                    textStyle: {
                                        fontFamily: 'PingFangSC-Regular',
                                        color: '#2a2a2a',
                                        fontSize: 12
                                    }
                                },
                                axisLine: {
                                    lineStyle: {
                                        color: '#ccc',
                                    }
                                },
                            },
                            yAxis: {
                                type: 'value',
                                axisLine: {show: false},
                                axisLabel: {
                                    show: true,
                                    textStyle: {
                                        fontFamily: 'PingFangSC-Regular',
                                        fontSize: 12
                                    }
                                },
                            },
                            series: [
                                {
                                    name: data.data.name,
                                    type: 'line',
                                    stack: '总量',
                                    lineStyle:{
                                        normal:{
                                            color: "#ff5422",
                                            shadowColor: "#ff5422",
                                            shadowBlur: 60,
                                            shadowOffsetY: 20
                                        }
                                    },
                                    data: data.data.data
                                },
                                {
                                    name: data.data.term_on_term_name,
                                    type: 'line',
                                    stack: '总量1',
                                    lineStyle:{
                                        normal:{
                                            color: "#9160ff",
                                            shadowColor: "#9160ff",
                                            shadowBlur: 60,
                                            shadowOffsetY: 20
                                        }
                                    },
                                    data: data.data.term_on_term_data
                                },
                            ],
                            color: ['#ff5422', '#9160ff']
                        };
                        fillChart('main', option);
                        $(".curve-total p:eq(0)").text(data.data.term_on_term_tip);
                        $(".curve-total p:eq(1) span:eq(0)").text(data.data.avg_tip);
                        $(".curve-total p:eq(1) span:eq(1)").text(data.data.avg);
                    }
                }
            });
            break;
        case "storedetail-item":
            termRange = $(".table-module .date .date-choiced").attr("value");
            sort = $(".table-module .options-tab .graph-color").attr("value");
            order = $(".table-module .options-tab .graph-color").attr("order");
            $.ajax({
                url: "/analytics/chain-store",
                data: {"action": action, "term_range": termRange, "sort": sort, "order": order, "store_id":store_id},
                type: "GET",
                dataType: "json",
                success: function (data) {
                    if (data.success == 1) {
                        var newRow = "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
                        $("table tbody tr").remove();

                        for (var i = 0; i < data.data.length; i++) {
                            $("table tbody").append(newRow);
                            ii = i + 1;
                            $("table tr:eq(" + ii + ")").attr("value", data.data[i].foreign_id);
                            $("table tr:eq(" + ii + ") td:eq(0)").text(ii);
                            for (var key in data.data[i]) {
                                index = $("table thead th[value='" + key +"']").index();
                                if (index !== -1){
                                    $("table tr:eq(" + ii + ") td:eq(" + index + ")").text(data.data[i][key]);
                                }
                            }
                        }

                        $('input:checkbox:not(:checked)').each(function(){
                            hideTableCol($("table"), $(this).attr("value"));
                        });
                        $('input:checkbox:checked').each(function(){
                            showTableCol($("table"), $(this).attr("value"));
                        });
                    }
                }
            });
            break;
        case "storedetail-category":
            termRange = $(".circle-graph-module .date .date-choiced").attr("value");
            arg = $(".circle-graph-module .options-tab .graph-color").attr("value");
            name = $(".circle-graph-module .options-tab .graph-color span").text();
            $.ajax({
                url: "/analytics/chain-store",
                data: {"action": action, "term_range": termRange, "arg": arg, "store_id":store_id},
                type: "GET",
                success: function (data) {
                    if (data.success == 1) {
                        var option = {
                        tooltip: {
                            show: true,
                            padding: 10,
                            trigger: 'item',
                            formatter: "{a} <br/>{b}: {c} ({d}%)"
                        },
                        legend: {
                            orient: 'vertical',
                            x: 'left',
                            height: '250',
                            left: '20',
                            top: '15',
                            data:data.data.categories,
                            textStyle: {
                                fontFamily: 'PingFangSC-Regular',
                            }
                        },
                        series: [
                            {
                                name: name,
                                type:'pie',
                                radius: ['50%', '70%'],
                                avoidLabelOverlap: false,
                                center : ['65%', '50%'],
                                label: {
                                    normal: {
                                        show: false,
                                        position: 'center',
                                        textStyle: {
                                            fontFamily: 'PingFangSC-Regular',
                                        }
                                    },
                                    emphasis: {
                                        show: true,
                                        textStyle: {
                                            fontSize: '20',
                                            fontWeight: 'bold'
                                        }
                                    }
                                },
                                labelLine: {
                                    normal: {
                                        show: false
                                    }
                                },
                                data: data.data.data
                                }
                            ],
                        color: data.data.palette

                        };
                        fillChart('circle_chart', option);
                    }
                }
            });
            break;
        case "storedetail-increases":
            termRange = $(".bar-chart-module .date .date-choiced").attr("value");
            arg = $(".bar-chart-module .options-tab .graph-color").attr("value");
            name = $(".bar-chart-module .options-tab .graph-color span").text();

            $.ajax({
                url: "/analytics/chain-store",
                data: {"action": action, "term_range": termRange, "arg": arg, "store_id":store_id},
                type: "GET",
                success: function (data) {
                    if (data.success == 1) {
                        option = {
                            tooltip : {
                                show: true,
                                padding: 10,
                                trigger: 'axis',
                                axisPointer : {
                                    type : 'shadow'
                                },
                                textStyle: {
                                    fontFamily: 'PingFangSC-Regular',
                                },
                                formatter: "{a} <br/>{b}: {c}%"

                            },
                            grid: {
                                show : true,
                                left : 70,
                                top : 20,
                                right : 70,
                                bottom : 40
                            },
                            calculable : true,
                            xAxis : [
                                {
                                    type : 'value',
                                    axisLabel: {
                                        show: true,
                                        textStyle: {
                                            fontFamily: 'PingFangSC-Regular',
                                            color: '#2a2a2a',
                                            fontSize: 12
                                        }
                                    },
                                    axisLine: {
                                        lineStyle: {
                                            color: '#ccc',
                                        }
                                    },
                                }
                            ],
                            yAxis : [
                                {
                                    type : 'category',
                                    axisTick : {show: false},
                                    data: data.data.categories,
                                    axisLabel: {
                                        show: true,
                                        textStyle: {
                                            fontFamily: 'PingFangSC-Regular',
                                            color: '#2a2a2a',
                                            fontSize: 12
                                        }
                                    },
                                    axisLine: {
                                        lineStyle: {
                                            color: '#ccc',
                                        }
                                    },
                                }
                            ],
                            series : [
                                {
                                    name: name,
                                    type:'bar',
                                    itemStyle : {
                                        normal: {
                                            label : {
                                                show: true,
                                                position: 'inside'
                                            },
                                            color: function(params) {
                                                var colorList;
                                                if (params.data.value >= 0) {
                                                    colorList = '#FF491F';
                                                } else {
                                                    colorList = '#53d199';
                                                }
                                                return colorList;
                                            },
                                        }
                                    },
                                    data: data.data.data
                                }
                            ]
                        };
                        fillChart('bar_chart', option);
                    }
                }
            });
            break;
    }
}

$(document).ready(function () {
    $("a[value='storedetail']").addClass("sidebar-color");
    fillData("storedetail-base");
    fillData("storedetail-chart");
    fillData("storedetail-item");
    fillData("storedetail-category");
    fillData("storedetail-increases");
    $(".date li").click(function () {
        if($(this).attr("value") == "8" && ($(this).parents(".bar-chart-module").find(".graph-color").attr("value") == "gross_profit" || $(this).parents(".bar-chart-module").find(".graph-color").attr("value") == "cross_ratio")){
            return false;
        }
        $(this).siblings(".date-choiced").removeClass();
        $(this).addClass("date-choiced");
        ga('send', {
            hitType: 'event',
            eventCategory: 'storedetail',
            eventAction: 'date',
            eventLabel: $(this).text()
        });
        var _left = $(this).scrollLeft();
        $('table th').eq(0).css('left', _left);
        $('table th').eq(1).css('left', _left).addClass('box-shadow');
        $('table td:nth-child(1)').css('left', _left);
        $('table td:nth-child(2)').css('left', _left).addClass('box-shadow');
        if (Number($(this).scrollLeft()) === 0) {
            $('table th').eq(1).removeClass('box-shadow');
            $('table td:nth-child(2)').removeClass('box-shadow');
        }
    });


    $(".options-tab li").click(function () {
        if(($(this).attr("value") == "gross_profit" || $(this).attr("value") == "cross_ratio") && $(this).parents(".bar-chart-module").find(".date .date-choiced").attr("value") == "8"){
            return false;
        }
        $(this).siblings(".graph-color").removeClass();
        $(this).addClass("graph-color");

    });

    $(".basic-indexes-module .date li,.basic-indexes-module .options-tab li").click(function () {
        fillData("storedetail-base");
        fillData("storedetail-chart");

    });

    $(".table-module .date li,.table-module .options-tab li").click(function(){
        fillData("storedetail-item");
        ga('send', {
            hitType: 'event',
            eventCategory: 'storedetail',
            eventAction: 'item',
        });
    });
    $(".add-image-special:eq(0)").click(function(){
        var op = $(".explain-box-special").attr("hidden") == "hidden" ? $(".explain-box-special").removeAttr("hidden") : $(".explain-box-special").attr("hidden", "hidden");
    });
    $(".add-image-special:eq(1)").click(function(){
        var op = $(".add-items-special").attr("hidden") == "hidden" ? $(".add-items-special").removeAttr("hidden") : $(".add-items-special").attr("hidden", "hidden");
    });
    $(".float-right input:eq(0), .float-right input:eq(1)").click(function(){
        $(".add-items-special").attr("hidden", "hidden");
    });
    $(".float-right input:eq(2)").click(function(){
        $(".add-items-special").attr("hidden", "hidden");

        $('input:checkbox:not(:checked)').each(function(){
            hideTableCol($("table"), $(this).attr("value"));
        });
        $('input:checkbox:checked').each(function(){
            showTableCol($("table"), $(this).attr("value"));
        });
        setTbaleWidth();
    });

    $(".circle-graph-module .date li,.circle-graph-module .options-tab li").click(function(){
        fillData("storedetail-category");
        ga('send', {
            hitType: 'event',
            eventCategory: 'storedetail',
            eventAction: 'category',
        });
    });
    $(".bar-chart-module .date li,.bar-chart-module .options-tab li").click(function(){
        fillData("storedetail-increases");
        ga('send', {
            hitType: 'event',
            eventCategory: 'storedetail',
            eventAction: 'increases',
        });
    });

    $(".table-module .download").click(function(){
        $("table").tableExport({
            headings: true,
            fileName: "items",
            formats: ["csv"],
            position: "bottom",
            ignoreCSS: "[style*='display: none']"
        });
        ga('send', {
            hitType: 'event',
            eventCategory: 'storedetail',
            eventAction: 'download',
        });
    });
    tableScrollFun();
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhbmFseXRpY3Mvc3RvcmVfZGV0YWlsLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIGZpbGxEYXRhKGFjdGlvbikge1xuICAgIHZhciB0ZXJtUmFuZ2UsIGFyZywgc2VsZWN0ZWRDaGFydCwgc29ydCwgb3JkZXIsIG5hbWU7XG4gICAgLy8gdmFyIHN0b3JlX2lkID0gd2luZG93LmxvY2F0aW9uLmhyZWYuc3BsaXQoXCIvXCIpW3dpbmRvdy5sb2NhdGlvbi5ocmVmLnNwbGl0KFwiL1wiKS5sZW5ndGgtMV07XG4gICAgdmFyIHN0b3JlX2lkID0gd2luZG93LnN0b3JlX2lkO1xuICAgIHN3aXRjaCAoYWN0aW9uKSB7XG4gICAgICAgIGNhc2UgXCJzdG9yZWRldGFpbC1iYXNlXCI6XG4gICAgICAgICAgICB0ZXJtUmFuZ2UgPSAkKFwiLmJhc2ljLWluZGV4ZXMtbW9kdWxlIC5kYXRlIC5kYXRlLWNob2ljZWRcIikuYXR0cihcInZhbHVlXCIpO1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB1cmw6IFwiL2FuYWx5dGljcy9jaGFpbi1zdG9yZVwiLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcImFjdGlvblwiOiBhY3Rpb24sIFwidGVybV9yYW5nZVwiOiB0ZXJtUmFuZ2UsIFwic3RvcmVfaWRcIjogc3RvcmVfaWR9LFxuICAgICAgICAgICAgICAgIHR5cGU6IFwiR0VUXCIsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2VzcyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKFwiLmhpZXJhcmNoeSBzcGFuOmVxKDApXCIpLnRleHQoZGF0YS5kYXRhLm5hbWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gJChcIi5oaWVyYXJjaHkgc3BhbjplcSgwKVwiKS50ZXh0KFwieHh4eHhcIik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICQoXCIudG90YWwtaXRlbXNcIikuY2hpbGRyZW4oXCJsaTplcSgwKVwiKS5maW5kKFwicDplcSgxKVwiKS50ZXh0KGRhdGEuZGF0YS50YXJnZXRfc2FsZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJChcIi50b3RhbC1pdGVtc1wiKS5jaGlsZHJlbihcImxpOmVxKDEpXCIpLmZpbmQoXCJwOmVxKDEpXCIpLnRleHQoZGF0YS5kYXRhLmNvbXBsZXRlbmVzcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKFwiLnRvdGFsLWl0ZW1zXCIpLmNoaWxkcmVuKFwibGk6ZXEoMilcIikuZmluZChcInA6ZXEoMSlcIikudGV4dChkYXRhLmRhdGEuZGlmZmVyZW5jZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKFwiLnRvdGFsLWl0ZW1zXCIpLmNoaWxkcmVuKFwibGk6ZXEoMylcIikuZmluZChcInA6ZXEoMSlcIikudGV4dChkYXRhLmRhdGEudHVybm92ZXIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJChcIi5iYXNpYy1pbmRleGVzLW1vZHVsZSAub3B0aW9ucy10YWJcIikuY2hpbGRyZW4oXCJsaTplcSgwKVwiKS5maW5kKFwic3BhbjplcSgxKVwiKS50ZXh0KGRhdGEuZGF0YS5zYWxlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKFwiLmJhc2ljLWluZGV4ZXMtbW9kdWxlIC5vcHRpb25zLXRhYlwiKS5jaGlsZHJlbihcImxpOmVxKDEpXCIpLmZpbmQoXCJzcGFuOmVxKDEpXCIpLnRleHQoZGF0YS5kYXRhLmdyb3NzX3Byb2ZpdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKFwiLmJhc2ljLWluZGV4ZXMtbW9kdWxlIC5vcHRpb25zLXRhYlwiKS5jaGlsZHJlbihcImxpOmVxKDIpXCIpLmZpbmQoXCJzcGFuOmVxKDEpXCIpLnRleHQoZGF0YS5kYXRhLm51bV90cmFkZXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJChcIi5iYXNpYy1pbmRleGVzLW1vZHVsZSAub3B0aW9ucy10YWJcIikuY2hpbGRyZW4oXCJsaTplcSgzKVwiKS5maW5kKFwic3BhbjplcSgxKVwiKS50ZXh0KGRhdGEuZGF0YS51bml0X3RyYWRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoXCIuYmFzaWMtaW5kZXhlcy1tb2R1bGUgLnRvdGFsLWl0ZW1zIC5iYXNpYy1saXN0IGRpdjplcSgwKSBwIHNwYW46ZXEoMClcIikudGV4dChkYXRhLmRhdGEudGVybSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKFwiLmJhc2ljLWluZGV4ZXMtbW9kdWxlIC50b3RhbC1pdGVtcyAuYmFzaWMtbGlzdCBkaXY6ZXEoMSkgcCBzcGFuOmVxKDApXCIpLnRleHQoZGF0YS5kYXRhLnRlcm0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgJChcIi5iYXNpYy1pbmRleGVzLW1vZHVsZSAudG90YWwtaXRlbXMgLmJhc2ljLWxpc3QgZGl2OmVxKDIpIHAgc3BhbjplcSgwKVwiKS50ZXh0KGRhdGEuZGF0YS50ZXJtKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoXCIuYmFzaWMtaW5kZXhlcy1tb2R1bGUgLnRvdGFsLWl0ZW1zIC5iYXNpYy1saXN0IGRpdjplcSgwKSBwIHNwYW46ZXEoMSlcIikudGV4dChkYXRhLmRhdGEudGVybV9vbl90ZXJtX3RhcmdldF9zYWxlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKFwiLmJhc2ljLWluZGV4ZXMtbW9kdWxlIC50b3RhbC1pdGVtcyAuYmFzaWMtbGlzdCBkaXY6ZXEoMSkgcCBzcGFuOmVxKDEpXCIpLnRleHQoZGF0YS5kYXRhLnRlcm1fb25fdGVybV9jb21wbGV0ZW5lc3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJChcIi5iYXNpYy1pbmRleGVzLW1vZHVsZSAudG90YWwtaXRlbXMgLmJhc2ljLWxpc3QgZGl2OmVxKDIpIHAgc3BhbjplcSgxKVwiKS50ZXh0KGRhdGEuZGF0YS50ZXJtX29uX3Rlcm1fZGlmZmVyZW5jZSk7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbi5ocmVmID0gXCIvbG9nb3V0XCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwic3RvcmVkZXRhaWwtY2hhcnRcIjpcbiAgICAgICAgICAgIHRlcm1SYW5nZSA9ICQoXCIuYmFzaWMtaW5kZXhlcy1tb2R1bGUgLmRhdGUgLmRhdGUtY2hvaWNlZFwiKS5hdHRyKFwidmFsdWVcIik7XG4gICAgICAgICAgICBzZWxlY3RlZENoYXJ0ID0gJChcIi5iYXNpYy1pbmRleGVzLW1vZHVsZSAuZ3JhcGgtY29sb3JcIikuYXR0cihcInZhbHVlXCIpO1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB1cmw6IFwiL2FuYWx5dGljcy9jaGFpbi1zdG9yZVwiLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgXCJhY3Rpb25cIjogYWN0aW9uLCBcInRlcm1fcmFuZ2VcIjogdGVybVJhbmdlLCBcImFyZ1wiOiBzZWxlY3RlZENoYXJ0LCBcInN0b3JlX2lkXCI6IHN0b3JlX2lkXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0eXBlOiBcIkdFVFwiLFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN1Y2Nlc3MgPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9wdGlvbiA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0b29sdGlwOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3c6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyaWdnZXI6ICdheGlzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogMTAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRTdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogJ1BpbmdGYW5nU0MtUmVndWxhcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZ2VuZDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByaWdodDogXCIxMCVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogW3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBkYXRhLmRhdGEubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IFwiI2ZmNTQyMlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZGF0YS5kYXRhLnRlcm1fb25fdGVybV9uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRTdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogXCIjOTE2MGZmXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdyaWQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGVmdDogXCIzJVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByaWdodDogXCI0JVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3R0b206IFwiMyVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbkxhYmVsOiB0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4QXhpczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImNhdGVnb3J5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvdW5kYXJ5R2FwOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YS5kYXRhLnhfaW5kaWNlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXhpc0xhYmVsOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogJ1BpbmdGYW5nU0MtUmVndWxhcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjMmEyYTJhJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXhpc0xpbmU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVTdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnI2NjYycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5QXhpczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAndmFsdWUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBheGlzTGluZToge3Nob3c6IGZhbHNlfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXhpc0xhYmVsOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogJ1BpbmdGYW5nU0MtUmVndWxhcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDEyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJpZXM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZGF0YS5kYXRhLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbGluZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFjazogJ+aAu+mHjycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lU3R5bGU6e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vcm1hbDp7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBcIiNmZjU0MjJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hhZG93Q29sb3I6IFwiI2ZmNTQyMlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGFkb3dCbHVyOiA2MCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hhZG93T2Zmc2V0WTogMjBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YS5kYXRhLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZGF0YS5kYXRhLnRlcm1fb25fdGVybV9uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2xpbmUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2s6ICfmgLvph48xJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVTdHlsZTp7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9ybWFsOntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IFwiIzkxNjBmZlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGFkb3dDb2xvcjogXCIjOTE2MGZmXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoYWRvd0JsdXI6IDYwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGFkb3dPZmZzZXRZOiAyMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLmRhdGEudGVybV9vbl90ZXJtX2RhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBbJyNmZjU0MjInLCAnIzkxNjBmZiddXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbENoYXJ0KCdtYWluJywgb3B0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoXCIuY3VydmUtdG90YWwgcDplcSgwKVwiKS50ZXh0KGRhdGEuZGF0YS50ZXJtX29uX3Rlcm1fdGlwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoXCIuY3VydmUtdG90YWwgcDplcSgxKSBzcGFuOmVxKDApXCIpLnRleHQoZGF0YS5kYXRhLmF2Z190aXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgJChcIi5jdXJ2ZS10b3RhbCBwOmVxKDEpIHNwYW46ZXEoMSlcIikudGV4dChkYXRhLmRhdGEuYXZnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJzdG9yZWRldGFpbC1pdGVtXCI6XG4gICAgICAgICAgICB0ZXJtUmFuZ2UgPSAkKFwiLnRhYmxlLW1vZHVsZSAuZGF0ZSAuZGF0ZS1jaG9pY2VkXCIpLmF0dHIoXCJ2YWx1ZVwiKTtcbiAgICAgICAgICAgIHNvcnQgPSAkKFwiLnRhYmxlLW1vZHVsZSAub3B0aW9ucy10YWIgLmdyYXBoLWNvbG9yXCIpLmF0dHIoXCJ2YWx1ZVwiKTtcbiAgICAgICAgICAgIG9yZGVyID0gJChcIi50YWJsZS1tb2R1bGUgLm9wdGlvbnMtdGFiIC5ncmFwaC1jb2xvclwiKS5hdHRyKFwib3JkZXJcIik7XG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogXCIvYW5hbHl0aWNzL2NoYWluLXN0b3JlXCIsXG4gICAgICAgICAgICAgICAgZGF0YToge1wiYWN0aW9uXCI6IGFjdGlvbiwgXCJ0ZXJtX3JhbmdlXCI6IHRlcm1SYW5nZSwgXCJzb3J0XCI6IHNvcnQsIFwib3JkZXJcIjogb3JkZXIsIFwic3RvcmVfaWRcIjpzdG9yZV9pZH0sXG4gICAgICAgICAgICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2VzcyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbmV3Um93ID0gXCI8dHI+PHRkPjwvdGQ+PHRkPjwvdGQ+PHRkPjwvdGQ+PHRkPjwvdGQ+PHRkPjwvdGQ+PHRkPjwvdGQ+PHRkPjwvdGQ+PHRkPjwvdGQ+PHRkPjwvdGQ+PHRkPjwvdGQ+PHRkPjwvdGQ+PHRkPjwvdGQ+PHRkPjwvdGQ+PHRkPjwvdGQ+PHRkPjwvdGQ+PHRkPjwvdGQ+PC90cj5cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoXCJ0YWJsZSB0Ym9keSB0clwiKS5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKFwidGFibGUgdGJvZHlcIikuYXBwZW5kKG5ld1Jvdyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWkgPSBpICsgMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKFwidGFibGUgdHI6ZXEoXCIgKyBpaSArIFwiKVwiKS5hdHRyKFwidmFsdWVcIiwgZGF0YS5kYXRhW2ldLmZvcmVpZ25faWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoXCJ0YWJsZSB0cjplcShcIiArIGlpICsgXCIpIHRkOmVxKDApXCIpLnRleHQoaWkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBkYXRhLmRhdGFbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW5kZXggPSAkKFwidGFibGUgdGhlYWQgdGhbdmFsdWU9J1wiICsga2V5ICtcIiddXCIpLmluZGV4KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJChcInRhYmxlIHRyOmVxKFwiICsgaWkgKyBcIikgdGQ6ZXEoXCIgKyBpbmRleCArIFwiKVwiKS50ZXh0KGRhdGEuZGF0YVtpXVtrZXldKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnaW5wdXQ6Y2hlY2tib3g6bm90KDpjaGVja2VkKScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoaWRlVGFibGVDb2woJChcInRhYmxlXCIpLCAkKHRoaXMpLmF0dHIoXCJ2YWx1ZVwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJ2lucHV0OmNoZWNrYm94OmNoZWNrZWQnKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvd1RhYmxlQ29sKCQoXCJ0YWJsZVwiKSwgJCh0aGlzKS5hdHRyKFwidmFsdWVcIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwic3RvcmVkZXRhaWwtY2F0ZWdvcnlcIjpcbiAgICAgICAgICAgIHRlcm1SYW5nZSA9ICQoXCIuY2lyY2xlLWdyYXBoLW1vZHVsZSAuZGF0ZSAuZGF0ZS1jaG9pY2VkXCIpLmF0dHIoXCJ2YWx1ZVwiKTtcbiAgICAgICAgICAgIGFyZyA9ICQoXCIuY2lyY2xlLWdyYXBoLW1vZHVsZSAub3B0aW9ucy10YWIgLmdyYXBoLWNvbG9yXCIpLmF0dHIoXCJ2YWx1ZVwiKTtcbiAgICAgICAgICAgIG5hbWUgPSAkKFwiLmNpcmNsZS1ncmFwaC1tb2R1bGUgLm9wdGlvbnMtdGFiIC5ncmFwaC1jb2xvciBzcGFuXCIpLnRleHQoKTtcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiBcIi9hbmFseXRpY3MvY2hhaW4tc3RvcmVcIixcbiAgICAgICAgICAgICAgICBkYXRhOiB7XCJhY3Rpb25cIjogYWN0aW9uLCBcInRlcm1fcmFuZ2VcIjogdGVybVJhbmdlLCBcImFyZ1wiOiBhcmcsIFwic3RvcmVfaWRcIjpzdG9yZV9pZH0sXG4gICAgICAgICAgICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdWNjZXNzID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBvcHRpb24gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0b29sdGlwOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWRkaW5nOiAxMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmlnZ2VyOiAnaXRlbScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWF0dGVyOiBcInthfSA8YnIvPntifToge2N9ICh7ZH0lKVwiXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgbGVnZW5kOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JpZW50OiAndmVydGljYWwnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHg6ICdsZWZ0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6ICcyNTAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6ICcyMCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9wOiAnMTUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6ZGF0YS5kYXRhLmNhdGVnb3JpZXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6ICdQaW5nRmFuZ1NDLVJlZ3VsYXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXJpZXM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6J3BpZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJhZGl1czogWyc1MCUnLCAnNzAlJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF2b2lkTGFiZWxPdmVybGFwOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY2VudGVyIDogWyc2NSUnLCAnNTAlJ10sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3JtYWw6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93OiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6ICdQaW5nRmFuZ1NDLVJlZ3VsYXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbXBoYXNpczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3c6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAnMjAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnYm9sZCdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsTGluZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9ybWFsOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvdzogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YS5kYXRhLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogZGF0YS5kYXRhLnBhbGV0dGVcblxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbGxDaGFydCgnY2lyY2xlX2NoYXJ0Jywgb3B0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJzdG9yZWRldGFpbC1pbmNyZWFzZXNcIjpcbiAgICAgICAgICAgIHRlcm1SYW5nZSA9ICQoXCIuYmFyLWNoYXJ0LW1vZHVsZSAuZGF0ZSAuZGF0ZS1jaG9pY2VkXCIpLmF0dHIoXCJ2YWx1ZVwiKTtcbiAgICAgICAgICAgIGFyZyA9ICQoXCIuYmFyLWNoYXJ0LW1vZHVsZSAub3B0aW9ucy10YWIgLmdyYXBoLWNvbG9yXCIpLmF0dHIoXCJ2YWx1ZVwiKTtcbiAgICAgICAgICAgIG5hbWUgPSAkKFwiLmJhci1jaGFydC1tb2R1bGUgLm9wdGlvbnMtdGFiIC5ncmFwaC1jb2xvciBzcGFuXCIpLnRleHQoKTtcblxuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB1cmw6IFwiL2FuYWx5dGljcy9jaGFpbi1zdG9yZVwiLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcImFjdGlvblwiOiBhY3Rpb24sIFwidGVybV9yYW5nZVwiOiB0ZXJtUmFuZ2UsIFwiYXJnXCI6IGFyZywgXCJzdG9yZV9pZFwiOnN0b3JlX2lkfSxcbiAgICAgICAgICAgICAgICB0eXBlOiBcIkdFVFwiLFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN1Y2Nlc3MgPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvb2x0aXAgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3c6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IDEwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmlnZ2VyOiAnYXhpcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF4aXNQb2ludGVyIDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZSA6ICdzaGFkb3cnXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRTdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogJ1BpbmdGYW5nU0MtUmVndWxhcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdHRlcjogXCJ7YX0gPGJyLz57Yn06IHtjfSVcIlxuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncmlkOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3cgOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0IDogNzAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcCA6IDIwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByaWdodCA6IDcwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3R0b20gOiA0MFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsY3VsYWJsZSA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeEF4aXMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGUgOiAndmFsdWUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXhpc0xhYmVsOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogJ1BpbmdGYW5nU0MtUmVndWxhcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzJhMmEyYScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxMlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBheGlzTGluZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVTdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyNjY2MnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHlBeGlzIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlIDogJ2NhdGVnb3J5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF4aXNUaWNrIDoge3Nob3c6IGZhbHNlfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEuZGF0YS5jYXRlZ29yaWVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXhpc0xhYmVsOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogJ1BpbmdGYW5nU0MtUmVndWxhcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzJhMmEyYScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxMlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBheGlzTGluZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVTdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyNjY2MnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcmllcyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6J2JhcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtU3R5bGUgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9ybWFsOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsIDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnaW5zaWRlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29sb3JMaXN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmFtcy5kYXRhLnZhbHVlID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvckxpc3QgPSAnI0ZGNDkxRic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yTGlzdCA9ICcjNTNkMTk5JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb2xvckxpc3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEuZGF0YS5kYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbENoYXJ0KCdiYXJfY2hhcnQnLCBvcHRpb24pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG59XG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAkKFwiYVt2YWx1ZT0nc3RvcmVkZXRhaWwnXVwiKS5hZGRDbGFzcyhcInNpZGViYXItY29sb3JcIik7XG4gICAgZmlsbERhdGEoXCJzdG9yZWRldGFpbC1iYXNlXCIpO1xuICAgIGZpbGxEYXRhKFwic3RvcmVkZXRhaWwtY2hhcnRcIik7XG4gICAgZmlsbERhdGEoXCJzdG9yZWRldGFpbC1pdGVtXCIpO1xuICAgIGZpbGxEYXRhKFwic3RvcmVkZXRhaWwtY2F0ZWdvcnlcIik7XG4gICAgZmlsbERhdGEoXCJzdG9yZWRldGFpbC1pbmNyZWFzZXNcIik7XG4gICAgJChcIi5kYXRlIGxpXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYoJCh0aGlzKS5hdHRyKFwidmFsdWVcIikgPT0gXCI4XCIgJiYgKCQodGhpcykucGFyZW50cyhcIi5iYXItY2hhcnQtbW9kdWxlXCIpLmZpbmQoXCIuZ3JhcGgtY29sb3JcIikuYXR0cihcInZhbHVlXCIpID09IFwiZ3Jvc3NfcHJvZml0XCIgfHwgJCh0aGlzKS5wYXJlbnRzKFwiLmJhci1jaGFydC1tb2R1bGVcIikuZmluZChcIi5ncmFwaC1jb2xvclwiKS5hdHRyKFwidmFsdWVcIikgPT0gXCJjcm9zc19yYXRpb1wiKSl7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgJCh0aGlzKS5zaWJsaW5ncyhcIi5kYXRlLWNob2ljZWRcIikucmVtb3ZlQ2xhc3MoKTtcbiAgICAgICAgJCh0aGlzKS5hZGRDbGFzcyhcImRhdGUtY2hvaWNlZFwiKTtcbiAgICAgICAgZ2EoJ3NlbmQnLCB7XG4gICAgICAgICAgICBoaXRUeXBlOiAnZXZlbnQnLFxuICAgICAgICAgICAgZXZlbnRDYXRlZ29yeTogJ3N0b3JlZGV0YWlsJyxcbiAgICAgICAgICAgIGV2ZW50QWN0aW9uOiAnZGF0ZScsXG4gICAgICAgICAgICBldmVudExhYmVsOiAkKHRoaXMpLnRleHQoKVxuICAgICAgICB9KTtcbiAgICAgICAgdmFyIF9sZWZ0ID0gJCh0aGlzKS5zY3JvbGxMZWZ0KCk7XG4gICAgICAgICQoJ3RhYmxlIHRoJykuZXEoMCkuY3NzKCdsZWZ0JywgX2xlZnQpO1xuICAgICAgICAkKCd0YWJsZSB0aCcpLmVxKDEpLmNzcygnbGVmdCcsIF9sZWZ0KS5hZGRDbGFzcygnYm94LXNoYWRvdycpO1xuICAgICAgICAkKCd0YWJsZSB0ZDpudGgtY2hpbGQoMSknKS5jc3MoJ2xlZnQnLCBfbGVmdCk7XG4gICAgICAgICQoJ3RhYmxlIHRkOm50aC1jaGlsZCgyKScpLmNzcygnbGVmdCcsIF9sZWZ0KS5hZGRDbGFzcygnYm94LXNoYWRvdycpO1xuICAgICAgICBpZiAoTnVtYmVyKCQodGhpcykuc2Nyb2xsTGVmdCgpKSA9PT0gMCkge1xuICAgICAgICAgICAgJCgndGFibGUgdGgnKS5lcSgxKS5yZW1vdmVDbGFzcygnYm94LXNoYWRvdycpO1xuICAgICAgICAgICAgJCgndGFibGUgdGQ6bnRoLWNoaWxkKDIpJykucmVtb3ZlQ2xhc3MoJ2JveC1zaGFkb3cnKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG5cbiAgICAkKFwiLm9wdGlvbnMtdGFiIGxpXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYoKCQodGhpcykuYXR0cihcInZhbHVlXCIpID09IFwiZ3Jvc3NfcHJvZml0XCIgfHwgJCh0aGlzKS5hdHRyKFwidmFsdWVcIikgPT0gXCJjcm9zc19yYXRpb1wiKSAmJiAkKHRoaXMpLnBhcmVudHMoXCIuYmFyLWNoYXJ0LW1vZHVsZVwiKS5maW5kKFwiLmRhdGUgLmRhdGUtY2hvaWNlZFwiKS5hdHRyKFwidmFsdWVcIikgPT0gXCI4XCIpe1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgICQodGhpcykuc2libGluZ3MoXCIuZ3JhcGgtY29sb3JcIikucmVtb3ZlQ2xhc3MoKTtcbiAgICAgICAgJCh0aGlzKS5hZGRDbGFzcyhcImdyYXBoLWNvbG9yXCIpO1xuXG4gICAgfSk7XG5cbiAgICAkKFwiLmJhc2ljLWluZGV4ZXMtbW9kdWxlIC5kYXRlIGxpLC5iYXNpYy1pbmRleGVzLW1vZHVsZSAub3B0aW9ucy10YWIgbGlcIikuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICBmaWxsRGF0YShcInN0b3JlZGV0YWlsLWJhc2VcIik7XG4gICAgICAgIGZpbGxEYXRhKFwic3RvcmVkZXRhaWwtY2hhcnRcIik7XG5cbiAgICB9KTtcblxuICAgICQoXCIudGFibGUtbW9kdWxlIC5kYXRlIGxpLC50YWJsZS1tb2R1bGUgLm9wdGlvbnMtdGFiIGxpXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIGZpbGxEYXRhKFwic3RvcmVkZXRhaWwtaXRlbVwiKTtcbiAgICAgICAgZ2EoJ3NlbmQnLCB7XG4gICAgICAgICAgICBoaXRUeXBlOiAnZXZlbnQnLFxuICAgICAgICAgICAgZXZlbnRDYXRlZ29yeTogJ3N0b3JlZGV0YWlsJyxcbiAgICAgICAgICAgIGV2ZW50QWN0aW9uOiAnaXRlbScsXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgICQoXCIuYWRkLWltYWdlLXNwZWNpYWw6ZXEoMClcIikuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIG9wID0gJChcIi5leHBsYWluLWJveC1zcGVjaWFsXCIpLmF0dHIoXCJoaWRkZW5cIikgPT0gXCJoaWRkZW5cIiA/ICQoXCIuZXhwbGFpbi1ib3gtc3BlY2lhbFwiKS5yZW1vdmVBdHRyKFwiaGlkZGVuXCIpIDogJChcIi5leHBsYWluLWJveC1zcGVjaWFsXCIpLmF0dHIoXCJoaWRkZW5cIiwgXCJoaWRkZW5cIik7XG4gICAgfSk7XG4gICAgJChcIi5hZGQtaW1hZ2Utc3BlY2lhbDplcSgxKVwiKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICB2YXIgb3AgPSAkKFwiLmFkZC1pdGVtcy1zcGVjaWFsXCIpLmF0dHIoXCJoaWRkZW5cIikgPT0gXCJoaWRkZW5cIiA/ICQoXCIuYWRkLWl0ZW1zLXNwZWNpYWxcIikucmVtb3ZlQXR0cihcImhpZGRlblwiKSA6ICQoXCIuYWRkLWl0ZW1zLXNwZWNpYWxcIikuYXR0cihcImhpZGRlblwiLCBcImhpZGRlblwiKTtcbiAgICB9KTtcbiAgICAkKFwiLmZsb2F0LXJpZ2h0IGlucHV0OmVxKDApLCAuZmxvYXQtcmlnaHQgaW5wdXQ6ZXEoMSlcIikuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgJChcIi5hZGQtaXRlbXMtc3BlY2lhbFwiKS5hdHRyKFwiaGlkZGVuXCIsIFwiaGlkZGVuXCIpO1xuICAgIH0pO1xuICAgICQoXCIuZmxvYXQtcmlnaHQgaW5wdXQ6ZXEoMilcIikuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgJChcIi5hZGQtaXRlbXMtc3BlY2lhbFwiKS5hdHRyKFwiaGlkZGVuXCIsIFwiaGlkZGVuXCIpO1xuXG4gICAgICAgICQoJ2lucHV0OmNoZWNrYm94Om5vdCg6Y2hlY2tlZCknKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBoaWRlVGFibGVDb2woJChcInRhYmxlXCIpLCAkKHRoaXMpLmF0dHIoXCJ2YWx1ZVwiKSk7XG4gICAgICAgIH0pO1xuICAgICAgICAkKCdpbnB1dDpjaGVja2JveDpjaGVja2VkJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgc2hvd1RhYmxlQ29sKCQoXCJ0YWJsZVwiKSwgJCh0aGlzKS5hdHRyKFwidmFsdWVcIikpO1xuICAgICAgICB9KTtcbiAgICAgICAgc2V0VGJhbGVXaWR0aCgpO1xuICAgIH0pO1xuXG4gICAgJChcIi5jaXJjbGUtZ3JhcGgtbW9kdWxlIC5kYXRlIGxpLC5jaXJjbGUtZ3JhcGgtbW9kdWxlIC5vcHRpb25zLXRhYiBsaVwiKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICBmaWxsRGF0YShcInN0b3JlZGV0YWlsLWNhdGVnb3J5XCIpO1xuICAgICAgICBnYSgnc2VuZCcsIHtcbiAgICAgICAgICAgIGhpdFR5cGU6ICdldmVudCcsXG4gICAgICAgICAgICBldmVudENhdGVnb3J5OiAnc3RvcmVkZXRhaWwnLFxuICAgICAgICAgICAgZXZlbnRBY3Rpb246ICdjYXRlZ29yeScsXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgICQoXCIuYmFyLWNoYXJ0LW1vZHVsZSAuZGF0ZSBsaSwuYmFyLWNoYXJ0LW1vZHVsZSAub3B0aW9ucy10YWIgbGlcIikuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgZmlsbERhdGEoXCJzdG9yZWRldGFpbC1pbmNyZWFzZXNcIik7XG4gICAgICAgIGdhKCdzZW5kJywge1xuICAgICAgICAgICAgaGl0VHlwZTogJ2V2ZW50JyxcbiAgICAgICAgICAgIGV2ZW50Q2F0ZWdvcnk6ICdzdG9yZWRldGFpbCcsXG4gICAgICAgICAgICBldmVudEFjdGlvbjogJ2luY3JlYXNlcycsXG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgJChcIi50YWJsZS1tb2R1bGUgLmRvd25sb2FkXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICQoXCJ0YWJsZVwiKS50YWJsZUV4cG9ydCh7XG4gICAgICAgICAgICBoZWFkaW5nczogdHJ1ZSxcbiAgICAgICAgICAgIGZpbGVOYW1lOiBcIml0ZW1zXCIsXG4gICAgICAgICAgICBmb3JtYXRzOiBbXCJjc3ZcIl0sXG4gICAgICAgICAgICBwb3NpdGlvbjogXCJib3R0b21cIixcbiAgICAgICAgICAgIGlnbm9yZUNTUzogXCJbc3R5bGUqPSdkaXNwbGF5OiBub25lJ11cIlxuICAgICAgICB9KTtcbiAgICAgICAgZ2EoJ3NlbmQnLCB7XG4gICAgICAgICAgICBoaXRUeXBlOiAnZXZlbnQnLFxuICAgICAgICAgICAgZXZlbnRDYXRlZ29yeTogJ3N0b3JlZGV0YWlsJyxcbiAgICAgICAgICAgIGV2ZW50QWN0aW9uOiAnZG93bmxvYWQnLFxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICB0YWJsZVNjcm9sbEZ1bigpO1xufSk7XG4iXSwiZmlsZSI6ImFuYWx5dGljcy9zdG9yZV9kZXRhaWwuanMifQ==
