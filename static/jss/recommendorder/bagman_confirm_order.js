(function(cmApp) {

    "use strict";
    var url = window.location.href;

    window.customer_id = Number(url.match(/(customer\/)\d+\//)[0].split('/')[1]);

    url = '/api/v1.2/recommendorder/bagman/' + window.customer_id + '/order';

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
            sum: 0,
            amount:0
        },
        methods: {
            init: function(){
                var _this = this;
                $.ajax({
                    url: '/api/v1.2/recommendorder/bagman/customer/' + window.customer_id + '/cart',
                    type: 'get',
                    success: function(data){
                        if (data.code === 0){
                            // _this.dealers = data.items;
                            var temp=[];
                            console.log(data.items);
                            for (var i=0;i<data.items.length;i++){
                                if (data.items[i].selected==true){
                                     temp.push(data.items[i]);
                                }
                            }
                            _this.dealers = temp;
                            _this.sum = data.sum;
                        }
                    }
                });
                $.ajax({
                    url: '/api/v1.2/recommendorder/bagman/customer/' + window.customer_id,
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
                return "/recommendorder/dealer/" + did + "/customer/" + window.customer_id +"/bag-add-item";
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
                    window.location.href =  "/recommendorder/dealer/" + did + "/customer/" + window.customer_id +"/bag-add-item";

                    return;
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
                        $('.loading_con_mid').hide();
                        if (data.code === 0){
                            if (window.printer != null){
                                for(var i = 0; i < data.tokens.length; i++){
                                    window.printer.printReceipt(data.tokens[i], "bagman");
                                }
                            }

                            $('.order_success_model').show();
                            $('.order_know').on('click',function() {
                                $('.order_success_model').hide();
                                window.location.href = "/recommendorder/bagman/customer/" + window.customer_id + "/profile";
                            });

                        } else {
                            $('.order_failure_model').show();
                            $('.order_know').on('click',function() {
                                $('.order_failure_model').hide();
                                window.location.href = "/recommendorder/bagman/customer/" + window.customer_id + "/profile";
                            });
                        }
                    },
                    error: function(data){
                        $('.loading_con_mid').hide();
                        $('.order_failure_model').show();
                        $('.order_know').on('click',function() {
                            $('.order_failure_model').hide();
                            window.location.href = "/recommendorder/bagman/customer/" + window.customer_id + "/profile";
                        });
                    }
                });
            }

        }
    });

