(function(){
    var now_url = window.location.href;
    var customer_id = Number(now_url.match(/(customer\/)\d+\//)[0].split("/")[1]);
    $.ajax({
        url: "/api/v1.1/recommendorder/userphone",
        type: 'get',
        success: function(data){
            if(data.msg == null){
                tel = 0;
                $('.isbinding').attr('src','/static/images/recommendorder/binding_false.png');
                $('.binding-status').text('您目前还未绑定手机号');
                $('.binding-number-btn').text('绑定手机号');
            }else{
                tel = data.msg;
                $('.isbinding').attr('src','/static/images/recommendorder/binding_true.png');
                $('.binding-status').text('您的手机号' + data.msg);
                $('.binding-number-btn').text('更换手机号');
            }
            $('.binding-number-btn').on('click',function(){
                    window.location.href = '/recommendorder/customer/' + customer_id + '/change-number/' + tel;
            });
        }
    });
    $('.top-back-con').on('click',function() {
        window.location.href = '/recommendorder/customer/' + customer_id + '/setting';
    });
})()