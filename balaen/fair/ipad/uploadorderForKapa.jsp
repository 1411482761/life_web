<%@ page language="java" pageEncoding="utf-8"%>
<%@ page import="org.slf4j.Logger,org.slf4j.LoggerFactory,org.json.*,java.text.SimpleDateFormat,java.sql.ResultSet,java.sql.Connection,java.sql.PreparedStatement,com.agilecontrol.nea.core.query.web.*,com.agilecontrol.nea.core.control.web.*,com.agilecontrol.nea.core.util.*,com.agilecontrol.nea.core.schema.*,com.agilecontrol.nea.core.query.*, java.io.*,java.util.*,com.agilecontrol.nea.core.control.util.*,com.agilecontrol.nea.core.report.*,com.agilecontrol.nea.core.web.bean.*,com.agilecontrol.nea.core.model.*, com.agilecontrol.nea.core.model.dao.*,com.agilecontrol.nea.util.*,org.apache.struts.Globals"%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<%
	UserWebImpl userWeb =null;
	Locale locale=null;
	try{
		userWeb= ((UserWebImpl)WebUtils.getSessionContextManager(session).getActor(WebKeys.USER));
		locale=userWeb.getLocale();System.out.println("########## found userWeb=null##########221"+locale.toString());
	}catch(Throwable userWebException){
		System.out.println("########## found userWeb=null##########"+userWebException);
		locale=TableManager.getInstance().getDefaultLocale();
	}
	Date date = new Date();
%>
<script language="javascript" src="/nea/core/js/prototype.js"></script>
<script language="javascript" src="/nea/core/js/jquery-1.3.2.min.js"></script>
<script language="javascript" src="/nea/core/js/swfobject.js"></script>
<script language="javascript" src="/nea/core/js/jquery.uploadify.v2.0.3.min.js"></script>
<script language="javascript" src="/fair/ipad/js/locale/locale_<%=locale.toString()%>.js"></script>
<script language="javascript" src="/fair/ipad/js/uploadorderForKapa.js?d=<%=date.getTime() %>>"></script>
<link type="text/css" rel="stylesheet" href="/nea/core/themes/classic/01/css/portal.css">
<title>订单上传</title>
<style>
.uploadifyQueueItem {
	font: 11px Verdana, Geneva, sans-serif;
	border: 2px solid #E5E5E5;
	background-color: #F5F5F5;
	margin-top: 5px;
	padding: 5px;
	width: 350px;
}
.uploadifyError {
	border: 2px solid #FBCBBC !important;
	background-color: #FDE5DD !important;
}
.uploadifyQueueItem .cancel {
	float: right;
}
.uploadifyProgress {
	background-color: #FFFFFF;
	border-top: 1px solid #808080;
	border-left: 1px solid #808080;
	border-right: 1px solid #C5C5C5;
	border-bottom: 1px solid #C5C5C5;
	margin-top: 10px;
	width: 100%;
}
#btnImport, #btnImport2{
	height:24px;
	font-size:14px;
}
.uploadifyProgressBar {
	background-color: #0099FF;
	width: 1px;
	height: 3px;
}
#whole{
	width:90%;
	boarder:1px solid #808080;
	background-color: #eeeeee;
	padding:15px;
	font-size:12px;
}
#processing{
	background-color: #ff0000;
	color:#ffffff;
	padding: 10px 10px 5px 10px;
	margin-left:20px;
}
.step{
	padding: 10px;
}
.steptitle{
	font-size:12px;
	font-weight: bold;
}
#output{
	padding: 10px;
}
</style>	
</head>
<body>
	<p id="title1">
		<b></b> 
	</p>
<div class="step" id="up_step1"> 
</div>

<div class="step" id="up_step2"> 
</div>	
<script language="javascript">
	var upinit={
		'sizeLimit':1024*1024*10,
		'buttonText'	: 'File...',
		'fileDesc'      : 'Excel文件(xls,xlsx)',
		'fileExt'		: '*.xls;*.xlsx'
		};
	/**
	  webaction -- the ad_action.id which handle file
	  JSESSIONID -- this must be set so can check user validity
	  query  -- will add "file" to it, meaning absolute file name uploaded to portal, add user defined params to this object if you want to
	            handle in stored procedure, note query must be string so can transfered to db
	*/	
	var para={
		"webaction":"impxls",
		"next-screen":"/msgjson",
		"formRequest":"/msgjson",
		"JSESSIONID":"<%=session.getId()%>",
		"query":"{mydata:'abc123',mydata2:12}",
		"nds.control.ejb.UserTransaction":"N"
	};
	jQuery(document).ready(function(){
		fup.initForm(upinit,para);
	});
	
</script>
<p>
	<div id="output" style="display:none">
		<span class="steptitle"></span><br/><br/>
		<div id="whole"></div>
	</div>
</p>

</body>
</html>

