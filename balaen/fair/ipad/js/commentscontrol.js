var commentsc;
var CommentsControl = Class.create();
CommentsControl.prototype = {
	/**
	 * Description : to define parameter
	 * options feature: the author is lipeng.
	 * @type private
	 * */
	initialize : function() {
		this.sessionkey = new String();
		this.me = new String();
		this.publish = new String();
		this.pdtid = new String();
		this.options = new String();
		this.prevdiscount = 1;
		this.theme = "01";
		this.width = jQuery(document).width();
		this.height = jQuery(document).height();
		this.isNotPad = navigator.userAgent.indexOf('iPad') == -1;
		this.canShowQuickEdit = false;
	},
	loadQuickEditComment :function(sessionkey){
		this.canShowQuickEdit = true;
		jQuery("#quickEdittip").html("快捷输入语：");
		var params={
					cmd:"LoadQuickEditComments", 
					sessionkey:sessionkey
				   };
		var trans={ 
					id:1, 
					command:"com.agilecontrol.fair.FairCmd",
					params:params
				   };
		portalClient.sendOneRequest(trans, function(response){
				if(response.data[0].code != 0){
					alert(response.data[0].message);
				}else{
					var quickComments= response.data[0].result.comments;
					var opts = "";
					for ( var i = 0; i < quickComments.length; i++) {
						opts += "<option value='"+quickComments[i]+"'>"+quickComments[i]+"</option>";
					}
					jQuery("#quickEdit select").html(opts);
				}
		});
	},
	selectQuickComment : function(){
		
		var quickComment = jQuery("#quickEdit select").val();
		var textArea = jQuery("#yours");
		var comment = textArea.val();
		var str = "";
		if(comment == ""){
			str = quickComment;
		}else{
			str = comment + " " + quickComment; 
		}
		textArea.val(str);
		
	},
	loadComments : function(sessionkey, pdtid){                               
		this.sessionkey = sessionkey;
		this.pdtid = pdtid;
		var params={cmd:"loadComments", id:pdtid,sessionkey:sessionkey};
		var trans={id:1, command:"com.agilecontrol.fair.FairCmd",params:params};
		portalClient.sendOneRequest(trans, function(response){
			if(response.data[0].code != 0){
				alert(response.data[0].message);
			}else{
				var javaData= response.data[0].result.data;
				var javaTheme = response.data[0].result.theme;
				if(javaTheme != undefined)
					commentsc.theme = javaTheme;
				commentsc.options = response.data[0].result.option;
				if(commentsc.options != undefined){
					var it2,
					htmlString = "";
					it=commentsc.options;
					for ( var i = 0; i < it.length; i++) {
						htmlString += "<div id='tag-" + i + "'class='tag'><div class='tagcontainer'><div class='tagname'>"+it[i].group+":</div></div><div class='taglist'>";
						it2 = it[i].ele;
						for ( var j = 0; j < it2.length; j++) {
							htmlString += "<div class='styledesc'><input "+(it2[j].selected ? "checked='checked'" : "")+" type='checkbox' id='"+it2[j].id+"' name='"+it2[j].name+"'/><div class='tagstyle' onclick='commentsc.tag(this);'>"+it2[j].name+"</div></div>";
						}
						htmlString += "</div></div>";
					}
					jQuery("#tag-content").append(htmlString);
				};
				if(commentsc.isNotPad){
					jQuery("<link rel='stylesheet' href='/fair/ipad/css/"+ commentsc.theme +"/main_adaptation.css' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
					jQuery("<link rel='stylesheet' href='/fair/ipad/css/"+ commentsc.theme +"/comments_adaptation.css' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
				}else{
					jQuery("<link rel='stylesheet' href='/fair/ipad/css/"+ commentsc.theme +"/main.css' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
					jQuery("<link rel='stylesheet' href='/fair/ipad/css/"+ commentsc.theme +"/comments.css' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
				}
				jQuery("<script language='javascript' src='/fair/ipad/js/locale/locale_"+ response.data[0].result.locale  +".js' charset='utf-8'></script>").appendTo(jQuery("head"));
				jQuery("#infotip").html(VIEWS_LOCALE.comment.input);
				jQuery("#savebutton").html(VIEWS_LOCALE.comment.saves);
				var iterator,li_str1,li_str2,
				me = commentsc.me = VIEWS_LOCALE.comment.me,
				publish = commentsc.publish = VIEWS_LOCALE.comment.publish;
				for ( var i = 0; i < javaData.length; i++) {
					iterator = javaData[i];
					if(iterator.current == "Y"){
						li_str1 = "user me";
						li_str2 = me;
					}else{
						li_str1 = "user other";
						li_str2 = iterator.user;
					}
					jQuery("#comments").append(jQuery("<li class='list-item'><div class='"+li_str1+"'></div><div class='userinfo'><div class='username'>"+li_str2+
							"</div><div class='publishtime'>"+publish+iterator.time+"."+"</div></div><div class='comment'><span class='commentpicture'></span>" +
							"<span class='textarea'><span class='words'>&quot;"+iterator.comment+"&quot</span></span>"+"</div><div class='filter'><hr></div></li>"));
				}
				javaData= response.data[0].result.radio;
				if(javaData != undefined){
					var DOMString = "";
					var checked = javaData[javaData.length-1];
					for ( var i = 0; i < javaData.length-1; i++) {
						iterator = javaData[i];
						DOMString += "<input type='radio' name='discount'"+(iterator[0] == checked ? "checked='checked'" : "")+" value='"+iterator[0]+"'/>"
						+(10*iterator[0])+"折("+iterator[1]+"退货率)";
					}
					jQuery("#discount").html(DOMString);
					this.prevdiscount = checked;
				}
			}
		});
	},
	tag : function(DOM){
		var checkbox = jQuery(DOM).parent().children("input");
		if(checkbox.attr("checked") == undefined){
			checkbox.attr("checked","checked");
		}else{
			checkbox.attr("checked",false);
		}
	},
	_showCurrent : function(current){
		function _formatter(value){
			return value>9?value:"0"+value;
		}
		return _formatter(current.getHours())+":"+_formatter(current.getMinutes())+" "+(current.getMonth()+1)+"-"+current.getDate();
	},
	save : function(){
		var textArea = jQuery("#yours");
		var comment = textArea.val();
		var data = commentsc.options,
		current = new Date(),
		discount = jQuery("#discount input:radio[name='discount']:checked").val();
		var showCurrent = this._showCurrent(current);
		var params={cmd:"saveComment", id:commentsc.pdtid,sessionkey:commentsc.sessionkey,comment:comment,discount:discount};
		if(data != undefined){
			var taglist = new Array();
			for ( var i = 0; i < data.length; i++) {
				jQuery("#tag-"+ i +" input").each(function(index){
					var input = jQuery(this);
					if(input.attr("checked") == "checked"){
						taglist.push(input.attr("id"));
					}
				});
			}
			params.option = taglist;
		}
		var trans={id:1, command:"com.agilecontrol.fair.FairCmd",params:params};
		portalClient.sendOneRequest(trans, function(response){
			if(response.data[0].code != 0){//后台异常情况
				alert(response.data[0].message);
				jQuery("#discount input:radio").attr("checked",false);
				jQuery("#discount input:radio[value='"+commentsc.prevdiscount+"']").attr("checked","checked");
			}else{
				if("" != comment){
					var li = jQuery("<li class='list-item'><div class='user me'></div><div class='userinfo'><div class='username'>"+commentsc.me+"</div><div class='publishtime'>"
							+commentsc.publish+showCurrent+"."+"</div></div><div class='comment'><span class='commentpicture'></span><span class='textarea'><span class='words'>&quot;"+comment
							+"&quot</span></span>"+"</div><div class='filter'><hr></div></li>");
					if(jQuery(".list-item").is("li")){
						li.insertBefore(jQuery(".list-item:first"));
					}else{
						li.appendTo(jQuery("#comments"));
					}
				}
				alert(VIEWS_LOCALE.comment.message);
			}
			textArea.val("");
		});
		/* end ajax*/
	},
	adaptation: function(){
		if(commentsc.isNotPad){
			jQuery("<link rel='stylesheet' href='/fair/ipad/css/common/main_adaptation.css?t="+new Date().getTime()+"' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
			jQuery("<link rel='stylesheet' href='/fair/ipad/css/common/comments_adaptation.css?t="+new Date().getTime()+"' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
//			jQuery("#container").css("width",orderc.width);
//			jQuery("#container").css("height",orderc.height);
//			
//			jQuery("#content").css("width",orderc.width);
//			jQuery("#textarea").css("width",orderc.width);
		}else{
			if(jQuery(window).width()>540){
			  jQuery("<meta name='viewport' content='width=device-width,minimum-scale=1.0,maximum-scale=1.0,user-scalable=no'>").appendTo(jQuery("head"));
			}
			jQuery("<link rel='stylesheet' href='/fair/ipad/css/common/main.css?t="+new Date().getTime()+"' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
			jQuery("<link rel='stylesheet' href='/fair/ipad/css/common/comments.css?t="+new Date().getTime()+"' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
		}
	}
};
CommentsControl.main = function(){
	portalClient = new PortalClient();
	portalClient.init(null,null,"/servlets/binserv/Fair");
	commentsc=new CommentsControl();
	commentsc.adaptation();
};
jQuery(document).ready(CommentsControl.main);