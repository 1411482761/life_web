<%@ page language="java" pageEncoding="utf-8"%>
<%@ page import="org.slf4j.Logger,org.slf4j.LoggerFactory,org.json.*,java.text.SimpleDateFormat,java.sql.ResultSet,java.sql.Connection,java.sql.PreparedStatement,com.agilecontrol.nea.core.query.web.*,com.agilecontrol.nea.core.control.web.*,com.agilecontrol.nea.core.util.*,com.agilecontrol.nea.core.schema.*,com.agilecontrol.nea.core.query.*, java.io.*,java.util.*,com.agilecontrol.nea.core.control.util.*,com.agilecontrol.nea.core.report.*,com.agilecontrol.nea.core.web.bean.*,com.agilecontrol.nea.core.model.*, com.agilecontrol.nea.core.model.dao.*,com.agilecontrol.nea.util.*,org.apache.struts.Globals"%>
<%
	UserWebImpl userWeb =null;
	Locale locale=null;
	int userId=0;
	try{
		userWeb= ((UserWebImpl)WebUtils.getSessionContextManager(session).getActor(WebKeys.USER));
		userId=userWeb.getUserId();
		locale=userWeb.getLocale();System.out.println("########## found userWeb=null##########221"+locale.toString());
	}catch(Throwable userWebException){
		System.out.println("########## found userWeb=null##########"+userWebException);
		locale=TableManager.getInstance().getDefaultLocale();
	}
 	String sessionkey = request.getParameter("sessionkey");
 	String date = String.valueOf(new Date().getTime());
%>
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="viewport" content="width=device-width initial-scale=1.0 maximum-scale=1.0 user-scalable=yes" />
	
	    <link  rel="stylesheet" href="/fair/ipad/css/jquery.mmenu/demo.css?t=<%=date %>" />
		<link  rel="stylesheet" href="/fair/ipad/css/jquery.mmenu/jquery.mmenu.all.css?t=<%=date %>" />
   		<link  rel="stylesheet" href="/fair/ipad/css/bootstrap/bootstrap.min.css?t=<%=date %>">
    
		<link  rel="stylesheet" href="/fair/ipad/css/common/main.css?t=<%=date %>" type="text/css" media="screen" title="no title" >
		<link  rel="stylesheet" href="/fair/ipad/css/common/overview.css?t=<%=date %>" type="text/css" media="screen" title="no title" >
	
		<!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
	    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
	    <!--[if lt IE 9]>
	      <script src="http://cdn.bootcss.com/html5shiv/3.7.2/html5shiv.min.js"></script>
	      <script src="http://cdn.bootcss.com/respond.js/1.4.2/respond.min.js"></script>
	    <![endif]-->
    
		<script src="/fair/ipad/js/prototype.js"></script>
		<script src="/fair/ipad/js/bootstrap/jquery-1.11.2.min.js?t=<%=date %>"></script>
		<script src="/fair/ipad/js/jquery.mmenu/jquery.mmenu.min.all.js?t=<%=date %>"></script>
		<script src="/fair/ipad/js/bootstrap/bootstrap.min.js?t=<%=date %>"></script>
		<script >jQuery.noConflict();</script>
		<script src="/fair/ipad/js/overviewcontrol.js?t=<%=date %>" charset="utf-8"></script>
		<script  src="/nea/core/js/rest.js"></script>
		<script src="/fair/ipad/js/formatter.js?t=<%=date %>" charset="utf-8"></script>
		<script src="/fair/ipad/js/runsql.js?t=<%=date %>" charset="utf-8"></script>

		<title>订货会总览图</title>
</head>
<body >
   	<div id="loading">
	           <div id="loadinglocale"></div>
	 </div>
	<div id="page" >
	
		<div class="header">
		<div></div>
			<a href="#menu" id="menu_icon"></a>
			订货会总览图
			<div class='visible-xs filter_sel' >
				<img alt="filter_select" width="24px" height="24px" src="/fair/ipad/img/stock_standard-filter.png" onclick="overviewc.show_select_xs();">
			</div>
		</div>

		<div class="content container">

<!-- 		 <div class="jingxiaoshang">
			<form class="form-inline general_select_u" >
			  <div class="form-group col-sm-12" id="select_user">
					<label class="sr-only"></label>
					<div class="input-group" id="select_user_div">
						<div class="input-group-addon">经销商</div> 
						<select onchange="overviewc.select_user();" class="form-control selectpicker_user"   style="width: 200px;">
						</select>
					</div>
				</div>
			</form>
		</div>
        <br> <hr class="general_select_u"> -->
        
		<div class='hidden-xs' id='div_general_select'>
			<form class="form-inline" id="general_select" >
				 <div class="form-group col-sm-3" id="select_user">
				 	<div class="general_select_u">
						<label class="sr-only"></label>
						<div class="input-group" id="select_user_div">
							<div class="input-group-addon">经销商</div> 
							<select onchange="overviewc.select_user();" class="form-control selectpicker_user" >
							</select>
						</div>
					</div>
				</div>
			</form>
		</div>
		
		<br><br>
		<p class="text-left first-tab-left"></p>
		<p class="text-right first-tab-right"></p>
       	<div class="row show-grid" id="first-tab">
          <!-- <div class="col-md-2 col-xs-3 col-sm-2"><div class="row"><div class="col-xs-12 div-head">数量</div><div class="col-xs-12 div-data">1</div></div></div>
          <div class="col-md-2 col-xs-3 col-sm-2"><div class="row"><div class="col-xs-12 div-head">场次</div><div class="col-xs-12 div-data">234</div></div></div> -->
      	</div>
     	<br>
     	<br>
		     	
       		<p class="text-left second-tab-left"></p>
       		<p class="text-right second-tab-right"></p>
	         <div class="table-responsive" style="clear:both;">
	         	<table class="table table-bordered table-condensed table-striped" id="second-tab">
				</table>
	         </div>
		</div>
		<nav id="menu">
		</nav>
	</div>
	<script type="text/javascript">
		jQuery(document).ready(function(){
			overviewc.init(<%=userId%>);
		});
	</script> 
</body>
</html>