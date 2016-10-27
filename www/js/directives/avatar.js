angular.module('my2cent.directives').directive('avatar', [
	function () {
		return {
			restrict	: 'E',
			template	: function()
			{
				return '<a class="item item-avatar avatar-settings" menu-close nav-clear href="#"><img ng-src="{{ctrl.userAvatar}}"><h2 style="white-space:normal">{{ctrl.userName}}</h2></a>';
			},
			scope		: {},
			controllerAs: 'ctrl',
			controller	: function ($rootScope, userService)
			{
				var ctrl = this;
				ctrl.userName = '';
				ctrl.userAvatar = '';
				ctrl.userName = $rootScope.user.userName;
				userService.getUserAvatar().then(function(userImageUrl) {
					ctrl.userAvatar 		= userImageUrl;
					$rootScope.userAvatar	= userImageUrl;
				});
			}
		};
	}
]); 