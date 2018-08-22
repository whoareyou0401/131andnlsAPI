(function(cmApp) {

    "use strict";

    var url = window.location.href;
    var customer_id = Number(url.match(/(customer\/)\d+\//)[0].split("/")[1]);
    setupCSRF();
    Vue.filter("toFixed", function (num, precision) {
        return Number(Number(num).toFixed(precision));
    });

    url = "/api/v1.1/recommendorder/customer/" + customer_id + "/history";

    var bind = new Vue({
        el: '.home-con',
        data: {
            phone: '',
            name: '',
            address: '',
            orders: [],
            selectedItem:{},
            recommendUrl: "/recommendorder/customer/" + customer_id + "/recommend",
            customerProfile: "/recommendorder/customer/" + customer_id + "/profile",
            historyUrl: "/recommendorder/customer/" + customer_id + "/history",
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
                return "/recommendorder/dealer/" + did + "/customer/" + customer_id + "/add-item";
            },
            //添加商品数据
            addToSelectedItem: function (item) {
                var _this = this;
                _this.selectedItem[item.id] = parseInt(item.num);
            },
            //添加并跳转到购物车订单页面
            confirmOrder: function () {
                var url = '/api/v1.1/recommendorder/customer/' + customer_id + '/cart';
                var _this = this;
                $.ajax({
                    url: url,
                    type: 'post',
                    data: _this.selectedItem
                });
                window.location.href = '/recommendorder/customer/' + customer_id + '/cart';
            },
            //追加订单
            additional_order: function(append_able,status,dealer_id) {
                if(status === 1 || status === 2) {
                    if(append_able === true) {
                        window.location.href = "/recommendorder/dealer/" + dealer_id + "/customer/" + customer_id + "/add-item";
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9jdXN0b21lcl9vcmRlcl9oaXN0b3J5LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbihjbUFwcCkge1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICB2YXIgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gICAgdmFyIGN1c3RvbWVyX2lkID0gTnVtYmVyKHVybC5tYXRjaCgvKGN1c3RvbWVyXFwvKVxcZCtcXC8vKVswXS5zcGxpdChcIi9cIilbMV0pO1xuICAgIHNldHVwQ1NSRigpO1xuICAgIFZ1ZS5maWx0ZXIoXCJ0b0ZpeGVkXCIsIGZ1bmN0aW9uIChudW0sIHByZWNpc2lvbikge1xuICAgICAgICByZXR1cm4gTnVtYmVyKE51bWJlcihudW0pLnRvRml4ZWQocHJlY2lzaW9uKSk7XG4gICAgfSk7XG5cbiAgICB1cmwgPSBcIi9hcGkvdjEuMS9yZWNvbW1lbmRvcmRlci9jdXN0b21lci9cIiArIGN1c3RvbWVyX2lkICsgXCIvaGlzdG9yeVwiO1xuXG4gICAgdmFyIGJpbmQgPSBuZXcgVnVlKHtcbiAgICAgICAgZWw6ICcuaG9tZS1jb24nLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBwaG9uZTogJycsXG4gICAgICAgICAgICBuYW1lOiAnJyxcbiAgICAgICAgICAgIGFkZHJlc3M6ICcnLFxuICAgICAgICAgICAgb3JkZXJzOiBbXSxcbiAgICAgICAgICAgIHNlbGVjdGVkSXRlbTp7fSxcbiAgICAgICAgICAgIHJlY29tbWVuZFVybDogXCIvcmVjb21tZW5kb3JkZXIvY3VzdG9tZXIvXCIgKyBjdXN0b21lcl9pZCArIFwiL3JlY29tbWVuZFwiLFxuICAgICAgICAgICAgY3VzdG9tZXJQcm9maWxlOiBcIi9yZWNvbW1lbmRvcmRlci9jdXN0b21lci9cIiArIGN1c3RvbWVyX2lkICsgXCIvcHJvZmlsZVwiLFxuICAgICAgICAgICAgaGlzdG9yeVVybDogXCIvcmVjb21tZW5kb3JkZXIvY3VzdG9tZXIvXCIgKyBjdXN0b21lcl9pZCArIFwiL2hpc3RvcnlcIixcbiAgICAgICAgICAgIGRlYWxlckxpc3RVcmwgOiBcIi9yZWNvbW1lbmRvcmRlci9jdXN0b21lci9cIiArIGN1c3RvbWVyX2lkICsgXCIvZGVhbGVyLWxpc3RcIixcbiAgICAgICAgICAgIGlzbG9hZGVkOmZhbHNlXG4gICAgICAgIH0sXG4gICAgICAgIHdhdGNoOiB7XG4gICAgICAgICAgICBpc2xvYWRlZDogZnVuY3Rpb24obmV3X3ZhbHVlLG9sZF92YWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmIChuZXdfdmFsdWUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLm5tLWNvbicpLmNzcygnZGlzcGxheScsJ2Jsb2NrJyk7IFxuICAgICAgICAgICAgICAgIH1lbHNlIGlmKG5ld192YWx1ZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnLm5tLWNvbicpLmNzcygnZGlzcGxheScsJ25vbmUnKTsgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBtZXRob2RzOiB7XG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdnZXQnLFxuICAgICAgICAgICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbihYTUxIdHRwUmVxdWVzdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxvYWRpbmdfc3RyID0gXCI8ZGl2IGNsYXNzPSdsb2FkaW5nX2Nvbic+PGRpdiBjbGFzcz0nbG9hZGluZ19pbWcnPjwvZGl2PjxwIGNsYXNzPSdsb2FkaW5nX3RleHQnPlwiICsgXG4gICAgICAgICAgICAgICAgICAgICAgICBcIuato+WcqOWKoOi9ve+8jOivt+eojeWQji4uLjwvcD48L2Rpdj5cIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5sb2FkaW5nX2Nvbl9taWQnKS5hcHBlbmQobG9hZGluZ19zdHIpO1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMub3JkZXJzID0gZGF0YS5vcmRlcnM7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5pc2xvYWRlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcubG9hZGluZ19jb25fbWlkJykucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5ob21lLWNvbi1taWQnKS5vbignY2xpY2snLCcuYWRkaXRpb25hbF9vcmRlcicsZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFkZF9pbmRleCA9ICQodGhpcykucGFyZW50cygnLmhpc3RvcnktYicpLmluZGV4KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuYWRkaXRpb25hbF9vcmRlcihfdGhpcy5vcmRlcnNbYWRkX2luZGV4XS5hcHBlbmRfYWJsZSxfdGhpcy5vcmRlcnNbYWRkX2luZGV4XS5zdGF0dXMsX3RoaXMub3JkZXJzW2FkZF9pbmRleF0uZGVhbGVyX2lkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmhvbWUtY29uLW1pZCcpLm9uKCdjbGljaycsJy5hZ2Fpbl9wdXJjaGFzZScsZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgYWdhaW5faW5kZXggPSAkKHRoaXMpLnBhcmVudHMoJy5oaXN0b3J5LWInKS5pbmRleCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpdGVtcyA9IF90aGlzLm9yZGVyc1thZ2Fpbl9pbmRleF0uaXRlbXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpdGVtIGluIGl0ZW1zKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuYWRkVG9TZWxlY3RlZEl0ZW0oaXRlbXNbaXRlbV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5jb25maXJtT3JkZXIoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGVhbGVyVXJsOiBmdW5jdGlvbihkaWQpe1xuICAgICAgICAgICAgICAgIHJldHVybiBcIi9yZWNvbW1lbmRvcmRlci9kZWFsZXIvXCIgKyBkaWQgKyBcIi9jdXN0b21lci9cIiArIGN1c3RvbWVyX2lkICsgXCIvYWRkLWl0ZW1cIjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvL+a3u+WKoOWVhuWTgeaVsOaNrlxuICAgICAgICAgICAgYWRkVG9TZWxlY3RlZEl0ZW06IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgICAgICBfdGhpcy5zZWxlY3RlZEl0ZW1baXRlbS5pZF0gPSBwYXJzZUludChpdGVtLm51bSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLy/mt7vliqDlubbot7PovazliLDotK3nianovaborqLljZXpobXpnaJcbiAgICAgICAgICAgIGNvbmZpcm1PcmRlcjogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciB1cmwgPSAnL2FwaS92MS4xL3JlY29tbWVuZG9yZGVyL2N1c3RvbWVyLycgKyBjdXN0b21lcl9pZCArICcvY2FydCc7XG4gICAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBfdGhpcy5zZWxlY3RlZEl0ZW1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvcmVjb21tZW5kb3JkZXIvY3VzdG9tZXIvJyArIGN1c3RvbWVyX2lkICsgJy9jYXJ0JztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvL+i/veWKoOiuouWNlVxuICAgICAgICAgICAgYWRkaXRpb25hbF9vcmRlcjogZnVuY3Rpb24oYXBwZW5kX2FibGUsc3RhdHVzLGRlYWxlcl9pZCkge1xuICAgICAgICAgICAgICAgIGlmKHN0YXR1cyA9PT0gMSB8fCBzdGF0dXMgPT09IDIpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoYXBwZW5kX2FibGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCIvcmVjb21tZW5kb3JkZXIvZGVhbGVyL1wiICsgZGVhbGVyX2lkICsgXCIvY3VzdG9tZXIvXCIgKyBjdXN0b21lcl9pZCArIFwiL2FkZC1pdGVtXCI7XG4gICAgICAgICAgICAgICAgICAgIH1lbHNlIGlmKGFwcGVuZF9hYmxlID09PSBmYWxzZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmFkZGl0aW9uYWxfdGV4dCcpLnRleHQoJ+acrOasoeiuouWNleW3sui2hei/hzMw5YiG6ZKf5ZWm77yM5LiN6IO96L+95Yqg5ZWG5ZOB5LqG77yM5pWs6K+36LCF6Kej77yBJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcuYWRkaXRpb25hbF9vcmRlcl9tb2RlbCcpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5rbm93Jykub24oJ2NsaWNrJyxmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcuYWRkaXRpb25hbF9vcmRlcl9tb2RlbCcpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfWVsc2UgaWYoc3RhdHVzID09PSAwIHx8IHN0YXR1cyA9PT0gMykge1xuICAgICAgICAgICAgICAgICAgICAkKCcuYWRkaXRpb25hbF90ZXh0JykudGV4dCgn5pys5qyh6K6i5Y2V5aSx6LSl5ZWm77yM5LiN6IO96L+95Yqg5ZWG5ZOB5LqG77yM5pWs6K+36LCF6Kej77yBJyk7XG4gICAgICAgICAgICAgICAgICAgICQoJy5hZGRpdGlvbmFsX29yZGVyX21vZGVsJykuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAkKCcua25vdycpLm9uKCdjbGljaycsZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcuYWRkaXRpb25hbF9vcmRlcl9tb2RlbCcpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBiaW5kLmluaXQoKTtcblxufSkod2luZG93LmNtQXBwID0gd2luZG93LmNtQXBwIHx8IHt9KTtcbiJdLCJmaWxlIjoicmVjb21tZW5kb3JkZXIvY3VzdG9tZXJfb3JkZXJfaGlzdG9yeS5qcyJ9
