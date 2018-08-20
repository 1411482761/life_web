<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="org.slf4j.Logger,org.slf4j.LoggerFactory,org.json.*,java.text.SimpleDateFormat,java.sql.ResultSet,java.sql.Connection,java.sql.PreparedStatement,com.agilecontrol.nea.core.query.web.*,com.agilecontrol.nea.core.control.web.*,com.agilecontrol.nea.core.util.*,com.agilecontrol.nea.core.schema.*,com.agilecontrol.nea.core.query.*, java.io.*,java.util.*,com.agilecontrol.nea.core.control.util.*,com.agilecontrol.nea.core.report.*,com.agilecontrol.nea.core.web.bean.*,com.agilecontrol.nea.core.model.*, com.agilecontrol.nea.core.model.dao.*,com.agilecontrol.nea.util.*,org.apache.struts.Globals"%>    
<% String sessionkey = request.getParameter("sessionkey"); %>
<% String storeid = request.getParameter("storeid"); %>
<% String showTopBar = request.getParameter("showTopBar"); %>
<% String index = request.getParameter("index"); %>
<% String pdtid = request.getParameter("pdtid"); 
   String button = request.getParameter("button");
   String isback="";
   String isacross="N";
   if(request.getParameter("isback")!=null) 
  	isback=request.getParameter("isback");
   if(request.getParameter("isacross")!=null) 
	   isacross=request.getParameter("isacross");


   boolean isMgrRpt=ConfigValues.get("kpi.isMgrRpt",false);
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<%@ include file="kpi_meta.jsp" %>
	<style type="text/css">
		.kpi-banner>ul{
			background-color: transparent;
			height: 44px;
			left:20px;
			position: fixed;
			top:0px;
			z-index: 900;
		}
		.kpi-banner>ul>li{
			background-color: #5e5e5e;
			border: 1px solid #5f5f5f;
			border-radius: 15px;
			bottom:3px;
			display:block;
			float:left;
			font-size: 15px;
			height:32px;
			line-height: 32px;
			margin-right: 12px;
			position: relative;
			text-align: center;
			top: 5px;
			width:74px;
		}
		.kpi-banner>ul>li.selected{
			background-color: #252525;
			border: 1px solid #262626;
			border-radius: 15px 15px 0px 0px;
			height: 38px;
		}
	    #viewNewHead{
			overflow-x: auto;
			width: 90%;
			margin-left: 5%;
			white-space: nowrap;
			height: 40px;
			line-height: 40px;
			font-size: 16px;
	    }
	    #viewNewHead span{
			margin: 0 15px;
			min-width: 100px;
			text-align: center;
		}
		#viewNewHead .showbutton{
			border-bottom: 2px solid black;
		}





	</style>
</head>
<body onload="window.top.scrollTo(0, 1);" id="report">
	<div id="viewNewHead"></div>
	<div id="kpi-debug" onclick="rc.cDebug(this);"> 调试 </div>
	<ul id="kpi-filter" class="rc-filter">
		<li id="f-filter" onclick="rc.cFilter(this,'buyer');"></li>
		<li id="c-filter" onclick="rc.cFilter(this,'pdt');"></li>
		<li id="ext-filters"></li>
		<li id="df-filter"><select id="singlestore" style="display:none;min-width:120px"></select></li>
		<li id="df-filter-button" style="display:none;"><input type="button" value="搜索" onclick="rc.searchBuyerpt()"/>
	    </li>
		<li id="df-filter-input" style="display:none;"><input type="text" id="flist" style="height:30px"/></li>
		<li onclick='view009c.synchronize()' id='synchronize' style='display:none'></li>
		<%if("close".equals(button)) {%>
			<li id="close" onclick="javascript:history.back(-1);">关闭 </li>
		<%} %>
	</ul>
	<iframe  style="display:none;    position: absolute;
		left: 0px;
		right: 0px;
		top: 40px;
		bottom: 0px;" id="reportIframe" width="100%" height="100%" src="" scrolling="">
	</iframe>

	<div id="container" >
		<div id="viewtype">
			<div class="kpi-banner">
				<ul>
				</ul>
				 <% if(isback.equals("Y")) { %>
				<div class="kpi_back" onclick="window.location.replace('/fair/ipad/airview.jsp')">
					返回
				</div>
				<%} %>
				<div id="mainpage-title" class="kpi-title"></div>
			</div>
			<div id="viewports">
				<ul id="viewslist"></ul>
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
			<div id="footer-left"></div>
			<div id="footer-right"></div>
		</div>
	</div>
	<script type="text/javascript">
		jQuery(document).ready(function(){
			rc.generateViews('<%= sessionkey%>','<%= storeid%>', '<%= pdtid%>','<%=isback%>','<%=isacross%>','<%=isMgrRpt%>','<%=showTopBar%>','<%=index%>',true);
			jQuery("#container").height(jQuery(window).height()-50);
			jQuery("#viewtype").height(jQuery(window).height()-76);
			jQuery("#viewports").height(jQuery(window).height()-120);
<%-- 			if('<%=showTopBar%>' !=null && '<%=showTopBar%>' != undefined && '<%=showTopBar%>'!= "" && '<%=showTopBar%>'!= 'null'){
				jQuery("#viewtype").hide();
				var interval1 = setInterval(function(){
					//alert(JSON.stringify(this.cacheData));
					console.log(this.cacheData);
					if(this.cacheData !=null && this.cacheData != undefined && this.cacheData != "" && this.cacheData != 'null'){
						doJump('<%=index%>','<%=isback%>','<%=showTopBar%>');
						clearInterval(interval1);
					}
				}, 200);
		    } --%>
		});
	</script>
</body>
</html>