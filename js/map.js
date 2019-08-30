jQuery(function($) {

	var maps = [];

	var styles = [
		// Style 0 
		[{"featureType":"all","elementType":"all","stylers":[{"lightness":"29"},{"invert_lightness":!0},{"hue":"#008fff"},{"saturation":"-73"}]},{"featureType":"all","elementType":"labels","stylers":[{"saturation":"-72"}]},{"featureType":"administrative","elementType":"all","stylers":[{"lightness":"32"},{"weight":"0.42"}]},{"featureType":"administrative","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":"-53"},{"saturation":"-66"}]},{"featureType":"landscape","elementType":"all","stylers":[{"lightness":"-86"},{"gamma":"1.13"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"hue":"#006dff"},{"lightness":"4"},{"gamma":"1.44"},{"saturation":"-67"}]},{"featureType":"landscape","elementType":"geometry.stroke","stylers":[{"lightness":"5"}]},{"featureType":"landscape","elementType":"labels.text.fill","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"poi","elementType":"labels.text.fill","stylers":[{"weight":"0.84"},{"gamma":"0.5"}]},{"featureType":"poi","elementType":"labels.text.stroke","stylers":[{"visibility":"off"},{"weight":"0.79"},{"gamma":"0.5"}]},{"featureType":"road","elementType":"all","stylers":[{"visibility":"simplified"},{"lightness":"-78"},{"saturation":"-91"}]},{"featureType":"road","elementType":"labels.text","stylers":[{"color":"#ffffff"},{"lightness":"-69"}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"lightness":"5"}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"lightness":"10"},{"gamma":"1"}]},{"featureType":"road.local","elementType":"geometry.fill","stylers":[{"lightness":"10"},{"saturation":"-100"}]},{"featureType":"transit","elementType":"all","stylers":[{"lightness":"-35"}]},{"featureType":"transit","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"all","stylers":[{"saturation":"-97"},{"lightness":"-14"}]}]
	];

	function Map(id, mapOptions){
		this.map = new google.maps.Map(document.getElementById(id), mapOptions);
		this.markers = [];
		this.infowindows = [];
	}

	function addMarker(mapId,location,index,contentstr,image){
        maps[mapId].markers[index] = new google.maps.Marker({
            position: location,
            map: maps[mapId].map,
			icon: {
				url: image
			}
        });

		maps[mapId].infowindows[index] = new google.maps.InfoWindow({
			content:contentstr
		});
		
		google.maps.InfoWindow.prototype.opened = true;
		google.maps.event.addListener(maps[mapId].markers[index], 'click', function() {

			if(infoWindow.opened){
			   infoWindow.opened = false;
			   maps[mapId].infowindows[0].open(maps[mapId].map, maps[mapId].markers[index]);
			}
			else{
			   maps[mapId].infowindows[0].close();
			   infoWindow.opened = true;
			   maps[mapId].infowindows[0].open(maps[mapId].map, maps[mapId].markers[index]);
			}
		});

		google.maps.InfoWindow.prototype.opened = false;
		infoWindow = new google.maps.InfoWindow();


    }

	function initialize(mapInst) {

		var lat = mapInst.attr("data-lat"),
			lng = mapInst.attr("data-lng"),
			newLat,
			newLang,
			myLatlng = new google.maps.LatLng(lat,lng),
			setZoom = parseInt(mapInst.attr("data-zoom")),
			mapId = mapInst.attr('id');

		var mapStyle = styles[parseInt(mapInst.data('style'),10)];
		var styledMap = new google.maps.StyledMapType(mapStyle,{name: "styledmap"});

		var mapOptions = {
			zoom: setZoom,
			disableDefaultUI: true,
			scrollwheel: false,
			zoomControl: true,
			streetViewControl: true,
			center: myLatlng
		};

		maps[mapId] = new Map(mapId, mapOptions);

		maps[mapId].map.mapTypes.set('map_style', styledMap);
  		maps[mapId].map.setMapTypeId('map_style');

		var i = 0;

		$('.marker[data-rel="'+mapId+'"]').each(function(){
			var loc = new google.maps.LatLng($(this).data('lat'), $(this).data('lng')),
				text = $(this).data('string'),
				image = $(this).data('image');
			$(this).data('i', i).data('map',mapId);
			addMarker(mapId,loc,i,text,image);
			i++;
		});

		// Change map location
		$(".city1").on('click', function () {
			newLat = $(this).attr('data-lat');
			newLang = $(this).attr('data-lng');
			maps[mapId].map.setCenter({lat:+newLat, lng:+newLang});
		});
		$(".city2").on('click', function () {
			newLat = $(this).attr('data-lat');
			newLang = $(this).attr('data-lng');
			maps[mapId].map.setCenter({lat:+newLat, lng:+newLang});
		});
	 
	}

	$(window).load(function(){

		$('.map-wrapper').each(function(){
			initialize($(this));
		});

		var tempInfowindow;

		$('.marker').on('click', function(){
			var thisMapId = $(this).data('map'),
				thisIndex = $(this).data('i');
			if(tempInfowindow) tempInfowindow.close();
			tempInfowindow = maps[thisMapId].infowindows[thisIndex];
			maps[thisMapId].infowindows[thisIndex].open(maps[thisMapId].map, maps[thisMapId].markers[thisIndex]);
			maps[thisMapId].map.setCenter(new google.maps.LatLng($(this).data('lat'), $(this).data('lng')));

		});

	});

});