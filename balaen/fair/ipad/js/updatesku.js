
var app = angular.module('app');
var o_data;
var d_Object;
var mycells;
//var default_value=new Object();
var myTable=new Array();
var values=new Object();
var input_rows_cols=new Array();
var table_id;
var sql='1=1';
var desc="";
var exp="";
var cindex=0;
var fairid;

app.controller('MyCtrl', function($scope,rest,$rootScope) {
	
	//test

	
	$scope.load = VIEWS_LOCALE.main.loading;
	$scope.sessionkey = "";
	$scope.pdtid = "";
	$scope.data = rest;
	$scope.loading=true;
    $scope.data.init(null,null,'/servlets/binserv/Fair');
    $scope.elem = {option:0};
    $rootScope.sql = sql;
    //getsheet切换页面
    $scope.toggle = function(index,type){
		$scope.loading=true;
		$scope.funcs=new Array();
		$scope.table=new Array();
		var trans = {'id': 1, 'command': 'com.agilecontrol.fair.FairCmd', 'params': {cmd: "GetSheet",pdtid:$scope.pdtid,type:type,sessionkey:$scope.sessionkey}};
		$scope.data.sendOneRequest(trans,function(response){
			var data=response.data[0].result;
			if(data==null){
				alert(response.data[0].message);
				return;
			}
			myTable=new Array();
			values=new Object();
			handleData(data);
			$scope.table=myTable;
			$scope.index=index;
			$scope.steps=o_data.steps;
			$scope.elem.option = index;
			$scope.funcs=o_data.funcs;
			$scope.type=o_data.steps[index].cmd;
			var saveobj={
					name:VIEWS_LOCALE.comment.saves,
					cmd:"SaveSheet"
			};
			$scope.funcs.push(saveobj);
			$scope.loading=false;
		});
		
	  };
	  //$scope.toggle(0,"");
	  //input输入框点击触发的事件
	  $scope.inputClick=function(currentLine,currentCol){
		  var or_row=0,or_col=0;
			changeItem(or_row,or_col,currentLine,currentCol);
			document.onkeydown=function(e){
				e=window.event||e;
				switch(e.keyCode){
				case 37: //左键
					currentCol--;
					changeItem(0,1,currentLine,currentCol);
					break;
				case 38: //向上键
					currentLine--;
					changeItem(1,0,currentLine,currentCol);
					break;
				case 39: //右键
					currentCol++;
					changeItem(0,-1,currentLine,currentCol);
					break;
				case 40: //向下键
					currentLine++;
					changeItem(-1,0,currentLine,currentCol);
					break;
				case 13: //enter键
					currentCol++;
					changeItem(0,-1,currentLine,currentCol);
					break;
				default:
					break;
				}  
			};
		};
		//右上角保存、清零按钮点击
		 $scope.buttonclick = function(cmd){
			 if(cmd=="SaveSheet"){
				 if($rootScope.readonly==true){
					 alert('对不起！您没有修改订单的权限');
					 return;
				 }
				 for(var key in values){
					 values[key]=myTable[values[key][0]][values[key][1]].v;
					 if(values[key]=="") values[key]=0;
				 }
				 var trans = {'id': 1, 'command': 'com.agilecontrol.fair.FairCmd', 'params': {cmd: "SaveSheet",pdtid:$scope.pdtid,values:values,type:$scope.type,sessionkey:$scope.sessionkey}};
				 $scope.data.sendOneRequest(trans,function(response){

					 var data=response.data[0].result;
					 if(data==null){
						 alert(response.data[0].message);
						 
					 }

						 $scope.toggle($scope.index,$scope.type);
						 $rootScope.load($rootScope.page,$rootScope.pageCnt,$rootScope.orderid,$rootScope.sessionkey,cindex,$rootScope.sql,desc);

				 });
			 }else if(cmd=="zero"){
				 for(var key in input_rows_cols){
					 $scope.table[input_rows_cols[key][0]][input_rows_cols[key][1]].v="";
				 }
				
			 }
			  };
});
/**
 * 过滤器单元格会调用Math的一些方法
 */
app.filter('myUpperFilter',function() {
	var titleCaseFilter = function(input,tem){
		 tem+="("+input+")";
		return eval(tem);
	};
	return titleCaseFilter;
});
/**
 * 过滤器格式化
 */
app.filter('formatFilter',function() {
	var format = function(input,formatter){
		input=formatNumber(input,formatter);
	    return input;
	};
	return format;
});
/**
 * 格式化数字
 * @param input
 * @param formatter
 * @returns
 */
