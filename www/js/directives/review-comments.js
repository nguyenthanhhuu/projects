angular.module('my2cent.directives').directive('reviewComments', [
	function (userService, appUtils, appParams) {
		return {
			scope	: {
				review		: "=",
				comment		: "="
			},
			templateUrl		: 'templates/feed/review-comments.html',
			controllerAs	: 'ctrl',
			controller		: function ($scope, appUtils, appParams, reviewService, $ionicPopup, $ionicActionSheet) 
			{
				var ctrl = this;
				ctrl.page		= 1;
				ctrl.pageSize	= appParams.COMMENT_SIZE;
				ctrl.comments	= [];
				ctrl.isLoaded	= false;
				ctrl.isLoadMore	= true;
				ctrl.deleteComment	= deleteComment;
				ctrl.updateComment	= updateComment;
				ctrl.likeComment	= likeComment;
				ctrl.unLikeComment	= unLikeComment;
				ctrl.loadMore		= loadMore;
				
				// Load comment
				ctrl.loadMore();
				
				// Watch new comment comment
				$scope.$watch('comment', function () {
					if ( $scope.comment == null )
					{
						return false;
					}
					ctrl.comments.splice(ctrl.comments.length, 1, $scope.comment);
					$scope.comment = null;
				});
				
				/**
				 * Load comment
				 */
				function loadMore()
				{
					ctrl.isLoaded	= false;
					var page	= getPage(ctrl.pageSize);
					$scope.review.getComments(page.current+1, page.size).then(function (response) {
						response = checkExist(response);
						var list = [];
						for ( var i = response.length - 1; i >= 0; i--)
						{
							if ( list.length <= ctrl.pageSize )
							{
								list.splice(list.length, 0, response[i]);
							}
						}
						list.reverse();
						// Add new comments to first of list
						ctrl.comments = list.concat(ctrl.comments);
						ctrl.isLoaded	= true;
						// Check show loadmore button
						ctrl.isLoadMore = ctrl.comments.length >= $scope.review.commentsCount.total ? false : true; 
					}, function (response) {
						ctrl.page 		= null;
						ctrl.isLoaded	= true;
						// Show error
						appUtils.alert(response.message);
					});
				}
				
				/**
				 * Get page Size
				 * @param intger pageSize
				 * @return Object : {current, size}
				 */
				function getPage(pageSize)
				{
					var total	= ctrl.comments.length;
					var page	= 0;
					if ( total < pageSize ) {
						return {
							current : 0,
							size	: pageSize + total
						};
					} else if ( total % pageSize == 0 ) {
						return {
							current	: total / pageSize,
							size	: pageSize
						};
					}
					return getPage(pageSize+1);
				}
				
				/**
				 * Like comment
				 * @param comment
				 */
				function likeComment(comment)
				{
					comment.isLoaded = false;
					comment.like().then(function () {
						comment.isLoaded = true;
					}, function (response) {
						comment.isLoaded = true;
						// Show error
						appUtils.alert(response.message);
					});
				}
				
				/**
				 * Unlike comment
				 * @param comment
				 */
				function unLikeComment(comment)
				{
					comment.isLoaded = false;
					comment.unlike().then(function () {
						comment.isLoaded = true;
					}, function (response) {
						comment.isLoaded = true;
						// Show error
						appUtils.alert(response.message);
					});
				}
				
				/**
				 * Function update comment
				 * @param Object comment
				 */
				function updateComment(comment, $event)
				{
					comment.isLoaded = false;
					comment.update(comment.newContent).then(function (response) {
						comment.isLoaded = true;
						comment.showEdit = false;
					}, function (response) {
						comment.isLoaded = true;
						// Show error
						appUtils.alert(response.message);
					});
				}
				
				/**
				 * Delete comment
				 * @param Object comment
				 */
				function deleteComment(comment)
				{
					$ionicActionSheet.show({
						destructiveText: 'Delete',
						cancelText: 'Cancel',
						destructiveButtonClicked : function (index) 
						{
							// Show loading
							appUtils.spinner.show();
							comment.delete().then(function (response) {
								$scope.review.commentedByUser	= response.commentedByUser;
								// Show loading
								appUtils.spinner.hide();
								// Remove from list
								angular.forEach(ctrl.comments, function (item, $index) {
									if ( item.commentId == comment.commentId)
									{
										ctrl.comments.splice($index, 1);
										$scope.review.commentsCount 	= appUtils.socialNumber($scope.review.commentsCount.total - 1);
									}
								});
								// Load more
								if ( ctrl.comments == 0 && $scope.review.commentsCount.total > 0)
								{
									ctrl.loadMore();
								}
							}, function (response) {
								appUtils.spinner.hide();
								// Show error
								appUtils.alert(response.message);
							});
							// Hide ActionSheet
							return true;
						},
						buttonClicked: function(index) {
							// Hide ActionSheet
							return true;
						}
					});
				}
				
				/**
				 * Check list
				 * @param Array list
				 * @return Array
				 */
				function checkExist(list)
				{
					var results = angular.copy(list);
					angular.forEach(ctrl.comments, function (comment, i) {
						angular.forEach(results, function (item, j) {
							if ( item.commentId == comment.commentId)
							{
								results.splice(j, 1);
							}
						});
					});
					return results;
				}
			}
		};
	}
]);