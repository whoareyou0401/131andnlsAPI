$(document).ready(function () {
    setupCSRF();
    $("input[class='audit']").click(function () {
        var this_input = $(this);
        var id = $(this).attr("id");
        var index = layer.confirm('审核通过或删除图片', {
            btn: ['审核通过', '删除图片']
        }, function () {
            $.ajax({
                url: "/recommendorder/item/" + id + "/image",
                type: "post",
                data: {'op': 'audit'},
                success: function (data) {
                    if (data.code === 0) {
                        this_input.remove();
                        layer.close(index)
                    }
                }
            });
        }, function () {
            $.ajax({
                url: "/recommendorder/item/" + id + "/image",
                type: "post",
                data: {'op': 'del'},
                success: function (data) {
                    if (data.code === 0) {
                        this_input.remove();
                        layer.close(index)
                    }
                }
            });
        });
    });
});
