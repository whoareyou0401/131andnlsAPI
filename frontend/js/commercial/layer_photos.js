$(document).ready(function () {
    var layer_photos = $("div[class='layer_photos']");
    layer_photos.each(function () {
        layer.photos({
            photos: '#' + $(this).attr("id"),
            shade: [0.3],
            anim: 0 //0-6的选择，指定弹出图片动画类型，默认随机（请注意，3.0之前的版本用shift参数）
        });
    });
});
