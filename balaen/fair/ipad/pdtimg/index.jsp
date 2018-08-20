<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<title>商品列表</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="Cache-Control" content="max-age=0,no-store,no-cache,must-revalidate" />
<meta http-equiv="Expires" content="-1" />
<meta http-equiv="Pragma" content="no-cache" />

<link type="text/css" rel="stylesheet" href="/nea/core/js/xloadtree111/xtree.css" />
<link type="text/css" rel="StyleSheet" href="/nea/core/css/portlet.css">
<!-- <link type="text/css" rel="stylesheet" href="/nea/core/themes/classic/01/css/object.css"> -->
<!-- <link type="text/css" rel="stylesheet" href="css/object.css"> -->
<!-- <link type="text/css" rel="stylesheet" href="/nea/core/themes/classic/01/css/portal_header.css"> -->
<link type="text/css" rel="stylesheet" href="/nea/core/themes/classic/01/css/portal.css">
<link type="text/css" rel="StyleSheet" href="/nea/core/css/cb2.css">
<link type="text/css" rel="stylesheet" href="/nea/core/css/jquery.alerts.css">
<link type="text/css" rel="stylesheet" href="/nea/core/themes/classic/01/css/nds_portal.css">
<link type="text/css" rel="stylesheet" href="/nea/core/themes/classic/01/css/dockmenu.css">
<link type="text/css" rel="StyleSheet" href="/nea/core/themes/classic/01/css/custom-ext.css" />
<link type="text/css" rel="StyleSheet" href="/nea/core/themes/classic/01/css/ui.tabs.css" />
<link type="text/css" rel="stylesheet" href="/nea/core/themes/ui-lightness/ui.all.css" />
<link type="text/css" rel="stylesheet" href="/nea/core/themes/classic/01/css/objdropmenu.css">
<link type="text/css" rel="StyleSheet" href="/nea/ext/themes/classic/01/portal.css">
<!-- <link type="text/css" rel="StyleSheet" href="/nea/core/css/portal.css" /> -->
<link type="text/css" rel="StyleSheet" href="/fair/ipad/pdtimg/css/pdtimg.css" />

