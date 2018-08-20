FileUpload = Class.create();
FileUpload.prototype = {
	initialize: function(sessionId, pdtId) {
		this.sessionId = sessionId;
		this.pdtId = pdtId;
		this.uploaded = new Array();
		this.uploadFailed = 0;
		jQuery('#fileUpload').uploadify({
			'swf'				: '/fair/ipad/pdtimg/js/uploadify.v3.2.1.swf',
			'uploader'			: '/c/fileupload2',
			'width'				: '100',
			'height'			: '20',
			'buttonText'		: '选择文件...',
			'fileTypeDesc'  	: '图像文件 (*.jpg, *.png)',
			'fileTypeExts'		: '*.jpg; *.png',
			'fileSizeLimit'		: 10 * 1024 * 1024,
			'queueSizeLimit'	: 20,
			'formData'			: {
				sessionId: this.sessionId,
				moduleName: "pdtimg",
				specialPath: this.pdtId
			},
			'onDialogClose'		: function(queueData) {
				if (queueData.filesQueued > 0) {
					jQuery('h1').html('正在上传图片...').attr('class', 'uploading');
					jQuery('#results').css('display', 'none').html("");
					jQuery('#details').css('display', 'none').html("");
					jQuery('#showDetails').css('display', 'none');
				}
			},
			'onUploadSuccess'	: function(file, data, response) {
				fup.uploaded.push(file.name);
			},
			'onUploadError'		: function(file) {
				fup.uploadFailed++;
				jQuery("#details").append("<li><span class='red'>[上传失败]</span> " + file.name + "</li>");
			},
			'onQueueComplete'	: function(queueData) {
				if (fup.uploaded.length > 0) {
					jQuery('h1').html('正在处理图片...').attr('class', 'processing');
					var req = {
						id : 1,
						command : "com.agilecontrol.fair.MiscCmd",
						params : {
							cmd : "ProductImageGens",
							method : "generate",
							param : {
								files : fup.uploaded,
								pdtId : pdtId
							}
						}
					};
					portalClient.sendOneRequest(req, function(response) {
						jQuery('h1').html('图片上传处理完成').attr('class', 'complete');
						
						var summary = response.data[0].result.summary;
						var details = response.data[0].result.details;
						
						if (summary.ADDED) 			jQuery('#results').append('<li class="green">新增图片：' + summary.ADDED + '</li>');
						if (summary.UPDATED) 		jQuery('#results').append('<li class="green">更新图片：' + summary.UPDATED + '</li>');
						if (summary.NON_IMAGE) 		jQuery('#results').append('<li class="red">非图像文件：' + summary.NON_IMAGE + '</li>');
						if (summary.NOT_MATCH) 		jQuery('#results').append('<li class="red">无对应商品：' + summary.NOT_MATCH + '</li>');
						if (summary.NOT_FOUND) 		jQuery('#results').append('<li class="red">文件不存在：' + summary.NOT_FOUND + '</li>');
						if (summary.EXEC_FAILED) 	jQuery('#results').append('<li class="red">处理失败：' + summary.EXEC_FAILED + '</li>');
						if (summary.UNEXECUTED) 	jQuery('#results').append('<li class="red">未处理：' + summary.UNEXECUTED + '</li>');
						if (fup.uploadFailed > 0)	jQuery('#results').append('<li class="red">上传失败：' + fup.uploadFailed + '</li>');
						
						jQuery(details).each(function() {
							if (this.status == "ADDED") 			jQuery("#details").append("<li><span class='green'>[新增]</span> " + this.fileName + "</li>");
							else if (this.status == "UPDATED") 		jQuery("#details").append("<li><span class='green'>[更新]</span> " + this.fileName + "</li>");
							else if (this.status == "NOT_MATCH") 	jQuery("#details").append("<li><span class='red'>[无对应商品]</span> " + this.fileName + "</li>");
							else if (this.status == "NON_IMAGE") 	jQuery("#details").append("<li><span class='red'>[非图像文件]</span> " + this.fileName + "</li>");
							else if (this.status == "NOT_FOUND") 	jQuery("#details").append("<li><span class='red'>[文件不存在]</span> " + this.fileName + "</li>");
							else if (this.status == "EXEC_FAILED") 	jQuery("#details").append("<li><span class='red'>[处理失败]</span> " + this.fileName + "</li>");
							else if (this.status == "UNEXECUTED") 	jQuery("#details").append("<li><span class='red'>[未处理]</span> " + this.fileName + "</li>");
							else 									jQuery("#details").append("<li><span class='gray'>[未知]</span> " + this.fileName + "</li>");
						});
						
						
						jQuery('#results').css('display', 'block');
						jQuery('#showDetails').css('display', 'block');
					});
					fup.uploadFailed = 0;
					fup.uploaded = new Array();
				}
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
		location = 'images.jsp?pdtId=' + this.pdtId;
	}
};
FileUpload.main = function() {
	portalClient = new PortalClient();
	portalClient.init(null,null,"/servlets/binserv/Fair");
	var fup;
};
jQuery(document).ready(FileUpload.main);
