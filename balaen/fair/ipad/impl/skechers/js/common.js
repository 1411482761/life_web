/*! Lifecycle-B2B - v1.0.0 - 2016-10-28
 * http://www.lifecycle.cn/
 * Copyright (c) 2016 Lifecycle co.,ltd.;
 */
'use strict';
/**
 * Created by ZhangBH on 7/24/2016.
 */
angular.module('lifecycle.common', [
    'lifecycle.common.component',
    'lifecycle.common.service',
    'lifecycle.common.util'
]);

/**
 * Created by ZhangBH on 7/24/2016.
 */
angular.module('lifecycle.common')
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

    });

/**
 * Created by ZhangBH on 7/28/2016.
 */
angular.module('lifecycle.common.component', []);

/**
 * Created by ZhangBH on 7/28/2016.
 */
angular.module('lifecycle.common.service', []);

/**
 * Created by ZhangBH on 7/28/2016.
 */
angular.module('lifecycle.common.util', []);

/**
 * Created by ZhangBH on 8/26/2016.
 */
angular.module('lifecycle.common.component')
    .factory('$msg', [
        '$q',
        '$window',
        //about message
        function($q, $window) {
            return {
                toast: toast,
                alert: alert,
                confirm: confirm,
                prompt: prompt
            };

            /**
             * $msg.toast('All finished');
             * @param message
             * @returns {promise}
             */
            function toast(message) {
                var deferred = $q.defer();
                $window.alert(message);
                deferred.resolve();
                return deferred.promise;
            }

            /**
             * $msg.alert('Take a rest now!');
             * @param message
             * @param buttonText, optional
             * @returns {promise}
             */
            function alert(message, buttonText) {
                var deferred = $q.defer();
                $window.alert(message);
                deferred.resolve();
                return deferred.promise;
            }

            /**
             * $msg.confirm('Do you wanna go eating?').then(
             *     function yes() {...},
             *     function no() {...}
             * );
             * @param message
             * @param buttonYesText, optional
             * @param buttonNoText, optional
             * @returns {promise}
             */
            function confirm(message, buttonYesText, buttonNoText) {
                var defer = $q.defer();
                // The native confirm will return a boolean.
                if ( $window.confirm( message ) ) {
                    defer.resolve( true );
                } else {
                    defer.reject( false );
                }
                return defer.promise;
            }

            /**
             * $msg.prompt("What's your name?").then(
             *     function done(text) {...},
             *     function cancel() {...}
             * );
             * @param message
             * @param defaultValue, optional
             * @param placeholder, optional
             * @param buttonDoneText, optional
             * @param buttonCancelText, optional
             * @returns {promise}
             */
            function prompt(message, defaultValue, placeholder, buttonDoneText, buttonCancelText) {
                var defer = $q.defer();
                // The native prompt will return null or a string.
                var response = $window.prompt( message, defaultValue );
                if ( response === null ) {
                    defer.reject();
                } else {
                    defer.resolve( response );
                }
                return defer.promise;
            }
        }
    ]);

/**
 * Created by ZJG on 2016/8/24.
 */
