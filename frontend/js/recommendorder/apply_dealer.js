(function(cmApp) {

    "use strict";
    setupCSRF();

    var map, geolocation;
    map = new AMap.Map("null", {});
    map.plugin('AMap.Geolocation', function() {
        geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, //是否使用高精度定位，默认:true
            convert: true
        });
    });

    var url = window.location.href;
    var customer_id = Number(url.match(/(customer\/)\d+\//)[0].split("/")[1]);
    var dealer_id = Number(url.match(/(dealer\/)\d+\//)[0].split("/")[1]);


    Vue.filter("toFixed", function(num, precision) {
        return Number(Number(num).toFixed(precision));
    });

    url = "/api/v1.1/recommendorder/customer/" + customer_id + "/dealer/" + dealer_id + "/apply-dealer";

    var bind = new Vue({
        el: ".con",
        data: {
            address: "",
            customerName: "",
            phone: "",
            contact: "",
            postscript: "",
            lat: -1,
            lng: -1
        },
        methods: {
            init: function() {
                var _this = this;
                $.ajax({
                    url: "/api/v1.1/recommendorder/customer/" + customer_id,
                    type: 'get',
                    success: function(data) {
                        _this.phone = data.phone;
                        // _this.customerName = data.name;
                        _this.address = data.address;
                        _this.contact = data.contact;
                        _this.getLocation();
                    }
                });
            },
            getLocation: function() {
                var _this = this;
                geolocation.getCurrentPosition(function(status, result) {
                    if (status === 'complete') {
                        console.log(result);
                        _this.address = result.formattedAddress;
                        _this.lat = result.position.lat;
                        _this.lng = result.position.lng;
                        console.log(result.formattedAddress);
                    } else {
                        alert("定位失败，请刷新后再试。")
                    }
                });
            },
            submit: function() {
                if ($('#store_name').val() == '' || $('#tel').val() == '' || $('#tel_people').val() == '') {
                    alert('输入内容不能为空！');
                    return;
                }
                var dataToSend = {
                    address: this.address,
                    name: this.customerName,
                    phone: this.phone,
                    contact: this.contact,
                    lat: this.lat,
                    lng: this.lng,
                    postscript: this.postscript,
                };
                $.ajax({
                    url: url,
                    type: 'post',
                    data: dataToSend,
                    success: function(data) {
                        window.location.href = "/recommendorder/customer/" + customer_id + "/dealer/" + dealer_id + "/apply-dealer-status";
                    }
                });
            }
        }
    });

    bind.init();


})(window.cmApp = window.cmApp || {});
