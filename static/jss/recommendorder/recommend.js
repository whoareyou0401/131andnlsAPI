(function(cmApp) {

    'use strict';
    setupCSRF();

    var url = '/api/v1.3/recommendorder/customers/' + window.customer_id + '/items';

    Vue.filter('toFixed', function (num, precision) {
        return Number(Number(num).toFixed(precision));
    });
    var bind = new Vue({
        el: '#recommend-items',
        data: {
            dealers: [],
            sum: 0,
            isShowSumCell:true,
            isShowBlank:false,
            isShowCon:true,
            selectedItem: {},
            recommendUrl: "/recommendorder/customer/" + window.customer_id + "/recommend",
            customerProfile: "/recommendorder/customer/" + window.customer_id + "/profile",
            dealerListUrl : "/recommendorder/customer/" + window.customer_id + "/dealer-list",
            dealerlist:"/recommendorder/dealer/1/customer/" + window.customer_id + "/add-item",
            customizeflag:false,
            customizedata:null,
            custombutton:[],
            itemtags:null,
            promptflag:false,
            indexArr:[]
        },
        watch: {
            sum: function(new_value,old_value) {
                if (new_value > 0 ) {
                    $('#placeorder').css('background','#ff4a0c');
                }else if(new_value === 0) {
                    $('#placeorder').css('background','#dbdbdb');
                }
            }
        },
        beforeCreate: function(){
            var user_role = getCookie('user_role');
            this.isSalesman = user_role === "salesman";
        },
        methods: {
            back: function(){
                zhuge.track('返回（个性定制）',function () {
                    window.location.href = "/recommendorder/salesman/customer-status";
                });
            },
            promptConfirm: function () {
                var _this = this;
                _this.promptflag = false;
                zhuge.track('确认（至少筛选一个条件）');
            },
            botCustomization:function () {
                zhuge.track('个性定制（个性定制）');
            },
            botDealer:function () {
                var _this = this;
                zhuge.track('供货商（个性定制）',function () {
                    window.location.href = "/recommendorder/customer/" + window.customer_id + "/dealer-list";
                });
            },
            botHome:function () {
                var _this = this;
                zhuge.track('个人中心（个性定制）',function () {
                    window.location.href = "/recommendorder/customer/" + window.customer_id + "/profile";
                });
            },
            init: function () {
                var _this = this;
                $.ajax({
                    url: url,
                    type: 'get',
                    data:{
                        "type":"recommendation",
                        "groupby":"dealer",
                        'max':'50'
                    },
                    success: function (data) {
                        _this.dealers = data.items;
                        // _this.sum =Number(data.sum);
                        if(_this.dealers.length === 0){
                            _this.isShowBlank = true;
                            _this.isShowSumCell = false;
                            _this.isShowCon = false;
                        }else{
                            _this.isShowBlank = false;
                            _this.isShowSumCell = true;
                            _this.isShowCon = true;
                        }
                        if (_this.sum > 0 ) {
                            $('#placeorder').css('background','#ff4a0c');
                        }else if(_this.sum === 0) {
                            $('#placeorder').css('background','#dbdbdb');
                        }
                    }
                });
            },
            //通过加减设置购买数量
            add: function (item, num, dealer) {
                var _this = this;
                //库存
                var inventory = item.inventory;
                //商品数量为0，或者为库存量，则不做操作
                if ((item.num == inventory && parseInt(num) == 1) || (item.num === 0 && parseInt(num) == -1)) {
                    return;
                }

                item.num = item.num - 0 + parseInt(num);
                //如果商品是选中状态，就把改变的数量放到SelectedItem里，并修改总的花费金额展示
                if (item.selected === true) {
                    this.addToSelectedItem(item);
                    this.changeTotalSpend(item, num, dealer);
                }
                zhuge.track('修改商品数量（个性定制）',{
                    '商品名称':$(this.$refs['item' + item.id]).find('.item_name').text(),
                    '商品数量':$(this.$refs['item' + item.id]).find('.num_value').val() - 0 + num
                });
            },
            //改变已选中商品的数量时，修改经销商花费和总花费
            changeTotalSpend: function (item, num, dealer) {
                var _this = this;
                //修改经销商商品花费金额
                dealer.amount = Number(dealer.amount) + item.price * parseFloat(num);
                //修改花费总金额
                _this.sum = _this.sum + item.price * parseFloat(num);
            },
            //直接设置购买数量
            set: function ($event, item, dealer) {
                var _this = this;
                var re = /[^\d]/;
                var changeValue = event.target.value;
                var intChangeValue = parseInt(changeValue);
                var intInvertory = parseInt(item.inventory);
                var result = changeValue.search(re);
                //输入非数字改为0
                if (result != -1 || changeValue.length === 0) {
                    item.num = 0;
                } else if (intChangeValue > intInvertory) {
                    //超过库存量
                    item.num = intInvertory;
                } else {
                    item.num = intChangeValue;
                }
                //Vue变动数组
                var index = dealer.items.indexOf(item);
                Vue.set(dealer.items, index, item);
                //如果商品是选中状态且商品数量有改动，就把改变的数量放到SelectedItem里，并修改总的花费金额展示
                var intOrgNum = parseInt(_this.selectedItem[item.id]);
                var changeNum = item.num - intOrgNum;
                if (item.selected === true && changeNum !== 0) {
                    var orgNum = _this.selectedItem[item.id];
                    this.addToSelectedItem(item);
                    this.changeTotalSpend(item, changeNum, dealer);
                }
            },
            seNumtBlur:function (id) {
                zhuge.track('修改商品数量（个性定制）',{
                    '商品名称':$(this.$refs['item' + id]).find('.item_name').text(),
                    '商品数量':$(this.$refs['item' + id]).find('.num_value').val()
                });
            },
            //设置经销商选中状态
            dAllSelected: function (did) {
                for (var i = 0; i < this.dealers.length; i++) {
                    if (this.dealers[i].dealer_id !== did && did !== undefined)
                        continue;
                    for (var j = 0; j < this.dealers[i].items.length; j++) {
                        if (this.dealers[i].items[j].selected === false) {
                            return false;
                        }
                    }
                }
                return true;
            },
            //全选
            dSelectAll: function (status,$event, did) {
                var _this = this;
                var dataToSend = {};
                dataToSend.items = [];
                var current = true;
                var i, j;
                for (i = 0; i < this.dealers.length; i++) {
                    if (this.dealers[i].dealer_id !== did && did !== undefined)
                        continue;
                    for (j = 0; j < this.dealers[i].items.length; j++) {
                        if (this.dealers[i].items[j].selected === false) {
                            current = false;
                            break;
                        }
                    }
                }
                for (i = 0; i < this.dealers.length; i++) {
                    if (this.dealers[i].dealer_id !== did && did !== undefined)
                        continue;
                    for (j = 0; j < this.dealers[i].items.length; j++) {
                        if (this.dealers[i].items[j].selected === current) {
                            this.select(this.dealers[i].items[j], this.dealers[i]);
                        }
                    }
                }
                //埋点
                var choosenum = 0;
                for (var m = 0; m < this.dealers.length; m++) {
                    choosenum += this.dealers[m].items.length;
                }
                if (status === 'choose') {
                    zhuge.track('全选经销商商品(个性定制)',{
                        '经销商名称':$(_this.$refs['dealer' + did]).text()
                    });
                } else if (status = 'allChoose') {
                    zhuge.track('全选（个性定制）',{
                        '商品数量':choosenum
                    });
                } else if (status === 'unChoose' || status === 'unAllChoose') {
                    return;
                }
                
            },
            //选择单个商品
            select: function (item, dealer,index) {
                if (item.selected === true) {
                    item.selected = false;
                    this.deleteFromSelectedItem(item);
                    this.changeTotalSpend(item, item.num * (-1), dealer);
                } else {
                    item.selected = true;
                    this.addToSelectedItem(item);
                    this.changeTotalSpend(item, item.num, dealer);
                }
                //埋点
                zhuge.track('勾选商品（个性定制）',{
                    '商品名称':$(this.$refs['item' + item.id]).find('.item_name').text(),
                    '商品数量':$(this.$refs['item' + item.id]).find('.num_value').val(),
                    '勾选的商品序号':index - 0 + 1
                });
            },
            //添加到增加dict
            addToSelectedItem: function (item) {
                var _this = this;
                _this.selectedItem[item.id] = parseInt(item.num);
            },
            //从增加dict删除
            deleteFromSelectedItem: function (item) {
                var _this = this;
                if (_this.selectedItem.hasOwnProperty(item.id)) {
                    delete _this.selectedItem[item.id];
                }
            },
            //零售店超链接
            dhref: function (did) {
                // 埋点
                zhuge.track('选择进入经销商店铺(个性定制)',function () {
                    window.location.href = "/recommendorder/dealer/" + did + "/customer/" + window.customer_id + "/add-item";
                });
            },
            //添加并跳转到购物车订单页面
            confirmOrder: function () {
                var url = '/api/v1.1/recommendorder/customer/' + window.customer_id + '/cart';
                var _this = this;
                var shownum = 0;
                for (var n in _this.selectedItem) {
                    shownum += 1;
                }
                var showAllNum = 0;
                for (var m = 0; m < this.dealers.length; m++) {
                    showAllNum += this.dealers[m].items.length;
                }
                $.ajax({
                    url: url,
                    type: 'post',
                    data: _this.selectedItem,
                    success: function(data){
                        $.ajax({
                            url: '/api/v1.3/recommendorder/recommendation-statistics',
                            type: 'post',
                            data: {
                                selected_num: shownum,
                                total_num: showAllNum
                            },
                            success: function(data){
                                zhuge.track('增加(个性定制)',{
                                    '勾选数目':shownum,
                                    '展示数目':showAllNum,
                                    '下单金额':$('.xiadan_sum').text()
                                },function () {
                                    window.location.href = '/recommendorder/customer/' + window.customer_id + '/cart';
                                });
                            }
                        });
                    }
                });
            },
            customizesubmite:function() {
                var self = this;
                var id = [];
                var name = [];
                for(var i = 0; i<self.custombutton.length; i++){
                    id[i] = self.custombutton[i].tag_id;
                }
                for (var j = 0; j < self.customizedata.length; j++) {
                    for (var k = 0; k < self.customizedata[j].items.length; k++) {
                        if (self.customizedata[j].items[k].select === true) {
                            name.push(self.customizedata[j].items[k].name);
                        }
                    }
                }
                if (self.custombutton.length!==0) {
                    // 埋点
                    zhuge.track('提交（个性定制）',{
                        '提交（个性定制）的结果':name
                    });
                    $.ajax({
                        url: "/api/v1.3/recommendorder/tag-preferences",
                        type: 'post',
                        data:{
                            "tags":id
                        },
                        success: function(data){
                            self.customizeflag=false;
                            self.init();
                        }
                    });
                }else{
                    self.promptflag=true;
                }   
            },
            clickcustom:function(id,name) {
                var self = this;
                var flag=false
                for (var i = 0; i < self.custombutton.length; i++){
                    if(self.custombutton[i].tag_id==id){
                        self.custombutton.splice(i, 1);
                        flag=true
                        // 埋点
                        zhuge.track('过滤（个性定制）',{
                            '选择状态':name + '(没选中)'
                        });
                        break;
                    }
                }
                if (!flag) {
                    self.custombutton.push({'tag_id':id,'tag_name':name})
                    // 埋点
                    zhuge.track('个性定制（过滤）',{
                        '选择状态':name + '(选中)'
                    });
                }
                self.additem()

            },
            additem:function() {
                var self = this;
                for (var i = 0; i < self.itemtags.length;i++) {
                    if (self.custombutton.length==0) {
                        self.itemtags[i].select=false;  
                    }else{
                        for (var x = 0; x < self.custombutton.length; x++){
                            if(self.custombutton[x].tag_id==self.itemtags[i].id){
                                self.itemtags[i].select=true;
                                break;
                            }else{
                                self.itemtags[i].select=false;
                            }
                        }
                    }
                }
                var res = [self.itemtags[0]]
                for (var i = 1; i < self.itemtags.length;i++) {
                    var repeat = false;
                    for (var j =0 ; j < res.length;j++) {
                        if (res[j].cat_order == self.itemtags[i].cat_order) {
                            repeat = true;
                            break;
                        }
                    }
                    if(!repeat){
                        res.push(self.itemtags[i]);
                    }
                }
                for (var q =0 ; q < res.length;q++) {
                    res[q].items=[]
                }   
                for (var i =0 ; i < self.itemtags.length;i++) {
                    var repeat = false;
                    for (var j =0 ; j < res.length;j++) {
                        if (res[j].cat_order == self.itemtags[i].cat_order) {
                            res[j].items.push(self.itemtags[i])
                            repeat = true;
                            break;
                        }
                    }
                }
                self.customizedata=res

            },
            opencustomize:function(){
                var self = this;
                $.ajax({
                    url: "/api/v1.3/recommendorder/item-tags",
                    type: 'GET',
                    success: function(data){
                        self.itemtags=data.tags
                        self.additem()
                        self.customizeflag=!self.customizeflag
                    }
                });
                //埋点
                zhuge.track('重新定制(个性定制)');
            }
        },
        mounted:function() {
            var self = this;
            $.ajax({
                url: "/api/v1.3/recommendorder/tag-preferences",
                type: 'get',
                success: function(data){
                    $.ajax({
                        url: "/api/v1.3/recommendorder/item-tags",
                        type: 'GET',
                        success: function(data){
                            self.itemtags=data.tags
                            self.additem()
                        }
                    });
                    if (data.tags.length==0) {
                        self.customizeflag=true;
                        self.custombutton = self.clickcustom(1,'补货优先')
                    }else{
                        self.custombutton=data.tags
                    }
                }
            });
            
        }
    });

    bind.init();
    //点击去购物车按钮页面跳转在购物车页面同时商品出现在购物车中
    $('.place-order').click(function(){
        var cart_href = '/recommendorder/customer/' + customer_id + '/cart';
        zhuge.track('购物车（个性定制）',function () {
            window.location.href = cart_href;
        });
    });

})(window.cmApp = window.cmApp || {});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9yZWNvbW1lbmQuanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKGNtQXBwKSB7XG5cbiAgICAndXNlIHN0cmljdCc7XG4gICAgc2V0dXBDU1JGKCk7XG5cbiAgICB2YXIgdXJsID0gJy9hcGkvdjEuMy9yZWNvbW1lbmRvcmRlci9jdXN0b21lcnMvJyArIHdpbmRvdy5jdXN0b21lcl9pZCArICcvaXRlbXMnO1xuXG4gICAgVnVlLmZpbHRlcigndG9GaXhlZCcsIGZ1bmN0aW9uIChudW0sIHByZWNpc2lvbikge1xuICAgICAgICByZXR1cm4gTnVtYmVyKE51bWJlcihudW0pLnRvRml4ZWQocHJlY2lzaW9uKSk7XG4gICAgfSk7XG4gICAgdmFyIGJpbmQgPSBuZXcgVnVlKHtcbiAgICAgICAgZWw6ICcjcmVjb21tZW5kLWl0ZW1zJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgZGVhbGVyczogW10sXG4gICAgICAgICAgICBzdW06IDAsXG4gICAgICAgICAgICBpc1Nob3dTdW1DZWxsOnRydWUsXG4gICAgICAgICAgICBpc1Nob3dCbGFuazpmYWxzZSxcbiAgICAgICAgICAgIGlzU2hvd0Nvbjp0cnVlLFxuICAgICAgICAgICAgc2VsZWN0ZWRJdGVtOiB7fSxcbiAgICAgICAgICAgIHJlY29tbWVuZFVybDogXCIvcmVjb21tZW5kb3JkZXIvY3VzdG9tZXIvXCIgKyB3aW5kb3cuY3VzdG9tZXJfaWQgKyBcIi9yZWNvbW1lbmRcIixcbiAgICAgICAgICAgIGN1c3RvbWVyUHJvZmlsZTogXCIvcmVjb21tZW5kb3JkZXIvY3VzdG9tZXIvXCIgKyB3aW5kb3cuY3VzdG9tZXJfaWQgKyBcIi9wcm9maWxlXCIsXG4gICAgICAgICAgICBkZWFsZXJMaXN0VXJsIDogXCIvcmVjb21tZW5kb3JkZXIvY3VzdG9tZXIvXCIgKyB3aW5kb3cuY3VzdG9tZXJfaWQgKyBcIi9kZWFsZXItbGlzdFwiLFxuICAgICAgICAgICAgZGVhbGVybGlzdDpcIi9yZWNvbW1lbmRvcmRlci9kZWFsZXIvMS9jdXN0b21lci9cIiArIHdpbmRvdy5jdXN0b21lcl9pZCArIFwiL2FkZC1pdGVtXCIsXG4gICAgICAgICAgICBjdXN0b21pemVmbGFnOmZhbHNlLFxuICAgICAgICAgICAgY3VzdG9taXplZGF0YTpudWxsLFxuICAgICAgICAgICAgY3VzdG9tYnV0dG9uOltdLFxuICAgICAgICAgICAgaXRlbXRhZ3M6bnVsbCxcbiAgICAgICAgICAgIHByb21wdGZsYWc6ZmFsc2UsXG4gICAgICAgICAgICBpbmRleEFycjpbXVxuICAgICAgICB9LFxuICAgICAgICB3YXRjaDoge1xuICAgICAgICAgICAgc3VtOiBmdW5jdGlvbihuZXdfdmFsdWUsb2xkX3ZhbHVlKSB7XG4gICAgICAgICAgICAgICAgaWYgKG5ld192YWx1ZSA+IDAgKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJyNwbGFjZW9yZGVyJykuY3NzKCdiYWNrZ3JvdW5kJywnI2ZmNGEwYycpO1xuICAgICAgICAgICAgICAgIH1lbHNlIGlmKG5ld192YWx1ZSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAkKCcjcGxhY2VvcmRlcicpLmNzcygnYmFja2dyb3VuZCcsJyNkYmRiZGInKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIGJlZm9yZUNyZWF0ZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHZhciB1c2VyX3JvbGUgPSBnZXRDb29raWUoJ3VzZXJfcm9sZScpO1xuICAgICAgICAgICAgdGhpcy5pc1NhbGVzbWFuID0gdXNlcl9yb2xlID09PSBcInNhbGVzbWFuXCI7XG4gICAgICAgIH0sXG4gICAgICAgIG1ldGhvZHM6IHtcbiAgICAgICAgICAgIGJhY2s6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgemh1Z2UudHJhY2soJ+i/lOWbnu+8iOS4quaAp+WumuWItu+8iScsZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiL3JlY29tbWVuZG9yZGVyL3NhbGVzbWFuL2N1c3RvbWVyLXN0YXR1c1wiO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHByb21wdENvbmZpcm06IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgICAgIF90aGlzLnByb21wdGZsYWcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB6aHVnZS50cmFjaygn56Gu6K6k77yI6Iez5bCR562b6YCJ5LiA5Liq5p2h5Lu277yJJyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYm90Q3VzdG9taXphdGlvbjpmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgemh1Z2UudHJhY2soJ+S4quaAp+WumuWItu+8iOS4quaAp+WumuWItu+8iScpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJvdERlYWxlcjpmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgICAgICB6aHVnZS50cmFjaygn5L6b6LSn5ZWG77yI5Liq5oCn5a6a5Yi277yJJyxmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCIvcmVjb21tZW5kb3JkZXIvY3VzdG9tZXIvXCIgKyB3aW5kb3cuY3VzdG9tZXJfaWQgKyBcIi9kZWFsZXItbGlzdFwiO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGJvdEhvbWU6ZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICAgICAgemh1Z2UudHJhY2soJ+S4quS6uuS4reW/g++8iOS4quaAp+WumuWItu+8iScsZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IFwiL3JlY29tbWVuZG9yZGVyL2N1c3RvbWVyL1wiICsgd2luZG93LmN1c3RvbWVyX2lkICsgXCIvcHJvZmlsZVwiO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZ2V0JyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTp7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjpcInJlY29tbWVuZGF0aW9uXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImdyb3VwYnlcIjpcImRlYWxlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgJ21heCc6JzUwJ1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAoZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuZGVhbGVycyA9IGRhdGEuaXRlbXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBfdGhpcy5zdW0gPU51bWJlcihkYXRhLnN1bSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihfdGhpcy5kZWFsZXJzLmxlbmd0aCA9PT0gMCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuaXNTaG93QmxhbmsgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmlzU2hvd1N1bUNlbGwgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5pc1Nob3dDb24gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLmlzU2hvd0JsYW5rID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuaXNTaG93U3VtQ2VsbCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuaXNTaG93Q29uID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChfdGhpcy5zdW0gPiAwICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNwbGFjZW9yZGVyJykuY3NzKCdiYWNrZ3JvdW5kJywnI2ZmNGEwYycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2UgaWYoX3RoaXMuc3VtID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJCgnI3BsYWNlb3JkZXInKS5jc3MoJ2JhY2tncm91bmQnLCcjZGJkYmRiJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvL+mAmui/h+WKoOWHj+iuvue9rui0reS5sOaVsOmHj1xuICAgICAgICAgICAgYWRkOiBmdW5jdGlvbiAoaXRlbSwgbnVtLCBkZWFsZXIpIHtcbiAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgICAgIC8v5bqT5a2YXG4gICAgICAgICAgICAgICAgdmFyIGludmVudG9yeSA9IGl0ZW0uaW52ZW50b3J5O1xuICAgICAgICAgICAgICAgIC8v5ZWG5ZOB5pWw6YeP5Li6MO+8jOaIluiAheS4uuW6k+WtmOmHj++8jOWImeS4jeWBmuaTjeS9nFxuICAgICAgICAgICAgICAgIGlmICgoaXRlbS5udW0gPT0gaW52ZW50b3J5ICYmIHBhcnNlSW50KG51bSkgPT0gMSkgfHwgKGl0ZW0ubnVtID09PSAwICYmIHBhcnNlSW50KG51bSkgPT0gLTEpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBpdGVtLm51bSA9IGl0ZW0ubnVtIC0gMCArIHBhcnNlSW50KG51bSk7XG4gICAgICAgICAgICAgICAgLy/lpoLmnpzllYblk4HmmK/pgInkuK3nirbmgIHvvIzlsLHmiormlLnlj5jnmoTmlbDph4/mlL7liLBTZWxlY3RlZEl0ZW3ph4zvvIzlubbkv67mlLnmgLvnmoToirHotLnph5Hpop3lsZXnpLpcbiAgICAgICAgICAgICAgICBpZiAoaXRlbS5zZWxlY3RlZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFRvU2VsZWN0ZWRJdGVtKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZVRvdGFsU3BlbmQoaXRlbSwgbnVtLCBkZWFsZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB6aHVnZS50cmFjaygn5L+u5pS55ZWG5ZOB5pWw6YeP77yI5Liq5oCn5a6a5Yi277yJJyx7XG4gICAgICAgICAgICAgICAgICAgICfllYblk4HlkI3np7AnOiQodGhpcy4kcmVmc1snaXRlbScgKyBpdGVtLmlkXSkuZmluZCgnLml0ZW1fbmFtZScpLnRleHQoKSxcbiAgICAgICAgICAgICAgICAgICAgJ+WVhuWTgeaVsOmHjyc6JCh0aGlzLiRyZWZzWydpdGVtJyArIGl0ZW0uaWRdKS5maW5kKCcubnVtX3ZhbHVlJykudmFsKCkgLSAwICsgbnVtXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLy/mlLnlj5jlt7LpgInkuK3llYblk4HnmoTmlbDph4/ml7bvvIzkv67mlLnnu4/plIDllYboirHotLnlkozmgLvoirHotLlcbiAgICAgICAgICAgIGNoYW5nZVRvdGFsU3BlbmQ6IGZ1bmN0aW9uIChpdGVtLCBudW0sIGRlYWxlcikge1xuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICAgICAgLy/kv67mlLnnu4/plIDllYbllYblk4HoirHotLnph5Hpop1cbiAgICAgICAgICAgICAgICBkZWFsZXIuYW1vdW50ID0gTnVtYmVyKGRlYWxlci5hbW91bnQpICsgaXRlbS5wcmljZSAqIHBhcnNlRmxvYXQobnVtKTtcbiAgICAgICAgICAgICAgICAvL+S/ruaUueiKsei0ueaAu+mHkeminVxuICAgICAgICAgICAgICAgIF90aGlzLnN1bSA9IF90aGlzLnN1bSArIGl0ZW0ucHJpY2UgKiBwYXJzZUZsb2F0KG51bSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLy/nm7TmjqXorr7nva7otK3kubDmlbDph49cbiAgICAgICAgICAgIHNldDogZnVuY3Rpb24gKCRldmVudCwgaXRlbSwgZGVhbGVyKSB7XG4gICAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgICAgICB2YXIgcmUgPSAvW15cXGRdLztcbiAgICAgICAgICAgICAgICB2YXIgY2hhbmdlVmFsdWUgPSBldmVudC50YXJnZXQudmFsdWU7XG4gICAgICAgICAgICAgICAgdmFyIGludENoYW5nZVZhbHVlID0gcGFyc2VJbnQoY2hhbmdlVmFsdWUpO1xuICAgICAgICAgICAgICAgIHZhciBpbnRJbnZlcnRvcnkgPSBwYXJzZUludChpdGVtLmludmVudG9yeSk7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGNoYW5nZVZhbHVlLnNlYXJjaChyZSk7XG4gICAgICAgICAgICAgICAgLy/ovpPlhaXpnZ7mlbDlrZfmlLnkuLowXG4gICAgICAgICAgICAgICAgaWYgKHJlc3VsdCAhPSAtMSB8fCBjaGFuZ2VWYWx1ZS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5udW0gPSAwO1xuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoaW50Q2hhbmdlVmFsdWUgPiBpbnRJbnZlcnRvcnkpIHtcbiAgICAgICAgICAgICAgICAgICAgLy/otoXov4flupPlrZjph49cbiAgICAgICAgICAgICAgICAgICAgaXRlbS5udW0gPSBpbnRJbnZlcnRvcnk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5udW0gPSBpbnRDaGFuZ2VWYWx1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy9WdWXlj5jliqjmlbDnu4RcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSBkZWFsZXIuaXRlbXMuaW5kZXhPZihpdGVtKTtcbiAgICAgICAgICAgICAgICBWdWUuc2V0KGRlYWxlci5pdGVtcywgaW5kZXgsIGl0ZW0pO1xuICAgICAgICAgICAgICAgIC8v5aaC5p6c5ZWG5ZOB5piv6YCJ5Lit54q25oCB5LiU5ZWG5ZOB5pWw6YeP5pyJ5pS55Yqo77yM5bCx5oqK5pS55Y+Y55qE5pWw6YeP5pS+5YiwU2VsZWN0ZWRJdGVt6YeM77yM5bm25L+u5pS55oC755qE6Iqx6LS56YeR6aKd5bGV56S6XG4gICAgICAgICAgICAgICAgdmFyIGludE9yZ051bSA9IHBhcnNlSW50KF90aGlzLnNlbGVjdGVkSXRlbVtpdGVtLmlkXSk7XG4gICAgICAgICAgICAgICAgdmFyIGNoYW5nZU51bSA9IGl0ZW0ubnVtIC0gaW50T3JnTnVtO1xuICAgICAgICAgICAgICAgIGlmIChpdGVtLnNlbGVjdGVkID09PSB0cnVlICYmIGNoYW5nZU51bSAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgb3JnTnVtID0gX3RoaXMuc2VsZWN0ZWRJdGVtW2l0ZW0uaWRdO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZFRvU2VsZWN0ZWRJdGVtKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNoYW5nZVRvdGFsU3BlbmQoaXRlbSwgY2hhbmdlTnVtLCBkZWFsZXIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZU51bXRCbHVyOmZ1bmN0aW9uIChpZCkge1xuICAgICAgICAgICAgICAgIHpodWdlLnRyYWNrKCfkv67mlLnllYblk4HmlbDph4/vvIjkuKrmgKflrprliLbvvIknLHtcbiAgICAgICAgICAgICAgICAgICAgJ+WVhuWTgeWQjeensCc6JCh0aGlzLiRyZWZzWydpdGVtJyArIGlkXSkuZmluZCgnLml0ZW1fbmFtZScpLnRleHQoKSxcbiAgICAgICAgICAgICAgICAgICAgJ+WVhuWTgeaVsOmHjyc6JCh0aGlzLiRyZWZzWydpdGVtJyArIGlkXSkuZmluZCgnLm51bV92YWx1ZScpLnZhbCgpXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLy/orr7nva7nu4/plIDllYbpgInkuK3nirbmgIFcbiAgICAgICAgICAgIGRBbGxTZWxlY3RlZDogZnVuY3Rpb24gKGRpZCkge1xuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5kZWFsZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmRlYWxlcnNbaV0uZGVhbGVyX2lkICE9PSBkaWQgJiYgZGlkICE9PSB1bmRlZmluZWQpXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCB0aGlzLmRlYWxlcnNbaV0uaXRlbXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmRlYWxlcnNbaV0uaXRlbXNbal0uc2VsZWN0ZWQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8v5YWo6YCJXG4gICAgICAgICAgICBkU2VsZWN0QWxsOiBmdW5jdGlvbiAoc3RhdHVzLCRldmVudCwgZGlkKSB7XG4gICAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgICAgICAgICAgICB2YXIgZGF0YVRvU2VuZCA9IHt9O1xuICAgICAgICAgICAgICAgIGRhdGFUb1NlbmQuaXRlbXMgPSBbXTtcbiAgICAgICAgICAgICAgICB2YXIgY3VycmVudCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdmFyIGksIGo7XG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHRoaXMuZGVhbGVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kZWFsZXJzW2ldLmRlYWxlcl9pZCAhPT0gZGlkICYmIGRpZCAhPT0gdW5kZWZpbmVkKVxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCB0aGlzLmRlYWxlcnNbaV0uaXRlbXMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmRlYWxlcnNbaV0uaXRlbXNbal0uc2VsZWN0ZWQgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3VycmVudCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCB0aGlzLmRlYWxlcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuZGVhbGVyc1tpXS5kZWFsZXJfaWQgIT09IGRpZCAmJiBkaWQgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgdGhpcy5kZWFsZXJzW2ldLml0ZW1zLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kZWFsZXJzW2ldLml0ZW1zW2pdLnNlbGVjdGVkID09PSBjdXJyZW50KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zZWxlY3QodGhpcy5kZWFsZXJzW2ldLml0ZW1zW2pdLCB0aGlzLmRlYWxlcnNbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8v5Z+L54K5XG4gICAgICAgICAgICAgICAgdmFyIGNob29zZW51bSA9IDA7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgbSA9IDA7IG0gPCB0aGlzLmRlYWxlcnMubGVuZ3RoOyBtKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY2hvb3NlbnVtICs9IHRoaXMuZGVhbGVyc1ttXS5pdGVtcy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzdGF0dXMgPT09ICdjaG9vc2UnKSB7XG4gICAgICAgICAgICAgICAgICAgIHpodWdlLnRyYWNrKCflhajpgInnu4/plIDllYbllYblk4Eo5Liq5oCn5a6a5Yi2KScse1xuICAgICAgICAgICAgICAgICAgICAgICAgJ+e7j+mUgOWVhuWQjeensCc6JChfdGhpcy4kcmVmc1snZGVhbGVyJyArIGRpZF0pLnRleHQoKVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHN0YXR1cyA9ICdhbGxDaG9vc2UnKSB7XG4gICAgICAgICAgICAgICAgICAgIHpodWdlLnRyYWNrKCflhajpgInvvIjkuKrmgKflrprliLbvvIknLHtcbiAgICAgICAgICAgICAgICAgICAgICAgICfllYblk4HmlbDph48nOmNob29zZW51bVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHN0YXR1cyA9PT0gJ3VuQ2hvb3NlJyB8fCBzdGF0dXMgPT09ICd1bkFsbENob29zZScpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvL+mAieaLqeWNleS4quWVhuWTgVxuICAgICAgICAgICAgc2VsZWN0OiBmdW5jdGlvbiAoaXRlbSwgZGVhbGVyLGluZGV4KSB7XG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uc2VsZWN0ZWQgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlbGV0ZUZyb21TZWxlY3RlZEl0ZW0oaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlVG90YWxTcGVuZChpdGVtLCBpdGVtLm51bSAqICgtMSksIGRlYWxlcik7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgaXRlbS5zZWxlY3RlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkVG9TZWxlY3RlZEl0ZW0oaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hhbmdlVG90YWxTcGVuZChpdGVtLCBpdGVtLm51bSwgZGVhbGVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy/ln4vngrlcbiAgICAgICAgICAgICAgICB6aHVnZS50cmFjaygn5Yu+6YCJ5ZWG5ZOB77yI5Liq5oCn5a6a5Yi277yJJyx7XG4gICAgICAgICAgICAgICAgICAgICfllYblk4HlkI3np7AnOiQodGhpcy4kcmVmc1snaXRlbScgKyBpdGVtLmlkXSkuZmluZCgnLml0ZW1fbmFtZScpLnRleHQoKSxcbiAgICAgICAgICAgICAgICAgICAgJ+WVhuWTgeaVsOmHjyc6JCh0aGlzLiRyZWZzWydpdGVtJyArIGl0ZW0uaWRdKS5maW5kKCcubnVtX3ZhbHVlJykudmFsKCksXG4gICAgICAgICAgICAgICAgICAgICfli77pgInnmoTllYblk4Hluo/lj7cnOmluZGV4IC0gMCArIDFcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAvL+a3u+WKoOWIsOWinuWKoGRpY3RcbiAgICAgICAgICAgIGFkZFRvU2VsZWN0ZWRJdGVtOiBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICAgICAgICAgX3RoaXMuc2VsZWN0ZWRJdGVtW2l0ZW0uaWRdID0gcGFyc2VJbnQoaXRlbS5udW0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8v5LuO5aKe5YqgZGljdOWIoOmZpFxuICAgICAgICAgICAgZGVsZXRlRnJvbVNlbGVjdGVkSXRlbTogZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgICAgIGlmIChfdGhpcy5zZWxlY3RlZEl0ZW0uaGFzT3duUHJvcGVydHkoaXRlbS5pZCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIF90aGlzLnNlbGVjdGVkSXRlbVtpdGVtLmlkXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgLy/pm7bllK7lupfotoXpk77mjqVcbiAgICAgICAgICAgIGRocmVmOiBmdW5jdGlvbiAoZGlkKSB7XG4gICAgICAgICAgICAgICAgLy8g5Z+L54K5XG4gICAgICAgICAgICAgICAgemh1Z2UudHJhY2soJ+mAieaLqei/m+WFpee7j+mUgOWVhuW6l+mTuijkuKrmgKflrprliLYpJyxmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gXCIvcmVjb21tZW5kb3JkZXIvZGVhbGVyL1wiICsgZGlkICsgXCIvY3VzdG9tZXIvXCIgKyB3aW5kb3cuY3VzdG9tZXJfaWQgKyBcIi9hZGQtaXRlbVwiO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIC8v5re75Yqg5bm26Lez6L2s5Yiw6LSt54mp6L2m6K6i5Y2V6aG16Z2iXG4gICAgICAgICAgICBjb25maXJtT3JkZXI6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB2YXIgdXJsID0gJy9hcGkvdjEuMS9yZWNvbW1lbmRvcmRlci9jdXN0b21lci8nICsgd2luZG93LmN1c3RvbWVyX2lkICsgJy9jYXJ0JztcbiAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZhciBzaG93bnVtID0gMDtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBuIGluIF90aGlzLnNlbGVjdGVkSXRlbSkge1xuICAgICAgICAgICAgICAgICAgICBzaG93bnVtICs9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciBzaG93QWxsTnVtID0gMDtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBtID0gMDsgbSA8IHRoaXMuZGVhbGVycy5sZW5ndGg7IG0rKykge1xuICAgICAgICAgICAgICAgICAgICBzaG93QWxsTnVtICs9IHRoaXMuZGVhbGVyc1ttXS5pdGVtcy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogdXJsLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IF90aGlzLnNlbGVjdGVkSXRlbSxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJy9hcGkvdjEuMy9yZWNvbW1lbmRvcmRlci9yZWNvbW1lbmRhdGlvbi1zdGF0aXN0aWNzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZF9udW06IHNob3dudW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRvdGFsX251bTogc2hvd0FsbE51bVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHpodWdlLnRyYWNrKCflop7liqAo5Liq5oCn5a6a5Yi2KScse1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ+WLvumAieaVsOebric6c2hvd251bSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICflsZXnpLrmlbDnm64nOnNob3dBbGxOdW0sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAn5LiL5Y2V6YeR6aKdJzokKCcueGlhZGFuX3N1bScpLnRleHQoKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gJy9yZWNvbW1lbmRvcmRlci9jdXN0b21lci8nICsgd2luZG93LmN1c3RvbWVyX2lkICsgJy9jYXJ0JztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjdXN0b21pemVzdWJtaXRlOmZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICB2YXIgaWQgPSBbXTtcbiAgICAgICAgICAgICAgICB2YXIgbmFtZSA9IFtdO1xuICAgICAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGk8c2VsZi5jdXN0b21idXR0b24ubGVuZ3RoOyBpKyspe1xuICAgICAgICAgICAgICAgICAgICBpZFtpXSA9IHNlbGYuY3VzdG9tYnV0dG9uW2ldLnRhZ19pZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBzZWxmLmN1c3RvbWl6ZWRhdGEubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCBzZWxmLmN1c3RvbWl6ZWRhdGFbal0uaXRlbXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLmN1c3RvbWl6ZWRhdGFbal0uaXRlbXNba10uc2VsZWN0ID09PSB0cnVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZS5wdXNoKHNlbGYuY3VzdG9taXplZGF0YVtqXS5pdGVtc1trXS5uYW1lKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5jdXN0b21idXR0b24ubGVuZ3RoIT09MCkge1xuICAgICAgICAgICAgICAgICAgICAvLyDln4vngrlcbiAgICAgICAgICAgICAgICAgICAgemh1Z2UudHJhY2soJ+aPkOS6pO+8iOS4quaAp+WumuWItu+8iScse1xuICAgICAgICAgICAgICAgICAgICAgICAgJ+aPkOS6pO+8iOS4quaAp+WumuWItu+8ieeahOe7k+aenCc6bmFtZVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogXCIvYXBpL3YxLjMvcmVjb21tZW5kb3JkZXIvdGFnLXByZWZlcmVuY2VzXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOntcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInRhZ3NcIjppZFxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY3VzdG9taXplZmxhZz1mYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmluaXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYucHJvbXB0ZmxhZz10cnVlO1xuICAgICAgICAgICAgICAgIH0gICBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjbGlja2N1c3RvbTpmdW5jdGlvbihpZCxuYW1lKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZhciBmbGFnPWZhbHNlXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWxmLmN1c3RvbWJ1dHRvbi5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgICAgICAgICAgIGlmKHNlbGYuY3VzdG9tYnV0dG9uW2ldLnRhZ19pZD09aWQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jdXN0b21idXR0b24uc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZmxhZz10cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyDln4vngrlcbiAgICAgICAgICAgICAgICAgICAgICAgIHpodWdlLnRyYWNrKCfov4fmu6TvvIjkuKrmgKflrprliLbvvIknLHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAn6YCJ5oup54q25oCBJzpuYW1lICsgJyjmsqHpgInkuK0pJ1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoIWZsYWcpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5jdXN0b21idXR0b24ucHVzaCh7J3RhZ19pZCc6aWQsJ3RhZ19uYW1lJzpuYW1lfSlcbiAgICAgICAgICAgICAgICAgICAgLy8g5Z+L54K5XG4gICAgICAgICAgICAgICAgICAgIHpodWdlLnRyYWNrKCfkuKrmgKflrprliLbvvIjov4fmu6TvvIknLHtcbiAgICAgICAgICAgICAgICAgICAgICAgICfpgInmi6nnirbmgIEnOm5hbWUgKyAnKOmAieS4rSknXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBzZWxmLmFkZGl0ZW0oKVxuXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYWRkaXRlbTpmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWxmLml0ZW10YWdzLmxlbmd0aDtpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYuY3VzdG9tYnV0dG9uLmxlbmd0aD09MCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pdGVtdGFnc1tpXS5zZWxlY3Q9ZmFsc2U7ICBcbiAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciB4ID0gMDsgeCA8IHNlbGYuY3VzdG9tYnV0dG9uLmxlbmd0aDsgeCsrKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihzZWxmLmN1c3RvbWJ1dHRvblt4XS50YWdfaWQ9PXNlbGYuaXRlbXRhZ3NbaV0uaWQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLml0ZW10YWdzW2ldLnNlbGVjdD10cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pdGVtdGFnc1tpXS5zZWxlY3Q9ZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHZhciByZXMgPSBbc2VsZi5pdGVtdGFnc1swXV1cbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMTsgaSA8IHNlbGYuaXRlbXRhZ3MubGVuZ3RoO2krKykge1xuICAgICAgICAgICAgICAgICAgICB2YXIgcmVwZWF0ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGogPTAgOyBqIDwgcmVzLmxlbmd0aDtqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNbal0uY2F0X29yZGVyID09IHNlbGYuaXRlbXRhZ3NbaV0uY2F0X29yZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVwZWF0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZighcmVwZWF0KXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlcy5wdXNoKHNlbGYuaXRlbXRhZ3NbaV0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGZvciAodmFyIHEgPTAgOyBxIDwgcmVzLmxlbmd0aDtxKyspIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzW3FdLml0ZW1zPVtdXG4gICAgICAgICAgICAgICAgfSAgIFxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPTAgOyBpIDwgc2VsZi5pdGVtdGFncy5sZW5ndGg7aSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXBlYXQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9MCA7IGogPCByZXMubGVuZ3RoO2orKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlc1tqXS5jYXRfb3JkZXIgPT0gc2VsZi5pdGVtdGFnc1tpXS5jYXRfb3JkZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXNbal0uaXRlbXMucHVzaChzZWxmLml0ZW10YWdzW2ldKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcGVhdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgc2VsZi5jdXN0b21pemVkYXRhPXJlc1xuXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb3BlbmN1c3RvbWl6ZTpmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL2FwaS92MS4zL3JlY29tbWVuZG9yZGVyL2l0ZW0tdGFnc1wiLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnR0VUJyxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLml0ZW10YWdzPWRhdGEudGFnc1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5hZGRpdGVtKClcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY3VzdG9taXplZmxhZz0hc2VsZi5jdXN0b21pemVmbGFnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAvL+Wfi+eCuVxuICAgICAgICAgICAgICAgIHpodWdlLnRyYWNrKCfph43mlrDlrprliLYo5Liq5oCn5a6a5Yi2KScpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBtb3VudGVkOmZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB1cmw6IFwiL2FwaS92MS4zL3JlY29tbWVuZG9yZGVyL3RhZy1wcmVmZXJlbmNlc1wiLFxuICAgICAgICAgICAgICAgIHR5cGU6ICdnZXQnLFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9hcGkvdjEuMy9yZWNvbW1lbmRvcmRlci9pdGVtLXRhZ3NcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6ICdHRVQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pdGVtdGFncz1kYXRhLnRhZ3NcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmFkZGl0ZW0oKVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEudGFncy5sZW5ndGg9PTApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY3VzdG9taXplZmxhZz10cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jdXN0b21idXR0b24gPSBzZWxmLmNsaWNrY3VzdG9tKDEsJ+ihpei0p+S8mOWFiCcpXG4gICAgICAgICAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jdXN0b21idXR0b249ZGF0YS50YWdzXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICB9XG4gICAgfSk7XG5cbiAgICBiaW5kLmluaXQoKTtcbiAgICAvL+eCueWHu+WOu+i0reeJqei9puaMiemSrumhtemdoui3s+i9rOWcqOi0reeJqei9pumhtemdouWQjOaXtuWVhuWTgeWHuueOsOWcqOi0reeJqei9puS4rVxuICAgICQoJy5wbGFjZS1vcmRlcicpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIHZhciBjYXJ0X2hyZWYgPSAnL3JlY29tbWVuZG9yZGVyL2N1c3RvbWVyLycgKyBjdXN0b21lcl9pZCArICcvY2FydCc7XG4gICAgICAgIHpodWdlLnRyYWNrKCfotK3nianovabvvIjkuKrmgKflrprliLbvvIknLGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHdpbmRvdy5sb2NhdGlvbi5ocmVmID0gY2FydF9ocmVmO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSkod2luZG93LmNtQXBwID0gd2luZG93LmNtQXBwIHx8IHt9KTtcbiJdLCJmaWxlIjoicmVjb21tZW5kb3JkZXIvcmVjb21tZW5kLmpzIn0=
