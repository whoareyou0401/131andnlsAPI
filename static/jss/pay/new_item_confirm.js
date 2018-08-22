$(function() {

     setupCSRF();
     var app = new Vue({
        el: '#app',
        data: {

            datas: [],
            current_page: 1,
            integration:'',
            search_type:'person',
            word:'',
            pages:[]

        },
        beforeCreate: function() {
            var _self = this;
            $.ajax({
                url: "/api/v1.1/pay/new-item-log",
                type: "GET",
                data:{
                    page:1
                },
                datatype:"JSON",
                success: function(data) {
                    console.log(data.data);
                    _self.datas = data.data.datas;
                    _self.pages = data.data.pages;
                }
            });
        },
        watch:{
            current_page:function(){
                var _self = this;
                $.ajax({
                    url: "/api/v1.1/pay/new-item-log",
                    type: "GET",
                    data:{
                        'page':_self.current_page
                    },
                    datatype:"JSON",
                    success: function(data) {
                        console.log(data);
                        _self.datas = data.data.datas;
                        _self.pages = data.data.pages;
                    }
                });
            }
        },
        methods: {
            pageChange: function(index) {
                this.current_page = index + 1;
            },
            pageBefore: function(){
                if (this.current_page == 1) {
                    alert('已经是第一页了');
                    return;
                }
                this.current_page -= 1;
            },
            pageAfter: function(){
                if (this.current_page == this.pages.length) {
                    alert('已经是最后页了');
                    return;
                }
                this.current_page += 1;
            },
            commit: function(){
                var _self = this;
                $.ajax({
                    url: "/api/v1.1/pay/new-item-search",
                    type: "GET",
                    data:{
                        word: _self.word,
                        search_type: _self.search_type
                    },
                    datatype:"JSON",
                    success: function(data) {
                        console.log(data);
                        _self.datas = data.data.datas;
                        _self.pages = data.data.pages;
                    }
                });
            },
            confirm:function(index, event){

                var confirm = event.srcElement.value;
                var obj = this.datas[index];
                var status = 0;
                if (confirm == 'yes') {
                    status = 1;
                } else if (confirm == 'no') {
                    status = 2;
                } else {
                    return;
                }
                $.ajax({
                    url: "/api/v1.1/pay/new-item",
                    type: "PATCH",
                    data:{
                        status: status,
                        uid: obj.uid,
                        id: obj.id
                    },
                    datatype:"JSON",
                    success: function(data) {
                        console.log(data);
                    }
                });
            },
            inputSearch: function(){
                this.word = $("#search").val();
            },
            selectVal:function(e){
                this.search_type = e.srcElement.value;
            }

        }
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJwYXkvbmV3X2l0ZW1fY29uZmlybS5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIkKGZ1bmN0aW9uKCkge1xuXG4gICAgIHNldHVwQ1NSRigpO1xuICAgICB2YXIgYXBwID0gbmV3IFZ1ZSh7XG4gICAgICAgIGVsOiAnI2FwcCcsXG4gICAgICAgIGRhdGE6IHtcblxuICAgICAgICAgICAgZGF0YXM6IFtdLFxuICAgICAgICAgICAgY3VycmVudF9wYWdlOiAxLFxuICAgICAgICAgICAgaW50ZWdyYXRpb246JycsXG4gICAgICAgICAgICBzZWFyY2hfdHlwZToncGVyc29uJyxcbiAgICAgICAgICAgIHdvcmQ6JycsXG4gICAgICAgICAgICBwYWdlczpbXVxuXG4gICAgICAgIH0sXG4gICAgICAgIGJlZm9yZUNyZWF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICB1cmw6IFwiL2FwaS92MS4xL3BheS9uZXctaXRlbS1sb2dcIixcbiAgICAgICAgICAgICAgICB0eXBlOiBcIkdFVFwiLFxuICAgICAgICAgICAgICAgIGRhdGE6e1xuICAgICAgICAgICAgICAgICAgICBwYWdlOjFcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRhdGF0eXBlOlwiSlNPTlwiLFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YS5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgX3NlbGYuZGF0YXMgPSBkYXRhLmRhdGEuZGF0YXM7XG4gICAgICAgICAgICAgICAgICAgIF9zZWxmLnBhZ2VzID0gZGF0YS5kYXRhLnBhZ2VzO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICB3YXRjaDp7XG4gICAgICAgICAgICBjdXJyZW50X3BhZ2U6ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICB2YXIgX3NlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvYXBpL3YxLjEvcGF5L25ldy1pdGVtLWxvZ1wiLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIkdFVFwiLFxuICAgICAgICAgICAgICAgICAgICBkYXRhOntcbiAgICAgICAgICAgICAgICAgICAgICAgICdwYWdlJzpfc2VsZi5jdXJyZW50X3BhZ2VcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YXR5cGU6XCJKU09OXCIsXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgX3NlbGYuZGF0YXMgPSBkYXRhLmRhdGEuZGF0YXM7XG4gICAgICAgICAgICAgICAgICAgICAgICBfc2VsZi5wYWdlcyA9IGRhdGEuZGF0YS5wYWdlcztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBtZXRob2RzOiB7XG4gICAgICAgICAgICBwYWdlQ2hhbmdlOiBmdW5jdGlvbihpbmRleCkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudF9wYWdlID0gaW5kZXggKyAxO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHBhZ2VCZWZvcmU6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudF9wYWdlID09IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ+W3sue7j+aYr+esrOS4gOmhteS6hicpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudF9wYWdlIC09IDE7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFnZUFmdGVyOiBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRfcGFnZSA9PSB0aGlzLnBhZ2VzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICBhbGVydCgn5bey57uP5piv5pyA5ZCO6aG15LqGJyk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50X3BhZ2UgKz0gMTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb21taXQ6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdmFyIF9zZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICB1cmw6IFwiL2FwaS92MS4xL3BheS9uZXctaXRlbS1zZWFyY2hcIixcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogXCJHRVRcIixcbiAgICAgICAgICAgICAgICAgICAgZGF0YTp7XG4gICAgICAgICAgICAgICAgICAgICAgICB3b3JkOiBfc2VsZi53b3JkLFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VhcmNoX3R5cGU6IF9zZWxmLnNlYXJjaF90eXBlXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGRhdGF0eXBlOlwiSlNPTlwiLFxuICAgICAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9zZWxmLmRhdGFzID0gZGF0YS5kYXRhLmRhdGFzO1xuICAgICAgICAgICAgICAgICAgICAgICAgX3NlbGYucGFnZXMgPSBkYXRhLmRhdGEucGFnZXM7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjb25maXJtOmZ1bmN0aW9uKGluZGV4LCBldmVudCl7XG5cbiAgICAgICAgICAgICAgICB2YXIgY29uZmlybSA9IGV2ZW50LnNyY0VsZW1lbnQudmFsdWU7XG4gICAgICAgICAgICAgICAgdmFyIG9iaiA9IHRoaXMuZGF0YXNbaW5kZXhdO1xuICAgICAgICAgICAgICAgIHZhciBzdGF0dXMgPSAwO1xuICAgICAgICAgICAgICAgIGlmIChjb25maXJtID09ICd5ZXMnKSB7XG4gICAgICAgICAgICAgICAgICAgIHN0YXR1cyA9IDE7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChjb25maXJtID09ICdubycpIHtcbiAgICAgICAgICAgICAgICAgICAgc3RhdHVzID0gMjtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgIHVybDogXCIvYXBpL3YxLjEvcGF5L25ldy1pdGVtXCIsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwiUEFUQ0hcIixcbiAgICAgICAgICAgICAgICAgICAgZGF0YTp7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdGF0dXM6IHN0YXR1cyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHVpZDogb2JqLnVpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGlkOiBvYmouaWRcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgZGF0YXR5cGU6XCJKU09OXCIsXG4gICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaW5wdXRTZWFyY2g6IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgdGhpcy53b3JkID0gJChcIiNzZWFyY2hcIikudmFsKCk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2VsZWN0VmFsOmZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgICAgIHRoaXMuc2VhcmNoX3R5cGUgPSBlLnNyY0VsZW1lbnQudmFsdWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfVxuICAgIH0pO1xufSk7XG4iXSwiZmlsZSI6InBheS9uZXdfaXRlbV9jb25maXJtLmpzIn0=
