/**
 * CopyRright (c)2015: lifecycle Project: Ordering - Board Comments: 支持排名，并支持top Create
 * Date：2015-02-02
 * 
 * @version: 1.0
 * @author: wuqiong
 */

var Com_4 = Class.create();
Com_4.prototype = {

	initialize : function() {
		this.params = null;
		this.data = null;
		//插入排名的列号；
		this.rank_col = null;
		//插入排名的位置；
		this.rank_col_val = null;
		//基于那一列计算排名；
		this.calc_column = 0;
		//通过该列的值来判断小计行的具体位置；
		this.calc_column_val = null;
		//计算排名具体的值的列数；
		this.real_calc_column = null;
		//需要排名的值
		this.real_calc_column_val = null;
		// 计算前几名；（top为全局变量）
		this.isTop = 0;
		this.topcount = 0;
		this.idx_total = new Array();
		//计算过top之后的小计行的位置；
		this.array_total = new Array();
		//计算完top之后需要计算的列号
		this.Array_col = new Array();
	},

//	  "type":4 /*排名*/
//    "params":{
//   		 0:[8],/*表示排名计算结果需要存档的列号*/
//      	1:[7],/*排名所依据的度量列，如：金额*/
//     		 2:[1],/*表示基于那一列计算排名，目前系统固定为纵轴的最后1列作为排名依据，如：大类*/
//     }
	init : function(params,javaData) {
		if (null == params || undefined == params) {
			alert("组件引用错误:type=4");
		}
		this.params = params;
		if(undefined == javaData.data){
			alert("传入数据的格式错误：没有data对象");
		}
		this.data = javaData.data;
		this.Array_col = javaData.Array_col;
		this.topcount = javaData.topCount;
		if(javaData.top != undefined){
			this.isTop = javaData.top;
		}
		this.rank_col = this.params[0][0];
		this.rank_col_val = this.data[this.rank_col];
		this.calc_column = this.params[2][0];
		
		this.real_calc_column = this.params[1];
		this.real_calc_column_val = this.data[this.real_calc_column[0]];
		
		
	},

	/**
	 * 表格的默认数据可以通过javaData.data获取。 此数据只读不写。
	 */
	draw : function(javaData) {
		if(this.calc_column - 1 < 0){
			this.calc_column_val = this.data[this.calc_column];
			this.getOneRank(this.real_calc_column_val,this.rank_col_val);
			
			this.idx_total = [this.calc_column_val.length - 1];
			//top数
			var top_ = 0;
			if(this.isTop < 0){
				top_ = this.isTop - this.isTop*2;
			}else{
				top_ = this.isTop;
			}
			//获得top数据
			if(top_ > 0){
				//获得top;
				this.getTop(this.data,this.rank_col_val,this.idx_total,top_);
			}
			
			//	对排名之后的数据进行排序
			this.sortData(this.data, this.rank_col_val, this.idx_total, this.calc_column_val);
			
			//top之后对每个小计行之间可以计算的数据进行计算；
			this.dealData(this.data,this.idx_total,this.Array_col);
		}else{
			this.calc_column_val = this.data[this.calc_column - 1];
			for(var i = 0;i < this.calc_column_val.length;i++){
				var sum_times = this.getTimes(i,this.calc_column_val);
				var lastpoint = this.calc_column_val[i - sum_times + 1];
				var midpoint = this.calc_column_val[i];
				var insertpoint = this.calc_column_val[i+1];
				if(midpoint != insertpoint && midpoint !="小计" && insertpoint !="小计" && midpoint != "" || lastpoint == ""){
					for(var j = 0;j < this.data.length;j++){
						if(j == this.calc_column - 1){
							this.idx_total.push(i + 1);
							this.calc_column_val.splice(i+1, 0, "小计");
						}else{
							this.data[j].splice(i+1, 0, "");
							var a1 = i+1;
							for(var k = 0;k < this.real_calc_column.length;k++){
								if(j == this.real_calc_column[k]){
									var sum = 0;
									var flag = this.getIdx(a1, this.calc_column_val,this.idx_total);
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
			if(0 == this.idx_total.length){
				for(var i = 0;i < this.calc_column_val.length;i++){
					if("小计" == this.calc_column_val[i]){
						this.idx_total.push(i);
					}	
				}
			}
			if(this.topcount > 1){
					for(var j = 0; j < this.idx_total.length;j++){
						var idx = this.idx_total[j];
						var lastIdx = 0;
						if(0 == j){
							lastIdx = 0;
						}else{
							lastIdx = this.idx_total[j - 1];
						}
						var sum = 0;
						for(var s = lastIdx;s < idx; s++){
							var temp_ = this.real_calc_column_val[s];
							if("" == temp_ || null == temp_){
								temp_ = 0;
							}
							sum += Number(temp_);
							
						}
						this.real_calc_column_val[idx] = sum;
					}
			}
			//计算数据行排名
			this.getRank(this.real_calc_column_val,this.idx_total,this.rank_col_val);
			//计算小计行排名
			var len = this.data[0].length - 1;
			//判断小计行是否为最后一行，如果是就不计算小计行的排名
			if(this.idx_total[0] != len){
			this.getTotalRank(this.real_calc_column_val,this.idx_total,this.rank_col_val);
			}
			
			//top数
			var top_ = 0;
			if(this.isTop < 0){
				top_ = this.isTop - this.isTop*2;
			}else{
				top_ = this.isTop;
			}
			
			//获得top数据
			if(top_ > 0){
				//获得top;
				this.getTop(this.data,this.rank_col_val,this.idx_total,top_);
			}
			//计算过top的小计行位置；
			for(var i = 0;i < this.calc_column_val.length;i++){
				if("小计" == this.calc_column_val[i]){
					this.array_total.push(i);
				}	
			}
			//	对排名之后的数据进行排序
			this.sortData(this.data, this.rank_col_val, this.array_total, this.calc_column_val);
			
			//top之后对每个小计行之间可以计算的数据进行计算；
			if(1 == this.topCount){
				this.dealData(this.data,this.array_total,this.Array_col);
			}
			
		}
		
		
//		rpt.data = this.data;
		javaData.data = this.data;
		var rptname = javaData.rptname;
		origins[rptname] = javaData;
	},
	
	dealData : function(data,array_total,array_col){
		var flag = 0;
		var row_array = new Array();
		//将需要插入的数据行空出来；
		for(var i = 0;i < array_total.length;i++){
			var idx = array_total[i];
			for(var j = 0;j < data.length;j++){
				row_array.push(idx + flag);
				data[j].splice(idx + flag, 0, "");
			}
			flag++;
		}
		this.removeDuplElem(row_array);
		for(var k = 0;k < row_array.length;k++){
			//本次小计行的位置；
			var idx_ = row_array[k];
			//上次小计行的位置；
			var idxlast = 0;
			if(0 == k){
				idxlast = 0;
			}else{
				idxlast = row_array[k-1];	
			}
			for(var g= 0;g < array_col.length;g++){
				//计算数据的列号；
				var col_ = array_col[g];
					var total = this.calcData(data,idxlast,idx_,col_);
					data[col_].splice(idx_, 1, total);
			}	
		}	
	},
	 calcData: function(data,idxlast,idx_,col_){
		
		var sum = 0;
		var hasp = -1;
		if(0 != idxlast){
			idxlast = idxlast + 2;
		}
		for(var i = idxlast; i < idx_;i++){
			var temp = data[col_][i];
			if("number" == typeof temp){
				temp = temp.toString();
			}
			hasp = temp.indexOf("%");
			temp = this.removeFmt(temp);
			temp = Number(temp);
			sum += temp;
			
		}
		if(hasp > -1){
			sum = sum/100;
		}
		return sum;
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
	 * @param idx
	 * @param calc_column_val
	 * @param idx_array
	 * @returns {Number}
	 */
	getIdx: function(idx,calc_column_val,idx_total){
		var flag = 0;
		var flag1 = 0;
	
			for(var j = 0;j<idx_total.length;j++){
				if(idx == idx_total[j] && j != 0){
						flag1 = idx_total[j-1];		
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
	 * 计算小计行之间的排名
	 * @param real_calc_column_val
	 * @param idx_array
	 * @param rank_col_val
	 */
	getRank: function(real_calc_column_val,idx_array,rank_col_val){
		//原始数据数组数据化的数组；
		var temp_arr = new Array();
		//排过序的数组；
		var temp_arr1 = new Array();
		var idx = 0;
		var lastIdx = 0;
		for(var j = 0;j < idx_array.length;j++){
			idx = idx_array[j];
			if(0==j){
				lastIdx = 0;
			}else{
				lastIdx = idx_array[j - 1];
			}	
			for(var i=lastIdx;i < idx;i++){
				var temp = real_calc_column_val[i];
				if("" == temp || null == temp){
						temp = 0;
					}
				temp_arr[i] = Number(temp);	
				temp_arr1[i] = Number(temp);	
			}
				if(0 !=j){
				temp_arr = temp_arr.splice(lastIdx+1,idx);
				temp_arr1 = temp_arr1.splice(lastIdx+1,idx);
				}
			if(this.isTop > 0){
				temp_arr1.sort(function(a,b){return a<b?1:-1;});
			}else{
				temp_arr1.sort(function(a,b){return a>b?1:-1;});
			}
		this.writeRank(temp_arr,temp_arr1,rank_col_val,idx,lastIdx);
		}
	},
	/**
	 * 将小计行之间的排名写入相应的位置；
	 * @param temp_arr将小计行的数据进行数字化
	 * @param temp_arr1对小计行的数据进行排序
	 * @param rank_col_val
	 * @param idx
	 * @param lastIdx
	 */
	writeRank: function(temp_arr,temp_arr1,rank_col_val,idx,lastIdx){
		for(var i = 0;i < temp_arr1.length;i++){
			for(var j = 0; j < temp_arr.length;j++){
				if(temp_arr1[i] == temp_arr[j]){
					if(temp_arr1[i] == temp_arr1[i - 1] && i != 0){
						continue;	
					}
					if(0 != lastIdx){
							rank_col_val[lastIdx + j + 1] = i+1;
					}else{
							rank_col_val[lastIdx + j] = i+1;
					}
				}	
			}	
		}	
	},
	/**
	 * 对各个小计行的数据进行排序；
	 * @param real_calc_column_val
	 * @param idx_array
	 * @param rank_col_val
	 */
	getTotalRank: function(real_calc_column_val,idx_array,rank_col_val){
		var temp_arr = new Array();
		var temp_arr1 = new Array();
		for(var i = 0;i < idx_array.length;i++){
			var temp = real_calc_column_val[idx_array[i]];
			if("" == temp || null == temp){
				temp = 0;
			}
			temp_arr[i] = Number(temp);	
			temp_arr1[i] = Number(temp);
		}
		if(this.isTop > 0){
			temp_arr1.sort(function(a,b){return a<b?1:-1;});
		}else{
			temp_arr1.sort(function(a,b){return a>b?1:-1;});
		}
		this.writeTotalRank(temp_arr,temp_arr1,rank_col_val,idx_array);
	},
	/**
	 * 将小计行的排名写入相应的位置；
	 * @param temp_arr
	 * @param temp_arr1
	 * @param rank_col_val
	 * @param idx_array
	 */
	writeTotalRank: function(temp_arr,temp_arr1,rank_col_val,idx_array){
		for(var i = 0;i < temp_arr1.length;i++){
			for(var j = 0; j < temp_arr.length;j++){
			if(temp_arr1[i] == temp_arr[j]){
				if(temp_arr1[i] == temp_arr1[i - 1] && i != 0){
					continue;	
				}
					rank_col_val[idx_array[j]] = i+1;
				
			}	
			}	
		}	
	},
	/**
	 * 根据全局参数top，来获得前几的数据；
	 * @param data
	 * @param rank_col_val
	 * @param idx_array
	 * @param isTop
	 */
	getTop: function(data,rank_col_val,idx_array,isTop){
		//存放要删除的排名行的数据；
		var delIdxs = new Array();
		//获得大于top值的行号
		for(var i = 0;i < rank_col_val.length;i++){
			if(rank_col_val[i] > isTop){
				delIdxs.push(i);	
			}
		}
		//将小计行大于top的行号从delIdxs去除掉
		for(var j = 0;j < idx_array.length;j++){
			for(var k = 0;k < delIdxs.length;k++){
				if(idx_array[j] == delIdxs[k]){
					delIdxs.splice(k,1);
				}	
			}	
		}
		//将大于top的行数据从data中去除掉；
		var flag = 0;
		for(var k = 0;k < delIdxs.length;k++){
			for(var g = 0;g < data.length;g++){
			data[g].splice(delIdxs[k] - flag,1);
			}
			flag++;
		}		
	},
	/**
	 * 当纵轴只有1个时，计算排名
	 * @param real_calc_column_val
	 * @param rank_col_val
	 */
	getOneRank: function(real_calc_column_val,rank_col_val){
		var temp_arr = new Array();
		var temp_arr1 = new Array();
		for(var i = 0; i < real_calc_column_val.length;i++){
			var temp = real_calc_column_val[i];
			if("" == temp || null == temp){
				temp = 0;
			}
			temp_arr[i] = Number(temp);	
			temp_arr1[i] = Number(temp);
		}
		if(this.isTop > 0){
			temp_arr1.sort(function(a,b){return a<b?1:-1;});
		}else{
			temp_arr1.sort(function(a,b){return a>b?1:-1;});
		}
		this.writeOneRank(temp_arr,temp_arr1,rank_col_val);
	},
	/**
	 * 当纵轴只有1个时，写入排名
	 * @param temp_arr
	 * @param temp_arr1
	 * @param rank_col_val
	 */
	writeOneRank: function(temp_arr,temp_arr1,rank_col_val){
		for(var i = 0;i < temp_arr1.length;i++){
			for(var j = 0; j < temp_arr.length;j++){
				if(temp_arr1[i] == temp_arr[j]){
					if(temp_arr1[i] == temp_arr1[i - 1] && i != 0){
						continue;	
					}
					rank_col_val[j] = i+1;
				}	
			}	
		}	
	},
	
	/**
	 * 对top处理之后的数据进行排序；
	 */
	sortData: function(data,rank_col_val,idx_total,calc_column_val){
		for(var i = 0;i < idx_total.length;i++){
			//获得此小计块的行数；
			var flag = 	this.getIdx(idx_total[i],calc_column_val,idx_total);
			//当前小计行的行号
			var idx = idx_total[i];
			//冒泡法排序
			for(var s = idx - flag;s < idx - 1; s++){
				for(var j = s + 1;j < idx;j++){

					if(rank_col_val[s] > rank_col_val[j]){

								var temp = new Array();
								for(var g = 0; g < data.length;g++){

									temp = data[g][s];
									data[g][s] = data[g][j];
									data[g][j] = temp;
									
								}
						
					}
				}
			}
		}
	},
	/*
	 * 找到array中重复的数据；
	 */
	removeDuplElem: function(array){
		for(var i = 0;i < array.length;i++){
			for(var j = i+1;j < array.length;j++){
				if(array[i] == array[j]){
					array = this.removeElement(j,array);//删除指定下标的元素;
					i = -1;
					break;
				}	
			}
		}
	},
	/*
	 * 将重复的数据删除；
	 */
	removeElement:function(index,array){
		if(index>=0 && index<array.length){
		      for(var i=index; i<array.length; i++){
		        array[i] = array[i+1];
		      }
		      array.length = array.length-1;
		    }
		    return array;
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
Com_4.draw = function(params,javaData) {
	var com = new Com_4();
	com.init(params,javaData);
	com.draw(javaData);
	return com;
};
