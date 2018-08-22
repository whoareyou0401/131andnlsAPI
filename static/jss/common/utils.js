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


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjb21tb24vdXRpbHMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gbnVtMkNoaW5lc2Uobil7XG4gICAgbiA9IFN0cmluZyhuKTtcbiAgICB2YXIgdW5pdCA9IFwi5Y2D55m+5Y2B5Lq/5Y2D55m+5Y2B5LiH5Y2D55m+5Y2BIFwiLCBzdHIgPSBcIlwiO1xuICAgIHVuaXQgPSB1bml0LnN1YnN0cih1bml0Lmxlbmd0aCAtIG4ubGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpPTA7IGkgPCBuLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgc3RyICs9ICcg5LiA5LqM5LiJ5Zub5LqU5YWt5LiD5YWr5LmdJy5jaGFyQXQobi5jaGFyQXQoaSkpICsgdW5pdC5jaGFyQXQoaSk7XG4gICAgfVxuICAgIGlmIChuLmxlbmd0aCA9PSAyICYmIG4uY2hhckF0KDApID09IFwiMVwiKXtcbiAgICAgICAgc3RyID0gc3RyLnN1YnN0cigxLCBzdHIubGVuZ3RoKTtcbiAgICB9XG4gICAgcmV0dXJuICQudHJpbShzdHIpO1xufVxuXG5mdW5jdGlvbiBoaWRlVGFibGVDb2wodGFibGUsIGNvbE5hbWUpe1xuICAgIHRoID0gdGFibGUuZmluZChcInRoZWFkIHRoW3ZhbHVlPSdcIisgY29sTmFtZSArXCInXVwiKTtcbiAgICB0aC5oaWRlKCk7XG4gICAgdGFibGUuZmluZChcInRib2R5IHRyXCIpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgJCh0aGlzKS5maW5kKFwidGQ6ZXEoXCIrIHRoLmluZGV4KCkgK1wiKVwiKS5oaWRlKCk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHNob3dUYWJsZUNvbCh0YWJsZSwgY29sTmFtZSl7XG4gICAgdGggPSB0YWJsZS5maW5kKFwidGhlYWQgdGhbdmFsdWU9J1wiKyBjb2xOYW1lICtcIiddXCIpO1xuICAgIHRoLnNob3coKTtcbiAgICB0YWJsZS5maW5kKFwidGJvZHkgdHJcIikuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAkKHRoaXMpLmZpbmQoXCJ0ZDplcShcIisgdGguaW5kZXgoKSArXCIpXCIpLnNob3coKTtcbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gZmlsbENoYXJ0KGVsZW1lbnROYW1lLCBvcHRpb24pIHtcbiAgICB2YXIgZGF0YUNoYXJ0ID0gZWNoYXJ0cy5pbml0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnROYW1lKSk7XG4gICAgaWYgKG9wdGlvbiAmJiB0eXBlb2Ygb3B0aW9uID09PSBcIm9iamVjdFwiKSB7XG4gICAgICAgIGRhdGFDaGFydC5zZXRPcHRpb24ob3B0aW9uLCB0cnVlKTtcbiAgICB9XG4gICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJyZXNpemVcIixmdW5jdGlvbigpe1xuICAgICAgICBkYXRhQ2hhcnQucmVzaXplKCk7XG4gICAgfSk7XG59XG5cbmZ1bmN0aW9uIHRhYmxlU2Nyb2xsRnVuKCkge1xuICAgICQoJy50YWJsZS1ib3JkZXInKS5zY3JvbGwoZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdmFyIGUgPSBldmVudCB8fCB3aW5kb3cuZXZlbnQ7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgdmFyIF9sZWZ0ID0gJCh0aGlzKS5zY3JvbGxMZWZ0KCk7XG4gICAgICAgICQoJ3RhYmxlIHRoJykuZXEoMCkuY3NzKCdsZWZ0JywgX2xlZnQpO1xuICAgICAgICAkKCd0YWJsZSB0aCcpLmVxKDEpLmNzcygnbGVmdCcsIF9sZWZ0KS5hZGRDbGFzcygnYm94LXNoYWRvdycpO1xuICAgICAgICAkKCd0YWJsZSB0ZDpudGgtY2hpbGQoMSknKS5jc3MoJ2xlZnQnLCBfbGVmdCk7XG4gICAgICAgICQoJ3RhYmxlIHRkOm50aC1jaGlsZCgyKScpLmNzcygnbGVmdCcsIF9sZWZ0KS5hZGRDbGFzcygnYm94LXNoYWRvdycpO1xuICAgICAgICBpZiAoTnVtYmVyKCQodGhpcykuc2Nyb2xsTGVmdCgpKSA9PT0gMCkge1xuICAgICAgICAgICAgJCgndGFibGUgdGgnKS5lcSgxKS5yZW1vdmVDbGFzcygnYm94LXNoYWRvdycpO1xuICAgICAgICAgICAgJCgndGFibGUgdGQ6bnRoLWNoaWxkKDIpJykucmVtb3ZlQ2xhc3MoJ2JveC1zaGFkb3cnKTtcbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBzZXRUYmFsZVdpZHRoKCl7XG4gICAgJCgndHInKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoJCh0aGlzKS53aWR0aCgpIDwgJCgnLnRhYmxlLWJvcmRlcicpLndpZHRoKCkpIHtcbiAgICAgICAgICAgIHZhciBsZW4gPSAkKCcuY2hlY2tib3gtbGlzdCBpbnB1dDpjaGVja2VkJykubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKGxlbiA8PSAwKSB7XG4gICAgICAgICAgICAgICAgbGVuID0gJCgndGg6dmlzaWJsZScpLmxlbmd0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgICQoJ3RyIHRkLCB0ciB0aCcpLndpZHRoKCQoJy50YWJsZS1ib3JkZXInKS53aWR0aCgpL2xlbik7XG4gICAgICAgIH1cbiAgICB9KTtcbn1cblxuZnVuY3Rpb24gZ2V0Q29va2llKG5hbWUpIHtcbiAgICB2YXIgY29va2llVmFsdWUgPSBudWxsO1xuICAgIGlmIChkb2N1bWVudC5jb29raWUgJiYgZG9jdW1lbnQuY29va2llICE9PSAnJykge1xuICAgICAgICB2YXIgY29va2llcyA9IGRvY3VtZW50LmNvb2tpZS5zcGxpdCgnOycpO1xuICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvb2tpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHZhciBjb29raWUgPSBqUXVlcnkudHJpbShjb29raWVzW2ldKTtcbiAgICAgICAgICAgIC8vIERvZXMgdGhpcyBjb29raWUgc3RyaW5nIGJlZ2luIHdpdGggdGhlIG5hbWUgd2Ugd2FudD9cbiAgICAgICAgICAgIGlmIChjb29raWUuc3Vic3RyaW5nKDAsIG5hbWUubGVuZ3RoICsgMSkgPT09IChuYW1lICsgJz0nKSkge1xuICAgICAgICAgICAgICAgIGNvb2tpZVZhbHVlID0gZGVjb2RlVVJJQ29tcG9uZW50KGNvb2tpZS5zdWJzdHJpbmcobmFtZS5sZW5ndGggKyAxKSk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGNvb2tpZVZhbHVlO1xufVxuXG5mdW5jdGlvbiBjc3JmU2FmZU1ldGhvZChtZXRob2QpIHtcbiAgICAvLyB0aGVzZSBIVFRQIG1ldGhvZHMgZG8gbm90IHJlcXVpcmUgQ1NSRiBwcm90ZWN0aW9uXG4gICAgcmV0dXJuICgvXihHRVR8SEVBRHxPUFRJT05TfFRSQUNFKSQvLnRlc3QobWV0aG9kKSk7XG59XG5cblxuZnVuY3Rpb24gc2V0dXBDU1JGKCkge1xuICAgIHZhciBjc3JmdG9rZW4gPSBnZXRDb29raWUoJ2NzcmZ0b2tlbicpO1xuICAgICQuYWpheFNldHVwKHtcbiAgICAgICAgYmVmb3JlU2VuZDogZnVuY3Rpb24oeGhyLCBzZXR0aW5ncykge1xuICAgICAgICAgICAgaWYgKCFjc3JmU2FmZU1ldGhvZChzZXR0aW5ncy50eXBlKSAmJiAhdGhpcy5jcm9zc0RvbWFpbikge1xuICAgICAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiWC1DU1JGVG9rZW5cIiwgY3NyZnRva2VuKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0pO1xufVxuXG5mdW5jdGlvbiBub2RvdWJsZXRhcHpvb20oKSB7XG4gICAgdmFyIElTX0lPUyA9IC9pcGhvbmV8aXBhZC9pLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XG4gICAgaWYgKElTX0lPUylcbiAgICAgICQodGhpcykuYmluZCgndG91Y2hzdGFydCcsIGZ1bmN0aW9uIHByZXZlbnRab29tKGUpIHtcbiAgICAgICAgdmFyIHQyID0gZS50aW1lU3RhbXA7XG4gICAgICAgIHZhciB0MSA9ICQodGhpcykuZGF0YSgnbGFzdFRvdWNoJykgfHwgdDI7XG4gICAgICAgIHZhciBkdCA9IHQyIC0gdDE7XG4gICAgICAgIHZhciBmaW5nZXJzID0gZS5vcmlnaW5hbEV2ZW50LnRvdWNoZXMubGVuZ3RoO1xuICAgICAgICAkKHRoaXMpLmRhdGEoJ2xhc3RUb3VjaCcsIHQyKTtcbiAgICAgICAgaWYgKCFkdCB8fCBkdCA+IDUwMCB8fCBmaW5nZXJzID4gMSkgcmV0dXJuO1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICQodGhpcykudHJpZ2dlcignY2xpY2snKS50cmlnZ2VyKCdjbGljaycpO1xuICAgIH0pO1xufVxuXG5mdW5jdGlvbiB1dGY4Q29kZVRvQ2hpbmVzZUNoYXIoc3RyVXRmOCkgeyBcbiAgICB2YXIgaUNvZGUsaUNvZGUxLGlDb2RlMjsgXG4gICAgaUNvZGUgPSBwYXJzZUludChcIjB4XCIgKyBzdHJVdGY4LnN1YnN0cigxLDIpKTsgXG4gICAgaUNvZGUxID0gcGFyc2VJbnQoXCIweFwiICsgc3RyVXRmOC5zdWJzdHIoNCwyKSk7IFxuICAgIGlDb2RlMiA9IHBhcnNlSW50KFwiMHhcIiArIHN0clV0Zjguc3Vic3RyKDcsMikpOyBcbiAgICBcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSgoKGlDb2RlICYgMHgwRikgPDwgMTIpIHwgKChpQ29kZTEgJiAweDNGKSA8PCA2KSB8IChpQ29kZTIgJiAweDNGKSk7IFxufSBcbmZ1bmN0aW9uIGNoaW5lc2VGcm9tVXRmOFVybChzdHJVdGY4KSB7IFxuICAgIHZhciBic3RyID0gXCJcIjsgXG4gICAgdmFyIG5PZmZzZXQgPSAwOyAvLyAgIHByb2Nlc3NpbmcgICBwb2ludCAgIG9uICAgc3RyVXRmOCBcbiAgICBpZihzdHJVdGY4ID09PSBcIlwiKSBcbiAgICAgIHJldHVybiBcIlwiOyBcbiAgICBzdHJVdGY4ID0gc3RyVXRmOC50b0xvd2VyQ2FzZSgpOyBcbiAgICBuT2Zmc2V0ID0gc3RyVXRmOC5pbmRleE9mKFwiJWVcIik7IFxuICAgIGlmKG5PZmZzZXQgPT09ICAtMSkgXG4gICAgICByZXR1cm4gc3RyVXRmODsgXG4gICAgd2hpbGUobk9mZnNldCAhPSAtMSkgeyBcbiAgICAgIGJzdHIgKz0gc3RyVXRmOC5zdWJzdHIoMCwgbk9mZnNldCk7IFxuICAgICAgc3RyVXRmOCA9IHN0clV0Zjguc3Vic3RyKG5PZmZzZXQsIHN0clV0ZjgubGVuZ3RoIC0gbk9mZnNldCk7IFxuICAgICAgaWYoc3RyVXRmOCA9PT0gXCJcIiB8fCBzdHJVdGY4Lmxlbmd0aCA8IDkpICAgICAgIC8vICAgYmFkICAgc3RyaW5nIFxuICAgICAgICAgIHJldHVybiBic3RyOyBcbiAgICAgIGJzdHIgKz0gdXRmOENvZGVUb0NoaW5lc2VDaGFyKHN0clV0Zjguc3Vic3RyKDAsIDkpKTsgXG4gICAgICBzdHJVdGY4ID0gc3RyVXRmOC5zdWJzdHIoOSwgc3RyVXRmOC5sZW5ndGggLSA5KTsgXG4gICAgICBuT2Zmc2V0ID0gc3RyVXRmOC5pbmRleE9mKFwiJWVcIik7IFxuICAgIH0gXG4gICAgcmV0dXJuIGJzdHIgKyBzdHJVdGY4OyBcbn0gXG5cbmZ1bmN0aW9uIGludFBhZChudW0sIHNpemUpIHtcbiAgICB2YXIgcyA9IG51bStcIlwiO1xuICAgIHdoaWxlIChzLmxlbmd0aCA8IHNpemUpIHMgPSBcIjBcIiArIHM7XG4gICAgcmV0dXJuIHM7XG59XG5cbiJdLCJmaWxlIjoiY29tbW9uL3V0aWxzLmpzIn0=
