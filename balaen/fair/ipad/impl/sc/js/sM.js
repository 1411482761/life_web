/**
 * Created by wang.pengfei on 2017/1/20 0020.
 */
'use strict';
var pdtinfoc;
angular.module('specialMCtrl', [
    'ionic',
    'ngCookies',
    'ionic-toast'
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
    .factory('$fairCmd', [
        '$rootScope',
        '$config',
        '$portalClient',
        '$q',
        function($rootScope, $config, $client, $q) {

            var url = $config.portal.address + $config.portal.fairPath;
            var command = $config.portal.fairCmd;
            return {
                /**
                 * 执行portal plugin中定义的FairCmd命令，即调用Task的实现类。
                 *
                 * 以promise返回，成功直接取到数据，失败则返回code和message；
                 * 如果调用时portal返回未登录，则尝试使用保存的credential自动登录，
                 * 然后再次尝试调用该命令，对于调用者而言则感觉是正常调用并返回结果；
                 * 如果自动登录失败或客户端没有credential，则返回未登录，调用者需要
                 * 做相应的登录操作。
                 *
                 * 示例：
                 * fairCmd.execute('GetQLC', {
                 *         'table':'M_PRODUCT'
                 *     },
                 * ).then(
                 *     function success(data) {...},
                 *     function error(code, message) {...}
                 * );
                 *
                 * @param name String, Task实现类，如果在cmd包中则直接写短类名，否则写全限定名
                 * @param params object, optional
                 * @return promise
                 */
                execute: execute,
                /**
                 * 执行
                 * ad_sql的update语句，不需要返回
                 */
                update: update

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
                            deferred.resolve(data);
                        } else {
                            // MISCCMD RETURN'S CODE IS NOT EQUALS 0
                            var error = {
                                source: 'FairCmd',
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


            /**
             * 执行
             * ad_sql的update语句，不需要返回
             */
            function update(cmd, params) {
                if (!params) params = {};
                params.cmd = cmd;
                $client.sendRequest(
                    url, command, params
                )
            }
        }
    ])

    .factory('$fairRunSQL', [
        '$fairCmd',
        '$q',
        '$rootScope',
        function($fairCmd, $q, $rootScope) {

            var cmd = 'FairRunSql';

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
                getText: getText,
                /**
                 * Update the b_funit in adSql
                 */
                updateFunit: updateFunit
            };

            /**
             * Executes SQL stored in sqSql
             * @param adSql
             * @param params sql params
             * @param asObjectRow optional, default is true
             * @returns promise
             */
            function query(adSql, params, asObjectRow) {
                return $fairCmd.execute(cmd, {
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
                                source: 'fairRunSQL',
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
                return $fairCmd.execute(cmd, {
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
                return $fairCmd.execute(cmd, {
                    type: 'TEXT',
                    name: adSql
                });
            }


            /**
             * Update the b_funit in adSql
             * @param adSql
             * @param params sql params
             * @param asObjectRow optional, default is true
             * @returns
             */
            function updateFunit(adSql,params, asObjectRow){
                $fairCmd.update(cmd,{
                    sqlType: 'UPDATE',
                    name: adSql,
                    parameter: params,
                    asObjectRow: asObjectRow === undefined ? true : asObjectRow
                })
            }
        }
    ])


    .controller('MySMCtrl', [
        '$scope','$location','$fairRunSQL','$fairCmd',
        function ($scope,$location,$fairRunSQL,$fairCmd) {

            var pdtid = document.getElementById("demo").innerHTML;
            /**
             * 取出相关信息 需要传参数：pdtid
             */
            $fairRunSQL.query('get_buyer_order', [["pdtid",pdtid]]).then(function (data) {
                $scope.yykh = data.result.data[0][0];
                $scope.bdsx = data.result.data[0][1];
                $scope.bdpm = data.result.data[0][7];
                $scope.zdhs = data.result.data[0][2];
                $scope.zdpm = data.result.data[0][8];
                $scope.dldh = data.result.data[0][3];
                $scope.dlxd = data.result.data[0][9];
                $scope.zydh = data.result.data[0][4];
                $scope.zyxd = data.result.data[0][10];
                $scope.tqxd = data.result.data[0][5];
                $scope.ylkf = data.result.data[0][11];
                $scope.xdlx = data.result.data[0][6];
                $scope.xdzs = data.result.data[0][12];
                $scope.bz = data.result.data[0][13];
            });

            /**
             * 保存
             */
            $scope.save = function(){
                //post data to java
                var cmd =  'SaveSpecialMatrix';//com.agilecontrol.fair.task.SaveSpecialMatrix
                $fairCmd.execute(cmd,{
                    pdtid: pdtid,
                    dlxd:$scope.dlxd,
                    zyxd:$scope.zyxd,
                    jlkf:$scope.ylkf,
                    bz:$scope.bz
                }).then(
                    function successCallback(obj) {
                        alert(JSON.stringify(obj.message));
                        location.reload();
                    },
                    function errorCallback(obj) {
                        alert(JSON.stringify(obj.message));
                    });
            };

        }]);

