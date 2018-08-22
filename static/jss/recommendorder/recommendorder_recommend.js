$(document).ready(function () {
    $('.subtract').click(function() {
        var value = $(this).siblings('.text').val();
        if (value === 0){
          return;
        }
        value --;
        $(this).siblings('.text').val(value);
        $(this).siblings('.text').trigger('onchange');
        $(this).siblings('.text').trigger('oninput');
    });
    $('.add').click(function() {
        var value = $(this).siblings('.text').val();
        value ++;
        $(this).siblings('.text').val(value);
        $(this).siblings('.text').trigger('onchange');
        $(this).siblings('.text').trigger('oninput');
    });

    $('.add-items').click(function() {
        var href = "?source=" + $(this).attr('name') + "&orders=";
        $('.text').each(function(){
                var name = $(this).attr('name');
                var num = $(this).val();
                href = href + name + ',' + num + '|';
                }
        );
        $(this).attr('href', $(this).attr('href') + href);
    });


    $(window).bind('beforeunload', function(){
        orders = get_orders_only();
        $.ajax({
        url: "/recommendorder/recommendorder-save-basket?orders=" + orders,
        type: "GET",
        });
    });

    $(window).bind('unload', function(){
        orders = get_orders_only();
        $.ajax({
        url: "/recommendorder/recommendorder-save-basket?orders=" + orders,
        type: "GET",
        });
    });
    //setInterval('save_basket();', 5000);
});

function save_basket()
{
    orders = get_orders_only();
    $.ajax({
    url: "/recommendorder/recommendorder-save-basket?orders=" + orders,
    type: "GET",
    });
}
function get_orders_only()
{
    href = "";
    $('.selectitem').each(function()
        {
           ordered_item = $(this).parent().siblings().children('nobr').children('.text');
           var name = ordered_item.attr('name');
           var num = ordered_item.val();
           var stock = $(this).parent().siblings().children('font').attr('name');
           href = href + name + ',' + num + '|';
        }
    ); 
    return href;
}
function get_orders(href)
{
    var less = '';
    $('.selectitem').each(function()
        {
           if (this.checked === true)
           {
               ordered_item = $(this).parent().siblings().children('nobr').children('.text');
               var name = ordered_item.attr('name');
               var num = ordered_item.val();
               var stock = $(this).parent().siblings().children('font').attr('name');
               if (parseFloat(num) > parseFloat(stock))
               {
                   item_name = $(this).parent().siblings().children('nobr').attr('name'); 
                   less = less + item_name + ',';
               }  
               href = href + name + ',' + num + '|';
           } 
        }
    ); 
    if (less === '')
    {
      self.location.href=href;
    }
    else
    {
       less = '您购买的商品(' + less.slice(0, -1)  + ')库存不足，请参考剩余库存修改购买数量！';
       $('#less').html(less);
       $('.ui.basic.modal').modal('show');
    }
}

function change_all_box()
{
    var value = $('.all.select')[0].checked;
    $('.selectitem').each(function()
        {
            this.checked = value;
        }
    );
    change_total_price();
}

