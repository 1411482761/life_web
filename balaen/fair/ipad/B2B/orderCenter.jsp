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
 	String fairid = request.getParameter("fairid");
 	
%>
<!DOCTYPE html>
<html ng-app="b2bOrderCenter">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width initial-scale=1.0 maximum-scale=1.0 user-scalable=yes" />
    <link rel="stylesheet" href="/fair/ipad/B2B/css/pikaday.css">
    <link rel="stylesheet" href="/fair/ipad/css/bootstrap/bootstrap.min.css">
    <link rel="stylesheet" href="/fair/ipad/B2B/css/loading-bar.css">
    <link rel="stylesheet" href="/fair/ipad/B2B/css/orderCenter.css?t=<%=date %>">

	<script src="/fair/ipad/B2B/js/pikaday.min.js"></script>
	<script src="/fair/ipad/js/AngularJS/angular.min1.4.2.js"></script>
<!-- 	<script src="/fair/ipad/B2B/js/angular-local-zh-CN.js"></script> -->
	
	<script src="/fair/ipad/B2B/js/tm.pagination.js"></script>
	
    <script src="/fair/ipad/js/AngularJS/angular-route.min.js"></script>
    <script src="/fair/ipad/js/AngularJS/angular-touch.min.js"></script>
    <script src="/fair/ipad/js/bootstrap/ui-bootstrap-tpls-0.13.0.min.js"></script>
    <script src="/fair/ipad/B2B/js/loading-bar.min.js"></script>
     <script type="text/javascript" src="/fair/ipad/js/rest.js"></script>
    <script src="/fair/ipad/B2B/js/orderCenter.js?t=<%=date %>"></script>

    <title>B2B订单中心</title>
</head>
<body class="hidden-xs">
<!-- <div  ng-init="load()"  class="app-content ng-scope" ng-controller="mainCtr"> -->
<div  ng-init="loadInit(<%=loadIdx%>,'<%=fairid%>',<%=isEndUser%>)" class="app-content ng-scope" ng-controller="mainCtr">
<nav class=" navbar-default navbar-fixed-top">
	  <div class="container-fluid">
	    <%-- <div class="row top" >
		    <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2"><a href="#" rel="sidebar" ng-click="addFavorite();">收藏晨光</a></div>
		    <div class="col-lg-offset-6 col-lg-2  col-md-offset-6 col-md-2  col-sm-offset-3 col-sm-3 col-xs-offset-3 col-xs-3"><p class="welcome-text">您好，欢迎 <%= userWeb.getUserDescription() %>！</p></div>	
            <div class="order-center col-lg-1 col-md-1 col-sm-3 col-xs-3" onclick="window.open('/nea/core/portal')" ng-if='!<%=isEndUser%>'>管理中心</div>
            <div class="col-lg-1 col-md-1 col-sm-2 col-xs-2"><a class="top-text btn btn-default" style="padding: 2px 8px;color: red;" href="/control/logout"><%= PortletUtils.getMessage(pageContext, "sign-out",null)%></a></div>	
		</div> --%>
			 <div class="row top" >
		   <!--  <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2"><a href="#" rel="sidebar" ng-click="addFavorite();">收藏晨光</a></div> -->
		    <div class="head-margin">
		   			<span class="welcome-text">您好，欢迎 <%= userWeb.getUserDescription() %>！</span>
           		<!-- 	<span class="order-center" ng-click="ordercenter()">收藏夹</span>
            		<span class="order-center" ng-click="ordercenter()">订单中心</span>
            		<span class="order-center" onclick="window.open('/nea/core/portal')" ng-if='!isEndUser'>管理中心</span>
            		<span><a class="top-text btn btn-default" style="padding: 2px 8px;color: red;" href="/control/logout"><%= PortletUtils.getMessage(pageContext, "sign-out",null)%></a></span>  -->
                 	<span ng-if="'<%= userWeb.getUserDescription() %>'!='guest'">		
			           	<span  dropdown  class="dropdown">
			                <a class="order-center dropdown-toggle" dropdown-toggle ng-disabled="disabled" href="" style="text-decoration: none;">我的喜欢<span class="caret"></span> </a>
			                <ul class="dropdown-menu dropdown-menu-change_order">
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
	
	<!--   <img alt="" src="/fair/ipad/B2B/images/nnt.jpg" style="width: 100%;"> -->
</nav>
<nav class=" navbar-default top-fix">
	<img alt="" src="/fair/ipad/B2B/images/nnt.jpg" style="width: 100%;">
