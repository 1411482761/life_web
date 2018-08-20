<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8"%>
<%@ page import="java.util.*,org.json.*,com.agilecontrol.nea.util.*,com.agilecontrol.nea.core.query.*,java.util.*,com.agilecontrol.nea.core.util.*,com.agilecontrol.nea.core.control.web.*,com.agilecontrol.nea.core.control.event.*"%>
<%
	String sessionkey = request.getParameter("sessionkey");
	String date = String.valueOf(new Date().getTime());
	int filterId=-1;
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
<link type="text/css" rel="StyleSheet" href="/fair/ipad/css/common/rank.css?t=<%=date %>" />
<script type="text/javascript" src="/fair/ipad/js/prototype.js"></script>
<script type="text/javascript" src="/fair/ipad/js/jquery.js"></script>
<script type="text/javascript" src="/fair/ipad/js/swipeview.js"></script>
<script type="text/javascript">jQuery.noConflict();</script>
<script language="javascript" src="/nea/core/js/rest.js"></script>
<script type="text/javascript" src="/fair/ipad/js/rankcontrol.js?t=<%=date %>"></script>
<title>Balanced Order - Lifecycle RCP</title>
</head>
	<%
		String themeStyle = ConfigValues.get("fair.theme.style", "01");
		String fontColor = "";
		String background = "";
		if ("01".equals(themeStyle)) {
			background = "background:-webkit-gradient(linear,left top,left bottom,from(#b0b0b0), to(#262626));";
		} else if ("02".equals(themeStyle)) {
			fontColor = "color:#999;";
			background = "background:-webkit-gradient(linear,left top,left bottom,from(#FFF), to(#b0b0b0));";
		}
	%>
<body>
	<div id="active" style="<%=background%>">
		<div id="active-words" style="<%=fontColor%>"></div>
	</div>
	<div id="container">
		<div id="banner">
			<div id="refresh" onclick="rc.refresh();">刷新</div>
			<div id="deploy" onclick="rc.openMessage();">配置</div>
			<!-- <div id="search-check" style="display:none;"><input type="checkbox" onclick="rc.searchCheck(this);"/></div>
			<div id="search-word" style="display:none;" onclick="rc.search_checkBox(this);">启用查询条件</div> -->
			<div id="stores" ></div>
			<div id="search" onclick="rc.cFilter(this,'pdt');">搜索条件</div>
			<div id="filter" onclick="rc.cFilter(this,'buyer');">过滤买手</div>
			<div id="product-detail" >跳转/商品:</div>
			<span ontouchstart="rc.product_check();" id="product-img" class="product-img-close"></span>
		</div>
		<div id="alter_message"></div>
		<div id="message">
			<div id="message-left">
				<ul>
					<li id="up">
					</li>
					<li id="middle">
					</li>
					<li id="down">
					</li>
					<li id="bottom">
					</li>
				</ul>
			</div>
			<div id="message-right">
				<ul>
					<li id="judgeslide">
						<div class="message-checkbox"><input id="judgeslide-checkbox" type="checkbox" onclick="rc.slider(this);" /></div>
						<div class="message-words" onclick="rc.checkBox1(this);">幻灯片</div>
					</li>
					<li id="myself">
						<div class="message-checkbox"><input  id="myself-message" type="checkbox" onclick="rc.buyer(this);" checked="checked"/></div>
						<div class="message-words" onclick="rc.checkBox2(this);">显示自己</div>
					</li>
				</ul>
				<div id='auto'>
					<div id="auto-word">自动刷新:</div>
					 <select id='autoFresh' onchange='rc.rankRefresh()'>
					</select>
				</div>
				<div id="close" onclick="rc.closeMessage()"></div>
			</div>
		</div>
		<div id="loading">
			<div id="loadinglocale">加载中...</div>
		</div>
		<div id="content">
			<div id="wrapper"></div>
		</div>
	
		<div id="footer">
			<div id="footer-left">&copy; 2011-2012 上海贯信信息技术有限公司</div>
			<div id="footer-right">iPad 订货系统</div>
		</div>
	</div>
	   	<div  id="iframe_div"  style="display:none;" >
		  <div><input id="btn_back"  type="button" value="返回" onclick="rc.goBack();"></div>
        </div>
      <script type="text/javascript">
		jQuery(document).ready(function(){
			rc.set('<%=sessionkey%>','<%=filterId%>');
		});
	</script>
</body>
</html>