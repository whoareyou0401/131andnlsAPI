function fillData(){var t=$(".search input").val(),e=$(".select-page").val()||1;$.ajax({url:"/api/v1.0/dailystatement/work-checkin",data:{page:e,start_time:start_time,end_time:end_time,arg:t,type:type},type:"GET",success:function(t){if(1==t.success){$(".pagination p span").eq(0).text(t.data.pages),$(".pagination p span").eq(1).text(t.data.count),$(".select-page option").remove();for(var a=1;a<=t.data.pages;a++)$(".select-page").append("<option value="+a+">第"+num2Chinese(a)+"页</option>");$(".select-page").val(e);var i="<tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>";$("table tbody tr").remove();for(var d=0;d<t.data.data.length;d++){$("table tbody").append(i),ii=d+1;var l=t.data.data[d].date,n=t.data.data[d].guide||"无",o=t.data.data[d].store||"无",c=t.data.data[d].telephone||"无",r=t.data.data[d].work_time||"--:--",p=t.data.data[d].worked_time||"--:--",s=t.data.data[d].phone||"无";r||(r="--:--"),p||(p="--:--");var g=t.data.data[d].work_type;g=g?work_types[g]:"无";var u=t.data.data[d].operator_id;u=u?"已报":"未报",$("table tr:eq("+ii+") td:eq(0)").text(l),$("table tr:eq("+ii+") td:eq(1)").text(n),$("table tr:eq("+ii+") td:eq(2)").text(o),$("table tr:eq("+ii+") td:eq(3)").text(c),$("table tr:eq("+ii+") td:eq(4)").text(r),$("table tr:eq("+ii+") td:eq(5)").text(p),$("table tr:eq("+ii+") td:eq(6)").text(s),$("table tr:eq("+ii+") td:eq(7)").text(g),$("table tr:eq("+ii+") td:eq(8)").text(u)}}else location.href="/logout"}})}var type=0,work_types={0:"早",1:"中",2:"晚",3:"大",4:"休",5:"夜"},exception_types={0:"正常",1:"迟到",2:"早退",3:"旷工",4:"位置异常",5:"不足8小时",6:"休假",7:"未排班"};$(document).ready(function(){setupCSRF(),$(".ui.radio.checkbox").checkbox(),$(".ui.radio.checkbox").click(function(){type=$('input[type="radio"]:checked').attr("id"),fillData()}),$("#selection").dropdown(),$(".sidebar li").eq(1).addClass("active").siblings().removeClass("active"),get_today(),fillData(),$(".select-page").change(function(){fillData()}),$(".page-turing.prev").click(function(){1!=$(".select-page").val()&&($(".select-page").val($(".select-page").val()-1),fillData())}),$(".page-turing.next").click(function(){$(".select-page").val()!=$(".select-page option").length&&($(".select-page").val(Number($(".select-page").val())+1),fillData())}),$(".search i").click(function(){""!==$.trim($(".search input").val())&&fillData()}),$(".search input").keydown(function(t){13==t.which&&fillData()}),$(".download").click(function(){location.href="/api/v1.0/dailystatement/work-checkin?download=1&start_time="+start_time+"&end_time="+end_time+"&type="+type})});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRhaWx5c3RhdGVtZW50L2NoZWNraW4uanMiXSwibmFtZXMiOlsiZmlsbERhdGEiLCJhcmciLCIkIiwidmFsIiwicGFnZSIsImFqYXgiLCJ1cmwiLCJkYXRhIiwic3RhcnRfdGltZSIsImVuZF90aW1lIiwidHlwZSIsInN1Y2Nlc3MiLCJlcSIsInRleHQiLCJwYWdlcyIsImNvdW50IiwicmVtb3ZlIiwiaiIsImFwcGVuZCIsIm51bTJDaGluZXNlIiwibmV3Um93IiwiaSIsImxlbmd0aCIsImlpIiwiZGF0ZSIsImd1aWRlIiwic3RvcmUiLCJ0ZWxlcGhvbmUiLCJ3b3JrX3RpbWUiLCJ3b3JrZWRfdGltZSIsInBob25lIiwid29ya190eXBlIiwid29ya190eXBlcyIsInN0YXRlbWVudCIsIm9wZXJhdG9yX2lkIiwibG9jYXRpb24iLCJocmVmIiwiMCIsIjEiLCIyIiwiMyIsIjQiLCI1IiwiZXhjZXB0aW9uX3R5cGVzIiwiNiIsIjciLCJkb2N1bWVudCIsInJlYWR5Iiwic2V0dXBDU1JGIiwiY2hlY2tib3giLCJjbGljayIsImF0dHIiLCJkcm9wZG93biIsImFkZENsYXNzIiwic2libGluZ3MiLCJyZW1vdmVDbGFzcyIsImdldF90b2RheSIsImNoYW5nZSIsIk51bWJlciIsInRyaW0iLCJrZXlkb3duIiwiZXZlbnQiLCJ3aGljaCJdLCJtYXBwaW5ncyI6IkFBbUJBLFFBQVNBLFlBQ0wsR0FBSUMsR0FBTUMsRUFBRSxpQkFBaUJDLE1BR3pCQyxFQUFPRixFQUFFLGdCQUFnQkMsT0FBUyxDQUV0Q0QsR0FBRUcsTUFDRUMsSUFBSyx3Q0FDTEMsTUFDSUgsS0FBUUEsRUFDUkksV0FBY0EsV0FDZEMsU0FBWUEsU0FDWlIsSUFBT0EsRUFDUFMsS0FBUUEsTUFFWkEsS0FBTSxNQUNOQyxRQUFTLFNBQVVKLEdBQ2YsR0FBb0IsR0FBaEJBLEVBQUtJLFFBQWMsQ0FDbkJULEVBQUUsc0JBQXNCVSxHQUFHLEdBQUdDLEtBQUtOLEVBQUtBLEtBQUtPLE9BQzdDWixFQUFFLHNC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RUFBRSxnQkFBZ0JDLE9BQVMsR0FDeERILGNBR0pFLEVBQUUsYUFBYWdELE1BQU0sV0FDd0IsS0FBckNoRCxFQUFFeUQsS0FBS3pELEVBQUUsaUJBQWlCQyxRQUMxQkgsYUFJUkUsRUFBRSxpQkFBaUIwRCxRQUFRLFNBQVVDLEdBQ2QsSUFBZkEsRUFBTUMsT0FDTjlELGFBSVJFLEVBQUUsYUFBYWdELE1BQU0sV0FDakJmLFNBQVNDLEtBQU8sK0RBQWlFNUIsV0FBYSxhQUFlQyxTQUFXLFNBQVdDIiwiZmlsZSI6ImRhaWx5c3RhdGVtZW50L2NoZWNraW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgdHlwZSA9IDA7XG52YXIgd29ya190eXBlcyA9IHtcbiAgICAnMCc6ICfml6knLFxuICAgICcxJzogJ+S4rScsXG4gICAgJzInOiAn5pmaJyxcbiAgICAnMyc6ICflpKcnLFxuICAgICc0JzogJ+S8kScsXG4gICAgJzUnOiAn5aScJ1xufTtcbnZhciBleGNlcHRpb25fdHlwZXMgPSB7XG4gICAgJzAnOiAn5q2j5bi4JyxcbiAgICAnMSc6ICfov5/liLAnLFxuICAgICcyJzogJ+aXqemAgCcsXG4gICAgJzMnOiAn5pe35belJyxcbiAgICAnNCc6ICfkvY3nva7lvILluLgnLFxuICAgICc1JzogJ+S4jei2szjlsI/ml7YnLFxuICAgICc2JzogJ+S8keWBhycsXG4gICAgJzcnOiAn5pyq5o6S54+tJ1xufTtcbmZ1bmN0aW9uIGZpbGxEYXRhKCkge1xuICAgIHZhciBhcmcgPSAkKFwiLnNlYXJjaCBpbnB1dFwiKS52YWwoKTtcbiAgICAvL3ZhciBzb3J0ID0gJChcInRoIC5hc2NlbmRpbmdcIikucGFyZW50KCkuYXR0cihcInZhbHVlXCIpIHx8ICQoXCJ0aCAuZGVzY2VuZGluZ1wiKS5wYXJlbnQoKS5hdHRyKFwidmFsdWVcIik7XG4gICAgLy92YXIgb3JkZXIgPSAkKFwiLmFzY2VuZGluZ1wiKS5hdHRyKFwiY2xhc3NcIikgfHwgJChcIi5kZXNjZW5kaW5nXCIpLmF0dHIoXCJjbGFzc1wiKTtcbiAgICB2YXIgcGFnZSA9ICQoXCIuc2VsZWN0LXBhZ2VcIikudmFsKCkgfHwgMTtcblxuICAgICQuYWpheCh7XG4gICAgICAgIHVybDogXCIvYXBpL3YxLjAvZGFpbHlzdGF0ZW1lbnQvd29yay1jaGVja2luXCIsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIFwicGFnZVwiOiBwYWdlLFxuICAgICAgICAgICAgXCJzdGFydF90aW1lXCI6IHN0YXJ0X3RpbWUsXG4gICAgICAgICAgICBcImVuZF90aW1lXCI6IGVuZF90aW1lLFxuICAgICAgICAgICAgXCJhcmdcIjogYXJnLFxuICAgICAgICAgICAgXCJ0eXBlXCI6IHR5cGVcbiAgICAgICAgfSxcbiAgICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIGlmIChkYXRhLnN1Y2Nlc3MgPT0gMSkge1xuICAgICAgICAgICAgICAgICQoXCIucGFnaW5hdGlvbiBwIHNwYW5cIikuZXEoMCkudGV4dChkYXRhLmRhdGEucGFnZXMpO1xuICAgICAgICAgICAgICAgICQoXCIucGFnaW5hdGlvbiBwIHNwYW5cIikuZXEoMSkudGV4dChkYXRhLmRhdGEuY291bnQpO1xuICAgICAgICAgICAgICAgICQoXCIuc2VsZWN0LXBhZ2Ugb3B0aW9uXCIpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAxOyBqIDw9IGRhdGEuZGF0YS5wYWdlczsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICQoXCIuc2VsZWN0LXBhZ2VcIikuYXBwZW5kKFwiPG9wdGlvbiB2YWx1ZT1cIiArIGogKyBcIj7nrKxcIiArIG51bTJDaGluZXNlKGopICsgXCLpobU8L29wdGlvbj5cIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICQoXCIuc2VsZWN0LXBhZ2VcIikudmFsKHBhZ2UpO1xuICAgICAgICAgICAgICAgIHZhciBuZXdSb3cgPSBcIjx0cj48dGQ+PC90ZD48dGQ+PC90ZD48dGQ+PC90ZD48dGQ+PC90ZD48dGQ+PC90ZD48dGQ+PC90ZD48dGQ+PC90ZD48dGQ+PC90ZD48dGQ+PC90ZD48L3RyPlwiO1xuICAgICAgICAgICAgICAgICQoXCJ0YWJsZSB0Ym9keSB0clwiKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGRhdGEuZGF0YS5kYXRhLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgICQoXCJ0YWJsZSB0Ym9keVwiKS5hcHBlbmQobmV3Um93KTtcbiAgICAgICAgICAgICAgICAgICAgaWkgPSBpICsgMTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGUgPSBkYXRhLmRhdGEuZGF0YVtpXS5kYXRlO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZ3VpZGUgPSBkYXRhLmRhdGEuZGF0YVtpXS5ndWlkZSB8fCAn5pegJztcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0b3JlID0gZGF0YS5kYXRhLmRhdGFbaV0uc3RvcmUgfHwgJ+aXoCc7XG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZWxlcGhvbmUgPSBkYXRhLmRhdGEuZGF0YVtpXS50ZWxlcGhvbmUgfHwgJ+aXoCc7XG4gICAgICAgICAgICAgICAgICAgIHZhciB3b3JrX3RpbWUgPSBkYXRhLmRhdGEuZGF0YVtpXS53b3JrX3RpbWUgfHwgJy0tOi0tJztcbiAgICAgICAgICAgICAgICAgICAgdmFyIHdvcmtlZF90aW1lID0gZGF0YS5kYXRhLmRhdGFbaV0ud29ya2VkX3RpbWUgfHwgJy0tOi0tJztcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBob25lID0gZGF0YS5kYXRhLmRhdGFbaV0ucGhvbmUgfHwgJ+aXoCc7XG4gICAgICAgICAgICAgICAgICAgIGlmICghd29ya190aW1lKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdvcmtfdGltZSA9ICctLTotLSc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCF3b3JrZWRfdGltZSl7XG4gICAgICAgICAgICAgICAgICAgICAgICB3b3JrZWRfdGltZSA9ICctLTotLSc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdmFyIHdvcmtfdHlwZSA9IGRhdGEuZGF0YS5kYXRhW2ldLndvcmtfdHlwZTtcbiAgICAgICAgICAgICAgICAgICAgLy92YXIgbGVhdmVfdHlwZSA9IGRhdGEuZGF0YS5kYXRhW2ldLmxlYXZlX3R5cGUgfHwgJ+aXoCc7XG4gICAgICAgICAgICAgICAgICAgIGlmKHdvcmtfdHlwZSl7XG4gICAgICAgICAgICAgICAgICAgICAgIHdvcmtfdHlwZSA9IHdvcmtfdHlwZXNbd29ya190eXBlXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgd29ya190eXBlID0gJ+aXoCdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB2YXIgc3RhdGVtZW50ID0gZGF0YS5kYXRhLmRhdGFbaV0ub3BlcmF0b3JfaWQ7XG4gICAgICAgICAgICAgICAgICAgIGlmKHN0YXRlbWVudCl7XG4gICAgICAgICAgICAgICAgICAgICAgIHN0YXRlbWVudCA9ICflt7LmiqUnO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RhdGVtZW50ID0gJ+acquaKpSc7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgJChcInRhYmxlIHRyOmVxKFwiICsgaWkgKyBcIikgdGQ6ZXEoMClcIikudGV4dChkYXRlKTtcbiAgICAgICAgICAgICAgICAgICAgJChcInRhYmxlIHRyOmVxKFwiICsgaWkgKyBcIikgdGQ6ZXEoMSlcIikudGV4dChndWlkZSk7XG4gICAgICAgICAgICAgICAgICAgICQoXCJ0YWJsZSB0cjplcShcIiArIGlpICsgXCIpIHRkOmVxKDIpXCIpLnRleHQoc3RvcmUpO1xuICAgICAgICAgICAgICAgICAgICAkKFwidGFibGUgdHI6ZXEoXCIgKyBpaSArIFwiKSB0ZDplcSgzKVwiKS50ZXh0KHRlbGVwaG9uZSk7XG4gICAgICAgICAgICAgICAgICAgICQoXCJ0YWJsZSB0cjplcShcIiArIGlpICsgXCIpIHRkOmVxKDQpXCIpLnRleHQod29ya190aW1lKTtcbiAgICAgICAgICAgICAgICAgICAgJChcInRhYmxlIHRyOmVxKFwiICsgaWkgKyBcIikgdGQ6ZXEoNSlcIikudGV4dCh3b3JrZWRfdGltZSk7XG4gICAgICAgICAgICAgICAgICAgICQoXCJ0YWJsZSB0cjplcShcIiArIGlpICsgXCIpIHRkOmVxKDYpXCIpLnRleHQocGhvbmUpO1xuICAgICAgICAgICAgICAgICAgICAkKFwidGFibGUgdHI6ZXEoXCIgKyBpaSArIFwiKSB0ZDplcSg3KVwiKS50ZXh0KHdvcmtfdHlwZSk7XG4gICAgICAgICAgICAgICAgICAgICQoXCJ0YWJsZSB0cjplcShcIiArIGlpICsgXCIpIHRkOmVxKDgpXCIpLnRleHQoc3RhdGVtZW50KTtcbiAgICAgICAgICAgICAgICAgICAgLy8kKFwidGFibGUgdHI6ZXEoXCIgKyBpaSArIFwiKSB0ZDplcSg3KVwiKS50ZXh0KGxlYXZlX3R5cGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbG9jYXRpb24uaHJlZiA9IFwiL2xvZ291dFwiO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG59XG5cblxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24gKCkge1xuICAgIHNldHVwQ1NSRigpO1xuICAgICQoJy51aS5yYWRpby5jaGVja2JveCcpXG4gICAgICAgIC5jaGVja2JveCgpXG4gICAgO1xuXG4gICAgJCgnLnVpLnJhZGlvLmNoZWNrYm94JykuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICB0eXBlID0gJCgnaW5wdXRbdHlwZT1cInJhZGlvXCJdOmNoZWNrZWQnKS5hdHRyKFwiaWRcIik7XG4gICAgICAgIGZpbGxEYXRhKCk7XG4gICAgfSk7XG5cbiAgICAkKFwiI3NlbGVjdGlvblwiKS5kcm9wZG93bigpO1xuXG4gICAgJChcIi5zaWRlYmFyIGxpXCIpLmVxKDEpLmFkZENsYXNzKFwiYWN0aXZlXCIpLnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgZ2V0X3RvZGF5KCk7XG4gICAgZmlsbERhdGEoKTtcblxuICAgICQoXCIuc2VsZWN0LXBhZ2VcIikuY2hhbmdlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgZmlsbERhdGEoKTtcbiAgICB9KTtcbiAgICAkKFwiLnBhZ2UtdHVyaW5nLnByZXZcIikuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICBpZiAoJChcIi5zZWxlY3QtcGFnZVwiKS52YWwoKSA9PSAxKVxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAkKFwiLnNlbGVjdC1wYWdlXCIpLnZhbCgkKFwiLnNlbGVjdC1wYWdlXCIpLnZhbCgpIC0gMSk7XG4gICAgICAgIGZpbGxEYXRhKCk7XG4gICAgfSk7XG4gICAgJChcIi5wYWdlLXR1cmluZy5uZXh0XCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCQoXCIuc2VsZWN0LXBhZ2VcIikudmFsKCkgPT0gJChcIi5zZWxlY3QtcGFnZSBvcHRpb25cIikubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgJChcIi5zZWxlY3QtcGFnZVwiKS52YWwoTnVtYmVyKCQoXCIuc2VsZWN0LXBhZ2VcIikudmFsKCkpICsgMSk7XG4gICAgICAgIGZpbGxEYXRhKCk7XG4gICAgfSk7XG5cbiAgICAkKFwiLnNlYXJjaCBpXCIpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgaWYgKCQudHJpbSgkKFwiLnNlYXJjaCBpbnB1dFwiKS52YWwoKSkgIT09IFwiXCIpIHtcbiAgICAgICAgICAgIGZpbGxEYXRhKCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgICQoXCIuc2VhcmNoIGlucHV0XCIpLmtleWRvd24oZnVuY3Rpb24gKGV2ZW50KSB7XG4gICAgICAgIGlmIChldmVudC53aGljaCA9PSAxMykge1xuICAgICAgICAgICAgZmlsbERhdGEoKTtcbiAgICAgICAgfVxuICAgIH0pO1xuXG4gICAgJChcIi5kb3dubG9hZFwiKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgIGxvY2F0aW9uLmhyZWYgPSBcIi9hcGkvdjEuMC9kYWlseXN0YXRlbWVudC93b3JrLWNoZWNraW4/ZG93bmxvYWQ9MSZzdGFydF90aW1lPVwiICsgc3RhcnRfdGltZSArIFwiJmVuZF90aW1lPVwiICsgZW5kX3RpbWUgKyBcIiZ0eXBlPVwiICsgdHlwZVxuICAgIH0pO1xufSk7Il19