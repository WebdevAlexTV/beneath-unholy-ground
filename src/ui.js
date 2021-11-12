import k from "./kaboom";
import { getPlayer } from "./player";

const initUi = () => {
    const player = getPlayer();

    const meterOutline = k.add([
        k.rect(50, 4),
        k.outline(2),
        k.color(0, 0, 0),
        k.pos(2, k.height() - 6),
        k.layer("ui"),
        k.fixed(),
    ]);

    const meter = k.add([
        k.rect(50, 2),
        k.pos(2, k.height() - 5),
        k.color(255, 255, 255),
        k.layer("ui"),
        k.fixed(),
    ]);


    k.action(() => {
        meter.width = Math.floor(100 / player.soul.total * player.soul.current / 2);
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

    });
    /*k.action(() => {
      if (tank.lastShot > 0) {
        tank.lastShot = Math.max(tank.lastShot - k.dt(), 0);
        meter.width = Math.floor((SHOOT_COOLDOWN - tank.lastShot) * 20);
      } else {
        if (!tank.canShoot) {
          tank.canShoot = true;
          meter.color.red = 0;
          meter.color.green = 100;
          meter.color.blue = 0;
        }
      }
    });*/
}

export default initUi