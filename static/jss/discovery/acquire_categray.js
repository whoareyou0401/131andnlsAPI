$.ajax({
    url:'api/v1/products-category',
    type: 'GET',
    success: function(data) {
        var every_id = [];
        for (var i = 0; i < data.length; i++) {
            var name = data[i].id;
            every_id[name] = data[i];
        }
        for (var j = 0; j < data.length; j++) {
            if (data[j].level === 0) {
                var fir_item = $('<a class="item" href="javascript:"></a>').html(data[j].name).attr('sign','std_cat').attr('name',data[j].id);
                var sec_wrapper = $('<div class="ui six column relaxed divided grid popup sec_wrapper"></div>').attr('name',data[j].id);
                var fir_list = $('<div class="ui inverted grey basic button fir_list"></div>').attr('name',data[j].id).append(fir_item).append(sec_wrapper);
                $('#category').append(fir_list);
            }else if (data[j].level === 1) {
                var sec_cur_id = data[j].parent_id;
                var sec_item = $('<a class="ui header item" href="javascript:"></a>').html(data[j].name).attr('sign','std_cat').attr('name', data[j].id).attr('p_id', data[j].parent_id);
                var sec_list = $('<div class="column sec_list"></div>').attr('name', data[j].id).attr('p_id', data[j].parent_id).append(sec_item);
                if (sec_cur_id == every_id[sec_cur_id].id) {
                    $('.sec_wrapper[name='+ sec_cur_id +']').append(sec_list);
                }
            }else if (data[j].level === 2) {
                var thi_cur_id = data[j].parent_id;
                var thi_item = $('<a class="item" href="javascript:"></a>').html(data[j].name).attr('sign','std_cat').attr('name',data[j].id).attr('p_id', data[j].parent_id);
                var thi_list = $('<div class="ui link list"></div>').attr('name', data[j].id).attr('p_id', data[j].parent_id).append(thi_item);
                if (thi_cur_id === every_id[thi_cur_id].id) {
                    $('.sec_list[name='+ thi_cur_id +']').append(thi_list);
                }
            }
        }
    }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJkaXNjb3ZlcnkvYWNxdWlyZV9jYXRlZ3JheS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIkLmFqYXgoe1xuICAgIHVybDonYXBpL3YxL3Byb2R1Y3RzLWNhdGVnb3J5JyxcbiAgICB0eXBlOiAnR0VUJyxcbiAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgIHZhciBldmVyeV9pZCA9IFtdO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBuYW1lID0gZGF0YVtpXS5pZDtcbiAgICAgICAgICAgIGV2ZXJ5X2lkW25hbWVdID0gZGF0YVtpXTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGRhdGEubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIGlmIChkYXRhW2pdLmxldmVsID09PSAwKSB7XG4gICAgICAgICAgICAgICAgdmFyIGZpcl9pdGVtID0gJCgnPGEgY2xhc3M9XCJpdGVtXCIgaHJlZj1cImphdmFzY3JpcHQ6XCI+PC9hPicpLmh0bWwoZGF0YVtqXS5uYW1lKS5hdHRyKCdzaWduJywnc3RkX2NhdCcpLmF0dHIoJ25hbWUnLGRhdGFbal0uaWQpO1xuICAgICAgICAgICAgICAgIHZhciBzZWNfd3JhcHBlciA9ICQoJzxkaXYgY2xhc3M9XCJ1aSBzaXggY29sdW1uIHJlbGF4ZWQgZGl2aWRlZCBncmlkIHBvcHVwIHNlY193cmFwcGVyXCI+PC9kaXY+JykuYXR0cignbmFtZScsZGF0YVtqXS5pZCk7XG4gICAgICAgICAgICAgICAgdmFyIGZpcl9saXN0ID0gJCgnPGRpdiBjbGFzcz1cInVpIGludmVydGVkIGdyZXkgYmFzaWMgYnV0dG9uIGZpcl9saXN0XCI+PC9kaXY+JykuYXR0cignbmFtZScsZGF0YVtqXS5pZCkuYXBwZW5kKGZpcl9pdGVtKS5hcHBlbmQoc2VjX3dyYXBwZXIpO1xuICAgICAgICAgICAgICAgICQoJyNjYXRlZ29yeScpLmFwcGVuZChmaXJfbGlzdCk7XG4gICAgICAgICAgICB9ZWxzZSBpZiAoZGF0YVtqXS5sZXZlbCA9PT0gMSkge1xuICAgICAgICAgICAgICAgIHZhciBzZWNfY3VyX2lkID0gZGF0YVtqXS5wYXJlbnRfaWQ7XG4gICAgICAgICAgICAgICAgdmFyIHNlY19pdGVtID0gJCgnPGEgY2xhc3M9XCJ1aSBoZWFkZXIgaXRlbVwiIGhyZWY9XCJqYXZhc2NyaXB0OlwiPjwvYT4nKS5odG1sKGRhdGFbal0ubmFtZSkuYXR0cignc2lnbicsJ3N0ZF9jYXQnKS5hdHRyKCduYW1lJywgZGF0YVtqXS5pZCkuYXR0cigncF9pZCcsIGRhdGFbal0ucGFyZW50X2lkKTtcbiAgICAgICAgICAgICAgICB2YXIgc2VjX2xpc3QgPSAkKCc8ZGl2IGNsYXNzPVwiY29sdW1uIHNlY19saXN0XCI+PC9kaXY+JykuYXR0cignbmFtZScsIGRhdGFbal0uaWQpLmF0dHIoJ3BfaWQnLCBkYXRhW2pdLnBhcmVudF9pZCkuYXBwZW5kKHNlY19pdGVtKTtcbiAgICAgICAgICAgICAgICBpZiAoc2VjX2N1cl9pZCA9PSBldmVyeV9pZFtzZWNfY3VyX2lkXS5pZCkge1xuICAgICAgICAgICAgICAgICAgICAkKCcuc2VjX3dyYXBwZXJbbmFtZT0nKyBzZWNfY3VyX2lkICsnXScpLmFwcGVuZChzZWNfbGlzdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfWVsc2UgaWYgKGRhdGFbal0ubGV2ZWwgPT09IDIpIHtcbiAgICAgICAgICAgICAgICB2YXIgdGhpX2N1cl9pZCA9IGRhdGFbal0ucGFyZW50X2lkO1xuICAgICAgICAgICAgICAgIHZhciB0aGlfaXRlbSA9ICQoJzxhIGNsYXNzPVwiaXRlbVwiIGhyZWY9XCJqYXZhc2NyaXB0OlwiPjwvYT4nKS5odG1sKGRhdGFbal0ubmFtZSkuYXR0cignc2lnbicsJ3N0ZF9jYXQnKS5hdHRyKCduYW1lJyxkYXRhW2pdLmlkKS5hdHRyKCdwX2lkJywgZGF0YVtqXS5wYXJlbnRfaWQpO1xuICAgICAgICAgICAgICAgIHZhciB0aGlfbGlzdCA9ICQoJzxkaXYgY2xhc3M9XCJ1aSBsaW5rIGxpc3RcIj48L2Rpdj4nKS5hdHRyKCduYW1lJywgZGF0YVtqXS5pZCkuYXR0cigncF9pZCcsIGRhdGFbal0ucGFyZW50X2lkKS5hcHBlbmQodGhpX2l0ZW0pO1xuICAgICAgICAgICAgICAgIGlmICh0aGlfY3VyX2lkID09PSBldmVyeV9pZFt0aGlfY3VyX2lkXS5pZCkge1xuICAgICAgICAgICAgICAgICAgICAkKCcuc2VjX2xpc3RbbmFtZT0nKyB0aGlfY3VyX2lkICsnXScpLmFwcGVuZCh0aGlfbGlzdCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufSk7Il0sImZpbGUiOiJkaXNjb3ZlcnkvYWNxdWlyZV9jYXRlZ3JheS5qcyJ9
