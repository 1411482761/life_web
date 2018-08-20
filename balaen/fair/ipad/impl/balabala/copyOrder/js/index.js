/**
 * Created by wang.pengfei on 11/23/2016.
 */

/*var a = prompt('将创建新订单，照搬当前订单和评分内容，请输入新订单对应买手名称');
if (a != null && a != '') {
    var evt = $H();
    evt.command = 'com.agilecontrol.fair.MiscCmd';//定位cmd
    evt.cmd = 'copyfo';//定位类
    evt.funit = a;//定位选中的买手
    evt.foid = $OBJECTID$;//当前订单id
    evt.parsejson = 'Y';
    evt.callbackEvent = 'SubmitObject';
    oc._executeCommandEvent(evt);
} else {
    alert('复制动作被取消!');
}*/

'use strict';
angular.module('copyOrder', [
])
    .constant('$config', {
        'app': {
            /**
             * App name
             */
            'name': 'Lifecycle Fair 2.0',
            /**
             * App version
             */
            'version': '1.0.0'
        },
        'portal': {
            /**
             * Portal address.
             * E.g.
             *     '';
             *     'http://192.168.100.18:10120';
             * No '/' at the end.
             */
            'address': '',
            /**
             * '/servlets/binserv/Rest'
             */
            'restPath': '/servlets/binserv/Rest',
            /**
             * '/servlets/binserv/Phone'
             */
            'b2bPath': '/servlets/binserv/B2B',

            /**
             * '/servlets/binserv/Fair'
             */
            'fairPath': '/servlets/binserv/Fair',
            /**
             * Qualified class name for MiscCmd
             */
            'miscCmd': 'com.agilecontrol.fair.MiscCmd',
            /**
             * Qualified class name for fairCmd
             */
            'fairCmd': 'com.agilecontrol.fair.FairCmd',
            /**
             *
             */
            'reportPath': '/b2b/report/index.html#/report'
        }

    })
    .factory('$portalClient', [
        '$rootScope',
        '$http',
        '$q',
        //about portal
        function($rootScope, $http, $q) {

            var sipMsgs = {
                "0000": "sipStatus.error",
                "9999": "sipStatus.success",
                "1001": "sipStatus.signatureInvalid",
                "1002": "sipStatus.reqTimeout",
                "1003": "sipStatus.binduserFaild",
                "1004": "sipStatus.needBinduser",
                "1005": "sipStatus.needAppKey",
                "1006": "sipStatus.needApiName",
                "1007": "sipStatus.needSign",
                "1008": "sipStatus.needTimeStamp",
                "1009": "sipStatus.authFaild",
                "1010": "sipStatus.noRightCallService",
                "1011": "sipStatus.service",
                "1012": "sipStatus.sessionid",
                "1013": "sipStatus.username"
            };

            return {
                /**
                 * 调用portal接口。
                 *
                 * 以promise返回，成功直接取到数据，失败则返回code和message；
                 * 如果调用时portal返回未登录，则尝试使用保存的credential自动登录；
                 * 如果自动登录失败或客户端没有credential，则返回未登录，调用者需要
                 * 做相应的登录操作。
                 *
                 * 示例：
                 * $portalClient.sendRequest(
                 *     '/servlets/binserv/Rest',
                 *     'GetObject',
                 *     {
                 *         'table': 'M_PRODUCT',
                 *         'id': 1
                 *     }
                 * ).then(
                 *     function successCallback(data) {...},
                 *     function errorCallback(error: {source, code, message}) {...}
                 * );
                 *
                 * @param url string, e.g. /servlets/binserv/Rest
                 * @param name string, Command实现类，例如GetObject、com.agilecontrol.b2b.MiscCmd
                 * @param params object, optional. e.g. {'table': 'M_PRODUCT', 'id': 1}
                 * @return promise
                 */
                sendRequest: sendRequest
            };

            function sendRequest(url, command, params) {
                var deferred = $q.defer();

                var trans = [{
                    id: 1,
                    command: command,
                    params: params
                }];

                var req = 'transactions=' + encodeURIComponent(
                        JSON.stringify(trans)
                    );

                $http.post(url, req, {
                    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
                    withCredentials: true
                }).then(
                    function successCallback(resp) {
                        var sipStatus = resp.headers('sip_status');
                        if (sipStatus === '9999') {
                            // SUCCESS
                            var data = resp.data[0] || null;
                            deferred.resolve(data);
                        } else {
                            // PORTAL RETURNS ERROR
                            var error = {
                                source: 'Portal',
                                code: sipStatus,
                                message: sipMsgs[sipStatus]
                            };
                            deferred.reject(error);
                            $rootScope.$emit('$serverFailure', error);
                            console.log('error: ' + JSON.stringify(error));
                            /*  $log.error('error: ' + JSON.stringify(error));*/

                            // The UI may redirect to login if sipStatus eq 1009
                            if (sipStatus === '1009' || sipStatus === '1005') {
                                $rootScope.$broadcast('$loginRequires');
                            }
                        }
                    },
                    function errorCallback(resp) {
                        // HTTP ERROR
                        var error = {
                            source: 'HTTP',
                            code: resp.status,
                            message: resp.statusText
                        };
                        deferred.reject(error);
                        $rootScope.$emit('$serverFailure', error);
                        console.log('error: ' + JSON.stringify(error));
                        /*$log.error('error: ' + JSON.stringify(error));*/
                    }
                );

                return deferred.promise;
            }
        }
    ])
    .factory('$miscCmd', [
        '$rootScope',
        '$config',
        '$portalClient',
        '$q',
        function($rootScope, $config, $client, $q) {

            var url = $config.portal.address + $config.portal.fairPath;
            var command = $config.portal.miscCmd;

            return {
                /**
                 * 执行portal plugin中定义的MiscCmd命令，即调用CmdHandler的实现类。
                 *
                 * 以promise返回，成功直接取到数据，失败则返回code和message；
                 * 如果调用时portal返回未登录，则尝试使用保存的credential自动登录，
                 * 然后再次尝试调用该命令，对于调用者而言则感觉是正常调用并返回结果；
                 * 如果自动登录失败或客户端没有credential，则返回未登录，调用者需要
                 * 做相应的登录操作。
                 *
                 * 示例：
                 * miscCmd.execute('GetQLC', {
                 *         'table':'M_PRODUCT'
                 *     },
                 * ).then(
                 *     function success(data) {...},
                 *     function error(code, message) {...}
                 * );
                 *
                 * @param name String, CmdHandler实现类，如果在cmd包中则直接写短类名，否则写全限定名
                 * @param params object, optional
                 * @return promise
                 */
                execute: execute
            };

            function execute(cmd, params) {
                var deferred = $q.defer();

                if (!params) params = {};
                params.cmd = cmd;


                $client.sendRequest(
                    url, command, params
                ).then(
                    function successCallback(data) {
                        /*
                         * 返回的data是这样的：{"message":"Complete","id":"1","result":{"token":"893:6FTsFo0lR-C01L_5K5Gqfw","redirect":""},"code":0}
                         * 这里做了约定，如果code为0（成功），并且result不为空，直接返回result；否则返回data。
                         */
                        if (data.code === 0) {
                            // SUCCESS
                            var ret = data.result || data;
                            deferred.resolve(ret);
                        } else {
                            // MISCCMD RETURN'S CODE IS NOT EQUALS 0
                            var error = {
                                source: 'MiscCmd',
                                code: data.code,
                                message: data.message
                            };
                            deferred.reject(error);
                            $rootScope.$emit('$serverFailure', error);
                            console.log('error: ' + JSON.stringify(error));
                            /* $log.error('error: ' + JSON.stringify(error));*/

                            // The UI may redirect to login if sipStatus eq 1009
                            if (data.code === 1009) {
                                $rootScope.$broadcast('$loginRequires');
                            }
                        }
                    },
                    function errorCallback(error) {
                        // PORTAL RETURNS ERROR
                        deferred.reject(error);
                    }
                );

                return deferred.promise;
            }
        }
    ])
    .factory('$runSQL', [
        '$miscCmd',
        '$q',
        '$rootScope',
        function($miscCmd, $q, $rootScope) {

            var cmd = 'com.agilecontrol.fair.cmd.RunSql';

            return {
                /**
                 * Executes SQL stored in sqSql
                 */
                query: query,
                /**
                 * Returns single value from adSql
                 */
                singleValue: queryOne,
                /**
                 * Returns json array or json object stored in adSql
                 */
                getJSON: getJSON,
                /**
                 * Returns the text stored in adSql
                 */
                getText: getText
            };

            /**
             * Executes SQL stored in sqSql
             * @param adSql
             * @param params sql params
             * @param asObjectRow optional, default is true
             * @returns promise
             */
            function query(adSql, params, asObjectRow) {
                return $miscCmd.execute(cmd, {
                    type: 'QUERY',
                    name: adSql,
                    parameter: params,
                    asObjectRow: asObjectRow === undefined ? true : asObjectRow
                });
            }

            /**
             * Returns single value from adSql
             * @param adSql
             * @param params
             * @returns promise {resolve: result present, reject: error or no result}
             */
            function queryOne(adSql, params) {
                var deferred = $q.defer();
                query(adSql, params, false).then(
                    function successCallback(data) {
                        if (data && data.length > 0) {
                            deferred.resolve(data[0]);
                        } else {
                            var error = {
                                source: 'runSQL',
                                code: -1,
                                message: 'No result'
                            };
                            deferred.reject(error);
                            $rootScope.$emit('$serverFailure', error);
                        }
                    },
                    function errorCallback(error) {
                        deferred.reject(error);
                    }
                );
                return deferred.promise;
            }

            /**
             * Returns json array or json object stored in adSql
             * @param adSql
             * @returns promise
             */
            function getJSON(adSql) {
                return $miscCmd.execute(cmd, {
                    type: 'JSON',
                    name: adSql
                });
            }

            /**
             * Returns the text stored in adSql
             * @param adSql
             * @returns promise
             */
            function getText(adSql) {
                return $miscCmd.execute(cmd, {
                    type: 'TEXT',
                    name: adSql
                });
            }
        }
    ])

    .controller('MyCtrl', [
        '$scope','$location','$miscCmd','$runSQL',
        function ($scope,$location,$miscCmd,$runSQL) {
            $scope.num = 1;
            var object = $location.search("foid").$$path;
            var foid = parseInt(object.replace(/[^0-9]+/g, ''));
            /**
             * 获取买手列表，若有定量，则不允许执行
             */
            var cmd = 'GetCopyBuyerData';//com.agilecontrol.fair.cmd.GetCopyBuyerData
            //显示第一页
            $miscCmd.execute(
                cmd, {
                    foid:foid,
                    searchFair: $scope.likeFair, //刚进来，搜索条件为空或找不到
                    searchCode: $scope.likeCode,
                    searchName: $scope.likeBuyer
                }).then(function (data) {
                    $scope.funitData = data.data;
                });
            /**
             * 搜索
             */
            $scope.searchFilter = function () {
                $miscCmd.execute(
                    cmd, {
                        foid:foid,
                        searchFair: $scope.likeFair, //刚进来，搜索条件为空或找不到
                        searchCode: $scope.likeCode,
                        searchName: $scope.likeBuyer
                    }).then(function (data) {
                        $scope.funitData = data.data;
                    });
                alert("搜索完成，点击下拉框显示搜索结果。")
            };
            /**
             * 提交
             */
            $scope.copyBegin = function (obj) {
                //get data
                var num = $scope.num;
                var funit = $scope.obj[2];

                /**
                 * 获取买手类型，如果是汇总买手就不能执行复制操作
                 */
                $runSQL.query('orderfair_getbuyertype', [["foid",foid]]).then(function (data) {
                    if(data.data == "SUM"){ //这是判断 如果是汇总买手的话
                       alert("汇总买手不允许复制订单！");
                   }else if(obj != 0){
                        alert("该买手已有订单，不允许复制！");
                    }else{
                       var password = prompt('请输入该买手密码');
                       if (password != null && password != '' && password == $scope.obj[1]) {
                           //post data to java
                           var cmd =  'Copyfo';//com.agilecontrol.fair.task.Copyfo
                           $miscCmd.execute(cmd,{
                               foid : foid,
                               num : num,
                               funit :funit
                           }).then(
                               function successCallback(obj) {
                                   alert("复制成功");
                                   //复制订单后 完整页面刷新
                                   /*window.location.reload();*/
                               },
                               function errorCallback(obj) {
                                   alert(JSON.stringify(obj.message));
                                   //alert("该分单已存在订单，请删除后进行复制。");

                               });
                       } else if(password == null || password == ''){
                           alert('密码不能为空，取消复制!');
                       }else if(password != $scope.obj[1]){
                           alert('密码错误!');
                       }
                   }
                });
            }
        }]);