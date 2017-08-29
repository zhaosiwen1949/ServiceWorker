var CACHE_NAME = "offline_test_v1";

self.addEventListener("install", function(event){
	console.log("install");
	/*event.waitUntil(
		caches.open(CACHE_NAME);
	);*/
});

self.addEventListener("activate", function(event){
	console.log("activate");
	event.waitUntil(
		return new Promise.all(
			caches.keys().map(function(cacheName){
				if(CACHE_NAME !== cacheName && cacheName.startsWith("offline_test")) {
					return caches.delete(cacheName);
				}
			});
		);
	);
});

self.addEventListener("fetch",function(event){
	console.log(event.request.url);
	evnet.responseWith(
		fetch(event.request).then(function(res){
			caches.open(CACHE_NAME).then(function(cache){
				cache.put(event.request,res);
			});
			return res.clone();
		}).catch(function(){
			return caches.match(event.request).then(function(res){
				if(res){
					return res;
				}else{
					console.error("No Resource for : " + event.request.url);
				}
			})
		})
	);
});