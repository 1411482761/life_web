
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
var fairid;
var isSupply="none";

app.controller('MyCtrl', function($scope,rest,$rootScope,$window) {
	//test

    $scope.height=window.screen.availHeight;
	$scope.load = VIEWS_LOCALE.main.loading;
	$scope.sessionkey = "";
	$scope.pdtid = "";
	$scope.data = rest;
	$scope.loading=false;
	$scope.wrapper=false;
    $scope.data.init(null,null,'/servlets/binserv/Fair');
    $scope.elem = {option:0};
    $rootScope.sql = sql;
    //getsheet切换页面
    $scope.toggle = function(index,type){
		//$scope.loading=true;
		$scope.funcs=new Array();
		$scope.table=new Array();
		var trans = {'id': 1, 'command': 'com.agilecontrol.fair.FairCmd', 'params': {cmd: "GetSheet",pdtid:$scope.pdtid,type:"skuqty_b2b",sessionkey:$scope.sessionkey}};
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
			$scope.steps=o_data.steps;
			$scope.elem.option = index;
			$scope.funcs=o_data.funcs;
			$scope.type=o_data.steps[index].cmd;
/*			var saveobj={
					name:"购买",
					cmd:"SaveSheet"
			};
			$scope.funcs.push(saveobj);*/
			$scope.loading=false;
		});

	  };
	  //$scope.toggle(0,"");
	  //input输入框点击触发的事件
	  $scope.inputClick=function(currentLine,currentCol,node){
	  	  node.target.select();
	  	  node.target.focus();
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
		 $scope.buttonclick = function(cmd,callback){
			 if(cmd=="SaveSheet"){
				 if($rootScope.readonly==true){
					 alert('对不起！您没有修改订单的权限');
					 return;
				 }
				 for(var key in values){
				 	if(values[key][1]==undefined) break;
					 values[key]=myTable[values[key][0]][values[key][1]].v;
					 if(values[key]=="") values[key]=0;
				 }
				 var params={cmd: "B2b_SaveSheet",pdtid:$scope.pdtid,values:values,type:$scope.type,sessionkey:$scope.sessionkey,isSupply:isSupply};
				 var trans = {'id': 1, 'command': 'com.agilecontrol.fair.FairCmd', 'params':params };
				 $scope.data.sendOneRequest(trans,function(response){

					 var data=response.data[0].result;
					 if(response.data[0].code==-1){
						 alert(response.data[0].message);
						    $rootScope.load($rootScope.page,$rootScope.pageCnt,$rootScope.sessionkey,$rootScope.sql,desc);
						// return;
					 }
						 callback(function(){
						 	//$scope.toggle(0,$scope.type);
						    $rootScope.load($rootScope.page,$rootScope.pageCnt,$rootScope.sessionkey,$rootScope.sql,desc);
						 });


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
		jQuery("#mytable tr:eq("+row+") td:eq("+col+") input").select();
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
app.controller('ListCtrl',function($scope,rest,init,$rootScope,$window){
	$scope.req=rest;

	$rootScope.orderid=init.orderid;
	$rootScope.total=1;
	$rootScope.page=1;
	$scope.pdtHeight=screen.availHeight-340;
	$rootScope.pageCnt=parseInt($scope.pdtHeight/60);
	$rootScope.cellHeight=60;
	$rootScope.isEndUser = init.isEndUser;
    $rootScope.localQry='N';
	$scope._pageCnt=$rootScope.pageCnt;
	//b2b查询参数
	$rootScope.fairid=init.fairid;
	$rootScope.querytype=init.type;
	$rootScope.categoryfir=init.categoryfir;
	$rootScope.categorysec=init.categorysec;
  $rootScope.categorythr=init.categorythr;
	$rootScope.fairtype=init.fairtype=="null"?"singleMonth":init.fairtype;
	$rootScope.dim1=init.dim1;
	$rootScope.dim2=init.dim2;
  $rootScope.dim3=init.dim3;
    $rootScope.transindex=init.index+((init.curpage==null?1:init.curpage)-1)*(init.itemsPerPage==null?50:init.itemsPerPage);
    $rootScope.orderby=init.orderby;
    $scope.isRecent=init.isRecent;
    $scope.pdtid=init.pdtid;
    $scope.orderid=init.orderId;
    $scope.jumpPage=1;
	$scope.pdts={};
    $scope.req.init(null,null,'/servlets/binserv/Fair');
    $scope.pdtHtml="";
    $scope.imgHtml="";
    $scope.sql='1=1';
    $scope.desc="";
    $rootScope.loadIdx=init.loadIdx;
    $scope.isfav="favorite";
    jQuery(window).bind("beforeunload",function(){
        $scope.beforeleave();
         });
    $scope.checkOrderType=function(){
      if(!($scope.orderid==null||$scope.orderid=='null')){
        jQuery("#orderitem").children("div").hide();
        jQuery("#listhead").hide();
      }
    	if($rootScope.fairtype=="singleMonth"){
	    		if(init.isSupply=="N")
	                jQuery("#isSupply").modal({backdrop:"static"});
	            else {
	            	$scope.orderType=init.isSupply=="MON"?"月单":"补单";
	            }
    	}
         else
             $scope.orderType="日单";

    }
    $scope.checkOrderType();
    //模拟登录方法定义, orderid：订单id
    $rootScope.login= function(){
    	//$scope.$parent.loading=true;

    	var trans =
    		{
    			'id':1,
	            'command': 'com.agilecontrol.fair.MiscCmd',
    	        'params':{cmd:"B2b_GetSheetWeb",fairid:$rootScope.fairid,orderid:$scope.orderid}
    		};
    	$scope.req.sendOneRequest(trans,function(response){
    		if(response.data[0].code==-1){
    			alert(response.data[0].message);
    			$scope.$parent.loading=false;
    			return;
    		}
    		var data = response.data[0].result;
    		$rootScope.sessionkey = data.sessionkey;

    		table_id = data.table_id;
    		$rootScope.readonly = data.readonly;
    	    $rootScope.load($rootScope.page,$rootScope.pageCnt,$rootScope.sessionkey,$scope.sql,"");
    	    $scope.$parent.loading=false;
    	    $scope.$parent.wrapper=true;

    	});
    };

  //获取请求页数据方法定义 page：请求的页码序号，pageCnt：每页条目数,orderid：订单id,sessionkey:用于登录验证，index:当前页中选中的条目序号
    //此方法属于$rootScope作用域 用于模块间共享
    $rootScope.load= function(page,pageCnt,sessionkey,sql,desc){
		var trans =
		{'id': 1,
	     'command': 'com.agilecontrol.fair.FairCmd',
	     'params': {
	     	cmd: "B2bOrderList",
	     	page:page,
	     	pageCnt:pageCnt,
	     	myindex:$rootScope.index==null?0:$rootScope.index,
	     	transindex:$rootScope.transindex,
	     	orderby:$rootScope.orderby,
	     	sessionkey:sessionkey,
	     	desc:desc,
	     	querytype:$rootScope.querytype,
	     	fairId:$rootScope.fairid,
	     	fairtype:$rootScope.fairtype,
	     	dim1:$rootScope.dim1,
	     	dim2:$rootScope.dim2,
        dim3:$rootScope.dim3,
	     	categoryfir:$rootScope.categoryfir,
	     	categorysec:$rootScope.categorysec,
        categorythr:$rootScope.categorythr,
	     	pdtid:$scope.pdtid==null?-1:$scope.pdtid,
	     	orderid:$scope.orderid==null?-1:$scope.orderid,
	     	isSupply:isSupply,
	     	b2b_params:init.b2b_params,
	     	top_name:init.top_name,
	     	localQry:$rootScope.localQry,
        selectedMc:init.selectedMc,
	     	operation:"getPdt",
	     }
	 };

		$scope.req.sendOneRequest(trans,function(response){
			var data = response.data[0].result;
			if(data==null)
				{
				   alert(response.data[0].message);
				   return;
				}
			if(data.alterToDay!=undefined&&data.alterToDay=='Y'){
                 alert("当月月单已下过,系统切换至补单");
                 $scope.orderType='补单';
                 isSupply="DAY";
			}
/*			$scope.allsku=data.allsku;
			$scope.allqty=data.allqty;
			$scope.allamt=data.allamt;*/
			$scope.pdts = data.pdt;
			if(jQuery("#listhead").next("p")!=undefined){
				jQuery("#listhead").next("p").remove();
			}
			if(data.pdt.length==0){
				jQuery("#listhead").after("<p>暂无数据!</p>")
				return;
			}
			fairid = data.fairid;
			$rootScope.total = data.totalpage;
            if(data.index!=-1){
            	$rootScope.page=data.page;
            	$rootScope.index=data.index;
            	$scope.jumpPage=data.page;
            }
            else
              $rootScope.index=0;
			      $scope.allamt = data.orderhtml.allamt;
            $scope.handle($scope.pdts,$rootScope.index,$scope.orderhtml);

		});
    };

    //将获取的数据加载到页面 data：获取的数据,index：当前页选中的条目序号
    $scope.handle = function(data,index,order){
    $scope.isfav=data[index].is_fav=="Y"?"favorite":"unfavorite";
		$scope.pdtHtml = data[index].html;
		var imageArray = data[index].image;
		var hurl = data[index].imageurl;
		var images = new Array();
		$scope.murl="/pdt/m/"+imageArray[0];
		for(var i=0;i<imageArray.length;i++){
			var t = {
				surl:"/pdt/s/"+imageArray[i]
			}
			images.push(t);
		}
		$scope.images=images;
		if(null==hurl||hurl==undefined) $scope.imageurl=[];
		else{
           $scope.hurl=hurl.split('/');
           }
		//$scope.imgHtml = "<img style='height:100%' src='/pdt/m/"+data[index].image+"'/>";

		jQuery('#pdtinfor').html($scope.pdtHtml);
		//jQuery('#pdtpic').html($scope.imgHtml);
		$scope.$parent.pdtid = data[index].id;
		$scope.$parent.sessionkey = $rootScope.sessionkey;

		//调用MyCtrl模块的方法来显示矩阵
		$scope.$parent.toggle(0,"");
		toggleStyle(index);
    };

	//模拟登录,加载数据,显示数据
    $scope.login();

	//切换商品 index:选中的商品在列表中的序号
	$scope.togglePdt = function(index,node){
    node.target.focus();
		$scope.$parent.buttonclick("SaveSheet",function(callback1){
			$rootScope.index = index;
	    $rootScope.transindex=null;
      //完全刷新页面 有性能问题 后续考虑只更新订量和金额
      callback1();
      //$scope.handle($scope.pdts,$rootScope.index,$scope.orderhtml);
		});


	};
	$scope.setMonth=function(){
		isSupply = jQuery("#isSupply_sel").val();
		$scope.orderType=isSupply=="MON"?"月单":"补单";
 		$scope.login();
		jQuery("#isSupply").modal("hide");
	};

	$scope.setDefault= function(){
        isSupply="MON";
        $scope.orderType="月单";
         $scope.login();
        jQuery("#isSupply").modal("hide");
	};
	$scope.shoppingcart=function(){
		$scope.$parent.buttonclick("SaveSheet",function(){
			var trans={
				'id':1,
				'command':'com.agilecontrol.fair.FairCmd',
				 'params':{
	        	        cmd:"B2bOrderList",
	        	        operation:"shoppingcart",
	        	        sessionkey:$rootScope.sessionkey
	              }
			}
			$scope.req.sendOneRequest(trans,function(response){
				if(response.data[0].code==-1){
					alert(response.data[0].message);
					return;
				}
				var orderid=response.data[0].result.orderid;
				console.log($scope.orderid);
				if(orderid==-1&&(($scope.orderid==null)||($scope.orderid=="null"))){
					alert('还未下单');
					return;
				}
        //来自购物车的空订单也不做删除
        if($scope.orderid){
          jQuery(window).unbind("beforeunload");
          orderId  = $scope.orderId;
        }
				window.location.href="/fair/ipad/B2B/shoppingCart.jsp?foid="+orderid+"&fairid="+$scope.fairid+"&loadIdx="+$rootScope.loadIdx;

			})

		})
	};
  $scope.togglefav = function(){
            $scope.isfav = $scope.isfav=="favorite"?"unfavorite":"favorite";
            console.log($scope.$parent.pdtid);
            var trans={
              'id':1,
              'command':'com.agilecontrol.fair.MiscCmd',
              'params':{
                cmd:'B2B',
                type:'favorite',
                fairid:$scope.fairid,
                pdtid:$scope.$parent.pdtid,
                fav:$scope.isfav=="favorite"?"Y":"N"
              }
            }
            $scope.req.sendOneRequest(trans,function(response){
            var data=response.data[0].result;
            if(data==null){
              alert(response.data[0].message);
              return;
            }
        });
  };
  $rootScope.collection=function(type){
    var params={cmd:"JudgeMonth",fairid:$scope.fairid,method:"beforeCollection",judtype:type};
  var trans={id:1, command:"com.agilecontrol.fair.FairCmd",params:params};
  $scope.req.sendOneRequest(trans, function(response){
        var ret=response.data[0].result;
        if (ret==0) {
          if (type=="month") {
            window.location.href='/fair/ipad/B2B/shoppingCart.jsp?loadIdx='+$scope.loadIdx+'&fairid='+$scope.fairid+'&ordertype=month&iscollection=yes';
          }else if(type=="day"){
            window.location.href='/fair/ipad/B2B/shoppingCart.jsp?loadIdx='+$scope.loadIdx+'&fairid='+$scope.fairid+'&ordertype=day&iscollection=yes';
          }
        }else{
          if (type == "month") {
            alert("当前存在未确认的月单，无法创建月单收藏订单");
          } else if (type == "day") {
            alert("当前存在未确认的日单，无法创建日单收藏订单");
          }
        }
      });

  };
	$rootScope.enterSearch=function(e){
		if(e.keyCode=='13'){
			$scope.search();
		}
	};
	//所有离开页面的操作之前要先清空空白订单，保存当前矩阵。
	$rootScope.beforeleave = function(action){
		$scope.$parent.buttonclick("SaveSheet",function(){
			var trans={
				'id':1,
				'command':'com.agilecontrol.fair.FairCmd',
				 'params':{
	        	        cmd:"B2bOrderList",
	        	        operation:"back",
	        	        sessionkey:$rootScope.sessionkey
	              }
			}
			$scope.req.sendOneRequest(trans,function(response){
				if(response.data[0].code==-1){
					alert(response.data[0].message);
					return;
				}
				if(action=='backward') window.history.go(-1);
				else if(action=='ordercenter') window.location.replace('/fair/ipad/B2B/orderCenter.jsp?loadIdx='+$rootScope.loadIdx+'&&fairid='+$rootScope.fairid);
				else if(action=='backstage') window.open('/nea/core/portal');
				else return;

			})

		})

	}
	//确认订单按钮
    $scope.confirm=function(){
    	 //先保存当前矩阵
    	  $scope.$parent.buttonclick("SaveSheet",function(callback1){
                    var trans={
                       'id': 1,
	                   'command': 'com.agilecontrol.fair.FairCmd',
	                   'params':{
	        	        cmd:"B2bOrderList",
	        	        operation:"confirm",
	        	        sessionkey:$rootScope.sessionkey
	                   }
    	            }
    	           $scope.req.sendOneRequest(trans,function(response){
    	  	       if(response.data[0].code==-1){
    	  		         alert(response.data[0].message);
    	  		         return;
    	  	       }
                 //解绑unload事件
                 jQuery(window).unbind("beforeunload");
                   var data = response.data[0].result;
                   //callback1();
                   if(data.confirm_code==1)
                     jQuery("#jumpModal").modal({backdrop:"static"});
                   else
                      alert(data.msg);
    	          });
    	  });

    };
    $scope.clear=function(){
    	var trans={
    		 'id': 1,
	        'command': 'com.agilecontrol.fair.FairCmd',
	        'params':{
	        	cmd:"B2bOrderList",
	        	operation:"clear",
	        	sessionkey:$rootScope.sessionkey

	         }
    	}
    	$scope.req.sendOneRequest(trans,function(response){
    		if(response.data[0].code==-1){
    			alert(response.data[0].message);
    			return;
    		}
    		$scope.orderid=null;
    		$rootScope.load($rootScope.page,$rootScope.pageCnt,$rootScope.sessionkey,$scope.sql,$scope.desc);
            alert(response.data[0].result.msg);
    	});
    };
	$scope.search = function(){
		$scope.$parent.buttonclick("SaveSheet",function(){
		$rootScope.pageCnt=$scope._pageCnt;
		$rootScope.transindex=null;
        if(sql!='1=1')
    	  {
    	    desc="";
    	    $scope.desc=desc;
    	  }

		$scope.sql= sql;

		$rootScope.sql = $scope.sql;

         $rootScope.index=0;
         $rootScope.page=1;
         //搜索则重置条件搜索当前活动的所有商品，fairid可区分日单和月单商品 2015.11.27
         $rootScope.querytype='search';
         $rootScope.localQry = 'Y';
		 $rootScope.load(1,$rootScope.pageCnt,$rootScope.sessionkey,$scope.sql,$scope.desc);

		sql = '1=1';
	    desc=$scope.desc;
	    $scope.desc="";
	    $scope.sql='1=1';
		exp = "";
		jQuery("#pdt_desc").val("");
		jQuery("#pdt_desc").attr('readonly',false);
		});

	};

    $scope.refresh=function(){
        $scope.$parent.buttonclick("SaveSheet",function(){
        	    	if($scope.jumpPage>$rootScope.total||$scope.jumpPage<1){
    		alert("页码超出范围");
    		$scope.jumpPage=$rootScope.page;
    		 $rootScope.load($rootScope.page,$scope._pageCnt,$rootScope.sessionkey,$scope.sql,desc);
    		return;
    	}
    	else{
    	     $rootScope.load($scope.jumpPage,$scope._pageCnt,$rootScope.sessionkey,$scope.sql,desc);
    	     $rootScope.page=$scope.jumpPage;
    	     $rootScope.pageCnt=$scope._pageCnt;
    	}
        	}
        	)
    }

	//翻页控制
	$scope.start=function(){
		$scope.$parent.buttonclick("SaveSheet",function(){
					$rootScope.pageCnt=$scope._pageCnt;
	    if($rootScope.page==1){
	    	alert('已经是第一页');
	    }
	    else{
            	$rootScope.page=1;
		    	    $scope.jumpPage=$rootScope.page;
	            $rootScope.transindex=null;
		          $rootScope.index = 0;
            }
      $rootScope.load(1,$rootScope.pageCnt,$rootScope.sessionkey,$scope.sql,desc);

			})

	};
	$scope.back=function(){
				$scope.$parent.buttonclick("SaveSheet",function(){
					$rootScope.pageCnt=$scope._pageCnt;
		    if($rootScope.page==1)
		    	alert('已经是第一页');
		    else{
		    	$rootScope.page = $rootScope.page-1;
		    	$scope.jumpPage=$rootScope.page;
	            $rootScope.transindex=null;
	        	$rootScope.index = 0;
		    }
		     $rootScope.load($rootScope.page,$rootScope.pageCnt,$rootScope.sessionkey,$scope.sql,desc);

			})

	};
	$scope.next=function(){
				$scope.$parent.buttonclick("SaveSheet",function(){
					$rootScope.pageCnt=$scope._pageCnt;
		    if($rootScope.page==$rootScope.total)
		    	alert('已经是最后一页');
		    else{
		    	$rootScope.page = $rootScope.page+1;
		    	$scope.jumpPage=$rootScope.page;
	         $rootScope.transindex=null;
		       $rootScope.index = 0;
		    }
		    $rootScope.load($rootScope.page,$rootScope.pageCnt,$rootScope.sessionkey,$scope.sql,desc);

			})

	};
	$scope.end=function(){
				$scope.$parent.buttonclick("SaveSheet",function(){
					$rootScope.pageCnt=$scope._pageCnt;
	    if($rootScope.page==$rootScope.total)
	    	alert('已经是最后一页');
	    else{
		$rootScope.page = $rootScope.total;
	    $scope.jumpPage=$rootScope.page;
      $rootScope.transindex=null;
		  $rootScope.index = 0;
		}
					    $rootScope.load($rootScope.total,$rootScope.pageCnt,$rootScope.sessionkey,$scope.sql,desc);

			})

	};
	$scope.toggleImage=function(url){
		var t = url.split('/');
		$scope.murl="/pdt/m/"+t[t.length-1];

	};
    $scope.maximum=function(url){
    	var t = url.split('/');
    	jQuery("#mask").addClass("mask");
    	$scope.ispop=true;
    	$rootScope.ismask=true;
    	$rootScope.lurl="/pdt/l/"+t[t.length-1];
    }
    $rootScope.hidepop=function(){
        $scope.ispop=false;
        $rootScope.ismask=false;
    }
    $scope.ordercenter = function(){
    	window.location.replace("/fair/ipad/B2B/orderCenter.jsp?loadIdx="+$rootScope.loadIdx);
    };

});
/*app.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
        	//var functionCall = scope.$eval(attrs.ngEnter);
            if(event.which === 13) {
               scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
});*/

function toggleStyle(index)
{
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
