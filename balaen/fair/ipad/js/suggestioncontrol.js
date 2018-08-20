var suggestionc;
var SuggestionControl = Class.create();
SuggestionControl.prototype = {
	/**
	 * Description : to define parameter
	 * 
	 * @type private
	 */
	initialize : function() {
		
		this.sessionkey = new String();
		this.me = new String();
		this.publish = new String();
		this.pdtid = new String();
		this.theme = "01";
		jQuery("input").bind("change",function(){suggestionc._toggle(jQuery("#"+this.value));});
	},
	
	_toggle : function(div){
		if(div.css("display") == "none")
			div.animate({
			    opacity: 1,
			    height: 'toggle'
			  }, 500);
		else
			div.animate({
			    opacity: 0.25,
			    height: 'toggle'
			  }, 500);
	},
	
	toggle: function(DOM) {
		var input = jQuery(DOM).prev();
		input.attr("checked",input.attr("checked") == "checked"?false:"checked");
		this._toggle(jQuery("#"+input.val()));
	},

	loadScores : function(sessionkey, pdtid) {
		this.sessionkey = sessionkey;
		this.pdtid = pdtid;
		var params = {
			cmd : "loadMarks",
			id : pdtid,
			sessionkey : sessionkey
		};
		var trans = {
			id : 1,
			command : "com.agilecontrol.fair.FairCmd",
			params : params
		};
		portalClient
				.sendOneRequest(
						trans,
						function(response) {
							var javaData = response.data[0].result;
							jQuery(
									"<script language='javascript' src='/fair/ipad/js/locale/locale_"
											+ javaData.locale
											+ ".js' charset='utf-8'></script>")
									.appendTo(jQuery("head"));
							
							if(javaData.theme != undefined)
								suggestionc.theme = javaData.theme;
							jQuery("<link rel='stylesheet' href='/fair/ipad/css/common/pdt_suggestion.css' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
							jQuery("<link rel='stylesheet' href='/fair/ipad/css/"+ suggestionc.theme +"/main.css' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
							jQuery("<link rel='stylesheet' href='/fair/ipad/css/"+ suggestionc.theme +"/pdt_suggestion.css' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
							jQuery("#nosugg-locale").html(
									VIEWS_LOCALE.suggession.noMessege);
							if (javaData.isReady != "Y")
								jQuery("#nosugg").show();
							else {
								var li, barLength,
								iterator = javaData.data,
								ul = jQuery("#group"),
								max = javaData.highestScore;
								var unscore=new Array();
								if(javaData.unscore!=undefined){
									unscore=javaData.unscore;
								}
								if(unscore.length>0){
									var htmls="未评分的有(共"+unscore.length+"个)：";
									for(var i=0;i<unscore.length;i++){
										htmls+=unscore[i]+",";
									}
									jQuery("#unscore").html(htmls.substring(0,htmls.length-1));
								}
								for ( var i = 0; i < iterator.length; i++) {
									barLength = iterator[i].score / max * 160;
									li = "<div class='group-item'><div class='user other'></div><div class='name'>"
											+ iterator[i].user
											+ "</div><div class='score'>"
											+ iterator[i].scoreDesc
											+ "</div><div class='bar' style='width:"
											+ barLength
											+ "px;'></div><div class='filter'><hr></div></div>";
									ul.append(li);
								}
								iterator = javaData.reference;
								if(iterator.length != 0){
									ul = jQuery("#reference");
									if(iterator[0].text == undefined)
										for ( var i = 0; i < iterator.length; i++) {
											li = "<div class='reference-item'><div class='name'>"+ iterator[i].name +
											"</div><div class='score'>"+ iterator[i].score +"</div></div>";
											ul.append(li);
										}
									else{
										for ( var i = 0; i < iterator.length; i++) {
											li = "<div class='reference-item'><div class='name'>"+ iterator[i].name +
											"</div><div class='score'>"+ iterator[i].score +"</div><div class='text'>"+iterator[i].text+"</div></div>";
											ul.append(li);
										}
										jQuery(".score").css("bottom","24px");
									}
								}
								jQuery(".group-item:eq("+ javaData.currentIndex+ ") div:first").attr("class","user me").next().html(VIEWS_LOCALE.suggession.me);
								jQuery("#group-title span").html(VIEWS_LOCALE.suggession.group);
								jQuery("#reference-title span").html(VIEWS_LOCALE.suggession.reference);
							}
							var items=javaData.showitems;
							for(var i=0;i<items.length;i++){
								jQuery("#"+items[i]+"-title").show();
								jQuery("#"+items[i]).show();
							}
							if(jQuery("#group-title").css("display")=="none"){
								jQuery("#reference-title").css("left","20px");
							}
						});
	}
};
SuggestionControl.main = function() {
	portalClient = new PortalClient();
	portalClient.init(null, null, "/servlets/binserv/Fair");
	suggestionc = new SuggestionControl();
};
jQuery(document).ready(SuggestionControl.main);