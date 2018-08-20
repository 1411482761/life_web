<%@ page language="java" pageEncoding="utf-8"%>
<%@ page import="org.slf4j.Logger,org.slf4j.LoggerFactory,org.json.*,java.text.SimpleDateFormat,java.sql.ResultSet,java.sql.Connection,java.sql.PreparedStatement,com.agilecontrol.nea.core.query.web.*,com.agilecontrol.nea.core.control.web.*,com.agilecontrol.nea.core.util.*,com.agilecontrol.nea.core.schema.*,com.agilecontrol.nea.core.query.*, java.io.*,java.util.*,com.agilecontrol.nea.core.control.util.*,com.agilecontrol.nea.core.report.*,com.agilecontrol.nea.core.web.bean.*,com.agilecontrol.nea.core.model.*, com.agilecontrol.nea.core.model.dao.*,com.agilecontrol.nea.util.*,org.apache.struts.Globals"%>
<%
	UserWebImpl userWeb =null;
	Locale locale=null;
	int userId=0;
	boolean isEndUser=false;
	String realLoginName="";
	try{
		userWeb= ((UserWebImpl)WebUtils.getSessionContextManager(session).getActor(WebKeys.USER));
		userId=userWeb.getUserId();
		locale=userWeb.getLocale();
		
		String utype=(String)QueryEngine.getInstance().doQueryOne("select utype from users where id=?", new Object[]{userId});
		if(utype.equals("04")){
			isEndUser=true;
		}
		
		realLoginName=(String) userWeb.getProperty("real_login_name");
		if(Validator.isNull(realLoginName)){
			realLoginName=userWeb.getUserName();
		}
	
	}catch(Throwable userWebException){
		System.out.println("########## found userWeb=null##########"+userWebException);
		locale=TableManager.getInstance().getDefaultLocale();
	}
 //	String sessionkey = request.getParameter("sessionkey");
 	String date = String.valueOf(new Date().getTime());
 	String loadIdx = request.getParameter("loadIdx");
 	String fairid = request.getParameter("fairid");
 	
 	/* int qqnum=ConfigValues.get("b2b.qq", 550827975); */
%>
<!DOCTYPE html>
<html ng-app="b2b">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width initial-scale=1.0 maximum-scale=1.0 user-scalable=yes" />
     <link rel="stylesheet" href="/fair/ipad/B2B/css/pikaday.css">
    <link rel="stylesheet" href="/fair/ipad/css/bootstrap/bootstrap.min.css">
    <link rel="stylesheet" href="/fair/ipad/B2B/css/angular-carousel.css">
    <link rel="stylesheet" href="/fair/ipad/B2B/css/loading-bar.css">
    <link rel="stylesheet" href="/fair/ipad/B2B/css/b2b.css?t=<%=date %>">

	<!-- <script language="javascript" src="/fair/ipad/js/prototype.js"></script> -->
 	<script src="/fair/ipad/B2B/js/pikaday.min.js"></script>
	<script src="/fair/ipad/js/AngularJS/angular.min1.4.2.js"></script>
	<script src="/fair/ipad/js/AngularJS/angular-carousel.min.js"></script>
    <script src="/fair/ipad/js/AngularJS/angular-route.min.js"></script>
    <script src="/fair/ipad/js/AngularJS/angular-touch.min.js"></script>
    <!--<script src="js/ui-bootstrap.min.js"></script>-->
    <script src="/fair/ipad/js/bootstrap/ui-bootstrap-tpls-0.13.0.min.js"></script>
    <script src="/fair/ipad/B2B/js/loading-bar.min.js"></script>
     <script type="text/javascript" src="/fair/ipad/js/rest.js"></script>
    <script src="/fair/ipad/B2B/js/b2b.js?t=<%=date %>"></script>
    <script language="javascript" type="text/javascript">
		/* window.onload = function(){
			window.moveTo(0, 0);
			window.resizeTo(screen.availWidth, screen.availHeight);
			//window.focus(); 
		}; */
		
		b2b.service('initService',function(){
		   this.isEndUser=<%=isEndUser%>;
		   this.fairid='<%=fairid%>';
		   this.userDescription='<%=userWeb.getUserDescription()%>';
		});
	</script>
    <title>列表展示界面</title>
