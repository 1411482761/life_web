/**
 * Created by ZhangBH on 7/24/2016.
 */
'use strict';
// Declare app level module which depends on views, and components
angular.module('lifecycle.fair', [
            'ionic',
            'ngCookies',
            'ionic-toast',
            //inject common.js
            'lifecycle.common'
    ])
        .config([
            '$urlRouterProvider',
            '$ionicConfigProvider',
            '$provide',
            '$config',
            '$stateProvider',
            //route
            function($urlRouterProvider, $ionicConfigProvider, $provide, $config, $stateProvider) {

            $stateProvider.state('list', {
                url: "/",/*url: "/list?:pagenum",*/
                /*resolve:{
                    aboutPage:['$fairRunSQL',function ($fairRunSQL) {

                        return $fairRunSQL.query('orderfair_getstoreinfo',[["pagenum",1]]).then(function(data){
                             return data.result.data.length;
                        });

                    }],
                    aboutAllPage:['$fairRunSQL',function ($fairRunSQL) {

                        return $fairRunSQL.query('orderfair_getstoreinfo',[["pagenum",1]]).then(function(data){
                            return data.result.data[0][0];
                        });

                    }]
                },*/
                templateUrl: 'tpl/list.html',
                controller: 'listCtrl'
            });
            $stateProvider.state('store', {
                url: "/store/:fuid",
                templateUrl: 'tpl/store.html',
                controller: 'storeInfoCtrl'
            }).state('package', {
                url: "/package?pkgid",
                templateUrl: 'tpl/package.html',
                controller: 'packageCtrl'
            }).state('packageList', {
                url: "/packageList?pkgid&funitid",
                templateUrl: 'tpl/packageList.html',
                controller: 'packageListCtrl'
            });

            /**
             * Default route addresses
             */
            $urlRouterProvider
                .when('', '/')
            ;//.otherwise('/404');

            /**
             * Ionic initial configurations
             */
            $ionicConfigProvider.tabs.position('bottom');
            //$ionicConfigProvider.backButton.text('').icon('ion-ios-arrow-left');

        }
    ])

        .run([
            '$ionicPlatform',
            function($ionicPlatform) {
                $ionicPlatform.ready(function () {

                    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
                    // for form inputs)
                    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                        cordova.plugins.Keyboard.disableScroll(true);
                    }
                    if (window.StatusBar) {
                        // org.apache.cordova.statusbar required
                        StatusBar.styleDefault();
                    }

                    /*$rootScope.$goBack = function() {
                        if ($window.history.length > 0) {
                            $window.history.back();
                        } else {
                            $state.go('tab.home');
                        }
                    };*/

                });
            }
    ])


        .controller('listCtrl', [
            '$scope','copyOrder','$fairRunSQL','$state','$fairCmd',/*'aboutPage','aboutAllPage',*/
            //listCtrl
            function($scope,copyOrder,$fairRunSQL,$state,$fairCmd/*,aboutPage,aboutAllPage*/) {

                /**
                 * 补充装箱
                 */
                $scope.fixProductCount = function(){
                    var cmd =  'FixProductCount';//com.agilecontrol.fair.task.FixProductCount
                    $fairCmd.execute(cmd).then(
                        function successCallback(obj) {
                            alert(JSON.stringify(obj.message));
                            window.location.reload();
                        },
                        function errorCallback(obj) {
                            alert(JSON.stringify(obj.message));
                        });
                };


                /*$fairRunSQL.query('orderfair_getstoreinfo',[["pagenum",1]]).then(function(data){
                    $scope.storeDate = data.result.data;
                });*/
                $fairRunSQL.query('orderfair_getstoreinfo',[]).then(function(data){
                    $scope.storeDate = data.result.data;
                });
                /**
                 * 高亮
                 */
                $scope.changColor = function(obj){
                    angular.element(".default").css("background-color","rgb(255,255,255)");
                    angular.element(".click_"+obj).css("background-color","rgb(255,255,102)");
                };
                /**
                 * 复制订单，弹出modal 返回状态
                 */
                $scope.copyOrder= function (sD) {

                    var objDescription = sD[3];
                    var objId = sD[0];
                    var orderMoney = sD[5];

                    var promise = copyOrder.getModal($scope,objDescription,objId,orderMoney);
                    promise.then(
                        function successCallback() {
                        },
                        function errorCallback() {
                        }
                    );
                };

                /**
                 * 路由传当前id到店铺信息页面
                 */
                $scope.showStoreInfo = function(sD){
                    var objId = sD[0];
                    $state.go("store",{"fuid":objId});
                    //选中后调用 update的ad_sql  更新买手
                    $fairRunSQL.updateFunit('orderfair_updfunit',[["fuid",objId]])
                };

                /*/!**
                 * 将参数保存在url中，并且进行跳转
                 *!/
                var paramsToURL = function () {
                    var pagenum = $scope.paginationConf.currentPage;
                    /!*$state.go("list",{"pagenum":pagenum});*!/
                    /!**
                     * 执行$runSQL的query方法访问ad_sql请求数据
                     *!/
                    $fairRunSQL.query('orderfair_getstoreinfo',[["pagenum",pagenum]]).then(function(data){
                        $scope.storeDate = data.result.data;
                    });
                };

                /!**
                 *页码标签初始化参数配置
                 * @type {{pagenum: number, totalItems: *, itemsPerPage: *, pagesLength: number}}
                 *!/
                $scope.paginationConf = {
                    pagesLength: 5,/!*显示几页*!/
                    currentPage: 1,/!*定义当前页*!/
                    itemsPerPage: aboutPage, /!*每页数据个数,用路由的resolve方法在页面加载之前取到数据*!/
                    totalItems: 28/!*数据总数,用路由的resolve方法在页面加载之前取到数据 aboutAllPage*!/
                };

                /!**
                 * $emit  向上广播接收
                 *!/
                $scope.$on('changeCurrentPage:click', function (e, newLocation) {
                    var page = newLocation.item;
                    $scope.paginationConf.currentPage = page;
                    paramsToURL();
                });

                $scope.$on('prevPage:click', function (e, newLocation) {
                    var page = newLocation.item;
                    $scope.paginationConf.currentPage = page;
                    paramsToURL();
                });

                $scope.$on('nextPage:click', function (e, newLocation) {
                    var page = newLocation.item;
                    $scope.paginationConf.currentPage = page;
                    paramsToURL();
                });*/


            }
    ])

        .service('copyOrder', [
            '$q','$ionicModal','$fairRunSQL','$fairCmd','$ionicPopup',
            //弹出modal
            function($q,$ionicModal,$fairRunSQL,$fairCmd,$ionicPopup) {

                return {
                    getModal: getModal
                };
                /*
                 * inject $ionicModal
                 * 'slide-in-up'
                 */
                function getModal($scope,objDescription,objId,orderMoney) {
                    var deferred = $q.defer();
                    $scope.copyOrderService = {};
                    //show html in modal
                    $ionicModal.fromTemplateUrl('tpl/copy.html', {
                        scope: $scope,
                        animation: 'slide-in-up'
                    }).then(
                        function (modal) {
                            $scope.copyOrderService.modal = modal;
                            $scope.storeName = objDescription;
                            //get data from ad_sql#orderfair_getfocopy
                            $fairRunSQL.query('orderfair_getfocopy',[["fuid",objId]]).then(function(data){
                                $scope.storeDateCopy = data.result.data;
                            });
                            //show modal
                            modal.show();
                        });

                   /*   复选框 方法二
                   $scope.defineScope = {};
                    //$scope.selectedStoreOrdersobj = [];  → var selectedStoreOrdersobj = [];
                    $scope.defineScope.checkAll = false;
                    var selectedStoreOrdersobj = [];

                    $scope.toggle = function () {
                        var allFlag = true;
                        selectedStoreOrdersobj = [];
                        for (var i = 0; i < $scope.storeDateCopy.length; i++) {
                            if (!$scope.storeDateCopy[i].checked) {
                                allFlag = false;
                            } else {
                                selectedStoreOrdersobj.push($scope.storeDateCopy[i]);
                            }
                        }
                        $scope.defineScope.checkAll = allFlag;
                    };

                    $scope.toggleAll = function () {
                        console.info("$scope.checkAll",$scope.defineScope.checkAll);
                        selectedStoreOrdersobj = [];
                        for (var i = 0; i < $scope.storeDateCopy.length; i++) {
                            $scope.storeDateCopy[i].checked = $scope.defineScope.checkAll;
                        }
                        for (var j = 0; j < $scope.storeDateCopy.length; j++) {
                            if ($scope.storeDateCopy[j].checked) {
                                selectedStoreOrdersobj.push($scope.storeDateCopy[j]);
                            }
                        }
                    };*/

                    $scope.defineScope = {};
                    //init
                    var initalField = function () {
                        $scope.selectedStoreOrdersobj = [];
                        $scope.defineScope.checkAll = false;
                    };
                    initalField();

                    //toggle
                    $scope.toggle = function (sDCobj) {
                        if (sDCobj.checked) {
                            $scope.selectedStoreOrdersobj.push(sDCobj);
                        }
                        else {
                            if ($scope.selectedStoreOrdersobj.indexOf(sDCobj) >= 0) {
                                $scope.selectedStoreOrdersobj.splice($scope.selectedStoreOrdersobj.indexOf(sDCobj), 1);
                            }
                        }
                        //增加 或 取消 后的数量
                        if ($scope.selectedStoreOrdersobj.length == $scope.storeDateCopy.length) {
                            //选中全选
                            $scope.defineScope.checkAll = true;
                        }
                        else {
                            //取消全选
                            $scope.defineScope.checkAll = false;
                        }
                       /* console.info("单选后壳里数据：",$scope.selectedStoreOrdersobj);*/
                    };
                    //toggleAll
                    $scope.toggleAll = function () {
                        if ($scope.selectedStoreOrdersobj.length == $scope.storeDateCopy.length) {
                            //if toggle to all，clear selectedStoreOrdersobj
                            $scope.selectedStoreOrdersobj = [];
                            //取消所有单选
                            for(var i=0; i< $scope.storeDateCopy.length; i++){
                                $scope.storeDateCopy[i].checked = false;
                            }
                        }
                        else{
                            $scope.selectedStoreOrdersobj = [];
                            //if toggle not to all，clear selectedStoreOrdersobj and put all into selectedStoreOrdersobj
                            for(var i=0; i< $scope.storeDateCopy.length; i++){
                                $scope.selectedStoreOrdersobj.push($scope.storeDateCopy[i]);
                                //选中所有单选
                                $scope.storeDateCopy[i].checked = true;
                            }
                        }
                        /*console.info("全选后壳里数据：",$scope.selectedStoreOrdersobj);*/
                    };

                    var FuId=objId;
                    var FunitIds = [];

                    //copy orders
                    $scope.copyOrderService.resolve = function () {
                        if($scope.selectedStoreOrdersobj.length == 0){
                            alert("请选择买手！");
                        }else if(orderMoney == null || orderMoney == ""){
                            alert("请注意，该店无订单，确定复制将清空选中订单！");
                            //confirm copy click
                            var confirmPopup = $ionicPopup.confirm({
                                cssClass: 'buding-order-popup-confirm',
                                title: '',
                                // subTitle: '',
                                template: '<div class="confirm-order--txt-color">将覆盖已有订单，确定复制？</div>',
                                cancelText: '取消',
                                cancelType: 'button-outline-orange',
                                okText: '确定',
                                okType: 'button-outline-orange'

                            });
                            //res confirm or cancel
                            confirmPopup.then(function (res) {
                                if (res) {
                                    //put checked to FunitIds
                                    for(var i = 0; i < $scope.selectedStoreOrdersobj.length; i++){
                                        FunitIds.push($scope.selectedStoreOrdersobj[i][0]);
                                    }

                                    //post data to java
                                    var data = [FuId,FunitIds,1];
                                    var cmd =  'Copyfo';//com.agilecontrol.fair.task.Copyfo
                                    $fairCmd.execute(cmd,{
                                        data : data
                                    }).then(
                                        function successCallback(obj) {
                                            alert(JSON.stringify(obj.message));
                                            //复制订单后 完整页面刷新
                                            window.location.reload();
                                        },
                                        function errorCallback(obj) {
                                            alert(JSON.stringify(obj));
                                        });
                                    //close modal
                                    $scope.copyOrderService.modal.remove();
                                    deferred.resolve();
                                }
                                else {
                                }
                            });
                        }else{

                            //confirm copy click
                            var confirmPopup = $ionicPopup.confirm({
                                cssClass: 'buding-order-popup-confirm',
                                title: '',
                                // subTitle: '',
                                template: '<div class="confirm-order--txt-color">将覆盖已有订单，确定复制？</div>',
                                cancelText: '取消',
                                cancelType: 'button-outline-orange',
                                okText: '确定',
                                okType: 'button-outline-orange'

                            });
                            //res confirm or cancel
                            confirmPopup.then(function (res) {
                                if (res) {
                                    //put checked to FunitIds
                                    for(var i = 0; i < $scope.selectedStoreOrdersobj.length; i++){
                                        FunitIds.push($scope.selectedStoreOrdersobj[i][0]);
                                    }

                                    //post data to java
                                    var data = [FuId,FunitIds,1];
                                    var cmd =  'Copyfo';//com.agilecontrol.fair.task.Copyfo
                                    $fairCmd.execute(cmd,{
                                        data : data
                                    }).then(
                                        function successCallback(obj) {
                                            alert(JSON.stringify(obj.message));
                                            //复制订单后 完整页面刷新
                                            window.location.reload();
                                        },
                                        function errorCallback(obj) {
                                            alert(JSON.stringify(obj));
                                        });
                                    //close modal
                                    $scope.copyOrderService.modal.remove();
                                    deferred.resolve();
                                }
                                else {
                                }
                            });
                        }
                    };
                    //cancel
                    $scope.copyOrderService.reject = function () {
                        $scope.copyOrderService.modal.remove();
                        deferred.reject();
                    };
                    //return Obj
                    return deferred.promise;
                }
            }
    ])

        .controller('storeInfoCtrl', [
            '$scope','$fairRunSQL','$stateParams',
            //storeInfoCtrl
            function($scope,$fairRunSQL,$stateParams) {
                //goback
                $scope.$goBack = function() {
                    window.history.go(-1);
                };

                //get table width
                var firstLength = document.getElementsByClassName("mainTableSecond")[0].clientWidth;
                //$runSQL#query:ad_sql#店铺分类
                $fairRunSQL.query('orderfair_getstoredim1',[["fuid",$stateParams.fuid]]).then(function(data){
                    $scope.storedim1 = data.result.data;

                    var secondLength = $scope.storedim1.length;
                    $scope.scrollBox1 = firstLength / secondLength - 1;
                    console.info("$scope.scrollBox1",$scope.scrollBox1)

                });
                $fairRunSQL.query('orderfair_getstoredim2',[["fuid",$stateParams.fuid]]).then(function(data){
                    $scope.storedim2 = data.result.data;
                    var secondLength = $scope.storedim2.length;
                    $scope.scrollBox2 = firstLength / secondLength - 1;
                });
                $fairRunSQL.query('orderfair_getstoredim3',[["fuid",$stateParams.fuid]]).then(function(data){
                    $scope.storedim3 = data.result.data;
                    var secondLength = $scope.storedim3.length;
                    $scope.scrollBox3 = firstLength / secondLength - 1;

                });
                $fairRunSQL.query('orderfair_getstoredim4',[["fuid",$stateParams.fuid]]).then(function(data){
                    $scope.storedim4 = data.result.data;
                    var secondLength = $scope.storedim4.length;
                    $scope.scrollBox4 = firstLength / secondLength - 1;
                });
                $fairRunSQL.query('orderfair_getstoredim5',[["fuid",$stateParams.fuid]]).then(function(data){
                    $scope.storedim5 = data.result.data;
                    var secondLength = $scope.storedim5.length;
                    $scope.scrollBox5 = firstLength / secondLength - 1;

                });

                //$runSQL#query:ad_sql#产品分类、SKU范围
                $fairRunSQL.query('orderfair_getstoredim6',[["fuid",$stateParams.fuid]]).then(function(data){
                    $scope.storedim6 = data.result.data;
                    $scope.customerDrive = function(s6Obj){
                            //alert("fairapp://SKCListStage?sql="+encodeURIComponent("select * from products where dim2='"+s6Obj[1]+"'"));
                            //将key为dim2，值为s6Obj[0] 的sql  传给指定，然后自动跳到指定url
                           window.location.assign("fairapp://SKCListStage?sql="+encodeURIComponent("select * from products where dim2='"+s6Obj[1]+"'"));

                    }
                });
                $fairRunSQL.query('orderfair_getstoredim7',[["fuid",$stateParams.fuid]]).then(function(data){
                    $scope.storedim7 = data.result.data;
                    $scope.brandDrive = function(s7Obj){
                            window.location.assign("fairapp://SKCListStage?sql="+encodeURIComponent("select * from products where dim2='"+s7Obj[1]+"'"));
                    }
                });
                $fairRunSQL.query('orderfair_getstoredim8',[["fuid",$stateParams.fuid]]).then(function(data){
                    $scope.storedim8 = data.result.data;
                    $scope.weatherDrive = function(s8Obj){
                            window.location.assign("fairapp://SKCListStage?sql="+encodeURIComponent("select * from products where dim2='"+s8Obj[1]+"'"));
                    }
                });
                $fairRunSQL.query('orderfair_getstoredim9',[["fuid",$stateParams.fuid]]).then(function(data){
                    $scope.storedim9 = data.result.data;
                    $scope.areaDrive = function(s9Obj){
                            window.location.assign("fairapp://SKCListStage?sql="+encodeURIComponent("select * from products where dim2='"+s9Obj[1]+"'"));
                    }
                });
            }
    ])
    .controller('packageCtrl', [
        '$scope','$fairCmd','$stateParams','$ionicPopup','$ionicLoading',
        function($scope,$fairCmd,$stateParams,$ionicPopup,$ionicLoading) {
            console.info("document.body.scrollHeight",document.body.scrollHeight);
            $scope.avaHeight = {
              "overflow":"auto"
            };

            $scope.setid = $stateParams.pkgid;
            $scope.showWarning = false;
            console.info($scope.setid );

            $scope.shows = [
                {level:"F",choose:0,amt:0},
                {level:"A",choose:0,amt:0},
                {level:"B",choose:0,amt:0},
                {level:"C",choose:0,amt:0},
                {level:"合计",choose:0,amt:0}
            ];

            $fairCmd.execute("GetAddrStoreList", {
               setid:$scope.setid
            }).then(
                function(result){
                    console.info(result);
                    $scope.package_amt = result.result.package.package_amt;
                    $scope.sts = result.result.stores;
                    if($scope.sts == null || $scope.sts.length == 0)  $scope.showWarning = true;
                    /*$scope.sts = [
                        {"id": 1345, "level": "A", "name": "北京店1111111111", "otb": 100, "amt": 80},
                        {"id": 1346, "level": "A", "name": "北京店2", "otb": 90, "amt": 0},
                        {"id": 1348, "level": "B", "name": "北京店3", "otb": 80, "amt": 0},
                        {"id": 1349, "level": "B", "name": "北京店3", "otb": 80, "amt": 0},
                        {"id": 1350, "level": "B", "name": "北京店3", "otb": 80, "amt": 0},
                        {"id": 1351, "level": "B", "name": "北京店3", "otb": 80, "amt": 0},
                        {"id": 1352, "level": "B", "name": "北京店3", "otb": 80, "amt": 0},
                        {"id": 1353, "level": "B", "name": "北京店3", "otb": 80, "amt": 0},
                        {"id": 1354, "level": "B", "name": "北京店3", "otb": 80, "amt": 0},
                        {"id": 1355, "level": "B", "name": "北京店3", "otb": 80, "amt": 0},
                        {"id": 1356, "level": "B", "name": "北京店3", "otb": 80, "amt": 0},
                        {"id": 1357, "level": "B", "name": "北京店3", "otb": 80, "amt": 0},
                        {"id": 1358, "level": "B", "name": "北京店3", "otb": 80, "amt": 0},
                        {"id": 1359, "level": "B", "name": "北京店3", "otb": 80, "amt": 0},
                        {"id": 1380, "level": "B", "name": "北京店3", "otb": 80, "amt": 0},
                        {"id": 1361, "level": "B", "name": "北京店3", "otb": 80, "amt": 0},
                        {"id": 1362, "level": "B", "name": "北京店3", "otb": 80, "amt": 0},
                        {"id": 1363, "level": "B", "name": "北京店3", "otb": 80, "amt": 0},
                        {"id": 1364, "level": "B", "name": "北京店3", "otb": 80, "amt": 0},
                        {"id": 1365, "level": "B", "name": "北京店3", "otb": 80, "amt": 0},
                        {"id": 1366, "level": "B", "name": "北京店3", "otb": 80, "amt": 0},
                        {"id": 1367, "level": "B", "name": "北京店3", "otb": 80, "amt": 0}
                    ];*/
                },
                function(result){
                    $ionicLoading.show({
                        template: result.message,
                        duration: 1000
                    });
                }
            );

            $scope.doChoose = function(st){
                if(st.amt != 0 &&  !st.checked){
                    var confirmPopup = $ionicPopup.confirm({
                        template: '当前店铺已下量是否覆盖?',
                        cancelText: '否', // String (默认: 'Cancel')。一个取消按钮的文字。
                        cancelType: '', // String (默认: 'button-default')。取消按钮的类型。
                        okText: '是', // String (默认: 'OK')。OK按钮的文字。
                        okType: '' // String (默认: 'button-positive')。OK按钮的类型。
                    });
                    confirmPopup.then(function(res) {
                        if(res) {
                            st.checked =  !st.checked;
                            $scope.changeAmt(st);
                        }
                    });
                }else{
                    st.checked =  !st.checked;
                    $scope.changeAmt(st);
                }
            };



            //获取选中店铺等级对应行
            $scope.getShowsIndex = function(level){
                for(var i = 0 ; i< $scope.shows.length; i++){
                    if(level == $scope.shows[i].level){
                        return i ;
                    }
                }
            };

            //根据选中行做出对应操作
            $scope.changeAmt = function (st) {
                if(st.checked ){
                    var i = $scope.getShowsIndex(st.level);
                    $scope.shows[i].choose ++;
                    $scope.shows[i].amt = $scope.shows[i].amt + $scope.package_amt;

                    $scope.shows[4].choose ++;
                    $scope.shows[4].amt = $scope.shows[4].amt + $scope.package_amt;
                }else{
                    var i = $scope.getShowsIndex(st.level);
                    $scope.shows[i].choose --;
                    $scope.shows[i].amt = $scope.shows[i].amt - $scope.package_amt;

                    $scope.shows[4].choose --;
                    $scope.shows[4].amt = $scope.shows[4].amt - $scope.package_amt;
                }
            };

            //确认下量
            $scope.doPackage = function(){
                console.info($scope.sts);
                var storeids = [];
                for(var i = 0 ; i< $scope.sts.length; i++){
                    if( $scope.sts[i].checked){
                        storeids.push($scope.sts[i].id);
                    }
                }
                console.info(storeids.length);
                if(storeids.length ==0){
                    $ionicLoading.show({
                        template: '选择店铺不可为空',
                        duration: 1000
                    });
                    return;
                }

                $fairCmd.execute("SetPackageToStore", {
                    setid:$scope.setid,
                    storeids:storeids
                }).then(
                    function(result){
                        console.info(result);
                        if(result.code == 0) {
                            //location.href = "fairapp://reload.fair.app";
                            $ionicLoading.show({
                                template: "订单更新成功",
                                duration: 1000
                            });
                        }
                    },
                    function(result){
                        $ionicLoading.show({
                            template: result.message,
                            duration: 1000
                        });
                    }
                );
            };
        }
    ])
    .controller('packageListCtrl', [
        '$scope','$fairCmd','$stateParams','$ionicPopup','$ionicLoading','$fairRunSQL',
        function($scope,$fairCmd,$stateParams,$ionicPopup,$ionicLoading,$fairRunSQL) {
            $scope.avaHeight = {
                "overflow":"auto"
            };
            $fairRunSQL.query('orderfair_get_packstoreinfo',[["setid",$stateParams.pkgid],["funitid",$stateParams.funitid]]).then(function(data){
                console.info("data",data);
                $scope.storeList = data.result.data;
                if($scope.storeList != null && $scope.storeList != "" && $scope.storeList!=undefined){
                    $scope.fairid = $scope.storeList[0][8];
                    console.info("$scope.fairid",$scope.fairid);
                }
            });

            $scope.doDirct = function(store){
                $fairCmd.execute("SetStoreInfo", {storeid:store[0]})
                    .then(
                        function(result){
                            $fairRunSQL.query('orderfair_get_packpdt',[["setid",$stateParams.pkgid],["b_fair_id", $scope.fairid]]).then(function(data){
                                $scope.pdts = data.result.data;
                                if( $scope.pdts == null ||  $scope.pdts == "" ||  $scope.pdts==undefined){
                                    $ionicLoading.show({
                                        template: "当前套餐商品为空",
                                        duration: 1000
                                    });
                                    return ;
                                }
                                var res = $scope.pjString($scope.pdts);
                                console.info("res",res);
                                location.href = "fairapp://SKCListStage?pdts="+res+"&reload=1";
                            });
                        },
                        function(result){
                            $ionicLoading.show({
                                template: result.message,
                                duration: 1000
                            });
                        }
                    );
            };
            //将arry数据拼接成字符串
            $scope.pjString = function(arry){
                var res = arry[0];
                for(var i = 1 ; i < arry.length ; i++){
                    res = res +"+" +arry[i];
                }
                return res;
            };

            //获取选中店铺店号对应行
            $scope.getShowsIndex = function(no){
                for(var i = 0 ; i< $scope.storeList.length; i++){
                    if(no == $scope.storeList[i][0]){
                        return i ;
                    }
                }
            };
        }]);