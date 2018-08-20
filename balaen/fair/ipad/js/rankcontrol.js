/**

* CopyRright (c)2012: lifecycle

* Project: iPad-rank(龙虎榜)

* Comments: 控制龙虎榜上商品的排列。

* Create Date：2012-12-21
	
	@version: 6.0 通用版
	@since: portal5.0
	@author: many
*/
var rc;
var gallery;
var RankControl = Class.create();
RankControl.prototype = {
	/**
	 * Description : 声明、部分初始化全局变量。
	 * 
	 * @type private
	 * 
	 * @param rc gallery  是rankcontrol.js的全局变量。
	 *   
	 * @param trans 是发给后台的封装对象
	 *   
	 * @param over -String 排列的顺序
	 * 
	 * */
	initialize : function() {
		this.sessionkey = new String();
		this.filterid = new Number();
		this.slides = new Object();
		this.timer = new Object();
		this.tim = new Object();
		this.t = new Number();
		this.time = new Object();
		this.over = new String();
		this.way = new String();
		this.model = "stylecolor";
		this.showgrade=0;
		this.label=new Array();
		this.autoplay=-1;
		this.autorefresh=-1;
		this.bfilterid = -1;
		this.txtdesc=new Array();
		this.txtvalue=new Array();
		this.marks="";
		this.sequence="desc";
		this.pagesize=12;
		this.hideme="N";
		this.hideall="N";
		this.hidetxt1="N";
		this.hidetxt2="N";
		this.hidetxt5="N";
		this.hidetxt3="N";
		this.hidetxt4="N";
		this.hidepages="N";
		this.showallrank=true;
		this.showamounts=new Array();
		this.sqlparams = new Object();
		this.fType = null;
		this.flag=false;
		this.flag_s=true;
		this._init();
		this.showdetail="Y";
	},
	_init : function() {
		this.sessionkey = "";
		this.filterid = "";
		this.t = 0;
		this.slides = null;
		this.timer = null;
		this.tim = null;
		this.time = null;
		this.over = "";
	},
	/**
	 * Description : rankcontrol的函数。设置当前能否查看龙虎榜.
	 * 
	 * @type public
	 * */
	set : function(sessionkey,filterid){
		
		
		
		 rc.sessionkey= sessionkey;
		 rc.filterid = filterid;
		 var params = {
			sessionkey :rc.sessionkey,
			filterid : rc.filterid,
			bfilterid:rc.bfilterid,
			cmd : "loadRankConf"
		};
		var trans = {
			id : 1,
			command : "com.agilecontrol.fair.FairCmd",
			params : params
		};
		portalClient.sendOneRequest(trans, function(response){
			var data= response.data[0].result;

		if(data.showdetail!=undefined){
			rc.showdetail = data.showdetail;
			if(rc.showdetail == "N"){
				jQuery("#product-detail").hide();
				jQuery("#product-img").hide();
			}
		}
		rc.showgrade = data.showgrade;
		if(data.label!=undefined){
			rc.label=data.label;
		}
		if(data.showamounts!=undefined){
			rc.showamounts=data.showamounts;
		}
		if(data.locale != undefined){
			jQuery("<script language='javascript' src='/fair/ipad/js/locale/locale_"+ data.locale +".js' charset='utf-8'></script>").appendTo(jQuery("head"));	
		}else{
			jQuery("<script language='javascript' src='/fair/ipad/js/locale/locale_zh_CN.js' charset='utf-8'></script>").appendTo(jQuery("head"));
		}
		rc.marks=data.marks;
		if(!rc.isnull(data.txtdesc)){
			rc.txtdesc=data.txtdesc;
		}else{
			alert(VIEWS_LOCALE.rank.descstart+" txtdesc "+VIEWS_LOCALE.rank.descend);
		}
		if(!rc.isnull(data.txtvalue)){
			rc.txtvalue=data.txtvalue;
		}
		jQuery("#active-words").html(VIEWS_LOCALE.rank.activewords);
		rc.draw_configuration(data);
			rc.load();
		});	
	},
	/**
	 * Description : rankcontrol的函数。首次载入页面，读取到sessionkey，filterid赋给全局变量。
	 * 
	 * @type private
	 * */
	load : function(){
		var pa = {
			sessionkey : rc.sessionkey,
			filterid : rc.filterid,
			bfilterid:rc.bfilterid,
		};
		rc._load(pa);
	},
	/**
	 * Description : rankcontrol的函数。组织好一系列参数，封装成一个变量。
	 * 
	 * @type private
	 * */
	_load : function(pa) {
		var storeid = -1;
		if(jQuery("#stores").html()!=""){
			storeid=jQuery("#stores select").find("option:selected").val();
		}else{
			storeid=-1;
		}
		//if(!rc.isnull(rc.getparams())){
			var params = {
					sessionkey : pa.sessionkey,
					filterid : pa.filterid,
					bfilterid:pa.bfilterid,
					storeid : storeid,
					cmd : "loadRankList",
					rank_over : rc.over,
					model : rc.model,
					sequence:rc.sequence,
					sqlparams : rc.getparams(),
					rank_by_way : rc.way
			};
			var trans = {
					id : 1,
					command : "com.agilecontrol.fair.FairCmd",
					params : params
			};
			this._onload(trans);
		//}
		
	},
	getparams : function(){
		var params=new Array();
		if(rc.way=="all"&&rc.model=="style"){
			if(!rc.isnull(this.sqlparams.all)){
				params=this.sqlparams.all;
			}else{
				alert("按款排名的全场排名的sqlparams没有配置");
			}
		}
		if(rc.way=="me"&&rc.model=="style"){
			if(!rc.isnull(this.sqlparams.me)){
				params=this.sqlparams.me;
			}else{
				alert("按款排名的按我排名的sqlparams没有配置");
			}
		}
		if(rc.way=="area"&&rc.model=="style"){
			if(!rc.isnull(this.sqlparams.area)){
				params=this.sqlparams.area;
			}else{
				alert("按款排名的区域排名的sqlparams没有配置");
			}
		}
		if(rc.way=="group"&&rc.model=="style"){
			if(!rc.isnull(this.sqlparams.group)){
				params=this.sqlparams.group;
			}else{
				alert("按款排名的区域排名的sqlparams没有配置");
			}
		}
		if(rc.way=="site"&&rc.model=="style"){
			if(!rc.isnull(this.sqlparams.site)){
				params=this.sqlparams.site;
			}else{
				alert("按款排名的场次排名的sqlparams没有配置");
			}
		}
		return params;
	},
	/**
	 * Description : rankcontrol的函数。加载程序，开始画龙虎榜界面。
	 * 
	 * @type private
	 * */
	_onload : function(trans) {
		jQuery("#loading").show();
		jQuery("#wrapper").remove();
		jQuery("#banner #time").remove();
		jQuery("#title").remove();
		var date = new Date();
		var house = date.getHours();
		var minute = date.getMinutes();
		var second= date.getSeconds();
		rc.time = house+":"+minute+":"+second;
		jQuery("<div id='wrapper'></div>").appendTo(jQuery("#content"));
		portalClient.sendOneRequest(trans,function(response){
			if(response.data[0].code==-1){
				alert(response.data[0].message);
			}
			var title = response.data[0].result.title;
			var datas = response.data[0].result.data;
			var txtdesc=rc.txtdesc;

			var a1="datas[j].n",a2="doms",a3="datas[j].qb",a4="VIEWS_LOCALE.main.money_symbol+datas[j].p",a5="datas[j].ac";//[款/色号][金额][订量][单价][区域数]
			if(rc.txtvalue!=undefined){

				if(rc.txtvalue[0]!=undefined) a1="datas[j]."+rc.txtvalue[0];
				if(rc.txtvalue[1]!=undefined) a2="txtdesc[3]+datas[j]."+rc.txtvalue[1];
				if(rc.txtvalue[2]!=undefined) a3="datas[j]."+rc.txtvalue[2];
				if(rc.txtvalue[3]!=undefined) a4="datas[j]."+rc.txtvalue[3];
				if(rc.txtvalue[4]!=undefined) a5="datas[j]."+rc.txtvalue[4];
			}
			jQuery("<div id='time'>"+VIEWS_LOCALE.rank.update+":" + rc.time + "</div>").appendTo("#banner");
			if(datas.length == 0){
				/* load over */
				jQuery("#loading").hide();
				alert(VIEWS_LOCALE.rank.result);
			}else{
				var showamounts=rc.showamounts;
				var tem=txtdesc[2].substr(0,txtdesc[2].length-1),tem1="";
			if(showamounts.length>0){
				for(var i=0;i<showamounts.length;i++){
					if(rc.way==showamounts[i]){
						//tem1=tem+"/总量："; 
					}
				}
			}
			if(datas[0].extraproperty!=undefined&&datas[0].extraproperty!=""){
				rc.pagesize=8;
			}else{
				rc.pagesize=12;
			}
			
			
			
			if(tem1=="")tem1=txtdesc[2];
			document.addEventListener('touchmove', function(e) {e.preventDefault();}, false);
			var el, i, page;
			this.slides = [];
			var divstr = "";
			var n = 0;
			if(datas.length<rc.pagesize){
				n=1;
			}else if(datas.length>=rc.pagesize && datas.length % rc.pagesize == 0){
				n=datas.length/rc.pagesize;
			}else if(datas.length>rc.pagesize && datas.length % rc.pagesize != 0){
				n=((datas.length-datas.length % rc.pagesize)/rc.pagesize)+1;
			}
			var label1="",label2="";
			if(rc.label.length>0){
				label1=rc.label[0];
				label2=rc.label[1];
				if(rc.way=="area") {
					if(rc.label.length<3)alert("配置参数label没有配置区域");
					label1=rc.label[2];
				}else if(rc.way=="group"){
					if(rc.label.length<4)alert("配置参数label没有配置销售大区");
					label1=rc.label[3];
				}else if(rc.way=="site"){
					if(rc.label.length<4)alert("配置参数label没有配置场次");
					label1=rc.label[3];
				}else label1=rc.label[0];
			}else{
				label1="";
				label2="";
			}
			for ( var k = 0; k < n; k++) {
				var divs = "";
				for ( var j = rc.pagesize * k; j < rc.pagesize * k + rc.pagesize; j++) {
					if(j==datas.length){
						break;
					}


					/*var ac5 =-1;  //增加区域数显示 for 意尔康  对未下单的 undefined 友好处理
					if(datas[j].ac == null || datas[j].ac == ""){
						ac5 = 0;
					}else{
						ac5 = datas[j].ac;
					}*/

					var doms = "";
						if(rc.showgrade==0){
							doms +=txtdesc[3]+datas[j].fb;
						}else{
							doms +="<ul>";
							var length=rc.getMarkskey(datas[j].fb);
							for(var t=0 ; t<length; t++){
								doms += "<li class='circle'></li>";
							}
							doms +="</ul>";
						}
						/*
						 * 图片中显示橱窗等信息
						 */
						var tabs = new Array();
						var tabs_String = "";
						if(datas[j].tabs != undefined && datas[j].tabs != ""&& datas[j].tabs.length > 0){
							for(var i = 0; i < datas[j].tabs.length;i++){
								tabs[i] = datas[j].tabs[i];
							}
						}
						tabs_String +="<ul class='tab_ul'>";
						for(var i=0;i < tabs.length;i++){
							tabs_String += "<li class='tabs'><img class='tab_infor' src='/fair/res/"+tabs[i]+".png'/></li>";
						}
						tabs_String +="</ul>";
					divs += "<div class='goods'><div class='top'><div class='t1'><a onclick=rc.showMessage(";
							if(rc.model=="style"){
								divs += "'"+datas[j].filterIdByStyle.substring(1,datas[j].filterIdByStyle.length-1).replace(/,/g,'+') + "'";
							}else{
								divs += datas[j].pdtid;
							}
								divs +=	")><img src='/pdt/m/"
								+ datas[j].g
								+ "'></a></div>"
								+"<div class='show_tabs'>"+tabs_String+"</div>"
								+(rc.hideall=="Y"?"<div class='t2' style='display:none;'>":"<div class='t2'>")
								+ datas[j].r
								+ "</div>"+(rc.hideme=="Y"?"<div class='t3' style='display:none;'>":"<div class='t3'>")
								+ datas[j].rb
								+ "</div>"+(rc.hideall=="Y"?"<div class='t4' style='display:none;'>":"<div class='t4'>")+label1+"</div>"+(rc.hideme=="Y"?"<div class='t5' style='display:none;'>":"<div class='t5' >")+label2+"</div>"
								+"</div><div class='bottom'><div class='up'><div class='u1'>"+(rc.hidetxt1=="Y"?"<div class='a1' style='display:none;'>":"<div class='a1' >")+txtdesc[0]
								+ eval(a1)
								+ "</div></div><div class='u2'>"+(rc.hidetxt4=="Y"?"<div class='a2' style='display:none;'>":"<div class='a2' >")
								+ eval(a2)
								+ "</div></div></div><div class='down'><div class='u3'>"+(rc.hidetxt3=="Y"?"<div class='a3' style='display:none;'>":"<div class='a3' >")+tem1
								+ eval(a3)
								+ "</div></div>"

								/*+"<div class='u3'>"+(rc.hidetxt5=="Y"?"<div class='a6' style='display:none;'>":"<div class='a6'>")+txtdesc[4]
								+ eval(ac5)
								+ "</div></div>"*///增加区域数显示 for 意尔康

								+"<div class='u3'>"+(rc.hidetxt2=="Y"?"<div class='a5' style='display:none;'>":"<div class='a5'>")+txtdesc[1]//意尔康龙虎榜不显示“单价”
								+ eval(a4)
								+ "</div></div></div></div>"+datas[j].extraproperty+"</div>";
							
				}
				divstr = "<div class='list'>" + divs + "<div id='page' class='pages'>"+VIEWS_LOCALE.rank.pagestart+(k+1)+VIEWS_LOCALE.rank.pageend+"</div></div><div id='total' class='pages'>"+VIEWS_LOCALE.rank.pagetotal+n+VIEWS_LOCALE.rank.pagetotalend+"</div>";
				this.slides[k] = {
					div : divstr,
					width : 875,
					height : 708
				};
				jQuery(".top").append(tabs_String);
					}
				/* load over */
				jQuery("#loading").hide();
				rc.t = this.slides.length * 10000;
				gallery = new SwipeView('#wrapper', {
					numberOfPages : this.slides.length
				});
				// Load initial data
				for (i = 0; i < 3; i++) {
					rc._suportedPlugin();
					page = i == 0 ? slides.length - 1 : i - 1;
					if(slides.length==1&&i==2) page=0;
					el = document.createElement('div');
					el.className = 'loading';
					el.innerHTML = slides[page].div;
					el.width = slides[page].width;
					el.height = slides[page].height;
					el.onload = function() {
						this.className = '';
					};
					gallery.masterPages[i].appendChild(el);
				}
				gallery.onFlip(function() {
					rc._suportedPlugin();
					var el, upcoming, i;
					for (i = 0; i < 3; i++) {
						upcoming = gallery.masterPages[i].dataset.upcomingPageIndex;
						if (upcoming != gallery.masterPages[i].dataset.pageIndex){
							el = gallery.masterPages[i].querySelector('div');
							el.className = 'loading';
							el.innerHTML = slides[upcoming].div;
							el.width = slides[upcoming].width;
							el.height = slides[upcoming].height;
						}
					}
				});
				gallery.onMoveOut(function() {
					rc._suportedPlugin();
					gallery.masterPages[gallery.currentMasterPage].className = 
						gallery.masterPages[gallery.currentMasterPage].className.replace(/(^|\s)swipeview-active(\s|$)/,'');
				});
				gallery.onMoveIn(function() {
					var className = gallery.masterPages[gallery.currentMasterPage].className;
					/(^|\s)swipeview-active(\s|$)/.test(className)|| (gallery.masterPages[gallery.currentMasterPage].className =
						!className ? 'swipeview-active': className + ' swipeview-active');
				});
			}	
			rc._suportedPlugin();
			});
		},
		/**
		 * Description:从后台得到配置参数，根据参数画出配置
		 * @param data
		 */
		draw_configuration : function(data){
			var ma = VIEWS_LOCALE.rank;
			jQuery("#deploy").html(ma.deploy);
			jQuery("#refresh").html(ma.refresh);
			jQuery("#search").html(ma.search);
			//jQuery("#search-word").html(ma.searchword);
			jQuery("#judgeslide .message-words").html(ma.filmslide);
			jQuery("#myself .message-words").html(ma.myself);
			jQuery("#auto-word").html(ma.auto);
			jQuery("#loadinglocale").html(ma.loadinglocale);
			jQuery("#product-detail").html(ma.jump_details);
			jQuery("#footer-left").html(VIEWS_LOCALE.main.footer_left);
			jQuery("#footer-right").html(VIEWS_LOCALE.main.footer_right);
			if(data.showbuyerfilter=='Y'){
				jQuery("#filter").show();
			}else{
				jQuery("#filter").hide();
			}
			if(!rc.isnull(data.hidepages)){
				this.hidepages=data.hidepages;
			}
			if(!rc.isnull(data.theme))
				{
				rc.theme = data.theme;
				}else{
					alert(VIEWS_LOCALE.rank.descstart+" theme "+VIEWS_LOCALE.rank.descend);
					}
			if(!rc.isnull(data.isHide)){
				if(data.isHide=="Y"){
					jQuery("#active").show();
				}else{
					jQuery("#active").hide();
				}
			}
			if(!rc.isnull(data.hideme)){
				this.hideme=data.hideme;
			}else{
				this.hideme="N";
			}
			if(!rc.isnull(data.hideall)){
				this.hideall=data.hideall;
			}else{
				this.hideall="N";
			}
			if(!rc.isnull(data.hidetxt1)){
				this.hidetxt1=data.hidetxt1;
			}else{
				this.hidtxt1="N";
			}
			if(!rc.isnull(data.hidetxt2)){
				this.hidetxt2=data.hidetxt2;
			}else{
				this.hidtxt2="N";
			}
			if(!rc.isnull(data.hidetxt5)){
				this.hidetxt5=data.hidetxt5;
			}else{
				this.hidtxt5="N";
			}
			if(!rc.isnull(data.hidetxt3)){
				this.hidetxt3=data.hidetxt3;
			}else{
				this.hidetxt3="N";
			}
			if(!rc.isnull(data.hidetxt4)){
				this.hidetxt4=data.hidetxt4;
			}else{
				this.hidtxt4="N";
			}
			if(!rc.isnull(data.autoplay)){
				this.autoplay=data.autoplay;
			}else{
				alert(VIEWS_LOCALE.rank.descstart+" autoplay "+VIEWS_LOCALE.rank.descend);
			}
			if(!rc.isnull(data.autorefresh)){
				this.autorefresh=data.autorefresh;
			}else{
				alert(VIEWS_LOCALE.rank.descstart+" autorefresh "+VIEWS_LOCALE.rank.descend);
			}
			if(data.showme=="Y")
				jQuery("#myself-message").attr("checked","checked");
			if(data.showallrank=="N")
				rc.showallrank=false;
			if(data.showslide=="Y")
				jQuery("#judgeslide-checkbox").attr("checked","checked");
			jQuery("<link rel='stylesheet' href='/fair/ipad/css/"+ rc.theme +"/rank.css' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
			var datasource=data.datasource,defaults=data.defaults,sort=data.sort,testserverinterval=data.testserverinterval,modelselect=data.modelselect,rankselect=data.rankselect;
			if(!rc.isnull(defaults)){
				
				rc.over=defaults[0];
				rc.way=defaults[1];
			}else{
				alert(VIEWS_LOCALE.rank.descstart+" defaults "+VIEWS_LOCALE.rank.descend);
			}

			//#top 选择模式
			var htmls1="";
			if(!rc.isnull(modelselect)){
			if(!rc.isnull(data.modeldesc)){
				htmls1=data.modeldesc+"：<ul id='modelselect'>";
			}else{
				htmls1="选择模式：<ul id='modelselect'>";
			}
				for(var i=0;i<modelselect.length;i++){
					var name=modelselect[i][0],desc=modelselect[i][1];
					htmls1+="<li><div id='"+name+"-radio'><input type='radio' id='"+name+"Radio' value='"+name+"' name='model'  onclick='rc._rank_Model(this)'/></div>" +
					"<div id='"+name+"-desc' onclick='rc.rankModel(this)'>"+desc+"</div></li>";
				}
				if(!rc.isnull(data.modeldefault)){
					rc.model=data.modeldefault;
				}else{
					rc.model="stylecolor";
				}
			}


			//#middle   数据来源&选择顺序  and 数据来源#2种options
			var htmls="";
			if(!rc.isnull(data.desc)){
				
				htmls=data.desc[0]+"：<ul id='datasource'>",xhtmls=data.desc[1]+"：<ul id='select-order'>";
			}else{
				alert(VIEWS_LOCALE.rank.descstart+" desc "+VIEWS_LOCALE.rank.descend);
			}
			if(!rc.isnull(datasource)){
			for(var i=0;i<datasource.length;i++){
				var name=datasource[i][0],desc=datasource[i][1];
				htmls+="<li><div id='"+name+"-radio'><input type='radio' id='"+name+"Radio' value='"+name+"' name='ranking'  onclick='rc._rank_over(this)'/></div>" +
						"<div id='"+name+"-desc' onclick='rc.rankOver(this)'>"+desc+"</div></li>";
			}
			}else{
				alert(VIEWS_LOCALE.rank.descstart+" datasource "+VIEWS_LOCALE.rank.descend);
			}

			//#down   选择顺序#4种options
			if(!rc.isnull(sort)){
				for(var i=0;i<sort.length;i++){
					if(sort[i][0]==defaults[1]){
						xhtmls+="<li><div id='"+sort[i][0]+"' class='select'><input type='radio' name='sort' value='"+sort[i][0]+"' checked='checked' onclick='rc._rank_by_way(this)'></div>";
					}else{
						xhtmls+="<li><div id='"+sort[i][0]+"' class='select'><input type='radio' name='sort' value='"+sort[i][0]+"' onclick='rc._rank_by_way(this)'></div>";
					}
					for(var j=1;j<sort[i].length;j++){
						xhtmls+="<div id='"+sort[i][0]+"-"+datasource[j-1][0]+"' onclick='rc.rank_way(this)'>"+sort[i][j]+"</div>";
					}
					xhtmls+="</li>";
				}
			}else{
				alert(VIEWS_LOCALE.rank.descstart+" sort "+VIEWS_LOCALE.rank.descend);
			}
			if(!rc.isnull(testserverinterval)){
				if(testserverinterval>0){
					setInterval("rc.testServer()",testserverinterval*1000);
				}
			}

			//bottom  排序方式，界面未见
			var bhtml="";
			if(!rc.isnull(rankselect)){
			if(!rc.isnull(data.rankdesc)){
				bhtml=data.rankdesc+"：<ul id='rankselect'>";
			}else{
				bhtml="排序方式：<ul id='rankselect'>";
			}
				for(var i=0;i<rankselect.length;i++){
					var name=rankselect[i][0],desc=rankselect[i][1];
					bhtml+="<li><div id='"+name+"-radio'><input type='radio' id='"+name+"Radio' value='"+name+"' name='rank'  onclick='rc._rank_Sequence(this)'/></div>" +
					"<div id='"+name+"-desc' onclick='rc.rankSequence(this)'>"+desc+"</div></li>";
				}
				if(!rc.isnull(data.rankdefault)){
					rc.sequence=data.rankdefault;
				}else{
					rc.sequence="asc";
				}
			}
			if(!rc.isnull(data.sqlparams)){
				rc.sqlparams=data.sqlparams;
			}else if(rc.model=="style"){
				alert("配置参数sqlparams没有配置");
			}
			htmls1+="</ul>";
			htmls+="</ul>";
			xhtmls+="</ul>";
			bhtml+="</ul>";
			jQuery("li#up").append(htmls1);
			jQuery("li#middle").append(htmls);
			jQuery("li#down").append(xhtmls);
			jQuery("li#bottom").append(bhtml);
			var title=data.title;
			jQuery("<div id='title'>"+title+"</div>").appendTo("#banner");
			if(data.stores!=undefined&&data.stores.length>0){
				var html="<select onchange='rc.refresh()'>",iterator=data.stores;
				for ( var i = 0; i < iterator.length; i++) {
					html += "<option index='"+i+"' value='"+iterator[i].id+"'>"+iterator[i].name+"</option>";
				}html+="</select>";
				jQuery(html).appendTo("#stores");
			}
		},
		/**
		 * Description : 判断是否为空
		 */
		isnull:function(tem){
			if(tem==undefined||tem=="")
				return true;
			else return false;
		},
	/**
	 * Description : to make the plugin suported for customizable.
	 * 
	 * @type private
	 * */
	_suportedPlugin : function() {
			if(rc.hidepages=="Y")jQuery(".pages").hide();
			if (jQuery("#myself-message").attr("checked") == "checked")
						jQuery(".t3").show();
			if(this.showallrank)jQuery(".t2").show();
			else jQuery(".t2").hide();
			if(rc.hideme=="Y"){
				jQuery(".t3").hide();
				jQuery(".t5").hide();
			}else{
				jQuery(".t3").show();
				jQuery(".t5").show();
			}
			if(rc.hideall=="Y"){
				jQuery(".t2").hide();
				jQuery(".t4").hide();
			}else{
				jQuery(".t2").show();
				jQuery(".t4").show();
			}
			if(rc.hidetxt1=="Y"){
				jQuery(".a1").hide();
			}else{
				jQuery(".a1").show();
			}
			if(rc.hidetxt2=="Y"){
				jQuery(".a2").hide();
			}else{
				jQuery(".a2").show();
			}
			if(rc.hidetxt3=="Y"){
				jQuery(".a3").hide();
			}else{
				jQuery(".a3").show();
			}
			if(rc.hidetxt5=="Y"){
				jQuery(".a6").hide();
			}else{
				jQuery(".a6").show();
			}
			if(rc.hidetxt4=="Y"){
				jQuery(".a5").hide();
			}else{
				jQuery(".a5").show();
			}
	},
	levelmark:function(leavel){
		var cirnum=0;
		switch (leavel) {
		case "A":
			cirnum = 5;
			break;
		case "B":
			cirnum = 4;
			break;
		case "C":
			cirnum = 3;
			break;
		case "D":
			cirnum = 2;
			break;
		case "E":
			cirnum = 1;
			break;	
		default:
			cirnum = 0;
			break;
		}
		return cirnum;
	},
	getMarkskey : function(value){
		var tem=this.marks,markskey="";
		for(var key in tem)
		{
		    if(value==tem[key])
		   {
			   markskey=key;
           }
		}
		return markskey;
	},
	getMarksvalue : function(keys){
		var tem=this.marks,marksvalue="";
		var arr=keys.split("/");
		for(var key in tem)
		{
		    if(arr[0]==key)
		   {
			   marksvalue=tem[arr[0]];
           }
		}
		if(marksvalue=="") marksvalue=keys;
		if(arr.length==2)marksvalue+="/"+arr[1];
		return marksvalue;
		},
	/**
	 * Description : 用户单击了是否用查询条件的单选框，控制是否用查询的结果来排龙虎榜
	 * 
	 * @type public
	 * */
//	search_checkBox : function(DOM) {
//		var checkbox = jQuery(DOM).prev().children("input").get(0);
//		checkbox.checked = checkbox.checked ? false : true;
//		this.searchCheck(checkbox);
//	},
//	judgeSearch : function(dom){
//		if(jQuery("#search-check input").attr("checked")=="checked"){
//				dom.filterid = rc.filterid;
//		}else{
//			dom.filterid = -1;
//		}
//	},
//	searchCheck : function(DOM){
//		if (jQuery(DOM).attr("checked") == "checked") {
//			var pa = {
//					sessionkey : rc.sessionkey,
//					filterid : rc.filterid,
//					bfilterid:rc.bfilterid
//				};
//			rc._load(pa);
//		}
//		if(jQuery(DOM).attr("checked") == undefined){
//			var pa = {
//					sessionkey : rc.sessionkey,
//					filterid : -1,
//					bfilterid:-1
//				};
//			rc._load(pa);
//		}
//	},
	/**
	 * Description : 用户单击了幻灯片，开启了幻灯片模式
	 * 
	 * @type public
	 * */
	checkBox1 : function(DOM) {
		var checkbox = jQuery(DOM).prev().children("input").get(0);
		checkbox.checked = checkbox.checked ? false : true;
		this.slider(checkbox);
	},
	slider : function(DOM){
		if (jQuery(DOM).attr("checked")) {
			jQuery("#auto").show();
		} else {
			jQuery("#auto").hide();
		}
	},
	/**
	 * Description : 每隔15秒验证服务器龙虎榜是否关闭，如果关闭，则立即关闭
	 */
	testServer : function(){
		var params = {
				cmd : "checkRankListStatus"
			};
			var trans = {
				id : 1,
				command : "com.agilecontrol.fair.FairCmd",
				params : params
			};
			portalClient.sendOneRequest(trans, function(response){
			var data= response.data[0].result;
			var ishide=data.isHide;
			if(ishide=="Y"){
				jQuery("#active").show();
			}else{
				jQuery("#active").hide();
			}
			
			});	
	},
	/**
	 * Description : 播放幻灯片
	 * 
	 * @type public
	 * */
	start : function() {
		var t=this.autoplay*60*1000;
		if(t>-1){
			this.timer = setInterval("gallery.next()", t);
		}else{
			alert("配置参数autoplay不正确");
		}
	},
	/**
	 * Description : 关闭幻灯片模式
	 * 
	 * @type public
	 * */
	stop : function() {
		clearInterval(this.timer);
	},
	/**
	 * Description : 用户单击了显示自己的单选框，可以选择开启或者关闭显示自己功能
	 * 
	 * @type public
	 * */
	checkBox2 : function(DOM) {
		var checkbox = jQuery(DOM).prev().children("input").get(0);
		checkbox.checked = checkbox.checked ? false : true;
		this.buyer(checkbox);
	},
	buyer : function(DOM) {
		if (jQuery(DOM).attr("checked") == "checked") {
			jQuery(".t3").show();
		} else {
			jQuery(".t3").hide();
		}
	},
	/**
	 * Description : 单击商品的图片，回到订货会界面
	 * 
	 * @type public
	 * */
	showMessage : function(pdtid) {
		pdtid += "";
		if(rc.flag){  /* 商品详情显示 */
			var iframe = document.createElement("iframe");   
			var curWwwPath=window.document.location.href;
			var pathName=window.document.location.pathname;
			var pos=curWwwPath.indexOf(pathName);
			var localhostPaht=curWwwPath.substring(0,pos);
			if(-1 != pdtid.indexOf("+")){
			 pdtid =  pdtid.substring(0,pdtid.indexOf("+"));
			}
			iframe.src = localhostPaht+"/fair/ipad/pdt.jsp?id="+pdtid+"&sessionkey="+rc.sessionkey; 
			iframe.style.width = "100%";
			iframe.style.height = "98%";
	        iframe.frameborder="no";
	        iframe.border=0;
	        iframe.id="iframe_01";
	        jQuery("#iframe_01").remove();
			jQuery("#iframe_div").append(iframe);
			jQuery("#iframe_div").show();
			jQuery("#iframe_div").height("100%");
			jQuery("#container").hide();
		}else{
			window.location.href = "http://pdtid.fair.app#" + pdtid;
		}
	},
	/**
	 * Description : 单击刷新按钮，把整个页面刷新一下
	 * 
	 * @type public
	 * */
	refresh : function() {
		rc.time = new Date();
		var pa = {
				sessionkey : rc.sessionkey,
				filterid : rc.filterid,
				bfilterid:rc.bfilterid
			};
		//rc.judgeSearch(pa);
		rc._load(pa);
	},
	/**
	 * Description : 单击搜索条件按钮，按搜索条件查询出商品，排龙虎榜
	 * 
	 * @type public
	 * */
	cFilter : function(DOM,type){
		this.fType = type;
		if("pdt" == type){
			window.location.replace("http://search.fair.app/#ranking");
		}else{
			window.location.replace("http://buyer.fair.app");
		}
	},
	/**
	 * Description : 打开配置信息界面，配置参数
	 * 
	 * @type public
	 * */
	openMessage : function() {
		var time = (parseInt(rc.t / 60000) + 1);
		var t1 = time + 1;
		if(this.autorefresh!=0){
			t1 =this.autorefresh;
			
		}
		var select = jQuery("#autoFresh");
		if(select.val()==null){
		select.append(jQuery("<option value='none'selected='selected'>"+VIEWS_LOCALE.rank.never+"</option>" +
				"<option value='"+ t1+ "'>"+ t1+ VIEWS_LOCALE.rank.minute+"</option>"));
		}
		if (jQuery("#judgeslide-checkbox").attr("checked")){
			this.stop();
		}
		if(!rc.isnull(rc.model)){
			jQuery("#"+rc.model+"Radio").attr("checked","checked");
			
		}else{
			jQuery("#stylecolorRadio").attr("checked","checked");
			
		}
		if(!rc.isnull(rc.sequence)){
			jQuery("#"+rc.sequence+"Radio").attr("checked","checked");
		}else{
			jQuery("#ascRadio").attr("checked","checked");
		}
		if(rc.over == "qty"){
			jQuery("#qtyRadio").attr("checked","checked");
			jQuery("#all-qty").show();
			jQuery("#me-qty").show();
			jQuery("#area-qty").show();
			jQuery("#site-qty").show();
			if(jQuery("#group-qty"))jQuery("#group-qty").show();
			jQuery("#all-fmark").hide();
			jQuery("#me-fmark").hide();
			jQuery("#area-fmark").hide();
			jQuery("#site-fmark").hide();
			if(jQuery("#group-fmark"))jQuery("#group-fmark").hide();
			jQuery("#all-amt").hide();
			jQuery("#me-amt").hide();
			jQuery("#area-amt").hide();
			jQuery("#site-amt").hide();
			if(jQuery("#group-amt"))jQuery("#group-amt").hide();
		}
		if(rc.over == "fmark"){
			jQuery("#fmarkRadio").attr("checked","checked");
			jQuery("#all-fmark").show();
			jQuery("#me-fmark").show();
			jQuery("#area-fmark").show();
			jQuery("#site-fmark").show();
			if(jQuery("#group-fmark"))jQuery("#group-fmark").show();
			jQuery("#all-qty").hide();
			jQuery("#me-qty").hide();
			jQuery("#area-qty").hide();
			jQuery("#site-qty").hide();
			if(jQuery("#group-qty"))jQuery("#group-qty").hide();
			jQuery("#all-amt").hide();
			jQuery("#me-amt").hide();
			jQuery("#area-amt").hide();
			jQuery("#site-amt").hide();
			if(jQuery("#group-amt"))jQuery("#group-amt").hide();
		}
		if(rc.over == "amt"){
			jQuery("#amtRadio").attr("checked","checked");
			jQuery("#all-amt").show();
			jQuery("#me-amt").show();
			jQuery("#area-amt").show();
			jQuery("#site-amt").show();
			if(jQuery("#group-amt"))jQuery("#group-amt").show();
			jQuery("#all-qty").hide();
			jQuery("#me-qty").hide();
			jQuery("#area-qty").hide();
			jQuery("#site-qty").hide();
			if(jQuery("#group-qty"))jQuery("#group-qty").hide();
			jQuery("#all-fmark").hide();
			jQuery("#me-fmark").hide();
			jQuery("#area-fmark").hide();
			jQuery("#site-fmark").hide();
			if(jQuery("#group-fmark"))jQuery("#group-fmark").hide();
		}
		jQuery("#alter_message").show();
		jQuery("#message").show();
	},
	
	/**
	 * Description :关闭配置信息界面
	 * 
	 * @type public
	 * */
	closeMessage : function() {
		if (jQuery("#judgeslide-checkbox").attr("checked")){
			this.start();
		}
		jQuery("#alter_message").hide();
		jQuery("#message").hide();
	},
	/**
	 * Description :单击自动刷新下拉菜单，设置自动刷新时间
	 * 
	 * @type public
	 * */
	rankRefresh : function() {
		if(jQuery("#autoFresh").val()=="none"){
			clearInterval(rc.tim);
		}else{
			var time = jQuery("#autoFresh").val();
			var sec = time * 60 * 1000;
			rc.tim = setInterval("rc.refresh()", sec);
		}
	},
	/**
	 * Description :向服务器传递不同的参数
	 * 
	 * @type private
	 * */
	_rank_way : function(params) {
		//rc.judgeSearch(params);
		var trans = {
			id : 1,
			command : "com.agilecontrol.fair.FairCmd",
			params : params
		};
		rc._onload(trans);
	},
	/**
	 * Description :单击排名方式的下拉菜单
	 * 
	 * @type public
	 * */
	rankOver : function(DOM){
		var radio = jQuery(DOM).prev().children("input").get(0);
		radio.checked = true;
		var ra = jQuery(DOM).prev().children("input");
		this._rank_over(ra);
	},
	/**
	 * Description 
	 * 
	 * @type public
	 * */
	rankModel : function(DOM){
		var radio = jQuery(DOM).prev().children("input").get(0);
		radio.checked = true;
		var ra = jQuery(DOM).prev().children("input");
		this._rank_Model(ra);
	},
	/**
	 * Description 
	 * 
	 * @type public
	 * */
	_rank_Model : function(DOM){
		rc.model = jQuery(DOM).val();
		if(rc.model == "stylecolor" && rc.showdetail == "Y"){
			 jQuery("#product-detail").show();
			 jQuery("#product-img").show();
			 rc.flag=rc.flag_s;
			
		}else{
			rc.flag_s=rc.flag;
			rc.flag= false;
			 jQuery("#product-detail").hide();
			 jQuery("#product-img").hide();
		}
			this._rank_way({
				cmd : "LoadRankList",
				sessionkey : rc.sessionkey,
				filterid : rc.filterid,
				bfilterid:rc.bfilterid,
				rank_over : rc.over,
				model : rc.model,
				sequence:rc.sequence,
				sqlparams : rc.getparams(),
				rank_by_way : rc.way
			});
	},
	/**
	 * Description 
	 * 
	 * @type public
	 * */
	rankSequence : function(DOM){
		var radio = jQuery(DOM).prev().children("input").get(0);
		radio.checked = true;
		var ra = jQuery(DOM).prev().children("input");
		this._rank_Sequence(ra);
	},
	/**
	 * Description 
	 * 
	 * @type public
	 * */
	_rank_Sequence : function(DOM){
		rc.sequence = jQuery(DOM).val();
		this._rank_way({
			cmd : "LoadRankList",
			sessionkey : rc.sessionkey,
			filterid : rc.filterid,
			bfilterid:rc.bfilterid,
			rank_over : rc.over,
			model : rc.model,
			sequence:rc.sequence,
			sqlparams : rc.getparams(),
			rank_by_way : rc.way
		});
	},
	_rank_over : function(DOM) {
		rc.over = jQuery(DOM).val();
		if(jQuery(DOM).val()=="fmark"){
			jQuery("#all-fmark").show();
			jQuery("#me-fmark").show();
			jQuery("#area-fmark").show();
			jQuery("#site-fmark").show();
			try{jQuery("#group-fmark").show();}catch(ex){}
			jQuery("#all-qty").hide();
			jQuery("#me-qty").hide();
			jQuery("#area-qty").hide();
			jQuery("#site-qty").hide();
			try{jQuery("#group-qty").hide();}catch(ex){}
			jQuery("#all-amt").hide();
			jQuery("#me-amt").hide();
			jQuery("#area-amt").hide();
			jQuery("#site-amt").hide();
			try{jQuery("#group-amt").hide();}catch(ex){}
		}else if(jQuery(DOM).val()=="qty"){
			jQuery("#all-qty").show();
			jQuery("#me-qty").show();
			jQuery("#area-qty").show();
			jQuery("#site-qty").show();
			try{jQuery("#group-qty").show();}catch(ex){}
			jQuery("#all-fmark").hide();
			jQuery("#me-fmark").hide();
			jQuery("#area-fmark").hide();
			jQuery("#site-fmark").hide();
			try{jQuery("#group-fmark").hide();}catch(ex){}
			jQuery("#all-amt").hide();
			jQuery("#me-amt").hide();
			jQuery("#area-amt").hide();
			jQuery("#site-amt").hide();
			try{jQuery("#group-amt").hide();}catch(ex){}
		}else{
			jQuery("#all-amt").show();
			jQuery("#me-amt").show();
			jQuery("#area-amt").show();
			jQuery("#site-amt").show();
			try{jQuery("#group-amt").show();}catch(ex){}
			jQuery("#all-fmark").hide();
			jQuery("#me-fmark").hide();
			jQuery("#area-fmark").hide();
			jQuery("#site-fmark").hide();
			try{jQuery("#group-fmark").hide();}catch(ex){}
			jQuery("#all-qty").hide();
			jQuery("#me-qty").hide();
			jQuery("#area-qty").hide();
			jQuery("#site-qty").hide();
			try{jQuery("#group-qty").hide();}catch(ex){}
		}
		//if(!rc.isnull(rc.getparams())){
			this._rank_way({
				cmd : "LoadRankList",
				sessionkey : rc.sessionkey,
				filterid : rc.filterid,
				bfilterid:rc.bfilterid,
				rank_over : rc.over,
				model : rc.model,
				sequence:rc.sequence,
				sqlparams : rc.getparams(),
				rank_by_way : rc.way
			});
		//}
	},
	/**
	 * Description :点击是否按我排名的下拉菜单
	 * 
	 * @type public
	 * */
	rank_way : function(DOM){
		var str=jQuery(DOM).attr("id");
		var arr=str.split("-");
		var radio = jQuery("#"+arr[0]).children("input").get(0);
		radio.checked = true;
		this._rank_by_way(radio);
	},
	rankWay : function(DOM){
		var radio = jQuery(DOM).prevAll("div").filter(".select").children("input").get(0);
		radio.checked = radio.checked ? false : true;
		var ra = jQuery(DOM).prevAll("div").filter(".select").children("input");
		this._rank_by_way(ra);
		
	},
	_rank_by_way : function(DOM) {
		rc.way=jQuery(DOM).val();
		//if(!rc.isnull(rc.getparams())){
			this._rank_way({
				cmd : "LoadRankList",
				sessionkey : rc.sessionkey,
				filterid : rc.filterid,
				bfilterid:rc.bfilterid,
				rank_over : rc.over,
				model : rc.model,
				sequence:rc.sequence,
				sqlparams : rc.getparams(),
				rank_by_way : rc.way
			});
		//}
	},
	goBack:function(){
		window.history.back();
		jQuery("#iframe_div").hide();
		jQuery("#container").show();
	},
	product_check:function(){
		jQuery("#product-img").removeClass();
		if(rc.flag){
			jQuery("#product-img").addClass("product-img-close");
		}else{
			jQuery("#product-img").addClass("product-img-open");
		}
		rc.flag=!rc.flag;
	}
};
RankControl.main = function() {
	portalClient = new PortalClient();
	portalClient.init(null, null, "/servlets/binserv/Fair");
	rc = new RankControl();
};
jQuery(document).ready(RankControl.main);
function appFilterID(filterid){
	//jQuery("#search-word").prev().children("input").get(0).checked=true;
	if("pdt" == rc.fType){
		rc.filterid = filterid;
	}else{
		rc.bfilterid = filterid;
	}
	rc.load(rc.sessionkey,rc.filterid);
	return "ok";
}

