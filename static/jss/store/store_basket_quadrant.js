function itemMap(series) {
var chart = echarts.init(document.getElementById('mainly_map'));
//参数设置
schema = [
         {'name':'basket','index':0,'text':'购物篮系数'}, 
         {'name':'count','index':1,'text':'购物篮数量'}, 
         {'name':'name','index':2,'text':'商品名称'}, 
         {'name':'sum_sales','index':3,'text':'销售量','unit':'个'}, 
         {'name':'price_avg','index':4,'text':'价格','unit':'元'}, 
         {'name':'sum_num','index':5,'text':'销售额','unit':'元'}, 
];
option = {
        title: {
               text: '购物篮系数－四象限图',
               left: 'center', 
               },
        color: ['#3398DB'],
        tooltip: {    //提示框组件
            formatter:function(obj){
                var value = obj.value;
                if(value.length  >1){
                    return schema[2].text + ':' + value[2]+'<br>'+
                        schema[3].text+':'+value[3]+schema[3].unit+'<br>' +
                        schema[4].text + ':' + value[4]+schema[4].unit+'<br>' +
                        schema[5].text+':'+value[5]+schema[5].unit+'<br>';
                }
            }
        },
        xAxis: {type:'value','splitLine':{'show':false},name:'购物篮系数'},     //直角坐标系 grid 中的 x 轴
        yAxis: {       //直角坐标系 grid 中的 y 轴
            type: 'value',
            'splitLine':{'show':false},
            "axisLabel":{"formatter":'{value}个'},
            name:'购物篮数量',
        },
        series: series,      //系列列表
};

chart.setOption(option);   //参数设置方法
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzdG9yZS9zdG9yZV9iYXNrZXRfcXVhZHJhbnQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gaXRlbU1hcChzZXJpZXMpIHtcbnZhciBjaGFydCA9IGVjaGFydHMuaW5pdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbmx5X21hcCcpKTtcbi8v5Y+C5pWw6K6+572uXG5zY2hlbWEgPSBbXG4gICAgICAgICB7J25hbWUnOidiYXNrZXQnLCdpbmRleCc6MCwndGV4dCc6J+i0reeJqeevruezu+aVsCd9LCBcbiAgICAgICAgIHsnbmFtZSc6J2NvdW50JywnaW5kZXgnOjEsJ3RleHQnOifotK3niannr67mlbDph48nfSwgXG4gICAgICAgICB7J25hbWUnOiduYW1lJywnaW5kZXgnOjIsJ3RleHQnOifllYblk4HlkI3np7AnfSwgXG4gICAgICAgICB7J25hbWUnOidzdW1fc2FsZXMnLCdpbmRleCc6MywndGV4dCc6J+mUgOWUrumHjycsJ3VuaXQnOifkuKonfSwgXG4gICAgICAgICB7J25hbWUnOidwcmljZV9hdmcnLCdpbmRleCc6NCwndGV4dCc6J+S7t+agvCcsJ3VuaXQnOiflhYMnfSwgXG4gICAgICAgICB7J25hbWUnOidzdW1fbnVtJywnaW5kZXgnOjUsJ3RleHQnOifplIDllK7pop0nLCd1bml0Jzon5YWDJ30sIFxuXTtcbm9wdGlvbiA9IHtcbiAgICAgICAgdGl0bGU6IHtcbiAgICAgICAgICAgICAgIHRleHQ6ICfotK3niannr67ns7vmlbDvvI3lm5vosaHpmZDlm74nLFxuICAgICAgICAgICAgICAgbGVmdDogJ2NlbnRlcicsIFxuICAgICAgICAgICAgICAgfSxcbiAgICAgICAgY29sb3I6IFsnIzMzOThEQiddLFxuICAgICAgICB0b29sdGlwOiB7ICAgIC8v5o+Q56S65qGG57uE5Lu2XG4gICAgICAgICAgICBmb3JtYXR0ZXI6ZnVuY3Rpb24ob2JqKXtcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBvYmoudmFsdWU7XG4gICAgICAgICAgICAgICAgaWYodmFsdWUubGVuZ3RoICA+MSl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzY2hlbWFbMl0udGV4dCArICc6JyArIHZhbHVlWzJdKyc8YnI+JytcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjaGVtYVszXS50ZXh0Kyc6Jyt2YWx1ZVszXStzY2hlbWFbM10udW5pdCsnPGJyPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NoZW1hWzRdLnRleHQgKyAnOicgKyB2YWx1ZVs0XStzY2hlbWFbNF0udW5pdCsnPGJyPicgK1xuICAgICAgICAgICAgICAgICAgICAgICAgc2NoZW1hWzVdLnRleHQrJzonK3ZhbHVlWzVdK3NjaGVtYVs1XS51bml0Kyc8YnI+JztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHhBeGlzOiB7dHlwZTondmFsdWUnLCdzcGxpdExpbmUnOnsnc2hvdyc6ZmFsc2V9LG5hbWU6J+i0reeJqeevruezu+aVsCd9LCAgICAgLy/nm7Top5LlnZDmoIfns7sgZ3JpZCDkuK3nmoQgeCDovbRcbiAgICAgICAgeUF4aXM6IHsgICAgICAgLy/nm7Top5LlnZDmoIfns7sgZ3JpZCDkuK3nmoQgeSDovbRcbiAgICAgICAgICAgIHR5cGU6ICd2YWx1ZScsXG4gICAgICAgICAgICAnc3BsaXRMaW5lJzp7J3Nob3cnOmZhbHNlfSxcbiAgICAgICAgICAgIFwiYXhpc0xhYmVsXCI6e1wiZm9ybWF0dGVyXCI6J3t2YWx1ZX3kuKonfSxcbiAgICAgICAgICAgIG5hbWU6J+i0reeJqeevruaVsOmHjycsXG4gICAgICAgIH0sXG4gICAgICAgIHNlcmllczogc2VyaWVzLCAgICAgIC8v57O75YiX5YiX6KGoXG59O1xuXG5jaGFydC5zZXRPcHRpb24ob3B0aW9uKTsgICAvL+WPguaVsOiuvue9ruaWueazlVxufVxuIl0sImZpbGUiOiJzdG9yZS9zdG9yZV9iYXNrZXRfcXVhZHJhbnQuanMifQ==
