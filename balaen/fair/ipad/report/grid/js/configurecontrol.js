var cc;
var ConfigureControl= Class.create();
ConfigureControl.prototype = {
		initialize : function() {
			this.rptviews=new Object();
			this.isloaded = false;
			this.theme="01";
			this.ischanged = false;
			this.views = new Hash();
			this.modify = new Hash();
			this.command="";
		},
		_draginit : function(id,params){
			jQuery(id).shapeshift(params);
		},
		_select : function(){
			jQuery(this).next("ul").toggle();
			jQuery(this).next("ul").children("li").bind("click",function(){
				jQuery(this).parent().children().removeClass("on");
				jQuery(this).addClass("on");
				jQuery(this).parent().prev("span").text(jQuery(this).text());
				jQuery(this).parent().hide();

			});
		},
		_addSpanUl : function(){

		},
		_load : function(theme,command){
			if(""!=theme)this.theme=theme;
			this.command=command;
			this.modify = new Hash();
			this.rptviews=new Object();
			this.ischanged = false;
			var trans = {
					id: 1,
					command: cc.command,
					params: {
						cmd: "RptDef",
						type: "loadRptViews"
					}
				};
				portalClient.sendOneRequest(trans, function(response){
					var javaData= response.data[0].result;
					cc.rptviews=javaData;
					cc._drawHtml(javaData);
				});
		},
		recreat: function(name,view){
			if(cc._checkrptname()){
				alert(jQuery(".alert").html());
				return;
			}
			var param = {
					colWidth: 160,
					paddingX:0,
					paddingY:0,
					gutterX:50,
					gutterY:30
			};
			var theme=jQuery(".configure").attr("theme");
			var data = {desc:'新建报表'};
			data.referTo = view;
			data.name = name+new Date().getTime();
			data.img='images/'+theme+'/report.png';
			data.allow_filter="N";
			data.allow_f_filter="N";
			data.ishide="N";
			element = "<div style='background-image:url(images/"+theme+"/report.png)' isnew='Y'><p>新建报表</p><p>"+name+new Date().getTime()+"</p></div>";
			jQuery(".container").append(element);
			jQuery(".container div").children("p").removeClass("selected");
			var dom=jQuery(".container").children("div:last-child");
			dom.children("p").addClass("selected");
			dom.data("data",data);
			jQuery(".configure textarea").val("");
			dom.trigger("click");
			cc._draginit(".container",param);
		},
		_drawHtml: function(result){
			jQuery(".container").html("");
			//发请求到后台{cmd: rptDef,type:'getPermissionDef'}
			var selectData = {
			  group:[{name: "C_AREA",desc:"区域"},{name: "FOTYPE",desc:"买手类型"}],
			  operator: [{name: "I",desc: "包含"},{name: "NI",desc: "不包含"}]
			};
			var element = "";
			if(result.views!=undefined){
				for(var i = 0;i < result.views.length; i++){
					element = "<div style='background-image:url("+result.views[i].img+")'><p>"+result.views[i].desc+"</p><p>"+result.views[i].name+"</p></div>";
					jQuery(".container").append(element);
					jQuery(".container div").eq(i).data("data",result.views[i]);
					cc.views[result.views[i].name]=result.views;
				}
			}
			jQuery("#sel").on("click",function(){
				var dom=jQuery(".selected").parent();
				if(document.getElementById("sel").checked) dom.data("data").hide="Y";
				else dom.data("data").hide="N";
			});
			jQuery(".container").on("click","div",function(){
				if(cc._checkrptname()){
					alert(jQuery(".alert").html());
					return;
				}
				if(jQuery(this).hasClass('last')){
					return;
				}else{
					jQuery(".isnew").blur();
					jQuery(".configure .reportname").find("input").blur();
					jQuery(".configure .db_name").find("input").blur();
					jQuery(".container div").children("p").removeClass("selected");
					jQuery(this).find("p").addClass("selected");
					var data = jQuery(this).data("data");
					jQuery(".configure .reportname").eq(0).text(data.desc);
					jQuery(".configure .db_name").text(data.name);
					jQuery(".configure .reportname").eq(0).data("name",data.name);
					//设置checkbox
					if(data.hide == 'Y'){
						document.getElementById("sel").checked = true;
					}else{
						document.getElementById("sel").checked = false;
					}
					if(data.sql != 'undefined'){
						jQuery(".configure textarea.rightcontrol").val(data.sql).blur();
					}
					if(data.fsql != 'undefined'){
						jQuery(".configure textarea.fsql").val(data.fsql).blur();
					}
					if(data.group != 'undefined'){
						jQuery(".configure textarea.group").val(data.group).blur();
					}
					cc.ischanged = false;
					if(data.referTo.indexOf("view")!=-1 && parseInt(data.referTo.substring(4)) >= 900){
						this.ischanged = false;
						var spanValue = "";
						var elem = "<ul>";
						var input = "<input type='text' value='' />";
						for(var j = 0; j < selectData.group.length; j++){
							if(j == 0){
								spanValue = "<span class='selectvalue'>"+selectData.group[j].desc+"</span>";
							}
							elem += "<li>"+selectData.group[j].desc+"</li>";
						}
						elem += "</ul>";
						var group = "";

						jQuery(".configure div.inp").children("input").remove();
						if(null != data.perm_def && data.perm_def.length > 0){
							spanValue = "";input = "";
							for(var j = 0; j < data.perm_def.length; j++){
								if(null != data.perm_def[j].value && data.perm_def[j].value != 'undefined'){
									input += "<input type='text' value='"+data.perm_def[j].value+"' />";
								}else{
									input += "<input type='text' value='' />";
								}
								var desc = "";
								for(var k = 0; k < selectData.group.length; k++){
									if(data.perm_def[j].group == selectData.group[k].name){
										desc = selectData.group[k].desc;
									}
								}
								spanValue = "<span class='selectvalue'>"+desc+"</span>";
								group += spanValue+elem;
							}
						}
						if(data.allow_filter!=undefined&&data.allow_filter=="Y"){jQuery("#allow_filter").prop("checked",true);}else{jQuery("#allow_filter").prop("checked",false);}
						if(data.allow_f_filter!=undefined&&data.allow_f_filter=="Y"){jQuery("#allow_f_filter").prop("checked",true);}else{jQuery("#allow_f_filter").prop("checked",false);}
						if(data.ishide!=undefined&&data.ishide=="Y"){jQuery("#ishide").prop("checked",true);}else{jQuery("#ishide").prop("checked",false);}
						if(data.top!=undefined){jQuery("#topset").val(data.top);}else{jQuery("#topset").val("");}
						if(data.mergecell!=undefined){jQuery("#mergecell").val(data.mergecell);}else{jQuery("#mergecell").val("");}
						if(data.mgr_right!=undefined){jQuery("input[name='type1']").eq(data.mgr_right).prop("checked",true);}else{jQuery("input[name='type1']").eq(0).prop("checked",true);}
						jQuery(".configure div.area").children("ul").remove();
						jQuery(".configure div.area").children(".selectvalue").remove();
						if(group != ""){
							jQuery(".configure div.area").append(group);
						}else{
							jQuery(".configure div.area").append(spanValue+elem);
						}
						//jQuery(".configure div.area").css("display","block");
						/*关系DOM*/
						spanValue = "";
						elem = "<ul>";
						for(var j = 0; j < selectData.operator.length; j++){
							if(j == 0){
								spanValue = "<span class='selectvalue'>"+selectData.operator[j].desc+"</span>";
							}
							elem += "<li>"+selectData.operator[j].desc+"</li>";
						}
						elem += "</ul>";
						group = "";
						if(null != data.perm_def && data.perm_def.length > 0){
							spanValue = "";
							for(var j = 0; j < data.perm_def.length; j++){
								var desc = "";
								for(var k = 0; k < selectData.group.length; k++){

									if(data.perm_def[j].operator == selectData.operator[k].name){
										desc = selectData.operator[k].desc;
									}
								}
								spanValue = "<span class='selectvalue'>"+desc+"</span>";
								group += spanValue+elem;
							}
						}
						jQuery(".configure div.funi").children("ul").remove();
						jQuery(".configure div.funi").children(".selectvalue").remove();
						if(group != ""){
							jQuery(".configure div.funi").append(group);
						}else{
							jQuery(".configure div.funi").append(spanValue+elem);
						}
						//jQuery(".configure div.funi").css("display","block");
						/*input输入框*/
						jQuery(".configure div.inp").append(input);
						//jQuery(".configure div.inp").css("display","block");
						jQuery(".isnew").css("display","inline");
						jQuery(".filter").show();
						jQuery(".isview900").show();
					}else{
						jQuery(".configure p.new").css("display","none");
						jQuery(".configure div.area").css("display","none");
						jQuery(".configure div.funi").css("display","none");
						jQuery(".configure div.inp").css("display","none");
						jQuery(".isnew").css("display","none");
						jQuery(".filter").hide();
						jQuery(".isview900").hide();
					}
				}

			});

			jQuery(".container div").eq(0).trigger("click");

			var param = {
				colWidth: 160,
				paddingX:0,
				paddingY:0,
				gutterX:50,
				gutterY:30
			};

//			element = "<div class='last' style='background-image:url(/develop/grid/images/newreport.png)'><p>新建表</p><p>"+new Date().getFullYear().toString()+(new Date().getMonth()+1).toString()+new Date().getDate().toString()+new Date().getHours().toString()+new Date().getMinutes().toString()+new Date().getSeconds().toString()+new Date().getMilliseconds().toString()+"</p></div>";
//			jQuery(".container").append(element);
			if(!this.isloaded){
				this.isloaded=true;
				//复制报表
				jQuery("span.copyrpt").bind("click",function(){
					if(cc._checkrptname()){
						alert(jQuery(".alert").html());
						return;
					}
					var dom=jQuery(".selected").parent("div");
					var data=dom.data("data");
					var index=dom.index();
					if(data.referTo.indexOf("view")!=-1 && parseInt(data.referTo.substring(4)) >= 900){
						var rptname=jQuery(".selected:eq(1)").html();
						var newrptname="RPT"+new Date().getTime();
						var trans = {
								id: 1,
								command: cc.command,
								params: {
									cmd: "RptDef",
									type: "copyRpt",
									oldrpt:rptname,
									newrpt:newrptname,
									view:cc.rptviews.views[index],
									desc:"复制报表",
									rptviews:cc.rptviews
								}
							};
							portalClient.sendOneRequest(trans, function(response){
								alert(response.data[0].message);
								if(response.data[0].code == 0){
									cc._load(cc.theme,cc.command);
								}
							});
					}else{
						alert("当前报表不能复制!");
					}
				});
				//测试报表
				jQuery("span.testrpt").bind("click",function(){
					window.location.href="testrptview.jsp";
				});
				//基础报表配置
				jQuery("span.basicrpt").bind("click",function(){
					window.location.href="basicrptconfig.jsp";
				});
			}
			cc._draginit(".container",param);
			//报表显示名称
			jQuery(".reportname").click(function(){
				if(cc._checkrptname()){
					alert(jQuery(".alert").html());
					return;
				}
				jQuery(".reportname").find("input").blur();
				var val = jQuery(this).text();
				var name = jQuery(this).data("name");
				jQuery(this).html("<input type='text' value='' />");
				jQuery(this).find("input").focus().val(val).blur(function(){
//					var data ;
//					for(var i = 0;i < jQuery(".container div").length; i++){
//						data = jQuery(".container div").eq(i).data("data");
//						if(null != data && 'undefined' != data && 'undefined' != data.name && data.name == name){
//							data.desc = jQuery(this).val();
//							jQuery(".container div").eq(i).data("data",data);
//							jQuery(".container div").eq(i).find("p").eq(0).text(jQuery(this).val());
//						}
//					}
					var dom=jQuery(".selected").parent();
					var data=dom.data("data");
					if(null != data && 'undefined' != data && 'undefined' != data.name && data.name == name){
						data.desc = jQuery(this).val();
						dom.data("data",data);
						dom.find("p").eq(0).text(jQuery(this).val());
					}
					cc.ischanged=true;
					jQuery(this).parent().html(jQuery(this).val());
				});
			});
			//报表数据库的name
			jQuery(".db_name").click(function(){
				jQuery(".db_name").find("input").blur();
				var val = jQuery(this).text();
				jQuery(this).html("<input style='text-transform:uppercase;' type='text' value='' />");
				jQuery(this).find("input").focus().val(val).blur(function(){
					var dom=jQuery(".selected").parent();
					var value=jQuery(this).val().toUpperCase();
					var isnew=dom.attr("isnew");
					if(value==""){
						jQuery(".alert").html("报表字段名称不能为空！");
						jQuery(".alert").show();
					}else{
						if(value!=dom.find("p").eq(1).text() && cc.views[value]!=undefined){
							jQuery(".alert").html("报表字段名称不能重复！");
							jQuery(".alert").show();
							var data=dom.data("data");
							if(null != data && 'undefined' != data && 'undefined' != data.name){
								data.name = value;
								dom.data("data",data);
								dom.find("p").eq(1).text(value);
								cc.ischanged=true;
								jQuery(this).parent().html(value);
							}
						}else{
							if(value!=dom.find("p").eq(1).text()&&isnew!='Y'){
								jQuery(".alert").html("校验中...");
								jQuery(".alert").show();
								var trans = {
										id: 1,
										command: cc.command,
										params: {
											cmd: "RptDef",
											type: "checkRptName",
											oldname:dom.find("p").eq(1).text(),
											newname:value
										}
								};
								portalClient.sendOneRequest(trans, function(response){
									var isexist=response.data[0].result.isexist;
									if(isexist=='Y'){
										jQuery(".alert").html("报表字段名称不能重复！");
									}else{
										jQuery(".alert").hide();
										cc.modify[dom.find("p").eq(1).text()]=value;
									}
									var data=dom.data("data");
									if(null != data && 'undefined' != data && 'undefined' != data.name){
										data.name = value;
										dom.data("data",data);
										dom.find("p").eq(1).text(value);
										cc.ischanged=true;
										jQuery(this).parent().html(value);
									}
								});
							}else{
								jQuery(".alert").hide();
								if(value!=(dom.find("p").eq(1).text())){
									var data=dom.data("data");
									if(null != data && 'undefined' != data && 'undefined' != data.name){
										data.name = value;
										dom.data("data",data);
										dom.find("p").eq(1).text(value);
										cc.ischanged=true;
										jQuery(this).parent().html(value);
									}
								}
							}
						}
					}
				});
			});

			jQuery(".area").on("click",".selectvalue",cc._select);
			jQuery(".funi").on("click",".selectvalue",cc._select);
			jQuery(".new span").click(function(){
				if(cc._checkrptname()){
					alert(jQuery(".alert").html());
					return;
				}
				var span = jQuery(".area .selectvalue").eq(0);
				var ul = jQuery(".area ul").eq(0);
				jQuery(".area").append(jQuery(".area .selectvalue").eq(0).clone());
				jQuery(".area").append(jQuery(".area ul").eq(0).clone());
				span = jQuery(".funi .selectvalue").eq(0);
				ul = jQuery(".funi ul").eq(0);
				jQuery(".funi").append(jQuery(".funi .selectvalue").eq(0).clone());
				jQuery(".funi").append(jQuery(".funi ul").eq(0).clone());
				jQuery(".inp").append(jQuery(".inp input").eq(0).clone());
			});

			//设置textarea效果
			jQuery(".configure textarea").focus(function(){
					jQuery(this).css("line-height","20px");
					jQuery(this).css("text-align","left");
				}).blur(function(){
					cc.ischanged = true;
					if(jQuery(this).val()!=""){
						if(jQuery(this).hasClass("rightcontrol")){
							if(jQuery(".selected").parent().data("data")!=undefined)
								jQuery(".selected").parent().data("data").sql=jQuery(this).val();
						}else if(jQuery(this).hasClass("fsql")){
							if(jQuery(".selected").parent().data("data")!=undefined)
								jQuery(".selected").parent().data("data").fsql=jQuery(this).val();
						}else if(jQuery(this).hasClass("group")){
							if(jQuery(".selected").parent().data("data")!=undefined)
								jQuery(".selected").parent().data("data").group=jQuery(this).val();
						}
						jQuery(this).css("line-height","20px");
						jQuery(this).css("text-align","left");
					}else{
						jQuery(this).css("line-height","20px");
						jQuery(this).css("text-align","center");
						if(jQuery(this).hasClass("rightcontrol")&&jQuery(".selected").parent().data("data")!=undefined){
							jQuery(".selected").parent().data("data").sql="";
						}else if(jQuery(this).hasClass("fsql")&&jQuery(".selected").parent().data("data")!=undefined){
							jQuery(".selected").parent().data("data").fsql="";
						}else if(jQuery(this).hasClass("group")&&jQuery(".selected").parent().data("data")!=undefined){
							jQuery(".selected").parent().data("data").group="";
						}
					}
				});
			jQuery(".configure textarea").focus().blur();

		},
	_deleteviews : function(){
		var name=jQuery("p.selected").eq(1).text();
		jQuery("p.selected").parent().remove();
		var views=new Array();
		jQuery(".container  div").each(function(i){
			var data=jQuery(this).data("data");
			views.push(data);
		});
		cc.rptviews.views=views;
		var trans = {
				id: 1,
				command: cc.command,
				params: {
					cmd: "RptDef",
					type: "deleteRpt",
					rptviews:cc.rptviews,
					name:name
				}
			};
			portalClient.sendOneRequest(trans, function(response){
				alert(response.data[0].message);
				cc._load(cc.theme,cc.command);
			});
	},
	_detailconfigure : function(){
		if(cc._checkrptname()){
			alert(jQuery(".alert").html());
			return;
		}
		var select=jQuery("p.selected");
		if(select.parent().attr("isnew")!=undefined && select.parent().attr("isnew")=="Y"){
			alert("当前报表还没有保存,请先点击保存按钮。");
			return;
		}
		if(this._checkchange()){
			alert("当前报表已被修改,请先点击保存按钮。");
			return;
		}
		var name=select.eq(1).text();
		if(name.indexOf( 'GRPT')==0)
			window.location.replace('../report/graphicalconfig.jsp?name='+name);
		else
			window.location.replace('rptconfig.jsp?name='+name);
	},
	_checkchange : function(){
		var index=jQuery(".container > div").index(jQuery(".selected").parent());
		var dom=cc.rptviews.views[index];
		if(jQuery(".reportname").text()!=dom.desc)return true;
		if(jQuery(".db_name input").val()!=undefined){
			if((jQuery(".db_name input").val().toUpperCase())!=dom.name)return true;
		}else{
			if((jQuery(".db_name").text().toUpperCase())!=dom.name)return true;
		}
		if(jQuery(".rightcontrol").val()!=dom.sql)return true;
		if(jQuery(".fsql").val()!=dom.fsql)return true;
		if(jQuery(".group").val()!=dom.group)return true;
		if(dom.allow_filter==undefined)dom.allow_filter="N";
		if(dom.allow_f_filter==undefined)dom.allow_f_filter="N";
		if(dom.ishide==undefined)dom.ishide="N";
		if(dom.top==undefined)dom.top="";
		if(dom.mergecell==undefined)dom.mergecell="";
		if(dom.mgr_right==undefined)dom.mgr_right=0;
		if(jQuery("#topset").val()!=dom.top)return true;
		if(jQuery("#mergecell").val()!=dom.mergecell)return true;
		if(jQuery("input[name='type1']:checked").val()!=dom.mgr_right)return true;

	},

	_checkrptname : function(){
		var dom = jQuery(".alert");
		if(dom.css("display")=="block" && dom.html()!="")return true;
		else return false;
	},

	_saverptviews : function(){
		if(cc._checkrptname()){
			alert(jQuery(".alert").html());
			return;
		}
		var views=new Array();
		if(jQuery(".isnew").css("display")=="inline"){
			var dom=jQuery(".selected").parent();
			dom.data("data").allow_filter=jQuery("#allow_filter").is(":checked")?"Y":"N";
			dom.data("data").allow_f_filter=jQuery("#allow_f_filter").is(":checked")?"Y":"N";
			dom.data("data").ishide=jQuery("#ishide").is(":checked")?"Y":"N";
			dom.data("data").top=jQuery("#topset").val();
			dom.data("data").mergecell=jQuery("#mergecell").val();
			dom.data("data").mgr_right=jQuery("input[name='type1']:checked").val();
		}
		jQuery(".container  div").each(function(i){
			var data=jQuery(this).data("data");
			views.push(data);
		});
		cc.rptviews.views=views;
		var temp,
		tojava = new Array(),
		iterator2 = this.modify,
		iterator = iterator2.keys();
		for ( var i = 0; i < iterator.length; i++) {
			temp = new Array();
			temp.push(iterator[i]);
			temp.push(iterator2[iterator[i]]);
			tojava.push(temp);
		}
		var trans = {
				id: 1,
				command: cc.command,
				params: {
					cmd: "RptDef",
					type: "saveRptViews",
					rptviews:cc.rptviews,
					modif:tojava
				}
			};
			portalClient.sendOneRequest(trans, function(response){
				alert(response.data[0].message);
				jQuery("p.selected").parent().attr("isnew","N");
				cc.ischanged=false;
			});
	}
};
ConfigureControl.main = function() {
	portalClient = new PortalClient();
	//设置请求路径
	portalClient.init(null,null,"/servlets/binserv/Request");
	cc = new ConfigureControl();
};
jQuery(document).ready(ConfigureControl.main);
