$(document).ready(function(){
	"use strict";
    $('.list').click(function(){
        ga('send', {
            hitType: 'event',
            eventCategory: 'department',
            eventAction: 'Wa_shop_category'
        });
    });
    $('#search').change(function(){
        ga('send', {
            hitType: 'event',
            eventCategory: 'department',
            eventAction: 'Wa_shop_search',
            eventLabel: $(this).val()
        });
    });
	$('#banner-img').click(function(){
		ga('send', {
            hitType: 'event',
            eventCategory: 'department',
            eventAction: 'Wa_shop_hotsale',
        });
	});

	$('#by-score').click(function(){
		ga('send', {
            hitType: 'event',
            eventCategory: 'department',
            eventAction: 'Wa_shop_sort[0]',
            eventLabel: $(this).text()
        });
	});

    $('#by-price').click(function(){
        ga('send', {
            hitType: 'event',
            eventCategory: 'department',
            eventAction: 'Wa_shop_sort[1]',
            eventLabel: $(this).text(),
        });
    });

	$('#by-num').click(function(){
        ga('send', {
            hitType: 'event',
            eventCategory: 'department',
            eventAction: 'Wa_shop_sort[2]',
            eventLabel: $(this).text(),
        });
    });

    $('#place-order').click(function(){
        ga('send', {
            hitType: 'event',
            eventCategory: 'department',
            eventAction: 'Wa_shop_append',
            eventLabel: $(this).text(),
            transport: 'beacon'
        });
    });

    $('.home-info-nav-a').click(function(){
        ga('send', {
            hitType: 'event',
            eventCategory: 'department',
            eventAction: 'Wa_shop_return',
            transport: 'beacon'
        });
    });
    $('.home-info-nav-b').click(function(){
        ga('send', {
            hitType: 'event',
            eventCategory: 'department',
            eventAction: 'Wa_shop_call',
            transport: 'beacon'
        });
    });

});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci93aG9sZXNhbGVfZGVwYXJ0bWVudF9hbmFseXRpY3MuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG4gICAgJCgnLmxpc3QnKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICBnYSgnc2VuZCcsIHtcbiAgICAgICAgICAgIGhpdFR5cGU6ICdldmVudCcsXG4gICAgICAgICAgICBldmVudENhdGVnb3J5OiAnZGVwYXJ0bWVudCcsXG4gICAgICAgICAgICBldmVudEFjdGlvbjogJ1dhX3Nob3BfY2F0ZWdvcnknXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgICQoJyNzZWFyY2gnKS5jaGFuZ2UoZnVuY3Rpb24oKXtcbiAgICAgICAgZ2EoJ3NlbmQnLCB7XG4gICAgICAgICAgICBoaXRUeXBlOiAnZXZlbnQnLFxuICAgICAgICAgICAgZXZlbnRDYXRlZ29yeTogJ2RlcGFydG1lbnQnLFxuICAgICAgICAgICAgZXZlbnRBY3Rpb246ICdXYV9zaG9wX3NlYXJjaCcsXG4gICAgICAgICAgICBldmVudExhYmVsOiAkKHRoaXMpLnZhbCgpXG4gICAgICAgIH0pO1xuICAgIH0pO1xuXHQkKCcjYmFubmVyLWltZycpLmNsaWNrKGZ1bmN0aW9uKCl7XG5cdFx0Z2EoJ3NlbmQnLCB7XG4gICAgICAgICAgICBoaXRUeXBlOiAnZXZlbnQnLFxuICAgICAgICAgICAgZXZlbnRDYXRlZ29yeTogJ2RlcGFydG1lbnQnLFxuICAgICAgICAgICAgZXZlbnRBY3Rpb246ICdXYV9zaG9wX2hvdHNhbGUnLFxuICAgICAgICB9KTtcblx0fSk7XG5cblx0JCgnI2J5LXNjb3JlJykuY2xpY2soZnVuY3Rpb24oKXtcblx0XHRnYSgnc2VuZCcsIHtcbiAgICAgICAgICAgIGhpdFR5cGU6ICdldmVudCcsXG4gICAgICAgICAgICBldmVudENhdGVnb3J5OiAnZGVwYXJ0bWVudCcsXG4gICAgICAgICAgICBldmVudEFjdGlvbjogJ1dhX3Nob3Bfc29ydFswXScsXG4gICAgICAgICAgICBldmVudExhYmVsOiAkKHRoaXMpLnRleHQoKVxuICAgICAgICB9KTtcblx0fSk7XG5cbiAgICAkKCcjYnktcHJpY2UnKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICBnYSgnc2VuZCcsIHtcbiAgICAgICAgICAgIGhpdFR5cGU6ICdldmVudCcsXG4gICAgICAgICAgICBldmVudENhdGVnb3J5OiAnZGVwYXJ0bWVudCcsXG4gICAgICAgICAgICBldmVudEFjdGlvbjogJ1dhX3Nob3Bfc29ydFsxXScsXG4gICAgICAgICAgICBldmVudExhYmVsOiAkKHRoaXMpLnRleHQoKSxcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cblx0JCgnI2J5LW51bScpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIGdhKCdzZW5kJywge1xuICAgICAgICAgICAgaGl0VHlwZTogJ2V2ZW50JyxcbiAgICAgICAgICAgIGV2ZW50Q2F0ZWdvcnk6ICdkZXBhcnRtZW50JyxcbiAgICAgICAgICAgIGV2ZW50QWN0aW9uOiAnV2Ffc2hvcF9zb3J0WzJdJyxcbiAgICAgICAgICAgIGV2ZW50TGFiZWw6ICQodGhpcykudGV4dCgpLFxuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgICQoJyNwbGFjZS1vcmRlcicpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIGdhKCdzZW5kJywge1xuICAgICAgICAgICAgaGl0VHlwZTogJ2V2ZW50JyxcbiAgICAgICAgICAgIGV2ZW50Q2F0ZWdvcnk6ICdkZXBhcnRtZW50JyxcbiAgICAgICAgICAgIGV2ZW50QWN0aW9uOiAnV2Ffc2hvcF9hcHBlbmQnLFxuICAgICAgICAgICAgZXZlbnRMYWJlbDogJCh0aGlzKS50ZXh0KCksXG4gICAgICAgICAgICB0cmFuc3BvcnQ6ICdiZWFjb24nXG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG4gICAgJCgnLmhvbWUtaW5mby1uYXYtYScpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIGdhKCdzZW5kJywge1xuICAgICAgICAgICAgaGl0VHlwZTogJ2V2ZW50JyxcbiAgICAgICAgICAgIGV2ZW50Q2F0ZWdvcnk6ICdkZXBhcnRtZW50JyxcbiAgICAgICAgICAgIGV2ZW50QWN0aW9uOiAnV2Ffc2hvcF9yZXR1cm4nLFxuICAgICAgICAgICAgdHJhbnNwb3J0OiAnYmVhY29uJ1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgICAkKCcuaG9tZS1pbmZvLW5hdi1iJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgZ2EoJ3NlbmQnLCB7XG4gICAgICAgICAgICBoaXRUeXBlOiAnZXZlbnQnLFxuICAgICAgICAgICAgZXZlbnRDYXRlZ29yeTogJ2RlcGFydG1lbnQnLFxuICAgICAgICAgICAgZXZlbnRBY3Rpb246ICdXYV9zaG9wX2NhbGwnLFxuICAgICAgICAgICAgdHJhbnNwb3J0OiAnYmVhY29uJ1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSk7Il0sImZpbGUiOiJyZWNvbW1lbmRvcmRlci93aG9sZXNhbGVfZGVwYXJ0bWVudF9hbmFseXRpY3MuanMifQ==
