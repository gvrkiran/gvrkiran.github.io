<!DOCTYPE html>
<!--[if IE 8]> 				 <html class="no-js lt-ie9" lang="en" > <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="en" > <!--<![endif]-->

<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width" />
  <meta name="description" content="Career path" />

  <title>Career path using Linkedin Data</title>

  <!--link href='http://fonts.googleapis.com/css?family=Source+Sans+Pro:300' rel='stylesheet' type='text/css'-->

  <script type="text/javascript" src="https://maps.google.com/maps/api/js?sensor=false"></script>
  <script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
  <script type="text/javascript" src="js/infobubble.js"></script>

  <script type="text/javascript">
    var map;
    var infoBubble = new InfoBubble();
    var markersArray = [];
    var flightArray = [];

    var style = [    
      {"stylers": [{"visibility": "off"}]},
      
      {"featureType": "road", "stylers": [{"visibility": "on"}, {"color": "#ffffff"}]},
      
      {"featureType": "road.arterial", "stylers": [{"visibility": "on"}, {"color": "#fee379"}]},
      
      {"featureType": "road.highway", "stylers": [{"visibility": "on"}, {"color": "#fee379"}]},

      {"featureType": "landscape", "stylers": [{"visibility": "on"}, {"color": "#f8f8f8"}]},

      {"featureType": "water", "stylers": [{"visibility": "on"}, {"color": "#a1d7f2"}]},

      {"featureType": "road", "elementType": "labels", "stylers": [{"visibility": "off"}]},

      {"featureType": "poi.park", "elementType": "geometry.fill", "stylers": [{"visibility": "off"}, {"color": "#83cead"}]},

      {"elementType": "labels.text.fill", "stylers": [{"visibility": "on"}, {"color": "#a1a9a9"}]},
      
      {"featureType": "landscape.man_made", "elementType": "geometry", "stylers": [{"weight": 0.9}, {"visibility": "off"}]}
    ]
    
    // Fusion Table variables
	var apiKey = 'AIzaSyAfxBvY5qj-qUV1C8WEiavPHL_SwHdsm7Y'; // kirans gmail account
	var tableID = '1I0hOVHyQaLFFW4-fNY5u7d0fNJ5pjqS-GrKDtmYz';

    function initialize() {
      fetchData();
      var mapOptions = {
        zoom: 3,
        center: new google.maps.LatLng(55.420453, 3.785500),
        disableDefaultUI:true,
        zoomControl:true,
        zoomControlOptions: {
          style:google.maps.ZoomControlStyle.SMALL,
          position: google.maps.ControlPosition.LEFT_TOP
        },
    
	styles: style,

        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      /*
      var layer = new google.maps.FusionTablesLayer({
	  query: {
		    select: 'latitude,longitude',
		    from: '1OWTj2MVHYVaApkp0ZZsgs6PnN6b56G6B7Ktt3koJ',
  		},
	
	styles: [{
		    polygonOptions: {
		      fillColor: "#00FF00",
		      fillOpacity: 0.3
		    }
//		  markerOptions: {
//		    iconName: "large_green"
//		  },
		}, {
		where: 'total_sentiment >= 1',
		  markerOptions: {
		    iconName: "small_green"
		  }
		}, {
		where: 'total_sentiment <= -1',
		  markerOptions: {
		    iconName: "small_blue"
		  }
		}]
	});

      */
      map = new google.maps.Map(document.getElementById('map-canvas'),mapOptions);
      layer.setMap(map);
      }

    function reinitialize() {
      fetchData();
      deleteOverlays();
    }

    function fetchData() {

      var userID = document.getElementsByName('userid');
      userID = userID[0].value;
      var query = 'SELECT latitude, longitude, startDateInt, endDateInt, startDate, endDate, title, company, type FROM ' + tableID + ' WHERE userid=' + userID + ' ORDER BY startDateInt';
     //  alert(query);

      var encodedQuery = encodeURIComponent(query);

      // Construct the URL
      var url = ['https://www.googleapis.com/fusiontables/v1/query'];
      url.push('?sql=' + encodedQuery);
      url.push('&key=' + apiKey);
      url.push('&callback=?');
      // Send the JSONP request using jQuery
      $.ajax({
        url: url.join(''),
        dataType: 'jsonp',
        success: onDataFetched
      });
    }

    function onDataFetched(data) {
      var rows = data['rows'];
      var coordinate;
      var contentString;

      for (var i in rows) {
	var latitude = rows[i][0];
	var longitude = rows[i][1];
	// perturb slightly to avoid overlapping markers
	var rand = Math.random()/10;
	latitude = latitude + rand;
	longitude = longitude + rand;
	var startDateInt = rows[i][2];
	var endDateInt = rows[i][3];
	var startDate = rows[i][4];
	var endDate = rows[i][5];
	var title = rows[i][6];
	var company = rows[i][7];
	if(company=="")
		company = " - ";
	var type = rows[i][8];
        coordinate = new google.maps.LatLng(latitude,longitude);
        if (type==="e") {
          contentString = '<div class="infowindow">' + title + ' at ' + company + ' from ' + startDate + ' to ' + endDate + '</div>';
        }
        else {
          contentString = '<div class="infowindow">' + title + ' at ' + company + ' from ' + startDate + ' to ' + endDate + '</div>';
        }
        createMarker(coordinate,contentString,i);
      }

      for (var i = 0; i < rows.length - 1; i++) {
	      // perturb slightly to avoid overlapping markers
	      var rand = Math.random()/10;
	      var lat1 = rows[i][0] + rand;
	      var lat2 = rows[i+1][0] + rand;
	      var lon1 = rows[i][1] + rand;
	      var lon2 = rows[i+1][1] + rand;
	      if(lat1==lat2 && lon1==lon2)
		      continue;
	      drawLine(lat1,lon1,lat2,lon2,i);
      }
    }

    function drawLine (lat1,lon1,lat2,lon2,i){
	var colors = ['#FF0000','#00FF00','#0000FF','#A52A2A','#DC143C','#000000','#006400','#8B0000'];
	var lineSymbol = {
		path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
		scale: 3
	};
	var flightPlanCoordinates = [
		{lat: lat1, lng: lon1},
		{lat: lat2, lng: lon2}
		];
	var flightPath = new google.maps.Polyline({
		path: flightPlanCoordinates,
		icons: [{
		icon: lineSymbol,
		offset: '100%'
		}],
		geodesic: true,
		strokeColor: colors[parseInt(i)%colors.length],
		strokeOpacity: 1.0,
		strokeWeight: 2
	});
	
	flightPath.setMap(map);
	flightArray.push(flightPath)
    }

    function createMarker (coordinate,contentString,i) {
      var marker = new google.maps.Marker({
        map: map,
        position: coordinate,
	label: i
      });
      markersArray.push(marker);
      google.maps.event.addListener(marker, 'click', function(event) {
        infoBubble.setPosition(coordinate);
        infoBubble.setContent(contentString);
        infoBubble.open(map);
      });
    }

    // Deletes all markers in the array by removing references to them.
    function deleteOverlays() {
      for (var i = 0; i < markersArray.length; i++ ) {
        markersArray[i].setMap(null);
      }
      for (var i = 0; i < flightArray.length; i++ ) {
        flightArray[i].setMap(null);
      }
      markersArray = [];
      flightArray = [];
    }

    google.maps.event.addDomListener(window, 'load', initialize);
</script>

<style>
  html {
    height: 100%;
  }
  body {
    margin: 0px;
    padding: 0px;
    height: 100%;
    font-family: "Source Sans Pro","Helvetica Neue","Helvetica",Helvetica,Arial,sans-serif;
  }
  #map-canvas {
    height: 100%;
    position: fixed !important;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 0;
  }
  .infowindow {
    padding: 15px;
    max-width: none !important;
    color: #16A085;
  }
  .overlay {
    position: absolute;
    top: 0;
    right: 15px;
    bottom: 0;
    z-index: 100;
  }
  .checkboxes {
    padding: 10px 20px;
    width: 240px;
    background: rgba(255,255,255,0.95);
    border-radius: 4px;
    margin-top: 15px;
  }
  .checkboxes h3 {
    margin: 0px;
    padding-bottom: 10px;
    color: #34495E;
    font-weight: 300;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 18px;
  }
  .checkboxes h3 img {
    margin-right: 7px;
  }
  .checkboxes label span {
    font-size: 12px;
    color: #bfbfbf;
  }
  .checkboxes input {
    margin-bottom: 8px;
  }
  .checkboxes label, input[type="checkbox"] {
    cursor:pointer;
    color: #bfbfbf;
  }
  .checkboxes .check-with-label:checked + .label-for-check {
    color: #16A085;
  }
  .checkboxes .check-with-label:checked + .label-for-check span {
    color: #34495E;
  }
</style>
</head>
<body>
  <div id="map-canvas"></div>

  <div class="overlay">

    <div class="checkboxes lang">
      <h3>Enter a user id:</h3>
	<input type="text" name="userid">
      <!--input type="checkbox" checked="checked" name="lang" id="other" value="other" class="check-with-label">
      <label for="other" class="label-for-check">Other</label-->
  <button type="button" onclick="reinitialize()" class="button-field">Search</button>
    </div>
  </div>

</body>
</html>
