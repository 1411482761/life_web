<%@ page language="java" pageEncoding="utf-8"%>
<%@ page import="org.slf4j.Logger,org.slf4j.LoggerFactory,org.json.*,java.text.SimpleDateFormat,java.sql.ResultSet,java.sql.Connection,java.sql.PreparedStatement,com.agilecontrol.nea.core.query.web.*,com.agilecontrol.nea.core.control.web.*,com.agilecontrol.nea.core.util.*,com.agilecontrol.nea.core.schema.*,com.agilecontrol.nea.core.query.*, java.io.*,java.util.*,com.agilecontrol.nea.core.control.util.*,com.agilecontrol.nea.core.report.*,com.agilecontrol.nea.core.web.bean.*,com.agilecontrol.nea.core.model.*, com.agilecontrol.nea.core.model.dao.*,com.agilecontrol.nea.util.*,org.apache.struts.Globals"%>
<%
	UserWebImpl userWeb =null;
	Locale locale=null;
	int userId=0;
	boolean isEndUser=false;
	try{
		userWeb= ((UserWebImpl)WebUtils.getSessionContextManager(session).getActor(WebKeys.USER));
		userId=userWeb.getUserId();
		locale=userWeb.getLocale();
		
		String utype=(String)QueryEngine.getInstance().doQueryOne("select utype from users where id=?", new Object[]{userId});
		if(utype.equals("04")){
			isEndUser=true;
		}
		
	}catch(Throwable userWebException){
		System.out.println("########## found userWeb=null##########"+userWebException);
		locale=TableManager.getInstance().getDefaultLocale();
	}
 	String sessionkey = request.getParameter("sessionkey");
 	String date = String.valueOf(new Date().getTime());
 	String loadIdx = request.getParameter("loadIdx");
 	
 	String search=request.getParameter("search");
 	String value=request.getParameter("value");
 	String fair=request.getParameter("fair");
 	String top_name=request.getParameter("top_name");
 	String firstid=request.getParameter("firstid");
 	String secondid=request.getParameter("secondid");
 	String thirdid=request.getParameter("thirdid");
 	String fairType=request.getParameter("fairType");
 	String crtFairIndex=request.getParameter("crtFairIndex");
 	String from=request.getParameter("from");
 
%>
<!DOCTYPE html>
<html ng-app="b2b.main">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width initial-scale=1.0 maximum-scale=1.0 user-scalable=yes" />
    <link rel="stylesheet" href="/fair/ipad/css/bootstrap/bootstrap.min.css">
    <link rel="stylesheet" href="/fair/ipad/B2B/css/angular-carousel.css">
    <link rel="stylesheet" href="/fair/ipad/B2B/css/loading-bar.css">
    <link rel="stylesheet" href="/fair/ipad/B2B/css/main.css?t=<%=date %>">

	<!-- <script language="javascript" src="/fair/ipad/js/prototype.js"></script> -->
 
	<script src="/fair/ipad/js/AngularJS/angular.min1.4.2.js"></script>
	
	<script src="/fair/ipad/B2B/js/tm.pagination.js"></script>
	
	<script src="/fair/ipad/js/AngularJS/angular-carousel.min.js"></script>
    <script src="/fair/ipad/js/AngularJS/angular-route.min.js"></script>
    <script src="/fair/ipad/js/AngularJS/angular-touch.min.js"></script>
    <!--<script src="js/ui-bootstrap.min.js"></script>-->
    <script src="/fair/ipad/js/bootstrap/ui-bootstrap-tpls-0.13.0.min.js"></script>
    <script src="/fair/ipad/B2B/js/loading-bar.min.js"></script>
    <script type="text/javascript" src="/fair/ipad/js/rest.js"></script>
    <script src="/fair/ipad/B2B/js/main.js?t=<%=date %>"></script>
    <script language="javascript" type="text/javascript">
    	main.service('initService',function(){
		   this.userid='<%=userId%>';
		   this.loadIdx='<%=loadIdx%>';
		   this.search='<%=search%>';
		   this.value='<%=value%>';
		   this.fair='<%=fair%>';
		   this.top_name='<%=top_name%>';
		   this.firstid='<%=firstid%>';
		   this.secondid='<%=secondid%>';
		   this.thirdid='<%=thirdid%>';
		   this.fairType='<%=fairType%>';
		   this.crtFairIndex='<%=crtFairIndex%>';
		   this.from='<%=from%>';
		   this.isEndUser=<%=isEndUser%>;
		   this.userDescription='<%=userWeb.getUserDescription()%>';
		});
	</script>
    <title>列表展示界面</title>
</head>

