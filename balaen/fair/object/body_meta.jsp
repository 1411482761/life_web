<div id="timeoutBox">
	<div id="timeout-txt"><blink><%= PortletUtils.getMessage(pageContext, "time-out-warning",null)%></blink></div>
	<div id="timeout-btn"><input type="button"  class="cbutton" value="<%=PortletUtils.getMessage(pageContext, "time-out-refresh",null)%>" onclick="oc.timeoutRefresh()">&nbsp;
<input type="button"  class="cbutton"  value="<%=PortletUtils.getMessage(pageContext, "time-out-wait",null)%>" onclick="oc.timeoutWait()"></div>
</div>





