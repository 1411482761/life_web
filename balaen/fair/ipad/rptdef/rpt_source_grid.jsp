<%@ page language="java" pageEncoding="utf-8"%>
<% String sessionkey = request.getParameter("sessionkey"); %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<%@ include file="top_meta.jsp"%>
<script type="text/javascript" src="js/rptsource_grid.js"></script>
<link rel="stylesheet" href="css/jquery-ui-1.10.3.custom.css"></link>
<link rel="stylesheet" type="text/css" href="css/rpt_source.css"></link>
<link rel="stylesheet" type="text/css" href="css/rpt_source_grid.css"></link>
<script src="http://code.highcharts.com/highcharts.js"></script>
<script type="text/javascript" src="/fair/ipad/rptdef/js/jquery.ztree.exedit-3.5.js"></script>
<script type="text/javascript" src="http://www.highcharts.com/js/themes/grid.js"></script>
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
				<div><div id="preview">预览</div><div id="preview_bar">前<input type="number"/>列固定<span>起始值从1开始</span></div></div>
				<div>
					<button id="add_column_element">+过滤条件</button>
				</div>
				<div class="column_element">
					<table>
						<tr>
							<td>分析维度</td>
							<td><div class="input_field droppable_field"></div></td>
							<td><select class="input_field">
								<option>包含</option>
								<option>不包含</option>
							</select></td>
							<td><input class="input_field"/></td>
						</tr>
					</table>
				</div>
				<div class="border">
					<div class="div_title">字段配置</div>
					<div>
						<input type="checkbox"/>显示合计行
						<input type="checkbox"/>跳转依据列
						当前列颜色<div style="display:inline-block;background-color:#E6A201;height:16px;width:16px"></div>
					</div>
					<div>
						<table>
							<tr>
								<td>字段描述:</td>
								<td><input class="input_field"/></td>
							</tr>
							<tr>
								<td>变量名:</td>
								<td><input class="input_field"/></td>
							</tr>
							<tr>
								<td>数据格式:</td>
								<td><select class="input_field">
									<option>0.0</option>
									<option>0.0%</option>
								</select></td>
							</tr>
							<tr>
								<td>计算公式:</td>
								<td><input class="input_field"/></td>
							</tr>
							<tr>
								<td>合计行:</td>
								<td><input class="input_field"/></td>
							</tr>
						</table>
						<div>
						</div>
					</div>
				</div>
				<div class="border" id="pattern_choice">
					模块选择
					<div>
						<img alt="" src="css/image/pattern1.png" class="pattern" num="1"/>
						<img alt="" src="css/image/pattern2.png" class="pattern" num="2"/>
						<img alt="" src="css/image/pattern3.png" class="pattern" num="3"/>
						<img alt="" src="css/image/pattern4.png" class="pattern" num="4"/>
						<img alt="" src="css/image/pattern5.png" class="pattern" num="0"/>
					</div>
				</div>
			</div>
		</div>
		<div id="grid_div">
			<div id="table"></div>
		</div>
	</div>
</body>
</html>