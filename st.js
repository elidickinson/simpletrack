/* Simpletrack by Eli Dickinson - http://github.com/elidickinson/simpletrack */
function st_setCookie(c_name,value,expiredays)
{
	var exdate=new Date();
	exdate.setDate(exdate.getDate()+expiredays);
	document.cookie=c_name+ "=" +escape(value)+
	((expiredays==null) ? "" : ";expires="+exdate.toUTCString());
}

function st_getCookie(c_name)
{
	if (document.cookie.length>0)
	  {
	  c_start=document.cookie.indexOf(c_name + "=");
	  if (c_start!=-1)
	    {
	    c_start=c_start + c_name.length+1;
	    c_end=document.cookie.indexOf(";",c_start);
	    if (c_end==-1) c_end=document.cookie.length;
	    return unescape(document.cookie.substring(c_start,c_end));
	    }
	  }
	return "";
}

function st_arrLength(arr) {
	return arr.join('$').length;
}

function st_reset() {
	st_setCookie("_st","",-100);
}

function st_read() {
	c = st_getCookie("_st");
	if(c != '') {
		arr = c.split('$');
	}
	else {
		arr = new Array();
	}
	return arr;
}

function st_write(arr) {
	st_setCookie("_st",arr.join('$'),7);
}

function st_pushUrl()
{
	uri = location.href.replace(/https?:\/\/[^\/]+/i,'');
	arr = st_read();
	if(arr.length >= 1) {
		pop = arr[arr.length - 1];
		if(pop == uri)
			return;
	}
	else {
		arr.push(document.referrer);
	}
	arr.push(uri);
	while(st_arrLength(arr) > 1024) {
		arr.shift();
	}
	st_write(arr);
}

function st_prettyPrint()
{
	arr = st_read();
	baseuri = location.href.match(/https?:\/\/[^\/]+/i);
	for(key in arr) {
		val = arr[key];
		if(val.match("^/")) {
			arr[key] = baseuri + val;
		}
	}
	return arr.join("\n");
}