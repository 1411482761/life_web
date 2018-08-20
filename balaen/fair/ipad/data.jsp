<%@ page language="java" import="org.json.*,java.lang.reflect.*,com.agilecontrol.nea.util.*,com.agilecontrol.nea.core.io.*,com.agilecontrol.nea.core.control.ejb.Command" pageEncoding="utf-8"%>
<%@page errorPage="/nea/error.jsp"%>
<%
String sessionKey= request.getParameter("sessionkey");
String dimension= request.getParameter("m");
System.out.println("/fair/ipad/data.jsp?sessionkey="+sessionKey+"&dimension="+ dimension);
JSONObject jo;
if(Validator.isNull(sessionKey) || Validator.isNull(dimension)){
	jo=new JSONObject();
}else{
	PluginController pc=(PluginController)com.agilecontrol.nea.core.control.web.WebUtils.getServletContextManager().getActor(com.agilecontrol.nea.core.util.WebKeys.PLUGIN_CONTROLLER);
	Command n2=pc.findPluginCommand("com.agilecontrol.fair.FairCmd");
	
	Method method=n2.getClass().getMethod("getDimChartData", Integer.class, String.class);
	jo=(JSONObject)method.invoke(n2, Tools.getInt(dimension,1), sessionKey);
}
%>
<%=jo%>
