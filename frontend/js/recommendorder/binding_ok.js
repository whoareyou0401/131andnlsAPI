(function(){
    var now_url = window.location.href;
    var customer_id = Number(now_url.match(/(customer\/)\d+\//)[0].split("/")[1]); 
    var new_tel = Number(now_url.split('binding-ok/')[1]);
    $('.new-tel').text(new_tel);
    $('.top-back-con').on('click',function(){
        window.location.href = '/recommendorder/customer/' + customer_id + '/setting';
    });
})()