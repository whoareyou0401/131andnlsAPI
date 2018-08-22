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