<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="java.util.*,org.slf4j.Logger,org.slf4j.LoggerFactory,org.json.*,java.text.SimpleDateFormat,java.sql.ResultSet,java.sql.Connection,java.sql.PreparedStatement,com.agilecontrol.nea.core.query.web.*,com.agilecontrol.nea.core.control.web.*,com.agilecontrol.nea.core.util.*,com.agilecontrol.nea.core.schema.*,com.agilecontrol.nea.core.query.*, java.io.*,java.util.*,com.agilecontrol.nea.core.control.util.*,com.agilecontrol.nea.core.report.*,com.agilecontrol.nea.core.web.bean.*,com.agilecontrol.nea.core.model.*, com.agilecontrol.nea.core.model.dao.*,com.agilecontrol.nea.util.*,org.apache.struts.Globals"%>
 <%


	 UserWebImpl userWeb =null;
		Locale locale=null;
		try{
			userWeb= ((UserWebImpl)WebUtils.getSessionContextManager(session).getActor(WebKeys.USER));
			locale=userWeb.getLocale();System.out.println("########## found userWeb=null##########221"+locale.toString());
		}catch(Throwable userWebException){
			System.out.println("########## found userWeb=null##########"+userWebException);
			locale=TableManager.getInstance().getDefaultLocale();
		}
		Date date = new Date();
		String sessionkey = request.getParameter("sessionkey");
		String printers="";
	 if("none".equals(ConfigValues.get("fair.print.support.pin.token","none")) && Validator.isNotNull(ConfigValues.get("printers"))){
	 	printers=MessagesHolder.getInstance().translateMessage(ConfigValues.get("printers"),userWeb.getLocale());
	 }

	boolean isMgrSub=ConfigValues.get("suggest.isMgrSub",false);
	boolean isSumMgrSub=ConfigValues.get("suggest.isSumMgrSub",false);
	boolean isShowPrint = ConfigValues.get("suggest.isShowPrint",true);
	boolean isShowPleaseWait = ConfigValues.get("suggest.isShowPleaseWait",false);
    boolean isShowOrderCopy = ConfigValues.get("suggest.isShowOrderCopy",true);
    boolean is_show_copy_filter = ConfigValues.get("fair.is_show_copy_filter",false);
		/*response.setHeader("Pragma", "no-cache");
	 response.setHeader("Cache-Control", "no-load"); //ios 6 will cache reponse if no this header
	 response.setHeader("Expires", "Thu, 01 Dec 1994 16:00:00 GMT"); */

	 boolean isJumpGeneralmap=ConfigValues.get("fair.about.isoverview", false);
	 boolean isSKU=ConfigValues.get("fair.isSKU",false);
	 boolean isQrcode=ConfigValues.get("wxfair.isQrcode",false);
	 
	 boolean canClearOrder = ConfigValues.get("fair.clear.order",false);
	 /*蓝丝羽的优惠活动下拉框*/
	 boolean promotion = ConfigValues.get("fair.has_promotion_list",false);
	 /* 2018-5-3 指标达成报表 */
	String lookRPTType = ConfigValues.get("fair.look_rpt_type","");
  %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="Cache-Control" content= "no-cache">
<meta http-equiv="Expires" content= "0">
<meta name="apple-touch-fullscreen" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
<meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
<script language="javascript" src="/fair/ipad/js/prototype.js"></script>
<script language="javascript" src="/fair/ipad/js/jquery.js"></script>
<script type="text/javascript">jQuery.noConflict();</script>
<%if(canClearOrder==true){ %>
<script type="text/javascript" src="/fair/ipad/js/runsql.js?t=<%=date%>"></script>
<%}%>
<script language="javascript" src="/fair/ipad/js/ordercontrol.js?t=<%=new Date().getTime() %>" charset='utf-8'></script>
<script language="javascript" src="/nea/core/js/rest.js"></script>
<%if(isQrcode==true){ %>
	<script language="javascript" src="/fair/ipad/wxfair/js/weChatQrcodeControl.js?t=<%=date %>"></script>
<%}%>
<script language="javascript" src="/fair/ipad/wxfair/js/jquery.qrcode.min.js"></script>
<title>Balanced Order - Lifecycle RCP</title>
<style>
 	#qrcode canvas{
	 	outline:solid 12px white;
		width:25%;
		height:30%; 
	}
	#promotion-desc {
		margin-top: 40px;
	}
	#promotion-select {
		position: absolute;
		margin-top: 40px;
		margin-left: 150px;
		display: block;
		font-size: 15px;
		padding-left: 12px;
		width: 180px;
	}
