import k from "../kaboom";
import constants from "../constants";
import spawnZombie from "../enemies/zombie";
import { AudioManager } from "../audio";

const digger = () => {
  const audioManager = new AudioManager();

  return {
    dig(direction) {
      let posX = this.pos.x;
      let posY = this.pos.y;

      if (direction !== "top" && direction != "bottom") {
        posX += this.viewDirection * (constants.tileSize / 2);
      } else if (direction === "top" || direction === "bottom") {
        posY += (direction === "top" ? -1 : 1) * (constants.tileSize / 2);
      }

      /**
       * Handle the shovel
       */
      const shovel = k.add([
        k.pos(this.pos.x, this.pos.y),
        k.origin("center"),
        k.area(),
        k.rect(1, 2),
        k.opacity(0),
        {
          hit: false
        }
      ]);

      shovel.collides("dirt", (dirt) => {
        if (dirt.isSolid) {
          return;
        }
        if (!shovel.hit) {
          shovel.hit = true;
          hurtDirt(dirt);
        }
        audioManager.play("dig");
      });

      k.wait(0.05, () => {
        shovel.moveTo(posX, posY);
        k.wait(0.2, () => {
          k.destroy(shovel);
          this.enterState("idle");
          // this.play("idle", { loop: true });
        });
      });
    },
  };
};

export const hurtDirt = (dirt) => {
  dirt.damage();
}

export default digger;
