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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9yZWNvbW1lbmRvcmRlcl9hZGRpdGVtcy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgJCgnLnN1YnRyYWN0JykuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9ICQodGhpcykuc2libGluZ3MoJy50ZXh0JykudmFsKCk7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gMCl7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhbHVlIC0tO1xuICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCcudGV4dCcpLnZhbCh2YWx1ZSk7XG4gICAgICAgICQodGhpcykuc2libGluZ3MoJy50ZXh0JykudHJpZ2dlcignb25jaGFuZ2UnKTtcbiAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygnLnRleHQnKS50cmlnZ2VyKCdvbmlucHV0Jyk7XG4gICAgfSk7XG4gICAgJCgnLmFkZCcpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdmFsdWUgPSAkKHRoaXMpLnNpYmxpbmdzKCcudGV4dCcpLnZhbCgpO1xuICAgICAgICB2YWx1ZSArKztcbiAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygnLnRleHQnKS52YWwodmFsdWUpO1xuICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCcudGV4dCcpLnRyaWdnZXIoJ29uY2hhbmdlJyk7XG4gICAgICAgICQodGhpcykuc2libGluZ3MoJy50ZXh0JykudHJpZ2dlcignb25pbnB1dCcpO1xuICAgIH0pO1xuICAgIFxuICAgIC8qXG4gICAgJCh3aW5kb3cpLmJpbmQoJ2JlZm9yZXVubG9hZCcsIGZ1bmN0aW9uKCl7XG4gICAgICAgIG9yZGVycyA9ICQoJyNvcmRlcnMnKS5hdHRyKCduYW1lJyk7XG4gICAgICAgIG9yZGVycyA9IGdldF9vcmRlcnNfaHJlZihcIiZvcmRlcnM9XCIsIG9yZGVycyk7XG4gICAgICAgICQuYWpheCh7XG4gICAgICAgIHVybDogXCIvcmVjb21tZW5kb3JkZXIvcmVjb21tZW5kb3JkZXItc2F2ZS1iYXNrZXQ/XCIgKyBvcmRlcnMuc2xpY2UoMSksXG4gICAgICAgIHR5cGU6IFwiR0VUXCIsXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIFxuICAgICQod2luZG93KS5iaW5kKCd1bmxvYWQnLCBmdW5jdGlvbigpe1xuICAgICAgICBvcmRlcnMgPSAkKCcjb3JkZXJzJykuYXR0cignbmFtZScpO1xuICAgICAgICBvcmRlcnMgPSBnZXRfb3JkZXJzX2hyZWYoXCImb3JkZXJzPVwiLCBvcmRlcnMpO1xuICAgICAgICAkLmFqYXgoe1xuICAgICAgICB1cmw6IFwiL3JlY29tbWVuZG9yZGVyL3JlY29tbWVuZG9yZGVyLXNhdmUtYmFza2V0P1wiICsgb3JkZXJzLnNsaWNlKDEpLFxuICAgICAgICB0eXBlOiBcIkdFVFwiLFxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICBcbiAgICBzZXRJbnRlcnZhbCgnc2F2ZV9iYXNrZXQoKTsnLCA1MDAwKTtcbiAgICAqL1xufSk7XG5cbmZ1bmN0aW9uIHNhdmVfYmFza2V0KClcbntcbiAgICBvcmRlcnNfYXR0ciA9ICQoJyNvcmRlcnMnKS5hdHRyKCduYW1lJyk7XG4gICAgb3JkZXJzID0gZ2V0X29yZGVyc19ocmVmX29ubHkob3JkZXJzX2F0dHIpO1xuICAgICQuYWpheCh7XG4gICAgdXJsOiBcIi9yZWNvbW1lbmRvcmRlci9yZWNvbW1lbmRvcmRlci1zYXZlLWJhc2tldD9cIiArIG9yZGVycy5zbGljZSgxKSxcbiAgICB0eXBlOiBcIkdFVFwiLFxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBnZXRfb3JkZXJzX2hyZWZfb25seShvcmRlcnNfYXR0cilcbntcbiAgICBocmVmX29yZGVycyA9IFwiJm9yZGVycz1cIjtcbiAgICBvcmRlcnNfZGljdCA9IFtdO1xuICAgICQoJy50ZXh0JykuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyIG5hbWUgPSAkKHRoaXMpLmF0dHIoJ25hbWUnKTtcbiAgICAgICAgICAgIHZhciBudW0gPSAkKHRoaXMpLnZhbCgpO1xuICAgICAgICAgICAgaWYgKG51bSE9PScwJyl7XG4gICAgICAgICAgICAgICAgb3JkZXJzX2RpY3RbbmFtZV0gPSBudW07XG4gICAgICAgICAgICAgICAgaHJlZl9vcmRlcnMgPSBocmVmX29yZGVycyArIG5hbWUgKyAnLCcgKyBudW0gKyAnfCc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICApO1xuICAgIGlmIChvcmRlcnNfYXR0ciA9PT0gdW5kZWZpbmVkKVxuICAgIHtcbiAgICAgICAgb3JkZXJzX2F0dHIgPSAnJztcbiAgICB9XG4gICAgb3JkZXJzX2xpc3QgPSBvcmRlcnNfYXR0ci5zcGxpdChcInxcIikuc2xpY2UoMCwtMSk7IFxuICAgIGZvciAodmFyIGluZGV4IGluIG9yZGVyc19saXN0KXtcbiAgICAgICAgb3JkZXJfb25lID0gb3JkZXJzX2xpc3RbaW5kZXhdLnNwbGl0KCcsJyk7XG4gICAgICAgIG9yZGVyX25hbWUgPSBvcmRlcl9vbmVbMF07XG4gICAgICAgIG9yZGVyX251bSA9IG9yZGVyX29uZVsxXTtcbiAgICAgICAgaWYgKG9yZGVyc19kaWN0W29yZGVyX25hbWVdID09PSB1bmRlZmluZWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGhyZWZfb3JkZXJzID0gaHJlZl9vcmRlcnMgKyBvcmRlcl9uYW1lICsgJywnICsgb3JkZXJfbnVtICsgJ3wnO1xuICAgICAgICB9XG5cbiAgICB9XG4gICAgcmV0dXJuIGhyZWZfb3JkZXJzO1xuXG59XG5mdW5jdGlvbiBnZXRfb3JkZXJzX2hyZWYoaHJlZixvcmRlcnMpXG57XG4gICAgaHJlZiA9IGhyZWYgKyBcIiZvcmRlcnM9XCI7XG4gICAgb3JkZXJzX2RpY3QgPSBbXTtcbiAgICAkKCcudGV4dCcpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciBuYW1lID0gJCh0aGlzKS5hdHRyKCduYW1lJyk7XG4gICAgICAgICAgICB2YXIgbnVtID0gJCh0aGlzKS52YWwoKTtcbiAgICAgICAgICAgIGlmIChudW0hPT0nMCcpe1xuICAgICAgICAgICAgICAgIG9yZGVyc19kaWN0W25hbWVdID0gbnVtO1xuICAgICAgICAgICAgICAgIGhyZWYgPSBocmVmICsgbmFtZSArICcsJyArIG51bSArICd8JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICk7XG4gICAgb3JkZXJzX2xpc3QgPSBvcmRlcnMucmVwbGFjZSgnJm9yZGVycz0nLCcnKS5zcGxpdChcInxcIikuc2xpY2UoMCwtMSk7IFxuICAgIGZvciAodmFyIGluZGV4IGluIG9yZGVyc19saXN0KXtcbiAgICAgICAgb3JkZXJfb25lID0gb3JkZXJzX2xpc3RbaW5kZXhdLnNwbGl0KCcsJyk7XG4gICAgICAgIG9yZGVyX25hbWUgPSBvcmRlcl9vbmVbMF07XG4gICAgICAgIG9yZGVyX251bSA9IG9yZGVyX29uZVsxXTtcbiAgICAgICAgaWYgKG9yZGVyc19kaWN0W29yZGVyX25hbWVdID09PSB1bmRlZmluZWQpXG4gICAgICAgIHtcbiAgICAgICAgICAgIGhyZWYgPSBocmVmICsgb3JkZXJfbmFtZSArICcsJyArIG9yZGVyX251bSArICd8JztcbiAgICAgICAgfVxuXG4gICAgfVxuICAgIGNvbnNvbGUubG9nKCchISEhITInKTtcbiAgICBjb25zb2xlLmxvZyhocmVmKTtcbiAgICByZXR1cm4gaHJlZjtcblxufVxuICAgICAgICBcbmZ1bmN0aW9uIGNoYW5nZV9jYXRlZ29yeShocmVmLG9yZGVycyl7XG4gICAgaHJlZiA9IGdldF9vcmRlcnNfaHJlZihocmVmLCBvcmRlcnMpO1xuICAgIGNhdF9uYW1lID0gJCgnLnVpLmRyb3Bkb3duJykudmFsKCk7XG4gICAgaHJlZj1ocmVmICsgXCImY2F0X25hbWU9XCIrY2F0X25hbWU7XG4gICAgc2VsZi5sb2NhdGlvbi5ocmVmPWhyZWY7XG59XG5cbmZ1bmN0aW9uIHF1ZXJ5KGhyZWYsb3JkZXJzKVxue1xuICAgIGhyZWYgPSBnZXRfb3JkZXJzX2hyZWYoaHJlZiwgb3JkZXJzKTtcbiAgICBxdWVyeV90ZXh0ID0gJCgnLnF1ZXJ5LXRleHQnKS52YWwoKTtcbiAgICBocmVmPWhyZWYgKyBcIiZxdWVyeT1cIitxdWVyeV90ZXh0O1xuICAgIGdhKCdzZW5kJywge1xuICAgICAgICBoaXRUeXBlOiAnZXZlbnQnLCBcbiAgICAgICAgZXZlbnRDYXRlZ29yeTogJ2FkZGl0ZW1zJyxcbiAgICAgICAgZXZlbnRBY3Rpb246ICdxdWVyeScsXG4gICAgICAgIGV2ZW50TGFiZWw6IHF1ZXJ5X3RleHR9KTtcbiAgICBzZWxmLmxvY2F0aW9uLmhyZWY9aHJlZjtcbn1cblxuZnVuY3Rpb24gYWRkX292ZXIoaHJlZixvcmRlcnMpXG57XG4gICAgaHJlZiA9IGdldF9vcmRlcnNfaHJlZihocmVmLCBvcmRlcnMpO1xuICAgIHNlbGYubG9jYXRpb24uaHJlZj1ocmVmO1xufVxuIl0sImZpbGUiOiJyZWNvbW1lbmRvcmRlci9yZWNvbW1lbmRvcmRlcl9hZGRpdGVtcy5qcyJ9
