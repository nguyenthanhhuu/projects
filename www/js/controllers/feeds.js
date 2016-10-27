angular.module('my2cent.controllers').controller('FeedsCtrl', 
	function($scope, $location, $timeout, $ionicModal, $ionicLoading, $ionicPopup, appUtils, appParams, reviewService)
	{
		var feedCtrl = this;
		feedCtrl.pageSize = appParams.PAGE_SIZE;
		feedCtrl.page = appParams.PAGE; //current page
		feedCtrl.loadingMore = false;
		feedCtrl.is_end_list = true;
		feedCtrl.feeds = [];
		
		feedCtrl.doRefresh  		= doRefresh;
		feedCtrl.loadMore   		= loadMore;
		feedCtrl.showCommentDialog	= showCommentDialog;
		
		$scope.$on('$ionicView.loaded', initScreen());
		
		appUtils.spinner.show();
		function initScreen()
		{
			if( feedCtrl.feeds.length == 0 )
			{
				loadFeedsData(feedCtrl.page, feedCtrl.pageSize);
			}
		}
		
		function doRefresh()
		{
			/*$timeout( function() {
				//Stop the ion-refresher from spinning
				$scope.$broadcast('scroll.refreshComplete');
			}, 1000);*/
		}
		
		function loadMore()
		{
			feedCtrl.page += 1;
			loadFeedsData(feedCtrl.page, feedCtrl.pageSize);
		}
		
		function loadFeedsData(page, pageSize) 
		{
			var user = appUtils.getObject(appParams.LOGGED_USER);
			reviewService.getFeeds(user.providerId, user.providerUserId, user.last_login, page, pageSize)
			.then(function(response) {
				angular.forEach(response, function(item, key) {
					feedCtrl.feeds.push(item);
				});
				
				feedCtrl.loadingMore = false;
				feedCtrl.is_end_list = (parseInt(response.length) < parseInt(feedCtrl.pageSize)) ? true : false;
				
				// Hide loading
				appUtils.spinner.hide();
			},
			function(response) {
				feedCtrl.loadingMore = false;
				// Hide loading
				appUtils.spinner.hide();
				// Show error
				appUtils.alert(response.message);
			});
		}
		
		function showCommentDialog() {
			$ionicModal.fromTemplateUrl('templates/modals/write-comment-modal.html', function($ionicModal) {
				$scope.modal = $ionicModal;
			}, {
				scope: $scope,
				animation: 'slide-in-up',
				focusFirstInput: true
				}).then(function(modal) {
					$scope.modal = modal;
					$scope.modal.show();
				}
			);
		};
})
.controller('MenuSettingCtrl', function($scope, $ionicSideMenuDelegate) {
    $scope.toggleRight = function() {
        $ionicSideMenuDelegate.toggleRight();
    };
})

