/**
 * Created by LuChao on 2015/12/22.
 */
angular.module('DemoApp', ['app','angular-carousel'])
.factory('DemoFactory',function($q,$http,rest){
    return {
        getOptions:function(adSqlname,id,callback){
            rest.init(null,null,'/servlets/binserv/Fair');
            var trans = {
                'id': 1,
                'command': "com.agilecontrol.fair.MiscCmd",
                'params': {
                    cmd: "RunSQL",
                    name:adSqlname,
                    row_is_obj:true,
                    type:"QUERY",
                    var:{"fairid":id}
                }
            };
            rest.sendOneRequest(trans,function(response){
                var data=response.data[0].result;
                if(data==null){
                    alert(response.data[0].message);
                    return;
                }else{
                    callback(data);
                }
            });
        }
    };
})
.controller('DemoCtrl', function($scope,DemoFactory,$interval) {
        var param=window.location.search;
        var id=param.substr(param.indexOf("=")+1);
        DemoFactory.getOptions("get_pdt_rank",id,function(data){
            $scope.slides2 = data;
        });
        $interval(function() {
            DemoFactory.getOptions("get_pdt_rank",id,function(data){
                $scope.slides2 = data;
            });
            window.location.reload();
            }, 30*60*1000);
    });