<body class="hidden-xs">

<!-- <div  ng-init="load()"  class="app-content ng-scope" ng-controller="mainCtr"> -->
<div   class="app-content ng-scope" ng-controller="mainCtr">
<!-- <div options="load()"></div> -->
<%-- <options ng-init="load(<%=loadIdx%>)" ng-show="isOptionsShow"></options> --%>
<!-- <options load="load(index)" ng-show="isOptionsShow" ng-if="optionsLength>1"></options>
<options ng-init=load(0) ng-show="isOptionsShow" ng-if="optionsLength==1"></options> -->
<!-- <loading></loading> -->

<div when-scrolled="loadMore()" class="scrollable-content" ng-show="isDataShow">
<nav class=" navbar-default navbar-fixed-top">
	  <div class="container-fluid">
	 <%--    <div class="row top" >
		    <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2"><a href="#" rel="sidebar" ng-click="addFavorite();">收藏晨光</a></div>
		    <div class="col-lg-offset-5 col-lg-2  col-md-offset-5 col-md-2  col-sm-offset-2 col-sm-3 col-xs-offset-2 col-xs-3"><p class="welcome-text">您好，欢迎 <%= userWeb.getUserDescription() %>！</p></div>	
            <div class="col-lg-2 col-md-2 col-sm-3 col-xs-3">
            	<div class="row">
            		<div class="order-center col-lg-6 col-md-6 col-sm-6 col-xs-6" ng-click="ordercenter()" style="float: left;">订单中心</div>
            	<div class="order-center col-lg-6 col-md-6 col-sm-6 col-xs-6"  onclick="window.open('/nea/core/portal')" style="float: right;" ng-if='!isEndUser'>管理中心</div>
            	</div>
            	
            </div>
            <div class="col-lg-1 col-md-1 col-sm-2 col-xs-2"><a class="top-text btn btn-default" style="padding: 2px 8px;color: red;" href="/control/logout"><%= PortletUtils.getMessage(pageContext, "sign-out",null)%></a></div>	
		</div> --%>
			 <div class="row top" >
		   <!--  <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2"><a href="#" rel="sidebar" ng-click="addFavorite();">收藏晨光</a></div> -->
		    <div class="head-margin">
		   		<span class="welcome-text">您好，欢迎 <%= userWeb.getUserDescription() %>！ <a class="ch-pwd" href="/nea/core/portal" ng-if="'<%= userWeb.getUserDescription() %>'=='guest'">[请登录]</a></span>
           	  <span ng-if="'<%= userWeb.getUserDescription() %>'!='guest'">		
	           	<span  dropdown  class="dropdown">
	                <a class="order-center dropdown-toggle" dropdown-toggle ng-disabled="disabled" href="" style="text-decoration: none;">我的喜欢<span class="caret"></span> </a>
	                <ul class="dropdown-menu dropdown-menu-change">
	                    <li ng-click="collection('day');"><a href="">日单喜欢商品</a></li>
	                    <li ng-click="collection('month');"><a href="">月单喜欢商品</a></li>
	                </ul>
	            </span>
           		<span class="order-center" ng-click="ordercenter()">订单中心</span>
           		<span class="order-center" onclick="window.open('/nea/core/portal')" ng-if='!isEndUser'>管理中心</span>
           		<span><a class="top-text btn btn-default" style="padding: 2px 8px;color: red;" href="/control/logout"><%= PortletUtils.getMessage(pageContext, "sign-out",null)%></a></span>
            </span>
            </div>	
		</div>
	  </div>
	
	  <!-- <img alt="" src="/fair/ipad/B2B/images/nnt.jpg" style="width: 100%;"> -->
</nav>
<nav class=" navbar-default top-fix">
	<img alt="" src="/fair/ipad/B2B/images/nnt.jpg" style="width: 100%;">
</nav>
<div class="container">
	
        <div class="row"  > <!-- ng-controller="productCtr" -->
            <!-- 搜索框 -->
            <div  class="header row" ng-controller="fairCtr" >
                <div class="col-md-3 col-xs-3">
                    <img src="images/mg.jpg" style="width: 100%;margin-left: -6%;">
                    <!--<fairItem fair-items="data"></fairItem>-->
                </div>
                <div class="col-md-7 col-xs-7">
                    <search search="search" search-val="searchVal">
                        {{search}}
                    </search>
                </div>
               
            </div>
        </div>
</div>

