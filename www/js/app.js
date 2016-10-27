// My2Cents Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
angular.module('my2cent', [
    'ionic', 
    'ngRoute',
    'ngCordova',
    'ionic.rating',
    'ngtimeago',
    'monospaced.elastic',
    'my2cent.controllers', 
    'my2cent.services',
    'my2cent.directives',
    'my2cent.configs'])

.run(function($ionicPlatform, $cordovaNetwork, $http, $rootScope, appUtils, userService) {
    $rootScope.isLogined	= false;
    $rootScope.user			= null;
    $rootScope.appStatus	= null;
    $rootScope.netStatus	= null;
    $rootScope.pageTitle	= "jksdgajkgdkjgjk";
    
    $rootScope.$watch("user", function () {
    	$rootScope.isLogined = $rootScope.user != null && typeof $rootScope.user.providerUserId != 'undefined' ? true : false;
    });
    
    $ionicPlatform.ready(function() {
        
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });

    // Check pause app
    $ionicPlatform.on("pause", function() {
    	$rootScope.appStatus = "pause";
    });
    // Resume app
    $ionicPlatform.on("resume", function() {
        if ( $rootScope.user != null && typeof $rootScope.user.providerId != 'undefined' )
        {
        	appUtils.spinner.show();
        	userService.checkToken().then(function (response) {
        		appUtils.spinner.hide();
        	}, function (response) {
        		appUtils.spinner.hide();
        		appUtils.logout();
        		appUtils.forceLogin();
        	});
        }
        // Update new status
        $rootScope.appStatus = "resume";
    });
    
    $rootScope.$on('$cordovaNetwork:online', function(event, networkState){
    	$rootScope.netStatus = "resume";
    });
    
    $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
    	$rootScope.netStatus = "offline";
    });
});

// Init modules
angular.module('my2cent.controllers',[]);
angular.module('my2cent.directives',[]);
angular.module('my2cent.services',[]);
angular.module('my2cent.configs',[]);
