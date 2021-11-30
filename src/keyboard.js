import k from "./kaboom";
import constants from "./constants";
import { getPlayer } from "./player";
import { showPriestComment } from "./ui";

const initKeaboard = () => {
  const player = getPlayer();

  const move = () => {
    player.move(constants.movementSpeed * player.viewDirection, 0);
  };

  k.onKeyPress("right", () => {
    if (player.dead) {

    }
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
    if (player.dead) {
      return;
    }
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
    if (player.dead) {
      return;
    }
    if (player.diggingMode) {
      if (player.timeSinceLastDig < constants.digDelay || player.isPraying) {
        return;
      }
      player.enterState("shovel", "top");
    }
  });

  k.onKeyPress("down", () => {
    if (player.dead) {
      return;
    }
    if (player.diggingMode) {
      if (player.timeSinceLastDig < constants.digDelay || player.isPraying) {
        return;
      }
      player.enterState("shovel", "bottom");
    }
  });

  k.onKeyDown("right", () => {
    if (player.dead) {
      return;
    }
    if (!player.diggingMode && !player.isPraying) {
      move();
    }
  });

  k.onKeyDown("left", () => {
    if (player.dead) {
      return;
    }
    if (!player.diggingMode && !player.isPraying) {
      move();
    }
  });

  k.onKeyRelease("right", () => {
    if (player.dead) {
      return;
    }
    if (!player.diggingMode) {
      player.play("idle", { loop: true });
      player.enterState("idle");
    }
  });

  k.onKeyRelease("left", () => {
    if (player.dead) {
      return;
    }
    if (!player.diggingMode) {
      player.play("idle", { loop: true });
      player.enterState("idle");
    }
  });

  k.onKeyPress("space", function () {
    if (player.dead) {
      return;
    }
    if (!player.diggingMode) {
      player.enterState("jump");
    }
  });

  k.onKeyPress("x", () => {
    if (player.dead) {
      return;
    }
    if (player.demonForm) {
      showPriestComment("I can't dig, i can only make you suffer!");
    } else {
      player.enterState("shovel_idle", player.state);
      player.diggingMode = true;
    }
  });

  k.onKeyPress("v", () => {
    if (player.demonForm) {
      player.enterState("attack");
    } else {
      showPriestComment("I can't attack, i'm a priest!");
    }
  });

  k.onKeyPress("f", () => {
    if (player.touchingUnholyReliquiary) {
      player.trigger("unholy-reliquiary-destroyed");
    }
  });

  k.onKeyRelease("x", () => {
    if (player.dead) {
      return;
    }
    player.diggingMode = false;
    player.enterState("idle");
  });

  k.onKeyPress("c", () => {
    if (player.dead) {
      return;
    }
    player.enterState("pray");
  });

  k.onKeyRelease("c", () => {
    if (player.dead) {
      return;
    }
    player.enterState("idle");
  });

  k.onKeyPress("n", () => {
    k.go("game");
  })
};

export default initKeaboard;
