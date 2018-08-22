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