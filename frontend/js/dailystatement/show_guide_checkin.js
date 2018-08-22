$(function() {

    // setupCSRF();
    // 创建地图
    var map;
    map = new AMap.Map("container", {
        zoom: 11,
        resizeEnable: true
    });
    map.plugin('AMap.Geolocation', function() {
        geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, //是否使用高精度定位，默认:true
            convert: true
        });
    });
    $.ajax({
        //提交数据的类型 POST GET
        type:"GET",
        //提交的网址
        url:"/api/v1.1/dailystatement/store",
        //提交的数据
        data:{},
        //返回数据的格式
        dataType:"json",
        //在请求之前调用的函数
        beforeSend:function(){
            //请求出错处理
        } ,
        //成功返回之后调用的函数
        success:function(data){
            if (data.code == 0) {
                var data = data.data;
                var profiles = data.profiles;
                var lates = profiles.lates;
                var leave_earlies = profiles.leave_earlies;
                // console.log($('#late_number').val()))
                $("#late_number").html("迟到人数:" + profiles.late_count);
                $("#late_percent").html("迟到率::" + profiles.late_percent + '%');
                $("#leave_early_number").html("早退人数:" + profiles.leave_early_count);
                $("#leave_early_percent").html("早退率:" + profiles.leave_early_percent + '%');
                var late_str = '';
                for (var i = 0; i < lates.length; i++) {
                    late_str = late_str + "</br><span><label style='margin-left:10px;font-size: 16px;color: black;'>姓名:" + lates[i].name + "</label>" +
                        "<label style='margin-left:30px;font-size: 16px;color: black;'>电话:" + lates[i].telephone + "</label></span>";
                }
                $('#late').append(late_str);
                var leave_early_str = '';
                for (var i = 0; i < leave_earlies.length; i++) {
                    leave_early_str = leave_early_str + "</br><span><label style='margin-left:10px;font-size: 16px;color: black;'>姓名:" + leave_earlies[i].name + "</label>" +
                        "<label style='margin-left:30px;font-size: 16px;color: black;'>电话:" + leave_earlies[i].telephone + "</label></span>";
                }
                $('#leave_early').append(leave_early_str);
                for (var i = 0, marker; i < data.store.length; i++) {
                    var icon = "/static/images/dailystatement/blue.gif";
                    var position = [];
                    position.push(data.store[i]['lng']);
                    position.push(data.store[i]['lat']);
                    // unsuppled_info.push(location);
                    var marker = new AMap.Marker({
                        map: map,
                        icon: icon,
                        position: position,
                        offset: new AMap.Pixel(-12, -36),
                        extData: {'id': data.store[i]['store_id']}
                    });
                    marker_map[data.store[i]['store_id']] = marker;
                    // var str = "商家名称:" + data[i]['store_name'] + '</br>' + '地址:' + data[i]['store_address'];
                    var str = "导购姓名:" + data.store[i]['name'] + '</br>' + '联系方式:' + data.store[i]['telephone'] + '</br>' + '门店名称:' + data.store[i]['store_name']+ '</br>' + '门店地址:' + data.store[i]['store_address'];
                    marker.content = str;
                    // marker.on('click', markerClickSuppled);
                    // marker.emit('click', {target: marker});
                     marker.on('click', markerClick);
                }

            } else {
                console.log(data.data);
            }
        }   ,
        //调用执行后调用的函数
        complete: function(){
            //请求出错处理
            console.log(marker_map);
        }  ,
        //调用出错执行的函数
        error: function(){
            //请求出错处理
        }
     });

    // 建立socket连接
    var socket = io.connect('');
    // 接收消息
    socket.on('news', function (data) {
        // 解析传过来的参数，然后刷新页
        var result_data = $.parseJSON(data);
        $("#late_number").html("迟到人数:" + result_data.late_count);
        $("#late_percent").html("迟到率::" + result_data.late_percent + '%');
        $("#leave_early_number").html("早退人数:" + result_data.leave_early_count);
        $("#leave_early_percent").html("早退率:" + result_data.leave_early_percent + '%');
        var leave_earlies = result_data.leave_earlies;
        var lates = result_data.lates;
        var late_str = '';
        for (var i = 0; i < lates.length; i++) {
            late_str = late_str + "</br><span><label style='margin-left:10px;font-size: 16px;color: black;'>姓名:" + lates[i].name + "</label>" +
                "<label style='margin-left:30px;font-size: 16px;color: black;'>电话:" + lates[i].telephone + "</label></span>";
        }
        $('#late').empty();
        $("#late").html("最新迟到名单");
        $('#late').append(late_str);
        var leave_early_str = '';
        for (var i = 0; i < leave_earlies.length; i++) {
            leave_early_str = leave_early_str + "</br><span><label style='margin-left:10px;font-size: 16px;color: black;'>姓名:" + leave_earlies[i].name + "</label>" +
                "<label style='margin-left:30px;font-size: 16px;color: black;'>电话:" + leave_earlies[i].telephone + "</label></span>";
        }
        $('#leave_early').empty();
        $("#leave_early").html("最新早退名单");
        $('#leave_early').append(leave_early_str);
        var marker = marker_map[result_data['store_id']];
        var icon = '';
        var except = result_data['except'];
        if (except==0) {
            icon = '/static/images/dailystatement/green.gif';
            // 上班
        } else if (except==1){
            icon = '/static/images/dailystatement/blue.gif';
            //下班
        } else {
            icon = '/static/images/dailystatement/orange.gif';
            //异常
        }
        // map.remove(marker)
        var icon = new AMap.Icon({
                image : icon//24px*24px
                //icon可缺省，缺省时为默认的蓝色水滴图标，
                // size : new AMap.Size(7,7)
        });
        marker.setIcon(icon);
    });
    // 发送socket ID 给后端
    socket.on('connection', function (data) {
        // 解析传过来的参数，然后刷新页
        var result_data = '' + data;
        $.ajax({
            //提交数据的类型 POST GET
            type:"POST",
            //提交的网址
            url:"/api/v1.0/dailystatement/socket",
            //提交的数据
            data:{'socket_id':result_data},
            //返回数据的格式
            dataType:"json",
            //在请求之前调用的函数
            beforeSend:function(){
                //请求出错处理
            } ,
            //成功返回之后调用的函数
            success:function(data){
                console.log('ok');
            }   ,
            //调用执行后调用的函数
            complete: function(){
                //请求出错处理
            }  ,
            //调用出错执行的函数
            error: function(){
                //请求出错处理
            }
        });
    });
    var infoWindow = new AMap.InfoWindow();
    var marker_map = {};
    // 点击窗体事件
    function markerClick(e){
        infoWindow.setContent(e.target.content);
        infoWindow.open(map, e.target.getPosition());
    }
});
