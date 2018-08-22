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
