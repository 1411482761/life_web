<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@page errorPage="/nea/error.jsp"%>
<%@ include file="/nea/core/common/init.jsp" %>
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
<script language="javascript" src="/nea/core/js/top_css_ext.js"></script>
<script language="javascript1.5" src="/nea/core/js/ieemu.js"></script>
<script language="javascript" src="/nea/core/js/cb2.js"></script>
<script language="javascript" src="/nea/core/js/xp_progress.js"></script>
<script language="javascript" src="/nea/core/js/helptip.js"></script>
<script language="javascript" src="/nea/core/js/common.js"></script>
<script language="javascript" src="/nea/core/js/print.js"></script>

<link rel="stylesheet" href="/fair/ipad/css/comments.css?t=<%=date %>"
	type="text/css" media="screen" title="no title" charset="utf-8">
<script language="javascript" src="/fair/ipad/js/prototype.js"></script>
<script language="javascript" src="/fair/ipad/js/jquery.js"></script>
<script type="text/javascript">jQuery.noConflict();</script>

<script language="javascript" src="/nea/core/js/formkey.js"></script>
<script language="javascript" src="/nea/core/js/selectableelements.js"></script>
<script language="javascript" src="/nea/core/js/selectabletablerows.js"></script>
<script type="text/javascript" src="/nea/core/js/controller.js"></script>
<script type="text/javascript" src="/nea/core/js/dwr.engine.js"></script>
<script type="text/javascript" src="/nea/core/js/dwr.util.js"></script>
<script language="javascript" src="/nea/core/js/application.js"></script>
<script language="javascript" src="/nea/core/js/alerts.js"></script>
<script language="javascript" src="/nea/core/js/dw_scroller.js"></script>
<script language="javascript" src="/nea/core/js/portletcontrol.js"></script>
<script language="javascript" src="/nea/core/js/init_portalcontrol_<%=locale.toString()%>.js"></script>
<script language="javascript" src="/nea/core/js/object_query.js"></script>
<script language="javascript" src="/nea/core/js/categorymenu.js"></script>
<script language="javascript" src="/nea/core/js/dockmenu.js"></script>
<script language="javascript" src="/nea/core/js/outline.js"></script>
<script language="javascript" src="/nea/core/js/rest.js"></script>

<script language="javascript" src="/fair/ipad/js/commentscontrol.js"></script>
<title>Charles & Keith - OrderingBoard</title>
</head>
<body>
	<div id="container">
		<div class="banner">
			<div id="savebutton" onclick="commentsc.save();">Save</div>
		</div>
		<div id="content">
			<div id="infotip"></div>
			<div id="publish"><textarea id="yours"></textarea></div>
			<div id="discussion">
				<ul  id="comments"></ul>
			</div>
		</div>
	</div>
	<script type="text/javascript">
		jQuery(document).ready(function(){
			commentsc.loadComments('<%=sessionkey %>', <%=pdtId%>);
		});
	</script>
</body>
</html>