FileUpload = Class.create();
FileUpload.prototype = {
	initialize: function(sessionId) {
		this.sessionId = sessionId;
		this.resend=null;
		this.totalnum=0;
		this.successnum=1;
		this.totalbyteUploaded=0;
		this.date=(new Date()).valueOf();
		this.rets = {
			added: 0,
			updated: 0,
			notMatch: 0,
			nonImage: 0,
			notFound: 0,
			failed: 0,
			failedUpload:0,
			other: 0
		}
		jQuery('#progress').html("<span id='divProgressText'></span><span id='total' class='total'></span><div id='divProgressbar'></div>");
		jQuery('#fileUpload').uploadify({
			'queueID'           : 'some_file_queue',
			'swf'				: '/fair/ipad/pdtimg/js/uploadify.v3.2.1.swf',
			'uploader'			: '/c/fileupload2',
			'width'				: '100',
			'height'			: '20',
			'buttonText'		: '选择文件...',
			'fileTypeDesc'  	: '图像或压缩包',
			'fileTypeExts'		: '*.jpg; *.png; *.zip; *.rar; *.7z; *.tar; *.gz; *.tgz',
			'fileSizeLimit'		: 1024 * 1024 * 1024 * 2,
			'queueSizeLimit'	: 500,
			'uploadLimit'		: 100000,
			'formData'			: {
				sessionId: this.sessionId,
				moduleName: "pdtimg",
				specialPath: "curr"
			},
	        'onDialogOpen' : function() {
	        	jQuery("h1").html("请选择需要上传的图片").attr("class", "prepare");
	        },
	        'onDialogClose'		: function(queueData) {
				if (queueData.filesSelected > 0 && queueData.filesSelected<= jQuery('#fileUpload').uploadify('settings','queueSizeLimit')) {
					jQuery('h1').html('正在上传图片...').attr('class', 'uploading');
					var req = {
							id : 1,
							command : "com.agilecontrol.fair.MiscCmd",
							params : {
								cmd : "ProductImageGensConf",
								method : "setUploadStatus",
								param : {
									status: "STARTED"
								}
							}
						};
				portalClient.sendOneRequest(req, function(response) {});
				jQuery('.num').css('display','block');
				buttonHidden(0,0,"","hidden");
				}
			},
			'onSelect'			: function(file) {
				fup.totalnum+=1;
				jQuery('#progress').show();
			},
			'onUploadProgress'  : function(file,bytesUploaded,bytesTotal,totalBytesUploaded,totalBytesTotal){
				jQuery("#divProgressbar").progressbar({value:Math.round(bytesUploaded/bytesTotal*100)});
				jQuery("#divProgressText").html("正在上传文件:"+file.name);
				//jQuery('.total').html(Math.round(bytesUploaded/bytesTotal*100)+"%");
				jQuery('.num').html("上传个数:"+fup.successnum+"/"+fup.totalnum);
				if(((new Date()).valueOf())>5000+fup.date){
					fup.date=(new Date()).valueOf();
					var req = {
							id : 1,
							command : "com.agilecontrol.fair.MiscCmd",
							params : {
								cmd : "ProductImageGensConf",
								method : "setUploadStatus",
								param : {
									status: "UPLOADING",
									progress: {
										uploaded: fup.successnum,
										total: fup.totalnum
									}
								}
							}
						};
				portalClient.sendOneRequest(req, function(response) {});
				}
			},
			'onUploadSuccess'	: function(file, data, response) {
				fup.successnum+=1;
				var req = {
						id : 1,
						command : "com.agilecontrol.fair.MiscCmd",
						params : {
							cmd : "ProductImageGensConf",
							method : "generateBatch",
							param : {
								files : [file.name]
							}
						}
					};
					portalClient.sendOneRequest(req, function(response) {});
			},
			'onUploadError'		: function(file) {
				jQuery("#details").append("<li><span class='red'>[上传失败]</span> " + this.fileName + "</li>");
			},
			'onQueueComplete'	: function(queueData) {
				console.debug(queueData);
				jQuery("#divProgressText").html("Complete");
				jQuery('#results').html("");
				jQuery('#details').html("");
				jQuery('.num').html("共上传个数:"+(fup.successnum-1)+"/"+fup.totalnum);
				var req = {
						id : 1,
						command : "com.agilecontrol.fair.MiscCmd",
						params : {
							cmd : "ProductImageGensConf",
							method : "setUploadStatus",
							param : {
								status: "FINISHED"
							}
						}
					};
				portalClient.sendOneRequest(req, function(response) {});
				fup.resend = window.setInterval(fup.getState,1000);
				jQuery('#progress').hide(2000);
			}
		});
	},
	toggleDetails : function() {
		if (jQuery("#showDetails input[type=checkbox]").attr("checked")) {
			jQuery("#details").show(200);
		} else {
			jQuery("#details").hide(400);
		}
	},
	back : function() {
		location="index.jsp";
	},
	getState : function(){
		var req = {
				id : 1,
				command : "com.agilecontrol.fair.MiscCmd",
				params : {
					cmd : "ProductImageGensConf",
					method : "getStage",
					param : {}
				}
			};
		portalClient.sendOneRequest(req, function(response) {
			console.debug(response);
			if("UNSTARTED"==response.data[0].result.stage){
				jQuery("h1").html("请选择需要上传的图片").attr("class", "prepare");
			}
			else if("UPLOADING"==response.data[0].result.stage){
				jQuery("h1").html("文件正在上传"+" - "+response.data[0].result.progress.percent).attr("class", "uploading");
				buttonHidden(0,0,"","hidden");
			}
			else if("PROCESSING"==response.data[0].result.stage){
				jQuery("h1").html("文件正在处理中"+" - "+response.data[0].result.progress.current+"/"+response.data[0].result.progress.total).attr("class", "processing");
				buttonHidden(0,0,"","hidden");
			}
			else if("FINISHED"==response.data[0].result.stage){
				jQuery(".reset").show(200);

				jQuery("#process span").css('display','none');
				jQuery("h1").html("文件处理完成").attr("class", "complete");
				window.clearInterval(fup.resend);

				var req = {
						id : 1,
						command : "com.agilecontrol.fair.MiscCmd",
						params : {
							cmd : "ProductImageGensConf",
							method : "getResults",
							param : {}
						}
					};
				portalClient.sendOneRequest(req, function(response) {
					console.debug(response);
					var summary = response.data[0].result.summary;
					var details = response.data[0].result.details;
					if (summary.ADDED) 			jQuery('#results').append('<li class="green">新增图片：' + summary.ADDED + '</li>');
					if (summary.UPDATED) 		jQuery('#results').append('<li class="green">更新图片：' + summary.UPDATED + '</li>');
					if (summary.NON_IMAGE) 		jQuery('#results').append('<li class="red">非图像文件：' + summary.NON_IMAGE + '</li>');
					if (summary.NOT_MATCH) 		jQuery('#results').append('<li class="red">无对应商品：' + summary.NOT_MATCH + '</li>');
					if (summary.NOT_FOUND) 		jQuery('#results').append('<li class="red">文件不存在：' + summary.NOT_FOUND + '</li>');
					if (summary.EXEC_FAILED) 	jQuery('#results').append('<li class="red">处理失败：' + summary.EXEC_FAILED + '</li>');
					if (summary.UNEXECUTED) 	jQuery('#results').append('<li class="red">未处理：' + summary.UNEXECUTED + '</li>');

					jQuery(details).each(function() {
						if (this.status == "ADDED") 			jQuery('#details').append("<li><span class='green'>[新增]</span> " + this.fileName + "</li>");
						else if (this.status == "UPDATED") 		jQuery('#details').append("<li><span class='green'>[更新]</span> " + this.fileName + "</li>");
						else if (this.status == "NOT_MATCH") 	jQuery('#details').append("<li><span class='red'>[无对应商品]</span> " + this.fileName + "</li>");
						else if (this.status == "NON_IMAGE") 	jQuery('#details').append("<li><span class='red'>[非图像文件]</span> " + this.fileName + "</li>");
						else if (this.status == "NOT_FOUND") 	jQuery('#details').append("<li><span class='red'>[文件不存在]</span> " + this.fileName + "</li>");
						else if (this.status == "EXEC_FAILED") 	jQuery('#details').append("<li><span class='red'>[处理失败]</span> " + this.fileName + "</li>");
						else if (this.status == "UNEXECUTED") 	jQuery('#details').append("<li><span class='red'>[未处理]</span> " + this.fileName + "</li>");
						else 									jQuery('#details').append("<li><span class='gray'>[未知]</span> " + this.fileName + "</li>");
					});
				});
				jQuery('#results').show();
				jQuery('#showDetails').show(100);

				buttonHidden(0,0,"","hidden");
			}
		});
	},
	end   : function(){
		var req = {
				id : 1,
				command : "com.agilecontrol.fair.MiscCmd",
				params : {
					cmd : "ProductImageGensConf",
					method : "end",
					param : {}
				}
			};
		portalClient.sendOneRequest(req, function(response) {});
	},
	reset : function(){
		jQuery("h1").html("请选择需要上传的图片").attr("class", "prepare");
		jQuery('#results').html("");
		jQuery('#details').html("");
		fup.successnum=1;
		fup.totalnum=0;
		jQuery('.num').html("");
		jQuery('#showDetails').css('display','none');
		jQuery(".reset").css('display','none');
		buttonHidden(100,20,"选择文件...","visible");
		var req = {
				id : 1,
				command : "com.agilecontrol.fair.MiscCmd",
				params : {
					cmd : "ProductImageGensConf",
					method : "reset",
					param : {}
				}
			};
		portalClient.sendOneRequest(req, function(response) {});
	}
};
function buttonHidden(){
	jQuery('#SWFUpload_0').css('width',arguments[0]);
	jQuery('#SWFUpload_0').css('height',arguments[1]);
	jQuery('#fileUpload').css('width',arguments[0]);
	jQuery('#fileUpload').css('height',arguments[1]);
	jQuery('#fileUpload-button').css('width',arguments[0]);
	jQuery('#fileUpload-button').css('height',arguments[1]);
	jQuery('#fileUpload-button span').html(arguments[2]);
	jQuery('#fileUpload-button span').css('width',arguments[0]);
	jQuery('#fileUpload-button span').css('height',arguments[1]);
	jQuery('#fileUpload').css('visibility',arguments[3]);
};
function checkPaipai(){
	var req = {
			id : 1,
			command : "com.agilecontrol.fair.MiscCmd",
			params : {
				cmd : "ProductImages",
				method : "checkPaipai",
				param : {}
			}
		};
		portalClient.sendOneRequest(req, function(response) {
			if (response.data[0].code == 0) {
				if(response.data[0].result.paipai=="c"){
					alert("请检查系统参数 fair.paipai.import 的值是否为true");
					fup.back();
				} else {
					fup.getState();
				}
			} else {
				alert("错误信息：" + response.data[0].message);
			}
		});
};
function again(){
	fup.end();
};
FileUpload.main = function() {
	portalClient = new PortalClient();
	portalClient.init(null,null,"/servlets/binserv/Fair");
	var fup;
	checkPaipai();
};
jQuery(document).ready(FileUpload.main);
//window.addEventListener("beforeunload", function (e) {
//	fup.end();});
