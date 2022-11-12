<!--浏览器搞笑标题-->
 var OriginTitle = document.title;
 var titleTime;
 document.addEventListener('visibilitychange', function () {
     if (document.hidden) {
         $('[rel="icon"]').attr('href', "/img/fluid.png");
         document.title = '你不爱我了吗？o(TヘTo)' + OriginTitle;
         clearTimeout(titleTime);
     }
     else {
         $('[rel="icon"]').attr('href', "/img/fluid.png");
         document.title = 'ヾ(Ő∀Ő3)ノ终于回来了' + OriginTitle;
         titleTime = setTimeout(function () {
             document.title = OriginTitle;
         }, 2000);
     }
 });