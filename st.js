/* Simpletrack by Eli Dickinson - http://github.com/elidickinson/simpletrack */

function simpletrack() {
	
	var cookieName = "_st";
	var cookieExpire = 7;
	var data;
	
	this.resetCookie = function() {
		// expiration in past deletes cookie
		setCookie(cookieName,"",-100);
	}
	
	this.trackPage = function() {
		uri = location.href.replace(/https?:\/\/[^\/]+/i,'');
		readData();
		if(data.length >= 1) {
			pop = data[data.length - 1].split("\t")[1];
			if(pop == uri)
				return;
		}
		else {
			// no pages stored, so add the referrer before adding current page
			if(document.referrer != '')
				data.push([new Date().getTime(),document.referrer]);
		}

		// push current site uri
		data.push([new Date().getTime(),uri]);

		// drop as many page records as needed to keep cookie length reasonable
		while(buildCookie() > 1024) {
			data.shift();
		}
		writeData();
	}
	
	this.prettyPrint = function() {
		readData();
		var baseuri = location.href.match(/https?:\/\/[^\/]+/i);
		var outputArr = new Array();
		for(i in data) {
			record = data[i];
			alert(record);
			record = record.split("\t");
			tstamp = record[0];
			uri = record[1];
			if(uri.match("^/")) {
				uri = baseuri + uri;
			}
			outputArr.push(tstamp + "\t" + uri);
		}
		return outputArr.join("\n");
	}
	
	var setCookie = function(c_name,value,expiredays) {
		var exdate=new Date();
		exdate.setDate(exdate.getDate()+expiredays);
		document.cookie = c_name + "=" +escape(value) +
			((expiredays==null) ? "" : ";expires="+exdate.toUTCString());
	}
	
	var getCookie = function(c_name) {
		if (document.cookie.length>0) {
			c_start=document.cookie.indexOf(c_name + "=");
			if (c_start!=-1) {
				c_start=c_start + c_name.length+1;
				c_end=document.cookie.indexOf(";",c_start);
				if (c_end==-1) c_end=document.cookie.length;
				return unescape(document.cookie.substring(c_start,c_end));
			}
		}
		return "";
	}
	
	var readData = function() {
		var c = getCookie(cookieName);
		data = new Array();
		if(c != '') {
			arr = c.split("\n");
			for(i in arr) {
				data.push(arr[i].split("\t"));
			}
		}
		alert("data="+data);
	}
	
	var buildCookie = function() {
		var arr = new Array();
		for(i in data) {
			arr.push(data[i].join("\t"));
		}
		return arr.join("\n");
	}
	
	var writeData = function() {
		setCookie(cookieName,buildCookie(),cookieExpire);
	}
}


// deprecated
function st_prettPrint() {
	(new simpletrack()).prettyPrint();
}

// deprecated
function st_pushUrl() {
	(new simpletrack()).trackPage();
}