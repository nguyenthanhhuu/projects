angular.module('my2cent.services').factory('appUtils', function($location, $route, $rootScope, appParams, $cordovaFacebook, $ionicLoading, $ionicPopup) {
	
	var appUtils = {
		alert			: alert,
		logout          : logout,
		forceLogin      : forceLogin,
		isLoggedin      : isLoggedin,
		getObject       : getObject,
		getShortText	: getShortText,
		saveObject      : saveObject,
		getStorage		: getStorage,
		saveStore		: saveStore,
		removeStorage	: removeStorage,
		socialNumber	: socialNumber,
		getUserApiLink	: getUserApiLink,
		numFormat		: numFormat,
		dateTime		: dateTime,
		spinner			: spinner()
	};
	return appUtils;
	
	/**
	 * Function Spinner
	 * @description : Run to add an Object to appUtils
	 * @return Object
	 */
	function spinner()
	{
		return {
	    	show	: function () {
	    		$ionicLoading.show({template: '<ion-spinner icon="spiral"></ion-spinner>'});
	    	},
	    	hide	: function ()
	    	{
	    		$ionicLoading.hide();
	    	}
	    };
	}
	
	/**
	 * Get Short Text
	 * @param String text
	 * @param Integer limit
	 * @return String
	 */
	function getShortText(text, limit)
	{
		var str = angular.copy(text);
		if ( str.length <= limit )
		{
			return str;
		}
		var length = str.indexOf(" ", limit);
		return str.substr(0, length) + " ...";
	}
	
	/**
	 * Show message dialog
	 */
	function alert(message)
	{
		return $ionicPopup.alert({
            template: message
        });
	}
	
	/**
	 * Logout
	 */
	function logout()
	{
		this.removeStorage(appParams.ACCESS_TOKEN);
		this.removeStorage(appParams.LOGGED_USER);
		$cordovaFacebook.logout();
    }

    function forceLogin() {
        $location.path('/login');
    }
    function isLoggedin () {
        var token = this.getObject(appParams.ACCESS_TOKEN);

        return angular.equals({}, token) ? false : true;
    }

    function getObject (key) {
        var obj = JSON.parse( window.localStorage.getItem(key) || '{}');

        return obj;
    }

    function saveObject (key, data) {
        window.localStorage.setItem(key, JSON.stringify(data));
    }

    //get local storage
    function getStorage(key) {
    	var val = window.localStorage.getItem(key);
		return val ? val : '';
    }
    //save local storage
    function saveStore(key, value) {
    	window.localStorage.setItem(key, value);
    }
    //remove storage
    function removeStorage(key) {
		window.localStorage.removeItem(key);
	}
	
	/**
	 * Get api link
	 * @param String extra
	 * @return String
	 */
	function getUserApiLink(extra)
	{
		var url = appParams.API_URL;
		var user	= this.getObject(appParams.LOGGED_USER) || null;
		if ( user != null )
		{
			url	= url + "/" + user.providerId + "/" + user.providerUserId + "/";
		}
		if ( extra != undefined || extra != '' )
		{
			url = url + extra;
		}
		console.info("Create Link : " + url);
		return url;
	}
	
	/**
	 * Social Number
	 * @param Integer number
	 * @return Object
	 */
	function socialNumber(number)
	{
		number = parseInt(number) || 0;
		var numObj = {
    		total		: number,
    		formated	: appUtils.numFormat(number),
    		toFormat	: function () {
    			var num = parseInt(this.total);
    			var result	= num;
    			var suff	= "";
    			if ( num >= 1000000 )
    			{
    				var result = num / 1000000;
    				result 	= result % 1 == 0 ? result : result.toFixed(1);
    				suff	= "M";
    			} else if (num >= 1000) {
    				var result = num / 1000;
    				result = result % 1 == 0 ? result : result.toFixed(1);
    				suff	= "k";
    			}
    			return result+suff;
    		}
    	};
    	return numObj;
	}
	
	/**
	 * Format Number
	 * @param Float num
	 * @return String
	 */
	function numFormat(num)
	{
		num = num || 0;
		var result = '';
		var numArr = (num + "").split(".");
		if ( numArr.length > 1 )
		{
			return appUtils.numFormat(numArr[0]) + "." + appUtils.numFormat(numArr[1]);
		}
		
		listNum = (num + "").split("");
		for ( var i = listNum.length; i > 0 ; i-- )
		{
			if ( i % 3 == 0 && i != 1 && i != listNum.length)
			{
				result = ',' + listNum[i-1] + result;
			} else {
				result = listNum[i-1] + '' + result;
			}
		}
		return result;
	}
	
	/**
	 * Function Date & Time
	 * @param String dateTimeStr
	 * @return Object
	 */
	function dateTime(dateTimeStr)
	{
		dateTimeStr == dateTimeStr || null;
		if ( dateTimeStr == null )
		{
			return false;
		} else if (typeof dateTimeStr == 'string'){
			dateTimeStr	= dateTimeStr.replace(/-/g, '/');
		}
		var dayArr		= ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		var dayMinArr	= ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
		var monthArr	= ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August','September', 'October', 'November', 'December'];
		var monthMinArr	= ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug','Sep', 'Oct', 'Nov', 'Dec'];
		
		var obj = new Date(dateTimeStr);
		obj.getStrDay	= function () {
			return dayArr[this.getDay()];
		};
		obj.getStrDayMin= function () {
			return dayMinArr[this.getDay()];
		};
		obj.getStrMonth	= function () {
			return monthArr[this.getMonth()];
		};
		obj.getStrMonthMin	= function () {
			return monthMinArr[this.getMonth()];
		};
		obj.getSuffix	= function () {
			var suffix	= 'th';
			switch(this.getDate())
			{
				case '1': case '21': case '31': suffix = 'st'; break;
				case '2': case '22': suffix = 'nd'; break;
				case '3': case '23': suffix = 'rd'; break;
				default: suffix = 'th';
			}
			return suffix;
		};
		obj.getFormat	= function (format) {
			var format	= format || "m/d/Y";
			var result	= angular.copy(format).split('');
			var today	= this;
			
			var list = {};
			list['d']	= today.getDate() < 10 ? '0' + today.getDate() : today.getDate();
			list['D']	= today.getStrDayMin();
			list['j']	= today.getDate();
			list['l']	= today.getStrDay(); list['L']	= today.getStrDay();
			list['N']	= today.getDay()+1;
			list['S']	= today.getSuffix();
			list['w']	= today.getDay();
			
			list['F']	= today.getStrMonth();
			list['m']	= today.getMonth()+1 < 10 ? '0' + (today.getMonth()+1) : today.getMonth()+1;
			list['M']	= today.getStrMonthMin();
			list['n']	= today.getMonth()+1;
			
			list['y']	= today.getYear();
			list['Y']	= today.getFullYear();
			
			// Time
			list['a']	= today.getHours() >= 12 ? 'pm' : 'am';
			list['A']	= angular.uppercase(list['a']);
			list['h']	= today.getHours() > 12 ? today.getHours() - 12 : today.getHours();
			list['h']	= list['h'] < 10 ? '0' + list['h'] : list['h'];
			list['H']	= today.getHours();
			list['H']	= list['H'] < 10 ? '0'+list['H'] : list['H'];
			list['i']	= today.getMinutes() < 10 ? '0'+today.getMinutes() : today.getMinutes();
			list['s']	= today.getSeconds() < 10 ? '0'+today.getSeconds() : today.getSeconds();
			
			angular.forEach(list, function (value, key) {
				angular.forEach(result, function (rp, ind) {
					if ( rp == key )
					{
						result[ind]	= value;
					}
				});
			});
			return result.join('');
		};
		return obj;
	}
});