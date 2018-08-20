/**
 * CopyRright (c)2015: lifecycle Project: Ordering - Board Comments: 支持显示图片 Create
 * Date：2015-06-25
 * 
 * @version: 1.0
 * @author: wuqiong
 */

var Com_6 = Class.create();
Com_6.prototype = {

	initialize : function() {
		this.params = null;
		this.data = null;
		//显示图片数据的列号
		this.img_col = null;
		//显示图片数据的位置；
		this.img_col_val = null;
		//显示图片的列号
		this.img_real_col = null;
		//显示图片的位置；
		this.img_real_col_val = null;
		this.idx_array = new Array();
	},
	/*
	 * params:{
	 * 		0:[7]  	//显示图片的列号；
	 * 		1:[2]		//款号或者款色号；
	 * }
	 */
	init : function(params) {
		if (null == params || undefined == params) {
			alert("组件引用错误:type=7");
		}
		this.params = params;
		if(undefined == rpt.data){
			alert("传入数据的格式错误：没有data对象");
		}
		this.data = rpt.data;
		
		this.img_col = this.params[1][0];
		this.img_col_val = this.data[this.img_col];
		this.img_real_col = this.params[0][0];
		this.img_real_col_val = this.data[this.img_real_col];
		this.imgurl = "<img class='Pdtimg' src='/servlets/binserv/Pdtimg?Pdtid'>";
		
	},

	/**
	 * 表格的默认数据可以通过rpt.data获取。 此数据只读不写。
	 */
	draw : function() {
		//将pdtid转换为相应的url地址；
		for(var i = 0;i < this.img_col_val.length;i++){
			var pdtid = this.img_col_val[i];
			var url = this.imgurl.replace("Pdtid",pdtid);
			this.img_real_col_val[i] = url;
		}
		//所有小计行的行号；
		this.judgeTotal();
		for(var j = 0;j < this.idx_array.length;j++){
			var total_idx = this.idx_array[j];
			this.img_real_col_val[total_idx] = "";
		}
		rpt.data = this.data;
		
	},
	/**
	 * 所有小计行的行号；
	 */
	judgeTotal : function(){
		for(var i = 0;i < this.data[0].length;i++){
			if("" == this.data[0][i] || "小计" == this.data[0][i]){
				this.idx_array.push(i); 
			}
		}
	}
};
Com_6.draw = function(params) {
	var com = new Com_6();
	com.init(params);
	com.draw();
	return com;
};