angular.module('lifecycle.common.component')
    .directive('pcPageNation',['$config',
        //about page
        function ($config) {
        var pageNationCtrl = function ($scope) {
            $scope.$watch('conf',function (values) {
                if(!values){
                    return
                }
                var conf = $scope.conf;
                var defaultPagesLength = 7;
                var defaultPerPage = 15;
                //获取分页长度
                if(conf.pagesLength){
                    //判断一下分页长度
                    conf.pagesLength = parseInt(conf.pagesLength, 10);
                    //分页长度必须为奇数， 如果传偶数时，自动处理
                    if(conf.pagesLength % 2 === 0){
                        conf.pagesLength += 1;
                    }
                }else{
                    conf.pagesLength = defaultPagesLength;
                }

                //pageList数组
                function getPagination(newValue, oldValue) {
                    //conf.currentPage
                    if(conf.currentPage){
                        conf.currentPage = parseInt($scope.conf.currentPage, 10);
                    }else{
                        conf.currentPage = 1;
                    }
                    //conf.totalItems
                    if(conf.totalItems){
                        conf.totalItems = parseInt(conf.totalItems, 10);
                    }else{
                        conf.totalItems = 0;
                        return;
                    }

                    //conf.itemsPages
                    if(conf.itemsPerPage){
                        conf.itemsPerPage = parseInt(conf.itemsPerPage, 10);
                    }else{
                        conf.itemsPerPage = defaultPerPage;
                    }

                    //numberOfPages
                    conf.numberOfPages = Math.ceil(conf.totalItems/conf.itemsPerPage);
                    //如果分页总数>0,并且当前页大于分页总数
                    if($scope.conf.numberOfPages > 0 && $scope.conf.currentPage > $scope.conf.numberOfPages){
                        $scope.conf.currentPage = $scope.conf.numberOfPages;
                    }

                    //页码相关
                    $scope.pageList = [];
                    if(conf.numberOfPages <= conf.pagesLength){
                        //判断总页数如果小于分页的长度，若小于则直接显示
                        for(var i = 1; i <= conf.numberOfPages; i++){
                            $scope.pageList.push(i);
                        }
                    }else {
                        //总页数大于分页长度
                        //分为三种情况:左边没有... 右边没有... 左右都有...
                        //计算中心偏移量
                        var offset = (conf.pagesLength - 1) / 2;
                        if(conf.currentPage <= offset){
                            //左边没有...
                            for(var i = 1; i <= offset + 1; i++){
                                $scope.pageList.push(i);
                            }
                            $scope.pageList.push('...');
                            $scope.pageList.push(conf.numberOfPages);
                        }else if(conf.currentPage > conf.numberOfPages - offset){
                            $scope.pageList.push(1);
                            $scope.pageList.push('...');
                            for(var i = offset + 1; i >= 1; i--){
                                $scope.pageList.push(conf.numberOfPages - i);
                            }
                            $scope.pageList.push(conf.numberOfPages);
                        }else{
                            //两边都有
                            $scope.pageList.push(1);
                            $scope.pageList.push('...');
                            for(var i = Math.ceil(offset/2); i >= 1; i--){
                                $scope.pageList.push(conf.currentPage - i);
                            }
                            $scope.pageList.push(conf.currentPage);
                            for(var i = 1; i <= offset/2; i++){
                                $scope.pageList.push(conf.currentPage + i);
                            }
                            $scope.pageList.push('...');
                            $scope.pageList.push(conf.numberOfPages);
                        }
                    }
                    //$scope.$parent.conf = conf;
                }

                /**
                 * 页面移到顶部
                 * ctreated by stao on  09/06/2016
                 */
                var emitMovetoTop = function () {
                    $scope.$emit('$viewContentLoaded', {});
                };

                //prevPage
                $scope.prevPage = function () {
                    if(conf.currentPage > 1){
                        conf.currentPage -= 1;
                    }
                    var obj = {'item':conf.currentPage};
                    $scope.$emit('prevPage:click',obj);
                    emitMovetoTop();
                };
                //nextPage
                $scope.nextPage = function () {
                    if(conf.currentPage < conf.numberOfPages){
                        conf.currentPage += 1;
                    }
                    var obj = {'item':conf.currentPage};
                    $scope.$emit('nextPage:click',obj);
                    emitMovetoTop();
                };
                //change currentPage
                $scope.changeCurrentPage = function (item) {
                    if(item == '...'){
                        return;
                    }else{
                        conf.currentPage = item;
                        getPagination();
                    }
                    var obj = {'item':item};
                    $scope.$emit('changeCurrentPage:click',obj);
                    emitMovetoTop();
                };

                $scope.$watch('conf.totalItems', function (value, oldValue) {
                    getPagination();
                });
            });

        };
        pageNationCtrl.$inject = ['$scope', '$config'];
        return {
            restrict: 'EA',
            template: '<div class="page-list">' +
            '<ul class="pagination" ng-show="conf.totalItems > 0">' +
            '<li ng-class="{disabled: conf.currentPage == 1}" ng-click="prevPage()"><span>&laquo;</span></li>' +
            '<li ng-repeat="item in pageList track by $index" ng-class="{active: item == conf.currentPage, separate: item == \'...\'}" ' +
            'ng-click="changeCurrentPage(item)">' +
            '<span>{{ item }}</span>' +
            '</li>' +
            '<li ng-class="{disabled: conf.currentPage == conf.numberOfPages}" ng-click="nextPage()"><span>&raquo;</span></li>' +
            '</ul>' +
            '<div class="page-total" ng-show="conf.totalItems > 0">' +
            '<div class="no-items" ng-show="conf.totalItems <= 0">暂无数据</div>' +
            '</div>',
            replace: true,
            scope: {
                conf: "="
            },
            controller: pageNationCtrl
        };
    }]);

/**
 * 调用plugin方法执行portal登录、登出、自动登录操作。
 *
 * Created by ZhangBH on 7/24/2016.
 */
