function itemMap(series,xAxis) {
var chart = echarts.init(document.getElementById('mainly_map'));
//参数设置
option = {
        color: ['#3398DB'],
        legend: {     //图例组件
            data: ['销售占比','购物篮系数'],
            right:'20%',
        },
        tooltip: {    //提示框组件
            trigger: 'axis',
            formatter: function(obj){
                       out = '日期:'+obj[0].name+'<br>'+
                             '销售占比:'+obj[0].value+'%<br>'+
                             '购物篮系数:'+obj[1].value;
                       return out;
            },
        },
        xAxis: xAxis,     //直角坐标系 grid 中的 x 轴
        yAxis: [       //直角坐标系 grid 中的 y 轴
            {
              name:'销售占比',
              type: 'value',
              axisLabel:{formatter:'{value}%'},
            },
            {
              name:'购物篮系数',
              type: 'value',
            },
        ],
        series: series,      //系列列表
};

chart.setOption(option);   //参数设置方法
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzdG9yZS9zdG9yZV9iYXNrZXRfc2FsZXMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gaXRlbU1hcChzZXJpZXMseEF4aXMpIHtcbnZhciBjaGFydCA9IGVjaGFydHMuaW5pdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWFpbmx5X21hcCcpKTtcbi8v5Y+C5pWw6K6+572uXG5vcHRpb24gPSB7XG4gICAgICAgIGNvbG9yOiBbJyMzMzk4REInXSxcbiAgICAgICAgbGVnZW5kOiB7ICAgICAvL+WbvuS+i+e7hOS7tlxuICAgICAgICAgICAgZGF0YTogWyfplIDllK7ljaDmr5QnLCfotK3niannr67ns7vmlbAnXSxcbiAgICAgICAgICAgIHJpZ2h0OicyMCUnLFxuICAgICAgICB9LFxuICAgICAgICB0b29sdGlwOiB7ICAgIC8v5o+Q56S65qGG57uE5Lu2XG4gICAgICAgICAgICB0cmlnZ2VyOiAnYXhpcycsXG4gICAgICAgICAgICBmb3JtYXR0ZXI6IGZ1bmN0aW9uKG9iail7XG4gICAgICAgICAgICAgICAgICAgICAgIG91dCA9ICfml6XmnJ86JytvYmpbMF0ubmFtZSsnPGJyPicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICfplIDllK7ljaDmr5Q6JytvYmpbMF0udmFsdWUrJyU8YnI+JytcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ+i0reeJqeevruezu+aVsDonK29ialsxXS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG91dDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0sXG4gICAgICAgIHhBeGlzOiB4QXhpcywgICAgIC8v55u06KeS5Z2Q5qCH57O7IGdyaWQg5Lit55qEIHgg6L20XG4gICAgICAgIHlBeGlzOiBbICAgICAgIC8v55u06KeS5Z2Q5qCH57O7IGdyaWQg5Lit55qEIHkg6L20XG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgIG5hbWU6J+mUgOWUruWNoOavlCcsXG4gICAgICAgICAgICAgIHR5cGU6ICd2YWx1ZScsXG4gICAgICAgICAgICAgIGF4aXNMYWJlbDp7Zm9ybWF0dGVyOid7dmFsdWV9JSd9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgbmFtZTon6LSt54mp56+u57O75pWwJyxcbiAgICAgICAgICAgICAgdHlwZTogJ3ZhbHVlJyxcbiAgICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHNlcmllczogc2VyaWVzLCAgICAgIC8v57O75YiX5YiX6KGoXG59O1xuXG5jaGFydC5zZXRPcHRpb24ob3B0aW9uKTsgICAvL+WPguaVsOiuvue9ruaWueazlVxufVxuIl0sImZpbGUiOiJzdG9yZS9zdG9yZV9iYXNrZXRfc2FsZXMuanMifQ==
