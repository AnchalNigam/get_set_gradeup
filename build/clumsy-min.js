var game={data:{score:0,steps:0,start:!1,newHiScore:!1,muted:!0},resources:[{name:"bg",type:"image",src:"data/new_img/bg.png"},{name:"clumsy",type:"image",src:"data/new_img/rocket.png"},{name:"pencil",type:"image",src:"data/new_img/obstacle_pencil.png"},{name:"pinkhook",type:"image",src:"data/new_img/pink_hook.png"},{name:"coin",type:"image",src:"data/new_img/spinning_coin_gold.png"},{name:"pipe",type:"image",src:"data/img/pipe.png"},{name:"logo",type:"image",src:"data/img/logo.png"},{name:"ground",type:"image",src:"data/new_img/ground.png"},{name:"gameover",type:"image",src:"data/img/gameover.png"},{name:"gameoverbg",type:"image",src:"data/img/gameoverbg.png"},{name:"hit",type:"image",src:"data/img/hit.png"},{name:"getready",type:"image",src:"data/img/getready.png"},{name:"new",type:"image",src:"data/img/new.png"},{name:"share",type:"image",src:"data/img/share.png"},{name:"tweet",type:"image",src:"data/img/tweet.png"},{name:"theme",type:"audio",src:"data/bgm/"},{name:"hit",type:"audio",src:"data/sfx/"},{name:"lose",type:"audio",src:"data/sfx/"},{name:"wing",type:"audio",src:"data/sfx/"}],onload:function(){return me.video.init(900,600,{wrapper:"screen",scale:"auto",scaleMethod:"fit"})?(me.audio.init("mp3,ogg"),void me.loader.preload(game.resources,this.loaded.bind(this))):void alert("Your browser does not support HTML5 canvas.")},loaded:function(){me.state.set(me.state.MENU,new game.TitleScreen),me.state.set(me.state.PLAY,new game.PlayScreen),me.state.set(me.state.GAME_OVER,new game.GameOverScreen),me.input.bindKey(me.input.KEY.SPACE,"fly",!0),me.input.bindKey(me.input.KEY.M,"mute",!0),me.input.bindPointer(me.input.KEY.SPACE),me.pool.register("clumsy",game.BirdEntity),me.pool.register("pipe",game.PipeEntity,!0),me.pool.register("obstacle",game.ObstacleEntity,!0),me.pool.register("hit",game.HitEntity,!0),me.pool.register("ground",game.Ground,!0),me.pool.register("coin",game.CoinEntity,!0),me.state.change(me.state.MENU)}};game.BirdEntity=me.Entity.extend({init:function(a,b){var c={};c.image="clumsy",c.width=120,c.height=90,this._super(me.Entity,"init",[a,b,c]),this.alwaysUpdate=!0,this.body.gravity=.2,this.maxAngleRotation=Number.prototype.degToRad(-30),this.maxAngleRotationDown=Number.prototype.degToRad(35),this.body.removeShapeAt(0),this.body.addShape(new me.Ellipse(5,5,70,50)),this.flyTween=new me.Tween(this.pos),this.flyTween.easing(me.Tween.Easing.Exponential.InOut),this.currentAngle=0,this.angleTween=new me.Tween(this),this.angleTween.easing(me.Tween.Easing.Exponential.InOut),this.endTween=null,this.collided=!1,this.gravityForce=.2},update:function(a){var b=this;if(this.pos.x=60,!game.data.start)return this._super(me.Entity,"update",[a]);if(this.renderable.currentTransform.identity(),me.input.isKeyPressed("fly")){me.audio.play("wing"),this.gravityForce=.2;var c=this.pos.y;this.angleTween.stop(),this.flyTween.stop(),this.flyTween.to({y:c-72},50),this.flyTween.start(),this.angleTween.to({currentAngle:b.maxAngleRotation},50).onComplete(function(a){b.renderable.currentTransform.rotate(b.maxAngleRotation)}),this.angleTween.start()}else this.gravityForce+=.2,this.pos.y+=me.timer.tick*this.gravityForce,this.currentAngle+=Number.prototype.degToRad(3),this.currentAngle>=this.maxAngleRotationDown&&(this.renderable.currentTransform.identity(),this.currentAngle=this.maxAngleRotationDown);this.renderable.currentTransform.rotate(this.currentAngle),me.Rect.prototype.updateBounds.apply(this);var d=-80;return this.pos.y<=d||this.collided?(game.data.start=!1,me.audio.play("lose"),this.endAnimation(),!1):(me.collision.check(this),!0)},onCollision:function(a){var b=a.b;("obstacle"===b.type||"ground"===b.type)&&(me.device.vibrate(500),this.collided=!0),"hit"===b.type&&(me.game.world.removeChildNow(b),game.data.steps++,me.audio.play("hit"))},endAnimation:function(){me.game.viewport.fadeOut("#fff",100);var a=this.pos.y;this.endTween=new me.Tween(this.pos),this.endTween.easing(me.Tween.Easing.Exponential.InOut),this.flyTween.stop(),this.renderable.currentTransform.identity(),this.renderable.currentTransform.rotate(Number.prototype.degToRad(90));var b=me.game.viewport.height-this.renderable.width/2-96;this.endTween.to({y:a},1e3).to({y:b},1e3).onComplete(function(){console.log("testing android"),Android.gameOver(1,200)}),this.endTween.start()}}),game.PipeEntity=me.Entity.extend({init:function(a,b){var c={};c.image=this.image=me.loader.getImage("pipe"),c.width=148,c.height=1664,c.framewidth=148,c.frameheight=1664,this._super(me.Entity,"init",[a,b,c]),this.alwaysUpdate=!0,this.body.gravity=0,this.body.vel.set(-5,0),this.type="obstacle"},update:function(a){return game.data.start?(this.pos.add(this.body.vel),this.pos.x<-this.image.width&&me.game.world.removeChild(this),me.Rect.prototype.updateBounds.apply(this),this._super(me.Entity,"update",[a]),!0):this._super(me.Entity,"update",[a])}}),game.PipeGenerator=me.Renderable.extend({init:function(){this._super(me.Renderable,"init",[0,me.game.viewport.width,me.game.viewport.height,92]),this.alwaysUpdate=!0,this.generate=0,this.pipeFrequency=92,this.pipeHoleSize=1240,this.posX=me.game.viewport.width},update:function(a){if(this.generate++%this.pipeFrequency==0){var b=Number.prototype.random(me.video.renderer.getHeight()-100,200),c=b-me.game.viewport.height-this.pipeHoleSize,d=new me.pool.pull("pipe",this.posX,b),e=new me.pool.pull("pipe",this.posX,c),f=b-100,g=new me.pool.pull("hit",this.posX,f);d.renderable.currentTransform.scaleY(-1),me.game.world.addChild(d,10),me.game.world.addChild(e,10),me.game.world.addChild(g,11)}this._super(me.Entity,"update",[a])}}),game.ObstacleEntity=me.Entity.extend({init:function(a,b,c,d){const e={};d=d?d:0,e.width=224,e.height=303-d,e.framewidth=224,e.frameheight=303-d,c&&(e.image=this.image=me.loader.getImage("pencil"),b-=e.height),e.image=this.image=me.loader.getImage("pencil"),console.log("Obstacle Entity","x",a,"y",b),this._super(me.Entity,"init",[a,b,e]),this.alwaysUpdate=!0,this.body.gravity=0,this.body.vel.set(-5,0),this.type="obstacle"},update:function(a){return game.data.start?(this.pos.add(this.body.vel),this.pos.x<-this.image.width&&me.game.world.removeChild(this),me.Rect.prototype.updateBounds.apply(this),this._super(me.Entity,"update",[a]),!0):this._super(me.Entity,"update",[a])}}),game.ObstacleGenerator=me.Renderable.extend({init:function(){console.log("viewport width",me.game.viewport.width,"viewport heigh",me.game.viewport.height),this._super(me.Renderable,"init",[0,me.game.viewport.width,me.game.viewport.height,92]),this.alwaysUpdate=!0,this.frequency=164,this.up=0,this.down=this.frequency/2,this.pipeHoleSize=1240,this.posX=me.game.viewport.width},update:function(a){if(console.log("this.up",this.up),this.up++%this.frequency===0){var b=(Number.prototype.random(0,100),me.game.viewport.height-96),c=new me.pool.pull("obstacle",this.posX,b,!0),d=b-100,e=new me.pool.pull("hit",this.posX,d);me.game.world.addChild(c,10),me.game.world.addChild(e,11)}if(console.log("this.down",this.down),this.down++%this.frequency==0){var b=(Number.prototype.random(0,100),0),f=new me.pool.pull("obstacle",this.posX,b,!1),d=b-100,e=new me.pool.pull("hit",this.posX,d);me.game.world.addChild(f,10),me.game.world.addChild(e,11)}this._super(me.Entity,"update",[a])}}),game.HitEntity=me.Entity.extend({init:function(a,b){var c={};c.image=this.image=me.loader.getImage("hit"),c.width=148,c.height=60,c.framewidth=148,c.frameheight=60,this._super(me.Entity,"init",[a,b,c]),this.alwaysUpdate=!0,this.body.gravity=0,this.updateTime=!1,this.renderable.alpha=0,this.body.accel.set(-5,0),this.body.removeShapeAt(0),this.body.addShape(new me.Rect(0,0,c.width-30,c.height-30)),this.type="hit"},update:function(a){return this.pos.add(this.body.accel),this.pos.x<-this.image.width&&me.game.world.removeChild(this),me.Rect.prototype.updateBounds.apply(this),this._super(me.Entity,"update",[a]),!0}}),game.Ground=me.Entity.extend({init:function(a,b){var c={};c.image=me.loader.getImage("ground"),c.width=910,c.height=96,this._super(me.Entity,"init",[a,b,c]),this.alwaysUpdate=!0,this.body.gravity=0,this.body.vel.set(-4,0),this.type="ground"},update:function(a){return!0}}),game.CoinEntity=me.CollectableEntity.extend({init:function(a,b,c){c.image=me.loader.getImage("coin"),c.spritewidth=32,this.parent(a,b,c)},onCollision:function(){this.collidable=!1,me.game.remove(this)}}),game.HUD=game.HUD||{},game.HUD.TimerManager=me.Entity.extend({init:function(){var a={};a.width=10,a.height=10,this._super(me.Entity,"init",[0,0,a]),this.complete=!1,this.timer=new game.HUD.TimerItem(6e4,!0,50,50,"timer"),me.game.world.addChild(this.timer)},update:function(){this.timer.update(1)}}),game.HUD.TimerItem=me.Renderable.extend({init:function(a,b,c,d,e){this._super(me.Renderable,"init",[c,d,10,10]),this.font=new me.Font("Arial",32,"#EE0000"),this.font.textAlign="center",this.name=e,this.pos.x=c,this.pos.y=d,this.time=a,this.time_remain=a,this.countdown=b,this.start_time=me.timer.getTime()},draw:function(a){a.getContext();this.font.draw(a,this.value,this.pos.x,this.pos.y)},convert:function(a){var b=parseInt(a/1e3),c=b%60;b/=60;var d=b%60,e=60*d+c;return e>0?Math.floor(d)+":"+Math.floor(c):"0:0"},update:function(a){var b=this.time-me.timer.getTime()+this.start_time;this.time_remain=b,0>b||(this.value=this.convert(b))}}),game.HUD.Container=me.Container.extend({init:function(){this._super(me.Container,"init"),this.isPersistent=!0,this.collidable=!1,this.z=1/0,this.name="HUD",this.addChild(new game.HUD.ScoreItem(5,5))}}),game.HUD.ScoreItem=me.Renderable.extend({init:function(a,b){this._super(me.Renderable,"init",[a,b,10,10]),this.stepsFont=new me.Font("gamefont",80,"#ffff","center"),this.floating=!0},draw:function(a){game.data.start&&me.state.isCurrent(me.state.PLAY)&&this.stepsFont.draw(a,game.data.steps,me.game.viewport.width/2,10)}});var BackgroundColor=me.ColorLayer.extend({init:function(a,b,c){a=a?a:"default",b=b?b:"#4c4b57",c=c?c:2,this._super(me.ColorLayer,"init",[a,b,c])},update:function(){return!0}}),BackgroundLayer=me.ImageLayer.extend({init:function(a,b,c,d){c=c?c:0,d=d?d:-100;var e={};e.name=a,e.width=900,e.height=600,e.image=a,e.z=b,e.ratio=1,this._super(me.ImageLayer,"init",[c,d,e])},update:function(){return me.input.isKeyPressed("mute")&&(game.data.muted=!game.data.muted,game.data.muted?me.audio.disable():me.audio.enable()),!0}});game.TitleScreen=me.ScreenObject.extend({init:function(){this._super(me.ScreenObject,"init"),this.font=null,this.ground1=null,this.ground2=null,this.logo=null},onResetEvent:function(){me.audio.stop("theme"),game.data.newHiScore=!1,me.game.world.addChild(new BackgroundColor("grey","#4c4b57",2)),me.game.world.addChild(new BackgroundLayer("bg",1)),me.input.bindKey(me.input.KEY.ENTER,"enter",!0),me.input.bindKey(me.input.KEY.SPACE,"enter",!0),me.input.bindPointer(me.input.pointer.LEFT,me.input.KEY.ENTER),this.handler=me.event.subscribe(me.event.KEYDOWN,function(a,b,c){"enter"===a&&me.state.change(me.state.PLAY)}),this.logo=new me.Sprite(me.game.viewport.width/2,me.game.viewport.height/2-20,{image:"logo"}),me.game.world.addChild(this.logo,10);me.pool.pull("me.Tween",this.logo.pos).to({y:me.game.viewport.height/2-100},1e3).easing(me.Tween.Easing.Exponential.InOut).start();this.ground1=me.pool.pull("ground",0,me.video.renderer.getHeight()-96),this.ground2=me.pool.pull("ground",me.video.renderer.getWidth(),me.video.renderer.getHeight()-96),me.game.world.addChild(this.ground1,11),me.game.world.addChild(this.ground2,11),me.game.world.addChild(new(me.Renderable.extend({init:function(){this._super(me.Renderable,"init",[0,0,100,100]),this.text=me.device.touch?"Tap to start":'PRESS SPACE OR CLICK LEFT MOUSE BUTTON TO START \n											PRESS "M" TO MUTE SOUND',this.font=new me.Font("gamefont",20,"#ffff")},draw:function(a){var b=this.font.measureText(a,this.text),c=me.game.viewport.width/2-b.width/2,d=me.game.viewport.height/2+50;this.font.draw(a,this.text,c,d)}})),12)},onDestroyEvent:function(){me.event.unsubscribe(this.handler),me.input.unbindKey(me.input.KEY.ENTER),me.input.unbindKey(me.input.KEY.SPACE),me.input.unbindPointer(me.input.pointer.LEFT),this.ground1=null,this.ground2=null,me.game.world.removeChild(this.logo),this.logo=null}}),game.PlayScreen=me.ScreenObject.extend({init:function(){me.audio.play("theme",!0);var a=-1!==me.device.ua.indexOf("Firefox")?.3:.5;me.audio.setVolume(a),this._super(me.ScreenObject,"init")},onResetEvent:function(){me.game.reset(),me.audio.stop("theme"),game.data.muted||me.audio.play("theme",!0),me.input.bindKey(me.input.KEY.SPACE,"fly",!0),game.data.score=0,game.data.steps=0,game.data.start=!1,game.data.newHiscore=!1,me.game.world.addChild(new BackgroundColor("grey","#4c4b57",2)),me.game.world.addChild(new BackgroundLayer("bg",1)),this.ground1=me.pool.pull("ground",0,me.game.viewport.height-96),this.ground2=me.pool.pull("ground",me.game.viewport.width,me.game.viewport.height-96),me.game.world.addChild(this.ground1,11),me.game.world.addChild(this.ground2,11),this.HUD=new game.HUD.Container,this.HUD2=new game.HUD.TimerManager,me.game.world.addChild(this.HUD,11),me.game.world.addChild(this.HUD2,11),console.log(this.HUD,this.HUD2,"yes"),this.bird=me.pool.pull("clumsy",60,me.game.viewport.height/2-100),me.game.world.addChild(this.bird,10),me.input.bindPointer(me.input.pointer.LEFT,me.input.KEY.SPACE),this.getReady=new me.Sprite(me.game.viewport.width/2,me.game.viewport.height/2,{image:"getready"}),me.game.world.addChild(this.getReady,11);var a=this;new me.Tween(this.getReady).to({alpha:0},2e3).easing(me.Tween.Easing.Linear.None).onComplete(function(){game.data.start=!0,me.game.world.addChild(new game.ObstacleGenerator,0),me.game.world.removeChild(a.getReady)}).start()},onDestroyEvent:function(){me.audio.stopTrack("theme"),this.HUD=null,this.bird=null,this.ground1=null,this.ground2=null,me.input.unbindKey(me.input.KEY.SPACE),me.input.unbindPointer(me.input.pointer.LEFT)}}),game.GameOverScreen=me.ScreenObject.extend({init:function(){this.savedData=null,this.handler=null},onResetEvent:function(){this.savedData={score:game.data.score,steps:game.data.steps},me.save.add(this.savedData),me.save.topSteps||me.save.add({topSteps:game.data.steps}),game.data.steps>me.save.topSteps&&(me.save.topSteps=game.data.steps,game.data.newHiScore=!0),me.input.bindKey(me.input.KEY.ENTER,"enter",!0),me.input.bindKey(me.input.KEY.SPACE,"enter",!1),me.input.bindPointer(me.input.pointer.LEFT,me.input.KEY.ENTER),this.handler=me.event.subscribe(me.event.KEYDOWN,function(a,b,c){"enter"===a&&me.state.change(me.state.MENU)}),me.game.world.addChild(new me.Sprite(me.game.viewport.width/2,me.game.viewport.height/2-100,{image:"gameover"}),12);var a=new me.Sprite(me.game.viewport.width/2,me.game.viewport.height/2,{image:"gameoverbg"});if(me.game.world.addChild(a,10),me.game.world.addChild(new BackgroundColor("grey","#4c4b57",2)),me.game.world.addChild(new BackgroundLayer("bg",1)),this.ground1=me.pool.pull("ground",0,me.game.viewport.height-96),this.ground2=me.pool.pull("ground",me.game.viewport.width,me.video.renderer.getHeight()-96),me.game.world.addChild(this.ground1,11),me.game.world.addChild(this.ground2,11),game.data.newHiScore){var b=new me.Sprite(a.width/2,a.height/2,{image:"new"});me.game.world.addChild(b,12)}this.dialog=new(me.Renderable.extend({init:function(){this._super(me.Renderable,"init",[0,0,me.game.viewport.width/2,me.game.viewport.height/2]),this.font=new me.Font("gamefont",40,"black","left"),this.steps="Steps: "+game.data.steps.toString(),this.topSteps="Higher Step: "+me.save.topSteps.toString()},draw:function(a){var b=this.font.measureText(a,this.steps);this.font.measureText(a,this.topSteps),this.font.measureText(a,this.score);this.font.draw(a,this.steps,me.game.viewport.width/2-b.width/2-60,me.game.viewport.height/2),this.font.draw(a,this.topSteps,me.game.viewport.width/2-b.width/2-60,me.game.viewport.height/2+50)}})),me.game.world.addChild(this.dialog,12)},onDestroyEvent:function(){me.event.unsubscribe(this.handler),me.input.unbindKey(me.input.KEY.ENTER),me.input.unbindKey(me.input.KEY.SPACE),me.input.unbindPointer(me.input.pointer.LEFT),this.ground1=null,this.ground2=null,this.font=null,me.audio.stop("theme")}});