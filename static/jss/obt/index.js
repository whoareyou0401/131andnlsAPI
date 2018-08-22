(function(cmApp) {
    "use strict";
    function setMapHeight() {
        $("#map_wrapper").height($("article").height());
    }
    function initLayout() {
        setMapHeight();
        $(window).resize(function() {
            setMapHeight();
        });
        $('.menu .item').tab();
        $('.dropdown').dropdown();
        $('.ui.radio.checkbox').checkbox();
        $('.ui.checkbox').checkbox();
    }

    var QueryString = function () {
      // This function is anonymous, is executed immediately and 
      // the return value is assigned to QueryString!
      var query_string = {};
      var query = window.location.search.substring(1);
      var vars = query.split("&");
      for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
            // If first entry with this name
        if (typeof query_string[pair[0]] === "undefined") {
          query_string[pair[0]] = decodeURIComponent(pair[1]);
            // If second entry with this name
        } else if (typeof query_string[pair[0]] === "string") {
          var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
          query_string[pair[0]] = arr;
            // If third or later entry with this name
        } else {
          query_string[pair[0]].push(decodeURIComponent(pair[1]));
        }
      } 
      return query_string;
    }();
    console.log(QueryString);


    var geoLocation = {
        curPoint: {
            lat: 116.404,
            lng: 39.915,
            address: null,
            adcode: null,
            citycode: null
        },
        addedShop: [],
        nearByShop: []
    };

    cmApp.mapInfo = {};

    cmApp.mapInfo.map = null;
    cmApp.mapInfo.geolocation = null;
    cmApp.mapInfo.geoc = null;
    cmApp.mapInfo.curPosMarker = null;
    cmApp.mapInfo.addedMarkers = [];
    cmApp.mapInfo.placeSearch = null;
    cmApp.mapInfo.nearByShopMarkers = [];
    cmApp.mapInfo.nearByStores = [];
    function unboxStoreData(data) {
        console.log('unboxing');
        console.log(data);
        return {
            id: parseInt(data.id),
            name: data.store.name,
            keeper_name: data.store.contact_name,
            keeper_phone: data.store.contact_phone,
            counter_num: data.counter_num,
            comment: data.comment,
        };
    }

    function initMap() {
        cmApp.mapVm = new Vue({
            el: '#map-pg1',
            data: {
                mapStatus: geoLocation,
                clickPosMarker: null,
            },
            mounted: function() {
                var self = this;
                cmApp.mapInfo.map = new AMap.Map("map_wrapper", {
                    zoom: 15,
                    center: [116.404, 39.915]
                });
				AMap.service(['AMap.Geocoder', 'AMap.PlaceSearch'],function() {
					cmApp.mapInfo.geoc= new AMap.Geocoder();
                    cmApp.mapInfo.placeSearch = new AMap.PlaceSearch({
                        pageSize: 10,
                        pageIndex:1,
                        city: ""
                    });
				});

                self.$watch(
                    function() {
                        var a = self.mapStatus.curPoint.lat;
                        var b = self.mapStatus.curPoint.lng;
                        return (a + b) * (a + b + 1) / 2 + a;
                    }, 
                    function() {
                        self.centerToCurPoint();
                        self.refreshAddr();
                    });

                cmApp.mapInfo.map.on('click', function(e) {
                    self.mapStatus.curPoint.lat = e.lnglat.getLat();
                    self.mapStatus.curPoint.lng = e.lnglat.getLng();
                });

                cmApp.mapInfo.map.plugin('AMap.Geolocation', function() {
                    cmApp.mapInfo.geolocation= new AMap.Geolocation({
                        enableHighAccuracy: true,//是否使用高精度定位，默认:true
                        timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                        maximumAge: 0,           //定位结果缓存0毫秒，默认：0
                        convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                        showButton: true,        //显示定位按钮，默认：true
                        buttonPosition: 'LB',    //定位按钮停靠
                        buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                        showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
                        showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
                        panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
                        zoomToAccuracy:true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
                    });
                    cmApp.mapInfo.map.addControl(cmApp.mapInfo.geolocation);

                    AMap.event.addListener(cmApp.mapInfo.geolocation, 'complete', function(e) {
                        self.mapStatus.curPoint.lat = e.position.getLat();
                        self.mapStatus.curPoint.lng = e.position.getLng();
                    });

                    self.reLocation();
                });
            },
            methods: {
                refreshAddr: function() {
                    var self = this;
                    var point = new AMap.LngLat(
                        self.mapStatus.curPoint.lng,
                        self.mapStatus.curPoint.lat);
                    cmApp.mapInfo.geoc.getAddress(point, function(status, rs) {
                        console.log(rs);
                        if (status === 'complete' && rs.info === 'OK') {
                            self.mapStatus.curPoint.address = rs.regeocode.formattedAddress;
                            self.mapStatus.curPoint.adcode = rs.regeocode.addressComponent.adcode;
                            self.mapStatus.curPoint.citycode = rs.regeocode.addressComponent.citycode;
                        } else {
                            console.log('Fail to get address');
                        }
                    });
                },
                reLocation: function() {
                    var self = this;
                    cmApp.mapInfo.geolocation.getCurrentPosition(function(status, r) {
                        if (status === 'error') {
                            console.log('Error getting current location');
                        } else {
                            self.mapStatus.curPoint.lat = r.position.getLat();
                            self.mapStatus.curPoint.lng = r.position.getLng();
                        }
                    });
                },
                centerToCurPoint: function() {
                    console.debug('Curpoint updated to ' + this.mapStatus.curPoint.lat + ',' + this.mapStatus.curPoint.lng);
                    var point = new AMap.LngLat(this.mapStatus.curPoint.lng,
                        this.mapStatus.curPoint.lat);
                    cmApp.mapInfo.map.panTo(point);
                    if(cmApp.mapInfo.curPosMarker !== null) {
                        cmApp.mapInfo.curPosMarker.setPosition(point);
                    } else {
                        cmApp.mapInfo.curPosMarker = new AMap.Marker({
                            map: cmApp.mapInfo.map,
                            position: point,
                            icon: new AMap.Icon({
                                image: "http://webapi.amap.com/theme/v1.3/markers/b/mark_b.png",
                                imageSize: new AMap.Size(12, 18)
                            }),
                            label: {
                                content: "当前位置",
                                offset: new AMap.Pixel(10, -10)
                            }
                        });
                    }
                },
                goToAdd: function() {
                    $('#add-dev-btn').click();
                },
                refreshAndShowNearestAdded: function() {
                    var self = this;
                    $.getJSON({
                        url: '/api/v1.1/obt/store/nearest',
                        data: {
                            "__lat": self.mapStatus.curPoint.lat,
                            "__lng": self.mapStatus.curPoint.lng
                        }
                    }, function(data){
                        self.mapStatus.addedShop = data.data;
                        self.showAdded();
                    });
                },
                refreshAndShowAllAdded: function() {
                    var self = this;
                    $.getJSON({
                        url: '/api/v1.1/obt/store',
                        data: {
                            'per_page': 0
                        }
                    }, function(data){
                        self.mapStatus.addedShop = data.data;
                        self.showAdded();
                    });
                },
                showAdded: function() {
                    var self = this;
                    self.clearAddedOverlay();
                    if (self.mapStatus.addedShop === null) {
                        return;
                    }
                    self.mapStatus.addedShop.forEach(function(entry) {
                        var marker = new AMap.Marker({
                            map: cmApp.mapInfo.map,
                            position: new AMap.LngLat(entry.store.lng, entry.store.lat),
                            icon: new AMap.Icon({
                                image: "http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png",
                                imageSize: new AMap.Size(10, 15)
                            }),
                            label: {
                                cotent: entry.store.name,
                                offset: new AMap.Pixel(20, -10)
                            }
                        });
                        cmApp.mapInfo.addedMarkers.push(marker);
                    });
                },
                refreshAndShowNearBy: function() {
                    var self = this;
                    var cpoint = new AMap.LngLat(
                        self.mapStatus.curPoint.lng, 
                        self.mapStatus.curPoint.lat);
                    cmApp.mapInfo.placeSearch.setCity(self.mapStatus.curPoint.citycode);
                    cmApp.mapInfo.placeSearch.searchNearBy(
                        "超市",
                        cpoint,
                        2000,
                        function(status, result) {
                            console.log(status);
                            if (status === 'complete' && result.info === 'OK') {
                                console.log(result);
                                cmApp.mapInfo.nearByStores = result.poiList.pois;
                                self.showNearBy();
                            }
                        });
                },
                showNearBy: function() {
                    var self = this;
                    self.clearNearByOverlay();
                    cmApp.mapInfo.nearByStores.forEach(function(entry) {
                        var point = new AMap.LngLat(entry.location.lng, entry.location.lat);
                        var marker = new AMap.Marker({
                            map: cmApp.mapInfo.map,
                            position: point, 
                            icon: new AMap.Icon({
                                image: "http://webapi.amap.com/theme/v1.3/markers/b/mark_b.png",
                                imageSize: new AMap.Size(10, 15)
                            }),
                            label: {
                                content: entry.name,
                                offset: new AMap.Pixel(20, -10)
                            }
                        });
                        cmApp.mapInfo.nearByShopMarkers.push(marker);
                    });
                },
                clearOverlay: function() {
                    this.clearAddedOverlay();
                    this.clearNearByOverlay();
                },
                clearAddedOverlay: function() {
                    self = this;
                    cmApp.mapInfo.addedMarkers.forEach(function(entry) {
                        entry.setMap(null);
                    });
                    cmApp.mapInfo.addedMarkers = [];
                },
                clearNearByOverlay: function() {
                    self = this;
                    cmApp.mapInfo.nearByShopMarkers.forEach(function(entry) {
                        entry.setMap(null);
                    });
                    cmApp.mapInfo.nearByShopMarkers = [];
                }
            }
        });
    }

    function setActiveItem(target) {
        target.addClass('active');
        target.siblings().removeClass('active');
    }

    function clearData(data) {
        for (var k in data) {
            if (data.hasOwnProperty(k)) {
                data[k] = null;
            }
        }
    }


    var shop = {
        ref: {
            id: null,
            name: null,
            keeper_name: null,
            keeper_phone: null,
            counter_num:null,
            comment: null
        }
    };

    function initShopSelector() {
        cmApp.shopAddTabVm = new Vue({
            el: '#add-shop-tab',
            data: {
                shop: shop,
                shopLst: [],
                curLocation: geoLocation.curPoint,
                imgUploadProgress: 0,
                imgLocalPath: null,
                imgRemotePath: null
            },
            methods: {
                searchNearbyShops: function() {
                    var self = this;
                    if (self.shop.ref.name <= 1) {
                        return;
                    }

                    cmApp.mapInfo.placeSearch.setCity(self.curLocation.citycode);

                    cmApp.mapInfo.placeSearch.searchNearBy(
                        self.shop.ref.name,
                        new AMap.LngLat(self.curLocation.lng, self.curLocation.lat),
                        2000,
                        function(status, result) {
                            if (status == 'complete' && result.info == 'OK') {
                                console.log(result);
                                self.shopLst = result.poiList.pois;
                            }
                        });
                },
                searchItemSelected: function(event) {
                    console.debug('clicked');
                    var searchR = this.shopLst[$(event.target).attr("idx")];
                    this.shop.ref.name = searchR.name;
                    this.curLocation.lat = searchR.location.lat;
                    this.curLocation.lng = searchR.location.lng;
                    this.shop.ref.phone = searchR.telephone;
                    $('#shop-name-input').popup("hide");
                },
                boxStoreData: function() {
                    var self = this;
                    var data =  {
                        comment: self.shop.ref.comment,
                        counter_num: self.shop.ref.counter_num,
                        store_obj: {
                            name: self.shop.ref.name,
                            adcode: self.curLocation.adcode,
                            address: self.curLocation.address,
                            lat: self.curLocation.lat,
                            lng: self.curLocation.lng,
                            contact_name: self.shop.ref.keeper_name,
                            contact_phone: self.shop.ref.keeper_phone,
                        }
                    };
                    if (self.shop.id !== null) {
                        data.id = self.shop.ref.id;
                    }
                    return data;
                },
                add: function() {
                    var self = this;
                    var params = self.boxStoreData();
                    $.ajax({
                        url: '/api/v1.1/obt/store',
                        method: 'post',
                        dataType: 'text',
                        contentType: 'application/json; charset=utf-8',
                        data: JSON.stringify(params)
                    }).done(function(data) {
                        data = $.parseJSON(data);
                        console.log(data);
                        if (data.code !== 0) {
                            alert("添加失败" + data.message + '\n' + data.errors);
                            return;
                        }
                        self.shop.ref = unboxStoreData(data.data);
                        alert('添加成功');
                    }).fail(function() {
                        alert("添加失败");
                    });
                },
                save: function() {
                    var self = this;
                    if(self.shop.ref.id === null) {
                        alert('请先保存商店');
                        return;
                    }
                    $.ajax({
                        url: '/api/v1.1/obt/store/' + self.shop.ref.id + '/',
                        method: 'patch',
                        dataType: 'text',
                        contentType: 'application/json; charset=utf-8',
                        data: JSON.stringify(self.boxStoreData())
                    }).done(function(data) {
                        data = $.parseJSON(data);
                        console.log(data);
                        if (data.code !== 0) {
                            alert("保存失败" + data.message + '\n' + data.errors);
                            return;
                        }
                        self.shop.ref = unboxStoreData(data.data);
                        alert('保存成功');
                    }).fail(function() {
                        alert("保存失败");
                    });
                },
                clearData: function() {
                    clearData(this.shop.ref);
                }
            },
            mounted: function() {
                var self = this;
                $('#shop-name-input').popup({
                    position: 'bottom left',
                    on: 'click'
                });
            },
            watch: {
                'shop.ref.name': function() {
                    this.searchNearbyShops();
                }
            }
        });

        cmApp.shopSelectTabVm = new Vue({
            el: '#select-shop-tab',
            data: {
                shop: shop,
                shopLst: []
            },
            mounted: function() {
                console.debug("Ready!!!");
                var self = this;
                $('#shop-name-search').popup({
                    position: 'bottom left',
                    on: 'click'
                });
            },
            watch: {
                'shop.ref.name': function(newVal, oldVal) {
                    var self = this;
                    if (newVal === null || typeof newVal == "undefined" || newVal.length === 0) {
                        self.refreshShopLst();
                        return;
                    }

                    if (newVal === null || newVal.length <= 1) {
                        return;
                    }

                    $.getJSON({
                        url: '/api/v1.1/obt/store',
                        data: {
                            store__name__contains: this.shop.ref.name,
                            per_page: 5,
                            o: "created"
                        }
                    }, function(data) {
                        self.shopLst = data.data;
                    });
                }
            },
            methods: {
                searchItemSelected: function(event) {
                    this.shop.ref = unboxStoreData(this.shopLst[$(event.target).attr("idx")]);
                    $('#shop-name-search').popup('hide');
                },
                refreshShopLst: function() {
                    var self = this;
                        $.getJSON({
                            url: '/api/v1.1/obt/store/nearest',
                            data: {
                                '__lat': geoLocation.curPoint.lat,
                                '__lng': geoLocation.curPoint.lng
                            }
                        }).done(function(data){
                            self.shopLst = data.data.slice(0,5);
                        }).fail(function(data){
                            console.debug("Fail");
                        });
                }
            }
        });

        cmApp.shopSelectorVm = new Vue({
            el: '#shop-selector-menu',
            data: {
                curMode: 0 // 0 -- add, 1 --select
            },
            methods: {
                switchToAdd: function(event) {
                    setActiveItem($('#shop-add-item'));
                    console.debug("Switching to add shop");
                    clearData(shop.ref);
                    this.curMode = 0;
                    $.tab('change tab', 'add-shop');
                },
                switchToSelect: function(event) {
                    setActiveItem($('#shop-select-item'));
                    console.debug("Switching to select shop");
                    clearData(shop.ref);
                    this.curMode = 1;
                    $.tab('change tab', 'select-shop');
                }
            },
            mounted: function() {
                this.switchToAdd();
            }
        });

    }

    var device = {
        ref: {
            id: null,
            comment: null,
            device_id: null,
            store: null,
            version_num: 2 
        }
    };

    function initDevicePanel() {
        cmApp.deviceVm = new Vue({
            el: '#device-selector',
            data: {
                device: device,
                deviceLst: [],
                shop: shop,
                is_printer: false
            },
            methods: {
                loadDevices: function() {
                    var self = this;
                    if (this.shop.ref.id === null) {
                        return;
                    }
                    $.getJSON({
                        url: '/api/v1.1/obt/device',
                        data: {
                            "store": self.shop.ref.id
                        }
                    }).done(function(data) {
                        console.debug(data);
                        self.deviceLst = data.data;
                    }).fail(function(){
                        alert('Fail to load devices');
                    });
                },
                add: function() {
                    var self = this;
                    if(shop.ref.id === null) {
                        alert('请先选择或者保存店铺信息');
                        return;
                    }
                    self.device.ref.store = shop.ref.id;
                    $.ajax({
                        url: '/api/v1.1/obt/device',
                        method: 'post',
                        contentType: 'application/json; charset=utf-8',
                        data: self.device.ref
                    }).done(function(data) {
                        if (data.code !== 0) {
                            alert("添加失败" + data.message + '\n' + data.errors);
                            return;
                        }
                        // make a deep copy
                        self.deviceLst.push(JSON.parse(JSON.stringify(data.data)));
                        self.device.ref = data.data;
                        self.is_printer = data.data.version_num === 1;
                        self.addNext();
                    }).fail(function(data) {
                        console.log(data);
                        alert('失败');
                    });
                },
                save: function() {
                    var self = this;
                    if(shop.ref.id === null) {
                        alert('请先选择或者保存店铺信息');
                        return;
                    }
                    if(self.device.ref.id === null) {
                        alert('保存后才能修改');
                    }
                    self.device.ref.shop = shop.ref.id;
                    $.ajax({
                        url: '/api/v1.1/obt/device/' + self.device.ref.id + '/',
                        method: 'patch',
                        contentType: 'application/json; charset=utf-8',
                        data: self.device.ref
                    }).done(function(data) {
                        if (data.code !== 0) {
                            alert("失败" + data.message + '\n' + data.errors);
                            return;
                        }
                        self.device.ref = data.data;
                        self.is_printer = data.data.version_num === 1;
                        alert('成功');
                    }).fail(function() {
                        alert('失败');
                    });
                },
                addNext: function() {
                    if (this.device.id === null) {
                        alert('请先保存当前设备');
                        return;
                    }
                    this.device.ref = {
                        id: null,
                        comment: null,
                        device_id: null,
                        store: null,
                        version_num: 2 
                    };
                    this.is_printer = false;
                },
            },
            watch: {
                'shop.ref.id': function(newVal, oldVal) {
                    console.debug("Show changed");
                    if (newVal !== null) {
                        this.loadDevices();
                    }
                },
                is_printer: function() {
                    if(this.is_printer) {
                        this.device.version_num = 1;
                    } else {
                        this.device.version_num = 2;
                    }
                }
            }
        });
    }

    function initMgmtData() {
        var mgmtVm = new Vue({
            el: '#ori-pg4',
            data: {
                searchTerm: '',
                shopLst: [],
                page_meta: {},
                page: 1,
                numAdded: 0,
                numFailed: 0,
                numToAdd: 0,
                numNotAdd: 0
            },
            methods: {
                addDevice: function(shopId, deviceId) {
                    console.log("Adding" + shopId + "," + deviceId);
                    var self = this;
                    var deviceData = {
                        store: shopId,
                        device_id: deviceId,
                        version_num: 2
                    };
                    ++self.numToAdd;
                    $.ajax({
                        url: '/api/v1.1/obt/device',
                        method: 'post',
                        contentType: 'application/json; charset=utf-8',
                        data: deviceData
                    }).done(function(data) {
                        if (data.code !== 0) {
                            alert("添加失败: " + deviceId + data.message + '\n' + data.errors);
                            ++self.numFailed;
                            return;
                        }
                        ++self.numAdded;
                    }).fail(function(data) {
                        alert("添加失败: " + deviceId);
                        ++self.numFailed;
                    });
                },
                submit: function() {
                    console.log("Submit!");
                    var self = this;
                    self.numAdded = 0;
                    self.numFailed = 0;
                    self.numToAdd = 0;
                    self.numNotAdd = 0;
                    for(var i = 0; i < self.shopLst.length; ++i) {
                        var s = self.shopLst[i];
                        if (s.dirty && s.newDevices.length > 0) {
                            console.log(s);
                            var ns = s.newDevices.split(',');
                            for(var j = 0; j < ns.length; ++j) {
                                self.addDevice(s.id, ns[j]);
                            }
                        }
                    }
                },
                loadData: function() {
                    var self = this;
                    var request = {
                        per_page: 10,
                        o: ['-created'],
                        page: self.page
                    };
                    if (self.searchTerm.length > 0) {
                        request.store__name__contains = self.searchTerm;
                    }
                    $.ajax({
                        url: '/api/v1.1/obt/store',
                        data: request,
                        method: 'get',
                        dataType: 'json'
                    }).done(function(data) {
                        console.log(data);
                        self.handleData(data);
                    });
                },
                handleData: function(data) {
                    this.page_meta = data.pagination_meta;
                    for (var i = 0;  i < data.data.length; ++i) {
                        var d = data.data[i];
                        d.dirty = false;
                        d.newDevices = '';
                        var deviceidLst = [];
                        for(var j = 0; j < d.device_set.length; ++j) {
                            deviceidLst.push(d.device_set[j].device_id);
                        }
                        delete d.device_set;
                        d.deviceidLst = deviceidLst;
                    }
                    console.log(data.data);
                    this.shopLst = data.data;
                },
                handleAdded: function() {
                    if (this.numToAdd === this.numAdded + this.numFailed) {
                        console.log('Done!');
                        this.loadData();
                    }
                }
            },
            mounted: function() {
                this.loadData();
            }, 
            watch: {
                searchTerm: function(newVal, oldVal) {
                    var self = this;
                    if (self.searchTerm.length > 2) {
                        self.loadData();
                    }
                },
                numAdded: function() {
                    this.handleAdded();
                }
            }

        });
        cmApp.mgmtVm = mgmtVm;
    }

    function handleQueryString() {
        if ('deviceid' in QueryString) {
            device.ref.device_id = QueryString.deviceid;
            $('#add-dev-btn').click();
            cmApp.shopSelectorVm.switchToSelect();
        }
    }

    $(document).ready(function() {
        setupCSRF();
        initMap();
        initShopSelector();
        initDevicePanel();
        initMgmtData();
        cmApp.shop = shop;
        cmApp.device = device;
        initLayout();
        handleQueryString();
    });
})(window.cmApp = window.cmApp || {});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJvYnQvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKGNtQXBwKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgZnVuY3Rpb24gc2V0TWFwSGVpZ2h0KCkge1xuICAgICAgICAkKFwiI21hcF93cmFwcGVyXCIpLmhlaWdodCgkKFwiYXJ0aWNsZVwiKS5oZWlnaHQoKSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGluaXRMYXlvdXQoKSB7XG4gICAgICAgIHNldE1hcEhlaWdodCgpO1xuICAgICAgICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgc2V0TWFwSGVpZ2h0KCk7XG4gICAgICAgIH0pO1xuICAgICAgICAkKCcubWVudSAuaXRlbScpLnRhYigpO1xuICAgICAgICAkKCcuZHJvcGRvd24nKS5kcm9wZG93bigpO1xuICAgICAgICAkKCcudWkucmFkaW8uY2hlY2tib3gnKS5jaGVja2JveCgpO1xuICAgICAgICAkKCcudWkuY2hlY2tib3gnKS5jaGVja2JveCgpO1xuICAgIH1cblxuICAgIHZhciBRdWVyeVN0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIC8vIFRoaXMgZnVuY3Rpb24gaXMgYW5vbnltb3VzLCBpcyBleGVjdXRlZCBpbW1lZGlhdGVseSBhbmQgXG4gICAgICAvLyB0aGUgcmV0dXJuIHZhbHVlIGlzIGFzc2lnbmVkIHRvIFF1ZXJ5U3RyaW5nIVxuICAgICAgdmFyIHF1ZXJ5X3N0cmluZyA9IHt9O1xuICAgICAgdmFyIHF1ZXJ5ID0gd2luZG93LmxvY2F0aW9uLnNlYXJjaC5zdWJzdHJpbmcoMSk7XG4gICAgICB2YXIgdmFycyA9IHF1ZXJ5LnNwbGl0KFwiJlwiKTtcbiAgICAgIGZvciAodmFyIGk9MDtpPHZhcnMubGVuZ3RoO2krKykge1xuICAgICAgICB2YXIgcGFpciA9IHZhcnNbaV0uc3BsaXQoXCI9XCIpO1xuICAgICAgICAgICAgLy8gSWYgZmlyc3QgZW50cnkgd2l0aCB0aGlzIG5hbWVcbiAgICAgICAgaWYgKHR5cGVvZiBxdWVyeV9zdHJpbmdbcGFpclswXV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBxdWVyeV9zdHJpbmdbcGFpclswXV0gPSBkZWNvZGVVUklDb21wb25lbnQocGFpclsxXSk7XG4gICAgICAgICAgICAvLyBJZiBzZWNvbmQgZW50cnkgd2l0aCB0aGlzIG5hbWVcbiAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgcXVlcnlfc3RyaW5nW3BhaXJbMF1dID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgdmFyIGFyciA9IFsgcXVlcnlfc3RyaW5nW3BhaXJbMF1dLGRlY29kZVVSSUNvbXBvbmVudChwYWlyWzFdKSBdO1xuICAgICAgICAgIHF1ZXJ5X3N0cmluZ1twYWlyWzBdXSA9IGFycjtcbiAgICAgICAgICAgIC8vIElmIHRoaXJkIG9yIGxhdGVyIGVudHJ5IHdpdGggdGhpcyBuYW1lXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcXVlcnlfc3RyaW5nW3BhaXJbMF1dLnB1c2goZGVjb2RlVVJJQ29tcG9uZW50KHBhaXJbMV0pKTtcbiAgICAgICAgfVxuICAgICAgfSBcbiAgICAgIHJldHVybiBxdWVyeV9zdHJpbmc7XG4gICAgfSgpO1xuICAgIGNvbnNvbGUubG9nKFF1ZXJ5U3RyaW5nKTtcblxuXG4gICAgdmFyIGdlb0xvY2F0aW9uID0ge1xuICAgICAgICBjdXJQb2ludDoge1xuICAgICAgICAgICAgbGF0OiAxMTYuNDA0LFxuICAgICAgICAgICAgbG5nOiAzOS45MTUsXG4gICAgICAgICAgICBhZGRyZXNzOiBudWxsLFxuICAgICAgICAgICAgYWRjb2RlOiBudWxsLFxuICAgICAgICAgICAgY2l0eWNvZGU6IG51bGxcbiAgICAgICAgfSxcbiAgICAgICAgYWRkZWRTaG9wOiBbXSxcbiAgICAgICAgbmVhckJ5U2hvcDogW11cbiAgICB9O1xuXG4gICAgY21BcHAubWFwSW5mbyA9IHt9O1xuXG4gICAgY21BcHAubWFwSW5mby5tYXAgPSBudWxsO1xuICAgIGNtQXBwLm1hcEluZm8uZ2VvbG9jYXRpb24gPSBudWxsO1xuICAgIGNtQXBwLm1hcEluZm8uZ2VvYyA9IG51bGw7XG4gICAgY21BcHAubWFwSW5mby5jdXJQb3NNYXJrZXIgPSBudWxsO1xuICAgIGNtQXBwLm1hcEluZm8uYWRkZWRNYXJrZXJzID0gW107XG4gICAgY21BcHAubWFwSW5mby5wbGFjZVNlYXJjaCA9IG51bGw7XG4gICAgY21BcHAubWFwSW5mby5uZWFyQnlTaG9wTWFya2VycyA9IFtdO1xuICAgIGNtQXBwLm1hcEluZm8ubmVhckJ5U3RvcmVzID0gW107XG4gICAgZnVuY3Rpb24gdW5ib3hTdG9yZURhdGEoZGF0YSkge1xuICAgICAgICBjb25zb2xlLmxvZygndW5ib3hpbmcnKTtcbiAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBpZDogcGFyc2VJbnQoZGF0YS5pZCksXG4gICAgICAgICAgICBuYW1lOiBkYXRhLnN0b3JlLm5hbWUsXG4gICAgICAgICAgICBrZWVwZXJfbmFtZTogZGF0YS5zdG9yZS5jb250YWN0X25hbWUsXG4gICAgICAgICAgICBrZWVwZXJfcGhvbmU6IGRhdGEuc3RvcmUuY29udGFjdF9waG9uZSxcbiAgICAgICAgICAgIGNvdW50ZXJfbnVtOiBkYXRhLmNvdW50ZXJfbnVtLFxuICAgICAgICAgICAgY29tbWVudDogZGF0YS5jb21tZW50LFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluaXRNYXAoKSB7XG4gICAgICAgIGNtQXBwLm1hcFZtID0gbmV3IFZ1ZSh7XG4gICAgICAgICAgICBlbDogJyNtYXAtcGcxJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBtYXBTdGF0dXM6IGdlb0xvY2F0aW9uLFxuICAgICAgICAgICAgICAgIGNsaWNrUG9zTWFya2VyOiBudWxsLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1vdW50ZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICBjbUFwcC5tYXBJbmZvLm1hcCA9IG5ldyBBTWFwLk1hcChcIm1hcF93cmFwcGVyXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgem9vbTogMTUsXG4gICAgICAgICAgICAgICAgICAgIGNlbnRlcjogWzExNi40MDQsIDM5LjkxNV1cbiAgICAgICAgICAgICAgICB9KTtcblx0XHRcdFx0QU1hcC5zZXJ2aWNlKFsnQU1hcC5HZW9jb2RlcicsICdBTWFwLlBsYWNlU2VhcmNoJ10sZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0Y21BcHAubWFwSW5mby5nZW9jPSBuZXcgQU1hcC5HZW9jb2RlcigpO1xuICAgICAgICAgICAgICAgICAgICBjbUFwcC5tYXBJbmZvLnBsYWNlU2VhcmNoID0gbmV3IEFNYXAuUGxhY2VTZWFyY2goe1xuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZVNpemU6IDEwLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZUluZGV4OjEsXG4gICAgICAgICAgICAgICAgICAgICAgICBjaXR5OiBcIlwiXG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXHRcdFx0XHR9KTtcblxuICAgICAgICAgICAgICAgIHNlbGYuJHdhdGNoKFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBhID0gc2VsZi5tYXBTdGF0dXMuY3VyUG9pbnQubGF0O1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGIgPSBzZWxmLm1hcFN0YXR1cy5jdXJQb2ludC5sbmc7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gKGEgKyBiKSAqIChhICsgYiArIDEpIC8gMiArIGE7XG4gICAgICAgICAgICAgICAgICAgIH0sIFxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuY2VudGVyVG9DdXJQb2ludCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5yZWZyZXNoQWRkcigpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGNtQXBwLm1hcEluZm8ubWFwLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5tYXBTdGF0dXMuY3VyUG9pbnQubGF0ID0gZS5sbmdsYXQuZ2V0TGF0KCk7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubWFwU3RhdHVzLmN1clBvaW50LmxuZyA9IGUubG5nbGF0LmdldExuZygpO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgY21BcHAubWFwSW5mby5tYXAucGx1Z2luKCdBTWFwLkdlb2xvY2F0aW9uJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGNtQXBwLm1hcEluZm8uZ2VvbG9jYXRpb249IG5ldyBBTWFwLkdlb2xvY2F0aW9uKHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVuYWJsZUhpZ2hBY2N1cmFjeTogdHJ1ZSwvL+aYr+WQpuS9v+eUqOmrmOeyvuW6puWumuS9je+8jOm7mOiupDp0cnVlXG4gICAgICAgICAgICAgICAgICAgICAgICB0aW1lb3V0OiAxMDAwMCwgICAgICAgICAgLy/otoXov4cxMOenkuWQjuWBnOatouWumuS9je+8jOm7mOiupO+8muaXoOept+Wkp1xuICAgICAgICAgICAgICAgICAgICAgICAgbWF4aW11bUFnZTogMCwgICAgICAgICAgIC8v5a6a5L2N57uT5p6c57yT5a2YMOavq+enku+8jOm7mOiupO+8mjBcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnZlcnQ6IHRydWUsICAgICAgICAgICAvL+iHquWKqOWBj+enu+WdkOagh++8jOWBj+enu+WQjueahOWdkOagh+S4uumrmOW+t+WdkOagh++8jOm7mOiupO+8mnRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dCdXR0b246IHRydWUsICAgICAgICAvL+aYvuekuuWumuS9jeaMiemSru+8jOm7mOiupO+8mnRydWVcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1dHRvblBvc2l0aW9uOiAnTEInLCAgICAvL+WumuS9jeaMiemSruWBnOmdoFxuICAgICAgICAgICAgICAgICAgICAgICAgYnV0dG9uT2Zmc2V0OiBuZXcgQU1hcC5QaXhlbCgxMCwgMjApLC8v5a6a5L2N5oyJ6ZKu5LiO6K6+572u55qE5YGc6Z2g5L2N572u55qE5YGP56e76YeP77yM6buY6K6k77yaUGl4ZWwoMTAsIDIwKVxuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd01hcmtlcjogdHJ1ZSwgICAgICAgIC8v5a6a5L2N5oiQ5Yqf5ZCO5Zyo5a6a5L2N5Yiw55qE5L2N572u5pi+56S654K55qCH6K6w77yM6buY6K6k77yadHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgc2hvd0NpcmNsZTogdHJ1ZSwgICAgICAgIC8v5a6a5L2N5oiQ5Yqf5ZCO55So5ZyG5ZyI6KGo56S65a6a5L2N57K+5bqm6IyD5Zu077yM6buY6K6k77yadHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgcGFuVG9Mb2NhdGlvbjogdHJ1ZSwgICAgIC8v5a6a5L2N5oiQ5Yqf5ZCO5bCG5a6a5L2N5Yiw55qE5L2N572u5L2c5Li65Zyw5Zu+5Lit5b+D54K577yM6buY6K6k77yadHJ1ZVxuICAgICAgICAgICAgICAgICAgICAgICAgem9vbVRvQWNjdXJhY3k6dHJ1ZSAgICAgIC8v5a6a5L2N5oiQ5Yqf5ZCO6LCD5pW05Zyw5Zu+6KeG6YeO6IyD5Zu05L2/5a6a5L2N5L2N572u5Y+K57K+5bqm6IyD5Zu06KeG6YeO5YaF5Y+v6KeB77yM6buY6K6k77yaZmFsc2VcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIGNtQXBwLm1hcEluZm8ubWFwLmFkZENvbnRyb2woY21BcHAubWFwSW5mby5nZW9sb2NhdGlvbik7XG5cbiAgICAgICAgICAgICAgICAgICAgQU1hcC5ldmVudC5hZGRMaXN0ZW5lcihjbUFwcC5tYXBJbmZvLmdlb2xvY2F0aW9uLCAnY29tcGxldGUnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLm1hcFN0YXR1cy5jdXJQb2ludC5sYXQgPSBlLnBvc2l0aW9uLmdldExhdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5tYXBTdGF0dXMuY3VyUG9pbnQubG5nID0gZS5wb3NpdGlvbi5nZXRMbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgc2VsZi5yZUxvY2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWV0aG9kczoge1xuICAgICAgICAgICAgICAgIHJlZnJlc2hBZGRyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcG9pbnQgPSBuZXcgQU1hcC5MbmdMYXQoXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLm1hcFN0YXR1cy5jdXJQb2ludC5sbmcsXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLm1hcFN0YXR1cy5jdXJQb2ludC5sYXQpO1xuICAgICAgICAgICAgICAgICAgICBjbUFwcC5tYXBJbmZvLmdlb2MuZ2V0QWRkcmVzcyhwb2ludCwgZnVuY3Rpb24oc3RhdHVzLCBycykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2cocnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXR1cyA9PT0gJ2NvbXBsZXRlJyAmJiBycy5pbmZvID09PSAnT0snKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5tYXBTdGF0dXMuY3VyUG9pbnQuYWRkcmVzcyA9IHJzLnJlZ2VvY29kZS5mb3JtYXR0ZWRBZGRyZXNzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYubWFwU3RhdHVzLmN1clBvaW50LmFkY29kZSA9IHJzLnJlZ2VvY29kZS5hZGRyZXNzQ29tcG9uZW50LmFkY29kZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLm1hcFN0YXR1cy5jdXJQb2ludC5jaXR5Y29kZSA9IHJzLnJlZ2VvY29kZS5hZGRyZXNzQ29tcG9uZW50LmNpdHljb2RlO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnRmFpbCB0byBnZXQgYWRkcmVzcycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHJlTG9jYXRpb246IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgICAgIGNtQXBwLm1hcEluZm8uZ2VvbG9jYXRpb24uZ2V0Q3VycmVudFBvc2l0aW9uKGZ1bmN0aW9uKHN0YXR1cywgcikge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHN0YXR1cyA9PT0gJ2Vycm9yJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdFcnJvciBnZXR0aW5nIGN1cnJlbnQgbG9jYXRpb24nKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5tYXBTdGF0dXMuY3VyUG9pbnQubGF0ID0gci5wb3NpdGlvbi5nZXRMYXQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxmLm1hcFN0YXR1cy5jdXJQb2ludC5sbmcgPSByLnBvc2l0aW9uLmdldExuZygpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGNlbnRlclRvQ3VyUG9pbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKCdDdXJwb2ludCB1cGRhdGVkIHRvICcgKyB0aGlzLm1hcFN0YXR1cy5jdXJQb2ludC5sYXQgKyAnLCcgKyB0aGlzLm1hcFN0YXR1cy5jdXJQb2ludC5sbmcpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgcG9pbnQgPSBuZXcgQU1hcC5MbmdMYXQodGhpcy5tYXBTdGF0dXMuY3VyUG9pbnQubG5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tYXBTdGF0dXMuY3VyUG9pbnQubGF0KTtcbiAgICAgICAgICAgICAgICAgICAgY21BcHAubWFwSW5mby5tYXAucGFuVG8ocG9pbnQpO1xuICAgICAgICAgICAgICAgICAgICBpZihjbUFwcC5tYXBJbmZvLmN1clBvc01hcmtlciAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY21BcHAubWFwSW5mby5jdXJQb3NNYXJrZXIuc2V0UG9zaXRpb24ocG9pbnQpO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgY21BcHAubWFwSW5mby5jdXJQb3NNYXJrZXIgPSBuZXcgQU1hcC5NYXJrZXIoe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1hcDogY21BcHAubWFwSW5mby5tYXAsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IHBvaW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb246IG5ldyBBTWFwLkljb24oe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZTogXCJodHRwOi8vd2ViYXBpLmFtYXAuY29tL3RoZW1lL3YxLjMvbWFya2Vycy9iL21hcmtfYi5wbmdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2VTaXplOiBuZXcgQU1hcC5TaXplKDEyLCAxOClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBcIuW9k+WJjeS9jee9rlwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXQ6IG5ldyBBTWFwLlBpeGVsKDEwLCAtMTApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGdvVG9BZGQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAkKCcjYWRkLWRldi1idG4nKS5jbGljaygpO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcmVmcmVzaEFuZFNob3dOZWFyZXN0QWRkZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgICAgICQuZ2V0SlNPTih7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICcvYXBpL3YxLjEvb2J0L3N0b3JlL25lYXJlc3QnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YToge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiX19sYXRcIjogc2VsZi5tYXBTdGF0dXMuY3VyUG9pbnQubGF0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiX19sbmdcIjogc2VsZi5tYXBTdGF0dXMuY3VyUG9pbnQubG5nXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5tYXBTdGF0dXMuYWRkZWRTaG9wID0gZGF0YS5kYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zaG93QWRkZWQoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICByZWZyZXNoQW5kU2hvd0FsbEFkZGVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICAkLmdldEpTT04oe1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAnL2FwaS92MS4xL29idC9zdG9yZScsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJ3Blcl9wYWdlJzogMFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYubWFwU3RhdHVzLmFkZGVkU2hvcCA9IGRhdGEuZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2hvd0FkZGVkKCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2hvd0FkZGVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmNsZWFyQWRkZWRPdmVybGF5KCk7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLm1hcFN0YXR1cy5hZGRlZFNob3AgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBzZWxmLm1hcFN0YXR1cy5hZGRlZFNob3AuZm9yRWFjaChmdW5jdGlvbihlbnRyeSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1hcmtlciA9IG5ldyBBTWFwLk1hcmtlcih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFwOiBjbUFwcC5tYXBJbmZvLm1hcCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogbmV3IEFNYXAuTG5nTGF0KGVudHJ5LnN0b3JlLmxuZywgZW50cnkuc3RvcmUubGF0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uOiBuZXcgQU1hcC5JY29uKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2U6IFwiaHR0cDovL3dlYmFwaS5hbWFwLmNvbS90aGVtZS92MS4zL21hcmtlcnMvbi9tYXJrX3IucG5nXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlU2l6ZTogbmV3IEFNYXAuU2l6ZSgxMCwgMTUpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGFiZWw6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY290ZW50OiBlbnRyeS5zdG9yZS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXQ6IG5ldyBBTWFwLlBpeGVsKDIwLCAtMTApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbUFwcC5tYXBJbmZvLmFkZGVkTWFya2Vycy5wdXNoKG1hcmtlcik7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcmVmcmVzaEFuZFNob3dOZWFyQnk6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgICAgIHZhciBjcG9pbnQgPSBuZXcgQU1hcC5MbmdMYXQoXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLm1hcFN0YXR1cy5jdXJQb2ludC5sbmcsIFxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5tYXBTdGF0dXMuY3VyUG9pbnQubGF0KTtcbiAgICAgICAgICAgICAgICAgICAgY21BcHAubWFwSW5mby5wbGFjZVNlYXJjaC5zZXRDaXR5KHNlbGYubWFwU3RhdHVzLmN1clBvaW50LmNpdHljb2RlKTtcbiAgICAgICAgICAgICAgICAgICAgY21BcHAubWFwSW5mby5wbGFjZVNlYXJjaC5zZWFyY2hOZWFyQnkoXG4gICAgICAgICAgICAgICAgICAgICAgICBcIui2heW4glwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgY3BvaW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgMjAwMCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uKHN0YXR1cywgcmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coc3RhdHVzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoc3RhdHVzID09PSAnY29tcGxldGUnICYmIHJlc3VsdC5pbmZvID09PSAnT0snKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNtQXBwLm1hcEluZm8ubmVhckJ5U3RvcmVzID0gcmVzdWx0LnBvaUxpc3QucG9pcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zaG93TmVhckJ5KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzaG93TmVhckJ5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLmNsZWFyTmVhckJ5T3ZlcmxheSgpO1xuICAgICAgICAgICAgICAgICAgICBjbUFwcC5tYXBJbmZvLm5lYXJCeVN0b3Jlcy5mb3JFYWNoKGZ1bmN0aW9uKGVudHJ5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcG9pbnQgPSBuZXcgQU1hcC5MbmdMYXQoZW50cnkubG9jYXRpb24ubG5nLCBlbnRyeS5sb2NhdGlvbi5sYXQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG1hcmtlciA9IG5ldyBBTWFwLk1hcmtlcih7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFwOiBjbUFwcC5tYXBJbmZvLm1hcCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogcG9pbnQsIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGljb246IG5ldyBBTWFwLkljb24oe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbWFnZTogXCJodHRwOi8vd2ViYXBpLmFtYXAuY29tL3RoZW1lL3YxLjMvbWFya2Vycy9iL21hcmtfYi5wbmdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW1hZ2VTaXplOiBuZXcgQU1hcC5TaXplKDEwLCAxNSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsYWJlbDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBlbnRyeS5uYW1lLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvZmZzZXQ6IG5ldyBBTWFwLlBpeGVsKDIwLCAtMTApXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbUFwcC5tYXBJbmZvLm5lYXJCeVNob3BNYXJrZXJzLnB1c2gobWFya2VyKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBjbGVhck92ZXJsYXk6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmNsZWFyQWRkZWRPdmVybGF5KCk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2xlYXJOZWFyQnlPdmVybGF5KCk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBjbGVhckFkZGVkT3ZlcmxheTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICBjbUFwcC5tYXBJbmZvLmFkZGVkTWFya2Vycy5mb3JFYWNoKGZ1bmN0aW9uKGVudHJ5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlbnRyeS5zZXRNYXAobnVsbCk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBjbUFwcC5tYXBJbmZvLmFkZGVkTWFya2VycyA9IFtdO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgY2xlYXJOZWFyQnlPdmVybGF5OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgICAgIGNtQXBwLm1hcEluZm8ubmVhckJ5U2hvcE1hcmtlcnMuZm9yRWFjaChmdW5jdGlvbihlbnRyeSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZW50cnkuc2V0TWFwKG51bGwpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgY21BcHAubWFwSW5mby5uZWFyQnlTaG9wTWFya2VycyA9IFtdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgZnVuY3Rpb24gc2V0QWN0aXZlSXRlbSh0YXJnZXQpIHtcbiAgICAgICAgdGFyZ2V0LmFkZENsYXNzKCdhY3RpdmUnKTtcbiAgICAgICAgdGFyZ2V0LnNpYmxpbmdzKCkucmVtb3ZlQ2xhc3MoJ2FjdGl2ZScpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGNsZWFyRGF0YShkYXRhKSB7XG4gICAgICAgIGZvciAodmFyIGsgaW4gZGF0YSkge1xuICAgICAgICAgICAgaWYgKGRhdGEuaGFzT3duUHJvcGVydHkoaykpIHtcbiAgICAgICAgICAgICAgICBkYXRhW2tdID0gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgdmFyIHNob3AgPSB7XG4gICAgICAgIHJlZjoge1xuICAgICAgICAgICAgaWQ6IG51bGwsXG4gICAgICAgICAgICBuYW1lOiBudWxsLFxuICAgICAgICAgICAga2VlcGVyX25hbWU6IG51bGwsXG4gICAgICAgICAgICBrZWVwZXJfcGhvbmU6IG51bGwsXG4gICAgICAgICAgICBjb3VudGVyX251bTpudWxsLFxuICAgICAgICAgICAgY29tbWVudDogbnVsbFxuICAgICAgICB9XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGluaXRTaG9wU2VsZWN0b3IoKSB7XG4gICAgICAgIGNtQXBwLnNob3BBZGRUYWJWbSA9IG5ldyBWdWUoe1xuICAgICAgICAgICAgZWw6ICcjYWRkLXNob3AtdGFiJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBzaG9wOiBzaG9wLFxuICAgICAgICAgICAgICAgIHNob3BMc3Q6IFtdLFxuICAgICAgICAgICAgICAgIGN1ckxvY2F0aW9uOiBnZW9Mb2NhdGlvbi5jdXJQb2ludCxcbiAgICAgICAgICAgICAgICBpbWdVcGxvYWRQcm9ncmVzczogMCxcbiAgICAgICAgICAgICAgICBpbWdMb2NhbFBhdGg6IG51bGwsXG4gICAgICAgICAgICAgICAgaW1nUmVtb3RlUGF0aDogbnVsbFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1ldGhvZHM6IHtcbiAgICAgICAgICAgICAgICBzZWFyY2hOZWFyYnlTaG9wczogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYuc2hvcC5yZWYubmFtZSA8PSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjbUFwcC5tYXBJbmZvLnBsYWNlU2VhcmNoLnNldENpdHkoc2VsZi5jdXJMb2NhdGlvbi5jaXR5Y29kZSk7XG5cbiAgICAgICAgICAgICAgICAgICAgY21BcHAubWFwSW5mby5wbGFjZVNlYXJjaC5zZWFyY2hOZWFyQnkoXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNob3AucmVmLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXcgQU1hcC5MbmdMYXQoc2VsZi5jdXJMb2NhdGlvbi5sbmcsIHNlbGYuY3VyTG9jYXRpb24ubGF0KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIDIwMDAsXG4gICAgICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbihzdGF0dXMsIHJlc3VsdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChzdGF0dXMgPT0gJ2NvbXBsZXRlJyAmJiByZXN1bHQuaW5mbyA9PSAnT0snKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3VsdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2hvcExzdCA9IHJlc3VsdC5wb2lMaXN0LnBvaXM7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzZWFyY2hJdGVtU2VsZWN0ZWQ6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoJ2NsaWNrZWQnKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlYXJjaFIgPSB0aGlzLnNob3BMc3RbJChldmVudC50YXJnZXQpLmF0dHIoXCJpZHhcIildO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3AucmVmLm5hbWUgPSBzZWFyY2hSLm5hbWU7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VyTG9jYXRpb24ubGF0ID0gc2VhcmNoUi5sb2NhdGlvbi5sYXQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VyTG9jYXRpb24ubG5nID0gc2VhcmNoUi5sb2NhdGlvbi5sbmc7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2hvcC5yZWYucGhvbmUgPSBzZWFyY2hSLnRlbGVwaG9uZTtcbiAgICAgICAgICAgICAgICAgICAgJCgnI3Nob3AtbmFtZS1pbnB1dCcpLnBvcHVwKFwiaGlkZVwiKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGJveFN0b3JlRGF0YTogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgdmFyIGRhdGEgPSAge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29tbWVudDogc2VsZi5zaG9wLnJlZi5jb21tZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgY291bnRlcl9udW06IHNlbGYuc2hvcC5yZWYuY291bnRlcl9udW0sXG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9yZV9vYmo6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBzZWxmLnNob3AucmVmLm5hbWUsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWRjb2RlOiBzZWxmLmN1ckxvY2F0aW9uLmFkY29kZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhZGRyZXNzOiBzZWxmLmN1ckxvY2F0aW9uLmFkZHJlc3MsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGF0OiBzZWxmLmN1ckxvY2F0aW9uLmxhdCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsbmc6IHNlbGYuY3VyTG9jYXRpb24ubG5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRhY3RfbmFtZTogc2VsZi5zaG9wLnJlZi5rZWVwZXJfbmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb250YWN0X3Bob25lOiBzZWxmLnNob3AucmVmLmtlZXBlcl9waG9uZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHNlbGYuc2hvcC5pZCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5pZCA9IHNlbGYuc2hvcC5yZWYuaWQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBhZGQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgICAgIHZhciBwYXJhbXMgPSBzZWxmLmJveFN0b3JlRGF0YSgpO1xuICAgICAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAnL2FwaS92MS4xL29idC9zdG9yZScsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdwb3N0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAndGV4dCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkocGFyYW1zKVxuICAgICAgICAgICAgICAgICAgICB9KS5kb25lKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGEgPSAkLnBhcnNlSlNPTihkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGRhdGEuY29kZSAhPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwi5re75Yqg5aSx6LSlXCIgKyBkYXRhLm1lc3NhZ2UgKyAnXFxuJyArIGRhdGEuZXJyb3JzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNob3AucmVmID0gdW5ib3hTdG9yZURhdGEoZGF0YS5kYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KCfmt7vliqDmiJDlip8nKTtcbiAgICAgICAgICAgICAgICAgICAgfSkuZmFpbChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwi5re75Yqg5aSx6LSlXCIpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNhdmU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgICAgIGlmKHNlbGYuc2hvcC5yZWYuaWQgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KCfor7flhYjkv53lrZjllYblupcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAnL2FwaS92MS4xL29idC9zdG9yZS8nICsgc2VsZi5zaG9wLnJlZi5pZCArICcvJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ3BhdGNoJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFUeXBlOiAndGV4dCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogSlNPTi5zdHJpbmdpZnkoc2VsZi5ib3hTdG9yZURhdGEoKSlcbiAgICAgICAgICAgICAgICAgICAgfSkuZG9uZShmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0gJC5wYXJzZUpTT04oZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmNvZGUgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChcIuS/neWtmOWksei0pVwiICsgZGF0YS5tZXNzYWdlICsgJ1xcbicgKyBkYXRhLmVycm9ycyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5zaG9wLnJlZiA9IHVuYm94U3RvcmVEYXRhKGRhdGEuZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbGVydCgn5L+d5a2Y5oiQ5YqfJyk7XG4gICAgICAgICAgICAgICAgICAgIH0pLmZhaWwoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbGVydChcIuS/neWtmOWksei0pVwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBjbGVhckRhdGE6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBjbGVhckRhdGEodGhpcy5zaG9wLnJlZik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1vdW50ZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICAkKCcjc2hvcC1uYW1lLWlucHV0JykucG9wdXAoe1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogJ2JvdHRvbSBsZWZ0JyxcbiAgICAgICAgICAgICAgICAgICAgb246ICdjbGljaydcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB3YXRjaDoge1xuICAgICAgICAgICAgICAgICdzaG9wLnJlZi5uYW1lJzogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2VhcmNoTmVhcmJ5U2hvcHMoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGNtQXBwLnNob3BTZWxlY3RUYWJWbSA9IG5ldyBWdWUoe1xuICAgICAgICAgICAgZWw6ICcjc2VsZWN0LXNob3AtdGFiJyxcbiAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICBzaG9wOiBzaG9wLFxuICAgICAgICAgICAgICAgIHNob3BMc3Q6IFtdXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbW91bnRlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5kZWJ1ZyhcIlJlYWR5ISEhXCIpO1xuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICAkKCcjc2hvcC1uYW1lLXNlYXJjaCcpLnBvcHVwKHtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246ICdib3R0b20gbGVmdCcsXG4gICAgICAgICAgICAgICAgICAgIG9uOiAnY2xpY2snXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgd2F0Y2g6IHtcbiAgICAgICAgICAgICAgICAnc2hvcC5yZWYubmFtZSc6IGZ1bmN0aW9uKG5ld1ZhbCwgb2xkVmFsKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ld1ZhbCA9PT0gbnVsbCB8fCB0eXBlb2YgbmV3VmFsID09IFwidW5kZWZpbmVkXCIgfHwgbmV3VmFsLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5yZWZyZXNoU2hvcExzdCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ld1ZhbCA9PT0gbnVsbCB8fCBuZXdWYWwubGVuZ3RoIDw9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICQuZ2V0SlNPTih7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICcvYXBpL3YxLjEvb2J0L3N0b3JlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdG9yZV9fbmFtZV9fY29udGFpbnM6IHRoaXMuc2hvcC5yZWYubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwZXJfcGFnZTogNSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvOiBcImNyZWF0ZWRcIlxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnNob3BMc3QgPSBkYXRhLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtZXRob2RzOiB7XG4gICAgICAgICAgICAgICAgc2VhcmNoSXRlbVNlbGVjdGVkOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3AucmVmID0gdW5ib3hTdG9yZURhdGEodGhpcy5zaG9wTHN0WyQoZXZlbnQudGFyZ2V0KS5hdHRyKFwiaWR4XCIpXSk7XG4gICAgICAgICAgICAgICAgICAgICQoJyNzaG9wLW5hbWUtc2VhcmNoJykucG9wdXAoJ2hpZGUnKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHJlZnJlc2hTaG9wTHN0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICAgICAgJC5nZXRKU09OKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICcvYXBpL3YxLjEvb2J0L3N0b3JlL25lYXJlc3QnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ19fbGF0JzogZ2VvTG9jYXRpb24uY3VyUG9pbnQubGF0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnX19sbmcnOiBnZW9Mb2NhdGlvbi5jdXJQb2ludC5sbmdcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9KS5kb25lKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuc2hvcExzdCA9IGRhdGEuZGF0YS5zbGljZSgwLDUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSkuZmFpbChmdW5jdGlvbihkYXRhKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKFwiRmFpbFwiKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgY21BcHAuc2hvcFNlbGVjdG9yVm0gPSBuZXcgVnVlKHtcbiAgICAgICAgICAgIGVsOiAnI3Nob3Atc2VsZWN0b3ItbWVudScsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgY3VyTW9kZTogMCAvLyAwIC0tIGFkZCwgMSAtLXNlbGVjdFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1ldGhvZHM6IHtcbiAgICAgICAgICAgICAgICBzd2l0Y2hUb0FkZDogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgc2V0QWN0aXZlSXRlbSgkKCcjc2hvcC1hZGQtaXRlbScpKTtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kZWJ1ZyhcIlN3aXRjaGluZyB0byBhZGQgc2hvcFwiKTtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJEYXRhKHNob3AucmVmKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJNb2RlID0gMDtcbiAgICAgICAgICAgICAgICAgICAgJC50YWIoJ2NoYW5nZSB0YWInLCAnYWRkLXNob3AnKTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHN3aXRjaFRvU2VsZWN0OiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAgICAgICAgICAgICBzZXRBY3RpdmVJdGVtKCQoJyNzaG9wLXNlbGVjdC1pdGVtJykpO1xuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmRlYnVnKFwiU3dpdGNoaW5nIHRvIHNlbGVjdCBzaG9wXCIpO1xuICAgICAgICAgICAgICAgICAgICBjbGVhckRhdGEoc2hvcC5yZWYpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1ck1vZGUgPSAxO1xuICAgICAgICAgICAgICAgICAgICAkLnRhYignY2hhbmdlIHRhYicsICdzZWxlY3Qtc2hvcCcpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtb3VudGVkOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnN3aXRjaFRvQWRkKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG4gICAgdmFyIGRldmljZSA9IHtcbiAgICAgICAgcmVmOiB7XG4gICAgICAgICAgICBpZDogbnVsbCxcbiAgICAgICAgICAgIGNvbW1lbnQ6IG51bGwsXG4gICAgICAgICAgICBkZXZpY2VfaWQ6IG51bGwsXG4gICAgICAgICAgICBzdG9yZTogbnVsbCxcbiAgICAgICAgICAgIHZlcnNpb25fbnVtOiAyIFxuICAgICAgICB9XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGluaXREZXZpY2VQYW5lbCgpIHtcbiAgICAgICAgY21BcHAuZGV2aWNlVm0gPSBuZXcgVnVlKHtcbiAgICAgICAgICAgIGVsOiAnI2RldmljZS1zZWxlY3RvcicsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgZGV2aWNlOiBkZXZpY2UsXG4gICAgICAgICAgICAgICAgZGV2aWNlTHN0OiBbXSxcbiAgICAgICAgICAgICAgICBzaG9wOiBzaG9wLFxuICAgICAgICAgICAgICAgIGlzX3ByaW50ZXI6IGZhbHNlXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgbWV0aG9kczoge1xuICAgICAgICAgICAgICAgIGxvYWREZXZpY2VzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5zaG9wLnJlZi5pZCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICQuZ2V0SlNPTih7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICcvYXBpL3YxLjEvb2J0L2RldmljZScsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzdG9yZVwiOiBzZWxmLnNob3AucmVmLmlkXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pLmRvbmUoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kZWJ1ZyhkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZGV2aWNlTHN0ID0gZGF0YS5kYXRhO1xuICAgICAgICAgICAgICAgICAgICB9KS5mYWlsKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbGVydCgnRmFpbCB0byBsb2FkIGRldmljZXMnKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBhZGQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgICAgIGlmKHNob3AucmVmLmlkID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhbGVydCgn6K+35YWI6YCJ5oup5oiW6ICF5L+d5a2Y5bqX6ZO65L+h5oGvJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgc2VsZi5kZXZpY2UucmVmLnN0b3JlID0gc2hvcC5yZWYuaWQ7XG4gICAgICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICcvYXBpL3YxLjEvb2J0L2RldmljZScsXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdwb3N0JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhOiBzZWxmLmRldmljZS5yZWZcbiAgICAgICAgICAgICAgICAgICAgfSkuZG9uZShmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoZGF0YS5jb2RlICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCLmt7vliqDlpLHotKVcIiArIGRhdGEubWVzc2FnZSArICdcXG4nICsgZGF0YS5lcnJvcnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG1ha2UgYSBkZWVwIGNvcHlcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuZGV2aWNlTHN0LnB1c2goSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkYXRhLmRhdGEpKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmRldmljZS5yZWYgPSBkYXRhLmRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmlzX3ByaW50ZXIgPSBkYXRhLmRhdGEudmVyc2lvbl9udW0gPT09IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmFkZE5leHQoKTtcbiAgICAgICAgICAgICAgICAgICAgfSkuZmFpbChmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KCflpLHotKUnKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBzYXZlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICBpZihzaG9wLnJlZi5pZCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ+ivt+WFiOmAieaLqeaIluiAheS/neWtmOW6l+mTuuS/oeaBrycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmKHNlbGYuZGV2aWNlLnJlZi5pZCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ+S/neWtmOWQjuaJjeiDveS/ruaUuScpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHNlbGYuZGV2aWNlLnJlZi5zaG9wID0gc2hvcC5yZWYuaWQ7XG4gICAgICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6ICcvYXBpL3YxLjEvb2J0L2RldmljZS8nICsgc2VsZi5kZXZpY2UucmVmLmlkICsgJy8nLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAncGF0Y2gnLFxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IHNlbGYuZGV2aWNlLnJlZlxuICAgICAgICAgICAgICAgICAgICB9KS5kb25lKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmNvZGUgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChcIuWksei0pVwiICsgZGF0YS5tZXNzYWdlICsgJ1xcbicgKyBkYXRhLmVycm9ycyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5kZXZpY2UucmVmID0gZGF0YS5kYXRhO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5pc19wcmludGVyID0gZGF0YS5kYXRhLnZlcnNpb25fbnVtID09PSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ+aIkOWKnycpO1xuICAgICAgICAgICAgICAgICAgICB9KS5mYWlsKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWxlcnQoJ+Wksei0pScpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGFkZE5leHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5kZXZpY2UuaWQgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KCfor7flhYjkv53lrZjlvZPliY3orr7lpIcnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRldmljZS5yZWYgPSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbW1lbnQ6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXZpY2VfaWQ6IG51bGwsXG4gICAgICAgICAgICAgICAgICAgICAgICBzdG9yZTogbnVsbCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZlcnNpb25fbnVtOiAyIFxuICAgICAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzX3ByaW50ZXIgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHdhdGNoOiB7XG4gICAgICAgICAgICAgICAgJ3Nob3AucmVmLmlkJzogZnVuY3Rpb24obmV3VmFsLCBvbGRWYWwpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5kZWJ1ZyhcIlNob3cgY2hhbmdlZFwiKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ld1ZhbCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkRGV2aWNlcygpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBpc19wcmludGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy5pc19wcmludGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRldmljZS52ZXJzaW9uX251bSA9IDE7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmRldmljZS52ZXJzaW9uX251bSA9IDI7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGluaXRNZ210RGF0YSgpIHtcbiAgICAgICAgdmFyIG1nbXRWbSA9IG5ldyBWdWUoe1xuICAgICAgICAgICAgZWw6ICcjb3JpLXBnNCcsXG4gICAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICAgICAgc2VhcmNoVGVybTogJycsXG4gICAgICAgICAgICAgICAgc2hvcExzdDogW10sXG4gICAgICAgICAgICAgICAgcGFnZV9tZXRhOiB7fSxcbiAgICAgICAgICAgICAgICBwYWdlOiAxLFxuICAgICAgICAgICAgICAgIG51bUFkZGVkOiAwLFxuICAgICAgICAgICAgICAgIG51bUZhaWxlZDogMCxcbiAgICAgICAgICAgICAgICBudW1Ub0FkZDogMCxcbiAgICAgICAgICAgICAgICBudW1Ob3RBZGQ6IDBcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBtZXRob2RzOiB7XG4gICAgICAgICAgICAgICAgYWRkRGV2aWNlOiBmdW5jdGlvbihzaG9wSWQsIGRldmljZUlkKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiQWRkaW5nXCIgKyBzaG9wSWQgKyBcIixcIiArIGRldmljZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgICAgICAgICAgICAgICB2YXIgZGV2aWNlRGF0YSA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0b3JlOiBzaG9wSWQsXG4gICAgICAgICAgICAgICAgICAgICAgICBkZXZpY2VfaWQ6IGRldmljZUlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgdmVyc2lvbl9udW06IDJcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgKytzZWxmLm51bVRvQWRkO1xuICAgICAgICAgICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAnL2FwaS92MS4xL29idC9kZXZpY2UnLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAncG9zdCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogZGV2aWNlRGF0YVxuICAgICAgICAgICAgICAgICAgICB9KS5kb25lKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChkYXRhLmNvZGUgIT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhbGVydChcIua3u+WKoOWksei0pTogXCIgKyBkZXZpY2VJZCArIGRhdGEubWVzc2FnZSArICdcXG4nICsgZGF0YS5lcnJvcnMpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICsrc2VsZi5udW1GYWlsZWQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgKytzZWxmLm51bUFkZGVkO1xuICAgICAgICAgICAgICAgICAgICB9KS5mYWlsKGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwi5re75Yqg5aSx6LSlOiBcIiArIGRldmljZUlkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICsrc2VsZi5udW1GYWlsZWQ7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc3VibWl0OiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJTdWJtaXQhXCIpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubnVtQWRkZWQgPSAwO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLm51bUZhaWxlZCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYubnVtVG9BZGQgPSAwO1xuICAgICAgICAgICAgICAgICAgICBzZWxmLm51bU5vdEFkZCA9IDA7XG4gICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaSA9IDA7IGkgPCBzZWxmLnNob3BMc3QubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzID0gc2VsZi5zaG9wTHN0W2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHMuZGlydHkgJiYgcy5uZXdEZXZpY2VzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhzKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgbnMgPSBzLm5ld0RldmljZXMuc3BsaXQoJywnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGogPSAwOyBqIDwgbnMubGVuZ3RoOyArK2opIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5hZGREZXZpY2Uocy5pZCwgbnNbal0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgbG9hZERhdGE6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgICAgIHZhciByZXF1ZXN0ID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgcGVyX3BhZ2U6IDEwLFxuICAgICAgICAgICAgICAgICAgICAgICAgbzogWyctY3JlYXRlZCddLFxuICAgICAgICAgICAgICAgICAgICAgICAgcGFnZTogc2VsZi5wYWdlXG4gICAgICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLnNlYXJjaFRlcm0ubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVxdWVzdC5zdG9yZV9fbmFtZV9fY29udGFpbnMgPSBzZWxmLnNlYXJjaFRlcm07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgJC5hamF4KHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHVybDogJy9hcGkvdjEuMS9vYnQvc3RvcmUnLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogcmVxdWVzdCxcbiAgICAgICAgICAgICAgICAgICAgICAgIG1ldGhvZDogJ2dldCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nXG4gICAgICAgICAgICAgICAgICAgIH0pLmRvbmUoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLmhhbmRsZURhdGEoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgaGFuZGxlRGF0YTogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhZ2VfbWV0YSA9IGRhdGEucGFnaW5hdGlvbl9tZXRhO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgIGkgPCBkYXRhLmRhdGEubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkID0gZGF0YS5kYXRhW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgZC5kaXJ0eSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgZC5uZXdEZXZpY2VzID0gJyc7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGV2aWNlaWRMc3QgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaiA9IDA7IGogPCBkLmRldmljZV9zZXQubGVuZ3RoOyArK2opIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZXZpY2VpZExzdC5wdXNoKGQuZGV2aWNlX3NldFtqXS5kZXZpY2VfaWQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGQuZGV2aWNlX3NldDtcbiAgICAgICAgICAgICAgICAgICAgICAgIGQuZGV2aWNlaWRMc3QgPSBkZXZpY2VpZExzdDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhkYXRhLmRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnNob3BMc3QgPSBkYXRhLmRhdGE7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBoYW5kbGVBZGRlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLm51bVRvQWRkID09PSB0aGlzLm51bUFkZGVkICsgdGhpcy5udW1GYWlsZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdEb25lIScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkRGF0YSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIG1vdW50ZWQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgIHRoaXMubG9hZERhdGEoKTtcbiAgICAgICAgICAgIH0sIFxuICAgICAgICAgICAgd2F0Y2g6IHtcbiAgICAgICAgICAgICAgICBzZWFyY2hUZXJtOiBmdW5jdGlvbihuZXdWYWwsIG9sZFZhbCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICAgICAgICAgICAgICAgIGlmIChzZWxmLnNlYXJjaFRlcm0ubGVuZ3RoID4gMikge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi5sb2FkRGF0YSgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBudW1BZGRlZDogZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaGFuZGxlQWRkZWQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgfSk7XG4gICAgICAgIGNtQXBwLm1nbXRWbSA9IG1nbXRWbTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBoYW5kbGVRdWVyeVN0cmluZygpIHtcbiAgICAgICAgaWYgKCdkZXZpY2VpZCcgaW4gUXVlcnlTdHJpbmcpIHtcbiAgICAgICAgICAgIGRldmljZS5yZWYuZGV2aWNlX2lkID0gUXVlcnlTdHJpbmcuZGV2aWNlaWQ7XG4gICAgICAgICAgICAkKCcjYWRkLWRldi1idG4nKS5jbGljaygpO1xuICAgICAgICAgICAgY21BcHAuc2hvcFNlbGVjdG9yVm0uc3dpdGNoVG9TZWxlY3QoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xuICAgICAgICBzZXR1cENTUkYoKTtcbiAgICAgICAgaW5pdE1hcCgpO1xuICAgICAgICBpbml0U2hvcFNlbGVjdG9yKCk7XG4gICAgICAgIGluaXREZXZpY2VQYW5lbCgpO1xuICAgICAgICBpbml0TWdtdERhdGEoKTtcbiAgICAgICAgY21BcHAuc2hvcCA9IHNob3A7XG4gICAgICAgIGNtQXBwLmRldmljZSA9IGRldmljZTtcbiAgICAgICAgaW5pdExheW91dCgpO1xuICAgICAgICBoYW5kbGVRdWVyeVN0cmluZygpO1xuICAgIH0pO1xufSkod2luZG93LmNtQXBwID0gd2luZG93LmNtQXBwIHx8IHt9KTtcbiJdLCJmaWxlIjoib2J0L2luZGV4LmpzIn0=
