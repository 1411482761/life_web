/**
 * CopyRright (c)2015: lifecycle Project: Ordering - Board Comments: 支持累加 Create
 * Date：2015-02-02
 * 
 * @version: 1.0
 * @author: wuqiong
 */

var Com_5 = Class.create();
Com_5.prototype = {

	initialize : function() {
		this.params = null;
		this.data = null;
		//插入累加的列号；
		this.cumulative_col = null;
		//插入累加的位置；
		this.cumulative_col_val = null;
		//基于那一列计算累加；
		this.calc_column = 0;
		//通过该列的值来判断小计行的具体位置；
		this.calc_column_val = null;
		//计算累加具体的值的列数；
		this.real_calc_column = null;
		//需要累加的值
		this.real_calc_column_val = null;
		this.idx_array = new Array();
	},

	init : function(params,javaData) {
		if (null == params || undefined == params) {
			alert("组件引用错误:type=5");
		}
		this.params = params;
		if(undefined == javaData.data){
			alert("传入数据的格式错误：没有data对象");
		}
		this.data = javaData.data;
		
		this.cumulative_col = this.params[0][0];
		this.cumulative_col_val = this.data[this.cumulative_col];
		this.calc_column = this.params[2][0];
		
		this.real_calc_column = this.params[1];
		this.real_calc_column_val = this.data[this.real_calc_column[0]];
		
	},

	/**
	 * 表格的默认数据可以通过javaData.data获取。 此数据只读不写。
	 */
	draw : function(javaData) {
			this.calc_column_val = this.data[this.calc_column];
			for(var i = 0;i < this.calc_column_val.length;i++){
				var sum_times = this.getTimes(i,this.calc_column_val);
				var lastpoint = this.calc_column_val[i - sum_times + 1];
				var midpoint = this.calc_column_val[i];
				var insertpoint = this.calc_column_val[i+1];
				
				if(midpoint != insertpoint && midpoint !="小计" && insertpoint !="小计" && midpoint != "" || lastpoint == ""){
					for(var j = 0;j < this.data.length;j++){
						if(j == this.calc_column){
							this.idx_array.push(i + 1);
							this.calc_column_val.splice(i+1, 0, "小计");
						}else{
							this.data[j].splice(i+1, 0, "");
							var a1 = i+1;
							for(var k = 0;k < this.real_calc_column.length;k++){
								if(j == this.real_calc_column[k]){
									var sum = 0;
									var flag = this.getIdx(a1, this.calc_column_val,this.idx_array);
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
				}	
				
			}
			if(0 == this.idx_array.length){
				for(var i = 0;i < this.calc_column_val.length;i++){
					if("小计" == this.calc_column_val[i]){
						this.idx_array.push(i);
					}	
				}
			}
		this.cumulativeData(this.real_calc_column_val,this.idx_array,this.cumulative_col_val);
		
		if("" != this.idx_array){
			var flag = 0;
			for(var k = 0;k < this.idx_array.length;k++){
				for(var g = 0;g < this.data.length;g++){
				this.data[g].splice(this.idx_array[k] - flag,1);
				}
				flag++;
			}
		}
		//rpt.data = this.data;
		javaData.data = this.data;
		var rptname = javaData.rptname;
		origins[rptname] = javaData;
	},
	/**
	 * 用来获得已经计算过几次小计
	 * @param station
	 * @param calc_column_val
	 * @returns {Number}
	 */
	getTimes: function(station,calc_column_val){
		var flag = 1;
		 for(var i = station; i >0 ; i--){
		 		var blankVal = calc_column_val[i];
		 		if("" == blankVal){
		 			flag++;
		 			}else{
		 				break;
		 			}
		 		
		 	}
		 	return flag;
	},
	/**
	 * 获得此块小计之间数据的长度
	 * @param idx 当前小计行的位置
	 * @param calc_column_val 计算累加的依据列
	 * @param idx_array 记录小计行的行号
	 * @returns {Number}
	 */
	getIdx: function(idx,calc_column_val,idx_array){
		var flag = 0;
		var flag1 = 0;
		for(var j = 0;j<idx_array.length;j++){
			if(idx == idx_array[j] && j != 0){
					flag1 = idx_array[j-1];		
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
	},
	/**
	 * 计算累加
	 * @param real_calc_column_val真正计算累加的列数
	 * @param idx_array 记录小计行的行号
	 * @param cumulative_col_val 累加的值填写的位置
	 */
	cumulativeData: function(real_calc_column_val,idx_array,cumulative_col_val){
		//记录临时相加的值；
			var idx = 0;
			var lastIdx = 0;
			for(var j = 0;j < idx_array.length;j++){
			var temp_arr = 0;
				idx = idx_array[j];
				if(0==j){
				lastIdx = 0;
			}else{
				lastIdx = idx_array[j - 1];
			}	
			if(lastIdx != 0){
					lastIdx = lastIdx + 1;
			}
			for(var i=lastIdx;i < idx;i++){
				
				var temp_val = this.removeFmt(real_calc_column_val[i]);
				temp_arr += Number(temp_val);	
				
				cumulative_col_val[i] =  temp_arr;
			}

		}
		
	},
	/**
	 * 去除掉累加数字的%、$、￥格式
	 * @param temp 当前需要累加的值。
	 * @returns
	 */
	removeFmt:function(temp){
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
Com_5.draw = function(params,javaData) {
	var com = new Com_5();
	com.init(params,javaData);
	com.draw(javaData);
	return com;
};
