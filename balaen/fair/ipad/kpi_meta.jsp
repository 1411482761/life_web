<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="java.util.*"%>
<%
  String date = String.valueOf(new Date().getTime());
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="apple-touch-fullscreen" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
<meta name="viewport" content="width=device-width,user-scalable=yes" />
<meta http-equiv="Cache-Control" content="max-age=0,no-store,no-cache,must-revalidate" />
<meta http-equiv="Expires" content= "-1" />
<meta http-equiv="Pragma" content="no-cache" />

<link rel="stylesheet" href="/fair/ipad/css/common/main.css?t=<%=date %>" type="text/css" media="screen" title="no title" charset="utf-8">
<link rel="stylesheet" href="/fair/ipad/css/common/reports/kpicard.css?t=<%=date %>" type="text/css" media="screen" title="no title" charset="utf-8">

<script language="javascript" src="/fair/ipad/js/prototype.js?t=<%=date %>"></script>
<script language="javascript" src="/fair/ipad/js/jquery.js?t=<%=date %>"></script>
<script type="text/javascript">jQuery.noConflict();</script>
<script language="javascript" src="/fair/ipad/js/formatter.js?t=<%=date %>"></script>
<script language="javascript" src="/fair/ipad/js/highcharts/highcharts.js?t=<%=date %>"></script>
<script language="javascript" src="/fair/ipad/js/reports/reportscontrol.js?t=<%=date %>" charset='utf-8'></script>
<script language="javascript" src="/fair/ipad/js/reports/kpicardcontrol.js?t=<%=date %>" charset='utf-8'></script>

<script type="text/javascript" src="/nea/core/js/controller.js?t=<%=date %>"></script>
<script language="javascript" src="/nea/core/js/rest.js?t=<%=date %>"></script>
<title>Balanced Order - Lifecycle RCP</title>