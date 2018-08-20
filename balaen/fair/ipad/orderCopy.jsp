<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page
	import="java.util.Date,com.agilecontrol.nea.core.web.config.*,org.slf4j.Logger,org.slf4j.LoggerFactory,org.json.*,java.text.SimpleDateFormat,java.sql.ResultSet,java.sql.Connection,java.sql.PreparedStatement,com.agilecontrol.nea.core.query.web.*,com.agilecontrol.nea.core.control.web.*,com.agilecontrol.nea.core.util.*,com.agilecontrol.nea.core.schema.*,com.agilecontrol.nea.core.query.*, java.io.*,java.util.*,com.agilecontrol.nea.core.control.util.*,com.agilecontrol.nea.core.report.*,com.agilecontrol.nea.core.web.bean.*,com.agilecontrol.nea.core.model.*, com.agilecontrol.nea.core.model.dao.*,com.agilecontrol.nea.util.*,org.apache.struts.Globals"%>
<%
	String date = String.valueOf(new Date().getTime());
	String id = request.getParameter("id");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta content="text/html;charset=utf-8" http-equiv="Content-Type">
<title>订单复制</title>
<link rel="stylesheet" href="/fair/ipad/grid/css/zTreeStyle/zTreeStyle.css" type="text/css">
<link rel="stylesheet" href="/fair/ipad/grid/css/zTreeStyle/demo.css" type="text/css">
<link href="/fair/ipad/css/common/orderCopy.css?t=<%=date%>" rel="stylesheet" />
<script type="text/javascript" src="/nea/core/js/prototype.js?t=<%=date%>"></script>
<script src="/fair/ipad/js/jquery-1.11.3.js?t=<%=date%>"></script>
<script type="text/javascript" src="/fair/ipad/grid/js/jquery.ztree.core-3.5.js"></script>
<script type="text/javascript" src="/fair/ipad/grid/js/jquery.ztree.excheck-3.5.js"></script>
<script type="text/javascript">jQuery.noConflict();</script>
<script language="javascript" src="/nea/core/js/rest.js?t=<%=date%>"></script>
<script type="text/javascript" src="/fair/ipad/js/orderCopycontrol.js?t=<%=date%>"></script>
</head>
<body>
	<div id="yinying">
	<div style=" display:none" class="spinner">
		<div class="spinner-container container1">
		    <div class="circle1"></div>
		    <div class="circle2"></div>
		    <div class="circle3"></div>
		    <div class="circle4"></div>
		  </div>
		  <div class="spinner-container container2">
		    <div class="circle1"></div>
		    <div class="circle2"></div>
		    <div class="circle3"></div>
		    <div class="circle4"></div>
		  </div>
		  <div class="spinner-container container3">
		    <div class="circle1"></div>
		    <div class="circle2"></div>
		    <div class="circle3"></div>
		    <div class="circle4"></div>
		  </div>
	</div>  
	</div>
		<div class="content_wrap">
			<div class="zTreeDemoBackground left">
				<ul id="treeDemo1" class="ztree"></ul>
			</div>
			<div class="zTreeDemoBackground left">
				<ul id="treeDemo2" class="ztree"></ul>
			</div>
			<div class="ordercopy-left">
				<input type="text" id="key" value="" placeholder="买手的编号或者名称" />
				<input type="button" class="btn search" value="搜索" onclick="ocl.search();"/>
			</div>
		</div>
		<div class="result">
			<div class="info"><span id="state"></span><br><span id="resultspan"></span></div>
			<input type="button" class="btn" value="确认" onclick="ocl.commit();"/>
		</div>
</body>
  <script type="text/javascript">
		jQuery(document).ready(function(){
			ocl.init(<%=id%>);
		});
  </script>
</html>