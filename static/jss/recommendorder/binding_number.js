(function(){
    var now_url = window.location.href;
    var customer_id = Number(now_url.match(/(customer\/)\d+\//)[0].split("/")[1]);
    $.ajax({
        url: "/api/v1.1/recommendorder/userphone",
        type: 'get',
        success: function(data){
            if(data.msg == null){
                tel = 0;
                $('.isbinding').attr('src','/static/images/recommendorder/binding_false.png');
                $('.binding-status').text('您目前还未绑定手机号');
                $('.binding-number-btn').text('绑定手机号');
            }else{
                tel = data.msg;
                $('.isbinding').attr('src','/static/images/recommendorder/binding_true.png');
                $('.binding-status').text('您的手机号' + data.msg);
                $('.binding-number-btn').text('更换手机号');
            }
            $('.binding-number-btn').on('click',function(){
                    window.location.href = '/recommendorder/customer/' + customer_id + '/change-number/' + tel;
            });
        }
    });
    $('.top-back-con').on('click',function() {
        window.location.href = '/recommendorder/customer/' + customer_id + '/setting';
    });
})()
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9iaW5kaW5nX251bWJlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtcbiAgICB2YXIgbm93X3VybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgIHZhciBjdXN0b21lcl9pZCA9IE51bWJlcihub3dfdXJsLm1hdGNoKC8oY3VzdG9tZXJcXC8pXFxkK1xcLy8pWzBdLnNwbGl0KFwiL1wiKVsxXSk7XG4gICAgJC5hamF4KHtcbiAgICAgICAgdXJsOiBcIi9hcGkvdjEuMS9yZWNvbW1lbmRvcmRlci91c2VycGhvbmVcIixcbiAgICAgICAgdHlwZTogJ2dldCcsXG4gICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgaWYoZGF0YS5tc2cgPT0gbnVsbCl7XG4gICAgICAgICAgICAgICAgdGVsID0gMDtcbiAgICAgICAgICAgICAgICAkKCcuaXNiaW5kaW5nJykuYXR0cignc3JjJywnL3N0YXRpYy9pbWFnZXMvcmVjb21tZW5kb3JkZXIvYmluZGluZ19mYWxzZS5wbmcnKTtcbiAgICAgICAgICAgICAgICAkKCcuYmluZGluZy1zdGF0dXMnKS50ZXh0KCfmgqjnm67liY3ov5jmnKrnu5HlrprmiYvmnLrlj7cnKTtcbiAgICAgICAgICAgICAgICAkKCcuYmluZGluZy1udW1iZXItYnRuJykudGV4dCgn57uR5a6a5omL5py65Y+3Jyk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB0ZWwgPSBkYXRhLm1zZztcbiAgICAgICAgICAgICAgICAkKCcuaXNiaW5kaW5nJykuYXR0cignc3JjJywnL3N0YXRpYy9pbWFnZXMvcmVjb21tZW5kb3JkZXIvYmluZGluZ190cnVlLnBuZycpO1xuICAgICAgICAgICAgICAgICQoJy5iaW5kaW5nLXN0YXR1cycpLnRleHQoJ+aCqOeahOaJi+acuuWPtycgKyBkYXRhLm1zZyk7XG4gICAgICAgICAgICAgICAgJCgnLmJpbmRpbmctbnVtYmVyLWJ0bicpLnRleHQoJ+abtOaNouaJi+acuuWPtycpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgJCgnLmJpbmRpbmctbnVtYmVyLWJ0bicpLm9uKCdjbGljaycsZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL3JlY29tbWVuZG9yZGVyL2N1c3RvbWVyLycgKyBjdXN0b21lcl9pZCArICcvY2hhbmdlLW51bWJlci8nICsgdGVsO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICB9KTtcbiAgICAkKCcudG9wLWJhY2stY29uJykub24oJ2NsaWNrJyxmdW5jdGlvbigpIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAnL3JlY29tbWVuZG9yZGVyL2N1c3RvbWVyLycgKyBjdXN0b21lcl9pZCArICcvc2V0dGluZyc7XG4gICAgfSk7XG59KSgpIl0sImZpbGUiOiJyZWNvbW1lbmRvcmRlci9iaW5kaW5nX251bWJlci5qcyJ9
