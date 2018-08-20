<%@ page language="java" pageEncoding="utf-8"%>
<%@ page import="org.slf4j.Logger,org.slf4j.LoggerFactory,org.json.*,java.text.SimpleDateFormat,java.sql.ResultSet,java.sql.Connection,java.sql.PreparedStatement,com.agilecontrol.nea.core.query.web.*,com.agilecontrol.nea.core.control.web.*,com.agilecontrol.nea.core.util.*,com.agilecontrol.nea.core.schema.*,com.agilecontrol.nea.core.query.*, java.io.*,java.util.*,com.agilecontrol.nea.core.control.util.*,com.agilecontrol.nea.core.report.*,com.agilecontrol.nea.core.web.bean.*,com.agilecontrol.nea.core.model.*, com.agilecontrol.nea.core.model.dao.*,com.agilecontrol.nea.util.*,org.apache.struts.Globals"%>
	
<% 
   String date = String.valueOf(new Date().getTime());
  // String utype=(String)QueryEngine.getInstance().doQueryOne("select utype from users where id=?", new Object[]{userid});
   
   

%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<script language="javascript" src="/fair/ipad/js/prototype.js?t=<%=date %>"></script>
<script language="javascript" src="/nea/core/js/jquery-1.3.2.min.js"></script>
<script language="javascript" src="/fair/ipad/wxfair/js/jquery.qrcode.min.js"></script>
<script language="javascript" src="/fair/ipad/js/locale/locale_zh_CN.js?t=<%=date %>"></script>
<script type="text/javascript">jQuery.noConflict();</script>
<script language="javascript" src="/fair/ipad/wxfair/js/weChatQrcodeControl.js?t=<%=date %>"></script>
<script language="javascript" src="/nea/core/js/rest.js"></script>
<title>微信二维码</title>
<style>
	#main{
		text-align:center;
	}
	#qrcode{
		/* width:300px;
		height:300px; */
	}
	h2,h3{
		color:#6C6C6C;
	}
	h4{
		color:#d0d0d0;
	}
	#qrcode canvas{
   		width:25%;
    	height:32%; 
	}
</style>	
</head>
<body>
	<div id="main">
	<h2>贯信微信平台介绍</h2>
	<h3>使用微信扫描下面的二维码，即可查看此用户相关报表信息.</h3>
	<h4>注意:二维码已绑定用户信息,请防止被无关人员查看</h4>
	<h4>报表同步时间:<span id="rptSyncTime"></span> </h4>
	<hr style="height:5em;border:none;border-top:4px solid #BEBEBE;margin-left:5em;margin-right:5em;" />
	<div id="qrcode"></div>
	</div>

</body>
</html>

