import { AudioManager } from "./audio";
import digger from "./components/digger";
import constants from "./constants";
import k from "./kaboom";
import level from "./level";

const initPlayer = () => {
  const audioManager = new AudioManager();

  const player = k.add([
    k.pos(16, constants.tileSize / 2),
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
    ]),
    digger(),
    "player",
    {
      viewDirection: 1,
      isPraying: false,
      diggingMode: false,
      soul: {
        current: 40,
        total: 60,
      },
      deamonForm: false,
      timeSinceLastDig: constants.digDelay,
      shovelDirection: null,
      runSound: null,
      useDefaultSprite() {
        this.use(k.sprite("player"));
        this.flipX(this.viewDirection !== 1);
      },
      useShovelSprite(animationDirection) {
        player.use(k.sprite(`player_shovel_${animationDirection}`));
        player.flipX(player.viewDirection !== 1);
      },
      useDeamonForm() {
        this.changeForm("deamon");
        this.diggingMode = false;
        audioManager.play("deamon");
      },
      useHumanForm() {
        this.changeForm("human");
        audioManager.play("holy");
      },
      changeForm(form) {
        if (form === "human") {
          this.deamonForm = false;
          this.use(k.sprite("player"));
        } else {
          this.deamonForm = true;
          this.use(k.sprite("player_deamon"));
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

  player.onStateEnter("idle", () => {
    player.play("idle", { loop: true });
  });

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

  player.onStateEnter("attack", () => {
    if (!player.deamonForm) {
      player.enterState("idle");
      return;
    }
    player.play("attack", {
      onEnd: () => {
        player.enterState("idle");
      },
    });
  });

  player.onStateEnter("pray", () => {
    player.isPraying = true;
    player.play("pray", { loop: true });
  });

  player.onStateLeave("pray", () => {
    player.isPraying = false;
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
    player.useDefaultSprite();
    player.use(k.body());
    if (player.shovelDirection === "right") {
      player.pos.x = player.pos.x - 2;
    } else if (player.shovelDirection === "left") {
      player.pos.x = player.pos.x + 2;
    }
    player.shovelDirection = null;
  });

  player.onStateEnter("pray", () => {
    player.play("pray", { loop: true });
  });

  player.onStateEnter("jump", () => {
    player.play("jump");
    player.jump(constants.jumpForce);
  });

  player.onStateEnter("shovel_idle", () => {
    player.play("shovel_idle", { loop: true });
  });

  player.on("ground", () => {
    if (k.isKeyDown("left") || k.isKeyDown("right")) {
      player.enterState("run");
    } else {
      player.enterState("idle");
    }
  });

  player.onUpdate(() => {
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
      if (!player.deamonForm) {
        player.useDeamonForm();
      }
    } else {
      if (player.deamonForm) {
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
