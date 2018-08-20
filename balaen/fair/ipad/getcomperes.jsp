<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>

<%@page errorPage="/nea/error.jsp"%>
<%@ include file="/nea/core/common/init.jsp" %>
<%@ page import="java.util.*" %>
<%
 String date = String.valueOf(new Date().getTime());
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="apple-touch-fullscreen" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
<meta name="viewport" content="width=300px,height=300px,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
<meta http-equiv="Cache-Control" content="max-age=0,no-store,no-cache,must-revalidate" />
<meta http-equiv="Expires" content= "-1" />
<meta http-equiv="Pragma" content="no-cache" />
<link type="text/css" rel="StyleSheet" href="/fair/ipad/css/common/getcomperes.css?=<%=date %>" />
<script type="text/javascript" src="/fair/ipad/js/prototype.js"></script>
<script type="text/javascript" src="/fair/ipad/js/jquery.js"></script>
<script type="text/javascript">jQuery.noConflict();</script>
<script language="javascript" src="/nea/core/js/rest.js"></script>
<script type="text/javascript" src="/fair/ipad/js/getcomperescontrol.js?=<%=date%>"></script>
</head>
<body>
	<!-- <div  id='back'  onclick="window.location.replace('/fair/ipad/suggest.jsp')" style="display:none;padding-top:20px;">返回</div> -->
	<div id="container">
	          <div  id='btnsave'  onclick=gcc.setCompere() >确定 </div>
		<table align="center" border="0" cellpadding="1" cellspacing="1" id="tb">

	 </table>
	</div>
	<script type="text/javascript">
		jQuery(document).ready(function(){
			gcc.load();
		});
	</script>
</body>
</html>