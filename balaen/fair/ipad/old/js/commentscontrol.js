var commentsc;
var CommentsControl = Class.create();
CommentsControl.prototype = {
	/**
	 * Description : to define parameter
	 * 
	 * @type private
	 * */
	initialize : function() {
		this.sessionkey = new String();
		this.me = new String();
		this.publish = new String();
		this.pdtid = new String();
	},
	
	_init : function(){
		ajaxController.setLoadingDiv("loading");;
		//dwr.util.setEscapeHtml(false);
		/** A function to call if something fails. */
		ajaxController._errorHandler=function(message, ex) {
			if($("timeoutBox")!=null){
				$("timeoutBox").style.visibility = 'hidden';
			}
	  		while(ex!=null && ex.cause!=null) ex=ex.cause;
	  		if(ex!=null)message=ex.message;
			if (message == null || message == "") msgbox("A server error has occured. More information may be available in the console.");
	  		else msgbox(message);
			if($("list_query_form")!=null)toggleButtons($("list_query_form"),false);
		};
	},
	
	loadComments : function(sessionkey, pdtid){
		this.sessionkey = sessionkey;
		this.pdtid = pdtid;
		var params={cmd:"loadComments", id:pdtid,sessionkey:sessionkey};
		var trans={id:1, command:"com.agilecontrol.fair.FairCmd",params:params};
		portalClient.sendOneRequest(trans, function(response){
			var javaData= response.data[0].result.data;
			jQuery("<script language='javascript' src='/fair/ipad/js/locale/locale_"+ response.data[0].result.locale  +".js' charset='utf-8'></script>").appendTo(jQuery("head"));
			jQuery("#infotip").html(VIEWS_LOCALE.comment.input);
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
			}
		);
	},
	
	_showCurrent : function(current){
		function _formatter(value){
			return value>9?value:"0"+value;
		}
		return _formatter(current.getHours())+":"+_formatter(current.getMinutes());
	},
	
	save : function(){
		var textArea = jQuery("#yours");
		var comment = textArea.val();
		if(comment != ""){
			var current = new Date();
			var showCurrent = this._showCurrent(current);
			var params={cmd:"saveComment", id:commentsc.pdtid,sessionkey:commentsc.sessionkey,comment:comment};
			var trans={id:1, command:"com.agilecontrol.fair.FairCmd",params:params};
			portalClient.sendOneRequest(trans, function(response){
				var li = jQuery("<li class='list-item'><div class='user me'></div><div class='userinfo'><div class='username'>"+commentsc.me+"</div><div class='publishtime'>"
						+commentsc.publish+showCurrent+"."+"</div></div><div class='comment'><span class='commentpicture'></span><span class='textarea'><span class='words'>&quot;"+comment
						+"&quot</span></span>"+"</div><div class='filter'><hr></div></li>");
				if(jQuery(".list-item").is("div")){
					li.insertBefore(jQuery(".list-item:first"));
				}else{
					li.appendTo(jQuery("#comments"));
				}
				textArea.val("");
			});
			/* end ajax*/
			
		}
	}
};
CommentsControl.main = function(){
	portalClient = new PortalClient();
	portalClient.init(null,null,"/servlets/binserv/Fair");
	commentsc=new CommentsControl();
};
jQuery(document).ready(CommentsControl.main);