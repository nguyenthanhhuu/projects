//In this service we will store all global variables
//We can get it throught Params class
angular.module('my2cent.configs')
	.factory('appParams', function() {
	    return {
	      	API_URL 		: 'http://ec2-54-144-227-34.compute-1.amazonaws.com/twocents-engine/action',
	      	ACCESS_TOKEN 	: 'access_token',
	      	LOGGED_USER		: 'curr_logged_user',
	      	PERMISSIONS		: 'public_profile,user_friends,user_location,email',
	      	PAGE_SIZE		: 4,
	      	COMMENT_SIZE	: 4,
	      	PAGE 			: 1,
	      	SUCCESS			: 'SUCCESS',
	      	AVATAR_W		: 50,
	      	AVATAR_H		: 50,
	      	MAX_RATING		: 5,
	  	};
	});
