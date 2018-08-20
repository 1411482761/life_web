/**

* CopyRright (c)2013: lifecycle

* Project: Ordering - Board

* Comments:  to config the rpt.

* Create Date锛�013-05-09
	@version: 1.0
	@since: portal5.0 jQuery1.7.1 prototype1.5.1.2 jquery-ui-1.8
	@author: chengzhenlong
*/

var model001c;
var Model001Control = Class.create();
Model001Control.prototype = {
	/**
	 * Description : to define parameter
	 * 
	 * @type private
	 * */
	initialize : function() {
		this.mouse_drag_index=0;
		this.histogram_drag_DOM=null;
		this.cakegram_drag_DOM=null;
		this.edit_flag=0;
		this.histogram_drag_index=0;
		this.cakegram_index=0;
		this.tojava={
			maxLines: 12,
			header: new Array(),
			fmt: new Array(),
			pie_charts: new Array(),
			column_charts: new Array()
		};
	},
	
	init : function() {
		//画出model
		jQuery("#real_models").append("<div id='table_head'></div>");
		jQuery("#real_models").append("<div id='grams' class='grams'></div>");
		jQuery("#grams").append("<div id='histogram'></div>");
		jQuery("#grams").append("<div id='cakegram'></div>");
		
		jQuery("#histogram").append("<div id='cart'><input id='cake_checkbox_flag' type='checkbox' checked='checked'></input>饼状图"+
									"<ol style='height:192px;'></ol></div>");
		
		jQuery("#cakegram").append("<div id='cart_cake'><div class='checkbox_div'><input id='column_checkbox_flag' type='checkbox'  checked='checked'></input>柱状图</div><div class='column_chart_select'>选择:<select onclick='model001c.column_report_change_click();' onchange='model001c.column_report_change();'></select></div><div class='add_column_chart_div'><a href='javascript:model001c.add_column_chart();'><<添加柱状图</a></div></div>"+
								   "<div class='column_ol_div'>报表名称:<input type='text'></input><select><option value='0'>数量</option><option value='1'>货币</option><option value='2'>百分比</option></select><ol style='height:160px;'></ol></div></div>");
		
		jQuery("#table_head").append("<div class='rabbis_colloction'></div>");
		jQuery("#table_head").append("<div class='table_head_tag_a'><a href='javascript:model001c.convert_to_table_head_edit();'>配置</a></div>");
	},
	
	/**
	 * 当用户改变柱状图选择
	 */
	column_report_change : function() {
		
	},
	
	leave_edit_column_chart : function() {
		
	},
	
	column_report_change_click : function() {
		if(jQuery(".column_chart_select>select>option").length == 1) {
			var flag = 0;
			if(jQuery(this).children("input").val() != "") {
				flag = 1;
			}
			if(jQuery(this).children("ol").children("li").length > 1) {
				flag = 1;
			}
			if(1 == flag) {
				if(confirm("还有数据没有保存是否离开？")) {
					jQuery(".column_ol_div:eq(1)").remove();
					jQuery(".column_ol_div:eq(0)").show();
				}
			}
		}
	},
	
	draggableandsortable : function() {
		jQuery("#columns").sortable({
			revert: true,
			cursorAt: { top: 25, left: -10 }
		});
		jQuery(".table_head_son_column").sortable({
			cancel:'#son_column_text'
		});
	}, 
	
	dragforhistogram : function() {
		//饼状图
		jQuery( "#cart ol" ).droppable({
			activeClass: "ui-state-default",
			hoverClass: "ui-state-hover",
			accept:":not(.ui-sortable-helper)",
			drop: function( event, ui ) {
				var li_length=jQuery(this).children("li").length+1;
				var colindex = null;
				//扫描table找出当前用户拖动的在table中的列数 0-N
				jQuery("#table_head_real tr:eq(1)>td").each(function(i){
					var txt = jQuery(this).text();
					if(txt == ui.draggable.text()){
						colindex = i;
					}
				});
				jQuery( "<li onmousedown='model001c.histogram_li_mousedown(this,"+li_length+");' onmouseup='model001c.histogram_li_mouseup(this,"+li_length+");'>请输入报表名称:<input size='30' type='text' value='"+ui.draggable.text()+"'></input><input type='hidden' value='"+colindex+"'></input><select><option value='0'>数量</option><option value='1'>货币</option><option value='2'>百分比</option></select></li>" ).appendTo( this );
			}
		}).sortable({
			sort: function() {
				jQuery("#cart_cake ol").removeClass( "ui-state-default" );
				jQuery( this ).removeClass( "ui-state-default" );
			},
			cursorAt: { top: 25, left: -10 }
		});
		
		//柱状图
		jQuery( ".column_ol_div ol" ).droppable({
			activeClass: "ui-state-default",
			hoverClass: "ui-state-hover",
			accept:":not(.ui-sortable-helper)",
			drop: function( event, ui ) {
				//要加入列表需要满足  1.满足当前列表少于3项目 2.不能加入重复的项目  3.不能加入非列名项目
				var items = jQuery(this);
				//1.检查当前列表是否少于3项目
				if(items.children("li").length>=3) {
					return;
				}
				var drop_text=ui.draggable.text();
				//2.检查加入的是否是列名项如果不是则提示用户必须输入列名
				var column_flag=0;
//				jQuery("#table_head_real tr:eq(0) td").each();
//				if() {
//					
//					return;
//				}
//				//3.检查是否加入的是重复的项目如果是则提示用户不要加入重复的列名项
//				if() {
//					
//					return;
//				} 
				var li_length=jQuery(this).children("li").length+1;
				jQuery( "<li onmousedown='model001c.cakegram_li_mousedown(this,"+li_length+");' onmouseup='model001c.cakegram_li_mouseup(this,"+li_length+");'></li>" ).text( ui.draggable.text() ).appendTo( this );
			}
		}).sortable({
			sort: function() {
				jQuery("#cart ol").removeClass( "ui-state-default" );
				jQuery( this ).removeClass( "ui-state-default" );
			},
			cursorAt: { top: 25, left: -10 }
		});

		jQuery( "#table_head_real td" ).draggable({
			appendTo: "body",
			cursorAt: { top: 25, left: -10 },
			helper: "clone"
		});
	},
	
	colloctiongabbis : function() {
		jQuery("#rabbis_colloction").droppable({
			accept: function(event, ui){
				jQuery("#rabbis_colloction").css("background-image","url('/fair/ipad/rptdef/images/1.jpg')");
				jQuery( "#columns" ).sortable({
					revert: true,
					cursorAt: { top: 30, left: -10 }
				});
			},
			containment: "#table_head"
		});
	},
	
	/*
	 * 1.重置this.tojava
	 * 2.清除饼状图对象和柱状图
	 * 3.重新构造this.tojava的header和fmt属性
	 * */
	confirm_table_to_java_data: function() {
		//当用户点击确定按钮时候
		this.tojava={
			maxLines: 12,
			header: new Array(),
			fmt: new Array(),
			pie_charts: new Array(),
			column_charts: new Array()
		};
		
		//扫描所有列
		//如果没有子列获取列的类型填充fmt属性  同时填充header的  colspan属性为1 name属性填充为列名
		//如果有子列获取每个子列的类型填充fmt属性  同时填充header的  colspan属性为子列的个数 name属性填充为列名 subheader属性填充为子列名的集合
		jQuery(".table_head_column").each(function(i){
			var son_column_length = jQuery(this).children(".table_head_son_column").children(".son_cloumn").length;
			var column_val = null;
			var column_name = null;
			var object = null;
			var sub = null;
			if(son_column_length < 1) {
				column_val = jQuery(this).children(".sum_column").children("#column_name").children("select").val();
				column_name = jQuery(this).children(".sum_column").children("#column_name").children("input").val();
				object = {
				              "colspan" : 1,
				              "name"    : column_name
						 };
				this.tojava.fmt.push(column_val);
			}else { 
				sub = new Array();
				jQuery(this).children(".table_head_son_column").children(".son_cloumn").each(function(j){
					column_val = jQuery(this).children("input").val();
					sub.push(jQuery(this).children("input").val());
					this.tojava.fmt.push(column_val);
				});
				object = {
				              "colspan"   : 1,
				              "name"      : column_name,
				              "subheader" : sub
						     };
			}
			this.tojava.header.push(object);
		});
	},
	
	/*
	 * 1.同步maxlines属性
	 * 2.动态构造pie_charts和column_charts属性
	 * 3.发送给java
	 * */
	//czltodo...
	save : function(){
		//同步maxlines属性
		var maxlines = jQuery(".max_line_div_items>input").val();
		var object =  null;
//		
//		//扫描饼状图区域： 1.先填充colidx属性 2.根据用户输入的信息填充title和name 
		//czltodo.... 3.根据colidx在配置界面中搜索此列的类型并填充
		jQuery("#cart>ol>li").each(function(i){
			var txt = jQuery(this).children("input").eq(0).val();
			var colindex = jQuery(this).children("input").eq(1).val();
			object = {
						"unit"  :  [
						              "数量",
						              "个"
									]   , 
			            "title" : txt,   
                        "name"  : txt,    
                        "colidx":colindex		
					 };
			this.tojava.pie_charts.push(object);
		});
		
		//扫描柱状图区域: 1.unit暂时填充为["数量","个"] 2.name和title使用用户输入的报表名称 3.colidx使用用户拖进去的列的index 
		
		
	},
	
	enterSumbit : function(DOM,column_flag,column) {     
       var event=arguments.callee.caller.arguments[0]||window.event;    //消除浏览器差异     
       if(event.keyCode == 13){
    	   //清空所有空值字列名
    	   model001c.clear_son_column_empty_input();
    	   /*如果用户在列名处输入空值删除当前列名div并将用户配置的信息转变成table*/
    	   if(column_flag==1 && jQuery(DOM).val()==""){
    		   /*删除当前列名div*/
    		  // jQuery("#table_head_column_"+column).remove();
    		   /*将当前用户配置的信息转化为table*/
    		   model001c.cofrm_table_head();
    		   return;
    	   } 
    	   /*如果用户在子列名处输入空值*/
    	   if(column_flag==2 && jQuery(DOM).val()==""){
    		 //  if(jQuery("#table_head_column_"+column+">.table_head_son_column>.son_cloumn").length==1){
    		   /*如果子列名只剩下1个则删除整个子列名div*/
    		//	   jQuery("#table_head_column_"+column+">.table_head_son_column").html("");
    		//   }else{
    		   /*子列名如果还剩下2个或则2个以上则删除当前子列名div并减小宽度*/
    		//	   jQuery(DOM).parent().remove();
    			   //jQuery("#table_head_column_"+column+">.table_head_son_column").width(jQuery("#table_head_column_"+column+">.table_head_son_column").outerWidth()-143);
    			   //alert(jQuery(DOM).parent().html());
    		//   }
    		   /*如果当前输入子列名下没有别的列名新增一行*/
    		   if(jQuery(".table_head_column").length==column){
    			   model001c.add_new_column();
    		   }
    		   return;
    	   }
    	   model001c.add_son_div(column);
    	   //alert(jQuery(DOM).val());
       }
       this.edit_flag=1;
    },     
   
    /*清空所有没有子列名的输入div*/
    clear_son_column_empty_input : function() {
        /*清空所有没有子列名的输入div*/
    	jQuery(".table_head_column").each(function(i){
    		jQuery(this).children(".table_head_son_column").children(".son_cloumn").each(function(j){
    			var parent_parent_input=jQuery(this).parent();
    			var input=jQuery(this).children("input");
    			if("" == input.val() && parent_parent_input.children(".son_cloumn").length == 1){ 
    			/*if如果当前当前input为空且是唯一的子列名删除整个子列名列表div*/
    				parent_parent_input.remove();
    			}else if("" == input.val() && parent_parent_input.children(".son_cloumn").length > 1){ 
    			/*else如果当前的input为空但不是唯一的子列名删除当前子列名div*/
    				parent_parent_input.children(".son_cloumn:eq("+j+")").remove();
    			} 
    		});
    	});
    },
    
    /*清空所有列名没有输入的的div*/
    clear_column_empty_input : function() {
    	
    },
    
	/*清空表头*/
	cleartable_head : function() {
		jQuery("#table_head").html("");
	},
	
	histogram_li_mousedown : function(DOM,index) {
		jQuery(DOM).css("background-color","red");
		this.histogram_drag_index=index;
		this.histogram_drag_DOM=DOM;
	},
	
	histogram_li_mouseup : function(DOM,index) {
		jQuery(DOM).css("background-color","white");
	},
	
	cakegram_li_mousedown : function(DOM,index) {
		jQuery(DOM).css("background-color","red");
		this.cakegram_index=index;
		this.cakegram_drag_DOM=DOM;
	},
	
	cakegram_li_mouseup : function(DOM,index) {
		jQuery(DOM).css("background-color","white");
	},
	
	mouse_move_rabbis_colloction : function() {
		if(this.mouse_drag_index!=0 || this.histogram_drag_index!=0 || this.cakegram_index!=0){
			jQuery("#rabbis_colloction").css("background-image","url('/fair/ipad/rptdef/images/1.jpg')");
		}
	},
	
	mouse_out_rabbis_colloction: function() {
		jQuery("#rabbis_colloction").css("background-image","url('/fair/ipad/rptdef/images/2.jpg')");
	},
	
	mouse_up_rabbis_colloction : function() {
		jQuery("#rabbis_colloction").css("background-image","url('/fair/ipad/rptdef/images/2.jpg')");
		jQuery("#table_head_column_"+this.mouse_drag_index).css("background-color","white");
		jQuery("#table_head_column_"+this.mouse_drag_index).remove();
		
		jQuery(this.histogram_drag_DOM).remove();
		jQuery(this.cakegram_drag_DOM).remove();
		
		this.edit_flag=1;
		this.mouse_drag_index=0;
		this.cakegram_index=0;
		this.histogram_drag_index=0;
	},
	
	mouse_up_all_colunms_colloction : function() {
		jQuery("#table_head_column_"+this.mouse_drag_index).css("background-color","white");
		jQuery("#rabbis_colloction").css("background-image","url('/fair/ipad/rptdef/images/2.jpg')");
		jQuery(this.cakegram_drag_DOM).css("background-color","white");
		jQuery(this.histogram_drag_DOM).css("background-color","white");
		this.cakegram_drag_DOM=null;
		this.histogram_drag_DOM=null;
		this.histogram_drag_index=0;
		this.cakegram_index=0;
		this.mouse_drag_index=0;
	},
	
	cofig_table_head : function() {
		model001c.cleartable_head();
		jQuery("#table_head").append("<div id='rabbis_colloction' onmouseup='model001c.mouse_up_rabbis_colloction();' onmouseout='model001c.mouse_out_rabbis_colloction();' onmousemove='model001c.mouse_move_rabbis_colloction();' class='rabbis_colloction'></div>");
		jQuery("#table_head").append("<div id='all_colunms'  class='all_colunms'></div>");
		jQuery("#all_colunms").append("<div class='table_head_tag_a'><a href='javascript:model001c.cofrm_table_head();'>确定</a></div>");
		jQuery("#all_colunms").append("<div id='columns'></div>");
		//如果要添加增加按钮请释放如下代码
		//jQuery("#columns").append("<div class='table_head_column' style='clear:both;' onmousedown='model001c.colum_mouse_down(1);' onmouseup='model001c.column_mouse_up(1);' id='table_head_column_1'><div class='sum_column'><div id='column_name' style='float:left;'>列名:<input onkeydown='model001c.enterSumbit(this,1,1);' size='8' /><select><option value='0'>字符</option><option value='1'>数字</option><option value='2'>百分比</option></select></div></div><div class='table_head_son_column'></div><div class='colum_add_tag'><a href='javascript:model001c.add_son_div(1);'>增加</a></div></div>");
		jQuery("#columns").append("<div class='table_head_column' style='clear:both;' onmousedown='model001c.colum_mouse_down(1);' onmouseup='model001c.column_mouse_up(1);' id='table_head_column_1'><div class='sum_column'><div id='column_name' style='float:left;'>&nbsp;&nbsp;列名:<input onkeydown='model001c.enterSumbit(this,1,1);' size='8' /><select><option value='0'>字符</option><option value='1'>数字</option><option value='2'>百分比</option></select></div></div><div class='table_head_son_column'></div></div>");
		jQuery("#all_colunms").append("<div id='add_new_column_tag_a'><a href='javascript:model001c.add_new_column();'>新增一行</a></div>");
		/*使每一行都可以drag和drop*/
		model001c.draggableandsortable();
		model001c.colloctiongabbis();
		jQuery("input").mousedown(function(e){e.stopPropagation();})
		jQuery("select").mousedown(function(e){e.stopPropagation();})
		jQuery(".table_head_son_column").mousedown(function(e){e.stopPropagation();})
		jQuery(".colum_add_tag").mousedown(function(e){e.stopPropagation();})
	},
	
	/*在指定行触发mousedown事件*/
	colum_mouse_down : function(index) {
		jQuery("#table_head_column_"+index).css("background-color","red");
		this.mouse_drag_index=index;
	},
	
	/*在指定行触发mouseup事件*/
	column_mouse_up : function(index) {
		jQuery("#table_head_column_"+index).css("background-color","white");
	},
	
	/**
	 * 添加柱状图
	 */
	add_column_chart : function() {
		jQuery(".column_ol_div").each(function(i){
			if(jQuery(this).css("display") == "block"){
				//1.检查用户是否输入的报表名称 2.检查用户是否添加了li
				if(jQuery(this).children("input").val() == "") {
					alert("请输入柱状图报表名称!");
					return;
				}
				if(jQuery(this).children("ol").children("li").length < 1) {
					alert("至少添加一项才能保存!");
					return;
				}
				jQuery(this).hide();
				jQuery(this).after("<div class='column_ol_div'>报表名称:<input type='text'></input><select><option value='0'>数量</option><option value='1'>货币</option><option value='2'>百分比</option></select><ol style='height:160px;'></ol></div>");
				var report_name = jQuery(this).children("input").val();
				var len = jQuery(".column_chart_select>select>option").length;
				jQuery(".column_chart_select>select").append("<option value='"+len+"'>"+report_name+"</option>");
				model001c.dragforhistogram();
				alert("添加成功!");
			};	
		});
	},
	
	add_new_column : function() {
		model001c.clear_son_column_empty_input();
		var column_length=jQuery(".table_head_column").length;
		jQuery("#add_new_column_tag_a").remove();
		//如果要添加增加按钮请释放如下代码
		//jQuery("#columns").append("<div class='table_head_column' style='clear:both;' onmousedown='model001c.colum_mouse_down(1);' onmouseup='model001c.column_mouse_up(1);' id='table_head_column_1'><div class='sum_column'><div id='column_name' style='float:left;'>列名:<input onkeydown='model001c.enterSumbit(this,1,1);' size='8' /><select><option value='0'>字符</option><option value='1'>数字</option><option value='2'>百分比</option></select></div></div><div class='table_head_son_column'></div><div class='colum_add_tag'><a href='javascript:model001c.add_son_div(1);'>增加</a></div></div>");
		jQuery("#columns").append("<div class='table_head_column' onmousedown='model001c.colum_mouse_down("+(column_length+1)+");' onmouseup='model001c.column_mouse_up("+(column_length+1)+");' id='table_head_column_"+(column_length+1)+"'><div class='sum_column'><div id='column_name' style='float:left;'>&nbsp;&nbsp;列名:<input onkeydown='model001c.enterSumbit(this,1,"+(column_length+1)+");' size='8' /><select><option value='0'>字符</option><option value='1'>数字</option><option value='2'>百分比</option></select></div></div><div class='table_head_son_column'></div></div>");
		jQuery(".table_head_column:last>.sum_column>#column_name>input").focus();
		jQuery("#all_colunms").append("<div id='add_new_column_tag_a'><a href='javascript:model001c.add_new_column();'>新增一行</a></div>");
		jQuery("input").mousedown(function(e){e.stopPropagation();})
		jQuery("select").mousedown(function(e){e.stopPropagation();})
		jQuery(".table_head_son_column").mousedown(function(e){e.stopPropagation();})
		jQuery(".colum_add_tag").mousedown(function(e){e.stopPropagation();})
	},
	
	add_son_div : function(column) {
		model001c.clear_son_column_empty_input();
		var sum_column_length=jQuery("#table_head_column_"+column+">.table_head_son_column>.son_cloumn").length;
		if(jQuery("#table_head_column_"+column+">.table_head_son_column").length == 0) {
			jQuery("#table_head_column_"+column+">.sum_column").after("<div class='table_head_son_column'></div>");
		}
		if(jQuery("#table_head_column_"+column+">.table_head_son_column").html()==""){
			jQuery("#table_head_column_"+column+">.table_head_son_column").append("<div id='son_column_text' style='float:left;'>子列名:</div><div class='son_cloumn' style='float:left;'><input onkeydown='model001c.enterSumbit(this,2,"+column+");' size='8'/><select onchange='model001c.user_select_change(this);'><option value='0'>字符</option><option value='1'>数字</option><option value='2'>百分比</option></select></div>");
			jQuery(".table_head_column>.table_head_son_column>.son_cloumn>input:last").focus();
		}else{
			if(sum_column_length%2==0 && sum_column_length>0) {
				jQuery("#table_head_column_"+column+">.table_head_son_column").append("<div class='son_cloumn morethantwo' style='float:left;'><input onkeydown='model001c.enterSumbit(this,2,"+column+");' size='8'/><select  onchange='model001c.user_select_change(this);'><option value='0'>字符</option><option value='1'>数字</option><option value='2'>百分比</option></select></div>");
			}else {
				jQuery("#table_head_column_"+column+">.table_head_son_column").append("<div class='son_cloumn' style='float:left;'><input onkeydown='model001c.enterSumbit(this,2,"+column+");' size='8'/><select  onchange='model001c.user_select_change(this);'><option value='0'>字符</option><option value='1'>数字</option><option value='2'>百分比</option></select></div>");
			}
			jQuery(".table_head_column>.table_head_son_column>.son_cloumn>input:last").focus();
		};
		model001c.draggableandsortable();
		jQuery("input").mousedown(function(e){e.stopPropagation();})
		jQuery("select").mousedown(function(e){e.stopPropagation();})
		jQuery(".table_head_son_column").mousedown(function(e){e.stopPropagation();})
		jQuery(".colum_add_tag").mousedown(function(e){e.stopPropagation();})
	},
	
	/*当用户的选择字符、百分比、数字*/
	user_select_change : function(DOM) {
		//0.字符  1.数字  2.百分比
		var input=jQuery(DOM);
		if(input.val() == 1 || input.val() == 2) {
			if(input.parent().children(".div_dot").length == 0) {
				input.parent().append("<div class='div_dot' style='float:left;'><input onkeydown='model001c.enterSumbit(this,2,1);' value='0' class='input_dot' size='2'></input>位小数</div>");
				input.parent().children(".div_dot").children("input").focus();
			}
		}else {
			input.parent().children(".div_dot").remove();
		}
		jQuery("input").mousedown(function(e){e.stopPropagation();})
	},
	
	cofrm_table_head : function() {
		model001c.clear_son_column_empty_input();
		jQuery("#all_colunms>.table_head_tag_a").html("<a href='javascript:model001c.convert_to_table_head_edit();'>配置</a>");
		/*将用户的配置信息转变为表格*/
		model001c.convert_to_table_head();
	},
	
	/*将用户配置的信息转为不可编辑状态*/
	convert_to_table_head : function() {
		/*如果用户不是首次进入且没有修改过*/
		if(jQuery("#table_head_real").length>0 && this.edit_flag!=1){
			jQuery("#columns").css("display","none");
			jQuery("#add_new_column_tag_a").css("display","none");
			jQuery("#table_head_real").css("display","block");
			return;
		}
		jQuery("#table_head_real").remove();
		jQuery("#columns").css("display","none");
		jQuery("#add_new_column_tag_a").css("display","none");
		jQuery("#all_colunms").append("<table align='center' id='table_head_real' class='table_head_real' cellspacing='1'  border='1'></table>");
		/*读取配置信息*/
		
		//读取并设置列名
		jQuery(".table_head_column").each(function(i){
			//统计子列名的个数
			var son_length=jQuery(this).children(".table_head_son_column").children(".son_cloumn").length;
			//获取列名
			var column_name=jQuery(this).children(".sum_column").children("#column_name").children("input").val();
			//创建列名
			var tr_1=jQuery("<tr></tr>");
			if(jQuery("#table_head_real tr").length>=1){
			//如果已经创建了tr则读取当前表头
				tr_1=jQuery("#table_head_real tr:eq(0)");
			}
			if(son_length==0){
			//如果没有子列名
				jQuery("#table_head_real").append(tr_1);
				tr_1.append("<td rowspan='2'>"+column_name+"</td>");
			}else{
				jQuery("#table_head_real").append(tr_1);
				tr_1.append("<td colspan='"+son_length+"'>"+column_name+"</td>");
			}
		});
		
		var tr_2=jQuery("<tr></tr>");
		jQuery("#table_head_real").append(tr_2);
		
		/*读取并设置子列名*/
		jQuery(".table_head_column").each(function(i){
			jQuery(this).children(".table_head_son_column").children(".son_cloumn").each(function(j){
			//获取子列名
			var column_son_name=jQuery(this).children("input").val();
			tr_2.append("<td>"+column_son_name+"</td>");
			});
		});
		model001c.dragforhistogram();
		this.edit_flag=0;
	},
	
	/*将用户设置的信息在转为可编辑状态*/
	convert_to_table_head_edit : function() {
		jQuery("#all_colunms>.table_head_tag_a").html("<a href='javascript:model001c.cofrm_table_head();'>确定</a>");
		if(jQuery("#table_head_real").length>0){
			jQuery("#columns").css("display","block");
			jQuery("#add_new_column_tag_a").css("display","block");
			jQuery("#table_head_real").css("display","none");
			return;
		}
		model001c.cofig_table_head();
	}
	
};
model001c = new Model001Control();