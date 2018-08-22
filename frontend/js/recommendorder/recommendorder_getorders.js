function submit_orders()
{
    $('.ui.basic.modal').modal('show');
}

function confirm_orders(href)
{
    $('.text').each(function()
        {
               var name = $(this).attr('name');
               var num = $(this).attr('value');
               href = href + name + ',' + num + '|';
        }
    ); 
    self.location.href=href;
}
