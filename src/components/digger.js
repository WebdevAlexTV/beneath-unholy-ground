import k from "../kaboom";
import constants from "../constants";
import spawnZombie from "../enemies/zombie";
import { getPlayer } from "../player";

const digger = () => {
    return {
        dig(direction) {
            let posX = this.pos.x;
            let posY = this.pos.y;

            if (direction !== "top" && direction != "bottom") {
                posX += this.viewDirection * (constants.tileSize / 2);
            } else if (direction === "top" || direction === "bottom") {
                posY += (direction === "top" ? -1 : 1) * (constants.tileSize / 2);
            }

            const rotation = direction !== "" ? constants.shovelRotations[direction] : (this.viewDirection === -1 ? constants.shovelRotations["left"] : constants.shovelRotations["right"])

            this.play("shovel");


            /**
             * Handle the shovel
             */
            const shovel = k.add([
                k.pos(this.pos.x, this.pos.y),
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
                        if (Math.random() > 0.95) {
                            spawnZombie(dirt.pos.x, dirt.pos.y);
                        }
                        k.destroy(dirt);
                    })
                } else {
                    dirt.isDamaged = true;
                    dirt.frame = 7;
                }
            });

            k.wait(0.05, () => {
                shovel.moveTo(posX, posY);
                k.wait(0.2, () => {
                    k.destroy(shovel);
                    this.play("idle", { loop: true })
                });
            });
        }
    }
}

export default digger;