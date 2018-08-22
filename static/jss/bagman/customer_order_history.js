(function(cmApp) {

    "use strict";

    var url = window.location.href;
    var customer_id = Number(url.match(/(customer\/)\d+\//)[0].split("/")[1]);
    setupCSRF();
    Vue.filter("toFixed", function (num, precision) {
        return Number(Number(num).toFixed(precision));
    });

    url = "/api/v1.2/recommendorder/bagman/customer/" + customer_id + "/history";

    var bind = new Vue({
        el: '.home-con',
        data: {
            phone: '',
            name: '',
            address: '',
            orders: [],
            selectedItem:{},
            recommendUrl: "/recommendorder/customer/" + customer_id + "/recommend",
            customerProfile: "/recommendorder/bagman/customer/" + customer_id + "/profile",
            historyUrl: "/recommendorder/bagman/customer/" + customer_id + "/history",
            dealerListUrl : "/recommendorder/customer/" + customer_id + "/dealer-list",
            isloaded:false
        },
        watch: {
            isloaded: function(new_value,old_value) {
                if (new_value === true) {
                    $('.nm-con').css('display','block');
                }else if(new_value === false) {
                    $('.nm-con').css('display','none');
                }
            }
        },
        methods: {
            init: function(){
                var _this = this;
                $.ajax({
                    url: url,
                    type: 'get',
                    beforeSend: function(XMLHttpRequest) {
                        var loading_str = "<div class='loading_con'><div class='loading_img'></div><p class='loading_text'>" +
                        "正在加载，请稍后...</p></div>";
                        $('.loading_con_mid').append(loading_str);
                    },
                    success: function(data){
                        console.log(data);
                        _this.orders = data.orders;
                        _this.isloaded = true;
                        $('.loading_con_mid').remove();

                        $('.home-con-mid').on('click','.additional_order',function() {
                            var add_index = $(this).parents('.history-b').index();
                            _this.additional_order(_this.orders[add_index].append_able,_this.orders[add_index].status,_this.orders[add_index].dealer_id);
                        });
                        $('.home-con-mid').on('click','.again_purchase',function(){
                            var again_index = $(this).parents('.history-b').index();
                            var items = _this.orders[again_index].items;
                            for(var item in items){
                                _this.addToSelectedItem(items[item]);
                            }
                            _this.confirmOrder();
                        });
                    }
                });
            },
            dealerUrl: function(did){
                return "/recommendorder/dealer/" + did + "/customer/" + customer_id + "/bagman-add-item";
            },
            //添加商品数据
            addToSelectedItem: function (item) {
                var _this = this;
                _this.selectedItem[item.id] = parseInt(item.num);
            },
            //添加并跳转到购物车订单页面
            confirmOrder: function () {
                var url = '/api/v1.2/recommendorder/bagman/customer/' + customer_id + '/cart';;
                var _this = this;
                setupCSRF();
                $.ajax({
                    url: url,
                    type: 'post',
                    data: _this.selectedItem
                });
                window.location.href = '/recommendorder/bagman/customer/' + customer_id + '/cart';
            },
            //追加订单
            additional_order: function(append_able,status,dealer_id) {
                if(status === 1 || status === 2) {
                    if(append_able === true) {
                        window.location.href = "/recommendorder/dealer/" + dealer_id + "/customer/" + customer_id + "/bagman-add-item";
                    }else if(append_able === false) {
                        $('.additional_text').text('本次订单已超过30分钟啦，不能追加商品了，敬请谅解！');
                        $('.additional_order_model').show();
                        $('.know').on('click',function() {
                            $('.additional_order_model').hide();
                        });
                    }
                }else if(status === 0 || status === 3) {
                    $('.additional_text').text('本次订单失败啦，不能追加商品了，敬请谅解！');
                    $('.additional_order_model').show();
                    $('.know').on('click',function() {
                        $('.additional_order_model').hide();
                    });
                }
            }
        }
    });

    bind.init();

})(window.cmApp = window.cmApp || {});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJiYWdtYW4vY3VzdG9tZXJfb3JkZXJfaGlzdG9yeS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oY21BcHApIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgIHZhciBjdXN0b21lcl9pZCA9IE51bWJlcih1cmwubWF0Y2goLyhjdXN0b21lclxcLylcXGQrXFwvLylbMF0uc3BsaXQoXCIvXCIpWzFdKTtcbiAgICBzZXR1cENTUkYoKTtcbiAgICBWdWUuZmlsdGVyKFwidG9GaXhlZFwiLCBmdW5jdGlvbiAobnVtLCBwcmVjaXNpb24pIHtcbiAgICAgICAgcmV0dXJuIE51bWJlcihOdW1iZXIobnVtKS50b0ZpeGVkKHByZWNpc2lvbikpO1xuICAgIH0pO1xuXG4gICAgdXJsID0gXCIvYXBpL3YxLjIvcmVjb21tZW5kb3JkZXIvYmFnbWFuL2N1c3RvbWVyL1wiICsgY3VzdG9tZXJfaWQgKyBcIi9oaXN0b3J5XCI7XG5cbiAgICB2YXIgYmluZCA9IG5ldyBWdWUoe1xuICAgICAgICBlbDogJy5ob21lLWNvbicsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIHBob25lOiAnJyxcbiAgICAgICAgICAgIG5hbWU6ICcnLFxuICAgICAgICAgICAgYWRkcmVzczogJycsXG4gICAgICAgICAgICBvcmRlcnM6IFtdLFxuICAgICAgICAgICAgc2VsZWN0ZWRJdGVtOnt9LFxuICAgICAgICAgICAgcmVjb21tZW5kVXJsOiBcIi9yZWNvbW1lbmRvcmRlci9jdXN0b21lci9cIiArIGN1c3RvbWVyX2lkICsgXCIvcmVjb21tZW5kXCIsXG4gICAgICAgICAgICBjdXN0b21lclByb2ZpbGU6IFwiL3JlY29tbWVuZG9yZGVyL2JhZ21hbi9jdXN0b21lci9cIiArIGN1c3RvbWVyX2lkICsgXCIvcHJvZmlsZVwiLFxuICAgICAgICAgICAgaGlzdG9yeVVybDogXCIvcmVjb21tZW5kb3JkZXIvYmFnbWFuL2N1c3RvbWVyL1wiICsgY3VzdG9tZXJfaWQgKyBcIi9oaXN0b3J5XCIsXG4gICAgICAgICAgICBkZWFsZXJMaXN0VXJsIDogXCIvcmVjb21tZW5kb3JkZXIvY3VzdG9tZXIvXCIgKyBjdXN0b21lcl9pZCArIFwiL2RlYWxlci1saXN0XCIsXG4gICAgICAgICAgICBpc2xvYWRlZDpmYWxzZVxuICAgICAgICB9LFxuICAgICAgICB3YXRjaDoge1xuICAgICAgICAgICAgaXNsb2FkZWQ6IGZ1bmN0aW9uKG5ld192YWx1ZSxvbGRfdmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAobmV3X3ZhbHVlID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5ubS1jb24nKS5jc3MoJ2Rpc3BsYXknLCdibG9jaycpO1xuICAgICAgICAgICAgICAgIH1lbHNlIGlmKG5ld192YWx1ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLm5tLWNvbicpLmNzcygnZGlzcGxheScsJ25vbmUnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG1ldGhvZHM6IHtcbiAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2dldCcsXG4gICAgICAgICAgICAgICAgICAgIGJlZm9yZVNlbmQ6IGZ1bmN0aW9uKFhNTEh0dHBSZXF1ZXN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbG9hZGluZ19zdHIgPSBcIjxkaXYgY2xhc3M9J2xvYWRpbmdfY29uJz48ZGl2IGNsYXNzPSdsb2FkaW5nX2ltZyc+PC9kaXY+PHAgY2xhc3M9J2xvYWRpbmdfdGV4dCc+XCIgK1xuICAgICAgICAgICAgICAgICAgICAgICAgXCLmraPlnKjliqDovb3vvIzor7fnqI3lkI4uLi48L3A+PC9kaXY+XCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcubG9hZGluZ19jb25fbWlkJykuYXBwZW5kKGxvYWRpbmdfc3RyKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLm9yZGVycyA9IGRhdGEub3JkZXJzO1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuaXNsb2FkZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmxvYWRpbmdfY29uX21pZCcpLnJlbW92ZSgpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcuaG9tZS1jb24tbWlkJykub24oJ2NsaWNrJywnLmFkZGl0aW9uYWxfb3JkZXInLGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhZGRfaW5kZXggPSAkKHRoaXMpLnBhcmVudHMoJy5oaXN0b3J5LWInKS5pbmRleCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmFkZGl0aW9uYWxfb3JkZXIoX3RoaXMub3JkZXJzW2FkZF9pbmRleF0uYXBwZW5kX2FibGUsX3RoaXMub3JkZXJzW2FkZF9pbmRleF0uc3RhdHVzLF90aGlzLm9yZGVyc1thZGRfaW5kZXhdLmRlYWxlcl9pZCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5ob21lLWNvbi1taWQnKS5vbignY2xpY2snLCcuYWdhaW5fcHVyY2hhc2UnLGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFnYWluX2luZGV4ID0gJCh0aGlzKS5wYXJlbnRzKCcuaGlzdG9yeS1iJykuaW5kZXgoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbXMgPSBfdGhpcy5vcmRlcnNbYWdhaW5faW5kZXhdLml0ZW1zO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaXRlbSBpbiBpdGVtcyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmFkZFRvU2VsZWN0ZWRJdGVtKGl0ZW1zW2l0ZW1dKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuY29uZmlybU9yZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRlYWxlclVybDogZnVuY3Rpb24oZGlkKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCIvcmVjb21tZW5kb3JkZXIvZGVhbGVyL1wiICsgZGlkICsgXCIvY3VzdG9tZXIvXCIgKyBjdXN0b21lcl9pZCArIFwiL2JhZ21hbi1hZGQtaXRlbVwiO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8v5re75Yqg5ZWG5ZOB5pWw5o2uXG4gICAgICAgICAgICBhZGRUb1NlbGVjdGVkSXRlbTogZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgICAgIF90aGlzLnNlbGVjdGVkSXRlbVtpdGVtLmlkXSA9IHBhcnNlSW50KGl0ZW0ubnVtKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvL+a3u+WKoOW5tui3s+i9rOWIsOi0reeJqei9puiuouWNlemhtemdolxuICAgICAgICAgICAgY29uZmlybU9yZGVyOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHVybCA9ICcvYXBpL3YxLjIvcmVjb21tZW5kb3JkZXIvYmFnbWFuL2N1c3RvbWVyLycgKyBjdXN0b21lcl9pZCArICcvY2FydCc7O1xuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICAgICAgc2V0dXBDU1JGKCk7XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdwb3N0JyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogX3RoaXMuc2VsZWN0ZWRJdGVtXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL3JlY29tbWVuZG9yZGVyL2JhZ21hbi9jdXN0b21lci8nICsgY3VzdG9tZXJfaWQgKyAnL2NhcnQnO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8v6L+95Yqg6K6i5Y2VXG4gICAgICAgICAgICBhZGRpdGlvbmFsX29yZGVyOiBmdW5jdGlvbihhcHBlbmRfYWJsZSxzdGF0dXMsZGVhbGVyX2lkKSB7XG4gICAgICAgICAgICAgICAgaWYoc3RhdHVzID09PSAxIHx8IHN0YXR1cyA9PT0gMikge1xuICAgICAgICAgICAgICAgICAgICBpZihhcHBlbmRfYWJsZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIi9yZWNvbW1lbmRvcmRlci9kZWFsZXIvXCIgKyBkZWFsZXJfaWQgKyBcIi9jdXN0b21lci9cIiArIGN1c3RvbWVyX2lkICsgXCIvYmFnbWFuLWFkZC1pdGVtXCI7XG4gICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmKGFwcGVuZF9hYmxlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmFkZGl0aW9uYWxfdGV4dCcpLnRleHQoJ+acrOasoeiuouWNleW3sui2hei/hzMw5YiG6ZKf5ZWm77yM5LiN6IO96L+95Yqg5ZWG5ZOB5LqG77yM5pWs6K+36LCF6Kej77yBJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcuYWRkaXRpb25hbF9vcmRlcl9tb2RlbCcpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5rbm93Jykub24oJ2NsaWNrJyxmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcuYWRkaXRpb25hbF9vcmRlcl9tb2RlbCcpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfWVsc2UgaWYoc3RhdHVzID09PSAwIHx8IHN0YXR1cyA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICAkKCcuYWRkaXRpb25hbF90ZXh0JykudGV4dCgn5pys5qyh6K6i5Y2V5aSx6LSl5ZWm77yM5LiN6IO96L+95Yqg5ZWG5ZOB5LqG77yM5pWs6K+36LCF6Kej77yBJyk7XG4gICAgICAgICAgICAgICAgICAgICQoJy5hZGRpdGlvbmFsX29yZGVyX21vZGVsJykuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAkKCcua25vdycpLm9uKCdjbGljaycsZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcuYWRkaXRpb25hbF9vcmRlcl9tb2RlbCcpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBiaW5kLmluaXQoKTtcblxufSkod2luZG93LmNtQXBwID0gd2luZG93LmNtQXBwIHx8IHt9KTtcbiJdLCJmaWxlIjoiYmFnbWFuL2N1c3RvbWVyX29yZGVyX2hpc3RvcnkuanMifQ==
