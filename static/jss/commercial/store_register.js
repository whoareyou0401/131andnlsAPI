$(document).ready(function () {
    $('#position').click(function () {
        $('#layer').show();    //开启鼠标滚轮缩放
        return false;
    });
    function baiduMap() {
        var map = new BMap.Map("allmap");    // 创建Map实例
        map.centerAndZoom(new BMap.Point(116.404, 39.915), 11);  // 初始化地图,设置中心点坐标和地图级别
        map.addControl(new BMap.MapTypeControl());   //添加地图类型控件
        map.setCurrentCity("北京");          // 设置地图显示的城市 此项是必须设置的
        map.enableScrollWheelZoom(true);
    }
    baiduMap();
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjb21tZXJjaWFsL3N0b3JlX3JlZ2lzdGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAkKCcjcG9zaXRpb24nKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICQoJyNsYXllcicpLnNob3coKTsgICAgLy/lvIDlkK/pvKDmoIfmu5rova7nvKnmlL5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH0pO1xuICAgIGZ1bmN0aW9uIGJhaWR1TWFwKCkge1xuICAgICAgICB2YXIgbWFwID0gbmV3IEJNYXAuTWFwKFwiYWxsbWFwXCIpOyAgICAvLyDliJvlu7pNYXDlrp7kvotcbiAgICAgICAgbWFwLmNlbnRlckFuZFpvb20obmV3IEJNYXAuUG9pbnQoMTE2LjQwNCwgMzkuOTE1KSwgMTEpOyAgLy8g5Yid5aeL5YyW5Zyw5Zu+LOiuvue9ruS4reW/g+eCueWdkOagh+WSjOWcsOWbvue6p+WIq1xuICAgICAgICBtYXAuYWRkQ29udHJvbChuZXcgQk1hcC5NYXBUeXBlQ29udHJvbCgpKTsgICAvL+a3u+WKoOWcsOWbvuexu+Wei+aOp+S7tlxuICAgICAgICBtYXAuc2V0Q3VycmVudENpdHkoXCLljJfkuqxcIik7ICAgICAgICAgIC8vIOiuvue9ruWcsOWbvuaYvuekuueahOWfjuW4giDmraTpobnmmK/lv4Xpobvorr7nva7nmoRcbiAgICAgICAgbWFwLmVuYWJsZVNjcm9sbFdoZWVsWm9vbSh0cnVlKTtcbiAgICB9XG4gICAgYmFpZHVNYXAoKTtcbn0pOyJdLCJmaWxlIjoiY29tbWVyY2lhbC9zdG9yZV9yZWdpc3Rlci5qcyJ9
