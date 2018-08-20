/**
 * CopyRright (c)2015: lifecycle Project: Ordering - Board Comments: 支持差额计算 Create
 * Date：2015-02-02
 * 
 * @version: 1.0
 * @author: wuqiong
 */

var Com_3 = Class.create();
Com_3.prototype = {

	initialize : function() {
		this.params = null;
		this.data = null;
		//计算公式；
		this.formula = null;
		//写入差值的一列；
		this.sub_col = null;
		//写入差值的具体值；
		this.sub_col_val = null;
		//真正计算差值的列数
		this.real_calc_column = null;
		
	},

	init : function(params,javaData) {
		if (null == params || undefined == params) {
			alert("组件引用错误:type=3");
		}
		this.params = params;
		if(undefined == javaData.data){
			alert("传入数据的格式错误：没有data对象");
		}
		this.data = javaData.data;
		this.formula = javaData.formula;
		this.sub_col = this.params[0][0];
		this.sub_col_val = this.data[this.sub_col];
		if(this.sub_col_val == undefined){
			alert("data中没有该公式计算结果列");
		}
		
		var col_idxs = new Array();
		for ( var i = 1; i <getObjectSize(params); i++) {
			for ( var j = 0; j < this.params[i].length; j++) {
				col_idxs.push(this.params[i][j]);
			}
		}
		this.real_calc_column = col_idxs;
		
	},

	/**
	 * 表格的默认数据可以通过javaData.data获取。 此数据只读不写。
	 */
	draw : function(javaData) {
		for(var i = 0;i < this.sub_col_val.length;i++){
			var flag = 0;
			var formula_val = this.formula;
			var temp = 0;
			var isZero = false;
				for(var j = 0;j < this.real_calc_column.length;j++){
						temp = this.data[this.real_calc_column[j]][i];
						temp = this.removeFmt(temp);
						temp = Number(temp);
						if("" == temp || null == temp){
							temp = 0;
						}
						if(0 == temp){
							var fmv_len = this.getIdx(formula_val,flag);
							var temp_formula = formula_val.substr(fmv_len-1,1);
							if("/" == temp_formula){
								temp = 1;
								isZero = true;
							}
						}
						formula_val = this.getEval(temp, formula_val, flag);
						flag += 1;
				}	
				if(isZero){
					formula_val = "0 * 0";
					this.sub_col_val[i] = eval(formula_val);
				}else{
					this.sub_col_val[i] = eval(formula_val);
				}
		}
		
		//rpt.data = this.data;
		javaData.data = this.data;
		var rptname = javaData.rptname;
		origins[rptname] = javaData;
	},
	/**
	 * 用数据将公式中的a,b,c,d,e替换
	 * @param temp
	 * @param formula_val
	 * @param flag
	 * @returns {String}
	 */
	getEval: function(temp,formula_val,flag){
		var formula_val1 = "";
		if(flag == 0){
			formula_val1 = formula_val.replace("a",temp);
		}
		if(flag == 1){
			formula_val1 = formula_val.replace("b",temp);
		}
		if(flag == 2){
			formula_val1 = formula_val.replace("c",temp);
		}
		if(flag == 3){
			formula_val1 = formula_val.replace("d",temp);
		}
		if(flag == 4){
			formula_val1 = formula_val.replace("e",temp);
		}
		return formula_val1;
	},
	/**
	 * 获得a,b,c,d,e的位置
	 * @param formula_val
	 * @param flag
	 * @returns {Number}
	 */
	getIdx: function(formula_val,flag){
		var idx = 0;
		if(flag == 0){
			idx = formula_val.indexOf("a");
		}
		if(flag == 1){
			idx = formula_val.indexOf("b");
		}
		if(flag == 2){
			idx = formula_val.indexOf("c");
		}
		if(flag == 3){
			idx = formula_val.indexOf("d");
		}
		if(flag == 4){
			idx = formula_val.indexOf("e");
		}
		return idx;
	},
	/**
	 * 去掉计算数据的%、$、￥格式。
	 * @param temp
	 * @returns
	 */
	removeFmt: function(temp){
		if("number" == typeof temp){
			temp = temp.toString();
		}
		var hasp = temp.indexOf("%");
		var hasd = temp.indexOf("$");
		var hasm = temp.indexOf("￥");
		var temp_val = "";
		if(hasp > -1){
			temp_val = temp.substr(0,temp.length-1);
			return temp_val;
		}
		if(hasd > -1){
			temp_val = temp.substr(hasd+1);
			return temp_val;
		}
		if(hasm > -1){
			temp_val = temp.substr(hasm+1);
			return temp_val;
		}
		return temp;
	}
};
Com_3.draw = function(params,javaData) {
	var com = new Com_3();
	com.init(params,javaData);
	com.draw(javaData);
	return com;
};
