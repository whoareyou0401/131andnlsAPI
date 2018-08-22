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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhbmFseXRpY3Mvc3RvcmVfb3ZlcnZpZXcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gZmlsbERhdGEoYWN0aW9uKSB7XG4gICAgdmFyIHRlcm1SYW5nZSA9ICQoXCIuZGF0ZSAuZGF0ZS1jaG9pY2VkXCIpLmF0dHIoXCJ2YWx1ZVwiKTtcbiAgICB2YXIgc3RvcmVQcm9wZXJ0eSA9ICQoXCIuc3RvcmUtdHlwZSAuc3RvcmUtY29sb3JcIikuYXR0cihcInZhbHVlXCIpO1xuICAgIHZhciBzZWxlY3RlZENoYXJ0ID0gJChcIi5ncmFwaC1jb2xvclwiKS5hdHRyKFwidmFsdWVcIik7XG4gICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgICAgY2FzZSBcIm92ZXJ2aWV3LWJhc2VcIjpcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiBcIi9hbmFseXRpY3MvY2hhaW4tc3RvcmVcIixcbiAgICAgICAgICAgICAgICBkYXRhOiB7XCJhY3Rpb25cIjogYWN0aW9uLCBcInRlcm1fcmFuZ2VcIjogdGVybVJhbmdlLCBcInByb3BlcnR5XCI6IHN0b3JlUHJvcGVydHl9LFxuICAgICAgICAgICAgICAgIHR5cGU6IFwiR0VUXCIsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2VzcyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKFwiLnRvdGFsLWl0ZW1zXCIpLmNoaWxkcmVuKFwibGk6ZXEoMClcIikuZmluZChcInA6ZXEoMSlcIikudGV4dChkYXRhLmRhdGEudGFyZ2V0X3NhbGVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoXCIudG90YWwtaXRlbXNcIikuY2hpbGRyZW4oXCJsaTplcSgxKVwiKS5maW5kKFwicDplcSgxKVwiKS50ZXh0KGRhdGEuZGF0YS5jb21wbGV0ZW5lc3MpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJChcIi50b3RhbC1pdGVtc1wiKS5jaGlsZHJlbihcImxpOmVxKDIpXCIpLmZpbmQoXCJwOmVxKDEpXCIpLnRleHQoZGF0YS5kYXRhLmRpZmZlcmVuY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJChcIi50b3RhbC1pdGVtc1wiKS5jaGlsZHJlbihcImxpOmVxKDMpXCIpLmZpbmQoXCJwOmVxKDEpXCIpLnRleHQoZGF0YS5kYXRhLnR1cm5vdmVyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoXCIub3B0aW9ucy10YWJcIikuY2hpbGRyZW4oXCJsaTplcSgwKVwiKS5maW5kKFwic3BhbjplcSgxKVwiKS50ZXh0KGRhdGEuZGF0YS5zYWxlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKFwiLm9wdGlvbnMtdGFiXCIpLmNoaWxkcmVuKFwibGk6ZXEoMSlcIikuZmluZChcInNwYW46ZXEoMSlcIikudGV4dChkYXRhLmRhdGEuZ3Jvc3NfcHJvZml0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoXCIub3B0aW9ucy10YWJcIikuY2hpbGRyZW4oXCJsaTplcSgyKVwiKS5maW5kKFwic3BhbjplcSgxKVwiKS50ZXh0KGRhdGEuZGF0YS5udW1fdHJhZGVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoXCIub3B0aW9ucy10YWJcIikuY2hpbGRyZW4oXCJsaTplcSgzKVwiKS5maW5kKFwic3BhbjplcSgxKVwiKS50ZXh0KGRhdGEuZGF0YS51bml0X3RyYWRlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoXCIuYmFzaWMtaW5kZXhlcy1tb2R1bGUgLm9wdGlvbnMtdGFiXCIpLmNoaWxkcmVuKFwibGk6ZXEoMylcIikuZmluZChcInNwYW46ZXEoMSlcIikudGV4dChkYXRhLmRhdGEudW5pdF90cmFkZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKFwiLmJhc2ljLWluZGV4ZXMtdG90YWwgLnRvdGFsLWl0ZW1zIC5iYXNpYy1saXN0IGRpdjplcSgwKSBwIHNwYW46ZXEoMClcIikudGV4dChkYXRhLmRhdGEudGVybSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKFwiLmJhc2ljLWluZGV4ZXMtdG90YWwgLnRvdGFsLWl0ZW1zIC5iYXNpYy1saXN0IGRpdjplcSgxKSBwIHNwYW46ZXEoMClcIikudGV4dChkYXRhLmRhdGEudGVybSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKFwiLmJhc2ljLWluZGV4ZXMtdG90YWwgLnRvdGFsLWl0ZW1zIC5iYXNpYy1saXN0IGRpdjplcSgyKSBwIHNwYW46ZXEoMClcIikudGV4dChkYXRhLmRhdGEudGVybSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKFwiLmJhc2ljLWluZGV4ZXMtdG90YWwgLnRvdGFsLWl0ZW1zIC5iYXNpYy1saXN0IGRpdjplcSgwKSBwIHNwYW46ZXEoMSlcIikudGV4dChkYXRhLmRhdGEudGVybV9vbl90ZXJtX3RhcmdldF9zYWxlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKFwiLmJhc2ljLWluZGV4ZXMtdG90YWwgLnRvdGFsLWl0ZW1zIC5iYXNpYy1saXN0IGRpdjplcSgxKSBwIHNwYW46ZXEoMSlcIikudGV4dChkYXRhLmRhdGEudGVybV9vbl90ZXJtX2NvbXBsZXRlbmVzcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKFwiLmJhc2ljLWluZGV4ZXMtdG90YWwgLnRvdGFsLWl0ZW1zIC5iYXNpYy1saXN0IGRpdjplcSgyKSBwIHNwYW46ZXEoMSlcIikudGV4dChkYXRhLmRhdGEudGVybV9vbl90ZXJtX2RpZmZlcmVuY2UpO1xuXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsb2NhdGlvbi5ocmVmID0gXCIvbG9nb3V0XCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICBjYXNlIFwib3ZlcnZpZXctY2hhcnRcIjpcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiBcIi9hbmFseXRpY3MvY2hhaW4tc3RvcmVcIixcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIFwiYWN0aW9uXCI6IGFjdGlvbixcbiAgICAgICAgICAgICAgICAgICAgXCJ0ZXJtX3JhbmdlXCI6IHRlcm1SYW5nZSxcbiAgICAgICAgICAgICAgICAgICAgXCJwcm9wZXJ0eVwiOiBzdG9yZVByb3BlcnR5LFxuICAgICAgICAgICAgICAgICAgICBcImFyZ1wiOiBzZWxlY3RlZENoYXJ0XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0eXBlOiBcIkdFVFwiLFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN1Y2Nlc3MgPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG9wdGlvbiA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWdlbmQ6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHQ6IFwiMTAlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IFt7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZGF0YS5kYXRhLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBcIiNmZjU0MjJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGRhdGEuZGF0YS50ZXJtX29uX3Rlcm1fbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IFwiIzkxNjBmZlwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncmlkOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxlZnQ6IFwiMyVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmlnaHQ6IFwiNCVcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm90dG9tOiBcIjMlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhaW5MYWJlbDogdHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbHRpcDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0cmlnZ2VyOiAnYXhpcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6IDEwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRGYW1pbHk6ICdQaW5nRmFuZ1NDLVJlZ3VsYXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4QXhpczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImNhdGVnb3J5XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvdW5kYXJ5R2FwOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YS5kYXRhLnhfaW5kaWNlcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXhpc0xhYmVsOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogJ1BpbmdGYW5nU0MtUmVndWxhcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjMmEyYTJhJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXhpc0xpbmU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVTdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnI2NjYycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB5QXhpczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAndmFsdWUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBheGlzTGluZToge3Nob3c6IGZhbHNlfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXhpc0xhYmVsOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93OiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogJ1BpbmdGYW5nU0MtUmVndWxhcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDEyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXJpZXM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZGF0YS5kYXRhLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnbGluZScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGFjazogJ+aAu+mHjycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsaW5lU3R5bGU6e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vcm1hbDp7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBcIiNmZjU0MjJcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hhZG93Q29sb3I6IFwiI2ZmNTQyMlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGFkb3dCbHVyOiA2MCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hhZG93T2Zmc2V0WTogMjBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YS5kYXRhLmRhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZGF0YS5kYXRhLnRlcm1fb25fdGVybV9uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2xpbmUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2s6ICfmgLvph48xJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVTdHlsZTp7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9ybWFsOntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6IFwiIzkxNjBmZlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGFkb3dDb2xvcjogXCIjOTE2MGZmXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoYWRvd0JsdXI6IDYwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaGFkb3dPZmZzZXRZOiAyMFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLmRhdGEudGVybV9vbl90ZXJtX2RhdGFcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBbJyNmZjU0MjInLCAnIzkxNjBmZiddXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbENoYXJ0KCdtYWluJywgb3B0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoXCIuY3VydmUtdG90YWwgcDplcSgwKVwiKS50ZXh0KGRhdGEuZGF0YS50ZXJtX29uX3Rlcm1fdGlwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoXCIuY3VydmUtdG90YWwgcDplcSgxKSBzcGFuOmVxKDApXCIpLnRleHQoZGF0YS5kYXRhLmF2Z190aXApO1xuICAgICAgICAgICAgICAgICAgICAgICAgJChcIi5jdXJ2ZS10b3RhbCBwOmVxKDEpIHNwYW46ZXEoMSlcIikudGV4dChkYXRhLmRhdGEuYXZnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGNhc2UgXCJvdmVydmlldy1hcmVhc1wiOlxuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB1cmw6IFwiL2FuYWx5dGljcy9jaGFpbi1zdG9yZVwiLFxuICAgICAgICAgICAgICAgIGRhdGE6IHtcImFjdGlvblwiOiBcIm92ZXJ2aWV3LWFyZWFzXCIsIFwidGVybV9yYW5nZVwiOiB0ZXJtUmFuZ2UsIFwicHJvcGVydHlcIjogc3RvcmVQcm9wZXJ0eX0sXG4gICAgICAgICAgICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5zdWNjZXNzID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBuZXdSb3cgPSBcIjx0cj48dGQ+PC90ZD48dGQ+PC90ZD48dGQ+PC90ZD48dGQ+PC90ZD48dGQ+PC90ZD48dGQ+PC90ZD48dGQ+PC90ZD48L3RyPlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgJChcInRhYmxlIHRib2R5IHRyXCIpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKFwidGFibGUgdGJvZHlcIikuYXBwZW5kKG5ld1Jvdyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWkgPSBpICsgMTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKFwidGFibGUgdHI6ZXEoXCIgKyBpaSArIFwiKSB0ZDplcSgwKVwiKS50ZXh0KGRhdGEuZGF0YVtpXS5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyAkKFwidGFibGUgdHI6ZXEoXCIgKyBpaSArIFwiKSB0ZDplcSgwKVwiKS50ZXh0KFwieHhcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChcInRhYmxlIHRyOmVxKFwiICsgaWkgKyBcIikgdGQ6ZXEoMSlcIikudGV4dChkYXRhLmRhdGFbaV0udGFyZ2V0X3NhbGVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKFwidGFibGUgdHI6ZXEoXCIgKyBpaSArIFwiKSB0ZDplcSgyKVwiKS50ZXh0KGRhdGEuZGF0YVtpXS5zYWxlcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChcInRhYmxlIHRyOmVxKFwiICsgaWkgKyBcIikgdGQ6ZXEoMylcIikudGV4dChkYXRhLmRhdGFbaV0uY29tcGxldGVuZXNzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKFwidGFibGUgdHI6ZXEoXCIgKyBpaSArIFwiKSB0ZDplcSg0KVwiKS50ZXh0KGRhdGEuZGF0YVtpXS5kaWZmZXJlbmNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKFwidGFibGUgdHI6ZXEoXCIgKyBpaSArIFwiKSB0ZDplcSg1KVwiKS50ZXh0KGRhdGEuZGF0YVtpXS5ncm9zc19wcm9maXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoXCJ0YWJsZSB0cjplcShcIiArIGlpICsgXCIpIHRkOmVxKDYpXCIpLnRleHQoZGF0YS5kYXRhW2ldLnRlcm1fb25fdGVybV9kaWZmZXJlbmNlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgfVxufVxuXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiBcIi9hbmFseXRpY3MvY2hhaW4tc3RvcmVcIixcbiAgICAgICAgZGF0YToge1wiYWN0aW9uXCI6IFwib3ZlcnZpZXctaW5pdFwifSxcbiAgICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIGlmIChkYXRhLnN1Y2Nlc3MgPT0gMSkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICQoXCIuc3RvcmUtdHlwZVwiKS5hcHBlbmQoXCI8c3BhbiB2YWx1ZT0nXCIgKyBkYXRhLmRhdGFbaV0udmFsdWUgKyBcIic+XCIgKyBkYXRhLmRhdGFbaV0ubmFtZSArIFwiPC9zcGFuPlwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJChcIi5zdG9yZS10eXBlIHNwYW5cIikuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAkKFwiLnN0b3JlLWNvbG9yXCIpLnJlbW92ZUNsYXNzKCk7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoXCJzdG9yZS1jb2xvclwiKTtcbiAgICAgICAgICAgICAgICAgICAgZmlsbERhdGEoXCJvdmVydmlldy1iYXNlXCIpO1xuICAgICAgICAgICAgICAgICAgICBmaWxsRGF0YShcIm92ZXJ2aWV3LWFyZWFzXCIpO1xuICAgICAgICAgICAgICAgICAgICBmaWxsRGF0YShcIm92ZXJ2aWV3LWNoYXJ0XCIpO1xuICAgICAgICAgICAgICAgICAgICBnYSgnc2VuZCcsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhpdFR5cGU6ICdldmVudCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudENhdGVnb3J5OiAnb3ZlcnZpZXcnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRBY3Rpb246ICdzdG9yZS10eXBlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50TGFiZWw6ICQodGhpcykudGV4dCgpXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGZpbGxEYXRhKFwib3ZlcnZpZXctYmFzZVwiKTtcbiAgICAgICAgICAgICAgICBmaWxsRGF0YShcIm92ZXJ2aWV3LWNoYXJ0XCIpO1xuICAgICAgICAgICAgICAgIGZpbGxEYXRhKFwib3ZlcnZpZXctYXJlYXNcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgICQoXCJ0YWJsZVwiKS50YWJsZXNvcnQoKTtcblxuICAgICQoXCIuZGF0ZSBsaVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoXCIuZGF0ZS1jaG9pY2VkXCIpLnJlbW92ZUNsYXNzKCk7XG4gICAgICAgICQodGhpcykuYWRkQ2xhc3MoXCJkYXRlLWNob2ljZWRcIik7XG4gICAgICAgIGZpbGxEYXRhKFwib3ZlcnZpZXctYmFzZVwiKTtcbiAgICAgICAgZmlsbERhdGEoXCJvdmVydmlldy1hcmVhc1wiKTtcbiAgICAgICAgZmlsbERhdGEoXCJvdmVydmlldy1jaGFydFwiKTtcbiAgICAgICAgZ2EoJ3NlbmQnLCB7XG4gICAgICAgICAgICBoaXRUeXBlOiAnZXZlbnQnLFxuICAgICAgICAgICAgZXZlbnRDYXRlZ29yeTogJ292ZXJ2aWV3JyxcbiAgICAgICAgICAgIGV2ZW50QWN0aW9uOiAnZGF0ZScsXG4gICAgICAgICAgICBldmVudExhYmVsOiAkKHRoaXMpLnRleHQoKVxuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgICQoXCIub3B0aW9ucy10YWIgbGlcIikuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAkKFwiLmdyYXBoLWNvbG9yXCIpLnJlbW92ZUNsYXNzKCk7XG4gICAgICAgICQodGhpcykuYWRkQ2xhc3MoXCJncmFwaC1jb2xvclwiKTtcbiAgICAgICAgZmlsbERhdGEoXCJvdmVydmlldy1jaGFydFwiKTtcbiAgICAgICAgZ2EoJ3NlbmQnLCB7XG4gICAgICAgICAgICBoaXRUeXBlOiAnZXZlbnQnLFxuICAgICAgICAgICAgZXZlbnRDYXRlZ29yeTogJ292ZXJ2aWV3JyxcbiAgICAgICAgICAgIGV2ZW50QWN0aW9uOiAnY2hhcnQnLFxuICAgICAgICAgICAgZXZlbnRMYWJlbDogJCh0aGlzKS5maW5kKFwicDplcSgwKVwiKS50ZXh0KClcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0pOyJdLCJmaWxlIjoiYW5hbHl0aWNzL3N0b3JlX292ZXJ2aWV3LmpzIn0=
