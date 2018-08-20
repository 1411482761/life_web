<!DOCTYPE html>
<%@ page language="java" pageEncoding="UTF-8"%>
<%@ page
	import="org.slf4j.Logger,org.slf4j.LoggerFactory,org.json.*,java.text.SimpleDateFormat,java.sql.ResultSet,java.sql.Connection,java.sql.PreparedStatement,com.agilecontrol.nea.core.query.web.*,com.agilecontrol.nea.core.control.web.*,com.agilecontrol.nea.core.util.*,com.agilecontrol.nea.core.schema.*,com.agilecontrol.nea.core.query.*, java.io.*,java.util.*,com.agilecontrol.nea.core.control.util.*,com.agilecontrol.nea.core.report.*,com.agilecontrol.nea.core.web.bean.*,com.agilecontrol.nea.core.model.*, com.agilecontrol.nea.core.model.dao.*,com.agilecontrol.nea.util.*,org.apache.struts.Globals"%>
<html ng-app="app">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
<%
   	UserWebImpl userWeb = null;
	Locale locale = null;
	boolean isEndUser=false;
	try {
		userWeb = ((UserWebImpl) WebUtils.getSessionContextManager(
				session).getActor(WebKeys.USER));
		locale = userWeb.getLocale();
		System.out.println("########## found userWeb=null##########221"
				+ locale.toString());
	} catch (Throwable userWebException) {
		System.out.println("########## found userWeb=null##########"
				+ userWebException);
		locale = TableManager.getInstance().getDefaultLocale();
	}
	int userid = userWeb.getUser().getId();
	String utype=(String)QueryEngine.getInstance().doQueryOne("select utype from users where id=?", new Object[]{userid});
	if(utype.equals("04")){
		isEndUser=true;
	}
	Date date = new Date();
	String fairid = request.getParameter("fairid");

    String top_name =request.getParameter("top_name");
    String fairtype=request.getParameter("fairtype");
	String type=request.getParameter("type");
	String dim1=request.getParameter("dim1");
	String dim2=request.getParameter("dim2");
	String dim3=request.getParameter("dim3");
	String categoryfir=request.getParameter("categoryfir");
	String categorysec=request.getParameter("categorysec");
	String categorythr=request.getParameter("categorythr");
	String selectedMc = request.getParameter("selectedMc");
	if ("undefined".equals(selectedMc)) selectedMc = "";


    String dim_color=request.getParameter("dim_color");
    String dim_color_val=(null==request.getParameter("dim_color_val")?null:request.getParameter("dim_color_val").replace("&#39;",""));
    String dim_format=request.getParameter("dim_format");
    String dim_format_val=(null==request.getParameter("dim_format_val")?null:request.getParameter("dim_format_val").replace("&#39;",""));
    String dim_series=request.getParameter("dim_series");
    String dim_series_val=(null==request.getParameter("dim_series_val")?null:request.getParameter("dim_series_val").replace("&#39;",""));
    String dim_functionality=request.getParameter("dim_functionality");
    String dim_functionality_val=(null==request.getParameter("dim_functionality_val")?null:request.getParameter("dim_functionality_val").replace("&#39;",""));
    String dim_school_term=request.getParameter("dim_school_term");
    String dim_school_term_val=(null==request.getParameter("dim_school_term_val")?null:request.getParameter("dim_school_term_val").replace("&#39;",""));
    String dim_month=request.getParameter("dim_month");
    String dim_month_val=(null==request.getParameter("dim_month_val")?null:request.getParameter("dim_month_val").replace("&#39;",""));
    String dim_price=request.getParameter("dim_price");
    String dim_price_val1=(null==request.getParameter("dim_price_val1")?null:request.getParameter("dim_price_val1").replace("&#39;",""));
    String dim_price_val2=(null==request.getParameter("dim_price_val2")?null:request.getParameter("dim_price_val2").replace("&#39;",""));






	String index=request.getParameter("index");
	String curpage=request.getParameter("currentPage");
	String itemsPerPage = request.getParameter("itemsPerPage");
	String orderby = request.getParameter("order");
    String pdtid=request.getParameter("pdtid");
    String orderid = request.getParameter("orderId");
    String loadIdx= request.getParameter("loadIdx");
    String isSupply="";
    if(userWeb.getProperty("isSupply")==null) {
       isSupply="N";
    }
    else isSupply=(String)userWeb.getProperty("isSupply");

    	if("MON".equals(fairtype)||"DAY".equals(fairtype)){
    	 isSupply=fairtype;
    	 fairtype="singleMonth";
    	}
    	if("null".equals(fairtype)||null==fairtype) fairtype="all";
%>


<script type="text/javascript" src="/nea/core/js/prototype.js"></script>
<script type="text/javascript" src="/fair/ipad/js/jquery-1.11.3.js"></script>
<script>
	jQuery.noConflict();
</script>



<!-- <script type="text/javascript" src="/fair/ipad/js/jquery1.11.3.js"></script> -->





