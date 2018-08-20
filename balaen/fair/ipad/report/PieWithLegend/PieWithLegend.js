var PieWithLegend;
var DrawPieWithLegend = Class.create();
DrawPieWithLegend.prototype={
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
                 enabled:false,
                //  format: '{point.name}:<br/>{point.percentage:.1f} %',
                //  style: {
                //         fontSize:'5px',
                //         fontWeight:'normal ',
                //     }

              },
              showInLegend:true


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
DrawPieWithLegend.main = function(){
    portalClient = new PortalClient();
    portalClient.init(null,null,"/servlets/binserv/Request");
    PieWithLegend = new DrawPieWithLegend ();
}
jQuery(document).ready(DrawPieWithLegend.main);
