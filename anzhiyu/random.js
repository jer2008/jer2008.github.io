var posts=["post/b8f4bd70.html","post/a1205a06.html","post/9d364cf5.html","post/602efba8.html","post/4a17b156.html","post/f7cfbdaf.html","post/d288743f.html","post/86d0fde8.html","post/793128f3.html","post/ec3e4ec6.html","post/e2dcdda5.html","post/a5dd3e57.html","post/59cd14a1.html","post/8af61b16.html"];function toRandomPost(){pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);};