</head>
<body class="hidden-xs">
<a id='5F'></a> 
<div   class="app-content ng-scope" ng-controller="mainCtr">
<options ng-init="load(<%=loadIdx%>,<%=fairid%>)" ng-show="isOptionsShow"></options>
<nav class="navbar-default navbar-fixed-top" style="z-index: 1000">
	  <div class="container-fluid">
		 <div class="row top" >
		   <!--  <div class="col-lg-2 col-md-2 col-sm-2 col-xs-2"><a href="#" rel="sidebar" ng-click="addFavorite(this);">收藏晨光</a></div> -->
		    <div class="head-margin">
		    		<span class="welcome-text">您好，欢迎 <%= userWeb.getUserDescription() %>！<a class="ch-pwd" ng-click="changePwd();" ng-if="'<%= userWeb.getUserDescription() %>'!='guest'">[修改密码]</a><a class="ch-pwd" href="/nea/core/portal" ng-if="'<%= userWeb.getUserDescription() %>'=='guest'">[登录]</a></span>
		    		<a  ng-repeat="qq in all_qq" ng-click="alert_qq(qq);"><img src="http://wpa.qq.com/pa?p=1:{{qq}}:7" ng-if="qq != 'null' && qq != ''"/></a>
           			<!-- <span class="order-center" ng-click="ordercenter()">我的收藏夹</span> -->
           	<span ng-if="'<%= userWeb.getUserDescription() %>'!='guest'">		
	           	<span  dropdown  class="dropdown">
	                <a class="order-center dropdown-toggle" dropdown-toggle ng-disabled="disabled" href="" style="text-decoration: none;">我的喜欢<span class="caret"></span> </a>
	                <ul class="dropdown-menu dropdown-menu-change">
	                    <li ng-click="collection('day');"><a href="">日单喜欢商品</a></li>
	                    <li ng-click="collection('month');"><a href="">月单喜欢商品</a></li>
	                </ul>
	            </span>
           			
           		<span class="order-center" ng-click="ordercenter()">订单中心</span>
           		<span class="order-center" onclick="window.open('/nea/core/portal')" ng-if='!isEndUser'>管理中心</span>
           		<span><a class="top-text btn btn-default" style="padding: 2px 8px;color: red;" href="/control/logout"><%= PortletUtils.getMessage(pageContext, "sign-out",null)%></a></span>
            </span>
            </div>	
		</div>
	  </div>
</nav>
<div when-scrolled class="scrollable-content" ng-show="isDataShow">
<nav class=" navbar-default top-fix">
	<img alt="" src="/fair/ipad/B2B/images/nnt.jpg" style="width: 100%;">
</nav>
	  
<div class="container ">
	 
        <div class="row"  ng-controller="productCtr">
            <!-- 搜索框 -->
            <div  class="header row" ng-controller="fairCtr" >
                <div class="col-md-3 col-xs-3" >
                    <img src="images/mg.jpg" style="width: 100%;margin-left: -6%;">
                    <!--<fairItem fair-items="data"></fairItem>-->
                </div>
                <dv class="col-md-7 col-xs-7">
                    <search search="search">
                        {{search}}
                    </search>
                </dv>
            </div>
        </div>
</div>

<div class="container-fluid" style="background-color: rgb(200,22,34);margin-bottom: 6px;margin-top: 0px;">
	<menu-fair fairs="menufair"></menu-fair>
</div>

<div class="container">
	 <div class="row" style="position:relative;">
          <product-menu categorys='categorys' ></product-menu>
    </div>
    <div class="row" ng-controller="bannerCtr" style="position:relative;z-index:2;">

          <product-menu categorys='categorys'></product-menu>

        <!-- 轮播图 -->
       <!--  <div ng-controller="PostListController" class="col-md-7 list_container">
            <carousel interval="myInterval">
                <slide ng-repeat="slide in slides" active="slide.active">
                    <a href="www.baidu.com"><img ng-src="{{slide.image}}" style="margin:auto;" ></a>
                    <div class="carousel-caption">
                        <p>{{slide.text}}</p>
                    </div>
                </slide>
            </carousel>
        </div> -->
        
        <div class="col-sm-offset-2 col-md-offset-2 col-lg-offset-2 col-sm-7 col-md-7 col-lg-7" ng-controller="PostListController" style="height: 40rem;height: 400px;">
			<div class="carousel-demo" style="height: 100%;">
       			 <ul id="carousel" rn-carousel rn-carousel-index = "carouselIndex2" rn-carousel-auto-slide rn-carousel-pause-on-hover rn-carousel-buffered class="carousel2" >
            			<li ng-repeat="slide in slides track by slide.id" >													<!-- class="img-responsive bgimage" -->
                			<div target="_blank" ng-href ="{{slide.href}}"><img ng-src="{{slide.img}}" style="margin:auto;" class=" bgimage"></div>
           			</li>
       			 </ul>
       			 <div rn-carousel-indicators ng-if="slides.length > 1" slides="slides" rn-carousel-index="carouselIndex2" id="slidePoint" ></div>
       		</div> 
		</div>
        
         <!-- 消息通知 -->
        <div notice-box class="col-sm-3 col-md-3 col-lg-3 notice-box" notices="notices" order-status="orderStatus"></div>
    </div>
