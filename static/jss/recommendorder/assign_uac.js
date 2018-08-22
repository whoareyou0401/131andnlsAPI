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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9hc3NpZ25fdWFjLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbihjbUFwcCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgdmFyIHVybCA9IHdpbmRvdy5sb2NhdGlvbi5ocmVmO1xuICAgIHZhciBkZWFsZXJfaWQgPSBOdW1iZXIodXJsLm1hdGNoKC8oZGVhbGVyXFwvKVxcZCtcXC8vKVswXS5zcGxpdCgnLycpWzFdKTtcbiAgICBjbUFwcC5pdGVtSWRUb0luZGV4ID0ge307IFxuICAgIGNtQXBwLmN1c3RvbWVySWRUb0luZGV4ID17fTtcblxuICAgIGNtQXBwLmFwcFZ1ZSA9IG5ldyBWdWUoe1xuICAgICAgICBlbDogJyNhcHAnLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBhc3NvY0l0ZW1Mb2FkaW5nOiBmYWxzZSxcbiAgICAgICAgICAgIGFzc29jQ3VzdG9tZXJMb2FkaW5nOiBmYWxzZSxcblxuICAgICAgICAgICAgaXRlbUdyb3VwOiBbXSxcbiAgICAgICAgICAgIGl0ZW1Hcm91cERpY3Q6IHt9LFxuICAgICAgICAgICAgaXRlbVNlYXJjaFRlcm06ICcnLFxuICAgICAgICAgICAgYXNzb2NpYXRlZEl0ZW1zOiBbXSxcbiAgICAgICAgICAgIGFzc29jSXRlbVNlYXJjaFRlcm06ICcnLFxuXG4gICAgICAgICAgICBjdXN0b21lckdyb3VwOiBbXSxcbiAgICAgICAgICAgIGN1c3RvbWVyR3JvdXBEaWN0OiB7fSxcbiAgICAgICAgICAgIGN1c3RvbWVyU2VhcmNoVGVybTogJycsXG4gICAgICAgICAgICBhc3NvY2lhdGVkQ3VzdG9tZXJzOltdLFxuICAgICAgICAgICAgYXNzb2NpYXRlZEN1c3RvbWVyU2VhcmNoVGVybTogXCJcIixcblxuICAgICAgICAgICAgZ3JvdXBBc3NvY2lhdGlvbjogW10sXG4gICAgICAgICAgICBjdXN0b21lcnM6IFtdLFxuICAgICAgICAgICAgY3VzdG9tZXJJbmRleERpY3Q6IHt9LFxuICAgICAgICAgICAgaXRlbXM6IFtdLFxuICAgICAgICAgICAgY3VyQ3VzdG9tZXJHcm91cDogbnVsbCxcbiAgICAgICAgICAgIGN1ckl0ZW1Hcm91cDogbnVsbCxcbiAgICAgICAgICAgIGN1ckFzc29jaWF0aW9uOiBudWxsLFxuICAgICAgICAgICAgY2F0ZWdvcmllczogW11cbiAgICAgICAgfSxcbiAgICAgICAgY29tcHV0ZWQ6IHtcbiAgICAgICAgICAgIGZ1bGxMb2FkaW5nOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5pdGVtcy5sZW5ndGggPT09IDAgfHwgXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VzdG9tZXJzLmxlbmd0aCA9PT0gMCB8fCBcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hc3NvY0l0ZW1Mb2FkaW5nIHx8XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYXNzb2NDdXN0b21lckxvYWRpbmc7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29tcHV0ZWRJdGVtczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHIgPSBbXTtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuaXRlbVNlYXJjaFRlcm0ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLml0ZW1zO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuaXRlbXMuZm9yRWFjaChmdW5jdGlvbihlbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsZS5pdGVtX25hbWUuaW5kZXhPZihzZWxmLml0ZW1TZWFyY2hUZXJtKSAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHIucHVzaChlbGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHI7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29tcHV0ZWRBc3NvY0l0ZW1zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgciA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5hc3NvY0l0ZW1TZWFyY2hUZXJtLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi5hc3NvY2lhdGVkSXRlbXM7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuYXNzb2NpYXRlZEl0ZW1zLmZvckVhY2goZnVuY3Rpb24oZWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKGVsZS5pdGVtLml0ZW1fbmFtZS5pbmRleE9mKHNlbGYuYXNzb2NJdGVtU2VhcmNoVGVybSkgIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByLnB1c2goZWxlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHJldHVybiByO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGNvbXB1dGVkQ3VzdG9tZXJzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgciA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5jdXN0b21lclNlYXJjaFRlcm0ubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLmN1c3RvbWVycztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5jdXN0b21lcnMuZm9yRWFjaChmdW5jdGlvbihlbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKChlbGUuY3VzdG9tZXJfbmFtZSAmJiBlbGUuY3VzdG9tZXJfbmFtZS5pbmRleE9mKHNlbGYuY3VzdG9tZXJTZWFyY2hUZXJtKSAhPT0gLTEpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAoZWxlLmN1c3RvbWVyX2lkICYmIGVsZS5jdXN0b21lcl9pZC5pbmRleE9mKHNlbGYuY3VzdG9tZXJTZWFyY2hUZXJtKSAhPT0tMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHIucHVzaChlbGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHI7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY29tcHV0ZWRBc3NvY0N1c3RvbWVyczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHIgPSBbXTtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuYXNzb2NpYXRlZEN1c3RvbWVyU2VhcmNoVGVybS5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNlbGYuYXNzb2NpYXRlZEN1c3RvbWVycztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5hc3NvY2lhdGVkQ3VzdG9tZXJzLmZvckVhY2goZnVuY3Rpb24oZWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgoZWxlLmN1c3RvbWVyLmN1c3RvbWVyX25hbWUgJiZcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZS5jdXN0b21lci5jdXN0b21lcl9uYW1lLmluZGV4T2Yoc2VsZi5hc3NvY2lhdGVkQ3VzdG9tZXJTZWFyY2hUZXJtKSAhPT0gLTEpIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICAoZWxlLmN1c3RvbWVyLmN1c3RvbWVyX2lkICYmXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGUuY3VzdG9tZXIuY3VzdG9tZXJfaWQuaW5kZXhPZihzZWxmLmFzc29jaWF0ZWRDdXN0b21lclNlYXJjaFRlcm0pICE9PSAtMSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHIucHVzaChlbGUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIHdhdGNoOiB7XG4gICAgICAgICAgICBjdXJJdGVtR3JvdXA6IHtcbiAgICAgICAgICAgICAgICBoYW5kbGVyOiBmdW5jdGlvbihuZXdWYWwsIG9sZFZhbCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAob2xkVmFsID09PSBudWxsIHx8IFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3VmFsID09PSBudWxsIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlb2YgbmV3VmFsLmlkID09PSAndW5kZWZpbmVkJyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3VmFsLmlkICE9IG9sZFZhbC5pZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ05ldyBpdGVtJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ0l0ZW0gbW9kaWZpZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVJdGVtR3JvdXAobmV3VmFsKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRlZXA6IHRydWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjdXJDdXN0b21lckdyb3VwOiB7XG4gICAgICAgICAgICAgICAgaGFuZGxlcjogZnVuY3Rpb24obmV3VmFsLCBvbGRWYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9sZFZhbCA9PT0gbnVsbCB8fCBcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld1ZhbCA9PT0gbnVsbCB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZW9mIG5ld1ZhbC5pZCA9PT0gJ3VuZGVmaW5lZCcgfHxcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld1ZhbC5pZCAhPT0gb2xkVmFsLmlkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIk5ldyBDdXN0b21lciBHcm91cCBJdGVtXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdDdXN0b21lciBtb2RpZmllZCcpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUN1c3RvbWVyR3JvdXAobmV3VmFsKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRlZXA6IHRydWVcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjdXJBc3NvY2lhdGlvbjoge1xuICAgICAgICAgICAgICAgIGhhbmRsZXI6IGZ1bmN0aW9uKG5ld1ZhbCwgb2xkVmFsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKG5ld1ZhbCk7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKG9sZFZhbCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChuZXdWYWwgPT09IG51bGwgfHwgb2xkVmFsID09PSBudWxsIHx8XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlb2YgbmV3VmFsLmlkID09PSAndW5kZWZpbmVkJyB8fFxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3VmFsLmlkICE9PSBvbGRWYWwuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnQ3VycmVudCBBc3NvY2lhdGlvbiBjaGFuZ2VkJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlQXNzb2NpYXRpb24obmV3VmFsKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRlZXA6IHRydWVcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgbWV0aG9kczoge1xuICAgICAgICAgICAgb25TZWFyY2hJdGVtQ2xpY2tlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3NlYXJjaCBpdGVtJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5pdGVtU2VhcmNoVGVybSA9ICQoJyNpdGVtLXNlYXJjaC1pbnB1dCcpLnZhbCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uU2VhcmNoQXNzb2NJdGVtQ2xpY2tlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3NlYXJjaCBhc3NvYyBpdGVtJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5hc3NvY0l0ZW1TZWFyY2hUZXJtID0gJCgnI2Fzc29jLWl0ZW0tc2VhcmNoLWlucHV0JykudmFsKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25TZWFyY2hDdXN0b21lckNsaWNrZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzZWFyY2ggY3VzdG9tZXInKTtcbiAgICAgICAgICAgICAgICB0aGlzLmN1c3RvbWVyU2VhcmNoVGVybSA9ICQoJyNjdXN0b21lci1zZWFyY2gtaW5wdXQnKS52YWwoKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvblNlYXJjaEFzc29jQ3VzdG9tZXJDbGlja2VkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnc2VhcmNoIGFzc29jIGN1c3RvbWVyJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5hc3NvY2lhdGVkQ3VzdG9tZXJTZWFyY2hUZXJtID0gJCgnI2Fzc29jLWN1c3RvbWVyLXNlYXJjaC1pbnB1dCcpLnZhbCgpO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldEFsbEl0ZW1zU2VsZWN0ZWQ6IGZ1bmN0aW9uKHNlbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuaXRlbXMuZm9yRWFjaChmdW5jdGlvbihlbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlLnNlbGVjdGVkID0gc2VsO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldEFsbEFzc29jSXRlbXNTZWxlY3RlZDogZnVuY3Rpb24oc2VsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hc3NvY2lhdGVkSXRlbXMuZm9yRWFjaChmdW5jdGlvbihlbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgZWxlLnNlbGVjdGVkID0gc2VsO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldEFsbEN1c3RvbWVyc1NlbGVjdGVkOiBmdW5jdGlvbihzZWwpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmN1c3RvbWVycy5mb3JFYWNoKGZ1bmN0aW9uKGVsZSkge1xuICAgICAgICAgICAgICAgICAgICBlbGUuc2VsZWN0ZWQgPSBzZWw7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0QWxsQXNzb2NDdXN0b21lcnNTZWxlY3RlZDogZnVuY3Rpb24oc2VsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5hc3NvY2lhdGVkQ3VzdG9tZXJzLmZvckVhY2goZnVuY3Rpb24oZWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZS5zZWxlY3RlZCA9IHNlbDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBkZWxldGVTZWxBc3NvYzogZnVuY3Rpb24odmFsLCBvbGQpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnUmVtb3ZpbmcgYXNzb2NpYXRpb24nKTtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJERUxFVEVcIixcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9yZWNvbW1lbmRvcmRlci9hcGkvdjEvZGVhbGVyL1wiICsgZGVhbGVyX2lkICsgXCIvY3VzdG9tZXJfaXRlbV9ncm91cF9hc3NvY2lhdGlvbi9cIiArIHNlbGYuY3VyQXNzb2NpYXRpb24uaWQsXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jdXJJdGVtR3JvdXAgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jdXJBc3NvY2lhdGlvbiA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmN1ckN1c3RvbWVyR3JvdXAgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2FkR3JvdXBBc3NvY2lhdGlvbkRhdGEoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNob3dNb2RpZnlBc3NvY05hbWVNb2RhbDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgJCgnI25ldy1hc3NvYy1uYW1lLWlucHV0JykudmFsKHRoaXMuY3VyQXNzb2NpYXRpb24ubmFtZSk7XG4gICAgICAgICAgICAgICAgJCgnI21vZGlmeS1hc3NvYy1uYW1lJykubW9kYWwoJ3Nob3cnKTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBvbk1vZGlmeUFzc29jTmFtZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ21vZGlmeWluZyBhc3NvYyBuYW1lJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJBc3NvY2lhdGlvbi5uYW1lID0gJChcIiNuZXctYXNzb2MtbmFtZS1pbnB1dFwiKS52YWwoKTtcbiAgICAgICAgICAgICAgICAkKCcjbW9kaWZ5LWFzc29jLW5hbWUnKS5tb2RhbCgnaGlkZScpO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgc2hvd01vZGlmeUN1c3RvbWVyR3JvdXBOYW1lOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAkKCcjbmV3LWN1c3RvbWVyLWdyb3VwLW5hbWUtaW5wdXQnKS52YWwodGhpcy5jdXJDdXN0b21lckdyb3VwLmdyb3VwX25hbWUpO1xuICAgICAgICAgICAgICAgICQoJyNtb2RpZnktY3VzdG9tZXItZ3JvdXAtbmFtZScpLm1vZGFsKCdzaG93Jyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25Nb2RpZnlDdXN0b21lckdyb3VwTmFtZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ21vZGlmeSB1c2VyIGdyb3VwIG5hbWUnKTtcbiAgICAgICAgICAgICAgICB0aGlzLmN1ckN1c3RvbWVyR3JvdXAuZ3JvdXBfbmFtZSA9ICQoJyNuZXctY3VzdG9tZXItZ3JvdXAtbmFtZS1pbnB1dCcpLnZhbCgpO1xuICAgICAgICAgICAgICAgICQoJyNtb2RpZnktY3VzdG9tZXItZ3JvdXAtbmFtZScpLm1vZGFsKCdoaWRlJyk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBzaG93TW9kaWZ5SXRlbUdyb3VwTmFtZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ21vZGlmeSBpdGVtIGdyb3VwIG5hbWUnKTtcbiAgICAgICAgICAgICAgICAkKCcjbmV3LWl0ZW0tZ3JvdXAtbmFtZS1pbnB1dCcpLnZhbCh0aGlzLmN1ckl0ZW1Hcm91cC5ncm91cF9uYW1lKTtcbiAgICAgICAgICAgICAgICAkKCcjbW9kaWZ5LWl0ZW0tZ3JvdXAtbmFtZScpLm1vZGFsKCdzaG93Jyk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgb25Nb2RpZnlJdGVtR3JvdXBOYW1lOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnbW9kaWZ5IGl0ZW0gZ3JvdXAgbmFtZScpO1xuICAgICAgICAgICAgICAgIHRoaXMuY3VySXRlbUdyb3VwLmdyb3VwX25hbWUgPSAkKCcjbmV3LWl0ZW0tZ3JvdXAtbmFtZS1pbnB1dCcpLnZhbCgpO1xuICAgICAgICAgICAgICAgICQoJyNtb2RpZnktaXRlbS1ncm91cC1uYW1lJykubW9kYWwoJ2hpZGUnKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHVwZGF0ZUFzc29jaWF0aW9uOiBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygndXBkYXRpbmcgYXNzb2NpYXRpb24nKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhvYmopO1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIlBBVENIXCIsXG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvcmVjb21tZW5kb3JkZXIvYXBpL3YxL2RlYWxlci9cIiArIGRlYWxlcl9pZCArIFwiL2N1c3RvbWVyX2l0ZW1fZ3JvdXBfYXNzb2NpYXRpb24vXCIgKyBzZWxmLmN1ckFzc29jaWF0aW9uLmlkICsgXCIvXCIsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IG9iaixcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmdyb3VwQXNzb2NpYXRpb24uZm9yRWFjaChmdW5jdGlvbihlbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoZWxlLmlkID09PSBkYXRhLmRhdGEuaWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlLmN1c3RvbWVyX2dyb3VwID0gZGF0YS5kYXRhLmN1c3RvbWVyX2dyb3VwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGUuZGVhbGVyID0gZGF0YS5kYXRhLmRlYWxlcjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlLml0ZW1fZ3JvdXAgPSBkYXRhLmRhdGEuaXRlbV9ncm91cDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZWxlLm5hbWUgPSBkYXRhLmRhdGEubmFtZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHVwZGF0ZUl0ZW1Hcm91cDogZnVuY3Rpb24ob2JqKSB7XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJQQVRDSFwiLFxuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL3JlY29tbWVuZG9yZGVyL2FwaS92MS9kZWFsZXIvXCIgKyBkZWFsZXJfaWQgKyBcIi9pdGVtX2dyb3VwL1wiICsgb2JqLmlkICsgXCIvXCIsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IG9iaixcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB1cGRhdGVDdXN0b21lckdyb3VwOiBmdW5jdGlvbihvYmopIHtcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIlBBVENIXCIsXG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvcmVjb21tZW5kb3JkZXIvYXBpL3YxL2RlYWxlci9cIiArIGRlYWxlcl9pZCArIFwiL2N1c3RvbWVyX2dyb3VwL1wiICsgb2JqLmlkICsgXCIvXCIsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IG9iaixcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZWFyY2hJdGVtOiBmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyh2YWwpO1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvcmVjb21tZW5kb3JkZXIvYXBpL3YxL2RlYWxlci9cIiArIGRlYWxlcl9pZCArIFwiL2l0ZW0vc2VhcmNoXCIsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicXVlcnlcIjogdmFsXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2V0SXRlbXMoZGF0YS5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxvYWRDdXN0b21lcnM6IGZ1bmN0aW9uKHNlYXJjaF90ZXJtKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRhdGEgPSB7XG4gICAgICAgICAgICAgICAgICAgIFwicGVyX3BhZ2VcIjogMCxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGlmKHNlYXJjaF90ZXJtICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGRhdGEuY3VzdG9tZXJfbmFtZV9fY29udGFpbnMgPSBzZWFyY2hfdGVybTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJMb2FkaW5nIGN1c3RvbWVyc1wiKTtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL3JlY29tbWVuZG9yZGVyL2FwaS92MS9kZWFsZXIvXCIgKyBkZWFsZXJfaWQgKyBcIi9jdXN0b21lclwiLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2V0Q3VzdG9tZXJzKGRhdGEuZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsb2FkQ2F0ZWdvcmllczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJsb2FkaW5nIGNhdGVnb3JpZXNcIik7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9yZWNvbW1lbmRvcmRlci9hcGkvdjEvY2F0ZWdvcnlcIixcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJwZXJfcGFnZVwiOiAwXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY2F0ZWdvcmllcyA9IGRhdGEuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxvYWRJdGVtczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJMb2FkaW5nIGl0ZW1zXCIpO1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICBzZWxmLml0ZW1zID0gW107XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL3JlY29tbWVuZG9yZGVyL2FwaS92MS9pdGVtXCIsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFwicGVyX3BhZ2VcIjogMCBcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXRJdGVtcyhkYXRhLmRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0SXRlbXM6IGZ1bmN0aW9uKGl0ZW1zKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgICAgICAgICBpdGVtcy5mb3JFYWNoKGZ1bmN0aW9uKGVsZSwgaSkge1xuICAgICAgICAgICAgICAgICAgICBlbGUuc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgZWxlLmFzc29jaWF0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgY21BcHAuaXRlbUlkVG9JbmRleFtlbGUuaWRdID0gaTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBzZWxmLml0ZW1zID0gaXRlbXM7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0Q3VzdG9tZXJzOiBmdW5jdGlvbihjdXN0b21lcnMpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgY3VzdG9tZXJzLmZvckVhY2goZnVuY3Rpb24oZWxlLCBpKSB7XG4gICAgICAgICAgICAgICAgICAgIGVsZS5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBlbGUuYXNzb2NpYXRlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICBjbUFwcC5jdXN0b21lcklkVG9JbmRleFtlbGUuaWRdID0gaTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBzZWxmLmN1c3RvbWVycyA9IGN1c3RvbWVycztcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBhZGRJdGVtVG9Hcm91cDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZhciBpZHNTdHIgPSAnJztcbiAgICAgICAgICAgICAgICBzZWxmLml0ZW1zLmZvckVhY2goZnVuY3Rpb24oZWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbGUuc2VsZWN0ZWQgJiYgIWVsZS5hc3NvY2lhdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaWRzU3RyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkc1N0ciA9IGlkc1N0ciArIGVsZS5pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWRzU3RyID0gaWRzU3RyICsgJywnICsgZWxlLmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvcmVjb21tZW5kb3JkZXIvYXBpL3YxL2RlYWxlci9cIiArIGRlYWxlcl9pZCArIFwiL2dyb3VwX2l0ZW1fbWFwL2JhdGNoLWFkZFwiLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpdGVtX2lkczogaWRzU3RyLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JvdXBfaWQ6IHNlbGYuY3VySXRlbUdyb3VwLmlkLFxuICAgICAgICAgICAgICAgICAgICB9LCBcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJSZXR1cm5lZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmFzc29jaWF0ZWRJdGVtcy5wdXNoKGl0ZW0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuaXRlbXNbY21BcHAuaXRlbUlkVG9JbmRleFtpdGVtLml0ZW0uaWRdXS5hc3NvY2lhdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYWRkQ3VzdG9tZXJUb0dyb3VwOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdmFyIGlkc1N0ciA9ICcnO1xuICAgICAgICAgICAgICAgIHNlbGYuY3VzdG9tZXJzLmZvckVhY2goZnVuY3Rpb24oZWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbGUuc2VsZWN0ZWQgJiYgIWVsZS5hc3NvY2lhdGVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoaWRzU3RyLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkc1N0ciA9IGlkc1N0ciArIGVsZS5pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWRzU3RyID0gaWRzU3RyICsgJywnICsgZWxlLmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coaWRzU3RyKTtcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9yZWNvbW1lbmRvcmRlci9hcGkvdjEvZGVhbGVyL1wiICsgZGVhbGVyX2lkICsgXCIvZ3JvdXBfY3VzdG9tZXJfbWFwL2JhdGNoLWFkZFwiLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjdXN0b21lcl9pZHM6IGlkc1N0cixcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwX2lkOiBzZWxmLmN1ckN1c3RvbWVyR3JvdXAuaWRcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmRhdGEuZm9yRWFjaChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5hc3NvY2lhdGVkQ3VzdG9tZXJzLnB1c2goaXRlbSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5jdXN0b21lcnNbY21BcHAuY3VzdG9tZXJJZFRvSW5kZXhbaXRlbS5jdXN0b21lci5pZF1dLmFzc29jaWF0ZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZW1vdmVJdGVtRnJvbUdyb3VwOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBkZWxldGVkID0gW107XG4gICAgICAgICAgICAgICAgdmFyIGlkc1N0ciA9ICcnO1xuICAgICAgICAgICAgICAgIHNlbGYuYXNzb2NpYXRlZEl0ZW1zLmZvckVhY2goZnVuY3Rpb24oZWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbGUuc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpZHNTdHIubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWRzU3RyID0gaWRzU3RyICsgZWxlLmlkO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZHNTdHIgPSBpZHNTdHIgKyAnLCcgKyBlbGUuaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBkZWxldGVkLnB1c2goZWxlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGVsZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhpZHNTdHIpO1xuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiREVMRVRFXCIsXG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvcmVjb21tZW5kb3JkZXIvYXBpL3YxL2RlYWxlci9cIiArIGRlYWxlcl9pZCArIFwiL2dyb3VwX2l0ZW1fbWFwXCIsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkczogaWRzU3RyXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5mb3JFYWNoKGZ1bmN0aW9uKGVsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpID0gc2VsZi5pdGVtc1tjbUFwcC5pdGVtSWRUb0luZGV4W2VsZS5pdGVtLmlkXV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaS5hc3NvY2lhdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaS5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBzZWxmLmFzc29jaWF0ZWRJdGVtcyA9IHJlc3VsdDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByZW1vdmVDdXN0b21lckZyb21Hcm91cDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgICAgICAgICB2YXIgZGVsZXRlZCA9IFtdO1xuICAgICAgICAgICAgICAgIHZhciBpZHNTdHIgPSAnJztcbiAgICAgICAgICAgICAgICBzZWxmLmFzc29jaWF0ZWRDdXN0b21lcnMuZm9yRWFjaChmdW5jdGlvbihlbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVsZS5zZWxlY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGlkc1N0ci5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZHNTdHIgPSBpZHNTdHIgKyBlbGUuaWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlkc1N0ciA9IGlkc1N0ciArICcsJyArIGVsZS5pZDtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZWQucHVzaChlbGUpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goZWxlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGlkc1N0cik7XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJERUxFVEVcIixcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9yZWNvbW1lbmRvcmRlci9hcGkvdjEvZGVhbGVyL1wiICsgZGVhbGVyX2lkICsgXCIvZ3JvdXBfY3VzdG9tZXJfbWFwXCIsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkczogaWRzU3RyXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlZC5mb3JFYWNoKGZ1bmN0aW9uKGVsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChlbGUuY3VzdG9tZXIuaWQgaW4gY21BcHAuY3VzdG9tZXJJZFRvSW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGkgPSBzZWxmLmN1c3RvbWVyc1tjbUFwcC5jdXN0b21lcklkVG9JbmRleFtlbGUuY3VzdG9tZXIuaWRdXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaS5hc3NvY2lhdGVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGkuc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIHNlbGYuYXNzb2NpYXRlZEN1c3RvbWVycyA9IHJlc3VsdDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsb2FkR3JvdXBBc3NvY2lhdGlvbkRhdGE6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwibG9hZGluZyBncm91cCBhc3NvY2lhdGlvbiBkYXRhXCIpO1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICBzZWxmLmdyb3VwQXNzb2NpYXRpb24gPSBbXTtcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogXCJqc29uXCIsXG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvcmVjb21tZW5kb3JkZXIvYXBpL3YxL2RlYWxlci9cIiArIGRlYWxlcl9pZCArIFwiL2N1c3RvbWVyX2l0ZW1fZ3JvdXBfYXNzb2NpYXRpb25cIixcbiAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgXCJwZXJfcGFnZVwiOiAwIC8vIG5vIHBhZ2luYXRpb25cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5ncm91cEFzc29jaWF0aW9uID0gZGF0YS5kYXRhO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2V0SXRlbUFzc29jaWF0ZWQ6IGZ1bmN0aW9uKGFzc29jaWF0ZWQsIHZhbCkge1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICBhc3NvY2lhdGVkLmZvckVhY2goZnVuY3Rpb24oZWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuaXRlbXNbY21BcHAuaXRlbUlkVG9JbmRleFtlbGUuaXRlbS5pZF1dLmFzc29jaWF0ZWQgPSB2YWw7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbG9hZEFzc29jaWF0ZWRJdGVtczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHNlbGYuYXNzb2NJdGVtTG9hZGluZyA9IHRydWU7XG4gICAgICAgICAgICAgICAgc2VsZi5zZXRJdGVtQXNzb2NpYXRlZChzZWxmLmFzc29jaWF0ZWRJdGVtcywgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHNlbGYuYXNzb2NpYXRlZEl0ZW1zID0gW107XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6IFwianNvblwiLFxuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL3JlY29tbWVuZG9yZGVyL2FwaS92MS9kZWFsZXIvXCIgKyBkZWFsZXJfaWQgKyBcIi9ncm91cF9pdGVtX21hcFwiLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBcInBlcl9wYWdlXCI6IDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBcImdyb3VwXCI6IHNlbGYuY3VySXRlbUdyb3VwLmlkXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEuZGF0YS5mb3JFYWNoKGZ1bmN0aW9uKGVsZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZS5zZWxlY3RlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmFzc29jaWF0ZWRJdGVtcyA9IGRhdGEuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuYXNzb2NJdGVtTG9hZGluZyA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXRJdGVtQXNzb2NpYXRlZChzZWxmLmFzc29jaWF0ZWRJdGVtcywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBzZXRDdXN0b21lckFzc29jaWF0ZWQ6IGZ1bmN0aW9uKGFzc29jaWF0ZWQsIHZhbCkge1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICBhc3NvY2lhdGVkLmZvckVhY2goZnVuY3Rpb24oZWxlKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlbGUuY3VzdG9tZXIuaWQgaW4gY21BcHAuY3VzdG9tZXJJZFRvSW5kZXgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY3VzdG9tZXJzW2NtQXBwLmN1c3RvbWVySWRUb0luZGV4W2VsZS5jdXN0b21lci5pZF1dLmFzc29jaWF0ZWQgPSB2YWw7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBsb2FkQXNzb2NpYXRlZEN1c3RvbWVyczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgIHNlbGYuYXNzb2NDdXN0b21lckxvYWRpbmcgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHNlbGYuc2V0Q3VzdG9tZXJBc3NvY2lhdGVkKHNlbGYuYXNzb2NpYXRlZEN1c3RvbWVycywgZmFsc2UpO1xuICAgICAgICAgICAgICAgIHNlbGYuYXNzb2NpYXRlZEN1c3RvbWVycyA9IFtdO1xuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiBcImpzb25cIixcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9yZWNvbW1lbmRvcmRlci9hcGkvdjEvZGVhbGVyL1wiICsgZGVhbGVyX2lkICsgXCIvZ3JvdXBfY3VzdG9tZXJfbWFwXCIsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdyb3VwOiBzZWxmLmN1ckN1c3RvbWVyR3JvdXAuaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBwZXJfcGFnZTogMFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhLmRhdGEuZm9yRWFjaChmdW5jdGlvbihlbGUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGUuc2VsZWN0ZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5hc3NvY2lhdGVkQ3VzdG9tZXJzID0gZGF0YS5kYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXRDdXN0b21lckFzc29jaWF0ZWQoc2VsZi5hc3NvY2lhdGVkQ3VzdG9tZXJzLCB0cnVlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuYXNzb2NDdXN0b21lckxvYWRpbmcgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNldEN1ckFzc29jaWF0aW9uOiBmdW5jdGlvbihlbGUpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgY3VzdG9tZXJfZ3JvdXA6IGVsZS5jdXN0b21lcl9ncm91cC5pZCxcbiAgICAgICAgICAgICAgICAgICAgZGVhbGVyOiBlbGUuZGVhbGVyLmlkLFxuICAgICAgICAgICAgICAgICAgICBpZDogZWxlLmlkLFxuICAgICAgICAgICAgICAgICAgICBpdGVtX2dyb3VwOiBlbGUuaXRlbV9ncm91cC5pZCxcbiAgICAgICAgICAgICAgICAgICAgbmFtZTogZWxlLm5hbWVcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHRoaXMuY3VyQXNzb2NpYXRpb24gPSBkYXRhO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG9uQXNzb2NTZWxlY3RlZDogZnVuY3Rpb24oZWxlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJBc3NvY2lhdGlvbiBzZWxlY3RlZFwiKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlbGUpO1xuICAgICAgICAgICAgICAgIHRoaXMuc2V0Q3VyQXNzb2NpYXRpb24oZWxlKTtcbiAgICAgICAgICAgICAgICB0aGlzLmN1ckN1c3RvbWVyR3JvdXAgPSBlbGUuY3VzdG9tZXJfZ3JvdXA7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJJdGVtR3JvdXAgPSBlbGUuaXRlbV9ncm91cDtcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRBc3NvY2lhdGVkSXRlbXMoKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRBc3NvY2lhdGVkQ3VzdG9tZXJzKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG1vdW50ZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ01vdW50ZWQsIGxvYWRpbmcgZGF0YScpO1xuICAgICAgICAgICAgdGhpcy5sb2FkR3JvdXBBc3NvY2lhdGlvbkRhdGEoKTtcbiAgICAgICAgICAgIHRoaXMubG9hZEl0ZW1zKCk7XG4gICAgICAgICAgICB0aGlzLmxvYWRDdXN0b21lcnMobnVsbCk7XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcudWkuY2hlY2tib3gnKS5jaGVja2JveCgpO1xuICAgICAgICAkKCdzZWxlY3QuZHJvcGRvd24nKS5kcm9wZG93bigpO1xuXG4gICAgICAgIHZhciBuZXdDdXN0b21lckdyb3VwID0gbnVsbDtcbiAgICAgICAgdmFyIG5ld0l0ZW1Hcm91cCA9IG51bGw7XG4gICAgICAgIHZhciBuZXdBc3NvYyA9IG51bGw7XG5cbiAgICAgICAgJCgnI2NyZWF0ZS1hc3NvYycpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgbmV3Q3VzdG9tZXJHcm91cCA9IG51bGw7XG4gICAgICAgICAgICBuZXdJdGVtR3JvdXAgPSBudWxsO1xuICAgICAgICAgICAgbmV3QXNzb2MgPSBudWxsO1xuXG4gICAgICAgICAgICAkKCcjY3VzdG9tZXItZ3JvdXAtbmFtZScpLnZhbCgnJyk7XG4gICAgICAgICAgICAkKCcjY3VzdG9tZXItZ3JvdXAtcnVsZScpLnZhbCgnMCcpO1xuICAgICAgICAgICAgJCgnI2N1c3RvbWVyLWZvcm0nKS5yZW1vdmVDbGFzcygnbG9hZGluZycpO1xuICAgICAgICAgICAgJCgnI2N1c3RvbWVyLWdyb3VwLWJ0bicpLnJlbW92ZUNsYXNzKCdkaXNhYmxlZCcpO1xuXG4gICAgICAgICAgICAkKCcjaXRlbS1ncm91cC1uYW1lJykudmFsKCcnKTtcbiAgICAgICAgICAgICQoJyNpdGVtLWdyb3VwLXJ1bGUnKS52YWwoJzAnKTtcbiAgICAgICAgICAgICQoJyNpdGVtLWZvcm0nKS5yZW1vdmVDbGFzcygnbG9hZGluZycpO1xuICAgICAgICAgICAgJCgnI2l0ZW0tZ3JvdXAtYnRuJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG5cbiAgICAgICAgICAgICQoJyNjcmVhdGUtYXNzb2MtbW9kYWwnKS5tb2RhbCgnc2hvdycpO1xuICAgICAgICB9KTtcblxuICAgICAgICAkKCcjY3VzdG9tZXItZ3JvdXAtYnRuJykuY2xpY2soZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWJtaXQgY3VzdG9tZXIgZ3JvdXBcIik7XG4gICAgICAgICAgICBpZiAobmV3Q3VzdG9tZXJHcm91cCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiQ3VzdG9tZXIgR3JvdXAgQWRkZWRcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGdyb3VwX25hbWUgPSAkKCcjY3VzdG9tZXItZ3JvdXAtbmFtZScpLnZhbCgpO1xuICAgICAgICAgICAgdmFyIHJ1bGVfdHlwZSA9ICQoJyNjdXN0b21lci1ncm91cC1ydWxlJykudmFsKCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhncm91cF9uYW1lKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKHJ1bGVfdHlwZSk7XG4gICAgICAgICAgICAkKCdjdXN0b21lci1ncm91cC1mb3JtJykuYWRkQ2xhc3MoJ2xvYWRpbmcnKTtcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdHlwZTogXCJQT1NUXCIsXG4gICAgICAgICAgICAgICAgdXJsOiBcIi9yZWNvbW1lbmRvcmRlci9hcGkvdjEvZGVhbGVyL1wiICsgZGVhbGVyX2lkICsgXCIvY3VzdG9tZXJfZ3JvdXBcIixcbiAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgIGdyb3VwX25hbWU6IGdyb3VwX25hbWUsXG4gICAgICAgICAgICAgICAgICAgIHJ1bGVfdHlwZTogcnVsZV90eXBlXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICBuZXdDdXN0b21lckdyb3VwID0gZGF0YS5kYXRhOyBcbiAgICAgICAgICAgICAgICAgICAgJCgnY3VzdG9tZXItZ3JvdXAtZm9ybScpLnJlbW92ZUNsYXNzKCdsb2FkaW5nJyk7XG4gICAgICAgICAgICAgICAgICAgICQoc2VsZikuYWRkQ2xhc3MoJ2Rpc2FibGVkJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoJyNpdGVtLWdyb3VwLWJ0bicpLmNsaWNrKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic3VibWl0IGl0ZW0gZ3JvdXBcIik7XG4gICAgICAgICAgICBpZiAobmV3SXRlbUdyb3VwICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJJdGVtIEdyb3VwIEFkZGVkXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBncm91cF9uYW1lID0gJCgnI2l0ZW0tZ3JvdXAtbmFtZScpLnZhbCgpO1xuICAgICAgICAgICAgdmFyIHJ1bGVfdHlwZSA9ICQoJyNpdGVtLWdyb3VwLXJ1bGUnKS52YWwoKTtcbiAgICAgICAgICAgICQoJyNpdGVtLWdyb3VwLWZyb20nKS5hZGRDbGFzcygnbG9hZGluZycpO1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICB1cmw6IFwiL3JlY29tbWVuZG9yZGVyL2FwaS92MS9kZWFsZXIvXCIgKyBkZWFsZXJfaWQgKyBcIi9pdGVtX2dyb3VwXCIsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBncm91cF9uYW1lOiBncm91cF9uYW1lLFxuICAgICAgICAgICAgICAgICAgICBydWxlX3R5cGU6IHJ1bGVfdHlwZVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgbmV3SXRlbUdyb3VwID0gZGF0YS5kYXRhO1xuICAgICAgICAgICAgICAgICAgICAkKCcjaXRlbS1ncm91cC1mb3JtJykucmVtb3ZlQ2xhc3MoJ2xvYWRpbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgJChzZWxmKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCgnI3N1Ym1pdC1hc3NvYycpLmNsaWNrKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgIGlmIChuZXdBc3NvYyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGFsZXJ0KFwiTmV3IGFzc29jaWF0aW9uIGFscmVhZHkgY3JlYXRlZFwiKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKG5ld0N1c3RvbWVyR3JvdXAgPT09IG51bGwgfHwgbmV3SXRlbUdyb3VwID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgYWxlcnQoXCJDdXN0b21lciBHcm91cCBhbmQgSXRlbSBHcm91cCBtdXN0IGJlIGNyZWF0ZWQgZmlyc3RcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgbmFtZSA9ICQoJyNhc3NvYy1uYW1lJykudmFsKCk7XG5cbiAgICAgICAgICAgICQoJyNhc3NvYy1mb3JtJykuYWRkQ2xhc3MoJ2xvYWRpbmcnKTtcblxuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB0eXBlOiBcIlBPU1RcIixcbiAgICAgICAgICAgICAgICB1cmw6IFwiL3JlY29tbWVuZG9yZGVyL2FwaS92MS9kZWFsZXIvXCIgKyBkZWFsZXJfaWQgKyBcIi9jdXN0b21lcl9pdGVtX2dyb3VwX2Fzc29jaWF0aW9uXCIsXG4gICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICAgICAgICAgICAgICBjdXN0b21lcl9ncm91cDogbmV3Q3VzdG9tZXJHcm91cC5pZCxcbiAgICAgICAgICAgICAgICAgICAgaXRlbV9ncm91cDogbmV3SXRlbUdyb3VwLmlkXG4gICAgICAgICAgICAgICAgfSwgXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgbmV3QXNzb2MgPSBkYXRhLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgICQoJyNhc3NvYy1mb3JtJykucmVtb3ZlQ2xhc3MoJ2xvYWRpbmcnKTtcbiAgICAgICAgICAgICAgICAgICAgJChzZWxmKS5hZGRDbGFzcygnZGlzYWJsZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgY21BcHAuYXBwVnVlLmxvYWRHcm91cEFzc29jaWF0aW9uRGF0YSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcblxuICAgICAgICBzZXR1cENTUkYoKTtcbiAgICB9KTtcblxuXG59KSh3aW5kb3cuY21BcHAgPSB3aW5kb3cuY21BcHAgfHwge30pO1xuIl0sImZpbGUiOiJyZWNvbW1lbmRvcmRlci9hc3NpZ25fdWFjLmpzIn0=
