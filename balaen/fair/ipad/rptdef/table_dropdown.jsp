<%@ page language="java" pageEncoding="utf-8"%>
<% String sessionkey = request.getParameter("sessionkey"); %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<%@ include file="top_meta.jsp"%>
<script type="text/javascript" src="js/table_dropdown.js"></script>
<link rel="stylesheet" href="css/jquery-ui-1.10.3.custom.css"></link>
<link rel="stylesheet" type="text/css" href="css/table_dropdown.css"></link>
<script type="text/javascript" src="/fair/ipad/rptdef/js/jquery.ztree.exedit-3.5.js"></script>
</head>
<body>
	<script type="text/javascript">
		jQuery(document).ready(function(){
			table_dropdown.loadTableResources('<%=sessionkey %>');
		});
	</script>
	<div id="table_main">
		<div></div>
		实体表:&nbsp;&nbsp;&nbsp;&nbsp;
		<select id="table_selector">
			<option value="-1">----------请选择------------</option>
		</select>
	</div>
	<div id="choice_div_columns">
		<ul id="columns_ul" class="ztree">
		</ul>
	</div>
</body>
</html>