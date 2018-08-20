<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8"%>
<%@ page import="java.util.Date,com.agilecontrol.nea.core.web.config.*,org.slf4j.Logger,org.slf4j.LoggerFactory,org.json.*,java.text.SimpleDateFormat,java.sql.ResultSet,java.sql.Connection,java.sql.PreparedStatement,com.agilecontrol.nea.core.query.web.*,com.agilecontrol.nea.core.control.web.*,com.agilecontrol.nea.core.util.*,com.agilecontrol.nea.core.schema.*,com.agilecontrol.nea.core.query.*, java.io.*,java.util.*,com.agilecontrol.nea.core.control.util.*,com.agilecontrol.nea.core.report.*,com.agilecontrol.nea.core.web.bean.*,com.agilecontrol.nea.core.model.*, com.agilecontrol.nea.core.model.dao.*,com.agilecontrol.nea.util.*,org.apache.struts.Globals" %> 
<%
	String name = request.getParameter("name");
  	String date = String.valueOf(new Date().getTime());
  	 String cmd=ConfigValues.get("report.cmd", "com.agilecontrol.fair.FairCmd");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta content="text/html;charset=utf-8" http-equiv="Content-Type">
	<title>表配置页面</title>
	<link type="text/css" href="css/share.css?t=<%=date %>" rel="StyleSheet"/>
	<link type="text/css" href="css/reportconfig.css?t=<%=date %>" rel="StyleSheet"/>
	<script type="text/javascript" src="js/prototype.js?t=<%=date %>"></script>
	<script type="text/javascript" src="js/jquery.min.js?t=<%=date %>"></script>
	<script type="text/javascript">jQuery.noConflict();</script>
	<script language="javascript" src="js/rest.js?t=<%=date %>"></script>
	<script type="text/javascript" src="js/jquery-ui.min.js?t=<%=date %>"></script>
	<script type="text/javascript" src="js/jquery.touch-punch.min.js?t=<%=date %>"></script>
	<script type="text/javascript" src="js/jquery.shapeshift.js?t=<%=date %>"></script>
	<script type="text/javascript" src="js/reportconfigcontrol.js?t=<%=date %>"></script>
</head>
<body>
	<div class="container">
		<!--纵轴-->
		<div class="vertical">
		</div>
		<!--横轴-->
		<div class="horizontal">
		</div>
		<!--度量-->
		<div class="metric">
		</div>
		<!--垃圾桶-->
		<div class="trash">
			
		</div>
	</div>
	<div id="rpt-loading" class="mainpageajax">
		<div id="loading">
			<div id="loadinglocale">处理中...</div>
		</div>
	</div>
	<div class="list">
		<!--column-->
		<div class="column">
			<!--<div>尺寸</div><div>订量</div><div>订货吊牌</div><div>订货金额</div>-->
		</div>
	</div>
	<!--右边栏 配置信息-->
	<div class="target">
	</div>
	<!--提交按钮-->
	
	<div class="submit">
		<button onclick="window.location.replace('getrptviews.jsp')">返回</button>
		<button onclick="window.location.replace('relate.jsp?tbname=<%=name%>')">关联关系</button>
		<button onclick="window.location.replace('filterdef.jsp?tbname=<%=name%>')">过滤条件</button>
		<button onclick="window.location.replace('sortdef.jsp?tbname=<%=name%>')">排序</button>
		<button onclick="reportconfigcontrol._setcolumns()">设置</button><button style="display:none;">预览</button>
		<button onclick="reportconfigcontrol._saveRptDef()">保存</button>
	</div>
	<script type="text/javascript">
		jQuery(document).ready(function(){
			reportconfigcontrol._loadleftdata('<%=name%>','<%=cmd%>');
		});
	</script>
</body>
</html>