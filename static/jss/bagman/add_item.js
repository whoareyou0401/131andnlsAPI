$(function(){
    "use strict";
    var url = window.location.href;

    var dealer_id = Number(url.match(/(dealer\/)\d+\//)[0].split('/')[1]);
    var customer_id = Number(url.match(/(customer\/)\d+\//)[0].split('/')[1]);
    setupCSRF();
    /**
     * reqType:
     *   POST -- set number
     *   PUT -- increment/decrement data
     */
     //点击改变输入框中的数同时加入
    function setItemCartNum(item, num, reqType, cb) {
        var params = {};
        params[item.id] = num;
        $.ajax({
            url: "/api/v1.2/recommendorder/bagman/customer/" + customer_id + "/cart",
            type: reqType,
            datatype: "jsonp",
            data: params,
            success: function(res) {
                if (res.code === 0) {
                    cb(res);
                } else {
                    alert(res.error_msg);
                }
                $.ajax({
                url: "/api/v1.2/recommendorder/bagman/customer/" + customer_id + "/cart",
                type: "get",
                datatype: "jsonp",
                success: function(data) {
                    console.log(data);
                    var items = [];

                            if (data.items.length===0) {
                                $('#place-order i').html("(0)");
                                items = data.items;
                            }else{
                                $('#place-order i').html("("+data.items.length+")");
                            }
                }
            });
            }
        });
    }
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
    var banner = new Vue({
        el: '#banner',
        data: {
            dealer_id: dealer_id
        }
    });
    var app = new Vue({
        el: '#item-list',
        data: {
            // sort值
            sort:0,
            // 系列数据
            series:{},
            series_num:{},
            series_id:"",
            items: [],
            selected_items: {},
            source: $('#source').attr("name"),
            customer_id: $('#source').attr("customer_id"),
            cat_id: 0,
            order: '-score',
            isGiftPage: url.search('add-gift') === -1,
            dealer_id: dealer_id
        },
        beforeCreated: function(){
        },
        ready: function(i) {
            $.ajax({
                url: "/api/v1.1/recommendorder/customer/" + customer_id + "/dealer-list",
                type: 'get',
                success: function(data){
                    var orderable = false;
                    for(var i=0; i<data.dealers.length; i++){
                        if (data.dealers[i].id == dealer_id && data.dealers[i].orderable){
                            orderable = true;
                        }
                    }
                    if (!orderable){
                        window.location.href = "/recommendorder/customer/" + customer_id + "/dealer-list";
                    }
                }
            });
            var self = this;
            self.$watch('cat_id', function() {

                self.loadItems(self.sort, self.series_id , self.cat_id );
            });
            self.$watch('series_id', function() {
              console.log(series_id);
                 self.loadItems(self.sort, self.series_id , self.cat_id );
            });
            self.$watch('sort', function() {

                 self.loadItems(self.sort, self.series_id , self.cat_id );
            });
            self.$watch('order', function() {
                if (self.order === 'price') {
                    $('#by-price .ic-arrow').css({
                        'background':'url(/static/images/recommendorder/ic_arrow_down.png) no-repeat center',
                        'backgroundSize':'65%'
                    });
                    self.items = self.items.sort(function(a, b) {
                        return a.price - b.price;
                    });
                } else if (self.order === '-price') {
                    $('#by-price .ic-arrow').css({
                        'background':'url(/static/images/recommendorder/ic_arrow_up.png) no-repeat center',
                        'backgroundSize':'65%'
                    });
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
                    $('#by-num .ic-arrow').css({
                        'background':'url(/static/images/recommendorder/ic_arrow_down.png) no-repeat center',
                        'backgroundSize':'65%'
                    });
                    self.items = self.items.sort(function(a, b) {
                        return a.num - b.num;
                    });
                } else if (self.order === '-num') {
                    $('#by-num .ic-arrow').css({
                        'background':'url(/static/images/recommendorder/ic_arrow_up.png) no-repeat center',
                        'backgroundSize':'65%'
                    });
                    self.items = self.items.sort(function(a, b) {
                        return b.num - a.num;
                    });
                }
            });
            // load basket data
            $.ajax({
                url: "/api/v1.2/recommendorder/bagman/customer/" + customer_id + "/cart",
                type: "get",
                datatype: "jsonp",
                success: function(data) {
                    console.log(data)
                    var items = [];
                    if(data.items.length!==0){


                                if (data.items.length===0) {
                                    $('#place-order i').html("(0)");
                                    items =  data.items;
                                }else{
                                    $('#place-order i').html("("+data.items.length+")");
                                    items =  data.items;
                                    items.forEach(function(d) {

                                    self.selected_items[d.item_id] = {
                                        num: Number(d.num).toFixed(0),
                                        price: d.price
                                    };

                                });
                                }


                    }
                   self.loadItems(self.sort, self.series_id , self.cat_id );
                    self.refreshSelectedItems(self.items);
                }
            });
        },
        methods: {
            funtofixed:function(data){
                if(data == ""){
                    return data;
                }else if ( isNaN(Number(data)) ) {

                        return data;
                    }else {
                        return Number(data);

                    }
            },
            seriesChange:function(num){
                   self.series_id=num;
                   console.log(num);
            },
            refreshSelectedItems: function(items) {
                var self = this;
                items.forEach(function(ele) {

                    if (ele.selected_num !== 0) {
                        self.selected_items[ele.id] = {
                            item_id: ele.item_id,
                            num: Number(ele.selected_num).toFixed(0),
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
            },
            numChange: function(v) {
                if (v.selected_num === '') {
                    v.selected_num = 0;
                }
                v.selected_num=parseInt(v.selected_num);
                var self = this;
                setItemCartNum(v, v.selected_num, "POST", function(data) {
                    v.selected_num = Number(data.num).toFixed(0);
                    self.refreshSelectedItems(self.items);
                });
            },
            reduceClicked: function(v) {
                var self = this;
                if(v.selected_num<=0){
                    v.selected_num = 0;
                }else{
                   setItemCartNum(v, -1, "PUT", function(data) {
                        v.selected_num = Number(data.num).toFixed(0);
                        self.refreshSelectedItems(self.items);
                    });
                }
            },
            plusClicked: function(v) {
                var self = this;
                setItemCartNum(v, 1, "PUT", function(data) {
                    v.selected_num = Number(data.num).toFixed(0);
                    self.refreshSelectedItems(self.items);
                });
            },
            itemFilter: function(items) {
                var self = this;
                var idx = 0;
                    console.log(items)
                items.forEach(function(ele) {

                    if (ele.id in self.selected_items) {
                        console.log(self.selected_items[ele.id]);
                        ele.selected_num = self.selected_items[ele.id].num;
                    } else {
                        ele.selected_num = 0;
                    }
                    ele.price = parseFloat(ele.price);
                    if (url.search('add-gift') !== -1){
                         ele.id = "gift:" + ele.id;
                        ele.price = 0;
                        if(ele.id in self.selected_items) {
                            ele.selected_num = self.selected_items[ele.id].num;
                        }else{
                            ele.selected_num = 0;
                        }
                    }
                    ele.display_price = ele.price.toFixed(2);
                    ele.quantity = Number(ele.quantity).toFixed(0);
                    // ele.packing_specification = Number(ele.packing_specification);


                });
                return items;
            },
            // seriesFilter: function(series){
            //     var self = this;
            //      series.categories[0].name
            // };
            loadItems: function( sort, series_id, cat_id) {
                cat_id = parseInt(cat_id);
                var self = this;
                self.items = [];

                     $(".product-series").css("display","block");
                      if ( series_id == "" ) {
                        $.ajax({
                            url:"/api/v1.2/recommendorder/bagman/customer/"+customer_id+"/category/" + cat_id + "/items",
                            type:'get',
                            datatype:'json',
                            success: function(data) {
                                 console.log(data)
                                self.items = self.itemFilter(data.items);

                            }
                          });

                         }else{
                            $.ajax({
                                url:"/api/v1.2/recommendorder/bagman/series/" + series_id + "/items",
                                type:'get',
                                datatype:'jsonp',
                                success: function(data) {
                                self.items = self.itemFilter(data.items);
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
            query: '',
            dealer_id: dealer_id
        },
        methods: {

              numChange: function(v) {
                var self = this;
                if (v.selected_num === '') {
                    v.selected_num = 0;
                }
                v.selected_num=parseInt(v.selected_num);
                setItemCartNum(v, v.selected_num, "POST", function(data) {
                    v.selected_num = Number(data.num).toFixed(0);
                    app.refreshSelectedItems(self.items);
                });
            },
            reduceClicked: function(v) {
                var self = this;
                if(v.selected_num<=0){
                    v.selected_num = 0;
                }else{
                   setItemCartNum(v, -1, "PUT", function(data) {
                        v.selected_num = Number(data.num).toFixed(0);
                        app.refreshSelectedItems(self.items);
                    });
                }
            },
            plusClicked: function(v) {
                var self = this;
                setItemCartNum(v, 1, "PUT", function(data) {
                    v.selected_num = Number(data.num).toFixed(0);
                    app.refreshSelectedItems(self.items);
                });
            }
        },
        //搜索数据
        // ready: function(){
        //     var self = this;
        //     self.$watch('query', function() {
        //         if (self.query.length > 1) {
        //             $.ajax({
        //                 url:"/api/v1.2/recommendorder/customer/"+customer_id+"/dealer/"+dealer_id+"/items",
        //                 type: "get",
        //                 datatype: "jsonp",
        //                 data: {
        //                     "key": self.query
        //                 },
        //                 success: function(data) {

        //                     self.items = app.itemFilter(data.items);
        //                       console.log(self.items);
        //                 }
        //             });
        //         }
        //     });
        // }
    });
    $('#by-price').click(function(){
        $('#by-num .ic-arrow').css({
            'background':'url(/static/images/recommendorder/ic_arrow.png) no-repeat center',
            'backgroundSize':'65%'
        });
        if (app.order === '-price') {
            app.order = 'price';
        }else{
            app.order = '-price';
        }
    });
    $('#by-score').click(function() {
        $('.ic-arrow').css({
            'background':'url(/static/images/recommendorder/ic_arrow.png) no-repeat center',
            'backgroundSize':'65%'
        });
        // if (app.order === '-score') {
        //     app.order = 'score';
        // } else {
        //     app.order = '-score';
        // }
    });
    $('#by-num').click(function() {
        $('#by-price .ic-arrow').css({
            'background':'url(/static/images/recommendorder/ic_arrow.png) no-repeat center',
            'backgroundSize':'65%'
        });
        if (app.order === '-num') {
            app.order = 'num';
        } else {
            app.order = '-num';
        }
    });
    //点击电话按钮

    $('.home-info-nav-b').click(function(){
        $('.model').css({
            'display':'block'
        });
        $('.model .call').css({
            'display':'block'
        });
    });
    //点击取消按钮模态消失
    $('.cancel').click(function(){
        $('.model').css({
            'display':'none'
        });
        $('.model .call').css({
            'display':'none'
        });
    });
    //点击添加模态出现
    $('.money').click(function(){
        $('.add').css({
            'display':'block'
        });
        $('.add .call').css({
            'display':'block'
        });
    });
    //点击去购物车按钮页面跳转在购物车页面同时商品出现在购物车中
    $('#place-order').click(function(){
        var new_href = '/recommendorder/bagman/customer/' + customer_id + '/cart';
        window.location.href = new_href;
    });
    //点击返回按钮(给同一个返回按钮但不同的情况下给不同的返回界面)
    var searchValLen = $('.search').val().length;
    $('.home-info-nav-a').click(function(){
        if(searchValLen === 0) {
            window.location.href='/recommendorder/customer/' + customer_id + '/dealer-list';
        }
    });
    $('.list').click(function(){
        $(this).addClass('active');
        $(this).parent().siblings().children('.list').removeClass('active');
    });
    //点击图片出现模态显示大图
    $('.list').on('click','.imgBig',function(ev){
        var bigImgSrc = $(ev.target).attr("bigsrc");
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
        $(this).css({
            'display':'none'
        });
    });
    function query_changed() {
        var query = $('#search').val();
        if (query.length === 0){
            $('.search-box label.no').css({
                'display':'none'
            });
            $('.show').css({
                'display':'block'
            });
            $('.hide').css({
                'display':'none'
            });
        }else{
            $('.search-box label.no').css({
                'display':'block'
            });
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
    });
    $('#banner-img1').click(function() {
        $('.search').val('偷吃熊');
        query_changed();
    });

    // 左侧列表
    $(document).ready(function() {

        $.ajax({
           url:"/api/v1.2/recommendorder/bagman/categories",
            type : 'get',
            datatype: 'jsonp',
            success: function(res){

                // 存储系列数据
             console.log(res);
             app.cat_id = res.categories[0].id;
               app.series=res.categories;
                for(var i in res.categories){

                    var cat_name = res.categories[i].name;

                    var ul_list = "<li class='nav-item item category-list'  cat_id="+ res.categories[i].id +">"+cat_name+"</li>";
                    $('article .list').append(ul_list);

                }
            }
        });
        //规格切换

        $("#item-list").on('click','.size',function(){
            $(this).addClass("series-active")
             $(this).siblings().removeClass('series-active');
           $(this).parent().parent().parent().children(".list-con").eq($(this).index()).css("display","block")
           $(this).parent().parent().parent().children(".list-con").eq($(this).index()).siblings(".list-con").css("display","none")
        })

        $('.list').on('click', '.nav-item', function() {
            // 清空尖头图片
            $("#by-price .ic-arrow").css("background","")




            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            // 排序样式
            $('#by-score span').addClass('active')
            $('#by-score').siblings().children().removeClass('active');
            // 样式默认全部商品
            $('.product-series .series-select').removeClass('series-active');
            $('.product-series .series-select').eq(0).addClass('series-active');
            //默认综合排序series
            app.sort = 0 ;
            app.cat_id = $(this).attr("cat_id");
            app.series_id = ""
            app.series_num = app.series[$(this).index()];
        });

        //排列顺序
        $('#by-score').click(function(){
            app.sort = 0;
        }) ;
         $('#by-price').click(function(){
            if (app.sort == 1) {
                app.sort = 2;
            }else{
                app.sort = 1;
            }
        });
        $('#by-num').click(function(){
            app.sort = 3;
        })
        // 系列样式切换
        $('.product-series').on('click', '.series-select', function(){
            $(this).addClass('series-active');
            $(this).siblings().removeClass('series-active');
            // 更改series_id
            app.series_id = $(this).attr("series_id");
                  });
        $('.list').on('click', '.category-list', function() {
            $('#banner').hide();
        });
        $('.list').on('click', '#rec', function() {
            $('#banner').show();
        });
        // load dealer info
        $.ajax({
            url: "/api/v1.1/recommendorder/dealer/" + dealer_id,
            type: "get",
            datatype: "JSONP",
            success: function(data) {

                $('#dealer_name').html(data.data.dealer_name);
                $('.model .call .phone-number').html(data.data.phone);
                //点击确定按钮可以打电话
                $('.model .sure').click(function(){
                    window.location.href="tel:"+data.data.phone;
                });
            }
        });
    });
    //如果是世纪君宏则样式稍加修改
    if(dealer_id === 5){
        $('.prompt').css({
            'display':'block'
        });
        $('nav').css({
            'top': '1.56rem',
            'z-index': 667,
            'background-color': '#fcfdee'
        });
        $('nav .search-box').css({
            'margin-top': '0.05rem'
        });
        $('main').css({
            'top':'2.24rem'
        });
        $('main article .list').css({
            'top': '2.24rem'
        });
        $('main aside .ul-box').css({
            'top': '2.24rem'
        });
    }
});


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJiYWdtYW4vYWRkX2l0ZW0uanMiXSwic291cmNlc0NvbnRlbnQiOlsiJChmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblxuICAgIHZhciBkZWFsZXJfaWQgPSBOdW1iZXIodXJsLm1hdGNoKC8oZGVhbGVyXFwvKVxcZCtcXC8vKVswXS5zcGxpdCgnLycpWzFdKTtcbiAgICB2YXIgY3VzdG9tZXJfaWQgPSBOdW1iZXIodXJsLm1hdGNoKC8oY3VzdG9tZXJcXC8pXFxkK1xcLy8pWzBdLnNwbGl0KCcvJylbMV0pO1xuICAgIHNldHVwQ1NSRigpO1xuICAgIC8qKlxuICAgICAqIHJlcVR5cGU6XG4gICAgICogICBQT1NUIC0tIHNldCBudW1iZXJcbiAgICAgKiAgIFBVVCAtLSBpbmNyZW1lbnQvZGVjcmVtZW50IGRhdGFcbiAgICAgKi9cbiAgICAgLy/ngrnlh7vmlLnlj5jovpPlhaXmoYbkuK3nmoTmlbDlkIzml7bliqDlhaVcbiAgICBmdW5jdGlvbiBzZXRJdGVtQ2FydE51bShpdGVtLCBudW0sIHJlcVR5cGUsIGNiKSB7XG4gICAgICAgIHZhciBwYXJhbXMgPSB7fTtcbiAgICAgICAgcGFyYW1zW2l0ZW0uaWRdID0gbnVtO1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiBcIi9hcGkvdjEuMi9yZWNvbW1lbmRvcmRlci9iYWdtYW4vY3VzdG9tZXIvXCIgKyBjdXN0b21lcl9pZCArIFwiL2NhcnRcIixcbiAgICAgICAgICAgIHR5cGU6IHJlcVR5cGUsXG4gICAgICAgICAgICBkYXRhdHlwZTogXCJqc29ucFwiLFxuICAgICAgICAgICAgZGF0YTogcGFyYW1zLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlcy5jb2RlID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNiKHJlcyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQocmVzLmVycm9yX21zZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiBcIi9hcGkvdjEuMi9yZWNvbW1lbmRvcmRlci9iYWdtYW4vY3VzdG9tZXIvXCIgKyBjdXN0b21lcl9pZCArIFwiL2NhcnRcIixcbiAgICAgICAgICAgICAgICB0eXBlOiBcImdldFwiLFxuICAgICAgICAgICAgICAgIGRhdGF0eXBlOiBcImpzb25wXCIsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW1zID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5pdGVtcy5sZW5ndGg9PT0wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNwbGFjZS1vcmRlciBpJykuaHRtbChcIigwKVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXMgPSBkYXRhLml0ZW1zO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjcGxhY2Utb3JkZXIgaScpLmh0bWwoXCIoXCIrZGF0YS5pdGVtcy5sZW5ndGgrXCIpXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHZhciBmb290ZXIgPSBuZXcgVnVlKHtcbiAgICAgICAgZWw6ICcjZm9vdGVyJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgdG90YWw6IDBcbiAgICAgICAgfSxcbiAgICAgICAgY29tcHV0ZWQ6IHtcbiAgICAgICAgICAgIGRpc3BsYXlfdG90YWw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnJyArIHRoaXMudG90YWwudG9GaXhlZCgyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBiYW5uZXIgPSBuZXcgVnVlKHtcbiAgICAgICAgZWw6ICcjYmFubmVyJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgZGVhbGVyX2lkOiBkZWFsZXJfaWRcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBhcHAgPSBuZXcgVnVlKHtcbiAgICAgICAgZWw6ICcjaXRlbS1saXN0JyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgLy8gc29ydOWAvFxuICAgICAgICAgICAgc29ydDowLFxuICAgICAgICAgICAgLy8g57O75YiX5pWw5o2uXG4gICAgICAgICAgICBzZXJpZXM6e30sXG4gICAgICAgICAgICBzZXJpZXNfbnVtOnt9LFxuICAgICAgICAgICAgc2VyaWVzX2lkOlwiXCIsXG4gICAgICAgICAgICBpdGVtczogW10sXG4gICAgICAgICAgICBzZWxlY3RlZF9pdGVtczoge30sXG4gICAgICAgICAgICBzb3VyY2U6ICQoJyNzb3VyY2UnKS5hdHRyKFwibmFtZVwiKSxcbiAgICAgICAgICAgIGN1c3RvbWVyX2lkOiAkKCcjc291cmNlJykuYXR0cihcImN1c3RvbWVyX2lkXCIpLFxuICAgICAgICAgICAgY2F0X2lkOiAwLFxuICAgICAgICAgICAgb3JkZXI6ICctc2NvcmUnLFxuICAgICAgICAgICAgaXNHaWZ0UGFnZTogdXJsLnNlYXJjaCgnYWRkLWdpZnQnKSA9PT0gLTEsXG4gICAgICAgICAgICBkZWFsZXJfaWQ6IGRlYWxlcl9pZFxuICAgICAgICB9LFxuICAgICAgICBiZWZvcmVDcmVhdGVkOiBmdW5jdGlvbigpe1xuICAgICAgICB9LFxuICAgICAgICByZWFkeTogZnVuY3Rpb24oaSkge1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB1cmw6IFwiL2FwaS92MS4xL3JlY29tbWVuZG9yZGVyL2N1c3RvbWVyL1wiICsgY3VzdG9tZXJfaWQgKyBcIi9kZWFsZXItbGlzdFwiLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdnZXQnLFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgICAgICB2YXIgb3JkZXJhYmxlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaT0wOyBpPGRhdGEuZGVhbGVycy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5kZWFsZXJzW2ldLmlkID09IGRlYWxlcl9pZCAmJiBkYXRhLmRlYWxlcnNbaV0ub3JkZXJhYmxlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcmRlcmFibGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmICghb3JkZXJhYmxlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCIvcmVjb21tZW5kb3JkZXIvY3VzdG9tZXIvXCIgKyBjdXN0b21lcl9pZCArIFwiL2RlYWxlci1saXN0XCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIHNlbGYuJHdhdGNoKCdjYXRfaWQnLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgICAgICAgIHNlbGYubG9hZEl0ZW1zKHNlbGYuc29ydCwgc2VsZi5zZXJpZXNfaWQgLCBzZWxmLmNhdF9pZCApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzZWxmLiR3YXRjaCgnc2VyaWVzX2lkJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlcmllc19pZCk7XG4gICAgICAgICAgICAgICAgIHNlbGYubG9hZEl0ZW1zKHNlbGYuc29ydCwgc2VsZi5zZXJpZXNfaWQgLCBzZWxmLmNhdF9pZCApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzZWxmLiR3YXRjaCgnc29ydCcsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgIHNlbGYubG9hZEl0ZW1zKHNlbGYuc29ydCwgc2VsZi5zZXJpZXNfaWQgLCBzZWxmLmNhdF9pZCApO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBzZWxmLiR3YXRjaCgnb3JkZXInLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5vcmRlciA9PT0gJ3ByaWNlJykge1xuICAgICAgICAgICAgICAgICAgICAkKCcjYnktcHJpY2UgLmljLWFycm93JykuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICdiYWNrZ3JvdW5kJzondXJsKC9zdGF0aWMvaW1hZ2VzL3JlY29tbWVuZG9yZGVyL2ljX2Fycm93X2Rvd24ucG5nKSBuby1yZXBlYXQgY2VudGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdiYWNrZ3JvdW5kU2l6ZSc6JzY1JSdcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaXRlbXMgPSBzZWxmLml0ZW1zLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGEucHJpY2UgLSBiLnByaWNlO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNlbGYub3JkZXIgPT09ICctcHJpY2UnKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJyNieS1wcmljZSAuaWMtYXJyb3cnKS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2JhY2tncm91bmQnOid1cmwoL3N0YXRpYy9pbWFnZXMvcmVjb21tZW5kb3JkZXIvaWNfYXJyb3dfdXAucG5nKSBuby1yZXBlYXQgY2VudGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdiYWNrZ3JvdW5kU2l6ZSc6JzY1JSdcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaXRlbXMgPSBzZWxmLml0ZW1zLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGIucHJpY2UgLSBhLnByaWNlO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNlbGYub3JkZXIgPT09ICdzY29yZScpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5pdGVtcyA9IHNlbGYuaXRlbXMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYS5zY29yZSAtIGIuc2NvcmU7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2VsZi5vcmRlciA9PT0gJy1zY29yZScpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5pdGVtcyA9IHNlbGYuaXRlbXMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYi5zY29yZSAtIGEuc2NvcmU7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2VsZi5vcmRlciA9PT0gJ251bScpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2J5LW51bSAuaWMtYXJyb3cnKS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2JhY2tncm91bmQnOid1cmwoL3N0YXRpYy9pbWFnZXMvcmVjb21tZW5kb3JkZXIvaWNfYXJyb3dfZG93bi5wbmcpIG5vLXJlcGVhdCBjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2JhY2tncm91bmRTaXplJzonNjUlJ1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5pdGVtcyA9IHNlbGYuaXRlbXMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYS5udW0gLSBiLm51bTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzZWxmLm9yZGVyID09PSAnLW51bScpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2J5LW51bSAuaWMtYXJyb3cnKS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2JhY2tncm91bmQnOid1cmwoL3N0YXRpYy9pbWFnZXMvcmVjb21tZW5kb3JkZXIvaWNfYXJyb3dfdXAucG5nKSBuby1yZXBlYXQgY2VudGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICdiYWNrZ3JvdW5kU2l6ZSc6JzY1JSdcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaXRlbXMgPSBzZWxmLml0ZW1zLnNvcnQoZnVuY3Rpb24oYSwgYikge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGIubnVtIC0gYS5udW07XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8gbG9hZCBiYXNrZXQgZGF0YVxuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB1cmw6IFwiL2FwaS92MS4yL3JlY29tbWVuZG9yZGVyL2JhZ21hbi9jdXN0b21lci9cIiArIGN1c3RvbWVyX2lkICsgXCIvY2FydFwiLFxuICAgICAgICAgICAgICAgIHR5cGU6IFwiZ2V0XCIsXG4gICAgICAgICAgICAgICAgZGF0YXR5cGU6IFwianNvbnBcIixcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpXG4gICAgICAgICAgICAgICAgICAgIHZhciBpdGVtcyA9IFtdO1xuICAgICAgICAgICAgICAgICAgICBpZihkYXRhLml0ZW1zLmxlbmd0aCE9PTApe1xuXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuaXRlbXMubGVuZ3RoPT09MCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI3BsYWNlLW9yZGVyIGknKS5odG1sKFwiKDApXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXMgPSAgZGF0YS5pdGVtcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjcGxhY2Utb3JkZXIgaScpLmh0bWwoXCIoXCIrZGF0YS5pdGVtcy5sZW5ndGgrXCIpXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXMgPSAgZGF0YS5pdGVtcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24oZCkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdGVkX2l0ZW1zW2QuaXRlbV9pZF0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVtOiBOdW1iZXIoZC5udW0pLnRvRml4ZWQoMCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IGQucHJpY2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICBzZWxmLmxvYWRJdGVtcyhzZWxmLnNvcnQsIHNlbGYuc2VyaWVzX2lkICwgc2VsZi5jYXRfaWQgKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5yZWZyZXNoU2VsZWN0ZWRJdGVtcyhzZWxmLml0ZW1zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgbWV0aG9kczoge1xuICAgICAgICAgICAgZnVudG9maXhlZDpmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICBpZihkYXRhID09IFwiXCIpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9ZWxzZSBpZiAoIGlzTmFOKE51bWJlcihkYXRhKSkgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gTnVtYmVyKGRhdGEpO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXJpZXNDaGFuZ2U6ZnVuY3Rpb24obnVtKXtcbiAgICAgICAgICAgICAgICAgICBzZWxmLnNlcmllc19pZD1udW07XG4gICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cobnVtKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZWZyZXNoU2VsZWN0ZWRJdGVtczogZnVuY3Rpb24oaXRlbXMpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgaXRlbXMuZm9yRWFjaChmdW5jdGlvbihlbGUpIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZWxlLnNlbGVjdGVkX251bSAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWxlY3RlZF9pdGVtc1tlbGUuaWRdID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1faWQ6IGVsZS5pdGVtX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bTogTnVtYmVyKGVsZS5zZWxlY3RlZF9udW0pLnRvRml4ZWQoMCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IGVsZS5wcmljZVxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlbGUuaWQgaW4gc2VsZi5zZWxlY3RlZF9pdGVtcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWxlY3RlZF9pdGVtc1tlbGUuaWRdLm51bSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGZvb3Rlci50b3RhbCA9IDA7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHNlbGYuc2VsZWN0ZWRfaXRlbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSBzZWxmLnNlbGVjdGVkX2l0ZW1zW2tleV07XG4gICAgICAgICAgICAgICAgICAgIGZvb3Rlci50b3RhbCArPSBpdGVtLm51bSAqIGl0ZW0ucHJpY2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG51bUNoYW5nZTogZnVuY3Rpb24odikge1xuICAgICAgICAgICAgICAgIGlmICh2LnNlbGVjdGVkX251bSA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgdi5zZWxlY3RlZF9udW0gPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2LnNlbGVjdGVkX251bT1wYXJzZUludCh2LnNlbGVjdGVkX251bSk7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHNldEl0ZW1DYXJ0TnVtKHYsIHYuc2VsZWN0ZWRfbnVtLCBcIlBPU1RcIiwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICB2LnNlbGVjdGVkX251bSA9IE51bWJlcihkYXRhLm51bSkudG9GaXhlZCgwKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5yZWZyZXNoU2VsZWN0ZWRJdGVtcyhzZWxmLml0ZW1zKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZWR1Y2VDbGlja2VkOiBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIGlmKHYuc2VsZWN0ZWRfbnVtPD0wKXtcbiAgICAgICAgICAgICAgICAgICAgdi5zZWxlY3RlZF9udW0gPSAwO1xuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgIHNldEl0ZW1DYXJ0TnVtKHYsIC0xLCBcIlBVVFwiLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2LnNlbGVjdGVkX251bSA9IE51bWJlcihkYXRhLm51bSkudG9GaXhlZCgwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucmVmcmVzaFNlbGVjdGVkSXRlbXMoc2VsZi5pdGVtcyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwbHVzQ2xpY2tlZDogZnVuY3Rpb24odikge1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICBzZXRJdGVtQ2FydE51bSh2LCAxLCBcIlBVVFwiLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHYuc2VsZWN0ZWRfbnVtID0gTnVtYmVyKGRhdGEubnVtKS50b0ZpeGVkKDApO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnJlZnJlc2hTZWxlY3RlZEl0ZW1zKHNlbGYuaXRlbXMpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGl0ZW1GaWx0ZXI6IGZ1bmN0aW9uKGl0ZW1zKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZhciBpZHggPSAwO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpdGVtcylcbiAgICAgICAgICAgICAgICBpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGVsZSkge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChlbGUuaWQgaW4gc2VsZi5zZWxlY3RlZF9pdGVtcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5zZWxlY3RlZF9pdGVtc1tlbGUuaWRdKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZS5zZWxlY3RlZF9udW0gPSBzZWxmLnNlbGVjdGVkX2l0ZW1zW2VsZS5pZF0ubnVtO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlLnNlbGVjdGVkX251bSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxlLnByaWNlID0gcGFyc2VGbG9hdChlbGUucHJpY2UpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodXJsLnNlYXJjaCgnYWRkLWdpZnQnKSAhPT0gLTEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgIGVsZS5pZCA9IFwiZ2lmdDpcIiArIGVsZS5pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZS5wcmljZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihlbGUuaWQgaW4gc2VsZi5zZWxlY3RlZF9pdGVtcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZS5zZWxlY3RlZF9udW0gPSBzZWxmLnNlbGVjdGVkX2l0ZW1zW2VsZS5pZF0ubnVtO1xuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlLnNlbGVjdGVkX251bSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxlLmRpc3BsYXlfcHJpY2UgPSBlbGUucHJpY2UudG9GaXhlZCgyKTtcbiAgICAgICAgICAgICAgICAgICAgZWxlLnF1YW50aXR5ID0gTnVtYmVyKGVsZS5xdWFudGl0eSkudG9GaXhlZCgwKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gZWxlLnBhY2tpbmdfc3BlY2lmaWNhdGlvbiA9IE51bWJlcihlbGUucGFja2luZ19zcGVjaWZpY2F0aW9uKTtcblxuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGl0ZW1zO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8vIHNlcmllc0ZpbHRlcjogZnVuY3Rpb24oc2VyaWVzKXtcbiAgICAgICAgICAgIC8vICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAvLyAgICAgIHNlcmllcy5jYXRlZ29yaWVzWzBdLm5hbWVcbiAgICAgICAgICAgIC8vIH07XG4gICAgICAgICAgICBsb2FkSXRlbXM6IGZ1bmN0aW9uKCBzb3J0LCBzZXJpZXNfaWQsIGNhdF9pZCkge1xuICAgICAgICAgICAgICAgIGNhdF9pZCA9IHBhcnNlSW50KGNhdF9pZCk7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHNlbGYuaXRlbXMgPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICAgJChcIi5wcm9kdWN0LXNlcmllc1wiKS5jc3MoXCJkaXNwbGF5XCIsXCJibG9ja1wiKTtcbiAgICAgICAgICAgICAgICAgICAgICBpZiAoIHNlcmllc19pZCA9PSBcIlwiICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6XCIvYXBpL3YxLjIvcmVjb21tZW5kb3JkZXIvYmFnbWFuL2N1c3RvbWVyL1wiK2N1c3RvbWVyX2lkK1wiL2NhdGVnb3J5L1wiICsgY2F0X2lkICsgXCIvaXRlbXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOidnZXQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGF0eXBlOidqc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLml0ZW1zID0gc2VsZi5pdGVtRmlsdGVyKGRhdGEuaXRlbXMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDpcIi9hcGkvdjEuMi9yZWNvbW1lbmRvcmRlci9iYWdtYW4vc2VyaWVzL1wiICsgc2VyaWVzX2lkICsgXCIvaXRlbXNcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTonZ2V0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YXR5cGU6J2pzb25wJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLml0ZW1zID0gc2VsZi5pdGVtRmlsdGVyKGRhdGEuaXRlbXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBzZWFyY2hWdWUgPSBuZXcgVnVlKHtcbiAgICAgICAgZWw6ICcjc2VhcmNoLXJlc3VsdHMnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBpdGVtczogW10sXG4gICAgICAgICAgICBxdWVyeTogJycsXG4gICAgICAgICAgICBkZWFsZXJfaWQ6IGRlYWxlcl9pZFxuICAgICAgICB9LFxuICAgICAgICBtZXRob2RzOiB7XG5cbiAgICAgICAgICAgICAgbnVtQ2hhbmdlOiBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIGlmICh2LnNlbGVjdGVkX251bSA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgdi5zZWxlY3RlZF9udW0gPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2LnNlbGVjdGVkX251bT1wYXJzZUludCh2LnNlbGVjdGVkX251bSk7XG4gICAgICAgICAgICAgICAgc2V0SXRlbUNhcnROdW0odiwgdi5zZWxlY3RlZF9udW0sIFwiUE9TVFwiLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHYuc2VsZWN0ZWRfbnVtID0gTnVtYmVyKGRhdGEubnVtKS50b0ZpeGVkKDApO1xuICAgICAgICAgICAgICAgICAgICBhcHAucmVmcmVzaFNlbGVjdGVkSXRlbXMoc2VsZi5pdGVtcyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVkdWNlQ2xpY2tlZDogZnVuY3Rpb24odikge1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICBpZih2LnNlbGVjdGVkX251bTw9MCl7XG4gICAgICAgICAgICAgICAgICAgIHYuc2VsZWN0ZWRfbnVtID0gMDtcbiAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICBzZXRJdGVtQ2FydE51bSh2LCAtMSwgXCJQVVRcIiwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdi5zZWxlY3RlZF9udW0gPSBOdW1iZXIoZGF0YS5udW0pLnRvRml4ZWQoMCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcHAucmVmcmVzaFNlbGVjdGVkSXRlbXMoc2VsZi5pdGVtcyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBwbHVzQ2xpY2tlZDogZnVuY3Rpb24odikge1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICBzZXRJdGVtQ2FydE51bSh2LCAxLCBcIlBVVFwiLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHYuc2VsZWN0ZWRfbnVtID0gTnVtYmVyKGRhdGEubnVtKS50b0ZpeGVkKDApO1xuICAgICAgICAgICAgICAgICAgICBhcHAucmVmcmVzaFNlbGVjdGVkSXRlbXMoc2VsZi5pdGVtcyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIC8v5pCc57Si5pWw5o2uXG4gICAgICAgIC8vIHJlYWR5OiBmdW5jdGlvbigpe1xuICAgICAgICAvLyAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAvLyAgICAgc2VsZi4kd2F0Y2goJ3F1ZXJ5JywgZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vICAgICAgICAgaWYgKHNlbGYucXVlcnkubGVuZ3RoID4gMSkge1xuICAgICAgICAvLyAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgdXJsOlwiL2FwaS92MS4yL3JlY29tbWVuZG9yZGVyL2N1c3RvbWVyL1wiK2N1c3RvbWVyX2lkK1wiL2RlYWxlci9cIitkZWFsZXJfaWQrXCIvaXRlbXNcIixcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIHR5cGU6IFwiZ2V0XCIsXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBkYXRhdHlwZTogXCJqc29ucFwiLFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIFwia2V5XCI6IHNlbGYucXVlcnlcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIH0sXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG5cbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICBzZWxmLml0ZW1zID0gYXBwLml0ZW1GaWx0ZXIoZGF0YS5pdGVtcyk7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLml0ZW1zKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIH1cbiAgICAgICAgLy8gICAgICAgICAgICAgfSk7XG4gICAgICAgIC8vICAgICAgICAgfVxuICAgICAgICAvLyAgICAgfSk7XG4gICAgICAgIC8vIH1cbiAgICB9KTtcbiAgICAkKCcjYnktcHJpY2UnKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAkKCcjYnktbnVtIC5pYy1hcnJvdycpLmNzcyh7XG4gICAgICAgICAgICAnYmFja2dyb3VuZCc6J3VybCgvc3RhdGljL2ltYWdlcy9yZWNvbW1lbmRvcmRlci9pY19hcnJvdy5wbmcpIG5vLXJlcGVhdCBjZW50ZXInLFxuICAgICAgICAgICAgJ2JhY2tncm91bmRTaXplJzonNjUlJ1xuICAgICAgICB9KTtcbiAgICAgICAgaWYgKGFwcC5vcmRlciA9PT0gJy1wcmljZScpIHtcbiAgICAgICAgICAgIGFwcC5vcmRlciA9ICdwcmljZSc7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgYXBwLm9yZGVyID0gJy1wcmljZSc7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAkKCcjYnktc2NvcmUnKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnLmljLWFycm93JykuY3NzKHtcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kJzondXJsKC9zdGF0aWMvaW1hZ2VzL3JlY29tbWVuZG9yZGVyL2ljX2Fycm93LnBuZykgbm8tcmVwZWF0IGNlbnRlcicsXG4gICAgICAgICAgICAnYmFja2dyb3VuZFNpemUnOic2NSUnXG4gICAgICAgIH0pO1xuICAgICAgICAvLyBpZiAoYXBwLm9yZGVyID09PSAnLXNjb3JlJykge1xuICAgICAgICAvLyAgICAgYXBwLm9yZGVyID0gJ3Njb3JlJztcbiAgICAgICAgLy8gfSBlbHNlIHtcbiAgICAgICAgLy8gICAgIGFwcC5vcmRlciA9ICctc2NvcmUnO1xuICAgICAgICAvLyB9XG4gICAgfSk7XG4gICAgJCgnI2J5LW51bScpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcjYnktcHJpY2UgLmljLWFycm93JykuY3NzKHtcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kJzondXJsKC9zdGF0aWMvaW1hZ2VzL3JlY29tbWVuZG9yZGVyL2ljX2Fycm93LnBuZykgbm8tcmVwZWF0IGNlbnRlcicsXG4gICAgICAgICAgICAnYmFja2dyb3VuZFNpemUnOic2NSUnXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoYXBwLm9yZGVyID09PSAnLW51bScpIHtcbiAgICAgICAgICAgIGFwcC5vcmRlciA9ICdudW0nO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYXBwLm9yZGVyID0gJy1udW0nO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgLy/ngrnlh7vnlLXor53mjInpkq5cblxuICAgICQoJy5ob21lLWluZm8tbmF2LWInKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAkKCcubW9kZWwnKS5jc3Moe1xuICAgICAgICAgICAgJ2Rpc3BsYXknOidibG9jaydcbiAgICAgICAgfSk7XG4gICAgICAgICQoJy5tb2RlbCAuY2FsbCcpLmNzcyh7XG4gICAgICAgICAgICAnZGlzcGxheSc6J2Jsb2NrJ1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAvL+eCueWHu+WPlua2iOaMiemSruaooeaAgea2iOWksVxuICAgICQoJy5jYW5jZWwnKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAkKCcubW9kZWwnKS5jc3Moe1xuICAgICAgICAgICAgJ2Rpc3BsYXknOidub25lJ1xuICAgICAgICB9KTtcbiAgICAgICAgJCgnLm1vZGVsIC5jYWxsJykuY3NzKHtcbiAgICAgICAgICAgICdkaXNwbGF5Jzonbm9uZSdcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgLy/ngrnlh7vmt7vliqDmqKHmgIHlh7rnjrBcbiAgICAkKCcubW9uZXknKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAkKCcuYWRkJykuY3NzKHtcbiAgICAgICAgICAgICdkaXNwbGF5JzonYmxvY2snXG4gICAgICAgIH0pO1xuICAgICAgICAkKCcuYWRkIC5jYWxsJykuY3NzKHtcbiAgICAgICAgICAgICdkaXNwbGF5JzonYmxvY2snXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIC8v54K55Ye75Y676LSt54mp6L2m5oyJ6ZKu6aG16Z2i6Lez6L2s5Zyo6LSt54mp6L2m6aG16Z2i5ZCM5pe25ZWG5ZOB5Ye6546w5Zyo6LSt54mp6L2m5LitXG4gICAgJCgnI3BsYWNlLW9yZGVyJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIG5ld19ocmVmID0gJy9yZWNvbW1lbmRvcmRlci9iYWdtYW4vY3VzdG9tZXIvJyArIGN1c3RvbWVyX2lkICsgJy9jYXJ0JztcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBuZXdfaHJlZjtcbiAgICB9KTtcbiAgICAvL+eCueWHu+i/lOWbnuaMiemSrijnu5nlkIzkuIDkuKrov5Tlm57mjInpkq7kvYbkuI3lkIznmoTmg4XlhrXkuIvnu5nkuI3lkIznmoTov5Tlm57nlYzpnaIpXG4gICAgdmFyIHNlYXJjaFZhbExlbiA9ICQoJy5zZWFyY2gnKS52YWwoKS5sZW5ndGg7XG4gICAgJCgnLmhvbWUtaW5mby1uYXYtYScpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIGlmKHNlYXJjaFZhbExlbiA9PT0gMCkge1xuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWY9Jy9yZWNvbW1lbmRvcmRlci9jdXN0b21lci8nICsgY3VzdG9tZXJfaWQgKyAnL2RlYWxlci1saXN0JztcbiAgICAgICAgfVxuICAgIH0pO1xuICAgICQoJy5saXN0JykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICQodGhpcykucGFyZW50KCkuc2libGluZ3MoKS5jaGlsZHJlbignLmxpc3QnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgfSk7XG4gICAgLy/ngrnlh7vlm77niYflh7rnjrDmqKHmgIHmmL7npLrlpKflm75cbiAgICAkKCcubGlzdCcpLm9uKCdjbGljaycsJy5pbWdCaWcnLGZ1bmN0aW9uKGV2KXtcbiAgICAgICAgdmFyIGJpZ0ltZ1NyYyA9ICQoZXYudGFyZ2V0KS5hdHRyKFwiYmlnc3JjXCIpO1xuICAgICAgICAkKCcuaW1nQmlnU2hvdyBpbWcnKS5hdHRyKFwic3JjXCIsIGJpZ0ltZ1NyYyk7XG4gICAgICAgICQoJy5tb2RlbEltZycpLmNzcyh7XG4gICAgICAgICAgICAnZGlzcGxheSc6J2Jsb2NrJ1xuICAgICAgICB9KTtcbiAgICAgICAgJCgnLmltZ0JpZ1Nob3cgaW1nJykuY3NzKHtcbiAgICAgICAgICAgICdkaXNwbGF5JzonYmxvY2snXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIC8v54K55Ye75Lu75oSP5oyJ6ZKu5qih5oCB5raI5aSxXG4gICAgJCgnLm1vZGVsSW1nJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgJCh0aGlzKS5jc3Moe1xuICAgICAgICAgICAgJ2Rpc3BsYXknOidub25lJ1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICBmdW5jdGlvbiBxdWVyeV9jaGFuZ2VkKCkge1xuICAgICAgICB2YXIgcXVlcnkgPSAkKCcjc2VhcmNoJykudmFsKCk7XG4gICAgICAgIGlmIChxdWVyeS5sZW5ndGggPT09IDApe1xuICAgICAgICAgICAgJCgnLnNlYXJjaC1ib3ggbGFiZWwubm8nKS5jc3Moe1xuICAgICAgICAgICAgICAgICdkaXNwbGF5Jzonbm9uZSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnLnNob3cnKS5jc3Moe1xuICAgICAgICAgICAgICAgICdkaXNwbGF5JzonYmxvY2snXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoJy5oaWRlJykuY3NzKHtcbiAgICAgICAgICAgICAgICAnZGlzcGxheSc6J25vbmUnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAkKCcuc2VhcmNoLWJveCBsYWJlbC5ubycpLmNzcyh7XG4gICAgICAgICAgICAgICAgJ2Rpc3BsYXknOidibG9jaydcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnLnNob3cnKS5jc3Moe1xuICAgICAgICAgICAgICAgICdkaXNwbGF5Jzonbm9uZSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnLmhpZGUnKS5jc3Moe1xuICAgICAgICAgICAgICAgICdkaXNwbGF5JzonYmxvY2snXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBzZWFyY2hWdWUucXVlcnkgPSBxdWVyeTtcbiAgICB9XG4gICAgLy/moLnmja7mkJzntKLmoYbnmoTlhoXlrrnliKTmlq3mmK/lkKblh7rnjrDmkJzntKLllYblk4FcbiAgICAkKCcjc2VhcmNoJykuYmluZCgnaW5wdXQgcHJvcGVydHljaGFuZ2UnLCBmdW5jdGlvbigpe1xuICAgICAgICBxdWVyeV9jaGFuZ2VkKCk7XG4gICAgfSk7XG4gICAgLy/lvZPngrnlh7tY5pe25paH5pys5qGG55qE5YC85Li6MO+8m1xuICAgICQoJy5ubycpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJyNzZWFyY2gnKS52YWwoJycpO1xuICAgICAgICBxdWVyeV9jaGFuZ2VkKCk7XG4gICAgfSk7XG4gICAgJCgnI2Jhbm5lci1pbWcnKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnLnNlYXJjaCcpLnZhbCgn54eV5LqsJyk7XG4gICAgICAgIHF1ZXJ5X2NoYW5nZWQoKTtcbiAgICB9KTtcbiAgICAkKCcjYmFubmVyLWltZzEnKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnLnNlYXJjaCcpLnZhbCgn5YG35ZCD54aKJyk7XG4gICAgICAgIHF1ZXJ5X2NoYW5nZWQoKTtcbiAgICB9KTtcblxuICAgIC8vIOW3puS+p+WIl+ihqFxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgIHVybDpcIi9hcGkvdjEuMi9yZWNvbW1lbmRvcmRlci9iYWdtYW4vY2F0ZWdvcmllc1wiLFxuICAgICAgICAgICAgdHlwZSA6ICdnZXQnLFxuICAgICAgICAgICAgZGF0YXR5cGU6ICdqc29ucCcsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpe1xuXG4gICAgICAgICAgICAgICAgLy8g5a2Y5YKo57O75YiX5pWw5o2uXG4gICAgICAgICAgICAgY29uc29sZS5sb2cocmVzKTtcbiAgICAgICAgICAgICBhcHAuY2F0X2lkID0gcmVzLmNhdGVnb3JpZXNbMF0uaWQ7XG4gICAgICAgICAgICAgICBhcHAuc2VyaWVzPXJlcy5jYXRlZ29yaWVzO1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaSBpbiByZXMuY2F0ZWdvcmllcyl7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGNhdF9uYW1lID0gcmVzLmNhdGVnb3JpZXNbaV0ubmFtZTtcblxuICAgICAgICAgICAgICAgICAgICB2YXIgdWxfbGlzdCA9IFwiPGxpIGNsYXNzPSduYXYtaXRlbSBpdGVtIGNhdGVnb3J5LWxpc3QnICBjYXRfaWQ9XCIrIHJlcy5jYXRlZ29yaWVzW2ldLmlkICtcIj5cIitjYXRfbmFtZStcIjwvbGk+XCI7XG4gICAgICAgICAgICAgICAgICAgICQoJ2FydGljbGUgLmxpc3QnKS5hcHBlbmQodWxfbGlzdCk7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICAvL+inhOagvOWIh+aNolxuXG4gICAgICAgICQoXCIjaXRlbS1saXN0XCIpLm9uKCdjbGljaycsJy5zaXplJyxmdW5jdGlvbigpe1xuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcyhcInNlcmllcy1hY3RpdmVcIilcbiAgICAgICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ3Nlcmllcy1hY3RpdmUnKTtcbiAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5wYXJlbnQoKS5jaGlsZHJlbihcIi5saXN0LWNvblwiKS5lcSgkKHRoaXMpLmluZGV4KCkpLmNzcyhcImRpc3BsYXlcIixcImJsb2NrXCIpXG4gICAgICAgICAgICQodGhpcykucGFyZW50KCkucGFyZW50KCkucGFyZW50KCkuY2hpbGRyZW4oXCIubGlzdC1jb25cIikuZXEoJCh0aGlzKS5pbmRleCgpKS5zaWJsaW5ncyhcIi5saXN0LWNvblwiKS5jc3MoXCJkaXNwbGF5XCIsXCJub25lXCIpXG4gICAgICAgIH0pXG5cbiAgICAgICAgJCgnLmxpc3QnKS5vbignY2xpY2snLCAnLm5hdi1pdGVtJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAvLyDmuIXnqbrlsJblpLTlm77niYdcbiAgICAgICAgICAgICQoXCIjYnktcHJpY2UgLmljLWFycm93XCIpLmNzcyhcImJhY2tncm91bmRcIixcIlwiKVxuXG5cblxuXG4gICAgICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICQodGhpcykuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAvLyDmjpLluo/moLflvI9cbiAgICAgICAgICAgICQoJyNieS1zY29yZSBzcGFuJykuYWRkQ2xhc3MoJ2FjdGl2ZScpXG4gICAgICAgICAgICAkKCcjYnktc2NvcmUnKS5zaWJsaW5ncygpLmNoaWxkcmVuKCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgLy8g5qC35byP6buY6K6k5YWo6YOo5ZWG5ZOBXG4gICAgICAgICAgICAkKCcucHJvZHVjdC1zZXJpZXMgLnNlcmllcy1zZWxlY3QnKS5yZW1vdmVDbGFzcygnc2VyaWVzLWFjdGl2ZScpO1xuICAgICAgICAgICAgJCgnLnByb2R1Y3Qtc2VyaWVzIC5zZXJpZXMtc2VsZWN0JykuZXEoMCkuYWRkQ2xhc3MoJ3Nlcmllcy1hY3RpdmUnKTtcbiAgICAgICAgICAgIC8v6buY6K6k57u85ZCI5o6S5bqPc2VyaWVzXG4gICAgICAgICAgICBhcHAuc29ydCA9IDAgO1xuICAgICAgICAgICAgYXBwLmNhdF9pZCA9ICQodGhpcykuYXR0cihcImNhdF9pZFwiKTtcbiAgICAgICAgICAgIGFwcC5zZXJpZXNfaWQgPSBcIlwiXG4gICAgICAgICAgICBhcHAuc2VyaWVzX251bSA9IGFwcC5zZXJpZXNbJCh0aGlzKS5pbmRleCgpXTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy/mjpLliJfpobrluo9cbiAgICAgICAgJCgnI2J5LXNjb3JlJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGFwcC5zb3J0ID0gMDtcbiAgICAgICAgfSkgO1xuICAgICAgICAgJCgnI2J5LXByaWNlJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmIChhcHAuc29ydCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgYXBwLnNvcnQgPSAyO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgYXBwLnNvcnQgPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgJCgnI2J5LW51bScpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBhcHAuc29ydCA9IDM7XG4gICAgICAgIH0pXG4gICAgICAgIC8vIOezu+WIl+agt+W8j+WIh+aNolxuICAgICAgICAkKCcucHJvZHVjdC1zZXJpZXMnKS5vbignY2xpY2snLCAnLnNlcmllcy1zZWxlY3QnLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnc2VyaWVzLWFjdGl2ZScpO1xuICAgICAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCdzZXJpZXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAvLyDmm7TmlLlzZXJpZXNfaWRcbiAgICAgICAgICAgIGFwcC5zZXJpZXNfaWQgPSAkKHRoaXMpLmF0dHIoXCJzZXJpZXNfaWRcIik7XG4gICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgJCgnLmxpc3QnKS5vbignY2xpY2snLCAnLmNhdGVnb3J5LWxpc3QnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQoJyNiYW5uZXInKS5oaWRlKCk7XG4gICAgICAgIH0pO1xuICAgICAgICAkKCcubGlzdCcpLm9uKCdjbGljaycsICcjcmVjJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKCcjYmFubmVyJykuc2hvdygpO1xuICAgICAgICB9KTtcbiAgICAgICAgLy8gbG9hZCBkZWFsZXIgaW5mb1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiBcIi9hcGkvdjEuMS9yZWNvbW1lbmRvcmRlci9kZWFsZXIvXCIgKyBkZWFsZXJfaWQsXG4gICAgICAgICAgICB0eXBlOiBcImdldFwiLFxuICAgICAgICAgICAgZGF0YXR5cGU6IFwiSlNPTlBcIixcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcblxuICAgICAgICAgICAgICAgICQoJyNkZWFsZXJfbmFtZScpLmh0bWwoZGF0YS5kYXRhLmRlYWxlcl9uYW1lKTtcbiAgICAgICAgICAgICAgICAkKCcubW9kZWwgLmNhbGwgLnBob25lLW51bWJlcicpLmh0bWwoZGF0YS5kYXRhLnBob25lKTtcbiAgICAgICAgICAgICAgICAvL+eCueWHu+ehruWumuaMiemSruWPr+S7peaJk+eUteivnVxuICAgICAgICAgICAgICAgICQoJy5tb2RlbCAuc3VyZScpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmPVwidGVsOlwiK2RhdGEuZGF0YS5waG9uZTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgLy/lpoLmnpzmmK/kuJbnuqrlkJvlro/liJnmoLflvI/nqI3liqDkv67mlLlcbiAgICBpZihkZWFsZXJfaWQgPT09IDUpe1xuICAgICAgICAkKCcucHJvbXB0JykuY3NzKHtcbiAgICAgICAgICAgICdkaXNwbGF5JzonYmxvY2snXG4gICAgICAgIH0pO1xuICAgICAgICAkKCduYXYnKS5jc3Moe1xuICAgICAgICAgICAgJ3RvcCc6ICcxLjU2cmVtJyxcbiAgICAgICAgICAgICd6LWluZGV4JzogNjY3LFxuICAgICAgICAgICAgJ2JhY2tncm91bmQtY29sb3InOiAnI2ZjZmRlZSdcbiAgICAgICAgfSk7XG4gICAgICAgICQoJ25hdiAuc2VhcmNoLWJveCcpLmNzcyh7XG4gICAgICAgICAgICAnbWFyZ2luLXRvcCc6ICcwLjA1cmVtJ1xuICAgICAgICB9KTtcbiAgICAgICAgJCgnbWFpbicpLmNzcyh7XG4gICAgICAgICAgICAndG9wJzonMi4yNHJlbSdcbiAgICAgICAgfSk7XG4gICAgICAgICQoJ21haW4gYXJ0aWNsZSAubGlzdCcpLmNzcyh7XG4gICAgICAgICAgICAndG9wJzogJzIuMjRyZW0nXG4gICAgICAgIH0pO1xuICAgICAgICAkKCdtYWluIGFzaWRlIC51bC1ib3gnKS5jc3Moe1xuICAgICAgICAgICAgJ3RvcCc6ICcyLjI0cmVtJ1xuICAgICAgICB9KTtcbiAgICB9XG59KTtcblxuIl0sImZpbGUiOiJiYWdtYW4vYWRkX2l0ZW0uanMifQ==
