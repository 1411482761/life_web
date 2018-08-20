<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@page errorPage="/nea/error.jsp"%>
<%@ include file="/nea/core/common/init.jsp" %>
<% String sessionkey = request.getParameter("sessionkey"); %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="apple-touch-fullscreen" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
<meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no" />
<meta http-equiv="Cache-Control" content="max-age=0,no-store,no-cache,must-revalidate" />
<meta http-equiv="Expires" content= "-1" />
<meta http-equiv="Pragma" content="no-cache" />

<script language="javascript" src="/nea/core/js/top_css_ext.js"></script>
<script language="javascript" src="/nea/core/js/ieemu.js"></script>
<script language="javascript" src="/nea/core/js/cb2.js"></script>
<script language="javascript" src="/nea/core/js/xp_progress.js"></script>
<script language="javascript" src="/nea/core/js/helptip.js"></script>
<script language="javascript" src="/nea/core/js/common.js"></script>
<script language="javascript" src="/nea/core/js/print.js"></script>

<link rel="stylesheet" href="/fair/ipad/css/reports/reports.css"
	type="text/css" media="screen" title="no title" charset="utf-8">
<link rel="stylesheet" href="/fair/ipad/css/reports/kpicard.css"
	type="text/css" media="screen" title="no title" charset="utf-8">
<script language="javascript" src="/fair/ipad/js/prototype.js"></script>
<script language="javascript" src="/fair/ipad/js/jquery.js"></script>
<script type="text/javascript">jQuery.noConflict();</script>
<script language="javascript" src="/fair/ipad/js/formatter.js"></script>
<script language="javascript" src="/fair/ipad/js/jquery-ui-1.8/jquery.ui.ipad.js"></script>
<script language="javascript" src="/fair/ipad/js/jquery-ui-1.8/jquery.ui.position.js"></script>
<script language="javascript" src="/fair/ipad/js/jquery-ui-1.8/jquery.ui.core.js"></script>
<script language="javascript" src="/fair/ipad/js/jquery-ui-1.8/jquery.ui.widget.js"></script>
<script language="javascript" src="/fair/ipad/js/jquery-ui-1.8/jquery.ui.mouse.js"></script>
<script language="javascript" src="/fair/ipad/js/jquery-ui-1.8/jquery.ui.draggable.js"></script>
<script language="javascript" src="/fair/ipad/js/jquery-ui-1.8/jquery.ui.droppable.js"></script>
<script language="javascript" src="/fair/ipad/js/jquery-ui-1.8/jquery.ui.resizable.js"></script>
<script language="javascript" src="/fair/ipad/js/highcharts/highcharts.js"></script>
<script language="javascript" src="/fair/ipad/js/highcharts/themes/gray.js"></script>
<script language="javascript" src="/fair/ipad/js/reports/reportscontrol.js" charset='utf-8'></script>
<script language="javascript" src="/fair/ipad/js/reports/kpicardcontrol.js" charset='utf-8'></script>

<script language="javascript" src="/nea/core/js/formkey.js"></script>
<script language="javascript" src="/nea/core/js/selectableelements.js"></script>
<script language="javascript" src="/nea/core/js/selectabletablerows.js"></script>
<script type="text/javascript" src="/nea/core/js/controller.js"></script>
<script type="text/javascript" src="/nea/core/js/dwr.engine.js"></script>
<script type="text/javascript" src="/nea/core/js/dwr.util.js"></script>
<script language="javascript" src="/nea/core/js/application.js"></script>
<script language="javascript" src="/nea/core/js/alerts.js"></script>
<script language="javascript" src="/nea/core/js/dw_scroller.js"></script>
<script language="javascript" src="/nea/core/js/portletcontrol.js"></script>
<script language="javascript" src="/nea/core/js/init_portalcontrol_<%=locale.toString()%>.js"></script>
<script language="javascript" src="/nea/core/js/object_query.js"></script>
<script language="javascript" src="/nea/core/js/categorymenu.js"></script>
<script language="javascript" src="/nea/core/js/dockmenu.js"></script>
<script language="javascript" src="/nea/core/js/outline.js"></script>
<script language="javascript" src="/nea/core/js/rest.js"></script>

