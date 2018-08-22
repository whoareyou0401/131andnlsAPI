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
        params[item.id.split('gift:')[1]] = num;
        $.ajax({
            url: '/api/v1.1/recommendorder/customer/' + customer_id + '/giveaway',
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
        }
    });

    var banner = new Vue({
        el: '#banner',
        data: {
            info: {}
        },
        mounted: function() {
            var self = this;
            $.ajax({
                url: '/api/v1.2/recommendorder/customer/' + customer_id + '/dealer/' + dealer_id + '/activity',
                type: 'get',
                success: function(data) {
                    console.log(data)
                    self.info = data;

                }
            });
        }
    });
    var advertising = new Vue({
        el: '#advertising',
        data: {
            info: {}
        },
        mounted: function() {
            var self = this;
            $.ajax({
                url: '/api/v1.2/recommendorder/customer/' + customer_id + '/dealer/' + dealer_id + '/activity',
                type: 'get',
                success: function(data) {
                    console.log(data)
                    self.info = data;
                    console.log(self.info)
                    console.log(banner.info)
                    // banner图跳转回 阻止活动页面弹出
                    if(document.referrer.indexOf('dealer-list') != -1 && self.info.popupenabled == 1 && self.info.popupimage != null && self.info.popupimage != '') {
                        $('.activity').css('display', 'block')
                    }
                }
            });
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
            cat_id: '',
            order: '-score',
            isGiftPage: url.search('add-gift') === -1,
            dealer_id: dealer_id,
            list: []
        },
        methods: {
            funtofixed: function(data) {
                if(data == '') {
                    return data;
                } else if(isNaN(Number(data))) {

                    return data;
                } else {
                    return Number(data);

                }
            },
            seriesChange: function(num) {
                self.series_id = num;
                // console.log(num);
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
                    })
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
            // seriesFilter: function(series){
            //     var self = this;
            //      series.categories[0].name   
            // };
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
                            console.log(data)
                            self.items = self.itemFilter(data.items);
                        },
                        error: function(data) {}
                    });
                } else {
                    $('.product-series').css('display', 'block');
                    if(series_id == '') {
                        $.ajax({
                            url: '/api/v1.2/recommendorder/customer/' + customer_id + '/dealer/' + dealer_id + '/items',
                            type: 'get',
                            datatype: 'jsonp',
                            data: {
                                'cat_id': cat_id,
                                'sort': sort
                            },
                            success: function(data) {
                                console.log(app.series_num.series)
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
                    // console.log(res)
                    app.series = res.categories;
                    app.cat_id = 0;
                    app.list = res.categories
                    // for (var i in res.categories) {

                    //     var cat_name = res.categories[i].name;

                    //     var ul_list = '<li class='nav-item item category-list'  cat_id=' + res.categories[i].id + '>' + cat_name + '</li>';
                    //     $('article .list').append(ul_list);

                    // }
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
                // 隐藏品牌样式
                //     if (app.series_num.series.length==0) {
                //     $('.product-series').css('display','none')
                // }
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
            dealerid: dealer_id
        },
        mounted: function() {
            var self = this
            console.log(self.dealerid)
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
        if($(ev.target).attr('bigsrc') == null) {
            var bigImgSrc = '/static/images/recommendorder/Bmr.png';
        } else {
            var bigImgSrc = $(ev.target).attr('bigsrc');
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

    })
    $('.modelImg').on('touchmove', function(e) {
        e.preventDefault();

    })
    //点击活动页面消失
    $('.activitybutton').click(function() {
        $('.activity').css('display', 'none')
    });
    $('.activity-img').click(function() {
        if(banner.info.popupjumpimage != null && banner.info.popupjumpimage != '') {
            $('.activity').css('display', 'none')
            $('.activitysec').css('display', 'block')
        }
    })
    $('.activityhead-img').click(function() {
        $('.activitysec').css('display', 'none')
    })
    // 点击banner
    // if ( banner.info.bannerenabled==1&&banner.info.bannerimage!=null&&banner.info.bannerimage!=') {
    //    $('.box-wrap ').css('display', 'block')
    // }
    $('#banner-full').on('click', function() {
        if(banner.info.bannerjumpimage != null && banner.info.bannerjumpimage != '') {
            // console.log(banner.info)
            window.location.href = '/recommendorder/dealer/' + dealer_id + '/customer/' + customer_id + '/active-regulation';
        }

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
            $(this).addClass('series-active')
            $(this).siblings().removeClass('series-active');
            $(this).parent().parent().parent().children('.list-con').eq($(this).index()).css('display', 'block')
            $(this).parent().parent().parent().children('.list-con').eq($(this).index()).siblings('.list-con').css('display', 'none')
        })

        $('.list').on('click', '.nav-item', function() {
            // 清空尖头图片
            $('#by-price .ic-arrow').css('background', '')
            $(this).addClass('active');
            $(this).siblings().removeClass('active');
            // 排序样式
            $('#by-score span').addClass('active')
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

            console.log(app.series_num.series.length)

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

        })
        // 系列样式切换
        $('.product-series').on('click', '.series-select', function() {
            $(this).addClass('series-active');
            $(this).siblings().removeClass('series-active');
            // 更改series_id
            app.series_id = $(this).attr('series_id');
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