function change_total_price()
{
    var total_price = 0.00;
    $('.selectitem').each(function()
        {
           if (this.checked === true)
           {
               ordered_item = $(this).parent().siblings().children('nobr').children('.text');
               var num = ordered_item.val();
               var price = $(this).parent().siblings('.price').attr('value');
               total_price = total_price + num * price;
           } 
        }
    ); 
    total_price = parseFloat(total_price);
    total_price = total_price.toFixed(2);
    $('#total-price').val(total_price);
    save_basket();
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9yZWNvbW1lbmRvcmRlcl9yZWNvbW1lbmQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgICQoJy5zdWJ0cmFjdCcpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdmFsdWUgPSAkKHRoaXMpLnNpYmxpbmdzKCcudGV4dCcpLnZhbCgpO1xuICAgICAgICBpZiAodmFsdWUgPT09IDApe1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YWx1ZSAtLTtcbiAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygnLnRleHQnKS52YWwodmFsdWUpO1xuICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCcudGV4dCcpLnRyaWdnZXIoJ29uY2hhbmdlJyk7XG4gICAgICAgICQodGhpcykuc2libGluZ3MoJy50ZXh0JykudHJpZ2dlcignb25pbnB1dCcpO1xuICAgIH0pO1xuICAgICQoJy5hZGQnKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gJCh0aGlzKS5zaWJsaW5ncygnLnRleHQnKS52YWwoKTtcbiAgICAgICAgdmFsdWUgKys7XG4gICAgICAgICQodGhpcykuc2libGluZ3MoJy50ZXh0JykudmFsKHZhbHVlKTtcbiAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygnLnRleHQnKS50cmlnZ2VyKCdvbmNoYW5nZScpO1xuICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCcudGV4dCcpLnRyaWdnZXIoJ29uaW5wdXQnKTtcbiAgICB9KTtcblxuICAgICQoJy5hZGQtaXRlbXMnKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGhyZWYgPSBcIj9zb3VyY2U9XCIgKyAkKHRoaXMpLmF0dHIoJ25hbWUnKSArIFwiJm9yZGVycz1cIjtcbiAgICAgICAgJCgnLnRleHQnKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdmFyIG5hbWUgPSAkKHRoaXMpLmF0dHIoJ25hbWUnKTtcbiAgICAgICAgICAgICAgICB2YXIgbnVtID0gJCh0aGlzKS52YWwoKTtcbiAgICAgICAgICAgICAgICBocmVmID0gaHJlZiArIG5hbWUgKyAnLCcgKyBudW0gKyAnfCc7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgICAgICAkKHRoaXMpLmF0dHIoJ2hyZWYnLCAkKHRoaXMpLmF0dHIoJ2hyZWYnKSArIGhyZWYpO1xuICAgIH0pO1xuXG5cbiAgICAkKHdpbmRvdykuYmluZCgnYmVmb3JldW5sb2FkJywgZnVuY3Rpb24oKXtcbiAgICAgICAgb3JkZXJzID0gZ2V0X29yZGVyc19vbmx5KCk7XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgIHVybDogXCIvcmVjb21tZW5kb3JkZXIvcmVjb21tZW5kb3JkZXItc2F2ZS1iYXNrZXQ/b3JkZXJzPVwiICsgb3JkZXJzLFxuICAgICAgICB0eXBlOiBcIkdFVFwiLFxuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgICQod2luZG93KS5iaW5kKCd1bmxvYWQnLCBmdW5jdGlvbigpe1xuICAgICAgICBvcmRlcnMgPSBnZXRfb3JkZXJzX29ubHkoKTtcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiBcIi9yZWNvbW1lbmRvcmRlci9yZWNvbW1lbmRvcmRlci1zYXZlLWJhc2tldD9vcmRlcnM9XCIgKyBvcmRlcnMsXG4gICAgICAgIHR5cGU6IFwiR0VUXCIsXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIC8vc2V0SW50ZXJ2YWwoJ3NhdmVfYmFza2V0KCk7JywgNTAwMCk7XG59KTtcblxuZnVuY3Rpb24gc2F2ZV9iYXNrZXQoKVxue1xuICAgIG9yZGVycyA9IGdldF9vcmRlcnNfb25seSgpO1xuICAgICQuYWpheCh7XG4gICAgdXJsOiBcIi9yZWNvbW1lbmRvcmRlci9yZWNvbW1lbmRvcmRlci1zYXZlLWJhc2tldD9vcmRlcnM9XCIgKyBvcmRlcnMsXG4gICAgdHlwZTogXCJHRVRcIixcbiAgICB9KTtcbn1cbmZ1bmN0aW9uIGdldF9vcmRlcnNfb25seSgpXG57XG4gICAgaHJlZiA9IFwiXCI7XG4gICAgJCgnLnNlbGVjdGl0ZW0nKS5lYWNoKGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICBvcmRlcmVkX2l0ZW0gPSAkKHRoaXMpLnBhcmVudCgpLnNpYmxpbmdzKCkuY2hpbGRyZW4oJ25vYnInKS5jaGlsZHJlbignLnRleHQnKTtcbiAgICAgICAgICAgdmFyIG5hbWUgPSBvcmRlcmVkX2l0ZW0uYXR0cignbmFtZScpO1xuICAgICAgICAgICB2YXIgbnVtID0gb3JkZXJlZF9pdGVtLnZhbCgpO1xuICAgICAgICAgICB2YXIgc3RvY2sgPSAkKHRoaXMpLnBhcmVudCgpLnNpYmxpbmdzKCkuY2hpbGRyZW4oJ2ZvbnQnKS5hdHRyKCduYW1lJyk7XG4gICAgICAgICAgIGhyZWYgPSBocmVmICsgbmFtZSArICcsJyArIG51bSArICd8JztcbiAgICAgICAgfVxuICAgICk7IFxuICAgIHJldHVybiBocmVmO1xufVxuZnVuY3Rpb24gZ2V0X29yZGVycyhocmVmKVxue1xuICAgIHZhciBsZXNzID0gJyc7XG4gICAgJCgnLnNlbGVjdGl0ZW0nKS5lYWNoKGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICBpZiAodGhpcy5jaGVja2VkID09PSB0cnVlKVxuICAgICAgICAgICB7XG4gICAgICAgICAgICAgICBvcmRlcmVkX2l0ZW0gPSAkKHRoaXMpLnBhcmVudCgpLnNpYmxpbmdzKCkuY2hpbGRyZW4oJ25vYnInKS5jaGlsZHJlbignLnRleHQnKTtcbiAgICAgICAgICAgICAgIHZhciBuYW1lID0gb3JkZXJlZF9pdGVtLmF0dHIoJ25hbWUnKTtcbiAgICAgICAgICAgICAgIHZhciBudW0gPSBvcmRlcmVkX2l0ZW0udmFsKCk7XG4gICAgICAgICAgICAgICB2YXIgc3RvY2sgPSAkKHRoaXMpLnBhcmVudCgpLnNpYmxpbmdzKCkuY2hpbGRyZW4oJ2ZvbnQnKS5hdHRyKCduYW1lJyk7XG4gICAgICAgICAgICAgICBpZiAocGFyc2VGbG9hdChudW0pID4gcGFyc2VGbG9hdChzdG9jaykpXG4gICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgaXRlbV9uYW1lID0gJCh0aGlzKS5wYXJlbnQoKS5zaWJsaW5ncygpLmNoaWxkcmVuKCdub2JyJykuYXR0cignbmFtZScpOyBcbiAgICAgICAgICAgICAgICAgICBsZXNzID0gbGVzcyArIGl0ZW1fbmFtZSArICcsJztcbiAgICAgICAgICAgICAgIH0gIFxuICAgICAgICAgICAgICAgaHJlZiA9IGhyZWYgKyBuYW1lICsgJywnICsgbnVtICsgJ3wnO1xuICAgICAgICAgICB9IFxuICAgICAgICB9XG4gICAgKTsgXG4gICAgaWYgKGxlc3MgPT09ICcnKVxuICAgIHtcbiAgICAgIHNlbGYubG9jYXRpb24uaHJlZj1ocmVmO1xuICAgIH1cbiAgICBlbHNlXG4gICAge1xuICAgICAgIGxlc3MgPSAn5oKo6LSt5Lmw55qE5ZWG5ZOBKCcgKyBsZXNzLnNsaWNlKDAsIC0xKSAgKyAnKeW6k+WtmOS4jei2s++8jOivt+WPguiAg+WJqeS9meW6k+WtmOS/ruaUuei0reS5sOaVsOmHj++8gSc7XG4gICAgICAgJCgnI2xlc3MnKS5odG1sKGxlc3MpO1xuICAgICAgICQoJy51aS5iYXNpYy5tb2RhbCcpLm1vZGFsKCdzaG93Jyk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBjaGFuZ2VfYWxsX2JveCgpXG57XG4gICAgdmFyIHZhbHVlID0gJCgnLmFsbC5zZWxlY3QnKVswXS5jaGVja2VkO1xuICAgICQoJy5zZWxlY3RpdGVtJykuZWFjaChmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tlZCA9IHZhbHVlO1xuICAgICAgICB9XG4gICAgKTtcbiAgICBjaGFuZ2VfdG90YWxfcHJpY2UoKTtcbn1cblxuZnVuY3Rpb24gY2hhbmdlX3RvdGFsX3ByaWNlKClcbntcbiAgICB2YXIgdG90YWxfcHJpY2UgPSAwLjAwO1xuICAgICQoJy5zZWxlY3RpdGVtJykuZWFjaChmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgaWYgKHRoaXMuY2hlY2tlZCA9PT0gdHJ1ZSlcbiAgICAgICAgICAge1xuICAgICAgICAgICAgICAgb3JkZXJlZF9pdGVtID0gJCh0aGlzKS5wYXJlbnQoKS5zaWJsaW5ncygpLmNoaWxkcmVuKCdub2JyJykuY2hpbGRyZW4oJy50ZXh0Jyk7XG4gICAgICAgICAgICAgICB2YXIgbnVtID0gb3JkZXJlZF9pdGVtLnZhbCgpO1xuICAgICAgICAgICAgICAgdmFyIHByaWNlID0gJCh0aGlzKS5wYXJlbnQoKS5zaWJsaW5ncygnLnByaWNlJykuYXR0cigndmFsdWUnKTtcbiAgICAgICAgICAgICAgIHRvdGFsX3ByaWNlID0gdG90YWxfcHJpY2UgKyBudW0gKiBwcmljZTtcbiAgICAgICAgICAgfSBcbiAgICAgICAgfVxuICAgICk7IFxuICAgIHRvdGFsX3ByaWNlID0gcGFyc2VGbG9hdCh0b3RhbF9wcmljZSk7XG4gICAgdG90YWxfcHJpY2UgPSB0b3RhbF9wcmljZS50b0ZpeGVkKDIpO1xuICAgICQoJyN0b3RhbC1wcmljZScpLnZhbCh0b3RhbF9wcmljZSk7XG4gICAgc2F2ZV9iYXNrZXQoKTtcbn1cbiJdLCJmaWxlIjoicmVjb21tZW5kb3JkZXIvcmVjb21tZW5kb3JkZXJfcmVjb21tZW5kLmpzIn0=