</div>

<div class="container">
    <div class="row" >
    	<!-- <current-position style="clear: both;margin-top: 10px;margin-bottom: 5px;"></current-position> -->
       <div  class="top-head-line top-head-line-hot">
          	<nav class="pdt-nav">
          	  <!-- 	<a href="" name="top" class="pdt-nav-item active" ng-mouseover="dimChange(0,'top');" onclick="window.open('/fair/ipad/B2B/main.jsp?loadIdx=0')">热卖商品</a>
				<a href="" name="top" class="pdt-nav-item" ng-mouseover="dimChange(1,'top');">新品上架</a> -->
				<a ng-repeat="title in head_title" ng-if="$index==0" href="" name="top" class="pdt-nav-item active" ng-mouseover="dimChange($index,null,'top',null,null,title.ad_sql);"  ng-click="dimClick(title.ad_sql,'top',null,null);" >{{title.description}}</a>
				<a ng-repeat="title in head_title" ng-if="$index!=0" href="" name="top" class="pdt-nav-item" ng-mouseover="dimChange($index,null,'top',null,null,title.ad_sql);" ng-click="dimClick(title.ad_sql,'top',null,null);" >{{title.description}}</a>
          	</nav>
           <!-- <span class="more-link" ><a href="">更多</a></span> -->
       </div>

        <!--Body content-->
        <div class="row" ng-if="pdts.length>0">
           <div class="col-sm-2 col-md-2 col-lg-2" ng-repeat="pdt in pdts" ng-if="$index<6"> 
            	<div ng-click="product_click(pdt,$index,null,nul,'top')" style="cursor: pointer;" class="pdt">
	                <a href="" class="thumbnail" >
	                 <!--   <img src="images/N.jpg"> -->
	                    <img src="{{pdt.imageurl}}">
	                </a>
	                <div class="caption">
	                	<div  ng-class="{'product-follow_new': pdt.is_new=='Y'}"></div>
	                	<div  ng-class="{'product-follow_reservation': pdt.is_future=='Y'}"></div>
	                    <h5>{{pdt.value}}</h5>
	                    <p style="font-weight:400" class="standard" ng-if="'<%= userWeb.getUserDescription() %>'!='guest'">标准价¥{{pdt.pricelist}}</p>
	                   	<p style="color: red;font-weight:400" ng-if="'<%= userWeb.getUserDescription() %>'!='guest'">订货价¥{{pdt.priceactual}}</p>
	                </div>
                </div>
                <div ng-class="{'favorite': pdt.is_fav=='Y','unfavorite': pdt.is_fav!='Y'}" ng-click="favorite(pdt.id,pdt);" ng-if="'<%= userWeb.getUserDescription() %>'!='guest'"></div>
            </div>
            <div class="col-sm-12 col-md-12 col-lg-12 pdt-line" ng-if="pdts.length>5"><hr></div> 
           <div class="col-sm-2 col-md-2 col-lg-2" ng-repeat="pdt in pdts" ng-if="5<$index && $index<12"> 
            	<div ng-click="product_click(pdt,$index,null,null,'top')" style="cursor: pointer;" class="pdt">
	                <a href="" class="thumbnail" >
	                 <!--   <img src="images/N.jpg"> -->
	                    <img src="{{pdt.imageurl}}">
	                </a>
	                <div class="caption">
	                	<div  ng-class="{'product-follow_new': pdt.is_new=='Y'}"></div>
	                	<div  ng-class="{'product-follow_reservation': pdt.is_future=='Y'}"></div>
	                    <h5>{{pdt.value}}</h5>
	                    <p style="font-weight:400" class="standard" ng-if="'<%= userWeb.getUserDescription() %>'!='guest'">标准价¥{{pdt.pricelist}}</p>
	                    <p style="color: red;font-weight:400" ng-if="'<%= userWeb.getUserDescription() %>'!='guest'">订货价¥{{pdt.priceactual}}</p>
	                </div>
                </div>
                <div ng-class="{'favorite': pdt.is_fav=='Y','unfavorite': pdt.is_fav!='Y'}" ng-click="favorite(pdt.id,pdt);" ng-if="'<%= userWeb.getUserDescription() %>'!='guest'"></div>
            </div>
            <div class="col-sm-12 col-md-12 col-lg-12 pdt-line"><hr></div> 
        </div>
		 <div class="row" ng-if="pdts.length==0" style="text-align: center;">暂无数据!</div>
    </div>
    
  <!--   ng-repeat嵌套使用
    <div ng-repeat="innerList in list" ng-init="outerIndex = $index">
	  <div ng-repeat="value in innerList" ng-init="innerIndex = $index">
	     <span class="example-init">list[ {{outerIndex}} ][ {{innerIndex}} ] = {{value}};</span>
	  </div>
	</div> -->
    <div class="row" ng-repeat="category in categorys" ng-init="outerIndex = $index+1">
    	   <div class="top-head-line">
    	   		<div class="col-sm-2 col-md-2 col-lg-2">
    	   			<div>{{outerIndex}}F</div>
    	   			<img alt="" src="/fair/ipad/B2B/images/bubble.png">
    	   			<span>{{category.attribname}}</span>
    	   		</div>
	          	<nav class="pdt-nav col-sm-9 col-md-9 col-lg-9" >
	          	  	<a ng-repeat="c in category.category_sec" ng-init="innerIndex = $index" ng-if="$index==0" href="" name="top{{outerIndex}}" class=" pdt-nav-item active" ng-mouseover="dimChange(innerIndex,outerIndex,'top',category.id,c.id);" ng-click="dimClick(null,'category_sec',category.id,c.id);">{{c.attribname}}</a>
					<a ng-repeat="c in category.category_sec" ng-init="innerIndex = $index" ng-if="$index!=0 && $index<6" href="" name="top{{outerIndex}}" class=" pdt-nav-item" ng-mouseover="dimChange(innerIndex,outerIndex,'top',category.id,c.id);"  ng-click="dimClick(null,'category_sec',category.id,c.id);">{{c.attribname}}</a>
	          	</nav>
	          	<span class="more-link col-sm-1 col-md-1 col-lg-1" style="padding: 0;float: right;">
		          	<li  dropdown  ng-if="true" class="dropdown" style="float: left;list-style-type: none;" ng-show="category.category_sec.length>6">
	               		 <span class="dropdown-toggle" dropdown-toggle ng-disabled="disabled" href="">●●●</span>
		                <div class="dropdown-menu row dropdown-menu-showMore" ng-show="true">
		                    <a class="col-sm-6 col-md-6 col-lg-6" ng-repeat="c in category.category_sec" ng-if="$index>5"  ng-click="dimClick(null,'category_sec',category.id,c.id);">{{c.attribname}}</a>
		                </div>
           			 </li>
		          	<a href="" ng-click="dimClick(null,'category_fir',category.id,null);">更多</a>
	          	</span>
       	   </div>
		    <div class="row">
		    	<div class="col-sm-2 col-md-2 col-lg-2 pdt-dim-second">
		    		<div ng-repeat="c in category.category_sec" class="col-sm-6 col-md-6 col-lg-6" style="padding: 0px 2px 0px 0px;margin: 0;" ng-click="dimClick(null,'category_sec',category.id,c.id);">{{c.attribname}}</div>
		    	</div>
		    	<div class="col-sm-10 col-md-10 col-lg-10" ng-if="category.category_pdts.pdt.length>0">
		    		<div class="col-sm-3 col-md-3 col-lg-3" ng-repeat="pdt in category.category_pdts.pdt track by $index" ng-if="$index<4"> 
		            	<div ng-click="product_click(pdt,$index,category.id,category.category_pdts.secid)" style="cursor: pointer;" class="pdt">
			                <a href="" class="thumbnail" >
			                    <img src="{{pdt.imageurl}}">
			                </a>
			                <div class="caption">
			                	<div  ng-class="{'product-follow_new': pdt.is_new=='Y'}"></div>
			                	<div  ng-class="{'product-follow_reservation': pdt.is_future=='Y'}"></div>
			                    <h5>{{pdt.value}}</h5>
			                    <p style="font-weight:400" class="standard" ng-if="'<%= userWeb.getUserDescription() %>'!='guest'">标准价¥{{pdt.pricelist}}</p>
			                    <p style="color: red;font-weight:400" ng-if="'<%= userWeb.getUserDescription() %>'!='guest'">订货价¥{{pdt.priceactual}}</p>
			                </div>
			               
		                </div>
		                 <div ng-class="{'favorite': pdt.is_fav=='Y','unfavorite': pdt.is_fav!='Y'}" ng-click="favorite(pdt.id,pdt);" ng-if="'<%= userWeb.getUserDescription() %>'!='guest'"></div>
		            </div>
		            <div class="col-sm-12 col-md-12 col-lg-12 pdt-line" ng-if="category.category_pdts.pdt.length>4"><hr></div> 
		            
		            <div class="col-sm-3 col-md-3 col-lg-3" ng-repeat="pdt in category.category_pdts.pdt track by $index" ng-if="3<$index && $index<8"> 
		            	<div ng-click="product_click(pdt,$index,category.id,category.category_pdts.secid)" style="cursor: pointer;" class="pdt">
			                <a href="" class="thumbnail" >
			                    <img src="{{pdt.imageurl}}">
			                </a>
			                <div class="caption">
			                	<div  ng-class="{'product-follow_new': pdt.is_new=='Y'}"></div>
			                	<div  ng-class="{'product-follow_reservation': pdt.is_future=='Y'}"></div>
			                    <h5>{{pdt.value}}</h5>
			                    <p style="font-weight:400" class="standard" ng-if="'<%= userWeb.getUserDescription() %>'!='guest'">标准价¥{{pdt.pricelist}}</p>
			                    <p style="color: red;font-weight:400" ng-if="'<%= userWeb.getUserDescription() %>'!='guest'">订货价¥{{pdt.priceactual}}</p>
			                </div>
		                </div>
		                 <div ng-class="{'favorite': pdt.is_fav=='Y','unfavorite': pdt.is_fav!='Y'}" ng-click="favorite(pdt.id,pdt);" ng-if="'<%= userWeb.getUserDescription() %>'!='guest'"></div>
		            </div>
		    	</div>
		    	<div ng-if="category.category_pdts.pdt.length==0" style="text-align: center;">暂无数据！</div>
		    	<div class="col-sm-12 col-md-12 col-lg-12 pdt-line"><hr></div> 
		    </div>
    </div>
    
