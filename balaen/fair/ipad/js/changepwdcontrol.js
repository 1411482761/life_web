var cc;
var ChangepwdControl= Class.create();
ChangepwdControl.prototype = {
	/**
	 * Description : 申明、部分初始化全局变量。
	 * 
	 * @type private
	 * 
	 * */
		initialize : function() {
			this.password_rule="";
			this.n=0;
			this.l=0;
			this.u=0;
			this.s=0;
			this.letter=0;
			this.shownum="N";
			this.width = jQuery(document).width();
			this.height = jQuery(document).height();
			this.isNotPad = navigator.userAgent.indexOf('iPad') == -1;
			this.isAllowChangePwdPhone=true;
		},
		load : function(isAllowChangePwdPhone,showSubmit){
			this.isAllowChangePwdPhone=isAllowChangePwdPhone;
			var trans = {
					id : 1,
					command : "com.agilecontrol.fair.FairCmd",
					params : {
						cmd :"ChangePassword",
						type :"load"
					}
			};
			portalClient.sendOneRequest(trans, function(response){
				var javaData= response.data[0].result;
				var user = javaData.user;
				jQuery("<script language='javascript' src='/fair/ipad/js/locale/locale_"+ javaData.locale +".js' charset='utf-8'></script>").appendTo(jQuery("head"));
				jQuery("#username").html("");
				jQuery("#btnpwd").remove();
				var password="";
				if(user.showphone!=undefined&&user.showphone=="Y"){
					jQuery(".name").hide();
					jQuery(".phone").show();
					cc.shownum="Y";
					jQuery("#num").html(VIEWS_LOCALE.change_password.num);
				}else if(isAllowChangePwdPhone){
					jQuery("#username").html(user.name+"&nbsp;&nbsp;"+user.truename);
					jQuery(".phone").show();
					jQuery("#phonenum").val(user.phonenum);
					cc.shownum="Y";
					jQuery("#num").html(VIEWS_LOCALE.change_password.num);
				}else{
					jQuery("#username").html(user.name+"&nbsp;&nbsp;"+user.truename);
					jQuery(".phone").show();
					jQuery("#phonenum").val(user.phonenum);
					password=user.password;
				}
				jQuery("#namedesc").html(VIEWS_LOCALE.change_password.namedesc);
				jQuery("#pwd1").html(VIEWS_LOCALE.change_password.pwd1);
				jQuery("#pwd2").html(VIEWS_LOCALE.change_password.pwd2);
				jQuery("#pwd3").html(VIEWS_LOCALE.change_password.pwd3);
				jQuery("<div  id='btnpwd'  onclick=cc.save('"+password+"') >"+VIEWS_LOCALE.change_password.confirm+"</div>").appendTo("#container");
				if(showSubmit){
					jQuery("<div><br/></div>").appendTo("#container");
					jQuery("<div  id='btnsubmit'  onclick=cc.submit() >"+VIEWS_LOCALE.change_password.submit+"</div>").appendTo("#container");
				}
				if(javaData.password_rule!=undefined){
					cc.password_rule = javaData.password_rule;
				}
			});
		},
		submit : function(){
			var trans = {
				command : "com.agilecontrol.fair.FairCmd",
				params : {
					cmd :"SubmitFairOrder",
					"nds.control.ejb.UserTransaction":"N"
				}
			};
			portalClient.sendOneRequest(trans, function(response){
				alert(response.data[0].message);
			});
		},

		save : function(passWord){
			var phone=jQuery("#phonenum").val();
			 var reg = /^(1[3-9])\d{9}$/;
			 if(cc.isAllowChangePwdPhone){
				 if(phone!=""){
					 if (!reg.test(phone)) {
						 alert(VIEWS_LOCALE.change_password.desc8);
						 return;
					 }
				 }else{
					 alert(VIEWS_LOCALE.change_password.desc7);
					 return;
				 }
			 }
			var oldpwd=jQuery("#oldpassword").val(),pwd1=jQuery("#password1").val(),pwd2=jQuery("#password2").val();
			 /*   if(passWord!=oldpwd && cc.shownum!="Y"){
			    	alert(VIEWS_LOCALE.change_password.desc6);
					return;
			    }*/
				if(pwd1==oldpwd){
			    	alert(VIEWS_LOCALE.change_password.desc9);
					return;
			    }
				if(pwd1!=""&&pwd2!=""){
					if(pwd1==pwd2){
						if(cc.checkPwd(pwd1)){
							var trans = {
									id : 1,
									command : "com.agilecontrol.fair.FairCmd",
									params : {
										cmd :"ChangePassword",
										type : "save",
										password:pwd1,
										oldpwd:oldpwd,
										phonenum:phone
									}
							};
							portalClient.sendOneRequest(trans, function(response){
								alert(response.data[0].message);
								if(response.data[0].code<0){
								}else{
									jQuery("input").val("");
									cc.load(cc.isAllowChangePwdPhone);
								}
							});
						}else{
							return;
						}
					}else{
						alert(VIEWS_LOCALE.change_password.desc1);
						return;
					}
				}else{
					alert(VIEWS_LOCALE.change_password.desc2);
					return;
				}
		},
		checkLetter : function(str){
			this.n=0;
			this.l=0;
			this.u=0;
			this.s=0;
			for(var i=0;i<str.length;i++){
				var c=str.charAt(i);
				if((c > '0' || c == '0') && c < '9' ){
					this.n +=1;
				}else if((c>'A' || c=='A') && c<'Z'){
					this.u +=1;
					this.letter +=1;
				}else if((c>'a' || c == 'a') && c<'z'){
					this.l +=1;
					this.letter +=1;
				}else{
					this.s +=1;
				}
					
			}
		},
		checkPwd : function(pwd){
			if(this.shownum=="Y"&&jQuery("#phonenum").val()==""){
				alert(VIEWS_LOCALE.change_password.desc7);
				return false;
			}
			if(cc.password_rule.min_len!=undefined){
				if(pwd.length<cc.password_rule.min_len){
					alert(VIEWS_LOCALE.change_password.desc3+cc.password_rule.min_len);
					return false;
				}
			}
			if(cc.password_rule.max_len!=undefined){
				if(pwd.length>cc.password_rule.max_len){
					alert(VIEWS_LOCALE.change_password.desc4+cc.password_rule.max_len);
					return false;
				}
			}
			this.checkLetter(pwd);
			if(cc.password_rule.figures!=undefined){
				operation = cc.password_rule.figures.operation;
				if(!eval(operation.replace("length",this.n ))){
					if(cc.password_rule.figures.desc!=undefined&&""!=cc.password_rule.figures.desc){
						alert(cc.password_rule.figures.desc);
						return false;
					}else{
						alert("figures desc 没有配置");
						return false;
					}
				}
			}
			if(cc.password_rule.letter!=undefined){
				operation = cc.password_rule.letter.operation;
				if(!eval(operation.replace("length",this.letter ))){
					if(cc.password_rule.letter.desc!=undefined&&""!=cc.password_rule.letter.desc){
						alert(cc.password_rule.letter.desc);
						return false;
					}else{
						alert("letter desc 没有配置");
						return false;
					}
				}
			}
			if(cc.password_rule.lowercase!=undefined){
				operation = cc.password_rule.lowercase.operation;
				if(!eval(operation.replace("length",this.l))){
					if(cc.password_rule.lowercase.desc!=undefined&&""!=cc.password_rule.lowercase.desc){
						alert(cc.password_rule.lowercase.desc);
						return false;
					}else{
						alert("lowercase desc "+VIEWS_LOCALE.change_password.desc5);
						return false;
					}
				}
			}
			if(cc.password_rule.uppercase!=undefined){
				operation = cc.password_rule.uppercase.operation;
				if(!eval(operation.replace("length",this.u))){
					if(cc.password_rule.uppercase.desc!=undefined&&""!=cc.password_rule.uppercase.desc){
						alert(cc.password_rule.uppercase.desc);
						return false;
					}else{
						alert("uppercase desc "+VIEWS_LOCALE.change_password.desc5);
						return false;
					}
				}
			}
			if(cc.password_rule.symbol!=undefined){
				operation = cc.password_rule.symbol.operation;
				if(!eval(operation.replace("length",this.s))){
					if(cc.password_rule.symbol.desc!=undefined&&""!=cc.password_rule.symbol.desc){
						alert(cc.password_rule.symbol.desc);
						return false;
					}else{
						alert("symbol desc "+VIEWS_LOCALE.change_password.desc5);
						return false;
					}
				}
			}
			return true;
		},
		adaptation: function(){
			if(cc.isNotPad && cc.width <  768){
				jQuery("<link rel='stylesheet' href='/fair/ipad/css/common/changepassword_adaptation.css?t="+new Date().getTime()+"' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
				jQuery("html").css("width",cc.width);
				jQuery("body").css("width",cc.width);
				jQuery("#container").css("width",cc.width);
				jQuery("table").css("width",cc.width);
				jQuery("#back").show();
			}else{
				jQuery("<link rel='stylesheet' href='/fair/ipad/css/common/changepassword.css?t="+new Date().getTime()+"' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
				jQuery("#back").hide();
			}
		},
};
ChangepwdControl.main = function() {
	portalClient = new PortalClient();
	portalClient.setLoadingDiv("loadingZone");
	portalClient.init(null,null,"/servlets/binserv/Request");
	cc = new ChangepwdControl();
	cc.adaptation();
};
jQuery(document).ready(ChangepwdControl.main);