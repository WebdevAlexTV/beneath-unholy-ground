import k from "../kaboom";
import constants from "../constants";
import initPlayer from "../player";
import initKeaboard from "../keyboard";
import level from "../level";
import initUi from "../ui";

const game = () => {
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
