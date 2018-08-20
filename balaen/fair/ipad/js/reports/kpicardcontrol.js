/**

* CopyRright (c)2011: lifecycle

* Project: Ordering - Board

* Comments:  to show the KPIs

* Create Date：2012-01-09
	
	@version: 1.0
	@since: portal5.0 jQuery1.7.1 prototype1.5.1.2 highCharts2.1.9 jquery-ui-1.8
	@author: cico

*/

var kcc;
var KpiCardControl = Class.create();
KpiCardControl.prototype = {
	/**
	 * Description : to define parameter
	 * 
	 * @type private
	 * */
	initialize : function() {
		this.categoryIsActived = new Hash();
		this._init();
	},
	
	_init : function(){
		this.categoryIsActived[15] = {
				name: "Amount",
				desc: "Excellent! Your amount achieves the target.",
				details:[{
					name: "SHOES",
					excellent: "35%~40%",
					good: "30%~45%",
					order: "34%",
					lamp: "y",
					rate: 0.3
				},{
					name: "BAGS",
					excellent: "25%~30%",
					good: "20%~35%",
					order: "30%",
					lamp: "g",
					rate: 0.4
				},{
					name: "SUNGLASS",
					excellent: "10%~12%",
					good: "5%~15%",
					order: "15%",
					lamp: "y",
					rate: 0.3
				}]
			};
		this.categoryIsActived[16] = {
				name: "Qty of design",
				desc: "Good. Your articles' qty achieve the target of the designers.",
				details:[{
					name: "SHOES",
					excellent: "10%~12%",
					good: "5%~15%",
					order: "15%",
					lamp: "y",
					rate: 0.2
				},{
					name: "BAGS",
					excellent: "25%~30%",
					good: "20%~35%",
					order: "30%",
					lamp: "g",
					rate: 0.4
				},{
					name: "SUNGLASS",
					excellent: "35%~40%",
					good: "30%~45%",
					order: "34%",
					lamp: "y",
					rate: 0.2
				}]
			};
		this.categoryIsActived[17] = {
				name: "Qty",
				desc: "Excellent! The actual matches the planning.",
				details:[{
					name: "SHOES",
					excellent: "25%~30%",
					good: "20%~35%",
					order: "30%",
					lamp: "g",
					rate: 0.5
				},{
					name: "BAGS",
					excellent: "10%~12%",
					good: "5%~15%",
					order: "15%",
					lamp: "y",
					rate: 0.2
				},{
					name: "SUNGLASS",
					excellent: "35%~40%",
					good: "30%~45%",
					order: "34%",
					lamp: "y",
					rate: 0.3
				}]
		};
		this.categoryIsActived[18] ={
				name: "category ratio",
				desc: "Good. This is to make sure articles in category is arranged in expected.",
				details:[{
					name: "SHOES",
					excellent: "10%~12%",
					good: "5%~15%",
					order: "15%",
					lamp: "y",
					rate: 0.2
				},{
					name: "BAGS",
					excellent: "25%~30%",
					good: "20%~35%",
					order: "30%",
					lamp: "g",
					rate: 0.4
				},{
					name: "SUNGLASS",
					excellent: "35%~40%",
					good: "30%~45%",
					order: "34%",
					lamp: "y",
					rate: 0.2
				}]
			};
		this.categoryIsActived[19] ={
				name: "Series ratio",
				desc: "You'd better think a lot.It's to force the franchisers to balance the goods.",
				details:[{
					name: "SHOES",
					excellent: "35%~40%",
					good: "30%~45%",
					order: "34%",
					lamp: "y",
					rate: 0.15
				},{
					name: "BAGS",
					excellent: "25%~30%",
					good: "20%~35%",
					order: "30%",
					lamp: "g",
					rate: 0.4
				},{
					name: "SUNGLASS",
					excellent: "10%~12%",
					good: "5%~15%",
					order: "15%",
					lamp: "y",
					rate: 0.2
				}]
		};
		this.categoryIsActived[20] ={
				name: "CKHK Stock ratio in qty",
				desc: "Good! List the stock CKHK,to redistribute the distirbution when necessary.",
				details:[{
					name: "SHOES",
					excellent: "25%~30%",
					good: "20%~35%",
					order: "30%",
					lamp: "g",
					rate: 0.4
				},{
					name: "BAGS",
					excellent: "10%~12%",
					good: "5%~15%",
					order: "15%",
					lamp: "y",
					rate: 0.2
				},{
					name: "SUNGLASS",
					excellent: "35%~40%",
					good: "30%~45%",
					order: "34%",
					lamp: "y",
					rate: 0.2
				}]
		};
		this.categoryIsActived[21] ={
				name: "CKTJ Stock ratio in qty",
				desc: "Good! to make certain that the TianJing stock ratio is rational.",
				details:[{
					name: "SHOES",
					excellent: "10%~12%",
					good: "5%~15%",
					order: "15%",
					lamp: "y",
					rate: 0.2
				},{
					name: "BAGS",
					excellent: "25%~30%",
					good: "20%~35%",
					order: "30%",
					lamp: "g",
					rate: 0.4
				},{
					name: "SUNGLASS",
					excellent: "35%~40%",
					good: "30%~45%",
					order: "34%",
					lamp: "y",
					rate: 0.2
				}]
		};
	},
	
	getActived : function(){
		jQuery("#views-loading").show();
		jQuery("#kpicard-container").show();
		jQuery("#views").show();
		setTimeout(function(){
			/*send ajax get kpi categories*/
			var data = {
				scores : 88.75,
				rank: 11,
				percentage: "2%",
				index: [{
					category : "Total",
					kpi:[{
						id : 15,
						name: "Amount",
						weight: 20,
						rate: "1.00",
						scores: 20.00,
						lamp: "g"
					},{
						id : 16,
						name: "Qty of design",
						weight: 10,
						rate: 0.8,
						scores: 8.00,
						lamp: "y"
					},{
						id : 17,
						name: "Qty",
						weight: 25,
						rate: "1.00",
						scores: 25.00,
						lamp: "g"
					}]
				},{
					category : "Product",
					kpi:[{
						id : 18,
						name: "Category rotio",
						weight: 10,
						rate: "0.80",
						scores: 8.00,
						lamp: "y"
					},{
						id : 19,
						name: "Series ratio",
						weight: 5,
						rate: "0.75",
						scores: 3.750,
						lamp: "r"
					},{
						id : 20,
						name: "CKHK Stock ratio in qty",
						weight: 5,
						rate: "0.80",
						scores: 4.00,
						lamp: "y"
					},{
						id : 21,
						name: "CKTJ Stock ratio in qty of design",
						weight: 25,
						rate: "0.80",
						scores: 20.00,
						lamp: "y"
					}]
				}]
			};
			
			jQuery("#kpiscores").html(data.scores);
			jQuery("#kpirank").html(data.rank);
			jQuery("#rankdetail").html(data.percentage);
			
			var category,kpi,tr,total=0,sum=0,tbody = jQuery("#categoriestable-body");
			tbody.children().remove();
			for ( var i = 0; i < data.index.length; i++) {
				category = data.index[i];
				kpi = category.kpi[0];
				tr = '<tr onclick="kcc.showKpi('+kpi.id+',this);"><td class="categoriestable-category" rowspan="'+category.kpi.length+'">'+category.category+'</td><td class="categoriestable-kpi">'+kpi.name+
				'</td><td class="categoriestable-weight">'+kpi.weight+'</td><td class="categoriestable-rate"><span class="lamp-'+kpi.lamp+'"></span><span class="categoriestable-actualrate">'+kpi.rate+'</span></td><td class="categoriestable-scores">'+kpi.scores+'</td></tr>';
				total += kpi.weight;
				sum += kpi.scores;
				tbody.append(jQuery(tr));
				if(category.kpi.length>1){
					for ( var j = 1; j < category.kpi.length; j++) {
						kpi = category.kpi[j];
						tr = '<tr onclick="kcc.showKpi('+kpi.id+',this);"><td class="categoriestable-kpi">'+kpi.name+'</td><td class="categoriestable-weight">'+kpi.weight+'</td><td class="categoriestable-rate"><span class="lamp-'+kpi.lamp+
						'"></span><span class="categoriestable-actualrate">'+kpi.rate+'</span></td><td class="categoriestable-scores">'+kpi.scores+'</td></tr>';
						total += kpi.weight;
						sum += kpi.scores;
						tbody.append(jQuery(tr));
					}
				}
			}
			tbody.children(":first").trigger("click");
			jQuery("#categoriestable-subtotal-weight").html(total);
			jQuery("#categoriestable-subtotal-scores").html(sum.toFixed(2));
			jQuery("#views-loading").hide();
			/*end ajax*/
		},700);
	},
	
	showKpi : function(id,DOM){
		jQuery("#views-loading").show();
		jQuery(".categoriestable-kpi").css("color","#ffffff");
		jQuery(DOM).children(".categoriestable-kpi").css("color","#31868F");
		id = parseInt(id);
		if(this.categoryIsActived[id] != undefined){
			this._showKpi(id);
		}else{
			/*send ajax*/
			var data={
				name: "category ratio",
				desc: "This is to make sure articles in category is arranged in expected ratio of each category.",
				details:[{
					name: "SHOES",
					excellent: "35%~40%",
					good: "30%~45%",
					order: "34%",
					lamp: "y",
					rate: 0.2
				},{
					name: "BAGS",
					excellent: "25%~30%",
					good: "20%~35%",
					order: "30%",
					lamp: "g",
					rate: 0.4
				},{
					name: "SUNGLASS",
					excellent: "10%~12%",
					good: "5%~15%",
					order: "15%",
					lamp: "y",
					rate: 0.2
				}]
			};
			kcc.categoryIsActived[id] = data;
			kcc._showKpi(id);
			/*end ajax*/
		}
	},
	
	_showKpi : function(id){
		jQuery("#kpitable-body tr").remove();
		var data = kcc.categoryIsActived[id];
		jQuery("#kpiname").html(data.name);
		jQuery("#kpidesctext").html(data.desc);
		var kpi,total=0,tr,tbody = jQuery("#kpitable-body");
		for ( var i = 0; i < data.details.length; i++) {
			kpi = data.details[i];
			total += kpi.rate;
			tr = '<tr onclick=kcc.toJava("'+kpi.name+'");><td class="kpitable-name"><span class="lamp-'+kpi.lamp+'"></span>'+kpi.name+'</td><td class="kpitable-excellent">'+kpi.excellent+'</td><td class="kpitable-good">'+kpi.good+
			'</td><td class="kpitable-order">'+kpi.order+'</td><td class="kpitable-rate">'+kpi.rate+'</td></tr>';
			tbody.append(tr);
		}
		jQuery("#kpitable-rate").html(total);
		jQuery("#mykpi").show(50);
		jQuery("#views-loading").hide();
	},
	
	toJava : function(name){
		//alert(name);
	},
	
	goBack : function(){
		jQuery("#views").hide();
		jQuery("#kpicard-container").hide();
	}
};
KpiCardControl.main = function(){
	kcc=new KpiCardControl();
};
jQuery(document).ready(KpiCardControl.main);
