import k from "./kaboom";
import constants from "./constants";
import { getPlayer } from "./player";

const initKeaboard = () => {
    const player = getPlayer();

    const move = () => {
        player.move(constants.movementSpeed * player.viewDirection, 0);
    }

    k.onKeyPress("right", () => {
        player.viewDirection = 1;
        player.flipX(false);
        player.enterState("run");
    });

    k.onKeyPress("left", () => {
        player.viewDirection = -1;
        player.flipX(true);
        player.enterState("run");
    });

    k.onKeyDown("right", () => {
        if (!k.isKeyDown("up") && !k.isKeyDown("down") && !player.isPraying) {
            move();
        }
    });


    k.onKeyDown("left", () => {
        if (!k.isKeyDown("up") && !k.isKeyDown("down") && !player.isPraying) {
            move();
        }
    });

    k.onKeyRelease("right", () => {
        player.play("idle", { loop: true })
        player.enterState("idle");
    });

    k.onKeyRelease("left", () => {
        player.play("idle", { loop: true })
        player.enterState("idle");
    });

    k.onKeyPress("space", function () {
        player.enterState("jump");
    });

    k.onKeyPress("x", () => {
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
    });

    k.onKeyPress("c", () => {
        player.isPraying = true;
        player.play("pray", { loop: true });
    });

    k.onKeyRelease("c", () => {
        player.isPraying = false;
        player.play("idle", { loop: true });
    });
}

export default initKeaboard