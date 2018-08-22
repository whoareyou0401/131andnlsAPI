$(function() {
    'use strict';
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
            url: '/api/v1.1/recommendorder/customer/' + customer_id + '/cart',
            type: reqType,
            datatype: 'jsonp',
            data: params,
            success: function(res) {
                if(res.code === 0) {
                    cb(res);
                } else {
                    alert(res.error_msg);
                }
                $.ajax({
                    url: '/recommendorder/api/v1/customer/' + customer_id + '/cart',
                    type: 'get',
                    datatype: 'jsonp',
                    success: function(data) {
                        var items = [];
                        if(data.items.length !== 0) {
                            if(data.items.items.length !== 0) {
                                for(var i in data.items.items) {
                                    if(dealer_id == data.items.items[i].id) {
                                        if(data.items.items[i].items.length === 0) {
                                            $('#place-order i').html('(0)');
                                            items = data.items;
                                        } else {
                                            $('#place-order i').html('(' + data.items.items[i].items.length + ')');
                                        }
                                    }
                                }
                            } else {
                                $('#place-order i').html('(0)');
                            }
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
        },
        methods: {
            recommendUrl: function () {
                zhuge.track('个性推荐（经销商店铺）',function () {
                    window.location.href = '/recommendorder/customer/' + customer_id + '/recommend';
                });
            },
            customerProfile: function () {
                zhuge.track('个人中心（经销商店铺）',function () {
                    window.location.href = '/recommendorder/customer/' + customer_id + '/profile';
                });
            }
        }
    });
    var app = new Vue({
        el: '#item-list',
        data: {
            // sort值
            sort: 0,
            // 系列数据
            series: {},
            series_num: {},
            series_id: '',
            items: [],
            selected_items: {},
            source: $('#source').attr('name'),
            customer_id: $('#source').attr('customer_id'),
            cat_id: 0,
            order: '-score',
            isGiftPage: url.search('add-gift') === -1,
            dealer_id: dealer_id,
            list: [],
            info:{}
        },
        methods: {
            bannerjump:function(){
                 if(app.info.bannerjumpimage !== null && app.info.bannerjumpimage !== '') {
                 window.location.href = '/recommendorder/dealer/' + dealer_id + '/customer/' + customer_id + '/active-regulation';
                }
            },
            funtofixed: function(data) {
                if(data === '') {
                    return data;
                } else if(isNaN(Number(data))) {

                    return data;
                } else {
                    return Number(data);

                }
            },
            allseries:function(e){
                 var self = this;
                self.series_id = '';
                // 系列样式切换
                $(e.currentTarget).addClass('series-active');
                $(e.currentTarget).siblings().removeClass('series-active');
            },
            seriesChange: function(e, num) {
                var self = this;
                self.series_id = num;
                // 系列样式切换
                $(e.currentTarget).addClass('series-active');
                $(e.currentTarget).siblings().removeClass('series-active');
            },
            refreshSelectedItems: function(items) {
                var self = this;
                items.forEach(function(dat) {
                    dat.items.forEach(function(ele) {
                        if(ele.selected_num !== 0) {
                            self.selected_items[ele.id] = {
                                item_id: ele.id,
                                num: Number(ele.selected_num).toFixed(0),
                                price: ele.price
                            };
                        } else if(ele.id in self.selected_items) {
                            self.selected_items[ele.id].num = 0;
                        }
                    });
                });
                footer.total = 0;
                for(var key in self.selected_items) {
                    var item = self.selected_items[key];
                    footer.total += item.num * item.price;
                }
            },
            numChange: function(v) {
                if(v.selected_num === '') {
                    v.selected_num = 0;
                } else if(isNaN(Number(v.selected_num))) {
                    v.selected_num = 0;
                }
                v.selected_num = parseInt(v.selected_num);
                var self = this;
                setItemCartNum(v, v.selected_num, 'POST', function(data) {
                    v.selected_num = Number(data.num).toFixed(0);
                    self.refreshSelectedItems(self.items);
                });
            },
            reduceClicked: function(v) {
                var self = this;
                if(v.selected_num <= 0) {
                    v.selected_num = 0;
                } else {
                    setItemCartNum(v, -1, 'PUT', function(data) {
                        v.selected_num = Number(data.num).toFixed(0);
                        self.refreshSelectedItems(self.items);
                    });
                }
            },
            plusClicked: function(v) {
                var self = this;
                setItemCartNum(v, 1, 'PUT', function(data) {
                    v.selected_num = Number(data.num).toFixed(0);

                    self.refreshSelectedItems(self.items);
                });
            },
            itemFilter: function(items) {
                var self = this;
                var idx = 0;
                // console.log(self.selected_items)
                items.forEach(function(dat) {
                    dat.items.forEach(function(ele) {
                        if(ele.id in self.selected_items) {
                            ele.selected_num = self.selected_items[ele.id].num;
                        } else {
                            ele.selected_num = 0;
                        }
                        ele.price = parseFloat(ele.price);
                        if(url.search('add-gift') !== -1) {
                            ele.id = 'gift:' + ele.id;
                            ele.price = 0;
                            if(ele.id in self.selected_items) {
                                ele.selected_num = self.selected_items[ele.id].num;
                            } else {
                                ele.selected_num = 0;
                            }
                        }
                        ele.display_price = ele.price.toFixed(2);
                        ele.quantity = ele.quantity.toFixed(0);
                        // ele.packing_specification = Number(ele.packing_specification);
                    });

                });
                return items;
            },
            loadItems: function(sort, series_id, cat_id) {
                cat_id = parseInt(cat_id);
                var self = this;
                self.items = [];
                if(cat_id === 0) {
                    $('.product-series').css('display', 'none');
                    $.ajax({
                        url: '/api/v1.2/recommendorder/customer/' + customer_id + '/dealer/' + dealer_id + '/items',
                        type: 'get',
                        datatype: 'jsonp',
                        data: {
                            'sort': sort
                        },

                        success: function(data) {
                            self.items = self.itemFilter(data.items);
                        },
                        error: function(data) {}
                    });
                } else {
                    $('.product-series').css('display', 'block');
                    if(series_id === '') {
                        $.ajax({
                            url: '/api/v1.2/recommendorder/customer/' + customer_id + '/dealer/' + dealer_id + '/items',
                            type: 'get',
                            datatype: 'jsonp',
                            data: {
                                'cat_id': cat_id,
                                'sort': sort
                            },
                            success: function(data) {

                                self.items = self.itemFilter(data.items);

                            }
                        });

                    } else {
                        $.ajax({
                            url: '/api/v1.2/recommendorder/customer/' + customer_id + '/dealer/' + dealer_id + '/items',
                            type: 'get',
                            datatype: 'jsonp',
                            data: {
                                'series_id': series_id,
                                'sort': sort
                            },
                            success: function(data) {
                                self.items = self.itemFilter(data.items);
                            }
                        });
                    }

                }
            }
        },
        mounted: function() {
            var self = this;
            // banner
             $.ajax({
                url: '/api/v1.2/recommendorder/customer/' + customer_id + '/dealer/' + dealer_id + '/activity',
                type: 'get',
                success: function(data) {
       
                    self.info = data;

                }
            });

            $.ajax({
                url: '/api/v1.1/recommendorder/customer/' + customer_id + '/dealer-list',
                type: 'get',
                success: function(data) {
                    var orderable = false;
                    for(var i = 0; i < data.dealers.length; i++) {
                        if(data.dealers[i].id == dealer_id && data.dealers[i].orderable) {
                            orderable = true;
                        }
                    }
                    if(!orderable) {
                        window.location.href = '/recommendorder/customer/' + customer_id + '/dealer-list';
                    }
                }
            });
            $.ajax({
                url: '/api/v1.2/recommendorder/customer/' + customer_id + '/dealer/' + dealer_id + '/categories',
                type: 'get',
                datatype: 'jsonp',
                success: function(res) {
                    // 存储系列数据
                    app.series = res.categories;
                    app.list = res.categories;
                }
            });
            $.ajax({
                url: '/recommendorder/api/v1/customer/' + customer_id + '/cart',
                type: 'get',
                datatype: 'jsonp',
                success: function(data) {
                    self.selected_items = {};
                    // console.log(data);
                    var items = [];
                    if(data.items.items.length !== 0) {
                        for(var i in data.items.items) {
                            if(dealer_id === data.items.items[i].id) {
                                if(data.items.items[0].items.length === 0) {
                                    $('#place-order i').html('(0)');
                                    items = data.items.items[0].items;
                                } else {
                                    $('#place-order i').html('(' + data.items.items[0].items.length + ')');
                                    items = data.items.items[0].items;
                                    items.forEach(function(d) {
                                        if(!data.items.items[0].items[i].is_giveaway) {
                                            // console.log(self.selected_items)
                                            self.selected_items[d.item_id] = {
                                                num: Number(d.num).toFixed(0),
                                                price: d.price
                                            };
                                        }
                                    });
                                }
                            }
                        }
                    }
                    self.loadItems(self.sort, self.series_id, self.cat_id);
                    self.refreshSelectedItems(self.items);
                }
            });
        },
        watch: {
            cat_id: function() {

                var self = this;
                self.loadItems(self.sort, self.series_id, self.cat_id);

            },
            series_id: function() {
                var self = this;
                self.loadItems(self.sort, self.series_id, self.cat_id);
            },
            sort: function() {
                var self = this;
                if(self.sort == 2) {
                    $('#by-price .ic-arrow').css({
                        'background': 'url(/static/images/recommendorder/ic_arrow_down.png) no-repeat center',
                        'backgroundSize': '65%'
                    });
                } else if(self.sort == 1) {
                    $('#by-price .ic-arrow').css({
                        'background': 'url(/static/images/recommendorder/ic_arrow_up.png) no-repeat center',
                        'backgroundSize': '65%'
                    });

                }
                self.loadItems(self.sort, self.series_id, self.cat_id);

            }
        }
    });
    var bd = new Vue({
        el: '#bd',
        data: {
            dealerid: dealer_id,
            info:{},
            //修改密码提示flag
            passflag:false
        },
        beforeCreate: function(){
            var user_role = getCookie('user_role');
            this.isSalesman = user_role === "salesman";
        },
        methods:{
            activityjump:function(){
                if(app.info.popupjumpimage !== null && app.info.popupjumpimage !== '') {
                $('.activity').css('display', 'none');
                $('.activitysec').css('display', 'block');

                }
            },
            pass:function(){
                var self = this;
                self.passflag=false;
      
                if(document.referrer.indexOf('dealer-list') !== -1 && self.info.popupenabled === 1 && self.info.popupimage !== null && self.info.popupimage !== '' && self.passflag === false) {
                        $('.activity').css('display', 'block');
                }
                $.ajax({
                    url: "/api/v1.3/recommendorder/customers/" + customer_id + "/validation",
                    type: "PATCH",
                    success: function(data) {
                    }
                 });

            },
            passhref:function(){
                window.location.href='/recommendorder/customer/' + customer_id + '/setting';
                $.ajax({
                    url: "/api/v1.3/recommendorder/customers/" + customer_id + "/validation",
                    type: "PATCH",
                    success: function(data) {
                    }
                 });
            }
        },
         mounted: function() {
            var self = this;
            $.ajax({
                url: '/api/v1.2/recommendorder/customer/' + customer_id + '/dealer/' + dealer_id + '/activity',
                type: 'get',
                success: function(data) {
                    self.info = data;
                    // banner图跳转回 阻止活动页面弹出
                    if(document.referrer.indexOf('dealer-list') !== -1 && self.info.popupenabled === 1 && self.info.popupimage !== null && self.info.popupimage !== '' && self.passflag === false) {
                        $('.activity').css('display', 'block');
                    }
                }
            });
            // 密码修改提示
            if (this.isSalesman===false) {
                $.ajax({
                    url: "/api/v1.3/recommendorder/customers/" + customer_id + "/validation",
                    type: "GET",
                    success: function(data) {

                        if (data.validation_status===false) {
                            self.passflag=true;
                        }else{
                            self.passflag=false;
                        }
                   
                 }
                });  
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
                if(v.selected_num === '') {
                    v.selected_num = 0;
                } else if(isNaN(Number(v.selected_num))) {
                    v.selected_num = 0;
                }
                v.selected_num = parseInt(v.selected_num);
                setItemCartNum(v, v.selected_num, 'POST', function(data) {
                    v.selected_num = Number(data.num).toFixed(0);
                    app.refreshSelectedItems(self.items);
                });
            },
            reduceClicked: function(v) {
                var self = this;
                if(v.selected_num <= 0) {
                    v.selected_num = 0;
                } else {
                    setItemCartNum(v, -1, 'PUT', function(data) {
                        v.selected_num = Number(data.num).toFixed(0);
                        app.refreshSelectedItems(self.items);
                    });
                }
            },
            plusClicked: function(v) {
                var self = this;
                setItemCartNum(v, 1, 'PUT', function(data) {
                    v.selected_num = Number(data.num).toFixed(0);
                    app.refreshSelectedItems(self.items);
                });
            }
        },

        //搜索数据
        watch: {
            query: function() {
                var self = this;
                if(self.query.length > 1) {
                    $.ajax({
                        url: '/api/v1.2/recommendorder/customer/' + customer_id + '/dealer/' + dealer_id + '/items',
                        type: 'get',
                        datatype: 'jsonp',
                        data: {
                            'key': self.query
                        },
                        success: function(data) {

                            self.items = app.itemFilter(data.items);
                            console.log(self.items);
                        }
                    });
                }
            }
        }

    });
    $('#by-price').click(function() {
        $('#by-num .ic-arrow').css({
            'background': 'url(/static/images/recommendorder/ic_arrow.png) no-repeat center',
            'backgroundSize': '65%'
        });
    });
    $('#by-score').click(function() {
        $('.ic-arrow').css({
            'background': 'url(/static/images/recommendorder/ic_arrow.png) no-repeat center',
            'backgroundSize': '65%'
        });
    });
    $('#by-num').click(function() {
        $('#by-price .ic-arrow').css({
            'background': 'url(/static/images/recommendorder/ic_arrow.png) no-repeat center',
            'backgroundSize': '65%'
        });
    });
    //点击电话按钮

    $('.home-info-nav-b').click(function() {
        $('.model').css({
            'display': 'block'
        });
        $('.model .call').css({
            'display': 'block'
        });
    });
    //点击取消按钮模态消失
    $('.cancel').click(function() {
        $('.model').css({
            'display': 'none'
        });
        $('.model .call').css({
            'display': 'none'
        });
    });
    //点击添加模态出现
    $('.money').click(function() {
        $('.add').css({
            'display': 'block'
        });
        $('.add .call').css({
            'display': 'block'
        });
    });
    //点击去购物车按钮页面跳转在购物车页面同时商品出现在购物车中
    $('#place-order').click(function() {
        var new_href = '/recommendorder/customer/' + customer_id + '/cart';
        window.location.href = new_href;
    });
    //点击返回按钮(给同一个返回按钮但不同的情况下给不同的返回界面)
    var searchValLen = $('.search').val().length;
    $('.home-info-nav-a').click(function() {
        if(searchValLen === 0) {
            window.location.href = '/recommendorder/customer/' + customer_id + '/dealer-list';
        }
    });
    $('.list').click(function() {
        $(this).addClass('active');
        $(this).parent().siblings().children('.list').removeClass('active');
    });

    //点击图片出现模态显示大图
    $('.list').on('click', '.imgBig', function(ev) {
        var bigImgSrc;
        if($(ev.target).attr('bigsrc') === null) {
            bigImgSrc = '/static/images/recommendorder/Bmr.png';
        } else {
            bigImgSrc = $(ev.target).attr('bigsrc');
        }
        $('.imgBigShow img').attr('src', bigImgSrc);
        $('.modelImg').css({
            'display': 'block'
        });
        $('.imgBigShow img').css({
            'display': 'block'
        });
    });
    //点击任意按钮模态消失
    $('.modelImg').click(function() {
        $(this).css({
            'display': 'none'
        });
    });
    // 阻止默认滑动
    $('.activity').on('touchmove', function(e) {
        e.preventDefault();

    });
    $('.modelImg').on('touchmove', function(e) {
        e.preventDefault();

    });
    //点击活动页面消失
    $('.activitybutton').click(function() {
        $('.activity').css('display', 'none');
    });
    $('.activityhead-img').click(function() {
        $('.activitysec').css('display', 'none');
    });
  

    function query_changed() {
        var query = $('#search').val();
        if(query.length === 0) {
            $('.search-box label.no').css({
                'display': 'none'
            });
            $('.show').css({
                'display': 'block'
            });
            $('.hide').css({
                'display': 'none'
            });
        } else {
            $('.search-box label.no').css({
                'display': 'block'
            });
            $('.show').css({
                'display': 'none'
            });
            $('.hide').css({
                'display': 'block'
            });
        }
        searchVue.query = query;
    }
    //根据搜索框的内容判断是否出现搜索商品
    $('#search').bind('input propertychange', function() {
        query_changed();
    });
    //当点击X时文本框的值为0；
    $('.no').click(function() {
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
        //规格切换
        $('#item-list').on('click', '.size', function() {
            $(this).addClass('series-active');
            $(this).siblings().removeClass('series-active');
            $(this).parent().parent().parent().children('.list-con').eq($(this).index()).css('display', 'block');
            $(this).parent().parent().parent().children('.list-con').eq($(this).index()).siblings('.list-con').css('display', 'none');
        });

        $('.list').on('click', '.nav-item', function() {
            // 清空尖头图片
            $('#by-price .ic-arrow').css('background', '');
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            // 排序样式
            $('#by-score span').addClass('active');
            $('#by-score').siblings().children().removeClass('active');
            // 样式默认全部商品
            $('.product-series .series-select').removeClass('series-active');
            $('.product-series .series-select').eq(0).addClass('series-active');
            //默认综合排序series
            app.sort = 0;
            app.cat_id = $(this).attr('cat_id');
            app.series_id = '';
            if($(this).attr('cat_id') != '0') {
                app.series_num = app.series[Number($(this).index()) - 1];
            }
        });

        //排列顺序
        $('#by-score').click(function() {
            app.sort = 0;

        });
        $('#by-price').click(function() {
            if(app.sort == 1) {
                app.sort = 2;
            } else {
                app.sort = 1;
            }
        });
        $('#by-num').click(function() {
            app.sort = 3;
        });

        $('.list').on('click', '.category-list', function() {
            $('#banner').hide();
        });
        $('.list').on('click', '#rec', function() {
            $('#banner').show();
        });
        // load dealer info
        $.ajax({
            url: '/api/v1.1/recommendorder/dealer/' + dealer_id,
            type: 'get',
            datatype: 'JSONP',
            success: function(data) {

                $('#dealer_name').html(data.data.dealer_name);
                $('.model .call .phone-number').html(data.data.phone);
                //点击确定按钮可以打电话
                $('.model .sure').click(function() {
                    window.location.href = 'tel:' + data.data.phone;
                });
            }
        });
    });

});