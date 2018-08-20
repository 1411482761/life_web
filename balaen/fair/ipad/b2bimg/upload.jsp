<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<title>图片上传</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="Cache-Control" content="max-age=0,no-store,no-cache,must-revalidate" />
<meta http-equiv="Expires" content="-1" />
<meta http-equiv="Pragma" content="no-cache" />
<link type="text/css" rel="stylesheet" href="/nea/core/themes/classic/01/css/portal.css">
<link type="text/css" rel="StyleSheet" href="/fair/ipad/b2bimg/css/uploadify.v3.2.1.css" />
<link type="text/css" rel="StyleSheet" href="/fair/ipad/b2bimg/css/pdtimg.css" />
<link type="text/css" rel="StyleSheet" href="/fair/ipad/b2bimg/css/upload.css" />
<script type="text/javascript" src="/nea/core/js/prototype.js"></script>
<script type="text/javascript" src="/nea/core/js/jquery-1.3.2.min.js"></script>
<script type="text/javascript" src="/fair/ipad/pdtimg/js/jquery.uploadify.v3.2.1.min.js"></script>
<script type="text/javascript">jQuery.noConflict();</script>
<script type="text/javascript" src="/nea/core/js/rest.js"></script>
<script type="text/javascript" src="/fair/ipad/b2bimg/js/upload.js"></script>
<script type="text/javascript">
	jQuery(document).ready(function() {
		fup = new FileUpload("<%= session.getId() %>", "<%= request.getParameter("pdtId") %>");
	});
</script>
</head>
<body>
	<input type="button" value="返回" onclick="fup.back();"/>
	<h1>请选择需要上传的图片</h1>
	<ul id="desc">
		<li>选取一个或多个图片上传，支持JPG和PNG格式；</li>
		<li>单个文件最大10M，一次最多选取20张图片；</li>
		<li>与批量上传不同，图片无须特别命名，上传的图片将增加到商品已有图片之后。</li>
	</ul>
	<input type="file" id="fileUpload"/>
	<ul id="results"></ul>
	<label id="showDetails"><input type="checkbox" onClick="fup.toggleDetails();"/>显示详细</label>
	<ul id="details"></ul>
</body>
</html>