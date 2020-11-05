game.LoadingScreen = me.ScreenObject.extend({
  init: function() {
      
  },

  onResetEvent: function() {
      //save section
     
      me.game.world.addChild(new BackgroundColor('grey', '#4c4b57', 2));
      me.game.world.addChild(new BackgroundLayer('bg', 1));
  },

  onDestroyEvent: function() {
      // unregister the event
  
  }
});
