function fillData(){
    var page = $(".select-page").val() || 1;
    var arg = $(".search input").val();
    var sort = $("th .ascending").parent().attr("value") || $("th .descending").parent().attr("value");
    var order = $(".ascending").attr("class") || $(".descending").attr("class");
    if ($.trim(arg) !== ""){
        page = 1;
    }

    if($(".star").attr("value")=='main'){
        arg = 'is_mainline'
    }

    $.ajax({
        url: "/api/v1.0/dailystatement/goods",
        data: {"page":page, "arg":arg, "sort": sort, "order": order},
        type: "GET",
        success: function (data) {
            if (data.success == 1) {
                $(".pagination p span").eq(0).text(data.data.pages);
                $(".pagination p span").eq(1).text(data.data.count);
                $(".select-page option").remove();
                for (var j = 1; j <= data.data.pages; j++){
                    $(".select-page").append("<option value="+j+">第" + num2Chinese(j) + "页</option>");
                }
                $(".select-page").val(page);
                var newRow = "<tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>";
                $("table tbody tr").remove();
                for (var i = 0; i < data.data.data.length; i++) {
                    $("table tbody").append(newRow);
                    ii = i + 1
                    var name = data.data.data[i].name || '无';
                    var barcode = data.data.data[i].barcode || '无';
                    var price = data.data.data[i].price || 0;
                    var commission = data.data.data[i].commission || 0;
                    var is_mainline = data.data.data[i].is_mainline;
                    var mainline = ''
                    if(is_mainline){
                        mainline = '<img class="mainline" src="/static/images/dailystatement/star_main.png" alt="1">'
                    }
                    else{
                        mainline = '<img class="mainline" src="/static/images/dailystatement/star.png" alt="0">'
                    }
                    $("table tr:eq(" + ii + ")").attr("value", data.data.data[i].id);
                    $("table tr:eq(" + ii + ") td:eq(0)").html('<input class="checkbox" type="checkbox">');
                    $("table tr:eq(" + ii + ") td:eq(1)").html(mainline);
                    $("table tr:eq(" + ii + ") td:eq(2)").text(name)                    
                    $("table tr:eq(" + ii + ") td:eq(3)").text(barcode);
                    $("table tr:eq(" + ii + ") td:eq(4)").text(price);
                    $("table tr:eq(" + ii + ") td:eq(5)").text(commission);
                }
                if($(".checkbox_all").is(':checked')){
                    $(".checkbox").prop("checked","checked");
                }
                else{
                    $(".checkbox").removeAttr("checked");
                }
                setTbaleWidth();
            }else {
                location.href = "/logout";
            }
        }
    });
}

function insRow()
{
  var x=document.getElementById('myTable').insertRow(1)
  var a=x.insertCell(0)
  var b=x.insertCell(1)
  var c=x.insertCell(2)
  var d=x.insertCell(3)
  var e=x.insertCell(4)
  var f=x.insertCell(5)
  c.innerHTML="<input class='require'>"
  d.innerHTML="<input class='require'>"
  e.innerHTML="<input class='require'>"
  f.innerHTML="<input class='require'>"
  a.innerHTML='<img class="sure" src="/static/images/dailystatement/ic_tick.png" alt="">'
  b.innerHTML='<img class="cancel" src="/static/images/dailystatement/close.png" alt="">'
}


$("tbody").on('click', '.sure', function(){
    setupCSRF();
    var flag = check_input()
    if(flag==0){
        var name = $(this).parent().parent().children('td').children('input')[0].value
        var barcode = $(this).parent().parent().children('td').children('input')[1].value
        var price = $(this).parent().parent().children('td').children('input')[2].value
        var commission = $(this).parent().parent().children('td').children('input')[3].value
        var goods_id = $(this).parent().parent().attr('value');
        console.log(name,barcode,goods_id)
        $.ajax({
            url: "/api/v1.0/dailystatement/goods",
            data: {"name":name, "barcode":barcode, "price": price, "commission": commission, "goods_id":goods_id},
            type: "POST",
            success: function (data) {
                
            }
        });
    }
    else{
        alert('error')
    }
   
        
});

$("tbody").on('click', '.cancel', function(){
    $(this).parent().parent().remove();
});

