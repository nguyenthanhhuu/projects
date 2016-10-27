angular.module('my2cent.controllers').controller('SettingsCtrl', 
	function($scope, $rootScope, $state, $location, $ionicActionSheet, $ionicLoading, $ionicModal, $timeout, appUtils, appParams, userService) 
	{
		var settingsCtrl = this;
		
		settingsCtrl.logout = logout;
		settingsCtrl.isLoggedin = isLoggedin;
		settingsCtrl.showWriteReviewModal = showWriteReviewModal;
		settingsCtrl.showRequestReviewModal = showRequestReviewModal;
		settingsCtrl.showManageGroupsModal = showManageGroupsModal;
		
		function logout ()
		{
			// Show the action sheet
			var hideSheet = $ionicActionSheet.show({
				destructiveText: 'Logout',
				cancelText: 'Cancel',
				destructiveButtonClicked: function() 
				{
					appUtils.spinner.show();
					appUtils.spinner.hide();
					// Remove user object
					$rootScope.user	= null;
					// Clear session
	                appUtils.logout();
	                // Change state
	                $state.go("login");
	                // Hide ActionSheet
	                return true;
				},
				buttonClicked: function(index) {
					// Hide ActionSheet
					return true;
				}
			});
			
			// For example's sake, hide the sheet after two seconds
			$timeout(function() {
				hideSheet();
			}, 5000);
	    }
		
		function isLoggedin ()
		{
			return appUtils.isLoggedin();
		}
		
		//Write new review modal
		function showWriteReviewModal()
		{
			$ionicModal.fromTemplateUrl('templates/modals/write-review-modal.html', function($ionicModal) {
				$scope.modal = $ionicModal;
	        }, {
	            scope: $scope,
	            animation: 'slide-in-up'
	        }).then(function(modal) {
	            $scope.modal = modal;
	            $scope.modal.show();
	        });
	    };
	    //Request review modal
	    function showRequestReviewModal(){
	        $ionicModal.fromTemplateUrl('templates/modals/request-review-modal.html', function($ionicModal) {
	            $scope.modal = $ionicModal;
	        }, {
	            scope: $scope,
	            animation: 'slide-in-up'
	        }).then(function(modal) {
	            $scope.modal = modal;
	            $scope.modal.show();
	        });
	    };
	    //Request review modal
	    function showManageGroupsModal(){
	        $ionicModal.fromTemplateUrl('templates/modals/manage-groups-modal.html', function($ionicModal) {
	            $scope.modal = $ionicModal;
	        }, {
	            scope: $scope,
	            animation: 'slide-in-up'
	        }).then(function(modal) {
	            $scope.modal = modal;
	            $scope.modal.show();
	        });
	    };
	});