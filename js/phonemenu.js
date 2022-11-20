{
	const template = `
		<div id="aDot">
			<div class="bg"></div>
			<div class="dot"></div>
		</div>
		<style>
		#aDot{
			display: flex;
			position: fixed;
			right: 20px;
			top: 50%;
			width: 60px;
			height: 60px;
			justify-content: center;
			align-items: center;
			z-index: 1000;
		}
		@media screen and (max-width: 768px){
			#aDot{
				display: flex;
			}
		}
		#aDot .bg{
			position: absolute;
			background-color: rgba(0, 0, 0, 0.6);
			width: 60px;
			height: 60px;
			border-radius: 50%;
		}
		#aDot .dot{
			position: absolute;
			width: 40px;
			height: 40px;
			border-radius: 50%;
			background-color: rgba(255, 255, 255, 0.6);
			transition: 0.1s;
		}
		</style>
	`
	document.body.insertAdjacentHTML('beforeend',template);


	let touchStartTime,
		touchStartPos;				//start信息
	let mouseDown = false;			//mousemove事件绑定在window上，mouseDown变量判断当前是否为悬浮菜单被按下，再进行move判断
	let isMoveDot = false;			//悬浮菜单是否为可移动状态
	let isFirstMove = false;		//因为move事件要移动才能触发，start时刷新为true，保证对第一次move的识别
	let startTip;					//提示可移动
	function start(e){
		isMoveDot = false;
		isFirstMove = true;
		touchStartTime = e.timeStamp;
		touchStartPos = [e.changedTouches[0].clientX,e.changedTouches[0].clientY];
		startTip = setTimeout(function(){
			kk.changeMessage("现在可移动了",2000,'green');
		},1000);	//长按设置的是1000ms后可移动（不移动move不会触发，这里可以提示一下，进入move后可取消这个定时器）
		return false;
	}
	function move(e){
		let touchTime = e.timeStamp-touchStartTime;
		let currentPos = [e.changedTouches[0].clientX,e.changedTouches[0].clientY];
		let offset = [currentPos[0]-touchStartPos[0],currentPos[1]-touchStartPos[1]];
		clearTimeout(startTip);
		if(touchTime > 1000 && isFirstMove){
			isFirstMove = false;
			isMoveDot = true;
			kk.changeMessage("可移动",5000,'var(--kk-card-titleBg-hover)');
		}else if(isFirstMove && offset[1] == 0 && offset[0] == 0){
			console.log("not move,just auto emit");
			// kk.changeMessage("长按可移动")
			return false;
		}
		isFirstMove = false;

		//移动
		if(isMoveDot){
			kk.changeMessage("移动中")
			document.querySelector('#aDot').style.top = `calc(${currentPos[1]*100/document.getElementById('web_bg').clientHeight}% - 30px)`;
			document.querySelector('#aDot').style.left = `calc(${currentPos[0]*100/document.getElementById('web_bg').clientWidth}% - 30px)`;
			return false;
		}

		if(offset[0]**2 + offset[1]**2 > 30**2){
			const l = Math.sqrt(offset[0]**2+offset[1]**2);
			offset[0] = 30*offset[0]/l;
			offset[1] = 30*offset[1]/l;
		}

		//一些动画
		// let posDeg;
		// if(offset[0] == 0){
		// 	posDeg = offset[1]>0?-90:90;
		// }else if(offset[0] < 0){
		// 	posDeg = 180+Math.atan(offset[1]/-offset[0])/Math.PI*180;
		// }else{
		// 	posDeg = Math.atan(offset[1]/-offset[0])/Math.PI*180;
		// }
		// posDeg = 360-posDeg;
		// posDeg %= 360;
		document.querySelector('#aDot .dot').style.transform = `translate(${offset[0]}px,${offset[1]}px)`;
		// document.querySelector('#aDot .dot').style.transform = `translate(${offset[0]}px,${offset[1]}px) rotate(${posDeg}deg)`
		// document.querySelector('#aDot .dot').style.borderRadius = `${10*(offset[0]**2+offset[1]**2)/900+20}px 20px 20px ${10*(offset[0]**2+offset[1]**2)/900+20}px / 20px`;
		// document.querySelector('#aDot .dot').style.width = `${6*(offset[0]**2+offset[1]**2)/900+40}px`;
		// document.querySelector('#aDot .dot').style.height = `${-5*(offset[0]**2+offset[1]**2)/900+40}px`;

		//判定事件
		if(touchTime < 300 && offset[0] == 0 && offset[1] == 0){
			kk.changeMessage("释放打开目录",2000,'var(--kk-card-titleBg-hover)');
		}else if(offset[0] == 0 && offset[1] == 0){
			kk.changeMessage("现在可以移动",2000,'var(--kk-card-titleBg-hover)');
		}else if((offset[0]**2+offset[1]**2) < 400){
			kk.changeMessage("释放取消操作",2000,'var(--kk-card-titleBg-hover)');
		}else if(
			offset[0] > 0 
			&& (Math.atan(offset[1]/offset[0])/Math.PI*180 < 45) 
			&& (Math.atan(offset[1]/offset[0])/Math.PI*180 > -45)){
			kk.changeMessage("释放进入下一页面",2000,'var(--kk-card-titleBg-hover)')
		}else if(
			offset[0] < 0 
			&& (Math.atan(offset[1]/-offset[0])/Math.PI*180 < 45) 
			&& (Math.atan(offset[1]/-offset[0])/Math.PI*180 > -45)){
			kk.changeMessage("释放返回上一页面",2000,'var(--kk-card-titleBg-hover)');
		}else if(offset[1]<0){
			kk.changeMessage("释放前往顶部",2000,'var(--kk-card-titleBg-hover)');
		}else if(offset[1]>0){
			kk.changeMessage("释放前往评论区/页脚",2000,'var(--kk-card-titleBg-hover)');
		}else{
			kk.changeMessage("???")
		}

		return false
	}
	function end(e){
		if(isMoveDot){
			isMoveDot = false;
			return false;
		}
		let touchEndTime = e.timeStamp;
		let touchEndPos = [e.changedTouches[0].clientX,e.changedTouches[0].clientY];

		let offset = [touchEndPos[0]-touchStartPos[0],touchEndPos[1]-touchStartPos[1]];
		if(offset[0]**2 + offset[1]**2 > 30**2){
			const l = Math.sqrt(offset[0]**2+offset[1]**2);
			offset[0] = 30*offset[0]/l;
			offset[1] = 30*offset[1]/l;
		}
		let touchTime = touchEndTime-touchStartTime;

		//判定事件
		if(touchTime < 300 && offset[0] == 0 && offset[1] == 0){
			console.log("click")
			if(document.getElementById('mobile-toc-button')){
				document.getElementById('mobile-toc-button').click()
			}
		}else if(offset[0] == 0 && offset[1] == 0){
			console.log("longClick")
			// window.location.href = window.location.origin;

		}else if((offset[0]**2+offset[1]**2) < 400){
			console.log("little=>cancel");
		}else if(
			offset[0] > 0 
			&& (Math.atan(offset[1]/offset[0])/Math.PI*180 < 45) 
			&& (Math.atan(offset[1]/offset[0])/Math.PI*180 > -45)){
			console.log("right")
			window.history.forward();
		}else if(
			offset[0] < 0 
			&& (Math.atan(offset[1]/-offset[0])/Math.PI*180 < 45) 
			&& (Math.atan(offset[1]/-offset[0])/Math.PI*180 > -45)){
			console.log("left")
			window.history.back();
		}else if(offset[1]<0){
			console.log("up");
			kk.scrollToTop();
		}else if(offset[1]>0){
			console.log("down");
			let h;
			if(document.getElementById("post-comment")){
				h = document.getElementById('post-comment').offsetTop;
			}else if(document.getElementById('footer')){
				h = document.getElementById('footer').offsetTop;
			}
			// console.log(h)
			btf.scrollToDest(h, 500);
		}else{
			console.log("???")
		}

		document.querySelector('#aDot .dot').style.transform = `translate(0px,0px)`;
		// document.querySelector('#aDot .dot').style.borderRadius = `50%`;
		// document.querySelector('#aDot .dot').style.width = `40px`;
		// document.querySelector('#aDot .dot').style.height = `40px`;

		return false
	}
	$('#aDot .dot').on('touchstart',start);
	$('#aDot .dot').on('mousedown',function(e){
		mouseDown=true;console.log("mStart")
		e.changedTouches = [{clientX:e.clientX,clientY:e.clientY}]
		start(e)
		return false;
	});
	$('#aDot .dot').on('touchmove',move);
	$(window).on('mousemove',function(e){
		if(mouseDown){
			console.log("mMove");
			e.changedTouches = [{clientX:e.clientX,clientY:e.clientY}];
			move(e);
			return false;
		}
	});
	$('#aDot .dot').on('touchend',end);
	$(window).on('mouseup',function(e){
		if(mouseDown){
			mouseDown=false;
			console.log("mEnd")
			e.changedTouches = [{clientX:e.clientX,clientY:e.clientY}]
			end(e,this)
			return false;
		}
	});
	$('#aDot').on('touchcancel',function(e){
		console.log("cancel",e)
		//【一些动画】touch事件意外终止，恢复样式
		document.querySelector('#aDot .dot').style.transform = `translate(0px,0px)`;
		// document.querySelector('#aDot .dot').style.borderRadius = `50%`;
		// document.querySelector('#aDot .dot').style.width = `40px`;
		// document.querySelector('#aDot .dot').style.height = `40px`;
	})
}