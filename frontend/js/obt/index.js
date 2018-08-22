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
