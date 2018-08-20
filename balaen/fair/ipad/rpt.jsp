<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="org.json.*,com.agilecontrol.nea.util.*,com.agilecontrol.nea.core.query.*,java.util.*,com.agilecontrol.nea.core.util.*,com.agilecontrol.nea.core.control.web.*,com.agilecontrol.nea.core.control.event.*"%>
<%
  String sessionkey = request.getParameter("sessionkey");
  String name = request.getParameter("name");
  String locale = request.getParameter("locale");
  String theme = request.getParameter("theme");
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
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="apple-touch-fullscreen" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
<meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
<meta http-equiv="Cache-Control" content="max-age=0,no-store,no-cache,must-revalidate" />
<meta http-equiv="Expires" content= "-1" />
<meta http-equiv="Pragma" content="no-cache" />
<%-- <link rel="stylesheet" href="/fair/ipad/css/common/rpt.css?t=<%=date %>" type="text/css" media="screen" title="no title" charset="utf-8"> --%>
<%-- <link rel="stylesheet" href="/fair/ipad/css/<%=theme %>/rpt.css?t=<%=date %>" type="text/css" media="screen" title="no title" charset="utf-8"> --%>
<script language="javascript" src="/fair/ipad/js/prototype.js?t=<%=date %>"></script>
<script language="javascript" src="/fair/ipad/js/jquery.js?t=<%=date %>"></script>
<script type="text/javascript">jQuery.noConflict();</script>
<script language="javascript" src="/fair/ipad/js/formatter.js?t=<%=date %>"></script>
<script language="javascript" src="/fair/ipad/js/reports/rptcontrol.js?t=<%=date %>" charset="utf-8"></script>

<script language="javascript" src="/fair/ipad/js/reports/component/com.js?t=<%=date %>" charset="utf-8"></script>
<%
  for(int i = 0; i < com_cnt; i++){
%>
<script language="javascript" src="/fair/ipad/js/reports/component/com_<%=i %>.js?t=<%=date %>" charset="utf-8"></script>
<%
  }
%>
<script language='javascript' src='/fair/ipad/js/locale/locale_<%=locale %>.js' charset='utf-8'></script>
<script language="javascript" src="/nea/core/js/rest.js?t=<%=date %>"></script>
</head>
<body>
  <div id="container">
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
  		<div id="rpt-title"><%=title %></div>
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
  	<div id="table-container" class='contents'>
  		<div id="table-header"></div>
  		<div id="table"></div>
  		<div id="fixedcolumns"></div>
  	</div>
	<div id="footer" class="fixed basic hscroll" class='contents'>
		<table></table>
	</div>
	<div id="toolbars" class='contents'>
		<div id="prev" class="toolbar" onclick="rpt.switchPage(0);">
			<div class='toolbarimg'></div>
			<div class='toolbardesc'>上一页</div>
		</div>
		<div id="page">
			<div id="current">
				<select onchange="rpt._switchPage();"></select>
			</div>
			<div id="total"></div>
		</div>
		<div id="next" class="toolbar" onclick="rpt.switchPage(1);">
			<div class='toolbarimg'></div>
			<div class='toolbardesc'>下一页</div>
		</div>
	</div> 
	<div id="loading">
			<div id="loadinglocale"></div>
	</div>
  </div>
	<script type="text/javascript">
		jQuery(document).ready(function(){
			rpt.load('<%= sessionkey%>','<%=name%>','<%=theme%>','<%=isback%>');
		});
	</script>
</body>
</html>