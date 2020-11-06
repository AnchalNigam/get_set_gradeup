game.RocketEntity = me.Entity.extend({
    init: function(x, y) {
        var settings = {};
        settings.image = 'rocket';
        settings.width = 120;
        settings.height = 90;

        this._super(me.Entity, 'init', [400, y, settings]);

        this.body.removeShapeAt(0);
        this.body.addShapesFromJSON(me.loader.getJSON("shapes"), "rocket");
        this.points = this.body.getShape(0).points
        me.Polygon.prototype.recalc.apply(this);
        me.Polygon.prototype.updateBounds.apply(this);

        this.alwaysUpdate = true;
        this.body.gravity = 0.1;
        this.body.collisionType = me.collision.types.PLAYER_OBJECT;
        this.maxAngleRotation = Number.prototype.degToRad(15);
        this.maxAngleRotationDown = Number.prototype.degToRad(30);
        
        // a tween object for the flying physic effect
        this.flyTween = new me.Tween(this.pos);
        this.flyTween.easing(me.Tween.Easing.Exponential.InOut);

        this.currentAngle = 0;
        this.angleTween = new me.Tween(this);
        this.angleTween.easing(me.Tween.Easing.Exponential.InOut);

        // end animation tween
        this.endTween = null;

        // collision shape
        this.collided = false;

        this.gravityForce = 0.01;
    },

    update: function(dt) {
        var that = this;
        this.pos.x = this.pos.x > 60 ? this.pos.x - me.timer.tick * 0.2 : 60;
        if (!game.data.start) {
            return this._super(me.Entity, 'update', [dt]);
        }
        this.renderable.currentTransform.identity();

        if (me.input.isKeyPressed('fly')) {
            this.gravityForce = 0.01;
            var currentPos = this.pos.y;

            this.angleTween.stop();
            this.flyTween.stop();


            this.flyTween.to({y: currentPos - 72}, 50);
            this.flyTween.start();

            this.angleTween.to({currentAngle: that.maxAngleRotation}, 50).onComplete(function(angle) {
                that.renderable.currentTransform.rotate(that.maxAngleRotation);
            })
            this.angleTween.start();

        } else {
            this.gravityForce += 0.1;
            this.pos.y += me.timer.tick * this.gravityForce;
            this.currentAngle += Number.prototype.degToRad(3);
            if (this.currentAngle >= this.maxAngleRotationDown) {
                this.renderable.currentTransform.identity();
                this.currentAngle = this.maxAngleRotationDown;
            }
        }
        this.renderable.currentTransform.rotate(this.currentAngle);
        me.Polygon.prototype.updateBounds.apply(this);

        var hitSky = -80; // bird height + 20px
        if (this.pos.y <= hitSky || this.collided) {
            game.data.start = false;
            me.audio.play("lose");
            this.endAnimation();
            return false;
        }
        me.collision.check(this);
        return true;
    },

    onCollision: function(response) {
        var objB = response.b;
        if ((objB.type === 'obstacle' || objB.type === 'ground')) {
            me.device.vibrate(500);
            this.collided = true;
            return true;
        } else if (objB.type === 'hit') {
            objB.body.setCollisionMask(me.collision.types.NO_OBJECT);
            me.game.world.removeChild(objB);
        }
        return false
    },

    endAnimation: function() {
        me.game.viewport.fadeOut("#fff", 100);
        var currentPos = this.pos.y;
        this.endTween = new me.Tween(this.pos);
        this.endTween.easing(me.Tween.Easing.Exponential.InOut);

        this.flyTween.stop();
        this.renderable.currentTransform.identity();
        this.renderable.currentTransform.rotate(Number.prototype.degToRad(90));
        var finalPos = me.game.viewport.height - this.height - 45;
        this.endTween
            .to({y: currentPos}, 1000)
            .to({y: finalPos}, 1000)
            .onComplete(function() {
                console.log('testing android')
                Android.gameOver(game.data.level, (game.data.level-1)*100);
                // me.state.change(me.state.GAME_OVER);
            });
        this.endTween.start();
    }

});

