(function(cmApp) {
    "use strict";

    cmApp.toast = new Vue({
        el: '#error',
        data: {
            isHidden: true,
            isError: true,
            message: ''
        },
        computed: {
            isSuccess: function() {
                return !this.isError;
            }
        },
        methods: {
            dismiss: function() {
                this.isHidden = true;
            },
            show: function() {
                this.isError = false;
                this.isHidden = false;
            },
            showError: function() {
                this.isError = true;
                this.isHidden = false;
            }
        }
    });

    cmApp.dbInfo = new Vue({
        el: '#dbinfo',
        data: {
            dbinfo: null,
            tableNames: [],
            permission_code: '',
            statusCode: 0,
            posted: false
        },
        computed: {
            tableNum: function() {
                return this.tableNames.length;
            },
            hasPermission: function() {
                var hasPermission = true;
                for (var i=0; i < this.permission_code.length; i++) {
                    if (this.permission_code[i] !== '0') {
                        hasPermission = false;
                        break;
                    }
                }
                return hasPermission;
            }
        }
    });

    $(document).ready(function() {
        $('.ui.dropdown').dropdown();

        $('#db_info').submit(function() {
            console.log("Submitting db info form");
            var options = {
                url: '/api/v1/thirdpartydb',
                type: 'post',
                dataType: 'json',
                beforeSumit: function() {
                    $($('#db_info .submit')[0]).addClass('loading');
                },
                success: function(e) {
                    cmApp.dbInfo.posted = true;
                    console.log(e);
                    $($('#db_info .submit')[0]).removeClass('loading');
                    cmApp.dbInfo.statusCode = e.code;
                    if (e.code === 0) {
                        console.log("success");
                        cmApp.dbInfo.dbinfo = e.data.dbinfo;
                        cmApp.dbInfo.tableNames= e.data.table_names;
                        cmApp.dbInfo.permission_code = e.data.permission_code;
                        if (cmApp.dbInfo.hasPermission) {
                            cmApp.toast.message = '连接数据库成功';
                            cmApp.toast.show();
                            $('#nav-btn').removeClass('disabled');
                        } else {
                            cmApp.toast.message = '权限不全 Err(' + cmApp.dbInfo.permission_code + ')';
                            cmApp.toast.showError();
                        }
                    } else {
                        cmApp.dbInfo.dbinfo = null;
                        cmApp.dbInfo.tableNames = [];
                        cmApp.dbInfo.permission_code = '22222';
                        cmApp.toast.message = e.message + ':' + e.errors;
                        cmApp.toast.showError();
                    }
                }
            };
            $(this).ajaxSubmit(options);
            return false;
        });
    });
})(window.cmApp = window.cmApp || {});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzdG9yZS90aGlyZF9wYXJ0eV9kYl9pbmZvLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbihjbUFwcCkge1xuICAgIFwidXNlIHN0cmljdFwiO1xuXG4gICAgY21BcHAudG9hc3QgPSBuZXcgVnVlKHtcbiAgICAgICAgZWw6ICcjZXJyb3InLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBpc0hpZGRlbjogdHJ1ZSxcbiAgICAgICAgICAgIGlzRXJyb3I6IHRydWUsXG4gICAgICAgICAgICBtZXNzYWdlOiAnJ1xuICAgICAgICB9LFxuICAgICAgICBjb21wdXRlZDoge1xuICAgICAgICAgICAgaXNTdWNjZXNzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gIXRoaXMuaXNFcnJvcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcbiAgICAgICAgbWV0aG9kczoge1xuICAgICAgICAgICAgZGlzbWlzczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0hpZGRlbiA9IHRydWU7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2hvdzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0Vycm9yID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0hpZGRlbiA9IGZhbHNlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHNob3dFcnJvcjogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5pc0Vycm9yID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLmlzSGlkZGVuID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgIGNtQXBwLmRiSW5mbyA9IG5ldyBWdWUoe1xuICAgICAgICBlbDogJyNkYmluZm8nLFxuICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICBkYmluZm86IG51bGwsXG4gICAgICAgICAgICB0YWJsZU5hbWVzOiBbXSxcbiAgICAgICAgICAgIHBlcm1pc3Npb25fY29kZTogJycsXG4gICAgICAgICAgICBzdGF0dXNDb2RlOiAwLFxuICAgICAgICAgICAgcG9zdGVkOiBmYWxzZVxuICAgICAgICB9LFxuICAgICAgICBjb21wdXRlZDoge1xuICAgICAgICAgICAgdGFibGVOdW06IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnRhYmxlTmFtZXMubGVuZ3RoO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhhc1Blcm1pc3Npb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBoYXNQZXJtaXNzaW9uID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpPTA7IGkgPCB0aGlzLnBlcm1pc3Npb25fY29kZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wZXJtaXNzaW9uX2NvZGVbaV0gIT09ICcwJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaGFzUGVybWlzc2lvbiA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGhhc1Blcm1pc3Npb247XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgICAgICAkKCcudWkuZHJvcGRvd24nKS5kcm9wZG93bigpO1xuXG4gICAgICAgICQoJyNkYl9pbmZvJykuc3VibWl0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJTdWJtaXR0aW5nIGRiIGluZm8gZm9ybVwiKTtcbiAgICAgICAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIHVybDogJy9hcGkvdjEvdGhpcmRwYXJ0eWRiJyxcbiAgICAgICAgICAgICAgICB0eXBlOiAncG9zdCcsXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgICAgICBiZWZvcmVTdW1pdDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICQoJCgnI2RiX2luZm8gLnN1Ym1pdCcpWzBdKS5hZGRDbGFzcygnbG9hZGluZycpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICBjbUFwcC5kYkluZm8ucG9zdGVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZSk7XG4gICAgICAgICAgICAgICAgICAgICQoJCgnI2RiX2luZm8gLnN1Ym1pdCcpWzBdKS5yZW1vdmVDbGFzcygnbG9hZGluZycpO1xuICAgICAgICAgICAgICAgICAgICBjbUFwcC5kYkluZm8uc3RhdHVzQ29kZSA9IGUuY29kZTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKGUuY29kZSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJzdWNjZXNzXCIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgY21BcHAuZGJJbmZvLmRiaW5mbyA9IGUuZGF0YS5kYmluZm87XG4gICAgICAgICAgICAgICAgICAgICAgICBjbUFwcC5kYkluZm8udGFibGVOYW1lcz0gZS5kYXRhLnRhYmxlX25hbWVzO1xuICAgICAgICAgICAgICAgICAgICAgICAgY21BcHAuZGJJbmZvLnBlcm1pc3Npb25fY29kZSA9IGUuZGF0YS5wZXJtaXNzaW9uX2NvZGU7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoY21BcHAuZGJJbmZvLmhhc1Blcm1pc3Npb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbUFwcC50b2FzdC5tZXNzYWdlID0gJ+i/nuaOpeaVsOaNruW6k+aIkOWKnyc7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY21BcHAudG9hc3Quc2hvdygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNuYXYtYnRuJykucmVtb3ZlQ2xhc3MoJ2Rpc2FibGVkJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNtQXBwLnRvYXN0Lm1lc3NhZ2UgPSAn5p2D6ZmQ5LiN5YWoIEVycignICsgY21BcHAuZGJJbmZvLnBlcm1pc3Npb25fY29kZSArICcpJztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbUFwcC50b2FzdC5zaG93RXJyb3IoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtQXBwLmRiSW5mby5kYmluZm8gPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICAgICAgY21BcHAuZGJJbmZvLnRhYmxlTmFtZXMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNtQXBwLmRiSW5mby5wZXJtaXNzaW9uX2NvZGUgPSAnMjIyMjInO1xuICAgICAgICAgICAgICAgICAgICAgICAgY21BcHAudG9hc3QubWVzc2FnZSA9IGUubWVzc2FnZSArICc6JyArIGUuZXJyb3JzO1xuICAgICAgICAgICAgICAgICAgICAgICAgY21BcHAudG9hc3Quc2hvd0Vycm9yKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgJCh0aGlzKS5hamF4U3VibWl0KG9wdGlvbnMpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9KTtcbiAgICB9KTtcbn0pKHdpbmRvdy5jbUFwcCA9IHdpbmRvdy5jbUFwcCB8fCB7fSk7XG4iXSwiZmlsZSI6InN0b3JlL3RoaXJkX3BhcnR5X2RiX2luZm8uanMifQ==
