<!DOCTYPE html>
<%@ page language="java" pageEncoding="utf-8"%>
<%@ page
	import="org.slf4j.Logger,org.slf4j.LoggerFactory,org.json.*,java.text.SimpleDateFormat,java.sql.ResultSet,java.sql.Connection,java.sql.PreparedStatement,com.agilecontrol.nea.core.query.web.*,com.agilecontrol.nea.core.control.web.*,com.agilecontrol.nea.core.util.*,com.agilecontrol.nea.core.schema.*,com.agilecontrol.nea.core.query.*, java.io.*,java.util.*,com.agilecontrol.nea.core.control.util.*,com.agilecontrol.nea.core.report.*,com.agilecontrol.nea.core.web.bean.*,com.agilecontrol.nea.core.model.*, com.agilecontrol.nea.core.model.dao.*,com.agilecontrol.nea.util.*,org.apache.struts.Globals"%>
<html ng-app="app">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<%
	UserWebImpl userWeb = null;
	Locale locale = null;
	try {
		userWeb = ((UserWebImpl) WebUtils.getSessionContextManager(
				session).getActor(WebKeys.USER));
		locale = userWeb.getLocale();
		System.out.println("########## found userWeb=null##########221"
				+ locale.toString());
	} catch (Throwable userWebException) {
		System.out.println("########## found userWeb=null##########"
				+ userWebException);
		locale = TableManager.getInstance().getDefaultLocale();
	}
	Date date = new Date();
	String id = request.getParameter("id");
%>

<script type="text/javascript" src="/nea/core/js/top_css_ext.js"></script>
<script language="javascript1.5" src="/nea/core/js/ieemu.js"></script>
<script type="text/javascript" src="/nea/core/js/cb2.js"></script>
<script type="text/javascript" src="/nea/core/js/xp_progress.js"></script>
<script type="text/javascript" src="/nea/core/js/helptip.js"></script>
<script type="text/javascript" src="/nea/core/js/common.js"></script>
<script type="text/javascript" src="/nea/core/js/print.js"></script>
<script type="text/javascript" src="/nea/core/js/prototype.js"></script>
<script type="text/javascript" src="/nea/core/js/jquery1.3.2/jquery-1.3.2.min.js"></script>
<script type="text/javascript" src="/nea/core/js/jquery1.2.3/hover_intent.js"></script>
<script>
	jQuery.noConflict();
</script>		
<script type="text/javascript" src="/nea/core/js/portal/sniffer.js"></script>
<script type="text/javascript" src="/nea/core/js/portal/ajax.js"></script>
<script type="text/javascript" src="/nea/core/js/portal/util.js"></script>
<script type="text/javascript" src="/nea/core/js/portal/portal.js"></script>
<script type="text/javascript" src="/nea/core/js/xloadtree111/xtree.js"></script>
<script type="text/javascript" src="/nea/core/js/xloadtree111/xmlextras.js"></script>
<script type="text/javascript" src="/nea/core/js/xloadtree111/xloadtree.js"></script>
<script type="text/javascript" src="/nea/core/js/formkey.js"></script>
<script type="text/javascript" src="/nea/core/js/selectableelements.js"></script>
<script type="text/javascript" src="/nea/core/js/selectabletablerows.js"></script>
<script type="text/javascript" src="/nea/core/js/portal/dragdrop/coordinates.js"></script>
<script type="text/javascript" src="/nea/core/js/portal/dragdrop/drag.js"></script>
<script type="text/javascript" src="/nea/core/js/calendar.js"></script>
<script type="text/javascript" src="/nea/core/js/controller.js"></script>
<script type="text/javascript" src="/nea/core/js/dwr.engine.js"></script>
<script type="text/javascript" src="/nea/core/js/dwr.util.js"></script>
<script type="text/javascript" src="/nea/core/js/application.js"></script>
<script type="text/javascript" src="/nea/core/js/alerts.js"></script>
<script type="text/javascript" src="/nea/core/js/dw_scroller.js"></script>
<script type="text/javascript" src="/nea/core/js/portletcontrol.js"></script>
<script type="text/javascript" src="/nea/core/js/init_portalcontrol_zh_CN.js"></script>
<script type="text/javascript" src="/nea/core/js/fixedtableheader.js"></script>
<script type="text/javascript" src="/nea/core/js/portalcontrol.js"></script>
<script type="text/javascript" src="/nea/core/js/object_query.js"></script>
<script type="text/javascript" src="/nea/core/js/categorymenu.js"></script>
<script type="text/javascript" src="/nea/core/js/dockmenu.js"></script>
<script type="text/javascript" src="/nea/core/js/outline.js"></script>
<script type="text/javascript" src="/nea/core/js/jquery1.3.2/ui.core.js"></script>
<script type="text/javascript" src="/nea/core/js/jquery1.3.2/ui.dialog.js"></script>
<script type="text/javascript" src="/nea/core/js/jquery1.3.2/ui.draggable.js"></script>
<script type="text/javascript" src="/nea/core/js/jquery1.3.2/ui.resizable.js"></script>
<script type="text/javascript" src="/nea/core/js/jquery1.3.2/jquery.bgiframe.js"></script>
<script type="text/javascript" src="/nea/core/js/jquery1.3.2/ui.tabs.js"></script>
<script type="text/javascript" src="/nea/core/js/messagescontrol.js"></script>
<script type="text/javascript" src="/nea/core/js/jquery.alerts.js"></script>


