$(document).ready(function(){$(".sidebar li").eq(1).addClass("active").siblings().removeClass("active")});var csrftoken=getCookie("csrftoken");Dropzone.autoDiscover=!1,$("#itemTable").dropzone({url:"/api/v1.0/dailystatement/excel",headers:{"X-CSRFToken":csrftoken},addRemoveLinks:!0,dictRemoveLinks:"x",dictCancelUpload:"x",acceptedFiles:".xlsx",params:{template_type:"item"},dictInvalidFileType:"你不能上传该类型文件,文件类型只能是*.xlsx",maxFiles:1}),$("#storeTable").dropzone({url:"/api/v1.0/dailystatement/excel",headers:{"X-CSRFToken":csrftoken},addRemoveLinks:!0,dictRemoveLinks:"x",dictCancelUpload:"x",acceptedFiles:".xlsx",params:{template_type:"store"},dictInvalidFileType:"你不能上传该类型文件,文件类型只能是*.xlsx",maxFiles:1}),$("#guideTable").dropzone({url:"/api/v1.0/dailystatement/excel",headers:{"X-CSRFToken":csrftoken},addRemoveLinks:!0,dictRemoveLinks:"x",dictCancelUpload:"x",acceptedFiles:".xlsx",params:{template_type:"guide"},dictInvalidFileType:"你不能上传该类型文件,文件类型只能是*.xlsx",dictMaxFilesExceeded:"一次只能上传一个文件，请点击Remove file后重传",maxFiles:1});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRhaWx5c3RhdGVtZW50L3VwbG9hZC5qcyJdLCJuYW1lcyI6WyIkIiwiZG9jdW1lbnQiLCJyZWFkeSIsImVxIiwiYWRkQ2xhc3MiLCJzaWJsaW5ncyIsInJlbW92ZUNsYXNzIiwiY3NyZnRva2VuIiwiZ2V0Q29va2llIiwiRHJvcHpvbmUiLCJhdXRvRGlzY292ZXIiLCJkcm9wem9uZSIsInVybCIsImhlYWRlcnMiLCJYLUNTUkZUb2tlbiIsImFkZFJlbW92ZUxpbmtzIiwiZGljdFJlbW92ZUxpbmtzIiwiZGljdENhbmNlbFVwbG9hZCIsImFjY2VwdGVkRmlsZXMiLCJwYXJhbXMiLCJ0ZW1wbGF0ZV90eXBlIiwiZGljdEludmFsaWRGaWxlVHlwZSIsIm1heEZpbGVzIiwiZGljdE1heEZpbGVzRXhjZWVkZWQiXSwibWFwcGluZ3MiOiJBQUFBQSxFQUFFQyxVQUFVQyxNQUFNLFdBQ2RGLEVBQUUsZUFBZUcsR0FBRyxHQUFHQyxTQUFTLFVBQVVDLFdBQVdDLFlBQVksV0FHckUsSUFBSUMsV0FBWUMsVUFBVSxZQUUxQkMsVUFBU0MsY0FBZSxFQUV4QlYsRUFBRSxjQUFjVyxVQUNaQyxJQUFLLGlDQUNMQyxTQUFXQyxjQUFnQlAsV0FDM0JRLGdCQUFnQixFQUNoQkMsZ0JBQWlCLElBQ2pCQyxpQkFBa0IsSUFDbEJDLGNBQWUsUUFDZkMsUUFBU0MsY0FBa0IsUUFDM0JDLG9CQUFxQiwyQkFDckJDLFNBQVMsSUFHYnRCLEVBQUUsZUFBZVcsVUFDYkMsSUFBSyxpQ0FDTEMsU0FBV0MsY0FBZ0JQLFdBQzNCUSxnQkFBZ0IsRUFDaEJDLGdCQUFpQixJQUNqQkMsaUJBQWtCLElBQ2xCQyxjQUFlLFFBQ2ZDLFFBQVNDLGNBQWtCLFNBQzNCQyxvQkFBcUIsMkJBQ3JCQyxTQUFTLElBR2J0QixFQUFFLGVBQWVXLFVBQ2JDLElBQUssaUNBQ0xDLFNBQVdDLGNBQWdCUCxXQUMzQlEsZ0JBQWdCLEVBQ2hCQyxnQkFBaUIsSUFDakJDLGlCQUFrQixJQUNsQkMsY0FBZSxRQUNmQyxRQUFTQyxjQUFrQixTQUMzQkMsb0JBQXFCLDJCQUNyQkUscUJBQXFCLCtCQUNyQkQsU0FBUyIsImZpbGUiOiJkYWlseXN0YXRlbWVudC91cGxvYWQuanMiLCJzb3VyY2VzQ29udGVudCI6WyIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICQoXCIuc2lkZWJhciBsaVwiKS5lcSgxKS5hZGRDbGFzcyhcImFjdGl2ZVwiKS5zaWJsaW5ncygpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xufSk7XG5cbnZhciBjc3JmdG9rZW4gPSBnZXRDb29raWUoJ2NzcmZ0b2tlbicpO1xuXG5Ecm9wem9uZS5hdXRvRGlzY292ZXIgPSBmYWxzZTtcblxuJChcIiNpdGVtVGFibGVcIikuZHJvcHpvbmUoe1xuICAgIHVybDogJy9hcGkvdjEuMC9kYWlseXN0YXRlbWVudC9leGNlbCcsXG4gICAgaGVhZGVyczogeyBcIlgtQ1NSRlRva2VuXCIgOiBjc3JmdG9rZW4gfSxcbiAgICBhZGRSZW1vdmVMaW5rczogdHJ1ZSxcbiAgICBkaWN0UmVtb3ZlTGlua3M6IFwieFwiLFxuICAgIGRpY3RDYW5jZWxVcGxvYWQ6IFwieFwiLFxuICAgIGFjY2VwdGVkRmlsZXM6IFwiLnhsc3hcIixcbiAgICBwYXJhbXM6IHtcInRlbXBsYXRlX3R5cGVcIiA6IFwiaXRlbVwifSxcbiAgICBkaWN0SW52YWxpZEZpbGVUeXBlOiBcIuS9oOS4jeiDveS4iuS8oOivpeexu+Wei+aWh+S7tizmlofku7bnsbvlnovlj6rog73mmK8qLnhsc3hcIixcbiAgICBtYXhGaWxlczoxLFxufSk7XG5cbiQoXCIjc3RvcmVUYWJsZVwiKS5kcm9wem9uZSh7XG4gICAgdXJsOiAnL2FwaS92MS4wL2RhaWx5c3RhdGVtZW50L2V4Y2VsJyxcbiAgICBoZWFkZXJzOiB7IFwiWC1DU1JGVG9rZW5cIiA6IGNzcmZ0b2tlbiB9LFxuICAgIGFkZFJlbW92ZUxpbmtzOiB0cnVlLFxuICAgIGRpY3RSZW1vdmVMaW5rczogXCJ4XCIsXG4gICAgZGljdENhbmNlbFVwbG9hZDogXCJ4XCIsXG4gICAgYWNjZXB0ZWRGaWxlczogXCIueGxzeFwiLFxuICAgIHBhcmFtczoge1widGVtcGxhdGVfdHlwZVwiIDogXCJzdG9yZVwifSxcbiAgICBkaWN0SW52YWxpZEZpbGVUeXBlOiBcIuS9oOS4jeiDveS4iuS8oOivpeexu+Wei+aWh+S7tizmlofku7bnsbvlnovlj6rog73mmK8qLnhsc3hcIixcbiAgICBtYXhGaWxlczoxXG59KTtcblxuJChcIiNndWlkZVRhYmxlXCIpLmRyb3B6b25lKHtcbiAgICB1cmw6ICcvYXBpL3YxLjAvZGFpbHlzdGF0ZW1lbnQvZXhjZWwnLFxuICAgIGhlYWRlcnM6IHsgXCJYLUNTUkZUb2tlblwiIDogY3NyZnRva2VuIH0sXG4gICAgYWRkUmVtb3ZlTGlua3M6IHRydWUsXG4gICAgZGljdFJlbW92ZUxpbmtzOiBcInhcIixcbiAgICBkaWN0Q2FuY2VsVXBsb2FkOiBcInhcIixcbiAgICBhY2NlcHRlZEZpbGVzOiBcIi54bHN4XCIsXG4gICAgcGFyYW1zOiB7XCJ0ZW1wbGF0ZV90eXBlXCIgOiBcImd1aWRlXCJ9LFxuICAgIGRpY3RJbnZhbGlkRmlsZVR5cGU6IFwi5L2g5LiN6IO95LiK5Lyg6K+l57G75Z6L5paH5Lu2LOaWh+S7tuexu+Wei+WPquiDveaYryoueGxzeFwiLFxuICAgIGRpY3RNYXhGaWxlc0V4Y2VlZGVkOlwi5LiA5qyh5Y+q6IO95LiK5Lyg5LiA5Liq5paH5Lu277yM6K+354K55Ye7UmVtb3ZlIGZpbGXlkI7ph43kvKBcIixcbiAgICBtYXhGaWxlczoxXG59KTsiXX0=