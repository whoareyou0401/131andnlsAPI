(function() {
    var nowhref=window.location.href;
    console.log(nowhref);
    var nowhref1=nowhref.split('?')[1];
    var nowhref_arr=nowhref1.split('|');
    $('#address').val(chineseFromUtf8Url(nowhref_arr[0]));
    $('#store_name').val(chineseFromUtf8Url(nowhref_arr[1]));
    $('#tel').val(chineseFromUtf8Url(nowhref_arr[2]));
    $('#tel_people').val(chineseFromUtf8Url(nowhref_arr[3]));
    $('#ps').val(chineseFromUtf8Url(nowhref_arr[4]));
    // var code = chineseFromUtf8Url(nowhref_arr[5]);
    $('.opt_sure').on('click',function() {
        //    新增门店
        $.ajax({
            //提交数据的类型 POST GET
            type:"POST",
            //提交的网址
            url:"/api/v1.2/recommendorder/store",
            //提交的数据
            data:{
                "contact_phone": $('#tel').val(),
                "contact_name": $('#tel_people').val(),
                "address":$('#address').val(),
                "name":$('#store_name').val(),
                'csrfmiddlewaretoken': getCookie("csrftoken"),
                "remarks":$('#ps').val(),
                // "code":code,
                'lat':0,
                'lng':0
            },
            //返回数据的格式
            dataType:"json",
            //成功返回之后调用的函数
            success:function(data){
                if (data.code === 0) {
                    $('.is-tel').text('新增成功');
                    $('.tel-model').show();   
                    $('.sure').off('click').on('click',function() {
                        $('.tel-model').hide();
                        window.location.href='/recommendorder/salesman/inspection';
                    });
                } else {
                    $('.is-tel').text('新增失败');
                    $('.tel-model').show();   
                    $('.sure').off('click').on('click',function() {
                        $('.tel-model').hide();
                    });    
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
        window.location.href='/recommendorder/new-store';
    });
})();