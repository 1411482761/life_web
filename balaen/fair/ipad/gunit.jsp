<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="java.util.*" %>
<%
 String sessionkey=request.getParameter("sessionkey");
 String pdtId= request.getParameter("id");
 String date = String.valueOf(new Date().getTime());
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

<link rel="stylesheet" href="/fair/ipad/css/common/main.css?=<%=date%>" type="text/css" media="screen" title="no title" charset="utf-8">
<link rel="stylesheet" href="/fair/ipad/css/common/gunit.css?=<%=date%>" type="text/css" media="screen" title="no title" charset="utf-8">
<script language="javascript" src="/fair/ipad/js/prototype.js"></script>
<script language="javascript" src="/fair/ipad/js/jquery.js"></script>
<script type="text/javascript">jQuery.noConflict();</script>
<script language="javascript" src="/fair/ipad/js/gunitcontrol.js?=<%=date %>" charset="utf-8"></script>

<script language="javascript" src="/nea/core/js/rest.js"></script>
<title>Balanced Order - Lifecycle RCP</title>
</head>
<body>
	<div id="container">
       <div id="refresh" onclick="gc.refresh();"></div>
		<div id="classicaltitle"></div>
		<div id="classicalcontext"></div>
		<div id="historytitle"></div>
		<div id="historycontext"></div>
		<div id="title"></div>
	    <div id="nosugg"></div>
	    <div id='loading'><div class='loadingimg'><div id='loadinglocale' class='loadinglocale'>加载中...</div></div></div>
		<div id="tags">
		<ul id="analysis">
		</ul>
		</div>
		<div id="context">
		</div>
	</div>
	<script type="text/javascript">
		jQuery(document).ready(function(){
			gc.loadScores('<%=sessionkey %>', <%=pdtId%>);
		});
	</script>
</body>
</html>