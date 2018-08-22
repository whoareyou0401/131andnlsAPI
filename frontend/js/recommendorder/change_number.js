(function(){
    var now_url = window.location.href;
    var customer_id = Number(now_url.match(/(customer\/)\d+\//)[0].split("/")[1]); 
    var old_tel = Number(now_url.split('change-number/')[1]);
    if(old_tel === 0) {
        $('.binding-or-change').text('绑定手机号后,下次登录可使用新手机号登录');
        $('.old-tel-con').hide();    
    }else{       
        $('.binding-or-change').text('更换手机号后,下次登录可使用新手机号登录');
        $('.old-tel-con').show();
        $('.old-tel').text(old_tel);
    }
    $('.top-back-con').on('click',function(){
        window.location.href = '/recommendorder/customer/' + customer_id + '/binding-number';
    });
    $('.tel-input').bind('input propertychange',function() {
        if($('.tel-input').val().length != 0){
            $('#btn').css('background','#ff4a0c');
            if($('.security-code-input').val().length != 0){
                $('.btn-proof').css('background','#ff4a0c');
            }else{
                $('.btn-proof').css('background','#ffc8b6');
            }
        }else{
            $('#btn').css('background','#ffc8b6');
            $('.btn-proof').css('background','#ffc8b6');
        }
    });
    $('.security-code-input').bind('input propertychange',function() {
        if($('.security-code-input').val().length != 0 && $('.tel-input').val().length != 0){
            $('.btn-proof').css('background','#ff4a0c');
        }else{
            $('.btn-proof').css('background','#ffc8b6');
        }
    });   
})();