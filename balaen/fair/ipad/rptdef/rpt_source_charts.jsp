<%@ page language="java" pageEncoding="utf-8"%>
<%@ page import="java.util.*" %>
<% String sessionkey = request.getParameter("sessionkey"); 
	String date = String.valueOf(new Date().getTime());
%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<%@ include file="top_meta.jsp"%>
<script type="text/javascript" src="js/rptsource_charts.js"></script>
<link rel="stylesheet" href="css/jquery-ui-1.10.3.custom.css"></link>
<link rel="stylesheet" type="text/css" href="css/rpt_source.css?t=<%=date %>"></link>
<script src="http://code.highcharts.com/highcharts.js"></script>
<script src="http://code.highcharts.com/modules/exporting.js"></script>
<script type="text/javascript" src="/fair/ipad/rptdef/js/jquery.ztree.exedit-3.5.js"></script>
<script type="text/javascript" src="http://www.highcharts.com/js/themes/grid.js"></script>
</head>
<body>
	<script type="text/javascript">
		jQuery(document).ready(function(){
			rscc.loadTables('<%=sessionkey %>');
		});
	</script>
	<div id="main">
		<div id="top_bar">
			报表源
			<button id='save_btn'>保存</button>
		</div>
		<div id="choice_div">
			<div id="choice_div_left">
				<div id="choice_div_left_head">
					实体表:&nbsp;&nbsp;&nbsp;&nbsp;
					<select id="table_selector">
						<option value="-1">----------请选择------------</option>
					</select>
				</div>
				<div id="choice_div_columns">
					<ul id="columns_ul" class="ztree">
					</ul>
				</div>
			</div>
			<div id="choice_div_main">
				报表源配置
				<div id="preview">预览</div>
				<table>
					<tr>
						<td align="right">名称:</td>
						<td><input id="desc" type="text" class="input_field"/></td>
					</tr>
					<tr>
						<td align="right">分析维度:</td>
						<td><div id="dimension" class="input_field droppable_field"></div></td>
					</tr>
					<tr>
						<td align="right">度量:</td>
						<td><div id="measure" class="input_field droppable_field"></div></td>
					</tr>
					<tr>
						<td align="right">数据格式:</td>
						<td><select id="fmt" class="input_field">
								<option>0.0</option>
								<option>0.0%</option>
						</select></td>
					</tr>
				</table>
			</div>
		</div>
		<div id="grid_div">
		</div>
	</div>
</body>
</html>