/**
 * CopyRright (c)2015: lifecycle Project: Ordering - Board Comments: 支持占比 Create
 * Date：2015-02-02
 * 
 * @version: 1.0
 * @author: wuqiong
 */

var Com_1 = Class.create();
Com_1.prototype = {

	initialize : function() {
		this.params = null;
		this.data = null;
		// 以哪一列来计算小计；
		this.calc_column = 0;
		// 通过该列的值来判断是否要插入小计行；
		this.calc_column_val = null;
		// 真正计算占比的列数；
		this.real_calc_column = null;
		// 需要插入占比的那一列；
		this.prop_column = 0;

		// 判断是否根据层级来计算占比(undefined比较不根据层级来计算占比)；
		this.level = 0;
		// 判断以哪个层级来计算占比，并且给该层级添加小计；
		this.levelVal = null;
		this.fmt = null;
		this.idx_total = new Array();
		//小计行的位置大于层级行的位置
		this.del_array = new Array();
	},

	init : function(params,javaData) {
		if (null == params || undefined == params) {
			alert("组件引用错误:type=1");
		}
		this.params = params;
		if(undefined == javaData.data){
			alert("传入数据的格式错误：没有data对象");
		}
		this.data = javaData.data;
		
		
		this.calc_column = this.params[1][0];
		this.calc_column_val = this.data[this.calc_column];
		this.real_calc_column = this.params[2];
		this.prop_column = this.params[0][0];
		this.fmt = javaData.fmt[this.prop_column];
		
		this.level = this.params[3];
		if(undefined != this.level){
			this.levelVal = this.data[this.level];
		}
	},

	/**
	 * 表格的默认数据可以通过javaData.data获取。 此数据只读不写。
	 */
	draw : function(javaData) {
		var total = 0;
		var flag = 0; // 判断从什么地方开始计算小计；

		if(undefined == this.level){
			var sum_times = this.getTimes(this.calc_column_val.length - 1,this.calc_column_val);
			total = this.getSum(this.calc_column_val, this.real_calc_column, this.data)/sum_times;
			this.getProp(this.calc_column_val.length, this.real_calc_column, total,this.prop_column, this.data,javaData);
		}else{
			for(var i = 0; i < this.calc_column_val.length; i++){
				var sum_times = this.getTimes(i, this.calc_column_val);
				var lastpoint = this.levelVal[i - sum_times + 1];
				var midpoint = this.levelVal[i];
				var insertpoint = this.levelVal[i + 1];
				if(midpoint != insertpoint && midpoint != "小计"&& insertpoint != "小计" && "" != insertpoint && lastpoint != insertpoint){
					for ( var j = 0; j < this.data.length; j++) {
						if (j == this.level) {
							this.idx_total.push(i + 1);
							this.levelVal.splice(i + 1, 0, "小计");
						} else {
							this.data[j].splice(i + 1, 0, "");
							var a1 = i + 1;
							for ( var k = 0; k < this.real_calc_column.length; k++) {
								if (j == this.real_calc_column[k]) {
									var sum = 0;
									for ( var s = flag; s < a1; s++) {
										var temp = this.data[this.real_calc_column[k]][s];
										if("" == temp || null == temp){
											temp = 0;
										}
										sum += Number(temp);
									}
									sum = sum / sum_times;
									
									this.data[this.real_calc_column[k]].splice(a1, 1,sum);

								}
							}
						}
					}
					flag = i + 2;
				}
			}
				var idx_Array = new Array();
				for(var i = 0;i < this.levelVal.length;i++){
					if("小计" == this.levelVal[i]){
						idx_Array.push(i);
					}	
				}
			
			this.handleProp(this.data, this.levelVal, this.real_calc_column, this.prop_column,idx_Array,javaData);

		}
	},

	/**
	 * 当 undefined != level 将占比写到占比的位置上，填写小计的那一行占比；
	 */
	handleProp : function(data, levelVal, real_calc_column, prop_column,idx_total,javaData) {
		for(var i = 0;i < idx_total.length;i++){
			var sum = 0;
			var prop = 0;
			if(i == 0){
				sum = this.getTotal(-1, idx_total[i], data, real_calc_column, levelVal);
				this.getPoint(-1, idx_total[i], data, real_calc_column, sum,prop_column,levelVal);
			}else{
				sum = this.getTotal(idx_total[i-1], idx_total[i], data, real_calc_column, levelVal);
				this.getPoint(idx_total[i-1], idx_total[i], data, real_calc_column, sum,prop_column,levelVal);
			}
			if(0 == sum){
				prop = 0;
			}else{
				prop = Number(sum/sum);
			}
			if(undefined != this.fmt){
				data[prop_column][idx_total[i]] = com.format(prop,this.fmt);
			}else{
				data[prop_column][idx_total[i]] = prop;
			}
		}
		for(var i = 0;i < this.del_array.length;i++){
			data[prop_column][this.del_array[i]] = "";
		}
		if("" != this.idx_total){
			var flag = 0;
			for(var k = 0;k < this.idx_total.length;k++){
				for(var g = 0;g < data.length;g++){
				data[g].splice(this.idx_total[k] - flag,1);
				}
				flag++;
			}
		}
//		rpt.data = data;
		javaData.data = this.data;
		var rptname = javaData.rptname;
		origins[rptname] = javaData;
	},
	/**
	 * 或得到小计行的和；
	 * @param lastStation上个小计行的位置
	 * @param station本次计算的小计行的位置
	 * @param data获取到的数据
	 * @param real_calc_column真正计算小计的列数
	 * @param levelVal层级；
	 * @returns {Number}
	 */
	getTotal:function(lastStation,station,data,real_calc_column,levelVal){
		var sum = 0;
		for ( var i = lastStation+1; i < station; i++) {
			for ( var j = 0; j < real_calc_column.length; j++) {
				var temp = data[real_calc_column[j]][i];
				if("" == temp || null == temp){
					temp = 0;
				}
				if("" == levelVal[i]){
					temp = 0;
					this.comParedToTotal(i,data);
				}
				
				sum += Number(temp);
			}
		}
		return sum;
	},
	comParedToTotal: function(station,data){
		for(var i = 0;i < data.length;i++){
			if(data[i][station] == "小计" && i < this.level){
				this.del_array.push(station);
			}
		}
	},

	/**
	 *  当 undefined != level 将占比写到占比的位置上，小计的那一行占比没有填写；
	 */
	getPoint : function(lastStation, station, data, real_calc_column, sum,prop_column,levelVal) {
		
		for ( var j = lastStation+1; j < station; j++) {
			var point = 0;
			var prop = 0;
			for ( var i = 0; i < real_calc_column.length; i++) {
				var temp = data[real_calc_column[i]][j];
				if("" == temp || null == temp){
					temp = 0;
				}
				
				point += Number(temp);
			}
			if(undefined != this.fmt){
				if(0 == sum){
					prop = 0;
				}else{
					prop = Number(point / sum);
				}
				
				data[prop_column][j] = com.format(prop,this.fmt);
				
			}else{
				if(0 == sum){
					prop = 0;
				}else{
					prop = Number(point / sum);
				}
					
				data[prop_column][j] = prop;
				}
				
			}

	},

	/**
	 * 计算上一个小计的位置；
	 */
	getlastStation : function(idx, levelVal) {
		for ( var i = idx; i > 0; i--) {

			if ("小计" != levelVal[i - 1]) {
				idx--;
			} else {
				break;
			}

		}
		return idx;
	},

	/**
	 * 求出要计算几列的总和；
	 * 
	 * @param calc_column_val
	 * @param real_calc_column
	 * @param data
	 * @returns {sum}
	 */
	getSum : function(calc_column_val, real_calc_column, data) {
		var sum = 0;
		for ( var i = 0; i < calc_column_val.length; i++) {
			for ( var j = 0; j < real_calc_column.length; j++) {
				var temp = data[real_calc_column[j]][i];
				if("" == temp || null == temp){
					temp = 0;
				}
				sum += Number(temp);
			}
		}
		return sum;
	},

	/**
	 * 当undefined == level时求出占比，并且插入到rpt.data
	 * 
	 * @param calc_column_val
	 * @param real_calc_column
	 * @param sum
	 */
	getProp : function(valLength, real_calc_column, sum, prop_column, data,javaData) {
		for ( var i = 0; i < valLength; i++) {
			var temp = 0;
			var prop = 0;
			for ( var j = 0; j < real_calc_column.length; j++) {
				var temp1 = data[real_calc_column[j]][i];
				if("" == temp1 || null == temp1){
					temp1 = 0;
				}
				temp += Number(temp1);
			}
			if(0 == sum){
				prop = 0;
			}else{
				prop = temp / sum;
			}
			if(undefined != this.fmt){
				data[prop_column][i] = com.format(prop,this.fmt);
			}else{
				data[prop_column][i] = prop;
			}
		}
//		rpt.data = data;
		javaData.data = data;
		var rptname = javaData.rptname;
		origins[rptname] = javaData;


	},

	/**
	 * 已经计算过几次小计；
	 * 
	 * @param station
	 * @param calc_column_val
	 * @returns {sum_times}
	 */
	getTimes : function(station, calc_column_val) {
		var sum_times = 1;
		for ( var i = station; i > 0; i--) {
			var blankVal = calc_column_val[i];
			if ("" == blankVal || "小计" == blankVal) {
				sum_times++;
			} else {
				break;
			}
		}
		return sum_times;
	}
};
Com_1.draw = function(params,javaData) {
	var com = new Com_1();
	com.init(params,javaData);
	com.draw(javaData);
	return com;
};
