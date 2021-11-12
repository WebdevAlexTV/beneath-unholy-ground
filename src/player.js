import digger from "./components/digger";
import constants from "./constants";
import k from "./kaboom";
import level from "./level";

const initPlayer = () => {
    const player = k.add([
        k.pos(16, constants.tileSize / 2),
        k.sprite("player", { frame: 0 }),
        k.solid(),
        k.area(),
        k.body(),
        k.origin("center"),
        k.state("idle", ["idle", "run", "shovel", "pray", "jump"]),
        digger(),
        "player",
        {
            viewDirection: 1,
            isPraying: false,
            soul: {
                current: 60,
                total: 60
            },
            timeSinceLastDig: constants.digDelay
        }
    ]);


    player.onStateEnter("idle", () => {
        player.play("idle", { loop: true });
    });

    player.onStateEnter("run", () => {
        player.play("run", { loop: true });
    });

    player.onStateEnter("shovel", () => {
        player.play("shovel", { loop: true, onEnd: () => player.enterState("idle") });
    });

    player.onStateEnter("pray", () => {
        player.play("pray", { loop: true });
    });

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
}

export const getPlayer = () => {
    return k.get("player")[0];
};

export default initPlayer