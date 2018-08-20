var runsql;
var RunSql = Class.create();
RunSql.prototype = {
	
	initialize : function() {
	},
	callsql : function(params,callback){
		
		if(callback!=undefined){
			var javaData;
			var trans = {
					id: 1,
					command: "com.agilecontrol.fair.MiscCmd",
					params: {
						cmd: "RunSql",
						name:params.name,
						type:params.type,
						parameter:params.parameter
					}
			};
			portalClient.sendOneRequest(trans, function(response){
				callback(response);
			});
		}
	},
	/**
     * Execute query
     * @param adSql query registered in adSql
     * @param params {key1: value1, key2: value2, ...}
     * @param callback function(data) {...} // data is a JSON array
     * 
     */
    query: function(adSql, params, callback) {
    	
    	if(callback!=undefined){
			var trans = {
					id: 1,
					command: "com.agilecontrol.fair.MiscCmd",
					params: {
						cmd: "RunSql",
						sqlType: "QUERY",
	                    name: adSql,
	                    var: params
					}
			};
			portalClient.sendOneRequest(trans, function(response){
				callback(response);
			});
		}
        
    },
    /**
     * Execute query returns only one row
     * @param adSql query registered in adSql
     * @param params {key1: value1, key2: value2, ...}
     * @param callback function(data) {...} // data is a JSON Ojbect
     */
    queryObject: function(adSql, params, callback) {
    	
    	if(callback!=undefined){
			var trans = {
					id: 1,
					command: "com.agilecontrol.fair.MiscCmd",
					params: {
						cmd: "RunSql",
						sqlType: "QUERY",
	                    name: adSql,
	                    var: params,
	                    row_is_obj: true
					}
			};
			portalClient.sendOneRequest(trans, function(response){
				callback(response);
			});
		}
    	
    },
    /**
     * Returns json array or json object registered in adSql
     * @param adSql
     * @param successCallback function(data) {...} // data is a json defined in adSql
     */
    getJSON: function(adSql, callback) {
    	
    	if(callback!=undefined){
			var trans = {
					id: 1,
					command: "com.agilecontrol.fair.MiscCmd",
					params: {
						cmd: "RunSql",
						sqlType: "JSON",
	                    name: adSql,
					}
			};
			portalClient.sendOneRequest(trans, function(response){
				callback(response);
			});
		}
    },
    /**
     * Returns the text registered in adSql
     * @param adSql
     * @param successCallback function(data) {...} // data is a string defined in adSql
     */
    getText: function(adSql, callback) {
        
    	if(callback!=undefined){
			var trans = {
					id: 1,
					command: "com.agilecontrol.fair.MiscCmd",
					params: {
						cmd: "RunSql",
						sqlType: "TEXT",
	                    name: adSql,
					}
			};
			portalClient.sendOneRequest(trans, function(response){
				callback(response);
			});
		}
    	
    },
    /**
     * Execute query
     * @param adSql query registered in adSql
     * @param params {key1: value1, key2: value2, ...}
     * @param filter and name = '第一波'
     * @param callback function(data) {...} // data is a JSON array
     * 
     */
    queryByExpression : function(adSql,params,filter,callback){
    	
    	if(callback!=undefined){
    		var trans = {
					id: 1,
					command: "com.agilecontrol.fair.MiscCmd",
					params: {
						cmd: "RunSql",
						sqlType: "TEXTSQL",
	                    name: adSql,
	                    var: params,
	                    filter:filter,
					}
			};
			portalClient.sendOneRequest(trans, function(response){
				callback(response);
			});
		};
    	
    },
    /**
     * Execute query
     * @param adSql query registered in adSql
     * @param params {key1: value1, key2: value2, ...}
     * @param filter and name = '第一波'
     * @param callback function(data) {...} // data is a JSON array
     * 
     */
    queryByExpressionObject : function(adSql,params,filter,callback){
    	
    	if(callback!=undefined){
    		var trans = {
					id: 1,
					command: "com.agilecontrol.fair.MiscCmd",
					params: {
						cmd: "RunSql",
						sqlType: "TEXTSQL",
	                    name: adSql,
	                    var: params,
	                    filter:filter,
	                    row_is_obj: true
					}
			};
			portalClient.sendOneRequest(trans, function(response){
				callback(response);
			});
		}
    	
    },
    /**
     * Call a stored procedure registered in adSql
     * @param adSql procedure name registered in adSql
     * @param params {key1: value1, key2: value2, ...}
     * @param successCallback function(data) {...} // data is null
     * @param errorCallback function(message) {...} // Optional
     */
    callProcedure: function(adSql, params, callback, errorCallback) {
        miscCmd.execute(cmd, {
            type: "PROCEDURE",
            name: adSql,
            var: params
        }, callback, errorCallback ? function(result, code, message) {
            errorCallback(message);
        } : undefined);
    },
    /**
     * Call a stored procedure registered in adSql,
     * and return code and message
     * @param adSql
     * @param params {key1: value1, key2: value2, ...}
     * @param successCallback function(data) {...} // data is {code: 0, message: "exampleMessage"}
     * @param errorCallback function(message) {...} // Optional
     */
    callProcedureWithResult: function(adSql, params, callback, errorCallback) {
        miscCmd.execute(cmd, {
            type: "PROCEDURE_WITH_RESULT",
            name: adSql,
            var: params
        }, callback, errorCallback ? function(result, code, message) {
            errorCallback(message);
        } : undefined);
    }
};
RunSql.main = function(){
	portalClient = new PortalClient();
	portalClient.init(null,null,"/servlets/binserv/Fair");
	runsql=new RunSql();
};
jQuery(document).ready(RunSql.main);