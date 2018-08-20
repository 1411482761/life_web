<%@ page language="java" pageEncoding="utf-8"%>
<% String sessionkey = request.getParameter("sessionkey"); %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<%@ include file="top_meta.jsp"%>
<script type="text/javascript" src="js/rptcenter.js"></script>
<style type="text/css">
	body{
		background-color:#EEF3FA;
		margin :0;
		width: 100%;
		height: 100%;
	}
	#main {
		width:960px;
		height:inherit;
		margin:0px auto;
		font-family: 微软雅黑;
	}
	#main>div{
		float: left;
	}
	#top_bar {
		width: 960px;
		height: 40px;
		background-image:url("images/title.png");
		color: white;
	}
	#rpt_container{
		width: 575px;
		background-color:white;
		border-right: 2px solid #DCDCDC;
		overflow: hidden;
	}
	#rpt_list{
		width:100%;
		overflow-y: auto;
		overflow-x: hidden;
	}
	#rpt_conf{
		width: 373px;
		background-color: #EDEDED;
		padding-left: 10px;
	}
	#rpt_container_bar{
		height : 30px;
	}
	#rpt_container_bar>div {
		float :right;
	}
	
	button {
		margin-top :4px;
		margin-right: 20px;
	    padding: 4px;
	    border: #1B689C 1px solid;  
	    border-radius: 8px;  
	    color: white;  
	    background: #2071A9;  
	    cursor: pointer; 
	    float: right;
	    width: 100px;
	    font-family: 微软雅黑;
	}
	
	button:hover {  
    	background: #26678E;  
    }  
  
	button:active {  
    	background: #236083;  
    } 
	
	#plus_btn {
		cursor:pointer;
		margin:4px;
	}

	.rpt_item {
		float :left;
		margin:0px 26px;
		position : relative;
	}
	
	.rpt_item>img{
		position: relative;
		z-index: 1;
		left:116;
		top:20;
	}
	
	.rpt_frame {
		width :134px;z
		height :110px;
		background-image: url(images/bg2.png);
		background-repeat: no-repeat;
		background-position: center;
		background-size: cover;
		cursor: pointer;
		text-align: center;
	}
	
	.rpt_frame>img {
		width: 120px;
		margin-top: 10px
	}
	
	
	#rpt_conf_title, #rpt_conf_tail {
		color: #308ABF;
		font-size: x-large;
		height: 40px;
	}
	
	#rpt_conf_list {
		overflow-x: hidden;
		overflow-y: auto; 
	}
	
	.rpt_conf_item {
		color: gray;
		margin-left: 20px;
		margin-top: 20px;
	}
</style>
 <link rel="stylesheet" href="css/jquery-ui-1.10.3.custom.css"></link>
</head>
<body>
	<script type="text/javascript">
		jQuery(document).ready(function(){
			rc.iteratorRpts('<%=sessionkey %>');
		});
	</script>
	<div id="main">
		<div id="top_bar">
			<span style="padding:18px;font-size:x-large;">报表配置中心</span>
			<button>保存</button>
		</div>
		<div id="rpt_container">
			<div id="rpt_container_bar">
				<div id="new_rpt"><img id="plus_btn" src="images/plus.png"></div><div style="color: gray;margin-top: 4px">新增</div>
			</div>
			<div id="rpt_list">
				<div class="rpt_item">
					<!--  <img src="images/del.png"/>-->
					<img src="images/del.png"/>
					<div class="rpt_frame">
						<!-- <img src="/fair/ipad/img/f.png"/> -->
						<img src="/fair/ipad/img/f.png"/>
					</div>
					<div style="color: #308ABF">aa</div>
					<div style="color: gray">aaa</div>
				</div>
			</div>
		</div>
		<div id="rpt_conf">
			<div id="rpt_conf_title">报表信息</div>
			<div id="rpt_conf_list">
				 <div class="rpt_conf_item">
					<div>报表名称：<input placeholder=""/></div>
				</div>
				<div class="rpt_conf_item">
					<div>唯一标识：<input/></div>
				</div>
				<div class="rpt_conf_item">
					<div>配置选项</div>
					<div>
						选项
						<select>
							<option value="volvo">Volvo</option>
							<option value="saab">Saab</option>
							<option value="opel">Opel</option>
						</select>
					</div>
				</div>
			</div>
			<div id="rpt_conf_tail">
				<button>详细配置</button>
			</div>
		</div>
	</div>
	<div id="del_confirm" title="caution" style="display:none">
		是否要删除?
	</div>
	<div id="new_rpt_form" title="new report" style="display:none">
		<label for="name">Name</label>
		<input type="text" name="name" id="name" class="text ui-widget-content ui-corner-all" />
		 <label for="name">ID</label>
		<input type="text" name="id" id="id" class="text ui-widget-content ui-corner-all" />
	</div>
</body>
</html>