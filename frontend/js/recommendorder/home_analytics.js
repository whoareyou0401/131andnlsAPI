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