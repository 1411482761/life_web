/**
 为了支持报表的后台导出功能，需要在java端完成com组件的运算，目前是通过rhino来实现java和javascript代码的访问
 在开发中，com组件的运算需要尽量减少js包的依赖，不能使用prototype, jquery等。
 在rihno中会集成本方法，传人字符串对象：rptstr， 为json对象的字符串，格式见 http://prj2.lifecycle.cn/redmine/projects/900_iflow/knowledgebase/articles/108 #报表view900说明
 { header:{leftop,th}, data, ftm, hidden,top, components}
 方法caculateByComs处理完成后，会将重新生成的json对象转为字符写在变量retstr上。其中使用的JSON.parse/stringify完成互转
 整个处理由com.agilecontrol.fair.kpi.ReportView900#calcCompFormula 方法完成
 输入：
 rptstr - 数据对象，含有header,data等属性
 logger - org.slf4j.Logger 对象，用于填写调试信息

 执行函数/过程: caculateByComs()
 
 输出: retstr - 为rptstr处理后的对象的string
*/
var Class = {
  create: function() {
    return function() {
      this.initialize.apply(this, arguments);
    }
  }
};

var rpt;
var retstr;
function caculateByComs(){
	rpt=JSON.parse(rptstr);
	
	var coms = rpt.components;
	if(null == coms || undefined == coms || coms.length == 0){
		retstr=rptstr;
		return ;
	}
	for ( var i = 0; i < coms.length; i++) {
		rpt.formula=coms[i].formula;
		drawComOne(coms[i]);
	}	
	
	retstr= JSON.stringify(rpt);
}

function drawComOne(com){
	var c;
	var type = com.type;
	var params = com.params;
	switch (type) {
	case 0:
		c = Com_0.draw(params);
		break;
	case 1:
		c = Com_1.draw(params);
		break;
	case 2:
		c = Com_2.draw(params);
		break;
	case 3:
		c = Com_3.draw(params);
		break;
	case 4:
		c = Com_4.draw(params);
		break;
	case 5:
		c = Com_5.draw(params);
		break;
	case 6:
		c = Com_6.draw(params);
		break;
	case 7:
		c = Com_7.draw(params);
		break;
	default:
		return;
	}
}
/**
和com.js不同的是：format里没有对ratio的处理，因为java poi有专门针对float的ratio格式，不能转为str
*/
var com;
var Com = Class.create();
Com.prototype = {
	
	initialize: function() {
	},
	
	format: function(element,fmt){
		return element;
		/*if(fmt.indexOf("%") != -1){
			element = Number(element) * 100;
		}
		return  Number(element).format(fmt);*/
	}
};
com = new Com();


/**
计算object 的属性的个数
*/
function getObjectSize(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
}
