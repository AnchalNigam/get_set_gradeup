const obstacle = [
    {
        image: "pencil-long",
        file: "shapes",
        obj: "pencil-long",
        width: 148,
        height: 1664,
    }
]

const initateObject = function (x, y, isRev) {
    var settings = {};
    settings.image = this.image = me.loader.getImage('pinkhook');
    settings.width = 210
    settings.height = 650

    this._super(me.Entity, 'init', [x, y, settings]);

    if(isRev){
        this.pos.y -=  (this.body.height + 150);
    }

    this.alwaysUpdate = true;
    this.body.collisionType = me.collision.types.ENEMY_OBJECT;
    this.body.gravity = 0;
    this.body.vel.set(-5, 0);
    this.type = 'obstacle';
}

const updateObject = function (dt) {
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
}

game.pinkHookEntity = me.Entity.extend({ 
    init: function(x, y, isRev) {
        
    }, 
    update: updateObject });