$("tbody").on('dblclick','tr',function(){
    var td = $(this).children('td');
    var tick = '<img class="sure" src="/static/images/dailystatement/ic_tick.png" alt="">';
    var cancel = '<img class="cancel" src="/static/images/dailystatement/close.png" alt="">';
    var input = "<input class='require'"
    td.eq(0).html(cancel);
    td.eq(1).html(tick);
    td.eq(2).html(input+'value="'+td.eq(2).text()+'">');
    td.eq(3).html(input+'value="'+td.eq(3).text()+'">');
    td.eq(4).html(input+'value="'+td.eq(4).text()+'">');
    td.eq(5).html(input+'value="'+td.eq(5).text()+'">');
});

$(document).ready(function(){
    setupCSRF();
    $(".sidebar li").eq(3).addClass("active").siblings().removeClass("active");
    var d = new Date();
    var start_time = d.getFullYear()+"-"+(d.getMonth()+1)+"-1";
    var end_time = d.getFullYear()+"-"+(d.getMonth()+1)+"-"+d.getDate();
    $("#startTime").attr("value",start_time);
    $("#endTime").attr("value",end_time);
    fillData();
    
    $(".select-page").change(function(){
        fillData();
    });
    $(".page-turing.prev").click(function(){
        if ($(".select-page").val() == 1)
            return;
        $(".select-page").val($(".select-page").val() - 1);
        fillData();
    });
    $(".page-turing.next").click(function(){
        if ($(".select-page").val() == $(".select-page option").length)
        {
            return;
        }
        $(".select-page").val(Number($(".select-page").val()) + 1);
        fillData();
    });
    $(".add-image:eq(0)").click(function(){
        del_table("goods")
    });
    $(".add-image:eq(1)").click(function(){
            insRow();
        });

    $(".search img").click(function(){
        if ($.trim($(".search input").val()) !== ""){
            fillData();
        }
    });

    $(".search input").keydown(function(event){
        if (event.which == 13){
            fillData();
        }
    });

    $("table").tablesort({func: function(){fillData();}});

    $(".download").click(function(){
        $("table").tableExport({
            headings: true,
            fileName: "stores",
            formats: ["csv"],
            position: "bottom",
            ignoreCSS: "[style*='display: none']"
        });
    });    

    $('.table-border').scroll(function() {
        var _left = $(this).scrollLeft();
        $('table th').eq(0).css('left', _left);
        $('table th').eq(1).css('left', _left);
        $('table th').eq(2).css('left', _left);
        $('table th').eq(3).css('left', _left).addClass('box-shadow');
        $('table td:nth-child(1)').css('left', _left);
        $('table td:nth-child(2)').css('left', _left);
        $('table td:nth-child(3)').css('left', _left);
        $('table td:nth-child(4)').css('left', _left).addClass('box-shadow');
        if (Number($(this).scrollLeft()) === 0) {
            $('table th').eq(3).removeClass('box-shadow');
            $('table td:nth-child(4)').removeClass('box-shadow');
        }
    });

    $(".star").click(function(){
        main_src = "/static/images/dailystatement/big_star_main.png"
        all_src = "/static/images/dailystatement/big_star.png"
        var val = $(this).attr('value');
        if(val == 'all'){
            $(this).children('img').eq(0).attr("src",main_src);
            $(this).attr('value','main');
            $(".search input").attr('value','');
        }
        else{
            $(this).children('img').eq(0).attr("src",all_src);
            $(this).attr('value','all');
        }
        fillData();
    });

    $(".checkbox_all").click(function(){
        if($(this).is(':checked')){
            $(".checkbox").prop("checked","checked");
        }
        else{
            $(".checkbox").removeAttr("checked");
        }
    });
    
    $("tbody").on('click', '.mainline', function(){
        var flag = $(this).attr("alt");
        true_src = "/static/images/dailystatement/star_main.png"
        false_src = "/static/images/dailystatement/star.png"
        if(flag == 0){
            $(this).attr("src",true_src);
            $(this).attr("alt",1);
            flag = 1;
        }
        else{
            $(this).attr("src",false_src);
            $(this).attr("alt",0);
            flag = 0;
        }
        goods_id = $(this).parent().parent().attr('value');
        $.ajax({
                url: "/api/v1.0/dailystatement/goods",
                data: {"is_mainline":flag, "goods_id":goods_id},
                type: "PATCH",
                success: function (data) {
                    
                }
            });
    });
});