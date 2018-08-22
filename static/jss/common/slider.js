$(document).ready(function () {
    $('.triangles-left').on('mousedown', function(event) {
        var currentTri = $(this);
        var oriTop = parseInt($(this).position().top);
        var ev = event || window.event;
        var space = ev.pageY - oriTop;
        var topHeight = $(this).siblings('div.top');
        var middleHeight = $(this).siblings('div.middle');
        var leftHeight = $(topHeight).height() + $(middleHeight).height();
        var htmlNum = parseInt($(topHeight).html()) + parseInt($(middleHeight).html());

        $(document).on('mousemove', function(event) {
            var ev = event || window.event;
            var moveDistance = event.pageY - space;
            if (moveDistance % 2 === 0) {
                moveDistance += 2;

                if (moveDistance >= leftHeight - 2) {
                    moveDistance = leftHeight - 2;
                }else if (moveDistance <= 2) {
                    moveDistance = 2;
                }

                if ($(middleHeight).height() <= 15) {
                    $(middleHeight).css('color', '#ff5422');
                }else {
                    $(middleHeight).css('color', '#fff');
                }

                var changeValue = leftHeight - moveDistance;
                $(currentTri).css('top', moveDistance);
                $(topHeight).height(moveDistance).html(parseInt($(topHeight).height() / 2) + '%');
                $(middleHeight).height(changeValue).html(htmlNum - parseInt($(topHeight).html()) + '%');
            }
        });
        $(document).on('mouseup', function () {
            $(document).on('mousedown').unbind();
        });
    });

    $('.triangles-right').on('mousedown', function(event){
        var currentTri = $(this);
        var oriTop = parseInt($(this).position().top);
        var ev = event || window.event;
        var space = ev.pageY - oriTop;
        var topHeight = $(this).siblings('div.top');
        var middleHeight = $(this).siblings('div.middle');
        var bottomHeight = $(this).siblings('div.bottom');
        var totalHeight = $('.show-line').height();
        var rightHeight = totalHeight - $(topHeight).height();
        var htmlNum = parseInt($(middleHeight).html()) + parseInt($(bottomHeight).html());
        $(document).on('mousemove', function(event) {
            var ev = event || window.event;
            var moveDistance = event.pageY - space;
            if (moveDistance % 2 === 0) {
                moveDistance += 2;

                if (moveDistance >= totalHeight - 2) {
                    moveDistance = totalHeight - 2;
                }else if (moveDistance <= topHeight.height() + 2) {
                    moveDistance = topHeight.height() + 2;
                }

                if ($(bottomHeight).height() <= 10) {
                    $(bottomHeight).css('color', '#9160ff');
                }else {
                    $(bottomHeight).css('color', '#fff');
                }

                if ($(middleHeight).height() <= 10) {
                    $(middleHeight).css('color', '#ff5422');
                }else {
                    $(middleHeight).css('color', '#fff');
                }

                var changeValue = rightHeight - moveDistance + $(topHeight).height();
                $(currentTri).css('top', moveDistance);
                $(middleHeight).height(moveDistance-$(topHeight).height()).html(parseInt($(middleHeight).height() / 2) + '%');
                $(bottomHeight).height(changeValue).html(htmlNum - parseInt($(middleHeight).html()) + '%');
            }
        });
        $(document).on('mouseup', function () {
            $(document).on('mousedown').unbind();
        });
    });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjb21tb24vc2xpZGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAkKCcudHJpYW5nbGVzLWxlZnQnKS5vbignbW91c2Vkb3duJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdmFyIGN1cnJlbnRUcmkgPSAkKHRoaXMpO1xuICAgICAgICB2YXIgb3JpVG9wID0gcGFyc2VJbnQoJCh0aGlzKS5wb3NpdGlvbigpLnRvcCk7XG4gICAgICAgIHZhciBldiA9IGV2ZW50IHx8IHdpbmRvdy5ldmVudDtcbiAgICAgICAgdmFyIHNwYWNlID0gZXYucGFnZVkgLSBvcmlUb3A7XG4gICAgICAgIHZhciB0b3BIZWlnaHQgPSAkKHRoaXMpLnNpYmxpbmdzKCdkaXYudG9wJyk7XG4gICAgICAgIHZhciBtaWRkbGVIZWlnaHQgPSAkKHRoaXMpLnNpYmxpbmdzKCdkaXYubWlkZGxlJyk7XG4gICAgICAgIHZhciBsZWZ0SGVpZ2h0ID0gJCh0b3BIZWlnaHQpLmhlaWdodCgpICsgJChtaWRkbGVIZWlnaHQpLmhlaWdodCgpO1xuICAgICAgICB2YXIgaHRtbE51bSA9IHBhcnNlSW50KCQodG9wSGVpZ2h0KS5odG1sKCkpICsgcGFyc2VJbnQoJChtaWRkbGVIZWlnaHQpLmh0bWwoKSk7XG5cbiAgICAgICAgJChkb2N1bWVudCkub24oJ21vdXNlbW92ZScsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICB2YXIgZXYgPSBldmVudCB8fCB3aW5kb3cuZXZlbnQ7XG4gICAgICAgICAgICB2YXIgbW92ZURpc3RhbmNlID0gZXZlbnQucGFnZVkgLSBzcGFjZTtcbiAgICAgICAgICAgIGlmIChtb3ZlRGlzdGFuY2UgJSAyID09PSAwKSB7XG4gICAgICAgICAgICAgICAgbW92ZURpc3RhbmNlICs9IDI7XG5cbiAgICAgICAgICAgICAgICBpZiAobW92ZURpc3RhbmNlID49IGxlZnRIZWlnaHQgLSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vdmVEaXN0YW5jZSA9IGxlZnRIZWlnaHQgLSAyO1xuICAgICAgICAgICAgICAgIH1lbHNlIGlmIChtb3ZlRGlzdGFuY2UgPD0gMikge1xuICAgICAgICAgICAgICAgICAgICBtb3ZlRGlzdGFuY2UgPSAyO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGlmICgkKG1pZGRsZUhlaWdodCkuaGVpZ2h0KCkgPD0gMTUpIHtcbiAgICAgICAgICAgICAgICAgICAgJChtaWRkbGVIZWlnaHQpLmNzcygnY29sb3InLCAnI2ZmNTQyMicpO1xuICAgICAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgJChtaWRkbGVIZWlnaHQpLmNzcygnY29sb3InLCAnI2ZmZicpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciBjaGFuZ2VWYWx1ZSA9IGxlZnRIZWlnaHQgLSBtb3ZlRGlzdGFuY2U7XG4gICAgICAgICAgICAgICAgJChjdXJyZW50VHJpKS5jc3MoJ3RvcCcsIG1vdmVEaXN0YW5jZSk7XG4gICAgICAgICAgICAgICAgJCh0b3BIZWlnaHQpLmhlaWdodChtb3ZlRGlzdGFuY2UpLmh0bWwocGFyc2VJbnQoJCh0b3BIZWlnaHQpLmhlaWdodCgpIC8gMikgKyAnJScpO1xuICAgICAgICAgICAgICAgICQobWlkZGxlSGVpZ2h0KS5oZWlnaHQoY2hhbmdlVmFsdWUpLmh0bWwoaHRtbE51bSAtIHBhcnNlSW50KCQodG9wSGVpZ2h0KS5odG1sKCkpICsgJyUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdtb3VzZXVwJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJChkb2N1bWVudCkub24oJ21vdXNlZG93bicpLnVuYmluZCgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgICQoJy50cmlhbmdsZXMtcmlnaHQnKS5vbignbW91c2Vkb3duJywgZnVuY3Rpb24oZXZlbnQpe1xuICAgICAgICB2YXIgY3VycmVudFRyaSA9ICQodGhpcyk7XG4gICAgICAgIHZhciBvcmlUb3AgPSBwYXJzZUludCgkKHRoaXMpLnBvc2l0aW9uKCkudG9wKTtcbiAgICAgICAgdmFyIGV2ID0gZXZlbnQgfHwgd2luZG93LmV2ZW50O1xuICAgICAgICB2YXIgc3BhY2UgPSBldi5wYWdlWSAtIG9yaVRvcDtcbiAgICAgICAgdmFyIHRvcEhlaWdodCA9ICQodGhpcykuc2libGluZ3MoJ2Rpdi50b3AnKTtcbiAgICAgICAgdmFyIG1pZGRsZUhlaWdodCA9ICQodGhpcykuc2libGluZ3MoJ2Rpdi5taWRkbGUnKTtcbiAgICAgICAgdmFyIGJvdHRvbUhlaWdodCA9ICQodGhpcykuc2libGluZ3MoJ2Rpdi5ib3R0b20nKTtcbiAgICAgICAgdmFyIHRvdGFsSGVpZ2h0ID0gJCgnLnNob3ctbGluZScpLmhlaWdodCgpO1xuICAgICAgICB2YXIgcmlnaHRIZWlnaHQgPSB0b3RhbEhlaWdodCAtICQodG9wSGVpZ2h0KS5oZWlnaHQoKTtcbiAgICAgICAgdmFyIGh0bWxOdW0gPSBwYXJzZUludCgkKG1pZGRsZUhlaWdodCkuaHRtbCgpKSArIHBhcnNlSW50KCQoYm90dG9tSGVpZ2h0KS5odG1sKCkpO1xuICAgICAgICAkKGRvY3VtZW50KS5vbignbW91c2Vtb3ZlJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgIHZhciBldiA9IGV2ZW50IHx8IHdpbmRvdy5ldmVudDtcbiAgICAgICAgICAgIHZhciBtb3ZlRGlzdGFuY2UgPSBldmVudC5wYWdlWSAtIHNwYWNlO1xuICAgICAgICAgICAgaWYgKG1vdmVEaXN0YW5jZSAlIDIgPT09IDApIHtcbiAgICAgICAgICAgICAgICBtb3ZlRGlzdGFuY2UgKz0gMjtcblxuICAgICAgICAgICAgICAgIGlmIChtb3ZlRGlzdGFuY2UgPj0gdG90YWxIZWlnaHQgLSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIG1vdmVEaXN0YW5jZSA9IHRvdGFsSGVpZ2h0IC0gMjtcbiAgICAgICAgICAgICAgICB9ZWxzZSBpZiAobW92ZURpc3RhbmNlIDw9IHRvcEhlaWdodC5oZWlnaHQoKSArIDIpIHtcbiAgICAgICAgICAgICAgICAgICAgbW92ZURpc3RhbmNlID0gdG9wSGVpZ2h0LmhlaWdodCgpICsgMjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoJChib3R0b21IZWlnaHQpLmhlaWdodCgpIDw9IDEwKSB7XG4gICAgICAgICAgICAgICAgICAgICQoYm90dG9tSGVpZ2h0KS5jc3MoJ2NvbG9yJywgJyM5MTYwZmYnKTtcbiAgICAgICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQoYm90dG9tSGVpZ2h0KS5jc3MoJ2NvbG9yJywgJyNmZmYnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpZiAoJChtaWRkbGVIZWlnaHQpLmhlaWdodCgpIDw9IDEwKSB7XG4gICAgICAgICAgICAgICAgICAgICQobWlkZGxlSGVpZ2h0KS5jc3MoJ2NvbG9yJywgJyNmZjU0MjInKTtcbiAgICAgICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICQobWlkZGxlSGVpZ2h0KS5jc3MoJ2NvbG9yJywgJyNmZmYnKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgY2hhbmdlVmFsdWUgPSByaWdodEhlaWdodCAtIG1vdmVEaXN0YW5jZSArICQodG9wSGVpZ2h0KS5oZWlnaHQoKTtcbiAgICAgICAgICAgICAgICAkKGN1cnJlbnRUcmkpLmNzcygndG9wJywgbW92ZURpc3RhbmNlKTtcbiAgICAgICAgICAgICAgICAkKG1pZGRsZUhlaWdodCkuaGVpZ2h0KG1vdmVEaXN0YW5jZS0kKHRvcEhlaWdodCkuaGVpZ2h0KCkpLmh0bWwocGFyc2VJbnQoJChtaWRkbGVIZWlnaHQpLmhlaWdodCgpIC8gMikgKyAnJScpO1xuICAgICAgICAgICAgICAgICQoYm90dG9tSGVpZ2h0KS5oZWlnaHQoY2hhbmdlVmFsdWUpLmh0bWwoaHRtbE51bSAtIHBhcnNlSW50KCQobWlkZGxlSGVpZ2h0KS5odG1sKCkpICsgJyUnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdtb3VzZXVwJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgJChkb2N1bWVudCkub24oJ21vdXNlZG93bicpLnVuYmluZCgpO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pOyJdLCJmaWxlIjoiY29tbW9uL3NsaWRlci5qcyJ9
