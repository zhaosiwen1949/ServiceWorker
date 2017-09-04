var CACHE_NAME = "offline_test_v5";

function canLoad(request){
	if(/\.action$/.test(request.url.split('?')[0]) ||
		/\.json$/.test(request.url.split('?')[0]) ||
		/\.css$/.test(request.url.split('?')[0])){
		return true;
	}else{
		return false;
	}
}

self.addEventListener("install", function(event){
	console.log("install");
	/*event.waitUntil(
		caches.open(CACHE_NAME);
	);*/
});

self.addEventListener("activate", function(event){
	console.log("activate");
	event.waitUntil(
		caches.keys().then(function(cacheNames){
			return Promise.all(
				cacheNames.map(function(cacheName){
					if(CACHE_NAME !== cacheName && cacheName.startsWith("offline_test")) {
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
});

self.addEventListener("fetch",function(event){
	event.respondWith(
		fetch(event.request).then(function(res){
			if(/\.json/.test(event.request.url)){
				console.log("JSON request");
				console.log(event.request.method);
				console.log(event.request.url.split('?')[0]);
			}
			//console.log(event.request.url);
			//console.log(event.request.method);

			caches.open(CACHE_NAME).then(function(cache){
				if(event.request.method === 'GET' &&
					canLoad(event.request) ){
					//console.log(event.request.url);
					cache.put(event.request,res);	
				}
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