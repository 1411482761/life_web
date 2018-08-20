/**
 * CopyRright (c)2015: lifecycle Project: Ordering - Board Comments: 支持报表的转取 Create
 * Date：2015-07-07
 * 
 * @version: 1.0
 * @author: wuqiong
 */

var Com_7 = Class.create();
Com_7.prototype = {

	initialize : function() {
		this.params = null;
		this.data = null;
		//支持转取的列号
		this.dump_col = null;
		//显示转取的值；
		this.dump_col_val = null;
		//小计行的行号
		this.idx_array = new Array();
		//该报表的纵轴个数；
		this.colspan = -1;
		this.rptname = null;
	},
	/*
	 * params:{
	 * 		0:[7]  	//显示跳转信息的列号；
	 * }
	 */
	init : function(params,javaData) {
		if (null == params || undefined == params) {
			alert("组件引用错误:type=7");
		}
		this.params = params;
		if(undefined == javaData.data){
			alert("传入数据的格式错误：没有data对象");
		}
		this.data = javaData.data;
		this.colspan = javaData.header.lefttop.colspan;
		this.dump_col = this.params[0][0];
		this.rptname = javaData.rptname;
		this.dump_col_val = this.data[this.dump_col];
		
	},

	/**
	 * 表格的默认数据可以通过rpt.data获取。 此数据只读不写。
	 */
	draw : function(javaData) {
		//将pdtid转换为相应的url地址；
		for(var i = 0;i < this.dump_col_val.length;i++){
//			//跳转的纵轴的数据；
//			var jumpArray = this.getVerticalData(i);
			var imgurl = "<img class='Dumpimg' src='/fair/ipad/img/dump.png' onclick=rpt.jumprpt(this,'"+this.rptname+"')>";
			//获得每一行纵轴的数据，并作为参数传个imgurl;
			this.dump_col_val[i] = imgurl;
		}
		//所有小计行的行号；
		this.judgeTotal();
		for(var j = 0;j < this.idx_array.length;j++){
			var total_idx = this.idx_array[j];
			this.dump_col_val[total_idx] = "";
		}
		//rpt.data = this.data;
		javaData.data = this.data;
		var rptname = javaData.rptname;
		origins[rptname] = javaData;
		
	},
	/*
	 * 获得每一行纵轴的数据；
	 */
	getVerticalData: function(idx){
		var jumpArray = new Array();
		for(var i = 0; i < this.colspan;i++){
			var temp = this.data[i][idx];
			jumpArray.push(temp);
		}
		return jumpArray;
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
Com_7.draw = function(params,javaData) {
	var com = new Com_7();
	com.init(params,javaData);
	com.draw(javaData);
	return com;
};
