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
