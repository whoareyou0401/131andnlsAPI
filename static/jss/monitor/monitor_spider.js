$(function(){

function renderSparklines() {
    var height = 50;
    var width = 150;
    var x_values = $('#spark-x-values').attr('values').split(',');
    $('.sparklines').each(function() {
        $(this).sparkline('html', {
            type:'line',
            height:height,
            width:width,
            tooltipFormatter: function(sparkline, options, fields) {
                if (typeof fields.y === 'undefined') {
                    return x_values[fields.offset] + '<br />' + fields.value;
                } else {
                    return x_values[fields.offset] + '&nbsp;&nbsp;&nbsp;<br />' + fields.y + 
                           '&nbsp;&nbsp;&nbsp;<br /><br / >';
                /*    return x_values[fields.offset] + '<br />' + fields.y;
                */
                }
            }
        });
    });
}

renderSparklines();

});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb25pdG9yL21vbml0b3Jfc3BpZGVyLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiQoZnVuY3Rpb24oKXtcblxuZnVuY3Rpb24gcmVuZGVyU3BhcmtsaW5lcygpIHtcbiAgICB2YXIgaGVpZ2h0ID0gNTA7XG4gICAgdmFyIHdpZHRoID0gMTUwO1xuICAgIHZhciB4X3ZhbHVlcyA9ICQoJyNzcGFyay14LXZhbHVlcycpLmF0dHIoJ3ZhbHVlcycpLnNwbGl0KCcsJyk7XG4gICAgJCgnLnNwYXJrbGluZXMnKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAkKHRoaXMpLnNwYXJrbGluZSgnaHRtbCcsIHtcbiAgICAgICAgICAgIHR5cGU6J2xpbmUnLFxuICAgICAgICAgICAgaGVpZ2h0OmhlaWdodCxcbiAgICAgICAgICAgIHdpZHRoOndpZHRoLFxuICAgICAgICAgICAgdG9vbHRpcEZvcm1hdHRlcjogZnVuY3Rpb24oc3BhcmtsaW5lLCBvcHRpb25zLCBmaWVsZHMpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGZpZWxkcy55ID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geF92YWx1ZXNbZmllbGRzLm9mZnNldF0gKyAnPGJyIC8+JyArIGZpZWxkcy52YWx1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4geF92YWx1ZXNbZmllbGRzLm9mZnNldF0gKyAnJm5ic3A7Jm5ic3A7Jm5ic3A7PGJyIC8+JyArIGZpZWxkcy55ICsgXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAnJm5ic3A7Jm5ic3A7Jm5ic3A7PGJyIC8+PGJyIC8gPic7XG4gICAgICAgICAgICAgICAgLyogICAgcmV0dXJuIHhfdmFsdWVzW2ZpZWxkcy5vZmZzZXRdICsgJzxiciAvPicgKyBmaWVsZHMueTtcbiAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfSk7XG59XG5cbnJlbmRlclNwYXJrbGluZXMoKTtcblxufSk7XG4iXSwiZmlsZSI6Im1vbml0b3IvbW9uaXRvcl9zcGlkZXIuanMifQ==
