game.HUD = game.HUD || {};

game.HUD.TimerManager = me.Entity.extend(
    {
    init: function()
    {
    // call the super constructor
    var settings = {};
    settings.width = 10;
    settings.height = 10;
    // call the super constructor
    this._super(me.Entity, 'init', [0, 0, settings]);
    this.complete = false;

                // 5 minutes in milliseconds, count down to true
                var time = ((game.data.level - 1) * 5*1000) + 18*1000;
                console.log(time, game.data.level, 'jj')
                this.timer = new game.HUD.TimerItem(time, true, me.game.viewport.width/2, 60, "timer");
                me.game.world.addChild(this.timer, 100);
            },
            update: function()
            {
                this.timer.update(1);
            }
});
game.HUD.TimerItem = me.Renderable.extend({
    init: function(time, countdown, x, y, name) {
    // call the constructor
    this._super(me.Renderable, 'init', [x, y, 10, 10]);
    
        // create a font
        this.font = new me.Font('gamefont', 50, "#FFFF00", 'center');

        this.collidable = false;
        // give a name
        this.name = name;
        this.pos.x = x;
        this.pos.y = y;
        this.time = time;
        this.time_remain = time;
        this.countdown = countdown;
        this.start_time = me.timer.getTime();
    },
    draw: function(ctx)
    {
        var context = ctx.getContext();
        if (game.data.start && me.state.isCurrent(me.state.PLAY)) {
            this.font.draw(ctx, this.value, this.pos.x, this.pos.y);
        }
    },
    convert: function(time_remain)
    {
        var x = parseInt(time_remain / 1000);
        var seconds = x % 60;
        x /= 60;
        var minutes = x % 60;
    
        var seconds_num = minutes * 60 + seconds;
        if (seconds_num > 0) {
            return Math.floor(minutes) + ":" + Math.floor(seconds);
        }
        else {
            if(!game.data.levelCompletedCallback) {
                me.audio.play("swoosh");
                var coinsEarn = Number(game.data.coins) + Number(game.data.steps) + 100;
                Android.gameLevelCompleted(game.data.level, coinsEarn);
                game.data.levelCompletedCallback = true;
                return "0:0";
            }
          
        }
    },
    update: function(dt)
    {
        var time_remain = this.time - (me.timer.getTime()) + this.start_time;
        this.time_remain = time_remain;
    
        if (time_remain < 0) {
        }
        else {
            this.value = this.convert(time_remain);
        }
    }
});


game.HUD.TimeLeft = me.Renderable.extend({
    init: function(x, y) {
        this._super(me.Renderable, "init", [me.game.viewport.width/2, 10, 10, 10]);

        // local copy of the global score
        this.stepsFont = new me.Font('Georgia', 35, "#FFFF00", 'center');
    },

    draw: function (renderer) {
        if (game.data.start && me.state.isCurrent(me.state.PLAY))
            this.stepsFont.draw(renderer, 'Time Left', me.game.viewport.width/2, 10);
    }

});

game.HUD.Container = me.Container.extend({
    init: function() {
        this._super(me.Container, 'init');
        // persistent across level change
        this.isPersistent = true;

        // non collidable
        this.collidable = false;

        // make sure our object is always draw first
        this.z = Infinity;

        // give a name
        this.name = "HUD";

        // add our child score object at the top left corner
        this.addChild(new game.HUD.ScoreItem(5, 5));
    }
});


game.HUD.ScoreItem = me.Renderable.extend({
    init: function(x, y) {
        this._super(me.Renderable, "init", [x, y, 10, 10]);

        // local copy of the global score
        this.stepsFont = new me.Font('gamefont', 80, '#ffff', 'center');

        // make sure we use screen coordinates
        this.floating = true;
    },

    draw: function (renderer) {
        if (game.data.start && me.state.isCurrent(me.state.PLAY))
            this.stepsFont.draw(renderer, game.data.steps, me.game.viewport.width/2, 10);
    }

});

game.HUD.Coins = me.Renderable.extend({
    init: function(x, y) {
        this._super(me.Renderable, "init", [30, 60, 10, 10]);

        // local copy of the global score
        this.stepsFont = new me.Font('Arial', 35, '#50b167');
    },

    draw: function (renderer) {
        var coinsEarn = Number(game.data.coins) + Number(game.data.steps);
        if (game.data.start && me.state.isCurrent(me.state.PLAY))
            this.stepsFont.draw(renderer, 'Coins Earned : '  + coinsEarn, 30, 60);
    }

});


game.HUD.Levels = me.Renderable.extend({
    init: function(x, y) {
        this._super(me.Renderable, "init", [30, 20, 10, 10]);

        // local copy of the global score
        this.stepsFont = new me.Font('Arial', 35, '#50b167');
    },

    draw: function (renderer) {
        if (game.data.start && me.state.isCurrent(me.state.PLAY))
            this.stepsFont.draw(renderer, 'Level : ' + game.data.level, 30, 20);
    }

});



var BackgroundColor = me.ColorLayer.extend({
    init: function(name, color, z) {
        name = name ? name : 'default';
        color = color ? color : '#4c4b57';
        z = z ? z : 2;

        this._super(me.ColorLayer, 'init', [name, color, z]);
    },

    update: function() {
        return true;
    }
});

var BackgroundLayer = me.ImageLayer.extend({
    init: function(image, z, x, y) {
        x = x ? x : 0;
        y = y ? y : -45;
        var settings = {};
        settings.name = image;
        settings.width = 900;
        settings.height = 600;
        settings.image = image;
        settings.z = z;
        settings.ratio = 1;
        // call parent constructor

        this._super(me.ImageLayer, 'init', [x, y, settings]);
    },

    update: function() {
        if (me.input.isKeyPressed('mute')) {
            game.data.muted = !game.data.muted;
            if (game.data.muted){
                me.audio.disable();
            }else{
                me.audio.enable();
            }
        }
        return true;
    }
});
