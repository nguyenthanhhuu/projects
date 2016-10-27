angular.module('my2cent.services').service('sharedService', function($rootScope) {
	return {
        broadcast: function(data) {
            $rootScope.$broadcast('handleSearchBroadcast', data);
        }
    };
})
.service('reviewService', function($http, $q, appParams, appUtils, commentService) {
	var objService = {
		getFeeds	: getFeeds,
		getDetail	: getDetail,
		setViewed	: setViewed,
		like		: like,
		unlike		: unlike,
		
		fetch		: fetch,
		fetchAll	: fetchAll
	};
	return objService;
	
	/**
	 * Update lasted viewed
	 * @return Boolean
	 */
	function setViewed() 
	{
		var review = this;
		var deferred = $q.defer();
		$http({
			url		: appUtils.getUserApiLink('review/viewed'),
			method	: 'POST',
			data	: {
				reviewId	: review.reviewId
			}
		})
		.success(function(response, status) {
			if(response.status == appParams.SUCCESS)
			{
				deferred.resolve(true);
			} else {
				deferred.reject({
					message : response.message,
				});
			}
		})
		.error(function(response, status) {
			deferred.reject({
				message : 'Have problem with update reviewed.',
			});
		});
		return deferred.promise;
	}
	
	
	
	/**
	 * Get feed detail
	 * @param integer id
	 * @return Object || Boolean
	 */
	function getDetail(id)
	{
		var deferred = $q.defer();
		$http({
			url		: appUtils.getUserApiLink('review/'+id),
			method	: 'GET'
		})
		.success(function(response, status) {
			if(response.status == appParams.SUCCESS)
			{
				var review = objService.fetch(response.result);
				deferred.resolve(review);
				// Set viewed by user
				review.setViewed();
			} else {
				deferred.reject({
					message : response.message,
				});
			}
		})
		.error(function(response, status) {
			deferred.reject({
				message : 'Have problem with load review.',
			});
		});
		return deferred.promise;
	}
	
	//load reviews
	function getFeeds(providerId, providerUserId, refreshTime, page, pageSize)
	{
		var deferred = $q.defer();
		$http({
			url: appParams.API_URL +'/'+ providerId +'/'+ providerUserId +'/reviewfeeds',
			method: 'POST',
			data: {
				lastRefreshTime	: refreshTime,
				pageNumber		: page,
				pageSize 		: pageSize
			}
		})
		.success(function(response, status) {
			if(response.status == appParams.SUCCESS)
			{
				deferred.resolve(objService.fetchAll(response.result));
			} else {
				deferred.reject({
					message : response.message,
				});
			}
		})
		.error(function(response, status) {
			deferred.reject({
				message : 'Have problem with load review.',
			});
		});
		return deferred.promise;
    }
    
    /**
	 * Like review
	 * @return Object
	 */
	function like()
	{
		var review = this;
		var deferred= $q.defer();
		$http({
			url		: appUtils.getUserApiLink('review/like'),
			method	: 'POST',
			data	: {
				likeIdentifierId: review.reviewId
			}
		})
		.success(function(response, status) {
			if(response.status == appParams.SUCCESS)
			{
				review.likedByUser	= true;
				review.likesCount	= appUtils.socialNumber(response.result);
				deferred.resolve(true);
			} else {
				deferred.reject({
					message : response.message,
				});
			}
		})
		.error(function(response, status) {
			deferred.reject({
				message : 'Have problem with like review.',
			});
		});
		return deferred.promise;
	}
	
	/**
	 * Unlike review
	 * @return Object
	 */
	function unlike()
	{
		var review = this;
		var deferred= $q.defer();
		$http({
			url		: appUtils.getUserApiLink('review/unlike'),
			method	: 'POST',
			data	: {
				likeIdentifierId: review.reviewId
			}
		})
		.success(function(response, status) {
			if(response.status == appParams.SUCCESS)
			{
				review.likedByUser	= false;
				review.likesCount	= appUtils.socialNumber(response.result);
				deferred.resolve(true);
			} else {
				deferred.reject({
					message : response.message,
				});
			}
		})
		.error(function(response, status) {
			deferred.reject({
				message : 'Have problem with unlike review.',
			});
		});
		return deferred.promise;
	}
    
    /**
     * Fetch data
     * @param Object data
     * @return Object
     */
    function fetch(data)
    {
    	data.commentsCount 	= appUtils.socialNumber(data.commentsCount);
    	data.viewsCount		= appUtils.socialNumber(data.viewsCount);
    	data.likesCount		= appUtils.socialNumber(data.likesCount);
    	data.refreshTime	= appUtils.dateTime(new Date());
    	
    	// Set Display
    	data.displayReviewName		= appUtils.getShortText(data.reviewName, 40);
    	data.displayReviewerName	= appUtils.getShortText(data.reviewerName, 40);
    	data.displayReviewPunchLine	= appUtils.getShortText(data.reviewPunchLine, 120);
		data.displayReviewText		= appUtils.getShortText(data.reviewText, 120);
    	
    	// Add functions
    	data.getComments	= commentService.getList;
		data.like			= objService.like;
    	data.unlike			= objService.unlike;
		data.addComment		= commentService.add;
		data.setViewed		= setViewed;
		data.isLoaded		= true;
    	return data;
    }
    
    /**
     * Fetch All Data
     * @param Array list
     * @return Array
     */
    function fetchAll(list)
    {
    	list	= list || [];
    	angular.forEach(list, function (data, $index) {
    		list[$index] = objService.fetch(data);
    	});
    	return list;
    }
});
