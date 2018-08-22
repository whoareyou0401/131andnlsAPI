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
