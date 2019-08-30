var _functions = {};

jQuery(function($) {

	"use strict";

	/*================*/
	/* 01 - VARIABLES */
	/*================*/
	var swipers = [], winW, winH, winScr, videoNodeList, $grid, _ismobile = navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i), _isFF = 'MozAppearance' in document.documentElement.style;

	/*========================*/
	/* 02 - page calculations */
	/*========================*/
	_functions.pageCalculations = function(){
		winW = $(window).width();
		winH = $(window).height();
		if ($('.videoWrapper').length) videoNodeList = document.querySelectorAll('.videoWrapper video');
		if ( $('.stickyWrapper').length ) $('.stickyWrapper').css({'height': $('.stickyWrapper').outerHeight()});
	};

	/*=================================*/
	/* 03 - function on document ready */
	/*=================================*/

	// Check if mobile device
	if(_ismobile){
		$('body').addClass('mobile');
		$('video').remove();
	}

	// Main set time out for content loaded
	setTimeout( function() {
		$('html').animate({scrollTop: 0},2,function(){

			// Start video banner video
			startVideo();
			
			// Image and video preloader
			_functions.imgPreloader();

			// Remove Content on mobile
			if ( $(window).width() < 767 && $('.mobileRemoveWrapper').length ) { 
				$('.mobileRemoveWrapper.removeContent, .mobileRemoveWrapper .removeContent').remove();
				$('.mobileRemove .swiperNav').addClass('centered');
			}

			// Add class after page loaded
			$('body').addClass('loaded');

			// Page calculations functuin
			_functions.pageCalculations();

			// Swiper init function
			_functions.initSwiper();
			
			// Swiper slide resize functuin
			_functions.swiperNavResize();

			// Letter animation
			if ( !_ismobile ) {
				$('.descriptionTitle').each( function() {
					var splitString = $(this).find('.as').html();
				    var object = '';
				    
					for ( var i = 0; i < splitString.length; i++ ) {
						object += '<i>' + splitString.charAt(i) + '</i>';
						if ( splitString.length -1 ) {
							$(this).find('.as').html(object);
						}
					}	
				});
			}

			// Masonry
		    if ($('.grid').length) {
		        $grid = $('.grid').isotope({
			        itemSelector: '.grid-item',
			        layoutMode: 'masonry',
			        percentPosition: true,
			        masonry: {
						columnWidth: '.grid-sizer'
			        },
			        stamp: ".stamp"
		        });
		    }

		    // Bind filter button click
		    $('.filters-button-group').on( 'click', 'div', function() {
		      var filterValue = $( this ).attr('data-filter');
		      // use filterFn if matches value
		      filterValue = filterValue;
		      $grid.isotope({ filter: filterValue });

		      $('body, html').animate( {scrollTop: $('.gridWrapper').offset().top - $('header').outerHeight() }, 888);

		      if ( $('.masonryResponsive').is(':visible') ) {
		      	$('.sticky, .masonryResponsive ').removeClass('active');
		      }
		    });

		    // Change is-checked class on buttons
		    $('.filters-button-group').each( function( i, buttonGroup ) {
		      var $buttonGroup = $( buttonGroup );
		      $buttonGroup.on( 'click', 'div', function() {
		        $buttonGroup.find('.is-checked').removeClass('is-checked');
		        $( this ).addClass('is-checked');
		      });
		    });

		    if ( $('.jarallax').length && !_ismobile ) {
		    	$('.jarallax').jarallax({
				    speed: 0.2
				});
		    }
			
			// Animation init
			setTimeout( function() {
				if ( !_ismobile ) animationTrgg();
			}, 200);

			// Delate main page loader
			$('#loader-wrapper').fadeOut(300);
		});
	}, 900);

	/*==============================*/
	/* 04 - function on page resize */
	/*==============================*/
	_functions.resizeCall = function(){
		_functions.pageCalculations();
	};
	if(!_ismobile){
		$(window).resize(function(){
			_functions.resizeCall();
		});

	} else{
		window.addEventListener("orientationchange", function() {
			_functions.resizeCall();
		}, false);
	}

	/*==============================*/
	/* 05 - function on page scroll */
	/*==============================*/
	$(window).scroll(function(){
		_functions.scrollCall();
	});
	
	_functions.scrollCall = function(){
		winScr = $(window).scrollTop();
		$('.headerContact .imgWrapper').parent().removeClass('active');

		if ( !$('header').hasClass('style2') ) {
			if ( $('header nav').is(':visible') && winScr > $('heasder').outerHeight() ) {
				$('header').addClass('scrolled');
			} else {
				$('header').removeClass('scrolled');
			}
		}
		
		// Start/pause banner video
		if ( $('.videoWrapper').length && ( $('.videoWrapper').outerHeight() + $('.videoWrapper').offset().top ) <= $(window).scrollTop() && !_ismobile ) {
			pauseVideo();
		} else {
			startVideo();
		}
		
    	//Chenge page navigation anchor
    	 $('.pageNavigation a').each(function () {
	        var $t = $(this),
	        	scrollPath = $($t.attr('href'));

	        if ( scrollPath.offset().top - $('header').outerHeight() <= winScr + winH /2 && scrollPath.offset().top + scrollPath.outerHeight() /2 - $('header').outerHeight() > winScr ) {
	            $t.parent().addClass('active');
	        }
	        else{
	            $t.parent().removeClass('active');
	        }
	    });

    	// Hide home page navigation on last vieport block
    	if ( winScr + winH /2.8 > $(document).height() - winH ) {
    		$('.pageNavigation').addClass('hideNav');
    	} else {
    		$('.pageNavigation').removeClass('hideNav');
    	}

    	// Masonry sticky menu
    	if ( !_ismobile && $('.stickyWrapper').length && winScr + $('header').outerHeight() >= $('.stickyWrapper').offset().top + $('.stickyWrapper').outerHeight() ) {
    		$('.stickyWrapper .sticky').addClass('stickyOn');
    		setTimeout( function() {
    			$('.sticky .filters-button-group').addClass('showFilter');
    		}, 300);
    	} else {
    		$('.stickyWrapper .sticky').removeClass('stickyOn');
    		$('.sticky .filters-button-group').removeClass('showFilter');
    	}

    	// Attach masonry to bottom, when page scroll come to footer offset top
    	if ( !_ismobile && $('.stickyWrapper').length && $(window).scrollTop() + winH >= $(document).outerHeight() - $('footer').outerHeight() )  {
    		$('.stickyWrapper .sticky.stickyOn').css({'position': 'absolute', 'top': ( $('footer').offset().top - $('header').outerHeight() ) - $('.stickyWrapper .sticky.stickyOn').outerHeight() + 'px' });
    	} else {
    		$('.stickyWrapper .sticky.stickyOn').css({'position': 'fixed', 'top': 'auto' });
    	}

    	// Ini scroll animation
	    animationTrgg();
		
		// Case ajax
		caseAjax();
	};
	/*=====================*/
	/* 06 - swiper sliders */
	/*=====================*/
	var initIterator = 0;
	_functions.initSwiper = function(){
		$('.swiper-container').not('.initialized').each(function(){								  
			var $t = $(this);								  

			var index = 'swiper-unique-id-'+initIterator;

			$t.addClass('swiper-'+index+' initialized').attr('id', index);
			$t.find('.swiper-pagination').addClass('swiper-pagination-'+index);
			$t.closest('.swiperMainWrapper').find('.swiper-button-prev').addClass('swiper-button-prev-'+index);
			$t.closest('.swiperMainWrapper').find('.swiper-button-next').addClass('swiper-button-next-'+index);

			var slidesPerViewVar = ($t.data('slides-per-view'))?$t.data('slides-per-view'):1;
			if(slidesPerViewVar!='auto') slidesPerViewVar = parseInt(slidesPerViewVar, 10);

			swipers['swiper-'+index] = new Swiper('.swiper-'+index,{
				pagination: '.swiper-pagination-'+index,
		        paginationClickable: true,
		        nextButton: '.swiper-button-next-'+index,
		        prevButton: '.swiper-button-prev-'+index,
		        slidesPerView: slidesPerViewVar,
		        autoHeight:($t.is('[data-auto-height]'))?parseInt($t.data('auto-height'), 10):0,
		        loop: ($t.is('[data-loop]'))?parseInt($t.data('loop'), 10):0,
				autoplay: ($t.is('[data-autoplay]'))?parseInt($t.data('autoplay'), 10):0,
		        breakpoints: ($t.is('[data-breakpoints]'))? { 767: { slidesPerView: parseInt($t.attr('data-xs-slides'), 10) }, 991: { slidesPerView: parseInt($t.attr('data-sm-slides'), 10) }, 1199: { slidesPerView: parseInt($t.attr('data-md-slides'), 10) }, 1500: {slidesPerView: parseInt($t.attr('data-lg-slides'), 10)} } : {},
		        initialSlide: ($t.is('[data-ini]'))?parseInt($t.data('ini'), 10):0,
		        speed: ($t.is('[data-speed]'))?parseInt($t.data('speed'), 10):500,
		        keyboardControl: true,
		        mousewheelControl: ($t.is('[data-mousewheel]'))?parseInt($t.data('mousewheel'), 10):0,
		        mousewheelReleaseOnEdges: true,
		        direction: ($t.is('[data-direction]'))?$t.data('direction'):'horizontal',
				spaceBetween: winW < 992 ? ($t.is('[data-space-responsive]'))?parseInt($t.data('space-responsive'), 10):0 :($t.is('[data-space]'))?parseInt($t.data('space'), 10):0,
				parallax: (_isFF)?($t.data('parallax'), 0): ($t.is('[data-parallax]'))?parseInt($t.data('parallax'), 10):0,
				centeredSlides: ($t.is('[data-centered]'))?parseInt($t.data('centered'), 10):0,
				onTouchMove: function(swiper) {	
					if ( $t.closest('.casePopup').find('.swiper-slide-active video').length ) {
						$t.find('.swiper-slide-active .sliderVideo').removeClass("show");
						$t.find('.swiper-slide-active .playButton ').removeClass("hideBtn");
						$t.find('.swiper-slide-active video').get(0).pause();	
					}
				}
			});
			swipers['swiper-'+index].update();
			initIterator++;
		});

		$('.swiper-container.swiper-control-top').each(function(){
			swipers['swiper-'+$(this).attr('id')].params.control = swipers['swiper-'+$(this).closest('.coupleSwiperWrapper').find('.swiper-control-bottom').attr('id')];
		});
		$('.swiper-container.swiper-control-bottom').each(function(){
			swipers['swiper-'+$(this).attr('id')].params.control = swipers['swiper-'+$(this).closest('.coupleSwiperWrapper').find('.swiper-control-top').attr('id')];
		});
	};

	$('.swiper-control-bottom .swiper-slide').on('click', function(){
		swipers['swiper-'+$(this).closest('.coupleSwiperWrapper').find('.swiper-control-top').attr('id')].slideTo($(this).index())
	});

	/*==============================*/
	/* 07 - buttons, clicks, hovers */
	/*==============================*/

	//open and close popup
	$(document).on('click', '.open-popup', function(e){
		e.preventDefault();
		if ( $(this).attr('data-video-src') ) { //Check if video popup
	 		var videoSrc = $(this).attr('data-video-src');
				setTimeout(function() {
					$('.popupVideWrapper').append('<video src="#"></>');
					$('.popupVideWrapper video').attr('src', videoSrc ).get(0).play();
				},400);
				$('.popupContent').removeClass('active');
			}
		$('.popupContent').removeClass('active');
		$('.popupWrapper, .popupContent[data-rel="'+$(this).data('rel')+'"]').addClass('active');
		$('html').addClass('overflow-hidden');
		
	});

	$(document).on('click', '.buttonClose, .popupWrapper .layerClose', function(){
		$('.popupWrapper, .popupContent').removeClass('active');
		$('.popupVideWrapper').find('video').attr('src', '' );
		$('.popupVideWrapper').find('video').remove();
		$('html').removeClass('overflow-hidden');
		$('.headerNav').removeClass('active');
		$('.menuIcon').removeClass('active');
		if ( $(this).closest('.popupContainer').find('.swiper-slide-active .sliderVideo').length ) {
			$(this).closest('.popupContainer').find('.swiper-slide-active .sliderVideo video').get(0).pause;
		}
	});
	
	//Function OpenPopup
	function openPopup(foo){
		$('.popup-content').removeClass('active');
		$('.popup-wrapper, .popup-content[data-rel="'+foo+'"]').addClass('active');
		$('html').addClass('overflow-hidden');
		return false;
	}

	// Start/Pause video function
    var videoCheck = 0;
    function pauseVideo() {
    	if ( videoCheck && $('.videoPosition').length ) {
    		videoCheck = 0;

	    	$('.videoWrapper').removeClass('showVideo');

	    	for (var i = 0; i < videoNodeList.length; i++ ) {
				videoNodeList[i].pause();
			}
    	}
    }

    function startVideo() {
    	if ( $('.videoPosition').length && $('video').length ) {
    		videoCheck = 1;
  			
  			$('.videoWrapper').addClass('showVideo');
	    	document.querySelector('.videoPosition video').play();
    	}
    }
    
	//Smooth Scroll
    if(!_ismobile) SmoothScroll({ stepSize: 100 });

    // Mobile menu hamberger
    $('.menuIcon').on('click', function() {
    	$(this).toggleClass('active');
    	$('.headerNav').toggleClass('active');
    	$('html').toggleClass('overflow-hidden');
    	$('.headerContact, .pageLanguage').removeClass('active');
    	$('.headerNav .imgWrapper').toggleClass('showAnimation');
    	if ( $('.navWrapper li').hasClass('active') ) $('.imageHoverAnimation').find('.bgImage').eq( $('.navWrapper li.active').index() ).toggleClass('active');
    	$('body').toggleClass('hideMobileContent');
    	
    });

	$('.pageLanguage').on('click', function() {
    	$(this).toggleClass('active');
    });
    
    $('.headerContact .imgWrapper').on('click', function() {
    	$(this).parent().toggleClass('active');
    });
    
    // Header menu
    $('.navWrapper a').hover(
    	function() { //Mouseenter
    		if ( $(this).parent().hasClass('active') ) return false;

    		$('.imageHoverAnimation').find('.bgImage').eq( $(this).parent().index() ).addClass('showAnimation');

    		$('.headerDescription .as').removeClass('showAnimation');
    		$('.headerDescription').find('.as').eq( $(this).parent().index() ).addClass('showAnimation');
    		
    	},
    	function() { //Mouseleave
    		if ( $(this).parent().hasClass('active') ) return false;
    		
    		$('.headerDescription').find('.as').removeClass('showAnimation');
    		$('.imageHoverAnimation').find('.bgImage').removeClass('showAnimation');
    	}
    );

    // Video slider hover start/pause
    $(document).on('mouseover', '.sliderVideo', function(){ //Mouseenter
    	if ( $(this).closest('.imgWrapper').hasClass('videoPlayWrapper') ) return false;
    	$(this).addClass('show');
    	$(this).find('video').get(0).play();
    });

    $(document).on('mouseleave', '.sliderVideo', function(){ //Mouseleave
    	$(this).removeClass('show');
    	$(this).find('video').get(0).pause();
    	$(this).closest('.videoPlayWrapper').find('.playButton').removeClass('hideBtn');
    });

    $(document).on('click', '.playButton', function() {
    	if ( $(this).closest('.videoPlayWrapper').length ) {
    		$(this).closest('.videoPlayWrapper').find('.sliderVideo').addClass('show');
	    	$(this).closest('.videoPlayWrapper').find('video').get(0).play();
	    	$(this).addClass('hideBtn');
    	}
    	
    });

    // Click page navigation
    $('.pageNavigation a').on('click', function(e) {
    	e.preventDefault();
    	var thisOffset = $( $(this).attr('href') );

    	$('pageNavigation li').removeClass('active');
    	$('body, html').animate({scrollTop: thisOffset.offset().top - 90 }, 900);
    });

    // Scroll to id
    $('.scrollTo').on('click', function(e) {
    	e.preventDefault();

    	if($($(this).attr('href')).length)

      	if ( $('nav').is(':visible') ) { //Scroll to id for reposnive header height and destop header height
      		$('body, html').animate({scrollTop: $($(this).attr('href')).offset().top - 90}, 900);
      	} else {
      		$('body, html').animate({scrollTop: $($(this).attr('href')).offset().top - 70 }, 900);
      	}
      	
    });

    // Close contact Popup
    $('.closeLayer').on('click', function() {
    	$('.headerContact').removeClass('active');
    });

	$('.simpleInput').focus(function() { //If input focus in
		$(this).closest('label').addClass('activeInput');
		$('.activeInput .simpleInput').css({'paddingLeft': $(this).closest('label').find('.as').width() + 15});
	});

	$('.simpleInput').blur(function() { //After unfocus input
		$(this).closest('label').removeClass('activeInput');
	});

	$('.sticky .masonryResponsive').on('click', function() {
		$(this).toggleClass('active');
		$(this).closest('.sticky').toggleClass('active');
	});

	if ( $('#sidebar').length && $(window).width() > 767 ) {
		var sidebar = new StickySidebar('#sidebar', {
			topSpacing: 200,
			bottomSpacing: 200,
			containerSelector: '.newsStickyWrapper',
			innerWrapperSelector: '.newsSticky'
		});
	}

    // Page content animation
	var scroll_index = 0,
		animationTrggLen = $('.animationTrggWrapper').length;
	function animationTrgg() {
		if ( scroll_index == animationTrggLen ) return false; // Check if animated last iteam
		else if ( ( $('.animationTrggWrapper').eq(scroll_index).offset().top <= $(window).scrollTop() + $(window).height() /1.25 ) ) {
			$('.animationTrggWrapper').eq(scroll_index).addClass('imgAnimated');
			scroll_index ++; // Increment variables for next animation block
		}
	}

	// Image and video loader
	_functions.imgPreloader = function() {
		$('.imgPreloader').not('.preloaded').each(function() {
			if ( $(this).hasClass('bgImage') || $(this).hasClass('innerBg') ) { 
				$(this).css({'background-image': 'url(' + $(this).attr("data-preload") + ')'});
				$(this).addClass('preloaded');
				
			} else {
				$(this).attr('src', $(this).attr('data-preload') );
				$(this).addClass('preloaded');
			}
			
			if ( !_ismobile && $(this).attr('data-preload-video') ) {
				$(this).append('<video src="#"> </video>');
				$(this).find('video').attr('src', $(this).attr('data-preload-video'));
				$(this).addClass('preloaded');
			}
		});
	};

	// Swiper nav resize
	_functions.swiperNavResize = function() {
		$('.swiperNav').each(function() {
			
			var $this = $('.swiperNav');
			
			if ( $this.find('.swiper-button-next').hasClass('swiper-button-disabled') ) {
				$this.closest('.swiperMainWrapper').find('.swiper-wrapper').addClass('stopSwiper');
				$this.find('.btnWrapper').addClass('hidden');
			} else {
				$this.closest('.swiperMainWrapper').find('.swiper-wrapper').removeClass('stopSwiper');
				$this.find('.btnWrapper').removeClass('hidden');
			}
			
		});
	}
	// Case ajax
    var checkAjax = 1;
    function caseAjax(){
    	if ( !checkAjax ) return false;
	    if ( $('.fullPageAjax').length && $(window).scrollTop() + winH >= $(document).outerHeight() - $('footer').outerHeight() ) {
	    	checkAjax = 0;		    	
	    	var url = $('.fullPageAjax').attr('data-fullPageAjax');
			$('.ajaxLoader').fadeIn();
			$.ajax({
				type:"GET",
				async:true,
				url: url,
				success:function(response){
					var responseObject = $($.parseHTML(response));
					// Settimeout for front end
					setTimeout(function() {
						$grid.isotope() //append new content and update Isotope masonry 
						 	.append( responseObject )
						 	.isotope( 'appended', responseObject );
							_functions.imgPreloader();

						if ( _ismobile ) $('html, body').animate({scrollTop: $('.gridWrapper').offset().top - $('header').outerHeight()},800);
						$('.stickyWrapper .sticky.stickyOn').css({'position': 'fixed', 'top': 'auto' });
						$('.ajaxLoader').fadeOut();

						setTimeout( function() {
							checkAjax = 1;
						},300);
						
					}, 1500);
				}
			});
	    }
    }

	// Ajax
	$(document).on('click', '.ajaxButton', function(e){
		e.preventDefault();
		var url = $(this).attr('href');
		if ( $(this).hasClass('ajaxPopup') ) var popupUrl = $(this).data('rel');

		$('.ajaxLoader').fadeIn();
		$.ajax({
			type:"GET",
			async:true,
			url: url,
			success:function(response){
				var responseObject = $($.parseHTML(response));
				// Set time out for front end
				setTimeout(function() {
					$('.ajaxWrapperContent *').remove();
					$('.ajaxWrapperContent').append(responseObject);

					if ( popupUrl ) {
						_functions.initSwiper();
						$('.popupWrapper, .popupContent[data-rel="'+popupUrl+'"]').addClass('active');
						$('html').addClass('overflow-hidden');

					}
					if ( $('.animatePopupContent').length ) $('.animatePopupContent').addClass('imgAnimated');
					
					$('.ajaxLoader').fadeOut();
				}, 1500);
			}
		});
    });
});