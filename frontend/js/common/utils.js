function num2Chinese(n){
    n = String(n);
    var unit = "千百十亿千百十万千百十 ", str = "";
    unit = unit.substr(unit.length - n.length);
    for (var i=0; i < n.length; i++){
        str += ' 一二三四五六七八九'.charAt(n.charAt(i)) + unit.charAt(i);
    }
    if (n.length == 2 && n.charAt(0) == "1"){
        str = str.substr(1, str.length);
    }
    return $.trim(str);
}

function hideTableCol(table, colName){
    th = table.find("thead th[value='"+ colName +"']");
    th.hide();
    table.find("tbody tr").each(function(){
        $(this).find("td:eq("+ th.index() +")").hide();
    });
}

function showTableCol(table, colName){
    th = table.find("thead th[value='"+ colName +"']");
    th.show();
    table.find("tbody tr").each(function(){
        $(this).find("td:eq("+ th.index() +")").show();
    });
}

function fillChart(elementName, option) {
    var dataChart = echarts.init(document.getElementById(elementName));
    if (option && typeof option === "object") {
        dataChart.setOption(option, true);
    }
    window.addEventListener("resize",function(){
        dataChart.resize();
    });
}

function tableScrollFun() {
    $('.table-border').scroll(function(event) {
        var e = event || window.event;
        e.preventDefault();
        var _left = $(this).scrollLeft();
        $('table th').eq(0).css('left', _left);
        $('table th').eq(1).css('left', _left).addClass('box-shadow');
        $('table td:nth-child(1)').css('left', _left);
        $('table td:nth-child(2)').css('left', _left).addClass('box-shadow');
        if (Number($(this).scrollLeft()) === 0) {
            $('table th').eq(1).removeClass('box-shadow');
            $('table td:nth-child(2)').removeClass('box-shadow');
        }
    });
}

function setTbaleWidth(){
    $('tr').each(function() {
        if ($(this).width() < $('.table-border').width()) {
            var len = $('.checkbox-list input:checked').length;
            if (len <= 0) {
                len = $('th:visible').length;
            }
            $('tr td, tr th').width($('.table-border').width()/len);
        }
    });
}

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}


function setupCSRF() {
    var csrftoken = getCookie('csrftoken');
    $.ajaxSetup({
        beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
                xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
        }
    });
}

function nodoubletapzoom() {
    var IS_IOS = /iphone|ipad/i.test(navigator.userAgent);
    if (IS_IOS)
      $(this).bind('touchstart', function preventZoom(e) {
        var t2 = e.timeStamp;
        var t1 = $(this).data('lastTouch') || t2;
        var dt = t2 - t1;
        var fingers = e.originalEvent.touches.length;
        $(this).data('lastTouch', t2);
        if (!dt || dt > 500 || fingers > 1) return;
        e.preventDefault();
        $(this).trigger('click').trigger('click');
    });
}

function utf8CodeToChineseChar(strUtf8) { 
    var iCode,iCode1,iCode2; 
    iCode = parseInt("0x" + strUtf8.substr(1,2)); 
    iCode1 = parseInt("0x" + strUtf8.substr(4,2)); 
    iCode2 = parseInt("0x" + strUtf8.substr(7,2)); 
    
    return String.fromCharCode(((iCode & 0x0F) << 12) | ((iCode1 & 0x3F) << 6) | (iCode2 & 0x3F)); 
} 
function chineseFromUtf8Url(strUtf8) { 
    var bstr = ""; 
    var nOffset = 0; //   processing   point   on   strUtf8 
    if(strUtf8 === "") 
      return ""; 
    strUtf8 = strUtf8.toLowerCase(); 
    nOffset = strUtf8.indexOf("%e"); 
    if(nOffset ===  -1) 
      return strUtf8; 
    while(nOffset != -1) { 
      bstr += strUtf8.substr(0, nOffset); 
      strUtf8 = strUtf8.substr(nOffset, strUtf8.length - nOffset); 
      if(strUtf8 === "" || strUtf8.length < 9)       //   bad   string 
          return bstr; 
      bstr += utf8CodeToChineseChar(strUtf8.substr(0, 9)); 
      strUtf8 = strUtf8.substr(9, strUtf8.length - 9); 
      nOffset = strUtf8.indexOf("%e"); 
    } 
    return bstr + strUtf8; 
} 

function intPad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

