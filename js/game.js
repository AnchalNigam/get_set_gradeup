function getParams() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    return urlParams;
}
function getCurrentLevel() {
    const urlParams = getParams();
    const isRefresh = urlParams.get('refresh');
    const nextLevelNumber = urlParams.get('nextLevelNumber');
    if(isRefresh === 'true') {
        return 1;
    } else if(nextLevelNumber) {
        return Number(nextLevelNumber);
    }
    return 1;
}

function getEarnedCoins() {
    const urlParams = getParams();
    if(urlParams.get('coinsEarned')) {
        return urlParams.get('coinsEarned')
    }
    return 0;
}
var game = {
    data: {
        score : 0,
        steps: 0,
        start: false,
        newHiScore: false,
        muted: false,
        level: getCurrentLevel(),
        levelCompletedCallback: false,
        coins: getEarnedCoins(),
    },

    resources: [
            // images
        {name: "bg", type:"image", src: "data/new_img/bg.png"},
        {name: "rocket", type:"image", src: "data/new_img/rocket.png"},
        {name: "coin", type:"image", src: "data/new_img/coin.png"},
        {name: "pencil-long", type:"image", src: "data/new_img/pencil-long.png"},
        {name: "ground", type:"image", src: "data/new_img/ground.png"},
        {name: "hit", type:"image", src: "data/img/hit.png"},
        {name: "getready", type:"image", src: "data/img/getready.png"},
        {name: "new", type:"image", src: "data/img/new.png"},
        {name: "share", type:"image", src: "data/img/share.png"},
        {name: "tweet", type:"image", src: "data/img/tweet.png"},
        {name: "pipe", type:"image", src: "data/img/pipe.png"},
        {name: "logo", type:"image", src: "data/img/logo.png"},
        // sounds
        {name: "theme", type: "audio", src: "data/bgm/"},
        {name: "hit", type: "audio", src: "data/sfx/"},
        {name: "swoosh", type: "audio", src: "data/sfx/"},
        {name: "lose", type: "audio", src: "data/sfx/"},
        // {name: "wing", type: "audio", src: "data/sfx/"},
        // json
        {name: "shapes", type:"json", src: "data/object_json/figures.json"}
    ],

    "onload": function() {
        if (!me.video.init(900, 600, {
            wrapper: "screen",
            scale : "auto",
            scaleMethod: "flex-width"
        })) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }
        me.audio.init("mp3,ogg");
        me.loader.preload(game.resources, this.loaded.bind(this));
    },

    "loaded": function() {
        me.state.set(me.state.MENU, new game.TitleScreen());
        me.state.set(me.state.PLAY, new game.PlayScreen());
        me.state.set(me.state.GAME_OVER, new game.GameOverScreen());

        me.input.bindKey(me.input.KEY.SPACE, "fly", true);
        me.input.bindKey(me.input.KEY.M, "mute", true);
        me.input.bindPointer(me.input.KEY.SPACE);

        me.pool.register("rocket", game.RocketEntity);
        me.pool.register("pipe", game.PipeEntity, true);
        me.pool.register("obstacle", game.ObstacleEntity, true);
        me.pool.register("hit", game.HitEntity, true);
        me.pool.register("ground", game.Ground, true);

        me.game.viewport.setBounds(0, 0, 900, 600);
        me.state.change(me.state.MENU);
    }
};
