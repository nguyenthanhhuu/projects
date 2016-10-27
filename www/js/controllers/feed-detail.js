angular.module('my2cent.controllers').controller('FeedDetailCtrl', 
	function($scope, $rootScope, $state, $stateParams, $ionicHistory, appParams, appUtils, reviewService) {
		var feedDetailCtrl	= this;
		feedDetailCtrl.user			= $rootScope.user;
		feedDetailCtrl.userAvatar	= $rootScope.userAvatar;
		console.info(feedDetailCtrl.user);
		// Params
		feedDetailCtrl.feedId	= $stateParams.feedId || null;
		feedDetailCtrl.feed		= {};
		feedDetailCtrl.rate		= 2;
		feedDetailCtrl.isLoaded	= false;
		feedDetailCtrl.max 		= appParams.MAX_RATING;		
		feedDetailCtrl.commentContent	= null;
		feedDetailCtrl.newComment		= null;
		// functions
		feedDetailCtrl.addComment	= addComment;
		feedDetailCtrl.likeReview	= likeReview;
		feedDetailCtrl.unLikeReview	= unLikeReview;
		$scope.$on('$ionicView.loaded', initScreen());
		
		// Show loading
		appUtils.spinner.show();
		
		// Init Screen
		function initScreen()
		{
			if( feedDetailCtrl.feedId == null ) 
			{
				$state.go("tab.feeds");
			}
						
			// Get detail			
			reviewService.getDetail(feedDetailCtrl.feedId).then(function (response) {
				feedDetailCtrl.feed = response;
				feedDetailCtrl.isLoaded = true;
				appUtils.spinner.hide();
			}, function (response) {
				feedDetailCtrl.isLoaded = true;
				appUtils.spinner.hide();
				// Show error
				appUtils.alert(response.message);
			});
		}
		
		/**
		 * Like review
		 */
		function likeReview()
		{
			feedDetailCtrl.feed.isLoaded = false;
			feedDetailCtrl.feed.like().then(function () {
				feedDetailCtrl.feed.isLoaded = true;
			}, function (response) {
				feedDetailCtrl.feed.isLoaded = true;
				// Show error
				appUtils.alert(response.message);
			});
		}
		
		/**
		 * Unlike review
		 */
		function unLikeReview()
		{
			feedDetailCtrl.feed.isLoaded = false;
			feedDetailCtrl.feed.unlike().then(function () {
				feedDetailCtrl.feed.isLoaded = true;
			}, function (response) {
				feedDetailCtrl.feed.isLoaded = true;
				// Show error
				appUtils.alert(response.message);
			});
		}
		
		/**
		 * Add comment
		 */
		function addComment()
		{
			feedDetailCtrl.isLoaded	= false;
			feedDetailCtrl.feed.addComment(feedDetailCtrl.commentContent).then(function (response) {
				feedDetailCtrl.newComment 		= response;
				feedDetailCtrl.commentContent	= null;
				feedDetailCtrl.isLoaded	= true;
			}, function (response) {
				feedDetailCtrl.isLoaded	= true;
				// Show error
				appUtils.alert(response.message);
			});
		}
	});
