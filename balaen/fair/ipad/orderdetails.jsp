<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
	<%@ page import="java.net.*,java.util.*,org.slf4j.Logger,org.slf4j.LoggerFactory,org.json.*,java.text.SimpleDateFormat,java.sql.ResultSet,java.sql.Connection,java.sql.PreparedStatement,com.agilecontrol.nea.core.query.web.*,com.agilecontrol.nea.core.control.web.*,com.agilecontrol.nea.core.util.*,com.agilecontrol.nea.core.schema.*,com.agilecontrol.nea.core.query.*, java.io.*,java.util.*,com.agilecontrol.nea.core.control.util.*,com.agilecontrol.nea.core.report.*,com.agilecontrol.nea.core.web.bean.*,com.agilecontrol.nea.core.model.*, com.agilecontrol.nea.core.model.dao.*,com.agilecontrol.nea.util.*,org.apache.struts.Globals"%>

<%
boolean isShowNum=ConfigValues.get("orderdetails.isShowNum",false);
 String sessionkey=request.getParameter("sessionkey"); 
 boolean jumped = null != request.getParameter("jumped"); 
 String date = String.valueOf(new Date().getTime());
 String filtercondition="";
 if(null!=request.getQueryString())
 filtercondition= URLDecoder.decode(request.getQueryString(), "utf-8"); 
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-class" content="text/html; charset=UTF-8">
<meta http-equiv="Cache-Control" content= "no-cache"> 
<meta http-equiv="Expires" content= "0">
<meta name="apple-touch-fullscreen" content="yes" />
<meta name="format-detection" content="telephone=no">
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
<meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
<link rel="stylesheet" href="/fair/ipad/css/common/orderdetails.css?t=<%=date %>" class="text/css" media="screen" title="no title" charset="utf-8">
<script type="text/javascript" src="/fair/ipad/js/prototype.js"></script>
<script type="text/javascript" src="/fair/ipad/js/jquery.js"></script>
<script type="text/javascript">jQuery.noConflict();</script>
<script type="text/javascript" src="/fair/ipad/js/formatter.js" charset='utf-8'></script>
<script type="text/javascript" src="/fair/ipad/js/orderdetailscontrol.js?t=<%=date %>" charset='utf-8'></script>
<script language="javascript" src="/nea/core/js/rest.js"></script>
<title>Balanced Order - Lifecycle RCP</title>
</head>
<body>
	<div id="debug" onclick='window.location.reload();'>调试</div>
	<select id="showstores" style="display:none;" onchange="odc.refresh();"></select>
	<div id="filter" style="display:none;">
		<input type="checkbox" onchange="odc.refresh();"/>
		<span onclick="odc.setFilter(this);">当前过滤</span>
	</div>
	<div id="kpi-filter" class="rc-filter" onclick="odc.cFilter(this);" style="display: block;"></div>
	<div id="title">
	  <%if(jumped){ %>
	  <div id="back" onclick="odc.back();" style="display:none;">返回</div>
	  <%} %>
	  <span></span>
	  <div id=synchronize onclick="odc.synchronize('Y')"></div>
	</div>
	<div id="header" class="fixed basic hscroll">
		<table></table>
	</div>
	<div id="table" class="basic hscroll">
		<div id='scrollbar-y' class='scrollc'>
			<div class='scroll scrollbar scrolly'></div>
		</div>
		<div id='scrollbar-x' class='scrollc'>
			<div class='scroll scrollbar scrollx'></div>
		</div>
		<table></table>
	</div>
	<div id="footer" class="fixed basic hscroll">
		<table></table>
	</div>
	<div id="toolbars">
		<div id="prev" class="toolbar" ontouchstart="odc.switchPage(0);">
			<div class='toolbarimg'></div>
			<div class='toolbardesc'>上一页</div>
		</div>
		<div id="page">
			<div id="current">
				<select onchange="odc._switchPage();"></select>
			</div>
			<div id="total"></div>
		</div>
		<div id="next" class="toolbar" ontouchstart="odc.switchPage(1);">
			<div class='toolbarimg'></div>
			<div class='toolbardesc'>下一页</div>
		</div>
	</div>
		<%if(isShowNum){%>
	<ul style="width:306px" id="keyboard">
	<li></li><li ontouchstart='odc.keyinput(this,1,event)'>7</li><li ontouchstart='odc.keyinput(this,1,event)'>8</li><li ontouchstart='odc.keyinput(this,1)'>9</li>
	<li></li><li ontouchstart='odc.keyinput(this,1,event)'>4</li><li ontouchstart='odc.keyinput(this,1,event)'>5</li><li ontouchstart='odc.keyinput(this,1)'>6</li>
	<li></li><li ontouchstart='odc.keyinput(this,1,event)'>1</li><li ontouchstart='odc.keyinput(this,1,event)'>2</li><li ontouchstart='odc.keyinput(this,1)'>3</li>
	<li ontouchstart='odc.keyinput(this,4,event)'>-</li><li ontouchstart='odc.keyinput(this,2,event)'>确定</li><li ontouchstart='odc.keyinput(this,1,event)'>0</li><li ontouchstart='odc.keyinput(this,3)'>清空</li>

	</ul>
		<%}else{%>
	<ul id="keyboard">
	<li ontouchstart='odc.keyinput(this,1,event)'>7</li><li ontouchstart='odc.keyinput(this,1,event)'>8</li><li ontouchstart='odc.keyinput(this,1)'>9</li>
	<li ontouchstart='odc.keyinput(this,1,event)'>4</li><li ontouchstart='odc.keyinput(this,1,event)'>5</li><li ontouchstart='odc.keyinput(this,1)'>6</li>
	<li ontouchstart='odc.keyinput(this,1,event)'>1</li><li ontouchstart='odc.keyinput(this,1,event)'>2</li><li ontouchstart='odc.keyinput(this,1)'>3</li>
	<li ontouchstart='odc.keyinput(this,2,event)'>确定</li><li ontouchstart='odc.keyinput(this,1,event)'>0</li><li ontouchstart='odc.keyinput(this,3)'>清空</li>

	</ul>
		<%}%>
	<img id="pdtimg" class="tooltip" alt="缺图" src="" onclick="jQuery(this).hide();">
	<div id="tooltip" class="tooltip" onclick="jQuery(this).hide();"><span></span></div>
	<div id="loading">
			<div id="loadinglocale">加载中...</div>
	</div>
	<script type="text/javascript">
		jQuery(document).ready(function(){
			odc.getFilterid('<%=sessionkey %>','<%=filtercondition%>');
		});
	</script>
</body>
</html>