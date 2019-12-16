/**
 * @module embed/utils
 */

const ATTRIBUTE_WHITESPACES = /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205f\u3000]/g; // eslint-disable-line no-control-regex
const SAFE_URL = /^(?:(?:https?|ftps?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.:-]|$))/i;


/**
 * Returns a media attributes based on a given source (url/embed code).
 * @param {string} source (url/embed code)
 * @returns {object} attributes.
 */
export function parseMediaEmbed( src ) {
	// var _width = _ckeditorTopDivWidth ? _ckeditorTopDivWidth:640;
	// var _height = parseInt(_width) * 0.5620;
	var _width = '100%';
	var _height = '100%';
	var _frameborder = 0;
	var _src = "";



	var src_element = src ? src.split(" "):[];

	for (var i = 0; i < src_element.length; i++) {
		if(src_element[i].includes("http") && !src_element[i].includes('src="http') && !src_element[i].includes('href="http') ){

			let _urlSegment = linkParser(src_element[i]);
			let index = _urlSegment.length - 1;

			if(_urlSegment && _urlSegment[index] && _urlSegment[0].includes('youtu')){

				_src = 'https://www.youtube.com/embed/'+_urlSegment[index].replace(/watch\?v=/g,'').replace(/&list=/g,'?list=');
			}
			if(_urlSegment && _urlSegment[index] && _urlSegment[0].includes('vimeo')){

				_src = 'https://player.vimeo.com/video/'+_urlSegment[index];
			}
		}
		// if(src_element[i].includes("width")){
		// 	let inPercent = src_element[i].includes("%");
		// 	_width = parseInt(src_element[i].replace(/width|=|"/g,''));
		// 	_width = _width + ( inPercent ? '%' : '' );
		// }
		// if(src_element[i].includes("height")){
		// 	let inPercent = src_element[i].includes("%");
		// 	_height = parseInt(src_element[i].replace(/height|=|"/g,''));
		// 	_height = _height + ( inPercent ? '%' : '' );
		// }
		if(src_element[i].includes("frameborder")){
			_frameborder = parseInt(src_element[i].replace(/frameborder|=|"/g,''));
		}
		if(src_element[i].includes("src=")){
			_src = src_element[i].replace(/src|=|"/g,'');
		}
	}

	return {
		width : _width,
		height : _height,
		src : _src != '' ? _src:'https://www.youtube.com/embed/'+src,
		frameborder : _frameborder,
		allow : "autoplay; encrypted-media",
		allowfullscreen : true,
		style: 'position:absolute;'
	};
}


/**
 * Returns a safe URL based on a given value.
 * An URL is considered safe if it is safe for the user (does not contain any malicious code).
 * If URL is considered unsafe, a simple `"#"` is returned.
 * @param {*} url
 * @returns {String} Safe URL.
 */
export function ensureSafeUrl( url ) {
	url = String( url );
	return isSafeUrl( url ) ? url : '#';
}

/**
 * Returns view element attributes.
 */
export function getViewElementAttributes( _viewElement ) {
	let _attributes = {};
	for (let item of _viewElement.getAttributes()) {
		_attributes[item[0]] = item[1];
	}
	return _attributes;
}

// Checks whether the given URL is safe for the user (does not contain any malicious code).
//
// @param {String} url URL to check.
function isSafeUrl( url ) {
	const normalizedUrl = url.replace( ATTRIBUTE_WHITESPACES, '' );
	return normalizedUrl.match( SAFE_URL );
}

// parse link and return segments
// @param {String} url URL to parse.
function linkParser(link){
  var urlLink = link.replace(/https:\/\/|http:\/\//gi, '');
  var urlSegmentArray = urlLink.split('/');
  for (var i = 0; i < urlSegmentArray.length; i++) {
    if(urlSegmentArray[i] == ""){
      urlSegmentArray.splice(i, 1);
      i = i - 1;
    }
  }
  return urlSegmentArray;
}
