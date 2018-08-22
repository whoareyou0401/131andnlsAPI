function itemMap(series,xAxis,markPoint) {
var chart = echarts.init(document.getElementById('mainly_map'));
//参数设置
option = {
        title: {
               text: '价格带（有过销售）',
               left: 'center', 
               },
        color: ['#3398DB'],
        legend: {     //图例组件
            data: ['数量'],
            right:'10%',
        },
        tooltip: {    //提示框组件
            trigger: 'axis'
        },
        xAxis: xAxis,     //直角坐标系 grid 中的 x 轴
        yAxis: {       //直角坐标系 grid 中的 y 轴
            type: 'value',
            "axisLabel":{"formatter":'{value}个'},
            name:'数量',
        },
        series: series,      //系列列表
};

chart.setOption(option);   //参数设置方法
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzdG9yZS9zdG9yZV9wcmljZXMuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gaXRlbU1hcChzZXJpZXMseEF4aXMsbWFya1BvaW50KSB7XG52YXIgY2hhcnQgPSBlY2hhcnRzLmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW5seV9tYXAnKSk7XG4vL+WPguaVsOiuvue9rlxub3B0aW9uID0ge1xuICAgICAgICB0aXRsZToge1xuICAgICAgICAgICAgICAgdGV4dDogJ+S7t+agvOW4pu+8iOaciei/h+mUgOWUru+8iScsXG4gICAgICAgICAgICAgICBsZWZ0OiAnY2VudGVyJywgXG4gICAgICAgICAgICAgICB9LFxuICAgICAgICBjb2xvcjogWycjMzM5OERCJ10sXG4gICAgICAgIGxlZ2VuZDogeyAgICAgLy/lm77kvovnu4Tku7ZcbiAgICAgICAgICAgIGRhdGE6IFsn5pWw6YePJ10sXG4gICAgICAgICAgICByaWdodDonMTAlJyxcbiAgICAgICAgfSxcbiAgICAgICAgdG9vbHRpcDogeyAgICAvL+aPkOekuuahhue7hOS7tlxuICAgICAgICAgICAgdHJpZ2dlcjogJ2F4aXMnXG4gICAgICAgIH0sXG4gICAgICAgIHhBeGlzOiB4QXhpcywgICAgIC8v55u06KeS5Z2Q5qCH57O7IGdyaWQg5Lit55qEIHgg6L20XG4gICAgICAgIHlBeGlzOiB7ICAgICAgIC8v55u06KeS5Z2Q5qCH57O7IGdyaWQg5Lit55qEIHkg6L20XG4gICAgICAgICAgICB0eXBlOiAndmFsdWUnLFxuICAgICAgICAgICAgXCJheGlzTGFiZWxcIjp7XCJmb3JtYXR0ZXJcIjone3ZhbHVlfeS4qid9LFxuICAgICAgICAgICAgbmFtZTon5pWw6YePJyxcbiAgICAgICAgfSxcbiAgICAgICAgc2VyaWVzOiBzZXJpZXMsICAgICAgLy/ns7vliJfliJfooahcbn07XG5cbmNoYXJ0LnNldE9wdGlvbihvcHRpb24pOyAgIC8v5Y+C5pWw6K6+572u5pa55rOVXG59XG4iXSwiZmlsZSI6InN0b3JlL3N0b3JlX3ByaWNlcy5qcyJ9
