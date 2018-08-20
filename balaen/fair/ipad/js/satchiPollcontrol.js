angular.module("satchi",["app"])
.controller("pollCtrl",['$scope','rest',function($scope,rest){
  // $scope.rows = [
  //     {firstlayer:'企划',secondlayer:'整体设计感',rate:'35%',score:'',note:'',isfirst:'Y',length:3},
  //     {firstlayer:'企划',secondlayer:'上火波段',rate:'35%',score:'',note:'',isfirst:'N'},
  //     {firstlayer:'企划',secondlayer:'价格段',rate:'65%',score:'',note:'',isfirst:'N'},
  //     {firstlayer:'正装类',secondlayer:'套西',rate:'34%',score:'',note:'',isfirst:'Y',length:3},
  //     {firstlayer:'正装类',secondlayer:'单西',rate:'23%',score:'',note:'',isfirst:'N'},
  //     {firstlayer:'正装类',secondlayer:'症状衬衫',rate:'12%',score:'',note:'',isfirst:'N'}
  // ];
  rest.init(null,null,'/servlets/binserv/Fair');
  $scope.load = function(){
    var trans={
      'id':1,
      'command':'com.agilecontrol.fair.FairCmd',
      'params':{
        cmd:'Poll',
        type:'get'
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
