angular.module('my2cent.controllers')

.controller('NavCtrl', function($scope, $ionicSideMenuDelegate, $location, appUtils) {
    var navCtrl = this;

    navCtrl.showMenu = showMenu;
    navCtrl.isLoggedin = isLoggedin;

    function showMenu() {
    	if(appUtils.isLoggedin()) {
        	$ionicSideMenuDelegate.toggleLeft();
        } else {
        	$location.path('/login');
        }
    };

    function isLoggedin () {
    	return appUtils.isLoggedin();
    }
})
.controller('TabsCtrl', function($scope) {
    $scope.userId = 1; //get id of current user
});