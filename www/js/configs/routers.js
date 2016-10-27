
angular.module('my2cent.configs').config(function($stateProvider, $urlRouterProvider, $httpProvider) {
	
	var accessRole	= {
		public	: 0,
		user	: 1
	};
	
	$httpProvider.defaults.withCredentials = true;
	//$httpProvider.interceptors.push('myCSRF');
	// Each state's controller can be found in controllers.js
	
	$stateList = {
		login	: {
			url			: '/login',
			templateUrl	: 'templates/auth/login.html',
			access		: accessRole.public
		},
		policy	: {
			url			: '/policy',
			title		: 'Privacy Policy',
	        templateUrl	: 'templates/page/policy.html',
	        access		: accessRole.public
	    },
	    terms	: {
	        url			: '/terms',
	        title		: 'Terms of Service',
	        templateUrl	: 'templates/page/terms.html',
	        access		: accessRole.public
    	},
    	error	: {
	    	url 		: '/error',
	    	templateUrl : 'templates/errors/404.html',
	    	access		: accessRole.public
	    },
	    tab		: {
	    	url			: "/tab",
			abstract	: true,
			templateUrl	: "templates/tabs.html",
			access		: accessRole.user
		},
		'tab.feeds'	: {
			url		: '/feeds',
			access	: accessRole.user,
	        views	: {
	        	'tab-feeds': {
	        		templateUrl: 'templates/feed/feeds.html'
				}
			}
		},
		'tab.feed-detail'	: {
	        url		: '/feeds/:feedId',
	        access	: accessRole.user,
	        views	: {
	            'tab-feeds': {
	                templateUrl: 'templates/feed/feed-detail.html'
	            }
	        }
	    },
	    'tab.dashboard'	: {
	        url		: '/dashboard',
	        access	: accessRole.user,
	        views	: {
	            'tab-dashboard': {
	                templateUrl: 'templates/dashboard/dashboard.html'
	            }
	        }
	    },
	    'tab.settings'	: {
	        url		: '/settings',
	        access	: accessRole.user,
	        views	: {
	          	'tab-settings': {
	                templateUrl: 'templates/settings/settings.html'
	            }
	        }
     	}
	};
	
    /**
     * Setting all state list
     */
    angular.forEach($stateList, function (configs, name) {
    	console.info(name);
    	stateConfigs	= configs || {};
    	stateConfigs.cache	= false;
    	stateConfigs.resolve	= {
    		'runBefore'	: function($rootScope, $state, $http, appUtils, appParams) {
    			var routerConfigs = this.self;
	    		if ( typeof console.clear == 'function' )
	    		{
	    			console.clear();
	    		}
	    		// Add log
	    		console.info("State : " + name + " - Url : " + routerConfigs.url);
	    		// Set page title
	    		$rootScope.pageTitle =  routerConfigs.title || '';
	    		
	    		var user	= appUtils.getObject(appParams.LOGGED_USER) || null;
				var tokens	= appUtils.getObject(appParams.ACCESS_TOKEN) || null;
				if  ( user != null && tokens != null )
				{
					// Set rootScope
					$rootScope.user	= user;
					// Set default header
					$http.defaults.headers.common['my2cents_ref']	= tokens.my2cents_ref;
					$http.defaults.headers.common['my2cents_t']		= tokens.my2cents_t;
	    		};
	    		
	    		if( routerConfigs.access !== accessRole.public && ( user == null || tokens == null ) )
				{
					$state.go("login");
					return false;
				}
	    		return true;
	    	}
    	};
    	$stateProvider.state(name, stateConfigs);
    });
    
	// if none of the above states are matched, use this as the fallback
	$urlRouterProvider.otherwise('/login');
});