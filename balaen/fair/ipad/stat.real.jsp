<%@ page language="java" import="com.agilecontrol.nea.core.monitor.*,java.util.*" pageEncoding="utf-8"%>
<%@page errorPage="/nea/error.jsp"%>
<%
String sessionKey= request.getParameter("sessionkey");
String date = String.valueOf(new Date().getTime());
%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<title>Balanced Order - Lifecycle RCP</title>
<script language="JavaScript" src="/charts/FusionCharts.js"></script>
<link  rel='stylesheet' href="main.css?t=<%=date %>" />
</head>
<body>
<table width="760" border="0" align="center" cellpadding="0" cellspacing="0">
  <tr>
    <td width="8" rowspan="2" background="/fair/ipad/img/page_bg.gif">&nbsp;</td>
    <td><table width="420" border="0" cellspacing="0" cellpadding="0">
     <tr>
        <td valign="baseline"><a href="http://www.fusioncharts.com"><img src="/fair/ipad/img/lifecycle-logo.png" border="0" alt="Go to FusionCharts home" /></a></td>
        <td valign="middle"><div class="headline">Lifecycle 2012  夏季订货会</div></td>
      </tr>
      <tr>
        <td colspan="2"><img src="/fair/ipad/img/dot_white.png" width="1" height="5" /></td>

        </tr>
      <tr>
        <td colspan="2"><table width="420" border="0" cellspacing="0" cellpadding="0" class='bordertop' >
          <tr>
            <td width="100" class="tab"><div align="center"><a href="score.jsp?sessionkey=<%=sessionKey%>">KPI</a></div></td>
            <td width="130" class="tabselected"><div align="center"><a href="stat.jsp?sessionkey=<%=sessionKey%>">统计图</a></div></td>
            <td width="100" class="tab"><div align="center"><a href="order.jsp?sessionkey=<%=sessionKey%>">订单表格</a></div></td>
            <td>&nbsp;</td>
          </tr>
          
        </table></td>
        </tr>
    </table></td>
    <td width="8" rowspan="2" background="/fair/ipad/img/page_bg.gif">&nbsp;</td>
  </tr>

  <tr>
    <td><table width="420" border="0" cellpadding="0" cellspacing="0" class="bordertop">
      <tr>
        <td width="400" valign="top"><table width="400" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td>&nbsp;</td>
          </tr>
          <tr>
            <td>          
				<div id="chart1" align="center"></div>

				<script type="text/javascript">
				    var myChart = new FusionCharts("/charts/Doughnut3D.swf", "chart1c", "400", "300", "0", "1");
				    myChart.setJSONUrl("/fair/ipad/data.jsp?m=3&sessionkey=<%=sessionKey%>");
				    myChart.render("chart1");
			    </script>			</td>
          </tr>
          <tr>
            <td><img src="/fair/ipad/img/dot_white.png" width="1" height="10" /></td>
          </tr>
          <tr>
            <td class='bordertop'><img src="/fair/ipad/img/dot_white.gif" width="1" height="10" /></td>
          </tr>

          <tr>
            <td><div align="center"><span class='textsmall'>小类分布</span></div></td>
          </tr>
          <tr>
            <td>
				<div id="mapdiv" align="center">			</div>
		      <script type="text/javascript">
		         var myChart = new FusionCharts("/charts/Column3D.swf", "mapdiv2", "400", "300", "0", "1");
				    myChart.setJSONUrl("/fair/ipad/data.jsp?m=4&sessionkey=<%=sessionKey%>");
				    myChart.render("mapdiv");
		      </script>			</td>

          </tr>
		  <tr>
            <td><img src="/fair/ipad/img/dot_white.gif" width="1" height="10" /></td>
          </tr>
          <tr>
            <td><img src="/fair/ipad/img/dot_white.png" width="1" height="10" /></td>
          </tr>
          <tr>
            <td>			</td>
          </tr>
        </table></td>
        <td width="340" valign="top" class="rightcol">
        	<table width="340" border="0" cellspacing="0" cellpadding="0">
		 <tr>
            <td class="tab"><div align="center">价格区间</div></td>
          </tr>
          <tr>
            <td><img src="/fair/ipad/img/dot_white.png" width="1" height="15" /></td>
          </tr>
          <tr>
            <td><div id="chart5" align="center"></div>
				<script type="text/javascript">
				    var myChart = new FusionCharts("/charts/Pie3D.swf", "chart5c", "340", "140", "0", "1");
				    myChart.setJSONUrl("/fair/ipad/data.jsp?m=20&sessionkey=<%=sessionKey%>");
				    myChart.render("chart5");
			    </script></td>
          </tr>
          <tr>
            <td><img src="/fair/ipad/img/dot_white.png" width="1" height="15" /></td>
          </tr>
          
          <tr>
            <td class="tab"><div align="center"> 品牌</div></td>
          </tr>
          <tr>
            <td><img src="/fair/ipad/img/dot_white.png" width="1" height="15" /></td>
          </tr>
          <tr>
            <td><div id="chart3" align="center"></div>

				<script type="text/javascript">
				    var myChart = new FusionCharts("/charts/Column2D.swf", "chart3c", "340", "140", "0", "1");
				    myChart.setJSONUrl("/fair/ipad/data.jsp?m=1&sessionkey=<%=sessionKey%>");
				    myChart.render("chart3");
			    </script></td>
          </tr>
          <tr>
            <td><img src="/fair/ipad/img/dot_white.png" width="1" height="15" /></td>
          </tr>
          
          
          <tr>
            <td class="tab"><div align="center">系列</div></td>
          </tr>
          <tr>
            <td><img src="/fair/ipad/img/dot_white.png" width="1" height="15" /></td>
          </tr>
          <tr>
            <td><div id="chart4" align="center"></div>

				<script type="text/javascript">
				    var myChart = new FusionCharts("/charts/Bar2D.swf", "chart4c", "340", "140", "0", "1");
				    myChart.setJSONUrl("/fair/ipad/data.jsp?m=2&sessionkey=<%=sessionKey%>");
				    myChart.render("chart4");
			    </script></td>
          </tr>
          <tr>
            <td><img src="/fair/ipad/img/dot_white.png" width="1" height="15" /></td>
          </tr>
          
          
        </table></td>
      </tr>
    </table></td>
  </tr>
  
  <tr>
    <td background="/fair/ipad/img/page_bg.gif">&nbsp;</td>
    <td>&nbsp;</td>
    <td background="/fair/ipad/img/page_bg.gif">&nbsp;</td>

  </tr>
  <tr>
    <td background="/fair/ipad/img/page_bg.gif">&nbsp;</td>
    <td><div align="center" class="text">Lifecycle 2012  夏季订货会 </div></td>
    <td background="/fair/ipad/img/page_bg.gif">&nbsp;</td>
  </tr>
  <tr>
    <td background="/fair/ipad/img/page_bg.gif">&nbsp;</td>

    <td><div align="center" class="text">&copy; 版权所有, 上海贯信信息技术有限公司</div></td>
    <td background="/fair/ipad/img/page_bg.gif">&nbsp;</td>
  </tr>
    <tr>
      <td background="/fair/ipad/img/page_bg.gif">&nbsp;</td>
      <td>&nbsp;</td>
      <td background="/fair/ipad/img/page_bg.gif">&nbsp;</td>
    </tr>

</table>
</body>
</html>
