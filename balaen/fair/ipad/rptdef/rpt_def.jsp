<%@ page language="java" pageEncoding="utf-8"%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<%@ include file="top_meta.jsp"%>
<link type="text/css" rel="StyleSheet"
	href="/fair/ipad/rptdef/css/main.css"></link>
<link type="text/css" rel="StyleSheet"
	href="/fair/ipad/rptdef/css/models.css"></link>
<script type="text/javascript" src="/fair/ipad/rptdef/js/local.js"></script>
<script type="text/javascript" src="/fair/ipad/rptdef/js/modelcontrol.js"></script>
<script src="/fair/ipad/rptdef/js/jquery ui/ui/jquery.ui.core.js"></script>
<script src="/fair/ipad/rptdef/js/jquery ui/ui/jquery.ui.widget.js"></script>
<script src="/fair/ipad/rptdef/js/jquery ui/ui/jquery.ui.mouse.js"></script>
<script src="/fair/ipad/rptdef/js/jquery ui/ui/jquery.ui.draggable.js"></script>
<script src="/fair/ipad/rptdef/js/jquery ui/ui/jquery.ui.droppable.js"></script>
<script src="/fair/ipad/rptdef/js/jquery ui/ui/jquery.ui.sortable.js"></script>
<script src="/fair/ipad/rptdef/js/jquery ui/ui/jquery.ui.accordion.js"></script>
</head>
<body onmouseup='model001c.mouse_up_all_colunms_colloction();'>
	<div id="conntainer">
		<div id="banner">
			<div id="back_btn"
				onclick="window.location.replace('/nea/core/object/object.jsp?table=PAD_RPT&&fixedcolumns=&id=-1');"
				class="btns banner_item">&nbsp;返回</div>
			<div id="save_btn" onclick="" class="btns banner_item">&nbsp;保存
			</div>
			<div class="banner_item">
				选择模板:<select id="switchmodel" onchange="mc.activeModel();"></select>
			</div>
			<div class='max_line_div'>
				<div class='max_line_div_items'>当超过</div>
				<div class='max_line_div_items'><input value='12' size='2'></input></div>
				<div class='max_line_div_items'>行时将全屏显示</div>
			</div>
		</div>
		<div id="rpt_models">
			<div id="real_models">
			</div>
			<div id="real_models_end"></div>
		</div>
	</div>
	<script type="text/javascript">
		jQuery(document).ready(function(){
			mc.initmc();
			mc.activeModel();
		});
	</script>
</body>
</html>