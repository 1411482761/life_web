<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
	<%@ page import="java.util.*,org.slf4j.Logger,org.slf4j.LoggerFactory,org.json.*,java.text.SimpleDateFormat,java.sql.ResultSet,java.sql.Connection,java.sql.PreparedStatement,com.agilecontrol.nea.core.query.web.*,com.agilecontrol.nea.core.control.web.*,com.agilecontrol.nea.core.util.*,com.agilecontrol.nea.core.schema.*,com.agilecontrol.nea.core.query.*, java.io.*,java.util.*,com.agilecontrol.nea.core.control.util.*,com.agilecontrol.nea.core.report.*,com.agilecontrol.nea.core.web.bean.*,com.agilecontrol.nea.core.model.*, com.agilecontrol.nea.core.model.dao.*,com.agilecontrol.nea.util.*,org.apache.struts.Globals"%>

<%@page errorPage="/nea/error.jsp"%>
<%@ include file="/nea/core/common/init.jsp" %>
<%@ page import="java.util.*" %>
<%
 String date = String.valueOf(new Date().getTime());
 boolean showSubmit=ConfigValues.get("changePassword.showSubmit",false);
 boolean isAllowChangePwdPhone=ConfigValues.get("fair.allow_changepwd_phone", false);
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
<link type="text/css" rel="StyleSheet" href="/fair/ipad/css/common/changepassword.css?=<%=date %>" />
<script type="text/javascript" src="/fair/ipad/js/prototype.js"></script>
<script type="text/javascript" src="/fair/ipad/js/jquery.js"></script>
<script type="text/javascript">jQuery.noConflict();</script>
<script language="javascript" src="/nea/core/js/rest.js"></script>
<script type="text/javascript" src="/fair/ipad/js/changepwdcontrol.js?=<%=date%>"></script>
</head>
<body>
	<!-- <div  id='back'  onclick="window.location.replace('/fair/ipad/suggest.jsp')" style="display:none;padding-top:20px;">返回</div> -->
	<div id="container">
         <div id="getcomperes" onclick ="window.location.replace('/fair/ipad/getcomperes.jsp')" class='btnpwd'>设置主讲</div>
		<table align="center" border="0" cellpadding="1" cellspacing="1">
		<tr class='name'><td height="100" align="right" id="namedesc"></td>
		<td nowrap height="100" id="username">&nbsp;&nbsp;</td>
		</tr>
		<tr style="display:none;" class='phone'><td height="100" width="40%" nowrap align="right" id="num"></td>
	    <td height="100" width="60%" align="left"><input  id='phonenum' value=''></td>
	    </tr>
		<tr><td height="100" width="40%" nowrap align="right" id="pwd1"></td>
	    <td height="100" width="60%" align="left"><input type='password'  id='oldpassword' value=''></td>
	    </tr>
	    <tr><td height="100" width="40%" nowrap align="right" id="pwd2"></td>
	    <td height="100" width="60%" align="left"><input type='password'  id='password1' value=''></td>
	    </tr>
	    <tr><td height="100" width="40%" nowrap align="right" id="pwd3"></td>
	    <td height="100" width="60%" align="left"><input type='password' id='password2' value=''></td>
	    </tr>
	 </table>
	</div>
	<script type="text/javascript">
		jQuery(document).ready(function(){
			cc.load(<%=isAllowChangePwdPhone%>,<%=showSubmit%>);
		});
	</script>
</body>
</html>
