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