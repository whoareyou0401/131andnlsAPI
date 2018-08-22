$(document).ready(function () {
    $("input[class='approve']").click(function () {
              var index = layer.open({
              type: 2,
              title: "广告审核",
              skin: 'layui-layer-lan', //加上边框
              area: ['80%', '80%'], //宽高
              scrollbar: false,
              content: '/approve_ad?item='+$(this).attr("id"),
              end:function(){
                window.location.reload();
              }

            });
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjb21tZXJjaWFsL2FwcHJvdmFsLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAkKFwiaW5wdXRbY2xhc3M9J2FwcHJvdmUnXVwiKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgIHZhciBpbmRleCA9IGxheWVyLm9wZW4oe1xuICAgICAgICAgICAgICB0eXBlOiAyLFxuICAgICAgICAgICAgICB0aXRsZTogXCLlub/lkYrlrqHmoLhcIixcbiAgICAgICAgICAgICAgc2tpbjogJ2xheXVpLWxheWVyLWxhbicsIC8v5Yqg5LiK6L655qGGXG4gICAgICAgICAgICAgIGFyZWE6IFsnODAlJywgJzgwJSddLCAvL+WuvemrmFxuICAgICAgICAgICAgICBzY3JvbGxiYXI6IGZhbHNlLFxuICAgICAgICAgICAgICBjb250ZW50OiAnL2FwcHJvdmVfYWQ/aXRlbT0nKyQodGhpcykuYXR0cihcImlkXCIpLFxuICAgICAgICAgICAgICBlbmQ6ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgfSk7XG4gICAgfSk7XG59KTtcbiJdLCJmaWxlIjoiY29tbWVyY2lhbC9hcHByb3ZhbC5qcyJ9
