<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="java.util.*" %>
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
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
<meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
<link rel="stylesheet" href="/fair/ipad/css/main.css?t=<%=date %>"
	type="text/css" media="screen" title="no title" charset="utf-8">
<link rel="stylesheet" href="/fair/ipad/css/suggestion.css?t=<%=date %>"
	type="text/css" media="screen" title="no title" charset="utf-8">
<title>Charles & Keith - OrderingBoard</title>
</head>
<body>
	<div id="container">
		<div id="filter"></div>
		<div id="cominfo">
			<div id="logo"></div>
			<div id="orderinfo">订货会说明</div>
		</div>
		<div id="table">
			<table>
				<thead>
					<tr>
						<td class="keyword" width="70px;" height="22px;">关键词</td>
						<td class="desc">说明</td>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td class="keyword" width="70px;" height="22px;">款</td>
						<td class="desc">主推款</td>
					</tr>
					<tr>
						<td class="keyword" width="70px;" height="22px;">窗</td>
						<td class="desc">橱窗款</td>
					</tr>
					<tr>
						<td class="keyword" width="70px;" height="22px;">
							<div class="hot"></div>
						</td>
						<td class="desc">热款</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div id="footer">
			<div class="hr"></div>
			<div id="footer-left"> &copy; 2011-2012 上海贯信信息技术有限公司</div>
			<div id="footer-right">iPad 订货系统</div>
		</div>
	</div>
</body>
</html>