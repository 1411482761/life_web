<iframe id="hidden_iframe" name="hidden_iframe" src="/nea/core/common/null.html" style="visibility: hidden;"></iframe>
<div id="page-top">
<ul class="triblack">
	<%
	if (request.getAttribute("page_help")!=null){
	%>
	<li>
	<a class="gamma" href="javascript:popup_window('<%=ConfigValues.WIKI_HELP_PATH+"?page="+request.getAttribute("page_help")%>','ndshelp')">
	<%= PortletUtils.getMessage(pageContext, "help",null)%></a>
	</li>
	<%
	}else if(request.getAttribute("table_help")!=null){
	%>
	<li>
	<a class="gamma" href="javascript:popup_window('<%=ConfigValues.WIKI_HELP_PATH+"?table="+request.getAttribute("table_help")%>','ndshelp')">
	<%= PortletUtils.getMessage(pageContext, "help",null)%></a>
	</li>
	<%
	}
	%> 
	<li>
	<a class="gamma" href="<%=NDS_PATH%>/objext/wfmy.jsp"><%=userWeb.getUserDescription()%></a>
	</li>
</ul>
</div>




