$(document).ready(function() {
    var source = $('#param_source').attr('name');
    var area = $('#param_area').attr('name');
    var skuid = $('#collect_btn').attr('name');
    var grand = $('#product_grand').attr('name');

    function getProductsInfo(url) {
        $.ajax({
            url: url,
            type: 'GET',
            statusCode: {
                404:function(){
                    alert('您查看的商品已下架');
                }
            },
            success:function(data){
                $('#product_name').html(data.results[0].name);
                $('#product_price').html('¥' + data.results[0].price);
                $('#image_url').attr('src',data.results[0].image_url);
                // 商品分
                var good_score = data.results[0].score;
                var score = good_score.toFixed(2);
                $('#product_score').html(score);

                var rankNum = data.results[0].date_rank.split(',').length;
                var getRank = [];
                for (var i = 0; i < rankNum; i++) {
                    var everyRank = (data.results[0].date_rank).split(',')[i].split(':')[1];
                    getRank.push(everyRank);
                }

                var getRankDate = [];
                for (var j = 0; j < rankNum; j++) {
                    var everyRankDate = (data.results[0].date_rank).split(',')[j].split(':')[0];
                    getRankDate.push(everyRankDate);
                }
                graph(getRankDate,getRank);

                $('.homepage:eq(0)>a').css('color', '#ff5422');
                $('.homepage:eq(0)>div').addClass('triangle');
            }
        });
    }

    // 折线图
    function graph(rankDate,rank){
        //初始化
        var myChart = echarts.init(document.getElementById('main'));
        //参数设置
        option = {
                //提示框组件：坐标轴触发
                tooltip: {
                    trigger: 'axis',
                },
                //图例组件
                legend: {
                    data: ['商品销量排名'],
                    textStyle: {
                        fontSize: 14,
                    },
                },
                //直角坐标系内绘图网格
                grid: {
                    // 距离左侧容器的距离
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true,
                },
                //工具栏
                toolbox: {
                    feature: {
                        // 保存图片
                        saveAsImage: {},
                    },
                },
                //直角坐标系 grid 中的 x 轴
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: rankDate,
                    axisLine: {
                        onZero: false,
                        lineStyle: {
                            color: '#008ACD',
                            width: 1,
                        },
                    },
                },
                //直角坐标系 grid 中的 y 轴
                yAxis: {
                    type: 'value',
                    inverse: true,
                    nameLocation: 'start',
                    nameTextStyle: {
                        fontSize: 14,
                    },
                    axisLine: {
                        lineStyle: {
                            color: '#008ACD',
                            width: 1,
                        },
                    },
                },
                //系列列表
                series: [
                    {
                        name: '商品销量排名',
                        type: 'line',
                        stack: '总量',
                        data: rank,
                    }
                ]

            };
        //参数设置方法
        myChart.setOption(option);
    }

    function judgeSourchFun(){
        // 判断当前商城
        var currentMall = $('#store_list>li[name='+ source +']');
        $(currentMall).children().attr('target','_Blank');
        $(currentMall).show().siblings().hide();

        // 判断当前日期段
        $('.ui.right.floated.button').each(function() {
            if ($(this).attr('name') == grand) {
                $(this).addClass('red');
            }
        });
    }

    function collectProductsFun(){
        $('#collect_btn').click(function(){
            var product_name = $('h3').html();
            var product_image = $('#image_url').attr('src');
            $.ajax({
                url: 'product-collect?skuid='+ skuid +'&name='+ product_name +'&image='+ product_image +'&source='+ source +'&area='+ area,
                type: 'GET',
                data: {exist: 1},
                success: function(obj){
                    if (obj.success == 1) {
                        // 添加成功
                        $('#collect_btn').children().removeClass('empty');
                        $('#collect_btn').children('span').html('已收藏');
                        alert('已收藏');
                    }else {
                        // 删除成功
                        $('#collect_btn').children().addClass('empty');
                        $('#collect_btn').children('span').html('加入收藏');
                        alert('已取消收藏');
                    }
                }
            });
        });


        // 日期
        $('.ui.right.floated.button').click(function(){
            grand = $(this).attr('name');
            getProductsInfo('/api/v1/online-item?area='+ area +'&skuid='+ skuid +'&source='+ source +'&grand='+ grand);
            $(this).addClass('red').siblings().removeClass('red');
        });
    }

    function requestNewDataFun(url){
        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            success: function(argument){
                if (argument.results === undefined) {
                    judgeProductCollected(argument);
                }else{
                    dateChoiceFun(argument);
                }
            }
        });
    }

    // 判断当前商品是否收藏
    function judgeProductCollected(coll){
        // coll＝0：存在
        if (coll.success === 0) {
            $('#collect_btn').children().removeClass('empty');
            $('#collect_btn').children('span').html('已收藏');
        }else {
            $('#collect_btn').children().addClass('empty');
            $('#collect_btn').children('span').html('加入收藏');
        }
    }

    //选择日期
    function dateChoiceFun(arg){
        var getRankDate = [];
        for (var j = 0; j < rankNum; j++) {
            var everyRankDate = (data.results[0].date_rank).split(',')[j].split(':')[0];
            getRankDate.push(everyRankDate);
        }
        graph(getRankDate,getRank);
    }

    function init(){
        getProductsInfo('/api/v1/online-item?area='+ area +'&skuid='+ skuid +'&source='+ source +'&grand='+ grand);//展示商品
        judgeSourchFun();//判断当前商城
        collectProductsFun();//点击收藏
        requestNewDataFun('product-collect?area='+ area +'&skuid='+ skuid +'&source='+ source +'&grand='+ grand);
    }
    init();
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJkaXNjb3ZlcnkvcHJvZHVjdF9pbmZvLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgIHZhciBzb3VyY2UgPSAkKCcjcGFyYW1fc291cmNlJykuYXR0cignbmFtZScpO1xuICAgIHZhciBhcmVhID0gJCgnI3BhcmFtX2FyZWEnKS5hdHRyKCduYW1lJyk7XG4gICAgdmFyIHNrdWlkID0gJCgnI2NvbGxlY3RfYnRuJykuYXR0cignbmFtZScpO1xuICAgIHZhciBncmFuZCA9ICQoJyNwcm9kdWN0X2dyYW5kJykuYXR0cignbmFtZScpO1xuXG4gICAgZnVuY3Rpb24gZ2V0UHJvZHVjdHNJbmZvKHVybCkge1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICB0eXBlOiAnR0VUJyxcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IHtcbiAgICAgICAgICAgICAgICA0MDQ6ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ+aCqOafpeeci+eahOWVhuWTgeW3suS4i+aeticpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzdWNjZXNzOmZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgICQoJyNwcm9kdWN0X25hbWUnKS5odG1sKGRhdGEucmVzdWx0c1swXS5uYW1lKTtcbiAgICAgICAgICAgICAgICAkKCcjcHJvZHVjdF9wcmljZScpLmh0bWwoJ8KlJyArIGRhdGEucmVzdWx0c1swXS5wcmljZSk7XG4gICAgICAgICAgICAgICAgJCgnI2ltYWdlX3VybCcpLmF0dHIoJ3NyYycsZGF0YS5yZXN1bHRzWzBdLmltYWdlX3VybCk7XG4gICAgICAgICAgICAgICAgLy8g5ZWG5ZOB5YiGXG4gICAgICAgICAgICAgICAgdmFyIGdvb2Rfc2NvcmUgPSBkYXRhLnJlc3VsdHNbMF0uc2NvcmU7XG4gICAgICAgICAgICAgICAgdmFyIHNjb3JlID0gZ29vZF9zY29yZS50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgICAgICQoJyNwcm9kdWN0X3Njb3JlJykuaHRtbChzY29yZSk7XG5cbiAgICAgICAgICAgICAgICB2YXIgcmFua051bSA9IGRhdGEucmVzdWx0c1swXS5kYXRlX3Jhbmsuc3BsaXQoJywnKS5sZW5ndGg7XG4gICAgICAgICAgICAgICAgdmFyIGdldFJhbmsgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJhbmtOdW07IGkrKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZXZlcnlSYW5rID0gKGRhdGEucmVzdWx0c1swXS5kYXRlX3JhbmspLnNwbGl0KCcsJylbaV0uc3BsaXQoJzonKVsxXTtcbiAgICAgICAgICAgICAgICAgICAgZ2V0UmFuay5wdXNoKGV2ZXJ5UmFuayk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgdmFyIGdldFJhbmtEYXRlID0gW107XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCByYW5rTnVtOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGV2ZXJ5UmFua0RhdGUgPSAoZGF0YS5yZXN1bHRzWzBdLmRhdGVfcmFuaykuc3BsaXQoJywnKVtqXS5zcGxpdCgnOicpWzBdO1xuICAgICAgICAgICAgICAgICAgICBnZXRSYW5rRGF0ZS5wdXNoKGV2ZXJ5UmFua0RhdGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBncmFwaChnZXRSYW5rRGF0ZSxnZXRSYW5rKTtcblxuICAgICAgICAgICAgICAgICQoJy5ob21lcGFnZTplcSgwKT5hJykuY3NzKCdjb2xvcicsICcjZmY1NDIyJyk7XG4gICAgICAgICAgICAgICAgJCgnLmhvbWVwYWdlOmVxKDApPmRpdicpLmFkZENsYXNzKCd0cmlhbmdsZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvLyDmipjnur/lm75cbiAgICBmdW5jdGlvbiBncmFwaChyYW5rRGF0ZSxyYW5rKXtcbiAgICAgICAgLy/liJ3lp4vljJZcbiAgICAgICAgdmFyIG15Q2hhcnQgPSBlY2hhcnRzLmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW4nKSk7XG4gICAgICAgIC8v5Y+C5pWw6K6+572uXG4gICAgICAgIG9wdGlvbiA9IHtcbiAgICAgICAgICAgICAgICAvL+aPkOekuuahhue7hOS7tu+8muWdkOagh+i9tOinpuWPkVxuICAgICAgICAgICAgICAgIHRvb2x0aXA6IHtcbiAgICAgICAgICAgICAgICAgICAgdHJpZ2dlcjogJ2F4aXMnLFxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgLy/lm77kvovnu4Tku7ZcbiAgICAgICAgICAgICAgICBsZWdlbmQ6IHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogWyfllYblk4HplIDph4/mjpLlkI0nXSxcbiAgICAgICAgICAgICAgICAgICAgdGV4dFN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTQsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvL+ebtOinkuWdkOagh+ezu+WGhee7mOWbvue9keagvFxuICAgICAgICAgICAgICAgIGdyaWQ6IHtcbiAgICAgICAgICAgICAgICAgICAgLy8g6Led56a75bem5L6n5a655Zmo55qE6Led56a7XG4gICAgICAgICAgICAgICAgICAgIGxlZnQ6ICczJScsXG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0OiAnNCUnLFxuICAgICAgICAgICAgICAgICAgICBib3R0b206ICczJScsXG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5MYWJlbDogdHJ1ZSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8v5bel5YW35qCPXG4gICAgICAgICAgICAgICAgdG9vbGJveDoge1xuICAgICAgICAgICAgICAgICAgICBmZWF0dXJlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDkv53lrZjlm77niYdcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhdmVBc0ltYWdlOiB7fSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8v55u06KeS5Z2Q5qCH57O7IGdyaWQg5Lit55qEIHgg6L20XG4gICAgICAgICAgICAgICAgeEF4aXM6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2NhdGVnb3J5JyxcbiAgICAgICAgICAgICAgICAgICAgYm91bmRhcnlHYXA6IGZhbHNlLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiByYW5rRGF0ZSxcbiAgICAgICAgICAgICAgICAgICAgYXhpc0xpbmU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uWmVybzogZmFsc2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lU3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMwMDhBQ0QnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8v55u06KeS5Z2Q5qCH57O7IGdyaWQg5Lit55qEIHkg6L20XG4gICAgICAgICAgICAgICAgeUF4aXM6IHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3ZhbHVlJyxcbiAgICAgICAgICAgICAgICAgICAgaW52ZXJzZTogdHJ1ZSxcbiAgICAgICAgICAgICAgICAgICAgbmFtZUxvY2F0aW9uOiAnc3RhcnQnLFxuICAgICAgICAgICAgICAgICAgICBuYW1lVGV4dFN0eWxlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb250U2l6ZTogMTQsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGF4aXNMaW5lOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsaW5lU3R5bGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2xvcjogJyMwMDhBQ0QnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpZHRoOiAxLFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIC8v57O75YiX5YiX6KGoXG4gICAgICAgICAgICAgICAgc2VyaWVzOiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6ICfllYblk4HplIDph4/mjpLlkI0nLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2xpbmUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhY2s6ICfmgLvph48nLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogcmFuayxcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIF1cblxuICAgICAgICAgICAgfTtcbiAgICAgICAgLy/lj4LmlbDorr7nva7mlrnms5VcbiAgICAgICAgbXlDaGFydC5zZXRPcHRpb24ob3B0aW9uKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBqdWRnZVNvdXJjaEZ1bigpe1xuICAgICAgICAvLyDliKTmlq3lvZPliY3llYbln45cbiAgICAgICAgdmFyIGN1cnJlbnRNYWxsID0gJCgnI3N0b3JlX2xpc3Q+bGlbbmFtZT0nKyBzb3VyY2UgKyddJyk7XG4gICAgICAgICQoY3VycmVudE1hbGwpLmNoaWxkcmVuKCkuYXR0cigndGFyZ2V0JywnX0JsYW5rJyk7XG4gICAgICAgICQoY3VycmVudE1hbGwpLnNob3coKS5zaWJsaW5ncygpLmhpZGUoKTtcblxuICAgICAgICAvLyDliKTmlq3lvZPliY3ml6XmnJ/mrrVcbiAgICAgICAgJCgnLnVpLnJpZ2h0LmZsb2F0ZWQuYnV0dG9uJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICgkKHRoaXMpLmF0dHIoJ25hbWUnKSA9PSBncmFuZCkge1xuICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ3JlZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjb2xsZWN0UHJvZHVjdHNGdW4oKXtcbiAgICAgICAgJCgnI2NvbGxlY3RfYnRuJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciBwcm9kdWN0X25hbWUgPSAkKCdoMycpLmh0bWwoKTtcbiAgICAgICAgICAgIHZhciBwcm9kdWN0X2ltYWdlID0gJCgnI2ltYWdlX3VybCcpLmF0dHIoJ3NyYycpO1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB1cmw6ICdwcm9kdWN0LWNvbGxlY3Q/c2t1aWQ9Jysgc2t1aWQgKycmbmFtZT0nKyBwcm9kdWN0X25hbWUgKycmaW1hZ2U9JysgcHJvZHVjdF9pbWFnZSArJyZzb3VyY2U9Jysgc291cmNlICsnJmFyZWE9JysgYXJlYSxcbiAgICAgICAgICAgICAgICB0eXBlOiAnR0VUJyxcbiAgICAgICAgICAgICAgICBkYXRhOiB7ZXhpc3Q6IDF9LFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKG9iail7XG4gICAgICAgICAgICAgICAgICAgIGlmIChvYmouc3VjY2VzcyA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDmt7vliqDmiJDlip9cbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNjb2xsZWN0X2J0bicpLmNoaWxkcmVuKCkucmVtb3ZlQ2xhc3MoJ2VtcHR5Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjY29sbGVjdF9idG4nKS5jaGlsZHJlbignc3BhbicpLmh0bWwoJ+W3suaUtuiXjycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ+W3suaUtuiXjycpO1xuICAgICAgICAgICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDliKDpmaTmiJDlip9cbiAgICAgICAgICAgICAgICAgICAgICAgICQoJyNjb2xsZWN0X2J0bicpLmNoaWxkcmVuKCkuYWRkQ2xhc3MoJ2VtcHR5Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjY29sbGVjdF9idG4nKS5jaGlsZHJlbignc3BhbicpLmh0bWwoJ+WKoOWFpeaUtuiXjycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ+W3suWPlua2iOaUtuiXjycpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG5cbiAgICAgICAgLy8g5pel5pyfXG4gICAgICAgICQoJy51aS5yaWdodC5mbG9hdGVkLmJ1dHRvbicpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBncmFuZCA9ICQodGhpcykuYXR0cignbmFtZScpO1xuICAgICAgICAgICAgZ2V0UHJvZHVjdHNJbmZvKCcvYXBpL3YxL29ubGluZS1pdGVtP2FyZWE9JysgYXJlYSArJyZza3VpZD0nKyBza3VpZCArJyZzb3VyY2U9Jysgc291cmNlICsnJmdyYW5kPScrIGdyYW5kKTtcbiAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ3JlZCcpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ3JlZCcpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXF1ZXN0TmV3RGF0YUZ1bih1cmwpe1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICB0eXBlOiAnR0VUJyxcbiAgICAgICAgICAgIGRhdGFUeXBlOiAnanNvbicsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihhcmd1bWVudCl7XG4gICAgICAgICAgICAgICAgaWYgKGFyZ3VtZW50LnJlc3VsdHMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgICAgICBqdWRnZVByb2R1Y3RDb2xsZWN0ZWQoYXJndW1lbnQpO1xuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICBkYXRlQ2hvaWNlRnVuKGFyZ3VtZW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vIOWIpOaWreW9k+WJjeWVhuWTgeaYr+WQpuaUtuiXj1xuICAgIGZ1bmN0aW9uIGp1ZGdlUHJvZHVjdENvbGxlY3RlZChjb2xsKXtcbiAgICAgICAgLy8gY29sbO+8nTDvvJrlrZjlnKhcbiAgICAgICAgaWYgKGNvbGwuc3VjY2VzcyA9PT0gMCkge1xuICAgICAgICAgICAgJCgnI2NvbGxlY3RfYnRuJykuY2hpbGRyZW4oKS5yZW1vdmVDbGFzcygnZW1wdHknKTtcbiAgICAgICAgICAgICQoJyNjb2xsZWN0X2J0bicpLmNoaWxkcmVuKCdzcGFuJykuaHRtbCgn5bey5pS26JePJyk7XG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICQoJyNjb2xsZWN0X2J0bicpLmNoaWxkcmVuKCkuYWRkQ2xhc3MoJ2VtcHR5Jyk7XG4gICAgICAgICAgICAkKCcjY29sbGVjdF9idG4nKS5jaGlsZHJlbignc3BhbicpLmh0bWwoJ+WKoOWFpeaUtuiXjycpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy/pgInmi6nml6XmnJ9cbiAgICBmdW5jdGlvbiBkYXRlQ2hvaWNlRnVuKGFyZyl7XG4gICAgICAgIHZhciBnZXRSYW5rRGF0ZSA9IFtdO1xuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHJhbmtOdW07IGorKykge1xuICAgICAgICAgICAgdmFyIGV2ZXJ5UmFua0RhdGUgPSAoZGF0YS5yZXN1bHRzWzBdLmRhdGVfcmFuaykuc3BsaXQoJywnKVtqXS5zcGxpdCgnOicpWzBdO1xuICAgICAgICAgICAgZ2V0UmFua0RhdGUucHVzaChldmVyeVJhbmtEYXRlKTtcbiAgICAgICAgfVxuICAgICAgICBncmFwaChnZXRSYW5rRGF0ZSxnZXRSYW5rKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBpbml0KCl7XG4gICAgICAgIGdldFByb2R1Y3RzSW5mbygnL2FwaS92MS9vbmxpbmUtaXRlbT9hcmVhPScrIGFyZWEgKycmc2t1aWQ9Jysgc2t1aWQgKycmc291cmNlPScrIHNvdXJjZSArJyZncmFuZD0nKyBncmFuZCk7Ly/lsZXnpLrllYblk4FcbiAgICAgICAganVkZ2VTb3VyY2hGdW4oKTsvL+WIpOaWreW9k+WJjeWVhuWfjlxuICAgICAgICBjb2xsZWN0UHJvZHVjdHNGdW4oKTsvL+eCueWHu+aUtuiXj1xuICAgICAgICByZXF1ZXN0TmV3RGF0YUZ1bigncHJvZHVjdC1jb2xsZWN0P2FyZWE9JysgYXJlYSArJyZza3VpZD0nKyBza3VpZCArJyZzb3VyY2U9Jysgc291cmNlICsnJmdyYW5kPScrIGdyYW5kKTtcbiAgICB9XG4gICAgaW5pdCgpO1xufSk7XG4iXSwiZmlsZSI6ImRpc2NvdmVyeS9wcm9kdWN0X2luZm8uanMifQ==
