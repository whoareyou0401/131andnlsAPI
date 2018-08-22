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