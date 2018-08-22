var adaptive = {};
(function (win, lib) {
    var doc = win.document;
    var docEl = doc.documentElement;
    // 设备像素比
    var devicePixelRatio = win.devicePixelRatio;
    // 我们设置的布局视口与理想视口的像素比
    var dpr = 1; 
    // viewport缩放值
    var scale = 1; 
    // 设置viewport
    function setViewport() {
        // 判断IOS
        var isIPhone = /iphone/gi.test(win.navigator.appVersion);
        if (lib.scaleType === 2 && isIPhone || lib.scaleType === 3) {
            dpr = devicePixelRatio;
        }
        // window对象上增加一个属性，提供对外的布局视口与理想视口的值
        win.devicePixelRatioValue = dpr;
        // viewport缩放值，布局视口缩放后刚好显示成理想视口的宽度，页面就不会过长或过短了
        scale = 1 / dpr;
        // 获取已有的viewport
        var hasMetaEl = doc.querySelector('meta[name="viewport"]');
        var metaStr = 'initial-scale=' + scale + ', maximum-scale=' + scale + ', minimum-scale=' + scale + ', user-scalable=no';
        if (dpr === 1) {
            metaStr = 'width=device-width, '.concat(metaStr);
        }
        if (!isIPhone && dpr !== 1) {
            metaStr = metaStr.concat(', target-densitydpi=device-dpi');
        }
        // 如果有，改变之
        if (hasMetaEl) {
            hasMetaEl.setAttribute('content', metaStr);
        }
        // 如果没有，添加之
        else {
            var metaEl = doc.createElement('meta');
            metaEl.setAttribute('name', 'viewport');
            metaEl.setAttribute('content', metaStr);
            
            if (docEl.firstElementChild) {
                docEl.firstElementChild.appendChild(metaEl);
            }
            else {
                var containDiv = doc.createElement('div');
                containDiv.appendChild(metaEl);
                docEl.appendChild(containDiv);
            }
        }
    }
    
    var newBase = 100;
    lib.errDpr = 1;

    function setRem() {
        // 布局视口
        // var layoutView = docEl.clientWidth; 也可以 获取布局视口的宽度
        var layoutView;
        if (lib.maxWidth) {
            layoutView = Math.min(docEl.getBoundingClientRect().width, lib.maxWidth * dpr);
        }
        else {
            layoutView = docEl.getBoundingClientRect().width;
        }
        // 为了计算方便，我们规定 1rem === 100px设计图像素，我们切图的时候就能快速转换
        // 有人问，为什么不让1rem === 1px设计像素呢？
        // 设计图一般是640或者750px
        // 布局视口一般是320到1440
        // 计算一个值，使layout的总宽度为 (desinWidth/100) rem
        // 那么有计算公式：layoutView / newBase = desinWidth / 100
        // newBase = 100 * layoutView / desinWidth
        // newBase = 介于50到200之间
        // 如果 1rem === 1px 设计像素，newBase就介于0.5到2之间，由于很多浏览器有最小12px限制，这个时候就不能自适应了
        newBase = 100 * layoutView / lib.desinWidth * (lib.errDpr || 1);
        docEl.style.fontSize = newBase + 'px';
        // rem基准值改变后，手动reflow一下，避免旋转手机后页面自适应问题
        doc.body&&(doc.body.style.fontSize = lib.baseFont / 100 + 'rem');
        // 重新设置rem后的回调方法
        lib.setRemCallback&&lib.setRemCallback();
        lib.newBase = newBase;
    }
    var tid;
    lib.desinWidth = 640;
    lib.baseFont = 24;
    // 局部刷新的时候部分chrome版本字体过大的问题
    lib.reflow = function() {
        docEl.clientWidth;
    };
    // 检查安卓下rem值是否显示正确
    function checkRem() {
        if (/android/ig.test(window.navigator.appVersion)) {
            var hideDiv = document.createElement('p');
            hideDiv.style.height = '1px';
            hideDiv.style.width = '2.5rem';
            hideDiv.style.visibility = 'hidden';
            document.body.appendChild(hideDiv);
            var now = hideDiv.offsetWidth;
            var right = window.adaptive.newBase * 2.5; 
            if (Math.abs(right / now - 1) > 0.05) {
                lib.errDpr = right / now;
                setRem();
            }
            document.body.removeChild(hideDiv);
        }
    }
    lib.init = function () {
        // resize的时候重新设置rem基准值
        // 触发orientationchange 事件时也会触发resize，故不需要再添加此事件了
        win.addEventListener('resize', function () {
            clearTimeout(tid);
            tid = setTimeout(setRem, 300);
        }, false);
        // 浏览器缓存中读取时也需要重新设置rem基准值
        win.addEventListener('pageshow', function (e) {
            if (e.persisted) {
                clearTimeout(tid);
                tid = setTimeout(setRem, 300);
            }
        }, false);
        // 设置body上的字体大小
        if (doc.readyState === 'complete') {
            doc.body.style.fontSize = lib.baseFont / 100 + 'rem';
            checkRem();
        }
        else {
            doc.addEventListener('DOMContentLoaded', function (e) {
                doc.body.style.fontSize = lib.baseFont / 100 + 'rem';
                checkRem();
            }, false);
        }
        setViewport();
        // 设置rem值
        setRem();
        // html节点设置布局视口与理想视口的像素比
        docEl.setAttribute('data-dpr', dpr);
    };
    // 有些html元素只能以px为单位，所以需要提供一个接口，把rem单位换算成px
    lib.remToPx = function (remValue) {
        return remValue * newBase;
    };
})(window, adaptive);
if (typeof module != 'undefined' && module.exports) {
    module.exports = adaptive;
} else if (typeof define == 'function' && define.amd) {
    define(function() {
        return adaptive;
    });
} else {
    window.adaptive = adaptive;
}
// 立即调用
window['adaptive'].desinWidth = 640;        //设计图宽度
window['adaptive'].baseFont = 24;           //没有缩放字体大小
window['adaptive'].maxWidth = 480;          //页面显示最大宽度  默认540
window['adaptive'].init();                  //调用初始化方法
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJyZWNvbW1lbmRvcmRlci9yZWNvbW1lbmRvcmRlcl9yZW0uanMiXSwic291cmNlc0NvbnRlbnQiOlsidmFyIGFkYXB0aXZlID0ge307XG4oZnVuY3Rpb24gKHdpbiwgbGliKSB7XG4gICAgdmFyIGRvYyA9IHdpbi5kb2N1bWVudDtcbiAgICB2YXIgZG9jRWwgPSBkb2MuZG9jdW1lbnRFbGVtZW50O1xuICAgIC8vIOiuvuWkh+WDj+e0oOavlFxuICAgIHZhciBkZXZpY2VQaXhlbFJhdGlvID0gd2luLmRldmljZVBpeGVsUmF0aW87XG4gICAgLy8g5oiR5Lus6K6+572u55qE5biD5bGA6KeG5Y+j5LiO55CG5oOz6KeG5Y+j55qE5YOP57Sg5q+UXG4gICAgdmFyIGRwciA9IDE7IFxuICAgIC8vIHZpZXdwb3J057yp5pS+5YC8XG4gICAgdmFyIHNjYWxlID0gMTsgXG4gICAgLy8g6K6+572udmlld3BvcnRcbiAgICBmdW5jdGlvbiBzZXRWaWV3cG9ydCgpIHtcbiAgICAgICAgLy8g5Yik5patSU9TXG4gICAgICAgIHZhciBpc0lQaG9uZSA9IC9pcGhvbmUvZ2kudGVzdCh3aW4ubmF2aWdhdG9yLmFwcFZlcnNpb24pO1xuICAgICAgICBpZiAobGliLnNjYWxlVHlwZSA9PT0gMiAmJiBpc0lQaG9uZSB8fCBsaWIuc2NhbGVUeXBlID09PSAzKSB7XG4gICAgICAgICAgICBkcHIgPSBkZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICB9XG4gICAgICAgIC8vIHdpbmRvd+WvueixoeS4iuWinuWKoOS4gOS4quWxnuaAp++8jOaPkOS+m+WvueWklueahOW4g+WxgOinhuWPo+S4jueQhuaDs+inhuWPo+eahOWAvFxuICAgICAgICB3aW4uZGV2aWNlUGl4ZWxSYXRpb1ZhbHVlID0gZHByO1xuICAgICAgICAvLyB2aWV3cG9ydOe8qeaUvuWAvO+8jOW4g+WxgOinhuWPo+e8qeaUvuWQjuWImuWlveaYvuekuuaIkOeQhuaDs+inhuWPo+eahOWuveW6pu+8jOmhtemdouWwseS4jeS8mui/h+mVv+aIlui/h+efreS6hlxuICAgICAgICBzY2FsZSA9IDEgLyBkcHI7XG4gICAgICAgIC8vIOiOt+WPluW3suacieeahHZpZXdwb3J0XG4gICAgICAgIHZhciBoYXNNZXRhRWwgPSBkb2MucXVlcnlTZWxlY3RvcignbWV0YVtuYW1lPVwidmlld3BvcnRcIl0nKTtcbiAgICAgICAgdmFyIG1ldGFTdHIgPSAnaW5pdGlhbC1zY2FsZT0nICsgc2NhbGUgKyAnLCBtYXhpbXVtLXNjYWxlPScgKyBzY2FsZSArICcsIG1pbmltdW0tc2NhbGU9JyArIHNjYWxlICsgJywgdXNlci1zY2FsYWJsZT1ubyc7XG4gICAgICAgIGlmIChkcHIgPT09IDEpIHtcbiAgICAgICAgICAgIG1ldGFTdHIgPSAnd2lkdGg9ZGV2aWNlLXdpZHRoLCAnLmNvbmNhdChtZXRhU3RyKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWlzSVBob25lICYmIGRwciAhPT0gMSkge1xuICAgICAgICAgICAgbWV0YVN0ciA9IG1ldGFTdHIuY29uY2F0KCcsIHRhcmdldC1kZW5zaXR5ZHBpPWRldmljZS1kcGknKTtcbiAgICAgICAgfVxuICAgICAgICAvLyDlpoLmnpzmnInvvIzmlLnlj5jkuYtcbiAgICAgICAgaWYgKGhhc01ldGFFbCkge1xuICAgICAgICAgICAgaGFzTWV0YUVsLnNldEF0dHJpYnV0ZSgnY29udGVudCcsIG1ldGFTdHIpO1xuICAgICAgICB9XG4gICAgICAgIC8vIOWmguaenOayoeacie+8jOa3u+WKoOS5i1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhciBtZXRhRWwgPSBkb2MuY3JlYXRlRWxlbWVudCgnbWV0YScpO1xuICAgICAgICAgICAgbWV0YUVsLnNldEF0dHJpYnV0ZSgnbmFtZScsICd2aWV3cG9ydCcpO1xuICAgICAgICAgICAgbWV0YUVsLnNldEF0dHJpYnV0ZSgnY29udGVudCcsIG1ldGFTdHIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoZG9jRWwuZmlyc3RFbGVtZW50Q2hpbGQpIHtcbiAgICAgICAgICAgICAgICBkb2NFbC5maXJzdEVsZW1lbnRDaGlsZC5hcHBlbmRDaGlsZChtZXRhRWwpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdmFyIGNvbnRhaW5EaXYgPSBkb2MuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgICAgICAgICAgY29udGFpbkRpdi5hcHBlbmRDaGlsZChtZXRhRWwpO1xuICAgICAgICAgICAgICAgIGRvY0VsLmFwcGVuZENoaWxkKGNvbnRhaW5EaXYpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIFxuICAgIHZhciBuZXdCYXNlID0gMTAwO1xuICAgIGxpYi5lcnJEcHIgPSAxO1xuXG4gICAgZnVuY3Rpb24gc2V0UmVtKCkge1xuICAgICAgICAvLyDluIPlsYDop4blj6NcbiAgICAgICAgLy8gdmFyIGxheW91dFZpZXcgPSBkb2NFbC5jbGllbnRXaWR0aDsg5Lmf5Y+v5LulIOiOt+WPluW4g+WxgOinhuWPo+eahOWuveW6plxuICAgICAgICB2YXIgbGF5b3V0VmlldztcbiAgICAgICAgaWYgKGxpYi5tYXhXaWR0aCkge1xuICAgICAgICAgICAgbGF5b3V0VmlldyA9IE1hdGgubWluKGRvY0VsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoLCBsaWIubWF4V2lkdGggKiBkcHIpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGF5b3V0VmlldyA9IGRvY0VsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoO1xuICAgICAgICB9XG4gICAgICAgIC8vIOS4uuS6huiuoeeul+aWueS+v++8jOaIkeS7rOinhOWumiAxcmVtID09PSAxMDBweOiuvuiuoeWbvuWDj+e0oO+8jOaIkeS7rOWIh+WbvueahOaXtuWAmeWwseiDveW/q+mAn+i9rOaNolxuICAgICAgICAvLyDmnInkurrpl67vvIzkuLrku4DkuYjkuI3orqkxcmVtID09PSAxcHjorr7orqHlg4/ntKDlkaLvvJ9cbiAgICAgICAgLy8g6K6+6K6h5Zu+5LiA6Iis5pivNjQw5oiW6ICFNzUwcHhcbiAgICAgICAgLy8g5biD5bGA6KeG5Y+j5LiA6Iis5pivMzIw5YiwMTQ0MFxuICAgICAgICAvLyDorqHnrpfkuIDkuKrlgLzvvIzkvb9sYXlvdXTnmoTmgLvlrr3luqbkuLogKGRlc2luV2lkdGgvMTAwKSByZW1cbiAgICAgICAgLy8g6YKj5LmI5pyJ6K6h566X5YWs5byP77yabGF5b3V0VmlldyAvIG5ld0Jhc2UgPSBkZXNpbldpZHRoIC8gMTAwXG4gICAgICAgIC8vIG5ld0Jhc2UgPSAxMDAgKiBsYXlvdXRWaWV3IC8gZGVzaW5XaWR0aFxuICAgICAgICAvLyBuZXdCYXNlID0g5LuL5LqONTDliLAyMDDkuYvpl7RcbiAgICAgICAgLy8g5aaC5p6cIDFyZW0gPT09IDFweCDorr7orqHlg4/ntKDvvIxuZXdCYXNl5bCx5LuL5LqOMC415YiwMuS5i+mXtO+8jOeUseS6juW+iOWkmua1j+iniOWZqOacieacgOWwjzEycHjpmZDliLbvvIzov5nkuKrml7blgJnlsLHkuI3og73oh6rpgILlupTkuoZcbiAgICAgICAgbmV3QmFzZSA9IDEwMCAqIGxheW91dFZpZXcgLyBsaWIuZGVzaW5XaWR0aCAqIChsaWIuZXJyRHByIHx8IDEpO1xuICAgICAgICBkb2NFbC5zdHlsZS5mb250U2l6ZSA9IG5ld0Jhc2UgKyAncHgnO1xuICAgICAgICAvLyByZW3ln7rlh4blgLzmlLnlj5jlkI7vvIzmiYvliqhyZWZsb3fkuIDkuIvvvIzpgb/lhY3ml4vovazmiYvmnLrlkI7pobXpnaLoh6rpgILlupTpl67pophcbiAgICAgICAgZG9jLmJvZHkmJihkb2MuYm9keS5zdHlsZS5mb250U2l6ZSA9IGxpYi5iYXNlRm9udCAvIDEwMCArICdyZW0nKTtcbiAgICAgICAgLy8g6YeN5paw6K6+572ucmVt5ZCO55qE5Zue6LCD5pa55rOVXG4gICAgICAgIGxpYi5zZXRSZW1DYWxsYmFjayYmbGliLnNldFJlbUNhbGxiYWNrKCk7XG4gICAgICAgIGxpYi5uZXdCYXNlID0gbmV3QmFzZTtcbiAgICB9XG4gICAgdmFyIHRpZDtcbiAgICBsaWIuZGVzaW5XaWR0aCA9IDY0MDtcbiAgICBsaWIuYmFzZUZvbnQgPSAyNDtcbiAgICAvLyDlsYDpg6jliLfmlrDnmoTml7blgJnpg6jliIZjaHJvbWXniYjmnKzlrZfkvZPov4flpKfnmoTpl67pophcbiAgICBsaWIucmVmbG93ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGRvY0VsLmNsaWVudFdpZHRoO1xuICAgIH07XG4gICAgLy8g5qOA5p+l5a6J5Y2T5LiLcmVt5YC85piv5ZCm5pi+56S65q2j56GuXG4gICAgZnVuY3Rpb24gY2hlY2tSZW0oKSB7XG4gICAgICAgIGlmICgvYW5kcm9pZC9pZy50ZXN0KHdpbmRvdy5uYXZpZ2F0b3IuYXBwVmVyc2lvbikpIHtcbiAgICAgICAgICAgIHZhciBoaWRlRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgICAgICAgICAgaGlkZURpdi5zdHlsZS5oZWlnaHQgPSAnMXB4JztcbiAgICAgICAgICAgIGhpZGVEaXYuc3R5bGUud2lkdGggPSAnMi41cmVtJztcbiAgICAgICAgICAgIGhpZGVEaXYuc3R5bGUudmlzaWJpbGl0eSA9ICdoaWRkZW4nO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChoaWRlRGl2KTtcbiAgICAgICAgICAgIHZhciBub3cgPSBoaWRlRGl2Lm9mZnNldFdpZHRoO1xuICAgICAgICAgICAgdmFyIHJpZ2h0ID0gd2luZG93LmFkYXB0aXZlLm5ld0Jhc2UgKiAyLjU7IFxuICAgICAgICAgICAgaWYgKE1hdGguYWJzKHJpZ2h0IC8gbm93IC0gMSkgPiAwLjA1KSB7XG4gICAgICAgICAgICAgICAgbGliLmVyckRwciA9IHJpZ2h0IC8gbm93O1xuICAgICAgICAgICAgICAgIHNldFJlbSgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChoaWRlRGl2KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBsaWIuaW5pdCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gcmVzaXpl55qE5pe25YCZ6YeN5paw6K6+572ucmVt5Z+65YeG5YC8XG4gICAgICAgIC8vIOinpuWPkW9yaWVudGF0aW9uY2hhbmdlIOS6i+S7tuaXtuS5n+S8muinpuWPkXJlc2l6Ze+8jOaVheS4jemcgOimgeWGjea3u+WKoOatpOS6i+S7tuS6hlxuICAgICAgICB3aW4uYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRpZCk7XG4gICAgICAgICAgICB0aWQgPSBzZXRUaW1lb3V0KHNldFJlbSwgMzAwKTtcbiAgICAgICAgfSwgZmFsc2UpO1xuICAgICAgICAvLyDmtY/op4jlmajnvJPlrZjkuK3or7vlj5bml7bkuZ/pnIDopoHph43mlrDorr7nva5yZW3ln7rlh4blgLxcbiAgICAgICAgd2luLmFkZEV2ZW50TGlzdGVuZXIoJ3BhZ2VzaG93JywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgIGlmIChlLnBlcnNpc3RlZCkge1xuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aWQpO1xuICAgICAgICAgICAgICAgIHRpZCA9IHNldFRpbWVvdXQoc2V0UmVtLCAzMDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgIC8vIOiuvue9rmJvZHnkuIrnmoTlrZfkvZPlpKflsI9cbiAgICAgICAgaWYgKGRvYy5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnKSB7XG4gICAgICAgICAgICBkb2MuYm9keS5zdHlsZS5mb250U2l6ZSA9IGxpYi5iYXNlRm9udCAvIDEwMCArICdyZW0nO1xuICAgICAgICAgICAgY2hlY2tSZW0oKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGRvYy5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgICAgICAgICAgICBkb2MuYm9keS5zdHlsZS5mb250U2l6ZSA9IGxpYi5iYXNlRm9udCAvIDEwMCArICdyZW0nO1xuICAgICAgICAgICAgICAgIGNoZWNrUmVtKCk7XG4gICAgICAgICAgICB9LCBmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgICAgc2V0Vmlld3BvcnQoKTtcbiAgICAgICAgLy8g6K6+572ucmVt5YC8XG4gICAgICAgIHNldFJlbSgpO1xuICAgICAgICAvLyBodG1s6IqC54K56K6+572u5biD5bGA6KeG5Y+j5LiO55CG5oOz6KeG5Y+j55qE5YOP57Sg5q+UXG4gICAgICAgIGRvY0VsLnNldEF0dHJpYnV0ZSgnZGF0YS1kcHInLCBkcHIpO1xuICAgIH07XG4gICAgLy8g5pyJ5LqbaHRtbOWFg+e0oOWPquiDveS7pXB45Li65Y2V5L2N77yM5omA5Lul6ZyA6KaB5o+Q5L6b5LiA5Liq5o6l5Y+j77yM5oqKcmVt5Y2V5L2N5o2i566X5oiQcHhcbiAgICBsaWIucmVtVG9QeCA9IGZ1bmN0aW9uIChyZW1WYWx1ZSkge1xuICAgICAgICByZXR1cm4gcmVtVmFsdWUgKiBuZXdCYXNlO1xuICAgIH07XG59KSh3aW5kb3csIGFkYXB0aXZlKTtcbmlmICh0eXBlb2YgbW9kdWxlICE9ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBhZGFwdGl2ZTtcbn0gZWxzZSBpZiAodHlwZW9mIGRlZmluZSA9PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICBkZWZpbmUoZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBhZGFwdGl2ZTtcbiAgICB9KTtcbn0gZWxzZSB7XG4gICAgd2luZG93LmFkYXB0aXZlID0gYWRhcHRpdmU7XG59XG4vLyDnq4vljbPosIPnlKhcbndpbmRvd1snYWRhcHRpdmUnXS5kZXNpbldpZHRoID0gNjQwOyAgICAgICAgLy/orr7orqHlm77lrr3luqZcbndpbmRvd1snYWRhcHRpdmUnXS5iYXNlRm9udCA9IDI0OyAgICAgICAgICAgLy/msqHmnInnvKnmlL7lrZfkvZPlpKflsI9cbndpbmRvd1snYWRhcHRpdmUnXS5tYXhXaWR0aCA9IDQ4MDsgICAgICAgICAgLy/pobXpnaLmmL7npLrmnIDlpKflrr3luqYgIOm7mOiupDU0MFxud2luZG93WydhZGFwdGl2ZSddLmluaXQoKTsgICAgICAgICAgICAgICAgICAvL+iwg+eUqOWIneWni+WMluaWueazlSJdLCJmaWxlIjoicmVjb21tZW5kb3JkZXIvcmVjb21tZW5kb3JkZXJfcmVtLmpzIn0=