<script type="text/javascript" src='/fair/ipad/js/AngularJS/angular.min1.4.2.js'></script>
<script type="text/javascript" src="/fair/ipad/js/rest.js"></script>
<script type="text/javascript" src='/fair/ipad/js/bootstrap/bootstrap.min.js'></script>

<script type="text/javascript"
	src="/fair/ipad/js/locale/locale_<%=locale.toString()%>.js"></script>
<script type="text/javascript"

	src="/fair/ipad/js/b2bOrder_Guest.js?t=<%=new Date().getTime()%>"></script>

  <link rel="stylesheet"
	href="/fair/ipad/css/bootstrap/bootstrap.min.css">
<title>商品下单界面</title>
</head>
<body ng-controller="MyCtrl" >
	<div id='mask' ng-click='hidepop()' ng-show='ismask'>
	</div>
	<!-- 2015-11-9 16:30:38 cmq  -->
	<div>
		<nav class="navbar-default navbar-fixed-top">
		  <div class="container-fluid">
			 <div class="row top" >
			    <div class="head-margin">
			   			<span class="welcome-text">您好，欢迎<%= userWeb.getUserDescription() %>！</span>
							<span class='order-center'><a href="/nea/core/portal">[登录]</a></span>
	            </div>
			</div>
		  </div>
		</nav>
	</div>
	<%-- <div class="row" style="text-align: right;margin-right: 1%;" id="page-niche-menu">
			<span style="font-weight: bold"><%= userWeb.getUserDescription() %></span>|
			<a class="top-text" href="/control/logout"><%= PortletUtils.getMessage(pageContext, "sign-out",null)%></a>
	</div> --%>
	<div class="navbar navbar-default" style="margin-top: 1.5%;">
		<img alt="" src="/fair/ipad/B2B/images/nnt.jpg" style="width: 100%;">
	</div>
	<div id="loading" ng-show="loading">
		<div id="loadinglocale">{{load}}</div>
	</div>

	<div class="container wrapper" ng-controller="ListCtrl" ng-show="wrapper" class='container'>
		<div id='popdiv' ng-show='ispop'>
			<img src='{{lurl}}'/>
		</div>




    <!--商品列表-->
    <div class='row'>
	<div id='left'   class='col-lg-3 col-md-4 col-sm-4' style="border-right:solid 1px rgb(238,238,238)">
		<div id='mylist' >
			<div id="header">
			<div id="logo">
				<!--'/fair/ipad/B2B/index.jsp?loadIdx={{loadIdx}}'-->
				<a ng-click="window.history.go(-1);"><img src="/fair/ipad/B2B/images/back.jpg" style='cursor:pointer'></a>
			 </div>
		    </div>
			<div id="listhead">
				<input id='pdt_exp' ng-model='exp' type='text' style='display:none;'/>
				<input id='pdt_sql' ng-model='sql' type='text' style='display:none;' />
				<div class="input-group" style="width:70%">
	            <input id='pdt_desc' ng-model='desc' class="form-control" type='text'   placeholder='商品名称/商品编号' ng-keydown='enterSearch($event)'/>
				  <span ng-click='search()' type='button' class='input-group-addon glyphicon glyphicon-search' style='background-color:#c91924;color:#fff;cursor:pointer'></span>
				</div>
<!-- 			      <span id="popup" class="form-control coolButton" onclick='setCondition()' style="box-shadow:none !important"><img  border="0"  width="20" height="20" alt="Find" src="/nea/core/images/filterobj.gif"/>
                     </span>		 -->
			</div>

           <div   style='overflow:auto;height:{{pdtHeight}}px;border-bottom:solid 1px rgb(238,238,238);margin-top:8px' >
			<table id="listtb"  class="table" >
				<tr ng-repeat='row in pdts'   ng-click="togglePdt($index,$event)" style='height:{{cellHeight}}px'>
					<td id='pdtimg' style='width:60px ;padding:0;position:relative'>
						<img  src='/pdt/s/{{row.image[0]}}'></img>
						<img src='/fair/ipad/B2B/images/new.png' class='new_prod' ng-show="row.is_new=='Y'"></img>
					  <img src='/fair/ipad/B2B/images/reservation.png' class='future_prod'ng-show="row.is_future=='Y'"></img>
						</td>
					<td id='pdt{{$index}}' style='cursor:pointer' ng-class="{selected:{{index}}==$index}"><span style="font-weight:600">{{row.value}}</span>
			          <%-- <ul>
							<li style="float:left;color:#c91924">￥{{row.priceactual}}</li>
							<li style="float:right">订量:{{row.qty}}</li>
					</ul> --%>
					</td>
				</tr>
			</table>
			</div>
			<div style="margin-top:5px">
                <div>
	 				<ul class="pagination pagination-sm pull-left">
						<li ><a href="javascript:void(0)" ng-click="start()"><span class=" glyphicon glyphicon-fast-backward" style="color:#c91924 !important" ></span></a>
						</li>
						<li>
							<a href="javascript:void(0)" ng-click="back()"><span class="glyphicon glyphicon-backward" style="color:#c91924 !important" ></span></a>
						</li>
					</ul>
				<ul class="pagination pagination-sm pull-right" >
					<li><a href="javascript:void(0)" ng-click="next()"><span class="glyphicon glyphicon-forward" style="color:#c91924 !important" ></span></a>
					</li>
					<li>
						<a href="javascript:void(0)" ng-click="end()"><span class="glyphicon glyphicon-fast-forward" style="color:#c91924 !important" ></span></a>
					</li>
				</ul>
                </div>
				<div>
				   <ul class="pagination pagination-sm" style='position:relative;top:5px'>
					 <li><span>第<input type='text' ng-model="jumpPage" style="width:35px" >/<span ng-bind='total'></span>页</span></li>
					 <li><button class="btn btn-default btn-sm" ng-click="refresh()">确定</button></li>
					 <span style='font-size:12px'>(每页<span ng-bind='pageCnt'></span>个商品)</span>
				   </ul>
				</div>
			</div>
