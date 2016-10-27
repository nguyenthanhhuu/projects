angular.module('my2cent.directives').directive('feedItem', [
	function (appUtils, appParams) {
		return {
			scope: {					
				'feeds': '='
			},
			templateUrl: 'templates/feed/feed-item.html',
			controllerAs: 'feedItemCtrl',
			controller: function ($scope, appUtils, appParams) 
			{
				var feedItemCtrl = this;
				// Params
				feedItemCtrl.feeds = {};
				feedItemCtrl.max = appParams.MAX_RATING;
				// Functions
				feedItemCtrl.likeReview		= likeReview;
				feedItemCtrl.unLikeReview	= unLikeReview;
				
				// Watch change feeds
				$scope.$watch('feeds', function(newVal, oldVal) {
					feedItemCtrl.feeds = newVal;
				});
				
				/**
				 * Like review
				 * @param Object review
				 */
				function likeReview(review)
				{
					review.isLoaded = false;
					review.like().then(function () {
						review.isLoaded = true;
					}, function (response) {
						review.isLoaded = true;
						// Show error
						appUtils.alert(response.message);
					});
				}
				
				/**
				 * Unlike review
				 * @param Object review
				 */
				function unLikeReview(review)
				{
					review.isLoaded = false;
					review.unlike().then(function () {
						review.isLoaded = true;
					}, function (response) {
						review.isLoaded = true;
						// Show error
						appUtils.alert(response.message);
					});
				}
			}
		}
	}
]);