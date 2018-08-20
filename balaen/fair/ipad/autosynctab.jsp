<%@ page language="java" pageEncoding="utf-8"%>
<%@ page import="org.slf4j.Logger,org.slf4j.LoggerFactory,org.json.*,java.text.SimpleDateFormat,java.sql.ResultSet,java.sql.Connection,java.sql.PreparedStatement,com.agilecontrol.nea.core.query.web.*,com.agilecontrol.nea.core.control.web.*,com.agilecontrol.nea.core.util.*,com.agilecontrol.nea.core.schema.*,com.agilecontrol.nea.core.query.*, java.io.*,java.util.*,com.agilecontrol.nea.core.control.util.*,com.agilecontrol.nea.core.report.*,com.agilecontrol.nea.core.web.bean.*,com.agilecontrol.nea.core.model.*, com.agilecontrol.nea.core.model.dao.*,com.agilecontrol.nea.util.*,org.apache.struts.Globals"%>
<% 
   String date = String.valueOf(new Date().getTime());
   String index = "1";
   String flag="1";
   if(null!=request.getParameter("index"))
	   index=request.getParameter("index");
   if(null!=request.getParameter("flag"))
   	   flag=request.getParameter("flag");
   String isshow = ConfigValues.get("sync_show_step3","Y");
%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<script language="javascript" src="/fair/ipad/js/prototype.js?t=<%=date %>"></script>
<script language="javascript" src="/nea/core/js/jquery-1.3.2.min.js"></script>
<script language="javascript" src="/fair/ipad/js/locale/locale_zh_CN.js?t=<%=date %>"></script>
<script type="text/javascript">jQuery.noConflict();</script>
<script language="javascript" src="/fair/ipad/js/autosynctabcontrol.js?t=<%=date %>"></script>
<link rel="stylesheet" href="/fair/ipad/css/common/autosynctab.css?t=<%=date %>" type="text/css" >
<script language="javascript" src="/nea/core/js/rest.js"></script>
<title>数据同步映射界面</title>
<style>

</style>	
</head>
<body>
    <p id="title1">
		<b></b> 
	</p>
	<div id="step1">
   	  <span class='step1head'><b>步骤一:</b>点击'同步导入'按钮,完成对方数据到我方数据库中</span> 
     </div>
     <div id="step2">
        <span class='step2head'><b>步骤二:</b>点击'数据映射'按钮,完成双方数据映射</span> 
     </div>
     <% if(isshow.equals("Y")) {%>
	<div id="step3">
	  <span class='step3head'><b>步骤三:</b>点击'同步导出'按钮,完成我方数据到对方数据库中</span> 
	</div>
	<%} %>
	<div id="result" >
	
	
	</div>

</body>
   <script type="text/javascript">
		jQuery(document).ready(function(){
			astc.init(<%=index%>,<%=flag%>);
		});
  </script>
</html>

