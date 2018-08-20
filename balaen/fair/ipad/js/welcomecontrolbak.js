var wc;
var WelcomeControl = Class.create();
WelcomeControl.prototype = {
	initialize : function() {
		this.password_rule="";
		this.trans = new Object();
		this.theme="01";
	},
	
	onLoad : function(sessionkey) {
		
		this.warning = false;
		this.trans = {
			id: 1,
			command: "com.agilecontrol.fair.FairCmd",
			params: {
				cmd: "WelcomeInfo",
				sessionkey: sessionkey
			}
		};
		portalClient.sendOneRequest(this.trans, function(response){
			
			var javaData= response.data[0].result;
		    var user = javaData.user;
		    if(user.comments != "ischange"){
		    	document.getElementById("bg").style.display ="block";
		    	document.getElementById("changePwd").style.display ="block";
		    	jQuery("<script language='javascript' src='/fair/ipad/js/locale/locale_"+ javaData.locale +".js' charset='utf-8'></script>").appendTo(jQuery("head"));
		    	jQuery("#username").html("");
				jQuery("#btnpwd").remove();
				jQuery("#username").html(user.name+"&nbsp;&nbsp;"+user.truename);
				jQuery("#namedesc").html(VIEWS_LOCALE.change_password.namedesc);
				jQuery("#pwd1").html(VIEWS_LOCALE.change_password.pwd1);
				jQuery("#pwd2").html(VIEWS_LOCALE.change_password.pwd2);
				jQuery("#pwd3").html(VIEWS_LOCALE.change_password.pwd3);
				jQuery("<div  id='firstinfo' >首次登录请修改密码</div>").prependTo("#changePwd");
				jQuery("<span id='btnpwd'  onclick='wc.save()'>"+VIEWS_LOCALE.change_password.confirm+"</span>").appendTo("#changePwd");
				if(javaData.password_rule!=undefined){
					wc.password_rule = javaData.password_rule;
				}
		    }
		    
			if(javaData.theme != undefined)
				wc.theme = javaData.theme;
			jQuery("#content").html(javaData.text);
			var showManul=javaData.showManul;
			if(showManul){
				jQuery("#manual").html(VIEWS_LOCALE.welcome.manual);
				jQuery("#manual").show();
			}else{
				jQuery("#manual").hide();
			}
			jQuery("#preface").html(VIEWS_LOCALE.welcome.preface);
		});
	},
	
	save: function(){
		var oldpwd=jQuery("#oldpassword").val(),pwd1=jQuery("#password1").val(),pwd2=jQuery("#password2").val();
			if(pwd1!=""&&pwd2!=""){
				if(pwd1==pwd2){
					if(wc.checkPwd(pwd1)){
						var trans = {
								id : 1,
								command : "com.agilecontrol.fair.FairCmd",
								params : {
									cmd :"WelcomeInfo",
									type : "save",
									password:pwd1,
									oldpwd:oldpwd
								}
						};
						portalClient.sendOneRequest(trans, function(response){
							alert(response.data[0].message);
							if(response.data[0].code<0){
							}else{
								document.getElementById("bg").style.display ="none";
						    	document.getElementById("changePwd").style.display ="none";
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
		this.letter=0;
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
		if(wc.password_rule.min_len!=undefined){
			if(pwd.length<wc.password_rule.min_len){
				alert(VIEWS_LOCALE.change_password.desc3+wc.password_rule.min_len);
				return false;
			}
		}
		if(wc.password_rule.max_len!=undefined){
			if(pwd.length>wc.password_rule.max_len){
				alert(VIEWS_LOCALE.change_password.desc4+wc.password_rule.max_len);
				return false;
			}
		}
		this.checkLetter(pwd);
		if(wc.password_rule.figures!=undefined){
			operation = wc.password_rule.figures.operation;
			if(!eval(operation.replace("length",this.n ))){
				if(wc.password_rule.figures.desc!=undefined&&""!=wc.password_rule.figures.desc){
					alert(wc.password_rule.figures.desc);
					return false;
				}else{
					alert("figures desc 没有配置");
					return false;
				}
			}
		}
		if(wc.password_rule.letter!=undefined){
			operation = wc.password_rule.letter.operation;
			if(!eval(operation.replace("length",this.letter ))){
				if(wc.password_rule.letter.desc!=undefined&&""!=wc.password_rule.letter.desc){
					alert(wc.password_rule.letter.desc);
					return false;
				}else{
					alert("letter desc 没有配置");
					return false;
				}
			}
		}
		if(wc.password_rule.lowercase!=undefined){
			operation = wc.password_rule.lowercase.operation;
			if(!eval(operation.replace("length",this.l))){
				if(wc.password_rule.lowercase.desc!=undefined&&""!=wc.password_rule.lowercase.desc){
					alert(wc.password_rule.lowercase.desc);
					return false;
				}else{
					alert("lowercase desc "+VIEWS_LOCALE.change_password.desc5);
					return false;
				}
			}
		}
		if(wc.password_rule.uppercase!=undefined){
			operation = wc.password_rule.uppercase.operation;
			if(!eval(operation.replace("length",this.u))){
				if(wc.password_rule.uppercase.desc!=undefined&&""!=wc.password_rule.uppercase.desc){
					alert(wc.password_rule.uppercase.desc);
					return false;
				}else{
					alert("uppercase desc "+VIEWS_LOCALE.change_password.desc5);
					return false;
				}
			}
		}
		if(wc.password_rule.symbol!=undefined){
			operation = wc.password_rule.symbol.operation;
			if(!eval(operation.replace("length",this.s))){
				if(wc.password_rule.symbol.desc!=undefined&&""!=wc.password_rule.symbol.desc){
					alert(wc.password_rule.symbol.desc);
					return false;
				}else{
					alert("symbol desc "+VIEWS_LOCALE.change_password.desc5);
					return false;
				}
			}
		}
		return true;
	}
	
};
WelcomeControl.main = function() {
	portalClient = new PortalClient();
	portalClient.init(null, null, "/servlets/binserv/Fair");
	wc = new WelcomeControl();
};
jQuery(document).ready(WelcomeControl.main);
