<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<title>批量导入</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="Cache-Control" content="max-age=0,no-store,no-cache,must-revalidate" />
<meta http-equiv="Expires" content="-1" />
<meta http-equiv="Pragma" content="no-cache" />
<link type="text/css" rel="stylesheet" href="/nea/core/themes/classic/01/css/portal.css">
<link type="text/css" rel="StyleSheet" href="/fair/ipad/pdtimg/css/uploadify.v3.2.1.css" />
<link type="text/css" rel="StyleSheet" href="/fair/ipad/pdtimg/css/pdtimg.css" />
<link type="text/css" rel="StyleSheet" href="/fair/ipad/pdtimg/css/jquery-ui-1.8.16.custom.css" />
<link type="text/css" rel="StyleSheet" href="/fair/ipad/pdtimg/css/upload.css" />
<script type="text/javascript" src="/nea/core/js/prototype.js"></script>
<script type="text/javascript" src="/fair/ipad/js/jquery.js"></script>
<script type="text/javascript" src="/fair/ipad/pdtimg/js/jquery.uploadify.v3.2.1.min.js"></script>
<script type="text/javascript">jQuery.noConflict();</script>
<script type="text/javascript" src="/nea/core/js/rest.js"></script>
<script type="text/javascript" src="/fair/ipad/pdtimgConf/js/batch.js"></script>
<script type="text/javascript" src="/fair/ipad/pdtimg/js/jquery-ui-1.8.16.custom.min.js"></script>

<script type="text/javascript">
	jQuery(document).ready(function() {
		fup = new FileUpload("<%= session.getId() %>");
		var EventUtil = {
			    getEvent: function (event) {
			        return event ? event : window.event;
			    },
			    addHandler: function (element, type, handler) {
			        if (element.addEventListener) {
			            element.addEventListener(type, handler, false);
			        } else if (element.attachEvent) {
			            element.attachEvent("on" + type, handler);
			        } else {
			            element["on" + type] = handler;
			        }
			    }
			};
			EventUtil.addHandler(window, "beforeunload", function (event) {
			    event = EventUtil.getEvent(event);
			    fup.end();
			    event.returnValue = "离开或刷新将结束上传";
			});
	});

</script>
</head>
<body>
	<input type="button" value="返回" onclick="fup.back();"/>
	<h1>请选择需要上传的图片</h1>
	<ul id="desc">
		<li>选取一个或多个图片上传，支持JPG和PNG格式；</li>
		<li>也可将图片打包上传，支持ZIP、RAR、7Z、TAR、GZ等压缩包；</li>
		<li>单个文件最大2G，一次最多选取500个文件；</li>
		<li>图片名称须以商品编号命名，例如12345.jpg；</li>
		<li>同一商品有多个图片，自第2个起，文件名须加上下划线和序号，例如：12345_1.jpg, 12345_2.jpg；</li>
		<li>如果商品已有图片与上传的图片同名，则同名图片会以新图片覆盖。</li>
		<li>如果商品图片正在上传时离开、关闭本页面，则只会处理离开、关闭前已上传成功的文件。</li>
		<li>终止按钮,当上传卡住的时候可以点击该按钮,并且刷新页面。</li>
		<li>建议使用谷歌浏览器</li>
	</ul>
	<input type="button" value="重新开始上传" onclick="fup.reset();" class="reset"/>
	<div id="some_file_queue"></div>
	<input type="file" id="fileUpload"/>
	<div id="progress"></div>
	<span class="num"></span>
	<ul id="results"></ul>
    <label id="showDetails"><input type="checkbox" onClick="fup.toggleDetails();"/>显示详细</label>
	<ul id="details"></ul>

</body>
</html>
