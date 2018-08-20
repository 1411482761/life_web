(function($) {
	$.fn.datagrid = function(options) {
		var targetDiv = $(this); // Ŀ��div
		var defaults = {
		}; // Ĭ������
		var settings = $.extend({}, defaults, options);
		// ������
		var tabPanel = $("<table class='tabPanel' border='1'></table>")
							.appendTo(targetDiv);
		// ��ͷ
		var thead = $("<thead class='thead'></thead>")
						.appendTo(tabPanel);
		// ����
		var tbody = $("<tbody class='tbody'></tbody>")
						.sortable()
						.appendTo(tabPanel);
		
		var tr = $("<tr></tr>")
					.appendTo(thead);
		var tr2 = $("<tr></tr>")
					.appendTo(thead);
		
		// �������еĸ���
		function subCnt(parent){
			var cnt = 0;
			for(var col in settings.cols){
				if(settings.cols[col].group == parent){
					cnt++;
				}
			}
			return cnt;
		}
		
		// ������ͷ
		for(var col in settings.cols){
			if(!("group" in settings.cols[col])){
				$("<th></th>")
					.attr("rowspan", settings.cols[col].isGroup ? 1 : 2)
					.attr("colspan", settings.cols[col].isGroup ? subCnt(settings.cols[col].field) : 1)
					.attr("name" , settings.cols[col].field)
					.text(settings.cols[col].title)
					.appendTo(tr);
			}else {
				$("<th></th>")
					.text(settings.cols[col].title)
					.appendTo(tr2);
			}
		}                                                                                                        
		
		function iteratordata(data) {
			dataArray = $.parseJSON(data);//["list"];
			$(dataArray).each(function(index) {
				var row = $("<tr></tr>").appendTo(tbody);
				for(var col in settings.cols){
					for(var property in dataArray[index]){
						if(settings.cols[col].field == property && !settings.cols[col].isGroup){
							$("<td></td>")
								.text(dataArray[index][property])
								.appendTo(row);
							continue;
						};
					};
				};
			});
		};
		
		iteratordata(settings.data);
	};
})(jQuery);