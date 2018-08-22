(function(){
    var now_url = window.location.href;
    var customer_id = Number(now_url.match(/(customer\/)\d+\//)[0].split("/")[1]); 
    var new_tel = Number(now_url.split('binding-ok/')[1]);
    $('.new-tel').text(new_tel);
    $('.top-back-con').on('click',function(){
        window.location.href = '/recommendorder/customer/' + customer_id + '/setting';
    });
})()
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9iaW5kaW5nX29rLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe1xuICAgIHZhciBub3dfdXJsID0gd2luZG93LmxvY2F0aW9uLmhyZWY7XG4gICAgdmFyIGN1c3RvbWVyX2lkID0gTnVtYmVyKG5vd191cmwubWF0Y2goLyhjdXN0b21lclxcLylcXGQrXFwvLylbMF0uc3BsaXQoXCIvXCIpWzFdKTsgXG4gICAgdmFyIG5ld190ZWwgPSBOdW1iZXIobm93X3VybC5zcGxpdCgnYmluZGluZy1vay8nKVsxXSk7XG4gICAgJCgnLm5ldy10ZWwnKS50ZXh0KG5ld190ZWwpO1xuICAgICQoJy50b3AtYmFjay1jb24nKS5vbignY2xpY2snLGZ1bmN0aW9uKCl7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9yZWNvbW1lbmRvcmRlci9jdXN0b21lci8nICsgY3VzdG9tZXJfaWQgKyAnL3NldHRpbmcnO1xuICAgIH0pO1xufSkoKSJdLCJmaWxlIjoicmVjb21tZW5kb3JkZXIvYmluZGluZ19vay5qcyJ9
