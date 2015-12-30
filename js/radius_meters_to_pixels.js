/**
 * Credit : https://gist.github.com/Xennis/7db1a832250d3e33c65b
 * Google Maps JavaScript API - Convert a radius given in meters to the
 * corresponding number of pixel.
 *
 * ### Credits:
 *
 * "JS Bin - rorecuce",
 * http://jsbin.com/rorecuce/1/edit
 *
 * Example "Showing pixel and tile coordinates",
 * https://developers.google.com/maps/documentation/javascript/examples/map-coordinates?csw=1
 *
 *    Portions of this core are modifications based on work created and shared
 *    by Google (https://developers.google.com/site-policies) and used according
 *    to terms described in the Apache 2.0 License
 *    (http://www.apache.org/licenses/LICENSE-2.0)
 */

	var TILE_SIZE = 256;

	function bound(value, opt_min, opt_max) {
		if (opt_min !== null) value = Math.max(value, opt_min);
		if (opt_max !== null) value = Math.min(value, opt_max);
		return value;
	}

	function degreesToRadians(deg) {
		return deg * (Math.PI / 180);
	}

	function radiansToDegrees(rad) {
		return rad / (Math.PI / 180);
	}

	/** @constructor */
	function MercatorProjection() {
		this.pixelOrigin_ = new google.maps.Point(TILE_SIZE / 2, TILE_SIZE / 2);
		this.pixelsPerLonDegree_ = TILE_SIZE / 360;
		this.pixelsPerLonRadian_ = TILE_SIZE / (2 * Math.PI);
	}

	MercatorProjection.prototype.fromLatLngToPoint = function (latLng, opt_point) {
		var me = this;
		var point = opt_point || new google.maps.Point(0, 0);
		var origin = me.pixelOrigin_;

		point.x = origin.x + latLng.lng() * me.pixelsPerLonDegree_;

		// NOTE(appleton): Truncating to 0.9999 effectively limits latitude to
		// 89.189.  This is about a third of a tile past the edge of the world
		// tile.
		var siny = bound(Math.sin(degreesToRadians(latLng.lat())), - 0.9999, 0.9999);
		point.y = origin.y + 0.5 * Math.log((1 + siny) / (1 - siny)) * -me.pixelsPerLonRadian_;
		return point;
	};

	MercatorProjection.prototype.fromPointToLatLng = function (point) {
		var me = this;
		var origin = me.pixelOrigin_;
		var lng = (point.x - origin.x) / me.pixelsPerLonDegree_;
		var latRadians = (point.y - origin.y) / -me.pixelsPerLonRadian_;
		var lat = radiansToDegrees(2 * Math.atan(Math.exp(latRadians)) - Math.PI / 2);
		return new google.maps.LatLng(lat, lng);
	};

	/**
	 * Converts the given radius in meters to pixels.
	 *
	 * @param {number} desiredRadiusInInMeters Desired radius in meters
	 * @returns {number} Desired redius in meters
	 */
	function getRadiusInPixels(desiredRadiusInInMeters) {
		var numTiles = 1 << map.getZoom();
		var center = map.getCenter();
		var moved = google.maps.geometry.spherical.computeOffset(center, 10000, 90); /*1000 meters to the right*/
		var projection = new MercatorProjection();
		var initCoord = projection.fromLatLngToPoint(center);
		var endCoord = projection.fromLatLngToPoint(moved);
		var initPoint = new google.maps.Point(
			initCoord.x * numTiles,
			initCoord.y * numTiles);
		var endPoint = new google.maps.Point(
			endCoord.x * numTiles,
			endCoord.y * numTiles);
		var pixelsPerMeter = (Math.abs(initPoint.x-endPoint.x))/10000.0;
		var totalPixelSize = Math.floor(desiredRadiusInInMeters*pixelsPerMeter);
		//console.log(totalPixelSize);
		return totalPixelSize;
	}
