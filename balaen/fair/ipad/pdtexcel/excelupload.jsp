<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
<head lang="zh-CN">
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <link type="text/css" rel="StyleSheet" href="/fair/ipad/pdtimg/css/uploadify.v3.2.1.css" />
    <link href="/fair/ipad/css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="/fair/ipad/css/common/main.css"  rel="stylesheet" >
	<link href="/fair/ipad/pdtexcel/css/excelupload.css" rel="stylesheet">
	
    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
    <script src="http://cdn.bootcss.com/html5shiv/3.7.2/html5shiv.min.js"></script>
    <script src="http://cdn.bootcss.com/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
	<script src="/fair/ipad/js/prototype.js"></script>
    <script src="/fair/ipad/js/bootstrap/jquery-1.11.2.min.js"></script>
    <script type="text/javascript" src="/fair/ipad/pdtimg/js/jquery.uploadify.v3.2.1.min.js"></script>
    <script >jQuery.noConflict();</script>
    <script  src="/nea/core/js/rest.js"></script>
    <script src="/fair/ipad/pdtexcel/js/exceluploadcontrol.js"></script>
    <title>excel导入</title>
</head>
<body>
    <div class="container">
        <div class="head has-warning">
            <h3>
                <p class="head_tip"><img src="/fair/ipad/pdtexcel/images/u41.png">请上传Excel数据文件</p>
            </h3>
        </div>
        <h4>您需要准备如下数据，星号(<span class="need_red">*</span>)是必须的：</h4>
        <div  class="body">
                <div><p>订货会 <span class="need_red" >*</span><span class="body_tip body_tip_fair">等待上传</span></p></div>
                <div><p>用户资料  <span class="need_red">*</span><span class="body_tip body_tip_user">等待上传</span></p></div>
                <div><p>门店资料 <span class="need_red">*</span><span class="body_tip body_tip_store">等待上传</span></p></div>
                <div><p>尺码颜色 <span class="need_red">*</span><span class="body_tip body_tip_clrsize">等待上传</span></p></div>
                <div><p>商品资料 <span class="need_red">*</span><span class="body_tip body_tip_product">等待上传</span></p></div>
                <div><p>条码导入 <span class="body_tip body_tip_aliasimp">等待上传</span></p></div>
                <div><p>买手权重 <span class="body_tip body_tip_buyweight">等待上传</span></p></div>
        </div>

        <div class="foot row">
            <ol>
                <li>
                    <div class="form-group">
                        <a href="js/bootstrap.js" download="js/bootstrap.js">下载Excel数据模板</a>
                    </div>
                </li>
                <li>
                     <span>选取Excel数据文件：</span>
                     <input type="file" name="fileUpload" id="fileUpload" >
                </li>
                 <li>
                    <span>上传Excel数据文件：</span>
                    <button type="submit" onclick="exceluploadc.upload();">上传</button>
                </li>
                <li >
                    <div class="checkbox">
                        <span>执行导入：</span>
                        <label>
                            <input type="checkbox" id="check">执行时清除原有数据
                        </label>
                        <button type="submit" class="execute" onclick="exceluploadc.imp();">导入</button>
                    </div>
                </li>
            </ol>
        </div>
    </div>
	<script>
        jQuery(document).ready(function(){
        	<%-- exceluploadc.init("<%= session.getId() %>"); --%>
        	exceluploadc = new ExcelUploadControl("<%= session.getId() %>");
        });
    </script>
</body>
</html>