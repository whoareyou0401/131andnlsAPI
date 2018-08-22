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


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9yZWNvbW1lbmRvcmRlcl93aG9sZXNhbGVfZGVwYXJ0bWVudC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIkKGZ1bmN0aW9uKCl7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gICAgdmFyIGRlYWxlcl9pZCA9IE51bWJlcih1cmwubWF0Y2goLyhkZWFsZXJcXC8pXFxkK1xcLy8pWzBdLnNwbGl0KCcvJylbMV0pO1xuICAgIHZhciBjdXN0b21lcl9pZCA9IE51bWJlcih1cmwubWF0Y2goLyhjdXN0b21lclxcLylcXGQrXFwvLylbMF0uc3BsaXQoJy8nKVsxXSk7XG4gICAgc2V0dXBDU1JGKCk7XG5cbiAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdnZXN0dXJlc3RhcnQnLCBmdW5jdGlvbiAoZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgfSk7XG4gICAgdmFyIGZvb3RlciA9IG5ldyBWdWUoe1xuICAgICAgICBlbDogJyNmb290ZXInLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICB0b3RhbDogMFxuICAgICAgICB9LFxuICAgICAgICBjb21wdXRlZDoge1xuICAgICAgICAgICAgZGlzcGxheV90b3RhbDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICcnICsgdGhpcy50b3RhbC50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB2YXIgYXBwID0gbmV3IFZ1ZSh7XG4gICAgICAgIGVsOiAnI2l0ZW0tbGlzdCcsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGl0ZW1zOiBbXSxcbiAgICAgICAgICAgIHNlbGVjdGVkX2l0ZW1zOiB7fSxcbiAgICAgICAgICAgIHNvdXJjZTogJCgnI3NvdXJjZScpLmF0dHIoXCJuYW1lXCIpLFxuICAgICAgICAgICAgY3VzdG9tZXJfaWQ6ICQoJyNzb3VyY2UnKS5hdHRyKFwiY3VzdG9tZXJfaWRcIiksXG4gICAgICAgICAgICBjYXRfbmFtZTogJ3JlYycsXG4gICAgICAgICAgICBvcmRlcjogJy1zY29yZScsXG4gICAgICAgIH0sXG4gICAgICAgIHJlYWR5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdWdWUgbW91bnRlZCcpO1xuICAgICAgICAgICAgc2VsZi4kd2F0Y2goJ2NhdF9uYW1lJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgc2VsZi5sb2FkSXRlbXMoc2VsZi5jYXRfbmFtZSwgc2VsZi5zb3VyY2UsIHNlbGYub3JkZXIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzZWxmLiR3YXRjaCgnb3JkZXInLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5vcmRlciA9PT0gJ3ByaWNlJykge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLml0ZW1zID0gc2VsZi5pdGVtcy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhLnByaWNlIC0gYi5wcmljZTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzZWxmLm9yZGVyID09PSAnLXByaWNlJykge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLml0ZW1zID0gc2VsZi5pdGVtcy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBiLnByaWNlIC0gYS5wcmljZTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzZWxmLm9yZGVyID09PSAnc2NvcmUnKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaXRlbXMgPSBzZWxmLml0ZW1zLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGEuc2NvcmUgLSBiLnNjb3JlO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNlbGYub3JkZXIgPT09ICctc2NvcmUnKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaXRlbXMgPSBzZWxmLml0ZW1zLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGIuc2NvcmUgLSBhLnNjb3JlO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNlbGYub3JkZXIgPT09ICdudW0nKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaXRlbXMgPSBzZWxmLml0ZW1zLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGEubnVtIC0gYi5udW07XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2VsZi5vcmRlciA9PT0gJy1udW0nKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaXRlbXMgPSBzZWxmLml0ZW1zLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGIubnVtIC0gYS5udW07XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBsb2FkIGJhc2tldCBkYXRhXG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogXCIvcmVjb21tZW5kb3JkZXIvYXBpL3YxL2N1c3RvbWVyL1wiICsgY3VzdG9tZXJfaWQgKyBcIi9iYXNrZXRcIixcbiAgICAgICAgICAgICAgICB0eXBlOiBcImdldFwiLFxuICAgICAgICAgICAgICAgIGRhdGF0eXBlOiBcImpzb25wXCIsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYmFza2V0ID0gZGF0YS5kYXRhO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhiYXNrZXQpO1xuICAgICAgICAgICAgICAgICAgICBiYXNrZXQuZm9yRWFjaChmdW5jdGlvbihkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWRfaXRlbXNbZC5pZF0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbV9pZDogZC5pdGVtX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bTogZC5yZWNvbW1lbmRfbnVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlOiBkLnByaWNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2FkSXRlbXMoc2VsZi5jYXRfbmFtZSwgc2VsZi5zb3VyY2UsIHNlbGYub3JkZXIpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnJlZnJlc2hTZWxlY3RlZEl0ZW1zKHNlbGYuaXRlbXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgIH0sXG4gICAgICAgIG1ldGhvZHM6IHtcbiAgICAgICAgICAgIHRvSXRlbVN0cmluZzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9ICcnO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGsgaW4gdGhpcy5zZWxlY3RlZF9pdGVtcykge1xuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSByZXN1bHQgKyB0aGlzLnNlbGVjdGVkX2l0ZW1zW2tdLml0ZW1faWQgKyAnLCcgKyAgdGhpcy5zZWxlY3RlZF9pdGVtc1trXS5udW0gKyAnfCc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVmcmVzaFNlbGVjdGVkSXRlbXM6IGZ1bmN0aW9uKGl0ZW1zKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24oZWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbGUuc2VsZWN0ZWRfbnVtICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdGVkX2l0ZW1zW2VsZS5pZF0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbV9pZDogZWxlLml0ZW1faWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVtOiBlbGUuc2VsZWN0ZWRfbnVtLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaWNlOiBlbGUucHJpY2VcbiAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoZWxlLmlkIGluIHNlbGYuc2VsZWN0ZWRfaXRlbXMpIHsgXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdGVkX2l0ZW1zW2VsZS5pZF0ubnVtID0gMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGZvb3Rlci50b3RhbCA9IDA7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHNlbGYuc2VsZWN0ZWRfaXRlbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSBzZWxmLnNlbGVjdGVkX2l0ZW1zW2tleV07XG4gICAgICAgICAgICAgICAgICAgIGZvb3Rlci50b3RhbCArPSBpdGVtLm51bSAqIGl0ZW0ucHJpY2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHNhdmVCYXNrZXQoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBudW1DaGFuZ2U6IGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0eXBlb2YgaS5zZWxlY3RlZF9udW0pO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHR5cGVvZiBpLnN0b2NrX251bSk7XG4gICAgICAgICAgICAgICAgaS5zZWxlY3RlZF9udW09cGFyc2VJbnQoaS5zZWxlY3RlZF9udW0pO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHR5cGVvZiBpLnNlbGVjdGVkX251bSk7XG4gICAgICAgICAgICAgICAgaWYgKGkuc2VsZWN0ZWRfbnVtID09PSAnJykge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRW1wdHkhJyk7XG4gICAgICAgICAgICAgICAgICAgIGkuc2VsZWN0ZWRfbnVtID0gMDtcbiAgICAgICAgICAgICAgICB9ZWxzZSBpZihpLnNlbGVjdGVkX251bT5pLnN0b2NrX251bSl7XG4gICAgICAgICAgICAgICAgICAgIGkuc2VsZWN0ZWRfbnVtPWkuc3RvY2tfbnVtO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB0aGlzLnJlZnJlc2hTZWxlY3RlZEl0ZW1zKHRoaXMuaXRlbXMpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlZHVjZUNsaWNrZWQ6IGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygncmVkdWNlJyk7XG4gICAgICAgICAgICAgICAgJCgnLnJlZHVjZScpLm9uKCd0b3VjaHN0YXJ0JywnLmFyZWEnLGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKDEwMCk7XG4gICAgICAgICAgICAgICAgICAkKHRoaXMpLmNzcygnb3BhY2l0eScsJzAuNScpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICQoJy5yZWR1Y2UnKS5vbigndG91Y2hlbmQnLCcuYXJlYScsZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coMjAwKTtcbiAgICAgICAgICAgICAgICAgICQodGhpcykuY3NzKCdvcGFjaXR5JywnMScpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGlmIChpLnNlbGVjdGVkX251bSAtIDEgPj0gMCkge1xuICAgICAgICAgICAgICAgICAgICBpLnNlbGVjdGVkX251bSA9IHBhcnNlSW50KGkuc2VsZWN0ZWRfbnVtKSAtIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMucmVmcmVzaFNlbGVjdGVkSXRlbXModGhpcy5pdGVtcyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGx1c0NsaWNrZWQ6IGZ1bmN0aW9uKGkpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnUGx1cyBjbGlja2VkIScpO1xuICAgICAgICAgICAgICAgICQoJy5wbHVzJykub24oJ3RvdWNoc3RhcnQnLCcuYXJlYScsZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coMTAwKTtcbiAgICAgICAgICAgICAgICAgICQodGhpcykuY3NzKCdvcGFjaXR5JywnMC41Jyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJCgnLnBsdXMnKS5vbigndG91Y2hlbmQnLCcuYXJlYScsZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coMjAwKTtcbiAgICAgICAgICAgICAgICAgICQodGhpcykuY3NzKCdvcGFjaXR5JywnMScpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGkuc3RvY2tfbnVtKTtcbiAgICAgICAgICAgICAgICBpLnNlbGVjdGVkX251bSA9IHBhcnNlSW50KGkuc2VsZWN0ZWRfbnVtKSArIDE7XG4gICAgICAgICAgICAgICAgaWYoaS5zZWxlY3RlZF9udW0+aS5zdG9ja19udW0pe1xuICAgICAgICAgICAgICAgICAgICBpLnNlbGVjdGVkX251bT1pLnN0b2NrX251bTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5yZWZyZXNoU2VsZWN0ZWRJdGVtcyh0aGlzLml0ZW1zKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGl0ZW1GaWx0ZXI6IGZ1bmN0aW9uKGl0ZW1zKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZhciBpZHggPSAwO1xuICAgICAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24oZWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbGUuaWQgaW4gc2VsZi5zZWxlY3RlZF9pdGVtcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlLnNlbGVjdGVkX251bSA9IHNlbGYuc2VsZWN0ZWRfaXRlbXNbZWxlLmlkXS5udW07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGUuc2VsZWN0ZWRfbnVtID0gMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbGUucHJpY2UgPSBwYXJzZUZsb2F0KGVsZS5wcmljZSk7XG4gICAgICAgICAgICAgICAgICAgIGVsZS5kaXNwbGF5X3ByaWNlID0gZWxlLnByaWNlLnRvRml4ZWQoMik7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1zO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxvYWRJdGVtczogZnVuY3Rpb24oY2F0X25hbWUsIHNvdXJjZSwgb3JkZXIpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgc2VsZi5pdGVtcyA9IFtdO1xuICAgICAgICAgICAgICAgIGlmIChjYXRfbmFtZSA9PT0gJ3JlYycpIHtcbiAgICAgICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDpcIi9yZWNvbW1lbmRvcmRlci9hcGkvdjEvZGVhbGVyL1wiICsgZGVhbGVyX2lkICsgXCIvY3VzdG9tZXIvXCIgKyBjdXN0b21lcl9pZCArIFwiL2l0ZW1fZXh0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOidnZXQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YXR5cGU6J2pzb25wJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwib3JkZXJcIjogJ3NvcnRfbGV2ZWxfb25lLHNvcnRfbGV2ZWxfdHdvLCcgKyBzZWxmLm9yZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwibGltaXRcIjogMTBcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOmZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLml0ZW1zID0gc2VsZi5pdGVtRmlsdGVyKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yOmZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygxKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDpcIi9yZWNvbW1lbmRvcmRlci9hcGkvdjEvZGVhbGVyL1wiICsgZGVhbGVyX2lkICsgXCIvY3VzdG9tZXIvXCIgKyBjdXN0b21lcl9pZCArIFwiL2l0ZW1fZXh0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOidnZXQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YXR5cGU6J2pzb25wJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm9yZGVyXCI6IHNlbGYub3JkZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ2NhdGVnb3J5JzogY2F0X25hbWVcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pdGVtcyA9IHNlbGYuaXRlbUZpbHRlcihkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICB2YXIgc2VhcmNoVnVlID0gbmV3IFZ1ZSh7XG4gICAgICAgIGVsOiAnI3NlYXJjaC1yZXN1bHRzJywgXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGl0ZW1zOiBbXSxcbiAgICAgICAgICAgIHF1ZXJ5OiAnJ1xuICAgICAgICB9LFxuICAgICAgICBtZXRob2RzOiB7XG4gICAgICAgICAgICByZWR1Y2VDbGlja2VkOiBmdW5jdGlvbihpKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3JlZHVjZScpO1xuICAgICAgICAgICAgICAgICQoJy5yZWR1Y2UnKS5vbigndG91Y2hzdGFydCcsJy5hcmVhJyxmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygxMDApO1xuICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jc3MoJ29wYWNpdHknLCcwLjUnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAkKCcucmVkdWNlJykub24oJ3RvdWNoZW5kJywnLmFyZWEnLGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKDIwMCk7XG4gICAgICAgICAgICAgICAgICAkKHRoaXMpLmNzcygnb3BhY2l0eScsJzEnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBpZiAoaS5zZWxlY3RlZF9udW0gLSAxID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaS5zZWxlY3RlZF9udW0gPSBpLnNlbGVjdGVkX251bSAtIDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFwcC5yZWZyZXNoU2VsZWN0ZWRJdGVtcyh0aGlzLml0ZW1zKTtcblxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBsdXNDbGlja2VkOiBmdW5jdGlvbihpKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coaSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1BsdXMgY2xpY2tlZCEnKTtcbiAgICAgICAgICAgICAgICAkKCcucGx1cycpLm9uKCd0b3VjaHN0YXJ0JywnLmFyZWEnLGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKDEwMCk7XG4gICAgICAgICAgICAgICAgICAkKHRoaXMpLmNzcygnb3BhY2l0eScsJzAuNScpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICQoJy5wbHVzJykub24oJ3RvdWNoZW5kJywnLmFyZWEnLGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKDIwMCk7XG4gICAgICAgICAgICAgICAgICAkKHRoaXMpLmNzcygnb3BhY2l0eScsJzEnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpLnN0b2NrX251bSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coaS5zZWxlY3RlZF9udW0pO1xuICAgICAgICAgICAgICAgIGkuc2VsZWN0ZWRfbnVtID0gcGFyc2VJbnQoaS5zZWxlY3RlZF9udW0pICsgMTtcbiAgICAgICAgICAgICAgICBpZihpLnNlbGVjdGVkX251bT5pLnN0b2NrX251bSl7XG4gICAgICAgICAgICAgICAgICAgIGkuc2VsZWN0ZWRfbnVtPWkuc3RvY2tfbnVtO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBhcHAucmVmcmVzaFNlbGVjdGVkSXRlbXModGhpcy5pdGVtcyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbnVtQ2hhbmdlOiBmdW5jdGlvbihpKSB7XG4gICAgICAgICAgICAgICAgaS5zZWxlY3RlZF9udW09cGFyc2VJbnQoaS5zZWxlY3RlZF9udW0pO1xuICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0eXBlb2YgaS5zZWxlY3RlZF9udW0pO1xuICAgICAgICAgICAgICAgIGlmKGkuc2VsZWN0ZWRfbnVtPmkuc3RvY2tfbnVtKXtcbiAgICAgICAgICAgICAgICAgICAgaS5zZWxlY3RlZF9udW09aS5zdG9ja19udW07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGFwcC5yZWZyZXNoU2VsZWN0ZWRJdGVtcyh0aGlzLml0ZW1zKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgcmVhZHk6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnc2VhcmNoIHZ1ZSBtb3VudGVkJyk7XG4gICAgICAgICAgICBzZWxmLiR3YXRjaCgncXVlcnknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnUXVlcnkgY2hhbmdlZDogJyArIHNlbGYucXVlcnkpO1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLnF1ZXJ5Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ1NlYXJjaGluZy4uLicpO1xuICAgICAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9yZWNvbW1lbmRvcmRlci9hcGkvdjEvZGVhbGVyL1wiICsgZGVhbGVyX2lkICsgJy9jdXN0b21lci8nICsgY3VzdG9tZXJfaWQgKyBcIi9pdGVtL3NlYXJjaFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJnZXRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGF0eXBlOiBcImpzb25wXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcXVlcnk6IHNlbGYucXVlcnlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuY29kZSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLml0ZW1zID0gYXBwLml0ZW1GaWx0ZXIoZGF0YS5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnU2VhcmNoIGVycm9yJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgICQoJy5wcmljZScpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgbGlzdCgpO1xuICAgIH0pO1xuICAgICB2YXIgbnVtPTA7XG4gICAgZnVuY3Rpb24gbGlzdCgpe1xuICAgICAgIC8vIGFsZXJ0KG51bSk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdpYyBhcnJvdyBjbGlja2VkJyk7XG4gICAgICAgIG51bSsrO1xuICAgICAgICBjb25zb2xlLmxvZyhudW0pO1xuICAgICAgICBpZiAobnVtICUgMiA9PT0gMCl7XG4gICAgICAgICAgICBhcHAub3JkZXIgPSAncHJpY2UnO1xuICAgICAgICAgICAgJCgnLmljLWFycm93JykuY3NzKHtcbiAgICAgICAgICAgICAgICAnYmFja2dyb3VuZCc6J3VybCgvc3RhdGljL2ltYWdlcy9yZWNvbW1lbmRvcmRlci9pY19hcnJvd19kb3duLnBuZykgbm8tcmVwZWF0IGNlbnRlcidcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXBwLm9yZGVyID0gJy1wcmljZSc7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygyMjIyMik7XG4gICAgICAgICAgICAkKCcuaWMtYXJyb3cnKS5jc3Moe1xuICAgICAgICAgICAgICAgICdiYWNrZ3JvdW5kJzondXJsKC9zdGF0aWMvaW1hZ2VzL3JlY29tbWVuZG9yZGVyL2ljX2Fycm93X3VwLnBuZykgbm8tcmVwZWF0IGNlbnRlcidcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxuICAgXG5cblxuICAgICQoJyNieS1zY29yZScpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zb2xlLmxvZygnYnkgc2NvcmUgY2xpY2tlZCcpO1xuICAgICAgICBpZiAoYXBwLm9yZGVyID09PSAnLXNjb3JlJykge1xuICAgICAgICAgICAgYXBwLm9yZGVyID0gJ3Njb3JlJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGFwcC5vcmRlciA9ICctc2NvcmUnO1xuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICAkKCcjYnktbnVtJykuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKCdieSBzY29yZSBjbGlja2VkJyk7XG4gICAgICAgIGlmIChhcHAub3JkZXIgPT09ICctbnVtJykge1xuICAgICAgICAgICAgYXBwLm9yZGVyID0gJ251bSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhcHAub3JkZXIgPSAnLW51bSc7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgICQoJy5uYXYtaXRlbScpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIC8v5pS55Y+Y5a+86Iiq55qE6YCJ5Lit54q25oCBXG4gICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICB2YXIgY2F0X25hbWUgPSAkKHRoaXMpLmF0dHIoXCJjYXRfbmFtZVwiKTtcbiAgICAgICAgYXBwLmNhdF9uYW1lID0gY2F0X25hbWU7XG4gICAgICAgIGNvbnNvbGUubG9nKCdDYXRlZ29yeSBuYW1lJyArIGNhdF9uYW1lICsgJ29mIHNvdXJjZSAnICsgc291cmNlKTtcbiAgICB9KTtcblxuICAgIC8v54K55Ye755S16K+d5oyJ6ZKuXG4gICAgJCgnLmhvbWUtaW5mby1uYXYtYicpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIGNvbnNvbGUubG9nKDEwMDApO1xuICAgICAgICAkKCcubW9kZWwnKS5jc3Moe1xuICAgICAgICAgICAgJ2Rpc3BsYXknOidibG9jaydcbiAgICAgICAgfSk7XG4gICAgICAgICQoJy5tb2RlbCAuY2FsbCcpLmNzcyh7XG4gICAgICAgICAgICAnZGlzcGxheSc6J2Jsb2NrJ1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAvL+eCueWHu+WPlua2iOaMiemSruaooeaAgea2iOWksVxuICAgICQoJy5jYW5jZWwnKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICBjb25zb2xlLmxvZyg5OSk7XG4gICAgICAgICQoJy5tb2RlbCcpLmNzcyh7XG4gICAgICAgICAgICAnZGlzcGxheSc6J25vbmUnXG4gICAgICAgIH0pO1xuICAgICAgICAkKCcubW9kZWwgLmNhbGwnKS5jc3Moe1xuICAgICAgICAgICAgJ2Rpc3BsYXknOidub25lJ1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIC8v54K55Ye756Gu5a6a5oyJ6ZKu5Y+v5Lul5omT55S16K+dXG4gICAgJCgnLm1vZGVsIC5zdXJlJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgY29uc29sZS5sb2coOTk0KTtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWY9XCJ0ZWw6Ly84MzA2NjAwMlwiO1xuICAgIH0pO1xuICAgIC8v54K55Ye75re75Yqg5qih5oCB5Ye6546wXG4gICAgJCgnLm1vbmV5JykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgY29uc29sZS5sb2coMTAwMCk7XG4gICAgICAgICQoJy5hZGQnKS5jc3Moe1xuICAgICAgICAgICAgJ2Rpc3BsYXknOidibG9jaydcbiAgICAgICAgfSk7XG4gICAgICAgICQoJy5hZGQgLmNhbGwnKS5jc3Moe1xuICAgICAgICAgICAgJ2Rpc3BsYXknOidibG9jaydcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvL+eCueWHu+e7p+e7rei0reeJqeaMiemSruaooeaAgea2iOWkseatpOaXtuWVhuWTgeS4gOe7j+a3u+WKoOWcqOi0reeJqei9puS4rVxuICAgICQoJy5hZGQgLmNhbmNlbCcpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIGNvbnNvbGUubG9nKDk5KTtcbiAgICAgICAgJCgnLmFkZCcpLmNzcyh7XG4gICAgICAgICAgICAnZGlzcGxheSc6J25vbmUnXG4gICAgICAgIH0pO1xuICAgICAgICAkKCcuYWRkIC5jYWxsJykuY3NzKHtcbiAgICAgICAgICAgICdkaXNwbGF5Jzonbm9uZSdcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAvL+eCueWHu+WOu+i0reeJqei9puaMiemSrumhtemdoui3s+i9rOWcqOi0reeJqei9pumhtemdouWQjOaXtuWVhuWTgeWHuueOsOWcqOi0reeJqei9puS4rVxuICAgICQoJy5hZGQgLnN1cmUnKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAgY29uc29sZS5sb2coJ1BsYWNlIG9yZGVyIGNsaWNrZWQnKTtcbiAgICAgICAgdmFyIGl0ZW1TdHIgPSBhcHAudG9JdGVtU3RyaW5nKCk7XG4gICAgICAgIHZhciBuZXdfaHJlZiA9ICcvcmVjb21tZW5kb3JkZXIvY3VzdG9tZXIvJyArIGN1c3RvbWVyX2lkICsgJy9jYXJ0P3RhYj1iYXNrZXQnO1xuICAgICAgICBjb25zb2xlLmxvZyhuZXdfaHJlZik7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gbmV3X2hyZWY7XG4gICAgICAgIGNvbnNvbGUubG9nKCdqdW1wZWQnKTtcbiAgICB9KTtcblxuICAgIC8v54K55Ye76L+U5Zue5oyJ6ZKuKOe7meWQjOS4gOS4qui/lOWbnuaMiemSruS9huS4jeWQjOeahOaDheWGteS4i+e7meS4jeWQjOeahOi/lOWbnueVjOmdoilcbiAgICB2YXIgbW09JCgnLnNlYXJjaCcpLnZhbCgpLmxlbmd0aDtcbiAgICBjb25zb2xlLmxvZyhtbSk7XG4gICAgJCgnLmhvbWUtaW5mby1uYXYtYScpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmKG1tID09PSAwKSB7XG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZj0nL3JlY29tbWVuZG9yZGVyL2N1c3RvbWVyLycgKyBjdXN0b21lcl9pZCArICcvY2FydCc7XG4gICAgICAgIH0gICAgXG4gICAgfSk7XG5cbiAgICAkKCcuc2VhcmNoJykuYmluZCgnaW5wdXQgcHJvcGVydHljaGFuZ2UnLGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmKCQoJy5zZWFyY2gnKS52YWwoKS5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgICQoJy5ob21lLWluZm8tbmF2LWEnKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJ3JlY29tbWVuZG9yZGVyLXdob2xlc2FsZS1kZXBhcnRtZW50JztcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9ICAgIFxuICAgIH0pO1xuXG4gICAgICQoJy5saXN0JykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICQodGhpcykucGFyZW50KCkuc2libGluZ3MoKS5jaGlsZHJlbignLmxpc3QnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgIH0pO1xuXG4gICAgIC8v54K55Ye75Zu+54mH5Ye6546w5qih5oCB5pi+56S65aSn5Zu+XG4gICAgJCgnLmxpc3QnKS5vbignY2xpY2snLCcuaW1nQmlnJyxmdW5jdGlvbihldil7XG4gICAgICAgIHZhciBiaWdJbWdTcmMgPSAkKGV2LnRhcmdldCkuYXR0cihcImJpZ3NyY1wiKTtcbiAgICAgICAgY29uc29sZS5sb2coYmlnSW1nU3JjKTtcbiAgICAgICAgJCgnLmltZ0JpZ1Nob3cgaW1nJykuYXR0cihcInNyY1wiLCBiaWdJbWdTcmMpO1xuICAgICAgICAkKCcubW9kZWxJbWcnKS5jc3Moe1xuICAgICAgICAgICAgJ2Rpc3BsYXknOidibG9jaydcbiAgICAgICAgfSk7XG4gICAgICAgICQoJy5pbWdCaWdTaG93IGltZycpLmNzcyh7XG4gICAgICAgICAgICAnZGlzcGxheSc6J2Jsb2NrJ1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAgLy/ngrnlh7vku7vmhI/mjInpkq7mqKHmgIHmtojlpLFcbiAgICAgJCgnLm1vZGVsSW1nJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgY29uc29sZS5sb2coNzcpO1xuICAgICAgICAkKHRoaXMpLmNzcyh7XG4gICAgICAgICAgICAnZGlzcGxheSc6J25vbmUnXG4gICAgICAgIH0pO1xuICAgICB9KTtcbiAgICAgLy/moLnmja7mkJzntKLmoYbnmoTlhoXlrrnliKTmlq3mmK/lkKblh7rnjrDmkJzntKLllYblk4FcbiAgICAgJCgnLnNlYXJjaCcpLmJpbmQoJ2lucHV0IHByb3BlcnR5Y2hhbmdlJyxmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYgKCQoJy5zZWFyY2gnKS52YWwoKS5sZW5ndGg9PT0wKSB7XG4gICAgICAgICAgICAgICAgJCgnLnNob3cnKS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAnZGlzcGxheSc6J2Jsb2NrJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICQoJy5oaWRlJykuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgJ2Rpc3BsYXknOidub25lJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgJCgnLnNob3cnKS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAnZGlzcGxheSc6J25vbmUnXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJCgnLmhpZGUnKS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAnZGlzcGxheSc6J2Jsb2NrJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSAgICBcbiAgICAgfSk7XG5cbiAgICAgLy/lvZPngrnlh7tY5pe25paH5pys5qGG55qE5YC85Li6MO+8m1xuICAgICAkKCcubm8nKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICBjb25zb2xlLmxvZyg2NjYpO1xuICAgICAgICAkKCcuc2VhcmNoJykudmFsKCcnKTtcbiAgICAgfSk7XG5cblxuICAgIGZ1bmN0aW9uIHF1ZXJ5X2NoYW5nZWQoKSB7XG4gICAgICAgIHZhciBxdWVyeSA9ICQoJyNzZWFyY2gnKS52YWwoKTtcbiAgICAgICAgaWYgKHF1ZXJ5Lmxlbmd0aCA9PT0gMCl7XG4gICAgICAgICAgICAkKCcuc2hvdycpLmNzcyh7XG4gICAgICAgICAgICAgICAgJ2Rpc3BsYXknOidibG9jaydcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnLmhpZGUnKS5jc3Moe1xuICAgICAgICAgICAgICAgICdkaXNwbGF5Jzonbm9uZSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICQoJy5zaG93JykuY3NzKHtcbiAgICAgICAgICAgICAgICAnZGlzcGxheSc6J25vbmUnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoJy5oaWRlJykuY3NzKHtcbiAgICAgICAgICAgICAgICAnZGlzcGxheSc6J2Jsb2NrJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gICAgXG4gICAgICAgIHNlYXJjaFZ1ZS5xdWVyeSA9IHF1ZXJ5O1xuICAgIH1cblxuICAgIC8v5qC55o2u5pCc57Si5qGG55qE5YaF5a655Yik5pat5piv5ZCm5Ye6546w5pCc57Si5ZWG5ZOBXG4gICAgJCgnI3NlYXJjaCcpLmJpbmQoJ2lucHV0IHByb3BlcnR5Y2hhbmdlJywgZnVuY3Rpb24oKXtcbiAgICAgICAgcXVlcnlfY2hhbmdlZCgpO1xuICAgIH0pO1xuXG4gICAgLy/lvZPngrnlh7tY5pe25paH5pys5qGG55qE5YC85Li6MO+8m1xuICAgICQoJy5ubycpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJyNzZWFyY2gnKS52YWwoJycpO1xuICAgICAgICBxdWVyeV9jaGFuZ2VkKCk7XG4gICAgfSk7XG4gICAgJCgnI2Jhbm5lci1pbWcnKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnLnNlYXJjaCcpLnZhbCgn54eV5LqsJyk7XG4gICAgICAgIHF1ZXJ5X2NoYW5nZWQoKTtcbiAgICAgICAgJCgnLmhvbWUtaW5mby1uYXYtYScpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZj0ncmVjb21tZW5kb3JkZXItd2hvbGVzYWxlLWRlcGFydG1lbnQnO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAkKCcjYmFubmVyLWltZzEnKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnLnNlYXJjaCcpLnZhbCgn5YG35ZCD54aKJyk7XG4gICAgICAgIHF1ZXJ5X2NoYW5nZWQoKTtcbiAgICAgICAgY29uc29sZS5sb2coJ3dqeScpO1xuICAgICAgICAkKCcuaG9tZS1pbmZvLW5hdi1hJykuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZj0ncmVjb21tZW5kb3JkZXItd2hvbGVzYWxlLWRlcGFydG1lbnQnO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIHNhdmVCYXNrZXQoKSB7XG4gICAgICAgIHZhciBvcmRlcl9zdHIgPSBhcHAudG9JdGVtU3RyaW5nKCk7XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6IFwiL3JlY29tbWVuZG9yZGVyL2FwaS92MS9jdXN0b21lci9cIiArIGN1c3RvbWVyX2lkICsgXCIvYmFza2V0XCIsXG4gICAgICAgICAgICB0eXBlOiBcIlBPU1RcIixcbiAgICAgICAgICAgIGRhdGF0eXBlOiBcImpzb25wXCIsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgJ2Jhc2tldCc6IG9yZGVyX3N0clxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIFxuICAgIG5vZG91YmxldGFwem9vbSgpO1xufSk7XG5cbiJdLCJmaWxlIjoicmVjb21tZW5kb3JkZXIvcmVjb21tZW5kb3JkZXJfd2hvbGVzYWxlX2RlcGFydG1lbnQuanMifQ==
