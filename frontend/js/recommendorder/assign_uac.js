(function(cmApp) {
    "use strict";

    var url = window.location.href;
    var dealer_id = Number(url.match(/(dealer\/)\d+\//)[0].split('/')[1]);
    cmApp.itemIdToIndex = {}; 
    cmApp.customerIdToIndex ={};

    cmApp.appVue = new Vue({
        el: '#app',
        data: {
            assocItemLoading: false,
            assocCustomerLoading: false,

            itemGroup: [],
            itemGroupDict: {},
            itemSearchTerm: '',
            associatedItems: [],
            assocItemSearchTerm: '',

            customerGroup: [],
            customerGroupDict: {},
            customerSearchTerm: '',
            associatedCustomers:[],
            associatedCustomerSearchTerm: "",

            groupAssociation: [],
            customers: [],
            customerIndexDict: {},
            items: [],
            curCustomerGroup: null,
            curItemGroup: null,
            curAssociation: null,
            categories: []
        },
        computed: {
            fullLoading: function() {
                return this.items.length === 0 || 
                    this.customers.length === 0 || 
                    this.assocItemLoading ||
                    this.assocCustomerLoading;
            },
            computedItems: function() {
                var r = [];
                var self = this;
                if (self.itemSearchTerm.length === 0) {
                    return self.items;
                }

                this.items.forEach(function(ele) {
                    if (ele.item_name.indexOf(self.itemSearchTerm) !== -1) {
                        r.push(ele);
                    }
                });
                return r;
            },
            computedAssocItems: function() {
                var r = [];
                var self = this;
                if (self.assocItemSearchTerm.length === 0) {
                    return self.associatedItems;
                }
                this.associatedItems.forEach(function(ele) {
                    if(ele.item.item_name.indexOf(self.assocItemSearchTerm) !== -1) {
                        r.push(ele);
                    }
                });
                return r;
            },
            computedCustomers: function() {
                var r = [];
                var self = this;
                if (self.customerSearchTerm.length === 0) {
                    return self.customers;
                }
                this.customers.forEach(function(ele) {
                    if ((ele.customer_name && ele.customer_name.indexOf(self.customerSearchTerm) !== -1) ||
                        (ele.customer_id && ele.customer_id.indexOf(self.customerSearchTerm) !==-1)) {
                        r.push(ele);
                    }
                });
                return r;
            },
            computedAssocCustomers: function() {
                var r = [];
                var self = this;
                if (self.associatedCustomerSearchTerm.length === 0) {
                    return self.associatedCustomers;
                }
                this.associatedCustomers.forEach(function(ele) {
                    if ((ele.customer.customer_name &&
                        ele.customer.customer_name.indexOf(self.associatedCustomerSearchTerm) !== -1) ||
                        (ele.customer.customer_id &&
                        ele.customer.customer_id.indexOf(self.associatedCustomerSearchTerm) !== -1)) {
                        r.push(ele);
                    }
                });
                return r;
            }
        },
        watch: {
            curItemGroup: {
                handler: function(newVal, oldVal) {
                    if (oldVal === null || 
                        newVal === null ||
                        typeof newVal.id === 'undefined' ||
                        newVal.id != oldVal.id) {
                        console.log('New item');
                        return;
                    }
                    console.log('Item modified');
                    this.updateItemGroup(newVal);
                },
                deep: true
            },
            curCustomerGroup: {
                handler: function(newVal, oldVal) {
                    if (oldVal === null || 
                        newVal === null ||
                        typeof newVal.id === 'undefined' ||
                        newVal.id !== oldVal.id) {
                        console.log("New Customer Group Item");
                        return;
                    }
                    console.log('Customer modified');
                    this.updateCustomerGroup(newVal);
                },
                deep: true
            },
            curAssociation: {
                handler: function(newVal, oldVal) {
                    console.log(newVal);
                    console.log(oldVal);
                    if (newVal === null || oldVal === null ||
                        typeof newVal.id === 'undefined' ||
                        newVal.id !== oldVal.id) {
                        return;
                    }
                    console.log('Current Association changed');
                    this.updateAssociation(newVal);
                },
                deep: true
            }
        },
        methods: {
            onSearchItemClicked: function() {
                console.log('search item');
                this.itemSearchTerm = $('#item-search-input').val();
            },
            onSearchAssocItemClicked: function() {
                console.log('search assoc item');
                this.assocItemSearchTerm = $('#assoc-item-search-input').val();
            },
            onSearchCustomerClicked: function() {
                console.log('search customer');
                this.customerSearchTerm = $('#customer-search-input').val();
            },
            onSearchAssocCustomerClicked: function() {
                console.log('search assoc customer');
                this.associatedCustomerSearchTerm = $('#assoc-customer-search-input').val();
            },
            setAllItemsSelected: function(sel) {
                this.items.forEach(function(ele) {
                    ele.selected = sel;
                });
            },
            setAllAssocItemsSelected: function(sel) {
                this.associatedItems.forEach(function(ele) {
                    ele.selected = sel;
                });
            },
            setAllCustomersSelected: function(sel) {
                this.customers.forEach(function(ele) {
                    ele.selected = sel;
                });
            },
            setAllAssocCustomersSelected: function(sel) {
                this.associatedCustomers.forEach(function(ele) {
                    ele.selected = sel;
                });
            },
            deleteSelAssoc: function(val, old) {
                console.log('Removing association');
                var self = this;
                $.ajax({
                    type: "DELETE",
                    url: "/recommendorder/api/v1/dealer/" + dealer_id + "/customer_item_group_association/" + self.curAssociation.id,
                    success: function(data) {
                        console.log(data);
                        self.curItemGroup = null;
                        self.curAssociation = null;
                        self.curCustomerGroup = null;
                        self.loadGroupAssociationData();
                    }
                });
            },
            showModifyAssocNameModal: function() {
                $('#new-assoc-name-input').val(this.curAssociation.name);
                $('#modify-assoc-name').modal('show');
            },
            onModifyAssocName: function() {
                console.log('modifying assoc name');
                this.curAssociation.name = $("#new-assoc-name-input").val();
                $('#modify-assoc-name').modal('hide');
            },

            showModifyCustomerGroupName: function() {
                $('#new-customer-group-name-input').val(this.curCustomerGroup.group_name);
                $('#modify-customer-group-name').modal('show');
            },
            onModifyCustomerGroupName: function() {
                console.log('modify user group name');
                this.curCustomerGroup.group_name = $('#new-customer-group-name-input').val();
                $('#modify-customer-group-name').modal('hide');
            },

            showModifyItemGroupName: function() {
                console.log('modify item group name');
                $('#new-item-group-name-input').val(this.curItemGroup.group_name);
                $('#modify-item-group-name').modal('show');
            },
            onModifyItemGroupName: function() {
                console.log('modify item group name');
                this.curItemGroup.group_name = $('#new-item-group-name-input').val();
                $('#modify-item-group-name').modal('hide');
            },

            updateAssociation: function(obj) {
                console.log('updating association');
                console.log(obj);
                var self = this;
                $.ajax({
                    type: "PATCH",
                    url: "/recommendorder/api/v1/dealer/" + dealer_id + "/customer_item_group_association/" + self.curAssociation.id + "/",
                    data: obj,
                    success: function(data) {
                        console.log(data);
                        self.groupAssociation.forEach(function(ele) {
                            if (ele.id === data.data.id) {
                                ele.customer_group = data.data.customer_group;
                                ele.dealer = data.data.dealer;
                                ele.item_group = data.data.item_group;
                                ele.name = data.data.name;
                            }
                        });
                    }
                });
            },
            updateItemGroup: function(obj) {
                $.ajax({
                    type: "PATCH",
                    url: "/recommendorder/api/v1/dealer/" + dealer_id + "/item_group/" + obj.id + "/",
                    data: obj,
                    success: function(data) {
                        console.log(data);
                    }
                });
            },
            updateCustomerGroup: function(obj) {
                $.ajax({
                    type: "PATCH",
                    url: "/recommendorder/api/v1/dealer/" + dealer_id + "/customer_group/" + obj.id + "/",
                    data: obj,
                    success: function(data) {
                        console.log(data);
                    }
                });
            },
            searchItem: function(val) {
                console.log(val);
                var self = this;
                $.ajax({
                    dataType: "json",
                    url: "/recommendorder/api/v1/dealer/" + dealer_id + "/item/search",
                    data: {
                        "query": val
                    },
                    success: function(data) {
                        self.setItems(data.data);
                    }
                });
            },
            loadCustomers: function(search_term) {
                var data = {
                    "per_page": 0,
                };
                if(search_term !== null) {
                    data.customer_name__contains = search_term;
                }
                console.log("Loading customers");
                var self = this;
                $.ajax({
                    dataType: "json",
                    url: "/recommendorder/api/v1/dealer/" + dealer_id + "/customer",
                    data: data,
                    success: function(data) {
                        console.log(data);
                        self.setCustomers(data.data);
                    }
                });
            },
            loadCategories: function() {
                console.log("loading categories");
                var self = this;
                $.ajax({
                    dataType: "json",
                    url: "/recommendorder/api/v1/category",
                    data: {
                        "per_page": 0
                    },
                    success: function(data) {
                        self.categories = data.data;
                    }
                });
            },
            loadItems: function() {
                console.log("Loading items");
                var self = this;
                self.items = [];
                $.ajax({
                    dataType: "json",
                    url: "/recommendorder/api/v1/item",
                    data: {
                        "per_page": 0 
                    },
                    success: function(data) {
                        self.setItems(data.data);
                    }
                });
            },
            setItems: function(items) {
                var self = this;
                var result = [];
                items.forEach(function(ele, i) {
                    ele.selected = false;
                    ele.associated = false;
                    cmApp.itemIdToIndex[ele.id] = i;
                });
                self.items = items;
            },
            setCustomers: function(customers) {
                var self = this;
                customers.forEach(function(ele, i) {
                    ele.selected = false;
                    ele.associated = false;
                    cmApp.customerIdToIndex[ele.id] = i;
                });
                self.customers = customers;
            },
            addItemToGroup: function() {
                var self = this;
                var idsStr = '';
                self.items.forEach(function(ele) {
                    if (ele.selected && !ele.associated) {
                        if (idsStr.length === 0) {
                            idsStr = idsStr + ele.id;
                        } else {
                            idsStr = idsStr + ',' + ele.id;
                        }
                    }
                });
                $.ajax({
                    type: "POST",
                    url: "/recommendorder/api/v1/dealer/" + dealer_id + "/group_item_map/batch-add",
                    data: {
                        item_ids: idsStr,
                        group_id: self.curItemGroup.id,
                    }, 
                    success: function(data) {
                        console.log("Returned");
                        data.data.forEach(function(item) {
                            self.associatedItems.push(item);
                            self.items[cmApp.itemIdToIndex[item.item.id]].associated = true;
                        });
                    }
                });
            },
            addCustomerToGroup: function() {
                var self = this;
                var idsStr = '';
                self.customers.forEach(function(ele) {
                    if (ele.selected && !ele.associated) {
                        if (idsStr.length === 0) {
                            idsStr = idsStr + ele.id;
                        } else {
                            idsStr = idsStr + ',' + ele.id;
                        }
                    }
                });
                console.log(idsStr);
                $.ajax({
                    type: "POST",
                    url: "/recommendorder/api/v1/dealer/" + dealer_id + "/group_customer_map/batch-add",
                    data: {
                        customer_ids: idsStr,
                        group_id: self.curCustomerGroup.id
                    },
                    success: function(data) {
                        console.log(data);
                        data.data.forEach(function(item) {
                            self.associatedCustomers.push(item);
                            self.customers[cmApp.customerIdToIndex[item.customer.id]].associated = true;
                        });
                    }
                });
            },
            removeItemFromGroup: function() {
                var self = this;
                var result = [];
                var deleted = [];
                var idsStr = '';
                self.associatedItems.forEach(function(ele) {
                    if (ele.selected) {
                        if (idsStr.length === 0) {
                            idsStr = idsStr + ele.id;
                        } else {
                            idsStr = idsStr + ',' + ele.id;
                        }
                        deleted.push(ele);
                    } else {
                        result.push(ele);
                    }
                });
                console.log(idsStr);
                $.ajax({
                    type: "DELETE",
                    url: "/recommendorder/api/v1/dealer/" + dealer_id + "/group_item_map",
                    data: {
                        ids: idsStr
                    },
                    success: function(data) {
                        console.log(data);
                        deleted.forEach(function(ele) {
                            var i = self.items[cmApp.itemIdToIndex[ele.item.id]];
                            i.associated = false;
                            i.selected = false;
                        });
                    }
                });
                self.associatedItems = result;
            },
            removeCustomerFromGroup: function() {
                var self = this;
                var result = [];
                var deleted = [];
                var idsStr = '';
                self.associatedCustomers.forEach(function(ele) {
                    if (ele.selected) {
                        if (idsStr.length === 0) {
                            idsStr = idsStr + ele.id;
                        } else {
                            idsStr = idsStr + ',' + ele.id;
                        }
                        deleted.push(ele);
                    } else {
                        result.push(ele);
                    }
                });
                console.log(idsStr);
                $.ajax({
                    type: "DELETE",
                    url: "/recommendorder/api/v1/dealer/" + dealer_id + "/group_customer_map",
                    data: {
                        ids: idsStr
                    },
                    success: function(data) {
                        console.log(data);
                        deleted.forEach(function(ele) {
                            if (ele.customer.id in cmApp.customerIdToIndex) {
                                var i = self.customers[cmApp.customerIdToIndex[ele.customer.id]];
                                i.associated = false;
                                i.selected = false;
                            }
                        });
                    }
                });
                self.associatedCustomers = result;
            },
            loadGroupAssociationData: function() {
                console.log("loading group association data");
                var self = this;
                self.groupAssociation = [];
                $.ajax({
                    dataType: "json",
                    url: "/recommendorder/api/v1/dealer/" + dealer_id + "/customer_item_group_association",
                    data: {
                        "per_page": 0 // no pagination
                    },
                    success: function(data) {
                        self.groupAssociation = data.data;
                    }
                });
            },
            setItemAssociated: function(associated, val) {
                var self = this;
                associated.forEach(function(ele) {
                    self.items[cmApp.itemIdToIndex[ele.item.id]].associated = val;
                });
            },
            loadAssociatedItems: function() {
                var self = this;
                self.assocItemLoading = true;
                self.setItemAssociated(self.associatedItems, false);
                self.associatedItems = [];
                $.ajax({
                    dataType: "json",
                    url: "/recommendorder/api/v1/dealer/" + dealer_id + "/group_item_map",
                    data: {
                        "per_page": 0,
                        "group": self.curItemGroup.id
                    },
                    success: function(data) {
                        data.data.forEach(function(ele) {
                            ele.selected = false;
                        });
                        self.associatedItems = data.data;
                        self.assocItemLoading = false;
                        self.setItemAssociated(self.associatedItems, true);
                    }
                });
            },
            setCustomerAssociated: function(associated, val) {
                var self = this;
                associated.forEach(function(ele) {
                    if (ele.customer.id in cmApp.customerIdToIndex) {
                        self.customers[cmApp.customerIdToIndex[ele.customer.id]].associated = val;
                    }
                });
            },
            loadAssociatedCustomers: function() {
                var self = this;
                self.assocCustomerLoading = true;
                self.setCustomerAssociated(self.associatedCustomers, false);
                self.associatedCustomers = [];
                $.ajax({
                    dataType: "json",
                    url: "/recommendorder/api/v1/dealer/" + dealer_id + "/group_customer_map",
                    data: {
                        group: self.curCustomerGroup.id,
                        per_page: 0
                    },
                    success: function(data) {
                        data.data.forEach(function(ele) {
                            ele.selected = false;
                        });
                        self.associatedCustomers = data.data;
                        self.setCustomerAssociated(self.associatedCustomers, true);
                        self.assocCustomerLoading = false;
                    }
                });
            },
            setCurAssociation: function(ele) {
                var data = {
                    customer_group: ele.customer_group.id,
                    dealer: ele.dealer.id,
                    id: ele.id,
                    item_group: ele.item_group.id,
                    name: ele.name
                };
                this.curAssociation = data;
            },
            onAssocSelected: function(ele) {
                console.log("Association selected");
                console.log(ele);
                this.setCurAssociation(ele);
                this.curCustomerGroup = ele.customer_group;
                this.curItemGroup = ele.item_group;
                this.loadAssociatedItems();
                this.loadAssociatedCustomers();
            }
        },
        mounted: function() {
            console.log('Mounted, loading data');
            this.loadGroupAssociationData();
            this.loadItems();
            this.loadCustomers(null);
        }
    });

    $(document).ready(function() {
        $('.ui.checkbox').checkbox();
        $('select.dropdown').dropdown();

        var newCustomerGroup = null;
        var newItemGroup = null;
        var newAssoc = null;

        $('#create-assoc').click(function() {
            newCustomerGroup = null;
            newItemGroup = null;
            newAssoc = null;

            $('#customer-group-name').val('');
            $('#customer-group-rule').val('0');
            $('#customer-form').removeClass('loading');
            $('#customer-group-btn').removeClass('disabled');

            $('#item-group-name').val('');
            $('#item-group-rule').val('0');
            $('#item-form').removeClass('loading');
            $('#item-group-btn').removeClass('disabled');

            $('#create-assoc-modal').modal('show');
        });

        $('#customer-group-btn').click(function(data) {
            var self = this;
            console.log("submit customer group");
            if (newCustomerGroup !== null) {
                alert("Customer Group Added");
                return;
            }
            var group_name = $('#customer-group-name').val();
            var rule_type = $('#customer-group-rule').val();
            console.log(group_name);
            console.log(rule_type);
            $('customer-group-form').addClass('loading');
            $.ajax({
                type: "POST",
                url: "/recommendorder/api/v1/dealer/" + dealer_id + "/customer_group",
                data: {
                    group_name: group_name,
                    rule_type: rule_type
                },
                success: function(data) {
                    console.log(data);
                    newCustomerGroup = data.data; 
                    $('customer-group-form').removeClass('loading');
                    $(self).addClass('disabled');
                }
            });
        });

        $('#item-group-btn').click(function(data) {
            var self = this;
            console.log("submit item group");
            if (newItemGroup !== null) {
                alert("Item Group Added");
                return;
            }
            var group_name = $('#item-group-name').val();
            var rule_type = $('#item-group-rule').val();
            $('#item-group-from').addClass('loading');
            $.ajax({
                type: "POST",
                url: "/recommendorder/api/v1/dealer/" + dealer_id + "/item_group",
                data: {
                    group_name: group_name,
                    rule_type: rule_type
                },
                success: function(data) {
                    console.log(data);
                    newItemGroup = data.data;
                    $('#item-group-form').removeClass('loading');
                    $(self).addClass('disabled');
                }
            });
        });

        $('#submit-assoc').click(function(data) {
            var self = this;
            if (newAssoc !== null) {
                alert("New association already created");
                return;
            }

            if(newCustomerGroup === null || newItemGroup === null) {
                alert("Customer Group and Item Group must be created first");
                return;
            }

            var name = $('#assoc-name').val();

            $('#assoc-form').addClass('loading');

            $.ajax({
                type: "POST",
                url: "/recommendorder/api/v1/dealer/" + dealer_id + "/customer_item_group_association",
                data: {
                    name: name,
                    customer_group: newCustomerGroup.id,
                    item_group: newItemGroup.id
                }, 
                success: function(data) {
                    console.log(data);
                    newAssoc = data.data;
                    $('#assoc-form').removeClass('loading');
                    $(self).addClass('disabled');
                    cmApp.appVue.loadGroupAssociationData();
                }
            });
        });

        setupCSRF();
    });


})(window.cmApp = window.cmApp || {});
