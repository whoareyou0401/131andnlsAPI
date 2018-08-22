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

