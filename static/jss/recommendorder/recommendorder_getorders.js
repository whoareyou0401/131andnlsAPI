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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9yZWNvbW1lbmRvcmRlcl9nZXRvcmRlcnMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gc3VibWl0X29yZGVycygpXG57XG4gICAgJCgnLnVpLmJhc2ljLm1vZGFsJykubW9kYWwoJ3Nob3cnKTtcbn1cblxuZnVuY3Rpb24gY29uZmlybV9vcmRlcnMoaHJlZilcbntcbiAgICAkKCcudGV4dCcpLmVhY2goZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICAgICB2YXIgbmFtZSA9ICQodGhpcykuYXR0cignbmFtZScpO1xuICAgICAgICAgICAgICAgdmFyIG51bSA9ICQodGhpcykuYXR0cigndmFsdWUnKTtcbiAgICAgICAgICAgICAgIGhyZWYgPSBocmVmICsgbmFtZSArICcsJyArIG51bSArICd8JztcbiAgICAgICAgfVxuICAgICk7IFxuICAgIHNlbGYubG9jYXRpb24uaHJlZj1ocmVmO1xufVxuIl0sImZpbGUiOiJyZWNvbW1lbmRvcmRlci9yZWNvbW1lbmRvcmRlcl9nZXRvcmRlcnMuanMifQ==
