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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9jaGFuZ2VfbnVtYmVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe1xuICAgIHZhciBub3dfdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gICAgdmFyIGN1c3RvbWVyX2lkID0gTnVtYmVyKG5vd191cmwubWF0Y2goLyhjdXN0b21lclxcLylcXGQrXFwvLylbMF0uc3BsaXQoXCIvXCIpWzFdKTsgXG4gICAgdmFyIG9sZF90ZWwgPSBOdW1iZXIobm93X3VybC5zcGxpdCgnY2hhbmdlLW51bWJlci8nKVsxXSk7XG4gICAgaWYob2xkX3RlbCA9PT0gMCkge1xuICAgICAgICAkKCcuYmluZGluZy1vci1jaGFuZ2UnKS50ZXh0KCfnu5HlrprmiYvmnLrlj7flkI4s5LiL5qyh55m75b2V5Y+v5L2/55So5paw5omL5py65Y+355m75b2VJyk7XG4gICAgICAgICQoJy5vbGQtdGVsLWNvbicpLmhpZGUoKTsgICAgXG4gICAgfWVsc2V7ICAgICAgIFxuICAgICAgICAkKCcuYmluZGluZy1vci1jaGFuZ2UnKS50ZXh0KCfmm7TmjaLmiYvmnLrlj7flkI4s5LiL5qyh55m75b2V5Y+v5L2/55So5paw5omL5py65Y+355m75b2VJyk7XG4gICAgICAgICQoJy5vbGQtdGVsLWNvbicpLnNob3coKTtcbiAgICAgICAgJCgnLm9sZC10ZWwnKS50ZXh0KG9sZF90ZWwpO1xuICAgIH1cbiAgICAkKCcudG9wLWJhY2stY29uJykub24oJ2NsaWNrJyxmdW5jdGlvbigpe1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9ICcvcmVjb21tZW5kb3JkZXIvY3VzdG9tZXIvJyArIGN1c3RvbWVyX2lkICsgJy9iaW5kaW5nLW51bWJlcic7XG4gICAgfSk7XG4gICAgJCgnLnRlbC1pbnB1dCcpLmJpbmQoJ2lucHV0IHByb3BlcnR5Y2hhbmdlJyxmdW5jdGlvbigpIHtcbiAgICAgICAgaWYoJCgnLnRlbC1pbnB1dCcpLnZhbCgpLmxlbmd0aCAhPSAwKXtcbiAgICAgICAgICAgICQoJyNidG4nKS5jc3MoJ2JhY2tncm91bmQnLCcjZmY0YTBjJyk7XG4gICAgICAgICAgICBpZigkKCcuc2VjdXJpdHktY29kZS1pbnB1dCcpLnZhbCgpLmxlbmd0aCAhPSAwKXtcbiAgICAgICAgICAgICAgICAkKCcuYnRuLXByb29mJykuY3NzKCdiYWNrZ3JvdW5kJywnI2ZmNGEwYycpO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgJCgnLmJ0bi1wcm9vZicpLmNzcygnYmFja2dyb3VuZCcsJyNmZmM4YjYnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAkKCcjYnRuJykuY3NzKCdiYWNrZ3JvdW5kJywnI2ZmYzhiNicpO1xuICAgICAgICAgICAgJCgnLmJ0bi1wcm9vZicpLmNzcygnYmFja2dyb3VuZCcsJyNmZmM4YjYnKTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgICQoJy5zZWN1cml0eS1jb2RlLWlucHV0JykuYmluZCgnaW5wdXQgcHJvcGVydHljaGFuZ2UnLGZ1bmN0aW9uKCkge1xuICAgICAgICBpZigkKCcuc2VjdXJpdHktY29kZS1pbnB1dCcpLnZhbCgpLmxlbmd0aCAhPSAwICYmICQoJy50ZWwtaW5wdXQnKS52YWwoKS5sZW5ndGggIT0gMCl7XG4gICAgICAgICAgICAkKCcuYnRuLXByb29mJykuY3NzKCdiYWNrZ3JvdW5kJywnI2ZmNGEwYycpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICQoJy5idG4tcHJvb2YnKS5jc3MoJ2JhY2tncm91bmQnLCcjZmZjOGI2Jyk7XG4gICAgICAgIH1cbiAgICB9KTsgICBcbn0pKCk7Il0sImZpbGUiOiJyZWNvbW1lbmRvcmRlci9jaGFuZ2VfbnVtYmVyLmpzIn0=
