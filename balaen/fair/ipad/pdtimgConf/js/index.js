var pdts;
var Products = Class.create();
Products.filterDesc = "请输入商品编号或名称";
Products.prototype = {
	initialize : function() {
		var pdtName = jQuery.cookie("pdtimg.pdtName");
		var sqlCriteria = jQuery.cookie("pdtimg.sqlCriteria");
		var description = jQuery.cookie("pdtimg.description")
		var currPage = jQuery.cookie("pdtimg.currPage");
		var pageSize = jQuery.cookie("pdtimg.pageSize");
		if (pdtName == undefined) pdtName = "";
		if (sqlCriteria == undefined) sqlCriteria = "";
		if (description == undefined) description = Products.filterDesc;
		this.criteria = {
			pdtName: pdtName,
			sqlCriteria: sqlCriteria,
			description: description
		}
		if (pdtName != "") {
			jQuery("#pdtName").val(pdtName);
		} else {
			jQuery("#pdtName").val(description);
			jQuery("#pdtName").css("color", "#ccc");
		}

		if (currPage == undefined) {
			currPage = 0;
		} else {
			currPage = parseInt(currPage);
		}
		if (pageSize == undefined) {
			pageSize = 10;
		} else {
			pageSize = parseInt(pageSize);
		}
		this.paging = {
			currPage: currPage,
			pageSize: pageSize,
			pageCount: 0
		};
		jQuery("#pageSize").val(pageSize);
	},
	list : function() {
		var fairid=jQuery("#selectFair  option:selected").val();
		if(fairid==0){
			fairid="";
		}
		var hasImg=0;
		if (jQuery("#selectNoImg").attr("checked")) {
			hasImg=1;
		}
		jQuery.cookie("pdtimg.currPage", this.paging.currPage);
		jQuery.cookie("pdtimg.pageSize", this.paging.pageSize, {expires: 30});
		jQuery.cookie("pdtimg.pdtName", this.criteria.pdtName);
		jQuery.cookie("pdtimg.sqlCriteria", this.criteria.sqlCriteria);
		jQuery.cookie("pdtimg.description", this.criteria.description);
		jQuery.cookie("pdtimg.fairid",fairid);
		var req = {
			id : 1,
			command : "com.agilecontrol.fair.MiscCmd",
			params : {
				cmd : "ProductImagesConf",
				method : "productList",
				param : {
					criteria : this.criteria,
					paging : this.paging,
					fairid : fairid,
					hasImg : hasImg
				}
			}
		};
		portalClient.sendOneRequest(req, function(response) {
			if (response.data[0].code == 0) {
				jQuery("#selectAll").attr("checked", false);
				var p = response.data[0].result.paging;
				pdts.paging.currPage = p.currPage;
				pdts.paging.pageSize = p.pageSize;
				pdts.paging.pageCount = p.pageCount;
				jQuery("#rowsRange").html(p.rowFrom + "-" + p.rowTo);
				jQuery("#totalRows").html(p.totalRows);
				jQuery("#list").html("");
				jQuery(response.data[0].result.products).each(function() {
					jQuery("#list").append('<div class="item">' +
							'<a class="pic"><img src="' + this.imageurl + '?tempid='+Math.random()+'"/></a>' +
							'<input name="checkbox" type="checkbox" value="' + this.id + '" class="checkbox"/>' +
							'<a class="name">[' + this.name + ']</a>' +
							'<a class="value">' + this.value + '</a>' +
							'</div>');
				});
			} else {
				alert("查询失败！\n错误信息：" + response.data[0].message);
			}
		});
	},
	selectAll : function() {
		if (jQuery("#selectAll").attr("checked")) {
			jQuery("#list .item input[type=checkbox]").attr("checked", true);
		} else {
			jQuery("#list .item input[type=checkbox]").removeAttr("checked");
		}
	},
	images : function(pdtId) {
		/*window.open("images.jsp?pdtId=" + pdtId, "newwindow",
				"height=600,width=800,top=100,left=200,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no"); */
		location="images.jsp?pdtId=" + pdtId;
	},
	remove : function() {
		var arr = new Array();
		jQuery("#list .item input[type=checkbox]:checked").each(function() {
			arr.push(jQuery(this).val());
		});
		if(arr.length>0){
			showUnitInfo();
		}
		var req = {
			id : 1,
			command : "com.agilecontrol.fair.MiscCmd",
			params : {
				cmd : "ProductImagesConf",
				method : "clearImages",
				param : {
					pdtIds : arr
				}
			}
		};
		portalClient.sendOneRequest(req, function(response) {
			if (response.data[0].code == 0) {
				jQuery(arr).each(function() {
					var img = jQuery("input[value=" + this + "]").parent().find("img")[0];
					jQuery(img).attr("src","/fair/ipad/pdtimg/images/nopic.jpg");
					if(arr.length--<2){
						hideUnitInfo();
					}
				});
			} else {
				alert("删除失败！\n错误信息：" + response.data[0].message);
			}
		});
	},
	batch : function() {
		/*window.open("batch.jsp", "newwindow",
				"height=600,width=800,top=100,left=200,toolbar=no,menubar=no,scrollbars=no,resizable=no,location=no,status=no"); */
		location="batch.jsp";
	},
	_goto : function(page) {
		if (page == "next") {
			if (this.paging.currPage < this.paging.pageCount) {
				this.paging.currPage++;
				this.list();
			}
		} else if (page == "last") {
			this.paging.currPage = this.paging.pageCount;
			this.list();
		} else if (page == "prev") {
			if (this.paging.currPage > 1) {
				this.paging.currPage--;
				this.list();
			}
		} else { // first
			this.paging.currPage = 1;
			this.list();
		}
	},
	setPageSize : function(select) {
		this.paging.pageSize = jQuery(select).val();
		this.paging.currPage = 1;
		this.list();
	},
	setPdtName : function() {
		var pdtName = jQuery("#pdtName").val();
		this.criteria.pdtName = pdtName;
		this.criteria.sqlCriteria = "";
		this.criteria.description = Products.filterDesc;
	},
	pnFocus : function() {
		if (this.criteria.pdtName == "") {
			jQuery("#pdtName").val("");
			jQuery("#pdtName").css("color", "#000");
		}
	},
	pnBlur : function() {
		if (jQuery("#pdtName").val() == "") {
			if (this.criteria.pdtName != "") {
				jQuery("#pdtName").val(this.criteria.pdtName);
				jQuery("#pdtName").css("color", "#000");
			} else {
				jQuery("#pdtName").val(this.criteria.description);
				jQuery("#pdtName").css("color", "#ccc");
			}
		}
	},
	selectNoImg : function(){
		if (jQuery("#selectNoImg").attr("checked")) {
			list();
		} else {
			list();
		}
	},
	selectCriteria : function() {
		var url = "/nea/core/query/search.jsp?table=m_product&return_type=a&accepter_id=updateCondition";
		oq.toggle_m(url, "onCriteriaSet");
	},
	makeSelect : function(){
		var fairid=jQuery.cookie("pdtimg.fairid");
		if(sessionStorage.length>0){
			for(var i=0;i<sessionStorage.length;i++){
				var key=sessionStorage.key(i);
				jQuery("#selectFair").append("<option value="+key+">"+sessionStorage.getItem(key)+"</option>");
			}
			jQuery("#selectFair").val(fairid);
		} else {
			var req = {
					id : 1,
					command : "com.agilecontrol.fair.MiscCmd",
					params : {
						cmd : "ProductImagesConf",
						method : "makeSelect",
						param : {}
					}
				};
				portalClient.sendOneRequest(req, function(response) {
					if (response.data[0].code == 0) {
						jQuery(response.data[0].result.fairs).each(function() {
							jQuery("#selectFair").append("<option value="+this.id+">"+this.description+"</option>");
							sessionStorage.setItem(this.id,this.description);
						});
					} 
				});
		}
	},
	loadTableData : function(){
		var req = {
				id : 1,
				command : "com.agilecontrol.fair.MiscCmd",
				params : {
					cmd : "ProductImagesConf",
					method : "loadTableData",
					param : {}
				}
			};
			portalClient.sendOneRequest(req, function(response) {
				if (response.data[0].code == 0) {
					pdts.makeSelect();
					pdts.list();
				} else {
					alert("错误信息：" + response.data[0].message);
				}
			});
	},
	exportExcel : function(){
		var fairid=jQuery("#selectFair  option:selected").val();
		var req = {
				id : 1,
				command : "com.agilecontrol.fair.MiscCmd",
				params : {
					cmd : "ProductImagesConf",
					method : "exportExcel",
					param : {
						fairid:fairid
					}
				}
			};
			portalClient.sendOneRequest(req, function(response) {
				if (response.data[0].code == 0) {
					window.location.href=response.data[0].result.url;
				} else{
					alert("导出失败！");
				}
			});
	}
}
function onCriteriaSet(filter) {
	pdts.criteria.sqlCriteria = filter.sql;
	pdts.criteria.description = filter.description;
	pdts.criteria.pdtName = "";
	jQuery("#pdtName").val(filter.description);
	jQuery("#pdtName").css("color", "#ccc");
}
function showUnitInfo()
{
	 var screenWidth = jQuery(window).width();
	 var screenHeight = jQuery(window).height();
	 jQuery("#yinying").css({"display":"","position": "fixed","background-color":"#808080","-moz-opacity": "0.5","opacity":".50","filter": "alpha(opacity=50)","width":screenWidth,"height":screenHeight});
	 jQuery(".spinner").css({"display":"block"});
}
function hideUnitInfo(){
	jQuery("#yinying").css("display","none");
	jQuery(".spinner").css("display","none");
}
Products.main = function() {
	portalClient = new PortalClient();
	portalClient.init(null,null,"/servlets/binserv/Fair");
	pdts = new Products();
	pdts.loadTableData();
};
jQuery(document).ready(Products.main);
