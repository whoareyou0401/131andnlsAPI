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


//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJiYWdtYW4vYWRkLWFjY291bnQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJChmdW5jdGlvbigpe1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgc2V0dXBDU1JGKCk7XG4gICAgLyoqXG4gICAgICogcmVxVHlwZTpcbiAgICAgKiAgIFBPU1QgLS0gc2V0IG51bWJlclxuICAgICAqICAgUFVUIC0tIGluY3JlbWVudC9kZWNyZW1lbnQgZGF0YVxuICAgICAqL1xuICAgICAvL+eCueWHu+aUueWPmOi+k+WFpeahhuS4reeahOaVsOWQjOaXtuWKoOWFpVxuXG4gICAgdmFyIGZvb3RlciA9IG5ldyBWdWUoe1xuICAgICAgICBlbDogJyNmb290ZXInLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICB0b3RhbDogMFxuICAgICAgICB9LFxuICAgICAgICBjb21wdXRlZDoge1xuICAgICAgICAgICAgZGlzcGxheV90b3RhbDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICcnICsgdGhpcy50b3RhbC50b0ZpeGVkKDIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfSk7XG4gICAgdmFyIGJhbm5lciA9IG5ldyBWdWUoe1xuICAgICAgICBlbDogJyNiYW5uZXInLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBkZWFsZXJfaWQ6IGRlYWxlcl9pZFxuICAgICAgICB9XG4gICAgfSk7XG4gICAgdmFyIGFwcCA9IG5ldyBWdWUoe1xuICAgICAgICBlbDogJyNpdGVtLWxpc3QnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAvLyBzb3J05YC8XG4gICAgICAgICAgICBzb3J0OjAsXG4gICAgICAgICAgICAvLyDns7vliJfmlbDmja5cbiAgICAgICAgICAgIHNlcmllczp7fSxcbiAgICAgICAgICAgIHNlcmllc19udW06e30sXG4gICAgICAgICAgICBzZXJpZXNfaWQ6XCJcIixcbiAgICAgICAgICAgIGl0ZW1zOiBbXSxcbiAgICAgICAgICAgIHNlbGVjdGVkX2l0ZW1zOiB7fSxcbiAgICAgICAgICAgIHNvdXJjZTogJCgnI3NvdXJjZScpLmF0dHIoXCJuYW1lXCIpLFxuICAgICAgICAgICAgY3VzdG9tZXJfaWQ6ICQoJyNzb3VyY2UnKS5hdHRyKFwiY3VzdG9tZXJfaWRcIiksXG4gICAgICAgICAgICBjYXRfaWQ6IDAsXG4gICAgICAgICAgICBvcmRlcjogJy1zY29yZScsXG4gICAgICAgICAgICBpc0dpZnRQYWdlOiB1cmwuc2VhcmNoKCdhZGQtZ2lmdCcpID09PSAtMSxcbiAgICAgICAgICAgIGRlYWxlcl9pZDogZGVhbGVyX2lkXG4gICAgICAgIH0sXG4gICAgICAgIGJlZm9yZUNyZWF0ZWQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgIH0sXG4gICAgICAgIHJlYWR5OiBmdW5jdGlvbihpKSB7XG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogXCIvYXBpL3YxLjEvcmVjb21tZW5kb3JkZXIvY3VzdG9tZXIvXCIgKyBjdXN0b21lcl9pZCArIFwiL2RlYWxlci1saXN0XCIsXG4gICAgICAgICAgICAgICAgdHlwZTogJ2dldCcsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgICAgIHZhciBvcmRlcmFibGUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpPTA7IGk8ZGF0YS5kZWFsZXJzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmRlYWxlcnNbaV0uaWQgPT0gZGVhbGVyX2lkICYmIGRhdGEuZGVhbGVyc1tpXS5vcmRlcmFibGUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9yZGVyYWJsZSA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKCFvcmRlcmFibGUpe1xuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBcIi9yZWNvbW1lbmRvcmRlci9jdXN0b21lci9cIiArIGN1c3RvbWVyX2lkICsgXCIvZGVhbGVyLWxpc3RcIjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgfSxcbiAgICAgICAgbWV0aG9kczoge1xuICAgICAgICAgICAgZnVudG9maXhlZDpmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICBpZihkYXRhID09IFwiXCIpe1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZGF0YTtcbiAgICAgICAgICAgICAgICB9ZWxzZSBpZiAoIGlzTmFOKE51bWJlcihkYXRhKSkgKSB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhO1xuICAgICAgICAgICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gTnVtYmVyKGRhdGEpO1xuXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXJpZXNDaGFuZ2U6ZnVuY3Rpb24obnVtKXtcbiAgICAgICAgICAgICAgICAgICBzZWxmLnNlcmllc19pZD1udW07XG4gICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cobnVtKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZWZyZXNoU2VsZWN0ZWRJdGVtczogZnVuY3Rpb24oaXRlbXMpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgaXRlbXMuZm9yRWFjaChmdW5jdGlvbihlbGUpIHtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoZWxlLnNlbGVjdGVkX251bSAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWxlY3RlZF9pdGVtc1tlbGUuaWRdID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGl0ZW1faWQ6IGVsZS5pdGVtX2lkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG51bTogTnVtYmVyKGVsZS5zZWxlY3RlZF9udW0pLnRvRml4ZWQoMCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpY2U6IGVsZS5wcmljZVxuICAgICAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmIChlbGUuaWQgaW4gc2VsZi5zZWxlY3RlZF9pdGVtcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZWxlY3RlZF9pdGVtc1tlbGUuaWRdLm51bSA9IDA7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGZvb3Rlci50b3RhbCA9IDA7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHNlbGYuc2VsZWN0ZWRfaXRlbXMpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSBzZWxmLnNlbGVjdGVkX2l0ZW1zW2tleV07XG4gICAgICAgICAgICAgICAgICAgIGZvb3Rlci50b3RhbCArPSBpdGVtLm51bSAqIGl0ZW0ucHJpY2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG51bUNoYW5nZTogZnVuY3Rpb24odikge1xuICAgICAgICAgICAgICAgIGlmICh2LnNlbGVjdGVkX251bSA9PT0gJycpIHtcbiAgICAgICAgICAgICAgICAgICAgdi5zZWxlY3RlZF9udW0gPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2LnNlbGVjdGVkX251bT1wYXJzZUludCh2LnNlbGVjdGVkX251bSk7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHNldEl0ZW1DYXJ0TnVtKHYsIHYuc2VsZWN0ZWRfbnVtLCBcIlBPU1RcIiwgZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICB2LnNlbGVjdGVkX251bSA9IE51bWJlcihkYXRhLm51bSkudG9GaXhlZCgwKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5yZWZyZXNoU2VsZWN0ZWRJdGVtcyhzZWxmLml0ZW1zKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZWR1Y2VDbGlja2VkOiBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIGlmKHYuc2VsZWN0ZWRfbnVtPD0wKXtcbiAgICAgICAgICAgICAgICAgICAgdi5zZWxlY3RlZF9udW0gPSAwO1xuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgIHNldEl0ZW1DYXJ0TnVtKHYsIC0xLCBcIlBVVFwiLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2LnNlbGVjdGVkX251bSA9IE51bWJlcihkYXRhLm51bSkudG9GaXhlZCgwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYucmVmcmVzaFNlbGVjdGVkSXRlbXMoc2VsZi5pdGVtcyk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICB9XG4gICAgfSk7XG4gICAgdmFyIHNlYXJjaFZ1ZSA9IG5ldyBWdWUoe1xuICAgICAgICBlbDogJyNzZWFyY2gtcmVzdWx0cycsXG4gICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgIGl0ZW1zOiBbXSxcbiAgICAgICAgICAgIHF1ZXJ5OiAnJyxcbiAgICAgICAgICAgIGRlYWxlcl9pZDogZGVhbGVyX2lkXG4gICAgICAgIH0sXG4gICAgICAgIG1ldGhvZHM6IHtcblxuICAgICAgICAgICAgICBudW1DaGFuZ2U6IGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgaWYgKHYuc2VsZWN0ZWRfbnVtID09PSAnJykge1xuICAgICAgICAgICAgICAgICAgICB2LnNlbGVjdGVkX251bSA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHYuc2VsZWN0ZWRfbnVtPXBhcnNlSW50KHYuc2VsZWN0ZWRfbnVtKTtcbiAgICAgICAgICAgICAgICBzZXRJdGVtQ2FydE51bSh2LCB2LnNlbGVjdGVkX251bSwgXCJQT1NUXCIsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdi5zZWxlY3RlZF9udW0gPSBOdW1iZXIoZGF0YS5udW0pLnRvRml4ZWQoMCk7XG4gICAgICAgICAgICAgICAgICAgIGFwcC5yZWZyZXNoU2VsZWN0ZWRJdGVtcyhzZWxmLml0ZW1zKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZWR1Y2VDbGlja2VkOiBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIGlmKHYuc2VsZWN0ZWRfbnVtPD0wKXtcbiAgICAgICAgICAgICAgICAgICAgdi5zZWxlY3RlZF9udW0gPSAwO1xuICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgIHNldEl0ZW1DYXJ0TnVtKHYsIC0xLCBcIlBVVFwiLCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2LnNlbGVjdGVkX251bSA9IE51bWJlcihkYXRhLm51bSkudG9GaXhlZCgwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFwcC5yZWZyZXNoU2VsZWN0ZWRJdGVtcyhzZWxmLml0ZW1zKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBsdXNDbGlja2VkOiBmdW5jdGlvbih2KSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHNldEl0ZW1DYXJ0TnVtKHYsIDEsIFwiUFVUXCIsIGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgdi5zZWxlY3RlZF9udW0gPSBOdW1iZXIoZGF0YS5udW0pLnRvRml4ZWQoMCk7XG4gICAgICAgICAgICAgICAgICAgIGFwcC5yZWZyZXNoU2VsZWN0ZWRJdGVtcyhzZWxmLml0ZW1zKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICQoJy5saXN0JykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgJCh0aGlzKS5hZGRDbGFzcygnYWN0aXZlJyk7XG4gICAgICAgICQodGhpcykucGFyZW50KCkuc2libGluZ3MoKS5jaGlsZHJlbignLmxpc3QnKS5yZW1vdmVDbGFzcygnYWN0aXZlJyk7XG4gICAgfSk7XG4gICAgLy/ngrnlh7vlm77niYflh7rnjrDmqKHmgIHmmL7npLrlpKflm75cbiAgICAkKCcubGlzdCcpLm9uKCdjbGljaycsJy5pbWdCaWcnLGZ1bmN0aW9uKGV2KXtcbiAgICAgICAgdmFyIGJpZ0ltZ1NyYyA9ICQoZXYudGFyZ2V0KS5hdHRyKFwiYmlnc3JjXCIpO1xuICAgICAgICAkKCcuaW1nQmlnU2hvdyBpbWcnKS5hdHRyKFwic3JjXCIsIGJpZ0ltZ1NyYyk7XG4gICAgICAgICQoJy5tb2RlbEltZycpLmNzcyh7XG4gICAgICAgICAgICAnZGlzcGxheSc6J2Jsb2NrJ1xuICAgICAgICB9KTtcbiAgICAgICAgJCgnLmltZ0JpZ1Nob3cgaW1nJykuY3NzKHtcbiAgICAgICAgICAgICdkaXNwbGF5JzonYmxvY2snXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgIC8v54K55Ye75Lu75oSP5oyJ6ZKu5qih5oCB5raI5aSxXG4gICAgJCgnLm1vZGVsSW1nJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgJCh0aGlzKS5jc3Moe1xuICAgICAgICAgICAgJ2Rpc3BsYXknOidub25lJ1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuXG5cbn0pO1xuXG4iXSwiZmlsZSI6ImJhZ21hbi9hZGQtYWNjb3VudC5qcyJ9
