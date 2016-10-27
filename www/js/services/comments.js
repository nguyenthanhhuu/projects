angular.module('my2cent.services').service('commentService', function($rootScope, $http, $q, appParams, appUtils) {
	var objService = {
		add			: addComment,
		getList		: getList,
		delete		: deleteComment,
		like		: like,
		unlike		: unlike,
		update		: update,
		
		setCommented: setCommented,
		fetch		: fetch,
		fetchAll	: fetchAll
	};
	return objService;
	
	/**
     * Set this feed to commented
     * @param integer reviewId
     * @return Boolean || Object
     */
    function setCommented(reviewId)
    {
    	var deferred = $q.defer();
		$http({
			url: appUtils.getUserApiLink('review/commentedbyuser'),
			method: 'POST',
			data: {
				reviewId : reviewId +''
			}
		})
		.success(function(response, status) {
			if(response.status == appParams.SUCCESS)
			{
				deferred.resolve(response.result);
			} else {
				deferred.reject({
					message : response.message,
				});
			}
		})
		.error(function(response, status) {
			deferred.reject({
				message : 'Have problem with set commented by user.',
			});
		});
		return deferred.promise;
    }
    
	/**
     * Add comment
     * @param String comment
     * @return Object
     */
    function addComment(comment)
    {
    	var review = this;
    	var deferred = $q.defer();
		$http({
			url: appUtils.getUserApiLink('review/comment'),
			method: 'POST',
			data: {
				comment		: comment,
				reviewId	: review.reviewId
			}
		})
		.success(function(response, status) {
			if(response.status == appParams.SUCCESS)
			{
				var comment = fetch(response.result);
				deferred.resolve(comment);
				review.commentsCount 	= appUtils.socialNumber(review.commentsCount.total + 1);
				review.commentedByUser	= true;
				// Set that review had been comment by user
				objService.setCommented(comment.reviewId);
			} else {
				deferred.reject({
					message : response.message,
				});
			}
		})
		.error(function(response, status) {
			deferred.reject({
				message : 'Have problem with add comment.',
			});
		});
		return deferred.promise;
    }
	
	/**
	 * Get comments
	 * @param integer pageNumber
	 * @param integer pageSize
	 * @return Object || Boolean
	 */
	function getList(pageNumber, pageSize)
	{
		var review	= this;
		pageNumber	= pageNumber || 1;
		pageSize	= pageSize || appParams.COMMENT_SIZE;
		var deferred= $q.defer();
		$http({
			url		: appUtils.getUserApiLink('review/comments'),
			method	: 'POST',
			data	: {
				pageNumber		: pageNumber,
				pageSize		: pageSize,
				//lastRefreshTime	: Math.round(review.refreshTime.getTime() / 1000),
				identifierId	: review.reviewId
			}
		})
		.success(function(response, status) {
			if(response.status == appParams.SUCCESS)
			{
				var results = objService.fetchAll(response.result);
				deferred.resolve(results);
			} else {
				deferred.reject({
					message : response.message,
				});
			}
		})
		.error(function(response, status) {
			deferred.reject({
				message : 'Have problem with load comments.',
			});
		});
		return deferred.promise;
	}
	
	/**
	 * Like comment
	 * @return Object
	 */
	function like()
	{
		var comment = this;
		var deferred= $q.defer();
		$http({
			url		: appUtils.getUserApiLink('review/likecomment'),
			method	: 'POST',
			data	: {
				likeIdentifierId: comment.commentId
			}
		})
		.success(function(response, status) {
			if(response.status == appParams.SUCCESS)
			{
				comment.likedByUser = true;
				comment.likesCount	= appUtils.socialNumber(response.result);				
				deferred.resolve(true);
			} else {
				deferred.reject({
					message : response.message,
				});
			}
		})
		.error(function(response, status) {
			deferred.reject({
				message : 'Have problem with like comment.',
			});
		});
		return deferred.promise;
	}
	
	/**
	 * Unlike comment
	 * @return Object
	 */
	function unlike()
	{
		var comment = this;
		var deferred= $q.defer();
		$http({
			url		: appUtils.getUserApiLink('review/unlikecomment'),
			method	: 'POST',
			data	: {
				likeIdentifierId: comment.commentId
			}
		})
		.success(function(response, status) {
			if(response.status == appParams.SUCCESS)
			{
				comment.likedByUser = false;
				comment.likesCount	= appUtils.socialNumber(response.result);
				deferred.resolve(true);
			} else {
				deferred.reject({
					message : response.message,
				});
			}
		})
		.error(function(response, status) {
			deferred.reject({
				message : 'Have problem with unlike comment.',
			});
		});
		return deferred.promise;
	}
	
	/**
	 * Update comment
	 * @return Object
	 */
	function update(newContent)
	{
		var comment = this;
		var deferred= $q.defer();
		$http({
			url		: appUtils.getUserApiLink('review/comment'),
			method	: 'PUT',
			data	: {
				comment		: newContent,
				reviewId	: comment.reviewId,
				commentId	: comment.commentId
			}
		})
		.success(function(response, status) {
			if(response.status == appParams.SUCCESS)
			{
				var result = response.result;
				comment.comment		= result.comment;
				comment.updatedTime	= appUtils.dateTime(new Date(result.updatedTime*1000));
				comment.updatedUser	= result.updatedUser;
				deferred.resolve(true);
			} else {
				deferred.reject({
					message : response.message,
				});
			}
		})
		.error(function(response, status) {
			deferred.reject({
				message : 'Have problem with update comment.',
			});
		});
		return deferred.promise;
	}
	
	/**
	 * Delete comment
	 * @return Object
	 */
	function deleteComment()
	{
		var comment = this;
		var deferred= $q.defer();
		$http({
			url		: appUtils.getUserApiLink('review/comment'),
			method	: 'DELETE',
			headers: {
				'Accept'		: 'application/json',
				'Content-Type'	: 'application/json'
			},
			data	: {
				commentId: comment.commentId +'',
			}
		})
		.success(function(response, status) {
			if(response.status == appParams.SUCCESS)
			{
				objService.setCommented(comment.reviewId).then(function (status) {
					deferred.resolve({
						status	: true,
						commentedByUser	: status == "true" ? true : false
					});
				})
			} else {
				deferred.reject({
					message : response.message,
				});
			}
		})
		.error(function(response, status) {
			deferred.reject({
				message : 'Have problem with delete comment.',
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
    	data.like		= objService.like;
    	data.unlike		= objService.unlike;
    	data.update		= objService.update;
    	data.delete		= objService.delete;
    	data.showEdit	= false;
    	data.isLoaded	= true;
    	// Number
    	data.likesCount		= appUtils.socialNumber(data.likesCount);
    	// Date Time
    	data.createdByUser	= data.createdUser == $rootScope.user.providerUserId ? true : false;
    	data.updatedTime	= appUtils.dateTime(new Date(data.updatedTime*1000));
    	data.createdTime	= appUtils.dateTime(new Date(data.createdTime*1000));
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