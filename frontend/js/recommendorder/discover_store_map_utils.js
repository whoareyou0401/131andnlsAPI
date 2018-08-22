function display_operation () {
    var place_div = document.getElementById("operate_div");
    place_div.style.position = "fixed";
    if (place_div.style.display=="block"){
        place_div.style.display="none";
    } else {
        place_div.style.display="block";
    }
}