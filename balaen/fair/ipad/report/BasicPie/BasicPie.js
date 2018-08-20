var BasicPie;
var DrawBasicPie = Class.create();
DrawBasicPie.prototype={
    initialize:function(){
         this.data=[];
         this.title=null;
         this.seriesName=null;
    },
    handleData:function(chart){
		var data = chart.config;
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
            dataLabels:{
                 enabled:true,
                 format: '{point.name}:<br/>{point.percentage:.1f} %',
                 style: {
                        fontSize:'14px',
                        fontWeight:'normal ',
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
DrawBasicPie.main = function(){
    portalClient = new PortalClient();
    portalClient.init(null,null,"/servlets/binserv/Request");
    BasicPie = new DrawBasicPie();
}
jQuery(document).ready(DrawBasicPie.main);
