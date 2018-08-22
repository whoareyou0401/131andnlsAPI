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

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9hZGRfdXNlci5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oY21BcHApIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcbiAgICBzZXR1cENTUkYoKTtcblxuICAgIGNtQXBwLmJpbmQgPSBuZXcgVnVlKHtcbiAgICAgICAgZWw6ICcjYXBwJyxcbiAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgdXNlcm5hbWU6ICcnLFxuICAgICAgICAgICAgcGFzc3dvcmQ6ICcnLFxuICAgICAgICAgICAgcm9sZTogMCwgLy8gMCAtLWN1c3RvbWVyLCAgMSAtLSBzYWxlc21hbiwgMiAtLSBkZWFsZXJcbiAgICAgICAgICAgIGRlYWxlcl9pZDogbnVsbCxcbiAgICAgICAgICAgIGRlYWxlcnM6IFtdLFxuICAgICAgICAgICAgZ3JvdXBzOiBbXSxcbiAgICAgICAgICAgIGdyb3VwX2lkOiBudWxsXG4gICAgICAgIH0sXG4gICAgICAgIG1ldGhvZHM6IHtcbiAgICAgICAgICAgIGxvYWREZWFsZXJzOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcImdldFwiLFxuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL2FwaS92MS4xL3JlY29tbWVuZG9yZGVyL3N0YWZmL2RlYWxlclwiLFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmRlYWxlcnMgPSBkYXRhLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjZGVhbGVyX2Ryb3Bkb3duJykuZHJvcGRvd24oKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGxvYWRDdXN0b21lckdyb3VwOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuZGVhbGVyX2lkID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJnZXRcIixcbiAgICAgICAgICAgICAgICAgICAgdXJsOiBcIi9hcGkvdjEuMS9yZWNvbW1lbmRvcmRlci9zdGFmZi9kZWFsZXIvXCIrIHNlbGYuZGVhbGVyX2lkICsgXCIvY3VzdG9tZXJfZ3JvdXBcIiwgXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBlcl9wYWdlOiAwXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZ3JvdXBzID0gZGF0YS5kYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2dyb3VwX2Ryb3Bkb3duJykuZHJvcGRvd24oKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHN1Ym1pdDogZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcInN1Ym1pdFwiKTtcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3Bvc3QnLFxuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvYXBpL3YxLjEvcmVjb21tZW5kb3JkZXIvc3RhZmYvdXNlcicsXG4gICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IHNlbGYudXNlcm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBwYXNzd29yZDogc2VsZi5wYXNzd29yZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvbGU6IHNlbGYucm9sZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRlYWxlcl9pZDogc2VsZi5kZWFsZXJfaWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBncm91cF9pZDogc2VsZi5ncm91cF9pZFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGRhdGEuY29kZSAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KGRhdGEuZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KCdTdWNjZXNzJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgd2F0Y2g6IHtcbiAgICAgICAgICAgIHJvbGU6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiUm9sZSBjaGFuZ2VkIHRvIFwiICsgdmFsKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRDdXN0b21lckdyb3VwKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgZGVhbGVyX2lkOiBmdW5jdGlvbih2YWwpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRGVhbGVyIGNoYW5nZWQgdG8gJyArIHZhbCk7XG4gICAgICAgICAgICAgICAgdGhpcy5sb2FkQ3VzdG9tZXJHcm91cCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBtb3VudGVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHRoaXMubG9hZERlYWxlcnMoKTtcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICQoJyNkZWFsZXJfaWQnKS5jaGFuZ2UoZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCQoZS5jdXJyZW50VGFyZ2V0KS52YWwoKSk7XG4gICAgICAgICAgICAgICAgc2VsZi5kZWFsZXJfaWQgPSBwYXJzZUludCgkKGUuY3VycmVudFRhcmdldCkudmFsKCkpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICQoJyNncm91cF9pZCcpLmNoYW5nZShmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2dyb3VwIGlkIGNoYW5nZWQnKTtcbiAgICAgICAgICAgICAgICBzZWxmLmdyb3VwX2lkID0gcGFyc2VJbnQoJChlLmN1cnJlbnRUYXJnZXQpLnZhbCgpKTtcbiAgICAgICAgICAgIH0pO1xuXG5cbiAgICAgICAgICAgICQoJy51aS5yYWRpby5jaGVja2JveCcpLmNoZWNrYm94KCk7XG5cbiAgICAgICAgICAgICQoJyNjdXNfY2tieCcpLmNoYW5nZShmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQoZS5jdXJyZW50VGFyZ2V0KS52YWwoKSA9PT0gJ29uJykge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY3VzdG9tZXIgcm9sZSBzZWxlY3RlZCcpO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLnJvbGUgPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJCgnI3NtX2NrYngnKS5jaGFuZ2UoZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgIGlmICgkKGUuY3VycmVudFRhcmdldCkudmFsKCkgPT09ICdvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ3NhbGVzbWFuIHJvbGUgc2VsZWN0ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5yb2xlID0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICQoJyNkZWFsZXJfY2tieCcpLmNoYW5nZShmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgaWYgKCQoZS5jdXJyZW50VGFyZ2V0KS52YWwoKSA9PT0gJ29uJykge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnZGVhbGVyIHJvbGUgc2VsZWN0ZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5yb2xlID0gMjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH0pO1xufSkod2luZG93LmNtQXBwID0gd2luZG93LmNtQXBwIHx8IHt9KTtcbiJdLCJmaWxlIjoicmVjb21tZW5kb3JkZXIvYWRkX3VzZXIuanMifQ==
