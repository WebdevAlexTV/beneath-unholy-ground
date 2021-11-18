import k from "./kaboom";
import constants from "./constants";
import { getPlayer } from "./player";

const initKeaboard = () => {
  const player = getPlayer();

  const move = () => {
    player.move(constants.movementSpeed * player.viewDirection, 0);
  };

  k.onKeyPress("right", () => {
    player.viewDirection = 1;
    player.flipX(false);
    if (player.diggingMode) {
      if (player.timeSinceLastDig < constants.digDelay || player.isPraying) {
        return;
      }
      player.enterState("shovel", "right");
    } else {
      player.enterState("run");
    }
  });

  k.onKeyPress("left", () => {
    player.viewDirection = -1;
    player.flipX(true);
    if (player.diggingMode) {
      if (player.timeSinceLastDig < constants.digDelay || player.isPraying) {
        return;
      }
      player.enterState("shovel", "left");
    } else {
      player.enterState("run");
    }
  });

  k.onKeyPress("up", () => {
    if (player.diggingMode) {
      if (player.timeSinceLastDig < constants.digDelay || player.isPraying) {
        return;
      }
      player.enterState("shovel", "top");
    }
  });

  k.onKeyPress("down", () => {
    if (player.diggingMode) {
      if (player.timeSinceLastDig < constants.digDelay || player.isPraying) {
        return;
      }
      player.enterState("shovel", "bottom");
    }
  });

  k.onKeyDown("right", () => {
    if (!player.diggingMode && !player.isPraying) {
      move();
    }
  });

  k.onKeyDown("left", () => {
    if (!player.diggingMode && !player.isPraying) {
      move();
    }
  });

  k.onKeyRelease("right", () => {
    if (!player.diggingMode) {
      player.play("idle", { loop: true });
      player.enterState("idle");
    }
  });

  k.onKeyRelease("left", () => {
    if (!player.diggingMode) {
      player.play("idle", { loop: true });
      player.enterState("idle");
    }
  });

  k.onKeyPress("space", function () {
    if (!player.diggingMode) {
      player.enterState("jump");
    }
  });

  k.onKeyPress("x", () => {
    if (player.deamonForm) {
      player.enterState("attack");
    } else {
      player.enterState("shovel_idle", player.state);
      player.diggingMode = true;
    }
  });

  k.onKeyRelease("x", () => {
    player.diggingMode = false;
    player.enterState("idle");
  });

  /*k.onKeyPress("x", () => {
        if (player.timeSinceLastDig < constants.digDelay || player.isPraying) {
            return;
        }
        player.timeSinceLastDig = 0;
        let direction = k.isKeyDown("up") ? "top" : (k.isKeyDown("down") ? "bottom" : "")
        if (k.isKeyDown("left")) {
            direction += "left";
        } else if (k.isKeyDown("right")) {
            direction += "right";
        }

        player.dig(direction);
    });*/

  k.onKeyPress("c", () => {
    player.enterState("pray");
  });

  k.onKeyRelease("c", () => {
    player.enterState("idle");
  });
};

export default initKeaboard;
