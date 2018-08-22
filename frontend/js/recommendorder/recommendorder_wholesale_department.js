$(function(){
    "use strict";

    var url = window.location.href;
    var dealer_id = Number(url.match(/(dealer\/)\d+\//)[0].split('/')[1]);
    var customer_id = Number(url.match(/(customer\/)\d+\//)[0].split('/')[1]);
    setupCSRF();

    document.addEventListener('gesturestart', function (e) {
        e.preventDefault();
    });
    var footer = new Vue({
        el: '#footer',
        data: {
            total: 0
        },
        computed: {
            display_total: function() {
                return '' + this.total.toFixed(2);
            }
        }
    });

    var app = new Vue({
        el: '#item-list',
        data: {
            items: [],
            selected_items: {},
            source: $('#source').attr("name"),
            customer_id: $('#source').attr("customer_id"),
            cat_name: 'rec',
            order: '-score',
        },
        ready: function() {
            var self = this;
            console.log('Vue mounted');
            self.$watch('cat_name', function() {
                self.loadItems(self.cat_name, self.source, self.order);
            });
            self.$watch('order', function() {
                if (self.order === 'price') {
                    self.items = self.items.sort(function(a, b) {
                        return a.price - b.price;
                    });
                } else if (self.order === '-price') {
                    self.items = self.items.sort(function(a, b) {
                        return b.price - a.price;
                    });
                } else if (self.order === 'score') {
                    self.items = self.items.sort(function(a, b) {
                        return a.score - b.score;
                    });
                } else if (self.order === '-score') {
                    self.items = self.items.sort(function(a, b) {
                        return b.score - a.score;
                    });
                } else if (self.order === 'num') {
                    self.items = self.items.sort(function(a, b) {
                        return a.num - b.num;
                    });
                } else if (self.order === '-num') {
                    self.items = self.items.sort(function(a, b) {
                        return b.num - a.num;
                    });
                }
            });

            // load basket data
            $.ajax({
                url: "/recommendorder/api/v1/customer/" + customer_id + "/basket",
                type: "get",
                datatype: "jsonp",
                success: function(data) {
                    var basket = data.data;
                    console.log(basket);
                    basket.forEach(function(d) {
                        console.log(d);
                        self.selected_items[d.id] = {
                            item_id: d.item_id,
                            num: d.recommend_num,
                            price: d.price
                        };
                    });
                    self.loadItems(self.cat_name, self.source, self.order);
                    self.refreshSelectedItems(self.items);
                }
            });
            
        },
        methods: {
            toItemString: function() {
                var result = '';
                for (var k in this.selected_items) {
                    result = result + this.selected_items[k].item_id + ',' +  this.selected_items[k].num + '|';
                }
                return result;
            },
            refreshSelectedItems: function(items) {
                var self = this;
                items.forEach(function(ele) {
                    if (ele.selected_num !== 0) {
                        self.selected_items[ele.id] = {
                            item_id: ele.item_id,
                            num: ele.selected_num,
                            price: ele.price
                        };
                    } else if (ele.id in self.selected_items) { 
                        self.selected_items[ele.id].num = 0;
                    }
                });
                footer.total = 0;
                for (var key in self.selected_items) {
                    var item = self.selected_items[key];
                    footer.total += item.num * item.price;
                }
                saveBasket();
            },
            numChange: function(i) {
                console.log(typeof i.selected_num);
                console.log(typeof i.stock_num);
                i.selected_num=parseInt(i.selected_num);
                console.log(typeof i.selected_num);
                if (i.selected_num === '') {
                    console.log('Empty!');
                    i.selected_num = 0;
                }else if(i.selected_num>i.stock_num){
                    i.selected_num=i.stock_num;
                }
                this.refreshSelectedItems(this.items);
            },
            reduceClicked: function(i) {
                console.log('reduce');
                $('.reduce').on('touchstart','.area',function(){
                    console.log(100);
                  $(this).css('opacity','0.5');
                });
                $('.reduce').on('touchend','.area',function(){
                    console.log(200);
                  $(this).css('opacity','1');
                });
                if (i.selected_num - 1 >= 0) {
                    i.selected_num = parseInt(i.selected_num) - 1;
                }
                this.refreshSelectedItems(this.items);
            },
            plusClicked: function(i) {
                console.log(i);
                console.log('Plus clicked!');
                $('.plus').on('touchstart','.area',function(){
                    console.log(100);
                  $(this).css('opacity','0.5');
                });
                $('.plus').on('touchend','.area',function(){
                    console.log(200);
                  $(this).css('opacity','1');
                });
                console.log(i.stock_num);
                i.selected_num = parseInt(i.selected_num) + 1;
                if(i.selected_num>i.stock_num){
                    i.selected_num=i.stock_num;
                }
                this.refreshSelectedItems(this.items);
            },

            itemFilter: function(items) {
                var self = this;
                var idx = 0;
                items.forEach(function(ele) {
                    if (ele.id in self.selected_items) {
                        ele.selected_num = self.selected_items[ele.id].num;
                    } else {
                        ele.selected_num = 0;
                    }
                    ele.price = parseFloat(ele.price);
                    ele.display_price = ele.price.toFixed(2);
                });
                return items;
            },
            loadItems: function(cat_name, source, order) {
                var self = this;
                self.items = [];
                if (cat_name === 'rec') {
                    $.ajax({
                        url:"/recommendorder/api/v1/dealer/" + dealer_id + "/customer/" + customer_id + "/item_ext",
                        type:'get',
                        datatype:'jsonp',
                        data:{
                            "order": 'sort_level_one,sort_level_two,' + self.order,
                            "limit": 10
                        },
                        success:function(data) {
                            console.log(data);
                            self.items = self.itemFilter(data);
                        },
                        error:function(data) {
                            console.log(1);
                        }
                    });
                } else {
                    $.ajax({
                        url:"/recommendorder/api/v1/dealer/" + dealer_id + "/customer/" + customer_id + "/item_ext",
                        type:'get',
                        datatype:'jsonp',
                        data: {
                            "order": self.order,
                            'category': cat_name
                        },
                        success: function(data) {
                            console.log(data);
                            self.items = self.itemFilter(data);
                        }
                    });
                }
            }
        }
    });

    var searchVue = new Vue({
        el: '#search-results', 
        data: {
            items: [],
            query: ''
        },
        methods: {
            reduceClicked: function(i) {
                console.log('reduce');
                $('.reduce').on('touchstart','.area',function(){
                    console.log(100);
                  $(this).css('opacity','0.5');
                });
                $('.reduce').on('touchend','.area',function(){
                    console.log(200);
                  $(this).css('opacity','1');
                });
                if (i.selected_num - 1 >= 0) {
                    i.selected_num = i.selected_num - 1;
                }
                app.refreshSelectedItems(this.items);

            },
            plusClicked: function(i) {
                console.log(i);
                console.log('Plus clicked!');
                $('.plus').on('touchstart','.area',function(){
                    console.log(100);
                  $(this).css('opacity','0.5');
                });
                $('.plus').on('touchend','.area',function(){
                    console.log(200);
                  $(this).css('opacity','1');
                });
                console.log(i.stock_num);
                console.log(i.selected_num);
                i.selected_num = parseInt(i.selected_num) + 1;
                if(i.selected_num>i.stock_num){
                    i.selected_num=i.stock_num;
                }
                app.refreshSelectedItems(this.items);
            },
            numChange: function(i) {
                i.selected_num=parseInt(i.selected_num);
                 console.log(typeof i.selected_num);
                if(i.selected_num>i.stock_num){
                    i.selected_num=i.stock_num;
                }
                app.refreshSelectedItems(this.items);
            }
        },
        ready: function(){
            var self = this;
            console.log('search vue mounted');
            self.$watch('query', function() {
                console.log('Query changed: ' + self.query);
                if (self.query.length > 1) {
                    console.log('Searching...');
                    $.ajax({
                        url: "/recommendorder/api/v1/dealer/" + dealer_id + '/customer/' + customer_id + "/item/search",
                        type: "get",
                        datatype: "jsonp",
                        data: {
                            query: self.query
                        },
                        success: function(data) {
                            console.log(data);
                            if (data.code === 0) {
                                self.items = app.itemFilter(data.data);
                            } else {
                                console.log('Search error');
                            }
                        }
                    });
                }
            });
        }
    });
    $('.price').click(function(){
    list();
    });
     var num=0;
    function list(){
       // alert(num);
        console.log('ic arrow clicked');
        num++;
        console.log(num);
        if (num % 2 === 0){
            app.order = 'price';
            $('.ic-arrow').css({
                'background':'url(/static/images/recommendorder/ic_arrow_down.png) no-repeat center'
            });
        } else {
            app.order = '-price';
            console.log(22222);
            $('.ic-arrow').css({
                'background':'url(/static/images/recommendorder/ic_arrow_up.png) no-repeat center'
            });
        }
    }
   


    $('#by-score').click(function() {
        console.log('by score clicked');
        if (app.order === '-score') {
            app.order = 'score';
        } else {
            app.order = '-score';
        }
    });

    $('#by-num').click(function() {
        console.log('by score clicked');
        if (app.order === '-num') {
            app.order = 'num';
        } else {
            app.order = '-num';
        }
    });

    $('.nav-item').click(function(){
        //改变导航的选中状态
        $(this).addClass('active');
        $(this).siblings().removeClass('active');
        var cat_name = $(this).attr("cat_name");
        app.cat_name = cat_name;
        console.log('Category name' + cat_name + 'of source ' + source);
    });

    //点击电话按钮
    $('.home-info-nav-b').click(function(){
        console.log(1000);
        $('.model').css({
            'display':'block'
        });
        $('.model .call').css({
            'display':'block'
        });
    });
    //点击取消按钮模态消失
    $('.cancel').click(function(){
        console.log(99);
        $('.model').css({
            'display':'none'
        });
        $('.model .call').css({
            'display':'none'
        });
    });

    //点击确定按钮可以打电话
    $('.model .sure').click(function(){
        console.log(994);
        window.location.href="tel://83066002";
    });
    //点击添加模态出现
    $('.money').click(function(){
        console.log(1000);
        $('.add').css({
            'display':'block'
        });
        $('.add .call').css({
            'display':'block'
        });
    });

    //点击继续购物按钮模态消失此时商品一经添加在购物车中
    $('.add .cancel').click(function(){
        console.log(99);
        $('.add').css({
            'display':'none'
        });
        $('.add .call').css({
            'display':'none'
        });
    });

    //点击去购物车按钮页面跳转在购物车页面同时商品出现在购物车中
    $('.add .sure').click(function(){
         console.log('Place order clicked');
        var itemStr = app.toItemString();
        var new_href = '/recommendorder/customer/' + customer_id + '/cart?tab=basket';
        console.log(new_href);
        window.location.href = new_href;
        console.log('jumped');
    });

    //点击返回按钮(给同一个返回按钮但不同的情况下给不同的返回界面)
    var mm=$('.search').val().length;
    console.log(mm);
    $('.home-info-nav-a').click(function(){
        if(mm === 0) {
            window.location.href='/recommendorder/customer/' + customer_id + '/cart';
        }    
    });

    $('.search').bind('input propertychange',function(){
        if($('.search').val().length !== 0) {
            $('.home-info-nav-a').click(function(){
                window.location.href = 'recommendorder-wholesale-department';
            });
        }    
    });

     $('.list').click(function(){
        $(this).addClass('active');
        $(this).parent().siblings().children('.list').removeClass('active');
     });

     //点击图片出现模态显示大图
    $('.list').on('click','.imgBig',function(ev){
        var bigImgSrc = $(ev.target).attr("bigsrc");
        console.log(bigImgSrc);
        $('.imgBigShow img').attr("src", bigImgSrc);
        $('.modelImg').css({
            'display':'block'
        });
        $('.imgBigShow img').css({
            'display':'block'
        });
    });
     //点击任意按钮模态消失
     $('.modelImg').click(function(){
        console.log(77);
        $(this).css({
            'display':'none'
        });
     });
     //根据搜索框的内容判断是否出现搜索商品
     $('.search').bind('input propertychange',function(){
            if ($('.search').val().length===0) {
                $('.show').css({
                    'display':'block'
                });
                $('.hide').css({
                    'display':'none'
                });
            }else{
                $('.show').css({
                    'display':'none'
                });
                $('.hide').css({
                    'display':'block'
                });
            }    
     });

     //当点击X时文本框的值为0；
     $('.no').click(function(){
        console.log(666);
        $('.search').val('');
     });


    function query_changed() {
        var query = $('#search').val();
        if (query.length === 0){
            $('.show').css({
                'display':'block'
            });
            $('.hide').css({
                'display':'none'
            });
        }else{
            $('.show').css({
                'display':'none'
            });
            $('.hide').css({
                'display':'block'
            });
        }    
        searchVue.query = query;
    }

    //根据搜索框的内容判断是否出现搜索商品
    $('#search').bind('input propertychange', function(){
        query_changed();
    });

    //当点击X时文本框的值为0；
    $('.no').click(function(){
        $('#search').val('');
        query_changed();
    });
    $('#banner-img').click(function() {
        $('.search').val('燕京');
        query_changed();
        $('.home-info-nav-a').click(function(){
            window.location.href='recommendorder-wholesale-department';
        });
    });
    $('#banner-img1').click(function() {
        $('.search').val('偷吃熊');
        query_changed();
        console.log('wjy');
        $('.home-info-nav-a').click(function() {
            window.location.href='recommendorder-wholesale-department';
        });
    });

    function saveBasket() {
        var order_str = app.toItemString();
        $.ajax({
            url: "/recommendorder/api/v1/customer/" + customer_id + "/basket",
            type: "POST",
            datatype: "jsonp",
            data: {
                'basket': order_str
            },
            success: function(data) {
                console.log(data);
            }
        });
    }
    
    nodoubletapzoom();
});

