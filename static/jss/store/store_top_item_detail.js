function itemMap(series,xAxis,lose_days,lose_dates,lose_count,item_name) {
var chart = echarts.init(document.getElementById('container'));
days = xAxis.data.length;
//参数设置
option = {
        title: {      //标题组件
            text: item_name,
            subtext: '缺货'+ lose_days + '天 损失'+lose_count+'元',
            x:'center'
        },
        legend: {     //图例组件
            data: ['本店销量', '历史销量'],
            right:'20%'
        },
        tooltip: {    //提示框组件
            trigger: 'axis'
        },
        toolbox: {     //工具栏
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: xAxis,     //直角坐标系 grid 中的 x 轴
        yAxis: {       //直角坐标系 grid 中的 y 轴
            type: 'value'
        },
        series: series,      //系列列表
};

chart.setOption(option);   //参数设置方法
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzdG9yZS9zdG9yZV90b3BfaXRlbV9kZXRhaWwuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gaXRlbU1hcChzZXJpZXMseEF4aXMsbG9zZV9kYXlzLGxvc2VfZGF0ZXMsbG9zZV9jb3VudCxpdGVtX25hbWUpIHtcbnZhciBjaGFydCA9IGVjaGFydHMuaW5pdChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY29udGFpbmVyJykpO1xuZGF5cyA9IHhBeGlzLmRhdGEubGVuZ3RoO1xuLy/lj4LmlbDorr7nva5cbm9wdGlvbiA9IHtcbiAgICAgICAgdGl0bGU6IHsgICAgICAvL+agh+mimOe7hOS7tlxuICAgICAgICAgICAgdGV4dDogaXRlbV9uYW1lLFxuICAgICAgICAgICAgc3VidGV4dDogJ+e8uui0pycrIGxvc2VfZGF5cyArICflpKkg5o2f5aSxJytsb3NlX2NvdW50KyflhYMnLFxuICAgICAgICAgICAgeDonY2VudGVyJ1xuICAgICAgICB9LFxuICAgICAgICBsZWdlbmQ6IHsgICAgIC8v5Zu+5L6L57uE5Lu2XG4gICAgICAgICAgICBkYXRhOiBbJ+acrOW6l+mUgOmHjycsICfljoblj7LplIDph48nXSxcbiAgICAgICAgICAgIHJpZ2h0OicyMCUnXG4gICAgICAgIH0sXG4gICAgICAgIHRvb2x0aXA6IHsgICAgLy/mj5DnpLrmoYbnu4Tku7ZcbiAgICAgICAgICAgIHRyaWdnZXI6ICdheGlzJ1xuICAgICAgICB9LFxuICAgICAgICB0b29sYm94OiB7ICAgICAvL+W3peWFt+agj1xuICAgICAgICAgICAgZmVhdHVyZToge1xuICAgICAgICAgICAgICAgIHNhdmVBc0ltYWdlOiB7fVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICB4QXhpczogeEF4aXMsICAgICAvL+ebtOinkuWdkOagh+ezuyBncmlkIOS4reeahCB4IOi9tFxuICAgICAgICB5QXhpczogeyAgICAgICAvL+ebtOinkuWdkOagh+ezuyBncmlkIOS4reeahCB5IOi9tFxuICAgICAgICAgICAgdHlwZTogJ3ZhbHVlJ1xuICAgICAgICB9LFxuICAgICAgICBzZXJpZXM6IHNlcmllcywgICAgICAvL+ezu+WIl+WIl+ihqFxufTtcblxuY2hhcnQuc2V0T3B0aW9uKG9wdGlvbik7ICAgLy/lj4LmlbDorr7nva7mlrnms5Vcbn1cbiJdLCJmaWxlIjoic3RvcmUvc3RvcmVfdG9wX2l0ZW1fZGV0YWlsLmpzIn0=
