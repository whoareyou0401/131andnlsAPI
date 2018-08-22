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
