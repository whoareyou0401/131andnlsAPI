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



//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9yZWNvbW1lbmRvcmRlcl93aG9sZXNhbGVfZGVwYXJ0bWVudF9jYXJ0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAkKCcucmVkdWNlJykuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IHBhcnNlSW50KCgkKHRoaXMpLnNpYmxpbmdzKCcuaW5wdXQtdGV4dCcpLnZhbCgpKSk7XG4gICAgICAgIGNvbnNvbGUubG9nKHZhbHVlKTtcbiAgICAgICAgY29uc29sZS5sb2codHlwZW9mIHZhbHVlKTtcbiAgICAgICAgdmFsdWUgLS07XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gMCl7XG4gICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgICQodGhpcykuc2libGluZ3MoJy5pbnB1dC10ZXh0JykudmFsKHZhbHVlKTtcbiAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygnLmlucHV0LXRleHQnKS50cmlnZ2VyKCdvbmNoYW5nZScpO1xuICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCcuaW5wdXQtdGV4dCcpLnRyaWdnZXIoJ29uaW5wdXQnKTtcbiAgICB9KTtcbiAgICAkKCcucGx1cycpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdmFsdWUgPSAkKHRoaXMpLnNpYmxpbmdzKCcuaW5wdXQtdGV4dCcpLnZhbCgpO1xuICAgICAgICB2YWx1ZSArKztcbiAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygnLmlucHV0LXRleHQnKS52YWwodmFsdWUpO1xuICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCcuaW5wdXQtdGV4dCcpLnRyaWdnZXIoJ29uY2hhbmdlJyk7XG4gICAgICAgICQodGhpcykuc2libGluZ3MoJy5pbnB1dC10ZXh0JykudHJpZ2dlcignb25pbnB1dCcpO1xuICAgIH0pO1xufSk7XG5cbiQoZnVuY3Rpb24oKXtcbiAgICB2YXIgbnVtPTA7XG4gICAgJCgnLmljLWFycm93JykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgbnVtKys7XG4gICAgICAgIGNvbnNvbGUubG9nKG51bSk7XG4gICAgICAgIGlmKG51bSUyID09PSAwKXtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKDExMTExKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICdiYWNrZ3JvdW5kJzondXJsKC9zdGF0aWMvaW1hZ2VzL3JlY29tbWVuZG9yZGVyL2ljX2Fycm93X2Rvd24ucG5nKSBuby1yZXBlYXQgY2VudGVyJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coMjIyMjIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuY3NzKHtcbiAgICAgICAgICAgICAgICAnYmFja2dyb3VuZCc6J3VybCgvc3RhdGljL2ltYWdlcy9yZWNvbW1lbmRvcmRlci9pY19hcnJvd191cC5wbmcpIG5vLXJlcGVhdCBjZW50ZXInXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfVxuICAgICAgICBcbiAgICB9KTtcbiAgICBcbn0pO1xuXG5cbiJdLCJmaWxlIjoicmVjb21tZW5kb3JkZXIvcmVjb21tZW5kb3JkZXJfd2hvbGVzYWxlX2RlcGFydG1lbnRfY2FydC5qcyJ9
