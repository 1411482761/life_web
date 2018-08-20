<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
	String sessionkey = request.getParameter("sessionkey");
	long time=System.currentTimeMillis();
%>
<!DOCTYPE html>
<html ng-app="app">
<head lang="en">
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="viewport"
	content="width=device-width initial-scale=1.0 maximum-scale=1.0 user-scalable=yes" />
<title>预算界面</title>
<link rel="stylesheet" href="/fair/ipad/css/bootstrap/bootstrap.min.css">
<link rel="stylesheet" href="/fair/ipad/myplan/css/myplan1.css?t=<%=time%>">
<script type="text/javascript" src='/fair/ipad/js/angular.min.js'></script>
<script type="text/javascript" src="/fair/ipad/js/rest.js"></script>
<script src="/fair/ipad/myplan/js/index.js?t=<%=time%>"></script>

</head>
<body>
	<!--<div ng-view class="container"></div>-->
	<div ng-controller="mainCtrl">
		<div id="main" ng-show="mhide" class="container">

			<div class="row">
					<div class="row left-top1">
						<div class=" col-md-2">
							<button class="btn btn-danger active" ng-click="success()"
								ng-disabled="vm.sumA==0">保存</button>
						</div>
						<div ng-show="vm.sumA==0" class="col-md-5 alert alert-warning">
							<strong>警告！</strong>计划合计不能为0，请调整品牌计划。
						</div>
						<div ng-show="vm.sumA<vm.target" style="color:red;font-size:17px;" class="col-md-7 alert alert-warning">
							<strong>警告！</strong>当前计划折后金额低于本季折后目标，请调整品牌计划。
						</div>
					</div>
					<div class="row">
						<div class=" col-md-12">
							<table class="table">
								<tbody>
									<tr class="plan-bottom-2">
										<td>全年销售总额/万</td>
										<td>全年平均销售折扣率</td>
										<td>全年商品吊牌价总额/万</td>
										<td>本季销售额占全年比例</td>
										<td>本季计划订货吊牌额/万</td>
									</tr>
									<tr class="plan-bottom-1">
										<td><span>{{vm.rebateChange(vm.proAllprice,vm.avgRebate)}}</span>万</td>
										<td><input style="width: 80px; color: red;" ng-change="notEnd()"
											ng-model="vm.avgRebate"></td>
										<td><span>{{vm.proAllprice=vm.zhanbiChange(vm.allprice,vm.zhanbi)}}</span>万</td>
										<td><input style="width: 70px; color: red;" ng-change="notEnd()"
											ng-model="vm.zhanbi">%</td>
										<td><span ng-bind="vm.allprice"></span>万</td>
									</tr>
									<tr class="plan-bottom-2">
										<td>本季订货目标折后金额/万</td>
										<td>本季计划订货折后金额/万</td>
										<td>实际订货折后金额/万</td>
										<td>本季订货目标达成率</td>
										<td>本季计划订货达成率</td>
									</tr>
									<tr class="plan-bottom-1">
										<td><span ng-bind="vm.target"></span></td>
										<td><span style="color: red;" ng-bind="vm.sumA"></span></td>
										<td><span ng-bind="vm.allorder"></span></td>
										<td><span style=" color: red;" ng-bind="vm.finished(vm.allorder,vm.target)"></span>%</td>
										<td><span style=" color: red;" ng-bind="vm.finished(vm.allorder,vm.sumA)"></span>%</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
			</div>
			
			<div class="row plan-center">
				<div class="plan-title table-responsive col-md-12">
					<table class="table table-bordered col-md-12">
						<thead>
							<tr class="success">
								<td class="col-md-2"  align="center" valign="middle" >本季可订品牌</td>
								<td class="col-md-2" align="center" valign="middle">品牌计划订货<br>折后金额/万</td>
								<td class="col-md-2"  align="center" valign="middle">品牌计划订货<br>金额占比</td>
								<td class="col-md-1" align="center" valign="middle">模块计划分解</td>
								<td class="col-md-1"  align="center" valign="middle">进货<br>折扣率</td>
								<td class="col-md-1" align="center" valign="middle">计划订货吊牌金额/万</td>
								<td class="col-md-1" align="center" valign="middle">实际订货折后金额/万</td>
								<td class="col-md-1" align="center" valign="middle">实际订货折后金额占比</td>
								<td class="col-md-1" align="center" valign="middle">计划订货折后金额达成率</td>
							</tr>
					</table>
				</div>
				<div class="plan-data table-responsive col-md-12">
					<table class="table  table-hover col-md-12">
						<tbody>
							<tr ng-repeat="item in vm.plist">
								<td align="center" valign="middle" class="col-md-2">{{item.attribname}}</td>
								<td class="col-md-2"><input ng-change="vm.change(item.m_dim_id)"
									type="number" min="0" ng-model="item.amt_plan"></td>
								<td class="col-md-2">{{ vm.finished(item.amt_plan,vm.sumA)
									}}%</td>
								<td class="col-md-1"><button
										ng-click="mtoggle(item.m_dim_id,item.amt_plan,item.attribname)"
										class="btn btn-block btn-success">分解</button></td>
								<td class="col-md-1">{{item.discount}}</td>
								<td class="col-md-1">{{ item.amt_list }}</td>
								<td class="col-md-1">{{item.amt}}</td>
								<td class="col-md-1">{{ vm.finished(item.amt,vm.allorder)
									}}%</td>
								<td class="col-md-1">{{ vm.finished(item.amt,item.amt_plan)
									}}%</td>
							</tr>
						</tbody>
					</table>
						<table class="plan-sum  table table-bordered col-md-12">
							<tr class="warning">
								<td class="col-md-2">合计</td>
								<td class="col-md-2" ng-bind="vm.sumA"></td>
								<td class="col-md-2"><span>100</span>%</td>
								<td class="col-md-1"></td>
								<td class="col-md-1"></td>
								<td class="col-md-1" ng-bind="vm.allprice"></td>
								<td class="col-md-1" ng-bind="vm.allorder"></td>
								<td class="col-md-1"><span>100</span>%</td>
								<td class="col-md-1"><span
									ng-bind="vm.finished(vm.allorder,vm.sumA)"></span>%</td>
							</tr>
						</table>
						<div class="plan-note col-md-12">
							<h4>操作说明</h4>
							<ol type="1" class="col-md-12">
							<li>
								上表已经列出允许本店订货的品牌范围和订货折扣。将本季订货目标折后金额分配到各品牌；分配时，建议参考本店往年历史销售数据，并结合本季商品实际情况综合考虑；将金额输入上表各品牌后的“计划折后金额”空格内，表格将会自动推算本门店总体订货结构，具体举例如下：
								<ol type="A">
									<li>例如本门店全年销售总额为100万，全年平均销售折扣率设定为0.75，全年商品吊牌价总额=全年销售总额÷全年平均销售折扣率=100万÷0.75=133.33万；</li>
									<li>例如春季销售额占全年比例为13%，春季计划进货吊牌额=全年吊牌价总额×春季销售额占全年比例=133.33万×13%=17.33万；例如夏季销售额占全年比例为30%，夏季计划进货吊牌额=全年吊牌价总额×夏季销售额占全年比例=133.33万×30%=40万；</li>
									<li>全年平均折扣率和本季销售额占全年比例需要根据本店实际情况进行修改；</li>
								</ol>
							</li>
							<li>点击表格内的“分解”按钮，将进入模块订货计划分解界面；</li>
							<li>将各品牌计划订货折后金额分解到品牌内各模块中；</li>
							<li>本表格内实际订货折后金额、实际订货折后金额占比、计划订货折后金额达成率将根据您的实际订货情况，实时发生变化；您可随时进入本表格查看计划订货完成情况；您也可以根据需要进行修改和调整；</li>
							<li>在使用过程中遇到问题，请向各区域客户主任或公司商品部咨询。</li>
						</ol>
						</div>
						
					</div>
				
			</div>
		</div>
		
		
		<!-- 分解页面 -->
		<div id="brand" ng-hide="mhide" class="container">
			<div class="row pm-top">
				<div class="col-md-12">
					<div class="row">
							<button ng-click="mback(md.sumA)" class="pm-goback btn btn-danger">保存并返回</button>
					</div>
					<div class="row">
						<div class="col-md-2">
							<p>品牌</p>
							<p><span style="font-size: 26px; color: red;" ng-bind="pname"></span></p>
						</div>
						<div class="col-md-3">
							<p>品牌计划订货折后金额</p>
							<p><span style="font-size: 26px; color: red;" ng-bind="pnum"></span>万</p>
						</div>
						<div class="col-md-3">
							<p>实际订货折后金额</p>
							<p><span style="font-size: 26px; color: red;" ng-bind="md.planOrder"></span>万</p>
						</div>
						<div class="col-md-4">
							<p>计划订货折后金额达成率</p>
							<p><span style="font-size: 26px; color: red;" ng-bind="vm.finished(md.planOrder,md.sumA)"></span>%</p>
						</div>
					</div>
				</div>
			</div>
			<div class="row plan-center">
				<div class="plan-title table-responsive col-md-12">
					<table class="table table-bordered col-md-12">
						<thead>
							<tr class="success">
								<th class="col-md-2">模块</th>
								<th class="col-md-2">模块计划订货<br>折后金额/万</th>
								<th class="col-md-1">占比</th>
								<th class="col-md-2">模块实际订货<br>折后金额/万</th>
								<th class="col-md-1">占比</th>
								<th class="col-md-2">模块计划订货<br>折后金额达成率</th>
								<th class="col-md-1">标准模块</th>
								<th class="col-md-1">订单明细</th>
							</tr>
					</table>
				</div>
				
				<div class="pm-data table-responsive col-md-12">
					<table class="table table-bordered col-md-12">
						<tbody>
							<tr ng-repeat="item in md.mlist | filter:bkey | orderBy:amtitem_plan">
								<td class="col-md-2">{{item.attribname2}}</td>
								<td class=" col-md-2"><input
									ng-change="md.change(item.dimid1)" type="number"
									ng-model="item.amtitem_plan"></td>
								<td class="col-md-1">{{ vm.finished(item.amtitem_plan,md.sumA)
									}}%</td>
								<td class="col-md-2">{{item.amt}}</td>
								<td class="col-md-1">{{ vm.finished(item.amt,md.planOrder)
									}}%</td>
								<td class="col-md-2">{{
									vm.finished(item.amt,item.amtitem_plan) }}%</td>
								<td class="col-md-1"><button  ng-click="md.gotoModule(item.attribname2)" class=" btn btn-success">模块</button></td>
								<td class="col-md-1"><button  ng-click="md.gotoEdit(item.attribname2)" class=" btn btn-success">编辑</button></td>
							</tr>
						</tbody>
					</table>
					<table class="pm-sum table table-bordered col-md-12">
						<tr class="warning">
							<td class="col-md-2">合计</td>
							<td class="col-md-2" ng-bind="md.sumA"></td>
							<th class="col-md-1">100%</th>
							<td class="col-md-2" ng-bind="md.planOrder"></td>
							<th class="col-md-1">100%</th>
							<td class="col-md-2"><span
								ng-bind="vm.finished(md.planOrder,md.sumA)"></span>%</td>
							<td class="col-md-1"></td>
							<td class="col-md-1"></td>
						</tr>
					</table>
					<div class="pm-note col-md-12">
					<h4>操作说明</h4>
						<ol type="1" class="col-md-12">
						<li>根据本店实际需求和本季商品情况综合考虑，将品牌计划订货折后金额分配到各个模块中；</li>
						<li>点击“模块”按钮，进入该模块列表界面，将显示公司预先搭建的模块供您挑选；</li>
						<li>在选中的模块内进行商品调整，并可直接根据本模块分配金额自动生成订单明细；</li>
						<li>点击“编辑”按钮，直接查看和修改该模块的订货明细清单；</li>
						<li>务必确保分解后各模块计划订货折后金额的合计等于品牌计划订货折后金额，否则点击保存时会弹出提示，请按提示说明进行下一步操作；</li>
						<li>点击左上方“保存并返回”按钮可以保存并返回品牌计划订货金额分配界面；</li>
						<li>在使用过程中遇到问题，请向各区域客户主任或公司商品部咨询。</li>
					</ol>
					</div>
				</div>
			</div>
		</div>
	</div>
</body>
</html>