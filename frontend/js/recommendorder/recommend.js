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
