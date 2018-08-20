<%if(ConfigValues.JAVASCRIPT_FAST_LOAD){ %>
<script language="javascript" src="/nea/core/js/object_aio_<%=locale.toString()%>_min.js"></script>
<link type="text/css" rel="stylesheet" href="<%=userWeb.getThemePath()%>/css/object_aio_min.css">
<%}else{%>
<script language="javascript" src="/nea/core/js/top_css_ext.js"></script>
<script language="javascript" language="javascript1.5" src="/nea/core/js/ieemu.js"></script>
<script language="javascript" src="/nea/core/js/cb2.js"></script>
<script language="javascript" src="/nea/core/js/xp_progress.js"></script>
<script language="javascript" src="/nea/core/js/helptip.js"></script>
<script language="javascript" src="/nea/core/js/common.js"></script>
<script language="javascript" src="/nea/core/js/print.js"></script>
<script language="javascript" src="/nea/core/js/prototype.js"></script>
<script language="javascript" src="/nea/core/js/jquery1.2.3/jquery.js"></script>
<script language="javascript" src="/nea/core/js/jquery1.2.3/hover_intent.js"></script>
<script language="javascript" src="/nea/core/js/jquery1.2.3/ui.tabs.js"></script>
<script>
	jQuery.noConflict();
</script>		
<script language="javascript" src="/nea/core/js/portal/sniffer.js"></script>
<script language="javascript" src="/nea/core/js/portal/ajax.js"></script>
<script language="javascript" src="/nea/core/js/portal/util.js"></script>
<script language="javascript" src="/nea/core/js/portal/portal.js"></script>
<script language="javascript" src="/nea/core/js/objdropmenu.js"></script>
<script language="javascript" src="/nea/core/js/formkey.js"></script>
<script language="javascript" src="/nea/core/js/selectableelements.js"></script>
<script language="javascript" src="/nea/core/js/selectabletablerows.js"></script>
<script language="javascript" src="/nea/core/js/portal/dragdrop/coordinates.js"></script>
<script language="javascript" src="/nea/core/js/portal/dragdrop/drag.js"></script>
<!--<script language="JavaScript" src="/nea/core/js/portal/dragdrop/dragdrop.js"></script>-->
<script language="javascript" src="/nea/core/js/calendar.js"></script>
<script language="javascript" src="/nea/core/js/controller.js"></script>
<script language="javascript" src="/nea/core/js/dwr.engine.js"></script>
<script language="javascript" src="/nea/core/js/dwr.util.js"></script>
<script language="javascript" src="/nea/core/js/application.js"></script>
<script language="javascript" src="/nea/core/js/alerts.js"></script>
<script language="javascript" src="/nea/core/js/dw_scroller.js"></script>
<script language="javascript" src="/nea/core/js/init_objcontrol_<%=locale.toString()%>.js"></script>
<script language="javascript" src="/nea/core/js/objcontrol.js"></script>
<script language="javascript" src="/nea/core/js/obj_ext.js"></script>
<script language="javascript" src="/nea/core/js/gridcontrol.js"></script>
<script language="javascript" src="/nea/core/js/object_query.js"></script>
<link type="text/css" rel="stylesheet" href="/nea/core/css/nds_header.css">
<link type="text/css" rel="stylesheet" href="<%=userWeb.getThemePath()%>/css/objdropmenu.css">
<link type="text/css" rel="stylesheet" href="<%=userWeb.getThemePath()%>/css/portal.css">
<link type="text/css" rel="StyleSheet" href="/nea/core/css/cb2.css">
<link type="text/css" rel="stylesheet" href="<%=userWeb.getThemePath()%>/css/nds_portal.css">
<link type="text/css" rel="StyleSheet" href="<%=userWeb.getThemePath()%>/css/custom-ext.css" />
<link type="text/css" rel="stylesheet" href="<%=userWeb.getThemePath()%>/css/ui.tabs.css">
<!--<link type="text/css" rel="stylesheet" href="<%=userWeb.getThemePath()%>/css/object.css">-->
<%}%>
<script type="text/javascript" src="/nea/core/images/flash/FABridge.js"></script>
<script type="text/javascript" src="/nea/core/images/flash/playErrorSound.js"></script>

<title><%=table==null?"Object": table.getDescription(locale)+" - "+table.getCategory().getDescription(locale)%></title>
<%
String fkURLTarget=null;// ((Configurations)WebUtils.getServletContextManager().getActor(com.agilecontrol.nea.core.util.WebKeys.CONFIGURATIONS)).getProperty("object.url.target");
if(com.agilecontrol.nea.util.Validator.isNotNull(fkURLTarget)){
	fkURLTarget="target=\""+ fkURLTarget+"\"";
}else{
	fkURLTarget="";
}
%>