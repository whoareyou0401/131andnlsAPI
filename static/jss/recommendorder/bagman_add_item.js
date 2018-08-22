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
        window.location.href = "/recommendorder/salesman/bagman-customer-status";
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
                for(var i=0;i<res.categories.length; i++){

                    var cat_name = res.categories[i].name;
                    if (i==0) {
                        var ul_list = "<li class='nav-item item category-list active'  cat_id="+ res.categories[i].id +">"+cat_name+"</li>";
                        $('article .list').append(ul_list);
                    } else {
                        var ul_list = "<li class='nav-item item category-list'  cat_id="+ res.categories[i].id +">"+cat_name+"</li>";
                        $('article .list').append(ul_list);
                    }

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

});


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9iYWdtYW5fYWRkX2l0ZW0uanMiXSwic291cmNlc0NvbnRlbnQiOlsiJChmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblxuICAgIHZhciBkZWFsZXJfaWQgPSBOdW1iZXIodXJsLm1hdGNoKC8oZGVhbGVyXFwvKVxcZCtcXC8vKVswXS5zcGxpdCgnLycpWzFdKTtcbiAgICB2YXIgY3VzdG9tZXJfaWQgPSBOdW1iZXIodXJsLm1hdGNoKC8oY3VzdG9tZXJcXC8pXFxkK1xcLy8pWzBdLnNwbGl0KCcvJylbMV0pO1xuICAgIHNldHVwQ1NSRigpO1xuICAgIC8qKlxuICAgICAqIHJlcVR5cGU6XG4gICAgICogICBQT1NUIC0tIHNldCBudW1iZXJcbiAgICAgKiAgIFBVVCAtLSBpbmNyZW1lbnQvZGVjcmVtZW50IGRhdGFcbiAgICAgKi9cbiAgICAgLy/ngrnlh7vmlLnlj5jovpPlhaXmoYbkuK3nmoTmlbDlkIzml7bliqDlhaVcbiAgICBmdW5jdGlvbiBzZXRJdGVtQ2FydE51bShpdGVtLCBudW0sIHJlcVR5cGUsIGNiKSB7XG4gICAgICAgIHZhciBwYXJhbXMgPSB7fTtcbiAgICAgICAgcGFyYW1zW2l0ZW0uaWRdID0gbnVtO1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiBcIi9hcGkvdjEuMi9yZWNvbW1lbmRvcmRlci9iYWdtYW4vY3VzdG9tZXIvXCIgKyBjdXN0b21lcl9pZCArIFwiL2NhcnRcIixcbiAgICAgICAgICAgIHR5cGU6IHJlcVR5cGUsXG4gICAgICAgICAgICBkYXRhdHlwZTogXCJqc29ucFwiLFxuICAgICAgICAgICAgZGF0YTogcGFyYW1zLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHJlcy5jb2RlID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNiKHJlcyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQocmVzLmVycm9yX21zZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiBcIi9hcGkvdjEuMi9yZWNvbW1lbmRvcmRlci9iYWdtYW4vY3VzdG9tZXIvXCIgKyBjdXN0b21lcl9pZCArIFwiL2NhcnRcIixcbiAgICAgICAgICAgICAgICB0eXBlOiBcImdldFwiLFxuICAgICAgICAgICAgICAgIGRhdGF0eXBlOiBcImpzb25wXCIsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW1zID0gW107XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5pdGVtcy5sZW5ndGg9PT0wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNwbGFjZS1vcmRlciBpJykuaHRtbChcIigwKVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXMgPSBkYXRhLml0ZW1zO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjcGxhY2Utb3JkZXIgaScpLmh0bWwoXCIoXCIrZGF0YS5pdGVtcy5sZW5ndGgrXCIpXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHZhciBmb290ZXIgPSBuZXcgVnVlKHtcbiAgICAgICAgZWw6ICcjZm9vdGVyJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgdG90YWw6IDBcbiAgICAgICAgfSxcbiAgICAgICAgY29tcHV0ZWQ6IHtcbiAgICAgICAgICAgIGRpc3BsYXlfdG90YWw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnJyArIHRoaXMudG90YWwudG9GaXhlZCgyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBiYW5uZXIgPSBuZXcgVnVlKHtcbiAgICAgICAgZWw6ICcjYmFubmVyJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgZGVhbGVyX2lkOiBkZWFsZXJfaWRcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBhcHAgPSBuZXcgVnVlKHtcbiAgICAgICAgZWw6ICcjaXRlbS1saXN0JyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgLy8gc29ydOWAvFxuICAgICAgICAgICAgc29ydDowLFxuICAgICAgICAgICAgLy8g57O75YiX5pWw5o2uXG4gICAgICAgICAgICBzZXJpZXM6e30sXG4gICAgICAgICAgICBzZXJpZXNfbnVtOnt9LFxuICAgICAgICAgICAgc2VyaWVzX2lkOlwiXCIsXG4gICAgICAgICAgICBpdGVtczogW10sXG4gICAgICAgICAgICBzZWxlY3RlZF9pdGVtczoge30sXG4gICAgICAgICAgICBzb3VyY2U6ICQoJyNzb3VyY2UnKS5hdHRyKFwibmFtZVwiKSxcbiAgICAgICAgICAgIGN1c3RvbWVyX2lkOiAkKCcjc291cmNlJykuYXR0cihcImN1c3RvbWVyX2lkXCIpLFxuICAgICAgICAgICAgY2F0X2lkOiAwLFxuICAgICAgICAgICAgb3JkZXI6ICctc2NvcmUnLFxuICAgICAgICAgICAgaXNHaWZ0UGFnZTogdXJsLnNlYXJjaCgnYWRkLWdpZnQnKSA9PT0gLTEsXG4gICAgICAgICAgICBkZWFsZXJfaWQ6IGRlYWxlcl9pZFxuICAgICAgICB9LFxuICAgICAgICBiZWZvcmVDcmVhdGVkOiBmdW5jdGlvbigpe1xuICAgICAgICB9LFxuICAgICAgICByZWFkeTogZnVuY3Rpb24oaSkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgc2VsZi4kd2F0Y2goJ2NhdF9pZCcsIGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgc2VsZi5sb2FkSXRlbXMoc2VsZi5zb3J0LCBzZWxmLnNlcmllc19pZCAsIHNlbGYuY2F0X2lkICk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHNlbGYuJHdhdGNoKCdzZXJpZXNfaWQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coc2VyaWVzX2lkKTtcbiAgICAgICAgICAgICAgICAgc2VsZi5sb2FkSXRlbXMoc2VsZi5zb3J0LCBzZWxmLnNlcmllc19pZCAsIHNlbGYuY2F0X2lkICk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHNlbGYuJHdhdGNoKCdzb3J0JywgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICAgICAgICAgc2VsZi5sb2FkSXRlbXMoc2VsZi5zb3J0LCBzZWxmLnNlcmllc19pZCAsIHNlbGYuY2F0X2lkICk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIHNlbGYuJHdhdGNoKCdvcmRlcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGlmIChzZWxmLm9yZGVyID09PSAncHJpY2UnKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJyNieS1wcmljZSAuaWMtYXJyb3cnKS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2JhY2tncm91bmQnOid1cmwoL3N0YXRpYy9pbWFnZXMvcmVjb21tZW5kb3JkZXIvaWNfYXJyb3dfZG93bi5wbmcpIG5vLXJlcGVhdCBjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2JhY2tncm91bmRTaXplJzonNjUlJ1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5pdGVtcyA9IHNlbGYuaXRlbXMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYS5wcmljZSAtIGIucHJpY2U7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2VsZi5vcmRlciA9PT0gJy1wcmljZScpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2J5LXByaWNlIC5pYy1hcnJvdycpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAnYmFja2dyb3VuZCc6J3VybCgvc3RhdGljL2ltYWdlcy9yZWNvbW1lbmRvcmRlci9pY19hcnJvd191cC5wbmcpIG5vLXJlcGVhdCBjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2JhY2tncm91bmRTaXplJzonNjUlJ1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5pdGVtcyA9IHNlbGYuaXRlbXMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYi5wcmljZSAtIGEucHJpY2U7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoc2VsZi5vcmRlciA9PT0gJ3Njb3JlJykge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLml0ZW1zID0gc2VsZi5pdGVtcy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhLnNjb3JlIC0gYi5zY29yZTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzZWxmLm9yZGVyID09PSAnLXNjb3JlJykge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLml0ZW1zID0gc2VsZi5pdGVtcy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBiLnNjb3JlIC0gYS5zY29yZTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChzZWxmLm9yZGVyID09PSAnbnVtJykge1xuICAgICAgICAgICAgICAgICAgICAkKCcjYnktbnVtIC5pYy1hcnJvdycpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAnYmFja2dyb3VuZCc6J3VybCgvc3RhdGljL2ltYWdlcy9yZWNvbW1lbmRvcmRlci9pY19hcnJvd19kb3duLnBuZykgbm8tcmVwZWF0IGNlbnRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnYmFja2dyb3VuZFNpemUnOic2NSUnXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLml0ZW1zID0gc2VsZi5pdGVtcy5zb3J0KGZ1bmN0aW9uKGEsIGIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhLm51bSAtIGIubnVtO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHNlbGYub3JkZXIgPT09ICctbnVtJykge1xuICAgICAgICAgICAgICAgICAgICAkKCcjYnktbnVtIC5pYy1hcnJvdycpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAnYmFja2dyb3VuZCc6J3VybCgvc3RhdGljL2ltYWdlcy9yZWNvbW1lbmRvcmRlci9pY19hcnJvd191cC5wbmcpIG5vLXJlcGVhdCBjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2JhY2tncm91bmRTaXplJzonNjUlJ1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5pdGVtcyA9IHNlbGYuaXRlbXMuc29ydChmdW5jdGlvbihhLCBiKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYi5udW0gLSBhLm51bTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAvLyBsb2FkIGJhc2tldCBkYXRhXG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogXCIvYXBpL3YxLjIvcmVjb21tZW5kb3JkZXIvYmFnbWFuL2N1c3RvbWVyL1wiICsgY3VzdG9tZXJfaWQgKyBcIi9jYXJ0XCIsXG4gICAgICAgICAgICAgICAgdHlwZTogXCJnZXRcIixcbiAgICAgICAgICAgICAgICBkYXRhdHlwZTogXCJqc29ucFwiLFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW1zID0gW107XG4gICAgICAgICAgICAgICAgICAgIGlmKGRhdGEuaXRlbXMubGVuZ3RoIT09MCl7XG5cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5pdGVtcy5sZW5ndGg9PT0wKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjcGxhY2Utb3JkZXIgaScpLmh0bWwoXCIoMClcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtcyA9ICBkYXRhLml0ZW1zO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNwbGFjZS1vcmRlciBpJykuaHRtbChcIihcIitkYXRhLml0ZW1zLmxlbmd0aCtcIilcIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpdGVtcyA9ICBkYXRhLml0ZW1zO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXMuZm9yRWFjaChmdW5jdGlvbihkKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWRfaXRlbXNbZC5pdGVtX2lkXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBudW06IE51bWJlcihkLm51bSkudG9GaXhlZCgwKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogZC5wcmljZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgIHNlbGYubG9hZEl0ZW1zKHNlbGYuc29ydCwgc2VsZi5zZXJpZXNfaWQgLCBzZWxmLmNhdF9pZCApO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnJlZnJlc2hTZWxlY3RlZEl0ZW1zKHNlbGYuaXRlbXMpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICBtZXRob2RzOiB7XG4gICAgICAgICAgICBmdW50b2ZpeGVkOmZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgIGlmKGRhdGEgPT0gXCJcIil7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH1lbHNlIGlmICggaXNOYU4oTnVtYmVyKGRhdGEpKSApIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBOdW1iZXIoZGF0YSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNlcmllc0NoYW5nZTpmdW5jdGlvbihudW0pe1xuICAgICAgICAgICAgICAgICAgIHNlbGYuc2VyaWVzX2lkPW51bTtcbiAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhudW0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlZnJlc2hTZWxlY3RlZEl0ZW1zOiBmdW5jdGlvbihpdGVtcykge1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICBpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGVsZSkge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChlbGUuc2VsZWN0ZWRfbnVtICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdGVkX2l0ZW1zW2VsZS5pZF0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbV9pZDogZWxlLml0ZW1faWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVtOiBOdW1iZXIoZWxlLnNlbGVjdGVkX251bSkudG9GaXhlZCgwKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogZWxlLnByaWNlXG4gICAgICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKGVsZS5pZCBpbiBzZWxmLnNlbGVjdGVkX2l0ZW1zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdGVkX2l0ZW1zW2VsZS5pZF0ubnVtID0gMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgZm9vdGVyLnRvdGFsID0gMDtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gc2VsZi5zZWxlY3RlZF9pdGVtcykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IHNlbGYuc2VsZWN0ZWRfaXRlbXNba2V5XTtcbiAgICAgICAgICAgICAgICAgICAgZm9vdGVyLnRvdGFsICs9IGl0ZW0ubnVtICogaXRlbS5wcmljZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbnVtQ2hhbmdlOiBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICAgICAgaWYgKHYuc2VsZWN0ZWRfbnVtID09PSAnJykge1xuICAgICAgICAgICAgICAgICAgICB2LnNlbGVjdGVkX251bSA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHYuc2VsZWN0ZWRfbnVtPXBhcnNlSW50KHYuc2VsZWN0ZWRfbnVtKTtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgc2V0SXRlbUNhcnROdW0odiwgdi5zZWxlY3RlZF9udW0sIFwiUE9TVFwiLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHYuc2VsZWN0ZWRfbnVtID0gTnVtYmVyKGRhdGEubnVtKS50b0ZpeGVkKDApO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnJlZnJlc2hTZWxlY3RlZEl0ZW1zKHNlbGYuaXRlbXMpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlZHVjZUNsaWNrZWQ6IGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgaWYodi5zZWxlY3RlZF9udW08PTApe1xuICAgICAgICAgICAgICAgICAgICB2LnNlbGVjdGVkX251bSA9IDA7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgc2V0SXRlbUNhcnROdW0odiwgLTEsIFwiUFVUXCIsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHYuc2VsZWN0ZWRfbnVtID0gTnVtYmVyKGRhdGEubnVtKS50b0ZpeGVkKDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5yZWZyZXNoU2VsZWN0ZWRJdGVtcyhzZWxmLml0ZW1zKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBsdXNDbGlja2VkOiBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHNldEl0ZW1DYXJ0TnVtKHYsIDEsIFwiUFVUXCIsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdi5zZWxlY3RlZF9udW0gPSBOdW1iZXIoZGF0YS5udW0pLnRvRml4ZWQoMCk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYucmVmcmVzaFNlbGVjdGVkSXRlbXMoc2VsZi5pdGVtcyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaXRlbUZpbHRlcjogZnVuY3Rpb24oaXRlbXMpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdmFyIGlkeCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGl0ZW1zKVxuICAgICAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24oZWxlKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsZS5pZCBpbiBzZWxmLnNlbGVjdGVkX2l0ZW1zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLnNlbGVjdGVkX2l0ZW1zW2VsZS5pZF0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlLnNlbGVjdGVkX251bSA9IHNlbGYuc2VsZWN0ZWRfaXRlbXNbZWxlLmlkXS5udW07XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbGUuc2VsZWN0ZWRfbnVtID0gMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbGUucHJpY2UgPSBwYXJzZUZsb2F0KGVsZS5wcmljZSk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh1cmwuc2VhcmNoKCdhZGQtZ2lmdCcpICE9PSAtMSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgZWxlLmlkID0gXCJnaWZ0OlwiICsgZWxlLmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgZWxlLnByaWNlID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGVsZS5pZCBpbiBzZWxmLnNlbGVjdGVkX2l0ZW1zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlLnNlbGVjdGVkX251bSA9IHNlbGYuc2VsZWN0ZWRfaXRlbXNbZWxlLmlkXS5udW07XG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGUuc2VsZWN0ZWRfbnVtID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbGUuZGlzcGxheV9wcmljZSA9IGVsZS5wcmljZS50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgICAgICAgICBlbGUucXVhbnRpdHkgPSBOdW1iZXIoZWxlLnF1YW50aXR5KS50b0ZpeGVkKDApO1xuICAgICAgICAgICAgICAgICAgICAvLyBlbGUucGFja2luZ19zcGVjaWZpY2F0aW9uID0gTnVtYmVyKGVsZS5wYWNraW5nX3NwZWNpZmljYXRpb24pO1xuXG5cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbXM7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLy8gc2VyaWVzRmlsdGVyOiBmdW5jdGlvbihzZXJpZXMpe1xuICAgICAgICAgICAgLy8gICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIC8vICAgICAgc2VyaWVzLmNhdGVnb3JpZXNbMF0ubmFtZVxuICAgICAgICAgICAgLy8gfTtcbiAgICAgICAgICAgIGxvYWRJdGVtczogZnVuY3Rpb24oIHNvcnQsIHNlcmllc19pZCwgY2F0X2lkKSB7XG4gICAgICAgICAgICAgICAgY2F0X2lkID0gcGFyc2VJbnQoY2F0X2lkKTtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgc2VsZi5pdGVtcyA9IFtdO1xuXG4gICAgICAgICAgICAgICAgICAgICAkKFwiLnByb2R1Y3Qtc2VyaWVzXCIpLmNzcyhcImRpc3BsYXlcIixcImJsb2NrXCIpO1xuICAgICAgICAgICAgICAgICAgICAgIGlmICggc2VyaWVzX2lkID09IFwiXCIgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDpcIi9hcGkvdjEuMi9yZWNvbW1lbmRvcmRlci9iYWdtYW4vY3VzdG9tZXIvXCIrY3VzdG9tZXJfaWQrXCIvY2F0ZWdvcnkvXCIgKyBjYXRfaWQgKyBcIi9pdGVtc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6J2dldCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YXR5cGU6J2pzb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaXRlbXMgPSBzZWxmLml0ZW1GaWx0ZXIoZGF0YS5pdGVtcyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOlwiL2FwaS92MS4yL3JlY29tbWVuZG9yZGVyL2JhZ21hbi9zZXJpZXMvXCIgKyBzZXJpZXNfaWQgKyBcIi9pdGVtc1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOidnZXQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhdHlwZTonanNvbnAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaXRlbXMgPSBzZWxmLml0ZW1GaWx0ZXIoZGF0YS5pdGVtcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cblxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgdmFyIHNlYXJjaFZ1ZSA9IG5ldyBWdWUoe1xuICAgICAgICBlbDogJyNzZWFyY2gtcmVzdWx0cycsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGl0ZW1zOiBbXSxcbiAgICAgICAgICAgIHF1ZXJ5OiAnJyxcbiAgICAgICAgICAgIGRlYWxlcl9pZDogZGVhbGVyX2lkXG4gICAgICAgIH0sXG4gICAgICAgIG1ldGhvZHM6IHtcblxuICAgICAgICAgICAgICBudW1DaGFuZ2U6IGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgaWYgKHYuc2VsZWN0ZWRfbnVtID09PSAnJykge1xuICAgICAgICAgICAgICAgICAgICB2LnNlbGVjdGVkX251bSA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHYuc2VsZWN0ZWRfbnVtPXBhcnNlSW50KHYuc2VsZWN0ZWRfbnVtKTtcbiAgICAgICAgICAgICAgICBzZXRJdGVtQ2FydE51bSh2LCB2LnNlbGVjdGVkX251bSwgXCJQT1NUXCIsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdi5zZWxlY3RlZF9udW0gPSBOdW1iZXIoZGF0YS5udW0pLnRvRml4ZWQoMCk7XG4gICAgICAgICAgICAgICAgICAgIGFwcC5yZWZyZXNoU2VsZWN0ZWRJdGVtcyhzZWxmLml0ZW1zKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZWR1Y2VDbGlja2VkOiBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIGlmKHYuc2VsZWN0ZWRfbnVtPD0wKXtcbiAgICAgICAgICAgICAgICAgICAgdi5zZWxlY3RlZF9udW0gPSAwO1xuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgIHNldEl0ZW1DYXJ0TnVtKHYsIC0xLCBcIlBVVFwiLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2LnNlbGVjdGVkX251bSA9IE51bWJlcihkYXRhLm51bSkudG9GaXhlZCgwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcC5yZWZyZXNoU2VsZWN0ZWRJdGVtcyhzZWxmLml0ZW1zKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBsdXNDbGlja2VkOiBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHNldEl0ZW1DYXJ0TnVtKHYsIDEsIFwiUFVUXCIsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdi5zZWxlY3RlZF9udW0gPSBOdW1iZXIoZGF0YS5udW0pLnRvRml4ZWQoMCk7XG4gICAgICAgICAgICAgICAgICAgIGFwcC5yZWZyZXNoU2VsZWN0ZWRJdGVtcyhzZWxmLml0ZW1zKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgLy/mkJzntKLmlbDmja5cbiAgICAgICAgLy8gcmVhZHk6IGZ1bmN0aW9uKCl7XG4gICAgICAgIC8vICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgIC8vICAgICBzZWxmLiR3YXRjaCgncXVlcnknLCBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8gICAgICAgICBpZiAoc2VsZi5xdWVyeS5sZW5ndGggPiAxKSB7XG4gICAgICAgIC8vICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICB1cmw6XCIvYXBpL3YxLjIvcmVjb21tZW5kb3JkZXIvY3VzdG9tZXIvXCIrY3VzdG9tZXJfaWQrXCIvZGVhbGVyL1wiK2RlYWxlcl9pZCtcIi9pdGVtc1wiLFxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgdHlwZTogXCJnZXRcIixcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIGRhdGF0eXBlOiBcImpzb25wXCIsXG4gICAgICAgIC8vICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgIC8vICAgICAgICAgICAgICAgICAgICAgXCJrZXlcIjogc2VsZi5xdWVyeVxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcblxuICAgICAgICAvLyAgICAgICAgICAgICAgICAgICAgIHNlbGYuaXRlbXMgPSBhcHAuaXRlbUZpbHRlcihkYXRhLml0ZW1zKTtcbiAgICAgICAgLy8gICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYuaXRlbXMpO1xuICAgICAgICAvLyAgICAgICAgICAgICAgICAgfVxuICAgICAgICAvLyAgICAgICAgICAgICB9KTtcbiAgICAgICAgLy8gICAgICAgICB9XG4gICAgICAgIC8vICAgICB9KTtcbiAgICAgICAgLy8gfVxuICAgIH0pO1xuICAgICQoJyNieS1wcmljZScpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJyNieS1udW0gLmljLWFycm93JykuY3NzKHtcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kJzondXJsKC9zdGF0aWMvaW1hZ2VzL3JlY29tbWVuZG9yZGVyL2ljX2Fycm93LnBuZykgbm8tcmVwZWF0IGNlbnRlcicsXG4gICAgICAgICAgICAnYmFja2dyb3VuZFNpemUnOic2NSUnXG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoYXBwLm9yZGVyID09PSAnLXByaWNlJykge1xuICAgICAgICAgICAgYXBwLm9yZGVyID0gJ3ByaWNlJztcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBhcHAub3JkZXIgPSAnLXByaWNlJztcbiAgICAgICAgfVxuICAgIH0pO1xuICAgICQoJyNieS1zY29yZScpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcuaWMtYXJyb3cnKS5jc3Moe1xuICAgICAgICAgICAgJ2JhY2tncm91bmQnOid1cmwoL3N0YXRpYy9pbWFnZXMvcmVjb21tZW5kb3JkZXIvaWNfYXJyb3cucG5nKSBuby1yZXBlYXQgY2VudGVyJyxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kU2l6ZSc6JzY1JSdcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIGlmIChhcHAub3JkZXIgPT09ICctc2NvcmUnKSB7XG4gICAgICAgIC8vICAgICBhcHAub3JkZXIgPSAnc2NvcmUnO1xuICAgICAgICAvLyB9IGVsc2Uge1xuICAgICAgICAvLyAgICAgYXBwLm9yZGVyID0gJy1zY29yZSc7XG4gICAgICAgIC8vIH1cbiAgICB9KTtcbiAgICAkKCcjYnktbnVtJykuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgICQoJyNieS1wcmljZSAuaWMtYXJyb3cnKS5jc3Moe1xuICAgICAgICAgICAgJ2JhY2tncm91bmQnOid1cmwoL3N0YXRpYy9pbWFnZXMvcmVjb21tZW5kb3JkZXIvaWNfYXJyb3cucG5nKSBuby1yZXBlYXQgY2VudGVyJyxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kU2l6ZSc6JzY1JSdcbiAgICAgICAgfSk7XG4gICAgICAgIGlmIChhcHAub3JkZXIgPT09ICctbnVtJykge1xuICAgICAgICAgICAgYXBwLm9yZGVyID0gJ251bSc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBhcHAub3JkZXIgPSAnLW51bSc7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAvL+eCueWHu+eUteivneaMiemSrlxuXG4gICAgJCgnLmhvbWUtaW5mby1uYXYtYicpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJy5tb2RlbCcpLmNzcyh7XG4gICAgICAgICAgICAnZGlzcGxheSc6J2Jsb2NrJ1xuICAgICAgICB9KTtcbiAgICAgICAgJCgnLm1vZGVsIC5jYWxsJykuY3NzKHtcbiAgICAgICAgICAgICdkaXNwbGF5JzonYmxvY2snXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIC8v54K55Ye75Y+W5raI5oyJ6ZKu5qih5oCB5raI5aSxXG4gICAgJCgnLmNhbmNlbCcpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJy5tb2RlbCcpLmNzcyh7XG4gICAgICAgICAgICAnZGlzcGxheSc6J25vbmUnXG4gICAgICAgIH0pO1xuICAgICAgICAkKCcubW9kZWwgLmNhbGwnKS5jc3Moe1xuICAgICAgICAgICAgJ2Rpc3BsYXknOidub25lJ1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAvL+eCueWHu+a3u+WKoOaooeaAgeWHuueOsFxuICAgICQoJy5tb25leScpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJy5hZGQnKS5jc3Moe1xuICAgICAgICAgICAgJ2Rpc3BsYXknOidibG9jaydcbiAgICAgICAgfSk7XG4gICAgICAgICQoJy5hZGQgLmNhbGwnKS5jc3Moe1xuICAgICAgICAgICAgJ2Rpc3BsYXknOidibG9jaydcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgLy/ngrnlh7vljrvotK3nianovabmjInpkq7pobXpnaLot7PovazlnKjotK3nianovabpobXpnaLlkIzml7bllYblk4Hlh7rnjrDlnKjotK3nianovabkuK1cbiAgICAkKCcjcGxhY2Utb3JkZXInKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICB2YXIgbmV3X2hyZWYgPSAnL3JlY29tbWVuZG9yZGVyL2JhZ21hbi9jdXN0b21lci8nICsgY3VzdG9tZXJfaWQgKyAnL2NhcnQnO1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IG5ld19ocmVmO1xuICAgIH0pO1xuICAgIC8v54K55Ye76L+U5Zue5oyJ6ZKuKOe7meWQjOS4gOS4qui/lOWbnuaMiemSruS9huS4jeWQjOeahOaDheWGteS4i+e7meS4jeWQjOeahOi/lOWbnueVjOmdoilcbiAgICB2YXIgc2VhcmNoVmFsTGVuID0gJCgnLnNlYXJjaCcpLnZhbCgpLmxlbmd0aDtcbiAgICAkKCcuaG9tZS1pbmZvLW5hdi1hJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIi9yZWNvbW1lbmRvcmRlci9zYWxlc21hbi9iYWdtYW4tY3VzdG9tZXItc3RhdHVzXCI7XG4gICAgfSk7XG4gICAgJCgnLmxpc3QnKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAkKHRoaXMpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5zaWJsaW5ncygpLmNoaWxkcmVuKCcubGlzdCcpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICB9KTtcbiAgICAvL+eCueWHu+WbvueJh+WHuueOsOaooeaAgeaYvuekuuWkp+WbvlxuICAgICQoJy5saXN0Jykub24oJ2NsaWNrJywnLmltZ0JpZycsZnVuY3Rpb24oZXYpe1xuICAgICAgICB2YXIgYmlnSW1nU3JjID0gJChldi50YXJnZXQpLmF0dHIoXCJiaWdzcmNcIik7XG4gICAgICAgICQoJy5pbWdCaWdTaG93IGltZycpLmF0dHIoXCJzcmNcIiwgYmlnSW1nU3JjKTtcbiAgICAgICAgJCgnLm1vZGVsSW1nJykuY3NzKHtcbiAgICAgICAgICAgICdkaXNwbGF5JzonYmxvY2snXG4gICAgICAgIH0pO1xuICAgICAgICAkKCcuaW1nQmlnU2hvdyBpbWcnKS5jc3Moe1xuICAgICAgICAgICAgJ2Rpc3BsYXknOidibG9jaydcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgLy/ngrnlh7vku7vmhI/mjInpkq7mqKHmgIHmtojlpLFcbiAgICAkKCcubW9kZWxJbWcnKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAkKHRoaXMpLmNzcyh7XG4gICAgICAgICAgICAnZGlzcGxheSc6J25vbmUnXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIGZ1bmN0aW9uIHF1ZXJ5X2NoYW5nZWQoKSB7XG4gICAgICAgIHZhciBxdWVyeSA9ICQoJyNzZWFyY2gnKS52YWwoKTtcbiAgICAgICAgaWYgKHF1ZXJ5Lmxlbmd0aCA9PT0gMCl7XG4gICAgICAgICAgICAkKCcuc2VhcmNoLWJveCBsYWJlbC5ubycpLmNzcyh7XG4gICAgICAgICAgICAgICAgJ2Rpc3BsYXknOidub25lJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcuc2hvdycpLmNzcyh7XG4gICAgICAgICAgICAgICAgJ2Rpc3BsYXknOidibG9jaydcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnLmhpZGUnKS5jc3Moe1xuICAgICAgICAgICAgICAgICdkaXNwbGF5Jzonbm9uZSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICQoJy5zZWFyY2gtYm94IGxhYmVsLm5vJykuY3NzKHtcbiAgICAgICAgICAgICAgICAnZGlzcGxheSc6J2Jsb2NrJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcuc2hvdycpLmNzcyh7XG4gICAgICAgICAgICAgICAgJ2Rpc3BsYXknOidub25lJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcuaGlkZScpLmNzcyh7XG4gICAgICAgICAgICAgICAgJ2Rpc3BsYXknOidibG9jaydcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHNlYXJjaFZ1ZS5xdWVyeSA9IHF1ZXJ5O1xuICAgIH1cbiAgICAvL+agueaNruaQnOe0ouahhueahOWGheWuueWIpOaWreaYr+WQpuWHuueOsOaQnOe0ouWVhuWTgVxuICAgICQoJyNzZWFyY2gnKS5iaW5kKCdpbnB1dCBwcm9wZXJ0eWNoYW5nZScsIGZ1bmN0aW9uKCl7XG4gICAgICAgIHF1ZXJ5X2NoYW5nZWQoKTtcbiAgICB9KTtcbiAgICAvL+W9k+eCueWHu1jml7bmlofmnKzmoYbnmoTlgLzkuLow77ybXG4gICAgJCgnLm5vJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnI3NlYXJjaCcpLnZhbCgnJyk7XG4gICAgICAgIHF1ZXJ5X2NoYW5nZWQoKTtcbiAgICB9KTtcbiAgICAkKCcjYmFubmVyLWltZycpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcuc2VhcmNoJykudmFsKCfnh5XkuqwnKTtcbiAgICAgICAgcXVlcnlfY2hhbmdlZCgpO1xuICAgIH0pO1xuICAgICQoJyNiYW5uZXItaW1nMScpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcuc2VhcmNoJykudmFsKCflgbflkIPnhoonKTtcbiAgICAgICAgcXVlcnlfY2hhbmdlZCgpO1xuICAgIH0pO1xuXG4gICAgLy8g5bem5L6n5YiX6KGoXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgdXJsOlwiL2FwaS92MS4yL3JlY29tbWVuZG9yZGVyL2JhZ21hbi9jYXRlZ29yaWVzXCIsXG4gICAgICAgICAgICB0eXBlIDogJ2dldCcsXG4gICAgICAgICAgICBkYXRhdHlwZTogJ2pzb25wJyxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcyl7XG5cbiAgICAgICAgICAgICAgICAvLyDlrZjlgqjns7vliJfmlbDmja5cbiAgICAgICAgICAgICBjb25zb2xlLmxvZyhyZXMpO1xuICAgICAgICAgICAgIGFwcC5jYXRfaWQgPSByZXMuY2F0ZWdvcmllc1swXS5pZDtcbiAgICAgICAgICAgICAgIGFwcC5zZXJpZXM9cmVzLmNhdGVnb3JpZXM7XG4gICAgICAgICAgICAgICAgZm9yKHZhciBpPTA7aTxyZXMuY2F0ZWdvcmllcy5sZW5ndGg7IGkrKyl7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIGNhdF9uYW1lID0gcmVzLmNhdGVnb3JpZXNbaV0ubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGk9PTApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciB1bF9saXN0ID0gXCI8bGkgY2xhc3M9J25hdi1pdGVtIGl0ZW0gY2F0ZWdvcnktbGlzdCBhY3RpdmUnICBjYXRfaWQ9XCIrIHJlcy5jYXRlZ29yaWVzW2ldLmlkICtcIj5cIitjYXRfbmFtZStcIjwvbGk+XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCdhcnRpY2xlIC5saXN0JykuYXBwZW5kKHVsX2xpc3QpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHVsX2xpc3QgPSBcIjxsaSBjbGFzcz0nbmF2LWl0ZW0gaXRlbSBjYXRlZ29yeS1saXN0JyAgY2F0X2lkPVwiKyByZXMuY2F0ZWdvcmllc1tpXS5pZCArXCI+XCIrY2F0X25hbWUrXCI8L2xpPlwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnYXJ0aWNsZSAubGlzdCcpLmFwcGVuZCh1bF9saXN0KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgLy/op4TmoLzliIfmjaJcblxuICAgICAgICAkKFwiI2l0ZW0tbGlzdFwiKS5vbignY2xpY2snLCcuc2l6ZScsZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoXCJzZXJpZXMtYWN0aXZlXCIpXG4gICAgICAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCdzZXJpZXMtYWN0aXZlJyk7XG4gICAgICAgICAgICQodGhpcykucGFyZW50KCkucGFyZW50KCkucGFyZW50KCkuY2hpbGRyZW4oXCIubGlzdC1jb25cIikuZXEoJCh0aGlzKS5pbmRleCgpKS5jc3MoXCJkaXNwbGF5XCIsXCJibG9ja1wiKVxuICAgICAgICAgICAkKHRoaXMpLnBhcmVudCgpLnBhcmVudCgpLnBhcmVudCgpLmNoaWxkcmVuKFwiLmxpc3QtY29uXCIpLmVxKCQodGhpcykuaW5kZXgoKSkuc2libGluZ3MoXCIubGlzdC1jb25cIikuY3NzKFwiZGlzcGxheVwiLFwibm9uZVwiKVxuICAgICAgICB9KVxuXG4gICAgICAgICQoJy5saXN0Jykub24oJ2NsaWNrJywgJy5uYXYtaXRlbScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8g5riF56m65bCW5aS05Zu+54mHXG4gICAgICAgICAgICAkKFwiI2J5LXByaWNlIC5pYy1hcnJvd1wiKS5jc3MoXCJiYWNrZ3JvdW5kXCIsXCJcIilcblxuXG5cblxuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgLy8g5o6S5bqP5qC35byPXG4gICAgICAgICAgICAkKCcjYnktc2NvcmUgc3BhbicpLmFkZENsYXNzKCdhY3RpdmUnKVxuICAgICAgICAgICAgJCgnI2J5LXNjb3JlJykuc2libGluZ3MoKS5jaGlsZHJlbigpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIC8vIOagt+W8j+m7mOiupOWFqOmDqOWVhuWTgVxuICAgICAgICAgICAgJCgnLnByb2R1Y3Qtc2VyaWVzIC5zZXJpZXMtc2VsZWN0JykucmVtb3ZlQ2xhc3MoJ3Nlcmllcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICQoJy5wcm9kdWN0LXNlcmllcyAuc2VyaWVzLXNlbGVjdCcpLmVxKDApLmFkZENsYXNzKCdzZXJpZXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAvL+m7mOiupOe7vOWQiOaOkuW6j3Nlcmllc1xuICAgICAgICAgICAgYXBwLnNvcnQgPSAwIDtcbiAgICAgICAgICAgIGFwcC5jYXRfaWQgPSAkKHRoaXMpLmF0dHIoXCJjYXRfaWRcIik7XG4gICAgICAgICAgICBhcHAuc2VyaWVzX2lkID0gXCJcIlxuICAgICAgICAgICAgYXBwLnNlcmllc19udW0gPSBhcHAuc2VyaWVzWyQodGhpcykuaW5kZXgoKV07XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8v5o6S5YiX6aG65bqPXG4gICAgICAgICQoJyNieS1zY29yZScpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBhcHAuc29ydCA9IDA7XG4gICAgICAgIH0pIDtcbiAgICAgICAgICQoJyNieS1wcmljZScpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBpZiAoYXBwLnNvcnQgPT0gMSkge1xuICAgICAgICAgICAgICAgIGFwcC5zb3J0ID0gMjtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIGFwcC5zb3J0ID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgICQoJyNieS1udW0nKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAgICAgYXBwLnNvcnQgPSAzO1xuICAgICAgICB9KVxuICAgICAgICAvLyDns7vliJfmoLflvI/liIfmjaJcbiAgICAgICAgJCgnLnByb2R1Y3Qtc2VyaWVzJykub24oJ2NsaWNrJywgJy5zZXJpZXMtc2VsZWN0JywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ3Nlcmllcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICQodGhpcykuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnc2VyaWVzLWFjdGl2ZScpO1xuICAgICAgICAgICAgLy8g5pu05pS5c2VyaWVzX2lkXG4gICAgICAgICAgICBhcHAuc2VyaWVzX2lkID0gJCh0aGlzKS5hdHRyKFwic2VyaWVzX2lkXCIpO1xuICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICQoJy5saXN0Jykub24oJ2NsaWNrJywgJy5jYXRlZ29yeS1saXN0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKCcjYmFubmVyJykuaGlkZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgJCgnLmxpc3QnKS5vbignY2xpY2snLCAnI3JlYycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJCgnI2Jhbm5lcicpLnNob3coKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIGxvYWQgZGVhbGVyIGluZm9cbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogXCIvYXBpL3YxLjEvcmVjb21tZW5kb3JkZXIvZGVhbGVyL1wiICsgZGVhbGVyX2lkLFxuICAgICAgICAgICAgdHlwZTogXCJnZXRcIixcbiAgICAgICAgICAgIGRhdGF0eXBlOiBcIkpTT05QXCIsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICAkKCcjZGVhbGVyX25hbWUnKS5odG1sKGRhdGEuZGF0YS5kZWFsZXJfbmFtZSk7XG4gICAgICAgICAgICAgICAgJCgnLm1vZGVsIC5jYWxsIC5waG9uZS1udW1iZXInKS5odG1sKGRhdGEuZGF0YS5waG9uZSk7XG4gICAgICAgICAgICAgICAgLy/ngrnlh7vnoa7lrprmjInpkq7lj6/ku6XmiZPnlLXor51cbiAgICAgICAgICAgICAgICAkKCcubW9kZWwgLnN1cmUnKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZj1cInRlbDpcIitkYXRhLmRhdGEucGhvbmU7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59KTtcblxuIl0sImZpbGUiOiJyZWNvbW1lbmRvcmRlci9iYWdtYW5fYWRkX2l0ZW0uanMifQ==
