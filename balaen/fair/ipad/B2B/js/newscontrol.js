var news = angular.module('news',['app'],function($compileProvider) {
    // configure new 'compile' directive by passing a directive
    // factory function. The factory function injects the '$compile'
    $compileProvider.directive('compile', function($compile) {
      // directive factory creates a link function
      return function(scope, element, attrs) {
        scope.$watch(
          function(scope) {
             // watch the 'compile' expression for changes
            return scope.$eval(attrs.compile);
          },
          function(value) {
            // when the 'compile' expression changes
            // assign it into the current DOM
            element.html(value);
            // compile the new DOM and link it to the current
            // scope.
            // NOTE: we only compile .childNodes so that
            // we don't get into infinite loop compiling ourselves
            $compile(element.contents())(scope);
          }
        );
      };
    });
  });

news.controller('newsController',['params','newsServ','$scope','$compile',function(params,newsServ,$scope,$compile){
   $scope.isDetail=true;
   $scope.dynamicHtml=null;
   $scope.bread=new Array();
   $scope.bread[0]={'id':-1,'name':'首页','tier':-1};
   $scope.$watch('$viewContentLoaded', function() {  
            $scope.initCategory();  
        }); 
   //初始化目录树,多级目录结构
   //数组每个元素为目录中的一层，parent_id指示上级目录id,tier为当前目录层级，catelist为当前层中的所有目录
   //[ {'parent_id':1,'tier':2,catelist:[{'id':45,'name':'晨光新闻','issummary':'Y'},......,{}]},.........,{}]
   $scope.initCategory=function(){
    newsServ.initCategory(function(ret){
           if(ret.code==-1) {
              alert(ret.msg);
              return;
             }
             else if(ret.code==0){
                $scope.categories = ret.data;
                 //主页点击新闻直接进入新闻
                if(params.newsid!='null'&&params.newsid!=undefined){
                  $scope.getContentDetail(params.newsid);
                }
                else
                  $scope.toggleCategory(ret.data[0]);
               }  
             });
   
   };

   //显示新闻列表
   $scope.toggleCategory=function(row){
           newsServ.getContentList(row.id,function(ret){
           if(ret.code==-1) {
            alert(ret.msg);
            return;
           }
           else if(ret.code==0){
            var obj={'id':row.id,"name":row.name,'tier':0};
             $scope.isDetail=true;
             $scope.buildnav($scope.bread,obj);
             $scope.categoryName=ret.data.newscategory.name;
             $scope.newslist=ret.data.newslist;
           }

       }); 
    //叶子节点获取新闻列表
    if(row.issummary=='N'){     
    }
    //中间节点 展开
    else{
       
    }


   };
   //显示新闻详情
   $scope.getContentDetail=function(id){
         newsServ.getContentDetail(id,function(ret){
         if(ret.code==-1){
          alert(ret.msg);
          return;
         }
         else if(ret.code==0){
           $scope.isDetail=false;
           $scope.content_overall = ret.data.content_overall;
           $scope.content_body=$scope.content_overall.content;
           var obj={'id':$scope.content_overall.id,'name':$scope.content_overall.subject,"tier":999};
           $scope.buildnav($scope.bread,obj);
         }
     });

   };
   //横向目录快速跳转
   $scope.quickpath=function(row){
      if(row.tier==-1){
             window.location.replace("/fair/ipad/B2B/index.jsp?loadIdx="+params.loadIdx);     
       }
      else if(row.tier==0){
        $scope.toggleCategory(row);
      }
      else if(row.tier==999){
        $scope.getContentDetail(row.id);

      }
   }
   //构造横向导航树
   $scope.buildnav = function(bread,obj){  
        for(var i=bread.length-1;i>=0;i--){
          if(obj.tier<bread[i].tier){
            bread.pop();
          }
          else{
            if(obj.tier==bread[i].tier){
              bread.pop();
              bread.push(obj);
              break;
            }
            else {
             bread.push(obj);
             break;
            }

          }
        }
/*        for(var i in bread){
          if(bread[i].tier<obj.tier){
            bread.pop()
          }
        }
        console.log(pivlot);
        if(pivlot==-1) bread.push(obj);
        else {
          var cnt = bread.length-pivlot-1;
          for(var j=0;j<cnt+1;j++){
            bread.pop();
          }
           bread.push(obj);
        }*/
   }

}]);
news.service('newsServ',['rest',function(rest){
	rest.init(null,null,'/servlets/binserv/Fair');
	//初始化目录,树状结构
  //结构:[{'id':'1','name':'sss','issummary','Y','parent_id':'3'},........{}]
    this.initCategory=function(callback){
      var ret;
      var trans={
        'id':1,
        'command':'com.agilecontrol.fair.FairCmd',
        'params':{
          'cmd':'B2bNewsCtrl',
          'oper':'initCategory'
        }
      };
      rest.sendOneRequest(trans,function(response){
         if(response.data[0].code==-1){
              ret= {"code":-1,"msg":response.data[0].message};
              callback(ret);
              return;
          }
          if(response.data[0].result==null||response.data[0].result.length==0){
            ret= {"code":-1,"msg":"初始化目录失败，请维护新闻目录"};
            callback(ret);
            return;
          }
          ret={"code":0,"data":response.data[0].result.categories};
          callback(ret);
      });
    };
    //获取目录下的新闻列表 
	this.getContentList=function(id,callback){
	  var trans={
      	'id':1,
      	'command':'com.agilecontrol.fair.FairCmd',
      	'params':{
          'cmd':'B2bNewsCtrl',
      		'oper':'getContentList',
      		'categoryId':id
      	}
      };
      //返回格式:{
      //newscategory:{'name':'晨光新闻','id':''}
      //newslist:[{'subject':'','id':'',datatime:''},........{}]
      //}
      rest.sendOneRequest(trans,function(response){
             var ret;
             if(response.data[0].code==-1){
             	ret= {"code":-1, "msg":response.data[0].message};
              callback(ret);
              return;
             }
             if(response.data[0].result==null||response.data[0].result.newslist==undefined){
               ret={"code":0,'data':{'newscategory':{'name':'无新闻','newslist':[]}}};
               callback(ret);
               return;
             }
             ret = {"code":0,'data':response.data[0].result};
             callback(ret);
             
      });
	};
  //获取新闻详情
  //{content_header:'',content_body:'',content_time:'',content_author:''}
  this.getContentDetail=function(id,callback){
    var trans={
      'id':1,
      'command':'com.agilecontrol.fair.FairCmd',
      'params':{
        'cmd':'B2bNewsCtrl',
        'oper':'getContentDetail',
        'newsId':id
      }
    };
    rest.sendOneRequest(trans,function(response){
       var ret ;
        if(response.data[0].code==-1){
            ret =  {"code":-1,"msg":response.data[0].message};
            callback(ret);
            return;
          }
         ret = {"code":0,"data":response.data[0].result};
         callback(ret);
    });
  };

}]);
