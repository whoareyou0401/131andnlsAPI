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
    
    /*
    $(window).bind('beforeunload', function(){
        orders = $('#orders').attr('name');
        orders = get_orders_href("&orders=", orders);
        $.ajax({
        url: "/recommendorder/recommendorder-save-basket?" + orders.slice(1),
        type: "GET",
        });
    });
    
    $(window).bind('unload', function(){
        orders = $('#orders').attr('name');
        orders = get_orders_href("&orders=", orders);
        $.ajax({
        url: "/recommendorder/recommendorder-save-basket?" + orders.slice(1),
        type: "GET",
        });
    });
    
    setInterval('save_basket();', 5000);
    */
});

function save_basket()
{
    orders_attr = $('#orders').attr('name');
    orders = get_orders_href_only(orders_attr);
    $.ajax({
    url: "/recommendorder/recommendorder-save-basket?" + orders.slice(1),
    type: "GET",
    });
}

function get_orders_href_only(orders_attr)
{
    href_orders = "&orders=";
    orders_dict = [];
    $('.text').each(function(){
            var name = $(this).attr('name');
            var num = $(this).val();
            if (num!=='0'){
                orders_dict[name] = num;
                href_orders = href_orders + name + ',' + num + '|';
            }
        }
    );
    if (orders_attr === undefined)
    {
        orders_attr = '';
    }
    orders_list = orders_attr.split("|").slice(0,-1); 
    for (var index in orders_list){
        order_one = orders_list[index].split(',');
        order_name = order_one[0];
        order_num = order_one[1];
        if (orders_dict[order_name] === undefined)
        {
            href_orders = href_orders + order_name + ',' + order_num + '|';
        }

    }
    return href_orders;

}
function get_orders_href(href,orders)
{
    href = href + "&orders=";
    orders_dict = [];
    $('.text').each(function(){
            var name = $(this).attr('name');
            var num = $(this).val();
            if (num!=='0'){
                orders_dict[name] = num;
                href = href + name + ',' + num + '|';
            }
        }
    );
    orders_list = orders.replace('&orders=','').split("|").slice(0,-1); 
    for (var index in orders_list){
        order_one = orders_list[index].split(',');
        order_name = order_one[0];
        order_num = order_one[1];
        if (orders_dict[order_name] === undefined)
        {
            href = href + order_name + ',' + order_num + '|';
        }

    }
    console.log('!!!!!2');
    console.log(href);
    return href;

}
        
function change_category(href,orders){
    href = get_orders_href(href, orders);
    cat_name = $('.ui.dropdown').val();
    href=href + "&cat_name="+cat_name;
    self.location.href=href;
}

function query(href,orders)
{
    href = get_orders_href(href, orders);
    query_text = $('.query-text').val();
    href=href + "&query="+query_text;
    ga('send', {
        hitType: 'event', 
        eventCategory: 'additems',
        eventAction: 'query',
        eventLabel: query_text});
    self.location.href=href;
}

function add_over(href,orders)
{
    href = get_orders_href(href, orders);
    self.location.href=href;
}
