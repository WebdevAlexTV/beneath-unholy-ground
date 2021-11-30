import { AudioManager } from "../audio";
import { hurtDirt } from "../components/digger";
import constants from "../constants";
import k from "../kaboom";
import { getPlayer } from "../player";

const audioManager = new AudioManager();

const spawnZombie = (posX, posY) => {
    const player = getPlayer();

    const tombstone = k.add([
        k.pos(posX, posY),
        k.layer("ambient_bg"),
        k.sprite("zombie", {
            frame: Math.random() > 0.5 ? 0 : 1
        }),
        k.lifespan(4, { fade: 0.5 }),
    ]);

    k.wait(3, () => {
        const zombie = k.add([
            k.pos(posX, posY),
            k.sprite("zombie", { frame: 2 }),
            k.area(),
            k.body(),
            k.solid(),
            k.origin("center"),
            k.state("rise", [
                "rise",
                "run",
                "wait",
                "attack",
                "attack_dirt",
                "die"
            ]),
            "zombie",
            {
                viewDirection: 1,
                hurt: false,
                dead: false
            }
        ]);

        audioManager.play("zombie_idle");
        zombie.play("rise");

        k.wait(0.5, () => {
            zombie.enterState("run");
        });

        /**
         * Run
         */
        zombie.onStateEnter("run", () => {
            zombie.play("run", { loop: true });
        });

        zombie.onStateUpdate("run", () => {
            zombie.move(constants.zombieMovementSpeed * zombie.viewDirection, 0);
        });

        /**
         * Wait
         */
        zombie.onStateEnter("wait", () => {
            zombie.frame = 5;
            k.wait(2, () => {
                if (zombie.dead) {
                    return;
                }
                if ((player.pos.x < zombie.pos.x && zombie.pos.x - player.pos.x < 4) || player.pos.x > zombie.pos.x && player.pos.x - zombie.pos.x < 4) {
                    zombie.enterState("attack");
                } else {
                    zombie.enterState("run");
                }
            });
        });

        /**
         * Attack
         */
        zombie.onStateEnter("attack", () => {
            audioManager.play("zombie_attack");
            zombie.play("attack");

            const attackEffect = k.add([
                k.sprite("hit"),
                k.pos(zombie.pos.x + (4 * zombie.viewDirection), zombie.pos.y),
                k.origin("center"),
                k.area(),
                "zombie_attack"
            ]);

            attackEffect.flipX(zombie.viewDirection === -1);

            attackEffect.play("hit", {
                speed: 30,
                onEnd: () => {
                    k.destroy(attackEffect);
                    if (!zombie.dead) {
                        zombie.enterState("wait");
                    }
                }
            });

            attackEffect.onCollide("player", (player) => {
                audioManager.play("hit");
                player.damageSoul(10);
            });

        });

        /**
         * Attack a block
         */
        zombie.onStateEnter("attack_dirt", (data) => {
            zombie.play("attack", {
                onEnd: () => {
                    zombie.enterState(data.oldState ? data.oldState : "wait");
                    hurtDirt(data.dirt);
                }
            })
        });

        zombie.onUpdate(() => {
            zombie.flipX(player.pos.x < zombie.pos.x);

            if ((player.pos.x < zombie.pos.x && zombie.pos.x - player.pos.x > 8) || player.pos.x > zombie.pos.x && player.pos.x - zombie.pos.x > 8) {
                zombie.viewDirection = player.pos.x < zombie.pos.x ? - 1 : 1;
            }
        });

        /**
         * Die
         */
        zombie.onStateEnter("die", () => {
            audioManager.play("zombie_idle");
            zombie.play("die", {
                onEnd: () => {
                    k.wait(1, () => {
                        zombie.destroy();
                    });
                }
            })
        });

        /**
         * Collisions
         */
        zombie.onCollide("player", (player, collision) => {
            if (zombie.state === "die" || player.state === "die") {
                return;
            }
            if (collision) {
                if ((collision.isLeft() || collision.isRight())) {
                    if (zombie.state !== "attack" && zombie.state !== "wait") {
                        zombie.enterState("attack");
                    }
                }
            }
        });

        zombie.onCollide("dirt", (dirt, collision) => {
            if (zombie.state === "die") {
                return;
            }
            if (collision) {
                if (
                    (player.pos.y > zombie.pos.y && (player.pos.x - zombie.pos.x <= 10 && player.pos.x - zombie.pos.x >= -10 && collision.isBottom()))
                    || (player.pos.y < zombie.pos.y && (player.pos.x - zombie.pos.x <= 10 && player.pos.x - zombie.pos.x >= -10 && collision.isTop()))
                    || collision.isLeft()
                    || collision.isRight()
                ) {
                    zombie.enterState("attack_dirt", { oldState: zombie.state, dirt });
                }
            }
        });

    });


}

export default spawnZombie