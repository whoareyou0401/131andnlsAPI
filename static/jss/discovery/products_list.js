$(document).ready(function(){
    // 总页数
    var dataTotal = 0;
    // 当前页数
    var index = 1;
    // 判断商品列表是否加载完
    var loaded = false;
    // 城市列表
    var cityCode = [];
    // 定时器
    var timer = null;
    var productId = [];
    function ajaxRequestFun(url) {
        $.ajax({
            url: url,
            type: 'GET',
            statusCode: {
                404: function() {
                    $('.con-wrapper').append('<p class="error">您查找的分类下，没有任何商品哦!<br/>返回<a href="discovery">首页</a></p>');
                    $('#loading').hide();
                },
                200: function(){
                    $('.con-product').show();
                    $('#loading').hide();
                }
            },
            beforeSend: function(XMLHttpRequest) {
                $(".con-wrapper").append('<div id="loading" class="ui active inverted dimmer"><div class="ui large text loader">正在加载，请稍候...</div></div>');
            },
            success:function(data) {
                for (var i = 0; i < data.results.length; i++) {
                    var name = data.results[i].name;
                    var score = data.results[i].score.toFixed(2);
                    var source = data.results[i].source;
                    var skuid = data.results[i].skuid;
                    // 商品id加入列表productId,判断是否被收藏
                    productId.push(skuid);
                    var imageUrl = data.results[i].image_url;
                    var price = data.results[i].price;
                    var area = data.results[i].area;
                    // 排名
                    var ranking = ((index - 1) * 50 + i + 1);
                    // 链接
                    var href = "product-info?area="+ area +"&source="+ source +"&skuid="+ skuid;
                    // 表示排名顺序
                    var orderDiv = $("<div class='order-num'>"+ ranking +"</div>");
                    // 商品图片
                    var img = $("<a href="+ href +"><img alt='图片加载失败' src="+ imageUrl +" title='"+ name +"'></img></a>");
                    // 商品价格
                    var priceItem = $("<p>销售价：<span class='date-price'>¥"+ price +"</span></p>");
                    // 商品名的链接
                    var newName = $("<a href="+ href +" title='"+ name +"' >"+ name +"</a>");
                    // 商品分
                    var newScore = $("<p>商品分：<span class='date-score'>"+ score +"</span></p>");

                    // 表示每一个商品
                    var li = $("<li></li>");
                    // 表示当前商品已收藏
                    var heart = $("<i class='big red icon'></i>").attr('name',skuid);
                    $(li).append(heart).append(orderDiv).append(img).append(newName).append(priceItem).append(newScore);
                    $('#con_list').append(li);
                }
                if (data !== 0) {
                    dataTotal = data.total;
                    loaded = true;
                    $('.homepage:eq(0)>a').css('color', '#ff5422');
                    $('.homepage:eq(0)>div').addClass('triangle');
                }
            }
        });
    }

    function citySelectionFun(){
        // 当前城市对应的编码
        var code = 0;
        var cityObj = {
            'HD':['上海','江苏','浙江','安徽','福建','山东'],
            'HN':['广东','广西','海南'],
            'HB':['北京','天津','河北','山西','内蒙古']
        };
        var cityUrl = '/discovery?area=';
        // 循环每个对象 HB
        for (var val in cityObj) {
            // simp:每个对象下的城市
            var simp = cityObj[val];
            for (var i = 0; i < simp.length; i++) {
                var currentCityCode = $('<a class="item" href='+ cityUrl + val +"&code="+ code +'>'+ simp[i] +'</a>');
                $('#city_list').append(currentCityCode);
                cityCode.push(simp[i]);
                code++;
            }
        }
    }

    String.prototype.format = function(args) {
        if (arguments.length > 0) {
            var result = this;
            if (arguments.length == 1 && typeof (args) == "object") {
                for (var key in args) {
                var reg = new RegExp ("({"+key+"})","g");
                result = result.replace(reg, args[key]);
                }
            }
            else {
                for (var i = 0; i < arguments.length; i++) {
                    if(arguments[i]===undefined){
                        return "";
                    }else {
                        var regOther = new RegExp ("({["+i+"]})","g");
                        result = result.replace(regOther, arguments[i]);
                    }
                }
            }
            return result;
        }
        else {
            return this;
        }
    };

    function getParamsFun(){
        var code = $('#city_name').attr('name');
        var area = $('#city_name').attr('area');
        var catType = $('#category').attr('name');
        var order = $('#order').attr('name');
        var source = $('#shop_name').attr('source');
        var page = $('#current_page').html();
        var grand = $('.con-date-list').attr('name');
        var paramList = {code: code,
                         area: area,
                         std_cat: catType,
                         order: order,
                         source: source,
                         page: page,
                         grand: grand
                        };
        return paramList;
    }

    var param = getParamsFun();
    function requestDataFun(){
        var requestUrl = 'area={area}&source={source}&o={o}&page={page}&std_cat={std_cat}&grand={grand}';
        var currentUrl = requestUrl.format({area: param.area,
                                            source: param.source,
                                            o: param.order,
                                            std_cat: param.std_cat,
                                            page: param.page,
                                            grand: param.grand
                                          });
        // 请求数据
        ajaxRequestFun('api/v1/online-item?'+currentUrl);
    }

    function reloadPageFun(elem,val){
        var requestUrl = 'area={area}&code={code}&source={source}&o={o}&page={page}&std_cat={std_cat}&grand={grand}';

        if (elem == 'source') {
            param.source = val;
            param.page = 1;
        }else if (elem == 'order') {
            param.order = val;
        }else if (elem == 'std_cat') {
            param.std_cat = val;
        }else if (elem == 'pagi') {
            param.page = val;
        }else if (elem == 'pre-page') {
            param.page --;
            if (param.page <= 0) {
                param.page = 1;
            }
        }else if (elem == 'next-page') {
            param.page ++;
            if (param.page >= dataTotal) {
                param.page = dataTotal;
            }
        }else if (elem == 'grand') {
            param.grand = val;
        }

        if (elem != 'pagi' && elem != 'pre-page' && elem != 'next-page') {
            param.page = 1;
        }

        var currentUrl = requestUrl.format({area: param.area,
                                            source: param.source,
                                            o: param.order,
                                            std_cat: param.std_cat,
                                            code: param.code,
                                            page: param.page,
                                            grand: param.grand
                                          });
        // 重载页面
        window.location.href = 'discovery?'+currentUrl;
    }

    function changeStatusFun() {
        // 每一页
        $('.pagi').click(function() {
            var sign = $(this).attr('sign');
            var name = $(this).html();
            reloadPageFun(sign,name);
        });

        // 左右翻页
        $('.next-page,.pre-page').click(function(){
            var sign = $(this).attr('sign');
            var name = $('#current_page').html();
            reloadPageFun(sign,name);
        });

        // 商城、排序、商品分类、时间范围
        $('.mall, .sort, #category .item, .date, .date').click(function(){
            var sign = $(this).attr('sign');
            var name = $(this).attr('name');
            reloadPageFun(sign,name);
            return false;
        });

        // 商品分类
        $('.con-cat-list').hover(function(){
            $('#category').show();
        },function(){
            $('#category').hide();
        });

        $('#category>div').hover(function(){
            $(this).children('.sec_wrapper').removeClass('popup');
        },function(){
            $(this).children('.sec_wrapper').addClass('popup');
        });

        $('.ui.dropdown').dropdown({
            on: 'hover'
        });
    }

    function currentStatusFun(){
        // 日期
        $('.date').each(function() {
            if ($(this).attr('name') == param.granularity) {
                $(this).addClass('current-date');
            }
        });

        // 分页
        for (var i = 1; i <= dataTotal; i++) {
            if (i <= 6) {
                var single = $('<a href="javascript:" class="item pagi" sign="pagi">'+ i +'</a>');
                $("#next_page").before(single);
            }
        }
        $('.pagi').each(function(){
            if ($(this).html() == param.page) {
                $(this).addClass('active');
            }
            if (param.page >= 4 && dataTotal > 6) {
                if (param.page >= dataTotal - 2) {
                    for (var i = 0; i < $('.pagi').length; i++) {
                        var nowPage = dataTotal - 5 + i;
                        $('.pagi')[i].innerHTML = nowPage;
                    }
                }else{
                    for (var j = 0; j < $('.pagi').length; j++) {
                        var nowPageOther = param.page - 3 + j;
                        $('.pagi')[j].innerHTML = nowPageOther;
                    }
                }

            }
        });

        // 排序方式
        $('.sort').each(function(){
            if ($(this).attr('name') == param.order) {
                $(this).addClass('red');
            }
        });

        // 商城
        $('.mall').each(function(){
            if ($(this).attr('name') == param.source) {
                $(this).addClass('current-date');
            }
        });

        // 城市
        var codeNum = $('#city_name').attr('name');
        $('#city_name').html(cityCode[codeNum]);

        // 商品分类
        var  productCat = $('#category').attr('name');
        var leg = $('#category a.item');
        var rightIcon = '<i class="right chevron icon divider"></i>';
        for (var k = 0; k < leg.length; k++) {
            if (leg[k].name == productCat){
                var inner = leg[k].innerHTML;
                $('.yellow.ui.button').html(inner);
                var firLevel = '<a href="javascript:" class="section">'+ inner +'</a>';
                for (var j = 0; j < leg.length; j++) {
                    if ($(leg[k]).attr('p_id') == leg[j].name) {
                        var productInner = $(leg[name=j]).html();
                        var secLevel = '<a href="javascript:" class="section">'+ productInner +'</a>';
                        if (leg[j].name != 1) {
                            for (var l = 0; l < leg.length; l++) {
                                if ($(leg[j]).attr('p_id') == leg[l].name) {
                                    var grandProductInner = $(leg[name=l]).html();
                                    var thiLevel = '<a href="javascript:" class="section">'+ grandProductInner +'</a>';
                                    $('#breadcrumb').append(thiLevel).append(rightIcon).append(secLevel).append(rightIcon).append(firLevel);
                                }
                            }
                        }else{
                            $('#breadcrumb').append(secLevel).append(rightIcon).append(firLevel);
                        }
                    }
                }
            }
        }

        // 日期
        $('.date').each(function(){
            if ($(this).attr('name') == param.grand) {
                $(this).addClass('current-date');
            }
        });
    }

    function getProductId(arr){
        $.ajax({
            url: 'api/v1/products-list-collected',
            type: 'POST',
            data: {
                'skuids': Array(arr),
                'source':param.source
            },
            header: {
                csrfmiddlewaretoken: '{{ csrf_token }}'
            },
            dataType: 'json',
            success: function(collect){
                var resultRrray = [];
                for (var i = 0; i < collect.result.length; i++) {
                    var resultId = collect.result[i].product_id;
                    resultRrray.push(resultId);
                }
                $('#con_list i.icon').each(function(){
                    if (resultRrray.indexOf($(this).attr('name')) != -1) {
                        $(this).addClass('heart');
                        $(this).parent().css('border', '1px solid red');
                    }
                });

            }
        });
    }

    var str = window.location.href;
    str = str.substring(str + 1);
    if ($.cookie(str)) {
        $("html,body").animate({ scrollTop: $.cookie(str) }, 500);
    }

    $(window).scroll(function () {
        var str = window.location.href;
        str = str.substring(str + 1);
        var top = $(document).scrollTop();
        $.cookie(str, top, { path: '/' });
        return $.cookie(str);
    });

    requestDataFun();
    citySelectionFun();
    index = param.page;
    timer = setInterval(function(){
        if (loaded === true){
            $('#total_page').html(dataTotal);
            currentStatusFun();
            changeStatusFun();
            loaded = false;
            clearInterval(timer);
            // 商品列表加载完，获取当前页面所有商品的id
            getProductId(productId);
        }
    },20);
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJkaXNjb3ZlcnkvcHJvZHVjdHNfbGlzdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgIC8vIOaAu+mhteaVsFxuICAgIHZhciBkYXRhVG90YWwgPSAwO1xuICAgIC8vIOW9k+WJjemhteaVsFxuICAgIHZhciBpbmRleCA9IDE7XG4gICAgLy8g5Yik5pat5ZWG5ZOB5YiX6KGo5piv5ZCm5Yqg6L295a6MXG4gICAgdmFyIGxvYWRlZCA9IGZhbHNlO1xuICAgIC8vIOWfjuW4guWIl+ihqFxuICAgIHZhciBjaXR5Q29kZSA9IFtdO1xuICAgIC8vIOWumuaXtuWZqFxuICAgIHZhciB0aW1lciA9IG51bGw7XG4gICAgdmFyIHByb2R1Y3RJZCA9IFtdO1xuICAgIGZ1bmN0aW9uIGFqYXhSZXF1ZXN0RnVuKHVybCkge1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICB0eXBlOiAnR0VUJyxcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IHtcbiAgICAgICAgICAgICAgICA0MDQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAkKCcuY29uLXdyYXBwZXInKS5hcHBlbmQoJzxwIGNsYXNzPVwiZXJyb3JcIj7mgqjmn6Xmib7nmoTliIbnsbvkuIvvvIzmsqHmnInku7vkvZXllYblk4Hlk6YhPGJyLz7ov5Tlm548YSBocmVmPVwiZGlzY292ZXJ5XCI+6aaW6aG1PC9hPjwvcD4nKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2xvYWRpbmcnKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAyMDA6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICQoJy5jb24tcHJvZHVjdCcpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2xvYWRpbmcnKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uKFhNTEh0dHBSZXF1ZXN0KSB7XG4gICAgICAgICAgICAgICAgJChcIi5jb24td3JhcHBlclwiKS5hcHBlbmQoJzxkaXYgaWQ9XCJsb2FkaW5nXCIgY2xhc3M9XCJ1aSBhY3RpdmUgaW52ZXJ0ZWQgZGltbWVyXCI+PGRpdiBjbGFzcz1cInVpIGxhcmdlIHRleHQgbG9hZGVyXCI+5q2j5Zyo5Yqg6L2977yM6K+356iN5YCZLi4uPC9kaXY+PC9kaXY+Jyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc3VjY2VzczpmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLnJlc3VsdHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5hbWUgPSBkYXRhLnJlc3VsdHNbaV0ubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNjb3JlID0gZGF0YS5yZXN1bHRzW2ldLnNjb3JlLnRvRml4ZWQoMik7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzb3VyY2UgPSBkYXRhLnJlc3VsdHNbaV0uc291cmNlO1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2t1aWQgPSBkYXRhLnJlc3VsdHNbaV0uc2t1aWQ7XG4gICAgICAgICAgICAgICAgICAgIC8vIOWVhuWTgWlk5Yqg5YWl5YiX6KGocHJvZHVjdElkLOWIpOaWreaYr+WQpuiiq+aUtuiXj1xuICAgICAgICAgICAgICAgICAgICBwcm9kdWN0SWQucHVzaChza3VpZCk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpbWFnZVVybCA9IGRhdGEucmVzdWx0c1tpXS5pbWFnZV91cmw7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwcmljZSA9IGRhdGEucmVzdWx0c1tpXS5wcmljZTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFyZWEgPSBkYXRhLnJlc3VsdHNbaV0uYXJlYTtcbiAgICAgICAgICAgICAgICAgICAgLy8g5o6S5ZCNXG4gICAgICAgICAgICAgICAgICAgIHZhciByYW5raW5nID0gKChpbmRleCAtIDEpICogNTAgKyBpICsgMSk7XG4gICAgICAgICAgICAgICAgICAgIC8vIOmTvuaOpVxuICAgICAgICAgICAgICAgICAgICB2YXIgaHJlZiA9IFwicHJvZHVjdC1pbmZvP2FyZWE9XCIrIGFyZWEgK1wiJnNvdXJjZT1cIisgc291cmNlICtcIiZza3VpZD1cIisgc2t1aWQ7XG4gICAgICAgICAgICAgICAgICAgIC8vIOihqOekuuaOkuWQjemhuuW6j1xuICAgICAgICAgICAgICAgICAgICB2YXIgb3JkZXJEaXYgPSAkKFwiPGRpdiBjbGFzcz0nb3JkZXItbnVtJz5cIisgcmFua2luZyArXCI8L2Rpdj5cIik7XG4gICAgICAgICAgICAgICAgICAgIC8vIOWVhuWTgeWbvueJh1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW1nID0gJChcIjxhIGhyZWY9XCIrIGhyZWYgK1wiPjxpbWcgYWx0PSflm77niYfliqDovb3lpLHotKUnIHNyYz1cIisgaW1hZ2VVcmwgK1wiIHRpdGxlPSdcIisgbmFtZSArXCInPjwvaW1nPjwvYT5cIik7XG4gICAgICAgICAgICAgICAgICAgIC8vIOWVhuWTgeS7t+agvFxuICAgICAgICAgICAgICAgICAgICB2YXIgcHJpY2VJdGVtID0gJChcIjxwPumUgOWUruS7t++8mjxzcGFuIGNsYXNzPSdkYXRlLXByaWNlJz7CpVwiKyBwcmljZSArXCI8L3NwYW4+PC9wPlwiKTtcbiAgICAgICAgICAgICAgICAgICAgLy8g5ZWG5ZOB5ZCN55qE6ZO+5o6lXG4gICAgICAgICAgICAgICAgICAgIHZhciBuZXdOYW1lID0gJChcIjxhIGhyZWY9XCIrIGhyZWYgK1wiIHRpdGxlPSdcIisgbmFtZSArXCInID5cIisgbmFtZSArXCI8L2E+XCIpO1xuICAgICAgICAgICAgICAgICAgICAvLyDllYblk4HliIZcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld1Njb3JlID0gJChcIjxwPuWVhuWTgeWIhu+8mjxzcGFuIGNsYXNzPSdkYXRlLXNjb3JlJz5cIisgc2NvcmUgK1wiPC9zcGFuPjwvcD5cIik7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8g6KGo56S65q+P5LiA5Liq5ZWG5ZOBXG4gICAgICAgICAgICAgICAgICAgIHZhciBsaSA9ICQoXCI8bGk+PC9saT5cIik7XG4gICAgICAgICAgICAgICAgICAgIC8vIOihqOekuuW9k+WJjeWVhuWTgeW3suaUtuiXj1xuICAgICAgICAgICAgICAgICAgICB2YXIgaGVhcnQgPSAkKFwiPGkgY2xhc3M9J2JpZyByZWQgaWNvbic+PC9pPlwiKS5hdHRyKCduYW1lJyxza3VpZCk7XG4gICAgICAgICAgICAgICAgICAgICQobGkpLmFwcGVuZChoZWFydCkuYXBwZW5kKG9yZGVyRGl2KS5hcHBlbmQoaW1nKS5hcHBlbmQobmV3TmFtZSkuYXBwZW5kKHByaWNlSXRlbSkuYXBwZW5kKG5ld1Njb3JlKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2Nvbl9saXN0JykuYXBwZW5kKGxpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGRhdGEgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YVRvdGFsID0gZGF0YS50b3RhbDtcbiAgICAgICAgICAgICAgICAgICAgbG9hZGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmhvbWVwYWdlOmVxKDApPmEnKS5jc3MoJ2NvbG9yJywgJyNmZjU0MjInKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnLmhvbWVwYWdlOmVxKDApPmRpdicpLmFkZENsYXNzKCd0cmlhbmdsZScpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gY2l0eVNlbGVjdGlvbkZ1bigpe1xuICAgICAgICAvLyDlvZPliY3ln47luILlr7nlupTnmoTnvJbnoIFcbiAgICAgICAgdmFyIGNvZGUgPSAwO1xuICAgICAgICB2YXIgY2l0eU9iaiA9IHtcbiAgICAgICAgICAgICdIRCc6WyfkuIrmtbcnLCfmsZ/oi48nLCfmtZnmsZ8nLCflronlvr0nLCfnpo/lu7onLCflsbHkuJwnXSxcbiAgICAgICAgICAgICdITic6Wyflub/kuJwnLCflub/opb8nLCfmtbfljZcnXSxcbiAgICAgICAgICAgICdIQic6WyfljJfkuqwnLCflpKnmtKUnLCfmsrPljJcnLCflsbHopb8nLCflhoXokpnlj6QnXVxuICAgICAgICB9O1xuICAgICAgICB2YXIgY2l0eVVybCA9ICcvZGlzY292ZXJ5P2FyZWE9JztcbiAgICAgICAgLy8g5b6q546v5q+P5Liq5a+56LGhIEhCXG4gICAgICAgIGZvciAodmFyIHZhbCBpbiBjaXR5T2JqKSB7XG4gICAgICAgICAgICAvLyBzaW1wOuavj+S4quWvueixoeS4i+eahOWfjuW4glxuICAgICAgICAgICAgdmFyIHNpbXAgPSBjaXR5T2JqW3ZhbF07XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNpbXAubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudENpdHlDb2RlID0gJCgnPGEgY2xhc3M9XCJpdGVtXCIgaHJlZj0nKyBjaXR5VXJsICsgdmFsICtcIiZjb2RlPVwiKyBjb2RlICsnPicrIHNpbXBbaV0gKyc8L2E+Jyk7XG4gICAgICAgICAgICAgICAgJCgnI2NpdHlfbGlzdCcpLmFwcGVuZChjdXJyZW50Q2l0eUNvZGUpO1xuICAgICAgICAgICAgICAgIGNpdHlDb2RlLnB1c2goc2ltcFtpXSk7XG4gICAgICAgICAgICAgICAgY29kZSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgU3RyaW5nLnByb3RvdHlwZS5mb3JtYXQgPSBmdW5jdGlvbihhcmdzKSB7XG4gICAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHRoaXM7XG4gICAgICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PSAxICYmIHR5cGVvZiAoYXJncykgPT0gXCJvYmplY3RcIikge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBhcmdzKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlZyA9IG5ldyBSZWdFeHAgKFwiKHtcIitrZXkrXCJ9KVwiLFwiZ1wiKTtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQucmVwbGFjZShyZWcsIGFyZ3Nba2V5XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoYXJndW1lbnRzW2ldPT09dW5kZWZpbmVkKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICAgICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmVnT3RoZXIgPSBuZXcgUmVnRXhwIChcIih7W1wiK2krXCJdfSlcIixcImdcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQucmVwbGFjZShyZWdPdGhlciwgYXJndW1lbnRzW2ldKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBnZXRQYXJhbXNGdW4oKXtcbiAgICAgICAgdmFyIGNvZGUgPSAkKCcjY2l0eV9uYW1lJykuYXR0cignbmFtZScpO1xuICAgICAgICB2YXIgYXJlYSA9ICQoJyNjaXR5X25hbWUnKS5hdHRyKCdhcmVhJyk7XG4gICAgICAgIHZhciBjYXRUeXBlID0gJCgnI2NhdGVnb3J5JykuYXR0cignbmFtZScpO1xuICAgICAgICB2YXIgb3JkZXIgPSAkKCcjb3JkZXInKS5hdHRyKCduYW1lJyk7XG4gICAgICAgIHZhciBzb3VyY2UgPSAkKCcjc2hvcF9uYW1lJykuYXR0cignc291cmNlJyk7XG4gICAgICAgIHZhciBwYWdlID0gJCgnI2N1cnJlbnRfcGFnZScpLmh0bWwoKTtcbiAgICAgICAgdmFyIGdyYW5kID0gJCgnLmNvbi1kYXRlLWxpc3QnKS5hdHRyKCduYW1lJyk7XG4gICAgICAgIHZhciBwYXJhbUxpc3QgPSB7Y29kZTogY29kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICBhcmVhOiBhcmVhLFxuICAgICAgICAgICAgICAgICAgICAgICAgIHN0ZF9jYXQ6IGNhdFR5cGUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXI6IG9yZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZTogc291cmNlLFxuICAgICAgICAgICAgICAgICAgICAgICAgIHBhZ2U6IHBhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgZ3JhbmQ6IGdyYW5kXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICByZXR1cm4gcGFyYW1MaXN0O1xuICAgIH1cblxuICAgIHZhciBwYXJhbSA9IGdldFBhcmFtc0Z1bigpO1xuICAgIGZ1bmN0aW9uIHJlcXVlc3REYXRhRnVuKCl7XG4gICAgICAgIHZhciByZXF1ZXN0VXJsID0gJ2FyZWE9e2FyZWF9JnNvdXJjZT17c291cmNlfSZvPXtvfSZwYWdlPXtwYWdlfSZzdGRfY2F0PXtzdGRfY2F0fSZncmFuZD17Z3JhbmR9JztcbiAgICAgICAgdmFyIGN1cnJlbnRVcmwgPSByZXF1ZXN0VXJsLmZvcm1hdCh7YXJlYTogcGFyYW0uYXJlYSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlOiBwYXJhbS5zb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG86IHBhcmFtLm9yZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGRfY2F0OiBwYXJhbS5zdGRfY2F0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiBwYXJhbS5wYWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncmFuZDogcGFyYW0uZ3JhbmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAvLyDor7fmsYLmlbDmja5cbiAgICAgICAgYWpheFJlcXVlc3RGdW4oJ2FwaS92MS9vbmxpbmUtaXRlbT8nK2N1cnJlbnRVcmwpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIHJlbG9hZFBhZ2VGdW4oZWxlbSx2YWwpe1xuICAgICAgICB2YXIgcmVxdWVzdFVybCA9ICdhcmVhPXthcmVhfSZjb2RlPXtjb2RlfSZzb3VyY2U9e3NvdXJjZX0mbz17b30mcGFnZT17cGFnZX0mc3RkX2NhdD17c3RkX2NhdH0mZ3JhbmQ9e2dyYW5kfSc7XG5cbiAgICAgICAgaWYgKGVsZW0gPT0gJ3NvdXJjZScpIHtcbiAgICAgICAgICAgIHBhcmFtLnNvdXJjZSA9IHZhbDtcbiAgICAgICAgICAgIHBhcmFtLnBhZ2UgPSAxO1xuICAgICAgICB9ZWxzZSBpZiAoZWxlbSA9PSAnb3JkZXInKSB7XG4gICAgICAgICAgICBwYXJhbS5vcmRlciA9IHZhbDtcbiAgICAgICAgfWVsc2UgaWYgKGVsZW0gPT0gJ3N0ZF9jYXQnKSB7XG4gICAgICAgICAgICBwYXJhbS5zdGRfY2F0ID0gdmFsO1xuICAgICAgICB9ZWxzZSBpZiAoZWxlbSA9PSAncGFnaScpIHtcbiAgICAgICAgICAgIHBhcmFtLnBhZ2UgPSB2YWw7XG4gICAgICAgIH1lbHNlIGlmIChlbGVtID09ICdwcmUtcGFnZScpIHtcbiAgICAgICAgICAgIHBhcmFtLnBhZ2UgLS07XG4gICAgICAgICAgICBpZiAocGFyYW0ucGFnZSA8PSAwKSB7XG4gICAgICAgICAgICAgICAgcGFyYW0ucGFnZSA9IDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1lbHNlIGlmIChlbGVtID09ICduZXh0LXBhZ2UnKSB7XG4gICAgICAgICAgICBwYXJhbS5wYWdlICsrO1xuICAgICAgICAgICAgaWYgKHBhcmFtLnBhZ2UgPj0gZGF0YVRvdGFsKSB7XG4gICAgICAgICAgICAgICAgcGFyYW0ucGFnZSA9IGRhdGFUb3RhbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfWVsc2UgaWYgKGVsZW0gPT0gJ2dyYW5kJykge1xuICAgICAgICAgICAgcGFyYW0uZ3JhbmQgPSB2YWw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoZWxlbSAhPSAncGFnaScgJiYgZWxlbSAhPSAncHJlLXBhZ2UnICYmIGVsZW0gIT0gJ25leHQtcGFnZScpIHtcbiAgICAgICAgICAgIHBhcmFtLnBhZ2UgPSAxO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGN1cnJlbnRVcmwgPSByZXF1ZXN0VXJsLmZvcm1hdCh7YXJlYTogcGFyYW0uYXJlYSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlOiBwYXJhbS5zb3VyY2UsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG86IHBhcmFtLm9yZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdGRfY2F0OiBwYXJhbS5zdGRfY2F0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb2RlOiBwYXJhbS5jb2RlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwYWdlOiBwYXJhbS5wYWdlLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncmFuZDogcGFyYW0uZ3JhbmRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAvLyDph43ovb3pobXpnaJcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnZGlzY292ZXJ5PycrY3VycmVudFVybDtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjaGFuZ2VTdGF0dXNGdW4oKSB7XG4gICAgICAgIC8vIOavj+S4gOmhtVxuICAgICAgICAkKCcucGFnaScpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNpZ24gPSAkKHRoaXMpLmF0dHIoJ3NpZ24nKTtcbiAgICAgICAgICAgIHZhciBuYW1lID0gJCh0aGlzKS5odG1sKCk7XG4gICAgICAgICAgICByZWxvYWRQYWdlRnVuKHNpZ24sbmFtZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIOW3puWPs+e/u+mhtVxuICAgICAgICAkKCcubmV4dC1wYWdlLC5wcmUtcGFnZScpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgc2lnbiA9ICQodGhpcykuYXR0cignc2lnbicpO1xuICAgICAgICAgICAgdmFyIG5hbWUgPSAkKCcjY3VycmVudF9wYWdlJykuaHRtbCgpO1xuICAgICAgICAgICAgcmVsb2FkUGFnZUZ1bihzaWduLG5hbWUpO1xuICAgICAgICB9KTtcblxuICAgICAgICAvLyDllYbln47jgIHmjpLluo/jgIHllYblk4HliIbnsbvjgIHml7bpl7TojIPlm7RcbiAgICAgICAgJCgnLm1hbGwsIC5zb3J0LCAjY2F0ZWdvcnkgLml0ZW0sIC5kYXRlLCAuZGF0ZScpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgc2lnbiA9ICQodGhpcykuYXR0cignc2lnbicpO1xuICAgICAgICAgICAgdmFyIG5hbWUgPSAkKHRoaXMpLmF0dHIoJ25hbWUnKTtcbiAgICAgICAgICAgIHJlbG9hZFBhZ2VGdW4oc2lnbixuYW1lKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8g5ZWG5ZOB5YiG57G7XG4gICAgICAgICQoJy5jb24tY2F0LWxpc3QnKS5ob3ZlcihmdW5jdGlvbigpe1xuICAgICAgICAgICAgJCgnI2NhdGVnb3J5Jykuc2hvdygpO1xuICAgICAgICB9LGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAkKCcjY2F0ZWdvcnknKS5oaWRlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoJyNjYXRlZ29yeT5kaXYnKS5ob3ZlcihmdW5jdGlvbigpe1xuICAgICAgICAgICAgJCh0aGlzKS5jaGlsZHJlbignLnNlY193cmFwcGVyJykucmVtb3ZlQ2xhc3MoJ3BvcHVwJyk7XG4gICAgICAgIH0sZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICQodGhpcykuY2hpbGRyZW4oJy5zZWNfd3JhcHBlcicpLmFkZENsYXNzKCdwb3B1cCcpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkKCcudWkuZHJvcGRvd24nKS5kcm9wZG93bih7XG4gICAgICAgICAgICBvbjogJ2hvdmVyJ1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBjdXJyZW50U3RhdHVzRnVuKCl7XG4gICAgICAgIC8vIOaXpeacn1xuICAgICAgICAkKCcuZGF0ZScpLmVhY2goZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAoJCh0aGlzKS5hdHRyKCduYW1lJykgPT0gcGFyYW0uZ3JhbnVsYXJpdHkpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdjdXJyZW50LWRhdGUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy8g5YiG6aG1XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDw9IGRhdGFUb3RhbDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoaSA8PSA2KSB7XG4gICAgICAgICAgICAgICAgdmFyIHNpbmdsZSA9ICQoJzxhIGhyZWY9XCJqYXZhc2NyaXB0OlwiIGNsYXNzPVwiaXRlbSBwYWdpXCIgc2lnbj1cInBhZ2lcIj4nKyBpICsnPC9hPicpO1xuICAgICAgICAgICAgICAgICQoXCIjbmV4dF9wYWdlXCIpLmJlZm9yZShzaW5nbGUpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgICQoJy5wYWdpJykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYgKCQodGhpcykuaHRtbCgpID09IHBhcmFtLnBhZ2UpIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChwYXJhbS5wYWdlID49IDQgJiYgZGF0YVRvdGFsID4gNikge1xuICAgICAgICAgICAgICAgIGlmIChwYXJhbS5wYWdlID49IGRhdGFUb3RhbCAtIDIpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCAkKCcucGFnaScpLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbm93UGFnZSA9IGRhdGFUb3RhbCAtIDUgKyBpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLnBhZ2knKVtpXS5pbm5lckhUTUwgPSBub3dQYWdlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgJCgnLnBhZ2knKS5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5vd1BhZ2VPdGhlciA9IHBhcmFtLnBhZ2UgLSAzICsgajtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5wYWdpJylbal0uaW5uZXJIVE1MID0gbm93UGFnZU90aGVyO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIOaOkuW6j+aWueW8j1xuICAgICAgICAkKCcuc29ydCcpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmICgkKHRoaXMpLmF0dHIoJ25hbWUnKSA9PSBwYXJhbS5vcmRlcikge1xuICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ3JlZCcpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyDllYbln45cbiAgICAgICAgJCgnLm1hbGwnKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBpZiAoJCh0aGlzKS5hdHRyKCduYW1lJykgPT0gcGFyYW0uc291cmNlKSB7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnY3VycmVudC1kYXRlJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIOWfjuW4glxuICAgICAgICB2YXIgY29kZU51bSA9ICQoJyNjaXR5X25hbWUnKS5hdHRyKCduYW1lJyk7XG4gICAgICAgICQoJyNjaXR5X25hbWUnKS5odG1sKGNpdHlDb2RlW2NvZGVOdW1dKTtcblxuICAgICAgICAvLyDllYblk4HliIbnsbtcbiAgICAgICAgdmFyICBwcm9kdWN0Q2F0ID0gJCgnI2NhdGVnb3J5JykuYXR0cignbmFtZScpO1xuICAgICAgICB2YXIgbGVnID0gJCgnI2NhdGVnb3J5IGEuaXRlbScpO1xuICAgICAgICB2YXIgcmlnaHRJY29uID0gJzxpIGNsYXNzPVwicmlnaHQgY2hldnJvbiBpY29uIGRpdmlkZXJcIj48L2k+JztcbiAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBsZWcubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgIGlmIChsZWdba10ubmFtZSA9PSBwcm9kdWN0Q2F0KXtcbiAgICAgICAgICAgICAgICB2YXIgaW5uZXIgPSBsZWdba10uaW5uZXJIVE1MO1xuICAgICAgICAgICAgICAgICQoJy55ZWxsb3cudWkuYnV0dG9uJykuaHRtbChpbm5lcik7XG4gICAgICAgICAgICAgICAgdmFyIGZpckxldmVsID0gJzxhIGhyZWY9XCJqYXZhc2NyaXB0OlwiIGNsYXNzPVwic2VjdGlvblwiPicrIGlubmVyICsnPC9hPic7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBsZWcubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCQobGVnW2tdKS5hdHRyKCdwX2lkJykgPT0gbGVnW2pdLm5hbWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm9kdWN0SW5uZXIgPSAkKGxlZ1tuYW1lPWpdKS5odG1sKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2VjTGV2ZWwgPSAnPGEgaHJlZj1cImphdmFzY3JpcHQ6XCIgY2xhc3M9XCJzZWN0aW9uXCI+JysgcHJvZHVjdElubmVyICsnPC9hPic7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobGVnW2pdLm5hbWUgIT0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGwgPSAwOyBsIDwgbGVnLmxlbmd0aDsgbCsrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICgkKGxlZ1tqXSkuYXR0cigncF9pZCcpID09IGxlZ1tsXS5uYW1lKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgZ3JhbmRQcm9kdWN0SW5uZXIgPSAkKGxlZ1tuYW1lPWxdKS5odG1sKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGhpTGV2ZWwgPSAnPGEgaHJlZj1cImphdmFzY3JpcHQ6XCIgY2xhc3M9XCJzZWN0aW9uXCI+JysgZ3JhbmRQcm9kdWN0SW5uZXIgKyc8L2E+JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNicmVhZGNydW1iJykuYXBwZW5kKHRoaUxldmVsKS5hcHBlbmQocmlnaHRJY29uKS5hcHBlbmQoc2VjTGV2ZWwpLmFwcGVuZChyaWdodEljb24pLmFwcGVuZChmaXJMZXZlbCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjYnJlYWRjcnVtYicpLmFwcGVuZChzZWNMZXZlbCkuYXBwZW5kKHJpZ2h0SWNvbikuYXBwZW5kKGZpckxldmVsKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIOaXpeacn1xuICAgICAgICAkKCcuZGF0ZScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmICgkKHRoaXMpLmF0dHIoJ25hbWUnKSA9PSBwYXJhbS5ncmFuZCkge1xuICAgICAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2N1cnJlbnQtZGF0ZScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBnZXRQcm9kdWN0SWQoYXJyKXtcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogJ2FwaS92MS9wcm9kdWN0cy1saXN0LWNvbGxlY3RlZCcsXG4gICAgICAgICAgICB0eXBlOiAnUE9TVCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgJ3NrdWlkcyc6IEFycmF5KGFyciksXG4gICAgICAgICAgICAgICAgJ3NvdXJjZSc6cGFyYW0uc291cmNlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaGVhZGVyOiB7XG4gICAgICAgICAgICAgICAgY3NyZm1pZGRsZXdhcmV0b2tlbjogJ3t7IGNzcmZfdG9rZW4gfX0nXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGNvbGxlY3Qpe1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHRScnJheSA9IFtdO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29sbGVjdC5yZXN1bHQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3VsdElkID0gY29sbGVjdC5yZXN1bHRbaV0ucHJvZHVjdF9pZDtcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0UnJyYXkucHVzaChyZXN1bHRJZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICQoJyNjb25fbGlzdCBpLmljb24nKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXN1bHRScnJheS5pbmRleE9mKCQodGhpcykuYXR0cignbmFtZScpKSAhPSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnaGVhcnQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucGFyZW50KCkuY3NzKCdib3JkZXInLCAnMXB4IHNvbGlkIHJlZCcpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgdmFyIHN0ciA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgIHN0ciA9IHN0ci5zdWJzdHJpbmcoc3RyICsgMSk7XG4gICAgaWYgKCQuY29va2llKHN0cikpIHtcbiAgICAgICAgJChcImh0bWwsYm9keVwiKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiAkLmNvb2tpZShzdHIpIH0sIDUwMCk7XG4gICAgfVxuXG4gICAgJCh3aW5kb3cpLnNjcm9sbChmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBzdHIgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgICAgICAgc3RyID0gc3RyLnN1YnN0cmluZyhzdHIgKyAxKTtcbiAgICAgICAgdmFyIHRvcCA9ICQoZG9jdW1lbnQpLnNjcm9sbFRvcCgpO1xuICAgICAgICAkLmNvb2tpZShzdHIsIHRvcCwgeyBwYXRoOiAnLycgfSk7XG4gICAgICAgIHJldHVybiAkLmNvb2tpZShzdHIpO1xuICAgIH0pO1xuXG4gICAgcmVxdWVzdERhdGFGdW4oKTtcbiAgICBjaXR5U2VsZWN0aW9uRnVuKCk7XG4gICAgaW5kZXggPSBwYXJhbS5wYWdlO1xuICAgIHRpbWVyID0gc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtcbiAgICAgICAgaWYgKGxvYWRlZCA9PT0gdHJ1ZSl7XG4gICAgICAgICAgICAkKCcjdG90YWxfcGFnZScpLmh0bWwoZGF0YVRvdGFsKTtcbiAgICAgICAgICAgIGN1cnJlbnRTdGF0dXNGdW4oKTtcbiAgICAgICAgICAgIGNoYW5nZVN0YXR1c0Z1bigpO1xuICAgICAgICAgICAgbG9hZGVkID0gZmFsc2U7XG4gICAgICAgICAgICBjbGVhckludGVydmFsKHRpbWVyKTtcbiAgICAgICAgICAgIC8vIOWVhuWTgeWIl+ihqOWKoOi9veWujO+8jOiOt+WPluW9k+WJjemhtemdouaJgOacieWVhuWTgeeahGlkXG4gICAgICAgICAgICBnZXRQcm9kdWN0SWQocHJvZHVjdElkKTtcbiAgICAgICAgfVxuICAgIH0sMjApO1xufSk7Il0sImZpbGUiOiJkaXNjb3ZlcnkvcHJvZHVjdHNfbGlzdC5qcyJ9
