angular.module('my2cent.controllers')

.controller('LoginCtrl', function(
    $scope, 
    $http, 
    $q, 
    $window, 
    $state, 
    $cordovaFacebook,
    $ionicPopup,
    $ionicLoading,
    appParams,
    appUtils,
    userService) {

    var loginCtrl = this;

    loginCtrl.login     = login;

    $scope.loginUrl = appParams.API_URL + '/facebook/authenticate ';

    $scope.$on('$ionicView.loaded', initScreen());
    function initScreen()
    {
        //console.log('init');
        // Hard code to test
        
        appUtils.saveObject(appParams.ACCESS_TOKEN, {
        	my2cents_ref	: "030de2ac62a1987b828ec1156b4bb379e0bbd1de4ed49cece7800a31cd045fec01739fc9cf1f4e1d27a8528cf8c1c144ac69845db847f6fcc4e53c0b62542eaf",
        	my2cents_t		: "e175b6f0dd7bb0f57627dffc9904e8a4"
        });
        appUtils.saveObject(appParams.LOGGED_USER, {
        	userName: "Nam Long", 
			providerUserId: "843814085670451", 
			providerId: "facebook", 
			last_login: 1436148387
        });
        $state.go('tab.feeds');
    }

    function login()
	{
		appUtils.spinner.show();
		userService.getAppDetails().then(function (response) {
        	var permissions = response.scope;
            if(permissions == '') {
                permissions = appParams.PERMISSIONS;
            }
			permissions = permissions.split(',');
            
            //fb login
            $cordovaFacebook.login(permissions).then(function(result) {
				if( result.status == 'connected' )
				{
					var token = result.authResponse.accessToken;
					userService.authDetails(token).then(function(response) {
						// Save tokens
						appUtils.saveObject(appParams.ACCESS_TOKEN, {
							'my2cents_ref'	: response.my2cents_ref,
							'my2cents_t'	: response.my2cents_t}
						);
						
						// Save user details
						appUtils.saveObject(appParams.LOGGED_USER, {
							userName		: response.userName,
							providerUserId	: response.providerUserId,
							providerId		: response.providerId,
							'last_login'	: Date.parse(new Date()) / 1000
						});
						appUtils.spinner.hide();
						// Go to feeds
						$state.go('tab.feeds');
					},function(error) {
						appUtils.spinner.hide();
						appUtils.alert(response.message);
					});
				} else {
					appUtils.spinner.hide();
					appUtils.alert('Unknown user access denied.');
				}
			}, function(response) {
				appUtils.spinner.hide();
				appUtils.alert('Unknown user access denied.');
			});
        }, function (response) {
        	appUtils.spinner.hide();
        	// Show error
			appUtils.alert(response.message);
        });
    }

});
