var app = angular.module("myapp",['app']);

app.controller("myCtrl", function ($scope,$http,rest) {
    $scope.data=null;
    $scope.doWord=function(str){
    }
    $scope.fairid=0;
    $scope.getShowInfo = function () {
        rest.init(null, null, '/servlets/binserv/Fair');
        var trans = [
            {
                'id'     : 1,
                'command': "com.agilecontrol.fair.MiscCmd",
                'params' : {
                    cmd : "Crowdfund",
                    fairid : $scope.fairid
                }
            }
        ];
        rest.sendOneRequest(trans, function (response) {
            var data = response.data[0].result;
            if (data == null) {
                alert(response.data[0].message);
                return;
            } else {
                $scope.data = data;
            }
        });
    };
    $scope.getShowData = function (fairid) {
    	$scope.fairid=fairid;
        rest.init(null, null, '/servlets/binserv/Fair');
        var trans = [
            {
                'id'     : 1,
                'command': "com.agilecontrol.fair.MiscCmd",
                'params' : {
                    cmd : "Crowdfund",
                    fairid : fairid
                }
            }
        ];
        rest.sendOneRequest(trans, function (response) {
            var data = response.data[0].result;
            if (data == null) {
                alert(response.data[0].message);
                return;
            } else {
                $scope.data = data;
            }
        });
    };
    setInterval(function () {
       $scope.$apply($scope.getShowInfo);
    }, 60000);
});