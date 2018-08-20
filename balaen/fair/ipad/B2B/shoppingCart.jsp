<%@ page language="java" pageEncoding="utf-8"%>
<%@ page
	import="org.slf4j.Logger,org.slf4j.LoggerFactory,org.json.*,java.text.SimpleDateFormat,java.sql.ResultSet,java.sql.Connection,java.sql.PreparedStatement,com.agilecontrol.nea.core.query.web.*,com.agilecontrol.nea.core.control.web.*,com.agilecontrol.nea.core.util.*,com.agilecontrol.nea.core.schema.*,com.agilecontrol.nea.core.query.*, java.io.*,java.util.*,com.agilecontrol.nea.core.control.util.*,com.agilecontrol.nea.core.report.*,com.agilecontrol.nea.core.web.bean.*,com.agilecontrol.nea.core.model.*, com.agilecontrol.nea.core.model.dao.*,com.agilecontrol.nea.util.*,org.apache.struts.Globals"%>
<%
	UserWebImpl userWeb = null;
	Locale locale = null;
	int userId = 0;
	boolean isEndUser=false;
	try {
		userWeb = ((UserWebImpl) WebUtils.getSessionContextManager(
				session).getActor(WebKeys.USER));
		userId = userWeb.getUserId();
		locale = userWeb.getLocale();
		
		String utype=(String)QueryEngine.getInstance().doQueryOne("select utype from users where id=?", new Object[]{userId});
		if(utype.equals("04")){
			isEndUser=true;
		}
	} catch (Throwable userWebException) {
		System.out.println("########## found userWeb=null##########"
				+ userWebException);
		locale = TableManager.getInstance().getDefaultLocale();
	}

	String sessionkey = request.getParameter("sessionkey");
	String isCollection = request.getParameter("iscollection");
	String foid = request.getParameter("foid");
	String fairid = request.getParameter("fairid");
	String type = request.getParameter("ordertype");
	String date = String.valueOf(new Date().getTime());
	  String loadIdx= request.getParameter("loadIdx");
	    String titleType=request.getParameter("titleType");
		String isSupply="";
	    if(userWeb.getProperty("isSupply")==null)  isSupply="N";
	    else isSupply=(String)userWeb.getProperty("isSupply");
%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-class" content="text/html; charset=UTF-8">
<meta http-equiv="Cache-Control" content="no-cache">
<meta http-equiv="Expires" content="0">
<meta name="apple-touch-fullscreen" content="yes" />
<meta name="format-detection" content="telephone=no">
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
<meta name="viewport"
	content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
<link rel="stylesheet"
	href="/fair/ipad/B2B/css/shoppingCart.css?t=<%=date%>"
	class="text/css" media="screen" title="no title" charset="utf-8">
<link rel="stylesheet" href="/fair/ipad/css/bootstrap/bootstrap.min.css">
<script type="text/javascript" src="/fair/ipad/js/prototype.js"></script>
<script type="text/javascript" src="/fair/ipad/js/jquery-1.11.3.js"></script>
<script type="text/javascript" src="/fair/ipad/js/bootstrap/bootstrap.min.js"></script>
<script type="text/javascript">jQuery.noConflict();</script>
<script type="text/javascript" src="/fair/ipad/js/formatter.js"
	charset='utf-8'></script>
<script type="text/javascript"
	src="/fair/ipad/B2B/js/shoppingCart.js?t=<%=date%>" charset='utf-8'></script>
<script language="javascript" src="/nea/core/js/rest.js"></script>
<title>购物车</title>
</head>
<body>
<div>
<%-- 	<nav class="navbar-default navbar-fixed-top">
	  <div class="container-fluid">
		 <div class="row top" >
		    <!-- <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2"><a href="#" rel="sidebar" ng-click="addFavorite(this);">收藏晨光</a></div> -->
		    <div class="head-margin">
		   			<span class="welcome-text">您好，欢迎 <%= userWeb.getUserDescription() %>！</span>
						<div class="btn-group">
							<span style="color: red;font-size:15.5px;cursor:pointer;"  class=" dropdown-toggle" onclick="odc.colToggle()">
								我的收藏夹 <span class="caret"></span>
							</span>
							<ul class="dropdown-menu" role="menu" id="st-colt">
								<li><a href="javascript:void(0)" onclick="odc.collection('day')">日单商品收藏</a></li>
								<li class="divider" style="background-color:red;"></li>
								<li><a href="javascript:void(0)" onclick="odc.collection('month')">月单商品收藏</a></li>
							</ul>
						</div>
						<span class="order-center" onclick="odc.ordercenter()">订单中心</span>
            		<span id="mgCenter" class="order-center" onclick="window.open('/nea/core/portal')" >管理中心</span>
            		<span><a class="top-text btn btn-default" style="padding: 2px 8px;color: red;" href="/control/logout"><%= PortletUtils.getMessage(pageContext, "sign-out",null)%></a></span>
            
            </div>	
		</div>
	  </div>
