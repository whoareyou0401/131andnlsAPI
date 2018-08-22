(function(cmApp) {

    "use strict";

    var url = window.location.href;
    var customer_id = Number(url.match(/(customer\/)\d+\//)[0].split("/")[1]);

    Vue.filter("toFixed", function (num, precision) {
        return Number(Number(num).toFixed(precision));
    });

    url = "/api/v1.1/recommendorder/customer/" + customer_id + "/dealer-list";
    
    var bind = new Vue({
        el: "#main",
        data: {
            dealers: [],
            isShowAdd:true,
            recommendUrl: "/recommendorder/customer/" + customer_id + "/recommend",
            customerProfile: "/recommendorder/customer/" + customer_id + "/profile",
            historyUrl: "/recommendorder/customer/" + customer_id + "/history"
        },
        beforeCreate: function(){
            var user_role = getCookie('user_role');
            if(user_role === "salesman"){
                $('.home-info-nav-a').show();
            }else if(user_role === "customer"){
                $('.add-nearbyDealer').show();
            }
        },
        methods: {
            init: function(){
                var _this = this;
                $.ajax({
                    url: url,
                    type: 'get',
                    success: function(data){
                        _this.dealers = data.dealers;
                        for(var i = 0;i<data.dealers.length;i++){
                            if(data.dealers[i].id === 12 || data.dealers[i].id === 1){
                                _this.isShowAdd = false;
                            }
                        }
                        if(_this.dealers.length === 0){
                            $('.blank').show();
                        }else{
                            $('.list-con').show();
                        }
                    }
                });
            },
            toDealerPage: function(dealer){
                console.log(dealer.id);
                if (dealer.orderable){
                    window.location.href = "/recommendorder/dealer/" + dealer.id +"/customer/" + customer_id + "/add-item";
                } else {
                    alert("商户" + dealer.name + "正在维护，请稍后再试。");
                }
            },
            dealerUrl: function(did){
                return "/recommendorder/dealer/" + did + "/customer/" + customer_id + "/add-item";
            },
            nearbyDealers: function(){
                window.location.href = "/recommendorder/customer/" + customer_id + "/nearby-dealers";
            },
            back: function(){
                window.location.href = "/recommendorder/salesman/customer-status";
            }
        }
    });

    bind.init();
})(window.cmApp = window.cmApp || {});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9kZWFsZXJfbGlzdC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oY21BcHApIHtcblxuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgIHZhciBjdXN0b21lcl9pZCA9IE51bWJlcih1cmwubWF0Y2goLyhjdXN0b21lclxcLylcXGQrXFwvLylbMF0uc3BsaXQoXCIvXCIpWzFdKTtcblxuICAgIFZ1ZS5maWx0ZXIoXCJ0b0ZpeGVkXCIsIGZ1bmN0aW9uIChudW0sIHByZWNpc2lvbikge1xuICAgICAgICByZXR1cm4gTnVtYmVyKE51bWJlcihudW0pLnRvRml4ZWQocHJlY2lzaW9uKSk7XG4gICAgfSk7XG5cbiAgICB1cmwgPSBcIi9hcGkvdjEuMS9yZWNvbW1lbmRvcmRlci9jdXN0b21lci9cIiArIGN1c3RvbWVyX2lkICsgXCIvZGVhbGVyLWxpc3RcIjtcbiAgICBcbiAgICB2YXIgYmluZCA9IG5ldyBWdWUoe1xuICAgICAgICBlbDogXCIjbWFpblwiLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBkZWFsZXJzOiBbXSxcbiAgICAgICAgICAgIGlzU2hvd0FkZDp0cnVlLFxuICAgICAgICAgICAgcmVjb21tZW5kVXJsOiBcIi9yZWNvbW1lbmRvcmRlci9jdXN0b21lci9cIiArIGN1c3RvbWVyX2lkICsgXCIvcmVjb21tZW5kXCIsXG4gICAgICAgICAgICBjdXN0b21lclByb2ZpbGU6IFwiL3JlY29tbWVuZG9yZGVyL2N1c3RvbWVyL1wiICsgY3VzdG9tZXJfaWQgKyBcIi9wcm9maWxlXCIsXG4gICAgICAgICAgICBoaXN0b3J5VXJsOiBcIi9yZWNvbW1lbmRvcmRlci9jdXN0b21lci9cIiArIGN1c3RvbWVyX2lkICsgXCIvaGlzdG9yeVwiXG4gICAgICAgIH0sXG4gICAgICAgIGJlZm9yZUNyZWF0ZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciB1c2VyX3JvbGUgPSBnZXRDb29raWUoJ3VzZXJfcm9sZScpO1xuICAgICAgICAgICAgaWYodXNlcl9yb2xlID09PSBcInNhbGVzbWFuXCIpe1xuICAgICAgICAgICAgICAgICQoJy5ob21lLWluZm8tbmF2LWEnKS5zaG93KCk7XG4gICAgICAgICAgICB9ZWxzZSBpZih1c2VyX3JvbGUgPT09IFwiY3VzdG9tZXJcIil7XG4gICAgICAgICAgICAgICAgJCgnLmFkZC1uZWFyYnlEZWFsZXInKS5zaG93KCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG1ldGhvZHM6IHtcbiAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2dldCcsXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuZGVhbGVycyA9IGRhdGEuZGVhbGVycztcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7aTxkYXRhLmRlYWxlcnMubGVuZ3RoO2krKyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoZGF0YS5kZWFsZXJzW2ldLmlkID09PSAxMiB8fCBkYXRhLmRlYWxlcnNbaV0uaWQgPT09IDEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5pc1Nob3dBZGQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihfdGhpcy5kZWFsZXJzLmxlbmd0aCA9PT0gMCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmJsYW5rJykuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnLmxpc3QtY29uJykuc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdG9EZWFsZXJQYWdlOiBmdW5jdGlvbihkZWFsZXIpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRlYWxlci5pZCk7XG4gICAgICAgICAgICAgICAgaWYgKGRlYWxlci5vcmRlcmFibGUpe1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiL3JlY29tbWVuZG9yZGVyL2RlYWxlci9cIiArIGRlYWxlci5pZCArXCIvY3VzdG9tZXIvXCIgKyBjdXN0b21lcl9pZCArIFwiL2FkZC1pdGVtXCI7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCLllYbmiLdcIiArIGRlYWxlci5uYW1lICsgXCLmraPlnKjnu7TmiqTvvIzor7fnqI3lkI7lho3or5XjgIJcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGRlYWxlclVybDogZnVuY3Rpb24oZGlkKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gXCIvcmVjb21tZW5kb3JkZXIvZGVhbGVyL1wiICsgZGlkICsgXCIvY3VzdG9tZXIvXCIgKyBjdXN0b21lcl9pZCArIFwiL2FkZC1pdGVtXCI7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbmVhcmJ5RGVhbGVyczogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiL3JlY29tbWVuZG9yZGVyL2N1c3RvbWVyL1wiICsgY3VzdG9tZXJfaWQgKyBcIi9uZWFyYnktZGVhbGVyc1wiO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJhY2s6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIi9yZWNvbW1lbmRvcmRlci9zYWxlc21hbi9jdXN0b21lci1zdGF0dXNcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgYmluZC5pbml0KCk7XG59KSh3aW5kb3cuY21BcHAgPSB3aW5kb3cuY21BcHAgfHwge30pOyJdLCJmaWxlIjoicmVjb21tZW5kb3JkZXIvZGVhbGVyX2xpc3QuanMifQ==
