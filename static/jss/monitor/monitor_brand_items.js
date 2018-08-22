$(function(){

var dateFormat = 'yy-mm-dd';
var start_date = $('#start_date').datepicker({
      changeMonth: true,
      dateFormat: dateFormat,
      defaultDate: getDate($(this).val()),
      maxDate: getDate($('#end_date').val())
    }).on('change', function() {
      end_date.datepicker('option','minDate', getDate($(this).val()));
    });

var end_date = $('#end_date').datepicker({
    changeMonth: true,
    dateFormat: dateFormat,
    defaultDate: getDate($(this).val()),
    minDate: getDate($('#start_date').val())
  }).on('change', function() {
    start_date.datepicker('option','maxDate', getDate($(this).val()));
  });

function getDate(val) {
  var date;
  try {
    date = $.datepicker.parseDate(dateFormat, val);
  } catch(error){
    date = null;
  }

  return date;
}


$('#refresh').click(function(){
    location.href = generateUrl({'s': $('#start_date').val(),
       'e': $('#end_date').val()});
});

function renderSparklines() {
    var height = 50;
    var width = 300;
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
                    return x_values[fields.offset] + '<br />' + fields.y;
                }
            }
        });
    });
}


renderSparklines();


});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJtb25pdG9yL21vbml0b3JfYnJhbmRfaXRlbXMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJChmdW5jdGlvbigpe1xuXG52YXIgZGF0ZUZvcm1hdCA9ICd5eS1tbS1kZCc7XG52YXIgc3RhcnRfZGF0ZSA9ICQoJyNzdGFydF9kYXRlJykuZGF0ZXBpY2tlcih7XG4gICAgICBjaGFuZ2VNb250aDogdHJ1ZSxcbiAgICAgIGRhdGVGb3JtYXQ6IGRhdGVGb3JtYXQsXG4gICAgICBkZWZhdWx0RGF0ZTogZ2V0RGF0ZSgkKHRoaXMpLnZhbCgpKSxcbiAgICAgIG1heERhdGU6IGdldERhdGUoJCgnI2VuZF9kYXRlJykudmFsKCkpXG4gICAgfSkub24oJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuICAgICAgZW5kX2RhdGUuZGF0ZXBpY2tlcignb3B0aW9uJywnbWluRGF0ZScsIGdldERhdGUoJCh0aGlzKS52YWwoKSkpO1xuICAgIH0pO1xuXG52YXIgZW5kX2RhdGUgPSAkKCcjZW5kX2RhdGUnKS5kYXRlcGlja2VyKHtcbiAgICBjaGFuZ2VNb250aDogdHJ1ZSxcbiAgICBkYXRlRm9ybWF0OiBkYXRlRm9ybWF0LFxuICAgIGRlZmF1bHREYXRlOiBnZXREYXRlKCQodGhpcykudmFsKCkpLFxuICAgIG1pbkRhdGU6IGdldERhdGUoJCgnI3N0YXJ0X2RhdGUnKS52YWwoKSlcbiAgfSkub24oJ2NoYW5nZScsIGZ1bmN0aW9uKCkge1xuICAgIHN0YXJ0X2RhdGUuZGF0ZXBpY2tlcignb3B0aW9uJywnbWF4RGF0ZScsIGdldERhdGUoJCh0aGlzKS52YWwoKSkpO1xuICB9KTtcblxuZnVuY3Rpb24gZ2V0RGF0ZSh2YWwpIHtcbiAgdmFyIGRhdGU7XG4gIHRyeSB7XG4gICAgZGF0ZSA9ICQuZGF0ZXBpY2tlci5wYXJzZURhdGUoZGF0ZUZvcm1hdCwgdmFsKTtcbiAgfSBjYXRjaChlcnJvcil7XG4gICAgZGF0ZSA9IG51bGw7XG4gIH1cblxuICByZXR1cm4gZGF0ZTtcbn1cblxuXG4kKCcjcmVmcmVzaCcpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgbG9jYXRpb24uaHJlZiA9IGdlbmVyYXRlVXJsKHsncyc6ICQoJyNzdGFydF9kYXRlJykudmFsKCksXG4gICAgICAgJ2UnOiAkKCcjZW5kX2RhdGUnKS52YWwoKX0pO1xufSk7XG5cbmZ1bmN0aW9uIHJlbmRlclNwYXJrbGluZXMoKSB7XG4gICAgdmFyIGhlaWdodCA9IDUwO1xuICAgIHZhciB3aWR0aCA9IDMwMDtcbiAgICB2YXIgeF92YWx1ZXMgPSAkKCcjc3BhcmsteC12YWx1ZXMnKS5hdHRyKCd2YWx1ZXMnKS5zcGxpdCgnLCcpO1xuICAgICQoJy5zcGFya2xpbmVzJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgJCh0aGlzKS5zcGFya2xpbmUoJ2h0bWwnLCB7XG4gICAgICAgICAgICB0eXBlOidsaW5lJyxcbiAgICAgICAgICAgIGhlaWdodDpoZWlnaHQsXG4gICAgICAgICAgICB3aWR0aDp3aWR0aCxcbiAgICAgICAgICAgIHRvb2x0aXBGb3JtYXR0ZXI6IGZ1bmN0aW9uKHNwYXJrbGluZSwgb3B0aW9ucywgZmllbGRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBmaWVsZHMueSA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHhfdmFsdWVzW2ZpZWxkcy5vZmZzZXRdICsgJzxiciAvPicgKyBmaWVsZHMudmFsdWU7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHhfdmFsdWVzW2ZpZWxkcy5vZmZzZXRdICsgJzxiciAvPicgKyBmaWVsZHMueTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH0pO1xufVxuXG5cbnJlbmRlclNwYXJrbGluZXMoKTtcblxuXG59KTsiXSwiZmlsZSI6Im1vbml0b3IvbW9uaXRvcl9icmFuZF9pdGVtcy5qcyJ9
