/**
 * CopyRright (c)2015: lifecycle Project: Ordering - Board Comments: 支持列合计 Create
 * Date：2015-02-02
 * 
 * @version: 1.0
 * @author: wuqiong
 */

var Com_2 = Class.create();
Com_2.prototype = {

	initialize : function() {
		this.params = null;
		this.data = null;
		
		// 真正计算列的列数；
		this.real_calc_column = null;
		// 需要插入列合计的那一列；
		this.total_column = null;
		//需要列合计的值；
		this.total_column_val = null;

	},

	init : function(params) {
		if (null == params || undefined == params) {
			alert("组件引用错误:type=1");
		}
		this.params = params;
		if(undefined == rpt.data){
			alert("传入数据的格式错误：没有data对象");
		}
		this.data = rpt.data;
		
		this.total_column = this.params[0][0];
		this.total_column_val = this.data[this.total_column];
		
		var col_idxs = new Array();
		for ( var i = 1; i <getObjectSize(params); i++) {
			for ( var j = 0; j < this.params[i].length; j++) {
				col_idxs.push(this.params[i][j]);
			}
		}
		this.real_calc_column = col_idxs;
	},

	/**
	 * 表格的默认数据可以通过rpt.data获取。 此数据只读不写。
	 */
	draw : function() {
		for(var i = 0; i < this.total_column_val.length;i++){
			var sum = this.getSum(i,this.real_calc_column,this.data);
			this.total_column_val[i] = sum;
		}
	rpt.data = this.data;
		
	},

	/**
	 * 求出要计算几列的总和；
	 * 
	 * @param p,当前需要写入列合计的位置；
	 * @param real_calc_column，具体需要计算合计的列数；将需要计算的列数去掉$,￥，%等格式；
	 * @param data
	 * @returns {sum}
	 */
	getSum: function(p,real_calc_column,data){
		var sum = 0;
		var hs_fmt = "";
		var hs_fmt1 = "";
		var hs_fmt2 = "";
		for(var i = 0;i < real_calc_column.length;i++){
			var temp = data[real_calc_column[i]][p];
			if("" == temp || null == temp){
				temp = 0;
			}
			
			temp = temp.toString();
			hs_fmt = temp.indexOf("$");
			hs_fmt1 = temp.indexOf("￥");
			hs_fmt2 = temp.indexOf("%");
			
			if(hs_fmt > -1){
				temp = temp.substr(hs_fmt+1);
			}
			if(hs_fmt1 > -1){
				temp = temp.substr(hs_fmt1+1);
			}
			if(hs_fmt2 > -1){
				temp = temp.substr(0,hs_fmt2);
			}
			sum += Number(temp);
		}
		sum = sum.toString();
		var sum_ = 0;
		if(sum.indexOf(".") > -1){
			sum_ = new Number(sum);
			sum_ = sum_.toFixed(2);
			if(hs_fmt2 > -1){
				sum_ = Number(sum_).format("0.0%");
			}
			return sum_;
		}else{
			sum_ = new Number(sum);
			if(hs_fmt2 > -1){
				sum_ = Number(sum_).format("0.0%");
			}
			return sum_;
		}
		
	}

	


};
Com_2.draw = function(params) {
	var com = new Com_2();
	com.init(params);
	com.draw();
	return com;
};
