var exceluploadc;

var ExcelUploadControl = Class.create();
ExcelUploadControl.prototype = {
	initialize : function(sessionkey) {
		this.sessionkey = sessionkey;
		
		jQuery('#fileUpload').uploadify({
			'swf'				: '/fair/ipad/pdtimg/js/uploadify.v3.2.1.swf',
			'uploader'			: '/control/fileupload2',
			'width'				: '100',
			'height'			: '30',
			'buttonText'		: '选取文件',
			'fileTypeDesc'  	: 'excel文件',
			'fileTypeExts'		: '*.xls; *.xlsx',
			'fileSizeLimit'		: 1024 * 1024 * 1024 * 2,
			'queueSizeLimit'	: 100,
			'uploadLimit'		: 100000,
			'auto'              : false,
			'formData'			: {
				sessionId: this.sessionkey,
				moduleName : 'impxls'
			},
			'onSelect'			: function(file) {
			  console.info('onSelect');
			  console.info(file.name);
			  
			  	//uploadfily取消按钮触发事件$替换为jQuery
				jQuery('.cancel').children().attr('href',function(index, attr){
					return attr.replace('$','jQuery');
				});
			},
			'onUploadSuccess'	: function(file, data, response) {
				console.info('onUploadSuccess');
				console.info('id: ' + file.id
                        + ' - 索引: ' + file.index
				        + ' - 文件名: ' + file.name
				        + ' - 文件大小: ' + file.size
				        + ' - 类型: ' + file.type
				        + ' - 创建日期: ' + file.creationdate
				        + ' - 修改日期: ' + file.modificationdate
				        + ' - 文件状态: ' + file.filestatus
				        + ' - 服务器端消息: ' + data
				        + ' - 是否上传成功: ' + response);
			},
			'onUploadError'		: function(file) {
				console.info('onUploadError');
			},
			'onQueueComplete'	: function(queueData) {
				console.info('onQueueComplete');
				//console.info(queueData);
			},
			'onCancel': function(file){
                console.log('文件：'+ file.name + ' 被取消上传.');
            },
		});
		
	},
	

	upload : function(){
		jQuery('#fileUpload').uploadify('upload','*');
        /*   //文件已上传
           jQuery(".body_tip_fair").html("文件已上传").css('color','rgb(255,204,80)').append('<span class="filename">订货会资料.xls</span>');
           jQuery(".body_tip_user").html("文件已上传").css('color','rgb(255,204,80)').append('<span class="filename">用户资料.xls</span>');
           jQuery(".head_tip").html("<img src='/fair/ipad/pdtexcel/images/u41.png'>部分文件已上传，您可以继续上传或执行导入").css({'color':'rgb(255,204,80)'});*/

           //上传的文件已存在，变为文件已更新
           jQuery(".body_tip_user").html("文件已更新").css('color','rgb(255,204,80)');
           jQuery(".head_tip").html("<img src='/fair/ipad/pdtexcel/images/u41.png'>文件已更新，请执行导入").css({'color':'rgb(255,204,80)'});

       },
       imp : function(){
    	   if (jQuery("#check").is(":checked")) {
   			 alert(123);
   		   }
           //执行导入数据
           jQuery(".body_tip_fair").html("成功导入12条数据").css('color','rgb(0,204,23)');
           jQuery(".body_tip_user").html("成功导入250条数据").css('color','rgb(0,204,23)');

          jQuery(".head_tip").html("<img src='/fair/ipad/pdtexcel/images/u41.png'>部分数据已导入，您可以继续上传其余数据文件").css({'color':'rgb(255,204,80)'});

           //导入失败
          // jQuery(".body_tip_store").html("数据导入失败").css('color','red').append("&nbsp;&nbsp;<a href='#'>查看错误信息</a> <a href='js/bootstrap.js' download='js/bootstrap.js'>下载带有错误标记的数据文件</a>");
          // jQuery(".head_tip").html("<img src='/fair/ipad/pdtexcel/images/u37.png'>数据导入失败，请修正后重新上传并执行").css({'color':'rgb(177,34,27)'});

           //导入成功
           //jQuery(".head_tip").html("<img src='/fair/ipad/pdtexcel/images/u33.png'>数据导入完成，您还可以继续<a href='#'>导入商品图片</a>").css({'color':'rgb(132,193,34)'});
       }
};

ExcelUploadControl.main = function() {
	portalClient = new PortalClient();
	portalClient.init(null, null, "/servlets/binserv/Fair");
	//exceluploadc = new ExcelUploadControl();
};
jQuery(document).ready(ExcelUploadControl.main);
