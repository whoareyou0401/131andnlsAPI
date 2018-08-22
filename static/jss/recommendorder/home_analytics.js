$(document).ready(function(){
	"use strict";
	$('.history').click(function(){
		ga('send', {
            hitType: 'event',
            eventCategory: 'home',
            eventAction: 'Wa_mine_history',
            eventLabel: $(this).text(),
            transport: 'beacon'
        });
	});

	$('.home-setting').click(function(){
		ga('send', {
            hitType: 'event',
            eventCategory: 'home',
            eventAction: 'Wa_mine_setting',
            eventLabel: '设置',
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9ob21lX2FuYWx5dGljcy5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuXHRcInVzZSBzdHJpY3RcIjtcblx0JCgnLmhpc3RvcnknKS5jbGljayhmdW5jdGlvbigpe1xuXHRcdGdhKCdzZW5kJywge1xuICAgICAgICAgICAgaGl0VHlwZTogJ2V2ZW50JyxcbiAgICAgICAgICAgIGV2ZW50Q2F0ZWdvcnk6ICdob21lJyxcbiAgICAgICAgICAgIGV2ZW50QWN0aW9uOiAnV2FfbWluZV9oaXN0b3J5JyxcbiAgICAgICAgICAgIGV2ZW50TGFiZWw6ICQodGhpcykudGV4dCgpLFxuICAgICAgICAgICAgdHJhbnNwb3J0OiAnYmVhY29uJ1xuICAgICAgICB9KTtcblx0fSk7XG5cblx0JCgnLmhvbWUtc2V0dGluZycpLmNsaWNrKGZ1bmN0aW9uKCl7XG5cdFx0Z2EoJ3NlbmQnLCB7XG4gICAgICAgICAgICBoaXRUeXBlOiAnZXZlbnQnLFxuICAgICAgICAgICAgZXZlbnRDYXRlZ29yeTogJ2hvbWUnLFxuICAgICAgICAgICAgZXZlbnRBY3Rpb246ICdXYV9taW5lX3NldHRpbmcnLFxuICAgICAgICAgICAgZXZlbnRMYWJlbDogJ+iuvue9ricsXG4gICAgICAgICAgICB0cmFuc3BvcnQ6ICdiZWFjb24nXG4gICAgICAgIH0pO1xuXHR9KTtcblxuXHQkKCcucmVjX2hvdCcpLmNsaWNrKGZ1bmN0aW9uKCl7XG5cdFx0Z2EoJ3NlbmQnLCB7XG4gICAgICAgICAgICBoaXRUeXBlOiAnZXZlbnQnLFxuICAgICAgICAgICAgZXZlbnRDYXRlZ29yeTogJ3JlY29tJyxcbiAgICAgICAgICAgIGV2ZW50QWN0aW9uOiAnV2FfY29udGVudF9ob3QnLFxuICAgICAgICAgICAgZXZlbnRMYWJlbDogJCh0aGlzKS50ZXh0KCksXG4gICAgICAgICAgICB0cmFuc3BvcnQ6ICdiZWFjb24nXG4gICAgICAgIH0pO1xuXHR9KTtcblxuXHQkKCcucmVjX3Nob3AnKS5jbGljayhmdW5jdGlvbigpe1xuXHRcdGdhKCdzZW5kJywge1xuICAgICAgICAgICAgaGl0VHlwZTogJ2V2ZW50JyxcbiAgICAgICAgICAgIGV2ZW50Q2F0ZWdvcnk6ICdyZWNvbScsXG4gICAgICAgICAgICBldmVudEFjdGlvbjogJ1dhX2NvbnRlbnRfc2hvcCcsXG4gICAgICAgICAgICBldmVudExhYmVsOiAkKHRoaXMpLnRleHQoKSxcbiAgICAgICAgICAgIHRyYW5zcG9ydDogJ2JlYWNvbidcbiAgICAgICAgfSk7XG5cdH0pO1xuXG5cdCQoJy5yZWNfbWluZScpLmNsaWNrKGZ1bmN0aW9uKCl7XG5cdFx0Z2EoJ3NlbmQnLCB7XG4gICAgICAgICAgICBoaXRUeXBlOiAnZXZlbnQnLFxuICAgICAgICAgICAgZXZlbnRDYXRlZ29yeTogJ3JlY29tJyxcbiAgICAgICAgICAgIGV2ZW50QWN0aW9uOiAnV2FfY29udGVudF9taW5lJyxcbiAgICAgICAgICAgIGV2ZW50TGFiZWw6ICQodGhpcykudGV4dCgpLFxuICAgICAgICAgICAgdHJhbnNwb3J0OiAnYmVhY29uJ1xuICAgICAgICB9KTtcblx0fSk7XG5cbn0pOyJdLCJmaWxlIjoicmVjb21tZW5kb3JkZXIvaG9tZV9hbmFseXRpY3MuanMifQ==