<!-- <script type="text/javascript" src="/fair/ipad/js/jquery1.11.3.js"></script> -->
 
	



<script type="text/javascript" src='/fair/ipad/js/angular.min.js'></script>
<script type="text/javascript" src="/fair/ipad/js/rest.js"></script>


<script type="text/javascript"
	src="/fair/ipad/js/locale/locale_<%=locale.toString()%>.js"></script>
<script type="text/javascript"
	src="/fair/ipad/js/updatesku.js?t=<%=new Date().getTime()%>"></script>
<link type="text/css" rel="stylesheet" href="/nea/core/js/xloadtree111/xtree.css" />
<link type="text/css" rel="StyleSheet" href="/nea/core/css/portlet.css">
<link type="text/css" rel="stylesheet" href="/nea/core/themes/classic/01/css/object.css">
<link type="text/css" rel="stylesheet" href="/nea/core/themes/classic/01/css/portal_header.css">
<link type="text/css" rel="stylesheet" href="/nea/core/themes/classic/01/css/portal.css">
<link type="text/css" rel="StyleSheet" href="/nea/core/css/cb2.css">
<link type="text/css" rel="stylesheet" href="/nea/core/css/jquery.alerts.css">
<link type="text/css" rel="stylesheet" href="/nea/core/themes/classic/01/css/nds_portal.css">
<link type="text/css" rel="stylesheet" href="/nea/core/themes/classic/01/css/dockmenu.css">
<link type="text/css" rel="StyleSheet" href="/nea/core/themes/classic/01/css/custom-ext.css" />
<link type="text/css" rel="StyleSheet" href="/nea/core/themes/classic/01/css/ui.tabs.css" />
<link type="text/css" rel="stylesheet" href="/nea/core/themes/ui-lightness/ui.all.css" />
<script language="javascript" src="/nea/core/js/objdropmenu.js"></script>
<link type="text/css" rel="stylesheet" href="/nea/core/themes/classic/01/css/objdropmenu.css">
<link type="text/css" rel="StyleSheet" href="/nea/ext/themes/classic/01/portal.css">
<script language="javascript" src="/nea/ext/js/portal.js"></script>
  <link rel="stylesheet"
	href="/fair/ipad/css/bootstrap/bootstrap.min.css">   
