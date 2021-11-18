import k from "./kaboom";

const loadSprites = () => {
  k.loadRoot("./resources/sprites/");
  k.loadSprite("background_sprites", "background_sprites.png", {
    sliceX: 4,
    sliceY: 4,
  });
  k.loadSprite("items", "items.png", {
    sliceX: 5,
    sliceY: 1,
  });
  k.loadSprite("zombie", "zombie.png", {
    sliceX: 7,
    sliceY: 1,
    anims: {
      rise: {
        from: 2,
        to: 5,
      },
    },
  });
  k.loadSprite("player", "player.png", {
    sliceX: 10,
    sliceY: 1,
    anims: {
      idle: {
        from: 0,
        to: 1,
      },
      pray: {
        from: 2,
        to: 3,
      },
      run: {
        from: 4,
        to: 5,
      },
      jump: {
        from: 6,
        to: 7,
      },
      shovel_idle: {
        from: 8,
        to: 9,
      },
    },
  });

  k.loadSprite("player_deamon", "player_deamon.png", {
    sliceX: 10,
    sliceY: 1,
    anims: {
      idle: {
        from: 0,
        to: 1,
      },
      pray: {
        from: 2,
        to: 3,
      },
      run: {
        from: 4,
        to: 5,
      },
      jump: {
        from: 6,
        to: 7,
      },
      attack: {
        from: 8,
        to: 9,
      },
    },
  });

  k.loadSprite("player_shovel_horizontal", "player_shovel_horizontal.png", {
    sliceX: 3,
    sliceY: 1,
    anims: {
      shovel: {
        from: 0,
        to: 2,
      },
    },
  });

  k.loadSprite("player_shovel_vertical", "player_shovel_vertical.png", {
    sliceX: 6,
    sliceY: 1,
    anims: {
      shovelDown: {
        from: 0,
        to: 2,
      },
      shovelUp: {
        from: 3,
        to: 5,
      },
    },
  });

  k.loadSprite("fog", "fog.png");
};

export default loadSprites;
