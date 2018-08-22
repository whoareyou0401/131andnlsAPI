(function(cmApp) {

    "use strict";
    var url = window.location.href;

    window.customer_id = Number(url.match(/(customer\/)\d+\//)[0].split('/')[1]);

    url = '/api/v1.1/recommendorder/customer/' + window.customer_id + '/order';

    setupCSRF();

    Vue.filter('toFixed', function (num, precision) {
        return Number(Number(num).toFixed(precision));
    });
    document.body.addEventListener('touchstart', function () {});
    var bind = new Vue({
        el: '#order',
        data: {
            customer_name: "",
            phone: "",
            address: "",
            dealers: [],
            sum: 0
        },
        methods: {
            init: function(){
                var _this = this;
                $.ajax({
                    url: url,
                    type: 'get',
                    success: function(data){
                        if (data.code === 0){
                            _this.dealers = data.items;
                            _this.sum = data.sum;
                        }
                    }
                });
                $.ajax({
                    url: '/api/v1.1/recommendorder/customer/' + window.customer_id,
                    type: 'get',
                    success: function(data){
                        if (data.code === 0){
                            _this.customer_name = data.name;
                            _this.phone = data.phone;
                            _this.address = data.address;
                        }
                    }
                });
            },
            dhref: function(did){
                return "/recommendorder/dealer/" + did + "/customer/" + window.customer_id +"/add-item";
            },
            commit: function(){
                $(".model").css("display", "block");
                console.log(this.dealers);
            },
            cancel: function(){
                $(".model").css("display", "none");
            },
            commit_confirm: function(){
                var dataToSend = {};
                if (this.dealers.length === 0) {
                    alert("无商品，请先在购物车添加商品!");
                    window.location.href = "/recommendorder/customer/" + window.customer_id +"/dealer-list";

                    return;
                }
                for(var i = 0; i < this.dealers.length; i++){
                    if (this.dealers[i].sum < this.dealers[i].initial_price) {
                        alert("在" + this.dealers[i].name + "的订单未达到起送金额!");
                        window.location.href = "/recommendorder/customer/" + window.customer_id +"/cart";
                        return;
                    }
                    dataToSend[this.dealers[i].id] = this.dealers[i].postscript;
                }

                $.ajax({
                    url: url,
                    type: 'post',
                    data: dataToSend,
                    beforeSend: function(xhr,settings) {
                        var csrftoken = getCookie('csrftoken');
                        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                            xhr.setRequestHeader("X-CSRFToken", csrftoken);
                        }
                        $(".model").hide();
                        $('.loading_con_mid').show();
                    },
                    success: function(data){
                        console.log(data);
                        $('.loading_con_mid').hide();
                        if (data.code === 0){
                            if (window.printer != null){
                                for(var i = 0; i < data.tokens.length; i++){
                                    window.printer.printReceipt(data.tokens[i], "salesman");
                                }
                            }

                            $('.order_success_model').show();
                            $('.order_know').on('click',function() {
                                $('.order_success_model').hide();
                                window.location.href = "/recommendorder/customer/" + window.customer_id + "/profile";
                            });

                        } else {
                            $('.order_failure_model').show();
                            $('.order_know').on('click',function() {
                                $('.order_failure_model').hide();
                                window.location.href = "/recommendorder/customer/" + window.customer_id + "/profile";
                            });
                        }
                    },
                    error: function(data){
                        $('.loading_con_mid').hide();
                        $('.order_failure_model').show();
                        $('.order_know').on('click',function() {
                            $('.order_failure_model').hide();
                            window.location.href = "/recommendorder/customer/" + window.customer_id + "/profile";
                        });
                    }
                });
            }

        }
    });

bind.init();
$('.home-info-nav-a1').click(function(){
    window.location.href="/recommendorder/customer/"+window.customer_id+"/cart";
});

})(window.cmApp = window.cmApp || {});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9jb25maXJtX29yZGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbihjbUFwcCkge1xuXG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgdmFyIHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuXG4gICAgd2luZG93LmN1c3RvbWVyX2lkID0gTnVtYmVyKHVybC5tYXRjaCgvKGN1c3RvbWVyXFwvKVxcZCtcXC8vKVswXS5zcGxpdCgnLycpWzFdKTtcblxuICAgIHVybCA9ICcvYXBpL3YxLjEvcmVjb21tZW5kb3JkZXIvY3VzdG9tZXIvJyArIHdpbmRvdy5jdXN0b21lcl9pZCArICcvb3JkZXInO1xuXG4gICAgc2V0dXBDU1JGKCk7XG5cbiAgICBWdWUuZmlsdGVyKCd0b0ZpeGVkJywgZnVuY3Rpb24gKG51bSwgcHJlY2lzaW9uKSB7XG4gICAgICAgIHJldHVybiBOdW1iZXIoTnVtYmVyKG51bSkudG9GaXhlZChwcmVjaXNpb24pKTtcbiAgICB9KTtcbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbiAoKSB7fSk7XG4gICAgdmFyIGJpbmQgPSBuZXcgVnVlKHtcbiAgICAgICAgZWw6ICcjb3JkZXInLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBjdXN0b21lcl9uYW1lOiBcIlwiLFxuICAgICAgICAgICAgcGhvbmU6IFwiXCIsXG4gICAgICAgICAgICBhZGRyZXNzOiBcIlwiLFxuICAgICAgICAgICAgZGVhbGVyczogW10sXG4gICAgICAgICAgICBzdW06IDBcbiAgICAgICAgfSxcbiAgICAgICAgbWV0aG9kczoge1xuICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZ2V0JyxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5jb2RlID09PSAwKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5kZWFsZXJzID0gZGF0YS5pdGVtcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5zdW0gPSBkYXRhLnN1bTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogJy9hcGkvdjEuMS9yZWNvbW1lbmRvcmRlci9jdXN0b21lci8nICsgd2luZG93LmN1c3RvbWVyX2lkLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZ2V0JyxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5jb2RlID09PSAwKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5jdXN0b21lcl9uYW1lID0gZGF0YS5uYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLnBob25lID0gZGF0YS5waG9uZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5hZGRyZXNzID0gZGF0YS5hZGRyZXNzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGhyZWY6IGZ1bmN0aW9uKGRpZCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiL3JlY29tbWVuZG9yZGVyL2RlYWxlci9cIiArIGRpZCArIFwiL2N1c3RvbWVyL1wiICsgd2luZG93LmN1c3RvbWVyX2lkICtcIi9hZGQtaXRlbVwiO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbW1pdDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAkKFwiLm1vZGVsXCIpLmNzcyhcImRpc3BsYXlcIiwgXCJibG9ja1wiKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh0aGlzLmRlYWxlcnMpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNhbmNlbDogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAkKFwiLm1vZGVsXCIpLmNzcyhcImRpc3BsYXlcIiwgXCJub25lXCIpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbW1pdF9jb25maXJtOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHZhciBkYXRhVG9TZW5kID0ge307XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZGVhbGVycy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCLml6DllYblk4HvvIzor7flhYjlnKjotK3nianovabmt7vliqDllYblk4EhXCIpO1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiL3JlY29tbWVuZG9yZGVyL2N1c3RvbWVyL1wiICsgd2luZG93LmN1c3RvbWVyX2lkICtcIi9kZWFsZXItbGlzdFwiO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yKHZhciBpID0gMDsgaSA8IHRoaXMuZGVhbGVycy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmRlYWxlcnNbaV0uc3VtIDwgdGhpcy5kZWFsZXJzW2ldLmluaXRpYWxfcHJpY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwi5ZyoXCIgKyB0aGlzLmRlYWxlcnNbaV0ubmFtZSArIFwi55qE6K6i5Y2V5pyq6L6+5Yiw6LW36YCB6YeR6aKdIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCIvcmVjb21tZW5kb3JkZXIvY3VzdG9tZXIvXCIgKyB3aW5kb3cuY3VzdG9tZXJfaWQgK1wiL2NhcnRcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBkYXRhVG9TZW5kW3RoaXMuZGVhbGVyc1tpXS5pZF0gPSB0aGlzLmRlYWxlcnNbaV0ucG9zdHNjcmlwdDtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhVG9TZW5kLFxuICAgICAgICAgICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbih4aHIsc2V0dGluZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjc3JmdG9rZW4gPSBnZXRDb29raWUoJ2NzcmZ0b2tlbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjc3JmU2FmZU1ldGhvZChzZXR0aW5ncy50eXBlKSAmJiAhdGhpcy5jcm9zc0RvbWFpbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiWC1DU1JGVG9rZW5cIiwgY3NyZnRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICQoXCIubW9kZWxcIikuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmxvYWRpbmdfY29uX21pZCcpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5sb2FkaW5nX2Nvbl9taWQnKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5jb2RlID09PSAwKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAod2luZG93LnByaW50ZXIgIT0gbnVsbCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBkYXRhLnRva2Vucy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cucHJpbnRlci5wcmludFJlY2VpcHQoZGF0YS50b2tlbnNbaV0sIFwic2FsZXNtYW5cIik7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcub3JkZXJfc3VjY2Vzc19tb2RlbCcpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcub3JkZXJfa25vdycpLm9uKCdjbGljaycsZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJy5vcmRlcl9zdWNjZXNzX21vZGVsJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiL3JlY29tbWVuZG9yZGVyL2N1c3RvbWVyL1wiICsgd2luZG93LmN1c3RvbWVyX2lkICsgXCIvcHJvZmlsZVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJy5vcmRlcl9mYWlsdXJlX21vZGVsJykuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJy5vcmRlcl9rbm93Jykub24oJ2NsaWNrJyxmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnLm9yZGVyX2ZhaWx1cmVfbW9kZWwnKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCIvcmVjb21tZW5kb3JkZXIvY3VzdG9tZXIvXCIgKyB3aW5kb3cuY3VzdG9tZXJfaWQgKyBcIi9wcm9maWxlXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5sb2FkaW5nX2Nvbl9taWQnKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcub3JkZXJfZmFpbHVyZV9tb2RlbCcpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy5vcmRlcl9rbm93Jykub24oJ2NsaWNrJyxmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcub3JkZXJfZmFpbHVyZV9tb2RlbCcpLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiL3JlY29tbWVuZG9yZGVyL2N1c3RvbWVyL1wiICsgd2luZG93LmN1c3RvbWVyX2lkICsgXCIvcHJvZmlsZVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgfSk7XG5cbmJpbmQuaW5pdCgpO1xuJCgnLmhvbWUtaW5mby1uYXYtYTEnKS5jbGljayhmdW5jdGlvbigpe1xuICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmPVwiL3JlY29tbWVuZG9yZGVyL2N1c3RvbWVyL1wiK3dpbmRvdy5jdXN0b21lcl9pZCtcIi9jYXJ0XCI7XG59KTtcblxufSkod2luZG93LmNtQXBwID0gd2luZG93LmNtQXBwIHx8IHt9KTsiXSwiZmlsZSI6InJlY29tbWVuZG9yZGVyL2NvbmZpcm1fb3JkZXIuanMifQ==