<div id="orderitem" class="well" ng-if="isQuickOrder && !isEndUser && '<%= userWeb.getUserDescription() %>'!='guest'">
	<span style="margin-bottom:10px;padding:0;font-size:12px;color:rgb(200,22,34);">快速下单模式</span>
	<div ><button class="btn  btn-custom" ng-click="listOrder();" style="width: 120px;">月单列表下单</button></div>
	<div style='margin-top:5px'><button class="btn  btn-custom" ng-click="monthOrder('MON');" style="width: 120px;">月单EXCEL下单</button></div>
	<div style='margin-top:5px'><button class="btn  btn-custom" ng-click="monthOrder('DAY');" style="width: 120px;">补单EXCEL下单</button></div>
</div>
<div id="orderitem" class="well" ng-if="!isQuickOrder && '<%= userWeb.getUserDescription() %>'!='guest'">
	<span style="margin-bottom:10px;padding:0;font-size:12px;color:rgb(200,22,34);">快速下单模式</span>
	<div ><button class="btn  btn-custom" ng-click="dayListOrder();" style="width: 120px;">日单列表下单</button></div>
	<div style='margin-top:5px'><button class="btn  btn-custom" ng-click="dayOrder();" style="width: 120px;">日单EXCEL下单</button></div>
</div>


<div class="container-fluid" style="background-color: rgb(200,22,34);margin-bottom: 6px;margin-top: 0px;">
	<menu-fair fairs="menufair"></menu-fair>
</div>

