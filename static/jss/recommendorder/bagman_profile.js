(function(cmApp) {

    "use strict";

    var url = window.location.href;
    var customer_id = Number(url.match(/(customer\/)\d+\//)[0].split("/")[1]);
    setupCSRF();
    Vue.filter("toFixed", function (num, precision) {
        return Number(Number(num).toFixed(precision));
    });
    document.body.addEventListener('touchstart', function () {});
    url = "/api/v1.2/recommendorder/bagman/customer/" + customer_id;
    var headerVue = new Vue({
        el: "header",
        beforeCreate: function(){
            var user_role = getCookie('user_role');
            // this.isSalesman = user_role === "salesman";
            // this.isCustomer = user_role === "customer";
            if(user_role === "salesman"){
                $('.home-info-nav-a').show();
            }else if(user_role === "customer"){
                $('.home-setting').show();
            }
        },
        methods: {
            back: function(){
                window.location.href = "/recommendorder/salesman/bagman-customer-status";
            },
            setting: function(){
                window.location.href='/recommendorder/customer/' + customer_id + '/setting';
            }
        }
    });
    var bind = new Vue({
        el: '#profile',
        data: {
            phone: '',
            name: '',
            address: '',
            suborders: [],
            selectedItem:{},

            historyUrl: "/recommendorder/bagman/customer/" + customer_id + "/history"

        },
        methods: {
            'init': function(){
                var _this = this;
                $.ajax({
                    url: url,
                    type: 'get',
                    success: function(data){
                        console.log(data);
                        _this.phone = data.phone;
                        _this.name = data.name;
                        _this.address = data.address;
                        _this.suborders = data.last_order;
                        if(_this.suborders.length === 0){
                            $('.blank').show();
                        }else{
                            $('.home-con-mid').show();
                        }
                        $('.home-con-mid').on('click','.additional_order',function() {
                            var add_index = $(this).parents('.home-store').index();
                            console.log(add_index);
                            _this.additional_order(_this.suborders[add_index].append_able,_this.suborders[add_index].status,_this.suborders[add_index].dealer_id);
                        });
                        $('.home-con-mid').on('click','.again_purchase',function(){
                            var again_index = $(this).parents('.home-store').index();
                            var items = _this.suborders[again_index].items;
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

                setupCSRF();
                var url = '/api/v1.2/recommendorder/bagman/customer/' + customer_id + '/cart';
                var _this = this;
                $.ajax({
                    url: url,
                    type: 'post',
                    data: _this.selectedItem,
                    success: function(){
                        window.location.href = '/recommendorder/bagman/customer/' + customer_id + '/cart';
                    }
                });
            },
            //追加订单
            additional_order: function(append_able,status,dealer_id) {
                if(status === 1 || status === 2) {
                    if(append_able === true) {
                        window.location.href = "/recommendorder/dealer/" + dealer_id + "/customer/" + customer_id + "/bagman-add-item";
                    }else if(append_able === false) {
                        $('.additional_text').text('本次订单已超过20分钟啦，不能追加商品了，敬请谅解！');
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
$('.history').on('touchstart',function() {
    $(this).css('opacity','0.6');
});
$('.history').on('touchend',function() {
    $(this).css('opacity','1');
});


})(window.cmApp = window.cmApp || {});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9iYWdtYW5fcHJvZmlsZS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oY21BcHApIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgIHZhciBjdXN0b21lcl9pZCA9IE51bWJlcih1cmwubWF0Y2goLyhjdXN0b21lclxcLylcXGQrXFwvLylbMF0uc3BsaXQoXCIvXCIpWzFdKTtcbiAgICBzZXR1cENTUkYoKTtcbiAgICBWdWUuZmlsdGVyKFwidG9GaXhlZFwiLCBmdW5jdGlvbiAobnVtLCBwcmVjaXNpb24pIHtcbiAgICAgICAgcmV0dXJuIE51bWJlcihOdW1iZXIobnVtKS50b0ZpeGVkKHByZWNpc2lvbikpO1xuICAgIH0pO1xuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIGZ1bmN0aW9uICgpIHt9KTtcbiAgICB1cmwgPSBcIi9hcGkvdjEuMi9yZWNvbW1lbmRvcmRlci9iYWdtYW4vY3VzdG9tZXIvXCIgKyBjdXN0b21lcl9pZDtcbiAgICB2YXIgaGVhZGVyVnVlID0gbmV3IFZ1ZSh7XG4gICAgICAgIGVsOiBcImhlYWRlclwiLFxuICAgICAgICBiZWZvcmVDcmVhdGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB2YXIgdXNlcl9yb2xlID0gZ2V0Q29va2llKCd1c2VyX3JvbGUnKTtcbiAgICAgICAgICAgIC8vIHRoaXMuaXNTYWxlc21hbiA9IHVzZXJfcm9sZSA9PT0gXCJzYWxlc21hblwiO1xuICAgICAgICAgICAgLy8gdGhpcy5pc0N1c3RvbWVyID0gdXNlcl9yb2xlID09PSBcImN1c3RvbWVyXCI7XG4gICAgICAgICAgICBpZih1c2VyX3JvbGUgPT09IFwic2FsZXNtYW5cIil7XG4gICAgICAgICAgICAgICAgJCgnLmhvbWUtaW5mby1uYXYtYScpLnNob3coKTtcbiAgICAgICAgICAgIH1lbHNlIGlmKHVzZXJfcm9sZSA9PT0gXCJjdXN0b21lclwiKXtcbiAgICAgICAgICAgICAgICAkKCcuaG9tZS1zZXR0aW5nJykuc2hvdygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBtZXRob2RzOiB7XG4gICAgICAgICAgICBiYWNrOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCIvcmVjb21tZW5kb3JkZXIvc2FsZXNtYW4vYmFnbWFuLWN1c3RvbWVyLXN0YXR1c1wiO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldHRpbmc6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWY9Jy9yZWNvbW1lbmRvcmRlci9jdXN0b21lci8nICsgY3VzdG9tZXJfaWQgKyAnL3NldHRpbmcnO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgdmFyIGJpbmQgPSBuZXcgVnVlKHtcbiAgICAgICAgZWw6ICcjcHJvZmlsZScsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIHBob25lOiAnJyxcbiAgICAgICAgICAgIG5hbWU6ICcnLFxuICAgICAgICAgICAgYWRkcmVzczogJycsXG4gICAgICAgICAgICBzdWJvcmRlcnM6IFtdLFxuICAgICAgICAgICAgc2VsZWN0ZWRJdGVtOnt9LFxuXG4gICAgICAgICAgICBoaXN0b3J5VXJsOiBcIi9yZWNvbW1lbmRvcmRlci9iYWdtYW4vY3VzdG9tZXIvXCIgKyBjdXN0b21lcl9pZCArIFwiL2hpc3RvcnlcIlxuXG4gICAgICAgIH0sXG4gICAgICAgIG1ldGhvZHM6IHtcbiAgICAgICAgICAgICdpbml0JzogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZ2V0JyxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLnBob25lID0gZGF0YS5waG9uZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLm5hbWUgPSBkYXRhLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5hZGRyZXNzID0gZGF0YS5hZGRyZXNzO1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuc3Vib3JkZXJzID0gZGF0YS5sYXN0X29yZGVyO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoX3RoaXMuc3Vib3JkZXJzLmxlbmd0aCA9PT0gMCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmJsYW5rJykuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmhvbWUtY29uLW1pZCcpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5ob21lLWNvbi1taWQnKS5vbignY2xpY2snLCcuYWRkaXRpb25hbF9vcmRlcicsZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFkZF9pbmRleCA9ICQodGhpcykucGFyZW50cygnLmhvbWUtc3RvcmUnKS5pbmRleCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGFkZF9pbmRleCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuYWRkaXRpb25hbF9vcmRlcihfdGhpcy5zdWJvcmRlcnNbYWRkX2luZGV4XS5hcHBlbmRfYWJsZSxfdGhpcy5zdWJvcmRlcnNbYWRkX2luZGV4XS5zdGF0dXMsX3RoaXMuc3Vib3JkZXJzW2FkZF9pbmRleF0uZGVhbGVyX2lkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmhvbWUtY29uLW1pZCcpLm9uKCdjbGljaycsJy5hZ2Fpbl9wdXJjaGFzZScsZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYWdhaW5faW5kZXggPSAkKHRoaXMpLnBhcmVudHMoJy5ob21lLXN0b3JlJykuaW5kZXgoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgaXRlbXMgPSBfdGhpcy5zdWJvcmRlcnNbYWdhaW5faW5kZXhdLml0ZW1zO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaXRlbSBpbiBpdGVtcyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmFkZFRvU2VsZWN0ZWRJdGVtKGl0ZW1zW2l0ZW1dKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuY29uZmlybU9yZGVyKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRlYWxlclVybDogZnVuY3Rpb24oZGlkKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCIvcmVjb21tZW5kb3JkZXIvZGVhbGVyL1wiICsgZGlkICsgXCIvY3VzdG9tZXIvXCIgKyBjdXN0b21lcl9pZCArIFwiL2JhZ21hbi1hZGQtaXRlbVwiO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8v5re75Yqg5ZWG5ZOB5pWw5o2uXG4gICAgICAgICAgICBhZGRUb1NlbGVjdGVkSXRlbTogZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgICAgIF90aGlzLnNlbGVjdGVkSXRlbVtpdGVtLmlkXSA9IHBhcnNlSW50KGl0ZW0ubnVtKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvL+a3u+WKoOW5tui3s+i9rOWIsOi0reeJqei9puiuouWNlemhtemdolxuICAgICAgICAgICAgY29uZmlybU9yZGVyOiBmdW5jdGlvbiAoKSB7XG5cbiAgICAgICAgICAgICAgICBzZXR1cENTUkYoKTtcbiAgICAgICAgICAgICAgICB2YXIgdXJsID0gJy9hcGkvdjEuMi9yZWNvbW1lbmRvcmRlci9iYWdtYW4vY3VzdG9tZXIvJyArIGN1c3RvbWVyX2lkICsgJy9jYXJ0JztcbiAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IF90aGlzLnNlbGVjdGVkSXRlbSxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9yZWNvbW1lbmRvcmRlci9iYWdtYW4vY3VzdG9tZXIvJyArIGN1c3RvbWVyX2lkICsgJy9jYXJ0JztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8v6L+95Yqg6K6i5Y2VXG4gICAgICAgICAgICBhZGRpdGlvbmFsX29yZGVyOiBmdW5jdGlvbihhcHBlbmRfYWJsZSxzdGF0dXMsZGVhbGVyX2lkKSB7XG4gICAgICAgICAgICAgICAgaWYoc3RhdHVzID09PSAxIHx8IHN0YXR1cyA9PT0gMikge1xuICAgICAgICAgICAgICAgICAgICBpZihhcHBlbmRfYWJsZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIi9yZWNvbW1lbmRvcmRlci9kZWFsZXIvXCIgKyBkZWFsZXJfaWQgKyBcIi9jdXN0b21lci9cIiArIGN1c3RvbWVyX2lkICsgXCIvYmFnbWFuLWFkZC1pdGVtXCI7XG4gICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmKGFwcGVuZF9hYmxlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmFkZGl0aW9uYWxfdGV4dCcpLnRleHQoJ+acrOasoeiuouWNleW3sui2hei/hzIw5YiG6ZKf5ZWm77yM5LiN6IO96L+95Yqg5ZWG5ZOB5LqG77yM5pWs6K+36LCF6Kej77yBJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcuYWRkaXRpb25hbF9vcmRlcl9tb2RlbCcpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5rbm93Jykub24oJ2NsaWNrJyxmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcuYWRkaXRpb25hbF9vcmRlcl9tb2RlbCcpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfWVsc2UgaWYoc3RhdHVzID09PSAwIHx8IHN0YXR1cyA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICAkKCcuYWRkaXRpb25hbF90ZXh0JykudGV4dCgn5pys5qyh6K6i5Y2V5aSx6LSl5ZWm77yM5LiN6IO96L+95Yqg5ZWG5ZOB5LqG77yM5pWs6K+36LCF6Kej77yBJyk7XG4gICAgICAgICAgICAgICAgICAgICQoJy5hZGRpdGlvbmFsX29yZGVyX21vZGVsJykuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAkKCcua25vdycpLm9uKCdjbGljaycsZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcuYWRkaXRpb25hbF9vcmRlcl9tb2RlbCcpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbmJpbmQuaW5pdCgpO1xuJCgnLmhpc3RvcnknKS5vbigndG91Y2hzdGFydCcsZnVuY3Rpb24oKSB7XG4gICAgJCh0aGlzKS5jc3MoJ29wYWNpdHknLCcwLjYnKTtcbn0pO1xuJCgnLmhpc3RvcnknKS5vbigndG91Y2hlbmQnLGZ1bmN0aW9uKCkge1xuICAgICQodGhpcykuY3NzKCdvcGFjaXR5JywnMScpO1xufSk7XG5cblxufSkod2luZG93LmNtQXBwID0gd2luZG93LmNtQXBwIHx8IHt9KTtcbiJdLCJmaWxlIjoicmVjb21tZW5kb3JkZXIvYmFnbWFuX3Byb2ZpbGUuanMifQ==