angular.module('lifecycle.common.service')
    .factory('$auth', [
        '$miscCmd',
        '$q',
        '$translate',
        //login logout changepassword
        function($miscCmd, $q, $translate) {

            return {
                /**
                 * 系统登录
                 *
                 * 如果rememberMe，则客户端会记住用户credential
                 *
                 * 示例：
                 * auth.login('username', 'password', true).then(
                 *     function success(data) {...},
                 *     function error(error) {...}
                 * );
                 *
                 * @param username string 用户名
                 * @param password string 密码
                 * @return promise
                 */
                login: login,
                /**
                 * 系统登出
                 *
                 * @return promise
                 */
                logout: logout,
                /**
                 * 修改密码
                 */
                changePassword: changePassword
            };

            /**
             * Login
             * @param username
             * @param password
             * @returns promise
             */
            function login(username, password) {
                var deferred = $q.defer();

                if (!username || username === '') {
                    deferred.reject({
                        source: 'Client',
                        code: -2,
                        message: $translate.instant('auth.username-required')
                    });
                    return deferred.promise;

                } else if (!password || password === '') {
                    deferred.reject({
                        source: 'Client',
                        code: -3,
                        message: $translate.instant('auth.password-required')
                    });
                    return deferred.promise;

                } else {
                    return $miscCmd.execute('b2b.login', {
                        'username': username,
                        'password': password
                    });
                }
            }

            /**
             * Logout
             * @returns promise
             */
            function logout() {
                return $miscCmd.execute('b2b.logout');
            }

            /**
             * Change password
             * @param currentPassword
             * @param newPassword
             * @param confirmPassword
             * @returns promise
             */
            function changePassword(currentPassword, newPassword, confirmPassword) {
                var deferred = $q.defer();

                if (!currentPassword || currentPassword === '') {
                    deferred.reject({
                        source: 'Client',
                        code: -2,
                        message: $translate.instant('auth.orig-pwd-required')
                    });
                    return deferred.promise;

                } else if (!newPassword || newPassword === '') {
                    deferred.reject({
                        source: 'Client',
                        code: -3,
                        message: $translate.instant('auth.new-pwd-required')
                    });
                    return deferred.promise;

                } else if (!confirmPassword || confirmPassword === '') {
                    deferred.reject({
                        source: 'Client',
                        code: -4,
                        message: $translate.instant('auth.cfm-pwd-required')
                    });
                    return deferred.promise;

                } else if (currentPassword === newPassword) {
                    deferred.reject({
                        source: 'Client',
                        code: -5,
                        message: $translate.instant('auth.pwd-not-changed')
                    });
                    return deferred.promise;

                } else if (newPassword !== confirmPassword) {
                    deferred.reject({
                        source: 'Client',
                        code: -6,
                        message: $translate.instant('auth.cfm-pwd-failed')
                    });
                    return deferred.promise;

                } else {
                    return $miscCmd.execute('b2b.user.modifypassword', {
                        'oldpassword': currentPassword,
                        'newpassword': newPassword
                    });
                }
            }

        }
    ])

    .run(['$rootScope', '$state',
        function($rootScope, $state) {
            $rootScope.$on('$loginRequires', function() {
                $state.go('login');
            });
        }
    ]);

/**
 * Created by ZhangBH on 7/24/2016.
 */
angular.module('lifecycle.common.service')
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
    ]);

/**
 * Created by wang.pengfei on 10/31/2016.
 */
angular.module('lifecycle.common.service')
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
    ]);

/**
 * Created by ZhangBH on 7/24/2016.
 */
angular.module('lifecycle.common.service')
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
    ]);

/**
 * Created by ZhangBH on 7/24/2016.
 */
angular.module('lifecycle.common.service')
    .factory('$restCmd', [
        '$config',
        '$portalClient',
        '$q',
        '$log',
        '$translate',
        function($config, $client, $q, $log, $translate) {

            var url = $config.portal.address + $config.portal.restPath;

            return {
                /**
                 * 执行portal rest命令，例如：Query、GetObject、ObjectCreate等。
                 *
                 * 以promise返回，成功直接取到数据，失败则返回code和message；
                 * 如果调用时portal返回未登录，则尝试使用保存的credential自动登录；
                 * 如果自动登录失败或客户端没有credential，则返回未登录，调用者需要
                 * 做相应的登录操作。
                 *
                 * 示例：
                 * restCmd.execute(
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
                execute: execute
            };

            function execute(command, params) {
                var deferred = $q.defer();

                $client.sendRequest(
                    url, command, params
                ).then(
                    function successCallback(data) {
                        if (data.code === 0) {
                            // SUCCESS
                            deferred.resolve(data);
                        } else {
                            // REST RETURN'S CODE IS NOT EQUALS 0
                            var error = {
                                source: 'RestCmd',
                                code: data.code,
                                message: data.message
                            };
                            deferred.reject(error);
                            $rootScope.$emit('$serverFailure', error);
                            $log.error('error: ' + JSON.stringify(error));
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
    ]);

/**
 * Created by wang.pengfei on 11/4/2016.
 */
angular.module('lifecycle.common.service')
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
    ]);

/**
 * Created by ZhangBH on 8/11/2016.
 */
angular.module('lifecycle.common.service')
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
                    sqlType: 'JSON',
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
    ]);

