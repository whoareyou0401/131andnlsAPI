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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9yZWNvbW1lbmRvcmRlcl9kZWFsZXJfcmVjb21tZW5kX2RldGFpbC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgJCgnLnN1YnRyYWN0JykuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9ICQodGhpcykuc2libGluZ3MoJy50ZXh0JykudmFsKCk7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gMCl7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhbHVlIC0tO1xuICAgICAgICAkKHRoaXMpLnNpYmxpbmdzKCcudGV4dCcpLnZhbCh2YWx1ZSk7XG4gICAgfSk7XG4gICAgJCgnLmFkZCcpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdmFsdWUgPSAkKHRoaXMpLnNpYmxpbmdzKCcudGV4dCcpLnZhbCgpO1xuICAgICAgICB2YWx1ZSArKztcbiAgICAgICAgJCh0aGlzKS5zaWJsaW5ncygnLnRleHQnKS52YWwodmFsdWUpO1xuICAgIH0pO1xuXG4gICAgJCgnLmFkZC1pdGVtcycpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgaHJlZiA9IFwiJnNvdXJjZT1cIiArICQodGhpcykuYXR0cignbmFtZScpICsgXCImb3JkZXJzPVwiO1xuICAgICAgICAkKCcudGV4dCcpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB2YXIgbmFtZSA9ICQodGhpcykuYXR0cignbmFtZScpO1xuICAgICAgICAgICAgICAgIHZhciBudW0gPSAkKHRoaXMpLnZhbCgpO1xuICAgICAgICAgICAgICAgIGhyZWYgPSBocmVmICsgbmFtZSArICcsJyArIG51bSArICd8JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgICAgICQodGhpcykuYXR0cignaHJlZicsICQodGhpcykuYXR0cignaHJlZicpICsgaHJlZik7XG4gICAgfSk7XG5cbiAgICAkKCcudWkuYnV0dG9uLmJsdWUnKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICBzZWxmLmxvY2F0aW9uLmhyZWYgPSAgc2VsZi5sb2NhdGlvbi5ocmVmICsgXCImc3RhdHVzPeW3suWuoeaguFwiO1xuICAgIH0pO1xufSk7XG5cbmZ1bmN0aW9uIGdldF9vcmRlcnMoaHJlZilcbntcbiAgICAkKCcuc2VsZWN0aXRlbScpLmVhY2goZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgIGlmICh0aGlzLmNoZWNrZWQgPT09IHRydWUpXG4gICAgICAgICAgIHtcbiAgICAgICAgICAgICAgIG9yZGVyZWRfaXRlbSA9ICQodGhpcykucGFyZW50KCkuc2libGluZ3MoKS5jaGlsZHJlbignLnRleHQnKTtcbiAgICAgICAgICAgICAgIHZhciBuYW1lID0gb3JkZXJlZF9pdGVtLmF0dHIoJ25hbWUnKTtcbiAgICAgICAgICAgICAgIHZhciBudW0gPSBvcmRlcmVkX2l0ZW0udmFsKCk7XG4gICAgICAgICAgICAgICBocmVmID0gaHJlZiArIG5hbWUgKyAnLCcgKyBudW0gKyAnfCc7XG4gICAgICAgICAgIH0gXG4gICAgICAgIH1cbiAgICApOyBcbiAgICBzZWxmLmxvY2F0aW9uLmhyZWY9aHJlZjtcbn1cblxuZnVuY3Rpb24gY2hhbmdlX2FsbF9ib3goKVxue1xuICAgIHZhciB2YWx1ZSA9ICQoJy5hbGwuc2VsZWN0JylbMF0uY2hlY2tlZDtcbiAgICAkKCcuc2VsZWN0aXRlbScpLmVhY2goZnVuY3Rpb24oKVxuICAgICAgICB7XG4gICAgICAgICAgICB0aGlzLmNoZWNrZWQgPSB2YWx1ZTtcbiAgICAgICAgfVxuICAgICk7XG59XG4iXSwiZmlsZSI6InJlY29tbWVuZG9yZGVyL3JlY29tbWVuZG9yZGVyX2RlYWxlcl9yZWNvbW1lbmRfZGV0YWlsLmpzIn0=
