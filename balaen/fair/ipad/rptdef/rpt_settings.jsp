<%@ page language="java" pageEncoding="utf-8"%>
<% String sessionkey = request.getParameter("sessionkey"); %>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<%@ include file="top_meta.jsp"%>
<script type="text/javascript" src="js/rptsetting.js"></script>
<link rel="stylesheet" href="css/jquery-ui-1.10.3.custom.css"><link>
<style type="text/css">
	body{
		background-color:#EEF3FA;
		margin :0;
		width: 100%;
		height: 100%;
	}
	#main {
		width:960px;
		height:100%;
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
	#pattern_div {
		width: 18.75%;
		background-color: white;
	}
	#pattern_title {
		margin: 10px;
		color: #2F81B1;
		font-size: 24px;
	}
	#pattern_list {
		overflow-y:auto;
	}
	
	#pattern_title {
		height: 30px;
	}
	
	.pattern_item {
		margin-left: 30px;
		margin-bottom: 40px;
	}
	
	#view_div {
		width: 60%;
		background-color: #E1E1E1;
	}
	
	#view_tab {
	}
	#view_tab div {
		height: inherit;
	}
	
	#opt_div {
		width: 21.25%;
		background-color: #EDEDED;
	}
	#opt_title {
		font-size: 12px;
		margin: 12px;
		margin-top: 30px;
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
    
	#view_tab { margin-top: 1em; }
	#view_tab li .ui-icon-close,#view_tab li .ui-icon-plus { float: left; margin: 0.4em 0.2em 0 0; cursor: pointer; }
</style>

</head>
<body>
	<div id="main">
		<div id="top_bar">
			<span style="padding:18px;font-size:x-large;">报表详细配置</span>
			<button>保存</button>
		</div>
		<div id="pattern_div">
			<div id="pattern_title">模版</div>
			<div id="pattern_list">
				<div class="pattern_item"><img src="images/rpt1-1.png"></div>
				<div class="pattern_item"><img src="images/rpt1-2.png"></div>
				<div class="pattern_item"><img src="images/rpt1-3.png"></div>
				<div class="pattern_item"><img src="images/rpt1-4.png"></div>
				<div class="pattern_item"><img src="images/rpt1-5.png"></div>
				<div class="pattern_item"><img src="images/rpt1-6.png"></div>
				<div class="pattern_item"><img src="images/rpt1-7.png"></div>
			</div>
		</div>
		<div id="view_div">
			<div id="view_tab">
				<ul  class="ui-state-default">
					<li><span class="ui-icon ui-icon-plus" role="presentation">add</span></li>
					<li><a href="#tabs-1">默认</a></li>
				</ul>
				<div id="tabs-1">
				</div>
			</div>
		</div>
		<div id="opt_div">
			<div id="opt_title">
				<input type="radio" id="radio1" name="radio" checked="checked" /><label for="radio1">饼图</label>
				<input type="radio" id="radio2" name="radio" /><label for="radio2">柱状图</label>
				<input type="radio" id="radio3" name="radio" /><label for="radio3">表格</label>
			</div>
			<div id="opt_list">
				<div class="opt_chart">c</div>
				<div class="opt_chart">c</div>
				<div class="opt_chart">c</div>
				<div class="opt_column">column</div>
				<div class="opt_column">column</div>
				<div class="opt_column">column</div>
				<div class="opt_grid">grid</div>
				<div class="opt_grid">grid</div>
				<div class="opt_grid">grid</div>
			</div>
		</div>
	</div>
	<div id="new_tab" title="new tab">
		<label for="name">Name</label>
		<input type="text" name="name" id="name" class="text ui-widget-content ui-corner-all" />
	</div>
</body>
</html>