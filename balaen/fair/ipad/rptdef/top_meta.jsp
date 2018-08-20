<%@ page language="java" contentType="text/html; charset=UTF-8"  pageEncoding="UTF-8"%>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta http-equiv="Cache-Control" content="max-age=0,no-store,no-cache,must-revalidate" />
<meta http-equiv="Expires" content= "-1" />
<meta http-equiv="Pragma" content="no-cache" />

<script type="text/javascript" src="/fair/ipad/rptdef/js/prototype.js"></script>
<script type="text/javascript" src="/fair/ipad/rptdef/js/jquery1.7.1/jquery-1.9.1.js"></script>
<script type="text/javascript" src="/fair/ipad/rptdef/js/jquery1.7.1/jquery-ui-1.10.3.custom.js"></script>
<script type="text/javascript" src="/fair/ipad/rptdef/js/jquery.ztree.core-3.5.js"></script>
<script type="text/javascript">jQuery.noConflict();</script>
<script type="text/javascript" src="/nea/core/js/rest.js"></script>
<script type="text/javascript">
Array.prototype.unique = function () {
    var temp = new Array();
      this.sort();
      for(var i = 0; i < this.length; i++) {
          if( this[i] == this[i+1]) {
            continue;
        }
          temp[temp.length]=this[i];
      }
      return temp;
  
};
</script>
<link rel="stylesheet" href="css/zTreeStyle.css" type="text/css">