</nav> --%>
<nav class="navbar-default navbar-fixed-top" style="z-index: 1">
	  <div class="container-fluid">
		 <div class="row top" >
		   <!--  <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2"><a href="#" rel="sidebar" ng-click="addFavorite(this);">收藏晨光</a></div> -->
		    <div class="head-margin">
		    		<span class="welcome-text">您好，欢迎 <%= userWeb.getUserDescription() %>！</span>
           	<span ng-if="'<%= userWeb.getUserDescription() %>'!='guest'">		
	           	<span  dropdown  class="dropdown"  onmouseout="javaScript:jQuery('#st-colt').removeClass('showCollect')"
	           	 onmouseover="javaScript:jQuery('#st-colt').addClass('showCollect')">
	                <span class="order-center dropdown-toggle" dropdown-toggle ng-disabled="disabled" style="text-decoration: none;">我的喜欢<span class="caret"></span> </span>
	                <ul class="dropdown-menu dropdown-menu-change" id="st-colt"  onmouseout="javaScript:jQuery('#st-colt').removeClass('showCollect')"
	           	 onmouseover="javaScript:jQuery('#st-colt').addClass('showCollect')">
	                    <li><a href="javascript:void(0)" onclick="odc.collection('day')">日单喜欢商品</a></li>
	                    <li><a href="javascript:void(0)" onclick="odc.collection('month')">月单喜欢商品</a></li>
	                </ul>
	            </span>
           		<span class="order-center" onclick="odc.ordercenter()">订单中心</span>
           		<span id="mgCenter" class="order-center" onclick="odc.managercenter()" >管理中心</span>
           		<span><a class="top-text btn btn-default" style="padding: 2px 8px;color: red;" href="/control/logout"><%= PortletUtils.getMessage(pageContext, "sign-out",null)%></a></span>
            </span>
            </div>	
		</div>
	  </div>
</nav>

</div>
<nav class=" navbar-default top-fix" style="margin-top: 1.5%;">
	<img alt="" src="/fair/ipad/B2B/images/nnt.jpg" style="width: 100%;">
