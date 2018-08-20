<%@ page language="java" pageEncoding="utf-8"%>
<%@ page import="org.slf4j.Logger,org.slf4j.LoggerFactory,org.json.*,java.text.SimpleDateFormat,java.sql.ResultSet,java.sql.Connection,java.sql.PreparedStatement,com.agilecontrol.nea.core.query.web.*,com.agilecontrol.nea.core.control.web.*,com.agilecontrol.nea.core.util.*,com.agilecontrol.nea.core.schema.*,com.agilecontrol.nea.core.query.*, java.io.*,java.util.*,com.agilecontrol.nea.core.control.util.*,com.agilecontrol.nea.core.report.*,com.agilecontrol.nea.core.web.bean.*,com.agilecontrol.nea.core.model.*, com.agilecontrol.nea.core.model.dao.*,com.agilecontrol.nea.util.*,org.apache.struts.Globals"%>
<%
	UserWebImpl userWeb =null;
	Locale locale=null;
	int userId=0;
	try{
		userWeb= ((UserWebImpl)WebUtils.getSessionContextManager(session).getActor(WebKeys.USER));
		userId=userWeb.getUserId();
		locale=userWeb.getLocale();
	}catch(Throwable userWebException){
		System.out.println("########## found userWeb=null##########"+userWebException);
		locale=TableManager.getInstance().getDefaultLocale();
	}
 	String sessionkey = request.getParameter("sessionkey");
 	String date = String.valueOf(new Date().getTime());
%>
<!DOCTYPE html>
<html ng-app="b2b">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width initial-scale=1.0 maximum-scale=1.0 user-scalable=yes" />
    <link rel="stylesheet" href="/fair/ipad/css/bootstrap/bootstrap.min.css">
    <link rel="stylesheet" href="/fair/ipad/B2B/css/loading-bar.css">

	<script src="/fair/ipad/js/AngularJS/angular.min1.4.2.js"></script>
    <script src="/fair/ipad/js/AngularJS/angular-route.min.js"></script>
    <script src="/fair/ipad/js/AngularJS/angular-touch.min.js"></script>
    <script src="/fair/ipad/B2B/js/loading-bar.min.js"></script>
    <script type="text/javascript" src="/fair/ipad/js/rest.js"></script>
    <script src="/fair/ipad/B2B/js/options.js?t=<%=date %>"></script>
    <script language="javascript" type="text/javascript">
		window.onload = function(){
			window.moveTo(0, 0);
			window.resizeTo(screen.availWidth, screen.availHeight);
			//window.focus(); 
		};
	</script>
	<style type="text/css">
		.top{
			height: 36px;
		}
		.top div{
			height:36px;
			line-height: 36px;
		}
		.order-center {
		    color:red;
		    font-size: 16px;
		    font-family:Arial;
		    text-align: center;
		    cursor: pointer;
		}
		.app-content {
			overflow:-moz-scrollbars-vertical;
		    display: block;
		    height: 100%;
		    overflow: hidden;
		    padding: 0;
		    width: 100%;
		}
		.options{
			position: absolute;
			left: 20%;
			width: 60%;
			top: 30%;
			-webkit-border-radius: 10px;
			-webkit-box-shadow: 0px 0px 30px #06C;
		
			text-align: center;
		}
		
		.options_tab tr,.options_tab td{
			border: 1px solid rgb(200,22,35)!important;
		}
		.options_tab tr:HOVER{
			background-color: rgb(200,22,35)!important;
			color: white;
		}
		#page-niche-menu span{
			color: rgb(200,22,35);
		}
		#page-niche-menu a:HOVER{
			text-decoration: none;
			color: rgb(200,22,35);
		}
@media (min-width: 1200px) {
    .pdt{
		min-height:300px; 
		height:auto !important; 
		overflow:auto;
	}
} 
/* 显示器 */
@media (max-width: 1920px) {
	.top-fix{
		margin-top: 8%;    
    }
    .welcome-text{
    	width: 130%;
    	margin-left: -10%;
    }
}
/* 笔记本 */
@media (max-width: 1370px) {
	.order-center{
    	font-size: 12px;
    }
    .welcome-text{
    	font-size: 12px;
    	width: 120%;
    	margin-left: -20%;
    }

}
           
@media screen and (min-width: 960px) and (max-width: 1199px) { 
	.order-center{
    	font-size: 12px;
    }
    .welcome-text{
    	font-size: 12px;
    	width: 160%;
    	margin-left: -30%;
    }
    .top-fix{
		margin-top: 10%;    
    }
} 
@media screen and (min-width: 768px) and (max-width: 959px) {
    .welcome-text{
    	font-size: 12px;
    	width: 160%;
    	margin-left: -40%;
    }
    .order-center{
    	font-size: 10px;
    }
     .top-fix{
		margin-top: 10%;    
    }
} 
@media only screen and (min-width: 480px) and (max-width: 767px){ 
    .welcome-text{
    	font-size: 8px;
    	width: 160%;
    	margin-left: -40%;
    }
    .order-center{
    	font-size: 8px;
    }
} 
@media only screen and (max-width: 479px) { 
}
</style>
    <title>供应商选择</title>
</head>
<body class="hidden-xs">
<%-- 	<nav class="navbar navbar-default navbar-fixed-top">
	  <div class="container-fluid">
	    <div class="row top" >
		    <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2"><a href="#" rel="sidebar" ng-click="addFavorite();">收藏晨光</a></div>
		    <div class="col-lg-offset-5 col-lg-2  col-md-offset-5 col-md-2  col-sm-offset-2 col-sm-3 col-xs-offset-2 col-xs-3"><p class="welcome-text">您好，欢迎 <%= userWeb.getUserDescription() %>！</p></div>	
            <div class="order-center col-lg-2 col-md-2 col-sm-3 col-xs-3" onclick="window.open('/nea/core/portal')">管理中心</div>
            <div class="col-lg-1 col-md-1 col-sm-2 col-xs-2"><a class="top-text btn btn-default" style="padding: 2px 8px;color: red;" href="/control/logout"><%= PortletUtils.getMessage(pageContext, "sign-out",null)%></a></div>	
		</div>
	  </div>
	
	  <img alt="" src="/fair/ipad/B2B/images/nnt.jpg" style="width: 100%;">
	</nav> --%>
<div   class="app-content ng-scope" ng-controller="mainCtr">
<options load="load(index)"  ng-if="optionsLength>1"></options>
<options ng-init=load(0)  ng-if="optionsLength==1"></options>
</div>
</body>
</html>