var fup;
FileUpload = Class.create();
// define constructor
FileUpload.prototype = {
	initialize: function() {
		//this methond will be called when class initialized
	},
	initForm:function(upinit,para){
		this._upinit=upinit;
		this._para=para;
		jQuery("#title1 b").html(VIEWS_LOCALE.exp_xls.title1);
		jQuery("#title2 b").html(VIEWS_LOCALE.exp_xls.title2);
		jQuery("#up_step1").html("<span class='steptitle'>"+VIEWS_LOCALE.exp_xls.step1+"</span>: "+VIEWS_LOCALE.exp_xls.step1desc+"<a href='/pdt/imptpl.zip' target='_blank'>"+VIEWS_LOCALE.exp_xls.download+"</a><br/><br/><input id='fileInput1' name='file1' size='35' type='file'/>");
		jQuery("#up_step2").html("<span class='steptitle'>"+VIEWS_LOCALE.exp_xls.step2+"</span>: "+VIEWS_LOCALE.exp_xls.step2desc+"<br/><br/><span><input type='button' id='btnImport' name='Upload' value='"+VIEWS_LOCALE.exp_xls.buttondesc+"' onclick='javascript:fup.beginUpload();' >&nbsp;&nbsp;<input type='button' id='btnImport2' name='Upload2' value='" + (this._para.isSubFunits == "true" ? VIEWS_LOCALE.exp_xls.buttondesc3 : VIEWS_LOCALE.exp_xls.buttondesc2) + "' onclick='javascript:fup.beginUpload2();' > <span id='processing' style='display:none;'>"+VIEWS_LOCALE.exp_xls.processing+"</span></span>");
		jQuery("#up2_step1").html("<span class='steptitle'>"+VIEWS_LOCALE.exp_xls.step1+"</span>: "+VIEWS_LOCALE.exp_xls.step1desc+"<a href='/pdt/imptpljq.zip' target='_blank'>"+VIEWS_LOCALE.exp_xls.download+"</a><br/><br/><input id='fileInput1' name='file1' size='35' type='file'/>");
		jQuery("#up2_step2").html("<span class='steptitle'>"+VIEWS_LOCALE.exp_xls.step2+"</span>: "+VIEWS_LOCALE.exp_xls.step2desc+"<br/><br/><span><input type='button' id='btnImport' name='Upload' value='"+VIEWS_LOCALE.exp_xls.buttondesc+"' onclick='javascript:fup.beginUpload();' > <span id='processing' style='display:none;'>"+VIEWS_LOCALE.exp_xls.processing+"</span></span>");
		jQuery("#output span").html(VIEWS_LOCALE.exp_xls.result);
		$("#fileInput1").uploadify({
			'uploader'      : '/nea/core/js/uploadify.swf',
			'script'        : '/control/fileupload',
			'cancelImg'     : '/nea/core/images/cancel.png',
			'folder'        : '/nea/core',
			'multi'         : false,
			'wmode'		: 'transparent',
			'sizeLimit'     : this._upinit.sizeLimit,
			'buttonText'	: this._upinit.buttonText,
			'fileDesc'      : this._upinit.fileDesc,
			'fileExt'       : this._upinit.fileExt,
			onError: function (evt, b, c, errorObj) {
	          $("#btnImport").disabled=false;
	          $("#processing").hide();
	          $("#whole").html("处理异常("+errorObj.type+"):"+errorObj.info+", evt="+evt+",b="+b+",c="+c);
  			  $("#output").css("display","block");
  			  
			},
			onComplete:function(a,b,c,response,e){
				// you can handle response here
				$("#btnImport").disabled=false;
				$("#processing").hide();
				$("#whole").html(response);
				$("#output").css("display","block");

				return true;
			},
			onAllComplete:function (evt, data) {
	         	return true;
			}
		});			
	},
	
	beginUpload:function(){
		$("#btnImport").disabled=true;
		$("#processing").show();
		var para=Object.clone(this._para);
		$('#fileInput1').uploadifySettings("scriptData",para,true);	
		$('#fileInput1').uploadifyUpload();
 	},
 	beginUpload2:function(){
		$("#btnImport").disabled=true;
		$("#processing").show();
		var para=Object.clone(this._para);
		para.delta=true;
		$('#fileInput1').uploadifySettings("scriptData",para,true);	
		$('#fileInput1').uploadifyUpload();
 	}
};
FileUpload.main = function () {
	fup=new FileUpload();
};
jQuery(document).ready(FileUpload.main);