</style>
</head>
<body>
	<div class='gobo'>
	
	<div id="picture"></div>
<!-- 	<div id='changepwd' onclick='orderc.changepwd()'></div> -->
	<div id="evaluation" class="content">
		<div id="evaluation-desc"></div>
		<div id="evaluation-main">
			<textarea id="evaluation-textarea"></textarea>
			<div id="evaluation-save" onclick="orderc.ajaxCmd('save');">保存</div>
		</div>
	</div>
	<%if(isQrcode==true){ %>
	<div id="qrcodemain" style="text-align:left;" class="content">
		<div id="qrcode" style="margin-top:70px;margin-left:80px;"></div>
		<div style="margin-left:40%; margin-top:-210px;">
			<h2>贯信微信平台介绍</h2>
			<h3>使用微信扫描下面的二维码，即可查看此用户相关报表信息.</h3>
			<h4>注意:二维码已绑定用户信息,请防止被无关人员查看</h4>
			<h4>报表同步时间:<span id="rptSyncTime"></span> </h4>
		</div>
	</div>
	<%}%>
	<div id="textarea" class='content'>
		<div id="textarea-desc" class="moduledesc"></div>
		<div id="textarea-val"></div>
	</div>
	<% if(promotion == true) { %>
	<div id="promotion" class='content'>
		<div id="promotion-desc" class="moduledesc"></div>
		<div id="promotion-val">
			<select id="promotion-select" onchange="orderc.ajaxCmd('ChangePromotion');" disabled="disabled"></select>
		</div>
	</div>
	<% } %>
	<div id="news" class='content'>
		<div id="news-desc" class="moduledesc"></div>
		<div id="news-val"></div>
	</div>
	<!-- <div id="abouts" class='content'>
		<div id="abouts-desc" class="moduledesc"></div>
		<div id="abouts-val"></div>
		<div id="getmore"  onclick="orderc.getmore()"></div>
	</div> -->
	<%if(isShowOrderCopy==true){%>
	<div id="copyorder" class='content'>
		<div class="moduledesc"></div>
		<div id="tocopy">
				<%if(is_show_copy_filter==false){%>
		 			<select></select>
		 			<span></span>
					<select></select>
				<%}%>
				<%if(is_show_copy_filter==true){%>
				 	<div class="buyerList" id="sbuyer" onclick="orderc.selectBuyers(this);"></div>
					<div class="dropdown"></div>
					<div class="selectContainer">
						<div class='topbar_search' id="sbuyerTopbar" style="display:none"></div>
						<div class="selectBuyer" id="sbuyerSelect" style="display:none">
							<ul></ul>
						</div>
					</div>
					<span></span>
					<div class="buyerList" id="tbuyer" onclick="orderc.selectBuyers(this);"></div>
					<div class="dropdown"></div>
					<div class="selectContainer">
						<div class='topbar_search' id="tbuyerTopbar" style="display:none"></div>
						<div class="selectBuyer" id="tbuyerSelect" style="display:none">
							<ul></ul>
						</div>
					</div>
				<%}%>
		</div>
		<div id="copy" class="buttons" onclick="orderc.coyeOrder();" style="display: block;margin-bottom:125px">
			<div id="copy-desc" class="button-desc"></div>
		</div>
	</div>
	<%if(canClearOrder==true){ %>
	<div id="clearOrderContent" class='content'  style='display:none;'>
		<div id="clearOrder" class="moduledesc"></div>
		<div id="toclear">
			<select></select>
		</div>
		<div id="clear" class="buttons" onclick="orderc.clearOrder();">
			<div id="clear-desc" class="button-desc"></div>
		</div>
	</div>
	 <%}%>
  <%}%>
	<div id="printerlist" class='content' style='display:none;'>
		<div class="moduledesc"></div>
		<ul id="printers"></ul>
	</div>
	<div id="printertemplates" class='content' style='display:none;'>
		<div class="moduledesc"></div>
		<ul id="templates"></ul>
	</div>
	<div id="processing">
		<div id="processing-desc"></div>
	</div>
	<%if(!"none".equals(ConfigValues.get("fair.print.support.pin.token","none")) && ConfigValues.get("fair.show_print_button",true)){ %>
	<div id="pin-container" class='content'>
		<div id="pin-desc"></div>
		<div id="pin"></div>
	</div>
	<%} %>

	<div id="container"></div>
	<div id="container-top"></div>
	<div id="container-bottom"></div>
	<div id="buttons">
		<div class="buttons" onclick="orderc.ajaxCmd('Print');" style='display:none;'>
			<div id="print" class="button-desc" ></div>
		</div>
		<div class="buttons" id="button-gather" onclick="orderc.ajaxCmd('GatherToDistribute');">
			<div id="gather" class="button-desc"></div>
		</div>
		<div id="button-dis_submit" class="buttons" onclick="orderc.ajaxCmd('UnSubmit');">
			<div id="dis_submit" class="button-desc"></div>
		</div>
		<div class="buttons" onclick="orderc.ajaxCmd('reject');">
			<div id="reject" class="button-desc"></div>
		</div>
		<div class="buttons" onclick="orderc.ajaxCmd('accept');">
			<div id="approve" class="button-desc"></div>
		</div>
		<%if(!lookRPTType.isEmpty()) {%>
			<div id="button-lookrpt" class="buttons" onclick="window.location.href='/fair/ipad/kpi2.jsp?index=<%=lookRPTType%>&showTopBar=true&button=close'" style="display: block;">
				<div id="lookrpt" class="button-desc"><font style="font-size:15px">Target Achieved</font></div>
			</div>
		<%} %>
		<div id="button-submit" class="buttons" onclick="orderc.ajaxCmd('Submit');">
			<div id="submit" class="button-desc"></div>
		</div>
		<div id="button-summaryize" class="buttons" onclick="orderc.autoSUM();">
			<div id="summaryize" class="button-desc"></div>
		</div>
		<div class="buttons" id="button-clean" onclick="orderc.clean('Clean',<%=isSKU%>);">
			<div id="clean" class="button-desc"></div>
		</div>
		<div class="buttons" id="button-sync" onclick="orderc.sync();">
			<div id="sync" class="button-desc"></div>
		</div>

		<div class="buttons" id="button-batch" onclick="orderc.batch();">
			<div id="batch" class="button-desc"></div>
		</div>

		<div class="buttons" onclick="orderc.coyeOrder('multiple');">
			<div id="multi_copy" class="button-desc" ></div>
		</div>
	</div>
	</div>
	<script type="text/javascript">

    jQuery(".gobo").hide();
	</script>
	<script type="text/javascript">
		jQuery(document).ready(function(){
			if(<%=isJumpGeneralmap%>){
				orderc.isJumpGeneralmap('<%=sessionkey%>','<%=printers%>',<%=isMgrSub%>);
			}else{
				orderc.onLoad('<%=sessionkey%>','<%=printers%>',<%=isMgrSub%>,<%=isSumMgrSub%>,<%=isShowPrint%>,<%=isShowPleaseWait%>);
			}
		});
		setTimeout(function () {
			jQuery(".gobo").show();
	    }, 50);

	</script>
</body>
</html>
