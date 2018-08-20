<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ page
	import="java.util.Date,com.agilecontrol.nea.core.web.config.*,org.slf4j.Logger,org.slf4j.LoggerFactory,org.json.*,java.text.SimpleDateFormat,java.sql.ResultSet,java.sql.Connection,java.sql.PreparedStatement,com.agilecontrol.nea.core.query.web.*,com.agilecontrol.nea.core.control.web.*,com.agilecontrol.nea.core.util.*,com.agilecontrol.nea.core.schema.*,com.agilecontrol.nea.core.query.*, java.io.*,java.util.*,com.agilecontrol.nea.core.control.util.*,com.agilecontrol.nea.core.report.*,com.agilecontrol.nea.core.web.bean.*,com.agilecontrol.nea.core.model.*, com.agilecontrol.nea.core.model.dao.*,com.agilecontrol.nea.util.*,org.apache.struts.Globals"%>
<%
	String date = String.valueOf(new Date().getTime());
	String cmd = ConfigValues.get("report.cmd","com.agilecontrol.fair.FairCmd");
	String tbindex = request.getParameter("tbindex");
	String tbname = request.getParameter("tbname");
	String tbdesc = request.getParameter("tbdesc");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta content="text/html;charset=utf-8" http-equiv="Content-Type">
<title>表配置页面</title>
<link type="text/css"
	href="/fair/ipad/grid/css/basicrptcolumns.css?t=<%=date%>"
	rel="StyleSheet" />
<link rel="stylesheet"
	href="/fair/ipad/grid/css/zTreeStyle/zTreeStyle.css" type="text/css">
<script type="text/javascript"
	src="/fair/ipad/js/prototype.js?t=<%=date%>"></script>
<script type="text/javascript"
	src="/fair/ipad/grid/js/jquery.min.js?t=<%=date%>"></script>
<script type="text/javascript"
	src="/fair/ipad/grid/js/jquery.ztree.core-3.5.js"></script>
<script type="text/javascript">jQuery.noConflict();</script>
<script language="javascript" src="/nea/core/js/rest.js?t=<%=date%>"></script>
<script type="text/javascript"
	src="/fair/ipad/grid/js/basicrptcolumnscontrol.js?t=<%=date%>"></script>
</head>
<body>
	<div id="top">
		当前表：<%=tbdesc %></div>
	<div id="middle">
		<div id="columnstree" class="ztree"></div>
		<div class="button mdiv">
			<button onclick="bcl._addCol()">></button>
			<button onclick="bcl._removeCol()"><</button>
			<button class="move" onclick="bcl.moveup()">
				<img width="16" height="16" border="0" align="absmiddle"
					src="/nea/core/images/moveup.gif">
			</button>
			<button class="move" onclick="bcl.movedown()">
				<img width="16" height="16" border="0" align="absmiddle"
					src="/nea/core/images/movedown.gif">
			</button>
		</div>
		<div id="columns">
			<div class="colslist"></div>
			<div class="coldetails">
				<div class="detailsinfo">
					<!-- <p>
						<span>字段名称：</span><span class="colname"></span>
					</p> -->
					<p>
						<span>字段描述：</span><input class="coldesc">
					</p>
					<p>
						<span>字段类型：</span><select class="coltype"><option value="dimension">维度</option><option value="measure">度量</option></select>
					</p>
					<p>
						<span>可为横轴：</span><select class="canberow"><option value="Y">是</option><option value="N">否</option></select>
					</p>
				</div>
				<!-- <div class="button">
					<button onclick="bcl._updatecoldetails()">确定</button>
					<button onclick="">取消</button>
				</div> -->
			</div>
		</div>
	</div>
	<div id="bottom" class="button">
			<button onclick="window.location.replace('/fair/ipad/grid/basicrptconfig.jsp')">返回</button>
			<button onclick="bcl._savetablecols()">保存</button>
	</div>
	<script type="text/javascript">
		/* function filter(treeId, parentNode, childNodes) {
			if (!childNodes) return null;
			for (var i=0, l=childNodes.length; i<l; i++) {
				childNodes[i].name = childNodes[i].name.replace(/\.n/g, '.');
			}
			return childNodes;
		} */

		jQuery(document).ready(function(){
			 bcl.load('<%=cmd%>',<%=tbindex%>,'<%=tbname%>');
		});
	</script>
</body>
</html>