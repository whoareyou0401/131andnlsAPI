$(document).ready(function () {
    $('.reduce').click(function() {
        var value = parseInt(($(this).siblings('.input-text').val()));
        console.log(value);
        console.log(typeof value);
        value --;
        if (value === 0){
          return 0;
        }
        
        $(this).siblings('.input-text').val(value);
        $(this).siblings('.input-text').trigger('onchange');
        $(this).siblings('.input-text').trigger('oninput');
    });
    $('.plus').click(function() {
        var value = $(this).siblings('.input-text').val();
        value ++;
        $(this).siblings('.input-text').val(value);
        $(this).siblings('.input-text').trigger('onchange');
        $(this).siblings('.input-text').trigger('oninput');
    });
});

$(function(){
    var num=0;
    $('.ic-arrow').click(function(){
        num++;
        console.log(num);
        if(num%2 === 0){
            console.log(11111);
                            $(this).css({
                    'background':'url(/static/images/recommendorder/ic_arrow_down.png) no-repeat center'
                });
            }else{
                console.log(22222);
                            $(this).css({
                'background':'url(/static/images/recommendorder/ic_arrow_up.png) no-repeat center'
            });

            }
        
    });
    
});


