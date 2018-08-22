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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9yZWNvbW1lbmRvcmRlcl9kZWFsZXJfdXNlcm1hbmFnZW1lbnQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgIFxuICAgICQoJyN1c2VyX2FkZF9idXR0b24nKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgIG1vZGFsID0gJCgnI3VzZXJfYWRkX21vZGFsJylbMF07XG4gICAgICAgJChtb2RhbCkubW9kYWwoJ3Nob3cnKTsgXG4gICAgfSk7XG5cbiAgICAkKCcudXBkYXRlJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIHBhc3N3ZF9pdGVtID0gJCh0aGlzKS5wYXJlbnQoKS5zaWJsaW5ncygpLmNoaWxkcmVuKCcucGFzc3dkX2RlYWxlcicpO1xuICAgICAgICB2YXIgdXBkYXRlZF9wYXNzID0gcGFzc3dkX2l0ZW0udmFsKCk7IFxuICAgICAgICB2YXIgaHJlZiA9ICQodGhpcykuYXR0cignbmFtZScpICsgJyZwYXNzd2RfZGVhbGVyPScgKyB1cGRhdGVkX3Bhc3M7XG4gICAgICAgICQoJyNsYXN0X2NvbmZpcm1fbGluaycpLmF0dHIoJ25hbWUnLCBocmVmKTsgXG4gICAgICAgICQoJyNsYXN0X2NvbmZpcm1fdGV4dCcpLmh0bWwoJ+ehruWumuS/ruaUue+8nycpOyBcbiAgICAgICAgbW9kYWwgPSAkKCcjbGFzdF9jb25maXJtJylbMF07XG4gICAgICAgICQobW9kYWwpLm1vZGFsKCdzaG93Jyk7IFxuICAgIH0pO1xuICAgIFxuICAgICQoJy5kZWxldGUnKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICB2YXIgaHJlZiA9ICQodGhpcykuYXR0cignbmFtZScpO1xuICAgICAgICAkKCcjbGFzdF9jb25maXJtX2xpbmsnKS5hdHRyKCduYW1lJywgaHJlZik7IFxuICAgICAgICAkKCcjbGFzdF9jb25maXJtX3RleHQnKS5odG1sKCfnoa7lrprliKDpmaTvvJ8nKTsgXG4gICAgICAgIG1vZGFsID0gJCgnI2xhc3RfY29uZmlybScpWzBdO1xuICAgICAgICAkKG1vZGFsKS5tb2RhbCgnc2hvdycpOyBcbiAgICB9KTtcblxuICAgICQoJ3RhYmxlJykuRGF0YVRhYmxlKCk7XG59KTtcblxuZnVuY3Rpb24gbGFzdF9jb25maXJtX2J1dHRvbigpXG57XG4gICAgaHJlZiA9ICQoJyNsYXN0X2NvbmZpcm1fbGluaycpLmF0dHIoJ25hbWUnKTtcbiAgICBzZWxmLmxvY2F0aW9uLmhyZWYgPSBocmVmO1xufVxuXG5mdW5jdGlvbiB1c2VyX2FkZF9jb25maXJtKHVybClcbntcbiAgICB1c2VyX25hbWUgPSAkKCcjdXNlcl9hZGRfbmFtZScpLnZhbCgpO1xuICAgIHVzZXJfYWRkX3Bhc3N3b3JkID0gJCgnI3VzZXJfYWRkX3Bhc3N3b3JkJykudmFsKCk7XG4gICAgdXJsID0gdXJsICsgJyZjaGluZXNlX25hbWU9JyArIHVzZXJfbmFtZSArICcmcGFzc3dkX2RlYWxlcj0nICsgdXNlcl9hZGRfcGFzc3dvcmQ7XG4gICAgc2VsZi5sb2NhdGlvbi5ocmVmPXVybDtcbn1cbiJdLCJmaWxlIjoicmVjb21tZW5kb3JkZXIvcmVjb21tZW5kb3JkZXJfZGVhbGVyX3VzZXJtYW5hZ2VtZW50LmpzIn0=