</div>
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

<div style="margin-top: 4%;z-index: 20;" ng-if="isShowChgPwd" class="container">

	<form class="form-horizontal">
	  <div class="form-group">
	    <label class="col-sm-3 control-label">用户名：</label>
	    <div class="col-sm-6">
   			<input type="text" class="form-control"  placeholder="手机号错误"  ng-model="$parent.phoneNum" ng-init="$parent.phoneNum='<%=realLoginName%>'" disabled>
    	</div>
	  </div>
	  <div class="form-group has-error">
	    <label  class="col-sm-3 control-label">旧密码：</label>
	     <div class="col-sm-6">
   			 <input type="password" class="form-control" ng-model="$parent.oldpwd">
    	</div>
	  </div>
	  <div class="form-group has-error">
	    <label  class="col-sm-3 control-label" >新密码：</label>
	     <div class="col-sm-6">
   			<input type="password" class="form-control" ng-model="$parent.newpwd">
    	</div>
	  </div>
	  <div class="form-group has-error">
	    <label  class="col-sm-3 control-label">确认新密码：</label>
	     <div class="col-sm-6">
   			<input type="password" class="form-control" ng-model="$parent.newpwd2">
    	</div>
	  </div>
	   <div class="form-group">
	    <div class="col-sm-offset-7 col-sm-1">
	     <button type="submit" class="btn btn-default" ng-click="clearChgPwd();">取消</button>
	    </div>
	    <div class="col-sm-1">
	     <button type="submit" class="btn btn-danger" ng-click="submitChgPwd();">确认</button>
	    </div>
	  </div>
	  
	</form>
</div>
<div style="margin-top: 4%;z-index: 20; text-align: center;" ng-if="isShowChgLogin" class="container">
		<h4>
			密码修改成功，请重新登录。 系统将在<span style="color: red">{{countTimer}}</span>秒后退出登录，<a href="/control/logout">手动登录</a>
		</h4>
</div>


<a style="position:fixed;right:3%; bottom:5px; width:20px;  cursor:pointer;text-decoration:none" ng-show="isDataShow" onclick="javascript:document.getElementById('5F').scrollIntoView();"><img alt="" src="/fair/ipad/B2B/images/top.png"></a>
</div>
</body>
</html>