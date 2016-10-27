angular.module('my2cent.services').factory('userService', 
	function($http, $q, $rootScope, appParams, appUtils) {
		var appDetail	= null;
	    var userService = {
	    	authDetails     : authDetails,
	    	checkToken		: checkToken,
	        getAppDetails   : getAppDetails,
	        getUserAvatar   : getUserAvatar
	    };
	
	    return userService;
	    
	    /**
	     * Get app detail
	     * @return Object
	     */
	    function getAppDetails()
	    {
	    	var deferred= $q.defer();
	    	if ( appDetail != null )
	    	{
	    		deferred.resolve(appDetail);
	    		return deferred.promise;
	    	}
	    	
	        $http({
	        	url		: appParams.API_URL +'/facebook/appdetails',
	        	method	: 'GET'
	        })
			.success(function(data, status, headers, config) {
				if(data.status == appParams.SUCCESS){
					appDetail = data.result;
					deferred.resolve(appDetail);
				} else {
					deferred.reject({
						message : response.message,
					});
				}
			})
			.error(function(data, status, headers, config) {
				deferred.reject({
					message : 'Have problem with Facebook Login. Please try again.',
				});
			});
	        return deferred.promise;
	    }
	    
	    /**
	     * Check Token
	     * @return Object
	     */
	    function checkToken()
	    {
	    	var deferred= $q.defer();
	        $http({
	        	url		: appUtils.getUserApiLink('imageurl'),
				method	: 'POST',
				headers	: appUtils.getObject(appParams.ACCESS_TOKEN), 
				data	: {
					userId : $rootScope.user.providerUserId, 
					width: appParams.AVATAR_W, 
					height: appParams.AVATAR_H
				}
			})
			.success(function(data, status, headers, config) {
				if(data.status == appParams.SUCCESS){
					deferred.resolve(true);
				} else {
					deferred.reject(false);
				}
			})
			.error(function(data, status, headers, config) {
				deferred.reject(false);
			});
	        return deferred.promise;
	    }
	
	    /**
	     * Auth Details	    
		 * @description : Update access token from Facebook
		 * @return Object		 
		 */		 
	    function authDetails(token)
	    {
	        var deferred = $q.defer();
	        $http({
	        	url		: appParams.API_URL + '/facebook/authdetails',
	        	method	: "POST",
	        	data	: {
	        		accessToken : token
				} 
	        })
	        .success(function (response) {
	        	if( response.status == appParams.SUCCESS )
				{
					deferred.resolve(response.result);
				} else {
					deferred.reject({
						message : response.message,
					});
				}
	        })
	        .error(function (response) {
	        	deferred.reject({
					message : 'Unknown user access denied.',
				});
	        });
			return deferred.promise;
	    }
	    
	    /**
	     * Get user data
	     */
	    function getUserAvatar()
		{
			var deferred = $q.defer();
	        $http({
	        	url: appUtils.getUserApiLink('imageurl'),
				method: 'POST',
				data: {
					userId : $rootScope.user.providerUserId, 
					width: appParams.AVATAR_W, 
					height: appParams.AVATAR_H
				},
			})
			.success(function(data, status, headers, config) {
				if(data.status == appParams.SUCCESS)
				{
					deferred.resolve(data.result.userImageUrl);
				} else {
					deferred.reject(false);
				}
			})
			.error(function(data, status, headers, config) {
				deferred.reject(false);
			});
	        return deferred.promise;
	    }
	    
	});