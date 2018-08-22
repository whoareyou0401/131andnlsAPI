$(document).ready(function() {
    $("input[class='upload']").click(function () {
        var index = layer.open({
            type: 2,
            title: "广告链接文件",
            skin: 'layui-layer-lan', //加上边框
            area: ['80%', '80%'], //宽高
            scrollbar: false,
            content: '/stores-ads/upload-file?item='+$(this).attr("id"),
            success: function(){
                // 判断文件后缀
                $('#file').on('change', function () {
                    // C:\fakepath\ (This is added for security reasons)
                    var upload_file = $(this).val().replace(/C:\\fakepath\\/i, '');
                    var point = upload_file.lastIndexOf('.');
                    var postfix = upload_file.substring(point,upload_file.length);
                    if (postfix != '.xlsx' && postfix != '.xls') {
                        alert('文件格式不正确，只支持"xlsx"或"xls"格式');
                        return false;
                    }
                });

                // 判断表单是否为空
                $('form').bind('submit', function() {
                    var judge = 0;
                    $('#file').each(function() {
                        if ($(this).val() === '' || $(this).val() === null || $(this).val() === undefined) {
                            judge ++;
                            $(this).css('border','1px solid red');
                        }else{
                            $(this).css('border','');
                        }
                    });

                    if ($('.visible').length <= 0) {
                        judge ++;
                        $('.search').css('border','1px solid red');
                    }else{
                        $(this).css('border','');
                    }

                    if (judge >= 1) {
                        console.log(judge);
                        alert('提交失败，请将信息填写完整');
                        return false;
                    }else{
                        alert('提交成功');
                    }
                });
            },
            end:function(){
                window.location.reload();
            },
        });
    });
});