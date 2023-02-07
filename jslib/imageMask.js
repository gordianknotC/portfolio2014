/**
 * jQuery imageMask
 * @author Almog Baku - almog.baku@gmail.com
 * @see https://github.com/AlmogBaku/imageMask
 *
 * @version 0.1.6
 * @license MIT License
 */

(function( $ ) {
	var $_count_id = 0;

	$.fn.imageMask = function( _mask, _callback , attributes) {
		if ( _mask == undefined ) {
			console.error( "imageMask: undefined mask" );
			return false;
		}
		if ( !this.is( "img" ) ) {
			console.error( "imageMask: jQuery object MUST be an img element" );
			return false;
		}
		if ( (_callback != undefined) && (!$.isFunction( _callback )) ) {
			console.error( "imageMask: callback MUST be function" );
			return false;
		}

		//create mask object
		var maskObj = null;
		if ( _mask.src ) {
			maskObj = _mask;
		} else {
			maskObj = new Image();
			maskObj.src = _mask;
		}

		var obj = this;
		obj.css( "visibility", "hidden" );

		$( maskObj ).load( function() {
			var $maskData = null;
			obj.each( function() {
				//reset
				var $image = $( this ), $canvasObj = null;

				//Create canvas
				$canvasObj = createCanvas( this, maskObj, attributes );
				console.log('$canvasObj:', $canvasObj)
				var ctx = $canvasObj[0].getContext( "2d" );

				if ( $maskData == null ) {
					$maskData = get_maskData( $canvasObj, ctx, maskObj );
					console.log('$maskData:', $maskData)
				} //get mask data if not exist

				//reRender image
				var img = new Image();
				img.src = $( this ).attr( 'src' );
				$( img ).load( function() {
					drawImg( $canvasObj, ctx, img );
					//Applying mask
					applyMask( $canvasObj[0], ctx, $maskData );

					//removing original image
					$image.remove();

					//callback
					if ( $.isFunction( _callback ) ) {
						_callback( $canvasObj[0] );
					}
				} );
			} );
		} );

		return this;
	};

	function createCanvas ( img, mask, attributes ) {
		img = $( img );
		var id, w, h, x, y, sx, sy, sw, sh, result, attrs
		if (attributes == undefined){
			w = sw = mask.width
			h = sh = mask.height
			x = y = sx = sy = 0
		}else{
			w  = attributes.width
			h  = attributes.height
			x  =   0
			y  =   0
			sx = attributes.sx 		|| 0
			sy = attributes.sy 		|| 0
			sw = attributes.swidth  || w
			sh = attributes.sheight || h
		}

		//generate uniqe id
		if ( img.attr( "id" ) ) {
			id = img.attr( "id" );
		} else {
			id = $_count_id++;
		}
		id = "imageMask_" + id + "_canvas";
		attrs = {
			'id'    :id,
			'class' :img.attr( "class" ),
			'style' :img.attr( "style" ),
			'width' :w,
			'height':h,
			'x'     :x,
			'y'     :y,
			'sx'    :sx,
			'sy'    :sy,
			'swidth':sw,
			'sheight': sh
		}
		//create canvas element
		result =  $( "<canvas>" ).attr( attrs ).css( "visibility", "" ).insertAfter( img );
		result.attrs = attrs
		console.log('result:', result)
		return result
	}

	function get_maskData ( canvasObj, ctx, mask ) {
		var obj = canvasObj.attrs;
		console.log('get_maskData, canvasObj:', canvasObj)
		console.log('sattrsa:', obj)
		var sx = obj.sx,  sy = obj.sy,     x = obj.x,       y = obj.y,
			w = obj.width, h = obj.height, sw = obj.swidth, sh = obj.sheight;
		console.log('drawImage:', mask, sx, sy, sw, sh, x, y, h, w);
		// draw on mask
		ctx.drawImage( mask, sx, sy, sw, sh, x, y, h, w );                                                //draw image mask
		var maskData = ctx.getImageData( x, y, obj.width, obj.height ); //save mask data
		ctx.clearRect( x, y, obj.width, obj.height );                   //clear
		return maskData;
	}

	function drawImg ( canvasObj, ctx, img ) {
		var obj = canvasObj.attrs
		var x = obj.x,     y = obj.y,      sx = obj.sx,     sy = obj.sy,
			w = obj.width, h = obj.height, sw = obj.swidth, sh = obj.sheight
		console.log('drawImg:',obj, img, sx, sy, sw, sh, x, y, w, h)
		ctx.drawImage( img, sx, sy, sw, sh, x, y, w, h ); //draw image based on ratio for resizing
	}

	function applyMask ( canvasObj, ctx, maskData ) {
		var imgData = ctx.getImageData( 0, 0, canvasObj.width, canvasObj.height ); //getting the image data
		for ( var i = 0; i < imgData.data.length; i += 4 ) {
			imgData.data[i + 3] = maskData.data[i + 3]; //replacing the point's alpha with the mask alpha
		}
		ctx.putImageData( imgData, 0, 0 ); //apply the changes
	}
})( jQuery );