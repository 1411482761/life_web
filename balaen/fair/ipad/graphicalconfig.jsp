<!DOCTYPE html>
<%@ page language="java" pageEncoding="utf-8"%>
<%@ page import="org.slf4j.Logger,org.slf4j.LoggerFactory,org.json.*,java.text.SimpleDateFormat,java.sql.ResultSet,java.sql.Connection,java.sql.PreparedStatement,com.agilecontrol.nea.core.query.web.*,com.agilecontrol.nea.core.control.web.*,com.agilecontrol.nea.core.util.*,com.agilecontrol.nea.core.schema.*,com.agilecontrol.nea.core.query.*, java.io.*,java.util.*,com.agilecontrol.nea.core.control.util.*,com.agilecontrol.nea.core.report.*,com.agilecontrol.nea.core.web.bean.*,com.agilecontrol.nea.core.model.*, com.agilecontrol.nea.core.model.dao.*,com.agilecontrol.nea.util.*,org.apache.struts.Globals"%>

<html lang="zh-CN">
<head>
	<!--通知IE采用其所支持的最新模式 -->
    <meta http-equiv="X-UA-Compatible" content="IE=Edge">
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,user-scalable=no">
    <script type="text/javascript" src="/fair/ipad/js/prototype.js"></script>
    <script type="text/javascript" src="/fair/ipad/js/jquery-1.11.3.js"></script>
    <script type="text/javascript">jQuery.noConflict();</script>
    <script type="text/javascript " src="/fair/ipad/js/jquery-ui.min.js"></script>
    <script type="text/javascript" src="/fair/ipad/js/jquery.spinner.js"></script>
    <script type="text/javascript" src="/fair/ipad/js/bootstrap/bootstrap.min.js"></script>
    <script type="text/javascript" src="/fair/ipad/js/graphicalcfgcontrol.js"></script>
    <link rel="stylesheet" type="text/css" href="/fair/ipad/css/bootstrap/bootstrap.css">
    <link rel="stylesheet" type="text/css" href="/fair/ipad/css/common/bootstrap-spinner.css">
    <link rel="stylesheet" type="text/css" href="/fair/ipad/css/common/font-awesome.min.css"> 
    <script language="javascript" src="/nea/core/js/rest.js"></script>
    <link rel="stylesheet" type="text/css" href="/fair/ipad/css/common/graphicalconfig.css">

</head>
<body >
    <!-- Modal -->
<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
        <h4 class="modal-title" id="myModalLabel">可选组件</h4>
      </div>
      <div class="modal-body">
        <div id="cptlib" class="container-fluid">

        </div>

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
        <button type="button" class="btn btn-primary" onclick="grc.selectCpt()">确定</button>
      </div>
    </div>
  </div>
</div>
  <!--main page-->
 <div class="container" >
 	<div class="row">
 	   <div id="leftpanel" class="col-md-8" >
            <div class="panel panel-info">
            	<div class="panel-heading"><h2 class="panel-title">组件参数</h2></div>
            	<div class="panel-body">
                    <form class="form-inline">
                       <div class="form-group">
            			    <label class=" control-label">组件名:</label>
            			    <input  id="cptname" type="text" class=" form-control" style="display:none">
            			    <input id="cptdesc" type = "text" class="form-control" readonly>
                            <button type="button" class="btn btn-primary " data-toggle="modal" data-target="#myModal" onclick="grc.loadCptLib()"><i class="glyphicon glyphicon-plus"></i>选择组件</button>
                             <label for="height" class="control-label">高度:</label>
                            <div class="input-group spinner " data-trigger="spinner" id="spinner" style="width:16%"> 
                                <input id="height" type="text" class="form-control" value="1" data-max="10" data-min="1" data-step="1"> 
                                <div class="input-group-addon"> 
                                    <a href="javascript:;" class="spin-up" data-spin="up"><i class="icon-sort-up"></i></a> 
                                    <a href="javascript:;" class="spin-down" data-spin="down"><i class="icon-sort-down"></i></a> 
                                </div> 
                            </div>
                            <label for="width" class="control-label">宽度:</label>
                            <div class="input-group spinner " data-trigger="spinner" id="spinner" style="width:16%"> 
                                <input id="width" type="text" class="form-control" value="1" data-max="10" data-min="1" data-step="1"> 
                                <div class="input-group-addon"> 
                                    <a href="javascript:;" class="spin-up" data-spin="up"><i class="icon-sort-up"></i></a> 
                                    <a href="javascript:;" class="spin-down" data-spin="down"><i class="icon-sort-down"></i></a> 
                                </div> 
                            </div>

            		   </div>
                       <div class="form-group rowTop">
                         <label for="datasource" class="control-label">数据源:</label>
<!--                             <div class="dropdown input-group" onclick="grc.fixbug()"  >
                                <button class="btn btn-default dropdown-toggle" type="button" id="datasource" data-toggle="dropdown" >
                                                                               请选择数据源
                                <span class="caret"></span> 
                                </button>
                                <ul id="ds" class="dropdown-menu">                                  
                                </ul>
                            </div> -->
                          <select id="ds" class="btn btn-default" style="min-width:100px" onchange="grc.changeSource()">

                          </select>
                          <label for="title" class="control-label">图表标题：</label>
                          <input id="title" type="text" class="form-control"  >  
                       </div>

                    </form>
            	    <div class="panel panel-default" id="metadata">
            	       <div class="panel-body">
            	          <div id="hidden" style="display:none"></div>
            	          <div id="params">
            	          </div>
            	       </div>
            	    </div>
                    <div class=" pull-right" >
                        <button type="button" class="btn btn-primary">重置</button>
                        <button type="button" class="btn btn-primary" onclick="grc.addChart2List()">添加</button>
                        <button type="button" class="btn btn-primary" onclick="grc.modifyChart()">修改</button>                        
                    </div>
            	</div>
            </div>
 	    </div>
 	   <div id="rightpanel" class="col-md-4" >
         <div class="panel panel-success">
            <div class="panel-heading"><h2 class="panel-title">已添加组件列表</h2></div>
            <div class="panel-body ">
                <div class="list-group list1">

                </div>
                <div class="pull-right"  >
                        <button type="button" class="btn btn-primary" onclick="grc.removeChartFromList()">删除</button>
                        <button type="button" class="btn btn-primary" onclick="grc.moveUp()">上移</button>
                        <button type="button" class="btn btn-primary" onclick="grc.moveDown()">下移</button>
                        <button type="button" class="btn btn-primary" onclick="grc.saveAll()">保存</button>
                </div>
            </div>
         </div>
       </div>
 	</div>
 </div>
  <script type="text/javascript">
        jQuery(document).ready(function(){
        	grc.loadCptList();
        	
        });

 </script>
 </body>

</html>
