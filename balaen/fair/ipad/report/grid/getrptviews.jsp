<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8"%>
<%@ page import="java.util.Date,com.agilecontrol.nea.core.web.config.*,org.slf4j.Logger,org.slf4j.LoggerFactory,org.json.*,java.text.SimpleDateFormat,java.sql.ResultSet,java.sql.Connection,java.sql.PreparedStatement,com.agilecontrol.nea.core.query.web.*,com.agilecontrol.nea.core.control.web.*,com.agilecontrol.nea.core.util.*,com.agilecontrol.nea.core.schema.*,com.agilecontrol.nea.core.query.*, java.io.*,java.util.*,com.agilecontrol.nea.core.control.util.*,com.agilecontrol.nea.core.report.*,com.agilecontrol.nea.core.web.bean.*,com.agilecontrol.nea.core.model.*, com.agilecontrol.nea.core.model.dao.*,com.agilecontrol.nea.util.*,org.apache.struts.Globals" %> 
<%
  String date = String.valueOf(new Date().getTime());
  String themeStyle = ConfigValues.get("fair.theme.style", "01");
  String cmd=ConfigValues.get("report.cmd", "com.agilecontrol.fair.FairCmd");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta content="text/html;charset=utf-8" http-equiv="Content-Type">
	<title>表配置页面</title>
	<link type="text/css" href="css/report.css?t=<%=date %>" rel="StyleSheet"/>
	<script type="text/javascript" src="js/prototype.js?t=<%=date %>"></script>
	<script type="text/javascript" src="js/jquery.min.js?t=<%=date %>"></script>
	<script type="text/javascript">jQuery.noConflict();</script>
	<script language="javascript" src="js/rest.js?t=<%=date %>"></script>
	<script type="text/javascript" src="js/jquery-ui.min.js?t=<%=date %>"></script>
	<script type="text/javascript" src="js/jquery.touch-punch.min.js?t=<%=date %>"></script>
	<script type="text/javascript" src="js/jquery.shapeshift.js?t=<%=date %>"></script>
	<script type="text/javascript" src="js/configurecontrol.js?t=<%=date %>"></script>
</head>
<body>
	<p class="topbutton">
		<span class="testrpt">测试报表</span>
		<span class="basicrpt">基础表配置</span>
		<span class="copyrpt">复制报表</span>
		<span class="graphicalrpt" onclick="cc.recreat('GRPT','view901');">新增图形化报表</span>
		<span class="recreat" onclick="cc.recreat('RPT','view900');">新增报表</span>
	</p>
	<div class="left">
		<div class="container">
			<!--报表如果可配置的class='con'，不可配置class='uncon'-->
		 </div>
	 </div>
	 <!--右边栏 配置信息-->
	 <div class="configure" theme='<%=themeStyle%>'>
		<p>报表信息</p>
		<p class="check"><span>报表显示名称：</span>
			<input id="sel" style="display:none;" type="checkbox" name="sel" value="" /><span style="display:none;">是否隐藏</span>
			<span class="reportname"></span>
		</p>
		<p class="isview900"><span>报表字段名称：</span>
			<span class="db_name"></span>
		</p>
		<p class="alert isview900" style="display:none;"></p>
		<p class="authority isnew">报表权限(sql)：</p>
		<textarea rows="2" cols="20" placeholder="可以通过输入SQL指定权限" class='isnew rightcontrol'></textarea>
		<p class="isview900">报表权限(group)：</p>
		<textarea rows="1" cols="10" placeholder="可以通过输入group名称指定权限" class='group isview900'></textarea>
		<p class="isview900">获取数据来源的买手ID：</p>
		<textarea rows="2" cols="20" placeholder="可以通过输入SQL指定" class='fsql isview900'></textarea>
		<div style="display:none;" class="filter">
			<input type="checkbox" id='allow_filter'/>查询条件
			<input type="checkbox" id='allow_f_filter'/>买手过滤
			<input type="checkbox" id="ishide"/>是否隐藏报表
		</div>
		<div class="isview900">
			<p style="display:block;">主管权限：</p>
			<input name="type1" type="radio" value=0 checked='checked'/>基于当前买手
			<input name="type1" type="radio" value=1 />基于下级买手
		</div>
		<div class="isview900">
			<span>TOP设置：</span><input id="topset"/>
		</div>
		<div class="isview900">
			<span >合并单元格列：</span><input id="mergecell"/>
		</div>
		<!-- <p class="new"><span>新增</span></p>
		<div class="area">
			<p>组合</p>
			<span class="selectvalue">华东区</span>
			<ul>
			</ul>
		</div>
		<div class="funi">
			<p>关系</p>
			<span class="selectvalue">正大店</span>
			<ul>
				<li>正大店</li>
				<li>光明店</li>
			</ul>
		</div>
		<div class="inp">
			<input type="text" />
		</div>
		<div style="clear:both"></div> -->
		
		<div class="submit">
			<button onclick="cc._saverptviews()">保存</button><button class='isnew' onclick="cc._deleteviews()">删除</button><button class='isnew' onclick="cc._detailconfigure()">详细配置</button>
		</div>
	 </div>
	 <!--提交按钮-->
	 <script type="text/javascript">
		jQuery(document).ready(function(){
			cc._load('<%=themeStyle%>','<%=cmd%>');
		});
	</script>
</body>
</html>