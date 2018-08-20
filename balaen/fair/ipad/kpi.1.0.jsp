<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<% String sessionkey = request.getParameter("sessionkey"); %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<%@ include file="kpi_meta.jsp" %>
</head>
<body onload="window.top.scrollTo(0, 1);">
	<div id="container">
		<div id="viewtype">
			<div class="kpi-banner">
				<div id="mainpage-title" class="kpi-title"></div>
			</div>
			<div id="viewports">
				<ul>
					<!-- <li onclick="kcc.getActived();" style="background: url('/fair/ipad/img/kpi.png');">
						<div class="viewtype-notice">
							<div class="viewtype-name">
								KPI
							</div>
						</div>
					</li> -->
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
				<div id="rankdesc">You previl <span id="rankdetail"></span> of this board</div>
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
			<div id="footer-left"></div>
			<div id="footer-right"></div>
		</div>
	</div>
	<script type="text/javascript">
		jQuery(document).ready(function(){
			rc.generateViews('<%= sessionkey%>');
		});
	</script>
</body>
</html>