bind.init();
$('.home-info-nav-a1').click(function(){
    window.location.href="/recommendorder/bagman/customer/"+window.customer_id+"/cart";
});

})(window.cmApp = window.cmApp || {});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9iYWdtYW5fY29uZmlybV9vcmRlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oY21BcHApIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIHZhciB1cmwgPSB3aW5kb3cubG9jYXRpb24uaHJlZjtcblxuICAgIHdpbmRvdy5jdXN0b21lcl9pZCA9IE51bWJlcih1cmwubWF0Y2goLyhjdXN0b21lclxcLylcXGQrXFwvLylbMF0uc3BsaXQoJy8nKVsxXSk7XG5cbiAgICB1cmwgPSAnL2FwaS92MS4yL3JlY29tbWVuZG9yZGVyL2JhZ21hbi8nICsgd2luZG93LmN1c3RvbWVyX2lkICsgJy9vcmRlcic7XG5cbiAgICBzZXR1cENTUkYoKTtcblxuICAgIFZ1ZS5maWx0ZXIoJ3RvRml4ZWQnLCBmdW5jdGlvbiAobnVtLCBwcmVjaXNpb24pIHtcbiAgICAgICAgcmV0dXJuIE51bWJlcihOdW1iZXIobnVtKS50b0ZpeGVkKHByZWNpc2lvbikpO1xuICAgIH0pO1xuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIGZ1bmN0aW9uICgpIHt9KTtcbiAgICB2YXIgYmluZCA9IG5ldyBWdWUoe1xuICAgICAgICBlbDogJyNvcmRlcicsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGN1c3RvbWVyX25hbWU6IFwiXCIsXG4gICAgICAgICAgICBwaG9uZTogXCJcIixcbiAgICAgICAgICAgIGFkZHJlc3M6IFwiXCIsXG4gICAgICAgICAgICBkZWFsZXJzOiBbXSxcbiAgICAgICAgICAgIHN1bTogMCxcbiAgICAgICAgICAgIGFtb3VudDowXG4gICAgICAgIH0sXG4gICAgICAgIG1ldGhvZHM6IHtcbiAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvYXBpL3YxLjIvcmVjb21tZW5kb3JkZXIvYmFnbWFuL2N1c3RvbWVyLycgKyB3aW5kb3cuY3VzdG9tZXJfaWQgKyAnL2NhcnQnLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZ2V0JyxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5jb2RlID09PSAwKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyBfdGhpcy5kZWFsZXJzID0gZGF0YS5pdGVtcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGVtcD1bXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhLml0ZW1zKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpPTA7aTxkYXRhLml0ZW1zLmxlbmd0aDtpKyspe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5pdGVtc1tpXS5zZWxlY3RlZD09dHJ1ZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGVtcC5wdXNoKGRhdGEuaXRlbXNbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmRlYWxlcnMgPSB0ZW1wO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLnN1bSA9IGRhdGEuc3VtO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdXJsOiAnL2FwaS92MS4yL3JlY29tbWVuZG9yZGVyL2JhZ21hbi9jdXN0b21lci8nICsgd2luZG93LmN1c3RvbWVyX2lkLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZ2V0JyxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5jb2RlID09PSAwKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5jdXN0b21lcl9uYW1lID0gZGF0YS5uYW1lO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLnBob25lID0gZGF0YS5waG9uZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5hZGRyZXNzID0gZGF0YS5hZGRyZXNzO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGhyZWY6IGZ1bmN0aW9uKGRpZCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiL3JlY29tbWVuZG9yZGVyL2RlYWxlci9cIiArIGRpZCArIFwiL2N1c3RvbWVyL1wiICsgd2luZG93LmN1c3RvbWVyX2lkICtcIi9iYWctYWRkLWl0ZW1cIjtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb21taXQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgJChcIi5tb2RlbFwiKS5jc3MoXCJkaXNwbGF5XCIsIFwiYmxvY2tcIik7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5kZWFsZXJzKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjYW5jZWw6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgJChcIi5tb2RlbFwiKS5jc3MoXCJkaXNwbGF5XCIsIFwibm9uZVwiKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb21taXRfY29uZmlybTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB2YXIgZGF0YVRvU2VuZCA9IHt9O1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmRlYWxlcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwi5peg5ZWG5ZOB77yM6K+35YWI5Zyo6LSt54mp6L2m5re75Yqg5ZWG5ZOBIVwiKTtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAgXCIvcmVjb21tZW5kb3JkZXIvZGVhbGVyL1wiICsgZGlkICsgXCIvY3VzdG9tZXIvXCIgKyB3aW5kb3cuY3VzdG9tZXJfaWQgK1wiL2JhZy1hZGQtaXRlbVwiO1xuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhVG9TZW5kLFxuICAgICAgICAgICAgICAgICAgICBiZWZvcmVTZW5kOiBmdW5jdGlvbih4aHIsc2V0dGluZ3MpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBjc3JmdG9rZW4gPSBnZXRDb29raWUoJ2NzcmZ0b2tlbicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFjc3JmU2FmZU1ldGhvZChzZXR0aW5ncy50eXBlKSAmJiAhdGhpcy5jcm9zc0RvbWFpbikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiWC1DU1JGVG9rZW5cIiwgY3NyZnRva2VuKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICQoXCIubW9kZWxcIikuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmxvYWRpbmdfY29uX21pZCcpLnNob3coKTtcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcubG9hZGluZ19jb25fbWlkJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuY29kZSA9PT0gMCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHdpbmRvdy5wcmludGVyICE9IG51bGwpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGkgPSAwOyBpIDwgZGF0YS50b2tlbnMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LnByaW50ZXIucHJpbnRSZWNlaXB0KGRhdGEudG9rZW5zW2ldLCBcImJhZ21hblwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJy5vcmRlcl9zdWNjZXNzX21vZGVsJykuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJy5vcmRlcl9rbm93Jykub24oJ2NsaWNrJyxmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnLm9yZGVyX3N1Y2Nlc3NfbW9kZWwnKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCIvcmVjb21tZW5kb3JkZXIvYmFnbWFuL2N1c3RvbWVyL1wiICsgd2luZG93LmN1c3RvbWVyX2lkICsgXCIvcHJvZmlsZVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJy5vcmRlcl9mYWlsdXJlX21vZGVsJykuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJy5vcmRlcl9rbm93Jykub24oJ2NsaWNrJyxmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnLm9yZGVyX2ZhaWx1cmVfbW9kZWwnKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCIvcmVjb21tZW5kb3JkZXIvYmFnbWFuL2N1c3RvbWVyL1wiICsgd2luZG93LmN1c3RvbWVyX2lkICsgXCIvcHJvZmlsZVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcubG9hZGluZ19jb25fbWlkJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLm9yZGVyX2ZhaWx1cmVfbW9kZWwnKS5zaG93KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcub3JkZXJfa25vdycpLm9uKCdjbGljaycsZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnLm9yZGVyX2ZhaWx1cmVfbW9kZWwnKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIi9yZWNvbW1lbmRvcmRlci9iYWdtYW4vY3VzdG9tZXIvXCIgKyB3aW5kb3cuY3VzdG9tZXJfaWQgKyBcIi9wcm9maWxlXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICB9KTtcblxuYmluZC5pbml0KCk7XG4kKCcuaG9tZS1pbmZvLW5hdi1hMScpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWY9XCIvcmVjb21tZW5kb3JkZXIvYmFnbWFuL2N1c3RvbWVyL1wiK3dpbmRvdy5jdXN0b21lcl9pZCtcIi9jYXJ0XCI7XG59KTtcblxufSkod2luZG93LmNtQXBwID0gd2luZG93LmNtQXBwIHx8IHt9KTsiXSwiZmlsZSI6InJlY29tbWVuZG9yZGVyL2JhZ21hbl9jb25maXJtX29yZGVyLmpzIn0=
