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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9hZGRfZ2l2ZWF3YXkuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJChmdW5jdGlvbigpIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgdmFyIHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgIHZhciBkZWFsZXJfaWQgPSBOdW1iZXIodXJsLm1hdGNoKC8oZGVhbGVyXFwvKVxcZCtcXC8vKVswXS5zcGxpdCgnLycpWzFdKTtcbiAgICB2YXIgY3VzdG9tZXJfaWQgPSBOdW1iZXIodXJsLm1hdGNoKC8oY3VzdG9tZXJcXC8pXFxkK1xcLy8pWzBdLnNwbGl0KCcvJylbMV0pO1xuXG4gICAgc2V0dXBDU1JGKCk7XG4gICAgLyoqXG4gICAgICogcmVxVHlwZTpcbiAgICAgKiAgIFBPU1QgLS0gc2V0IG51bWJlclxuICAgICAqICAgUFVUIC0tIGluY3JlbWVudC9kZWNyZW1lbnQgZGF0YVxuICAgICAqL1xuICAgIC8v54K55Ye75pS55Y+Y6L6T5YWl5qGG5Lit55qE5pWw5ZCM5pe25Yqg5YWlXG4gICAgZnVuY3Rpb24gc2V0SXRlbUNhcnROdW0oaXRlbSwgbnVtLCByZXFUeXBlLCBjYikge1xuICAgICAgICB2YXIgcGFyYW1zID0ge307XG4gICAgICAgIHBhcmFtc1tpdGVtLmlkLnNwbGl0KCdnaWZ0OicpWzFdXSA9IG51bTtcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEuMS9yZWNvbW1lbmRvcmRlci9jdXN0b21lci8nICsgY3VzdG9tZXJfaWQgKyAnL2dpdmVhd2F5JyxcbiAgICAgICAgICAgIHR5cGU6IHJlcVR5cGUsXG4gICAgICAgICAgICBkYXRhdHlwZTogJ2pzb25wJyxcbiAgICAgICAgICAgIGRhdGE6IHBhcmFtcyxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlcykge1xuICAgICAgICAgICAgICAgIGlmKHJlcy5jb2RlID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNiKHJlcyk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQocmVzLmVycm9yX21zZyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogJy9yZWNvbW1lbmRvcmRlci9hcGkvdjEvY3VzdG9tZXIvJyArIGN1c3RvbWVyX2lkICsgJy9jYXJ0JyxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2dldCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGF0eXBlOiAnanNvbnAnLFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbXMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGRhdGEuaXRlbXMubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoZGF0YS5pdGVtcy5pdGVtcy5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpIGluIGRhdGEuaXRlbXMuaXRlbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGRlYWxlcl9pZCA9PSBkYXRhLml0ZW1zLml0ZW1zW2ldLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoZGF0YS5pdGVtcy5pdGVtc1tpXS5pdGVtcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI3BsYWNlLW9yZGVyIGknKS5odG1sKCcoMCknKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXMgPSBkYXRhLml0ZW1zO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNwbGFjZS1vcmRlciBpJykuaHRtbCgnKCcgKyBkYXRhLml0ZW1zLml0ZW1zW2ldLml0ZW1zLmxlbmd0aCArICcpJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI3BsYWNlLW9yZGVyIGknKS5odG1sKCcoMCknKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuICAgIHZhciBmb290ZXIgPSBuZXcgVnVlKHtcbiAgICAgICAgZWw6ICcjZm9vdGVyJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgdG90YWw6IDBcbiAgICAgICAgfSxcbiAgICAgICAgY29tcHV0ZWQ6IHtcbiAgICAgICAgICAgIGRpc3BsYXlfdG90YWw6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiAnJyArIHRoaXMudG90YWwudG9GaXhlZCgyKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgdmFyIGJhbm5lciA9IG5ldyBWdWUoe1xuICAgICAgICBlbDogJyNiYW5uZXInLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBpbmZvOiB7fVxuICAgICAgICB9LFxuICAgICAgICBtb3VudGVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiAnL2FwaS92MS4yL3JlY29tbWVuZG9yZGVyL2N1c3RvbWVyLycgKyBjdXN0b21lcl9pZCArICcvZGVhbGVyLycgKyBkZWFsZXJfaWQgKyAnL2FjdGl2aXR5JyxcbiAgICAgICAgICAgICAgICB0eXBlOiAnZ2V0JyxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaW5mbyA9IGRhdGE7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBhZHZlcnRpc2luZyA9IG5ldyBWdWUoe1xuICAgICAgICBlbDogJyNhZHZlcnRpc2luZycsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGluZm86IHt9XG4gICAgICAgIH0sXG4gICAgICAgIG1vdW50ZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvYXBpL3YxLjIvcmVjb21tZW5kb3JkZXIvY3VzdG9tZXIvJyArIGN1c3RvbWVyX2lkICsgJy9kZWFsZXIvJyArIGRlYWxlcl9pZCArICcvYWN0aXZpdHknLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdnZXQnLFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSlcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5pbmZvID0gZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coc2VsZi5pbmZvKVxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhiYW5uZXIuaW5mbylcbiAgICAgICAgICAgICAgICAgICAgLy8gYmFubmVy5Zu+6Lez6L2s5ZueIOmYu+atoua0u+WKqOmhtemdouW8ueWHulxuICAgICAgICAgICAgICAgICAgICBpZihkb2N1bWVudC5yZWZlcnJlci5pbmRleE9mKCdkZWFsZXItbGlzdCcpICE9IC0xICYmIHNlbGYuaW5mby5wb3B1cGVuYWJsZWQgPT0gMSAmJiBzZWxmLmluZm8ucG9wdXBpbWFnZSAhPSBudWxsICYmIHNlbGYuaW5mby5wb3B1cGltYWdlICE9ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcuYWN0aXZpdHknKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG4gICAgdmFyIGFwcCA9IG5ldyBWdWUoe1xuICAgICAgICBlbDogJyNpdGVtLWxpc3QnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAvLyBzb3J05YC8XG4gICAgICAgICAgICBzb3J0OiAwLFxuICAgICAgICAgICAgLy8g57O75YiX5pWw5o2uXG4gICAgICAgICAgICBzZXJpZXM6IHt9LFxuICAgICAgICAgICAgc2VyaWVzX251bToge30sXG4gICAgICAgICAgICBzZXJpZXNfaWQ6ICcnLFxuICAgICAgICAgICAgaXRlbXM6IFtdLFxuICAgICAgICAgICAgc2VsZWN0ZWRfaXRlbXM6IHt9LFxuICAgICAgICAgICAgc291cmNlOiAkKCcjc291cmNlJykuYXR0cignbmFtZScpLFxuICAgICAgICAgICAgY3VzdG9tZXJfaWQ6ICQoJyNzb3VyY2UnKS5hdHRyKCdjdXN0b21lcl9pZCcpLFxuICAgICAgICAgICAgY2F0X2lkOiAnJyxcbiAgICAgICAgICAgIG9yZGVyOiAnLXNjb3JlJyxcbiAgICAgICAgICAgIGlzR2lmdFBhZ2U6IHVybC5zZWFyY2goJ2FkZC1naWZ0JykgPT09IC0xLFxuICAgICAgICAgICAgZGVhbGVyX2lkOiBkZWFsZXJfaWQsXG4gICAgICAgICAgICBsaXN0OiBbXVxuICAgICAgICB9LFxuICAgICAgICBtZXRob2RzOiB7XG4gICAgICAgICAgICBmdW50b2ZpeGVkOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgaWYoZGF0YSA9PSAnJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYoaXNOYU4oTnVtYmVyKGRhdGEpKSkge1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBOdW1iZXIoZGF0YSk7XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2VyaWVzQ2hhbmdlOiBmdW5jdGlvbihudW0pIHtcbiAgICAgICAgICAgICAgICBzZWxmLnNlcmllc19pZCA9IG51bTtcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhudW0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlZnJlc2hTZWxlY3RlZEl0ZW1zOiBmdW5jdGlvbihpdGVtcykge1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICBpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGRhdCkge1xuICAgICAgICAgICAgICAgICAgICBkYXQuaXRlbXMuZm9yRWFjaChmdW5jdGlvbihlbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGVsZS5zZWxlY3RlZF9udW0gIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdGVkX2l0ZW1zW2VsZS5pZF0gPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1faWQ6IGVsZS5pZCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbnVtOiBOdW1iZXIoZWxlLnNlbGVjdGVkX251bSkudG9GaXhlZCgwKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IGVsZS5wcmljZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYoZWxlLmlkIGluIHNlbGYuc2VsZWN0ZWRfaXRlbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdGVkX2l0ZW1zW2VsZS5pZF0ubnVtID0gMDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBmb290ZXIudG90YWwgPSAwO1xuICAgICAgICAgICAgICAgIGZvcih2YXIga2V5IGluIHNlbGYuc2VsZWN0ZWRfaXRlbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSBzZWxmLnNlbGVjdGVkX2l0ZW1zW2tleV07XG4gICAgICAgICAgICAgICAgICAgIGZvb3Rlci50b3RhbCArPSBpdGVtLm51bSAqIGl0ZW0ucHJpY2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG51bUNoYW5nZTogZnVuY3Rpb24odikge1xuICAgICAgICAgICAgICAgIGlmKHYuc2VsZWN0ZWRfbnVtID09PSAnJykge1xuICAgICAgICAgICAgICAgICAgICB2LnNlbGVjdGVkX251bSA9IDA7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKGlzTmFOKE51bWJlcih2LnNlbGVjdGVkX251bSkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHYuc2VsZWN0ZWRfbnVtID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdi5zZWxlY3RlZF9udW0gPSBwYXJzZUludCh2LnNlbGVjdGVkX251bSk7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHNldEl0ZW1DYXJ0TnVtKHYsIHYuc2VsZWN0ZWRfbnVtLCAnUE9TVCcsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdi5zZWxlY3RlZF9udW0gPSBOdW1iZXIoZGF0YS5udW0pLnRvRml4ZWQoMCk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYucmVmcmVzaFNlbGVjdGVkSXRlbXMoc2VsZi5pdGVtcyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVkdWNlQ2xpY2tlZDogZnVuY3Rpb24odikge1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICBpZih2LnNlbGVjdGVkX251bSA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHYuc2VsZWN0ZWRfbnVtID0gMDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzZXRJdGVtQ2FydE51bSh2LCAtMSwgJ1BVVCcsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHYuc2VsZWN0ZWRfbnVtID0gTnVtYmVyKGRhdGEubnVtKS50b0ZpeGVkKDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5yZWZyZXNoU2VsZWN0ZWRJdGVtcyhzZWxmLml0ZW1zKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBsdXNDbGlja2VkOiBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHNldEl0ZW1DYXJ0TnVtKHYsIDEsICdQVVQnLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHYuc2VsZWN0ZWRfbnVtID0gTnVtYmVyKGRhdGEubnVtKS50b0ZpeGVkKDApO1xuXG4gICAgICAgICAgICAgICAgICAgIHNlbGYucmVmcmVzaFNlbGVjdGVkSXRlbXMoc2VsZi5pdGVtcyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaXRlbUZpbHRlcjogZnVuY3Rpb24oaXRlbXMpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdmFyIGlkeCA9IDA7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coc2VsZi5zZWxlY3RlZF9pdGVtcylcbiAgICAgICAgICAgICAgICBpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGRhdCkge1xuICAgICAgICAgICAgICAgICAgICBkYXQuaXRlbXMuZm9yRWFjaChmdW5jdGlvbihlbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGVsZS5pZCBpbiBzZWxmLnNlbGVjdGVkX2l0ZW1zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlLnNlbGVjdGVkX251bSA9IHNlbGYuc2VsZWN0ZWRfaXRlbXNbZWxlLmlkXS5udW07XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZS5zZWxlY3RlZF9udW0gPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlLnByaWNlID0gcGFyc2VGbG9hdChlbGUucHJpY2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYodXJsLnNlYXJjaCgnYWRkLWdpZnQnKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGUuaWQgPSAnZ2lmdDonICsgZWxlLmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZS5wcmljZSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoZWxlLmlkIGluIHNlbGYuc2VsZWN0ZWRfaXRlbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlLnNlbGVjdGVkX251bSA9IHNlbGYuc2VsZWN0ZWRfaXRlbXNbZWxlLmlkXS5udW07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlLnNlbGVjdGVkX251bSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxlLmRpc3BsYXlfcHJpY2UgPSBlbGUucHJpY2UudG9GaXhlZCgyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZS5xdWFudGl0eSA9IGVsZS5xdWFudGl0eS50b0ZpeGVkKDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZWxlLnBhY2tpbmdfc3BlY2lmaWNhdGlvbiA9IE51bWJlcihlbGUucGFja2luZ19zcGVjaWZpY2F0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gaXRlbXM7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLy8gc2VyaWVzRmlsdGVyOiBmdW5jdGlvbihzZXJpZXMpe1xuICAgICAgICAgICAgLy8gICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIC8vICAgICAgc2VyaWVzLmNhdGVnb3JpZXNbMF0ubmFtZSAgIFxuICAgICAgICAgICAgLy8gfTtcbiAgICAgICAgICAgIGxvYWRJdGVtczogZnVuY3Rpb24oc29ydCwgc2VyaWVzX2lkLCBjYXRfaWQpIHtcbiAgICAgICAgICAgICAgICBjYXRfaWQgPSBwYXJzZUludChjYXRfaWQpO1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICBzZWxmLml0ZW1zID0gW107XG4gICAgICAgICAgICAgICAgaWYoY2F0X2lkID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5wcm9kdWN0LXNlcmllcycpLmNzcygnZGlzcGxheScsICdub25lJyk7XG4gICAgICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICcvYXBpL3YxLjIvcmVjb21tZW5kb3JkZXIvY3VzdG9tZXIvJyArIGN1c3RvbWVyX2lkICsgJy9kZWFsZXIvJyArIGRlYWxlcl9pZCArICcvaXRlbXMnLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2dldCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhdHlwZTogJ2pzb25wJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnc29ydCc6IHNvcnRcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaXRlbXMgPSBzZWxmLml0ZW1GaWx0ZXIoZGF0YS5pdGVtcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKGRhdGEpIHt9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5wcm9kdWN0LXNlcmllcycpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xuICAgICAgICAgICAgICAgICAgICBpZihzZXJpZXNfaWQgPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAnL2FwaS92MS4yL3JlY29tbWVuZG9yZGVyL2N1c3RvbWVyLycgKyBjdXN0b21lcl9pZCArICcvZGVhbGVyLycgKyBkZWFsZXJfaWQgKyAnL2l0ZW1zJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZ2V0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhdHlwZTogJ2pzb25wJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdjYXRfaWQnOiBjYXRfaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzb3J0Jzogc29ydFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhhcHAuc2VyaWVzX251bS5zZXJpZXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaXRlbXMgPSBzZWxmLml0ZW1GaWx0ZXIoZGF0YS5pdGVtcyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAnL2FwaS92MS4yL3JlY29tbWVuZG9yZGVyL2N1c3RvbWVyLycgKyBjdXN0b21lcl9pZCArICcvZGVhbGVyLycgKyBkZWFsZXJfaWQgKyAnL2l0ZW1zJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZ2V0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhdHlwZTogJ2pzb25wJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzZXJpZXNfaWQnOiBzZXJpZXNfaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICdzb3J0Jzogc29ydFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLml0ZW1zID0gc2VsZi5pdGVtRmlsdGVyKGRhdGEuaXRlbXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG1vdW50ZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvYXBpL3YxLjEvcmVjb21tZW5kb3JkZXIvY3VzdG9tZXIvJyArIGN1c3RvbWVyX2lkICsgJy9kZWFsZXItbGlzdCcsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2dldCcsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgb3JkZXJhYmxlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBkYXRhLmRlYWxlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGRhdGEuZGVhbGVyc1tpXS5pZCA9PSBkZWFsZXJfaWQgJiYgZGF0YS5kZWFsZXJzW2ldLm9yZGVyYWJsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyYWJsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYoIW9yZGVyYWJsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL3JlY29tbWVuZG9yZGVyL2N1c3RvbWVyLycgKyBjdXN0b21lcl9pZCArICcvZGVhbGVyLWxpc3QnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogJy9hcGkvdjEuMi9yZWNvbW1lbmRvcmRlci9jdXN0b21lci8nICsgY3VzdG9tZXJfaWQgKyAnL2RlYWxlci8nICsgZGVhbGVyX2lkICsgJy9jYXRlZ29yaWVzJyxcbiAgICAgICAgICAgICAgICB0eXBlOiAnZ2V0JyxcbiAgICAgICAgICAgICAgICBkYXRhdHlwZTogJ2pzb25wJyxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXMpIHtcbiAgICAgICAgICAgICAgICAgICAgLy8g5a2Y5YKo57O75YiX5pWw5o2uXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHJlcylcbiAgICAgICAgICAgICAgICAgICAgYXBwLnNlcmllcyA9IHJlcy5jYXRlZ29yaWVzO1xuICAgICAgICAgICAgICAgICAgICBhcHAuY2F0X2lkID0gMDtcbiAgICAgICAgICAgICAgICAgICAgYXBwLmxpc3QgPSByZXMuY2F0ZWdvcmllc1xuICAgICAgICAgICAgICAgICAgICAvLyBmb3IgKHZhciBpIGluIHJlcy5jYXRlZ29yaWVzKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIHZhciBjYXRfbmFtZSA9IHJlcy5jYXRlZ29yaWVzW2ldLm5hbWU7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIHZhciB1bF9saXN0ID0gJzxsaSBjbGFzcz0nbmF2LWl0ZW0gaXRlbSBjYXRlZ29yeS1saXN0JyAgY2F0X2lkPScgKyByZXMuY2F0ZWdvcmllc1tpXS5pZCArICc+JyArIGNhdF9uYW1lICsgJzwvbGk+JztcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgICQoJ2FydGljbGUgLmxpc3QnKS5hcHBlbmQodWxfbGlzdCk7XG5cbiAgICAgICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB1cmw6ICcvcmVjb21tZW5kb3JkZXIvYXBpL3YxL2N1c3RvbWVyLycgKyBjdXN0b21lcl9pZCArICcvY2FydCcsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2dldCcsXG4gICAgICAgICAgICAgICAgZGF0YXR5cGU6ICdqc29ucCcsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnNlbGVjdGVkX2l0ZW1zID0ge307XG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbXMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgaWYoZGF0YS5pdGVtcy5pdGVtcy5sZW5ndGggIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaSBpbiBkYXRhLml0ZW1zLml0ZW1zKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoZGVhbGVyX2lkID09PSBkYXRhLml0ZW1zLml0ZW1zW2ldLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKGRhdGEuaXRlbXMuaXRlbXNbMF0uaXRlbXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjcGxhY2Utb3JkZXIgaScpLmh0bWwoJygwKScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXRlbXMgPSBkYXRhLml0ZW1zLml0ZW1zWzBdLml0ZW1zO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI3BsYWNlLW9yZGVyIGknKS5odG1sKCcoJyArIGRhdGEuaXRlbXMuaXRlbXNbMF0uaXRlbXMubGVuZ3RoICsgJyknKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zID0gZGF0YS5pdGVtcy5pdGVtc1swXS5pdGVtcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1zLmZvckVhY2goZnVuY3Rpb24oZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCFkYXRhLml0ZW1zLml0ZW1zWzBdLml0ZW1zW2ldLmlzX2dpdmVhd2F5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHNlbGYuc2VsZWN0ZWRfaXRlbXMpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2VsZWN0ZWRfaXRlbXNbZC5pdGVtX2lkXSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bTogTnVtYmVyKGQubnVtKS50b0ZpeGVkKDApLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IGQucHJpY2VcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzZWxmLmxvYWRJdGVtcyhzZWxmLnNvcnQsIHNlbGYuc2VyaWVzX2lkLCBzZWxmLmNhdF9pZCk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYucmVmcmVzaFNlbGVjdGVkSXRlbXMoc2VsZi5pdGVtcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIHdhdGNoOiB7XG4gICAgICAgICAgICBjYXRfaWQ6IGZ1bmN0aW9uKCkge1xuXG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHNlbGYubG9hZEl0ZW1zKHNlbGYuc29ydCwgc2VsZi5zZXJpZXNfaWQsIHNlbGYuY2F0X2lkKTtcbiAgICAgICAgICAgICAgICAvLyDpmpDol4/lk4HniYzmoLflvI9cbiAgICAgICAgICAgICAgICAvLyAgICAgaWYgKGFwcC5zZXJpZXNfbnVtLnNlcmllcy5sZW5ndGg9PTApIHtcbiAgICAgICAgICAgICAgICAvLyAgICAgJCgnLnByb2R1Y3Qtc2VyaWVzJykuY3NzKCdkaXNwbGF5Jywnbm9uZScpXG4gICAgICAgICAgICAgICAgLy8gfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNlcmllc19pZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHNlbGYubG9hZEl0ZW1zKHNlbGYuc29ydCwgc2VsZi5zZXJpZXNfaWQsIHNlbGYuY2F0X2lkKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzb3J0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgaWYoc2VsZi5zb3J0ID09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2J5LXByaWNlIC5pYy1hcnJvdycpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICAgICAnYmFja2dyb3VuZCc6ICd1cmwoL3N0YXRpYy9pbWFnZXMvcmVjb21tZW5kb3JkZXIvaWNfYXJyb3dfZG93bi5wbmcpIG5vLXJlcGVhdCBjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ2JhY2tncm91bmRTaXplJzogJzY1JSdcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKHNlbGYuc29ydCA9PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJyNieS1wcmljZSAuaWMtYXJyb3cnKS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAgICAgJ2JhY2tncm91bmQnOiAndXJsKC9zdGF0aWMvaW1hZ2VzL3JlY29tbWVuZG9yZGVyL2ljX2Fycm93X3VwLnBuZykgbm8tcmVwZWF0IGNlbnRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAnYmFja2dyb3VuZFNpemUnOiAnNjUlJ1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZWxmLmxvYWRJdGVtcyhzZWxmLnNvcnQsIHNlbGYuc2VyaWVzX2lkLCBzZWxmLmNhdF9pZCk7XG5cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuICAgIHZhciBiZCA9IG5ldyBWdWUoe1xuICAgICAgICBlbDogJyNiZCcsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGRlYWxlcmlkOiBkZWFsZXJfaWRcbiAgICAgICAgfSxcbiAgICAgICAgbW91bnRlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXNcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYuZGVhbGVyaWQpXG4gICAgICAgIH1cbiAgICB9KTtcbiAgICB2YXIgc2VhcmNoVnVlID0gbmV3IFZ1ZSh7XG4gICAgICAgIGVsOiAnI3NlYXJjaC1yZXN1bHRzJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgaXRlbXM6IFtdLFxuICAgICAgICAgICAgcXVlcnk6ICcnLFxuICAgICAgICAgICAgZGVhbGVyX2lkOiBkZWFsZXJfaWRcbiAgICAgICAgfSxcbiAgICAgICAgbWV0aG9kczoge1xuXG4gICAgICAgICAgICBudW1DaGFuZ2U6IGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgaWYodi5zZWxlY3RlZF9udW0gPT09ICcnKSB7XG4gICAgICAgICAgICAgICAgICAgIHYuc2VsZWN0ZWRfbnVtID0gMDtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYoaXNOYU4oTnVtYmVyKHYuc2VsZWN0ZWRfbnVtKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdi5zZWxlY3RlZF9udW0gPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2LnNlbGVjdGVkX251bSA9IHBhcnNlSW50KHYuc2VsZWN0ZWRfbnVtKTtcbiAgICAgICAgICAgICAgICBzZXRJdGVtQ2FydE51bSh2LCB2LnNlbGVjdGVkX251bSwgJ1BPU1QnLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIHYuc2VsZWN0ZWRfbnVtID0gTnVtYmVyKGRhdGEubnVtKS50b0ZpeGVkKDApO1xuICAgICAgICAgICAgICAgICAgICBhcHAucmVmcmVzaFNlbGVjdGVkSXRlbXMoc2VsZi5pdGVtcyk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVkdWNlQ2xpY2tlZDogZnVuY3Rpb24odikge1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICBpZih2LnNlbGVjdGVkX251bSA8PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHYuc2VsZWN0ZWRfbnVtID0gMDtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBzZXRJdGVtQ2FydE51bSh2LCAtMSwgJ1BVVCcsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHYuc2VsZWN0ZWRfbnVtID0gTnVtYmVyKGRhdGEubnVtKS50b0ZpeGVkKDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgYXBwLnJlZnJlc2hTZWxlY3RlZEl0ZW1zKHNlbGYuaXRlbXMpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGx1c0NsaWNrZWQ6IGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgc2V0SXRlbUNhcnROdW0odiwgMSwgJ1BVVCcsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdi5zZWxlY3RlZF9udW0gPSBOdW1iZXIoZGF0YS5udW0pLnRvRml4ZWQoMCk7XG4gICAgICAgICAgICAgICAgICAgIGFwcC5yZWZyZXNoU2VsZWN0ZWRJdGVtcyhzZWxmLml0ZW1zKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICAvL+aQnOe0ouaVsOaNrlxuICAgICAgICB3YXRjaDoge1xuICAgICAgICAgICAgcXVlcnk6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICBpZihzZWxmLnF1ZXJ5Lmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJy9hcGkvdjEuMi9yZWNvbW1lbmRvcmRlci9jdXN0b21lci8nICsgY3VzdG9tZXJfaWQgKyAnL2RlYWxlci8nICsgZGVhbGVyX2lkICsgJy9pdGVtcycsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZ2V0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGF0eXBlOiAnanNvbnAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICdrZXknOiBzZWxmLnF1ZXJ5XG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pdGVtcyA9IGFwcC5pdGVtRmlsdGVyKGRhdGEuaXRlbXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHNlbGYuaXRlbXMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgIH0pO1xuICAgICQoJyNieS1wcmljZScpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcjYnktbnVtIC5pYy1hcnJvdycpLmNzcyh7XG4gICAgICAgICAgICAnYmFja2dyb3VuZCc6ICd1cmwoL3N0YXRpYy9pbWFnZXMvcmVjb21tZW5kb3JkZXIvaWNfYXJyb3cucG5nKSBuby1yZXBlYXQgY2VudGVyJyxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kU2l6ZSc6ICc2NSUnXG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG4gICAgJCgnI2J5LXNjb3JlJykuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgICQoJy5pYy1hcnJvdycpLmNzcyh7XG4gICAgICAgICAgICAnYmFja2dyb3VuZCc6ICd1cmwoL3N0YXRpYy9pbWFnZXMvcmVjb21tZW5kb3JkZXIvaWNfYXJyb3cucG5nKSBuby1yZXBlYXQgY2VudGVyJyxcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kU2l6ZSc6ICc2NSUnXG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG4gICAgJCgnI2J5LW51bScpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcjYnktcHJpY2UgLmljLWFycm93JykuY3NzKHtcbiAgICAgICAgICAgICdiYWNrZ3JvdW5kJzogJ3VybCgvc3RhdGljL2ltYWdlcy9yZWNvbW1lbmRvcmRlci9pY19hcnJvdy5wbmcpIG5vLXJlcGVhdCBjZW50ZXInLFxuICAgICAgICAgICAgJ2JhY2tncm91bmRTaXplJzogJzY1JSdcbiAgICAgICAgfSk7XG5cbiAgICB9KTtcbiAgICAvL+eCueWHu+eUteivneaMiemSrlxuXG4gICAgJCgnLmhvbWUtaW5mby1uYXYtYicpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcubW9kZWwnKS5jc3Moe1xuICAgICAgICAgICAgJ2Rpc3BsYXknOiAnYmxvY2snXG4gICAgICAgIH0pO1xuICAgICAgICAkKCcubW9kZWwgLmNhbGwnKS5jc3Moe1xuICAgICAgICAgICAgJ2Rpc3BsYXknOiAnYmxvY2snXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIC8v54K55Ye75Y+W5raI5oyJ6ZKu5qih5oCB5raI5aSxXG4gICAgJCgnLmNhbmNlbCcpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcubW9kZWwnKS5jc3Moe1xuICAgICAgICAgICAgJ2Rpc3BsYXknOiAnbm9uZSdcbiAgICAgICAgfSk7XG4gICAgICAgICQoJy5tb2RlbCAuY2FsbCcpLmNzcyh7XG4gICAgICAgICAgICAnZGlzcGxheSc6ICdub25lJ1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAvL+eCueWHu+a3u+WKoOaooeaAgeWHuueOsFxuICAgICQoJy5tb25leScpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcuYWRkJykuY3NzKHtcbiAgICAgICAgICAgICdkaXNwbGF5JzogJ2Jsb2NrJ1xuICAgICAgICB9KTtcbiAgICAgICAgJCgnLmFkZCAuY2FsbCcpLmNzcyh7XG4gICAgICAgICAgICAnZGlzcGxheSc6ICdibG9jaydcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgLy/ngrnlh7vljrvotK3nianovabmjInpkq7pobXpnaLot7PovazlnKjotK3nianovabpobXpnaLlkIzml7bllYblk4Hlh7rnjrDlnKjotK3nianovabkuK1cbiAgICAkKCcjcGxhY2Utb3JkZXInKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG5ld19ocmVmID0gJy9yZWNvbW1lbmRvcmRlci9jdXN0b21lci8nICsgY3VzdG9tZXJfaWQgKyAnL2NhcnQnO1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IG5ld19ocmVmO1xuICAgIH0pO1xuICAgIC8v54K55Ye76L+U5Zue5oyJ6ZKuKOe7meWQjOS4gOS4qui/lOWbnuaMiemSruS9huS4jeWQjOeahOaDheWGteS4i+e7meS4jeWQjOeahOi/lOWbnueVjOmdoilcbiAgICB2YXIgc2VhcmNoVmFsTGVuID0gJCgnLnNlYXJjaCcpLnZhbCgpLmxlbmd0aDtcbiAgICAkKCcuaG9tZS1pbmZvLW5hdi1hJykuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKHNlYXJjaFZhbExlbiA9PT0gMCkge1xuICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL3JlY29tbWVuZG9yZGVyL2N1c3RvbWVyLycgKyBjdXN0b21lcl9pZCArICcvZGVhbGVyLWxpc3QnO1xuICAgICAgICB9XG4gICAgfSk7XG4gICAgJCgnLmxpc3QnKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICQodGhpcykucGFyZW50KCkuc2libGluZ3MoKS5jaGlsZHJlbignLmxpc3QnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgfSk7XG5cbiAgICAvL+eCueWHu+WbvueJh+WHuueOsOaooeaAgeaYvuekuuWkp+WbvlxuICAgICQoJy5saXN0Jykub24oJ2NsaWNrJywgJy5pbWdCaWcnLCBmdW5jdGlvbihldikge1xuICAgICAgICBpZigkKGV2LnRhcmdldCkuYXR0cignYmlnc3JjJykgPT0gbnVsbCkge1xuICAgICAgICAgICAgdmFyIGJpZ0ltZ1NyYyA9ICcvc3RhdGljL2ltYWdlcy9yZWNvbW1lbmRvcmRlci9CbXIucG5nJztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHZhciBiaWdJbWdTcmMgPSAkKGV2LnRhcmdldCkuYXR0cignYmlnc3JjJyk7XG4gICAgICAgIH1cbiAgICAgICAgJCgnLmltZ0JpZ1Nob3cgaW1nJykuYXR0cignc3JjJywgYmlnSW1nU3JjKTtcbiAgICAgICAgJCgnLm1vZGVsSW1nJykuY3NzKHtcbiAgICAgICAgICAgICdkaXNwbGF5JzogJ2Jsb2NrJ1xuICAgICAgICB9KTtcbiAgICAgICAgJCgnLmltZ0JpZ1Nob3cgaW1nJykuY3NzKHtcbiAgICAgICAgICAgICdkaXNwbGF5JzogJ2Jsb2NrJ1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAvL+eCueWHu+S7u+aEj+aMiemSruaooeaAgea2iOWksVxuICAgICQoJy5tb2RlbEltZycpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICAkKHRoaXMpLmNzcyh7XG4gICAgICAgICAgICAnZGlzcGxheSc6ICdub25lJ1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAvLyDpmLvmraLpu5jorqTmu5HliqhcbiAgICAkKCcuYWN0aXZpdHknKS5vbigndG91Y2htb3ZlJywgZnVuY3Rpb24oZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICB9KVxuICAgICQoJy5tb2RlbEltZycpLm9uKCd0b3VjaG1vdmUnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgIH0pXG4gICAgLy/ngrnlh7vmtLvliqjpobXpnaLmtojlpLFcbiAgICAkKCcuYWN0aXZpdHlidXR0b24nKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnLmFjdGl2aXR5JykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKVxuICAgIH0pO1xuICAgICQoJy5hY3Rpdml0eS1pbWcnKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgaWYoYmFubmVyLmluZm8ucG9wdXBqdW1waW1hZ2UgIT0gbnVsbCAmJiBiYW5uZXIuaW5mby5wb3B1cGp1bXBpbWFnZSAhPSAnJykge1xuICAgICAgICAgICAgJCgnLmFjdGl2aXR5JykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKVxuICAgICAgICAgICAgJCgnLmFjdGl2aXR5c2VjJykuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJylcbiAgICAgICAgfVxuICAgIH0pXG4gICAgJCgnLmFjdGl2aXR5aGVhZC1pbWcnKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnLmFjdGl2aXR5c2VjJykuY3NzKCdkaXNwbGF5JywgJ25vbmUnKVxuICAgIH0pXG4gICAgLy8g54K55Ye7YmFubmVyXG4gICAgLy8gaWYgKCBiYW5uZXIuaW5mby5iYW5uZXJlbmFibGVkPT0xJiZiYW5uZXIuaW5mby5iYW5uZXJpbWFnZSE9bnVsbCYmYmFubmVyLmluZm8uYmFubmVyaW1hZ2UhPScpIHtcbiAgICAvLyAgICAkKCcuYm94LXdyYXAgJykuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJylcbiAgICAvLyB9XG4gICAgJCgnI2Jhbm5lci1mdWxsJykub24oJ2NsaWNrJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmKGJhbm5lci5pbmZvLmJhbm5lcmp1bXBpbWFnZSAhPSBudWxsICYmIGJhbm5lci5pbmZvLmJhbm5lcmp1bXBpbWFnZSAhPSAnJykge1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYmFubmVyLmluZm8pXG4gICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvcmVjb21tZW5kb3JkZXIvZGVhbGVyLycgKyBkZWFsZXJfaWQgKyAnL2N1c3RvbWVyLycgKyBjdXN0b21lcl9pZCArICcvYWN0aXZlLXJlZ3VsYXRpb24nO1xuICAgICAgICB9XG5cbiAgICB9KTtcblxuICAgIGZ1bmN0aW9uIHF1ZXJ5X2NoYW5nZWQoKSB7XG4gICAgICAgIHZhciBxdWVyeSA9ICQoJyNzZWFyY2gnKS52YWwoKTtcbiAgICAgICAgaWYocXVlcnkubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAkKCcuc2VhcmNoLWJveCBsYWJlbC5ubycpLmNzcyh7XG4gICAgICAgICAgICAgICAgJ2Rpc3BsYXknOiAnbm9uZSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnLnNob3cnKS5jc3Moe1xuICAgICAgICAgICAgICAgICdkaXNwbGF5JzogJ2Jsb2NrJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcuaGlkZScpLmNzcyh7XG4gICAgICAgICAgICAgICAgJ2Rpc3BsYXknOiAnbm9uZSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJCgnLnNlYXJjaC1ib3ggbGFiZWwubm8nKS5jc3Moe1xuICAgICAgICAgICAgICAgICdkaXNwbGF5JzogJ2Jsb2NrJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAkKCcuc2hvdycpLmNzcyh7XG4gICAgICAgICAgICAgICAgJ2Rpc3BsYXknOiAnbm9uZSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnLmhpZGUnKS5jc3Moe1xuICAgICAgICAgICAgICAgICdkaXNwbGF5JzogJ2Jsb2NrJ1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgc2VhcmNoVnVlLnF1ZXJ5ID0gcXVlcnk7XG4gICAgfVxuICAgIC8v5qC55o2u5pCc57Si5qGG55qE5YaF5a655Yik5pat5piv5ZCm5Ye6546w5pCc57Si5ZWG5ZOBXG4gICAgJCgnI3NlYXJjaCcpLmJpbmQoJ2lucHV0IHByb3BlcnR5Y2hhbmdlJywgZnVuY3Rpb24oKSB7XG4gICAgICAgIHF1ZXJ5X2NoYW5nZWQoKTtcbiAgICB9KTtcbiAgICAvL+W9k+eCueWHu1jml7bmlofmnKzmoYbnmoTlgLzkuLow77ybXG4gICAgJCgnLm5vJykuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgICQoJyNzZWFyY2gnKS52YWwoJycpO1xuICAgICAgICBxdWVyeV9jaGFuZ2VkKCk7XG4gICAgfSk7XG4gICAgJCgnI2Jhbm5lci1pbWcnKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnLnNlYXJjaCcpLnZhbCgn54eV5LqsJyk7XG4gICAgICAgIHF1ZXJ5X2NoYW5nZWQoKTtcbiAgICB9KTtcbiAgICAkKCcjYmFubmVyLWltZzEnKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnLnNlYXJjaCcpLnZhbCgn5YG35ZCD54aKJyk7XG4gICAgICAgIHF1ZXJ5X2NoYW5nZWQoKTtcbiAgICB9KTtcblxuICAgIC8vIOW3puS+p+WIl+ihqFxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuXG4gICAgICAgIC8v6KeE5qC85YiH5o2iXG5cbiAgICAgICAgJCgnI2l0ZW0tbGlzdCcpLm9uKCdjbGljaycsICcuc2l6ZScsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnc2VyaWVzLWFjdGl2ZScpXG4gICAgICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ3Nlcmllcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICQodGhpcykucGFyZW50KCkucGFyZW50KCkucGFyZW50KCkuY2hpbGRyZW4oJy5saXN0LWNvbicpLmVxKCQodGhpcykuaW5kZXgoKSkuY3NzKCdkaXNwbGF5JywgJ2Jsb2NrJylcbiAgICAgICAgICAgICQodGhpcykucGFyZW50KCkucGFyZW50KCkucGFyZW50KCkuY2hpbGRyZW4oJy5saXN0LWNvbicpLmVxKCQodGhpcykuaW5kZXgoKSkuc2libGluZ3MoJy5saXN0LWNvbicpLmNzcygnZGlzcGxheScsICdub25lJylcbiAgICAgICAgfSlcblxuICAgICAgICAkKCcubGlzdCcpLm9uKCdjbGljaycsICcubmF2LWl0ZW0nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIC8vIOa4heepuuWwluWktOWbvueJh1xuICAgICAgICAgICAgJCgnI2J5LXByaWNlIC5pYy1hcnJvdycpLmNzcygnYmFja2dyb3VuZCcsICcnKVxuICAgICAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgICAgICAgICAgLy8g5o6S5bqP5qC35byPXG4gICAgICAgICAgICAkKCcjYnktc2NvcmUgc3BhbicpLmFkZENsYXNzKCdhY3RpdmUnKVxuICAgICAgICAgICAgJCgnI2J5LXNjb3JlJykuc2libGluZ3MoKS5jaGlsZHJlbigpLnJlbW92ZUNsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgICAgIC8vIOagt+W8j+m7mOiupOWFqOmDqOWVhuWTgVxuICAgICAgICAgICAgJCgnLnByb2R1Y3Qtc2VyaWVzIC5zZXJpZXMtc2VsZWN0JykucmVtb3ZlQ2xhc3MoJ3Nlcmllcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICQoJy5wcm9kdWN0LXNlcmllcyAuc2VyaWVzLXNlbGVjdCcpLmVxKDApLmFkZENsYXNzKCdzZXJpZXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAvL+m7mOiupOe7vOWQiOaOkuW6j3Nlcmllc1xuICAgICAgICAgICAgYXBwLnNvcnQgPSAwO1xuICAgICAgICAgICAgYXBwLmNhdF9pZCA9ICQodGhpcykuYXR0cignY2F0X2lkJyk7XG4gICAgICAgICAgICBhcHAuc2VyaWVzX2lkID0gJyc7XG4gICAgICAgICAgICBpZigkKHRoaXMpLmF0dHIoJ2NhdF9pZCcpICE9ICcwJykge1xuICAgICAgICAgICAgICAgIGFwcC5zZXJpZXNfbnVtID0gYXBwLnNlcmllc1tOdW1iZXIoJCh0aGlzKS5pbmRleCgpKSAtIDFdO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhhcHAuc2VyaWVzX251bS5zZXJpZXMubGVuZ3RoKVxuXG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8v5o6S5YiX6aG65bqPXG4gICAgICAgICQoJyNieS1zY29yZScpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgYXBwLnNvcnQgPSAwO1xuXG4gICAgICAgIH0pO1xuICAgICAgICAkKCcjYnktcHJpY2UnKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmKGFwcC5zb3J0ID09IDEpIHtcbiAgICAgICAgICAgICAgICBhcHAuc29ydCA9IDI7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGFwcC5zb3J0ID0gMTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9KTtcbiAgICAgICAgJCgnI2J5LW51bScpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgYXBwLnNvcnQgPSAzO1xuXG4gICAgICAgIH0pXG4gICAgICAgIC8vIOezu+WIl+agt+W8j+WIh+aNolxuICAgICAgICAkKCcucHJvZHVjdC1zZXJpZXMnKS5vbignY2xpY2snLCAnLnNlcmllcy1zZWxlY3QnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICQodGhpcykuYWRkQ2xhc3MoJ3Nlcmllcy1hY3RpdmUnKTtcbiAgICAgICAgICAgICQodGhpcykuc2libGluZ3MoKS5yZW1vdmVDbGFzcygnc2VyaWVzLWFjdGl2ZScpO1xuICAgICAgICAgICAgLy8g5pu05pS5c2VyaWVzX2lkXG4gICAgICAgICAgICBhcHAuc2VyaWVzX2lkID0gJCh0aGlzKS5hdHRyKCdzZXJpZXNfaWQnKTtcbiAgICAgICAgfSk7XG4gICAgICAgICQoJy5saXN0Jykub24oJ2NsaWNrJywgJy5jYXRlZ29yeS1saXN0JywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKCcjYmFubmVyJykuaGlkZSgpO1xuICAgICAgICB9KTtcbiAgICAgICAgJCgnLmxpc3QnKS5vbignY2xpY2snLCAnI3JlYycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJCgnI2Jhbm5lcicpLnNob3coKTtcbiAgICAgICAgfSk7XG4gICAgICAgIC8vIGxvYWQgZGVhbGVyIGluZm9cbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIHVybDogJy9hcGkvdjEuMS9yZWNvbW1lbmRvcmRlci9kZWFsZXIvJyArIGRlYWxlcl9pZCxcbiAgICAgICAgICAgIHR5cGU6ICdnZXQnLFxuICAgICAgICAgICAgZGF0YXR5cGU6ICdKU09OUCcsXG4gICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG5cbiAgICAgICAgICAgICAgICAkKCcjZGVhbGVyX25hbWUnKS5odG1sKGRhdGEuZGF0YS5kZWFsZXJfbmFtZSk7XG4gICAgICAgICAgICAgICAgJCgnLm1vZGVsIC5jYWxsIC5waG9uZS1udW1iZXInKS5odG1sKGRhdGEuZGF0YS5waG9uZSk7XG4gICAgICAgICAgICAgICAgLy/ngrnlh7vnoa7lrprmjInpkq7lj6/ku6XmiZPnlLXor51cbiAgICAgICAgICAgICAgICAkKCcubW9kZWwgLnN1cmUnKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAndGVsOicgKyBkYXRhLmRhdGEucGhvbmU7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59KTsiXSwiZmlsZSI6InJlY29tbWVuZG9yZGVyL2FkZF9naXZlYXdheS5qcyJ9
