<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page
	import="java.util.Date,com.agilecontrol.nea.core.web.config.*,org.slf4j.Logger,org.slf4j.LoggerFactory,org.json.*,java.text.SimpleDateFormat,java.sql.ResultSet,java.sql.Connection,java.sql.PreparedStatement,com.agilecontrol.nea.core.query.web.*,com.agilecontrol.nea.core.control.web.*,com.agilecontrol.nea.core.util.*,com.agilecontrol.nea.core.schema.*,com.agilecontrol.nea.core.query.*, java.io.*,java.util.*,com.agilecontrol.nea.core.control.util.*,com.agilecontrol.nea.core.report.*,com.agilecontrol.nea.core.web.bean.*,com.agilecontrol.nea.core.model.*, com.agilecontrol.nea.core.model.dao.*,com.agilecontrol.nea.util.*,org.apache.struts.Globals"%>
<%
	String date = String.valueOf(new Date().getTime());
	String cmd = ConfigValues.get("report.cmd",
			"com.agilecontrol.fair.FairCmd");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta content="text/html;charset=utf-8" http-equiv="Content-Type">
<title>表配置页面</title>
<link type="text/css"
	href="/fair/ipad/grid/css/basicrptconfig.css?t=<%=date%>"
	rel="StyleSheet" />
<script type="text/javascript"
	src="/fair/ipad/js/prototype.js?t=<%=date%>"></script>
<script type="text/javascript"
	src="/fair/ipad/grid/js/jquery.min.js?t=<%=date%>"></script>
<script type="text/javascript">jQuery.noConflict();</script>
<script language="javascript" src="/nea/core/js/rest.js?t=<%=date%>"></script>
<script type="text/javascript"
	src="/fair/ipad/grid/js/basicrptconfigcontrol.js?t=<%=date%>"></script>
</head>
<body>
	<div id="left">
		<div class="recreate" onclick="bc.newtable()">
			<img alt="" src="/fair/ipad/grid/images/new.png">
			<p style="font-size: 16px;">新建表</p>
		</div>
		<div class="target"></div>
	</div>
	<div id="middle" class="button">
		<button class="move" onclick="bc.moveup()">
				<img width="16" height="16" border="0" align="absmiddle"
					src="/nea/core/images/moveup.gif">
			</button>
			<button class="move" onclick="bc.movedown()">
				<img width="16" height="16" border="0" align="absmiddle"
					src="/nea/core/images/movedown.gif">
			</button>
	</div>
	<div id="right" class="configure">
		<p class="check">
			<span>表显示名称：</span><input class="reportname">
			<!-- <span class="reportname"></span> -->
		</p>
		<p>
			<span>表名称：</span> <input class="db_name">
		</p>
		<!-- <p>
			<span>表类型：</span> <select class="db_name" autocomplete="off" id="tabtype">
				<option value="basic">基础表</option>
				<option value="extend">扩展表</option>
				<option value="component">组件</option>
			</select>
		</p> -->
		<div class="button" style="display:none";>
			<button onclick="bc._savetableconfig()">保存</button>
			<button class='isnew' onclick="bc._deletetableconfig()">删除</button>
			<button onclick="bc._detailconfigure()" style="display: inline;">详细配置</button>
			<button
				onclick="window.location.replace('/fair/ipad/grid/getrptviews.jsp')">返回</button>

		</div>
	</div>
	<script type="text/javascript">
		jQuery(document).ready(function(){
			bc.load('<%=cmd%>');
		});
	</script>
</body>
</html>