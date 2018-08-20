String.prototype.stripNonNumeric = function() {
    var str = this + '';
    var rgx = /^\d|\.|-$/;
    var out = '';
    for( var i = 0; i < str.length; i++ ) {
        if( rgx.test( str.charAt(i) ) ) {
            if( !( ( str.charAt(i) == '.' && out.indexOf( '.' ) != -1 ) ||
            ( str.charAt(i) == '-' && out.length != 0 ) ) ) {
                out += str.charAt(i);
            }
        }
    }
    return out;
};

Number.prototype.format = function(format) {
if (typeof(format) != 'string') {return '';} // sanity check

var hasExtend = format.indexOf('/');
var divider=1;
if(-1<hasExtend){
	divider=format.substr(hasExtend+1,format.length);
	format=format.substr(0,hasExtend);
}
var hasComma = -1 < format.indexOf(','),
  psplit = format.stripNonNumeric().split('.'),
  that = this/divider;

// compute precision
if (1 < psplit.length) {
  // fix number precision
  that = that.toFixed(psplit[1].length);
}
// error: too many periods
else if (2 < psplit.length) {
  throw('NumberFormatException: invalid format, formats should have no more than 1 period: ' + format);
}
// remove precision
else {
  that = that.toFixed(0);
}
	 
// get the string now that precision is correct
var fnum = that.toString();
	 
// format has comma, then compute commas
if (hasComma) {
  // remove precision for computation
  psplit = fnum.split('.');
	 
  var cnum = psplit[0],
    parr = [],
    j = cnum.length,
    m = Math.floor(j / 3),
    n = cnum.length % 3 || 3; // n cannot be ZERO or causes infinite loop
	 
  // break the number into chunks of 3 digits; first chunk may be less than 3
  for (var i = 0; i < j; i += n) {
    if (i != 0) {n = 3;}
    parr[parr.length] = cnum.substr(i, n);
    m -= 1;
  }
	 
	    // put chunks back together, separated by comma
	    fnum = parr.join(',');
	 
	    // add the precision back in
	    if (psplit[1]) {fnum += '.' + psplit[1];}
	  }
	 
	  // replace the number portion of the format with fnum
	  return format.replace(/[\d,?\.?]+/, fnum);
	};