<%@ page language="java" import="org.json.*,com.agilecontrol.nea.core.security.*" pageEncoding="utf-8"%>
<%@ include file="/nea/core/common/init.jsp" %>
<%
if(userWeb==null || userWeb.isGuest()){
	String redirect=java.net.URLEncoder.encode(request.getRequestURI()+"?"+request.getQueryString() ,"UTF-8");
	response.sendRedirect("/c/login?redirect="+redirect);
	return;
}
int objectId=Tools.getInt(request.getParameter("id"),-1);

QueryEngine engine=QueryEngine.getInstance();
TableManager manager=TableManager.getInstance();
Table table=null;
int tableId= Tools.getInt(request.getParameter("table"),-1);
table=manager.getTable(tableId);
if( table==null) throw new NDSException("table "+ tableId+" no found.");
int usrTableId= manager.getTable("users").getId();
int tablePhaseId=manager.getTable("au_phase").getId();
%>
<html>
<head>
<%@ include file="workflow_top_meta.jsp" %>
</head>
<body id="obj-body">
<%
String errorMessage=null;
ObjectFlow of=null;
List<ObjectFlow.Workflow> flows= null;
if(!userWeb.hasObjectPermission(table.getName(),objectId,com.agilecontrol.nea.core.security.Directory.READ)) errorMessage="没有权限";
else{
	of=new ObjectFlow(tableId,objectId, userWeb.getUserId());
	flows=of.getWorkflows();
	if(flows==null ||flows.size()==0) errorMessage="未发现审批信息";
}

if(errorMessage!=null){	
%>
<div class="msg-error">
	<%=errorMessage%>
</div>
<%}else{
if(flows.size()>1){
%>	
<div id="maintab"><ul id="pstab">
	<%
	for(int wf=flows.size()-1;wf>=0;wf--){
		String wfdesc= (wf==flows.size()-1? "当前流程":"上"+(flows.size()-wf-1)+"轮流程");
	%>
		<li><a href="#tab<%=wf%>"><span><%=wfdesc%></span></a></li>
	<%}%>
	</ul>
<%}else{%>	
<%
}
for(int wf=flows.size()-1;wf>=0;wf--){
	ObjectFlow.Workflow workflow= flows.get(wf);
	ObjectFlow.Process process=workflow.process;
	if(Validator.isNull(process.filter)) process.filter="无";
%>
  <div id="tab<%=wf%>"><div class="dtable">
<div class="ahd">
		<div class="aleft">
			<div class="afi">工作流:</div><div class="adesc"><a href="object.jsp?table=<%=manager.getTable("au_process").getId()%>&id=<%=process.id%>"><%=process.name%></a></div>
			<div class="afi">单据:</div><div class="adesc"><a href="object.jsp?table=<%=tableId%>&id=<%=objectId%>"><%=of.getDocNO()%></a></div>
			<div class="afi agray">条件:</div><span class="adesc agray" title="<%=StringUtils.escapeHTMLTags(process.filter)%>"><%=StringUtils.shorten(StringUtils.escapeHTMLTags(process.filter),40)%></span>
			<div class="afi agray">最后时间:</div><span class="adesc agray"><%=workflow.getLastModifiedDate()%></span>
		</div>
		<div class="aright">
			<div class="adesc ac"><%if("W".equals(workflow.getState())){%>
<form id="canform" action="/control/command" method="post">
	<input type="hidden" name="command" value="com.agilecontrol.nea.core.control.ejb.command.DeletePhaseInstance">
	<input type="hidden" name="next-screen" value="/nea/core/object/object.jsp?table=<%=tableId%>&id=<%=objectId%>">
	<input type="hidden" name="objectid" value="<%=workflow.getLastPhaseInstanceId()%>">
</form>
				<input type="button" id="canbutton" value="审批界面" onclick="window.location='audit.jsp?table=<%=tableId%>&id=<%=objectId%>'">&nbsp;&nbsp;
				<input type="button" id="canbutton" value="取消工作流" onclick="cancelWorkflow()"><%}%>
			</div>
		</div>
</div>
<%	
	// phases
	List<ObjectFlow.PhaseOfWorkflow> phases=workflow.getPhases(wf==flows.size()-1);
	for(int phaseIdx=0;phaseIdx< phases.size();phaseIdx++){
		ObjectFlow.Phase phase= phases.get(phaseIdx).phase;
		ObjectFlow.PhaseInstance phaseInstance= phases.get(phaseIdx).pi;
		int phaseId= phase.id;
		String phaseFilter=phase.filter;
		if(Validator.isNull(phaseFilter)) phaseFilter="";
%>
	<div class="aphase">
		<div class="aleft">
			<div class="apd <%=(phaseInstance!=null?"aphase_"+phaseInstance.state:"")%>">
				
				<div class="api">阶段:</div><div class="adesc"><a href="object.jsp?table=<%=tablePhaseId%>&id=<%=phase.id%>"><%=phase.name%></a></div>
				<div class="apdd agray">
					<span class="ab">条件:</span><span class="acd" title="<%=phaseFilter%>"><%=StringUtils.shorten(phaseFilter,40)%></span><br/>
					<span class="ab">最少批准:</span><%=phase.permitNum%><span class="abmr">最少驳回:</span><%=phase.rejectNum%><span class="abmr">最少批复:</span><%=phase.auditNum%>
				</div>
				
			</div>
		</div>
		<div class="aright">
<%
			if(phaseInstance!=null){
%>			<ul class="aua">
<%				for(int i=0;i< phaseInstance.aas.length();i++){
					JSONObject userone= phaseInstance.aas.getJSONObject(i);
					String comments=userone.optString("comments", "");
					if(Validator.isNull(comments)) comments="无";
					String commentsShort= StringUtils.shortenInBytes(comments, 50,"...");
					String mdate=userone.optString("modifieddate","");
					boolean read= Validator.isNotNull(mdate);
					if(!read) mdate= "";
%>			
			<li class="ala"><div class="au <%=(read?"":"unread")%>">
					<%=userone.getString("uname")%>
					<%if(userone.optInt("assignee_id",-1)>0){%>
						(代办:<%=userone.getString("u2name")%>)
					<%}%>
				</div> 
				<div class="astate_<%=userone.getString("state")%>">&nbsp;</div>
				<div class="acmt" title="<%=comments%>"><%=commentsShort%></div>
				<div class="adt"><%=mdate%></div>
			</li>
<%				}
%>			</ul>
<%
			}else{
%>
			<div class="auu">
<%				for(int i=0;i< phase.auditors.length();i++){
					JSONObject userone= phase.auditors.getJSONObject(i);
%>
					<span class="auuo"><%=userone.getString("truename")%></span>
<%				}
%>
			</div>
		
<%				
			}
%>
		</div>
	</div>
<%		
		}//end phases loop
%>	
 </div></div>
<%		
	}//end workflow loop
if(flows.size()>1){%>
</div>
<%}	
}//end errorMessage
%>
<script>
	<%if(flows.size()>1){%>
		jQuery('#pstab').tabs();
	<%}%>

	function cancelWorkflow(){
		if(!confirm("当前实例对应的整个单据流程被删除，包括流程中前面已经通过的阶段信息，如果单据仍在审核中，将被驳回\n\n你确认要执行-删除审核实例-动作吗?"))return;
		jQuery("#canbutton").attr('disabled', true);
		canform.submit();	
	}
</script>
</body>
</html>