<div class="container">
    <div class="row" style="position:relative;">
          <product-menu categorys='categorys' ></product-menu>
    </div>
    <div class="row" style="position:relative;z-index:2" >
    	<div ng-if="false">
    	   <img alt="" src="/fair/ipad/B2B/images/main_banner.png" style="width: 100%;">
    	</div>
    	<form class="form-horizontal col-md-offset-1 col-md-10" style="border: 1px solid rgb(220,221,221);" ng-if="true">
    	  <div class="form-group form-head">
    	  	<div style="float: left;color: black;margin-left:1%;"><!-- <span style="color: red;padding: 2px 8px;background-color: #fff;">新品</span>- 商品筛选 -->
    	  		<current-position></current-position>
    	  	</div>
    	  	<div style="float: right;margin-right: 1%;" ng-click="reset();">重置筛选条件</div>
		  </div>
		  <div ng-repeat="filter in filters" ng-init="outerIndex = $index" ng-show="filters.length>outerIndex+4">  
			  <div class="form-group form-margin" >
			    <label for="inputEmail3" class="col-sm-2 control-label">{{filter.description}}:</label>
			    <div class="col-sm-10 form-text">
			     <a name="form{{outerIndex}}" class="checked" ng-click="form_change(0,'form{{outerIndex}}',filter.name,null);">全部</a>
			     <a name="form{{outerIndex}}" ng-click="form_change(innerIndex,'form{{outerIndex}}',filter.name,f.id,f.attribname);" ng-repeat="f in filter.values" ng-init="innerIndex = $index+1">{{f.attribname}}</a>
			    </div>
			  </div>
		  <hr>
		 </div> 
		 <div ng-repeat="filter in filters" ng-init="outerIndex = $index" ng-show="filters.length-4<outerIndex+1 && filters.length>outerIndex+2 && isNewShow==filter.isNew"> 
			  <div class="form-group form-margin" >
			    <label for="inputEmail3" class="col-sm-2 control-label">{{filter.description}}:</label>
			    <div class="col-sm-10 form-text">
			     <a name="new{{outerIndex}}" class="checked" ng-click="form_change(0,'new{{outerIndex}}',filter.name,null);">全部</a>
			     <a name="new{{outerIndex}}" ng-click="form_change(innerIndex,'new{{outerIndex}}',filter.name,f.id);" ng-repeat="f in filter.values" ng-init="innerIndex = $index+1">{{f.attribname}}</a>
			    </div>
			  </div>
		  <hr>
		 </div> 
		 <div class="form-group form-margin" ng-repeat="filter in filters track by $index" ng-init="outerIndex = $index" ng-show="filters.length==outerIndex+2">
		    <label  class="col-sm-2 control-label">价格:</label>
		    <div class="col-sm-10 form-text">
		      <a name="price{{outerIndex}}" class="checked" ng-click="form_change(0,'price{{outerIndex}}',filter.name,null);">全部</a>
		      <a name="price{{outerIndex}}" ng-click="form_change(innerIndex,'price{{outerIndex}}',filter.name,f);" ng-repeat="f in filter.values" ng-init="innerIndex = $index+1">{{f}}</a>  
		      <!--  onkeyup="this.value=this.value.replace(/[^0-9\.]/,'')" onkeydown="this.value=this.value.replace(/[^0-9\.]/,'')" -->
		      <span style="color: black;"><input type="text" size="4" name='price' ng-model="priceOne" onkeyup="this.value=this.value.replace(/[^\d\.]/g,'')" >至<input type="text" size="4" name='price' ng-model="priceTwo" onkeyup="this.value=this.value.replace(/[^\d\.]/g,'')">&nbsp;<button ng-click="priceSubmit(priceOne,priceTwo);">确定</button></span>
		    </div>
		  </div>
		  
		   <div class="form-group form-margin" ng-repeat="filter in filters track by $index" ng-init="outerIndex = $index" ng-show="filters.length==outerIndex+1">
		    <label  class="col-sm-2 control-label">分类:</label>
		    <div class="col-sm-10 form-text">
		      <span ng-repeat="f in filter.values" style="padding: 2px 1%;"> 
		         <!-- <input type="checkbox" ng-model="f.check" name="mc" ng-click="selCheckbox(this,f)"/>{{f.name}} -->
		         
		         <input type="checkbox" id={{f.id}} name="{{f.name}}" ng-checked="isSelected(f.id)" ng-click="updateSelection($event,f.id)">{{f.name}}
		      </span>
		      
		      
		     <!--  <a name="mc{{outerIndex}}" class="checked" ng-click="form_change(0,'price{{outerIndex}}',filter.name,null);">全部</a>
		      <a name="mc{{outerIndex}}" ng-click="form_change(innerIndex,'mc{{outerIndex}}',filter.name,f);" ng-repeat="f in filter.values" ng-init="innerIndex = $index+1">{{f}}</a>   -->
		      
		    </div>
		  </div>
		  
		 <!--  <div class="form-group form-margin">
		    <label for="inputEmail3" class="col-sm-2 control-label">品牌：</label>
		    <div class="col-sm-10 form-text">
		     <a name="form0" class="checked" ng-click="form_change(0,'form0');">全部</a>
		     <a name="form0" ng-click="form_change(1,'form0');">晨光文具</a>
		     <a name="form0" ng-click="form_change(2,'form0');">希玛格</a>
		    </div>
		  </div>
		  <hr>
		  <div class="form-group form-margin">
		    <label for="inputPassword3" class="col-sm-2 control-label">商品颜色：</label>
		    <div class="col-sm-10 form-text">
		     <a name="form1" class="checked" ng-click="form_change(0,'form1');">全部</a>
		     <a name="form1" ng-click="form_change(1,'form1');">墨蓝</a>
		     <a name="form1" ng-click="form_change(2,'form1');">红色</a>
		     <a name="form1" ng-click="form_change(3,'form1');">蓝色</a>
		     <a name="form1" ng-click="form_change(4,'form1');">黑色</a>
		    </div>
		  </div>
		  <hr>
		  <div class="form-group form-margin">
		    <label for="inputPassword3" class="col-sm-2 control-label">笔尖型号：</label>
		    <div class="col-sm-10 form-text">
		     <a class="checked">全部</a>
		     <a class="">0.5mm</a>
		     <a class="">0.7mm</a>
		     <a class="">2B</a>
		     <a class="">4B</a>
		     <a class="">HB</a>
		    </div>
		  </div>
		  <hr>
		  <div class="form-group form-margin">
		    <label  class="col-sm-2 control-label">价格：</label>
		    <div class="col-sm-10 form-text">
		      <a class="checked">全部</a>   onkeyup="this.value=this.value.replace(/[^0-9\.]/,'')" onkeydown="this.value=this.value.replace(/[^0-9\.]/,'')"
		      <span style="color: black;"><input type="text" size="4" name='price' onkeyup="this.value=this.value.replace(/[^\d\.]/g,'')" >至<input type="text" size="4" name='price'>&nbsp;<button ng-click="priceSubmit();">确定</button></span>
		    </div>
		  </div> -->
		</form>
    </div>
</div>

