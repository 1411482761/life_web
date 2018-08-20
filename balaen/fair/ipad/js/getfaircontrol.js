var gf;
var getFairCtrl = Class.create();

getFairCtrl.prototype = {
		initialize :function(){
			
		},
		
		load :function(userid,type){
			var params = {
					name:"getFair",
					parameter:[["userid",userid]]				
			};
			runsql.callsql(params,function(response){
				 var javaData = response.data[0].result;
				 
				 var fairs = javaData.data;
				 if(fairs==""){
					 alert('无可用订货会');
				 }
				 var html="";
				 if (type==null || type=="" || type=="null") {
					 for(var i=0;i<fairs.length;i++){
						 var url = "/fair/ipad/ranklist.jsp?fairid="+fairs[i].id;
						 html = html+ "<tr onclick='window.location.replace(\""+url+"\")'><td>"+fairs[i].description+"</td></tr>"; 
					 }
				}else{
					for(var i=0;i<fairs.length;i++){
						 var url = "/fair/ipad/caravan.jsp?fairid="+fairs[i].id;
						 html = html+ "<tr onclick='window.location.replace(\""+url+"\")'><td>"+fairs[i].description+"</td></tr>";
					 }
				}
				 jQuery('#tb').html(html);
			});
		},
		
		
		
		
		
};

getFairCtrl.main = function(){
	portalClient = new PortalClient();
	portalClient.init(null,null,"/servlets/binserv/Fair");
	gf=new getFairCtrl();
};
jQuery(document).ready(getFairCtrl.main);
