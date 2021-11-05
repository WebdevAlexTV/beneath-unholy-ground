import k from "../kaboom";

const tileSize = 8;
const movementSpeed = 60;
const jumpForce = 180;
const digDelay = 0.25;
let timeSinceLastDig = digDelay;

const shovelRotations = {
    "top": 0,
    "bottom": 180,
    "left": 270,
    "right": 90,
    "topleft": 315,
    "topright": 45,
    "bottomright": 135,
    "bottomleft": 225,
}

const level = [
    "L                  R",
    "L                  R",
    "L                  R",
    "L                  R",
    "L                  R",
    "L                  R",
    "L                  R",
    "L                  R",
    "L                  R",
    "L                  R",
    "L                  R",
    "L                  R",
    "L                  R",
    "L                  R",
    "L                  R",
    "L                  R",
    "L                  R",
    "L                  R",
    "L                  R",
    "L                  R",
    "L                  R",
    "L                  R",
    "L                  R",
    "L                  R",
    "L                  R",
    "<__________________>",
];

const main = () => {
    const height = level.length;
    const width = level[0].length;

    /**
     * Level
     */
    k.addLevel(level, {
        width: tileSize,
        height: tileSize,
        pos: k.vec2(0, 0),
        " ": () => [k.sprite("background_sprites", { frame: 5 })],
        "L": () => [k.sprite("background_sprites", { frame: 4 }), k.solid(), k.area()],
        "R": () => [k.sprite("background_sprites", { frame: 6 }), k.solid(), k.area()],
        "<": () => [k.sprite("background_sprites", { frame: 8 }), k.solid(), k.area()],
        ">": () => [k.sprite("background_sprites", { frame: 10 }), k.solid(), k.area()],
        "_": () => [k.sprite("background_sprites", { frame: 9 }), k.solid(), k.area()],
    });

    /**
     * Add Blocks
     */
    for (let row = 3; row < height - 1; row++) {
        for (let col = 1; col < width - 1; col++) {
            const solid = Math.random() > 0.99;
            const block = k.add([
                k.pos(col * tileSize, row * tileSize),
                k.sprite("background_sprites", { frame: (solid ? 12 : 3) }),
                k.solid(),
                k.area(),
                "dirt",
                {
                    damaged: false,
                    isSolid: solid === true
                }
            ]);
        }
    }

    /**
     * Player
     */
    const player = k.add([
        k.pos(16, tileSize / 2),
        k.sprite("player"),
        k.solid(),
        k.area(),
        k.body(),
        k.origin("center"),
        {
            viewDirection: 1,
        }
    ]);
    player.play("idle", { loop: true, speed: 5 });
    /**
     * Adjust the camera position along the player position
     */
    player.action(() => {
        const posX = k.width() / 2;
        let posY = player.pos.y;
        if (posY < k.height() / 2) {
            posY = k.height() / 2;
        } else if (posY > level.length * tileSize - k.height() / 2) {
            posY = level.length * tileSize - k.height() / 2;
        }
        k.camPos(posX, posY);
    });

    const move = () => {
        player.move(movementSpeed * player.viewDirection, 0);
    }

    k.keyPress("right", () => {
        player.viewDirection = 1;
        player.flipX(false);
    });

    k.keyPress("left", () => {
        player.viewDirection = -1;
        player.flipX(true);
    });

    k.keyDown("right", () => {
        if (!k.keyIsDown("up") && !k.keyIsDown("down")) {
            move();
        }
    });

    k.keyDown("left", () => {
        if (!k.keyIsDown("up") && !k.keyIsDown("down")) {
            move();
        }
    });

    k.keyPress("space", function () {
        if (player.grounded()) {
            player.jump(jumpForce);
        }
    });

    k.keyPress("x", () => {
        if (timeSinceLastDig < digDelay) {
            return;
        }
        timeSinceLastDig = 0;
        let direction = k.keyIsDown("up") ? "top" : (k.keyIsDown("down") ? "bottom" : "")
        if (k.keyIsDown("left")) {
            direction += "left";
        } else if (k.keyIsDown("right")) {
            direction += "right";
        }
        let posX = player.pos.x;
        let posY = player.pos.y;

        if (direction !== "top" && direction != "bottom") {
            posX += player.viewDirection * (tileSize / 2);
        }
        if (direction.startsWith("top") || direction.startsWith("bottom")) {
            posY += (direction.startsWith("top") ? -1 : 1) * (tileSize / 2);
        }

        const rotation = direction !== "" ? shovelRotations[direction] : (player.viewDirection === -1 ? shovelRotations["left"] : shovelRotations["right"])

        const shovel = k.add([
            k.pos(player.pos.x, player.pos.y),
            k.origin("center"),
            k.area(),
            k.sprite("items", { frame: 0 }),
            k.rotate(rotation)
        ]);

        shovel.collides("dirt", dirt => {
            if (dirt.isSolid) {
                return;
            }
            if (dirt.isDamaged) {
                dirt.frame = 11;
                k.wait(0.1, () => {
                    k.destroy(dirt)
                })
            } else {
                dirt.isDamaged = true;
                dirt.frame = 7;
            }
        });
        k.wait(0.05, () => {
            shovel.moveTo(posX, posY);
            k.wait(0.1, () => {
                k.destroy(shovel);
            });
        })
    });

    k.action(() => {
        timeSinceLastDig += k.dt();
    });

}

export default main