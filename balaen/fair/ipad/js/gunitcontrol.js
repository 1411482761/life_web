var gc;
var GunitControl = Class.create();
GunitControl.prototype = {
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
	},
	

	loadScores : function(sessionkey,pdtid) {
		this.sessionkey = sessionkey;
		this.pdtid = pdtid;
		var params = {
			cmd : "LoadMarksGunit",
			id : pdtid,
			sessionkey : sessionkey
		};
		var trans = {
			id : 1,
			command : "com.agilecontrol.fair.FairCmd",
			params : params
		};
		portalClient.sendOneRequest(trans,
						function(response) {
			                jQuery("#loading").hide();
							var data = response.data[0].result;
							console.info(data);
							if(data.theme != undefined)
								gc.theme = data.theme;
							var javaData = data.groups;
                            var historyData = data.history;
                            var classicalData = data.classical;
                            jQuery("<link rel='stylesheet' href='/fair/ipad/css/"+ gc.theme +"/main.css' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
							jQuery("<link rel='stylesheet' href='/fair/ipad/css/"+ gc.theme +"/gunit.css' type='text/css' media='screen' title='no title' charset='utf-8'>").appendTo(jQuery("head"));
							jQuery("<script language='javascript' src='/fair/ipad/js/locale/locale_"+ data.locale +".js' charset='utf-8'></script>").appendTo(jQuery("head"));
							gc._drawhasonhtml(classicalData, "classical");
                            gc._drawhasonhtml(historyData, "history");
							gc._drawhtml(javaData);
		});
	},
    _drawhasonhtml : function(data, style){
        if(data != undefined){
            jQuery("#" + style + "title").html(data.title);
            var theader = data.theader;
            var tbody = data.tbody;
            var tableheader = "";
            for(var i = 0;i < theader.length; i++){
                tableheader += "<td>" + theader[i]+ "</td>";
            }
            var tablebody = "";
            for(var i = 0;i < tbody.length; i++){
                tablebody += "<tr>";
                for(var ii = 0; ii < tbody[i].length; ii++){
                    tablebody += "<td>" + tbody[i][ii] + "</td>";
                }
                tablebody += "</tr>";
            }
            var html = "<div id='" + style + "content' class='" + style + "style'><table><tbody><tr>" + tableheader + "</tr>" + tablebody + "</tbody></table></div>";
            console.info(html);
            console.info(tbody);
            console.info(theader);
            jQuery("#" + style + "context").html(html);
            console.info("1211111111111111");
        }
    },
	_drawhtml : function(javaData){
		jQuery("#refresh").html(VIEWS_LOCALE.main.refresh);
		jQuery("#loadinglocale").html(VIEWS_LOCALE.main.loading);
		var ma = VIEWS_LOCALE.suggession;
		jQuery("#title").html(ma.title);
		if(javaData!=undefined&&javaData.length>0){
			var html1="",html2="";
			for(var i=0;i<javaData.length;i++){
				i==0?html1+="<li id='tag"+i+"' onclick='gc.subclick("+i+")' class='selected'>"+javaData[i].group+"</li>":
					html1+="<li id='tag"+i+"' onclick='gc.subclick("+i+")' >"+javaData[i].group+"</li>";
				var buyers=javaData[i].buyers;
				html2+="<div id='content"+i+"' class='contentstyle'><table><tr><td>"+ma.name+"</td><td>"+ma.score+"</td><td>"+ma.q+"</td><td>"+ma.weight+"</td></tr>";
				for(var j=0;j<buyers.length;j++){
					html2+="<tr><td>"+buyers[j].n+"</td><td>"+buyers[j].s+"</td><td>"+buyers[j].q+"</td><td>"+buyers[j].sd+"</td></tr>";
				}
				html2+="</table><div class='suminfo'>"+ma.buyer_quantity+":"+javaData[i].cnt+","+ma.rating_total+":"+javaData[i].sum+","+ma.total_quantity+":"+javaData[i].sumqty+","+ma.all_score_avg+":"+javaData[i].avg+","+ma.has_rating_avg+":"+javaData[i].avg1+"</div></div>";
			}
			jQuery("#analysis").html(html1);
			jQuery("#context").html(html2);
			jQuery("#content0").show();
		}else{
			jQuery("#nosugg").html(ma.nosugg);
		}
	},
	refresh : function(){
		jQuery("#loading").show();
		this.loadScores(this.sessionkey, this.pdtid);
	},
	subclick : function(index){
		jQuery(".contentstyle").hide();
		jQuery("#analysis li").removeClass("selected");
		jQuery("#content"+index).show();
		jQuery("#tag"+index).addClass("selected");
	}
};
GunitControl.main = function() {
	portalClient = new PortalClient();
	portalClient.init(null, null, "/servlets/binserv/Fair");
	gc = new GunitControl();
};
jQuery(document).ready(GunitControl.main);