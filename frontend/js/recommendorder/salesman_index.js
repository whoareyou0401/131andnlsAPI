(function() {
    var tt=$('.home-info-nav').height();
    var cc=$('.cm_banner').height();
    var dd=$('.cm_info_con').height();
    var ww=$(window).height();
    $('.cm_menu').height(ww-tt-cc-dd);
    var url = window.location.href;
    var salesman_id = Number(url.match(/(salesman\/)\d+\//)[0].split('/')[1]);

    $.ajax({
        url: "/api/v1.1/recommendorder/salesman/" + salesman_id + "/",
        type: 'get',
        datatype: 'json',    
        success: function(res){
            console.log(res.data);
            var result = res.data;
            $('.info_title_name').text(result.name);
            $('.info_title_date').text(result.date);
            // 基于准备好的dom，初始化echarts实例
            var info_sale = echarts.init(document.getElementById("info_sale"));
            var info_unitPrice = echarts.init(document.getElementById("info_unitPrice"));
            var info_orderFinish = echarts.init(document.getElementById("info_orderFinish"));
            // 指定图表的配置项和数据
            var labelTop = {
                normal : {
                    color: '#ffbc0c',//半圆环颜色
                    label : {
                        show : true,//是否显示中间文字
                        position : 'center',
                        formatter : '{b}',//文本格式器
                        textStyle: {
                            color: '#999999',//中间文字颜色
                            fontSize: 10,//中间文字大小
                            baseline : 'center',//中间文字垂直对齐方式
                            fontWeight: 'bolder'
                        }
                    },
                    labelLine : {
                        show : false
                    }
                }
            };
            var labelTop1 = {
                normal : {
                    color: '#ff4a0c',
                    label : {
                        show : true,
                        position : 'center',
                        formatter : '{b}',
                        textStyle: {
                            color: '#999999',
                            fontSize: 10,
                            baseline : 'top',
                            fontWeight: 'bolder'
                        }
                    },
                    labelLine : {
                        show : false
                    }
                }
            };
            var labelTop2 = {
                normal : {
                    color: '#5dd491',
                    label : {
                        show : true,
                        position : 'center',
                        formatter : '{b}',
                        textStyle: {
                            color: '#999999',
                            fontSize: 10,
                            baseline : 'top',
                            fontWeight: 'bolder'
                        }
                    },
                    labelLine : {
                        show : false
                    }
                }
            };
            var labelFromatter = {
                normal : {
                    label : {
                        formatter : function (params){
                            return 100 - params.value + '%';
                        },

                        textStyle: {
                            align: 'center',
                            color: '#ffbc0c',
                            baseline : 'top',
                            fontSize: 12,
                            fontWeight: 'bolder'
                        }
                    }
                },
            };
            var labelFromatter1 = {
                normal : {
                    label : {
                        formatter : function (params){
                            return 100 - params.value + '%';
                        },

                        textStyle: {
                            color: '#ff4a0c',
                            baseline : 'bottom',
                            fontSize: 12,
                            fontWeight: 'bolder'
                        }
                    }
                },
            };
            var labelFromatter2 = {
                normal : {
                    label : {
                        formatter : function (params){
                            return 100 - params.value + '%';
                        },

                        textStyle: {
                            color: '#5dd491',
                            baseline : 'bottom',
                            fontSize: 12,
                            fontWeight: 'bolder'
                        }
                    }
                },
            };
            var labelBottom = {
                normal : {
                    color: '#f2f2f2',
                    label : {
                        show : true,
                        position : 'center',
                    },
                    labelLine : {
                        show : false
                    }
                },
                emphasis: {
                    color: 'rgba(0,0,0,0)'
                }
            };
            var radius = ['83%', '98%'];
            var option = {
                legend: {
                    x : 'center',
                    y : 'center'
                },
                title : {
                    text: Number(result.sales).toFixed(2),
                    subtext: '销售额',
                    itemGap: 15,
                    textStyle: {
                        fontSize: 12,
                        fontWeight: 'bolder',
                        color: '#333333'
                    },
                    subtextStyle: {
                        fontSize: 12,
                        // fontWeight: 'bolder',
                        color: '#666666'
                    }, 
                    x: 'center',
                    y: '54%'
                },
                series : [
                {
                    type : 'pie',
                    center : ['50%', '25%'],
                    radius : radius,
                    startAngle: 90,
                    x: '0%', 
                    itemStyle : labelFromatter,
                    data : [
                    {name:'击败同行', value:Number(result.sales_beat).toFixed(2) * 100, itemStyle : labelTop},
                    {name:'other', value:100 - Number(result.sales_beat).toFixed(2) * 100,itemStyle : labelBottom}
                    ]
                }
                ]
            };
            var option1 = {
                legend: {
                    x : 'center',
                    y : 'center'
                },
                title : {
                    text: Number(result.avg_per_trans).toFixed(2),
                    subtext: '客单价',
                    itemGap: 15,
                    textStyle: {
                        fontSize: 12,
                        fontWeight: 'bolder',
                        color: '#333333'
                    },
                    subtextStyle: {
                        fontSize: 12,
                        // fontWeight: 'bolder',
                        color: '#666666'
                    }, 
                    x: 'center',
                    y: '54%'
                },
                series : [
                {
                    type : 'pie',
                    center : ['50%', '25%'],
                    radius : radius,
                    startAngle: 90,
                    x: '0%', 
                    itemStyle : labelFromatter1,
                    data : [
                    {name:'击败同行', value:Number(result.per_trans_beat).toFixed(2) * 100, itemStyle : labelTop1},
                    {name:'other', value:100 - Number(result.per_trans_beat).toFixed(2) * 100,itemStyle : labelBottom}
                    ]
                }
                ]
            };
            var option2 = {
                legend: {
                    x : 'center',
                    y : 'center'
                },
                title : {
                    text: Number(result.complete).toFixed(2),
                    subtext: '订单完成率',
                    itemGap: 15,
                    textStyle: {
                        fontSize: 12,
                        fontWeight: 'bolder',
                        color: '#333333'
                    },
                    subtextStyle: {
                        fontSize: 12,
                        // fontWeight: 'bolder',
                        color: '#666666'
                    }, 
                    x: 'center',
                    y: '54%'
                },
                series : [
                {
                    type : 'pie',
                    center : ['50%', '25%'],
                    radius : radius,
                    startAngle: 90,
                    x: '0%', 
                    itemStyle : labelFromatter2,
                    data : [
                    {name:'完成率', value:Number(result.complete_rate).toFixed(2) * 100, itemStyle : labelTop2},
                    {name:'other', value:100 - Number(result.complete_rate).toFixed(2) * 100,itemStyle : labelBottom}
                    ]
                }
                ]
            };

            // 使用刚指定的配置项和数据显示图表。
            info_sale.setOption(option);
            info_unitPrice.setOption(option1);
            info_orderFinish.setOption(option2);    
        }
    });
})();
