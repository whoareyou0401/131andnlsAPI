function itemMap(series,xAxis) {
var chart = echarts.init(document.getElementById('mainly_map'));
//参数设置
option = {
        title: {
               text: '一周购物篮系数变化',
               },
        color: ['#3398DB'],
        legend: {     //图例组件
            data: ['购物篮系数','周边购物篮系数'],
            right:'20%',
        },
        tooltip: {    //提示框组件
            trigger: 'axis'
        },
        xAxis: xAxis,     //直角坐标系 grid 中的 x 轴
        yAxis: {       //直角坐标系 grid 中的 y 轴
            type: 'value'
        },
        series: series,      //系列列表
};

chart.setOption(option);   //参数设置方法
}

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzdG9yZS9zdG9yZV9iYXNrZXRfd2Vlay5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJmdW5jdGlvbiBpdGVtTWFwKHNlcmllcyx4QXhpcykge1xudmFyIGNoYXJ0ID0gZWNoYXJ0cy5pbml0KGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYWlubHlfbWFwJykpO1xuLy/lj4LmlbDorr7nva5cbm9wdGlvbiA9IHtcbiAgICAgICAgdGl0bGU6IHtcbiAgICAgICAgICAgICAgIHRleHQ6ICfkuIDlkajotK3niannr67ns7vmlbDlj5jljJYnLFxuICAgICAgICAgICAgICAgfSxcbiAgICAgICAgY29sb3I6IFsnIzMzOThEQiddLFxuICAgICAgICBsZWdlbmQ6IHsgICAgIC8v5Zu+5L6L57uE5Lu2XG4gICAgICAgICAgICBkYXRhOiBbJ+i0reeJqeevruezu+aVsCcsJ+WRqOi+uei0reeJqeevruezu+aVsCddLFxuICAgICAgICAgICAgcmlnaHQ6JzIwJScsXG4gICAgICAgIH0sXG4gICAgICAgIHRvb2x0aXA6IHsgICAgLy/mj5DnpLrmoYbnu4Tku7ZcbiAgICAgICAgICAgIHRyaWdnZXI6ICdheGlzJ1xuICAgICAgICB9LFxuICAgICAgICB4QXhpczogeEF4aXMsICAgICAvL+ebtOinkuWdkOagh+ezuyBncmlkIOS4reeahCB4IOi9tFxuICAgICAgICB5QXhpczogeyAgICAgICAvL+ebtOinkuWdkOagh+ezuyBncmlkIOS4reeahCB5IOi9tFxuICAgICAgICAgICAgdHlwZTogJ3ZhbHVlJ1xuICAgICAgICB9LFxuICAgICAgICBzZXJpZXM6IHNlcmllcywgICAgICAvL+ezu+WIl+WIl+ihqFxufTtcblxuY2hhcnQuc2V0T3B0aW9uKG9wdGlvbik7ICAgLy/lj4LmlbDorr7nva7mlrnms5Vcbn1cbiJdLCJmaWxlIjoic3RvcmUvc3RvcmVfYmFza2V0X3dlZWsuanMifQ==
