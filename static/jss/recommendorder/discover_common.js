function set_place_height(element_id){
    var screen_height = document.body.clientHeight;
    var place_div = document.getElementById(element_id);
    place_div.style.height = screen_height - 45 - 0.85 * screen_height + 'px';
    console.log(place_div.style.height);
}

function set_search_text_width_by_id(element_id){
    var screen_width = document.body.clientWidth;
    var place_div = document.getElementById(element_id);
    //var father_div = document.getElementById('search_button')
    place_div.style.width = screen_width - 130 + 'px';
}

function set_show_place_top(element_id){
    var screen_height = document.body.clientHeight;
    var place_msg_div = document.getElementById(element_id);
    var container_div = document.getElementById('container');
    var height = container_div.offsetTop + container_div.offsetHeight;
    place_msg_div.style.marginTop = height + 'px';
    console.log('屏幕'+height);
}


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9kaXNjb3Zlcl9jb21tb24uanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gc2V0X3BsYWNlX2hlaWdodChlbGVtZW50X2lkKXtcbiAgICB2YXIgc2NyZWVuX2hlaWdodCA9IGRvY3VtZW50LmJvZHkuY2xpZW50SGVpZ2h0O1xuICAgIHZhciBwbGFjZV9kaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50X2lkKTtcbiAgICBwbGFjZV9kaXYuc3R5bGUuaGVpZ2h0ID0gc2NyZWVuX2hlaWdodCAtIDQ1IC0gMC44NSAqIHNjcmVlbl9oZWlnaHQgKyAncHgnO1xuICAgIGNvbnNvbGUubG9nKHBsYWNlX2Rpdi5zdHlsZS5oZWlnaHQpO1xufVxuXG5mdW5jdGlvbiBzZXRfc2VhcmNoX3RleHRfd2lkdGhfYnlfaWQoZWxlbWVudF9pZCl7XG4gICAgdmFyIHNjcmVlbl93aWR0aCA9IGRvY3VtZW50LmJvZHkuY2xpZW50V2lkdGg7XG4gICAgdmFyIHBsYWNlX2RpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnRfaWQpO1xuICAgIC8vdmFyIGZhdGhlcl9kaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc2VhcmNoX2J1dHRvbicpXG4gICAgcGxhY2VfZGl2LnN0eWxlLndpZHRoID0gc2NyZWVuX3dpZHRoIC0gMTMwICsgJ3B4Jztcbn1cblxuZnVuY3Rpb24gc2V0X3Nob3dfcGxhY2VfdG9wKGVsZW1lbnRfaWQpe1xuICAgIHZhciBzY3JlZW5faGVpZ2h0ID0gZG9jdW1lbnQuYm9keS5jbGllbnRIZWlnaHQ7XG4gICAgdmFyIHBsYWNlX21zZ19kaXYgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50X2lkKTtcbiAgICB2YXIgY29udGFpbmVyX2RpdiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjb250YWluZXInKTtcbiAgICB2YXIgaGVpZ2h0ID0gY29udGFpbmVyX2Rpdi5vZmZzZXRUb3AgKyBjb250YWluZXJfZGl2Lm9mZnNldEhlaWdodDtcbiAgICBwbGFjZV9tc2dfZGl2LnN0eWxlLm1hcmdpblRvcCA9IGhlaWdodCArICdweCc7XG4gICAgY29uc29sZS5sb2coJ+Wxj+W5lScraGVpZ2h0KTtcbn1cblxuIl0sImZpbGUiOiJyZWNvbW1lbmRvcmRlci9kaXNjb3Zlcl9jb21tb24uanMifQ==
