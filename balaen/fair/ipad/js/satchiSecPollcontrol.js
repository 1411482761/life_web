/**
 * Created by wang.pengfei on 2017/2/8 0008.
 */
angular.module("satchisec",["app"])
    .controller("pollCtrlSec",['$scope','rest',function($scope,rest){
        rest.init(null,null,'/servlets/binserv/Fair');
        $scope.load = function(){
            var trans={
                'id':1,
                'command':'com.agilecontrol.fair.FairCmd',
                'params':{
                    cmd:'Poll',
                    type:'getSec'
                }
            };
            rest.sendOneRequest(trans,function(response){
                console.log(response);
                if(-1==response.data[0].code){
                    alert(response.data[0].message);
                    return;
                }

                $scope.rows=response.data[0].result.data;
            });

        };
        $scope.load();

        $scope.update = function(){
            var trans={
                'id':1,
                'command':'com.agilecontrol.fair.FairCmd',
                'params':{
                    cmd:'Poll',
                    type:'submit',
                    data:$scope.rows
                }
            };
            rest.sendOneRequest(trans,function(response){
                if(response.data[0].code==-1){
                    alert(response.data[0].message);
                    return;
                }
                else{
                    alert("提交成功");
                }
            });
        };
    }]);
