$(function(){
	// 下雪对象
	function snowFall(snow) {
		snow = snow || {};
		this.maxFlake = snow.maxFlake || 200;		//最多片数
		this.flakeSize = snow.flakeSize || 10;	//雪花形状
		this.fallSpeed = snow.fallSpeed || 2;	//坠落速度
		this.mX = -100;
		this.mY = -100;
	}
	// 开始下雪
	snowFall.prototype.start = function() {
		if(!this.canvas){
			$(this).remove();
		}
		// 创建画布
		snowCanvas.apply(this);
		// 创建雪花形状
		createFlakes.apply(this);
		// 画雪
		drawSnow.apply(this)
	};
	// 暂停下雪
	snowFall.prototype.pause = function() {
		cancelAnimationFrame(this.loop)
	};
	// 继续下雪
	snowFall.prototype.resume = function() {
		this.loop = requestAnimationFrame(function() {
			drawSnow.apply(that)
		})
	};
	// 停止下雪
	snowFall.prototype.stop = function() {
		this.pause();
		this.canvas.parentNode.removeChild(this.canvas)
	};

	// // 创建画布
	function snowCanvas() {
		var snowcanvas = document.createElement("canvas");
		snowcanvas.id = "snowfall";
		snowcanvas.width = window.innerWidth;
		snowcanvas.height = window.innerHeight;
		snowcanvas.setAttribute("style", "position: fixed; top: 0; left: 0; z-index: 2999; pointer-events: none;");
		document.getElementsByTagName("body")[0].appendChild(snowcanvas);
		this.canvas = snowcanvas;
		this.ctx = snowcanvas.getContext("2d");
		window.onresize = function() {
			snowcanvas.width = window.innerWidth;
			snowcanvas.height = window.innerHeight
		}
	}

	// e(t,i,e,a)-flakeMove
	// 雪运动对象
	function flakeMove(canvasWidth, canvasHeight, flakeSize, fallSpeed) {
		this.x = Math.floor(Math.random() * canvasWidth);	//x坐标
		this.y = Math.floor(Math.random() * canvasHeight);	//y坐标
		this.size = Math.random() * flakeSize + 2;			//形状
		this.maxSize = flakeSize;							//最大形状
		this.speed = Math.random() * 1 + fallSpeed;			//坠落速度
		this.fallSpeed = fallSpeed;							//坠落速度
		this.velY = this.speed;								//Y方向速度
		this.velX = 0;										//X方向速度
		this.stepSize = Math.random() / 30;					//步长
		this.step = 0 										//步数
	}

	flakeMove.prototype.update = function(mX, mY) {
		var mx = mX,
			my = mY,
			n = 150,
			x = this.x,
			y = this.y;
		// 计算三角形最长边
		var o = Math.sqrt((x - mx) * (x - mx) + (y - my) * (y - my)),
			ix= x - mx,
			iy = y - my;
		// console.log("xy:"+ x+y);
		console.log("o: "+o);
		// console.log("n: "+n);
		if (o < n) {
			// 
			var d = n / (o * o),
				m = (mx - x) / o,
				c = (my - y) / o,
				p = d / 2;
			this.velX -= p * m;
			this.velY -= p * c
			console.log("<")
			// debugger
		} else {
			// 左右摆动
			this.velX *= 0.98;
			if (this.velY <= this.speed) {
				this.velY = this.speed
			}
			console.log(">");
			// debugger
			this.velX += Math.cos(this.step += .05) * this.stepSize
		}
		this.y += this.velY;
		this.x += this.velX;
		// 飞出边界
		if (this.x >= canvas.width || this.x <= 0 || this.y >= canvas.height || this.y <= 0) {
			this.reset(canvas.width, canvas.height)
		}
	};
	// 飞出边界-放置最顶端继续坠落
	flakeMove.prototype.reset = function(width, height) {
		this.x = Math.floor(Math.random() * width);
		this.y = 0;
		this.size = Math.random() * this.maxSize + 2;
		this.speed = Math.random() * 1 + this.fallSpeed;
		this.velY = this.speed;
		this.velX = 0;
	};
	// 渲染雪花-随机形状
	flakeMove.prototype.render = function(ctx) {
		var snowFlake = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
		snowFlake.addColorStop(0, "rgba(255, 255, 255, 0.9)");
		snowFlake.addColorStop(.5, "rgba(255, 255, 255, 0.5)");
		snowFlake.addColorStop(1, "rgba(255, 255, 255, 0)");
		ctx.save();
		ctx.fillStyle = snowFlake;
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
		ctx.fill();
		ctx.restore();
	};

	// 创建雪花-定义形状
	function createFlakes() {
		var maxFlake = this.maxFlake,
			flakes = this.flakes = [],
			canvas = this.canvas;
		for (var i = 0; i < maxFlake; i++) {
			flakes.push(new flakeMove(canvas.width, canvas.height, this.flakeSize, this.fallSpeed))
		}
	}

	// 画雪
	function drawSnow() {
		var maxFlake = this.maxFlake,
			flakes = this.flakes;
		ctx = this.ctx, canvas = this.canvas, mX = this.mX, mY = this.mY, that = this;
		// 清空雪花
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		for (var e = 0; e < maxFlake; e++) {
			flakes[e].update(mX, mY);
			flakes[e].render(ctx);
		}
		// 一帧一帧的画
		this.loop = requestAnimationFrame(function() {
			drawSnow.apply(that);
		});
	}
	

	// var ss = new snowFall();
	var ss = new snowFall({});
	$(".start").click(function(){
		ss.start();
	});
	$(".stop").click(function(){
		ss.stop();
	});
	$(".resue").click(function(){
		ss.resume();
	});
	


});
