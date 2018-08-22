$.ajax({
		url:'/recommendorder/api/v1/question_answer?page_size=0',
		type:'get',
		dataType:'json',
		success:function(res){
			console.log(res.data);
			for(var i in res.data){
				var que_ans="<div class='help set_help_question_B1'><a class='help_question'><span>"+res.data[i].question+"</span>"+
				"<img src="+next+" class='qq'></a>"+
				"<div class='help_answer_con'><div class='help_answer'><p>"+res.data[i].answer+"</p>"+
				"</div></div></div>";
				$('.set-info').append(que_ans);
			}
		}
	});
$(document).ready(function(){
	$(document).on('click','.help_question',function(){
		if($(this).parents('.help').find('.help_answer_con').css('display')=='none'){
			$(this).find('.qq').css('transform','rotate(90deg)');			
			$(this).parents('.help').find('.help_answer_con').css('display','block');
		}else if($(this).parents('.help').find('.help_answer_con').css('display')=='block'){
			$(this).find('.qq').css('transform','rotate(0deg)');
			$(this).parents('.help').find('.help_answer_con').css('display','none');
		}
	});	
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9yZWNvbW1lbmRvcmRlcl9zZXR0aW5nX2hlbHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJC5hamF4KHtcblx0XHR1cmw6Jy9yZWNvbW1lbmRvcmRlci9hcGkvdjEvcXVlc3Rpb25fYW5zd2VyP3BhZ2Vfc2l6ZT0wJyxcblx0XHR0eXBlOidnZXQnLFxuXHRcdGRhdGFUeXBlOidqc29uJyxcblx0XHRzdWNjZXNzOmZ1bmN0aW9uKHJlcyl7XG5cdFx0XHRjb25zb2xlLmxvZyhyZXMuZGF0YSk7XG5cdFx0XHRmb3IodmFyIGkgaW4gcmVzLmRhdGEpe1xuXHRcdFx0XHR2YXIgcXVlX2Fucz1cIjxkaXYgY2xhc3M9J2hlbHAgc2V0X2hlbHBfcXVlc3Rpb25fQjEnPjxhIGNsYXNzPSdoZWxwX3F1ZXN0aW9uJz48c3Bhbj5cIityZXMuZGF0YVtpXS5xdWVzdGlvbitcIjwvc3Bhbj5cIitcblx0XHRcdFx0XCI8aW1nIHNyYz1cIituZXh0K1wiIGNsYXNzPSdxcSc+PC9hPlwiK1xuXHRcdFx0XHRcIjxkaXYgY2xhc3M9J2hlbHBfYW5zd2VyX2Nvbic+PGRpdiBjbGFzcz0naGVscF9hbnN3ZXInPjxwPlwiK3Jlcy5kYXRhW2ldLmFuc3dlcitcIjwvcD5cIitcblx0XHRcdFx0XCI8L2Rpdj48L2Rpdj48L2Rpdj5cIjtcblx0XHRcdFx0JCgnLnNldC1pbmZvJykuYXBwZW5kKHF1ZV9hbnMpO1xuXHRcdFx0fVxuXHRcdH1cblx0fSk7XG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuXHQkKGRvY3VtZW50KS5vbignY2xpY2snLCcuaGVscF9xdWVzdGlvbicsZnVuY3Rpb24oKXtcblx0XHRpZigkKHRoaXMpLnBhcmVudHMoJy5oZWxwJykuZmluZCgnLmhlbHBfYW5zd2VyX2NvbicpLmNzcygnZGlzcGxheScpPT0nbm9uZScpe1xuXHRcdFx0JCh0aGlzKS5maW5kKCcucXEnKS5jc3MoJ3RyYW5zZm9ybScsJ3JvdGF0ZSg5MGRlZyknKTtcdFx0XHRcblx0XHRcdCQodGhpcykucGFyZW50cygnLmhlbHAnKS5maW5kKCcuaGVscF9hbnN3ZXJfY29uJykuY3NzKCdkaXNwbGF5JywnYmxvY2snKTtcblx0XHR9ZWxzZSBpZigkKHRoaXMpLnBhcmVudHMoJy5oZWxwJykuZmluZCgnLmhlbHBfYW5zd2VyX2NvbicpLmNzcygnZGlzcGxheScpPT0nYmxvY2snKXtcblx0XHRcdCQodGhpcykuZmluZCgnLnFxJykuY3NzKCd0cmFuc2Zvcm0nLCdyb3RhdGUoMGRlZyknKTtcblx0XHRcdCQodGhpcykucGFyZW50cygnLmhlbHAnKS5maW5kKCcuaGVscF9hbnN3ZXJfY29uJykuY3NzKCdkaXNwbGF5Jywnbm9uZScpO1xuXHRcdH1cblx0fSk7XHRcbn0pO1xuIl0sImZpbGUiOiJyZWNvbW1lbmRvcmRlci9yZWNvbW1lbmRvcmRlcl9zZXR0aW5nX2hlbHAuanMifQ==
