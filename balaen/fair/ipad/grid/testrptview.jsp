<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8"%>
<%@ page import="java.util.Date,com.agilecontrol.nea.core.web.config.*,org.slf4j.Logger,org.slf4j.LoggerFactory,org.json.*,java.text.SimpleDateFormat,java.sql.ResultSet,java.sql.Connection,java.sql.PreparedStatement,com.agilecontrol.nea.core.query.web.*,com.agilecontrol.nea.core.control.web.*,com.agilecontrol.nea.core.util.*,com.agilecontrol.nea.core.schema.*,com.agilecontrol.nea.core.query.*, java.io.*,java.util.*,com.agilecontrol.nea.core.control.util.*,com.agilecontrol.nea.core.report.*,com.agilecontrol.nea.core.web.bean.*,com.agilecontrol.nea.core.model.*, com.agilecontrol.nea.core.model.dao.*,com.agilecontrol.nea.util.*,org.apache.struts.Globals" %> 
<%
  String date = String.valueOf(new Date().getTime());
  String themeStyle = ConfigValues.get("fair.theme.style", "01");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta content="text/html;charset=utf-8" http-equiv="Content-Type">
	<title>报表测试页面</title>
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
	<link type="text/css" rel="stylesheet" href="/nea/core/themes/classic/01/css/objdropmenu.css">
	<link type="text/css" rel="StyleSheet" href="/nea/ext/themes/classic/01/portal.css">
	<link type="text/css" href="/fair/ipad/grid/css/test.css?t=<%=date %>" rel="StyleSheet"/>
	
	
	
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
	<script type="text/javascript">jQuery.noConflict();</script>
	<script language="javascript" src="/nea/core/js/rest.js?t=<%=date %>"></script>
	<script type="text/javascript" src="/fair/ipad/grid/js/testcontrol.js?t=<%=date %>"></script>
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
	<script language="javascript" src="/nea/core/js/objdropmenu.js"></script>
</head>
<body>
	<div id="getFunit">
		选择买手<span class="import">*</span>:&nbsp;&nbsp;
		<input id="funitId" readonly type="text"  size="20" maxlength="40" tabindex="2" name="b_funit_id"/>
		<input id='funit_exp'  type='text' style='display:none;'/>
		<input id='funit_sql' type='text' style='display:none;' />
		<span onclick="selectFunit()" title="funitid">	
		<img  width="16" height="16" border="0" align="absmiddle" title="Find" src="/nea/core/images/find.gif"/>
		</span>
</div>
		
		<div class="submit">
			<button onclick="getSessionKey()">进去测试报表中心</button>
		</div>
	 </div>
</body>
</html>