import k from "../kaboom";
import constants from "../constants";
import initPlayer from "../player";
import initKeaboard from "../keyboard";
import level from "../level";
import initUi, { showPriestComment } from "../ui";
import { AudioManager } from "../audio";
import spawnZombie from "../enemies/zombie";
import win from "./win";

const game = () => {
  const audioManager = new AudioManager();

  audioManager.play("background_music", { volume: 0.1, loop: true });

  let lastCrowSound = 0;

  const height = level.length;
  const width = level[0].length;

  /**
   * Level
   */
  k.addLevel(level, {
    width: constants.tileSize,
    height: constants.tileSize,
    pos: k.vec2(0, 0),
    "S": () => [k.layer("bg"), k.sprite("background_sprites", { frame: 5 })],
    " ": () => [k.layer("bg"), k.sprite("background_sprites", { frame: 19 })],
    L: () => [
      k.layer("bg"),
      k.sprite("background_sprites", { frame: 4 }),
      k.solid(),
      k.area(),
    ],
    R: () => [
      k.layer("bg"),
      k.sprite("background_sprites", { frame: 6 }),
      k.solid(),
      k.area(),
    ],
    "<": () => [
      k.layer("bg"),
      k.sprite("background_sprites", { frame: 8 }),
      k.solid(),
      k.area(),
    ],
    ">": () => [
      k.layer("bg"),
      k.sprite("background_sprites", { frame: 10 }),
      k.solid(),
      k.area(),
    ],
    _: () => [
      k.layer("bg"),
      k.sprite("background_sprites", { frame: 9 }),
      k.solid(),
      k.area(),
    ],
  });

  k.layers(["bg", "ambient_bg", "obj", "ambient", "ui"], "obj");

  const player = initPlayer();

  const cemetaryBackground = k.add([
    k.sprite("ambient_bg"),
    k.layer("ambient_bg"),
    k.pos(9, 0)
  ]);

  const fog = k.add([
    k.sprite("fog"),
    k.layer("ambient"),
    k.origin("center"),
    k.pos(player.pos),
  ]);


  /**
   * Boss START
   */
  const unholyFlair = k.add([
    k.sprite("unholy_flare"),
    k.pos(k.width() / 2, height * constants.tileSize - 20),
    k.layer("ambient_bg"),
    k.origin("center"),
    k.scale(1, 1),
    { lastFade: 0 }
  ]);

  unholyFlair.onUpdate(() => {
    if (unholyFlair.lastFade === 0) {
      if (unholyFlair.scale.x === 0.9) {
        unholyFlair.scale.x = 1;
        unholyFlair.scale.y = 1;
      } else {
        unholyFlair.scale.x = 0.9;
        unholyFlair.scale.y = 0.9;
      }
    }
    unholyFlair.lastFade += k.dt();
    if (unholyFlair.lastFade > 0.5) {
      unholyFlair.lastFade = 0;
    }
  });

  const unholyReliquiary = k.add([
    k.sprite("unholy_reliquiary"),
    k.pos(k.width() / 2, height * constants.tileSize - 20),
    k.layer("ambient_bg"),
    k.origin("center"),
    k.area(),
  ]);

  const winningPortal = k.add([
    k.origin("center"),
    k.area({ width: 12, height: 12 }),
    k.pos(unholyReliquiary.pos.x, unholyReliquiary.pos.y),
    { interactionText: null }
  ]);

  winningPortal.onUpdate(() => {
    if (winningPortal.isColliding(player)) {
      player.touchingUnholyReliquiary = true;
      if (winningPortal.interactionText === null) {
        winningPortal.interactionText = k.add([
          k.text("Press F to destroy", {
            size: 6
          }),
          k.pos(winningPortal.pos.x, winningPortal.pos.y - 20),
          k.layer("ui"),
          k.origin("center"),
        ]);
      }
    } else {
      player.touchingUnholyReliquiary = false;
      if (winningPortal.interactionText !== null) {
        k.destroy(winningPortal.interactionText);
        winningPortal.interactionText = null;
      }
    }
  });

  /**
   * Unholy reliquiary get's destroyed
   */
  k.on("unholy-reliquiary-destroyed", "player", () => {
    if (winningPortal) {
      k.destroy(winningPortal);
      if (winningPortal.interactionText !== null) {
        k.destroy(winningPortal.interactionText);
        winningPortal.interactionText = null;
      }
    }

    player.soul.current = player.soul.total;

    unholyFlair.use(k.lifespan(1, { fade: 0.5 }));
    audioManager.play("earthquake");
    unholyReliquiary.play("destroy", {
      onEnd: () => {
        unholyReliquiary.use(k.lifespan(1, { fade: 0.5 }))
        k.shake(30);
        k.wait(1, () => {
          k.go("win");
        })
      }
    });
  });

  /**
   * Unholy reliquiary collision with player
   */
  unholyReliquiary.onCollide("player", (player) => {
    if (constants.treasuresTotal > player.treasures) {
      showPriestComment("I need those reliquiaries to come closer!");
      player.moveTo(player.pos.x + (70 * (player.pos.x < unholyReliquiary.pos.x ? -1 : +1)), player.pos.y, 250);
      player.jump(40);

      addUnholyPulse(unholyReliquiary.pos.x, unholyReliquiary.pos.y);
      k.wait(0.3, () => {
        addUnholyPulse(unholyReliquiary.pos.x, unholyReliquiary.pos.y);
      });

      player.damageSoul(15);
    }
  });

  /**
   * Boss END
   */

  const addUnholyPulse = (posX, posY) => {
    const unholyPulse = k.add([
      k.sprite("unholy_pulse"),
      k.pos(posX, posY),
      k.layer("ambient_bg"),
      k.origin("center")
    ]);

    unholyPulse.play("pulse", {
      speed: 15, onEnd: () => {
        k.destroy(unholyPulse);
      }
    });
  }

  const addDirt = (posX, posY, solid = false) => {
    const block = k.add([
      k.pos(posX, posY),
      k.sprite("background_sprites", { frame: solid ? 12 : 3 }),
      k.solid(),
      k.area(),
      "dirt",
      {
        damaged: false,
        isSolid: solid === true,
        damage() {
          if (this.damaged) {
            this.unuse("solid");
            this.frame = 11;
            k.wait(0.3, () => {
              if (Math.random() > 0.9) {
                k.wait(0.1, () => {
                  const posX = this.pos.x;
                  const posY = this.pos.y;
                  spawnZombie(posX, posY);
                });
              }
              k.destroy(this);
            })
          } else {
            this.damaged = true;
            this.frame = 7;
          }
        }
      },
    ]);
  }

  const addTreasureDirt = (posX, posY) => {
    const block = k.add([
      k.pos(posX, posY),
      k.sprite("background_sprites", { frame: 13 }),
      k.solid(),
      k.area(),
      "dirt",
      {
        damaged: false,
        isSolid: false,
        damage() {
          if (this.damaged) {
            this.unuse("solid");
            this.stop();
            this.frame = 11;
            audioManager.play("coin");
            k.wait(0.3, () => {
              k.destroy(this);
              player.treasures += 1;
              if (player.treasures === 1) {
                showPriestComment("Maybe i should collect those fragments");
              } else if (player.treasures > 1 && player.treasures < constants.treasuresTotal) {
                showPriestComment("I need more of those fragments...");
              } else {
                showPriestComment("Those fragments combine to a cross, nice!");
              }
              console.log(player.treasures);
            });
          } else {
            this.damaged = true;
            this.frame = 16;
            this.play("treasureBroken");
          }

        }
      },
    ]);
    block.play("treasure", { loop: true, speed: 3 });
  }

  initKeaboard();
  initUi();

  player.onUpdate(() => {
    fog.pos = player.pos;
    if (lastCrowSound === 0) {
      audioManager.play("crow", { volume: 0.3 });
    }
    lastCrowSound += k.dt();

    if (lastCrowSound > 5 && Math.random() > 0.5) {
      lastCrowSound = 0;
    }
  });

  const minTreasure = 1;
  const maxTreasure = width - 2;
  const treasures = {
    4: 3,
    6: Math.floor(Math.random() * maxTreasure) + minTreasure,
    9: Math.floor(Math.random() * maxTreasure) + minTreasure,
    10: Math.floor(Math.random() * maxTreasure) + minTreasure,
    12: Math.floor(Math.random() * maxTreasure) + minTreasure,
    15: Math.floor(Math.random() * maxTreasure) + minTreasure,
    19: Math.floor(Math.random() * maxTreasure) + minTreasure,
    18: Math.floor(Math.random() * maxTreasure) + minTreasure,
    21: Math.floor(Math.random() * maxTreasure) + minTreasure,
    24: Math.floor(Math.random() * maxTreasure) + minTreasure,
  }

  /**
   * Add Blocks
   */
  for (let row = 4; row < height - 1; row++) {
    const treasureAt = Math.floor(Math.random() * width - 2) + 1;
    for (let col = 1; col < width - 1; col++) {
      if (row === height - 5) {
        if (col < 5 || col > width - 5) {
          addDirt(col * constants.tileSize, row * constants.tileSize);
        }
      } else if (row === height - 4) {
        if (col < 4 || col > width - 4) {
          addDirt(col * constants.tileSize, row * constants.tileSize);
        }
      } else if (row === height - 3) {
        if (col < 3 || col > width - 3) {
          addDirt(col * constants.tileSize, row * constants.tileSize);
        }
      } else if (row === height - 2) {
        if (col < 2 || col > width - 2) {
          addDirt(col * constants.tileSize, row * constants.tileSize);
        }
      } else {
        if (treasures[row] !== undefined && treasures[row] === col) {
          addTreasureDirt(col * constants.tileSize, row * constants.tileSize);
        } else {
          const solid = Math.random() > 0.99;

          addDirt(col * constants.tileSize, row * constants.tileSize, solid);
        }
      }
    }
  }
};



export default game;
