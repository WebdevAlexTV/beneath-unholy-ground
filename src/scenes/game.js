import k from "../kaboom";
import constants from "../constants";
import initPlayer from "../player";
import initKeaboard from "../keyboard";
import level from "../level";
import initUi from "../ui";
import { AudioManager } from "../audio";

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
    " ": () => [k.layer("bg"), k.sprite("background_sprites", { frame: 5 })],
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

  const fog = k.add([
    k.sprite("fog"),
    k.layer("ambient"),
    k.origin("center"),
    k.pos(player.pos),
  ]);

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

  /**
   * Add Blocks
   */
  for (let row = 3; row < height - 1; row++) {
    for (let col = 1; col < width - 1; col++) {
      const solid = Math.random() > 0.99;
      const block = k.add([
        k.pos(col * constants.tileSize, row * constants.tileSize),
        k.sprite("background_sprites", { frame: solid ? 12 : 3 }),
        k.solid(),
        k.area(),
        "dirt",
        {
          damaged: false,
          isSolid: solid === true,
        },
      ]);
    }
  }
};

export default game;
