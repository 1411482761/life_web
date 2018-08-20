var pdtinfoc;

var PdtInfoControl = Class.create();
PdtInfoControl.prototype = {
	initialize : function() {
		
		this.sessionkey = new String();
		this.pdtid = new String();
		this.hasChildren='Y';
	},

	loadbuyer : function(sessionkey, pdtid) {
		    //this.sessionkey = sessionkey;
		      jQuery("#loading").show();
		      this.pdtid = pdtid;

		      var params = {
				  cmd : "PdtInfo",
				  pdtid : pdtid,
				  action : "loadBuyers",
				  category : "",
				  buyerid : "",			
		          sessionkey : sessionkey
		      };
		      var trans = {
			     id : 1,
		   	     command : "com.agilecontrol.fair.FairCmd",
			     params : params
		      };
		      portalClient.sendOneRequest(trans,function(response) {
		    	//无数据返回不显示表格
			    if(response.data[0].code==-1)
			    {
				   jQuery("#container").hide();
				   jQuery("body").html("<p class='tip'>查询数据不存在......</p>");
			    }
			    //返回值正常
			    else if(response.data[0].code==1)
			    { 
                   jQuery(".tip").remove();
                   jQuery("#container").show();
				   var data = response.data[0].result;
				
				   var buyer = data.buyers[0];
				   var cate0 = data.categories[0].value;
				
				   var id = buyer.buyerid;
				   var name = buyer.buyername;
				   var score = buyer.score;
				   var qty = buyer.qty;
				   var money = buyer.money;
				   var con = buyer[cate0]; 

				   var skus = con.sku计划;
				   var skur = con.sku实际;
				   var skup = con.sku达成率;
				
				   var qtys = con.订量计划;
				   var qtyr = con.订量实际;
				   var qtyp = con.订量达成率;
				
				   var mons = con.金额计划;
				   var monr = con.金额实际;
				   var monp = con.金额达成率;
				   

		           
		           var sel = "<span>当前单品所属</span><select id='78' onchange='pdtinfoc.switchCategory(this)'>";
		           for(var i=0; i<data.categories.length;i++)
	               {
			         if(i==0)
			         {
				          sel = sel+"<option value ='"+data.categories[i].value+"' selected='selected' >"+data.categories[i].name+"</option>";
			         }
			         else
			         {
				         sel = sel+"<option value ='"+data.categories[i].value+"'>"+data.categories[i].name+"</option>";				
			         }
		           }		           
		           sel = sel+"</select><span>内所有商品统计</span>";
		           //有子买手则显示表格一
			       if(data.hasChildren=='Y'){
			    	   jQuery("#tb2").hide();
			    	   jQuery("#tb1").show();
					   var temp = "<tr  flag='N' onClick='pdtinfoc.listBuyers(this)' depth='1' ><td style='display:none'>"+id+"</td><td><div style='display:inline;'><img src='/fair/ipad/img/pdtinfo_haschildren.png' align='bottom'/></div><div style='display:inline;'>"+name+"</div></td><td>"+score+"</td><td>"+qty+"</td><td>"+money+
		                     "</td><td>"+skus+"</td><td>"+skur+"</td><td>"+skup+"</td><td>"+qtys+"</td><td>"+qtyr+"</td><td>"+qtyp+
		                     "</td><td>"+mons+"</td><td>"+monr+"</td><td>"+monp+"</td></tr>";						   
					   var html= " <tr><th rowspan='3' style='display:none'>买手ID</th> <th rowspan='3' width='20%' >买手</th><th rowspan='3' width='4%'>评分</th> <th rowspan='3' width='8%'>单品订量</th><th rowspan='3'>金额</th><th colspan='9' id='sel' width='60%' ></th></tr><tr> <th colspan='3'>sku</th><th colspan='3'>订量</th> <th colspan='3'>金额</th></tr><tr><th>计划</th> <th>实际</th><th>达成率</th><th>计划</th><th>实际</th><th>达成率</th><th>计划</th> <th>结算</th><th>达成率</th></tr>"+temp;  
					
			           jQuery("#tb_pdt").append(html);	//加载表格
			           jQuery("#sel").append(sel);//加载category到下拉框
			           
			           //隐藏无意义的列，即返回值为-1的列
			           for(var j=1;j<=3;j++)
			           {
			        	   var ext;
				           var count = 0;
				           for(var i=j*3+2;i<=j*3+4;i++)
				           {				        	 
				        	 var temp = jQuery("#tb_pdt tr:eq(3)").children("td :eq("+i+")").text();
				        	 if(parseInt(temp)==-1)
				        		 {
				        		   count++;
				        		   jQuery("#tb_pdt tr :gt(1)").find("th :eq("+(i-5)+")").hide();
				        		   jQuery("#tb_pdt tr :gt(1)").find("td :eq("+i+")").hide();	            
				        		 }
				        	 else
				        		 {
				        		 ext = i;
				        		 }
				           }
				           if(count==1)
				        	   {
				        	   jQuery("#tb_pdt tr :gt(1)").find("th :eq("+(ext-5)+")").attr("colspan","2");
				        	   jQuery("#tb_pdt tr :gt(1)").find("td :eq("+ext+")").attr("colspan","2");
				        	   }
				           else if(count==2)
				        	   {
				        	   jQuery("#tb_pdt tr :gt(1)").find("th :eq("+(ext-5)+")").attr("colspan","3");
				        	   jQuery("#tb_pdt tr :gt(1)").find("td :eq("+ext+")").attr("colspan","3");
				        	   }			           			           
			           }		           
			       }
			       //无子买手显示表格二
			       else{
			    	       jQuery("#tb1").hide();
			    	       jQuery("#tb2").show();
		    		       var html="<tr style='display:none' ><th colspan='2' class=head>买手id</th><td colspan='2'></td> </tr><tr><th colspan='2' class='head'>买手</th><td colspan='2'></td></tr><tr><th colspan='2' class='head'>评分</th><td colspan='2'></td></tr> <tr><th colspan='2' class='head'>单品订量</th><td colspan='2'></td> </tr><tr><th colspan='2' class='head'>金额</th><td colspan='2'></td></tr><tr><th rowspan='3' class='tail'>sku</th><th class='tail'>计划</th><td colspan='2'></td></tr><tr><th class='tail'>实际</th><td colspan='2'></td></tr><tr><th class='tail'>达成率</th><td colspan='2'></td></tr><tr><th rowspan='3' class='tail'>订量</th><th class='tail'>计划</th><td colspan='2'></td></tr><tr><th class='tail'>实际</th><td colspan='2'></td></tr><tr><th class='tail'>达成率</th><td colspan='2'></td></tr><tr><th rowspan=3' class='tail'>金额</th><th class='tail'>计划</th><td colspan='2'></td></tr><tr><th class='tail'>结算</th><td colspan='2'></td></tr><tr><th class='tail'>达成率</th><td colspan='2'></td></tr>";
			   
		    		       //加载表格二和数据
                           jQuery("#tb_pdt1").append(html);
				    	   jQuery("#tb_pdt1 tr:eq(0)").children().last().text(id);	
				    	   jQuery("#tb_pdt1 tr:eq(1)").children().last().text(name);
				    	   jQuery("#tb_pdt1 tr:eq(2)").children().last().text(score);
				    	   jQuery("#tb_pdt1 tr:eq(3)").children().last().text(qty);
				    	   jQuery("#tb_pdt1 tr:eq(4)").children().last().text(money);
				    	   jQuery("#tb_pdt1 tr:eq(5)").children().last().text(skus);			    	   
				    	   jQuery("#tb_pdt1 tr:eq(6)").children().last().text(skur);
				    	   jQuery("#tb_pdt1 tr:eq(7)").children().last().text(skup);
				    	   
				    	   jQuery("#tb_pdt1 tr:eq(8)").children().last().text(qtys);
				    	   jQuery("#tb_pdt1 tr:eq(9)").children().last().text(qtyr);
				    	   jQuery("#tb_pdt1 tr:eq(10)").children().last().text(qtyp);
				    	   jQuery("#tb_pdt1 tr:eq(11)").children().last().text(mons);
				    	   
				    	   jQuery("#tb_pdt1 tr:eq(12)").children().last().text(monr);
				    	   jQuery("#tb_pdt1 tr:eq(13)").children().last().text(monp);

			    	       jQuery("#sel1").append(sel);
			    	       pdtinfoc.hasChildren="N";
			    	   
			    	   //隐藏无意义的行
			           for(var j=1;j<=3;j++)
			           {
			        	   var ext;
				           var count = 0;
				           for(var i=j*3+2;i<=j*3+4;i++)
				           {
				        	 
				        	 var temp = jQuery("#tb_pdt1 tr:eq("+i+")").children().last().text();
				        	 if(parseInt(temp)==-1)
				        		 {
				        		   count++;
				        		   jQuery("#tb_pdt1 tr :eq("+i+")").children().last().hide();
				        		   jQuery("#tb_pdt1 tr :eq("+i+")").children().last().prev().hide();	            
				        		 }
				        	 else
				        		 {
				        		 ext = i;
				        		 }
				           }
				           if(count==1)
				        	   {
				        	   jQuery("#tb_pdt1 tr :eq("+ext+")").children().last().attr("rowspan","2");
				        	   jQuery("#tb_pdt1 tr :eq("+ext+")").children().last().prev().attr("rowspan","2");

				        	   }
				           else if(count==2)
				        	   {
				        	   jQuery("#tb_pdt1 tr :eq("+ext+")").children().last().attr("rowspan","3");
				        	   jQuery("#tb_pdt1 tr :eq("+ext+")").children().last().prev().attr("rowsspan","3");
				        	   }			           			           
			           }
			       }				    		           
			   }
			    //后台异常抛出或者未登陆
			   else{				  		  
				  jQuery("#container").hide();
				  jQuery("body").html("<p class='tip'>查询错误......</p>");
			   }
			jQuery("#loading").hide();
		  });
	 },
	
	 listBuyers: function(event){
		 
         var cur = jQuery(event);
         var curdep = cur.attr("depth");
         //当前为展开状态则收起
		 if(cur.attr("flag")=='Y')
		 {
			jQuery.each(cur.nextAll(),function(i){
				if(jQuery(this).attr("depth")<=curdep)
					return false;
				else
					this.remove();
			});
			cur.attr("flag","N");				
		    cur.children(":eq(1)").children("div :eq(0)").children("img").attr('src','/fair/ipad/img/pdtinfo_haschildren.png');
		    
		 }
		 //否则发送请求
		 else
		 {	
			jQuery("#loading").show();
			var params = {
					cmd : "PdtInfo",
					pdtid : pdtinfoc.pdtid,
					action : "listBuyers",
					category : jQuery("select").val(),
					buyerid : cur.children(":eq(0)").text(),
				//	sessionkey : sessionkey
		    };
			var trans = {
					id : 1,
					command : "com.agilecontrol.fair.FairCmd",
					params : params
			};
			
		    portalClient.sendOneRequest(trans,function(response){	
	
		    	var d = cur.attr('depth');
		    	var depth = parseInt(d)+1;
		    	var blank = "";
                
		    	//数据正常，则展开数据
			   if(response.data[0].code==1){
				    jQuery(".tip").remove();
				   for(var i=1;i<depth;i++)
		    	   {
		    		 blank=blank+"&nbsp&nbsp&nbsp";
		    	   } 
			       var data = response.data[0].result;
			       var temp="";
			       for(var i=0;i<data.buyers.length;i++)
			       {
				        var buyer = data.buyers[i];				    
					    var id = buyer.buyerid;
					    
					    var name = buyer.buyername;
					    var score = buyer.score;
					    var qty = buyer.qty;
					    var money = buyer.money;
					    var con = buyer[jQuery("select").val()]; 
					   
					    var skus = con.sku计划;
					    var skur = con.sku实际;
					    var skup = con.sku达成率;
					
					    var qtys = con.订量计划;
					    var qtyr = con.订量实际;
					    var qtyp = con.订量达成率;
					    
					    var mons = con.金额计划;
					    var monr = con.金额实际;
					    var monp = con.金额达成率;

					    temp =temp+"<tr  flag='N' onClick='pdtinfoc.listBuyers(this)' depth='"+depth+"'><td style='display:none'>"+id+"</td><td>"+blank+"<div style='display:inline;width:30%;'><img src='/fair/ipad/img/pdtinfo_haschildren.png' align='bottom'/></div><div style='display:inline;width:70%;float:right;'>"+name+"</div></td><td>"+score+"</td><td>"+qty+"</td><td>"+money+
			               "</td><td>"+skus+"</td><td>"+skur+"</td><td>"+skup+"</td><td>"+qtys+"</td><td>"+qtyr+"</td><td>"+qtyp+
			               "</td><td>"+mons+"</td><td>"+monr+"</td><td>"+monp+"</td></tr>";	


					   
			      }   
			      cur.after(temp);
			      cur.attr("flag","Y");
			      cur.children(":eq(1)").children("div :eq(0)").children("img").attr('src','/fair/ipad/img/Download.png');
			      
			      //隐藏无意义的数据
			      for(var j=1;j<=3;j++)
		           {
		        	   var ext;
			           var count = 0;
			           for(var i=j*3+2;i<=j*3+4;i++)
			           {
			        	 
			        	 var temp = jQuery("#tb_pdt tr:eq(3)").children("td :eq("+i+")").text();
			        	 if(parseInt(temp)==-1)
			        		 {
			        		   count++;
			        		   jQuery("#tb_pdt tr :gt(1)").find("td :eq("+i+")").hide();         
			        		 }
			        	 else
			        		 {
			        		 ext = i;
			        		 }
			           }
			           if(count==1)
			        	   {
			        	   jQuery("#tb_pdt tr :gt(1)").find("td :eq("+ext+")").attr("colspan","2");
			        	   }
			           else if(count==2)
			        	   {
			        	   jQuery("#tb_pdt tr :gt(1)").find("td :eq("+ext+")").attr("colspan","3");
			        	   }		           			           
		           }		           
			      
			   }
			   //无数据依然该表图标并将当前行置为展开状态
			   else if(response.data[0].code==-1){
				   cur.children(":eq(1)").children("div :eq(0)").children("img").attr('src','/fair/ipad/img/Download.png');
				   cur.attr("flag","Y");		
				   jQuery("#loading").hide();	
				   return;
			   }
			   else{
				  jQuery("#container").hide();
				  jQuery("body").html("<p class='tip'>查询出错....</p>");
			   };	
			   jQuery("#loading").hide();	           
		    }); 	
		    
		};
		
	},
	
	switchCategory: function(event){
		  
	       jQuery("#loading").show();
			//构造买手id字符串，逗号分隔
			var buyerids = "";
			if(pdtinfoc.hasChildren=="Y")
			{
				jQuery("#tb_pdt tr:gt(2)").each(function(i,event){
				var tr = jQuery(event);
				
					if(i==0)
						buyerids = buyerids+tr.children(":eq(0)").text();
					else
	                    buyerids = buyerids+","+tr.children(":eq(0)").text();	
			   });
			}
			else
		    {
				buyerids = jQuery("#tb_pdt1 tr:eq(0)").children().last().text();
		    }
			
			var params = {
					cmd : "PdtInfo",
					pdtid : pdtinfoc.pdtid,
					action : "switchCategory",
					category : jQuery("select").val(),
					buyerid : buyerids,
				//	sessionkey : sessionkey
				};
			var trans = {
					id : 1,
					command : "com.agilecontrol.fair.FairCmd",
					params : params,
				};
			portalClient.sendOneRequest(trans,function(response){
				if(response.data[0].code==-1)
				 {
					   jQuery("#container").hide();
					   jQuery("body").html("<p class='tip'>查询数据不存在</p>");
				 }
				 else if(response.data[0].code==1)
				 {
					   jQuery(".tip").remove();
					   var data = response.data[0].result;
					
                       //表格一情况下循环更新数据
					   if(pdtinfoc.hasChildren=='Y')
                       {
						   for(var i=0;i<data.buyers.length;i++)
					       {
						       var buyer = data.buyers[i];
						       var con = buyer[jQuery("select").val()];	
						       var length = jQuery("#tb_pdt tr").length;
							   for(var j=3;j<length;j++)
							   {								    
									var tr = jQuery("#tb_pdt tr:eq("+j+")");
									var id = tr.children("td:first").text();	
									//更新单元格数据
                                    if(id==buyer.buyerid)
                                    {                                       	 
								          tr.children(":eq(1)").children("div :eq(1)").text(buyer.buyername);
								          tr.children(":eq(2)").text(buyer.score);
								          tr.children(":eq(3)").text(buyer.qty);
								          tr.children(":eq(4)").text(buyer.money);
									      tr.children(":eq(5)").text(con.sku计划);
									      tr.children(":eq(6)").text(con.sku实际);
									      tr.children(":eq(7)").text(con.sku达成率);
									      tr.children(":eq(8)").text(con.订量计划);
									      tr.children(":eq(9)").text(con.订量实际);
									      tr.children(":eq(10)").text(con.订量达成率);
									      tr.children(":eq(11)").text(con.金额计划);
									      tr.children(":eq(12)").text(con.金额实际);
									      tr.children(":eq(13)").text(con.金额达成率);
                                         }									
								};							 
					       }  
						   
				       }
				       //表格二的情况下只更新一条数据  			
				      else{				    	  
				          var buyer = data.buyers[0];
						
					      var id = buyer.buyerid;
					      var name = buyer.buyername;
					      var score = buyer.score;
					      var qty = buyer.qty;
					      var money = buyer.money;
					      var con = buyer[jQuery("select").val()]; 

					      var skus = con.sku计划;
					      var skur = con.sku实际;
					      var skup = con.sku达成率;
					
					      var qtys = con.订量计划;
					      var qtyr = con.订量实际;
					      var qtyp = con.订量达成率;
					
					      var mons = con.金额计划;
					      var monr = con.金额实际;
					      var monp = con.金额达成率;
					   
			    	     jQuery("#tb_pdt1 tr:eq(0)").children().last().text(id);	
			    	     jQuery("#tb_pdt1 tr:eq(1)").children().last().text(name);
			    	     jQuery("#tb_pdt1 tr:eq(2)").children().last().text(score);
			    	     jQuery("#tb_pdt1 tr:eq(3)").children().last().text(qty);
			    	     jQuery("#tb_pdt1 tr:eq(4)").children().last().text(money);
			    	   		    		   
				    	 jQuery("#tb_pdt1 tr:eq(5)").children().last().text(skus);			    	   
				    	 jQuery("#tb_pdt1 tr:eq(6)").children().last().text(skur);
				    	 jQuery("#tb_pdt1 tr:eq(7)").children().last().text(skup);
				    	   
				    	 jQuery("#tb_pdt1 tr:eq(8)").children().last().text(qtys);
				    	 jQuery("#tb_pdt1 tr:eq(9)").children().last().text(qtyr);
				    	 jQuery("#tb_pdt1 tr:eq(10)").children().last().text(qtyp);
				    	 
				    	 jQuery("#tb_pdt1 tr:eq(11)").children().last().text(mons);			    	   
				    	 jQuery("#tb_pdt1 tr:eq(12)").children().last().text(monr);
				    	 jQuery("#tb_pdt1 tr:eq(13)").children().last().text(monp);
				      }			    	
				  }
				  else{
					jQuery("#container").hide();
					jQuery("body").html("<p class='tip'>查询数据不存在</p>");
				}				
		    jQuery("#loading").hide();
			});		
	},
};

PdtInfoControl.main = function() {
	portalClient = new PortalClient();
	portalClient.init(null, null, "/servlets/binserv/Fair");
	pdtinfoc = new PdtInfoControl();
};
jQuery(document).ready(PdtInfoControl.main);

