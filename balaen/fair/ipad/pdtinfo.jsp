<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="com.agilecontrol.nea.core.web.config.*,org.slf4j.Logger,org.slf4j.LoggerFactory,org.json.*,java.text.SimpleDateFormat,java.sql.ResultSet,java.sql.Connection,java.sql.PreparedStatement,com.agilecontrol.nea.core.query.web.*,com.agilecontrol.nea.core.control.web.*,com.agilecontrol.nea.core.util.*,com.agilecontrol.nea.core.schema.*,com.agilecontrol.nea.core.query.*, java.io.*,java.util.*,com.agilecontrol.nea.core.control.util.*,com.agilecontrol.nea.core.report.*,com.agilecontrol.nea.core.web.bean.*,com.agilecontrol.nea.core.model.*, com.agilecontrol.nea.core.model.dao.*,com.agilecontrol.nea.util.*,org.apache.struts.Globals" %>
<%@ taglib uri="http://java.fckeditor.net" prefix="FCK" %>
<% 
    String sessionkey=request.getParameter("sessionkey");
    String pdtId= request.getParameter("id");

	 if("gunit".equals(QueryEngine.getInstance().doQueryOne("select value from ad_param where name='fair.analyze.urltype'"))){
		 request.getRequestDispatcher("/fair/ipad/gunit.jsp?pdtid="+pdtId+"&sessionkey="+sessionkey).forward(request,response);
		 return;
	}
	 if("gunitmark".equals(QueryEngine.getInstance().doQueryOne("select value from ad_param where name='fair.analyze.urltype'"))){
		 request.getRequestDispatcher("/fair/ipad/pdt_suggest.jsp?pdtid="+pdtId+"&sessionkey="+sessionkey).forward(request,response);
		 return;
	}
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html style="width:100%;height:100%;">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="Cache-Control" content= "no-cache"> 
<meta http-equiv="Expires" content= "0">
<meta name="apple-touch-fullscreen" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
<meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">

<link rel="stylesheet" href="/fair/ipad/css/common/main.css" type="text/css" media="screen" title="no title" charset="utf-8">
<link rel="stylesheet" href="/fair/ipad/css/common/pdtinfo.css" type="text/css" media="screen" title="no title" charset="utf-8">

<script language="javascript" src="/fair/ipad/js/prototype.js"></script>
<script language="javascript" src="/fair/ipad/js/jquery.js"></script>
<script type="text/javascript">jQuery.noConflict();</script>
<script language="javascript" src="/fair/ipad/js/pdtinfocontrol.js" charset="utf-8"></script>

<script language="javascript" src="/nea/core/js/rest.js"></script>

<title>单品分析界面</title>
</head>
<body style='width:100%;height:100%; margin: 0;'>
    <div id="loading">
           <div id="loadinglocale"></div>
    </div>
	<div id="container" style="display:none;">
	  <div id="tb1">
	      <table id="tb_pdt">
	      </table>
	  </div>
	  <div id="tb2">
	    	<div id="sel1"></div>
 	     <table id="tb_pdt1">
	     </table> 
	  </div>
    </div>
 	<script type="text/javascript">
 	   function orient(){
 		  if (window.orientation == 90 || window.orientation == -90) {
 			 	//ipad横屏
                jQuery("th").css({"background-color":"rgb(153,153,153)","color":"white"});
 			 	
 			 	return false;
 			 	}else if (window.orientation == 0 || window.orientation == 180) {
 			 	//ipad竖屏
 			 	jQuery("body").css({"background-color":"black","color":"white"});
 			 	return false;
 			 	}
 	   }
		jQuery(document).ready(function(){
			orient();
			pdtinfoc.loadbuyer('<%=sessionkey %>', <%=pdtId%>);
		});
	</script> 
</body>
</html>