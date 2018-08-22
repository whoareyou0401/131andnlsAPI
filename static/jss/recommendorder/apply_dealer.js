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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9hcHBseV9kZWFsZXIuanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKGNtQXBwKSB7XG5cbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBzZXR1cENTUkYoKTtcblxuICAgIHZhciBtYXAsIGdlb2xvY2F0aW9uO1xuICAgIG1hcCA9IG5ldyBBTWFwLk1hcChcIm51bGxcIiwge30pO1xuICAgIG1hcC5wbHVnaW4oJ0FNYXAuR2VvbG9jYXRpb24nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZ2VvbG9jYXRpb24gPSBuZXcgQU1hcC5HZW9sb2NhdGlvbih7XG4gICAgICAgICAgICBlbmFibGVIaWdoQWNjdXJhY3k6IHRydWUsIC8v5piv5ZCm5L2/55So6auY57K+5bqm5a6a5L2N77yM6buY6K6kOnRydWVcbiAgICAgICAgICAgIGNvbnZlcnQ6IHRydWVcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICB2YXIgdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gICAgdmFyIGN1c3RvbWVyX2lkID0gTnVtYmVyKHVybC5tYXRjaCgvKGN1c3RvbWVyXFwvKVxcZCtcXC8vKVswXS5zcGxpdChcIi9cIilbMV0pO1xuICAgIHZhciBkZWFsZXJfaWQgPSBOdW1iZXIodXJsLm1hdGNoKC8oZGVhbGVyXFwvKVxcZCtcXC8vKVswXS5zcGxpdChcIi9cIilbMV0pO1xuXG5cbiAgICBWdWUuZmlsdGVyKFwidG9GaXhlZFwiLCBmdW5jdGlvbihudW0sIHByZWNpc2lvbikge1xuICAgICAgICByZXR1cm4gTnVtYmVyKE51bWJlcihudW0pLnRvRml4ZWQocHJlY2lzaW9uKSk7XG4gICAgfSk7XG5cbiAgICB1cmwgPSBcIi9hcGkvdjEuMS9yZWNvbW1lbmRvcmRlci9jdXN0b21lci9cIiArIGN1c3RvbWVyX2lkICsgXCIvZGVhbGVyL1wiICsgZGVhbGVyX2lkICsgXCIvYXBwbHktZGVhbGVyXCI7XG5cbiAgICB2YXIgYmluZCA9IG5ldyBWdWUoe1xuICAgICAgICBlbDogXCIuY29uXCIsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGFkZHJlc3M6IFwiXCIsXG4gICAgICAgICAgICBjdXN0b21lck5hbWU6IFwiXCIsXG4gICAgICAgICAgICBwaG9uZTogXCJcIixcbiAgICAgICAgICAgIGNvbnRhY3Q6IFwiXCIsXG4gICAgICAgICAgICBwb3N0c2NyaXB0OiBcIlwiLFxuICAgICAgICAgICAgbGF0OiAtMSxcbiAgICAgICAgICAgIGxuZzogLTFcbiAgICAgICAgfSxcbiAgICAgICAgbWV0aG9kczoge1xuICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL2FwaS92MS4xL3JlY29tbWVuZG9yZGVyL2N1c3RvbWVyL1wiICsgY3VzdG9tZXJfaWQsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdnZXQnLFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5waG9uZSA9IGRhdGEucGhvbmU7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBfdGhpcy5jdXN0b21lck5hbWUgPSBkYXRhLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5hZGRyZXNzID0gZGF0YS5hZGRyZXNzO1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuY29udGFjdCA9IGRhdGEuY29udGFjdDtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmdldExvY2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnZXRMb2NhdGlvbjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgICAgICBnZW9sb2NhdGlvbi5nZXRDdXJyZW50UG9zaXRpb24oZnVuY3Rpb24oc3RhdHVzLCByZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXR1cyA9PT0gJ2NvbXBsZXRlJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmFkZHJlc3MgPSByZXN1bHQuZm9ybWF0dGVkQWRkcmVzcztcbiAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmxhdCA9IHJlc3VsdC5wb3NpdGlvbi5sYXQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5sbmcgPSByZXN1bHQucG9zaXRpb24ubG5nO1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocmVzdWx0LmZvcm1hdHRlZEFkZHJlc3MpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCLlrprkvY3lpLHotKXvvIzor7fliLfmlrDlkI7lho3or5XjgIJcIilcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1Ym1pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQoJyNzdG9yZV9uYW1lJykudmFsKCkgPT0gJycgfHwgJCgnI3RlbCcpLnZhbCgpID09ICcnIHx8ICQoJyN0ZWxfcGVvcGxlJykudmFsKCkgPT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ+i+k+WFpeWGheWuueS4jeiDveS4uuepuu+8gScpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBkYXRhVG9TZW5kID0ge1xuICAgICAgICAgICAgICAgICAgICBhZGRyZXNzOiB0aGlzLmFkZHJlc3MsXG4gICAgICAgICAgICAgICAgICAgIG5hbWU6IHRoaXMuY3VzdG9tZXJOYW1lLFxuICAgICAgICAgICAgICAgICAgICBwaG9uZTogdGhpcy5waG9uZSxcbiAgICAgICAgICAgICAgICAgICAgY29udGFjdDogdGhpcy5jb250YWN0LFxuICAgICAgICAgICAgICAgICAgICBsYXQ6IHRoaXMubGF0LFxuICAgICAgICAgICAgICAgICAgICBsbmc6IHRoaXMubG5nLFxuICAgICAgICAgICAgICAgICAgICBwb3N0c2NyaXB0OiB0aGlzLnBvc3RzY3JpcHQsXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhVG9TZW5kLFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiL3JlY29tbWVuZG9yZGVyL2N1c3RvbWVyL1wiICsgY3VzdG9tZXJfaWQgKyBcIi9kZWFsZXIvXCIgKyBkZWFsZXJfaWQgKyBcIi9hcHBseS1kZWFsZXItc3RhdHVzXCI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgYmluZC5pbml0KCk7XG5cblxufSkod2luZG93LmNtQXBwID0gd2luZG93LmNtQXBwIHx8IHt9KTtcbiJdLCJmaWxlIjoicmVjb21tZW5kb3JkZXIvYXBwbHlfZGVhbGVyLmpzIn0=
