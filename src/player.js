import { AudioManager } from "./audio";
import digger from "./components/digger";
import constants from "./constants";
import k from "./kaboom";
import level from "./level";
import { showPriestComment } from "./ui";

const initPlayer = () => {
  const audioManager = new AudioManager();

  let shine = null;

  const player = k.add([
    k.pos(16, constants.tileSize / 2),
    // k.pos(24, level.length * 8 - 8),
    k.sprite("player", { frame: 0 }),
    k.solid(),
    k.area(),
    k.body(),
    k.origin("center"),
    k.state("idle", [
      "idle",
      "run",
      "pray",
      "jump",
      "shovel_idle",
      "shovel",
      "attack",
      "die"
    ]),
    digger(),
    "player",
    {
      viewDirection: 1,
      isPraying: false,
      comment: null,
      diggingMode: false,
      soul: {
        current: 60,
        total: 60,
      },
      dead: false,
      demonForm: false,
      timeSinceLastDig: constants.digDelay,
      shovelDirection: null,
      runSound: null,
      treasures: 0,
      touchingUnholyReliquiary: false,
      damageSoul(damage) {
        this.soul.current -= damage;
        if (this.soul.current < 0) {
          this.soul.current = 0;
        }
        audioManager.play("pain");
      },
      useDefaultSprite() {
        this.use(k.sprite("player"));
        this.flipX(this.viewDirection !== 1);
      },
      useShovelSprite(animationDirection) {
        player.use(k.sprite(`player_shovel_${animationDirection}`));
        player.flipX(player.viewDirection !== 1);
      },
      useDemonForm() {
        this.changeForm("demon");
        audioManager.play("demon");
      },
      useHumanForm() {
        this.changeForm("human");
        audioManager.play("holy");
      },
      changeForm(form) {
        if (form === "human") {
          this.use(k.sprite("player"));
          this.demonForm = false;
        } else {
          this.diggingMode = false;
          this.use(k.sprite("player_demon"));
          this.demonForm = true;
        }
        this.flipX(this.viewDirection !== 1);

        if (
          this.state === "attack" ||
          this.state === "shovel" ||
          this.state === "shovel_idle"
        ) {
          this.enterState("idle");
        } else {
          this.play(this.state, { loop: true });
        }
      },
    },
  ]);

  /**
   * Idle
   */
  player.onStateEnter("idle", () => {
    player.play("idle", { loop: true });
  });

  /**
   * Run
   */
  player.onStateEnter("run", () => {
    player.runSound = audioManager.play("run", {
      loop: true,
      speed: 1.5,
      volume: 0.1,
    });
    player.play("run", { loop: true });
  });

  player.onStateLeave("run", () => {
    if (player.runSound !== null) {
      player.runSound.pause();
    }
  });

  /**
   * Die
   */
  player.onStateEnter("die", () => {
    player.play("die", {
      onEnd: () => {
        k.go("game-over");
      }
    });
    audioManager.play("player_die");
  });

  /**
   * Attack
   */
  player.onStateEnter("attack", () => {
    if (!player.demonForm) {
      player.enterState("idle");
      return;
    }
    player.play("attack", {
      onEnd: () => {
        player.enterState("idle");
      },
    });

    const attackEffect = k.add([
      k.sprite("hit"),
      k.pos(player.pos.x + (4 * player.viewDirection), player.pos.y),
      k.origin("center"),
      k.area(),
      "player_attack",
      {
        hit: false
      }
    ]);

    attackEffect.flipX(player.viewDirection === -1);

    attackEffect.play("hit", {
      speed: 30,
      onEnd: () => {
        k.destroy(attackEffect);
      }
    });

    k.onCollide("player_attack", "zombie", (attack, zombie) => {
      if (zombie.dead) {
        return;
      }
      if (!attack.hit) {
        attack.hit = true;
        audioManager.play("hit");
        if (zombie.hurt) {
          zombie.dead = true;
          zombie.enterState("die");
        } else {
          zombie.hurt = true;
        }
      }

    });
  });

  /**
   * Pray
   */
  player.onStateEnter("pray", () => {
    showPriestComment("Father, heal my soul!", true);
    shine = k.add([
      k.sprite("holy_shine"),
      k.pos(player.pos.x, player.pos.y - 30),
      k.origin("center"),
    ]);

    player.isPraying = true;
    player.play("pray", { loop: true });
  });

  player.onStateLeave("pray", () => {
    if (shine) {
      k.destroy(shine);
    }
    if (player.comment) {
      k.destroy(player.comment);
      player.comment = null;
    }
    player.isPraying = false;
  });

  /**
   * Shovel
   */
  player.onStateEnter("shovel_idle", () => {
    player.play("shovel_idle", { loop: true });
  });

  player.onStateEnter("shovel", (direction) => {
    const animationDirection =
      direction === "top" || direction === "bottom" ? "vertical" : "horizontal";
    player.shovelDirection = direction;
    player.timeSinceLastDig = 0;

    if (player.shovelDirection === "right") {
      player.pos.x = player.pos.x + 2;
    } else if (player.shovelDirection === "left") {
      player.pos.x = player.pos.x - 2;
    }

    player.dig(direction);

    player.unuse("body");
    player.useShovelSprite(animationDirection);
    if (direction === "top") {
      player.play("shovelUp");
    } else if (direction === "bottom") {
      player.play("shovelDown");
    } else {
      player.play("shovel");
    }
  });

  player.onStateLeave("shovel", (ey) => {
    player.use(k.body());

    if (!player.demonForm) {
      player.useDefaultSprite();
      if (player.shovelDirection === "right") {
        player.pos.x = player.pos.x - 2;
      } else if (player.shovelDirection === "left") {
        player.pos.x = player.pos.x + 2;
      }
    }

    player.shovelDirection = null;
  });


  /**
   * Jump
   */
  player.onStateEnter("jump", () => {
    player.play("jump");
    player.jump(constants.jumpForce);
  });

  player.on("ground", () => {
    if (k.isKeyDown("left") || k.isKeyDown("right")) {
      player.enterState("run");
    } else {
      player.enterState("idle");
    }
  });

  player.onUpdate(() => {
    if (player.soul.current <= 0) {
      if (player.state !== "die") {
        player.dead = true;
        player.enterState("die");
      }
      return;
    }
    // Adjust the camera position according to player movement.
    const posX = k.width() / 2;
    let posY = player.pos.y;
    if (posY < k.height() / 2) {
      posY = k.height() / 2;
    } else if (posY > level.length * constants.tileSize - k.height() / 2) {
      posY = level.length * constants.tileSize - k.height() / 2;
    }
    k.camPos(posX, posY);
    // Keep track of digging.
    player.timeSinceLastDig += k.dt();

    if ((100 / player.soul.total) * player.soul.current < 50) {
      if (!player.demonForm) {
        player.useDemonForm();
      }
    } else {
      if (player.demonForm) {
        player.useHumanForm();
      }
    }

    if (!player.isPraying) {
      player.soul.current -= k.dt();
    } else {
      if (player.soul.current + k.dt() * 3 > player.soul.total) {
        player.soul.current = player.soul.total;
      } else {
        player.soul.current += k.dt() * 3;
      }
    }
  });

  return player;
};

export const getPlayer = () => {
  return k.get("player")[0];
};

export default initPlayer;
