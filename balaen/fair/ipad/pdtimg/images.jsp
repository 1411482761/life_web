<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head>
<title>商品图片</title>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="Cache-Control" content="max-age=0,no-store,no-cache,must-revalidate" />
<meta http-equiv="Expires" content="-1" />
<meta http-equiv="Pragma" content="no-cache" />
<link type="text/css" rel="stylesheet" href="/nea/core/themes/classic/01/css/portal.css">
<link type="text/css" rel="StyleSheet" href="/fair/ipad/pdtimg/css/pdtimg.css" />
<script type="text/javascript" src="/nea/core/js/prototype.js"></script>
<script type="text/javascript" src="/fair/ipad/js/jquery.js"></script>
<script type="text/javascript">jQuery.noConflict();</script>
<script type="text/javascript" src="/nea/core/js/rest.js"></script>
<script type="text/javascript" src="/fair/ipad/pdtimg/js/images.js"></script>
<script type="text/javascript">
	jQuery(document).ready(function() {
		imgs = new Images(<%= request.getParameter("pdtId") %>);
		imgs.list();
	});
</script>
</head>
<body>
	<div id="toolbar">
		<input type="button" id="add" value="新增" onclick="imgs.add()"/>
		<input type="button" id="delete" value="删除" onclick="imgs.remove()"/> |
		<input type="button" id="moveleft" value="左移" onclick="imgs.move('left')"/>
		<input type="button" id="moveright" value="右移" onclick="imgs.move('right')"/> |
		<input type="button" id="back" value="返回" onclick="imgs.back()"/>
	</div>
	<div id="header">
		<label><input id="selectAll" type="checkbox" onclick="imgs.selectAll()"/>全选</label>
	</div>
	<div id="list"></div>
	<div id="viewer" onclick="imgs.hideImg();">
	</div>
</body>
</html>