/**
 * Created by wang.pengfei on 2016/11/25 0025.
 */
'use strict';
angular.module('lifecycle.balabala.fair', [
    'ionic',
    'ngCookies',
    'ionic-toast',
    'lifecycle.common'
])
    .config([
        '$urlRouterProvider',
        '$ionicConfigProvider',
        '$provide',
        '$config',
        '$stateProvider',
        //route
        function ($urlRouterProvider, $ionicConfigProvider, $provide, $config, $stateProvider) {

            $stateProvider.state('mainPage', {
                url: "/",
                resolve:{
                    //获取每页记录数，默认取第一页就好了
                     aboutPage:['$fairCmd',function ($fairCmd) {
                         var cmd = 'GetModifyData';//com.agilecontrol.fair.impl.balabala.GetModifyData
                         return $fairCmd.execute(
                             cmd, {
                                 pagenum: 1,
                                 searchName: ""
                             }).then(function (data) {
                                 return data.result.data.length;
                             });

                 }],
                    //在数据加载到页面之前获取数据总量（默认取第一页的第一条的第八个字段），注意resolve不能用$scope,因为页面还没有加载进来
                     aboutAllPage:['$fairCmd',function ($fairCmd) {
                         var cmd = 'GetModifyData';//com.agilecontrol.fair.impl.balabala.GetModifyData
                         return $fairCmd.execute(
                             cmd, {
                                 pagenum: 1,
                                 searchName: ""
                             }).then(function(data){
                         return data.result.data[0][8];
                     });
                 }]
                 },
                templateUrl: 'tpl/mainPage.html',
                controller: 'MyCtrl'
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
        function ($ionicPlatform) {
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
    .controller('MyCtrl', [
        '$scope', '$location', '$fairCmd','printOrder','aboutPage','aboutAllPage',
        function ($scope, $location, $fairCmd, printOrder,aboutPage,aboutAllPage) {

            var cmd = 'GetModifyData';//com.agilecontrol.fair.impl.balabala.GetModifyData

            //显示第一页
            $fairCmd.execute(
                cmd, {
                    pagenum: 1,
                    searchName: $scope.forSearch //刚进来，搜索条件为空或找不到
                }).then(function (data) {
                    $scope.storeDate = data.result.data;
                    for (var i = 0; i < $scope.storeDate.length; i++) {
                        if ($scope.storeDate[i][7] == -1) { //未下单
                            var aa = "aa_" + i;
                            $scope[aa] = {
                                "fontColorPZ": {
                                    "color": "gray"
                                },
                                "fontColorBH": {
                                    "color": "gray"
                                },
                                "fontColorFTJ": {
                                    "color": "gray"
                                },
                                "fontColorDY": {
                                    "color": "gray"
                                }
                            };
                            var bb = "bb_" + i;
                            $scope[bb] = {
                                "fontColorPZ": {
                                    "disabled": true
                                },
                                "fontColorBH": {
                                    "disabled": true
                                },
                                "fontColorFTJ": {
                                    "disabled": true
                                },
                                "fontColorDY": {
                                    "disabled": true
                                }
                            };
                        } else if ($scope.storeDate[i][7] == 1) { //未提交
                            var aa = "aa_" + i;
                            $scope[aa] = {
                                "fontColorPZ": {
                                    "color": "gray"
                                },
                                "fontColorBH": {
                                    "color": "gray"
                                },
                                "fontColorFTJ": {
                                    "color": "gray"
                                },
                                "fontColorDY": {
                                    "color": "gray"
                                }
                            };
                            var bb = "bb_" + i;
                            $scope[bb] = {
                                "fontColorPZ": {
                                    "disabled": true
                                },
                                "fontColorBH": {
                                    "disabled": true
                                },
                                "fontColorFTJ": {
                                    "disabled": true
                                },
                                "fontColorDY": {
                                    "disabled": true
                                }
                            };
                        } else if ($scope.storeDate[i][7] == 3) {//待审批
                            var aa = "aa_" + i;
                            $scope[aa] = {
                                "fontColorFTJ": {
                                    "color": "gray"
                                },
                                "fontColorDY": {
                                    "color": "gray"
                                }
                            };
                            var bb = "bb_" + i;
                            $scope[bb] = {
                                "fontColorFTJ": {
                                    "disabled": true
                                },
                                "fontColorDY": {
                                    "disabled": true
                                }
                            };
                        } else if ($scope.storeDate[i][7] == 2) {//已审批
                            var aa = "aa_" + i;
                            var bb = "bb_" + i;
                            //$scope.storeDate[i][9] 为1 就不可以打印，并且 主管登录：1级汇总和2级汇总 1级汇总登录：外加1级分单也不可以打印 2级汇总登录：汇总不可打印
                            if($scope.storeDate[i][9] == 1 && ($scope.storeDate[i][1].length == 5 || $scope.storeDate[i][1].length==10 || $scope.storeDate[i][1].length==7)){
                                $scope[aa] = {
                                    "fontColorPZ": {
                                        "color": "gray"
                                    },
                                    "fontColorBH": {
                                        "color": "gray"
                                    },
                                    "fontColorDY": {
                                        "color": "gray"
                                    }
                                };

                                $scope[bb] = {
                                    "fontColorPZ": {
                                        "disabled": true
                                    },
                                    "fontColorBH": {
                                        "disabled": true
                                    },
                                    "fontColorDY": {
                                        "disabled": true
                                    }
                                };
                            }else{
                                $scope[aa] = {
                                    "fontColorPZ": {
                                        "color": "gray"
                                    },
                                    "fontColorBH": {
                                        "color": "gray"
                                    }
                                };

                                $scope[bb] = {
                                    "fontColorPZ": {
                                        "disabled": true
                                    },
                                    "fontColorBH": {
                                        "disabled": true
                                    }
                                };
                            }
                        }else if ($scope.storeDate[i][7] == 5) {//已打印
                            var aa = "aa_" + i;
                            var bb = "bb_" + i;
                            //$scope.storeDate[i][9] 为1 就不可以打印，并且 主管登录：1级汇总和2级汇总 1级汇总登录：外加1级分单也不可以打印 2级汇总登录：汇总不可打印
                            if($scope.storeDate[i][9] == 1 && ($scope.storeDate[i][1].length == 5 || $scope.storeDate[i][1].length==10 || $scope.storeDate[i][1].length==7)){
                                $scope[aa] = {
                                    "fontColorPZ": {
                                        "color": "gray"
                                    },
                                    "fontColorBH": {
                                        "color": "gray"
                                    },
                                    "fontColorDY": {
                                        "color": "gray"
                                    }
                                };

                                $scope[bb] = {
                                    "fontColorPZ": {
                                        "disabled": true
                                    },
                                    "fontColorBH": {
                                        "disabled": true
                                    },
                                    "fontColorDY": {
                                        "disabled": true
                                    }
                                };
                            }else{
                                $scope[aa] = {
                                    "fontColorPZ": {
                                        "color": "gray"
                                    },
                                    "fontColorBH": {
                                        "color": "gray"
                                    }
                                };

                                $scope[bb] = {
                                    "fontColorPZ": {
                                        "disabled": true
                                    },
                                    "fontColorBH": {
                                        "disabled": true
                                    }
                                };
                            }
                        }
                    }
                });

            //把forSelect 包了一层，防止作用域混乱，找不到
            $scope.select={};

            //显示3种过滤后的第一页
            $scope.search = function () {
                $fairCmd.execute(
                    cmd, {
                        pagenum: 1,
                        searchName: $scope.forSearch, //点击搜索时，有条件
                        selectName: $scope.select.forSelect, //点击下拉时
                        selectName2: $scope.select.forSelect2 //点击下拉审核打印时
                    }).then(function (data) {
                        if(data.result.data.length == 0){
                            $scope.paginationConf.totalItems =  0;
                            $scope.storeDate = [];//查不到，清空数据
                            angular.element(".checkAllDisplay").css("display","none");//查不到，取消全选
                        }else{
                            angular.element(".checkAllDisplay").css("display","block");
                            $scope.storeDate = data.result.data;
                            $scope.paginationConf.totalItems =  $scope.storeDate[0][8];
                            for (var i = 0; i < $scope.storeDate.length; i++) {
                                if ($scope.storeDate[i][7] == -1) { //未下单
                                    var aa = "aa_" + i;
                                    $scope[aa] = {
                                        "fontColorPZ": {
                                            "color": "gray"
                                        },
                                        "fontColorBH": {
                                            "color": "gray"
                                        },
                                        "fontColorFTJ": {
                                            "color": "gray"
                                        },
                                        "fontColorDY": {
                                            "color": "gray"
                                        }
                                    };
                                    var bb = "bb_" + i;
                                    $scope[bb] = {
                                        "fontColorPZ": {
                                            "disabled": true
                                        },
                                        "fontColorBH": {
                                            "disabled": true
                                        },
                                        "fontColorFTJ": {
                                            "disabled": true
                                        },
                                        "fontColorDY": {
                                            "disabled": true
                                        }
                                    };
                                } else if ($scope.storeDate[i][7] == 1) { //未提交
                                    var aa = "aa_" + i;
                                    $scope[aa] = {
                                        "fontColorPZ": {
                                            "color": "gray"
                                        },
                                        "fontColorBH": {
                                            "color": "gray"
                                        },
                                        "fontColorFTJ": {
                                            "color": "gray"
                                        },
                                        "fontColorDY": {
                                            "color": "gray"
                                        }
                                    };
                                    var bb = "bb_" + i;
                                    $scope[bb] = {
                                        "fontColorPZ": {
                                            "disabled": true
                                        },
                                        "fontColorBH": {
                                            "disabled": true
                                        },
                                        "fontColorFTJ": {
                                            "disabled": true
                                        },
                                        "fontColorDY": {
                                            "disabled": true
                                        }
                                    };
                                } else if ($scope.storeDate[i][7] == 3) {//待审批
                                    var aa = "aa_" + i;
                                    $scope[aa] = {
                                        "fontColorFTJ": {
                                            "color": "gray"
                                        },
                                        "fontColorDY": {
                                            "color": "gray"
                                        }
                                    };
                                    var bb = "bb_" + i;
                                    $scope[bb] = {
                                        "fontColorFTJ": {
                                            "disabled": true
                                        },
                                        "fontColorDY": {
                                            "disabled": true
                                        }
                                    };
                                } else if ($scope.storeDate[i][7] == 2) {//已审批
                                    var aa = "aa_" + i;
                                    var bb = "bb_" + i;
                                    //$scope.storeDate[i][9] 为1 就不可以打印，并且 主管登录：1级汇总和2级汇总 1级汇总登录：外加1级分单也不可以打印 2级汇总登录：汇总不可打印
                                    if($scope.storeDate[i][9] == 1 && ($scope.storeDate[i][1].length == 5 || $scope.storeDate[i][1].length==10 || $scope.storeDate[i][1].length==7)){
                                        $scope[aa] = {
                                            "fontColorPZ": {
                                                "color": "gray"
                                            },
                                            "fontColorBH": {
                                                "color": "gray"
                                            },
                                            "fontColorDY": {
                                                "color": "gray"
                                            }
                                        };

                                        $scope[bb] = {
                                            "fontColorPZ": {
                                                "disabled": true
                                            },
                                            "fontColorBH": {
                                                "disabled": true
                                            },
                                            "fontColorDY": {
                                                "disabled": true
                                            }
                                        };
                                    }else{
                                        $scope[aa] = {
                                            "fontColorPZ": {
                                                "color": "gray"
                                            },
                                            "fontColorBH": {
                                                "color": "gray"
                                            }
                                        };

                                        $scope[bb] = {
                                            "fontColorPZ": {
                                                "disabled": true
                                            },
                                            "fontColorBH": {
                                                "disabled": true
                                            }
                                        };
                                    }
                                }else if ($scope.storeDate[i][7] == 5) {//已打印
                                    var aa = "aa_" + i;
                                    var bb = "bb_" + i;
                                    //$scope.storeDate[i][9] 为1 就不可以打印，并且 主管登录：1级汇总和2级汇总 1级汇总登录：外加1级分单也不可以打印 2级汇总登录：汇总不可打印
                                    if($scope.storeDate[i][9] == 1 && ($scope.storeDate[i][1].length == 5 || $scope.storeDate[i][1].length==10 || $scope.storeDate[i][1].length==7)){
                                        $scope[aa] = {
                                            "fontColorPZ": {
                                                "color": "gray"
                                            },
                                            "fontColorBH": {
                                                "color": "gray"
                                            },
                                            "fontColorDY": {
                                                "color": "gray"
                                            }
                                        };

                                        $scope[bb] = {
                                            "fontColorPZ": {
                                                "disabled": true
                                            },
                                            "fontColorBH": {
                                                "disabled": true
                                            },
                                            "fontColorDY": {
                                                "disabled": true
                                            }
                                        };
                                    }else{
                                        $scope[aa] = {
                                            "fontColorPZ": {
                                                "color": "gray"
                                            },
                                            "fontColorBH": {
                                                "color": "gray"
                                            }
                                        };

                                        $scope[bb] = {
                                            "fontColorPZ": {
                                                "disabled": true
                                            },
                                            "fontColorBH": {
                                                "disabled": true
                                            }
                                        };
                                    }
                                }

                            }
                        }
                    });
            };


            //定义全选壳
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
                if ($scope.selectedStoreOrdersobj.length == $scope.storeDate.length) {
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
                if ($scope.selectedStoreOrdersobj.length == $scope.storeDate.length) {
                    //if toggle to all，clear selectedStoreOrdersobj
                    $scope.selectedStoreOrdersobj = [];
                    //取消所有单选
                    for(var i=0; i< $scope.storeDate.length; i++){
                        $scope.storeDate[i].checked = false;
                    }
                }
                else{
                    $scope.selectedStoreOrdersobj = [];
                    //if toggle not to all，clear selectedStoreOrdersobj and put all into selectedStoreOrdersobj
                    for(var i=0; i< $scope.storeDate.length; i++){
                        $scope.selectedStoreOrdersobj.push($scope.storeDate[i]);
                        //选中所有单选
                        $scope.storeDate[i].checked = true;
                    }
                }
                /*console.info("全选后壳里数据：",$scope.selectedStoreOrdersobj);*/
            };

            //put checked to orderIds


            //acceptBatch
            $scope.acceptBatch = function () {
                var orderIds = [];
                if($scope.selectedStoreOrdersobj.length == 0 || $scope.selectedStoreOrdersobj.length == 1){
                    alert("不满足批量操作条件，请至少选择两种符合条件的买手");
                }else{
                    for (var i = 0; i < $scope.selectedStoreOrdersobj.length; i++) {
                        if($scope.selectedStoreOrdersobj[i][7] != 3){//待审批
                            alert("请注意,批量中包含不符合批准条件的买手！");
                            $scope.o=o;//就是让他 报错，从而不向下执行 相当于java的throw new NDSException
                        }
                        orderIds.push($scope.selectedStoreOrdersobj[i][0]);//第0个元素表示订单id
                    }
                    alert("批量批准审核中，请稍后");
                    //post data to java
                    var cmd = 'AuditFairOrder';//com.agilecontrol.fair.impl.balabala.AuditFairOrder
                    $fairCmd.execute(cmd, {
                        action: "accept",
                        comments: "",
                        orderIds: orderIds
                    }).then(
                        function successCallback(obj) {
                            alert("批量操作成功");
                            window.location.reload();
                        },
                        function errorCallback(obj) {
                            alert(JSON.stringify(obj.message));
                        });
                }
            };
            //rejectBatch
            $scope.rejectBatch = function () {
                var orderIds = [];
                if($scope.selectedStoreOrdersobj.length == 0 || $scope.selectedStoreOrdersobj.length == 1){
                    alert("不满足批量操作条件，请至少选择两种符合条件的买手");
                }else{
                    for (var i = 0; i < $scope.selectedStoreOrdersobj.length; i++) {
                        if($scope.selectedStoreOrdersobj[i][7] != 3){//待审批
                            alert("请注意,批量中包含不符合驳回条件的买手！");
                            $scope.o=o;//就是让他 报错，从而不向下执行 相当于java的throw new NDSException
                        }
                        orderIds.push($scope.selectedStoreOrdersobj[i][0]);//第0个元素表示订单id
                    }
                    alert("批量驳回审核中，请稍后");
                    //post data to java
                    var cmd = 'AuditFairOrder';//com.agilecontrol.fair.impl.balabala.AuditFairOrder
                    $fairCmd.execute(cmd, {
                        action: "reject",
                        comments: "",
                        orderIds: orderIds
                    }).then(
                        function successCallback(obj) {
                            alert("批量操作成功");
                            window.location.reload();
                        },
                        function errorCallback(obj) {
                            alert(JSON.stringify(obj.message));
                        });

                }
            };
            //unSubmitBatch
            $scope.unSubmitBatch = function () {
                var orderIds = [];
                if($scope.selectedStoreOrdersobj.length == 0 || $scope.selectedStoreOrdersobj.length == 1){
                    alert("不满足批量操作条件，请至少选择两种符合条件的买手");
                }else{
                    for (var i = 0; i < $scope.selectedStoreOrdersobj.length; i++) {
                        if($scope.selectedStoreOrdersobj[i][7] != 2 && $scope.selectedStoreOrdersobj[i][7] != 5){//已审批和已打印
                            alert("请注意,批量中包含不符合反提交条件的买手！");
                            $scope.o=o;//就是让他 报错，从而不向下执行 相当于java的throw new NDSException
                        }
                        orderIds.push($scope.selectedStoreOrdersobj[i][0]);//第0个元素表示订单id
                    }
                    alert("批量反提交审核中，请稍后");
                    //post data to java
                    var cmd = 'UnSubmitFairOrder';//com.agilecontrol.fair.impl.balabala.UnSubmitFairOrder
                    $fairCmd.execute(cmd, {
                        orderIds: orderIds
                    }).then(
                        function successCallback(obj) {
                            alert("批量操作成功");
                            window.location.reload();
                        },
                        function errorCallback(obj) {
                            alert(JSON.stringify(obj.message));
                        });
                }
            };


            //accept
            $scope.accept = function (sD) {

                var orderId = [];
                orderId.push(sD[0]);
                //post data to java
                var cmd = 'AuditFairOrder';//com.agilecontrol.fair.impl.balabala.AuditFairOrder
                $fairCmd.execute(cmd, {
                    action: "accept",
                    comments: "",
                    orderIds: orderId
                }).then(
                    function successCallback(obj) {
                        alert(JSON.stringify(obj.message));
                        window.location.reload();
                    },
                    function errorCallback(obj) {
                        alert(JSON.stringify(obj.message));
                    });

            };
            //reject
            $scope.reject = function (sD) {
                var orderId = [];
                orderId.push(sD[0]);
                //post data to java
                var cmd = 'AuditFairOrder';//com.agilecontrol.fair.impl.balabala.AuditFairOrder
                $fairCmd.execute(cmd, {
                    action: "reject",
                    comments: "",
                    orderIds: orderId
                }).then(
                    function successCallback(obj) {
                        alert(JSON.stringify(obj.message));
                        window.location.reload();
                    },
                    function errorCallback(obj) {
                        alert(JSON.stringify(obj.message));
                    });
            };
            //unSubmit
            $scope.unSubmit = function (sD) {
                var orderId = [];
                orderId.push(sD[0]);
                //post data to java
                var cmd = 'UnSubmitFairOrder';//com.agilecontrol.fair.impl.balabala.UnSubmitFairOrder
                $fairCmd.execute(cmd, {
                    orderIds: orderId
                }).then(
                    function successCallback(obj) {
                        alert(JSON.stringify(obj.message));
                        window.location.reload();
                    },
                    function errorCallback(obj) {
                        alert(JSON.stringify(obj.message));
                    });

            };
            //printOrder
            $scope.printOrder = function (sD) {

                 var objId = sD[0];
                 var objStatus = sD[7];

                var promise = printOrder.getModal($scope,objId,objStatus);
                promise.then(
                    function successCallback() {
                    },
                    function errorCallback() {
                    }
                );
            };
            /**
             * 高亮
             */
            $scope.changColor = function (obj) {
                angular.element(".default").css("background-color", "rgb(255,255,255)");
                angular.element(".click_" + obj).css("background-color", "rgb(255,255,102)");
            };

            /**
             * 将参数保存在url中，并且进行跳转
             */
            var paramsToURL = function () {
                //执行换页操作的时候，取消全选框，并清空数据
                $scope.defineScope.checkAll = false;
                $scope.selectedStoreOrdersobj = [];

                var pagenum = $scope.paginationConf.currentPage;
                /*$state.go("list",{"pagenum":pagenum});*/
                /**
                 * 执行$runSQL的query方法访问ad_sql请求数据
                 */
                $fairCmd.execute(
                    cmd, {
                        pagenum: pagenum,
                        searchName: $scope.forSearch, //点击分页时，有条件则传，无条件传空
                        selectName: $scope.select.forSelect,
                        selectName2: $scope.select.forSelect2
                    }).then(function (data) {
                        $scope.storeDate = data.result.data;
                        for (var i = 0; i < $scope.storeDate.length; i++) {
                            if ($scope.storeDate[i][7] == -1) { //未下单
                                var aa = "aa_" + i;
                                $scope[aa] = {
                                    "fontColorPZ": {
                                        "color": "gray"
                                    },
                                    "fontColorBH": {
                                        "color": "gray"
                                    },
                                    "fontColorFTJ": {
                                        "color": "gray"
                                    },
                                    "fontColorDY": {
                                        "color": "gray"
                                    }
                                };
                                var bb = "bb_" + i;
                                $scope[bb] = {
                                    "fontColorPZ": {
                                        "disabled": true
                                    },
                                    "fontColorBH": {
                                        "disabled": true
                                    },
                                    "fontColorFTJ": {
                                        "disabled": true
                                    },
                                    "fontColorDY": {
                                        "disabled": true
                                    }
                                };
                            } else if ($scope.storeDate[i][7] == 1) { //未提交
                                var aa = "aa_" + i;
                                $scope[aa] = {
                                    "fontColorPZ": {
                                        "color": "gray"
                                    },
                                    "fontColorBH": {
                                        "color": "gray"
                                    },
                                    "fontColorFTJ": {
                                        "color": "gray"
                                    },
                                    "fontColorDY": {
                                        "color": "gray"
                                    }
                                };
                                var bb = "bb_" + i;
                                $scope[bb] = {
                                    "fontColorPZ": {
                                        "disabled": true
                                    },
                                    "fontColorBH": {
                                        "disabled": true
                                    },
                                    "fontColorFTJ": {
                                        "disabled": true
                                    },
                                    "fontColorDY": {
                                        "disabled": true
                                    }
                                };
                            } else if ($scope.storeDate[i][7] == 3) {//待审批
                                var aa = "aa_" + i;
                                $scope[aa] = {
                                    "fontColorFTJ": {
                                        "color": "gray"
                                    },
                                    "fontColorDY": {
                                        "color": "gray"
                                    }
                                };
                                var bb = "bb_" + i;
                                $scope[bb] = {
                                    "fontColorFTJ": {
                                        "disabled": true
                                    },
                                    "fontColorDY": {
                                        "disabled": true
                                    }
                                };
                            } else if ($scope.storeDate[i][7] == 2) {//已审批
                                var aa = "aa_" + i;
                                var bb = "bb_" + i;
                                //$scope.storeDate[i][9] 为1 就不可以打印，并且 主管登录：1级汇总和2级汇总 1级汇总登录：外加1级分单也不可以打印 2级汇总登录：汇总不可打印
                                if($scope.storeDate[i][9] == 1 && ($scope.storeDate[i][1].length == 5 || $scope.storeDate[i][1].length==10 || $scope.storeDate[i][1].length==7)){
                                    $scope[aa] = {
                                        "fontColorPZ": {
                                            "color": "gray"
                                        },
                                        "fontColorBH": {
                                            "color": "gray"
                                        },
                                        "fontColorDY": {
                                            "color": "gray"
                                        }
                                    };

                                    $scope[bb] = {
                                        "fontColorPZ": {
                                            "disabled": true
                                        },
                                        "fontColorBH": {
                                            "disabled": true
                                        },
                                        "fontColorDY": {
                                            "disabled": true
                                        }
                                    };
                                }else{
                                    $scope[aa] = {
                                        "fontColorPZ": {
                                            "color": "gray"
                                        },
                                        "fontColorBH": {
                                            "color": "gray"
                                        }
                                    };

                                    $scope[bb] = {
                                        "fontColorPZ": {
                                            "disabled": true
                                        },
                                        "fontColorBH": {
                                            "disabled": true
                                        }
                                    };
                                }
                            }else if ($scope.storeDate[i][7] == 5) {//已打印
                                var aa = "aa_" + i;
                                var bb = "bb_" + i;
                                //$scope.storeDate[i][9] 为1 就不可以打印，并且 主管登录：1级汇总和2级汇总 1级汇总登录：外加1级分单也不可以打印 2级汇总登录：汇总不可打印
                                if($scope.storeDate[i][9] == 1 && ($scope.storeDate[i][1].length == 5 || $scope.storeDate[i][1].length==10 || $scope.storeDate[i][1].length==7)){
                                    $scope[aa] = {
                                        "fontColorPZ": {
                                            "color": "gray"
                                        },
                                        "fontColorBH": {
                                            "color": "gray"
                                        },
                                        "fontColorDY": {
                                            "color": "gray"
                                        }
                                    };

                                    $scope[bb] = {
                                        "fontColorPZ": {
                                            "disabled": true
                                        },
                                        "fontColorBH": {
                                            "disabled": true
                                        },
                                        "fontColorDY": {
                                            "disabled": true
                                        }
                                    };
                                }else{
                                    $scope[aa] = {
                                        "fontColorPZ": {
                                            "color": "gray"
                                        },
                                        "fontColorBH": {
                                            "color": "gray"
                                        }
                                    };

                                    $scope[bb] = {
                                        "fontColorPZ": {
                                            "disabled": true
                                        },
                                        "fontColorBH": {
                                            "disabled": true
                                        }
                                    };
                                }
                            }
                        }
                    });
            };

            /**
             *页码标签初始化参数配置
             * @type {{pagenum: number, totalItems: *, itemsPerPage: *, pagesLength: number}}
             */
            $scope.paginationConf = {
                pagesLength: 5, /*显示几页*/
                currentPage: 1, /*定义当前页*/
                itemsPerPage: aboutPage, /*每页数据个数,用路由的resolve方法在页面加载之前取到数据*/
                totalItems: aboutAllPage/*数据总数,用路由的resolve方法在页面加载之前取到数据 aboutAllPage*/
            };

            /**
             * $emit  向上广播接收
             */
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
            });

        }])
    .service('printOrder', [
        '$q', '$ionicModal','$fairCmd','$runSQL','$interval',
        //弹出modal
        function ($q, $ionicModal,$fairCmd,$runSQL,$interval) {

            return {
                getModal: getModal
            };
            /*
             * inject $ionicModal
             * 'slide-in-up'
             */
            function getModal($scope,objId,objStatus) {
                var deferred = $q.defer();
                $scope.printOrderService = {};
                $scope.printOrderService.isPrint = false;
                $scope.printOrderService.isPrintButton = "开始打印";

                //show html in modal
                $ionicModal.fromTemplateUrl('tpl/printPage.html', {
                    scope: $scope,
                    animation: 'slide-in-up'
                }).then(
                    function (modal) {
                        $scope.printOrderService.modal = modal;

                        //选择打印模板：ad_sql#print_templates
                        $runSQL.getJSON('print_templates').then(function(data){
                            $scope.printTemplates = data;
                         });
                        //选择打印机：ad_sqlfind_printparam 读取 #ad_param#printers
                        $runSQL.query('find_printparam', []).then(function(data){
                            var splitArray = [];
                            var regex = /,/;
                            splitArray = data.data[0].split(regex);

                            $scope.findPrintparam  = splitArray;
                        });

                        modal.show();
                    });
                $scope.data = {};

                //print orders
                $scope.printOrderService.resolve = function () {
                    if($scope.data.printer == null || $scope.data.printer == ""){
                        alert("请选择一个打印机")
                    }else if($scope.data.templete == null || $scope.data.templete == ""){
                        alert("请选择一个打印模板")
                    }else{
                        alert("此次订货会是否全部完成，请确认后在打印。");

                        if($scope.printOrderService.isPrint == false) {

                            $scope.printOrderService.isPrint = true;//刚进来就让他不可点击
                                    $scope.time = 10;
                                    var timer = null;
                                    timer = $interval(function () {
                                        $scope.time = $scope.time - 1;
                                        $scope.printOrderService.isPrintButton = $scope.time + "秒重新打印";
                                        if ($scope.time === 0) {
                                            $scope.printOrderService.isPrintButton = "开始打印";
                                            $scope.printOrderService.isPrint = false;
                                            $interval.cancel(timer);
                                        }
                                    }, 1000);

                        }


                        var cmd = 'SemirPrintFairOrder';//com.agilecontrol.fair.impl.balabala.SemirPrintFairOrder
                        $fairCmd.execute(cmd, {
                            orderStatus:objStatus,
                            orderId : objId,
                            printer:$scope.data.printer,
                            templates:[$scope.data.templete],
                            "nds.control.ejb.UserTransaction":"N"
                        }).then(
                            function successCallback(obj) {
                                alert(JSON.stringify(obj.message));
                                window.location.reload();
                            },
                            function errorCallback(obj) {
                                alert(JSON.stringify(obj.message));
                            });
                    }
                };
                //cancel
                $scope.printOrderService.reject = function () {
                    $scope.printOrderService.modal.remove();
                    deferred.reject();
                };
                //return Obj
                return deferred.promise;
            }
        }
    ]);