<title>Charles & Keith - OrderingBoard</title>
</head>
<body onload="window.top.scrollTo(0, 1);">
	<div id="container">
		<div id="viewtype">
			<div class="banner">
				<div class="companylogo"></div>
			</div>
			<div id="viewports">
				<ul>
					<li onclick="kcc.getActived();" style="background: url('/fair/ipad/img/kpi.png');">
						<div class="viewtype-notice">
							<div class="viewtype-name">
								KPI
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>
		<div id="views">
			<div id="kpicard-container" class="viewport">
				<div id="kpicard-buttons">
					<div id="kpicard-back" class="kpicard-button" onclick="kcc.goBack();"><div class="kpicard-button-value">返回</div></div>
				</div>
				<div id="kpicard-grade">
					<div id="kpicard-grade-left" class="text">Your scores:</div>
					<div id="kpiscores" class="grade"></div>
					<div id="kpicard-grade-right" class="text">Rank:</div>
					<div id="kpirank" class="grade"></div>
				</div>
				<div id="rankdesc">You prevail <span id="rankdetail"></span> of this board</div>
				<div id="kpiscategories">
					<table id="categoriestable">
						<thead id="categoriestable-head">
							<tr>
								<td class="categoriestable-category">Category</td>
								<td class="categoriestable-kpi">KPI</td>
								<td class="categoriestable-weight">Weight</td>
								<td class="categoriestable-rate">Rate</td>
								<td class="categoriestable-scores">Scores</td>
							</tr>
						</thead>
						<tbody id="categoriestable-body"></tbody>
					</table>
					<div id="categoriestable-subtotal">
						<span id="categoriestable-subtotal-left">Total:&nbsp;<span id="categoriestable-subtotal-weight"></span></span>
						<span id="categoriestable-subtotal-right">Sum:&nbsp;<span id="categoriestable-subtotal-scores"></span></span>
					</div>
				</div>
				<div id="mykpi">
					<div>
						<span class="kpititle">KPI Name:&nbsp;</span>
						<span id="kpiname"></span>
					</div>
					<div id="kpidesc">
						<span class="kpititle">Description:&nbsp;</span>
						<span id="kpidesctext"></span>
					</div>
					<div id="kpi">
						<table id="kpitable">
							<thead id="kpitable-head">
								<tr>
									<td class="kpitable-name"></td>
									<td class="kpitable-excellent">Excellent&nbsp;<span class="lamp-g"></span></td>
									<td class="kpitable-good">Good&nbsp;<span class="lamp-y"></span></td>
									<td class="kpitable-order">In&nbsp;Order</td>
									<td class="kpitable-rate">Rate</td>
								</tr>
							</thead>
							<tbody id="kpitable-body"></tbody>
						</table>
						<div id="kpitable-subtotal">Total Rate:&nbsp;<span id="kpitable-rate"></span></div>
						<div id="kpitable-filter"></div>
					</div>
				</div>
			</div>
			<div id="views-loading" class="mainpageajax">
				<div class="loadingimg">
					<div id="views-loadinglocale" class="loadinglocale"></div>
				</div>
			</div>
			<div id="views-nomatched" class="mainpageajax">
				<div id="views-noresult" class="noresult"></div>
			</div>
		</div>
		<div id="footer">
			<div class="hr"></div>
			<div id="footer-left"> &copy; Lifecycle. All Rights Reserved</div>
			<div id="footer-right"> &reg; Powered by Lifecycle RCP</div>
		</div>
	</div>
	<script type="text/javascript">
		jQuery(document).ready(function(){
			rc.generateViews('<%= sessionkey%>');
		});
	</script>
</body>
</html>