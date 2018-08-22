function fillData(action) {
    var termRange = $(".date .date-choiced").attr("value");
    var storeProperty = $(".store-type .store-color").attr("value");
    var selectedChart = $(".graph-color").attr("value");
    switch (action) {
        case "overview-base":
            $.ajax({
                url: "/analytics/chain-store",
                data: {"action": action, "term_range": termRange, "property": storeProperty},
                type: "GET",
                success: function (data) {
                    if (data.success == 1) {
                        $(".total-items").children("li:eq(0)").find("p:eq(1)").text(data.data.target_sales);
                        $(".total-items").children("li:eq(1)").find("p:eq(1)").text(data.data.completeness);
                        $(".total-items").children("li:eq(2)").find("p:eq(1)").text(data.data.difference);
                        $(".total-items").children("li:eq(3)").find("p:eq(1)").text(data.data.turnover);
                        $(".options-tab").children("li:eq(0)").find("span:eq(1)").text(data.data.sales);
                        $(".options-tab").children("li:eq(1)").find("span:eq(1)").text(data.data.gross_profit);
                        $(".options-tab").children("li:eq(2)").find("span:eq(1)").text(data.data.num_trades);
                        $(".options-tab").children("li:eq(3)").find("span:eq(1)").text(data.data.unit_trade);
                        $(".basic-indexes-module .options-tab").children("li:eq(3)").find("span:eq(1)").text(data.data.unit_trade);
                        $(".basic-indexes-total .total-items .basic-list div:eq(0) p span:eq(0)").text(data.data.term);
                        $(".basic-indexes-total .total-items .basic-list div:eq(1) p span:eq(0)").text(data.data.term);
                        $(".basic-indexes-total .total-items .basic-list div:eq(2) p span:eq(0)").text(data.data.term);
                        $(".basic-indexes-total .total-items .basic-list div:eq(0) p span:eq(1)").text(data.data.term_on_term_target_sales);
                        $(".basic-indexes-total .total-items .basic-list div:eq(1) p span:eq(1)").text(data.data.term_on_term_completeness);
                        $(".basic-indexes-total .total-items .basic-list div:eq(2) p span:eq(1)").text(data.data.term_on_term_difference);

                    } else {
                        location.href = "/logout";
                    }
                }
            });
            break;
        case "overview-chart":
            $.ajax({
                url: "/analytics/chain-store",
                data: {
                    "action": action,
                    "term_range": termRange,
                    "property": storeProperty,
                    "arg": selectedChart
                },
                type: "GET",
                success: function (data) {
                    if (data.success == 1) {
                        var option = {
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
                            tooltip: {
                                show: true,
                                trigger: 'axis',
                                padding: 10,
                                textStyle: {
                                    fontFamily: 'PingFangSC-Regular',
                                }
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
        case "overview-areas":
            $.ajax({
                url: "/analytics/chain-store",
                data: {"action": "overview-areas", "term_range": termRange, "property": storeProperty},
                type: "GET",
                success: function (data) {
                    if (data.success == 1) {
                        var newRow = "<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
                        $("table tbody tr").remove();
                        for (var i = 0; i < data.data.length; i++) {
                            $("table tbody").append(newRow);
                            ii = i + 1;
                            $("table tr:eq(" + ii + ") td:eq(0)").text(data.data[i].name);
                            // $("table tr:eq(" + ii + ") td:eq(0)").text("xx");
                            $("table tr:eq(" + ii + ") td:eq(1)").text(data.data[i].target_sales);
                            $("table tr:eq(" + ii + ") td:eq(2)").text(data.data[i].sales);
                            $("table tr:eq(" + ii + ") td:eq(3)").text(data.data[i].completeness);
                            $("table tr:eq(" + ii + ") td:eq(4)").text(data.data[i].difference);
                            $("table tr:eq(" + ii + ") td:eq(5)").text(data.data[i].gross_profit);
                            $("table tr:eq(" + ii + ") td:eq(6)").text(data.data[i].term_on_term_difference);
                        }
                    }
                }
            });
            break;
    }
}

$(document).ready(function () {
    $.ajax({
        url: "/analytics/chain-store",
        data: {"action": "overview-init"},
        type: "GET",
        success: function (data) {
            if (data.success == 1) {
                for (var i = 0; i < data.data.length; i++) {
                    $(".store-type").append("<span value='" + data.data[i].value + "'>" + data.data[i].name + "</span>");
                }
                $(".store-type span").click(function () {
                    $(".store-color").removeClass();
                    $(this).addClass("store-color");
                    fillData("overview-base");
                    fillData("overview-areas");
                    fillData("overview-chart");
                    ga('send', {
                        hitType: 'event',
                        eventCategory: 'overview',
                        eventAction: 'store-type',
                        eventLabel: $(this).text()
                    });
                });
                fillData("overview-base");
                fillData("overview-chart");
                fillData("overview-areas");
            }
        }
    });

    $("table").tablesort();

    $(".date li").click(function () {
        $(".date-choiced").removeClass();
        $(this).addClass("date-choiced");
        fillData("overview-base");
        fillData("overview-areas");
        fillData("overview-chart");
        ga('send', {
            hitType: 'event',
            eventCategory: 'overview',
            eventAction: 'date',
            eventLabel: $(this).text()
        });
    });

    $(".options-tab li").click(function () {
        $(".graph-color").removeClass();
        $(this).addClass("graph-color");
        fillData("overview-chart");
        ga('send', {
            hitType: 'event',
            eventCategory: 'overview',
            eventAction: 'chart',
            eventLabel: $(this).find("p:eq(0)").text()
        });
    });

});