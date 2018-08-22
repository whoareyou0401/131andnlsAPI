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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjb21tZXJjaWFsL2xheWVyX3Bob3Rvcy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGxheWVyX3Bob3RvcyA9ICQoXCJkaXZbY2xhc3M9J2xheWVyX3Bob3RvcyddXCIpO1xuICAgIGxheWVyX3Bob3Rvcy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgbGF5ZXIucGhvdG9zKHtcbiAgICAgICAgICAgIHBob3RvczogJyMnICsgJCh0aGlzKS5hdHRyKFwiaWRcIiksXG4gICAgICAgICAgICBzaGFkZTogWzAuM10sXG4gICAgICAgICAgICBhbmltOiAwIC8vMC0255qE6YCJ5oup77yM5oyH5a6a5by55Ye65Zu+54mH5Yqo55S757G75Z6L77yM6buY6K6k6ZqP5py677yI6K+35rOo5oSP77yMMy4w5LmL5YmN55qE54mI5pys55Soc2hpZnTlj4LmlbDvvIlcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTtcbiJdLCJmaWxlIjoiY29tbWVyY2lhbC9sYXllcl9waG90b3MuanMifQ==