function formatNumber(input,formatter){
	if (isNaN(input)){
        return "";
    }
    var zero = formatter.indexOf("!") !== -1;
    if (zero) {
        if (input==0) {
            return "-";
        };
    }
    var percent = formatter.indexOf("%") !== -1;
    if (percent) {
    	input = input * 100;
    }
    formatter = formatter.replace("!", "");
    formatter = formatter.replace("#", "");
    formatter = formatter.replace("%", "");
    var sp = formatter.split(".");
    if (sp.length === 2) {
        var sz = sp[1];
        input = input.toFixed(sz.length);
    }
    if (percent) {
    	input = input + "%";
    }
    return input;
}
/**
 * input输入框键盘操作向上下左右键切换dom元素
 * @param or_row
 * @param or_col
 * @param row
 * @param col
 */
function changeItem(or_row,or_col,row,col){
	
	var dom=jQuery("#mytable tr:eq("+row+") td:eq("+col+")");

	if(dom.has("input").size()>0){
		jQuery("#mytable tr td").removeClass("tdselected");
		jQuery("#mytable tr td").removeClass("borderright");
		jQuery("#mytable tr td").removeClass("borderbottom");
		dom.addClass("tdselected");
		jQuery("#mytable tr:eq("+row+") td:eq("+(col-1)+")").addClass("borderright");
		jQuery("#mytable tr:eq("+(row-1)+") td:eq("+col+")").addClass("borderbottom");
		jQuery("#mytable tr:eq("+row+") td:eq("+col+") input").focus();
	}else{
		jQuery("#mytable tr td").removeClass("tdselected");
		jQuery("#mytable tr td").removeClass("borderright");
		jQuery("#mytable tr td").removeClass("borderbottom");
		jQuery("#mytable tr:eq("+(or_row+row)+") td:eq("+(or_col+col)+") input").blur();
	};
}
/**
 * 服务器端返回的数据进行处理
 * @param data
 * @returns
 */
function handleData(data){
	this.o_data = data;
	var def = data.def;
	var cells = def.cells;
	var datas = new Object();
	var d_cells = new Object();
	for(var key in cells){  
		 var tkey = "c_"+key.replace(/:/g, '_');
	        var value = cells[key];//alert(value.t);
	        var type = value.t;
	        if (type =="i") {
	        	value.f = tkey;
	        	datas[tkey] = value;
	        	d_cells[tkey] = tkey;
	        }else if (type =="d") {
	        	value.f=tkey;
	        	datas[tkey]=value;
	        	d_cells[tkey]=tkey;
	        }else if (type=="f") {
	        	var cell_f=value.f;
	        	var regS1 = new RegExp("Math.[a-z]+\\(c\\([0-9]+\\,[0-9]+\\)\\)","g");
	        	var matchstr1=cell_f.match(regS1);
	        	if(cell_f.indexOf("stdev")>=0){
        			var regS = new RegExp("c\\([0-9]+\\,[0-9]+\\)","g");
	        		var matchstr=cell_f.match(regS);
	        		if(null!=matchstr){
	        			var str="";
	        			for(var i=0;i<matchstr.length;i++){
	        				str+=matchstr[i]+"*"+matchstr[i]+"+";
	        			};
	        			str="(("+str.substring(0, str.length-1)+")/"+matchstr.length+")| myUpperFilter:'Math.sqrt'";
	        			cell_f=str;
	        		}
        		}
	        		if(null!=matchstr1){
	        			for(var i=0;i<matchstr1.length;i++){
	        				var str=matchstr1[i].substring(0,matchstr1[i].indexOf("("));
	        				regS = new RegExp("Math.[a-z]+\\(","g");
	        				var tem=matchstr1[i];
	        				tem=tem.replace(regS,"(");
	        				regS = new RegExp("\\)\\)","g");
	        				tem=tem.replace(regS,")| myUpperFilter:'"+str+"')");
	        				cell_f=cell_f.replace(matchstr1[i], tem);
	        			};
	        		}
	        		cell_f=matchStr(cells,cell_f);
	        		var regS = new RegExp("c\\([0-9]+\\,[0-9]+\\)","g");
	        		var matchstr=cell_f.match(regS);
	        		if(null!=matchstr){
	        			for(var i=0;i<matchstr.length;i++){
	        				regS = new RegExp("c\\(","g");
	        				var tem=matchstr[i];
	        				tem=tem.replace(regS,"(table[");
	        				regS = new RegExp("\\,","g");
	        				tem=tem.replace(regS,"][");
	        				regS = new RegExp("\\)","g");
	        				tem=tem.replace(regS,"].v*1||0)");
	        				cell_f=cell_f.replace(matchstr[i], tem);
	        			};
	        		}
	        	value.f=cell_f;
	        	datas[tkey]=value;
	        	d_cells[tkey]=cell_f;
	        }else if (type=="s") {
	        	datas[tkey]=value;
	        	d_cells[tkey]=value.v;
	        }else if (type=="t") {
//	            self.cellType=MatrixSheetCellTypeText;
//	            self.textField.userInteractionEnabled=YES;
	        }else if (type=="c") {
	        	datas[tkey]=value;
	        	d_cells[tkey]=tkey;
	        }else if (type=="o") {
//	            self.cellType=MatrixSheetCellTypeOption;
//	            self.textField.userInteractionEnabled=YES;
	        }else{
	        	datas[tkey]=value;
	        	d_cells[tkey]=tkey;
	        };
	    }  
	d_Object=datas;
	mycells=d_cells;
	handlecell();
}
/**
 * 将cell里面的公式进行递归,最终都是以可编辑的单元格进行计算
 * @param data
 * @param cell_f
 * @returns
 */
