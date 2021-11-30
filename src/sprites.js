import k from "./kaboom";

const loadSprites = () => {
  k.loadRoot("./resources/sprites/");

  k.loadSprite("title", "title.png");
  k.loadSprite("background_sprites", "background_sprites.png", {
    sliceX: 4,
    sliceY: 5,
    anims: {
      treasure: {
        from: 13,
        to: 15
      },
      treasureBroken: {
        from: 16,
        to: 18
      }
    }
  });
  k.loadSprite("items", "items.png", {
    sliceX: 5,
    sliceY: 1,
  });
  k.loadSprite("zombie", "zombie.png", {
    sliceX: 15,
    sliceY: 1,
    anims: {
      rise: {
        from: 2,
        to: 5,
      },
      run: {
        from: 6,
        to: 8,
      },
      attack: {
        from: 9,
        to: 10,
      },
      die: {
        from: 11,
        to: 14,
      }
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
      attack: {
        from: 1,
        to: 1
      }
    },
  });

  k.loadSprite("player_demon", "player_demon.png", {
    sliceX: 22,
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
      die: {
        from: 10,
        to: 21
      }
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

  k.loadSprite("hit", "hit.png", {
    sliceX: 5,
    sliceY: 1,
    anims: {
      hit: {
        from: 0,
        to: 4
      }
    }
  });

  k.loadSprite("fog", "fog.png");
  k.loadSprite("holy_shine", "holy_shine.png");
  k.loadSprite("unholy_reliquiary", "unholy_reliquiary.png", {
    sliceX: 25,
    sliceY: 1,
    anims: {
      destroy: {
        from: 0,
        to: 24
      }
    }
  });
  k.loadSprite("unholy_flare", "unholy_flare.png");
  k.loadSprite("unholy_pulse", "unholy_pulse.png", {
    sliceX: 3,
    sliceY: 1,
    anims: {
      pulse: {
        from: 0,
        to: 2
      }
    }
  });
  k.loadSprite("ambient_bg", "ambient_bg.png");
};

export default loadSprites;
