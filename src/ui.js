import constants from "./constants";
import k from "./kaboom";
import { getPlayer } from "./player";

const initUi = () => {
  const player = getPlayer();

  const meterOutline = k.add([
    k.rect(54, 4),
    k.color(50, 50, 50),
    k.pos(2, k.height() - 6),
    k.layer("ui"),
    k.fixed(),
  ]);

  const meter = k.add([
    k.rect(50, 2),
    k.pos(3, k.height() - 5),
    k.color(255, 255, 255),
    k.layer("ui"),
    k.fixed(),
  ]);

  const treasuresCounter = k.add([
    k.text("0 / 10", {
      size: 6
    }),
    k.pos(k.width() - 4, k.height() - 4),
    k.layer("ui"),
    k.fixed(),
    k.origin("right"),
  ]);

  k.onUpdate(() => {
    meter.width = Math.floor(
      ((100 / player.soul.total) * player.soul.current) / 2
    );
    if (meter.width < 10) {
      meter.color = k.rgb(255, 100, 100);
    } else if (meter.width < 15) {
      meter.color = k.rgb(255, 140, 140);
    } else if (meter.width < 20) {
      meter.color = k.rgb(255, 190, 190);
    } else if (meter.width < 25) {
      meter.color = k.rgb(255, 225, 225);
    } else {
      meter.color = k.rgb(255, 255, 255);
    }

    treasuresCounter.text = player.treasures + "/" + constants.treasuresTotal;
  });
};

export const initButtons = () => {

  /*k.onHover("button", (button) => {
    k.cursor("pointer");
  }, () => {
    k.cursor("default");
  });*/

  k.onClick("button", (button) => {
    button.clickHandler();
  });

  k.onHover("button_background", (background) => {
    background.color = k.rgb(100, 0, 0);
    //k.cursor("pointer");
  }, (background) => {
    background.color = k.rgb(0, 0, 0);
    //k.cursor("default");
  })
}

export const showPriestComment = (comment, keep = false) => {
  const player = getPlayer();

  if (player.comment !== null) {
    k.destroy(player.comment);
  }
  player.comment = k.add([
    k.text(comment, {
      size: 6
    }),
    k.pos(k.width() / 2, 10),
    k.layer("ui"),
    k.fixed(),
    k.origin("center"),
  ]);

  if (!keep) {
    k.wait(2, () => {
      if (player.comment !== null && player.comment.text === comment) {
        k.destroy(player.comment);
        player.comment = null;
      }
    });
  }
}

export const createButton = (posX, posY, text, clickHandler = () => { }) => {
  const buttonText = k.add([
    k.text(text, { size: 4 }),
    k.pos(posX, posY),
    k.layer("ui"),
    k.origin("center"),
    k.area({ width: 48, height: 10 }),
    "button",
    {
      clickHandler: clickHandler
    }
  ]);
  const button = k.add([
    k.pos(buttonText.pos.x, buttonText.pos.y),
    k.rect(48, 8),
    k.color(k.rgb(0, 0, 0)),
    k.outline(1, k.rgb(255, 255, 255)),
    k.origin("center"),
    k.area(),
    "button_background"
  ]);
}

export default initUi;
