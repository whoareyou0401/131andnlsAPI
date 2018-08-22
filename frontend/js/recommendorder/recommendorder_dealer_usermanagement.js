$(document).ready(function () {
    
    $('#user_add_button').click(function(){
       modal = $('#user_add_modal')[0];
       $(modal).modal('show'); 
    });

    $('.update').click(function(){
        var passwd_item = $(this).parent().siblings().children('.passwd_dealer');
        var updated_pass = passwd_item.val(); 
        var href = $(this).attr('name') + '&passwd_dealer=' + updated_pass;
        $('#last_confirm_link').attr('name', href); 
        $('#last_confirm_text').html('确定修改？'); 
        modal = $('#last_confirm')[0];
        $(modal).modal('show'); 
    });
    
    $('.delete').click(function(){
        var href = $(this).attr('name');
        $('#last_confirm_link').attr('name', href); 
        $('#last_confirm_text').html('确定删除？'); 
        modal = $('#last_confirm')[0];
        $(modal).modal('show'); 
    });

    $('table').DataTable();
});

function last_confirm_button()
{
    href = $('#last_confirm_link').attr('name');
    self.location.href = href;
}

function user_add_confirm(url)
{
    user_name = $('#user_add_name').val();
    user_add_password = $('#user_add_password').val();
    url = url + '&chinese_name=' + user_name + '&passwd_dealer=' + user_add_password;
    self.location.href=url;
}
