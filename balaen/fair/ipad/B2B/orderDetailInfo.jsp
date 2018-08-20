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
 	String orderId = request.getParameter("orderId");
 	String docno = request.getParameter("docno");
 	
%>
<!DOCTYPE html>
<html ng-app="b2bOrderDetailInfo">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width initial-scale=1.0 maximum-scale=1.0 user-scalable=yes" />
    <link rel="stylesheet" href="/fair/ipad/css/bootstrap/bootstrap.min.css">
    <link rel="stylesheet" href="/fair/ipad/B2B/css/loading-bar.css">
    <link rel="stylesheet" href="/fair/ipad/B2B/css/orderDetailInfo.css?t=<%=date %>">

	<script src="/fair/ipad/js/AngularJS/angular.min1.4.2.js"></script>
	
	<script src="/fair/ipad/B2B/js/tm.pagination.js"></script>
	
    <script src="/fair/ipad/js/AngularJS/angular-route.min.js"></script>
    <script src="/fair/ipad/js/AngularJS/angular-touch.min.js"></script>
    <script src="/fair/ipad/js/bootstrap/ui-bootstrap-tpls-0.13.0.min.js"></script>
    <script src="/fair/ipad/B2B/js/loading-bar.min.js"></script>
    <script type="text/javascript" src="/fair/ipad/js/rest.js"></script>
    <script src="/fair/ipad/B2B/js/orderDetailInfo.js?t=<%=date %>"></script>
  	    <script language="javascript" type="text/javascript">
  	  	b2bOrderDetailInfo.service('initService',function(){
		   this.userid='<%=userId%>';
		   this.loadIdx='<%=loadIdx%>';
		   this.fairid=<%=fairid%>;
		   this.orderId='<%=orderId%>';
		   this.docno='<%=docno%>';
		   this.isEndUser=<%=isEndUser%>;
		});
	</script>
    <title>B2B订单详情</title>
</head>
<body class="hidden-xs">
<!-- <div  ng-init="load()"  class="app-content ng-scope" ng-controller="mainCtr"> -->
<div class="app-content ng-scope" ng-controller="mainCtr">
<nav class="navbar-default navbar-fixed-top">
	  <div class="container-fluid">
		<div class="row top" >
		    <div class="head-margin">
	   			<span class="welcome-text">您好，欢迎 <%= userWeb.getUserDescription() %>！</span>
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
</nav>
<nav class=" navbar-default top-fix">
	<img alt="" src="/fair/ipad/B2B/images/nnt.jpg" style="width: 100%;">
</nav>

<hr style="border:3px rgb(201,25,36) solid;margin-bottom: 6px;margin-top: 0px">

<div class="container" style="height: 80%;">
	<div class="detail-head">
		<!-- <div class="detail-left"><a ng-click="$back();">返回</a></div> -->
		<h3  class="detail-center">单据编号：{{docno}} 订单详情</h3>
		<div class="detail-right"><label for="chkAll" style="float: left;line-height: 44px;"><input id="chkAll" type="checkbox" ng-model="chkall"  ng-click="chkAll(chkall)"/>全选</label>&nbsp;<button type="button" class="btn btn-mg btn-lg {{isRem}}" ng-click="exportOrderDetail();">导出</button></div>
	</div>
	
     <div class="row" style="height: 120%;">
         	<div class="table-responsive table_data">
				<table-all  order-details="orderDetails"></table-all>
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
</body>
</html>