<!-- 		   <div id="jump" style='font-size:12px'>
	                <span>每页显示<input type='text' ng-model='_pageCnt' style='width:30px' ng-enter="refresh()">个商品</span>
           </div> -->
		</div>

		</div>
		<!--商品图片和详细信息-->
		<div class='col-lg-9 col-md-7 col-sm-6'>
		<div id='pdtinfo'class='row'>
			<div id='pdtpic' class='col-lg-4 col-md-4 col-sm-4' style='text-align:center'>
				<div id="larger" style='text-align:center;width:160px;height:160px;margin:auto'>
					<img style='height:100%;cursor:zoom-in' src='{{murl}}' ng-click='maximum(murl)' />
				</div>
				<div id="thumb" style='margin-top:5px'>
				    <img ng-repeat='row in images'  src='{{row.surl}}' class="thumb" ng-mouseover="toggleImage(row.surl);"/>
				</div>
			</div>
			<div id='pdt' class='col-lg-6 col-md-6 col-sm-6'>
				<div id='pdtinfor'>
				</div>
			</div>
		</div>


		<!--商品详情-->
		<div id="detail">
		   <p style='color:#c91924'>商品详情</p>
		   <div id='himg'>
              <img ng-repeat ='row in hurl' src='/pdt/b2b/{{row}}.jpg'>
		   </div>
	    </div>
		</div>

	    <footer>
        <div class="container">
        	<div class="row">
        	 	<hr style="border:1px rgb(229,229,229) solid;">
					<img src="/fair/ipad/B2B/images/footer.jpg">

                <hr style="border:1px rgb(229,229,229) solid;">

               <div style="font-size: 14px;padding-bottom: 10px;color: rgb(102,102,102);text-align: center;">
	               <div>上海晨光文具股份有限公司 版权所有</div>
	               <div>copyright 2015, Shanghai M&G Stationery INC./All Rights Reserved</div>
               </div>

            </div>
        </div>
    </footer>
</body>

<script type="text/javascript">
	angular.module("app").service('init', function() {
		this.type='<%=type%>';
		this.fairid=<%=fairid%>;
		this.selectedMc='<%=selectedMc%>';
		this.categoryfir=<%=categoryfir%>;
		this.categorysec='<%=categorysec%>';
		this.categorythr='<%=categorythr%>';
		this.dim1='<%=dim1%>';
		this.dim2='<%=dim2%>';
		this.dim3='<%=dim3%>';
		this.fairtype='<%=fairtype%>';
		this.index=<%=index%>;
		this.curpage=<%=curpage%>;
		this.itemsPerPage=<%=itemsPerPage%>;
		this.orderby='<%=orderby%>';
        this.isEndUser=<%=isEndUser%>;

		this.pdtid=<%=pdtid%>;
		this.isSupply='<%=isSupply%>';
		this.orderId='<%=orderid%>';
		this.loadIdx='<%=loadIdx%>';
		this.top_name='<%=top_name%>';
		this.b2b_params={
			'dim_color':'<%=dim_color%>',
			'dim_color_val':"'"+'<%=dim_color_val%>'+"'",
			'dim_format':'<%=dim_format%>',
			'dim_format_val':"'"+'<%=dim_format_val%>'+"'",
			'dim_series':'<%=dim_series%>',
			'dim_series_val':"'"+'<%=dim_series_val%>'+"'",
			'dim_functionality':'<%=dim_functionality%>',
			'dim_functionality_val':"'"+'<%=dim_functionality_val%>'+"'",
			'dim_school_term':'<%=dim_school_term%>',
			'dim_school_term_val':"'"+'<%=dim_school_term_val%>'+"'",
			'dim_month':'<%=dim_month%>',
			'dim_month_val':"'"+'<%=dim_month_val%>'+"'",
			'dim_price':'<%=dim_price%>',
            'dim_price_val1':"'"+'<%=dim_price_val1%>'+"'",
            'dim_price_val2':"'"+'<%=dim_price_val2%>'+"'"
		}
	});
</script>
<link rel="stylesheet" type="text/css"
	href="/fair/ipad/css/common/b2bOrder.css"/>
</html>
