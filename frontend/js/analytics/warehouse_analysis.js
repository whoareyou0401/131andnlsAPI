function fillData(action) {
    var storeProperty = $(".store-type .store-color").attr("value");
    var termRange, arg, selectedChart, sort, order, name, store_property;
    switch (action) {
        case "warehouseanalysis-item":
            termRange = $(".table-module .date .date-choiced").attr("value");
            sort = $(".table-module .options-tab .graph-color").attr("value");
            order = $(".table-module .options-tab .graph-color").attr("order");
            $.ajax({
                url: "/analytics/chain-store",
                data: {"action": action, "term_range": termRange, "sort": sort, "order": order, "property": storeProperty},
                type: "GET",
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
        case "warehouseanalysis-category":
            termRange = $(".circle-graph-module .date .date-choiced").attr("value");
            arg = $(".circle-graph-module .options-tab .graph-color").attr("value");
            name = $(".circle-graph-module .options-tab .graph-color span").text();
            $.ajax({
                url: "/analytics/chain-store",
                data: {"action": action, "term_range": termRange, "arg": arg, "property": storeProperty},
                type: "GET",
                success: function (data) {
                    if (data.success == 1) {
                        var option = {
                        tooltip: {
                            show: true,
                            padding: 10,
                            trigger: 'item',
                            textStyle: {
                                fontFamily: 'PingFangSC-Regular',
                            },
                            formatter: "{a} <br/>{b}: {c} ({d}%)"
                        },
                        legend: {
                            orient: 'vertical',
                            x: 'left',
                            height: '250',
                            left: '20',
                            top: '15',
                            data: data.data.categories,
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
        case "warehouseanalysis-increases":
            termRange = $(".bar-chart-module .date .date-choiced").attr("value");
            arg = $(".bar-chart-module .options-tab .graph-color").attr("value");
            name = $(".bar-chart-module .options-tab .graph-color span").text();

            $.ajax({
                url: "/analytics/chain-store",
                data: {"action": action, "term_range": termRange, "arg": arg, "property": storeProperty},
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
    $("a[value='warehouseanalysis']").addClass("sidebar-color");

    $.ajax({
        url: "/analytics/chain-store",
        data: {"action": "warehouseanalysis-init"},
        type: "GET",
        success: function (data) {
            if (data.success == 1) {
                for (var i = 0; i < data.data.length; i++) {
                    $(".store-type").append("<span value='" + data.data[i].value + "'>" + data.data[i].name + "</span>");
                }
                fillData("warehouseanalysis-item");
                fillData("warehouseanalysis-category");
                fillData("warehouseanalysis-increases");
                $(".store-type span").click(function () {
                    $(".store-color").removeClass();
                    $(this).addClass("store-color");
                    fillData("warehouseanalysis-item");
                    fillData("warehouseanalysis-category");
                    fillData("warehouseanalysis-increases");
                    ga('send', {
                        hitType: 'event',
                        eventCategory: 'warehouseanalysis',
                        eventAction: 'store-type',
                        eventLabel: $(this).text()
                    });
                });
            }
        }
    });


    $(".date li").click(function () {
        if($(this).attr("value") == "8" && ($(this).parents(".bar-chart-module").find(".graph-color").attr("value") == "gross_profit" || $(this).parents(".bar-chart-module").find(".graph-color").attr("value") == "cross_ratio" || $(this).parents(".bar-chart-module").find(".graph-color").attr("value") == "sales" || $(this).parents(".bar-chart-module").find(".graph-color").attr("value") == "num")){
            return false;
        }
        if($(this).attr("value") == "8" && ($(this).parents(".circle-graph-module").find(".graph-color").attr("value") == "cross_ratio")){
            return false;
        }
        $(this).siblings(".date-choiced").removeClass();
        $(this).addClass("date-choiced");
        ga('send', {
            hitType: 'event',
            eventCategory: 'warehouseanalysis',
            eventAction: 'date',
            eventLabel: $(this).text()
        });

        var _left = $(this).scrollLeft();
        $('table th').eq(0).css('left', _left);
        $('table th').eq(1).css('left', _left).addClass('box-shadow');
        $('table td:nth-child(1)').css('left', _left);
        $('table td:nth-child(2)').css('left', _left).addClass('box-shadow');
        if (Number($(this).scrollLeft()) == 0) {
            $('table th').eq(1).removeClass('box-shadow');
            $('table td:nth-child(2)').removeClass('box-shadow');
        }
    });

    $(".options-tab li").click(function () {
        if(($(this).attr("value") == "gross_profit" || $(this).attr("value") == "cross_ratio" || $(this).attr("value") == "cross_ratio" == "sales" || $(this).attr("value") == "cross_ratio" == "num") && $(this).parents(".bar-chart-module").find(".date .date-choiced").attr("value") == "8"){
            return false;
        }
        if(($(this).attr("value") == "cross_ratio") && $(this).parents(".circle-graph-module").find(".date .date-choiced").attr("value") == "8"){
            return false;
        }
        $(this).siblings(".graph-color").removeClass();
        $(this).addClass("graph-color");

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
        fillData("warehouseanalysis-category");
        ga('send', {
            hitType: 'event',
            eventCategory: 'warehouseanalysis',
            eventAction: 'category',
        });
    });

    $(".bar-chart-module .date li,.bar-chart-module .options-tab li").click(function(){
        fillData("warehouseanalysis-increases");
        ga('send', {
            hitType: 'event',
            eventCategory: 'warehouseanalysis',
            eventAction: 'increases',
        });
    });

    $(".table-module .date li,.table-module .options-tab li").click(function(){
        fillData("warehouseanalysis-item");
        ga('send', {
            hitType: 'event',
            eventCategory: 'warehouseanalysis',
            eventAction: 'item',
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
            eventCategory: 'warehouseanalysis',
            eventAction: 'download',
        });
    });
    tableScrollFun();
});