game.ObstacleEntity = me.Entity.extend({
    init: function(x, y, isRev, gap) {
        isRev = isRev ? isRev : false;
        gap = gap ? gap : 150;
        var settings = {};
        settings.image = this.image = me.loader.getImage(obstacle[0].image);
        settings.width = this.image.width || obstacle[0].width;
        settings.height= this.image.height || obstacle[0].height;

        this._super(me.Entity, 'init', [x, y, settings]);

        this.body.removeShapeAt(0);
        this.body.addShapesFromJSON(me.loader.getJSON("shapes"), "pencil-long");
        this.points = this.body.getShape(0).points
        me.Polygon.prototype.recalc.apply(this);
        if(isRev){
            this.pos.y -=  (this.body.height + gap);
        }
        me.Polygon.prototype.updateBounds.apply(this);

        this.alwaysUpdate = true;
        this.body.collisionType = me.collision.types.ENEMY_OBJECT;
        this.body.gravity = 0;
        this.body.vel.set(-5, 0);
        this.type = 'obstacle';
    },

    update: function(dt) {
        // mechanics
        if (!game.data.start) {
            return this._super(me.Entity, 'update', [dt]);
        }
        this.pos.add(this.body.vel);
        if (this.pos.x < -this.image.width) {
            me.game.world.removeChild(this);
        }
        me.Rect.prototype.updateBounds.apply(this);
        this._super(me.Entity, 'update', [dt]);
        return true;
    },
});

game.ObstacleGenerator = me.Renderable.extend({
    init: function() {
        this._super(me.Renderable, 'init', [0, me.game.viewport.width, me.game.viewport.height, 92]);
        this.alwaysUpdate = true;
        this.generate = 0;
        this.pipeFrequency = 92;
        this.posX = me.game.viewport.width;
    },

    update: function(dt) {
        if (this.generate++ % this.pipeFrequency == 0) {
            var posY = Number.prototype.random(
                    me.video.renderer.getHeight() - (100 + 50),
                    250
            );
            var pipe1 = new me.pool.pull('pinkHook', this.posX, posY);   
            var pipe2 = new me.pool.pull('pinkHook', this.posX, posY, true);
            
            // var pipe2 = new me.pool.pull('obstacle', this.posX, posY2);
            var hitPos = posY - 100;
            var hit = new me.pool.pull("hit", this.posX, hitPos);
            hit.renderable.currentTransform.scale(0.6);
            pipe1.renderable.currentTransform.scaleY(-1);
            me.game.world.addChild(pipe1, 10);
            me.game.world.addChild(pipe2, 10);
            me.game.world.addChild(hit, 11);
        }
        this._super(me.Entity, "update", [dt]);
    },

});


game.HitEntity = me.Entity.extend({
    init: function(x, y) {
        var settings = {};
        settings.image = this.image = me.loader.getImage('coin');
        settings.width = 85;
        settings.height= 85;
        settings.spritewidth = 85;
        settings.spriteheight= 85;

        this._super(me.Entity, 'init', [x, y, settings]);

        this.alwaysUpdate = true;
        this.updateTime = false;
        this.body.collisionType = me.collision.types.COLLECTABLE_OBJECT;
        this.body.gravity = 0;
        this.body.accel.set(-5, 0);
        this.collected = false
        this.type = 'hit';
    },

    update: function(dt) {
        if (game.data.start && !this.collected) {
            // mechanics
            this.pos.add(this.body.accel);
            if (this.pos.x < -this.image.width) {
                me.game.world.removeChild(this);
            }
            this.body.updateBounds();
            this._super(me.Entity, "update", [dt]);
        }
        return true;
    },

    onCollision: function(){
        if(!this.collected){
            this.body.setCollisionMask(me.collision.types.NO_OBJECT);
            me.game.world.removeChild(this);
            game.data.steps++;
            me.audio.play('hit');
            this.collected = true;
            return true;
        }
        return false;
    }
});

game.Ground = me.Entity.extend({
    init: function(x, y, ground_width, ground_height) {
        var settings = {};
        settings.image = me.loader.getImage('ground');
        settings.width = ground_width;
        settings.height= ground_height;
        // initiate
        this._super(me.Entity, 'init', [x, y, settings]);
        this.alwaysUpdate = true;
        this.body.gravity = 0;
        this.updateTime = false;
        this.body.vel.set(-5, 0);
        this.type = 'ground';
    },

    update: function(dt) {
        // mechanics
        if (game.data.start) {
            this.pos.add(this.body.vel);
            if (this.pos.x < -this.renderable.width) {
                this.pos.x = me.video.renderer.getWidth() - 10;
            }
            return true;
        }
        return false;
    },

});

var TheGround = me.Object.extend({
init: function() {
    const video_width = me.video.renderer.getWidth();
    const ground_height = 45;
    this.ground1 = me.pool.pull('ground', 0, me.video.renderer.getHeight() - ground_height, video_width, ground_height);
    this.ground2 = me.pool.pull('ground', me.video.renderer.getWidth(), me.video.renderer.getHeight() - ground_height, video_width, ground_height);
    me.game.world.addChild(this.ground1, 11);
    me.game.world.addChild(this.ground2, 11);
},

update: function () { return true; }
});
