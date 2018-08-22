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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9pdGVtX2F1ZGl0LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICBzZXR1cENTUkYoKTtcbiAgICAkKFwiaW5wdXRbY2xhc3M9J2F1ZGl0J11cIikuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdGhpc19pbnB1dCA9ICQodGhpcyk7XG4gICAgICAgIHZhciBpZCA9ICQodGhpcykuYXR0cihcImlkXCIpO1xuICAgICAgICB2YXIgaW5kZXggPSBsYXllci5jb25maXJtKCflrqHmoLjpgJrov4fmiJbliKDpmaTlm77niYcnLCB7XG4gICAgICAgICAgICBidG46IFsn5a6h5qC46YCa6L+HJywgJ+WIoOmZpOWbvueJhyddXG4gICAgICAgIH0sIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiBcIi9yZWNvbW1lbmRvcmRlci9pdGVtL1wiICsgaWQgKyBcIi9pbWFnZVwiLFxuICAgICAgICAgICAgICAgIHR5cGU6IFwicG9zdFwiLFxuICAgICAgICAgICAgICAgIGRhdGE6IHsnb3AnOiAnYXVkaXQnfSxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5jb2RlID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzX2lucHV0LnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGF5ZXIuY2xvc2UoaW5kZXgpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB1cmw6IFwiL3JlY29tbWVuZG9yZGVyL2l0ZW0vXCIgKyBpZCArIFwiL2ltYWdlXCIsXG4gICAgICAgICAgICAgICAgdHlwZTogXCJwb3N0XCIsXG4gICAgICAgICAgICAgICAgZGF0YTogeydvcCc6ICdkZWwnfSxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5jb2RlID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzX2lucHV0LnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgbGF5ZXIuY2xvc2UoaW5kZXgpXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTtcbiJdLCJmaWxlIjoicmVjb21tZW5kb3JkZXIvaXRlbV9hdWRpdC5qcyJ9