<script type="text/javascript" src="/nea/core/js/top_css_ext.js"></script>
<script language="javascript1.5" src="/nea/core/js/ieemu.js"></script>
<script type="text/javascript" src="/nea/core/js/cb2.js"></script>
<script type="text/javascript" src="/nea/core/js/xp_progress.js"></script>
<script type="text/javascript" src="/nea/core/js/helptip.js"></script>
<script type="text/javascript" src="/nea/core/js/common.js"></script>
<script type="text/javascript" src="/nea/core/js/print.js"></script>
<script type="text/javascript" src="/nea/core/js/prototype.js"></script>
<script type="text/javascript" src="/nea/core/js/jquery1.3.2/jquery-1.3.2.min.js"></script>
<script type="text/javascript" src="/nea/core/js/jquery1.2.3/hover_intent.js"></script>
<script type="text/javascript">jQuery.noConflict();</script>		
<script type="text/javascript" src="/nea/core/js/portal/sniffer.js"></script>
<script type="text/javascript" src="/nea/core/js/portal/ajax.js"></script>
<script type="text/javascript" src="/nea/core/js/portal/util.js"></script>
<script type="text/javascript" src="/nea/core/js/portal/portal.js"></script>
<script type="text/javascript" src="/nea/core/js/xloadtree111/xtree.js"></script>
<script type="text/javascript" src="/nea/core/js/xloadtree111/xmlextras.js"></script>
<script type="text/javascript" src="/nea/core/js/xloadtree111/xloadtree.js"></script>
<script type="text/javascript" src="/nea/core/js/formkey.js"></script>
<script type="text/javascript" src="/nea/core/js/selectableelements.js"></script>
<script type="text/javascript" src="/nea/core/js/selectabletablerows.js"></script>
<script type="text/javascript" src="/nea/core/js/portal/dragdrop/coordinates.js"></script>
<script type="text/javascript" src="/nea/core/js/portal/dragdrop/drag.js"></script>
<script type="text/javascript" src="/nea/core/js/calendar.js"></script>
<script type="text/javascript" src="/nea/core/js/controller.js"></script>
<script type="text/javascript" src="/nea/core/js/dwr.engine.js"></script>
<script type="text/javascript" src="/nea/core/js/dwr.util.js"></script>
<script type="text/javascript" src="/nea/core/js/application.js"></script>
<script type="text/javascript" src="/nea/core/js/alerts.js"></script>
<script type="text/javascript" src="/nea/core/js/dw_scroller.js"></script>
<script type="text/javascript" src="/nea/core/js/portletcontrol.js"></script>
<script type="text/javascript" src="/nea/core/js/init_portalcontrol_zh_CN.js"></script>
<script type="text/javascript" src="/nea/core/js/fixedtableheader.js"></script>
<script type="text/javascript" src="/nea/core/js/portalcontrol.js"></script>
<script type="text/javascript" src="/nea/core/js/object_query.js"></script>
<script type="text/javascript" src="/nea/core/js/categorymenu.js"></script>
<script type="text/javascript" src="/nea/core/js/dockmenu.js"></script>
<script type="text/javascript" src="/nea/core/js/outline.js"></script>
<script type="text/javascript" src="/nea/core/js/jquery1.3.2/ui.core.js"></script>
<script type="text/javascript" src="/nea/core/js/jquery1.3.2/ui.dialog.js"></script>
<script type="text/javascript" src="/nea/core/js/jquery1.3.2/ui.draggable.js"></script>
<script type="text/javascript" src="/nea/core/js/jquery1.3.2/ui.resizable.js"></script>
<script type="text/javascript" src="/nea/core/js/jquery1.3.2/jquery.bgiframe.js"></script>
<script type="text/javascript" src="/nea/core/js/jquery1.3.2/ui.tabs.js"></script>
<script type="text/javascript" src="/nea/core/js/messagescontrol.js"></script>
<script type="text/javascript" src="/nea/core/js/jquery.alerts.js"></script>
<script type="text/javascript" src="/nea/core/js/objdropmenu.js"></script>
<script type="text/javascript" src="/nea/ext/js/portal.js"></script>
<script type="text/javascript" src="/nea/core/js/rest.js"></script>
<script type="text/javascript" src="/fair/ipad/pdtimg/js/jquery.cookie.js"></script>
<script type="text/javascript" src="/fair/ipad/pdtimg/js/index.js"></script>
</head>
<body>
	<div id="yinying">
	<div style=" display:none" class="spinner">
		<div class="spinner-container container1">
		    <div class="circle1"></div>
		    <div class="circle2"></div>
		    <div class="circle3"></div>
		    <div class="circle4"></div>
		  </div>
		  <div class="spinner-container container2">
		    <div class="circle1"></div>
		    <div class="circle2"></div>
		    <div class="circle3"></div>
		    <div class="circle4"></div>
		  </div>
		  <div class="spinner-container container3">
		    <div class="circle1"></div>
		    <div class="circle2"></div>
		    <div class="circle3"></div>
		    <div class="circle4"></div>
		  </div>
	</div>  
	</div>

	<div id="toolbar">
		<select id="selectFair" class="left" onchange="pdts.makeSelect();">
			<option value="0">全部</option>
		</select>
		<input type="text" id="pdtName" class="left" title="输入商品编号" onChange="pdts.setPdtName();" onFocus="pdts.pnFocus();" onBlur="pdts.pnBlur();"/>
		<a id="filter" href="javascript:pdts.selectCriteria();" title="选择查询条件" class="left"></a>
		<input type="button" id="search" value="查询" onClick="pdts.list();"/> |
		<input type="button" id="delete" value="删除图片" onClick="pdts.remove();"/> |
		<input type="button" id="batch" value="批量导入" onClick="pdts.batch();"/> |
		<input type="button" id="export" value="导出无图商品" onClick="pdts.exportExcel();"/> |
		<input type="button" id="reload" value="清除缓存" onClick="pdts.reloadCache();"/>
	</div>
	<div id="header">
		<div class="left">
			<label><input id="selectAll" type="checkbox" onClick="pdts.selectAll()"/>全选</label>
			<label><input id="selectNoImg" type="checkbox" onClick="pdts.selectNoImg()"/>显示无图商品</label>
		</div>
		<div id="pager" class="left">
			<a id="firstPage" href="javascript:pdts._goto('first');" title="首页"></a>
			<a id="prevPage" href="javascript:pdts._goto('prev');" title="上页"></a>
			<a id="nextPage" href="javascript:pdts._goto('next');" title="下页"></a>
			<a id="lastPage" href="javascript:pdts._goto('last');" title="末页"></a>
			<select id="pageSize" onChange="pdts.setPageSize(this);">
				<option value="10">10</option>
				<option value="20">20</option>
				<option value="50">50</option>
				<option value="100">100</option>
				<option value="200">200</option>
				<option value="500">500</option>
				<option value="1000">1000</option>
			</select>行/页,
			<span id="rowsRange"></span>/<span id="totalRows"></span>
		</div>
	</div>
	<div id="list"></div>
</body>
</html>