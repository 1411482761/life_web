<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page import="org.slf4j.Logger,org.slf4j.LoggerFactory,org.json.*,java.text.SimpleDateFormat,java.sql.ResultSet,java.sql.Connection,java.sql.PreparedStatement,com.agilecontrol.nea.core.query.web.*,com.agilecontrol.nea.core.control.web.*,com.agilecontrol.nea.core.util.*,com.agilecontrol.nea.core.schema.*,com.agilecontrol.nea.core.query.*, java.io.*,java.util.*,com.agilecontrol.nea.core.control.util.*,com.agilecontrol.nea.core.report.*,com.agilecontrol.nea.core.web.bean.*,com.agilecontrol.nea.core.model.*, com.agilecontrol.nea.core.model.dao.*,com.agilecontrol.nea.util.*,org.apache.struts.Globals"%>
<% 
   String date = String.valueOf(new Date().getTime());
%>
<!DOCTYPE html>
<html>
<head>
<title>圈款复制</title>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link href="/fair/ipad/css/common/copy_pdt_area.css?t=<%=date%>" rel="stylesheet" />
<script type="text/javascript" src="/nea/core/js/prototype.js?t=<%=date%>"></script>
<script src="/fair/ipad/js/jquery-1.11.3.js?t=<%=date%>"></script>
<script type="text/javascript">jQuery.noConflict();</script>
<script type="text/javascript" src="/nea/core/js/rest.js"></script>
<script type="text/javascript" src="/fair/ipad/js/copy_pdt_area.js?t=<%=date%>"></script>

</head>
<body>
		<div class="main">
			<div id="only" class="only">
			<div class="title"><span>已圈款用户</span></div>
				<div class="content"><ul id="onlyList"></ul></div>
			</div>
			<div id="mutli" class="mutli">
			<div class="title"><span>目标用户</span><input id="selectAll" type="checkbox" onClick="cpa.selectAll()"/>全选</div>
				<div class="content"><ul id="mutliList"></ul></div>
			</div>
		</div>
		<div class="result">
			<div class="info"><span id="fromIdspan"></span><br><span id="toIdspan"></span><span id="resultspan"></span></div>
			<input type="button" class="btn" value="确认" onclick="cpa.start();"/>
		</div>
</body>
</html>
