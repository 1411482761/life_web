<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="java.util.*,java.text.SimpleDateFormat,java.sql.ResultSet,java.sql.Connection,java.sql.PreparedStatement,com.agilecontrol.nea.core.query.web.*,com.agilecontrol.nea.core.control.web.*,com.agilecontrol.nea.core.util.*,com.agilecontrol.nea.core.schema.*,com.agilecontrol.nea.core.query.*, java.io.*,java.util.*,com.agilecontrol.nea.core.control.util.*,com.agilecontrol.nea.core.report.*,com.agilecontrol.nea.core.web.bean.*,com.agilecontrol.nea.core.model.*, com.agilecontrol.nea.core.model.dao.*,com.agilecontrol.nea.util.*,org.apache.struts.Globals"%>
<%
 String sessionkey=request.getParameter("sessionkey");
 String pdtId= request.getParameter("id");
 String date = String.valueOf(new Date().getTime());
 
 boolean can_show_comment_quick_edit = ConfigValues.get("fair.pdt.comment.quick.edit",false);
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="Cache-Control" content= "no-cache"> 
<meta http-equiv="Expires" content= "0">

<!-- <link rel="stylesheet" href="/fair/ipad/css/common/main.css" type="text/css" media="screen" title="no title" charset="utf-8"> -->
<!-- <link rel="stylesheet" href="/fair/ipad/css/common/comments.css" type="text/css" media="screen" title="no title" charset="utf-8"> -->
<script language="javascript" src="/fair/ipad/js/prototype.js"></script>
<script language="javascript" src="/fair/ipad/js/jquery.js"></script>
<script type="text/javascript">jQuery.noConflict();</script>
<script language="javascript" src="/fair/ipad/js/commentscontrol.js?t=<%=date %>"></script>

<script language="javascript" src="/nea/core/js/rest.js"></script>
<title>Balanced Order - Lifecycle RCP</title>
</head>
<body>
	<div id="container">
		<div class="banner">
			<div id="savebutton" onclick="commentsc.save();"></div>
		</div>
		<div id="content">
			<div id="tag-content"></div>
			<div id="infotip"></div>
			<div id="publish"><textarea id="yours"></textarea></div>
			<%if(can_show_comment_quick_edit==true){ %>
				<div id="quickEdittip"></div>
				<div id="quickEdit">
					<select onchange="commentsc.selectQuickComment()" style="font-size:16px;"></select>
				</div>
			<%}%>
			<div id="discussion">
				<div id="discount"></div>
				<ul id="comments"></ul>
			</div>
		</div>
	</div>
	<script type="text/javascript">
		jQuery(document).ready(function(){
			<%if(can_show_comment_quick_edit==true){ %>
				commentsc.loadQuickEditComment('<%=sessionkey %>');
			<%}%>
			commentsc.loadComments('<%=sessionkey %>', <%=pdtId%>);
			
		});
	</script>
</body>
</html>