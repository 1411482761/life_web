var PieWithJump;
var DrawPieWithJump = Class.create();
DrawPieWithJump.prototype={
    initialize:function(){
         this.data=[];
         this.title=null;
         this.seriesName=null;
		 this.jumpRptName = null;
    },
    handleData:function(chart){
		var data = chart.config;
		//var jumpRpt = chart.jumpRpt;
        var dim1= data.维度一.value;
        var dim2= data.维度二.value;
        this.seriesName=data.维度二.desc
        this.title = chart.title;
        for(var i=0;i<dim1.length;i++){
            var item=[];
            item.push(dim1[i]);
            item.push(dim2[i]);
            this.data.push(item);
        }
    },
    drawChart:function(container){
        console.log(this.data);
        jQuery("#"+container).highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false
        },
        credits:{
            enabled:false
        },
        title: {
            text: this.title
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                point :{
				 events: {
                    click: function (event) {
                        alert(this.name);
						rpt.load(rpt.sessionkey,'GRPT1444808248034',rpt.theme,'Y');
                    }
                }        
				}
            }
        },
        series: [{
            type: 'pie',
            name:this.seriesName,
            data: this.data
        }]
    });
    }
}
DrawPieWithJump.main = function(){
    portalClient = new PortalClient();
    portalClient.init(null,null,"/servlets/binserv/Request");    
    PieWithJump = new DrawPieWithJump();
}
jQuery(document).ready(DrawPieWithJump.main);
