<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="org.slf4j.Logger,org.slf4j.LoggerFactory,org.json.*,java.text.SimpleDateFormat,java.sql.ResultSet,java.sql.Connection,java.sql.PreparedStatement,com.agilecontrol.nea.core.query.web.*,com.agilecontrol.nea.core.control.web.*,com.agilecontrol.nea.core.util.*,com.agilecontrol.nea.core.schema.*,com.agilecontrol.nea.core.query.*, java.io.*,java.util.*,com.agilecontrol.nea.core.control.util.*,com.agilecontrol.nea.core.report.*,com.agilecontrol.nea.core.web.bean.*,com.agilecontrol.nea.core.model.*, com.agilecontrol.nea.core.model.dao.*,com.agilecontrol.nea.util.*,org.apache.struts.Globals"%>
<%
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
<meta name="apple-mobile-web-app-status-bar-style" content="white" />
<meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0">

<title>自助打印</title>
<link rel="stylesheet" href="/fair/ipad/css/common/print.css?t=<%=date %>" type="text/css" media="screen" title="no title" charset="utf-8">
<link rel="apple-touch-icon" href="/fair/ipad/images/station.png?t=<%=date %>"/>
<script language="javascript" src="/fair/ipad/js/prototype.js"></script>
<script type="text/javascript" src="/fair/ipad/js/jquery.js"></script>
<script type="text/javascript">jQuery.noConflict();</script>
<script language="javascript" src="/nea/core/js/rest.js"></script>

<script type="text/javascript" src="/fair/ipad/js/printcontrol.js?t=<%=date %>"></script>
</head>
<body>
	<div id="container">
		<img id="img_container" src="images/print.jpg?t=<%=date %>"/>
		<div id="pagebody">
			<div id="left_dispaly">
				<div id="show_member"></div>
				<div id="show_infor"></div>
				<div id="show_phone">
				</div>
			</div>
			<div id="right_display">
				<div id="number">
					<div id="_1" ontouchstart="pcontr.clicknumber(1)"></div>
					<div id="_2" ontouchstart="pcontr.clicknumber(2)"></div>
					<div id="_3" ontouchstart="pcontr.clicknumber(3)"></div>
					<div id="_4" ontouchstart="pcontr.clicknumber(4)"></div>
					<div id="_5" ontouchstart="pcontr.clicknumber(5)"></div>
					<div id="_6" ontouchstart="pcontr.clicknumber(6)"></div>
					<div id="_7" ontouchstart="pcontr.clicknumber(7)"></div>
					<div id="_8" ontouchstart="pcontr.clicknumber(8)"></div>
					<div id="_9" ontouchstart="pcontr.clicknumber(9)"></div>
					<div id="_0" ontouchstart="pcontr.clicknumber(0)"></div>
				</div>
				<div id="clear" ontouchstart="pcontr.clearnumber()"></div>
			</div>
		</div>
	</div>
<script type="text/javascript">
jQuery(document).ready(function(){
	pcontr.showPhone();
});
</script>
</body>
</html>