</nav>
<div class="container">
     <%--  <div  class="header row">
          <div class="col-md-3 col-xs-3">
          		<img src="images/back.jpg" onclick="window.location.replace('/fair/ipad/B2B/index.jsp?loadIdx=<%=loadIdx%>')">
             
          </div>
      </div> --%>
</div>

<menu></menu>

<hr style="border:3px rgb(201,25,36) solid;margin-bottom: 6px;margin-top: 0px">

<div class="container">  <!-- style="height: 80%;" -->
		
		<month-menu ng-if="isMonthMenu" re-get-products="reGetProducts()" month-menus="monthMenus" import-options="importOptions" is-show-options="isShowOptions" orders="orders"></month-menu>
		<day-menu style="float: right;margin-bottom: 6px" ng-if="isDayMenu" re-get-products="reGetProducts()" import-options="importOptions" orders="orders"></day-menu>
		<!-- <div style="float: right;margin-bottom: 6px" ng-if="isDayMenu"><label for="chkAll" style="float: left;line-height: 44px;"><input id="chkAll" type="checkbox" ng-model="chkall"  ng-click="chkAll(chkall)"/>全选</label>&nbsp;<button type="button" class="btn btn-mg btn-lg" ng-click="dayImportOrder();">导出</button> <button type="button" class="btn btn-mg btn-lg" ng-click="dayImportOrder();">导入订单</button></div> -->
        <!--Body content-->
        <div class="row" style="height: 120%;">
       		 <all-filter ng-if="isAllFilter"></all-filter>	
          	<div class="table-responsive table_data">
          	 <!-- <div when-scrolled="loadMore()" class="scrollable-content"> -->
          	   
         <!--  	 <div class="scrollable-content"> -->
	       
				<table-content submit="submit(index)" editor="editor(index)" cancel="cancel(index)" select-info="selectInfo(index,docno)" orders="orders" ng-if="!isAllFilter"></table-content>
				<table-all reminder="reminder(index)" orders="orders" ng-if="isAllFilter"></table-all>
  				
	        <!--  </div> -->
      
       		 </div>
        	 <tm-pagination conf="paginationConf"></tm-pagination>
        	 
       	 	  <div ng-if="isShowAddressList"> 
		        <div class="mask opacity" ng-click="closeAddressList();"></div> 
		         <div class="content" >
		         	<h4  style="text-aligen:left;float:left">请选择当前收货地址：</h4>
		         	<h4  style="text-aligen:center;float:right;"><button type="button" class="btn btn-primary" ng-click="addAddr()">新增</button> <button type="button" class="btn btn-primary" ng-click="delAddr()">删除</button> <button  type="button" class="btn btn-danger" ng-click="submitAddr()">确定</button></h4>
		       		<table class="table table-hover options_tab">
		       			<tr style="text-align: center;" class="address-list-head"><th>联系人</th><th>联系方式</th><th>配送方式</th></tr>
		       			<tr ng-repeat="addr in addrList track by $index" ng-click="choseAddr(addr)" ng-class="{'addr-default':addr.addrid == addrDefault.addrid}">
		       				<td>{{addr.name}}</td>
		       				<td>{{addr.tel}}</td>
		       				<td>{{addr.address}}</td>
		       			</tr>
		       		</table>
		         </div>
	         </div>
       	 	  <div ng-if="isShowAddAddress"> 
		        <div class="mask opacity" ng-click="closeAddressList();"></div> 
		         <div class="content" >
		         	<h4>新增地址</h4>
					<form class="form-horizontal">
					  <div class="form-group">
					    <label class="col-sm-2 control-label">联系人：</label>
					    <div class="col-sm-10">
					      <input type="text" class="form-control" ng-model="ad.name">
					    </div>
					  </div>
					  <div class="form-group">
					    <label class="col-sm-2 control-label">联系方式：</label>
					    <div class="col-sm-10">
					      <input type="text" class="form-control" ng-model="ad.tel">
					    </div>
					  </div>
					  <div class="form-group">
					    <label class="col-sm-2 control-label">配送地址：</label>
					    <div class="col-sm-10">
					      <input type="text" class="form-control" ng-model="ad.address">
					    </div>
					  </div>
					  <div class="form-group">
					    <div class="col-sm-offset-2 col-sm-4">
					      <button type="submit" class="btn btn-default" ng-click="cancelAddAddr();">取消</button>
					    </div>
					    <div class=" col-sm-4">
					      <button type="submit" class="btn btn-primary" ng-click="submitAddAddr(ad);">确定</button>
					    </div>
					  </div>
					</form>
		         </div>
	         </div>
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
</body>
</html>