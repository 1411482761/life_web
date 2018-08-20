//js template for drawing component   hightcharts version 4.1.7 
//naming strategy:upper camel-case
var BasicColumn;
var DrawBasicColumn = Class.create();
DrawBasicColumn.prototype={
    //essential function
    initialize:function(){
         this.data={};
         this.title=null;
    },
    //essential function for transforming the data to the format hightchart could recognize
    //data format:
    //{config:{desc1:{value:[v,v,v,v,v,v,v],desc:"列名"},desc2:{value:[v,v,v,v,v,v],desc:""},title:title}...reserved for extending
    handleData:function(chart){
      //write to 'this.data' at the end.
	  var data = chart.config;
      this.data.xAxis = data.横轴.value;
      this.data.yAxis = data.纵轴.value;
      this.data.descOfxAxis = data.横轴.desc;
      this.data.descOfyAxis = data.纵轴.desc;
      this.title=chart.title;
    },
    //essential function for drawing 
    //container is the id of dom the chart will render to
    drawChart:function(container){
        jQuery("#"+container).highcharts({
            //hightcharts options here
            chart: {
               type: 'column'
            },
            credits:{
               enabled:false
            },
            title: {
               text: this.title
            },
            xAxis: {
              categories: this.data.xAxis,
              crosshair: true
            },
            yAxis: {
                min: 0,
                title: {
                  text: this.data.descOfyAxis
                }
            },
            plotOptions: {
                column: {
                   pointPadding: 0.2,
                   borderWidth: 0
                }
            },
            series: [{
                name: this.data.descOfyAxis,
                data: this.data.yAxis
            }]
        });
     }

}
DrawBasicColumn.main = function(){
    portalClient = new PortalClient();
    portalClient.init(null,null,"/servlets/binserv/Request");    
    BasicColumn = new DrawBasicColumn();
}
jQuery(document).ready(DrawBasicColumn.main);
