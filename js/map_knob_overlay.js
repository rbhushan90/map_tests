function KnobOverlay(latlng, map, args) {
	this.latlng = latlng;
	this.args = args;
	this.setMap(map);
/*
	 var marker = new google.maps.Marker({
		position: latlng,
		map: map
	 });
	 */
}

KnobOverlay.prototype = new google.maps.OverlayView();

KnobOverlay.prototype.draw = function() {
  console.log("DRAW KNOB .....");
	var self = this;

	var div = this.div;

	if (!div) {

		div = this.div = document.createElement('div');

		div.className = 'marker';

	  div.style.position = 'absolute';
		div.style.cursor = 'pointer';
		/*
		div.style.border = "1px solid black";
		div.style.textAlign = "center";
		div.style.width = '200px';
		div.style.height = '200px';
		*/

	 //  Util for converting Radius to Pixels
	  var radius = getRadiusInPixels(self.args.radius);
		var diameter = radius*2;
		//console.log("radius in pixels = " + radius);

		div.innerHTML = '<div class="demo" id="' + self.args.marker_id + '">' +
			'<input class="knob" ' +
			'data-cursor=true data-fgColor="rgba(0, 255, 0, 0.5)" ' +
			'data-bgColor="rgba(51, 204, 255, 0.5)" data-thickness=.3 value="29" ' +
			'data-width=' + diameter   +
			' data-height=' + diameter  +
			'></div>';


		if (typeof(self.args.marker_id) !== 'undefined') {
			div.dataset.marker_id = self.args.marker_id;
		}

		var panes = this.getPanes();
		panes.overlayImage.appendChild(div);
		this.initKnob();
	}

	var point = this.getProjection().fromLatLngToDivPixel(this.latlng);
	// place the centrepoint of Knob in the centre of the Circle
	if (point) {
		div.style.left = (point.x -radius) + 'px';
		div.style.top = (point.y-radius) + 'px';
	}
};

KnobOverlay.prototype.remove = function() {
	if (this.div) {
		this.div.parentNode.removeChild(this.div);
		this.div = null;
	}
};

KnobOverlay.prototype.getPosition = function() {
	return this.latlng;
};

KnobOverlay.prototype.redraw = function() {
	this.remove();
	this.draw();
};


KnobOverlay.prototype.initKnob = function() {
	        $(".knob").knob({
	            change : function (value) {
	                //console.log("change : " + value);
	            },
	            release : function (value) {
	                //console.log(this.$.attr('value'));
	                console.log("release : " + value);
	            },
	            cancel : function () {
	                console.log("cancel : ", this);
	            },
	            draw : function () {
	                console.log("draw");
	                // "tron" case

	                if(this.$.data('skin') == 'tron') {

	                    this.cursorExt = 0.3;

	                    var a = this.arc(this.cv)  // Arc
	                        , pa                   // Previous arc
	                        , r = 1;

	                    this.g.lineWidth = this.lineWidth;

	                    if (this.o.displayPrevious) {
	                        pa = this.arc(this.v);
	                        this.g.beginPath();
	                        this.g.strokeStyle = this.pColor;
	                        this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, pa.s, pa.e, pa.d);
	                        this.g.stroke();
	                    }

	                    this.g.beginPath();
	                    this.g.strokeStyle = r ? this.o.fgColor : this.fgColor ;
	                    this.g.arc(this.xy, this.xy, this.radius - this.lineWidth, a.s, a.e, a.d);
	                    this.g.stroke();

	                    this.g.lineWidth = 2;
	                    this.g.beginPath();
	                    this.g.strokeStyle = this.o.fgColor;
	                    this.g.arc( this.xy, this.xy, this.radius - this.lineWidth + 1 + this.lineWidth * 2 / 3, 0, 2 * Math.PI, false);
	                    this.g.stroke();

	                    return false;
	                }

	            }
	        });
};
