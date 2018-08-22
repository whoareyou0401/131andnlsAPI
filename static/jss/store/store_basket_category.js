function itemMap(series,xAxis,legend_data) {
var chart = echarts.init(document.getElementById('mainly_map'));
//参数设置
option = {
    color: ['#EE0000','#F0F8FF','#525252','#EEEE00','#EE9A00','#C6E2FF','#BCEE68','#F4F4F4','#EE5C42','#BCD2EE','#B7B7B7','#8B7500','#7AC5CD','#36648B','#EED5B7','#A020F0','#0000CD','#FFFF00','#EE00EE'],
    title: {
        text: '购物篮系数分类占比',
        left: 'center', 
           },
    tooltip: {    //提示框组件
        formatter:function(obj){
            var value = obj.value;
            if(value.length  >1){
                return  value[3]+'<br>'+
                        value[1]+'<br>'+
                        value[2]+'<br>';
            }
        },

    },
    legend: {     //图例组件
        data: legend_data,
        'top':'0%',
        'left':'90%',
        'itemWidth':10,
        'itemHeight':6,
        'itemGap':8,
        'orient':'vertical',
        formatter:function(value){
            var out = '';
            var size = 5;
            while(value.length>size)
            {
                out = out+value.slice(0,size)+'\n';
                value = value.slice(size);
            }
            out+=value;
            return out;
        },
    },
    xAxis: xAxis,     //直角坐标系 grid 中的 x 轴
   //     xAxis : {'type':'category','axisLabel':{'interval':0,}},    
    yAxis: {       //直角坐标系 grid 中的 y 轴
        type: 'value',
        "axisLabel":{"formatter":'{value}个'},
        name:'数量',
    },
    series: series,      //系列列表
};

chart.setOption(option);   //参数设置方法
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzdG9yZS9zdG9yZV9iYXNrZXRfY2F0ZWdvcnkuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gaXRlbU1hcChzZXJpZXMseEF4aXMsbGVnZW5kX2RhdGEpIHtcbnZhciBjaGFydCA9IGVjaGFydHMuaW5pdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbmx5X21hcCcpKTtcbi8v5Y+C5pWw6K6+572uXG5vcHRpb24gPSB7XG4gICAgY29sb3I6IFsnI0VFMDAwMCcsJyNGMEY4RkYnLCcjNTI1MjUyJywnI0VFRUUwMCcsJyNFRTlBMDAnLCcjQzZFMkZGJywnI0JDRUU2OCcsJyNGNEY0RjQnLCcjRUU1QzQyJywnI0JDRDJFRScsJyNCN0I3QjcnLCcjOEI3NTAwJywnIzdBQzVDRCcsJyMzNjY0OEInLCcjRUVENUI3JywnI0EwMjBGMCcsJyMwMDAwQ0QnLCcjRkZGRjAwJywnI0VFMDBFRSddLFxuICAgIHRpdGxlOiB7XG4gICAgICAgIHRleHQ6ICfotK3niannr67ns7vmlbDliIbnsbvljaDmr5QnLFxuICAgICAgICBsZWZ0OiAnY2VudGVyJywgXG4gICAgICAgICAgIH0sXG4gICAgdG9vbHRpcDogeyAgICAvL+aPkOekuuahhue7hOS7tlxuICAgICAgICBmb3JtYXR0ZXI6ZnVuY3Rpb24ob2JqKXtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IG9iai52YWx1ZTtcbiAgICAgICAgICAgIGlmKHZhbHVlLmxlbmd0aCAgPjEpe1xuICAgICAgICAgICAgICAgIHJldHVybiAgdmFsdWVbM10rJzxicj4nK1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVbMV0rJzxicj4nK1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVbMl0rJzxicj4nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuXG4gICAgfSxcbiAgICBsZWdlbmQ6IHsgICAgIC8v5Zu+5L6L57uE5Lu2XG4gICAgICAgIGRhdGE6IGxlZ2VuZF9kYXRhLFxuICAgICAgICAndG9wJzonMCUnLFxuICAgICAgICAnbGVmdCc6JzkwJScsXG4gICAgICAgICdpdGVtV2lkdGgnOjEwLFxuICAgICAgICAnaXRlbUhlaWdodCc6NixcbiAgICAgICAgJ2l0ZW1HYXAnOjgsXG4gICAgICAgICdvcmllbnQnOid2ZXJ0aWNhbCcsXG4gICAgICAgIGZvcm1hdHRlcjpmdW5jdGlvbih2YWx1ZSl7XG4gICAgICAgICAgICB2YXIgb3V0ID0gJyc7XG4gICAgICAgICAgICB2YXIgc2l6ZSA9IDU7XG4gICAgICAgICAgICB3aGlsZSh2YWx1ZS5sZW5ndGg+c2l6ZSlcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBvdXQgPSBvdXQrdmFsdWUuc2xpY2UoMCxzaXplKSsnXFxuJztcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnNsaWNlKHNpemUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3V0Kz12YWx1ZTtcbiAgICAgICAgICAgIHJldHVybiBvdXQ7XG4gICAgICAgIH0sXG4gICAgfSxcbiAgICB4QXhpczogeEF4aXMsICAgICAvL+ebtOinkuWdkOagh+ezuyBncmlkIOS4reeahCB4IOi9tFxuICAgLy8gICAgIHhBeGlzIDogeyd0eXBlJzonY2F0ZWdvcnknLCdheGlzTGFiZWwnOnsnaW50ZXJ2YWwnOjAsfX0sICAgIFxuICAgIHlBeGlzOiB7ICAgICAgIC8v55u06KeS5Z2Q5qCH57O7IGdyaWQg5Lit55qEIHkg6L20XG4gICAgICAgIHR5cGU6ICd2YWx1ZScsXG4gICAgICAgIFwiYXhpc0xhYmVsXCI6e1wiZm9ybWF0dGVyXCI6J3t2YWx1ZX3kuKonfSxcbiAgICAgICAgbmFtZTon5pWw6YePJyxcbiAgICB9LFxuICAgIHNlcmllczogc2VyaWVzLCAgICAgIC8v57O75YiX5YiX6KGoXG59O1xuXG5jaGFydC5zZXRPcHRpb24ob3B0aW9uKTsgICAvL+WPguaVsOiuvue9ruaWueazlVxufVxuIl0sImZpbGUiOiJzdG9yZS9zdG9yZV9iYXNrZXRfY2F0ZWdvcnkuanMifQ==