/**
 * Created by ZhangBH on 8/25/2016.
 */
angular.module('lifecycle.common.service')
    .factory('$sys', [
        '$rootScope',
        '$translate',
        '$cookies',
        '$config',
        '$miscCmd',
        function($rootScope, $translate, $cookies, $config, $miscCmd) {

            return {
                /**
                 * @return promise, e.g. [
                 *     {code: "en", desc: "English"},
                 *     {code: "zh-Hans", desc: "��������"}
                 * ]
                 */
                getSupportedLanguages: getSupportedLanguages,
                /**
                 * @return string, language code, e.g. 'en'
                 */
                getCurrentLanguage: getCurrentLanguage,
                /**
                 * @param lang, language code
                 */
                changeLanguage: changeLanguage
            };

            function getSupportedLanguages() {
                return $miscCmd.execute('b2b.user.langlist');
            }

            function getCurrentLanguage() {
                if (!$rootScope.currentLanguage) {
                    $rootScope.currentLanguage =
                        $cookies.get('CURRENT_LANGUAGE') ||
                        $config.app.defaultLanguage ||
                        $config.app.preferredLanguage ||
                        $config.app.fallbackLanguage;
                }
                return $rootScope.currentLanguage;
            }

            function changeLanguage(lang) {
                $rootScope.currentLanguage = lang;
                $cookies.put('CURRENT_LANGUAGE', lang);
                $translate.use($translate.negotiateLocale(lang));
            }

        }
    ]);

/**
 * This improves window.localStorage. Using setObject
 * and getObject to operate object directly.
 * Created by ZhangBH on 3/18/2016.
 */
angular.module('lifecycle.common.util')
    .factory('$localStorage', ['$window',
        //about window
        function($window) {
        return {
            set: function(key, value) {
                $window.localStorage[key] = value;
            },
            get: function(key) {
                return $window.localStorage[key];
            },
            setObject: function(key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function(key) {
                return $window.localStorage[key] && JSON.parse($window.localStorage[key]);
            },
            remove: function(key) {
                $window.localStorage.removeItem(key);
            },
            clear: function() {
                $window.localStorage.clear();
            },
            lenght: $window.localStorage.length
        }
    }]);

/**
 * Created by ZhangBH on 8/14/2016.
 */
angular.module('lifecycle.common.util')
    .factory('$numberUtils', [
        //about number
        function() {

            return {
                numAdd: numAdd,
                numSub: numSub
            };

            /**
             * 加法运算，避免数据相加小数点后产生多位数和计算精度损失。
             * @param num1 加数1
             * @param num2 加数2
             * @returns {number}
             * stao
             * 8/12/2016.
             */
            function numAdd(num1, num2) {
                var baseNum, baseNum1, baseNum2;
                try {
                    baseNum1 = num1.toString().split(".")[1].length;
                } catch (e) {
                    baseNum1 = 0;
                }
                try {
                    baseNum2 = num2.toString().split(".")[1].length;
                } catch (e) {
                    baseNum2 = 0;
                }
                baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
                return (num1 * baseNum + num2 * baseNum) / baseNum;
            }

            /**
             * 减法运算，避免数据相减小数点后产生多位数和计算精度损失。
             *
             * @param num1被减数  |  num2减数
             */
            function numSub(num1, num2) {
                var baseNum, baseNum1, baseNum2;
                var precision;// 精度
                try {
                    baseNum1 = num1.toString().split(".")[1].length;
                } catch (e) {
                    baseNum1 = 0;
                }
                try {
                    baseNum2 = num2.toString().split(".")[1].length;
                } catch (e) {
                    baseNum2 = 0;
                }
                baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
                precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
                return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
            }
        }
    ]);

/**
 * Created by ZhangBH on 8/14/2016.
 */
angular.module('lifecycle.common.util')
    .factory('$valiUtils', [
        //about null
        function() {

            return {
                isNull: isNull
            };

            /**
             * 判断对象是否为空
             */
            function isNull(obj) {
                if( typeof(obj) == 'undefined' || obj == null || obj == ''){
                    return true;
                }
                return false;
            }
        }
    ]);
