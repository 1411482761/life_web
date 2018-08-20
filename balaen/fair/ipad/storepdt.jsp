<% String storeid = request.getParameter("storeid"); %>
<% String pdtid = request.getParameter("pdtid"); %>
<% response.sendRedirect("/fair/ipad/kpi.jsp?storeid="+storeid+"&pdtid="+pdtid);%>