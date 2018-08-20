var grc;
var GraphicalControl = Class.create();

GraphicalControl.prototype = {

  initialize : function() {
    this.curCpt = {};// current selected component
    this.rptname = null;
    this.cmd=null;//phone portal or fair
    // initialize the variable
  },

  loadCptList : function(rptname,cmd,desc) {
    this.desc = desc;

    this.rptname = rptname;
    this.cmd = cmd;
    var trans = {
      id : 1,
      command : this.cmd,
      params : {
        cmd : "rptGraphicalConfig",
        type : "getChartList",
        rptname : rptname,
        desc:desc
      }
    };
    // data format:
    // {chartlist:[{cptname:cptname,cptdesc:cptdesc,title:title,chartname:grc10293,height:ht,width:wt,datasource:ds,config:[]},.,{}],datasource:[{desc:desc,name:name},{}...{}]}
    portalClient
        .sendOneRequest(
            trans,
            function(response) {
              if (response.data[0].code == -1) {
                alert(response.data[0].message);
                return;
              }
              var javaData = response.data[0].result;
              var list = javaData.chartlist;
              var ds = javaData.datasource;

              // load the dropdown menu with datasource
              var dropdown_menu = "";
              for ( var i = 0; i < ds.length; i++) {
                dropdown_menu += "<option value='" + ds[i].name
                    + "'>" + ds[i].desc + "</option>";
              }
              jQuery("#ds").html(dropdown_menu);

              // load the list with existed charts
              var list_group = "";
              for ( var i = 0; i < list.length; i++) {
                list_group += "<a href='javascript:' onclick='grc.clickChart(this)' class='list-group-item'><div class='row'><img class='col-md-6' src='/report/"
                    + list[i].cptname
                    + "/"
                    + list[i].cptname
                    + ".png'></img><div class='col-md-6'><div style='display:none'>"
                    + list[i].chartname
                    + "</div><div class='label label-info'>"
                    + list[i].cptdesc
                    + "</div><div>"
                    + list[i].title
                    + "</div></div></div></a>";
              }
              jQuery(".list1").html(list_group);

              var nodes = jQuery('.list1').find(
                  ".list-group-item");
              if (nodes.length != 0) {
                for ( var i = 0; i < nodes.length; i++) {
                  jQuery(nodes[i]).children("div").data(
                      "params", list[i]);
                }

                var first = jQuery(".list1").find(
                    ".list-group-item").first();
                grc.clickChart(first[0]);
              }
            });
    // set the first chart selected when page started

    // load the existed chart list and set the first chart selected
  },

  // load the component library
  // format:[{name:,desc:}....]
  loadCptLib : function() {
    var trans = {
      id : 1,
      command : this.cmd,
      params : {
        cmd : "rptGraphicalConfig",
        type : "getCptLib"
      }
    };
    portalClient
        .sendOneRequest(
            trans,
            function(response) {
              if (response.data[0].code == -1) {
                alert(response.data[0].message);
              }
              var javaData = response.data[0].result.data;
              var size = javaData.length;
              var html = "<div class='row rowTop'>";
              for ( var i = 0; i < size; i++) {
                if (i % 3 == 0 && i != 0) {
                  html += "</div><div class='row rowTop'>";
                }
                html += "<div class='col-md-4' style='cursor:pointer;text-align:center' onclick='grc.clickCpt(this)'><span><img style='margin-top:10px' src='/report/"
                    + javaData[i].name
                    + "/"
                    + javaData[i].name
                    + ".png'></span><div style='display:none'>"
                    + javaData[i].name
                    + "</div><div style='text-align:center'>"
                    + javaData[i].desc + "</div></div>";
              }
              html += "</div>";
              jQuery("#cptlib").html(html);
            });
  },

  clickCpt : function(event) {

   jQuery("#cptlib").find("div.row").removeClass("selected");
    jQuery(event).closest("div").addClass("selected");

    var cptname = jQuery(event).closest("div").find("div").eq(0).text();
    var cptdesc = jQuery(event).closest("div").find("div").eq(1).text();
    this.curCpt = {
      cptname : cptname,
      cptdesc : cptdesc
    };
  },
  selectCpt : function() {
    var hasProp = false;
    for ( var prop in this.curCpt) {
      hasProp = true;
      break;
    }
    if (!(hasProp)) {
      jQuery("#myModal").modal("hide");
      return false;
    }
    var trans = {
      id : 1,
      command : this.cmd,
      params : {
        cmd : "rptGraphicalConfig",
        type : "getConfig",
        cptname : this.curCpt.cptname
      }
    };

    portalClient.sendOneRequest(trans, function(response) {
      if (response.data[0].code == -1) {
        alert(response.data[0].message);
        return false;
      }
      ;
      var params = response.data[0].result.params;
      console.log(params);
      var date = new Date();
      params.chartname = date.getTime();
      grc.renderParamList(params);
      jQuery("#myModal").modal("hide");

    });
    // action after selecting the component in library
  },

  // format:[{cptname:cptname,cptdesc:cptdesc,title:title,chartname:name,height:ht,width:wd,datasource:ds,config:[value1,value2,.....]},.........{}],value的顺序与组件模板中的参数顺序一致
  addChart2List : function() {
    if (jQuery("#params").children().length == 0) {
      return false;
    }
    var cptname = jQuery("#cptname").val();
    var cptdesc = jQuery("#cptdesc").val();
    var minWidth = jQuery("#minWidth").val();
    var maxWidth = jQuery("#maxWidth").val();
    var ds = jQuery("#ds").val();
    var title = jQuery("#title").val();
    var lwr = jQuery("#lwr").val();

    // use the grc+current time to identify the chart
    var date = new Date();
    var chartname = "grc" + date.getFullYear()
        + grc.checkDate(date.getMonth() + 1)
        + grc.checkDate(date.getDate())
        + this.checkDate(date.getHours())
        + grc.checkDate(date.getMinutes())
        + grc.checkDate(date.getSeconds());
    // get the parameters according to the dom structure
    var _params = jQuery("#params").find(".value");
    var config = {};
    for ( var i = 0; i < _params.length; i++) {
      var desc = jQuery(_params[i]).prev().prop('title');
      config[desc] = jQuery(_params[i]).val();
    }
    var item = {
      cptname : cptname,
      cptdesc : cptdesc,
      title : title,
      chartname : chartname,
      minWidth : minWidth,
      maxWidth : maxWidth,
      datasource : ds,
      lwr:lwr,
      config : config
    };

    var _chartHtml = "<a href='javascript:' onclick='grc.clickChart(this)' class='list-group-item'><div class='row'><img class='col-md-6' src='/report/"
        + cptname
        + "/"
        + cptname
        + ".png'></img><div class='col-md-6'><div style='display:none'>"
        + chartname
        + "</div><div class='label label-info'>"
        + cptdesc
        + "</div><div>" + title + "</div></div></div></a>";

    jQuery(".list1").append(_chartHtml);
    jQuery(".list1").children(".list-group-item").last().children("div")
        .data("params", item);
    jQuery(".list1").children(".list-group-item").last().children("div")
        .data("ever_clicked", "Y");
    jQuery(".list1").children(".list-group-item").removeClass("active");
    jQuery(".list1").children(".list-group-item").last().addClass("active");

    jQuery("#params").children("div").attr("id", chartname);
    this.reset();

    jQuery(window).bind("beforeunload", function() {
      return "内容未保存，确定离开此页面吗?";
    });
    // add a new chart to the chart list
  },

  // delete the chart
  removeChartFromList : function() {
    if (jQuery(".list1").children(".active").length == 0) {
      alert("未选择要删除的图表");
      return false;
    }

    jQuery(".list1").children(".active").children("div").removeData(
        "params");
    jQuery(".list1").children(".active").remove();
    grc.reset();

    jQuery(window).bind("beforeunload", function() {
      return "内容未保存，确定离开此页面吗?";
    });

  },
  modifyChart : function() {
    var node = jQuery(".list1").children(".active");
    if (node.length == 0) {
      alert("请选中要修改的图表");
      return false;
    }
    var cptname = jQuery("#cptname").val();
    var cptdesc = jQuery("#cptdesc").val();
    var minWidth = jQuery("#minWidth").val();
    var maxWidth = jQuery("#maxWidth").val();
    var ds = jQuery("#ds").val();
    var title = jQuery("#title").val();
    var lwr = jQuery("#lwr").val();
    // use the grc+current time to identify the chart
    var date = new Date();
    var chartname = "grc" + date.getFullYear()
        + grc.checkDate(date.getMonth() + 1)
        + grc.checkDate(date.getDate())
        + this.checkDate(date.getHours())
        + grc.checkDate(date.getMinutes())
        + grc.checkDate(date.getSeconds());
    // get the parameters according to the dom structure
    var _params = jQuery("#params").find(".value");
    var config = {};
    for ( var i = 0; i < _params.length; i++) {
      var desc = jQuery(_params[i]).prev().prop('title');
      config[desc] = jQuery(_params[i]).val();
    }
    var item = {
      cptname : cptname,
      cptdesc : cptdesc,
      title : title,
      chartname : chartname,
      minWidth : minWidth,
      maxWidth : maxWidth,
      datasource : ds,
      lwr:lwr,
      config : config
    };
    jQuery(".list1").children(".active").children("div").data("params",
        item);
    jQuery(".list1").children(".active").find("img").attr("src",
        "/fair/ipad/rptgraphical/" + cptname + "/" + cptname + ".png");
    jQuery(".list1").children(".active").find("[style='display:none']")
        .text(chartname);
    jQuery(".list1").children(".active").find(".label").text(cptdesc);
    jQuery(".list1").children(".active").find("div").last().text(title);
    jQuery("#params").children("div").attr("id", chartname);
    this.reset();
    alert("修改完成，保存后生效！");

    jQuery(window).bind("beforeunload", function() {
      return "内容未保存，确定离开此页面吗?";
    });
  },
  saveAll : function(rptname) {
    var cmd = this.cmd
    var charts = [];
    var node = jQuery(".list1").children(".list-group-item");
    for ( var i = 0; i < node.length; i++) {
      if (jQuery(node[i]).children("div").data("params") != undefined) {
        charts.push(jQuery(node[i]).children("div").data("params"));
      }
    }
    var trans = {
      id : 1,
      command : cmd,
      params : {
        cmd : "rptGraphicalConfig",
        type : "saveChart",
        data : charts,
        rptname : rptname,
        desc:this.desc
      }
    };

    portalClient.sendOneRequest(trans, function(response) {
      if (response.data[0].code == -1) {
        alert(response.data[0].message);
        return false;
      }
      alert(response.data[0].result.message);
      grc.loadCptList(grc.rptname,cmd,grc.desc);
      jQuery(window).unbind("beforeunload");
    });

  },

  // click one chart in the list ,request for its concrete params
  clickChart : function(event) {
    if (jQuery("#params").children("div").attr("id") != undefined) {
      var hide = jQuery("#params").html();
      jQuery("#hidden").append(hide);
    }
    // set the active style
    jQuery(event).closest("a").siblings(".list-group-item").removeClass(
        "active");
    jQuery(event).closest("a").addClass("active");

    var params = jQuery(".list1").children(".active").children("div").data(
        "params");
    if (jQuery(".list1").children(".active").children("div").data(
        "ever_clicked") == "Y") {

      var div_id = params.chartname;
      var show = jQuery("#hidden").children("#" + div_id).prop(
          "outerHTML");
      jQuery("#params").html(show);
      var renderConfig = jQuery(".list1").children(".active").children(
          "div").data("renderConfig");
      var widgts = jQuery("#params").find(".value");

      for ( var i = 0; i < widgts.length; i++) {
        var key = jQuery(widgts[i]).prev().prop("title");
        jQuery(widgts[i]).val(params.config[key]);
      }

      for ( var i = 0; i < jQuery("#params").find("select").length; i++) {
        var node = jQuery("#params").find("select")[i];
        if (renderConfig.config[i].bind == "true") {
          jQuery(node).data("bindColumn",
              renderConfig.config[i].bindColumn);
        }
      }

      var minWidth = params.minWidth;
      var maxWidth = params.maxWidth;
      var title = params.title;
      var cptname = params.cptname;
      var cptdesc = params.cptdesc;
      var ds = params.datasource;
      var lwr = params.lwr;

      jQuery("#cptname").val(cptname);
      jQuery("#cptdesc").val(cptdesc);
      jQuery("#minWidth").val(minWidth);
      jQuery("#maxWidth").val(maxWidth);
      jQuery("#lwr").val(lwr);
      jQuery("#title").val(title);
      jQuery("#ds").val(ds);
      jQuery("#ds").find("option[value='" + ds + "']").attr("selected",
          true);

    } else {
      console.log("non-clicked");
      var trans = {
        id : 1,
        command : this.cmd,
        params : {
          cmd : "rptGraphicalConfig",
          type : "getConfig",
          cptname : params.cptname
        }
      };
      portalClient.sendOneRequest(trans, function(response) {
        if (response.data[0].code == -1) {
          alert(response.data[0].message);
          return false;
        }
        ;
        var config = response.data[0].result.params;
        config.chartname = params.chartname;
        grc.renderParamList(config);

        var widgts = jQuery("#params").find(".value");

        var minWidth = params.minWidth;
        var maxWidth = params.maxWidth;
        var title = params.title;
        var cptname = params.cptname;
        var cptdesc = params.cptdesc;
        var ds = params.datasource;
        var lwr=params.lwr;

        jQuery("#cptname").val(cptname);
        jQuery("#cptdesc").val(cptdesc);
        jQuery("#minWidth").val(minWidth);
        jQuery("#maxWidth").val(maxWidth);
        jQuery("#lwr").val(lwr);
        jQuery("#title").val(title);
        jQuery("#ds").val(ds);
        jQuery("#ds").find("option[value='" + ds + "']").attr(
            "selected", true);

        grc.changeSource(function() {
          for ( var i = 0; i < widgts.length; i++) {
            var key = jQuery(widgts[i]).prev().prop("title");
            jQuery(widgts[i]).val(params.config[key]);
          }
        });
        jQuery(".list1").children(".active").children("div").data(
            "renderConfig", config);
      });
    }
    jQuery(".list1").children(".active").children("div").data(
        "ever_clicked", "Y");

  },
  // place the chart params in the proper position and load data
  // params:{title:"订货数量",cptname:"cptname",cptdesc:cptdesc,width:"100",height:"100",datasource:ds,chartname:name,config:[{name:name,namespan:3,type:"text",span:6,valuelist:[],value:value]}
  renderParamList : function(params) {
    var minWidth = params.minWidth;
    var maxWidth = params.maxWidth;
    var title = params.title;
    var cptname = params.cptname;
    var cptdesc = params.cptdesc;
    var ds = params.datasource;
    var d_param = params.config;
    var lwr = params.lwr;

    jQuery("#cptname").val(cptname);
    jQuery("#cptdesc").val(cptdesc);
    jQuery("#minWidth").val(minWidth);
    jQuery("#maxWidth").val(maxWidth);
    jQuery("#lwr").val(lwr);
    jQuery("#title").val(title);
    if (jQuery("#ds").find("option[value='" + ds + "']").length > 0)
      jQuery("#ds").find("option[value='" + ds + "']").attr("selected",
          true);
    else
      jQuery("#ds").val(ds);

    var param_html = "";
    // add the class -value to identify the dom closest to the value should
    // be stored
    for ( var i = 0; i < d_param.length; i++) {
      var widgt_type = d_param[i].type;
      var temp = "";
      param_html += "<div class='col-md-" + d_param[i].span
          + "'><label title='" + d_param[i].name + "'>"
          + d_param[i].name + ":&nbsp&nbsp</label>";
      if (widgt_type == "text") {
        temp = "<input type='text'  value='" + d_param[i].value
            + "' class='value' >";
      }
      if (widgt_type == "droplist") {
        var tmp = "";
        for ( var j = 0; j < d_param[i].valuelist.length; j++) {
          tmp += "<option value='" + d_param[i].valuelist[j].value
              + "'>" + d_param[i].valuelist[j].desc + "</option>";
        }
        temp = "<select class='btn btn-default value' style='min-width:60%' >"
            + tmp + "</select>";

      }
      // reserved for more widgts
      // if(widgt_type="textarea"){}......
      param_html += temp + "</div>";
    }
    var can = "<div id='" + params.chartname + "' class='row'>"
        + param_html + "</div>";
    jQuery("#params").html(can);
    for ( var i = 0; i < jQuery("#params").find("select").length; i++) {
      var node = jQuery("#params").find("select")[i];
      if (d_param[i].bind == "true") {
        jQuery(node).data("bindColumn", d_param[i].bindColumn);
      }
    }

  },
  moveUp : function() {
    var cur_dom = jQuery(".list1").children(".active");
    var pre_dom = cur_dom.prev();
    if (pre_dom.length == 0) {
      return false;
    }

    var cur_data = cur_dom.children("div").data("params");
    var pre_data = pre_dom.children("div").data("params");
    var cur_html = cur_dom.html();
    var pre_html = pre_dom.html();

    pre_dom.html(cur_html);
    cur_dom.html(pre_html);
    // re-bind the data
    if (cur_data != undefined) {
      pre_dom.children("div").data("params", cur_data);
    }
    if (pre_data != undefined) {
      cur_dom.children("div").data("params", pre_data);
    }

    jQuery(".list-group-item").removeClass("active");
    jQuery(pre_dom).addClass("active");

  },
  moveDown : function() {
    var cur_dom = jQuery(".list1").children(".active");
    var next_dom = cur_dom.next();
    if (next_dom.length == 0) {
      return false;
    }

    var cur_data = cur_dom.children("div").data("params");
    var next_data = next_dom.children("div").data("params");
    var cur_html = cur_dom.html();
    var next_html = next_dom.html();

    next_dom.html(cur_html);
    cur_dom.html(next_html);
    // re-bind the data
    if (cur_data != undefined) {
      next_dom.children("div").data("params", cur_data);
    }
    if (next_data != undefined) {
      cur_dom.children("div").data("params", next_data);
    }

    jQuery(".list-group-item").removeClass("active");
    jQuery(next_dom).addClass("active");
  },
  //clear all
  reset : function() {

  },
  // format:[{name:desc,value:value,type:type},{}....,{}]
  changeSource : function(callback) {
    var ds = jQuery("#ds").val();
    console.log(ds);
    var trans = {
      id : 1,
      command : this.cmd,
      params : {
        cmd : "rptGraphicalConfig",
        type : "getDimension",
        datasource : ds
      }
    };
    portalClient.sendOneRequest(trans, function(response) {
      if (response.data[0].code == -1) {
        alert(response.data[0].message);
        return false;
      }
      var data = response.data[0].result.data;
      var nodes = jQuery("#params").find("select");
      var option = "";
      for ( var i = 0; i < nodes.length; i++) {
        var str = jQuery(nodes[i]).data("bindColumn");
        if (str != undefined) {
          var array = new Array();
          array = str.split(",");
          for ( var j = 0; j < array.length; j++) {
            for ( var k = 0; k < data.length; k++) {
              if (data[k].type == array[j]) {
                option += "<option value='" + data[k].value
                    + "'>" + data[k].name + "</option>";
              }
            }

          }
        }
        jQuery(nodes[i]).html(option);
      }
      callback();
    });
  },
  checkDate : function(digit) {
    if (digit < 10) {
      return "0" + digit;
    } else
      return digit;
  }
};
GraphicalControl.main = function() {
  portalClient = new PortalClient();
  // 设置请求路径
  portalClient.init(null, null, "/servlets/binserv/Request");
  grc = new GraphicalControl();
};
jQuery(document).ready(GraphicalControl.main);
