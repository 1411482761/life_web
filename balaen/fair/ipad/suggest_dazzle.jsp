<%@page errorPage="/nea/error.jsp"%>
<%@ include file="/nea/core/common/init.jsp" %>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="java.util.*" %>
<%
 String date = String.valueOf(new Date().getTime());
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="Cache-Control" content= "no-cache"> 
<meta http-equiv="Expires" content= "0">
<meta name="apple-touch-fullscreen" content="yes" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black" />
<meta name="viewport" content="width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no">
<link rel="stylesheet" href="/fair/ipad/css/main.css?t=<%=date %>"
	type="text/css" media="screen" title="no title" charset="utf-8">
<link rel="stylesheet" href="/fair/ipad/css/suggestion.css?t=<%=date %>"
	type="text/css" media="screen" title="no title" charset="utf-8">
<title>OrderingBoard</title>
<style>
.tdesc{
	font-size: 38px;
	padding:20px 10px;
	
}
.tnum{
	font-size: 38px;
	padding:20px 10px;
	
}	
</style>	
</head>
<body>
	<div id="container">
		<div id="filter"></div>
		<div id="cominfo">
			<div id="logo"></div>
			<div id="orderinfo">订货会指标</div>
		</div>
		<div id="table">
<%
/**
按dazzle 要求显示商品的达成率
*/
String sessionKey=request.getParameter("sessionkey");
SecurityManagerWebImpl sm=(SecurityManagerWebImpl)WebUtils.getServletContextManager().getActor(WebKeys.SECURITY_MANAGER);
SessionInfo si=sm.getSession(sessionKey);
if(si!=null){
	userWeb= si.getUserWebImpl();
}
//user 指标
if(userWeb.isGuest()){
	out.print("会话链接已断开，请重新登录.");
}else{
	int funitId=  QueryEngine.getInstance().doQueryInt("select id from b_funit where user_id=?", new Object[]{userWeb.getUserId()});
	
	double sumPlan=Double.parseDouble(""+QueryEngine.getInstance().doQueryOne("select sum(AMT_PLAN) from B_PDT_INDEX where b_funit_id=?", new Object[]{funitId}));
	double sumAct=Double.parseDouble(""+QueryEngine.getInstance().doQueryOne("select TOT_AMT from b_fo where b_funit_id=?", new Object[]{funitId}));
	double rte= (sumPlan==0)? 100.0: sumAct*100.0/sumPlan ;
	
	// 买断
	double sumDuan=Double.parseDouble(""+QueryEngine.getInstance().doQueryOne("select nvl(sum(fi.amt),0) from b_foitem fi, b_fo fo, m_product p, m_dim dim8 where fo.b_funit_id=? and fo.id=fi.b_fo_id and fi.m_product_id= p.id and dim8.id=p.m_dim8_id and dim8.ATTRIBCODE=2", new Object[]{funitId}));
	double rateDuan= (sumAct==0)? 0.0: sumDuan*100.0/sumAct ;
	//非卖断
	double sumNotDuan=Double.parseDouble(""+QueryEngine.getInstance().doQueryOne("select nvl(sum(fi.amt),0) from b_foitem fi, b_fo fo, m_product p, m_dim dim8 where fo.b_funit_id=? and fo.id=fi.b_fo_id and fi.m_product_id= p.id and dim8.id=p.m_dim8_id and dim8.ATTRIBCODE=1", new Object[]{funitId}));
	double rateNotDuan= (sumAct==0)? 0.0: sumNotDuan*100.0/sumAct ;
	
	java.text.DecimalFormat fmt=QueryUtils.intPrintFormatter.get();
	
%>	

<span class="tdesc">订货指标:</span><span class="tnum">￥<%=fmt.format(sumPlan)%></span><br/><br/>
<span class="tdesc">实际订货:</span><span class="tnum">￥<%=fmt.format(sumAct)%> &nbsp;&nbsp; 占指标: <%=fmt.format(rte)%>%</span><br/><br/>
<span class="tdesc">买断款额:</span><span class="tnum">￥<%=fmt.format(sumDuan)%> &nbsp;&nbsp; 占订货:<%=fmt.format(rateDuan)%>%</span><br/><br/>
<span class="tdesc">非买断款:</span><span class="tnum">￥<%=fmt.format(sumNotDuan)%> &nbsp;&nbsp; 占订货:<%=fmt.format(rateNotDuan)%>%</span><br/>
<%}
%>    			
		</div>
		<div id="footer">
			<div class="hr"></div>
			<div id="footer-left"> &copy; 2011-2012 上海贯信信息技术有限公司</div>
			<div id="footer-right">iPad 订货系统</div>
		</div>
	</div>
</body>
</html>