//js template for drawing component   hightcharts version 4.1.7 
//naming strategy:upper camel-case
var Component;
var DrawComponent = Class.create();
DrawComponent.prototype={
    //essential function
    initialize:function(){
         this.data=[];
    },
    //essential function for transforming the data to the format hightchart could recognize
    //data format:
    //{config:{desc1:[v,v,v,v,v,v,v],desc2:[v,v,v,v,v,v]},title:title}...reserved for extending
    handleData:function(data){
      //write to 'this.data' at the end
    },
    //essential function for drawing 
    //container is the id of dom the chart will render to
    drawChart:function(container){
        jQuery("#"+container).highcharts({
            //hightcharts options here
        });
    }
}
DrawComponent.main = function(){
    portalClient = new PortalClient();
    portalClient.init(null,null,"/servlets/binserv/Request");    
    Component = new DrawComponent();
}
jQuery(document).ready(DrawComponent.main);