<div class="container">
    <div class="row">
    	<!-- <current-position style="clear: both;margin-top: 10px;margin-bottom: 5px;"></current-position> -->
       <div  class="line-sort" style="clear: both;margin-top: 10px;margin-bottom: 5px;">
       		<div style="float: left;">排序</div>
           <div class="sort">
           	 <a  ng-repeat="sort in pdt_sort track by $index" ng-if="$index==0" class="cur" name="order" ng-click="orderBy($index,'{{sort.name}}')" value={{sort.value}}>{{sort.value}}</a>
           	 <a  ng-repeat="sort in pdt_sort track by $index" ng-if="$index!=0" name="order" ng-click="orderBy($index,'{{sort.name}}')" value={{sort.value}}>{{sort.value}}</a>
			 <!--   <a  class="cur" name="order" ng-click="orderBy(0,'orderno')" value="默认">默认</a>
               <a  name="order" ng-click="orderBy(1,'priceactual')" value="订货价">订货价</a>
               <a  name="order" ng-click="orderBy(2,'xl')" value="销量">销量</a> -->
               
               <!-- <a ng-class="{'cur':isCur}" ng-click="orderBy('price')">价格</a> -->
           </div>
           <span style="float: right;font-size: 16px;color: rgb(138,139,141);" ng-model="total">找到{{total}}个相关商品</span>
       </div>
       	<!-- Recent Visit -->
   <!--  <div class="row" ng-if="recentVisit.length>5" style="border: 1px solid rgb(200,22,35);margin: 10px 2px 20px 2px;">
       		<div class="col-sm-12 col-md-12 col-lg-12" >近期浏览商品</div>
           <div class="col-sm-3 col-md-2 col-lg-2" ng-repeat="pdt in recentVisit track by $index"> 
            	<div ng-click="product_click_recent(pdt)" style="cursor: pointer;" class="pdt">
	                <a href="" class="thumbnail" >
	                   <img src="images/N.jpg">
	                    <img src="{{pdt.imageurl}}">
	                </a>
	                <div class="caption">
	                	<div  ng-class="{'product-follow_new': pdt.is_new=='Y'}"></div>
	                	<div  ng-class="{'product-follow_reservation': pdt.is_future=='Y'}"></div>
	                    <h5>{{pdt.value}}</h5>
	                    <p style="color: red;font-weight:400"><span style="float: left;">标准价￥{{pdt.pricelist}}</span><span style="float: right;">订货价￥{{pdt.priceactual}}</span></p>
	                    <p style="color: red;font-weight:400">标准价￥{{pdt.pricelist}}</p>
	                    <p style="color: red;font-weight:400">订货价￥{{pdt.priceactual}}</p>
	                </div>
                </div>
            </div>
             <hr style="border-bottom:1px rgb(201,25,36) solid;margin-bottom: 6px;margin-top: 0px;" class="col-sm-12 col-md-12 col-lg-12" > 
        </div> -->
        
        <!--Body content-->
        <div class="row">
           <!--  <div class="col-sm-6 col-md-2" ng-repeat="pdt in pdts | orderBy:order"> -->
           <div class="col-sm-3 col-md-2 col-lg-2" ng-repeat="pdt in pdts"> 
            	<div ng-click="product_click(pdt,$index)" style="cursor: pointer;" class="pdt">
	                <a href="" class="thumbnail" >
	                 <!--   <img src="images/N.jpg"> -->
	                    <img src="{{pdt.imageurl}}">
	                </a>
	                <div class="caption">
	                	<div  ng-class="{'product-follow_new': pdt.is_new=='Y'}"></div>
	                	<div  ng-class="{'product-follow_reservation': pdt.is_future=='Y'}"></div>
	                    <h5>{{pdt.value}}</h5>
	                    <p style="font-weight:400" class="standard" ng-if="'<%= userWeb.getUserDescription() %>'!='guest'">标准价￥{{pdt.pricelist}}</p>
	                    <p style="color: red;font-weight:400" ng-if="'<%= userWeb.getUserDescription() %>'!='guest'">订货价￥{{pdt.priceactual}}</p>
	                </div>
                </div>
                <div ng-class="{'favorite': pdt.is_fav=='Y','unfavorite': pdt.is_fav!='Y'}" ng-click="favorite(pdt.id,pdt);" ng-if="'<%= userWeb.getUserDescription() %>'!='guest'"></div>
            </div>
      
            <!-- <div class="alert alert-info col-md-12 loading text-center ng-hide" ng-show="busy">加载中...</div>
            <div class="col-md-12 text-center" ng-show="currentPage == pages" >已经是最后一页啦!</div> -->
            
        </div>
<tm-pagination conf="paginationConf"></tm-pagination>
    </div>
</div>
    <footer>
        <div class="container">
        	<div class="row">
        	 	<hr style="border:1px rgb(229,229,229) solid;">
					<img src="/fair/ipad/B2B/images/footer.jpg">
            	
                <hr style="border:1px rgb(229,229,229) solid;">

               <div style="font-size: 14px;padding-bottom: 10px;color: rgb(102,102,102);text-align: center;">
	               <div>上海晨光文具股份有限公司 版权所有</div>
	               <div>copyright 2015, Shanghai M&G Stationery INC./All Rights Reserved</div>
               </div>

            </div>
        </div>
    </footer>
</div>
</div>
</body>
</html>