(function() {
    var nowhref=window.location.href;
    console.log(nowhref);
    var nowhref1=nowhref.split('?')[1];
    var nowhref_arr=nowhref1.split('|');
    $('#address').val(chineseFromUtf8Url(nowhref_arr[0]));
    $('#store_name').val(chineseFromUtf8Url(nowhref_arr[1]));
    $('#tel').val(chineseFromUtf8Url(nowhref_arr[2]));
    $('#tel_people').val(chineseFromUtf8Url(nowhref_arr[3]));
    $('#ps').val(chineseFromUtf8Url(nowhref_arr[4]));
    // var code = chineseFromUtf8Url(nowhref_arr[5]);
    $('.opt_sure').on('click',function() {
        //    新增门店
        $.ajax({
            //提交数据的类型 POST GET
            type:"POST",
            //提交的网址
            url:"/api/v1.2/recommendorder/store",
            //提交的数据
            data:{
                "contact_phone": $('#tel').val(),
                "contact_name": $('#tel_people').val(),
                "address":$('#address').val(),
                "name":$('#store_name').val(),
                'csrfmiddlewaretoken': getCookie("csrftoken"),
                "remarks":$('#ps').val(),
                // "code":code,
                'lat':0,
                'lng':0
            },
            //返回数据的格式
            dataType:"json",
            //成功返回之后调用的函数
            success:function(data){
                if (data.code === 0) {
                    $('.is-tel').text('新增成功');
                    $('.tel-model').show();   
                    $('.sure').off('click').on('click',function() {
                        $('.tel-model').hide();
                        window.location.href='/recommendorder/salesman/inspection';
                    });
                } else {
                    $('.is-tel').text('新增失败');
                    $('.tel-model').show();   
                    $('.sure').off('click').on('click',function() {
                        $('.tel-model').hide();
                    });    
                }
            },
            //调用出错执行的函数
            error: function(){
                //请求出错处理
                alert('error');
            }
        });
    });
    $('.opt_cancel').on('click',function() {
        window.location.href='/recommendorder/new-store';
    });
})();
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJkaXNjb3ZlcnkvZGlzY292ZXJfc3RvcmVfYWRkX3N0b3JlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpIHtcbiAgICB2YXIgbm93aHJlZj13aW5kb3cubG9jYXRpb24uaHJlZjtcbiAgICBjb25zb2xlLmxvZyhub3docmVmKTtcbiAgICB2YXIgbm93aHJlZjE9bm93aHJlZi5zcGxpdCgnPycpWzFdO1xuICAgIHZhciBub3docmVmX2Fycj1ub3docmVmMS5zcGxpdCgnfCcpO1xuICAgICQoJyNhZGRyZXNzJykudmFsKGNoaW5lc2VGcm9tVXRmOFVybChub3docmVmX2FyclswXSkpO1xuICAgICQoJyNzdG9yZV9uYW1lJykudmFsKGNoaW5lc2VGcm9tVXRmOFVybChub3docmVmX2FyclsxXSkpO1xuICAgICQoJyN0ZWwnKS52YWwoY2hpbmVzZUZyb21VdGY4VXJsKG5vd2hyZWZfYXJyWzJdKSk7XG4gICAgJCgnI3RlbF9wZW9wbGUnKS52YWwoY2hpbmVzZUZyb21VdGY4VXJsKG5vd2hyZWZfYXJyWzNdKSk7XG4gICAgJCgnI3BzJykudmFsKGNoaW5lc2VGcm9tVXRmOFVybChub3docmVmX2Fycls0XSkpO1xuICAgIC8vIHZhciBjb2RlID0gY2hpbmVzZUZyb21VdGY4VXJsKG5vd2hyZWZfYXJyWzVdKTtcbiAgICAkKCcub3B0X3N1cmUnKS5vbignY2xpY2snLGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyAgICDmlrDlop7pl6jlupdcbiAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgIC8v5o+Q5Lqk5pWw5o2u55qE57G75Z6LIFBPU1QgR0VUXG4gICAgICAgICAgICB0eXBlOlwiUE9TVFwiLFxuICAgICAgICAgICAgLy/mj5DkuqTnmoTnvZHlnYBcbiAgICAgICAgICAgIHVybDpcIi9hcGkvdjEuMi9yZWNvbW1lbmRvcmRlci9zdG9yZVwiLFxuICAgICAgICAgICAgLy/mj5DkuqTnmoTmlbDmja5cbiAgICAgICAgICAgIGRhdGE6e1xuICAgICAgICAgICAgICAgIFwiY29udGFjdF9waG9uZVwiOiAkKCcjdGVsJykudmFsKCksXG4gICAgICAgICAgICAgICAgXCJjb250YWN0X25hbWVcIjogJCgnI3RlbF9wZW9wbGUnKS52YWwoKSxcbiAgICAgICAgICAgICAgICBcImFkZHJlc3NcIjokKCcjYWRkcmVzcycpLnZhbCgpLFxuICAgICAgICAgICAgICAgIFwibmFtZVwiOiQoJyNzdG9yZV9uYW1lJykudmFsKCksXG4gICAgICAgICAgICAgICAgJ2NzcmZtaWRkbGV3YXJldG9rZW4nOiBnZXRDb29raWUoXCJjc3JmdG9rZW5cIiksXG4gICAgICAgICAgICAgICAgXCJyZW1hcmtzXCI6JCgnI3BzJykudmFsKCksXG4gICAgICAgICAgICAgICAgLy8gXCJjb2RlXCI6Y29kZSxcbiAgICAgICAgICAgICAgICAnbGF0JzowLFxuICAgICAgICAgICAgICAgICdsbmcnOjBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvL+i/lOWbnuaVsOaNrueahOagvOW8j1xuICAgICAgICAgICAgZGF0YVR5cGU6XCJqc29uXCIsXG4gICAgICAgICAgICAvL+aIkOWKn+i/lOWbnuS5i+WQjuiwg+eUqOeahOWHveaVsFxuICAgICAgICAgICAgc3VjY2VzczpmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICBpZiAoZGF0YS5jb2RlID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJy5pcy10ZWwnKS50ZXh0KCfmlrDlop7miJDlip8nKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnLnRlbC1tb2RlbCcpLnNob3coKTsgICBcbiAgICAgICAgICAgICAgICAgICAgJCgnLnN1cmUnKS5vZmYoJ2NsaWNrJykub24oJ2NsaWNrJyxmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJy50ZWwtbW9kZWwnKS5oaWRlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZj0nL3JlY29tbWVuZG9yZGVyL3NhbGVzbWFuL2luc3BlY3Rpb24nO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAkKCcuaXMtdGVsJykudGV4dCgn5paw5aKe5aSx6LSlJyk7XG4gICAgICAgICAgICAgICAgICAgICQoJy50ZWwtbW9kZWwnKS5zaG93KCk7ICAgXG4gICAgICAgICAgICAgICAgICAgICQoJy5zdXJlJykub2ZmKCdjbGljaycpLm9uKCdjbGljaycsZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcudGVsLW1vZGVsJykuaGlkZSgpO1xuICAgICAgICAgICAgICAgICAgICB9KTsgICAgXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8v6LCD55So5Ye66ZSZ5omn6KGM55qE5Ye95pWwXG4gICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAvL+ivt+axguWHuumUmeWkhOeQhlxuICAgICAgICAgICAgICAgIGFsZXJ0KCdlcnJvcicpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAkKCcub3B0X2NhbmNlbCcpLm9uKCdjbGljaycsZnVuY3Rpb24oKSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmPScvcmVjb21tZW5kb3JkZXIvbmV3LXN0b3JlJztcbiAgICB9KTtcbn0pKCk7Il0sImZpbGUiOiJkaXNjb3ZlcnkvZGlzY292ZXJfc3RvcmVfYWRkX3N0b3JlLmpzIn0=
