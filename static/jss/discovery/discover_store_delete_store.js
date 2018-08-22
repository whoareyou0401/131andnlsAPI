(function() {
    var nowhref=window.location.href;
    console.log(nowhref);
    var nowhref1=nowhref.split('?')[1];
    var nowhref_arr=nowhref1.split('|');
    console.log(nowhref_arr);
    $('#address').val(chineseFromUtf8Url(nowhref_arr[0]));
    $('#store_name').val(chineseFromUtf8Url(nowhref_arr[1]));
    $('#ps').val(chineseFromUtf8Url(nowhref_arr[2]));
    $('.opt_sure').on('click',function() {
          //删除门店
        $.ajax({
            //提交数据的类型 POST GET
            type:"DELETE",
            //提交的网址
            url:"/recommendorder/api/v1/store",
            //提交的数据
            data:{
                "address":$('#address').val(),
                "name":$('#store_name').val(),
                'csrfmiddlewaretoken': '{{ csrf_token  }}',
                "remarks":$('#ps').val()
            },
            //返回数据的格式
            dataType:"json",
            //成功返回之后调用的函数
            success:function(data){
                if (data.code === 0) {
                  alert("删除成功");
                  window.location.href='/recommendorder/inspection';
                } else {
                  alert("删除失败");
                  console.log(data);
                }
            },
            //调用出错执行的函数
            error: function(){
                //请求出错处理
                alert('error');
            }
        });
    });
    $('.opt_cancel').on('click',function() {
      window.location.href='/recommendorder/delete-store';
    });
  })();

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJkaXNjb3ZlcnkvZGlzY292ZXJfc3RvcmVfZGVsZXRlX3N0b3JlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpIHtcbiAgICB2YXIgbm93aHJlZj13aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgICBjb25zb2xlLmxvZyhub3docmVmKTtcbiAgICB2YXIgbm93aHJlZjE9bm93aHJlZi5zcGxpdCgnPycpWzFdO1xuICAgIHZhciBub3docmVmX2Fycj1ub3docmVmMS5zcGxpdCgnfCcpO1xuICAgIGNvbnNvbGUubG9nKG5vd2hyZWZfYXJyKTtcbiAgICAkKCcjYWRkcmVzcycpLnZhbChjaGluZXNlRnJvbVV0ZjhVcmwobm93aHJlZl9hcnJbMF0pKTtcbiAgICAkKCcjc3RvcmVfbmFtZScpLnZhbChjaGluZXNlRnJvbVV0ZjhVcmwobm93aHJlZl9hcnJbMV0pKTtcbiAgICAkKCcjcHMnKS52YWwoY2hpbmVzZUZyb21VdGY4VXJsKG5vd2hyZWZfYXJyWzJdKSk7XG4gICAgJCgnLm9wdF9zdXJlJykub24oJ2NsaWNrJyxmdW5jdGlvbigpIHtcbiAgICAgICAgICAvL+WIoOmZpOmXqOW6l1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgLy/mj5DkuqTmlbDmja7nmoTnsbvlnosgUE9TVCBHRVRcbiAgICAgICAgICAgIHR5cGU6XCJERUxFVEVcIixcbiAgICAgICAgICAgIC8v5o+Q5Lqk55qE572R5Z2AXG4gICAgICAgICAgICB1cmw6XCIvcmVjb21tZW5kb3JkZXIvYXBpL3YxL3N0b3JlXCIsXG4gICAgICAgICAgICAvL+aPkOS6pOeahOaVsOaNrlxuICAgICAgICAgICAgZGF0YTp7XG4gICAgICAgICAgICAgICAgXCJhZGRyZXNzXCI6JCgnI2FkZHJlc3MnKS52YWwoKSxcbiAgICAgICAgICAgICAgICBcIm5hbWVcIjokKCcjc3RvcmVfbmFtZScpLnZhbCgpLFxuICAgICAgICAgICAgICAgICdjc3JmbWlkZGxld2FyZXRva2VuJzogJ3t7IGNzcmZfdG9rZW4gIH19JyxcbiAgICAgICAgICAgICAgICBcInJlbWFya3NcIjokKCcjcHMnKS52YWwoKVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8v6L+U5Zue5pWw5o2u55qE5qC85byPXG4gICAgICAgICAgICBkYXRhVHlwZTpcImpzb25cIixcbiAgICAgICAgICAgIC8v5oiQ5Yqf6L+U5Zue5LmL5ZCO6LCD55So55qE5Ye95pWwXG4gICAgICAgICAgICBzdWNjZXNzOmZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgIGlmIChkYXRhLmNvZGUgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgIGFsZXJ0KFwi5Yig6Zmk5oiQ5YqfXCIpO1xuICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWY9Jy9yZWNvbW1lbmRvcmRlci9pbnNwZWN0aW9uJztcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgYWxlcnQoXCLliKDpmaTlpLHotKVcIik7XG4gICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLy/osIPnlKjlh7rplJnmiafooYznmoTlh73mlbBcbiAgICAgICAgICAgIGVycm9yOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIC8v6K+35rGC5Ye66ZSZ5aSE55CGXG4gICAgICAgICAgICAgICAgYWxlcnQoJ2Vycm9yJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgICQoJy5vcHRfY2FuY2VsJykub24oJ2NsaWNrJyxmdW5jdGlvbigpIHtcbiAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmPScvcmVjb21tZW5kb3JkZXIvZGVsZXRlLXN0b3JlJztcbiAgICB9KTtcbiAgfSkoKTtcbiJdLCJmaWxlIjoiZGlzY292ZXJ5L2Rpc2NvdmVyX3N0b3JlX2RlbGV0ZV9zdG9yZS5qcyJ9
