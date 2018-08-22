$(document).ready(function () {
    function removeCollectionFun() {
        $('#check_all input').click(function () {
            if ($(this).is(':checked')) {
                $('td>input').show().attr('checked', 'checked');
                if ($('td>input').not(':checked').length > 0) {
                    $('td>input').not(':checked').each(function() {
                        $(this).prop('checked', true);
                    });
                }
            }else {
                $('td>input').hide();
            }
        });

        $('td>input').click(function() {
            if ($(this).not(':checked')) {
                $('#check_all input').prop('checked', false);
            }
            if ($('td>input').not(':checked').length <= 0) {
                $('#check_all input').prop('checked', true);
            }
        });

        $('#delete').click(function() {
            if ($('td>input').not(':checked').length > 0) {
                if(confirm("确定删除吗？")){
                    $('td>input:checked').parent().parent('tr').remove();
                }
            }
        });

        $('td>img').click(function() {
            if(confirm("确定删除吗？")){
                $(this).parent().parent('tr').remove();
            }
        });
    }
    removeCollectionFun();
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhbmFseXRpY3MvY29sbGVjdGlvbl9saXN0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICBmdW5jdGlvbiByZW1vdmVDb2xsZWN0aW9uRnVuKCkge1xuICAgICAgICAkKCcjY2hlY2tfYWxsIGlucHV0JykuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKCQodGhpcykuaXMoJzpjaGVja2VkJykpIHtcbiAgICAgICAgICAgICAgICAkKCd0ZD5pbnB1dCcpLnNob3coKS5hdHRyKCdjaGVja2VkJywgJ2NoZWNrZWQnKTtcbiAgICAgICAgICAgICAgICBpZiAoJCgndGQ+aW5wdXQnKS5ub3QoJzpjaGVja2VkJykubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAkKCd0ZD5pbnB1dCcpLm5vdCgnOmNoZWNrZWQnKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5wcm9wKCdjaGVja2VkJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICAkKCd0ZD5pbnB1dCcpLmhpZGUoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCgndGQ+aW5wdXQnKS5jbGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmICgkKHRoaXMpLm5vdCgnOmNoZWNrZWQnKSkge1xuICAgICAgICAgICAgICAgICQoJyNjaGVja19hbGwgaW5wdXQnKS5wcm9wKCdjaGVja2VkJywgZmFsc2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKCQoJ3RkPmlucHV0Jykubm90KCc6Y2hlY2tlZCcpLmxlbmd0aCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgJCgnI2NoZWNrX2FsbCBpbnB1dCcpLnByb3AoJ2NoZWNrZWQnLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCgnI2RlbGV0ZScpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKCQoJ3RkPmlucHV0Jykubm90KCc6Y2hlY2tlZCcpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBpZihjb25maXJtKFwi56Gu5a6a5Yig6Zmk5ZCX77yfXCIpKXtcbiAgICAgICAgICAgICAgICAgICAgJCgndGQ+aW5wdXQ6Y2hlY2tlZCcpLnBhcmVudCgpLnBhcmVudCgndHInKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoJ3RkPmltZycpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYoY29uZmlybShcIuehruWumuWIoOmZpOWQl++8n1wiKSl7XG4gICAgICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5wYXJlbnQoJ3RyJykucmVtb3ZlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICByZW1vdmVDb2xsZWN0aW9uRnVuKCk7XG59KTsiXSwiZmlsZSI6ImFuYWx5dGljcy9jb2xsZWN0aW9uX2xpc3QuanMifQ==
