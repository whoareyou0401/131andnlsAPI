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