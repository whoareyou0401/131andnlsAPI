$(function(){
    "use strict";

    setupCSRF();
    /**
     * reqType:
     *   POST -- set number
     *   PUT -- increment/decrement data
     */
     //点击改变输入框中的数同时加入

    var footer = new Vue({
        el: '#footer',
        data: {
            total: 0
        },
        computed: {
            display_total: function() {
                return '' + this.total.toFixed(2);
            }
        }
    });
    var banner = new Vue({
        el: '#banner',
        data: {
            dealer_id: dealer_id
        }
    });
    var app = new Vue({
        el: '#item-list',
        data: {
            // sort值
            sort:0,
            // 系列数据
            series:{},
            series_num:{},
            series_id:"",
            items: [],
            selected_items: {},
            source: $('#source').attr("name"),
            customer_id: $('#source').attr("customer_id"),
            cat_id: 0,
            order: '-score',
            isGiftPage: url.search('add-gift') === -1,
            dealer_id: dealer_id
        },
        beforeCreated: function(){
        },
        ready: function(i) {
            $.ajax({
                url: "/api/v1.1/recommendorder/customer/" + customer_id + "/dealer-list",
                type: 'get',
                success: function(data){
                    var orderable = false;
                    for(var i=0; i<data.dealers.length; i++){
                        if (data.dealers[i].id == dealer_id && data.dealers[i].orderable){
                            orderable = true;
                        }
                    }
                    if (!orderable){
                        window.location.href = "/recommendorder/customer/" + customer_id + "/dealer-list";
                    }
                }
            });


        },
        methods: {
            funtofixed:function(data){
                if(data == ""){
                    return data;
                }else if ( isNaN(Number(data)) ) {

                        return data;
                    }else {
                        return Number(data);

                    }
            },
            seriesChange:function(num){
                   self.series_id=num;
                   console.log(num);
            },
            refreshSelectedItems: function(items) {
                var self = this;
                items.forEach(function(ele) {

                    if (ele.selected_num !== 0) {
                        self.selected_items[ele.id] = {
                            item_id: ele.item_id,
                            num: Number(ele.selected_num).toFixed(0),
                            price: ele.price
                        };
                    } else if (ele.id in self.selected_items) {
                        self.selected_items[ele.id].num = 0;
                    }

                });
                footer.total = 0;
                for (var key in self.selected_items) {
                    var item = self.selected_items[key];
                    footer.total += item.num * item.price;
                }
            },
            numChange: function(v) {
                if (v.selected_num === '') {
                    v.selected_num = 0;
                }
                v.selected_num=parseInt(v.selected_num);
                var self = this;
                setItemCartNum(v, v.selected_num, "POST", function(data) {
                    v.selected_num = Number(data.num).toFixed(0);
                    self.refreshSelectedItems(self.items);
                });
            },
            reduceClicked: function(v) {
                var self = this;
                if(v.selected_num<=0){
                    v.selected_num = 0;
                }else{
                   setItemCartNum(v, -1, "PUT", function(data) {
                        v.selected_num = Number(data.num).toFixed(0);
                        self.refreshSelectedItems(self.items);
                    });
                }
            }

        }
    });
    var searchVue = new Vue({
        el: '#search-results',
        data: {
            items: [],
            query: '',
            dealer_id: dealer_id
        },
        methods: {

              numChange: function(v) {
                var self = this;
                if (v.selected_num === '') {
                    v.selected_num = 0;
                }
                v.selected_num=parseInt(v.selected_num);
                setItemCartNum(v, v.selected_num, "POST", function(data) {
                    v.selected_num = Number(data.num).toFixed(0);
                    app.refreshSelectedItems(self.items);
                });
            },
            reduceClicked: function(v) {
                var self = this;
                if(v.selected_num<=0){
                    v.selected_num = 0;
                }else{
                   setItemCartNum(v, -1, "PUT", function(data) {
                        v.selected_num = Number(data.num).toFixed(0);
                        app.refreshSelectedItems(self.items);
                    });
                }
            },
            plusClicked: function(v) {
                var self = this;
                setItemCartNum(v, 1, "PUT", function(data) {
                    v.selected_num = Number(data.num).toFixed(0);
                    app.refreshSelectedItems(self.items);
                });
            }
        },

    $('.list').click(function(){
        $(this).addClass('active');
        $(this).parent().siblings().children('.list').removeClass('active');
    });
    //点击图片出现模态显示大图
    $('.list').on('click','.imgBig',function(ev){
        var bigImgSrc = $(ev.target).attr("bigsrc");
        $('.imgBigShow img').attr("src", bigImgSrc);
        $('.modelImg').css({
            'display':'block'
        });
        $('.imgBigShow img').css({
            'display':'block'
        });
    });
    //点击任意按钮模态消失
    $('.modelImg').click(function(){
        $(this).css({
            'display':'none'
        });
    });



});

