<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="java.util.*,org.slf4j.Logger,org.slf4j.LoggerFactory,org.json.*,java.text.SimpleDateFormat,java.sql.ResultSet,java.sql.Connection,java.sql.PreparedStatement,com.agilecontrol.nea.core.query.web.*,com.agilecontrol.nea.core.control.web.*,com.agilecontrol.nea.core.util.*,com.agilecontrol.nea.core.schema.*,com.agilecontrol.nea.core.query.*, java.io.*,java.util.*,com.agilecontrol.nea.core.control.util.*,com.agilecontrol.nea.core.report.*,com.agilecontrol.nea.core.web.bean.*,com.agilecontrol.nea.core.model.*, com.agilecontrol.nea.core.model.dao.*,com.agilecontrol.nea.util.*,org.apache.struts.Globals"%>
<%
 String date = String.valueOf(new Date().getTime());
 String sessionkey=request.getParameter("sessionkey");
 String pdtId= request.getParameter("id");
 
Object obj = QueryEngine.getInstance().doQueryOne("select value from ad_param where name='fair.marks.jumpUrl'");
 if(null!= obj){
	 if(!obj.toString().equals(""))
	 request.getRequestDispatcher(obj.toString()+"?pdtid="+pdtId+"&sessionkey="+sessionkey).forward(request,response);
	 return;
 }
 if("gunit".equals(QueryEngine.getInstance().doQueryOne("select value from ad_param where name='fair.marks.urltype'"))){
	 request.getRequestDispatcher("/fair/ipad/gunit.jsp?pdtid="+pdtId+"&sessionkey="+sessionkey).forward(request,response);
	 return;
	 }
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="Cache-Control" content= "no-cache"> 
<meta http-equiv="Expires" content= "0">
<meta name="apple-touch-fullscreen" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
<meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">

<link rel="stylesheet" href="/fair/ipad/css/common/main.css?t=<%=date %>" type="text/css" media="screen" title="no title" charset="utf-8">
<link rel="stylesheet" href="/fair/ipad/css/common/pdt_suggestion.css?t=<%=date %>" type="text/css" media="screen" title="no title" charset="utf-8">
<script language="javascript" src="/fair/ipad/js/prototype.js"></script>
<script language="javascript" src="/fair/ipad/js/jquery.js"></script>
<script type="text/javascript">jQuery.noConflict();</script>
<script language="javascript" src="/fair/ipad/js/suggestioncontrol.js?t=<%=date %>" charset="utf-8"></script>

<script language="javascript" src="/nea/core/js/rest.js"></script>
<title>Balanced Order - Lifecycle RCP</title>
</head>
<body>
	<div id="container">
		<div id="filter-top"></div>
		<div id="group-title" class="title">
			<input type="checkbox" value="group" checked="checked">
			<span onclick="suggestionc.toggle(this);">组评分：</span>
		</div>
		<div class="filter-div"></div>
		<div id="unscore"></div>
		<div id="group"></div>
		<div class="filter-div"></div>
		<div id="reference-title" class="title">
			<input type="checkbox" value="reference" checked="checked">
			<span onclick="suggestionc.toggle(this);">平均分：</span>
		</div>
		<div class="filter-div"></div>
		<div id="reference"></div>
	</div>
	<div id="nosugg">
		<div id="nosugg-locale"></div>
	</div>
	<script type="text/javascript">
		jQuery(document).ready(function(){
			suggestionc.loadScores('<%=sessionkey %>', <%=pdtId%>);
		});
	</script>
</body>
</html>