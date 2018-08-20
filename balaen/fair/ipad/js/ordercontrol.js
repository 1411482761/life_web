/**

* CopyRright (c)2011: lifecycle

* Project: 公告界面 - Ipad System

* Comments:  控制公告界面

* Create Date：2012-06-25
	@version: 1.2
	@since: portal5.0
	@author: cico
*/
var orderc;
var OrderControl = Class.create();
OrderControl.prototype = {
	initialize : function() {
		this.javaData = new Object();
		this.trans = new Object();
		this.warning = false;
		this.hasprinters=false;
		this.isShowPleaseWait = false;//for semir
		this.theme="01";
		this.fairId="";
		this.templates = new Hash();
		this.whether_reach_standard="";
		this.width = jQuery(document).width();
		this.height = jQuery(document).height();
		this.isNotPad = navigator.userAgent.indexOf('iPad') == -1;
		//alert( location.search);
	},
	
	/**
	 * Description : first load main page.
	 * 
	 * @param : javaData -Object 后台传来的参数控制公告界面。

	 * @param : javaData.locale -String 当前用户应该有的语言包。

	 * @param : javaData.is_mgr -Boolean("Y"||"N") 当前用户是否为主管。
	 * 
	 * @param : javaData.can_audit -Boolean("Y"||"N") 当前用户是否可以执行审批动作。
	 * 
	 * @param : javaData.status -Number 当前公告界面的状态
	 *    javaData.status = 2 ： 反提交状态
	 *    javaData.status = 1 ： 提交状态
	 *    javaData.status = 3 ： 审核状态 这个状态被javaData.can_audit控制了。
	 * 
	 * @param : javaData.news -HTML 新闻头条。
	 * 
	 * @param : javaData.text -text 文本内容。
	 * 
	 * type : public
	 * */
	onLoad : function(sessionkey,printerlist,isMgrSub,isSumMgrSub,isShowPrint,isShowPleaseWait) {
		this.isShowPleaseWait = isShowPleaseWait;
		this.warning = false;
		this.trans = {
			id: 1,
			command: "com.agilecontrol.fair.FairCmd",
			params: {
				cmd: "LoadOrderInfo",
				sessionkey: sessionkey
			}
		};
		if(printerlist!=undefined&&printerlist!=""){
			this.hasprinters=true;
			var arr= printerlist.split(","),html="";
			for(var i=0;i<arr.length;i++){
				html+="<li onclick=orderc.selectPrinter(this);>"+arr[i]+"</li>";
			}
			jQuery("#printers").html(html);
		}else{
			this.hasprinters=false;
		}
		portalClient.sendOneRequest(this.trans, function(response){
			if(response.data[0].code != 0){//后台异常情况
				alert(response.data[0].message);
				return;
			}
			var javaData= response.data[0].result;


			orderc.javaData = javaData;
			if(javaData.theme != undefined)
				orderc.theme = javaData.theme;
			if(orderc.isNotPad && orderc.width <  768){
				jQuery("<link rel='stylesheet' href='/fair/ipad/css/"+ orderc.theme +"/order_adaptation.css?t="+new Date().getTime()+"' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
			}else{
				jQuery("<link rel='stylesheet' href='/fair/ipad/css/"+ orderc.theme +"/order.css' type='text/css?t="+new Date().getTime()+"' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
			}
			
			if (javaData.showClean == "Y") {
				jQuery("#clean").show();
			} else {
				jQuery("#clean").hide();
			}
			if(javaData.fairId != undefined)
				orderc.fairId = javaData.fairId;
			if(javaData.meta != undefined){
				if(javaData.meta.comment == "Y")
					jQuery("#evaluation").css("display","block");
				if(javaData.meta.text == "N")
					jQuery("#textarea").hide();
				if(javaData.meta.news == "N")
					jQuery("#news").hide();
			}
			jQuery("<script language='javascript' src='/fair/ipad/js/locale/locale_"+ javaData.locale +".js' charset='utf-8'></script>").appendTo(jQuery("head"));
			jQuery("#evaluation-desc").html(VIEWS_LOCALE.order.about_fair);
			jQuery("#textarea-desc").html(VIEWS_LOCALE.order.textarea_desc);
			jQuery("#news-desc").html(VIEWS_LOCALE.order.news_desc);
			jQuery("#abouts-desc").html(VIEWS_LOCALE.order.abouts_desc);
			jQuery("#getmore").html(VIEWS_LOCALE.order.getmore);
			jQuery("#changepwd").html(VIEWS_LOCALE.order.changepassword);
			jQuery("#evaluation-save").html(VIEWS_LOCALE.order.evaluation_save);
			jQuery("#promotion-desc").html(VIEWS_LOCALE.order.promotion_desc);
			jQuery("#news-val").html(javaData.news);
			jQuery("#textarea-val").html(javaData.text);

			// 蓝丝羽优惠活动下拉框
			var promotions = javaData.promotion;
			if (promotions != undefined && promotions.length > 0) {
				var promotionOpts = "<option value=-1>请选择</option>";
				for ( var i = 0; i < promotions.length; i++) {
					if (promotions[i]["ischoose"] == "true") {
						promotionOpts += "<option value='"+promotions[i]["id"]+"' selected='true'>"+promotions[i]["adecription"]+"</option>";
					} else {
						promotionOpts += "<option value='"+promotions[i]["id"]+"'>"+promotions[i]["adecription"]+"</option>";
					}
				}
				jQuery("#promotion-select").html(promotionOpts);
			}


			if(orderc.isNotPad && orderc.width <  768){
//				jQuery(".bitem:even").css("border","1px dotted red").css("left","13px").css("margin-right","");
				var bitem = jQuery(".bcol3").eq(3);
				var data_ = bitem.html();
				if(data_ == "未提交"){
					bitem.html("");
					var s = "/fair/ipad/img/02/nosubmit.png";
				}else if(data_ == "已提交"){
					bitem.html("");
					var s = "/fair/ipad/img/02/comfirm.png";
					bitem.css("background-image","url("+s+")");
				}else if(data_ == "已驳回"){
					bitem.html("");
					var s = "/fair/ipad/img/02/back.png";
					bitem.css("background-image","url("+s+")");
				}else if(data_ == "进行中"){
					bitem.html("");
					var s = "/fair/ipad/img/02/being.png";
					bitem.css("background-image","url("+s+")");
				}else if(data_ == "预览中"){
					bitem.html("");
					var s = "/fair/ipad/img/02/looking.png";
					bitem.css("background-image","url("+s+")");
				}else{
					bitem.html("");
					var s = "/fair/ipad/img/02/wait.png";
					bitem.css("background-image","url("+s+")");
				}
				bitem.css("background-image","url("+s+")").css("height","83px").css("width","115px").css("background-size","112px,106px").css("background-repeat","no-repeat").css("top","-51px");
			}
			jQuery("#processing-desc").html(VIEWS_LOCALE.order.processing);
			jQuery("#copyorder .moduledesc").html(VIEWS_LOCALE.order.moduledesc);
			jQuery("#copy .button-desc").html(VIEWS_LOCALE.order.button_desc);
			jQuery("#printerlist .moduledesc").html(VIEWS_LOCALE.order.printerlist);
			jQuery("#tocopy span").html(VIEWS_LOCALE.order.tocopy);
			jQuery("#pin-desc").html(VIEWS_LOCALE.order.pin);
			if(javaData.whether_reach_standard!=undefined){
				orderc.whether_reach_standard=javaData.whether_reach_standard;
			}
			if(undefined != javaData.pin){
				orderc.setPin(javaData.pin);
			}
			if (javaData.showClean == "Y") {
				jQuery("#button-clean").show();
				jQuery("#clean").html(VIEWS_LOCALE.order.clean);
				jQuery("#clean").show();
			} else {
				jQuery("#button-clean").hide();
				jQuery("#clean").hide();
			}
			if (javaData.showSync == "Y") {
				jQuery("#button-sync").show();
				jQuery("#sync").html(VIEWS_LOCALE.order.sync);
				jQuery("#sync").show();
			} else {
				jQuery("#button-sync").hide();
				jQuery("#sync").hide();
			}

			if(javaData.should_warn != undefined && javaData.should_warn)
				orderc.warning = true;
			if(javaData.poll_url != undefined && javaData.poll_url !=""){
				var html="<div id='poll' class='content' onclick=window.location.replace('"+javaData.poll_url+"')>"+VIEWS_LOCALE.order.poll_url+"</div>";
				jQuery(html).appendTo("body");
			}
			if(javaData.shownews != undefined && !javaData.shownews){
				jQuery("#news").hide();
			}
			if(javaData.parent_edit_self !=undefined ){
				if(javaData.parent_edit_self){
					jQuery("#summaryize").html(VIEWS_LOCALE.order.summaryize).parent().css("display","block");
				}
			}
			if(javaData.gatherqty !=undefined ){
				if(javaData.gatherqty){
					jQuery("#gather").html(VIEWS_LOCALE.order.gather).parent().css("display","block");
				}
			}
			if(javaData.show_print_button == undefined){
				javaData.show_print_button = true;
			}
			if(javaData.show_multiple_button!=undefined&&javaData.show_multiple_button){
				jQuery("#multi_copy").html(VIEWS_LOCALE.order.multi_copy).parent().css("display","block");
			}
			//361提交之前分鞋服配分别提交
			var lockpdts="";
			if(javaData.lockpdts!=undefined)lockpdts=javaData.lockpdts;
			if(javaData.is_mgr == "Y"){
				if(javaData.show_print_button!=undefined&&javaData.show_print_button){
					jQuery("#print").html(VIEWS_LOCALE.order.print).parent().css("display","block");
					if(orderc.hasprinters){
						jQuery("#printerlist").show();
					}else{
						jQuery("#printerlist").hide();
					}
					orderc.draw_Print_Template(javaData);
				}
				
				if(javaData.can_audit == "Y"){
						jQuery("#reject").html(VIEWS_LOCALE.order.reject).parent().css("display","block");
						jQuery("#approve").html(VIEWS_LOCALE.order.approve).parent().css("display","block");
				}
				
				if(lockpdts.length>0){
					var html="";
					for(var i=0;i<lockpdts.length;i++){
						html+="<div class='buttons tbutton' onclick=orderc.lockOrder('"+lockpdts[i].name+"');><div class='button-desc tbutton'>"+lockpdts[i].caption+"</div></div>";
					}
					jQuery(html).appendTo("#buttons");
					jQuery(".tbutton").show();
				}
				
				
				if(javaData.status == 2)
					jQuery("#dis_submit").html(VIEWS_LOCALE.order.dis_submit).parent().css("display","block");
				var buyers = javaData.buyers;
				if(buyers != undefined && buyers.length > 0){
					if(javaData.is_show_copy_filter){
						jQuery("#sbuyer").text(buyers[0][1]);
						jQuery("#sbuyer").val(buyers[0][0]);
						jQuery("#tbuyer").text(buyers[0][1]);
						jQuery("#tbuyer").val(buyers[0][0]);
					}else{
						var opts = "";
						for ( var i = 0; i < buyers.length; i++) {
							opts += "<option value='"+buyers[i][0]+"'>"+buyers[i][1]+"</option>";
						}
						jQuery("#tocopy select").html(opts);
						jQuery("#toclear select").html(opts);
					}
					
					jQuery("#copyorder").css("display","block");
					/*dazzle 需求：主管买手允许清空下级买手的的订单*/
					jQuery("#clearOrder").html(VIEWS_LOCALE.order.moduledesc1);
					jQuery("#clear-desc").html(VIEWS_LOCALE.order.clear_desc).parent().css("display","block");
					jQuery("#clearOrderContent").css("display","block");
					
				}

				//威可多需求，增加参数 汇总、主管均可提交，主管可提交未达标的汇总订单
				if(isSumMgrSub){
					if(javaData.status == 1){
						jQuery("#submit").html(VIEWS_LOCALE.order.submit).parent().css("display","block");
						jQuery("#promotion-select").removeAttr("disabled");
					}
					if(javaData.status == 3){
						jQuery("#submit").parent().hide();
						jQuery("#promotion-select").attr("disabled","disabled");
					}
				}

				if(isMgrSub){
					if(javaData.status == 1){
						jQuery("#submit").html(VIEWS_LOCALE.order.submit).parent().css("display","block");
						jQuery("#promotion-select").removeAttr("disabled");
					}
					if(javaData.status == 3){
						jQuery("#submit").parent().hide();
						jQuery("#promotion-select").attr("disabled","disabled");
					}
				}

				//主管 的 买手提交 没有任何按钮，控制同用 line333
				if(!isShowPrint){
					jQuery("#copyorder").hide();
				}
			}else{
				if(javaData.cancopybuyer){
					var buyers = javaData.buyers;
					if(buyers != undefined && buyers.length > 0){
						if(javaData.is_show_copy_filter){
							jQuery("#sbuyer").text(buyers[0][1]);
							jQuery("#sbuyer").val(buyers[0][0]);
							jQuery("#tbuyer").text(buyers[0][1]);
							jQuery("#tbuyer").val(buyers[0][0]);
						}else{
							var opts = "";
							for ( var i = 0; i < buyers.length; i++) {
								opts += "<option value='"+buyers[i][0]+"'>"+buyers[i][1]+"</option>";
							}
							jQuery("#tocopy select").html(opts);
							jQuery("#toclear select").html(opts);
						}
						
						jQuery("#copyorder").css("display","block");
						/*dazzle 需求：汇总买手允许清空下级买手的的订单*/
						jQuery("#clearOrder").html(VIEWS_LOCALE.order.moduledesc1);
						jQuery("#clear-desc").html(VIEWS_LOCALE.order.clear_desc).parent().css("display","block");
						jQuery("#clearOrderContent").css("display","block");
						
					}
				}
				if(javaData.status == 1){
					if(lockpdts.length>0){
						jQuery("#submit").html(VIEWS_LOCALE.order.submit).parent().css("display","block");
						jQuery("#promotion-select").removeAttr("disabled");
						var html="";
						for(var i=0;i<lockpdts.length;i++){
							html+="<div class='buttons tbutton' onclick=orderc.lockOrder('"+lockpdts[i].name+"');><div class='button-desc tbutton'>"+lockpdts[i].caption+"</div></div>";
						}
						jQuery(html).appendTo("#buttons");
						jQuery(".tbutton").show();
						jQuery("#submit").parent().hide();
						jQuery("#promotion-select").attr("disabled","disabled");
					}else{
						jQuery(".tbutton").hide();
//						if(orderc.isNotPad && orderc.width <  768){
//							jQuery("#submit").parent().css("display","block");
//						}else{
						//jQuery("#submit").html(VIEWS_LOCALE.order.submit).parent().css("display","block");
						//}
						
						if(!isMgrSub){
							jQuery("#submit").html(VIEWS_LOCALE.order.submit).parent().css("display","block");
							jQuery("#promotion-select").removeAttr("disabled");
						}
					}
					if(javaData.show_submit_button!=undefined&&!javaData.show_submit_button){
						jQuery("#submit").parent().hide();
						jQuery("#promotion-select").attr("disabled","disabled");
					}
					//361 是否显示分批
					if (javaData.showBatch == "Y") {
						jQuery("#button-batch").show();
						jQuery("#batch").html(VIEWS_LOCALE.order.batch);
						jQuery("#batch").show();
					}else {
						jQuery("#button-batch").hide();
						jQuery("#batch").hide();
					}
				}else if(javaData.status == 2){
					//bala需求 汇总买手也具有反提交权限
					if(javaData.sum_can_audit == "Y"){
						jQuery("#dis_submit").html(VIEWS_LOCALE.order.dis_submit).parent().css("display","block");
					}

					//semir 需求，普通买手提交完不能显示打印先关  参数设置false   ad_param#suggest.isShowPrint
					if(isShowPrint){
						//bala需求  反提交界面也需要有打印按钮，安全用户组控制权限配置
						jQuery("#print").html(VIEWS_LOCALE.order.print).parent().css("display","block");
						if(orderc.hasprinters){
							jQuery("#printerlist").show();
						}else{
							jQuery("#printerlist").hide();
						}
						orderc.draw_Print_Template(javaData);
					}
					
				}else if(javaData.status == 3){
					//bala需求 汇总买手也具有审核权限
					if(javaData.sum_can_audit == "Y"){
						jQuery("#reject").html(VIEWS_LOCALE.order.reject).parent().css("display","block");
						jQuery("#approve").html(VIEWS_LOCALE.order.approve).parent().css("display","block");
					}
				}
				if(!isMgrSub){
					if(javaData.status == 3){
						jQuery("#submit").parent().hide();
						jQuery("#promotion-select").attr("disabled","disabled");
					}
				}
				jQuery("#evaluation-textarea").val(javaData.overall_comments);
				if(javaData.allow_buyer_print&&javaData.show_print_button!=undefined&&javaData.show_print_button){
					if(javaData.show_print_button!=undefined&&javaData.show_print_button){
						jQuery("#print").html(VIEWS_LOCALE.order.print).parent().css("display","block");
						if(orderc.hasprinters){
							jQuery("#printerlist").show();
						}else{
							jQuery("#printerlist").hide();
						}
						orderc.draw_Print_Template(javaData);
					}
			     }
			}
			orderc._ajaxProcessing(false);
			orderc.showabouts();
		});
	},
	draw_Print_Template: function(javaData){
		var arr= javaData.print_templates;
		if(arr != undefined && arr.length>0) {
		    this.templates = new Hash();
			jQuery("#printertemplates").show();
			jQuery("#printertemplates .moduledesc").html(VIEWS_LOCALE.order.printertemplates);
			var html = "";
			var reports = "";
			for(var i=0;i<arr.length;i++){
			    if(arr[i].checked == undefined || arr[i].checked == 'Y'){
                    html+="<li class='cur' onclick='orderc.selectTemplates(this)'>"+arr[i].name+"<span>"+arr[i].type+"</span><span>"+arr[i].config+"</span><span>"+arr[i].index+"</span><span>"+reports+"</span><span>"+arr[i].iscombine+"</span></li>";
                }else{
                    html+="<li onclick='orderc.selectTemplates(this)'>"+arr[i].name+"<span>"+arr[i].type+"</span><span>"+arr[i].config+"</span><span>"+arr[i].index+"</span><span>"+reports+"</span><span>"+arr[i].iscombine+"</span></li>";
                }
                this.templates[arr[i].name] = {
                    name:arr[i].name,
                    type:arr[i].type,
                    config:arr[i].config,
                    index:arr[i].index,
                    reports:arr[i].reports,
                    iscombine:arr[i].iscombine
                };
            }
			jQuery("#templates").html(html);
			jQuery("#printerlist").css("margin-bottom","0px");
		} else {
			jQuery("#printerlist").css("margin-bottom","168px");
			jQuery("#printertemplates").hide();
		}
	},
	selectPrinter: function(dom){
		jQuery("#printers li").removeClass("printerstyle");
		jQuery(dom).addClass("printerstyle");
//		var sel = jQuery(dom).attr("id");
//		if(sel == "selectprint"){
//			jQuery(dom).attr("id","no");
//		}else{
//			jQuery(dom).attr("id","selectprint");
//		}
	},
	selectTemplates: function(dom){
	    jQuery(dom).toggleClass("cur");
	},
	_ajaxProcessing: function(show){
		if(show)
			jQuery("#processing").css("display","block");
		else
			jQuery("#processing").hide();
	},
	
	_save: function(){
		var trans = {
			id: 1,
			command: "com.agilecontrol.fair.FairCmd",
			params: {
				cmd: "saveOverallComments",
				content: jQuery("#evaluation-textarea").val()
			}
		};
		portalClient.sendOneRequest(trans, function(response){
			orderc._ajaxProcessing(false);
			alert(VIEWS_LOCALE.order.thanks);
			window.location.replace("/fair/ipad/suggest.jsp");
		});
	},
	selectBuyers : function(ele){
		var id = jQuery(ele).attr('id');
		var disp = jQuery("#" + id + "Select").css("display");
		if("block" == disp){
			jQuery("#" + id + "Topbar").css("display","none");
			jQuery("#" + id + "Select").css("display","none");
			return;
		}
		if(id == "sbuyer" && jQuery("#tbuyerSelect").css("display") == "block"){
			jQuery("#tbuyerTopbar").css("display","none");
			jQuery("#tbuyerSelect").css("display","none");
		}else if(id == "tbuyer" && jQuery("#sbuyerSelect").css("display") == "block"){
			jQuery("#sbuyerTopbar").css("display","none");
			jQuery("#sbuyerSelect").css("display","none");
		}
		var canSearch = orderc.javaData.canSearch;
		var buyers = orderc.javaData.buyers;
		if(buyers != undefined && buyers.length > 0){
			var opts = "";
			/*balabala需求 当买手数大于15时添加搜索框*/
			if(canSearch){
				var str = "<input type='text' id='"+id+"inputText' placeholder = '搜索 买手' style='border:medium none #fff;width: 215px; height: 30px; padding-right: 30px;font-size:14px'/>"+"<div class='searchIcon' id='searchIcon_"+id+"' onclick='orderc.filterBuyer(this)'></div>";
				jQuery("#tocopy > .selectContainer > #"+id+"Topbar").html(str);
			}
			opts += "";
			for(var i = 0;i < buyers.length;i++){
				opts += "<li id='"+id+"_"+buyers[i][1]+"_"+buyers[i][0]+"' onclick='orderc.chooseBuyer(this)'>"+buyers[i][1]+"</li>";
			}
			jQuery("#tocopy > .selectContainer >  .selectBuyer > ul").html(opts);
		}
		var id = jQuery(ele).attr('id');
		jQuery("#" + id + "Topbar").css("display","block");
		jQuery("#" + id + "Select").css("display","block");
	},
	filterBuyer: function(ele){
		var id = jQuery(ele).attr('id');
		var idName = id.split("_")[1];
		var value = jQuery("#" + idName + "inputText").val();
		 var html = jQuery("#"+idName+"Select > ul > li:contains("+value+")");
		 jQuery("#" + idName + "Select > ul").html(html);
	},
	chooseBuyer :function(ele){
		var id = jQuery(ele).attr('id');
		var idName = id.split("_")[0];
		var buyerName = id.split("_")[1];
		var value = id.split("_")[2];
		jQuery("#" + idName + "Topbar").css("display","none");
		jQuery("#" + idName + "Select").css("display","none");
		jQuery("#" + idName).text(buyerName);
		jQuery("#" + idName).val(value);
		
	},
	coyeOrder : function(type){
		if(type=="multiple"){
			var mutiple=prompt(VIEWS_LOCALE.order.multi_copy_alert,"");
			var re =  /^[0-9]*[1-9][0-9]*$/; 
		     if (!re.test(mutiple)){  
		        alert(VIEWS_LOCALE.order.multi_copy_alert);  
		        return ;  
		     }  
			var trans = {
					id: 1,
					command: "com.agilecontrol.fair.FairCmd",
					params:{
						cmd : "Copyfo",
						mutiple : mutiple,
						type : type
					}
			};
			portalClient.sendOneRequest(trans, function(response){
				orderc._ajaxProcessing(false);
				var javaData = response.data[0];
				alert(javaData.message);
				if(javaData.code == 0){
					window.location.href="http://reload.fair.app";
				}
			});
		}else{
			var sbuyer = "";
			var tbuyer = "";
			var text = "";
			if(orderc.javaData.is_show_copy_filter){ 
				 /*添加搜索功能*/
				sbuyer = jQuery("#sbuyer").val();
				tbuyer = jQuery("#tbuyer").val();
				text = jQuery("#tbuyer").text();
			}else{
				/*原先用select方法复制订单*/
				sbuyer = jQuery("#tocopy select:first").val();
				tbuyer = jQuery("#tocopy select:eq(1)").val();
				text= jQuery("#tocopy select:eq(1)").find("option:selected").text();
			}
			if(sbuyer == tbuyer){
				alert(VIEWS_LOCALE.order.copyalert);
			}else{
				var pwd=prompt(VIEWS_LOCALE.order.inputdesc1+text+VIEWS_LOCALE.order.inputdesc2,"");
				if(null==pwd) return;
				var data = [sbuyer,tbuyer,pwd,1];
				var trans = {
						id: 1,
						command: "com.agilecontrol.fair.FairCmd",
						params:{
							cmd : "Copyfo",
							data : data,
							type : type
						}
				};
				if(!confirm(VIEWS_LOCALE.order.iscopy)) {
					orderc._ajaxProcessing(false);
					return;
				}
				portalClient.sendOneRequest(trans, function(response){
					orderc._ajaxProcessing(false);
					var javaData = response.data[0];
					if(javaData.code == 0){
						alert(VIEWS_LOCALE.order.result);
					}else{
						alert(javaData.message);
					}
				});
			}
		}
	},
	clearOrder : function(){
		
			var pwd=prompt(VIEWS_LOCALE.order.inputdesc1+VIEWS_LOCALE.order.clearFunitName+VIEWS_LOCALE.order.inputdesc2,"");
			if(null==pwd) return;
			var clearBuyer = jQuery("#toclear select:first").val();;
			var data =  [clearBuyer,pwd];
			var trans = {
					id: 1,
					command: "com.agilecontrol.fair.FairCmd",
					params:{
						cmd : "Clearfo",
						data : data,
					}
			};
			if(!confirm(VIEWS_LOCALE.order.isclear)) {
				orderc._ajaxProcessing(false);
				return;
			}
			portalClient.sendOneRequest(trans, function(response){
				orderc._ajaxProcessing(false);
				var javaData = response.data[0];
				if(javaData.code == 0){
					alert(VIEWS_LOCALE.order.result1);
				}else{
					alert(javaData.message);
				}
			});
	},
	clean : function(clean,isSKU){
		var trans = {
				id: 1,
				command: "com.agilecontrol.fair.FairCmd",
				params: {
					cmd: "Reload",
					isSKU:isSKU
				}
			};
		portalClient.sendOneRequest(trans, function(response){
			var javaData = response.data[0];
			if(javaData.code == 0){
				if(javaData.result.sku!=undefined){
					alert("已有SKU:"+javaData.result.sku);
				} else {
					alert("完成");
				}
			}else{
				alert(javaData.message);
			}
		});
			
	},
	lockOrder : function(name){
		var trans = {
				id: 1,
				command: "com.agilecontrol.fair.FairCmd",
				params: {
					cmd: "LockOrder",
					name:name
				}
		};
		portalClient.sendOneRequest(trans, function(response){
			var javaData = response.data[0];
			if(javaData.code == 0){
				if(javaData.url != undefined)
					window.location.replace(javaData.url);
				else
					window.location.replace("/fair/ipad/suggest.jsp?t="+(new Date()).getTime());
			}else{
				alert(javaData.message);
			}
		});
		
	},
	sync : function(){
		var trans = {
				id: 1,
				command: "com.agilecontrol.fair.FairCmd",
				params: {
					cmd: "SyncSingleOrders",
					"nds.control.ejb.UserTransaction":"N"
				}
			};
		portalClient.sendOneRequest(trans, function(response){
			var javaData = response.data[0];
			if(javaData.code == 0){
				alert("完成");
			}else{
				alert(javaData.message);
			}
		});
			
	},
	batch : function(){
		var trans = {
			id: 1,
			command: "com.agilecontrol.fair.FairCmd",
			params: {
				cmd: "BatchSingleOrders",
				"nds.control.ejb.UserTransaction":"N"
			}
		};
		portalClient.sendOneRequest(trans, function(response){
			var javaData = response.data[0];
			if(javaData.code == 0){
				alert("完成");
			}else{
				alert(javaData.message);
			}
		});

	},
	autoSUM : function(){
		var trans = {
				id: 1,
				command: "com.agilecontrol.fair.FairCmd",
				params: {
					cmd: "RecalParentOrder"
				}
			};
		if(!confirm(VIEWS_LOCALE.order.isautosum)) {
			orderc._ajaxProcessing(false);
			return;
		}
		portalClient.sendOneRequest(trans, function(response){
			var javaData = response.data[0];
			if(javaData.code == 0){
				alert(VIEWS_LOCALE.order.sumresult);
				window.location.replace("http://reload.fair.app");
			}else{
				alert(javaData.message);
			}
		});
			
	},
	
	ajaxCmd : function(cmd) {
		orderc._ajaxProcessing(true);
		if(cmd == "save"){
			this._ajaxProcessing(true);
			this._save();
		}else{
			var params;
			if(cmd == "reject" || cmd == "accept"){
				if(cmd == "reject")
					if(!confirm(VIEWS_LOCALE.order.isreject)) {
						orderc._ajaxProcessing(false);
						return;
					}
				if(cmd == "accept")
					if(!confirm(VIEWS_LOCALE.order.isapprove)) {
						orderc._ajaxProcessing(false);
						return;
					}
				params = {
						cmd : "AuditFairOrder",
						action : cmd,
						comments : ""
				};
			}else{
				if(cmd=="Submit"){
					if(orderc.warning){
						if(!confirm(VIEWS_LOCALE.order.warning)) {
							orderc._ajaxProcessing(false);
							return;
						}
					}else{
						if(!confirm(VIEWS_LOCALE.order.submit_notice)) {
							orderc._ajaxProcessing(false);
							return;
						}
					}
					if(orderc.whether_reach_standard=="N"){
						if(!confirm(VIEWS_LOCALE.order.unreach_standard)) {
							orderc._ajaxProcessing(false);
							return;
						}
					}
					params = {
						cmd : cmd+"FairOrder",
						"nds.control.ejb.UserTransaction":"N" 
					};
				}else if(cmd=="Print"){
					var name="";
					if(this.hasprinters){
						name=jQuery(".printerstyle").html();
						if(null==name){
							alert(VIEWS_LOCALE.order.print_warning);
							return;
						}
					}
					var templatesElement = jQuery("ul#templates .cur");
					if(this.templates != undefined && this.templates.keys().length > 0 && templatesElement.length == 0){
						alert(VIEWS_LOCALE.order.template_warning);
						return;
					}
					if(!confirm(VIEWS_LOCALE.order.isprint)) {
						orderc._ajaxProcessing(false);
						return;
					}
					if(this.isShowPleaseWait && this.isShowPleaseWait != "false"){
						alert(VIEWS_LOCALE.order.pleasewait);
					}

                    var paramtemplates = new Array();
                    if(templatesElement.length>0){
                        for(var i = 0; i < templatesElement.length; i++){
                           paramtemplates.push(this.templates[templatesElement[i].innerText]);
                        }
                    }
					if(name!=""){
						params = {
							printer:name,
							templates:paramtemplates,
							cmd : cmd+"FairOrder",
							"nds.control.ejb.UserTransaction":"N"
						};
					}else{
						params = {
							cmd : cmd+"FairOrder",
							templates:paramtemplates,
							"nds.control.ejb.UserTransaction":"N"
						};
					}
				}else if(cmd=="Clean"){
					params = {
						cmd : cmd+"FairOrder",
						fairid : orderc.fairId
					};
				}else if(cmd=="GatherToDistribute"){
					params = {
						cmd : cmd,
						fairid : orderc.fairId
					};
				} else if (cmd == "ChangePromotion") { // 蓝丝羽优惠活动下拉框的onchange事件
					params = {
						cmd : cmd,
						promotionid : jQuery("#promotion-select").val(),
						"nds.control.ejb.UserTransaction":"N"
					};
				}else{
					if(cmd=="UnSubmit")
						if(!confirm(VIEWS_LOCALE.order.isdis_submit)) {
							orderc._ajaxProcessing(false);
							return;
						}
					params = {
						cmd : cmd+"FairOrder"
					};
				}
			}
			this._ajaxProcessing(true);
			this.trans.params = params;
			var showPin = jQuery("#pin").is("div");
			portalClient.sendOneRequest(this.trans, function(response){
				orderc._ajaxProcessing(false);
				if(response.data[0].code != 0){
					alert(response.data[0].message);
					return;
				}
				if(cmd == "Print" && showPin){
					orderc.setPin(response.data[0].result);
				}else{
					alert(response.data[0].message);
					var javaData = response.data[0].result;
					if(javaData.url != undefined)
						window.location.replace(javaData.url);
					else
						window.location.replace("/fair/ipad/suggest.jsp?t="+(new Date()).getTime());
				}
			});
		}
	},
	setPin: function(ja){
		var re_javaData = "";
		if(ja.length != 0){
			var javaData = JSON.stringify(ja);
			var sub_javaData = javaData.substring(4,javaData.length-4);
			re_javaData = sub_javaData.replace(/\\\"/g,"");
		}
		jQuery("#pin").html(re_javaData);
		orderc._ajaxProcessing(false);
	},
	adaptation: function(){
		if(orderc.isNotPad && orderc.width <  768){
			jQuery("<link rel='stylesheet' href='/fair/ipad/css/common/order_adaptation.css?t="+new Date().getTime()+"' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
			jQuery("#container").css("width",orderc.width);
			jQuery("#container").css("height",orderc.height);
			jQuery("#picture").css("width",orderc.width);
			jQuery(".buttons").css("width",orderc.width);
			
			
			jQuery("#content").css("width",orderc.width);
			jQuery("#textarea").css("width",orderc.width);
			jQuery("#changepwd").remove();
		}else{
			jQuery("<link rel='stylesheet' href='/fair/ipad/css/common/order.css?t="+new Date().getTime()+"' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
			jQuery("#abouts").remove();
			jQuery("#changepwd").remove();
		}
	},
//	changepwd: function(){
//		window.location.replace("/fair/ipad/changepassword.jsp?t="+(new Date()).getTime());
//	},
	showabouts: function(){
		this.trans = {
				id: 1,
				command: "com.agilecontrol.fair.FairCmd",
				params: {
					cmd: "GetOldMessages"
				}
			};
			portalClient.sendOneRequest(this.trans, function(response){
				var data=response.data[0].result;
				var javaData;
				if(data.notice==undefined){
					javaData = data;
				}else{
					javaData = data.notice;
				}
				orderc.drawHtml(javaData);
				if(javaData.locale!=undefined){
					jQuery("<script language='javascript' src='/fair/ipad/js/locale/locale_"+ data.locale +".js' charset='utf-8'></script>").appendTo(jQuery("head"));
				}
			});
	},
	drawHtml : function(javaData){
		var html="";
		if(javaData!=undefined&&javaData.length>0){
			var temp = javaData[0][1];
			var title = temp.substr(0,50);
			html+= "<span id='title'>"+title+"...</span>";
			
		}else{
			html="<div id='nomsg'>"+VIEWS_LOCALE.order.nomsg+"</div>";
		}
		jQuery("#abouts-val").html(html);
	},
	getmore: function(){
		window.location.replace("/fair/ipad/about.jsp?t="+(new Date()).getTime());
	},
	
	isJumpGeneralmap: function(sessionkey,printerlist,isMgrSub){
		this.trans = {
				id: 1,
				command: "com.agilecontrol.fair.FairCmd",
				params: {
					cmd: "overView",
					sessionkey: sessionkey
				}
			};
		
		portalClient.sendOneRequest(this.trans, function(response){
			var data=response.data[0].result;
			if(data.count>0){
				window.location.replace("/fair/ipad/overview.jsp?t="+(new Date()).getTime());
			}else{
				orderc.onLoad(sessionkey,printerlist,isMgrSub);
			}
		});
	}
};
OrderControl.main = function() {
	portalClient = new PortalClient();
	portalClient.init(null, null, "/servlets/binserv/Fair");
	orderc = new OrderControl();
	orderc.adaptation();
};
jQuery(document).ready(OrderControl.main);