</nav>
	<div id="title" class="">
		<div class="st-back fl-left">
			<a href="javascript:void(0);" class="btn" onclick="odc.ordercenter()">
				<img src="/fair/ipad/B2B/images/back.jpg" />
			</a>
		</div>
		<div class="st-search fl-left">
			<form class="form-inline ">
				<div class="form-group">
					<div class="input-group">
						<input type="text" class="form-control" id="search"
						onkeydown="javascript:if(event.keyCode==13) return false;"
						onkeyup="javascript:if(event.keyCode==13) odc.dosearch();" 
							placeholder="商品名称/商品货号">
						<div class="input-group-addon bg-red">
							<img src="images/s_button.png" onclick="odc.dosearch()">
						</div>
					</div>
				</div>
			</form>
		</div>
		<div class="st-number fl-left">
			<form class="form-inline">
				<div class="form-group">
					<div id="shoptitle" class="input-group">
						<div class="input-group-addon" style="background-color: white;font-size: 20px;color: black;">
							单号：
						</div>
						<!-- <input type="text" class="form-control" id="daynum" readonly="readonly"> -->
						<span></span>
					</div>
				</div>
			</form>
		</div>
		<div class="st-prname fl-left">
			<form class="form-inline">
				<div class="form-group">
					<div id="provider" class="input-group">
						<div class="input-group-addon" style="background-color: white;font-size: 20px;color: black;">
							供应商：
						</div>
						<!-- <input type="text" class="form-control" id="daynum" readonly="readonly"> -->
						<span></span>
					</div>
				</div>
			</form>
		</div>
		<div class="st-choice fl-left">
			<form class="form-inline">
				<div class="form-group">
					<div id="provider" class="input-group">
						<select id="st-order" onchange="odc.doOrder()" class="form-control" style="color:red;">
							<option selected="selected" value="0">全部商品</option>
							<option value="1">已下量商品</option>
							<option value="2">未下量商品</option>
						</select>
					</div>
				</div>
			</form>
		</div>
		<div class="st-submit fl-left" >
			<a class="btn btn-danger"  onclick="odc.judgeOrder()">确认订单</a>
		</div>
		
	</div>
	<div id="header" class="fixed basic hscroll">
		<table></table>
	</div>
	<div id="table" class="basic hscroll">
		<div id='scrollbar-y' class='scrollc'>
			<div class='scroll scrollbar scrolly'></div>
		</div>
		<div id='scrollbar-x' class='scrollc'>
			<div class='scroll scrollbar scrollx'></div>
		</div>
		<table></table>
	</div>
	<!--分页  -->
	<div id="changePage">
		<ul class="pagination">
			<li><a class="fon_black" href="javascript:void(0);" onclick="odc.switchPage(0);">上一页</a></li>
			<li><a id="currentPage" href="#">1</a></li>
			<li><a class="fon_black" href="javascript:void(0);" onclick="odc.switchPage(1);">下一页</a></li>
			<li class="pageInfo"><label  id="total"></label>
			</li>
		</ul>
	</div>
	<div id="footer" class="fixed basic hscroll">
		<table></table>
	</div>
	<div id="toolbars" style="display: none;">
		<div id="prev" class="toolbar" ontouchstart="odc.switchPage(0);">
			<div class='toolbarimg'></div>
			<div class='toolbardesc'>上一页</div>
		</div>
		<div id="page">
			<div id="current">
				<select onchange="odc._switchPage();"></select>
			</div>
			<div id="total"></div>
		</div>
		<div id="next" class="toolbar" ontouchstart="odc.switchPage(1);">
			<div class='toolbarimg'></div>
			<div class='toolbardesc'>下一页</div>
		</div>
	</div>
	
	<div>
		 <footer>
	        <div class="container">
	       
	        	<div class="row">
	        		
					<img src="/fair/ipad/B2B/images/footer.jpg">
	            	
	                <hr style="border:1px rgb(229,229,229) solid;">
	
	               <div style="font-size: 14px;padding-bottom: 10px;color: rgb(102,102,102);text-align: center;">
		               <div>上海晨光文具股份有限公司 版权所有</div>
		               <div>copyright 2015, Shanghai M&G Stationery INC./All Rights Reserved</div>
	               </div>
	
	            </div>
	        </div>
    	</footer>
	</div>
	
	
	
	<!-- <img id="pdtimg" class="tooltips" alt="缺图" src="" onmouseout="jQuery(this).hide();"> -->
	<img id="pdtimg" class="tooltips" alt="缺图" src="">
	<div id="tooltip" class="tooltip" onclick="jQuery(this).hide();"><span></span></div>
	<div id="loading">
		<div id="loadinglocale">加载中...</div>
	</div>
	<!--月单选择框-->
	<div id="isSupply" class="modal fade">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h4 class="modal-title">请选择月单类型</h4>
				</div>
				<div class="modal-body">
					<select id="isSupply_sel">
						<option value="MON">月单</option>
						<option value="DAY">月单的补单</option>
					</select> (若不选择，默认此订单为月单;选定类型后若要更改月单类型需重新登录)
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default"
						onclick="odc.setOrderDefault()">取消</button>
					<button type="button" class="btn btn-primary" onclick="odc.setMonth()">确定</button>
				</div>
			</div>
			<!-- /.modal-content -->
		</div>
		<!-- /.modal-dialog -->
	</div>
	<script type="text/javascript">
	jQuery(document).ready(function() {
		/* jQuery(window).bind("beforeunload", function() {
			odc.backSave();
		}); */
		odc.initParam('<%=sessionkey %>','<%=foid%>','<%=type%>','<%=fairid%>','<%=loadIdx%>','<%=isSupply%>','<%=isEndUser%>','<%=isCollection%>');
	});
		<%-- if ('<%=foid%>'=="null" && '<%=type%>' == "month" && '<%=isSupply%>'=="N") {
			return;
		}
		odc.onLoad('<%=sessionkey %>'); --%>
	</script>
</body>
</html>