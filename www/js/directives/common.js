(function () {
	'use strict';

	angular.module('my2cent.directives')
		.directive('bottomTabFade', function($document) {
		    var fadeAmt;

		    var shrink = function(header, content, amt, max) {
		      amt = Math.min(44, amt);
		      fadeAmt = 1 - amt / 44;
		      
		      ionic.requestAnimationFrame(function() {
			        header.style[ionic.CSS.TRANSFORM] = 'translate3d(0, ' + amt + 'px, 0)';
			        for(var i = 0, j = header.children.length; i < j; i++) {
			          	//console.log(header.style.opacity);
			          	header.children[i].style.opacity = fadeAmt;
			        }
		      	});
		    };

		    return {
		      	restrict: 'A',
		      	link: function($scope, $element, $attr) {
		      		var orgStarty;
			        var starty = orgStarty = $scope.$eval($attr.bottomTabFade) || 40;
			        var shrinkAmt;

			        var header = $document[0].body.querySelector('.tab-nav');
			        var headerHeight = header.offsetHeight;

			        $element.bind('scroll', function(e) {
			            shrinkAmt = headerHeight - (headerHeight - (e.detail.scrollTop - starty));
			            if (shrinkAmt >= headerHeight){
			              	//header is totaly hidden - start moving startY downward so that when scrolling up the header starts showing
			              	starty = (e.detail.scrollTop - headerHeight);
			              	shrinkAmt = headerHeight;
			            } else if (shrinkAmt < 0){
			              	//header is totaly displayed - start moving startY upwards so that when scrolling down the header starts shrinking
			              	starty = Math.max(orgStarty, e.detail.scrollTop);
			              	shrinkAmt = 0;
			            }

			            shrink(header, $element[0], shrinkAmt, headerHeight); //do the shrinking

			        });
		      	}
		    }
	  	})
})();