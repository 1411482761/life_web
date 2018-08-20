/**
 * CopyRright (c)2015: lifecycle Project: Ordering - Board Comments: 支持行小计和行合计
 * Create Date：2015-02-02
 * 
 * @version: 1.0
 * @author: wuqiong
 */

var Com_0 = Class.create();
Com_0.prototype = {
	
	initialize: function() {
		this.params = null;
		this.data = null;
		
		// 以哪一列来计算小计；
		this.calc_column = 0;
		// 通过该列的值来判断是否要插入小计行；
		this.calc_column_val = null;
		
		//真正计算小计的列数；
		this.real_calc_column = null;
		this.paramsSize = 0;
		this.idx_total = new Array();
	},
	
	init: function(params,javaData){
		if(null == params || undefined == params){
			alert("组件引用错误:type=0");
		}
		this.params = params;
		if(undefined == javaData.data){
			alert("传入数据的格式错误：没有data对象");
		}
		this.data = javaData.data;
		this.calc_column = this.params[0][0];
		this.calc_column_val = this.data[this.calc_column];
		
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
	draw: function (javaData){
//		var flag = 0; //需要加的变量；
		for(var i = 0;i < this.calc_column_val.length;i++){
				 var sum_times = this.getTimes(i,this.calc_column_val);
				 var lastpoint = this.calc_column_val[i - sum_times + 1];
				 var midpoint = this.calc_column_val[i];
				 var insertpoint = this.calc_column_val[i+1];
				 
		  if(midpoint != insertpoint && midpoint !="小计" && insertpoint !="小计" && midpoint != "" || lastpoint == ""){
			 
		  	for(var j = 0;j < this.data.length;j++){
		  			if(j == this.calc_column){
		  				this.idx_total.push(i + 1);
		  				this.calc_column_val.splice(i+1, 0, "小计");
		  			}else{
		  				this.data[j].splice(i+1, 0, "");
		  						var a1 = i+1;
									for(var k = 0;k < this.real_calc_column.length;k++){
										if(j == this.real_calc_column[k]){
											var sum = 0;
											var flag = this.getIdx(a1, this.calc_column_val);
										  for(var s = a1 - flag;s < a1; s++){
							
													var temp = this.data[this.real_calc_column[k]][s];
													if("" == temp || null == temp){
														temp = 0;
													}
													sum += Number(temp);
													
											}
											sum = sum/sum_times;
											this.data[this.real_calc_column[k]].splice(a1, 1,sum);
										}
									}
		  			}
		  		}
	//	  		flag = i+2;	
		  }	
		  
		}
		
	//	alert(Object.toJSON(this.data));
		javaData.data = this.data;
		var rptname = javaData.rptname;
		origins[rptname] = javaData;
	},


	/**
	 * 已经计算过几次小计；
	 * @param station
	 * @param calc_column_val
	 * @returns {sum_times}
	 */
	getTimes: function(station,calc_column_val){
		var sum_times = 1;
		for(var i = station; i >0 ; i--){
 		var blankVal = calc_column_val[i];
 		if("" == blankVal){
 			sum_times++;
 			}else{
 				break;
 			}
 		
		}
		return sum_times;
	},
	/**
	 * 找出上一个小计的位置
	 * @param idx
	 * @param calc_column_val
	 * @returns {Number}
	 */
	getIdx: function(idx,calc_column_val){
		var flag = 0;
		var flag1 = 0;
		for(var j = 0;j<this.idx_total.length;j++){
			if(idx == this.idx_total[j] && j != 0){
					flag1 = this.idx_total[j-1];		
			}
		}
		
		for(var i = idx-1;i >= flag1;i--){
			var blankVal = calc_column_val[i];
			if("" != blankVal && "小计" != blankVal){
				flag++;
			}else{
				break;
			}
		}
		return flag;
	}
		

};
Com_0.draw = function(params,javaData){
	var com = new Com_0();
	com.init(params,javaData);
	com.draw(javaData);
	return com;
};
