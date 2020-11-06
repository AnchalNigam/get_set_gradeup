// var Manager = me.Container.extend({
//     init: function() {
//       // 5 minutes in milliseconds, count down to true
//       this.timer = new TimerObject(1000, true, 10, 10, "timer");
//       // start at 0, count up
//       this.clock = new TimerObject(0, false, 700, 10, "clock");
//     },
  
//     update: function() {
//       me.video.clearSurface(me.video.getScreenCanvas().getContext('2d'), '#000000');
//       this.timer.update();
//       this.clock.update();
//     }
//   });
  
//   var TimerHUD = me.HUD_Item.extend({
//     init: function(x, y) {
//       this.parent(x, y);
//       this.font = new me.Font("Arial", 16, "white");
//     },
  
//     draw: function(ctx, x, y) {
//       this.font.draw(ctx, this.value, this.pos.x + x, this.pos.y + y);
//     }
//   });
  
//   var TimerObject = (function() {
//     function TimerObject(time, countdown, x, y, name) {
//       this.time = time;
//       this.countdown = countdown;
//       this.x = x;
//       this.y = y;
//       this.name = name;
//       me.game.HUD.addItem(name, new TimerHUD(this.x, this.y));
//       me.game.HUD.setItemValue(name, this.convert());
//       this.start_time = me.timer.getTime();
//     }
  
//     TimerObject.prototype.convert = function() {
//       var x = this.time / 1000;
//       var seconds = x % 60;
//       x /= 60;
//       var minutes = x % 60;
//       return Math.floor(minutes) + ":" + Math.floor(seconds);
//     }
  
//     TimerObject.prototype.update = function() {
//       if(this.countdown) {
//         this.time -= (me.timer.getTime() - this.start_time);
//       }
//       else {
//         this.time += (me.timer.getTime() - this.start_time);
//       }
//       me.game.HUD.setItemValue(this.name, this.convert());
//     }
  
//     return TimerObject;
//   })();
  
game.PlayScreen = me.ScreenObject.extend({
    init: function() {
        me.audio.play("theme", true);
        // lower audio volume on firefox browser
        var vol = me.device.ua.indexOf("Firefox") !== -1 ? 0.3 : 0.5;
        me.audio.setVolume(vol);
        this._super(me.ScreenObject, 'init');
    },

    onResetEvent: function() {
        me.game.reset();
        me.audio.stop("theme");
        if (!game.data.muted){
            me.audio.play("theme", true);
        }

        me.input.bindKey(me.input.KEY.SPACE, "fly", true);
        game.data.score = 0;
        game.data.steps = 0;
        game.data.start = false;
        game.data.newHiscore = false;
        me.game.world.addChild(new BackgroundColor('grey', '#4c4b57', 2));
        me.game.world.addChild(new BackgroundLayer('bg', 1));

        this.ground = new TheGround();
        me.game.world.addChild(this.ground, 11);

        this.HUD = new game.HUD.Container();
        this.HUD2 = new game.HUD.TimerManager();
        this.HUD4 = new game.HUD.Levels();
        this.HUD3 = new game.HUD.Coins();
        me.game.world.addChild(this.HUD2, 11);
        // me.game.world.addChild(this.HUD, 11);
        me.game.world.addChild(this.HUD4, 11);
        me.game.world.addChild(this.HUD3, 11);
        this.bird = me.pool.pull("rocket", 60, me.game.viewport.height/2 - 100);
        me.game.world.addChild(this.bird, 10);

        //inputs
        me.input.bindPointer(me.input.pointer.LEFT, me.input.KEY.SPACE);

        this.getReady = new me.Sprite(
            me.game.viewport.width/2,
            me.game.viewport.height/2,
            {image: 'getready'}
        );
        me.game.world.addChild(this.getReady, 11);

        var that = this;
        var fadeOut = new me.Tween(this.getReady).to({alpha: 0}, 2000)
            .easing(me.Tween.Easing.Linear.None)
            .onComplete(function() {
                game.data.start = true;
                me.game.world.addChild(new game.ObstacleGenerator(), 0);
                me.game.world.removeChild(that.getReady);
            }).start();

    },

    onDestroyEvent: function() {
        me.audio.stopTrack('theme');
        // free the stored instance
        this.HUD = null;
        this.bird = null;
        me.game.world.removeChild(this.ground);
        me.input.unbindKey(me.input.KEY.SPACE);
        me.input.unbindPointer(me.input.pointer.LEFT);
    }
});
