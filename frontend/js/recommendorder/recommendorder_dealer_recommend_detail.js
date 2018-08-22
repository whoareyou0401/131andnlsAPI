$(document).ready(function () {
    $('.subtract').click(function() {
        var value = $(this).siblings('.text').val();
        if (value === 0){
          return;
        }
        value --;
        $(this).siblings('.text').val(value);
    });
    $('.add').click(function() {
        var value = $(this).siblings('.text').val();
        value ++;
        $(this).siblings('.text').val(value);
    });

    $('.add-items').click(function() {
        var href = "&source=" + $(this).attr('name') + "&orders=";
        $('.text').each(function(){
                var name = $(this).attr('name');
                var num = $(this).val();
                href = href + name + ',' + num + '|';
                }
        );
        $(this).attr('href', $(this).attr('href') + href);
    });

    $('.ui.button.blue').click(function(){
        self.location.href =  self.location.href + "&status=已审核";
    });
});

function get_orders(href)
{
    $('.selectitem').each(function()
        {
           if (this.checked === true)
           {
               ordered_item = $(this).parent().siblings().children('.text');
               var name = ordered_item.attr('name');
               var num = ordered_item.val();
               href = href + name + ',' + num + '|';
           } 
        }
    ); 
    self.location.href=href;
}

function change_all_box()
{
    var value = $('.all.select')[0].checked;
    $('.selectitem').each(function()
        {
            this.checked = value;
        }
    );
}
