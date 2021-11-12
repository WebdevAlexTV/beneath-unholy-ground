import k from "../kaboom";
import { getPlayer } from "../player";

const spawnZombie = (posX, posY) => {
    const player = getPlayer();

    const tombstone = k.add([
        k.pos(posX, posY),
        k.layer("ambient_bg"),
        k.sprite("zombie", {
            frame: Math.random() > 0.5 ? 0 : 1
        })
    ]);

    k.wait(3, () => {
        const zombie = k.add([
            k.pos(posX, posY),
            k.sprite("zombie", { frame: 2, anim: "rise" }),
            k.area(),
            k.body(),
            k.solid(),
        ]);

        zombie.action(() => {
            zombie.flipX(player.pos.x < zombie.pos.x)
        });
    });


}

export default spawnZombie