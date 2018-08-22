$(document).ajaxSend(function(event, xhr, settings) {
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }
    function sameOrigin(url) {
        // url could be relative or scheme relative or absolute
        var host = document.location.host; // host + port
        var protocol = document.location.protocol;
        var sr_origin = '//' + host;
        var origin = protocol + sr_origin;
        // Allow absolute or scheme relative URLs to same origin
        return (url == origin || url.slice(0, origin.length + 1) == origin + '/') ||
            (url == sr_origin || url.slice(0, sr_origin.length + 1) == sr_origin + '/') ||
            // or any other URL that isn't scheme relative or absolute i.e relative.
            !(/^(\/\/|http:|https:).*/.test(url));
    }
    function safeMethod(method) {
        return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
    }

    if (!safeMethod(settings.type) && sameOrigin(settings.url)) {
        xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
    }
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJkaXNjb3Zlcnkvc29sdXZlX2NzcmYuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJChkb2N1bWVudCkuYWpheFNlbmQoZnVuY3Rpb24oZXZlbnQsIHhociwgc2V0dGluZ3MpIHtcbiAgICBmdW5jdGlvbiBnZXRDb29raWUobmFtZSkge1xuICAgICAgICB2YXIgY29va2llVmFsdWUgPSBudWxsO1xuICAgICAgICBpZiAoZG9jdW1lbnQuY29va2llICYmIGRvY3VtZW50LmNvb2tpZSAhPT0gJycpIHtcbiAgICAgICAgICAgIHZhciBjb29raWVzID0gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7Jyk7XG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNvb2tpZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB2YXIgY29va2llID0galF1ZXJ5LnRyaW0oY29va2llc1tpXSk7XG4gICAgICAgICAgICAgICAgLy8gRG9lcyB0aGlzIGNvb2tpZSBzdHJpbmcgYmVnaW4gd2l0aCB0aGUgbmFtZSB3ZSB3YW50P1xuICAgICAgICAgICAgICAgIGlmIChjb29raWUuc3Vic3RyaW5nKDAsIG5hbWUubGVuZ3RoICsgMSkgPT0gKG5hbWUgKyAnPScpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvb2tpZVZhbHVlID0gZGVjb2RlVVJJQ29tcG9uZW50KGNvb2tpZS5zdWJzdHJpbmcobmFtZS5sZW5ndGggKyAxKSk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY29va2llVmFsdWU7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNhbWVPcmlnaW4odXJsKSB7XG4gICAgICAgIC8vIHVybCBjb3VsZCBiZSByZWxhdGl2ZSBvciBzY2hlbWUgcmVsYXRpdmUgb3IgYWJzb2x1dGVcbiAgICAgICAgdmFyIGhvc3QgPSBkb2N1bWVudC5sb2NhdGlvbi5ob3N0OyAvLyBob3N0ICsgcG9ydFxuICAgICAgICB2YXIgcHJvdG9jb2wgPSBkb2N1bWVudC5sb2NhdGlvbi5wcm90b2NvbDtcbiAgICAgICAgdmFyIHNyX29yaWdpbiA9ICcvLycgKyBob3N0O1xuICAgICAgICB2YXIgb3JpZ2luID0gcHJvdG9jb2wgKyBzcl9vcmlnaW47XG4gICAgICAgIC8vIEFsbG93IGFic29sdXRlIG9yIHNjaGVtZSByZWxhdGl2ZSBVUkxzIHRvIHNhbWUgb3JpZ2luXG4gICAgICAgIHJldHVybiAodXJsID09IG9yaWdpbiB8fCB1cmwuc2xpY2UoMCwgb3JpZ2luLmxlbmd0aCArIDEpID09IG9yaWdpbiArICcvJykgfHxcbiAgICAgICAgICAgICh1cmwgPT0gc3Jfb3JpZ2luIHx8IHVybC5zbGljZSgwLCBzcl9vcmlnaW4ubGVuZ3RoICsgMSkgPT0gc3Jfb3JpZ2luICsgJy8nKSB8fFxuICAgICAgICAgICAgLy8gb3IgYW55IG90aGVyIFVSTCB0aGF0IGlzbid0IHNjaGVtZSByZWxhdGl2ZSBvciBhYnNvbHV0ZSBpLmUgcmVsYXRpdmUuXG4gICAgICAgICAgICAhKC9eKFxcL1xcL3xodHRwOnxodHRwczopLiovLnRlc3QodXJsKSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIHNhZmVNZXRob2QobWV0aG9kKSB7XG4gICAgICAgIHJldHVybiAoL14oR0VUfEhFQUR8T1BUSU9OU3xUUkFDRSkkLy50ZXN0KG1ldGhvZCkpO1xuICAgIH1cblxuICAgIGlmICghc2FmZU1ldGhvZChzZXR0aW5ncy50eXBlKSAmJiBzYW1lT3JpZ2luKHNldHRpbmdzLnVybCkpIHtcbiAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoXCJYLUNTUkZUb2tlblwiLCBnZXRDb29raWUoJ2NzcmZ0b2tlbicpKTtcbiAgICB9XG59KTsiXSwiZmlsZSI6ImRpc2NvdmVyeS9zb2x1dmVfY3NyZi5qcyJ9
