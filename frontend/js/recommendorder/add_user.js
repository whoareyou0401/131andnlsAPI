(function(cmApp) {
    "use strict";
    setupCSRF();

    cmApp.bind = new Vue({
        el: '#app',
        data: {
            username: '',
            password: '',
            role: 0, // 0 --customer,  1 -- salesman, 2 -- dealer
            dealer_id: null,
            dealers: [],
            groups: [],
            group_id: null
        },
        methods: {
            loadDealers: function(){
                var self = this;
                $.ajax({
                    type: "get",
                    url: "/api/v1.1/recommendorder/staff/dealer",
                    success: function(data) {
                        self.dealers = data.data;
                        $('#dealer_dropdown').dropdown();
                    }
                });
            },
            loadCustomerGroup: function() {
                var self = this;
                if (self.dealer_id === null) {
                    return;
                }
                $.ajax({
                    type: "get",
                    url: "/api/v1.1/recommendorder/staff/dealer/"+ self.dealer_id + "/customer_group", 
                    data: {
                        per_page: 0
                    },
                    success: function(data) {
                        self.groups = data.data;
                        $('#group_dropdown').dropdown();
                    }
                });
            },
            submit: function(e) {
                e.preventDefault();
                console.log("submit");
                var self = this;
                $.ajax({
                    type: 'post',
                    url: '/api/v1.1/recommendorder/staff/user',
                    data: {
                        name: self.username,
                        password: self.password,
                        role: self.role,
                        dealer_id: self.dealer_id,
                        group_id: self.group_id
                    },
                    success: function(data) {
                        console.log(data);
                        if(data.code !== 0) {
                            alert(data.data);
                        } else {
                            alert('Success');
                        }
                    }
                });
            }
        },
        watch: {
            role: function(val) {
                console.log("Role changed to " + val);
                this.loadCustomerGroup();
            },
            dealer_id: function(val) {
                console.log('Dealer changed to ' + val);
                this.loadCustomerGroup();
            }
        },
        mounted: function() {
            this.loadDealers();
            var self = this;
            $('#dealer_id').change(function(e) {
                console.log($(e.currentTarget).val());
                self.dealer_id = parseInt($(e.currentTarget).val());
            });

            $('#group_id').change(function(e) {
                console.log('group id changed');
                self.group_id = parseInt($(e.currentTarget).val());
            });


            $('.ui.radio.checkbox').checkbox();

            $('#cus_ckbx').change(function(e) {
                if ($(e.currentTarget).val() === 'on') {
                    console.log('customer role selected');
                    self.role = 0;
                }
            });
            $('#sm_ckbx').change(function(e) {
                if ($(e.currentTarget).val() === 'on') {
                    console.log('salesman role selected');
                    self.role = 1;
                }
            });
            $('#dealer_ckbx').change(function(e) {
                if ($(e.currentTarget).val() === 'on') {
                    console.log('dealer role selected');
                    self.role = 2;
                }
            });
        }
    });
})(window.cmApp = window.cmApp || {});
