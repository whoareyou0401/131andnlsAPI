function itemMap(series,xAxis,markPoint) {
var chart = echarts.init(document.getElementById('mainly_map'));
//参数设置
option = {
        color: ['#3398DB'],
        legend: {     //图例组件
            data: ['本店销量','周边销量'],
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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzdG9yZS9zdG9yZV9jYXRlZ29yeV9uZWFyYnkuanMiXSwic291cmNlc0NvbnRlbnQiOlsiZnVuY3Rpb24gaXRlbU1hcChzZXJpZXMseEF4aXMsbWFya1BvaW50KSB7XG52YXIgY2hhcnQgPSBlY2hhcnRzLmluaXQoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21haW5seV9tYXAnKSk7XG4vL+WPguaVsOiuvue9rlxub3B0aW9uID0ge1xuICAgICAgICBjb2xvcjogWycjMzM5OERCJ10sXG4gICAgICAgIGxlZ2VuZDogeyAgICAgLy/lm77kvovnu4Tku7ZcbiAgICAgICAgICAgIGRhdGE6IFsn5pys5bqX6ZSA6YePJywn5ZGo6L656ZSA6YePJ10sXG4gICAgICAgICAgICByaWdodDonMjAlJyxcbiAgICAgICAgfSxcbiAgICAgICAgdG9vbHRpcDogeyAgICAvL+aPkOekuuahhue7hOS7tlxuICAgICAgICAgICAgdHJpZ2dlcjogJ2F4aXMnXG4gICAgICAgIH0sXG4gICAgICAgIHhBeGlzOiB4QXhpcywgICAgIC8v55u06KeS5Z2Q5qCH57O7IGdyaWQg5Lit55qEIHgg6L20XG4gICAgICAgIHlBeGlzOiB7ICAgICAgIC8v55u06KeS5Z2Q5qCH57O7IGdyaWQg5Lit55qEIHkg6L20XG4gICAgICAgICAgICB0eXBlOiAndmFsdWUnXG4gICAgICAgIH0sXG4gICAgICAgIHNlcmllczogc2VyaWVzLCAgICAgIC8v57O75YiX5YiX6KGoXG4gICAgfTtcblxuY2hhcnQuc2V0T3B0aW9uKG9wdGlvbik7ICAgLy/lj4LmlbDorr7nva7mlrnms5Vcbn1cbiJdLCJmaWxlIjoic3RvcmUvc3RvcmVfY2F0ZWdvcnlfbmVhcmJ5LmpzIn0=