function matchStr(data,cell_f){
	var regS = new RegExp("c\\([0-9]+\\,[0-9]+\\)","g");
	var matchstr=cell_f.match(regS);
	if(null!=matchstr){
		for(var i=0;i<matchstr.length;i++){
			var str=matchstr[i];
			var row=str.substring(2,str.indexOf(","));
			var col=str.substring(str.indexOf(",")+1,str.length-1);
			var tem=row+":"+col;
			if(data[tem]!=undefined&&data[tem].t=='f'){
				if(data[tem].f!="")
				return matchStr(data,cell_f.replace(str,"("+data[tem].f+")*1"));
				else
					return matchStr(data,cell_f.replace(str,"0*1"));
			}else if(data[tem]!=undefined&&data[tem].e!=undefined&&!data[tem].e){
				var key=data[tem].k;
				var value=0;
				if(this.o_data.values[key]!=undefined){
					value=this.o_data.values[key];
				}
				cell_f=cell_f.replace(str,value);
			}
		}
	}
	return cell_f;
}
/**
 * 对每个单元格进行处理
 */
function handlecell(){
	var def=this.o_data.def;
	var vaules=this.o_data.values;
	var cols=def.cols;
	var rows=def.rows;
	for(var i=0;i<rows;i++){
		var tr=new Array();
		for(var j=0;j<cols;j++){
			var tem="c_"+i+"_"+j;
			var td = new Object();
			var key_row_col=new Array();
			var input_row_col=new Array();
			if(d_Object[tem]!=undefined){
				if(d_Object[tem].e!=undefined&&!d_Object[tem].e&&d_Object[tem].t!="f"){
					var value=0;
					if(d_Object[tem].k!=undefined){
						var key=d_Object[tem].k;
						if(this.o_data.values[key]!=undefined)
						value=this.o_data.values[key];
						key_row_col.push(i);
						key_row_col.push(j);
						this.values[key]=key_row_col;
					}
					if(d_Object[tem].d!=undefined){
						value=formatNumber(value,d_Object[tem].d);
					}
					td["v"]=value;
					td["trindex"]=i;
					td["style"]="";
				}else{
					if(d_Object[tem].t=="s"){
						td["v"]=mycells[tem];
						td["trindex"]=i;
						td["style"]="";
					}else if(d_Object[tem].t=="d"){
						td["v"]="";
						if(d_Object[tem].k!=undefined){
							var key=d_Object[tem].k;
							key_row_col.push(i);
							key_row_col.push(j);
							this.values[key]=key_row_col;
							if(vaules[key]!=undefined)
								{
								if(vaules[key]==0) vaules[key]="";
								td["v"]=vaules[key];
								}
						}
						td["trindex"]=i;
						td["style"]="input";
						input_row_col.push(i);
						input_row_col.push(j);
						input_rows_cols.push(input_row_col);
					}else if(d_Object[tem].t=="f"){
						if(d_Object[tem].d!=undefined){
							td["v"]="("+(mycells[tem])+") | formatFilter:'"+d_Object[tem].d+"'";
							td["trindex"]=i;
							td["style"]="f";
							//console.log(tem+"++++++++++++++++++++++--------------"+"<td class='unedit_cell'>{{("+(mycells[tem])+") | formatFilter:'"+d_Object[tem].d+"'}}</td>");
						}else {
							td["v"]=(mycells[tem]);
							td["trindex"]=i;
							td["style"]="f";
						}
					}else if(d_Object[tem].t=="i"){
						td["v"]="";
						td["trindex"]=i;
						td["style"]="input";
						if(d_Object[tem].k!=undefined){
							var key=d_Object[tem].k;
							if(vaules[key]!=undefined)
							td["v"]=vaules[key];
							key_row_col.push(i);
							key_row_col.push(j);
							this.values[key]=key_row_col;
						}
						input_row_col.push(i);
						input_row_col.push(j);
						input_rows_cols.push(input_row_col);
					}else if(d_Object[tem].t=="c"){
						td["v"]=0;
						td["trindex"]=i;
						td["style"]="checkbox";
						if(d_Object[tem].k!=undefined){
							var key=d_Object[tem].k;
							if(vaules[key]!=undefined)
							td["v"]=vaules[key];
							key_row_col.push(i);
							key_row_col.push(j);
							this.values[key]=key_row_col;
						}
					}else{
						td["v"]="";
						td["trindex"]=i;
						td["style"]="";
					}
				}
			}else{
				td["v"]="";
				td["trindex"]=i;
				td["style"]="";
			}
			tr.push(td);
		}
		myTable.push(tr);
	}
}
//主列表控制器,嵌套在MyCtrl控制器中
//$scope:当前作用域，继承MyCtrl的作用域;rest:rest服务注入，内部封装了$http请求服务;$init：存储页面请求参数的服务;$rootScope：顶层作用域
//$rootScope中用于各个模块共享的数据有： orderid:订单编号,total:列表的总页数,page：当前页码数,pageCnt:每页显示条目数
app.controller('ListCtrl',function($scope,rest,init,$rootScope){
	$scope.req=rest;
	$rootScope.orderid=init.orderid;
	$rootScope.total=1;
	$rootScope.page=1;
	$rootScope.pageCnt=parseInt((window.screen.availHeight-350)/60);
	
	
	$scope.pdts={};
    $scope.req.init(null,null,'/servlets/binserv/Fair');
    $scope.pdtHtml="";
    $scope.imgHtml="";
    $scope.sql='1=1';
    $scope.desc="";
    $scope.index=cindex;
    //模拟登录方法定义, orderid：订单id
    $scope.login= function(orderid){
    	var trans = 
    		{
    			'id':1,
	            'command': 'com.agilecontrol.fair.MiscCmd',
    	        'params':{cmd:"GetSheetWeb",orderid:orderid}
    		};
    	$scope.req.sendOneRequest(trans,function(response){
    		var data = response.data[0].result;
    		$rootScope.sessionkey = data.sessionkey;
    		console.log(data.sessionkey);

    		table_id = data.table_id;
    		$rootScope.readonly = data.readonly;
    	    $rootScope.load($rootScope.page,$rootScope.pageCnt,$rootScope.orderid,$rootScope.sessionkey,0,$scope.sql,"");
    	    
    	});
    };
   
  //获取请求页数据方法定义 page：请求的页码序号，pageCnt：每页条目数,orderid：订单id,sessionkey:用于登录验证，index:当前页中选中的条目序号
    //此方法属于$rootScope作用域 用于模块间共享
    $rootScope.load= function(page,pageCnt,orderid,sessionkey,index,sql,desc){

    	$rootScope.index=index;
		var trans = 
		{'id': 1, 
	     'command': 'com.agilecontrol.fair.FairCmd',
	     'params': {cmd: "GetListWeb",page:page,pageCnt:pageCnt,orderid:orderid,sessionkey:sessionkey,sql:sql,desc:desc}};
		
		$scope.req.sendOneRequest(trans,function(response){
			var data = response.data[0].result;
			if(data==null)
				{
				   alert(response.data[0].message);
				   return;
				}
			$scope.allsku=data.allsku;
			$scope.allqty=data.allqty;
			$scope.allamt=data.allamt;
			$scope.pdts = data.pdt;	
			fairid = data.fairid;
			$rootScope.total = data.totalpage;
			$scope.orderhtml = data.orderhtml;
            $scope.handle($scope.pdts,index,$scope.orderhtml);

		});
    };
    
    //将获取的数据加载到页面 data：获取的数据,index：当前页选中的条目序号
    $scope.handle = function(data,index,order){
		$scope.pdtHtml = data[index].html;           
		$scope.imgHtml = "<img style='height:100%' src='/pdt/m/"+data[index].image+"'/>";
		

		jQuery('#pdt').html($scope.pdtHtml);		
		jQuery('#pdtpic').html($scope.imgHtml);
		jQuery('#orderitem').html(order);
		$scope.$parent.pdtid = data[index].pdtid;
		$scope.$parent.sessionkey = $rootScope.sessionkey;
		
		//调用MyCtrl模块的方法来显示矩阵
		$scope.$parent.toggle(0,"");
		toggleStyle(index);
    };
      
	//模拟登录,加载数据,显示数据
	$scope.login($scope.orderid);
    
	//切换商品 index:选中的商品在列表中的序号
	$scope.togglePdt = function(index){
		$scope.index = index;
		cindex = index;
		$scope.handle($scope.pdts,index);

	};
	$scope.search = function(){
      if(sql!='1=1')
    	  {
    	    desc="";
    	    $scope.desc=desc;
    	  }

		$scope.sql= sql;

		$rootScope.sql = $scope.sql;
		console.log($scope.sql);
		console.log($scope.desc);
         cindex=0;
         $scope.index=0;
         $rootScope.page=1;
		 $rootScope.load(1,$rootScope.pageCnt,$rootScope.orderid,$rootScope.sessionkey,0,$scope.sql,$scope.desc);
		 
		sql = '1=1';
	    desc=$scope.desc;
	    $scope.desc="";
	    $scope.sql='1=1';
		exp = "";
		jQuery("#pdt_desc").val("");
		jQuery("#pdt_desc").attr('readonly',false);
	};
    
	$scope.entersearch=function(){
        //alert(dd);
       var event = window.event || arguments.callee.caller.arguments[0];
       if (event.keyCode == 13)
       {
    	   $scope.search();
       }
   };
	
	//翻页控制
	$scope.start=function(){
	    if($rootScope.page==1)
	    	alert('已经是第一页');
	    else{
            	$rootScope.page=1;		
            	cindex = 0;
        		$scope.index = 0;

	           $rootScope.load(1,$rootScope.pageCnt,$rootScope.orderid,$rootScope.sessionkey,0,$scope.sql,$scope.desc);
            }
	};
	$scope.back=function(){
		    if($rootScope.page==1)
		    	alert('已经是第一页');
		    else{
		    	$rootScope.page = $rootScope.page-1;
				cindex = 0;
				$scope.index = 0;

	            $rootScope.load($rootScope.page,$rootScope.pageCnt,$rootScope.orderid,$rootScope.sessionkey,0,$scope.sql,$scope.desc);
		    }
	};
	$scope.next=function(){
		    if($rootScope.page==$rootScope.total)
		    	alert('已经是最后一页');
		    else{
		    	$rootScope.page = $rootScope.page+1;
				cindex = 0;
				$scope.index = 0;

    	        $rootScope.load($rootScope.page,$rootScope.pageCnt,$rootScope.orderid,$rootScope.sessionkey,0,$scope.sql,$scope.desc);
		    }
	};
	$scope.end=function(){
	    if($rootScope.page==$rootScope.total)
	    	alert('已经是最后一页');
	    else{
		$rootScope.page = $rootScope.total;
		cindex = 0;
		$scope.index = 0;
	    $rootScope.load($rootScope.total,$rootScope.pageCnt,$rootScope.orderid,$rootScope.sessionkey,0,$scope.sql,$scope.desc);
		}
	};
	


});

function toggleStyle(index)
{
	cindex=index;
	console.log(index);
	var s="#pdt"+index;
	jQuery('#listtb td').removeClass('selected');
	jQuery(s).addClass('selected');	
	}
function setCondition() {
	var toggle_url;
	//updateCondition is global function
	if(table_id=='B_FAIRITEM')
	   toggle_url="/nea/core/query/search.jsp?table="+table_id+"&return_type=a&accepter_id=updateCondition&fixedcolumns=b_fairitem.b_fair_id%3D"+fairid;
	else
	   toggle_url="/nea/core/query/search.jsp?table="+table_id+"&return_type=a&accepter_id=updateCondition";

	oq.toggle_m(toggle_url,"updateCondition");
};
function updateCondition(filter){

	jQuery("#pdt_desc").attr('value',filter.description);
	jQuery("#pdt_desc").attr('readonly',true);

	jQuery("#pdt_exp").attr('value',filter.expression);
	jQuery("#pdt_sql").attr('value',filter.sql);
	sql = filter.sql;
	exp = filter.exp;

};

