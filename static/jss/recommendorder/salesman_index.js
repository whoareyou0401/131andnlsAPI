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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9zYWxlc21hbl9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKSB7XG4gICAgdmFyIHR0PSQoJy5ob21lLWluZm8tbmF2JykuaGVpZ2h0KCk7XG4gICAgdmFyIGNjPSQoJy5jbV9iYW5uZXInKS5oZWlnaHQoKTtcbiAgICB2YXIgZGQ9JCgnLmNtX2luZm9fY29uJykuaGVpZ2h0KCk7XG4gICAgdmFyIHd3PSQod2luZG93KS5oZWlnaHQoKTtcbiAgICAkKCcuY21fbWVudScpLmhlaWdodCh3dy10dC1jYy1kZCk7XG4gICAgdmFyIHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgIHZhciBzYWxlc21hbl9pZCA9IE51bWJlcih1cmwubWF0Y2goLyhzYWxlc21hblxcLylcXGQrXFwvLylbMF0uc3BsaXQoJy8nKVsxXSk7XG5cbiAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6IFwiL2FwaS92MS4xL3JlY29tbWVuZG9yZGVyL3NhbGVzbWFuL1wiICsgc2FsZXNtYW5faWQgKyBcIi9cIixcbiAgICAgICAgdHlwZTogJ2dldCcsXG4gICAgICAgIGRhdGF0eXBlOiAnanNvbicsICAgIFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpe1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzLmRhdGEpO1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHJlcy5kYXRhO1xuICAgICAgICAgICAgJCgnLmluZm9fdGl0bGVfbmFtZScpLnRleHQocmVzdWx0Lm5hbWUpO1xuICAgICAgICAgICAgJCgnLmluZm9fdGl0bGVfZGF0ZScpLnRleHQocmVzdWx0LmRhdGUpO1xuICAgICAgICAgICAgLy8g5Z+65LqO5YeG5aSH5aW955qEZG9t77yM5Yid5aeL5YyWZWNoYXJ0c+WunuS+i1xuICAgICAgICAgICAgdmFyIGluZm9fc2FsZSA9IGVjaGFydHMuaW5pdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImluZm9fc2FsZVwiKSk7XG4gICAgICAgICAgICB2YXIgaW5mb191bml0UHJpY2UgPSBlY2hhcnRzLmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJpbmZvX3VuaXRQcmljZVwiKSk7XG4gICAgICAgICAgICB2YXIgaW5mb19vcmRlckZpbmlzaCA9IGVjaGFydHMuaW5pdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImluZm9fb3JkZXJGaW5pc2hcIikpO1xuICAgICAgICAgICAgLy8g5oyH5a6a5Zu+6KGo55qE6YWN572u6aG55ZKM5pWw5o2uXG4gICAgICAgICAgICB2YXIgbGFiZWxUb3AgPSB7XG4gICAgICAgICAgICAgICAgbm9ybWFsIDoge1xuICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyNmZmJjMGMnLC8v5Y2K5ZyG546v6aKc6ImyXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsIDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hvdyA6IHRydWUsLy/mmK/lkKbmmL7npLrkuK3pl7TmloflrZdcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uIDogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXR0ZXIgOiAne2J9JywvL+aWh+acrOagvOW8j+WZqFxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjOTk5OTk5JywvL+S4remXtOaWh+Wtl+minOiJslxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxMCwvL+S4remXtOaWh+Wtl+Wkp+Wwj1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhc2VsaW5lIDogJ2NlbnRlcicsLy/kuK3pl7TmloflrZflnoLnm7Tlr7npvZDmlrnlvI9cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnYm9sZGVyJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBsYWJlbExpbmUgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93IDogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB2YXIgbGFiZWxUb3AxID0ge1xuICAgICAgICAgICAgICAgIG5vcm1hbCA6IHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICcjZmY0YTBjJyxcbiAgICAgICAgICAgICAgICAgICAgbGFiZWwgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93IDogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uIDogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3JtYXR0ZXIgOiAne2J9JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHRTdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzk5OTk5OScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDEwLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhc2VsaW5lIDogJ3RvcCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogJ2JvbGRlcidcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgbGFiZWxMaW5lIDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hvdyA6IGZhbHNlXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdmFyIGxhYmVsVG9wMiA9IHtcbiAgICAgICAgICAgICAgICBub3JtYWwgOiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzVkZDQ5MScsXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsIDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hvdyA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbiA6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWF0dGVyIDogJ3tifScsXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM5OTk5OTknLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRTaXplOiAxMCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiYXNlbGluZSA6ICd0b3AnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICdib2xkZXInXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsTGluZSA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3cgOiBmYWxzZVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHZhciBsYWJlbEZyb21hdHRlciA9IHtcbiAgICAgICAgICAgICAgICBub3JtYWwgOiB7XG4gICAgICAgICAgICAgICAgICAgIGxhYmVsIDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWF0dGVyIDogZnVuY3Rpb24gKHBhcmFtcyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIDEwMCAtIHBhcmFtcy52YWx1ZSArICclJztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHRTdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsaWduOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyNmZmJjMGMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhc2VsaW5lIDogJ3RvcCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDEyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICdib2xkZXInXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHZhciBsYWJlbEZyb21hdHRlcjEgPSB7XG4gICAgICAgICAgICAgICAgbm9ybWFsIDoge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbCA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdHRlciA6IGZ1bmN0aW9uIChwYXJhbXMpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAxMDAgLSBwYXJhbXMudmFsdWUgKyAnJSc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyNmZjRhMGMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhc2VsaW5lIDogJ2JvdHRvbScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDEyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICdib2xkZXInXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHZhciBsYWJlbEZyb21hdHRlcjIgPSB7XG4gICAgICAgICAgICAgICAgbm9ybWFsIDoge1xuICAgICAgICAgICAgICAgICAgICBsYWJlbCA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcm1hdHRlciA6IGZ1bmN0aW9uIChwYXJhbXMpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiAxMDAgLSBwYXJhbXMudmFsdWUgKyAnJSc7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0U3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM1ZGQ0OTEnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhc2VsaW5lIDogJ2JvdHRvbScsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDEyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvbnRXZWlnaHQ6ICdib2xkZXInXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHZhciBsYWJlbEJvdHRvbSA9IHtcbiAgICAgICAgICAgICAgICBub3JtYWwgOiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnI2YyZjJmMicsXG4gICAgICAgICAgICAgICAgICAgIGxhYmVsIDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2hvdyA6IHRydWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbiA6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBsYWJlbExpbmUgOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93IDogZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZW1waGFzaXM6IHtcbiAgICAgICAgICAgICAgICAgICAgY29sb3I6ICdyZ2JhKDAsMCwwLDApJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB2YXIgcmFkaXVzID0gWyc4MyUnLCAnOTglJ107XG4gICAgICAgICAgICB2YXIgb3B0aW9uID0ge1xuICAgICAgICAgICAgICAgIGxlZ2VuZDoge1xuICAgICAgICAgICAgICAgICAgICB4IDogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICAgIHkgOiAnY2VudGVyJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdGl0bGUgOiB7XG4gICAgICAgICAgICAgICAgICAgIHRleHQ6IE51bWJlcihyZXN1bHQuc2FsZXMpLnRvRml4ZWQoMiksXG4gICAgICAgICAgICAgICAgICAgIHN1YnRleHQ6ICfplIDllK7pop0nLFxuICAgICAgICAgICAgICAgICAgICBpdGVtR2FwOiAxNSxcbiAgICAgICAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTIsXG4gICAgICAgICAgICAgICAgICAgICAgICBmb250V2VpZ2h0OiAnYm9sZGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzMzMzMzMydcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgc3VidGV4dFN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTIsXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBmb250V2VpZ2h0OiAnYm9sZGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yOiAnIzY2NjY2NidcbiAgICAgICAgICAgICAgICAgICAgfSwgXG4gICAgICAgICAgICAgICAgICAgIHg6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgICB5OiAnNTQlJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2VyaWVzIDogW1xuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZSA6ICdwaWUnLFxuICAgICAgICAgICAgICAgICAgICBjZW50ZXIgOiBbJzUwJScsICcyNSUnXSxcbiAgICAgICAgICAgICAgICAgICAgcmFkaXVzIDogcmFkaXVzLFxuICAgICAgICAgICAgICAgICAgICBzdGFydEFuZ2xlOiA5MCxcbiAgICAgICAgICAgICAgICAgICAgeDogJzAlJywgXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1TdHlsZSA6IGxhYmVsRnJvbWF0dGVyLFxuICAgICAgICAgICAgICAgICAgICBkYXRhIDogW1xuICAgICAgICAgICAgICAgICAgICB7bmFtZTon5Ye76LSl5ZCM6KGMJywgdmFsdWU6TnVtYmVyKHJlc3VsdC5zYWxlc19iZWF0KS50b0ZpeGVkKDIpICogMTAwLCBpdGVtU3R5bGUgOiBsYWJlbFRvcH0sXG4gICAgICAgICAgICAgICAgICAgIHtuYW1lOidvdGhlcicsIHZhbHVlOjEwMCAtIE51bWJlcihyZXN1bHQuc2FsZXNfYmVhdCkudG9GaXhlZCgyKSAqIDEwMCxpdGVtU3R5bGUgOiBsYWJlbEJvdHRvbX1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdmFyIG9wdGlvbjEgPSB7XG4gICAgICAgICAgICAgICAgbGVnZW5kOiB7XG4gICAgICAgICAgICAgICAgICAgIHggOiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICAgICAgeSA6ICdjZW50ZXInXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB0aXRsZSA6IHtcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogTnVtYmVyKHJlc3VsdC5hdmdfcGVyX3RyYW5zKS50b0ZpeGVkKDIpLFxuICAgICAgICAgICAgICAgICAgICBzdWJ0ZXh0OiAn5a6i5Y2V5Lu3JyxcbiAgICAgICAgICAgICAgICAgICAgaXRlbUdhcDogMTUsXG4gICAgICAgICAgICAgICAgICAgIHRleHRTdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDEyLFxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogJ2JvbGRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzMzMzMzMnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHN1YnRleHRTdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDEyLFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZm9udFdlaWdodDogJ2JvbGRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM2NjY2NjYnXG4gICAgICAgICAgICAgICAgICAgIH0sIFxuICAgICAgICAgICAgICAgICAgICB4OiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICAgICAgeTogJzU0JSdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNlcmllcyA6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGUgOiAncGllJyxcbiAgICAgICAgICAgICAgICAgICAgY2VudGVyIDogWyc1MCUnLCAnMjUlJ10sXG4gICAgICAgICAgICAgICAgICAgIHJhZGl1cyA6IHJhZGl1cyxcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRBbmdsZTogOTAsXG4gICAgICAgICAgICAgICAgICAgIHg6ICcwJScsIFxuICAgICAgICAgICAgICAgICAgICBpdGVtU3R5bGUgOiBsYWJlbEZyb21hdHRlcjEsXG4gICAgICAgICAgICAgICAgICAgIGRhdGEgOiBbXG4gICAgICAgICAgICAgICAgICAgIHtuYW1lOiflh7votKXlkIzooYwnLCB2YWx1ZTpOdW1iZXIocmVzdWx0LnBlcl90cmFuc19iZWF0KS50b0ZpeGVkKDIpICogMTAwLCBpdGVtU3R5bGUgOiBsYWJlbFRvcDF9LFxuICAgICAgICAgICAgICAgICAgICB7bmFtZTonb3RoZXInLCB2YWx1ZToxMDAgLSBOdW1iZXIocmVzdWx0LnBlcl90cmFuc19iZWF0KS50b0ZpeGVkKDIpICogMTAwLGl0ZW1TdHlsZSA6IGxhYmVsQm90dG9tfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB2YXIgb3B0aW9uMiA9IHtcbiAgICAgICAgICAgICAgICBsZWdlbmQ6IHtcbiAgICAgICAgICAgICAgICAgICAgeCA6ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgICB5IDogJ2NlbnRlcidcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHRpdGxlIDoge1xuICAgICAgICAgICAgICAgICAgICB0ZXh0OiBOdW1iZXIocmVzdWx0LmNvbXBsZXRlKS50b0ZpeGVkKDIpLFxuICAgICAgICAgICAgICAgICAgICBzdWJ0ZXh0OiAn6K6i5Y2V5a6M5oiQ546HJyxcbiAgICAgICAgICAgICAgICAgICAgaXRlbUdhcDogMTUsXG4gICAgICAgICAgICAgICAgICAgIHRleHRTdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDEyLFxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udFdlaWdodDogJ2JvbGRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMzMzMzMzMnXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHN1YnRleHRTdHlsZToge1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9udFNpemU6IDEyLFxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZm9udFdlaWdodDogJ2JvbGRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyM2NjY2NjYnXG4gICAgICAgICAgICAgICAgICAgIH0sIFxuICAgICAgICAgICAgICAgICAgICB4OiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICAgICAgeTogJzU0JSdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNlcmllcyA6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHR5cGUgOiAncGllJyxcbiAgICAgICAgICAgICAgICAgICAgY2VudGVyIDogWyc1MCUnLCAnMjUlJ10sXG4gICAgICAgICAgICAgICAgICAgIHJhZGl1cyA6IHJhZGl1cyxcbiAgICAgICAgICAgICAgICAgICAgc3RhcnRBbmdsZTogOTAsXG4gICAgICAgICAgICAgICAgICAgIHg6ICcwJScsIFxuICAgICAgICAgICAgICAgICAgICBpdGVtU3R5bGUgOiBsYWJlbEZyb21hdHRlcjIsXG4gICAgICAgICAgICAgICAgICAgIGRhdGEgOiBbXG4gICAgICAgICAgICAgICAgICAgIHtuYW1lOiflrozmiJDnjocnLCB2YWx1ZTpOdW1iZXIocmVzdWx0LmNvbXBsZXRlX3JhdGUpLnRvRml4ZWQoMikgKiAxMDAsIGl0ZW1TdHlsZSA6IGxhYmVsVG9wMn0sXG4gICAgICAgICAgICAgICAgICAgIHtuYW1lOidvdGhlcicsIHZhbHVlOjEwMCAtIE51bWJlcihyZXN1bHQuY29tcGxldGVfcmF0ZSkudG9GaXhlZCgyKSAqIDEwMCxpdGVtU3R5bGUgOiBsYWJlbEJvdHRvbX1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAvLyDkvb/nlKjliJrmjIflrprnmoTphY3nva7pobnlkozmlbDmja7mmL7npLrlm77ooajjgIJcbiAgICAgICAgICAgIGluZm9fc2FsZS5zZXRPcHRpb24ob3B0aW9uKTtcbiAgICAgICAgICAgIGluZm9fdW5pdFByaWNlLnNldE9wdGlvbihvcHRpb24xKTtcbiAgICAgICAgICAgIGluZm9fb3JkZXJGaW5pc2guc2V0T3B0aW9uKG9wdGlvbjIpOyAgICBcbiAgICAgICAgfVxuICAgIH0pO1xufSkoKTtcbiJdLCJmaWxlIjoicmVjb21tZW5kb3JkZXIvc2FsZXNtYW5faW5kZXguanMifQ==
