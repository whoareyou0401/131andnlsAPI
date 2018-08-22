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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJkYWlseXN0YXRlbWVudC9zaG93X2d1aWRlX2NoZWNraW4uanMiXSwic291cmNlc0NvbnRlbnQiOlsiJChmdW5jdGlvbigpIHtcblxuICAgIC8vIHNldHVwQ1NSRigpO1xuICAgIC8vIOWIm+W7uuWcsOWbvlxuICAgIHZhciBtYXA7XG4gICAgbWFwID0gbmV3IEFNYXAuTWFwKFwiY29udGFpbmVyXCIsIHtcbiAgICAgICAgem9vbTogMTEsXG4gICAgICAgIHJlc2l6ZUVuYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIG1hcC5wbHVnaW4oJ0FNYXAuR2VvbG9jYXRpb24nLCBmdW5jdGlvbigpIHtcbiAgICAgICAgZ2VvbG9jYXRpb24gPSBuZXcgQU1hcC5HZW9sb2NhdGlvbih7XG4gICAgICAgICAgICBlbmFibGVIaWdoQWNjdXJhY3k6IHRydWUsIC8v5piv5ZCm5L2/55So6auY57K+5bqm5a6a5L2N77yM6buY6K6kOnRydWVcbiAgICAgICAgICAgIGNvbnZlcnQ6IHRydWVcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gICAgJC5hamF4KHtcbiAgICAgICAgLy/mj5DkuqTmlbDmja7nmoTnsbvlnosgUE9TVCBHRVRcbiAgICAgICAgdHlwZTpcIkdFVFwiLFxuICAgICAgICAvL+aPkOS6pOeahOe9keWdgFxuICAgICAgICB1cmw6XCIvYXBpL3YxLjEvZGFpbHlzdGF0ZW1lbnQvc3RvcmVcIixcbiAgICAgICAgLy/mj5DkuqTnmoTmlbDmja5cbiAgICAgICAgZGF0YTp7fSxcbiAgICAgICAgLy/ov5Tlm57mlbDmja7nmoTmoLzlvI9cbiAgICAgICAgZGF0YVR5cGU6XCJqc29uXCIsXG4gICAgICAgIC8v5Zyo6K+35rGC5LmL5YmN6LCD55So55qE5Ye95pWwXG4gICAgICAgIGJlZm9yZVNlbmQ6ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIC8v6K+35rGC5Ye66ZSZ5aSE55CGXG4gICAgICAgIH0gLFxuICAgICAgICAvL+aIkOWKn+i/lOWbnuS5i+WQjuiwg+eUqOeahOWHveaVsFxuICAgICAgICBzdWNjZXNzOmZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgaWYgKGRhdGEuY29kZSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRhdGEgPSBkYXRhLmRhdGE7XG4gICAgICAgICAgICAgICAgdmFyIHByb2ZpbGVzID0gZGF0YS5wcm9maWxlcztcbiAgICAgICAgICAgICAgICB2YXIgbGF0ZXMgPSBwcm9maWxlcy5sYXRlcztcbiAgICAgICAgICAgICAgICB2YXIgbGVhdmVfZWFybGllcyA9IHByb2ZpbGVzLmxlYXZlX2VhcmxpZXM7XG4gICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2coJCgnI2xhdGVfbnVtYmVyJykudmFsKCkpKVxuICAgICAgICAgICAgICAgICQoXCIjbGF0ZV9udW1iZXJcIikuaHRtbChcIui/n+WIsOS6uuaVsDpcIiArIHByb2ZpbGVzLmxhdGVfY291bnQpO1xuICAgICAgICAgICAgICAgICQoXCIjbGF0ZV9wZXJjZW50XCIpLmh0bWwoXCLov5/liLDnjoc6OlwiICsgcHJvZmlsZXMubGF0ZV9wZXJjZW50ICsgJyUnKTtcbiAgICAgICAgICAgICAgICAkKFwiI2xlYXZlX2Vhcmx5X251bWJlclwiKS5odG1sKFwi5pep6YCA5Lq65pWwOlwiICsgcHJvZmlsZXMubGVhdmVfZWFybHlfY291bnQpO1xuICAgICAgICAgICAgICAgICQoXCIjbGVhdmVfZWFybHlfcGVyY2VudFwiKS5odG1sKFwi5pep6YCA546HOlwiICsgcHJvZmlsZXMubGVhdmVfZWFybHlfcGVyY2VudCArICclJyk7XG4gICAgICAgICAgICAgICAgdmFyIGxhdGVfc3RyID0gJyc7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBsYXRlX3N0ciA9IGxhdGVfc3RyICsgXCI8L2JyPjxzcGFuPjxsYWJlbCBzdHlsZT0nbWFyZ2luLWxlZnQ6MTBweDtmb250LXNpemU6IDE2cHg7Y29sb3I6IGJsYWNrOyc+5aeT5ZCNOlwiICsgbGF0ZXNbaV0ubmFtZSArIFwiPC9sYWJlbD5cIiArXG4gICAgICAgICAgICAgICAgICAgICAgICBcIjxsYWJlbCBzdHlsZT0nbWFyZ2luLWxlZnQ6MzBweDtmb250LXNpemU6IDE2cHg7Y29sb3I6IGJsYWNrOyc+55S16K+dOlwiICsgbGF0ZXNbaV0udGVsZXBob25lICsgXCI8L2xhYmVsPjwvc3Bhbj5cIjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJCgnI2xhdGUnKS5hcHBlbmQobGF0ZV9zdHIpO1xuICAgICAgICAgICAgICAgIHZhciBsZWF2ZV9lYXJseV9zdHIgPSAnJztcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlYXZlX2VhcmxpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgbGVhdmVfZWFybHlfc3RyID0gbGVhdmVfZWFybHlfc3RyICsgXCI8L2JyPjxzcGFuPjxsYWJlbCBzdHlsZT0nbWFyZ2luLWxlZnQ6MTBweDtmb250LXNpemU6IDE2cHg7Y29sb3I6IGJsYWNrOyc+5aeT5ZCNOlwiICsgbGVhdmVfZWFybGllc1tpXS5uYW1lICsgXCI8L2xhYmVsPlwiICtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwiPGxhYmVsIHN0eWxlPSdtYXJnaW4tbGVmdDozMHB4O2ZvbnQtc2l6ZTogMTZweDtjb2xvcjogYmxhY2s7Jz7nlLXor506XCIgKyBsZWF2ZV9lYXJsaWVzW2ldLnRlbGVwaG9uZSArIFwiPC9sYWJlbD48L3NwYW4+XCI7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICQoJyNsZWF2ZV9lYXJseScpLmFwcGVuZChsZWF2ZV9lYXJseV9zdHIpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBtYXJrZXI7IGkgPCBkYXRhLnN0b3JlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpY29uID0gXCIvc3RhdGljL2ltYWdlcy9kYWlseXN0YXRlbWVudC9ibHVlLmdpZlwiO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcG9zaXRpb24gPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb24ucHVzaChkYXRhLnN0b3JlW2ldWydsbmcnXSk7XG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uLnB1c2goZGF0YS5zdG9yZVtpXVsnbGF0J10pO1xuICAgICAgICAgICAgICAgICAgICAvLyB1bnN1cHBsZWRfaW5mby5wdXNoKGxvY2F0aW9uKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIG1hcmtlciA9IG5ldyBBTWFwLk1hcmtlcih7XG4gICAgICAgICAgICAgICAgICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb246IGljb24sXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogcG9zaXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXQ6IG5ldyBBTWFwLlBpeGVsKC0xMiwgLTM2KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4dERhdGE6IHsnaWQnOiBkYXRhLnN0b3JlW2ldWydzdG9yZV9pZCddfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgbWFya2VyX21hcFtkYXRhLnN0b3JlW2ldWydzdG9yZV9pZCddXSA9IG1hcmtlcjtcbiAgICAgICAgICAgICAgICAgICAgLy8gdmFyIHN0ciA9IFwi5ZWG5a625ZCN56ewOlwiICsgZGF0YVtpXVsnc3RvcmVfbmFtZSddICsgJzwvYnI+JyArICflnLDlnYA6JyArIGRhdGFbaV1bJ3N0b3JlX2FkZHJlc3MnXTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0ciA9IFwi5a+86LSt5aeT5ZCNOlwiICsgZGF0YS5zdG9yZVtpXVsnbmFtZSddICsgJzwvYnI+JyArICfogZTns7vmlrnlvI86JyArIGRhdGEuc3RvcmVbaV1bJ3RlbGVwaG9uZSddICsgJzwvYnI+JyArICfpl6jlupflkI3np7A6JyArIGRhdGEuc3RvcmVbaV1bJ3N0b3JlX25hbWUnXSsgJzwvYnI+JyArICfpl6jlupflnLDlnYA6JyArIGRhdGEuc3RvcmVbaV1bJ3N0b3JlX2FkZHJlc3MnXTtcbiAgICAgICAgICAgICAgICAgICAgbWFya2VyLmNvbnRlbnQgPSBzdHI7XG4gICAgICAgICAgICAgICAgICAgIC8vIG1hcmtlci5vbignY2xpY2snLCBtYXJrZXJDbGlja1N1cHBsZWQpO1xuICAgICAgICAgICAgICAgICAgICAvLyBtYXJrZXIuZW1pdCgnY2xpY2snLCB7dGFyZ2V0OiBtYXJrZXJ9KTtcbiAgICAgICAgICAgICAgICAgICAgIG1hcmtlci5vbignY2xpY2snLCBtYXJrZXJDbGljayk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEuZGF0YSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gICAsXG4gICAgICAgIC8v6LCD55So5omn6KGM5ZCO6LCD55So55qE5Ye95pWwXG4gICAgICAgIGNvbXBsZXRlOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgLy/or7fmsYLlh7rplJnlpITnkIZcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG1hcmtlcl9tYXApO1xuICAgICAgICB9ICAsXG4gICAgICAgIC8v6LCD55So5Ye66ZSZ5omn6KGM55qE5Ye95pWwXG4gICAgICAgIGVycm9yOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgLy/or7fmsYLlh7rplJnlpITnkIZcbiAgICAgICAgfVxuICAgICB9KTtcblxuICAgIC8vIOW7uueri3NvY2tldOi/nuaOpVxuICAgIHZhciBzb2NrZXQgPSBpby5jb25uZWN0KCcnKTtcbiAgICAvLyDmjqXmlLbmtojmga9cbiAgICBzb2NrZXQub24oJ25ld3MnLCBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAvLyDop6PmnpDkvKDov4fmnaXnmoTlj4LmlbDvvIznhLblkI7liLfmlrDpobVcbiAgICAgICAgdmFyIHJlc3VsdF9kYXRhID0gJC5wYXJzZUpTT04oZGF0YSk7XG4gICAgICAgICQoXCIjbGF0ZV9udW1iZXJcIikuaHRtbChcIui/n+WIsOS6uuaVsDpcIiArIHJlc3VsdF9kYXRhLmxhdGVfY291bnQpO1xuICAgICAgICAkKFwiI2xhdGVfcGVyY2VudFwiKS5odG1sKFwi6L+f5Yiw546HOjpcIiArIHJlc3VsdF9kYXRhLmxhdGVfcGVyY2VudCArICclJyk7XG4gICAgICAgICQoXCIjbGVhdmVfZWFybHlfbnVtYmVyXCIpLmh0bWwoXCLml6npgIDkurrmlbA6XCIgKyByZXN1bHRfZGF0YS5sZWF2ZV9lYXJseV9jb3VudCk7XG4gICAgICAgICQoXCIjbGVhdmVfZWFybHlfcGVyY2VudFwiKS5odG1sKFwi5pep6YCA546HOlwiICsgcmVzdWx0X2RhdGEubGVhdmVfZWFybHlfcGVyY2VudCArICclJyk7XG4gICAgICAgIHZhciBsZWF2ZV9lYXJsaWVzID0gcmVzdWx0X2RhdGEubGVhdmVfZWFybGllcztcbiAgICAgICAgdmFyIGxhdGVzID0gcmVzdWx0X2RhdGEubGF0ZXM7XG4gICAgICAgIHZhciBsYXRlX3N0ciA9ICcnO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhdGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsYXRlX3N0ciA9IGxhdGVfc3RyICsgXCI8L2JyPjxzcGFuPjxsYWJlbCBzdHlsZT0nbWFyZ2luLWxlZnQ6MTBweDtmb250LXNpemU6IDE2cHg7Y29sb3I6IGJsYWNrOyc+5aeT5ZCNOlwiICsgbGF0ZXNbaV0ubmFtZSArIFwiPC9sYWJlbD5cIiArXG4gICAgICAgICAgICAgICAgXCI8bGFiZWwgc3R5bGU9J21hcmdpbi1sZWZ0OjMwcHg7Zm9udC1zaXplOiAxNnB4O2NvbG9yOiBibGFjazsnPueUteivnTpcIiArIGxhdGVzW2ldLnRlbGVwaG9uZSArIFwiPC9sYWJlbD48L3NwYW4+XCI7XG4gICAgICAgIH1cbiAgICAgICAgJCgnI2xhdGUnKS5lbXB0eSgpO1xuICAgICAgICAkKFwiI2xhdGVcIikuaHRtbChcIuacgOaWsOi/n+WIsOWQjeWNlVwiKTtcbiAgICAgICAgJCgnI2xhdGUnKS5hcHBlbmQobGF0ZV9zdHIpO1xuICAgICAgICB2YXIgbGVhdmVfZWFybHlfc3RyID0gJyc7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVhdmVfZWFybGllcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGVhdmVfZWFybHlfc3RyID0gbGVhdmVfZWFybHlfc3RyICsgXCI8L2JyPjxzcGFuPjxsYWJlbCBzdHlsZT0nbWFyZ2luLWxlZnQ6MTBweDtmb250LXNpemU6IDE2cHg7Y29sb3I6IGJsYWNrOyc+5aeT5ZCNOlwiICsgbGVhdmVfZWFybGllc1tpXS5uYW1lICsgXCI8L2xhYmVsPlwiICtcbiAgICAgICAgICAgICAgICBcIjxsYWJlbCBzdHlsZT0nbWFyZ2luLWxlZnQ6MzBweDtmb250LXNpemU6IDE2cHg7Y29sb3I6IGJsYWNrOyc+55S16K+dOlwiICsgbGVhdmVfZWFybGllc1tpXS50ZWxlcGhvbmUgKyBcIjwvbGFiZWw+PC9zcGFuPlwiO1xuICAgICAgICB9XG4gICAgICAgICQoJyNsZWF2ZV9lYXJseScpLmVtcHR5KCk7XG4gICAgICAgICQoXCIjbGVhdmVfZWFybHlcIikuaHRtbChcIuacgOaWsOaXqemAgOWQjeWNlVwiKTtcbiAgICAgICAgJCgnI2xlYXZlX2Vhcmx5JykuYXBwZW5kKGxlYXZlX2Vhcmx5X3N0cik7XG4gICAgICAgIHZhciBtYXJrZXIgPSBtYXJrZXJfbWFwW3Jlc3VsdF9kYXRhWydzdG9yZV9pZCddXTtcbiAgICAgICAgdmFyIGljb24gPSAnJztcbiAgICAgICAgdmFyIGV4Y2VwdCA9IHJlc3VsdF9kYXRhWydleGNlcHQnXTtcbiAgICAgICAgaWYgKGV4Y2VwdD09MCkge1xuICAgICAgICAgICAgaWNvbiA9ICcvc3RhdGljL2ltYWdlcy9kYWlseXN0YXRlbWVudC9ncmVlbi5naWYnO1xuICAgICAgICAgICAgLy8g5LiK54+tXG4gICAgICAgIH0gZWxzZSBpZiAoZXhjZXB0PT0xKXtcbiAgICAgICAgICAgIGljb24gPSAnL3N0YXRpYy9pbWFnZXMvZGFpbHlzdGF0ZW1lbnQvYmx1ZS5naWYnO1xuICAgICAgICAgICAgLy/kuIvnj61cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGljb24gPSAnL3N0YXRpYy9pbWFnZXMvZGFpbHlzdGF0ZW1lbnQvb3JhbmdlLmdpZic7XG4gICAgICAgICAgICAvL+W8guW4uFxuICAgICAgICB9XG4gICAgICAgIC8vIG1hcC5yZW1vdmUobWFya2VyKVxuICAgICAgICB2YXIgaWNvbiA9IG5ldyBBTWFwLkljb24oe1xuICAgICAgICAgICAgICAgIGltYWdlIDogaWNvbi8vMjRweCoyNHB4XG4gICAgICAgICAgICAgICAgLy9pY29u5Y+v57y655yB77yM57y655yB5pe25Li66buY6K6k55qE6JOd6Imy5rC05ru05Zu+5qCH77yMXG4gICAgICAgICAgICAgICAgLy8gc2l6ZSA6IG5ldyBBTWFwLlNpemUoNyw3KVxuICAgICAgICB9KTtcbiAgICAgICAgbWFya2VyLnNldEljb24oaWNvbik7XG4gICAgfSk7XG4gICAgLy8g5Y+R6YCBc29ja2V0IElEIOe7meWQjuerr1xuICAgIHNvY2tldC5vbignY29ubmVjdGlvbicsIGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgICAgIC8vIOino+aekOS8oOi/h+adpeeahOWPguaVsO+8jOeEtuWQjuWIt+aWsOmhtVxuICAgICAgICB2YXIgcmVzdWx0X2RhdGEgPSAnJyArIGRhdGE7XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAvL+aPkOS6pOaVsOaNrueahOexu+WeiyBQT1NUIEdFVFxuICAgICAgICAgICAgdHlwZTpcIlBPU1RcIixcbiAgICAgICAgICAgIC8v5o+Q5Lqk55qE572R5Z2AXG4gICAgICAgICAgICB1cmw6XCIvYXBpL3YxLjAvZGFpbHlzdGF0ZW1lbnQvc29ja2V0XCIsXG4gICAgICAgICAgICAvL+aPkOS6pOeahOaVsOaNrlxuICAgICAgICAgICAgZGF0YTp7J3NvY2tldF9pZCc6cmVzdWx0X2RhdGF9LFxuICAgICAgICAgICAgLy/ov5Tlm57mlbDmja7nmoTmoLzlvI9cbiAgICAgICAgICAgIGRhdGFUeXBlOlwianNvblwiLFxuICAgICAgICAgICAgLy/lnKjor7fmsYLkuYvliY3osIPnlKjnmoTlh73mlbBcbiAgICAgICAgICAgIGJlZm9yZVNlbmQ6ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAvL+ivt+axguWHuumUmeWkhOeQhlxuICAgICAgICAgICAgfSAsXG4gICAgICAgICAgICAvL+aIkOWKn+i/lOWbnuS5i+WQjuiwg+eUqOeahOWHveaVsFxuICAgICAgICAgICAgc3VjY2VzczpmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnb2snKTtcbiAgICAgICAgICAgIH0gICAsXG4gICAgICAgICAgICAvL+iwg+eUqOaJp+ihjOWQjuiwg+eUqOeahOWHveaVsFxuICAgICAgICAgICAgY29tcGxldGU6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgLy/or7fmsYLlh7rplJnlpITnkIZcbiAgICAgICAgICAgIH0gICxcbiAgICAgICAgICAgIC8v6LCD55So5Ye66ZSZ5omn6KGM55qE5Ye95pWwXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAvL+ivt+axguWHuumUmeWkhOeQhlxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICB2YXIgaW5mb1dpbmRvdyA9IG5ldyBBTWFwLkluZm9XaW5kb3coKTtcbiAgICB2YXIgbWFya2VyX21hcCA9IHt9O1xuICAgIC8vIOeCueWHu+eql+S9k+S6i+S7tlxuICAgIGZ1bmN0aW9uIG1hcmtlckNsaWNrKGUpe1xuICAgICAgICBpbmZvV2luZG93LnNldENvbnRlbnQoZS50YXJnZXQuY29udGVudCk7XG4gICAgICAgIGluZm9XaW5kb3cub3BlbihtYXAsIGUudGFyZ2V0LmdldFBvc2l0aW9uKCkpO1xuICAgIH1cbn0pO1xuIl0sImZpbGUiOiJkYWlseXN0YXRlbWVudC9zaG93X2d1aWRlX2NoZWNraW4uanMifQ==
