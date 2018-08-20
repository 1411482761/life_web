<!DOCTYPE html>
<%@ page language="java" pageEncoding="utf-8"%>
<%@ page
	import="org.slf4j.Logger,org.slf4j.LoggerFactory,org.json.*,java.text.SimpleDateFormat,java.sql.ResultSet,java.sql.Connection,java.sql.PreparedStatement,com.agilecontrol.nea.core.query.web.*,com.agilecontrol.nea.core.control.web.*,com.agilecontrol.nea.core.util.*,com.agilecontrol.nea.core.schema.*,com.agilecontrol.nea.core.query.*, java.io.*,java.util.*,com.agilecontrol.nea.core.control.util.*,com.agilecontrol.nea.core.report.*,com.agilecontrol.nea.core.web.bean.*,com.agilecontrol.nea.core.model.*, com.agilecontrol.nea.core.model.dao.*,com.agilecontrol.nea.util.*,org.apache.struts.Globals"%>
<html ng-app="news">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
<%
   String loadIdx = request.getParameter("loadIdx");
   String newsid = request.getParameter("newsid");
%>
  <script type="text/javascript" src='/fair/ipad/js/AngularJS/angular.min1.4.2.js'></script>
  <script type="text/javascript" src="/fair/ipad/js/rest.js"></script>
  <script type="text/javascript" src='/fair/ipad/B2B/js/newscontrol.js'></script>
  <link rel="stylesheet" type="text/css" href="/fair/ipad/B2B/css/news.css">
  <link rel="stylesheet" href="/fair/ipad/css/bootstrap/bootstrap.min.css">   
<body ng-controller='newsController'>
	<!--banner-->
	<div id='top' class="navbar navbar-default navbar-fixed-top">
		<img alt="" src="/fair/ipad/B2B/images/nnt.jpg" style="width: 100%;">
	</div>	
	<div class='container wrapper' >
	   <div id='breadcrumb'>
         <ol class='breadcrumb'>
	       <li ng-repeat='row in bread' ng-bind='row.name' ng-click='quickpath(row)'></li>
         </ol> 
	   </div>
	   <hr/>
	   <div class='row'>
	   	  <div  class='col-lg-3'>
	   	  	 <div id="navigator">
	   	  	 <div class='nav-common nav-header'>媒体中心</div>

	   	  	 <div class='nav-common nav-item' ng-repeat='row in categories' ng-click='toggleCategory(row)'>
	   	  	 	<span class='glyphicon glyphicon-menu-right'></span>
	   	  	 	<span class='nav-text' ng-bind='row.name' ></span></div>
             </div>
	   	  </div> 
          <div  class='col-lg-8' >
          	 <div id='content-list' ng-if='isDetail'>
          	 	<div class='nav-common nav-header' ng-bind='categoryName'></div>
          	 	  <ul class='news-list'>
          	 	  	<li ng-repeat='row in newslist' ng-click='getContentDetail(row.id)'><span ng-bind='row.subject'></span><span class='pull-right' ng-bind='row.creationdate'></span>
          	 	  	</li>
          	 	  </ul>
          	 	</div>
          	 	<!---->
          	 	<div id='content-overall' ng-if='!isDetail'>
	          	 	<div id='content-header'>
	          	 		<div class='content-header' ng-bind='content_overall.subject'></div>
	          	 		<div style='margin-top:5px'>
	          	 			发布时间:<span ng-bind='content_overall.creationdate'></span>
	          	 			发布者:<span ng-bind='content_overall.author'></span>
	          	 		</div>
	          	 	</div>
	          	 	<div class='content-body'>	          	 	
	          	 		<div compile="content_body"></div>
	          	 	</div>
          	 	</div>

          </div>
	   </div>
	    <footer>
	    	<div class='container'>
	    	   <hr/>
               <div style="font-size: 14px;padding-bottom: 10px;color: rgb(102,102,102);">
	               <div ><span style='font-weight:900'>上海晨光文具股份有限公司</span> 版权所有</div>
	               <div>copyright 2015, Shanghai M&G Stationery INC./All Rights Reserved</div>
               </div>
            </div>   
       </footer>
	</div>
<script type="text/javascript">
	news.service('params',function() {
		this.loadIdx='<%=loadIdx%>';
		this.newsid='<%=newsid%>';
	})
</script>
</body>
</html>


