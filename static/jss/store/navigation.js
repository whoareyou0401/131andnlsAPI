$(document)
    .ready(function () {
        // fix main menu to page on passing
        $('.main.menu').visibility({
            type: 'fixed'
        });
        $('.overlay').visibility({
            type: 'fixed',
            offset: 80
        });
        $('.ui.sidebar')
            .sidebar('attach events', '.toc.item')
        ;
        // lazy load images
        $('.image').visibility({
            type: 'image',
            transition: 'vertical flip in',
            duration: 500
        });

        // show dropdown on hover
        $('.main.menu.ui.dropdown').dropdown({
            on: 'hover'
        });

        $('#disclaimer').click(function () {
            $('.long.modal').modal('show');
        });

        $('.ui.primary.approve.button').click(function () {
            $('#terms').attr('checked', 'checked');
        });

        $('#sql').click(function () {
            if ($(this).find('.checkmark').length == 1)
                return false;
            location.href = '/integration/add-db';
        });
        $('#wechat').click(function () {
            if ($(this).find('.checkmark').length == 1)
                return false;
            location.href = '/integration/add-transaction-accounts';
        });
        $('#alipay').click(function () {
            if ($(this).find('.checkmark').length == 1)
                return false;
            location.href = '/integration/add-transaction-accounts';
        });
    });

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJzdG9yZS9uYXZpZ2F0aW9uLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiQoZG9jdW1lbnQpXG4gICAgLnJlYWR5KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gZml4IG1haW4gbWVudSB0byBwYWdlIG9uIHBhc3NpbmdcbiAgICAgICAgJCgnLm1haW4ubWVudScpLnZpc2liaWxpdHkoe1xuICAgICAgICAgICAgdHlwZTogJ2ZpeGVkJ1xuICAgICAgICB9KTtcbiAgICAgICAgJCgnLm92ZXJsYXknKS52aXNpYmlsaXR5KHtcbiAgICAgICAgICAgIHR5cGU6ICdmaXhlZCcsXG4gICAgICAgICAgICBvZmZzZXQ6IDgwXG4gICAgICAgIH0pO1xuICAgICAgICAkKCcudWkuc2lkZWJhcicpXG4gICAgICAgICAgICAuc2lkZWJhcignYXR0YWNoIGV2ZW50cycsICcudG9jLml0ZW0nKVxuICAgICAgICA7XG4gICAgICAgIC8vIGxhenkgbG9hZCBpbWFnZXNcbiAgICAgICAgJCgnLmltYWdlJykudmlzaWJpbGl0eSh7XG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UnLFxuICAgICAgICAgICAgdHJhbnNpdGlvbjogJ3ZlcnRpY2FsIGZsaXAgaW4nLFxuICAgICAgICAgICAgZHVyYXRpb246IDUwMFxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBzaG93IGRyb3Bkb3duIG9uIGhvdmVyXG4gICAgICAgICQoJy5tYWluLm1lbnUudWkuZHJvcGRvd24nKS5kcm9wZG93bih7XG4gICAgICAgICAgICBvbjogJ2hvdmVyJ1xuICAgICAgICB9KTtcblxuICAgICAgICAkKCcjZGlzY2xhaW1lcicpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICQoJy5sb25nLm1vZGFsJykubW9kYWwoJ3Nob3cnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCgnLnVpLnByaW1hcnkuYXBwcm92ZS5idXR0b24nKS5jbGljayhmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAkKCcjdGVybXMnKS5hdHRyKCdjaGVja2VkJywgJ2NoZWNrZWQnKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCgnI3NxbCcpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICgkKHRoaXMpLmZpbmQoJy5jaGVja21hcmsnKS5sZW5ndGggPT0gMSlcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICBsb2NhdGlvbi5ocmVmID0gJy9pbnRlZ3JhdGlvbi9hZGQtZGInO1xuICAgICAgICB9KTtcbiAgICAgICAgJCgnI3dlY2hhdCcpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICgkKHRoaXMpLmZpbmQoJy5jaGVja21hcmsnKS5sZW5ndGggPT0gMSlcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICBsb2NhdGlvbi5ocmVmID0gJy9pbnRlZ3JhdGlvbi9hZGQtdHJhbnNhY3Rpb24tYWNjb3VudHMnO1xuICAgICAgICB9KTtcbiAgICAgICAgJCgnI2FsaXBheScpLmNsaWNrKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIGlmICgkKHRoaXMpLmZpbmQoJy5jaGVja21hcmsnKS5sZW5ndGggPT0gMSlcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICBsb2NhdGlvbi5ocmVmID0gJy9pbnRlZ3JhdGlvbi9hZGQtdHJhbnNhY3Rpb24tYWNjb3VudHMnO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiJdLCJmaWxlIjoic3RvcmUvbmF2aWdhdGlvbi5qcyJ9
