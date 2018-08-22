$(document).ready(function() {
    $("input[class='upload']").click(function () {
        var index = layer.open({
            type: 2,
            title: "广告链接文件",
            skin: 'layui-layer-lan', //加上边框
            area: ['80%', '80%'], //宽高
            scrollbar: false,
            content: '/stores-ads/upload-file?item='+$(this).attr("id"),
            success: function(){
                // 判断文件后缀
                $('#file').on('change', function () {
                    // C:\fakepath\ (This is added for security reasons)
                    var upload_file = $(this).val().replace(/C:\\fakepath\\/i, '');
                    var point = upload_file.lastIndexOf('.');
                    var postfix = upload_file.substring(point,upload_file.length);
                    if (postfix != '.xlsx' && postfix != '.xls') {
                        alert('文件格式不正确，只支持"xlsx"或"xls"格式');
                        return false;
                    }
                });

                // 判断表单是否为空
                $('form').bind('submit', function() {
                    var judge = 0;
                    $('#file').each(function() {
                        if ($(this).val() === '' || $(this).val() === null || $(this).val() === undefined) {
                            judge ++;
                            $(this).css('border','1px solid red');
                        }else{
                            $(this).css('border','');
                        }
                    });

                    if ($('.visible').length <= 0) {
                        judge ++;
                        $('.search').css('border','1px solid red');
                    }else{
                        $(this).css('border','');
                    }

                    if (judge >= 1) {
                        console.log(judge);
                        alert('提交失败，请将信息填写完整');
                        return false;
                    }else{
                        alert('提交成功');
                    }
                });
            },
            end:function(){
                window.location.reload();
            },
        });
    });
});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJjb21tZXJjaWFsL3VwbG9hZF9leGNlbF9maWxlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgICQoXCJpbnB1dFtjbGFzcz0ndXBsb2FkJ11cIikuY2xpY2soZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgaW5kZXggPSBsYXllci5vcGVuKHtcbiAgICAgICAgICAgIHR5cGU6IDIsXG4gICAgICAgICAgICB0aXRsZTogXCLlub/lkYrpk77mjqXmlofku7ZcIixcbiAgICAgICAgICAgIHNraW46ICdsYXl1aS1sYXllci1sYW4nLCAvL+WKoOS4iui+ueahhlxuICAgICAgICAgICAgYXJlYTogWyc4MCUnLCAnODAlJ10sIC8v5a696auYXG4gICAgICAgICAgICBzY3JvbGxiYXI6IGZhbHNlLFxuICAgICAgICAgICAgY29udGVudDogJy9zdG9yZXMtYWRzL3VwbG9hZC1maWxlP2l0ZW09JyskKHRoaXMpLmF0dHIoXCJpZFwiKSxcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgLy8g5Yik5pat5paH5Lu25ZCO57yAXG4gICAgICAgICAgICAgICAgJCgnI2ZpbGUnKS5vbignY2hhbmdlJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICAvLyBDOlxcZmFrZXBhdGhcXCAoVGhpcyBpcyBhZGRlZCBmb3Igc2VjdXJpdHkgcmVhc29ucylcbiAgICAgICAgICAgICAgICAgICAgdmFyIHVwbG9hZF9maWxlID0gJCh0aGlzKS52YWwoKS5yZXBsYWNlKC9DOlxcXFxmYWtlcGF0aFxcXFwvaSwgJycpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcG9pbnQgPSB1cGxvYWRfZmlsZS5sYXN0SW5kZXhPZignLicpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcG9zdGZpeCA9IHVwbG9hZF9maWxlLnN1YnN0cmluZyhwb2ludCx1cGxvYWRfZmlsZS5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAocG9zdGZpeCAhPSAnLnhsc3gnICYmIHBvc3RmaXggIT0gJy54bHMnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbGVydCgn5paH5Lu25qC85byP5LiN5q2j56Gu77yM5Y+q5pSv5oyBXCJ4bHN4XCLmiJZcInhsc1wi5qC85byPJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIC8vIOWIpOaWreihqOWNleaYr+WQpuS4uuepulxuICAgICAgICAgICAgICAgICQoJ2Zvcm0nKS5iaW5kKCdzdWJtaXQnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGp1ZGdlID0gMDtcbiAgICAgICAgICAgICAgICAgICAgJCgnI2ZpbGUnKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCQodGhpcykudmFsKCkgPT09ICcnIHx8ICQodGhpcykudmFsKCkgPT09IG51bGwgfHwgJCh0aGlzKS52YWwoKSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAganVkZ2UgKys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jc3MoJ2JvcmRlcicsJzFweCBzb2xpZCByZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuY3NzKCdib3JkZXInLCcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCQoJy52aXNpYmxlJykubGVuZ3RoIDw9IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGp1ZGdlICsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnLnNlYXJjaCcpLmNzcygnYm9yZGVyJywnMXB4IHNvbGlkIHJlZCcpO1xuICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykuY3NzKCdib3JkZXInLCcnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmIChqdWRnZSA+PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhqdWRnZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbGVydCgn5o+Q5Lqk5aSx6LSl77yM6K+35bCG5L+h5oGv5aGr5YaZ5a6M5pW0Jyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ+aPkOS6pOaIkOWKnycpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZW5kOmZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgfSk7XG4gICAgfSk7XG59KTsiXSwiZmlsZSI6ImNvbW1lcmNpYWwvdXBsb2FkX2V4Y2VsX2ZpbGUuanMifQ==
