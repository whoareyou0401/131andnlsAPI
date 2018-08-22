$(function(){
  $('.action').click(function(e){
    e.preventDefault();

    var that = $(this);
    var oriText = $(this).text();
    var customInputPlaceholder = $('#custom-input').attr('placeholder');
    var shouldFadeout = $(this).attr('data-tag-name') !== undefined;
    var tagType = $(this).attr('data-tag-type');
    var tagName;

    if(shouldFadeout){
      tagName = $(this).attr('data-tag-name');
    }else{
      tagName = $('#custom-input').val();
    }

    if(!$(this).hasClass('loading')){
      $(this).addClass('loading').text('Loading');
      $.post('/standards/add-tag', {'tag': tagName, 'type': tagType}, function(data){
        console.log(data);
        that.removeClass('loading').text(oriText);
        if(shouldFadeout){
          that.parent().fadeOut();
        }else{
          $('#custom-input').val('').attr('placeholder', '添加成功!');
          setTimeout(function(){
            $('#custom-input').attr('placeholder', customInputPlaceholder);
          }, 1000);
        }
      });
    }
  });

  $('.tag').mouseup(function(){
    // console.log(window.getSelection().toString());
    $('#custom-input').val(window.getSelection().toString());
  });


  $('.refresh-button').click(function(e){
    e.preventDefault();
    var itemIds = [];
    var items = $(this).siblings('ul').children();
    for(var i = 0; i < items.length; i++){
      itemIds.push($(items[i]).attr('data-id'));
    }
    console.log(itemIds.join(','));
    var that = $(this);
    $(this).addClass('loading');
    $.post('/standards/update-item-keywords', {'q': itemIds.join(',')}, function(data){
      console.log(data);
      that.removeClass('loading');
      that.parent().fadeOut();
    });
  });

  $('#search-btn').click(function(e){
    var win = window.open('https://www.baidu.com/s?wd=' + $('#custom-input').val(), '_blank');
    win.focus();
  });


});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzdGFuZGFyZC9leHRyYWN0X3RhZ3MuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJChmdW5jdGlvbigpe1xuICAkKCcuYWN0aW9uJykuY2xpY2soZnVuY3Rpb24oZSl7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgdmFyIHRoYXQgPSAkKHRoaXMpO1xuICAgIHZhciBvcmlUZXh0ID0gJCh0aGlzKS50ZXh0KCk7XG4gICAgdmFyIGN1c3RvbUlucHV0UGxhY2Vob2xkZXIgPSAkKCcjY3VzdG9tLWlucHV0JykuYXR0cigncGxhY2Vob2xkZXInKTtcbiAgICB2YXIgc2hvdWxkRmFkZW91dCA9ICQodGhpcykuYXR0cignZGF0YS10YWctbmFtZScpICE9PSB1bmRlZmluZWQ7XG4gICAgdmFyIHRhZ1R5cGUgPSAkKHRoaXMpLmF0dHIoJ2RhdGEtdGFnLXR5cGUnKTtcbiAgICB2YXIgdGFnTmFtZTtcblxuICAgIGlmKHNob3VsZEZhZGVvdXQpe1xuICAgICAgdGFnTmFtZSA9ICQodGhpcykuYXR0cignZGF0YS10YWctbmFtZScpO1xuICAgIH1lbHNle1xuICAgICAgdGFnTmFtZSA9ICQoJyNjdXN0b20taW5wdXQnKS52YWwoKTtcbiAgICB9XG5cbiAgICBpZighJCh0aGlzKS5oYXNDbGFzcygnbG9hZGluZycpKXtcbiAgICAgICQodGhpcykuYWRkQ2xhc3MoJ2xvYWRpbmcnKS50ZXh0KCdMb2FkaW5nJyk7XG4gICAgICAkLnBvc3QoJy9zdGFuZGFyZHMvYWRkLXRhZycsIHsndGFnJzogdGFnTmFtZSwgJ3R5cGUnOiB0YWdUeXBlfSwgZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICB0aGF0LnJlbW92ZUNsYXNzKCdsb2FkaW5nJykudGV4dChvcmlUZXh0KTtcbiAgICAgICAgaWYoc2hvdWxkRmFkZW91dCl7XG4gICAgICAgICAgdGhhdC5wYXJlbnQoKS5mYWRlT3V0KCk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICQoJyNjdXN0b20taW5wdXQnKS52YWwoJycpLmF0dHIoJ3BsYWNlaG9sZGVyJywgJ+a3u+WKoOaIkOWKnyEnKTtcbiAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAkKCcjY3VzdG9tLWlucHV0JykuYXR0cigncGxhY2Vob2xkZXInLCBjdXN0b21JbnB1dFBsYWNlaG9sZGVyKTtcbiAgICAgICAgICB9LCAxMDAwKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9KTtcblxuICAkKCcudGFnJykubW91c2V1cChmdW5jdGlvbigpe1xuICAgIC8vIGNvbnNvbGUubG9nKHdpbmRvdy5nZXRTZWxlY3Rpb24oKS50b1N0cmluZygpKTtcbiAgICAkKCcjY3VzdG9tLWlucHV0JykudmFsKHdpbmRvdy5nZXRTZWxlY3Rpb24oKS50b1N0cmluZygpKTtcbiAgfSk7XG5cblxuICAkKCcucmVmcmVzaC1idXR0b24nKS5jbGljayhmdW5jdGlvbihlKXtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgdmFyIGl0ZW1JZHMgPSBbXTtcbiAgICB2YXIgaXRlbXMgPSAkKHRoaXMpLnNpYmxpbmdzKCd1bCcpLmNoaWxkcmVuKCk7XG4gICAgZm9yKHZhciBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKXtcbiAgICAgIGl0ZW1JZHMucHVzaCgkKGl0ZW1zW2ldKS5hdHRyKCdkYXRhLWlkJykpO1xuICAgIH1cbiAgICBjb25zb2xlLmxvZyhpdGVtSWRzLmpvaW4oJywnKSk7XG4gICAgdmFyIHRoYXQgPSAkKHRoaXMpO1xuICAgICQodGhpcykuYWRkQ2xhc3MoJ2xvYWRpbmcnKTtcbiAgICAkLnBvc3QoJy9zdGFuZGFyZHMvdXBkYXRlLWl0ZW0ta2V5d29yZHMnLCB7J3EnOiBpdGVtSWRzLmpvaW4oJywnKX0sIGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICB0aGF0LnJlbW92ZUNsYXNzKCdsb2FkaW5nJyk7XG4gICAgICB0aGF0LnBhcmVudCgpLmZhZGVPdXQoKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgJCgnI3NlYXJjaC1idG4nKS5jbGljayhmdW5jdGlvbihlKXtcbiAgICB2YXIgd2luID0gd2luZG93Lm9wZW4oJ2h0dHBzOi8vd3d3LmJhaWR1LmNvbS9zP3dkPScgKyAkKCcjY3VzdG9tLWlucHV0JykudmFsKCksICdfYmxhbmsnKTtcbiAgICB3aW4uZm9jdXMoKTtcbiAgfSk7XG5cblxufSk7Il0sImZpbGUiOiJzdGFuZGFyZC9leHRyYWN0X3RhZ3MuanMifQ==