<title></title>
</head>
<body ng-controller="MyCtrl" >
			<div id="loading" ng-show="loading">
				<div id="loadinglocale">{{load}}</div>
			</div>
	<div id='left' ng-controller="ListCtrl">
		<div id='mylist'>
			<div id="listhead">
				<input id='pdt_desc' ng-model='desc' type='text' title='11' ng-keydown="entersearch()"/>
				<input id='pdt_exp' ng-model='exp' type='text' style='display:none;'/>
				<input id='pdt_sql ' ng-model='sql' type='text' style='display:none;' />
				<button ng-click='search()' type='button' class='btn btn-default' style='background-color:#c7c7c7;color:#fff'>搜索</button>
				<span id="popup" class="coolButton" onclick='setCondition()' title="popup"><img  border="0"  width="20" height="20" alt="Find" src="/nea/core/images/filterobj.gif"/>
                     </span>
				<table id="scrolltb" border="0">
					<tr>
						<td height='16'><img width="16" height="16"
							src="/nea/core/images/begin.gif" ng-click='start()'/></td>
						<td height='16'><img width="16" height="16"
							src="/nea/core/images/back.gif" ng-click='back()'/></td>
						<td height='16'><img width='16' height='16'
							src='/nea/core/images/next.gif' ng-click='next()'/></td>
						<td height='16'><img width='16' height='16'
							src='/nea/core/images/end.gif' ng-click='end()'/></td>
						<td height='16'><span style="font-size: 12px">第{{page}}页(共{{total}}页)</span>
						</td>
					</tr>
				</table>			              
			</div>
				
			<table id="listtb"  class="table">
				<tr ng-repeat='row in pdts'   ng-click='togglePdt($index)' style='height:60px'>
					<td id='pdtimg' style='width:60px ;padding:0'><img  src='/pdt/s/{{row.image}}' style='height:100%'></img></td>
					<td id='pdt{{$index}}' style='cursor:pointer' ng-class="{selected:{{index}}==$index}"><span style='padding-left:20px'>{{row.pdtdesc}}</span>
			          <ul>
							<li >金额:￥{{row.price}}</li>
							<li >订量:{{row.qty}}</li>	
					</ul>
					</td>
					
				</tr>			
			</table>
			<p id="orderitem"></p>
		</div>

		<div id='pdtinfo'>
			<div id='pdtpic' style='height:100%; width: 220px;'></div>
			<div id='pdt' style='margin-left:225px'></div>
		</div>
		</div>
		<div id="leftdown" >

			<div id="sheet" class="main-button">
				<ul>
					<li ng-repeat='step in steps' ng-click="toggle($index,step.cmd);"
						ng-class="{selected:elem.option==$index}">{{step.name}}</li>
				</ul>
			</div>
			<div id="buttons" class="main-button">
				<div class="buttons" ng-repeat='func in funcs'
					ng-click="buttonclick(func.cmd);">
					<div class="button-desc">{{func.name}}</div>
				</div>
			</div>
			<div id='mygrid'>
				<table class='gridStyle' id='mytable'>
					<tr ng-repeat="row in table" ng-class="{table_head:0==$index}">
						<td ng-repeat="cell in row" ng-switch="cell.style"
							ng-class="{unedit_cell:0!=cell.trindex&&cell.style!='input'}">
							<input ng-model=cell.v ng-switch-when="input"
							ng-click="inputClick(cell.trindex,$index)"> <input
							ng-model="cell.v" ng-switch-when="checkbox" type='checkbox'
							ng-true-value="1" ng-false-value="0" ng-checked="cell.v"> <span
							ng-switch-when="f">{{$eval(cell.v)}}</span> <span
							ng-switch-when="">{{cell.v}}</span>
						</td>
					</tr>
				</table>
			</div>

		</div>
</body>

<script type="text/javascript">
	angular.module("app").service('init', function() {
		this.orderid =
<%=id%>
	;
	});
</script>
<link rel="stylesheet" type="text/css"
	href="/fair/ipad/css/common/updatesku.css" />
</html>

