<%@ page language="java" pageEncoding="utf-8"%>
<% String sessionkey = request.getParameter("sessionkey"); %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<%@ include file="top_meta.jsp"%>
<script type="text/javascript" src="js/rptsource.js"></script>
<link rel="stylesheet" href="css/jquery-ui-1.10.3.custom.css"></link>
<link rel="stylesheet" type="text/css" href="css/rpt_source.css"></link>
<script type="text/javascript" src="/fair/ipad/rptdef/js/jquery.ztree.exedit-3.5.js"></script>
<script src="http://code.highcharts.com/highcharts.js" defer="defer"></script>
<script src="http://code.highcharts.com/modules/exporting.js" defer="defer"></script>
<script type="text/javascript" src="http://www.highcharts.com/js/themes/grid.js" defer="defer"></script>
</head>
<body>
	<script type="text/javascript">
		jQuery(document).ready(function(){
		});
	</script>
	<div id="main">
		<div id="top_bar">
			报表源
			<button id='save_btn'>保存</button>
		</div>
		<div id="choice_div">
			<div id="choice_div_left">
				<jsp:include page="table_dropdown.jsp"></jsp:include>
			</div>
			<div id="choice_div_main">
				报表源配置
				<div id="preview">预览</div>
				<div>
					<table>
						<tr>
							<td align="right">分析维度:</td>
							<td><div id="dimension" class="input_field droppable_field"></div></td>
							<td align="right">名称:</td>
							<td><input class="input_field" type="text"/></td>
						</tr>
					</table>
				</div>
				<div>
					<button id="add_column_element">+添加柱状图元素</button>
				</div>
				<div class="column_element">
					<table>
						<tr>
							<td align="right">元素名称：</td>
							<td><input name="column_desc" class="input_field" type="text"/></td>
							<td align="right">数据格式：</td>
							<td><select class="input_field">
								<option>0.0</option>
								<option>0.0%</option>
							</select></td>
						</tr>
						<tr>
							<td align="right">表现形式：</td>
							<td><select name="show_type" class="input_field">
								<option value="column">柱形</option>
								<option value="line">折线</option>
							</select></td>
							<td align="right">度量：</td>
							<td><div name="measure" class="input_field droppable_field"></div></td>
						</tr>
					</table>
				</div>
			</div>
		</div>
		<div id="grid_div">
		</div>
	</div>
</body>
</html>