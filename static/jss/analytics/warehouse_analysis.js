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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhbmFseXRpY3Mvd2FyZWhvdXNlX2FuYWx5c2lzLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIGZpbGxEYXRhKGFjdGlvbikge1xuICAgIHZhciBzdG9yZVByb3BlcnR5ID0gJChcIi5zdG9yZS10eXBlIC5zdG9yZS1jb2xvclwiKS5hdHRyKFwidmFsdWVcIik7XG4gICAgdmFyIHRlcm1SYW5nZSwgYXJnLCBzZWxlY3RlZENoYXJ0LCBzb3J0LCBvcmRlciwgbmFtZSwgc3RvcmVfcHJvcGVydHk7XG4gICAgc3dpdGNoIChhY3Rpb24pIHtcbiAgICAgICAgY2FzZSBcIndhcmVob3VzZWFuYWx5c2lzLWl0ZW1cIjpcbiAgICAgICAgICAgIHRlcm1SYW5nZSA9ICQoXCIudGFibGUtbW9kdWxlIC5kYXRlIC5kYXRlLWNob2ljZWRcIikuYXR0cihcInZhbHVlXCIpO1xuICAgICAgICAgICAgc29ydCA9ICQoXCIudGFibGUtbW9kdWxlIC5vcHRpb25zLXRhYiAuZ3JhcGgtY29sb3JcIikuYXR0cihcInZhbHVlXCIpO1xuICAgICAgICAgICAgb3JkZXIgPSAkKFwiLnRhYmxlLW1vZHVsZSAub3B0aW9ucy10YWIgLmdyYXBoLWNvbG9yXCIpLmF0dHIoXCJvcmRlclwiKTtcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiBcIi9hbmFseXRpY3MvY2hhaW4tc3RvcmVcIixcbiAgICAgICAgICAgICAgICBkYXRhOiB7XCJhY3Rpb25cIjogYWN0aW9uLCBcInRlcm1fcmFuZ2VcIjogdGVybVJhbmdlLCBcInNvcnRcIjogc29ydCwgXCJvcmRlclwiOiBvcmRlciwgXCJwcm9wZXJ0eVwiOiBzdG9yZVByb3BlcnR5fSxcbiAgICAgICAgICAgICAgICB0eXBlOiBcIkdFVFwiLFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnN1Y2Nlc3MgPT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5ld1JvdyA9IFwiPHRyPjx0ZD48L3RkPjx0ZD48L3RkPjx0ZD48L3RkPjx0ZD48L3RkPjx0ZD48L3RkPjx0ZD48L3RkPjx0ZD48L3RkPjx0ZD48L3RkPjx0ZD48L3RkPjx0ZD48L3RkPjx0ZD48L3RkPjx0ZD48L3RkPjx0ZD48L3RkPjx0ZD48L3RkPjx0ZD48L3RkPjx0ZD48L3RkPjwvdHI+XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKFwidGFibGUgdGJvZHkgdHJcIikucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZGF0YS5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChcInRhYmxlIHRib2R5XCIpLmFwcGVuZChuZXdSb3cpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlpID0gaSArIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJChcInRhYmxlIHRyOmVxKFwiICsgaWkgKyBcIilcIikuYXR0cihcInZhbHVlXCIsIGRhdGEuZGF0YVtpXS5mb3JlaWduX2lkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKFwidGFibGUgdHI6ZXEoXCIgKyBpaSArIFwiKSB0ZDplcSgwKVwiKS50ZXh0KGlpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gZGF0YS5kYXRhW2ldKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluZGV4ID0gJChcInRhYmxlIHRoZWFkIHRoW3ZhbHVlPSdcIiArIGtleSArXCInXVwiKS5pbmRleCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoXCJ0YWJsZSB0cjplcShcIiArIGlpICsgXCIpIHRkOmVxKFwiICsgaW5kZXggKyBcIilcIikudGV4dChkYXRhLmRhdGFbaV1ba2V5XSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICQoJ2lucHV0OmNoZWNrYm94Om5vdCg6Y2hlY2tlZCknKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGlkZVRhYmxlQ29sKCQoXCJ0YWJsZVwiKSwgJCh0aGlzKS5hdHRyKFwidmFsdWVcIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCdpbnB1dDpjaGVja2JveDpjaGVja2VkJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3dUYWJsZUNvbCgkKFwidGFibGVcIiksICQodGhpcykuYXR0cihcInZhbHVlXCIpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIndhcmVob3VzZWFuYWx5c2lzLWNhdGVnb3J5XCI6XG4gICAgICAgICAgICB0ZXJtUmFuZ2UgPSAkKFwiLmNpcmNsZS1ncmFwaC1tb2R1bGUgLmRhdGUgLmRhdGUtY2hvaWNlZFwiKS5hdHRyKFwidmFsdWVcIik7XG4gICAgICAgICAgICBhcmcgPSAkKFwiLmNpcmNsZS1ncmFwaC1tb2R1bGUgLm9wdGlvbnMtdGFiIC5ncmFwaC1jb2xvclwiKS5hdHRyKFwidmFsdWVcIik7XG4gICAgICAgICAgICBuYW1lID0gJChcIi5jaXJjbGUtZ3JhcGgtbW9kdWxlIC5vcHRpb25zLXRhYiAuZ3JhcGgtY29sb3Igc3BhblwiKS50ZXh0KCk7XG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogXCIvYW5hbHl0aWNzL2NoYWluLXN0b3JlXCIsXG4gICAgICAgICAgICAgICAgZGF0YToge1wiYWN0aW9uXCI6IGFjdGlvbiwgXCJ0ZXJtX3JhbmdlXCI6IHRlcm1SYW5nZSwgXCJhcmdcIjogYXJnLCBcInByb3BlcnR5XCI6IHN0b3JlUHJvcGVydHl9LFxuICAgICAgICAgICAgICAgIHR5cGU6IFwiR0VUXCIsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2VzcyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgb3B0aW9uID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdG9vbHRpcDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3c6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogMTAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHJpZ2dlcjogJ2l0ZW0nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHRTdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiAnUGluZ0ZhbmdTQy1SZWd1bGFyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdHRlcjogXCJ7YX0gPGJyLz57Yn06IHtjfSAoe2R9JSlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxlZ2VuZDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yaWVudDogJ3ZlcnRpY2FsJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB4OiAnbGVmdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAnMjUwJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0OiAnMjAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcDogJzE1JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLmRhdGEuY2F0ZWdvcmllcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogJ1BpbmdGYW5nU0MtUmVndWxhcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlcmllczogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZToncGllJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcmFkaXVzOiBbJzUwJScsICc3MCUnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXZvaWRMYWJlbE92ZXJsYXA6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjZW50ZXIgOiBbJzY1JScsICc1MCUnXSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vcm1hbDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3c6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogJ1BpbmdGYW5nU0MtUmVndWxhcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVtcGhhc2lzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6ICcyMCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICdib2xkJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWxMaW5lOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub3JtYWw6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93OiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLmRhdGEuZGF0YVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiBkYXRhLmRhdGEucGFsZXR0ZVxuXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbENoYXJ0KCdjaXJjbGVfY2hhcnQnLCBvcHRpb24pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSBcIndhcmVob3VzZWFuYWx5c2lzLWluY3JlYXNlc1wiOlxuICAgICAgICAgICAgdGVybVJhbmdlID0gJChcIi5iYXItY2hhcnQtbW9kdWxlIC5kYXRlIC5kYXRlLWNob2ljZWRcIikuYXR0cihcInZhbHVlXCIpO1xuICAgICAgICAgICAgYXJnID0gJChcIi5iYXItY2hhcnQtbW9kdWxlIC5vcHRpb25zLXRhYiAuZ3JhcGgtY29sb3JcIikuYXR0cihcInZhbHVlXCIpO1xuICAgICAgICAgICAgbmFtZSA9ICQoXCIuYmFyLWNoYXJ0LW1vZHVsZSAub3B0aW9ucy10YWIgLmdyYXBoLWNvbG9yIHNwYW5cIikudGV4dCgpO1xuXG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogXCIvYW5hbHl0aWNzL2NoYWluLXN0b3JlXCIsXG4gICAgICAgICAgICAgICAgZGF0YToge1wiYWN0aW9uXCI6IGFjdGlvbiwgXCJ0ZXJtX3JhbmdlXCI6IHRlcm1SYW5nZSwgXCJhcmdcIjogYXJnLCBcInByb3BlcnR5XCI6IHN0b3JlUHJvcGVydHl9LFxuICAgICAgICAgICAgICAgIHR5cGU6IFwiR0VUXCIsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2VzcyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvcHRpb24gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG9vbHRpcCA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogMTAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRyaWdnZXI6ICdheGlzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXhpc1BvaW50ZXIgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlIDogJ3NoYWRvdydcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250RmFtaWx5OiAnUGluZ0ZhbmdTQy1SZWd1bGFyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWF0dGVyOiBcInthfSA8YnIvPntifToge2N9JVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncmlkOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNob3cgOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZWZ0IDogNzAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvcCA6IDIwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByaWdodCA6IDcwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3R0b20gOiA0MFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsY3VsYWJsZSA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgeEF4aXMgOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGUgOiAndmFsdWUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXhpc0xhYmVsOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogJ1BpbmdGYW5nU0MtUmVndWxhcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzJhMmEyYScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxMlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBheGlzTGluZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVTdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyNjY2MnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHlBeGlzIDogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlIDogJ2NhdGVnb3J5JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGF4aXNUaWNrIDoge3Nob3c6IGZhbHNlfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEuZGF0YS5jYXRlZ29yaWVzLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXhpc0xhYmVsOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udEZhbWlseTogJ1BpbmdGYW5nU0MtUmVndWxhcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzJhMmEyYScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxMlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBheGlzTGluZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpbmVTdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyNjY2MnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlcmllcyA6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6J2JhcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtU3R5bGUgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9ybWFsOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxhYmVsIDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hvdzogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiAnaW5zaWRlJ1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogZnVuY3Rpb24ocGFyYW1zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29sb3JMaXN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHBhcmFtcy5kYXRhLnZhbHVlID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvckxpc3QgPSAnI0ZGNDkxRic7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yTGlzdCA9ICcjNTNkMTk5JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBjb2xvckxpc3Q7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEuZGF0YS5kYXRhXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICAgICAgZmlsbENoYXJ0KCdiYXJfY2hhcnQnLCBvcHRpb24pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICB9XG59XG5cbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAkKFwiYVt2YWx1ZT0nd2FyZWhvdXNlYW5hbHlzaXMnXVwiKS5hZGRDbGFzcyhcInNpZGViYXItY29sb3JcIik7XG5cbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6IFwiL2FuYWx5dGljcy9jaGFpbi1zdG9yZVwiLFxuICAgICAgICBkYXRhOiB7XCJhY3Rpb25cIjogXCJ3YXJlaG91c2VhbmFseXNpcy1pbml0XCJ9LFxuICAgICAgICB0eXBlOiBcIkdFVFwiLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgaWYgKGRhdGEuc3VjY2VzcyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgJChcIi5zdG9yZS10eXBlXCIpLmFwcGVuZChcIjxzcGFuIHZhbHVlPSdcIiArIGRhdGEuZGF0YVtpXS52YWx1ZSArIFwiJz5cIiArIGRhdGEuZGF0YVtpXS5uYW1lICsgXCI8L3NwYW4+XCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBmaWxsRGF0YShcIndhcmVob3VzZWFuYWx5c2lzLWl0ZW1cIik7XG4gICAgICAgICAgICAgICAgZmlsbERhdGEoXCJ3YXJlaG91c2VhbmFseXNpcy1jYXRlZ29yeVwiKTtcbiAgICAgICAgICAgICAgICBmaWxsRGF0YShcIndhcmVob3VzZWFuYWx5c2lzLWluY3JlYXNlc1wiKTtcbiAgICAgICAgICAgICAgICAkKFwiLnN0b3JlLXR5cGUgc3BhblwiKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgICQoXCIuc3RvcmUtY29sb3JcIikucmVtb3ZlQ2xhc3MoKTtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcyhcInN0b3JlLWNvbG9yXCIpO1xuICAgICAgICAgICAgICAgICAgICBmaWxsRGF0YShcIndhcmVob3VzZWFuYWx5c2lzLWl0ZW1cIik7XG4gICAgICAgICAgICAgICAgICAgIGZpbGxEYXRhKFwid2FyZWhvdXNlYW5hbHlzaXMtY2F0ZWdvcnlcIik7XG4gICAgICAgICAgICAgICAgICAgIGZpbGxEYXRhKFwid2FyZWhvdXNlYW5hbHlzaXMtaW5jcmVhc2VzXCIpO1xuICAgICAgICAgICAgICAgICAgICBnYSgnc2VuZCcsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGhpdFR5cGU6ICdldmVudCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBldmVudENhdGVnb3J5OiAnd2FyZWhvdXNlYW5hbHlzaXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRBY3Rpb246ICdzdG9yZS10eXBlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50TGFiZWw6ICQodGhpcykudGV4dCgpXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cblxuICAgICQoXCIuZGF0ZSBsaVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmKCQodGhpcykuYXR0cihcInZhbHVlXCIpID09IFwiOFwiICYmICgkKHRoaXMpLnBhcmVudHMoXCIuYmFyLWNoYXJ0LW1vZHVsZVwiKS5maW5kKFwiLmdyYXBoLWNvbG9yXCIpLmF0dHIoXCJ2YWx1ZVwiKSA9PSBcImdyb3NzX3Byb2ZpdFwiIHx8ICQodGhpcykucGFyZW50cyhcIi5iYXItY2hhcnQtbW9kdWxlXCIpLmZpbmQoXCIuZ3JhcGgtY29sb3JcIikuYXR0cihcInZhbHVlXCIpID09IFwiY3Jvc3NfcmF0aW9cIiB8fCAkKHRoaXMpLnBhcmVudHMoXCIuYmFyLWNoYXJ0LW1vZHVsZVwiKS5maW5kKFwiLmdyYXBoLWNvbG9yXCIpLmF0dHIoXCJ2YWx1ZVwiKSA9PSBcInNhbGVzXCIgfHwgJCh0aGlzKS5wYXJlbnRzKFwiLmJhci1jaGFydC1tb2R1bGVcIikuZmluZChcIi5ncmFwaC1jb2xvclwiKS5hdHRyKFwidmFsdWVcIikgPT0gXCJudW1cIikpe1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmKCQodGhpcykuYXR0cihcInZhbHVlXCIpID09IFwiOFwiICYmICgkKHRoaXMpLnBhcmVudHMoXCIuY2lyY2xlLWdyYXBoLW1vZHVsZVwiKS5maW5kKFwiLmdyYXBoLWNvbG9yXCIpLmF0dHIoXCJ2YWx1ZVwiKSA9PSBcImNyb3NzX3JhdGlvXCIpKXtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKFwiLmRhdGUtY2hvaWNlZFwiKS5yZW1vdmVDbGFzcygpO1xuICAgICAgICAkKHRoaXMpLmFkZENsYXNzKFwiZGF0ZS1jaG9pY2VkXCIpO1xuICAgICAgICBnYSgnc2VuZCcsIHtcbiAgICAgICAgICAgIGhpdFR5cGU6ICdldmVudCcsXG4gICAgICAgICAgICBldmVudENhdGVnb3J5OiAnd2FyZWhvdXNlYW5hbHlzaXMnLFxuICAgICAgICAgICAgZXZlbnRBY3Rpb246ICdkYXRlJyxcbiAgICAgICAgICAgIGV2ZW50TGFiZWw6ICQodGhpcykudGV4dCgpXG4gICAgICAgIH0pO1xuXG4gICAgICAgIHZhciBfbGVmdCA9ICQodGhpcykuc2Nyb2xsTGVmdCgpO1xuICAgICAgICAkKCd0YWJsZSB0aCcpLmVxKDApLmNzcygnbGVmdCcsIF9sZWZ0KTtcbiAgICAgICAgJCgndGFibGUgdGgnKS5lcSgxKS5jc3MoJ2xlZnQnLCBfbGVmdCkuYWRkQ2xhc3MoJ2JveC1zaGFkb3cnKTtcbiAgICAgICAgJCgndGFibGUgdGQ6bnRoLWNoaWxkKDEpJykuY3NzKCdsZWZ0JywgX2xlZnQpO1xuICAgICAgICAkKCd0YWJsZSB0ZDpudGgtY2hpbGQoMiknKS5jc3MoJ2xlZnQnLCBfbGVmdCkuYWRkQ2xhc3MoJ2JveC1zaGFkb3cnKTtcbiAgICAgICAgaWYgKE51bWJlcigkKHRoaXMpLnNjcm9sbExlZnQoKSkgPT0gMCkge1xuICAgICAgICAgICAgJCgndGFibGUgdGgnKS5lcSgxKS5yZW1vdmVDbGFzcygnYm94LXNoYWRvdycpO1xuICAgICAgICAgICAgJCgndGFibGUgdGQ6bnRoLWNoaWxkKDIpJykucmVtb3ZlQ2xhc3MoJ2JveC1zaGFkb3cnKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgJChcIi5vcHRpb25zLXRhYiBsaVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIGlmKCgkKHRoaXMpLmF0dHIoXCJ2YWx1ZVwiKSA9PSBcImdyb3NzX3Byb2ZpdFwiIHx8ICQodGhpcykuYXR0cihcInZhbHVlXCIpID09IFwiY3Jvc3NfcmF0aW9cIiB8fCAkKHRoaXMpLmF0dHIoXCJ2YWx1ZVwiKSA9PSBcImNyb3NzX3JhdGlvXCIgPT0gXCJzYWxlc1wiIHx8ICQodGhpcykuYXR0cihcInZhbHVlXCIpID09IFwiY3Jvc3NfcmF0aW9cIiA9PSBcIm51bVwiKSAmJiAkKHRoaXMpLnBhcmVudHMoXCIuYmFyLWNoYXJ0LW1vZHVsZVwiKS5maW5kKFwiLmRhdGUgLmRhdGUtY2hvaWNlZFwiKS5hdHRyKFwidmFsdWVcIikgPT0gXCI4XCIpe1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGlmKCgkKHRoaXMpLmF0dHIoXCJ2YWx1ZVwiKSA9PSBcImNyb3NzX3JhdGlvXCIpICYmICQodGhpcykucGFyZW50cyhcIi5jaXJjbGUtZ3JhcGgtbW9kdWxlXCIpLmZpbmQoXCIuZGF0ZSAuZGF0ZS1jaG9pY2VkXCIpLmF0dHIoXCJ2YWx1ZVwiKSA9PSBcIjhcIil7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgJCh0aGlzKS5zaWJsaW5ncyhcIi5ncmFwaC1jb2xvclwiKS5yZW1vdmVDbGFzcygpO1xuICAgICAgICAkKHRoaXMpLmFkZENsYXNzKFwiZ3JhcGgtY29sb3JcIik7XG5cbiAgICB9KTtcblxuICAgICQoXCIuYWRkLWltYWdlLXNwZWNpYWw6ZXEoMClcIikuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIG9wID0gJChcIi5leHBsYWluLWJveC1zcGVjaWFsXCIpLmF0dHIoXCJoaWRkZW5cIikgPT0gXCJoaWRkZW5cIiA/ICQoXCIuZXhwbGFpbi1ib3gtc3BlY2lhbFwiKS5yZW1vdmVBdHRyKFwiaGlkZGVuXCIpIDogJChcIi5leHBsYWluLWJveC1zcGVjaWFsXCIpLmF0dHIoXCJoaWRkZW5cIiwgXCJoaWRkZW5cIik7XG4gICAgfSk7XG4gICAgJChcIi5hZGQtaW1hZ2Utc3BlY2lhbDplcSgxKVwiKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICB2YXIgb3AgPSAkKFwiLmFkZC1pdGVtcy1zcGVjaWFsXCIpLmF0dHIoXCJoaWRkZW5cIikgPT0gXCJoaWRkZW5cIiA/ICQoXCIuYWRkLWl0ZW1zLXNwZWNpYWxcIikucmVtb3ZlQXR0cihcImhpZGRlblwiKSA6ICQoXCIuYWRkLWl0ZW1zLXNwZWNpYWxcIikuYXR0cihcImhpZGRlblwiLCBcImhpZGRlblwiKTtcbiAgICB9KTtcblxuICAgICQoXCIuZmxvYXQtcmlnaHQgaW5wdXQ6ZXEoMCksIC5mbG9hdC1yaWdodCBpbnB1dDplcSgxKVwiKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAkKFwiLmFkZC1pdGVtcy1zcGVjaWFsXCIpLmF0dHIoXCJoaWRkZW5cIiwgXCJoaWRkZW5cIik7XG4gICAgfSk7XG4gICAgJChcIi5mbG9hdC1yaWdodCBpbnB1dDplcSgyKVwiKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAkKFwiLmFkZC1pdGVtcy1zcGVjaWFsXCIpLmF0dHIoXCJoaWRkZW5cIiwgXCJoaWRkZW5cIik7XG5cbiAgICAgICAgJCgnaW5wdXQ6Y2hlY2tib3g6bm90KDpjaGVja2VkKScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGhpZGVUYWJsZUNvbCgkKFwidGFibGVcIiksICQodGhpcykuYXR0cihcInZhbHVlXCIpKTtcbiAgICAgICAgfSk7XG4gICAgICAgICQoJ2lucHV0OmNoZWNrYm94OmNoZWNrZWQnKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBzaG93VGFibGVDb2woJChcInRhYmxlXCIpLCAkKHRoaXMpLmF0dHIoXCJ2YWx1ZVwiKSk7XG4gICAgICAgIH0pO1xuICAgICAgICBzZXRUYmFsZVdpZHRoKCk7XG4gICAgfSk7XG5cbiAgICAkKFwiLmNpcmNsZS1ncmFwaC1tb2R1bGUgLmRhdGUgbGksLmNpcmNsZS1ncmFwaC1tb2R1bGUgLm9wdGlvbnMtdGFiIGxpXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIGZpbGxEYXRhKFwid2FyZWhvdXNlYW5hbHlzaXMtY2F0ZWdvcnlcIik7XG4gICAgICAgIGdhKCdzZW5kJywge1xuICAgICAgICAgICAgaGl0VHlwZTogJ2V2ZW50JyxcbiAgICAgICAgICAgIGV2ZW50Q2F0ZWdvcnk6ICd3YXJlaG91c2VhbmFseXNpcycsXG4gICAgICAgICAgICBldmVudEFjdGlvbjogJ2NhdGVnb3J5JyxcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAkKFwiLmJhci1jaGFydC1tb2R1bGUgLmRhdGUgbGksLmJhci1jaGFydC1tb2R1bGUgLm9wdGlvbnMtdGFiIGxpXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIGZpbGxEYXRhKFwid2FyZWhvdXNlYW5hbHlzaXMtaW5jcmVhc2VzXCIpO1xuICAgICAgICBnYSgnc2VuZCcsIHtcbiAgICAgICAgICAgIGhpdFR5cGU6ICdldmVudCcsXG4gICAgICAgICAgICBldmVudENhdGVnb3J5OiAnd2FyZWhvdXNlYW5hbHlzaXMnLFxuICAgICAgICAgICAgZXZlbnRBY3Rpb246ICdpbmNyZWFzZXMnLFxuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgICQoXCIudGFibGUtbW9kdWxlIC5kYXRlIGxpLC50YWJsZS1tb2R1bGUgLm9wdGlvbnMtdGFiIGxpXCIpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIGZpbGxEYXRhKFwid2FyZWhvdXNlYW5hbHlzaXMtaXRlbVwiKTtcbiAgICAgICAgZ2EoJ3NlbmQnLCB7XG4gICAgICAgICAgICBoaXRUeXBlOiAnZXZlbnQnLFxuICAgICAgICAgICAgZXZlbnRDYXRlZ29yeTogJ3dhcmVob3VzZWFuYWx5c2lzJyxcbiAgICAgICAgICAgIGV2ZW50QWN0aW9uOiAnaXRlbScsXG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG5cbiAgICAkKFwiLnRhYmxlLW1vZHVsZSAuZG93bmxvYWRcIikuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgJChcInRhYmxlXCIpLnRhYmxlRXhwb3J0KHtcbiAgICAgICAgICAgIGhlYWRpbmdzOiB0cnVlLFxuICAgICAgICAgICAgZmlsZU5hbWU6IFwiaXRlbXNcIixcbiAgICAgICAgICAgIGZvcm1hdHM6IFtcImNzdlwiXSxcbiAgICAgICAgICAgIHBvc2l0aW9uOiBcImJvdHRvbVwiLFxuICAgICAgICAgICAgaWdub3JlQ1NTOiBcIltzdHlsZSo9J2Rpc3BsYXk6IG5vbmUnXVwiXG4gICAgICAgIH0pO1xuICAgICAgICBnYSgnc2VuZCcsIHtcbiAgICAgICAgICAgIGhpdFR5cGU6ICdldmVudCcsXG4gICAgICAgICAgICBldmVudENhdGVnb3J5OiAnd2FyZWhvdXNlYW5hbHlzaXMnLFxuICAgICAgICAgICAgZXZlbnRBY3Rpb246ICdkb3dubG9hZCcsXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIHRhYmxlU2Nyb2xsRnVuKCk7XG59KTsiXSwiZmlsZSI6ImFuYWx5dGljcy93YXJlaG91c2VfYW5hbHlzaXMuanMifQ==
