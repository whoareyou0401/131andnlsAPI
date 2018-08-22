$(document).ready(function(){
    $(".sidebar li").eq(1).addClass("active").siblings().removeClass("active");
});

var csrftoken = getCookie('csrftoken');

Dropzone.autoDiscover = false;

$("#itemTable").dropzone({
    url: '/api/v1.0/dailystatement/excel',
    headers: { "X-CSRFToken" : csrftoken },
    addRemoveLinks: true,
    dictRemoveLinks: "x",
    dictCancelUpload: "x",
    acceptedFiles: ".xlsx",
    params: {"template_type" : "item"},
    dictInvalidFileType: "你不能上传该类型文件,文件类型只能是*.xlsx",
    maxFiles:1,
});

$("#storeTable").dropzone({
    url: '/api/v1.0/dailystatement/excel',
    headers: { "X-CSRFToken" : csrftoken },
    addRemoveLinks: true,
    dictRemoveLinks: "x",
    dictCancelUpload: "x",
    acceptedFiles: ".xlsx",
    params: {"template_type" : "store"},
    dictInvalidFileType: "你不能上传该类型文件,文件类型只能是*.xlsx",
    maxFiles:1
});

$("#guideTable").dropzone({
    url: '/api/v1.0/dailystatement/excel',
    headers: { "X-CSRFToken" : csrftoken },
    addRemoveLinks: true,
    dictRemoveLinks: "x",
    dictCancelUpload: "x",
    acceptedFiles: ".xlsx",
    params: {"template_type" : "guide"},
    dictInvalidFileType: "你不能上传该类型文件,文件类型只能是*.xlsx",
    dictMaxFilesExceeded:"一次只能上传一个文件，请点击Remove file后重传",
    maxFiles:1
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJkYWlseXN0YXRlbWVudC91cGxvYWQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAkKFwiLnNpZGViYXIgbGlcIikuZXEoMSkuYWRkQ2xhc3MoXCJhY3RpdmVcIikuc2libGluZ3MoKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcbn0pO1xuXG52YXIgY3NyZnRva2VuID0gZ2V0Q29va2llKCdjc3JmdG9rZW4nKTtcblxuRHJvcHpvbmUuYXV0b0Rpc2NvdmVyID0gZmFsc2U7XG5cbiQoXCIjaXRlbVRhYmxlXCIpLmRyb3B6b25lKHtcbiAgICB1cmw6ICcvYXBpL3YxLjAvZGFpbHlzdGF0ZW1lbnQvZXhjZWwnLFxuICAgIGhlYWRlcnM6IHsgXCJYLUNTUkZUb2tlblwiIDogY3NyZnRva2VuIH0sXG4gICAgYWRkUmVtb3ZlTGlua3M6IHRydWUsXG4gICAgZGljdFJlbW92ZUxpbmtzOiBcInhcIixcbiAgICBkaWN0Q2FuY2VsVXBsb2FkOiBcInhcIixcbiAgICBhY2NlcHRlZEZpbGVzOiBcIi54bHN4XCIsXG4gICAgcGFyYW1zOiB7XCJ0ZW1wbGF0ZV90eXBlXCIgOiBcIml0ZW1cIn0sXG4gICAgZGljdEludmFsaWRGaWxlVHlwZTogXCLkvaDkuI3og73kuIrkvKDor6Xnsbvlnovmlofku7Ys5paH5Lu257G75Z6L5Y+q6IO95pivKi54bHN4XCIsXG4gICAgbWF4RmlsZXM6MSxcbn0pO1xuXG4kKFwiI3N0b3JlVGFibGVcIikuZHJvcHpvbmUoe1xuICAgIHVybDogJy9hcGkvdjEuMC9kYWlseXN0YXRlbWVudC9leGNlbCcsXG4gICAgaGVhZGVyczogeyBcIlgtQ1NSRlRva2VuXCIgOiBjc3JmdG9rZW4gfSxcbiAgICBhZGRSZW1vdmVMaW5rczogdHJ1ZSxcbiAgICBkaWN0UmVtb3ZlTGlua3M6IFwieFwiLFxuICAgIGRpY3RDYW5jZWxVcGxvYWQ6IFwieFwiLFxuICAgIGFjY2VwdGVkRmlsZXM6IFwiLnhsc3hcIixcbiAgICBwYXJhbXM6IHtcInRlbXBsYXRlX3R5cGVcIiA6IFwic3RvcmVcIn0sXG4gICAgZGljdEludmFsaWRGaWxlVHlwZTogXCLkvaDkuI3og73kuIrkvKDor6Xnsbvlnovmlofku7Ys5paH5Lu257G75Z6L5Y+q6IO95pivKi54bHN4XCIsXG4gICAgbWF4RmlsZXM6MVxufSk7XG5cbiQoXCIjZ3VpZGVUYWJsZVwiKS5kcm9wem9uZSh7XG4gICAgdXJsOiAnL2FwaS92MS4wL2RhaWx5c3RhdGVtZW50L2V4Y2VsJyxcbiAgICBoZWFkZXJzOiB7IFwiWC1DU1JGVG9rZW5cIiA6IGNzcmZ0b2tlbiB9LFxuICAgIGFkZFJlbW92ZUxpbmtzOiB0cnVlLFxuICAgIGRpY3RSZW1vdmVMaW5rczogXCJ4XCIsXG4gICAgZGljdENhbmNlbFVwbG9hZDogXCJ4XCIsXG4gICAgYWNjZXB0ZWRGaWxlczogXCIueGxzeFwiLFxuICAgIHBhcmFtczoge1widGVtcGxhdGVfdHlwZVwiIDogXCJndWlkZVwifSxcbiAgICBkaWN0SW52YWxpZEZpbGVUeXBlOiBcIuS9oOS4jeiDveS4iuS8oOivpeexu+Wei+aWh+S7tizmlofku7bnsbvlnovlj6rog73mmK8qLnhsc3hcIixcbiAgICBkaWN0TWF4RmlsZXNFeGNlZWRlZDpcIuS4gOasoeWPquiDveS4iuS8oOS4gOS4quaWh+S7tu+8jOivt+eCueWHu1JlbW92ZSBmaWxl5ZCO6YeN5LygXCIsXG4gICAgbWF4RmlsZXM6MVxufSk7Il0sImZpbGUiOiJkYWlseXN0YXRlbWVudC91cGxvYWQuanMifQ==
