<%@ page language="java" pageEncoding="utf-8"%>
<%@ page import="org.slf4j.Logger,org.slf4j.LoggerFactory,org.json.*,java.text.SimpleDateFormat,java.sql.ResultSet,java.sql.Connection,java.sql.PreparedStatement,com.agilecontrol.nea.core.query.web.*,com.agilecontrol.nea.core.control.web.*,com.agilecontrol.nea.core.util.*,com.agilecontrol.nea.core.schema.*,com.agilecontrol.nea.core.query.*, java.io.*,java.util.*,com.agilecontrol.nea.core.control.util.*,com.agilecontrol.nea.core.report.*,com.agilecontrol.nea.core.web.bean.*,com.agilecontrol.nea.core.model.*, com.agilecontrol.nea.core.model.dao.*,com.agilecontrol.nea.util.*,org.apache.struts.Globals"%>
<%
String cmd = ConfigValues.get("report.cmd","com.agilecontrol.fair.FairCmd");
String sessionkey = request.getParameter("sessionkey");
String rptname = request.getParameter("name");
String locale = request.getParameter("locale");
if(locale==null||"".equals(locale))
  {locale="zh_CN";}
String theme = request.getParameter("theme");
if(theme==null||"".equals(theme))
  {theme="02";}
String title = request.getParameter("desc");
String allow_filter = request.getParameter("allow_filter");
String allow_f_filter = request.getParameter("allow_f_filter");
String date = String.valueOf(new Date().getTime());
int com_cnt = ConfigValues.get("fair.reportview900.support.component.count", 8);
String isback="";
if(request.getParameter("isback")!=null)
	isback=request.getParameter("isback");
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.5,user-scalable=yes" />
    <script type="text/javascript" src="js/vendor/prototype.js"></script>
    <script type="text/javascript" src="js/vendor/jquery-1.11.3.js"></script>
    <script type="text/javascript">jQuery.noConflict();</script>
    <script type="text/javascript" src="js/vendor/highcharts.js"></script>
    <script type="text/javascript" src="js/vendor/standalone-framework.js"></script>
    <script language="javascript" src="js/vendor/rest.js"></script>
    <script language="javascript" src="js/vendor/formatter.js?t=<%=date %>"></script>

    <script language='javascript' src='js/vendor/locale/locale_<%=locale %>.js' charset='utf-8'></script>

    <script language="javascript" src="js/vendor/component/com.js?t=<%=date %>" charset="utf-8"></script>
 <%
  for(int i = 0; i < com_cnt; i++){
%>
<script language="javascript" src="js/vendor/component/com_<%=i %>.js?t=<%=date %>" charset="utf-8"></script>
<%
  }
%>

  <script type="text/javascript" src="js/graphical_rptcontrol.js"></script>

<title>图形化报表</title>
</head>
<body >
    <div class="mask"></div>
  	<div id="rpt-banner" class='contents'>
  		<div id="rpt-buttons">
  			<ul>
  				<li onclick="rpt.back();" class="rpt-button" id="rpt-back">
  					<div class="rpt-button-value"></div>
  				</li>
			  	<li onclick="rpt.refresh();" class="rpt-button" id="rpt-refresh">
  					<div class="rpt-button-value"></div>
  				</li>
  			</ul>
		</div>
  		<ul id="rpt-filter" class="rpt-filter">
			<% if(allow_filter.equals("Y")){ %>
			<li id="c-filter" onclick="rpt.cFilter(this,'pdt');">查询条件</li>
			<%}else{%>
			<li id="c-filter" onclick="rpt.cFilter(this,'pdt');" style="display:none;">查询条件</li>
			<%}if(allow_f_filter.equals("Y")){ %>
			<li id="f-filter" onclick="rpt.cFilter(this,'buyer');">过滤买手</li>
			<%}else{%>
			<li id="f-filter" onclick="rpt.cFilter(this,'buyer');" style="display:none;">过滤买手</li>
			<%}%>
			<li id="df-filter"><select id="showstores" style="display:none;" onchange="rpt.refresh();"></select></li>
		</ul>
  	</div>
  	<div id="loading">
			<div id="loadinglocale"></div>
	</div>
 <div id="chart_container"></div>
 <script>
 jQuery(document).ready(function(){
 	rpt.load('<%=sessionkey%>','<%=rptname%>','<%=theme%>','<%=isback%>','<%=cmd%>');

 });
 </script>
</body>
</html>
