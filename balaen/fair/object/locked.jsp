<%@page errorPage="/nea/error.jsp"%>
<%@ include file="/nea/core/common/init.jsp" %>
<html><head>
<meta http-equiv=Content-Type content="text/html;charset=gb2312">
<title><%= PortletUtils.get(pageContext, "object-locked") %></title>
<style>
#rm{
 font-weight:bold;
}	
</style>	
</head><body>
<h2><%= PortletUtils.get(pageContext, "object-locked") %></h2>
<%= PortletUtils.get(pageContext, "possible-reason") %>
<ul>
	<li><%= PortletUtils.get(pageContext, "object-importing") %></li>
	<li><%= PortletUtils.get(pageContext, "object-heavy-updating") %>
</li>
</ul>
<span id="rm">30</span>&nbsp;<%= PortletUtils.get(pageContext, "wait-second-or") %>
<a href="<%=request.getParameter("redirect")%>"><%= PortletUtils.get(pageContext, "return-locked-page") %></a>
<script> 
<!-- 
// 
var seconds=30 
document.getElementById("rm").innerHTML=seconds;
function display(){ 
	 if (seconds<=0){ 
	    seconds=0;
	    window.location="<%=request.getParameter("redirect")%>";
	 }else {
	    seconds-=1 ;
	    document.getElementById("rm").innerHTML=seconds;
	    setTimeout("display()",1000) 
	 }
} 
display(); 
--> 
</script> 

</body></html>