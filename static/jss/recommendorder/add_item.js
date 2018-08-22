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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9hZGRfaXRlbS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIkKGZ1bmN0aW9uKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gICAgdmFyIGRlYWxlcl9pZCA9IE51bWJlcih1cmwubWF0Y2goLyhkZWFsZXJcXC8pXFxkK1xcLy8pWzBdLnNwbGl0KCcvJylbMV0pO1xuICAgIHZhciBjdXN0b21lcl9pZCA9IE51bWJlcih1cmwubWF0Y2goLyhjdXN0b21lclxcLylcXGQrXFwvLylbMF0uc3BsaXQoJy8nKVsxXSk7XG5cbiAgICBzZXR1cENTUkYoKTtcbiAgICAvKipcbiAgICAgKiByZXFUeXBlOlxuICAgICAqICAgUE9TVCAtLSBzZXQgbnVtYmVyXG4gICAgICogICBQVVQgLS0gaW5jcmVtZW50L2RlY3JlbWVudCBkYXRhXG4gICAgICovXG4gICAgLy/ngrnlh7vmlLnlj5jovpPlhaXmoYbkuK3nmoTmlbDlkIzml7bliqDlhaVcbiAgICBmdW5jdGlvbiBzZXRJdGVtQ2FydE51bShpdGVtLCBudW0sIHJlcVR5cGUsIGNiKSB7XG4gICAgICAgIHZhciBwYXJhbXMgPSB7fTtcbiAgICAgICAgcGFyYW1zW2l0ZW0uaWRdID0gbnVtO1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgdXJsOiAnL2FwaS92MS4xL3JlY29tbWVuZG9yZGVyL2N1c3RvbWVyLycgKyBjdXN0b21lcl9pZCArICcvY2FydCcsXG4gICAgICAgICAgICB0eXBlOiByZXFUeXBlLFxuICAgICAgICAgICAgZGF0YXR5cGU6ICdqc29ucCcsXG4gICAgICAgICAgICBkYXRhOiBwYXJhbXMsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICAgICAgICBpZihyZXMuY29kZSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBjYihyZXMpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KHJlcy5lcnJvcl9tc2cpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvcmVjb21tZW5kb3JkZXIvYXBpL3YxL2N1c3RvbWVyLycgKyBjdXN0b21lcl9pZCArICcvY2FydCcsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdnZXQnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhdHlwZTogJ2pzb25wJyxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW1zID0gW107XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihkYXRhLml0ZW1zLmxlbmd0aCAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGRhdGEuaXRlbXMuaXRlbXMubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaSBpbiBkYXRhLml0ZW1zLml0ZW1zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihkZWFsZXJfaWQgPT0gZGF0YS5pdGVtcy5pdGVtc1tpXS5pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGRhdGEuaXRlbXMuaXRlbXNbaV0uaXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNwbGFjZS1vcmRlciBpJykuaHRtbCgnKDApJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zID0gZGF0YS5pdGVtcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjcGxhY2Utb3JkZXIgaScpLmh0bWwoJygnICsgZGF0YS5pdGVtcy5pdGVtc1tpXS5pdGVtcy5sZW5ndGggKyAnKScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNwbGFjZS1vcmRlciBpJykuaHRtbCgnKDApJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICB2YXIgZm9vdGVyID0gbmV3IFZ1ZSh7XG4gICAgICAgIGVsOiAnI2Zvb3RlcicsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIHRvdGFsOiAwXG4gICAgICAgIH0sXG4gICAgICAgIGNvbXB1dGVkOiB7XG4gICAgICAgICAgICBkaXNwbGF5X3RvdGFsOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJycgKyB0aGlzLnRvdGFsLnRvRml4ZWQoMik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG1ldGhvZHM6IHtcbiAgICAgICAgICAgIHJlY29tbWVuZFVybDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHpodWdlLnRyYWNrKCfkuKrmgKfmjqjojZDvvIjnu4/plIDllYblupfpk7rvvIknLGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL3JlY29tbWVuZG9yZGVyL2N1c3RvbWVyLycgKyBjdXN0b21lcl9pZCArICcvcmVjb21tZW5kJztcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjdXN0b21lclByb2ZpbGU6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB6aHVnZS50cmFjaygn5Liq5Lq65Lit5b+D77yI57uP6ZSA5ZWG5bqX6ZO677yJJyxmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9yZWNvbW1lbmRvcmRlci9jdXN0b21lci8nICsgY3VzdG9tZXJfaWQgKyAnL3Byb2ZpbGUnO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgdmFyIGFwcCA9IG5ldyBWdWUoe1xuICAgICAgICBlbDogJyNpdGVtLWxpc3QnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAvLyBzb3J05YC8XG4gICAgICAgICAgICBzb3J0OiAwLFxuICAgICAgICAgICAgLy8g57O75YiX5pWw5o2uXG4gICAgICAgICAgICBzZXJpZXM6IHt9LFxuICAgICAgICAgICAgc2VyaWVzX251bToge30sXG4gICAgICAgICAgICBzZXJpZXNfaWQ6ICcnLFxuICAgICAgICAgICAgaXRlbXM6IFtdLFxuICAgICAgICAgICAgc2VsZWN0ZWRfaXRlbXM6IHt9LFxuICAgICAgICAgICAgc291cmNlOiAkKCcjc291cmNlJykuYXR0cignbmFtZScpLFxuICAgICAgICAgICAgY3VzdG9tZXJfaWQ6ICQoJyNzb3VyY2UnKS5hdHRyKCdjdXN0b21lcl9pZCcpLFxuICAgICAgICAgICAgY2F0X2lkOiAwLFxuICAgICAgICAgICAgb3JkZXI6ICctc2NvcmUnLFxuICAgICAgICAgICAgaXNHaWZ0UGFnZTogdXJsLnNlYXJjaCgnYWRkLWdpZnQnKSA9PT0gLTEsXG4gICAgICAgICAgICBkZWFsZXJfaWQ6IGRlYWxlcl9pZCxcbiAgICAgICAgICAgIGxpc3Q6IFtdLFxuICAgICAgICAgICAgaW5mbzp7fVxuICAgICAgICB9LFxuICAgICAgICBtZXRob2RzOiB7XG4gICAgICAgICAgICBiYW5uZXJqdW1wOmZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgIGlmKGFwcC5pbmZvLmJhbm5lcmp1bXBpbWFnZSAhPT0gbnVsbCAmJiBhcHAuaW5mby5iYW5uZXJqdW1waW1hZ2UgIT09ICcnKSB7XG4gICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9yZWNvbW1lbmRvcmRlci9kZWFsZXIvJyArIGRlYWxlcl9pZCArICcvY3VzdG9tZXIvJyArIGN1c3RvbWVyX2lkICsgJy9hY3RpdmUtcmVndWxhdGlvbic7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZ1bnRvZml4ZWQ6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICBpZihkYXRhID09PSAnJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYoaXNOYU4oTnVtYmVyKGRhdGEpKSkge1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBOdW1iZXIoZGF0YSk7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYWxsc2VyaWVzOmZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgc2VsZi5zZXJpZXNfaWQgPSAnJztcbiAgICAgICAgICAgICAgICAvLyDns7vliJfmoLflvI/liIfmjaJcbiAgICAgICAgICAgICAgICAkKGUuY3VycmVudFRhcmdldCkuYWRkQ2xhc3MoJ3Nlcmllcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICAgICAkKGUuY3VycmVudFRhcmdldCkuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnc2VyaWVzLWFjdGl2ZScpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNlcmllc0NoYW5nZTogZnVuY3Rpb24oZSwgbnVtKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHNlbGYuc2VyaWVzX2lkID0gbnVtO1xuICAgICAgICAgICAgICAgIC8vIOezu+WIl+agt+W8j+WIh+aNolxuICAgICAgICAgICAgICAgICQoZS5jdXJyZW50VGFyZ2V0KS5hZGRDbGFzcygnc2VyaWVzLWFjdGl2ZScpO1xuICAgICAgICAgICAgICAgICQoZS5jdXJyZW50VGFyZ2V0KS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKCdzZXJpZXMtYWN0aXZlJyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVmcmVzaFNlbGVjdGVkSXRlbXM6IGZ1bmN0aW9uKGl0ZW1zKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24oZGF0KSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdC5pdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGVsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoZWxlLnNlbGVjdGVkX251bSAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWRfaXRlbXNbZWxlLmlkXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbV9pZDogZWxlLmlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBudW06IE51bWJlcihlbGUuc2VsZWN0ZWRfbnVtKS50b0ZpeGVkKDApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBwcmljZTogZWxlLnByaWNlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZihlbGUuaWQgaW4gc2VsZi5zZWxlY3RlZF9pdGVtcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWRfaXRlbXNbZWxlLmlkXS5udW0gPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBmb290ZXIudG90YWwgPSAwO1xuICAgICAgICAgICAgICAgIGZvcih2YXIga2V5IGluIHNlbGYuc2VsZWN0ZWRfaXRlbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSBzZWxmLnNlbGVjdGVkX2l0ZW1zW2tleV07XG4gICAgICAgICAgICAgICAgICAgIGZvb3Rlci50b3RhbCArPSBpdGVtLm51bSAqIGl0ZW0ucHJpY2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG51bUNoYW5nZTogZnVuY3Rpb24odikge1xuICAgICAgICAgICAgICAgIGlmKHYuc2VsZWN0ZWRfbnVtID09PSAnJykge1xuICAgICAgICAgICAgICAgICAgICB2LnNlbGVjdGVkX251bSA9IDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKGlzTmFOKE51bWJlcih2LnNlbGVjdGVkX251bSkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHYuc2VsZWN0ZWRfbnVtID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdi5zZWxlY3RlZF9udW0gPSBwYXJzZUludCh2LnNlbGVjdGVkX251bSk7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHNldEl0ZW1DYXJ0TnVtKHYsIHYuc2VsZWN0ZWRfbnVtLCAnUE9TVCcsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdi5zZWxlY3RlZF9udW0gPSBOdW1iZXIoZGF0YS5udW0pLnRvRml4ZWQoMCk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYucmVmcmVzaFNlbGVjdGVkSXRlbXMoc2VsZi5pdGVtcyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVkdWNlQ2xpY2tlZDogZnVuY3Rpb24odikge1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICBpZih2LnNlbGVjdGVkX251bSA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHYuc2VsZWN0ZWRfbnVtID0gMDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzZXRJdGVtQ2FydE51bSh2LCAtMSwgJ1BVVCcsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHYuc2VsZWN0ZWRfbnVtID0gTnVtYmVyKGRhdGEubnVtKS50b0ZpeGVkKDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5yZWZyZXNoU2VsZWN0ZWRJdGVtcyhzZWxmLml0ZW1zKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBsdXNDbGlja2VkOiBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHNldEl0ZW1DYXJ0TnVtKHYsIDEsICdQVVQnLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHYuc2VsZWN0ZWRfbnVtID0gTnVtYmVyKGRhdGEubnVtKS50b0ZpeGVkKDApO1xuXG4gICAgICAgICAgICAgICAgICAgIHNlbGYucmVmcmVzaFNlbGVjdGVkSXRlbXMoc2VsZi5pdGVtcyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaXRlbUZpbHRlcjogZnVuY3Rpb24oaXRlbXMpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdmFyIGlkeCA9IDA7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coc2VsZi5zZWxlY3RlZF9pdGVtcylcbiAgICAgICAgICAgICAgICBpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGRhdCkge1xuICAgICAgICAgICAgICAgICAgICBkYXQuaXRlbXMuZm9yRWFjaChmdW5jdGlvbihlbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGVsZS5pZCBpbiBzZWxmLnNlbGVjdGVkX2l0ZW1zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlLnNlbGVjdGVkX251bSA9IHNlbGYuc2VsZWN0ZWRfaXRlbXNbZWxlLmlkXS5udW07XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZS5zZWxlY3RlZF9udW0gPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlLnByaWNlID0gcGFyc2VGbG9hdChlbGUucHJpY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYodXJsLnNlYXJjaCgnYWRkLWdpZnQnKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGUuaWQgPSAnZ2lmdDonICsgZWxlLmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZS5wcmljZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoZWxlLmlkIGluIHNlbGYuc2VsZWN0ZWRfaXRlbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlLnNlbGVjdGVkX251bSA9IHNlbGYuc2VsZWN0ZWRfaXRlbXNbZWxlLmlkXS5udW07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlLnNlbGVjdGVkX251bSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlLmRpc3BsYXlfcHJpY2UgPSBlbGUucHJpY2UudG9GaXhlZCgyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZS5xdWFudGl0eSA9IGVsZS5xdWFudGl0eS50b0ZpeGVkKDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZWxlLnBhY2tpbmdfc3BlY2lmaWNhdGlvbiA9IE51bWJlcihlbGUucGFja2luZ19zcGVjaWZpY2F0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbXM7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbG9hZEl0ZW1zOiBmdW5jdGlvbihzb3J0LCBzZXJpZXNfaWQsIGNhdF9pZCkge1xuICAgICAgICAgICAgICAgIGNhdF9pZCA9IHBhcnNlSW50KGNhdF9pZCk7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHNlbGYuaXRlbXMgPSBbXTtcbiAgICAgICAgICAgICAgICBpZihjYXRfaWQgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnByb2R1Y3Qtc2VyaWVzJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcbiAgICAgICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJy9hcGkvdjEuMi9yZWNvbW1lbmRvcmRlci9jdXN0b21lci8nICsgY3VzdG9tZXJfaWQgKyAnL2RlYWxlci8nICsgZGVhbGVyX2lkICsgJy9pdGVtcycsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZ2V0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGF0eXBlOiAnanNvbnAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzb3J0Jzogc29ydFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaXRlbXMgPSBzZWxmLml0ZW1GaWx0ZXIoZGF0YS5pdGVtcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKGRhdGEpIHt9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5wcm9kdWN0LXNlcmllcycpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuICAgICAgICAgICAgICAgICAgICBpZihzZXJpZXNfaWQgPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJy9hcGkvdjEuMi9yZWNvbW1lbmRvcmRlci9jdXN0b21lci8nICsgY3VzdG9tZXJfaWQgKyAnL2RlYWxlci8nICsgZGVhbGVyX2lkICsgJy9pdGVtcycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2dldCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YXR5cGU6ICdqc29ucCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnY2F0X2lkJzogY2F0X2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc29ydCc6IHNvcnRcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLml0ZW1zID0gc2VsZi5pdGVtRmlsdGVyKGRhdGEuaXRlbXMpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAnL2FwaS92MS4yL3JlY29tbWVuZG9yZGVyL2N1c3RvbWVyLycgKyBjdXN0b21lcl9pZCArICcvZGVhbGVyLycgKyBkZWFsZXJfaWQgKyAnL2l0ZW1zJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZ2V0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhdHlwZTogJ2pzb25wJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzZXJpZXNfaWQnOiBzZXJpZXNfaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzb3J0Jzogc29ydFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLml0ZW1zID0gc2VsZi5pdGVtRmlsdGVyKGRhdGEuaXRlbXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG1vdW50ZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgLy8gYmFubmVyXG4gICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvYXBpL3YxLjIvcmVjb21tZW5kb3JkZXIvY3VzdG9tZXIvJyArIGN1c3RvbWVyX2lkICsgJy9kZWFsZXIvJyArIGRlYWxlcl9pZCArICcvYWN0aXZpdHknLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdnZXQnLFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5pbmZvID0gZGF0YTtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogJy9hcGkvdjEuMS9yZWNvbW1lbmRvcmRlci9jdXN0b21lci8nICsgY3VzdG9tZXJfaWQgKyAnL2RlYWxlci1saXN0JyxcbiAgICAgICAgICAgICAgICB0eXBlOiAnZ2V0JyxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvcmRlcmFibGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IGRhdGEuZGVhbGVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoZGF0YS5kZWFsZXJzW2ldLmlkID09IGRlYWxlcl9pZCAmJiBkYXRhLmRlYWxlcnNbaV0ub3JkZXJhYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3JkZXJhYmxlID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZighb3JkZXJhYmxlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvcmVjb21tZW5kb3JkZXIvY3VzdG9tZXIvJyArIGN1c3RvbWVyX2lkICsgJy9kZWFsZXItbGlzdCc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiAnL2FwaS92MS4yL3JlY29tbWVuZG9yZGVyL2N1c3RvbWVyLycgKyBjdXN0b21lcl9pZCArICcvZGVhbGVyLycgKyBkZWFsZXJfaWQgKyAnL2NhdGVnb3JpZXMnLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdnZXQnLFxuICAgICAgICAgICAgICAgIGRhdGF0eXBlOiAnanNvbnAnLFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgICAgICAgICAvLyDlrZjlgqjns7vliJfmlbDmja5cbiAgICAgICAgICAgICAgICAgICAgYXBwLnNlcmllcyA9IHJlcy5jYXRlZ29yaWVzO1xuICAgICAgICAgICAgICAgICAgICBhcHAubGlzdCA9IHJlcy5jYXRlZ29yaWVzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvcmVjb21tZW5kb3JkZXIvYXBpL3YxL2N1c3RvbWVyLycgKyBjdXN0b21lcl9pZCArICcvY2FydCcsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2dldCcsXG4gICAgICAgICAgICAgICAgZGF0YXR5cGU6ICdqc29ucCcsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdGVkX2l0ZW1zID0ge307XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbXMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgaWYoZGF0YS5pdGVtcy5pdGVtcy5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaSBpbiBkYXRhLml0ZW1zLml0ZW1zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoZGVhbGVyX2lkID09PSBkYXRhLml0ZW1zLml0ZW1zW2ldLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGRhdGEuaXRlbXMuaXRlbXNbMF0uaXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjcGxhY2Utb3JkZXIgaScpLmh0bWwoJygwKScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXMgPSBkYXRhLml0ZW1zLml0ZW1zWzBdLml0ZW1zO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI3BsYWNlLW9yZGVyIGknKS5odG1sKCcoJyArIGRhdGEuaXRlbXMuaXRlbXNbMF0uaXRlbXMubGVuZ3RoICsgJyknKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zID0gZGF0YS5pdGVtcy5pdGVtc1swXS5pdGVtcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFkYXRhLml0ZW1zLml0ZW1zWzBdLml0ZW1zW2ldLmlzX2dpdmVhd2F5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHNlbGYuc2VsZWN0ZWRfaXRlbXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWRfaXRlbXNbZC5pdGVtX2lkXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bTogTnVtYmVyKGQubnVtKS50b0ZpeGVkKDApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IGQucHJpY2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzZWxmLmxvYWRJdGVtcyhzZWxmLnNvcnQsIHNlbGYuc2VyaWVzX2lkLCBzZWxmLmNhdF9pZCk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYucmVmcmVzaFNlbGVjdGVkSXRlbXMoc2VsZi5pdGVtcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIHdhdGNoOiB7XG4gICAgICAgICAgICBjYXRfaWQ6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHNlbGYubG9hZEl0ZW1zKHNlbGYuc29ydCwgc2VsZi5zZXJpZXNfaWQsIHNlbGYuY2F0X2lkKTtcblxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNlcmllc19pZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHNlbGYubG9hZEl0ZW1zKHNlbGYuc29ydCwgc2VsZi5zZXJpZXNfaWQsIHNlbGYuY2F0X2lkKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzb3J0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgaWYoc2VsZi5zb3J0ID09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2J5LXByaWNlIC5pYy1hcnJvdycpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAnYmFja2dyb3VuZCc6ICd1cmwoL3N0YXRpYy9pbWFnZXMvcmVjb21tZW5kb3JkZXIvaWNfYXJyb3dfZG93bi5wbmcpIG5vLXJlcGVhdCBjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2JhY2tncm91bmRTaXplJzogJzY1JSdcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKHNlbGYuc29ydCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJyNieS1wcmljZSAuaWMtYXJyb3cnKS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2JhY2tncm91bmQnOiAndXJsKC9zdGF0aWMvaW1hZ2VzL3JlY29tbWVuZG9yZGVyL2ljX2Fycm93X3VwLnBuZykgbm8tcmVwZWF0IGNlbnRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnYmFja2dyb3VuZFNpemUnOiAnNjUlJ1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZWxmLmxvYWRJdGVtcyhzZWxmLnNvcnQsIHNlbGYuc2VyaWVzX2lkLCBzZWxmLmNhdF9pZCk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBiZCA9IG5ldyBWdWUoe1xuICAgICAgICBlbDogJyNiZCcsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGRlYWxlcmlkOiBkZWFsZXJfaWQsXG4gICAgICAgICAgICBpbmZvOnt9LFxuICAgICAgICAgICAgLy/kv67mlLnlr4bnoIHmj5DnpLpmbGFnXG4gICAgICAgICAgICBwYXNzZmxhZzpmYWxzZVxuICAgICAgICB9LFxuICAgICAgICBiZWZvcmVDcmVhdGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgdXNlcl9yb2xlID0gZ2V0Q29va2llKCd1c2VyX3JvbGUnKTtcbiAgICAgICAgICAgIHRoaXMuaXNTYWxlc21hbiA9IHVzZXJfcm9sZSA9PT0gXCJzYWxlc21hblwiO1xuICAgICAgICB9LFxuICAgICAgICBtZXRob2RzOntcbiAgICAgICAgICAgIGFjdGl2aXR5anVtcDpmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGlmKGFwcC5pbmZvLnBvcHVwanVtcGltYWdlICE9PSBudWxsICYmIGFwcC5pbmZvLnBvcHVwanVtcGltYWdlICE9PSAnJykge1xuICAgICAgICAgICAgICAgICQoJy5hY3Rpdml0eScpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICAgICAgICAgICAgICAgJCgnLmFjdGl2aXR5c2VjJykuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJyk7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFzczpmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICBzZWxmLnBhc3NmbGFnPWZhbHNlO1xuICAgICAgXG4gICAgICAgICAgICAgICAgaWYoZG9jdW1lbnQucmVmZXJyZXIuaW5kZXhPZignZGVhbGVyLWxpc3QnKSAhPT0gLTEgJiYgc2VsZi5pbmZvLnBvcHVwZW5hYmxlZCA9PT0gMSAmJiBzZWxmLmluZm8ucG9wdXBpbWFnZSAhPT0gbnVsbCAmJiBzZWxmLmluZm8ucG9wdXBpbWFnZSAhPT0gJycgJiYgc2VsZi5wYXNzZmxhZyA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5hY3Rpdml0eScpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL2FwaS92MS4zL3JlY29tbWVuZG9yZGVyL2N1c3RvbWVycy9cIiArIGN1c3RvbWVyX2lkICsgXCIvdmFsaWRhdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIlBBVENIXCIsXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhc3NocmVmOmZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWY9Jy9yZWNvbW1lbmRvcmRlci9jdXN0b21lci8nICsgY3VzdG9tZXJfaWQgKyAnL3NldHRpbmcnO1xuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvYXBpL3YxLjMvcmVjb21tZW5kb3JkZXIvY3VzdG9tZXJzL1wiICsgY3VzdG9tZXJfaWQgKyBcIi92YWxpZGF0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiUEFUQ0hcIixcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICAgbW91bnRlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogJy9hcGkvdjEuMi9yZWNvbW1lbmRvcmRlci9jdXN0b21lci8nICsgY3VzdG9tZXJfaWQgKyAnL2RlYWxlci8nICsgZGVhbGVyX2lkICsgJy9hY3Rpdml0eScsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2dldCcsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmluZm8gPSBkYXRhO1xuICAgICAgICAgICAgICAgICAgICAvLyBiYW5uZXLlm77ot7Povazlm54g6Zi75q2i5rS75Yqo6aG16Z2i5by55Ye6XG4gICAgICAgICAgICAgICAgICAgIGlmKGRvY3VtZW50LnJlZmVycmVyLmluZGV4T2YoJ2RlYWxlci1saXN0JykgIT09IC0xICYmIHNlbGYuaW5mby5wb3B1cGVuYWJsZWQgPT09IDEgJiYgc2VsZi5pbmZvLnBvcHVwaW1hZ2UgIT09IG51bGwgJiYgc2VsZi5pbmZvLnBvcHVwaW1hZ2UgIT09ICcnICYmIHNlbGYucGFzc2ZsYWcgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcuYWN0aXZpdHknKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgLy8g5a+G56CB5L+u5pS55o+Q56S6XG4gICAgICAgICAgICBpZiAodGhpcy5pc1NhbGVzbWFuPT09ZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL2FwaS92MS4zL3JlY29tbWVuZG9yZGVyL2N1c3RvbWVycy9cIiArIGN1c3RvbWVyX2lkICsgXCIvdmFsaWRhdGlvblwiLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIkdFVFwiLFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLnZhbGlkYXRpb25fc3RhdHVzPT09ZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnBhc3NmbGFnPXRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnBhc3NmbGFnPWZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7ICBcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgfSk7XG4gICAgdmFyIHNlYXJjaFZ1ZSA9IG5ldyBWdWUoe1xuICAgICAgICBlbDogJyNzZWFyY2gtcmVzdWx0cycsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGl0ZW1zOiBbXSxcbiAgICAgICAgICAgIHF1ZXJ5OiAnJyxcbiAgICAgICAgICAgIGRlYWxlcl9pZDogZGVhbGVyX2lkXG4gICAgICAgIH0sXG4gICAgICAgIG1ldGhvZHM6IHtcblxuICAgICAgICAgICAgbnVtQ2hhbmdlOiBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIGlmKHYuc2VsZWN0ZWRfbnVtID09PSAnJykge1xuICAgICAgICAgICAgICAgICAgICB2LnNlbGVjdGVkX251bSA9IDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKGlzTmFOKE51bWJlcih2LnNlbGVjdGVkX251bSkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHYuc2VsZWN0ZWRfbnVtID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdi5zZWxlY3RlZF9udW0gPSBwYXJzZUludCh2LnNlbGVjdGVkX251bSk7XG4gICAgICAgICAgICAgICAgc2V0SXRlbUNhcnROdW0odiwgdi5zZWxlY3RlZF9udW0sICdQT1NUJywgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICB2LnNlbGVjdGVkX251bSA9IE51bWJlcihkYXRhLm51bSkudG9GaXhlZCgwKTtcbiAgICAgICAgICAgICAgICAgICAgYXBwLnJlZnJlc2hTZWxlY3RlZEl0ZW1zKHNlbGYuaXRlbXMpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlZHVjZUNsaWNrZWQ6IGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgaWYodi5zZWxlY3RlZF9udW0gPD0gMCkge1xuICAgICAgICAgICAgICAgICAgICB2LnNlbGVjdGVkX251bSA9IDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0SXRlbUNhcnROdW0odiwgLTEsICdQVVQnLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2LnNlbGVjdGVkX251bSA9IE51bWJlcihkYXRhLm51bSkudG9GaXhlZCgwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcC5yZWZyZXNoU2VsZWN0ZWRJdGVtcyhzZWxmLml0ZW1zKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBsdXNDbGlja2VkOiBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHNldEl0ZW1DYXJ0TnVtKHYsIDEsICdQVVQnLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHYuc2VsZWN0ZWRfbnVtID0gTnVtYmVyKGRhdGEubnVtKS50b0ZpeGVkKDApO1xuICAgICAgICAgICAgICAgICAgICBhcHAucmVmcmVzaFNlbGVjdGVkSXRlbXMoc2VsZi5pdGVtcyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgLy/mkJzntKLmlbDmja5cbiAgICAgICAgd2F0Y2g6IHtcbiAgICAgICAgICAgIHF1ZXJ5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgaWYoc2VsZi5xdWVyeS5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICcvYXBpL3YxLjIvcmVjb21tZW5kb3JkZXIvY3VzdG9tZXIvJyArIGN1c3RvbWVyX2lkICsgJy9kZWFsZXIvJyArIGRlYWxlcl9pZCArICcvaXRlbXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2dldCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhdHlwZTogJ2pzb25wJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAna2V5Jzogc2VsZi5xdWVyeVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaXRlbXMgPSBhcHAuaXRlbUZpbHRlcihkYXRhLml0ZW1zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzZWxmLml0ZW1zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9KTtcbiAgICAkKCcjYnktcHJpY2UnKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnI2J5LW51bSAuaWMtYXJyb3cnKS5jc3Moe1xuICAgICAgICAgICAgJ2JhY2tncm91bmQnOiAndXJsKC9zdGF0aWMvaW1hZ2VzL3JlY29tbWVuZG9yZGVyL2ljX2Fycm93LnBuZykgbm8tcmVwZWF0IGNlbnRlcicsXG4gICAgICAgICAgICAnYmFja2dyb3VuZFNpemUnOiAnNjUlJ1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAkKCcjYnktc2NvcmUnKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnLmljLWFycm93JykuY3NzKHtcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kJzogJ3VybCgvc3RhdGljL2ltYWdlcy9yZWNvbW1lbmRvcmRlci9pY19hcnJvdy5wbmcpIG5vLXJlcGVhdCBjZW50ZXInLFxuICAgICAgICAgICAgJ2JhY2tncm91bmRTaXplJzogJzY1JSdcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgJCgnI2J5LW51bScpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcjYnktcHJpY2UgLmljLWFycm93JykuY3NzKHtcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kJzogJ3VybCgvc3RhdGljL2ltYWdlcy9yZWNvbW1lbmRvcmRlci9pY19hcnJvdy5wbmcpIG5vLXJlcGVhdCBjZW50ZXInLFxuICAgICAgICAgICAgJ2JhY2tncm91bmRTaXplJzogJzY1JSdcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgLy/ngrnlh7vnlLXor53mjInpkq5cblxuICAgICQoJy5ob21lLWluZm8tbmF2LWInKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnLm1vZGVsJykuY3NzKHtcbiAgICAgICAgICAgICdkaXNwbGF5JzogJ2Jsb2NrJ1xuICAgICAgICB9KTtcbiAgICAgICAgJCgnLm1vZGVsIC5jYWxsJykuY3NzKHtcbiAgICAgICAgICAgICdkaXNwbGF5JzogJ2Jsb2NrJ1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAvL+eCueWHu+WPlua2iOaMiemSruaooeaAgea2iOWksVxuICAgICQoJy5jYW5jZWwnKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnLm1vZGVsJykuY3NzKHtcbiAgICAgICAgICAgICdkaXNwbGF5JzogJ25vbmUnXG4gICAgICAgIH0pO1xuICAgICAgICAkKCcubW9kZWwgLmNhbGwnKS5jc3Moe1xuICAgICAgICAgICAgJ2Rpc3BsYXknOiAnbm9uZSdcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgLy/ngrnlh7vmt7vliqDmqKHmgIHlh7rnjrBcbiAgICAkKCcubW9uZXknKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnLmFkZCcpLmNzcyh7XG4gICAgICAgICAgICAnZGlzcGxheSc6ICdibG9jaydcbiAgICAgICAgfSk7XG4gICAgICAgICQoJy5hZGQgLmNhbGwnKS5jc3Moe1xuICAgICAgICAgICAgJ2Rpc3BsYXknOiAnYmxvY2snXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIC8v54K55Ye75Y676LSt54mp6L2m5oyJ6ZKu6aG16Z2i6Lez6L2s5Zyo6LSt54mp6L2m6aG16Z2i5ZCM5pe25ZWG5ZOB5Ye6546w5Zyo6LSt54mp6L2m5LitXG4gICAgJCgnI3BsYWNlLW9yZGVyJykuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBuZXdfaHJlZiA9ICcvcmVjb21tZW5kb3JkZXIvY3VzdG9tZXIvJyArIGN1c3RvbWVyX2lkICsgJy9jYXJ0JztcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBuZXdfaHJlZjtcbiAgICB9KTtcbiAgICAvL+eCueWHu+i/lOWbnuaMiemSrijnu5nlkIzkuIDkuKrov5Tlm57mjInpkq7kvYbkuI3lkIznmoTmg4XlhrXkuIvnu5nkuI3lkIznmoTov5Tlm57nlYzpnaIpXG4gICAgdmFyIHNlYXJjaFZhbExlbiA9ICQoJy5zZWFyY2gnKS52YWwoKS5sZW5ndGg7XG4gICAgJCgnLmhvbWUtaW5mby1uYXYtYScpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICBpZihzZWFyY2hWYWxMZW4gPT09IDApIHtcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9yZWNvbW1lbmRvcmRlci9jdXN0b21lci8nICsgY3VzdG9tZXJfaWQgKyAnL2RlYWxlci1saXN0JztcbiAgICAgICAgfVxuICAgIH0pO1xuICAgICQoJy5saXN0JykuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAkKHRoaXMpLnBhcmVudCgpLnNpYmxpbmdzKCkuY2hpbGRyZW4oJy5saXN0JykucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIH0pO1xuXG4gICAgLy/ngrnlh7vlm77niYflh7rnjrDmqKHmgIHmmL7npLrlpKflm75cbiAgICAkKCcubGlzdCcpLm9uKCdjbGljaycsICcuaW1nQmlnJywgZnVuY3Rpb24oZXYpIHtcbiAgICAgICAgdmFyIGJpZ0ltZ1NyYztcbiAgICAgICAgaWYoJChldi50YXJnZXQpLmF0dHIoJ2JpZ3NyYycpID09PSBudWxsKSB7XG4gICAgICAgICAgICBiaWdJbWdTcmMgPSAnL3N0YXRpYy9pbWFnZXMvcmVjb21tZW5kb3JkZXIvQm1yLnBuZyc7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBiaWdJbWdTcmMgPSAkKGV2LnRhcmdldCkuYXR0cignYmlnc3JjJyk7XG4gICAgICAgIH1cbiAgICAgICAgJCgnLmltZ0JpZ1Nob3cgaW1nJykuYXR0cignc3JjJywgYmlnSW1nU3JjKTtcbiAgICAgICAgJCgnLm1vZGVsSW1nJykuY3NzKHtcbiAgICAgICAgICAgICdkaXNwbGF5JzogJ2Jsb2NrJ1xuICAgICAgICB9KTtcbiAgICAgICAgJCgnLmltZ0JpZ1Nob3cgaW1nJykuY3NzKHtcbiAgICAgICAgICAgICdkaXNwbGF5JzogJ2Jsb2NrJ1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAvL+eCueWHu+S7u+aEj+aMiemSruaooeaAgea2iOWksVxuICAgICQoJy5tb2RlbEltZycpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICAkKHRoaXMpLmNzcyh7XG4gICAgICAgICAgICAnZGlzcGxheSc6ICdub25lJ1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAvLyDpmLvmraLpu5jorqTmu5HliqhcbiAgICAkKCcuYWN0aXZpdHknKS5vbigndG91Y2htb3ZlJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICB9KTtcbiAgICAkKCcubW9kZWxJbWcnKS5vbigndG91Y2htb3ZlJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICB9KTtcbiAgICAvL+eCueWHu+a0u+WKqOmhtemdoua2iOWksVxuICAgICQoJy5hY3Rpdml0eWJ1dHRvbicpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcuYWN0aXZpdHknKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xuICAgIH0pO1xuICAgICQoJy5hY3Rpdml0eWhlYWQtaW1nJykuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgICQoJy5hY3Rpdml0eXNlYycpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICAgfSk7XG4gIFxuXG4gICAgZnVuY3Rpb24gcXVlcnlfY2hhbmdlZCgpIHtcbiAgICAgICAgdmFyIHF1ZXJ5ID0gJCgnI3NlYXJjaCcpLnZhbCgpO1xuICAgICAgICBpZihxdWVyeS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICQoJy5zZWFyY2gtYm94IGxhYmVsLm5vJykuY3NzKHtcbiAgICAgICAgICAgICAgICAnZGlzcGxheSc6ICdub25lJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcuc2hvdycpLmNzcyh7XG4gICAgICAgICAgICAgICAgJ2Rpc3BsYXknOiAnYmxvY2snXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoJy5oaWRlJykuY3NzKHtcbiAgICAgICAgICAgICAgICAnZGlzcGxheSc6ICdub25lJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkKCcuc2VhcmNoLWJveCBsYWJlbC5ubycpLmNzcyh7XG4gICAgICAgICAgICAgICAgJ2Rpc3BsYXknOiAnYmxvY2snXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoJy5zaG93JykuY3NzKHtcbiAgICAgICAgICAgICAgICAnZGlzcGxheSc6ICdub25lJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcuaGlkZScpLmNzcyh7XG4gICAgICAgICAgICAgICAgJ2Rpc3BsYXknOiAnYmxvY2snXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBzZWFyY2hWdWUucXVlcnkgPSBxdWVyeTtcbiAgICB9XG4gICAgLy/moLnmja7mkJzntKLmoYbnmoTlhoXlrrnliKTmlq3mmK/lkKblh7rnjrDmkJzntKLllYblk4FcbiAgICAkKCcjc2VhcmNoJykuYmluZCgnaW5wdXQgcHJvcGVydHljaGFuZ2UnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgcXVlcnlfY2hhbmdlZCgpO1xuICAgIH0pO1xuICAgIC8v5b2T54K55Ye7WOaXtuaWh+acrOahhueahOWAvOS4ujDvvJtcbiAgICAkKCcubm8nKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnI3NlYXJjaCcpLnZhbCgnJyk7XG4gICAgICAgIHF1ZXJ5X2NoYW5nZWQoKTtcbiAgICB9KTtcbiAgICAkKCcjYmFubmVyLWltZycpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcuc2VhcmNoJykudmFsKCfnh5XkuqwnKTtcbiAgICAgICAgcXVlcnlfY2hhbmdlZCgpO1xuICAgIH0pO1xuICAgICQoJyNiYW5uZXItaW1nMScpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcuc2VhcmNoJykudmFsKCflgbflkIPnhoonKTtcbiAgICAgICAgcXVlcnlfY2hhbmdlZCgpO1xuICAgIH0pO1xuXG4gICAgLy8g5bem5L6n5YiX6KGoXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XG4gICAgICAgIC8v6KeE5qC85YiH5o2iXG4gICAgICAgICQoJyNpdGVtLWxpc3QnKS5vbignY2xpY2snLCAnLnNpemUnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ3Nlcmllcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICQodGhpcykuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnc2VyaWVzLWFjdGl2ZScpO1xuICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoKS5wYXJlbnQoKS5jaGlsZHJlbignLmxpc3QtY29uJykuZXEoJCh0aGlzKS5pbmRleCgpKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcbiAgICAgICAgICAgICQodGhpcykucGFyZW50KCkucGFyZW50KCkucGFyZW50KCkuY2hpbGRyZW4oJy5saXN0LWNvbicpLmVxKCQodGhpcykuaW5kZXgoKSkuc2libGluZ3MoJy5saXN0LWNvbicpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoJy5saXN0Jykub24oJ2NsaWNrJywgJy5uYXYtaXRlbScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgLy8g5riF56m65bCW5aS05Zu+54mHXG4gICAgICAgICAgICAkKCcjYnktcHJpY2UgLmljLWFycm93JykuY3NzKCdiYWNrZ3JvdW5kJywgJycpO1xuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgLy8g5o6S5bqP5qC35byPXG4gICAgICAgICAgICAkKCcjYnktc2NvcmUgc3BhbicpLmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgICQoJyNieS1zY29yZScpLnNpYmxpbmdzKCkuY2hpbGRyZW4oKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAvLyDmoLflvI/pu5jorqTlhajpg6jllYblk4FcbiAgICAgICAgICAgICQoJy5wcm9kdWN0LXNlcmllcyAuc2VyaWVzLXNlbGVjdCcpLnJlbW92ZUNsYXNzKCdzZXJpZXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAkKCcucHJvZHVjdC1zZXJpZXMgLnNlcmllcy1zZWxlY3QnKS5lcSgwKS5hZGRDbGFzcygnc2VyaWVzLWFjdGl2ZScpO1xuICAgICAgICAgICAgLy/pu5jorqTnu7zlkIjmjpLluo9zZXJpZXNcbiAgICAgICAgICAgIGFwcC5zb3J0ID0gMDtcbiAgICAgICAgICAgIGFwcC5jYXRfaWQgPSAkKHRoaXMpLmF0dHIoJ2NhdF9pZCcpO1xuICAgICAgICAgICAgYXBwLnNlcmllc19pZCA9ICcnO1xuICAgICAgICAgICAgaWYoJCh0aGlzKS5hdHRyKCdjYXRfaWQnKSAhPSAnMCcpIHtcbiAgICAgICAgICAgICAgICBhcHAuc2VyaWVzX251bSA9IGFwcC5zZXJpZXNbTnVtYmVyKCQodGhpcykuaW5kZXgoKSkgLSAxXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgLy/mjpLliJfpobrluo9cbiAgICAgICAgJCgnI2J5LXNjb3JlJykuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBhcHAuc29ydCA9IDA7XG5cbiAgICAgICAgfSk7XG4gICAgICAgICQoJyNieS1wcmljZScpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYoYXBwLnNvcnQgPT0gMSkge1xuICAgICAgICAgICAgICAgIGFwcC5zb3J0ID0gMjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYXBwLnNvcnQgPSAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgJCgnI2J5LW51bScpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgYXBwLnNvcnQgPSAzO1xuICAgICAgICB9KTtcblxuICAgICAgICAkKCcubGlzdCcpLm9uKCdjbGljaycsICcuY2F0ZWdvcnktbGlzdCcsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJCgnI2Jhbm5lcicpLmhpZGUoKTtcbiAgICAgICAgfSk7XG4gICAgICAgICQoJy5saXN0Jykub24oJ2NsaWNrJywgJyNyZWMnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQoJyNiYW5uZXInKS5zaG93KCk7XG4gICAgICAgIH0pO1xuICAgICAgICAvLyBsb2FkIGRlYWxlciBpbmZvXG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICB1cmw6ICcvYXBpL3YxLjEvcmVjb21tZW5kb3JkZXIvZGVhbGVyLycgKyBkZWFsZXJfaWQsXG4gICAgICAgICAgICB0eXBlOiAnZ2V0JyxcbiAgICAgICAgICAgIGRhdGF0eXBlOiAnSlNPTlAnLFxuICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgJCgnI2RlYWxlcl9uYW1lJykuaHRtbChkYXRhLmRhdGEuZGVhbGVyX25hbWUpO1xuICAgICAgICAgICAgICAgICQoJy5tb2RlbCAuY2FsbCAucGhvbmUtbnVtYmVyJykuaHRtbChkYXRhLmRhdGEucGhvbmUpO1xuICAgICAgICAgICAgICAgIC8v54K55Ye756Gu5a6a5oyJ6ZKu5Y+v5Lul5omT55S16K+dXG4gICAgICAgICAgICAgICAgJCgnLm1vZGVsIC5zdXJlJykuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJ3RlbDonICsgZGF0YS5kYXRhLnBob25lO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcblxufSk7Il0sImZpbGUiOiJyZWNvbW1lbmRvcmRlci9hZGRfaXRlbS5qcyJ9
