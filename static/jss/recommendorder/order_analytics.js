$(document).ready(function(){
	"use strict";
    $('.order_choose').click(function(){
        ga('send', {
            hitType: 'event',
            eventCategory: 'order',
            eventAction: 'Wa_recommend_hot'
        });
    });
    $('.order-aa').click(function(){
        ga('send', {
            hitType: 'event',
            eventCategory: 'order',
            eventAction: 'Wa_recommend_shop',
            eventLabel: $(this).text()
        });
    });
	$('.order_recommend').click(function(){
		ga('send', {
            hitType: 'event',
            eventCategory: 'order',
            eventAction: 'Wa_recommend_recommend',
            eventLabel: $(this).text()
        });
	});

	$('.order_add').click(function(){
		ga('send', {
            hitType: 'event',
            eventCategory: 'order',
            eventAction: 'Wa_recommend_trolley',
            eventLabel: $(this).text()
        });
	});

    $('.add').click(function(){
        ga('send', {
            hitType: 'event',
            eventCategory: 'order',
            eventAction: 'Wa_recommend_order',
            eventLabel: $(this).text(),
            transport: 'beacon'
        });
    });

	$('.rec_hot').click(function(){
        ga('send', {
            hitType: 'event',
            eventCategory: 'recom',
            eventAction: 'Wa_content_hot',
            eventLabel: $(this).text(),
            transport: 'beacon'
        });
    });

    $('.rec_shop').click(function(){
        ga('send', {
            hitType: 'event',
            eventCategory: 'recom',
            eventAction: 'Wa_content_shop',
            eventLabel: $(this).text(),
            transport: 'beacon'
        });
    });

    $('.rec_mine').click(function(){
        ga('send', {
            hitType: 'event',
            eventCategory: 'recom',
            eventAction: 'Wa_content_mine',
            eventLabel: $(this).text(),
            transport: 'beacon'
        });
    });

});
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9vcmRlcl9hbmFseXRpY3MuanMiXSwic291cmNlc0NvbnRlbnQiOlsiJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcblx0XCJ1c2Ugc3RyaWN0XCI7XG4gICAgJCgnLm9yZGVyX2Nob29zZScpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIGdhKCdzZW5kJywge1xuICAgICAgICAgICAgaGl0VHlwZTogJ2V2ZW50JyxcbiAgICAgICAgICAgIGV2ZW50Q2F0ZWdvcnk6ICdvcmRlcicsXG4gICAgICAgICAgICBldmVudEFjdGlvbjogJ1dhX3JlY29tbWVuZF9ob3QnXG4gICAgICAgIH0pO1xuICAgIH0pO1xuICAgICQoJy5vcmRlci1hYScpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIGdhKCdzZW5kJywge1xuICAgICAgICAgICAgaGl0VHlwZTogJ2V2ZW50JyxcbiAgICAgICAgICAgIGV2ZW50Q2F0ZWdvcnk6ICdvcmRlcicsXG4gICAgICAgICAgICBldmVudEFjdGlvbjogJ1dhX3JlY29tbWVuZF9zaG9wJyxcbiAgICAgICAgICAgIGV2ZW50TGFiZWw6ICQodGhpcykudGV4dCgpXG4gICAgICAgIH0pO1xuICAgIH0pO1xuXHQkKCcub3JkZXJfcmVjb21tZW5kJykuY2xpY2soZnVuY3Rpb24oKXtcblx0XHRnYSgnc2VuZCcsIHtcbiAgICAgICAgICAgIGhpdFR5cGU6ICdldmVudCcsXG4gICAgICAgICAgICBldmVudENhdGVnb3J5OiAnb3JkZXInLFxuICAgICAgICAgICAgZXZlbnRBY3Rpb246ICdXYV9yZWNvbW1lbmRfcmVjb21tZW5kJyxcbiAgICAgICAgICAgIGV2ZW50TGFiZWw6ICQodGhpcykudGV4dCgpXG4gICAgICAgIH0pO1xuXHR9KTtcblxuXHQkKCcub3JkZXJfYWRkJykuY2xpY2soZnVuY3Rpb24oKXtcblx0XHRnYSgnc2VuZCcsIHtcbiAgICAgICAgICAgIGhpdFR5cGU6ICdldmVudCcsXG4gICAgICAgICAgICBldmVudENhdGVnb3J5OiAnb3JkZXInLFxuICAgICAgICAgICAgZXZlbnRBY3Rpb246ICdXYV9yZWNvbW1lbmRfdHJvbGxleScsXG4gICAgICAgICAgICBldmVudExhYmVsOiAkKHRoaXMpLnRleHQoKVxuICAgICAgICB9KTtcblx0fSk7XG5cbiAgICAkKCcuYWRkJykuY2xpY2soZnVuY3Rpb24oKXtcbiAgICAgICAgZ2EoJ3NlbmQnLCB7XG4gICAgICAgICAgICBoaXRUeXBlOiAnZXZlbnQnLFxuICAgICAgICAgICAgZXZlbnRDYXRlZ29yeTogJ29yZGVyJyxcbiAgICAgICAgICAgIGV2ZW50QWN0aW9uOiAnV2FfcmVjb21tZW5kX29yZGVyJyxcbiAgICAgICAgICAgIGV2ZW50TGFiZWw6ICQodGhpcykudGV4dCgpLFxuICAgICAgICAgICAgdHJhbnNwb3J0OiAnYmVhY29uJ1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuXHQkKCcucmVjX2hvdCcpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIGdhKCdzZW5kJywge1xuICAgICAgICAgICAgaGl0VHlwZTogJ2V2ZW50JyxcbiAgICAgICAgICAgIGV2ZW50Q2F0ZWdvcnk6ICdyZWNvbScsXG4gICAgICAgICAgICBldmVudEFjdGlvbjogJ1dhX2NvbnRlbnRfaG90JyxcbiAgICAgICAgICAgIGV2ZW50TGFiZWw6ICQodGhpcykudGV4dCgpLFxuICAgICAgICAgICAgdHJhbnNwb3J0OiAnYmVhY29uJ1xuICAgICAgICB9KTtcbiAgICB9KTtcblxuICAgICQoJy5yZWNfc2hvcCcpLmNsaWNrKGZ1bmN0aW9uKCl7XG4gICAgICAgIGdhKCdzZW5kJywge1xuICAgICAgICAgICAgaGl0VHlwZTogJ2V2ZW50JyxcbiAgICAgICAgICAgIGV2ZW50Q2F0ZWdvcnk6ICdyZWNvbScsXG4gICAgICAgICAgICBldmVudEFjdGlvbjogJ1dhX2NvbnRlbnRfc2hvcCcsXG4gICAgICAgICAgICBldmVudExhYmVsOiAkKHRoaXMpLnRleHQoKSxcbiAgICAgICAgICAgIHRyYW5zcG9ydDogJ2JlYWNvbidcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbiAgICAkKCcucmVjX21pbmUnKS5jbGljayhmdW5jdGlvbigpe1xuICAgICAgICBnYSgnc2VuZCcsIHtcbiAgICAgICAgICAgIGhpdFR5cGU6ICdldmVudCcsXG4gICAgICAgICAgICBldmVudENhdGVnb3J5OiAncmVjb20nLFxuICAgICAgICAgICAgZXZlbnRBY3Rpb246ICdXYV9jb250ZW50X21pbmUnLFxuICAgICAgICAgICAgZXZlbnRMYWJlbDogJCh0aGlzKS50ZXh0KCksXG4gICAgICAgICAgICB0cmFuc3BvcnQ6ICdiZWFjb24nXG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59KTsiXSwiZmlsZSI6InJlY29tbWVuZG9yZGVyL29yZGVyX2FuYWx5dGljcy5qcyJ9
