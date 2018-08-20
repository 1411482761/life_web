var rlist;
var RlistControl = Class.create();
RlistControl.prototype = {
	/**
	 * Description : to define parameter
	 * options feature: the author is lipeng.
	 * @type private
	 * */
	initialize : function() {
		this.int=-1;
		this.userid=-1;
		this.faird=-1;
		this.ad_sql="ranklist_amt";
		this.time=0;
		this.exchange_time=0;
		this.option_exchange1=null;
		jQuery('#select_option').html('<option value ="money">金额</option><option value ="amt" selected="selected">人均</option>');
	},
	drawHtml : function(callback){
		var params={
				name:rlist.ad_sql,
				parameter:[["userid",rlist.userid],["fairid",rlist.fairid]]
		}
		runsql.callsql(params,function(reponse){
			var data= reponse.data[0].result.data;
			var html="";
			if(data.length>0){
				for(var i=0;i<data.length;i++){
					if(i<30){
						html+="<li><span class='name'>"+data[i].name+"</span><span class='amt'>"+data[i].amt+"</span></li>"
					}
				}
			}
			jQuery("ul").html(html);
			callback(true);
		});
		
	},
	load : function(userid,time,exchange_time,fairid,int){
		rlist.userid=userid;
		rlist.fairid = fairid;
		rlist.drawHtml(function(callback){
			if(callback==true && int!=rlist.int){
				rlist.time=time;
				rlist.exchange_time=exchange_time;
				//rlist.int=setInterval("rlist.refresh("+time+")",time*60000);
				rlist.int=int;
				setInterval("rlist.refresh("+time+")",time*60000);
				rlist.option_exchange1=setInterval("rlist.option_exchange()",rlist.exchange_time*60000);
				//rlist.option_exchange1=setInterval("rlist.option_exchange()",10*1000);
			}
			
		});
	},
	refresh : function(time){
		rlist.load(rlist.userid,time,rlist.exchange_time,rlist.fairid,rlist.int);
	},
	option_exchange : function(){
		var sel_val=jQuery('#select_option').val(); 
		if("money" == sel_val){
			jQuery('#select_option').html('<option value ="money">金额</option><option value ="amt" selected="selected">人均</option>');
			rlist.ad_sql="ranklist_amt";
		}else if("amt" == sel_val){
			jQuery('#select_option').html('<option value ="money" selected="selected">金额</option><option value ="amt" >人均</option>');
			rlist.ad_sql="ranklist_money";
		}
		rlist.load(rlist.userid,rlist.time,rlist.exchange_time,rlist.fairid,rlist.int);
	},
	rank_change: function(){
		var sel_val=jQuery('#select_option').val(); 
		if("money" == sel_val){
			rlist.ad_sql="ranklist_money";
		}else if("amt" == sel_val){
			rlist.ad_sql="ranklist_amt";
		}
		rlist.load(rlist.userid,rlist.time,rlist.exchange_time,rlist.fairid,rlist.int);
		
	},
	ischeck: function(){
		if(!jQuery("#change_ischeck").is(':checked')){
			window.clearInterval(rlist.option_exchange1);
		}else{
			rlist.option_exchange1=setInterval("rlist.option_exchange()",rlist.exchange_time*60000);
		}
	}
};
RlistControl.main = function(){
	portalClient = new PortalClient();
	portalClient.init(null,null,"/servlets/binserv/Fair");
	rlist=new RlistControl();
};
jQuery(document).ready(RlistControl.main);