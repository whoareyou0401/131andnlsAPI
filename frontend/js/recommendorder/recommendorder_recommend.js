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
