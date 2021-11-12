import k from "./kaboom";
import game from "./scenes/game";

import loadSprites from "./sprites";

loadSprites();

k.scene("game", game);

k.go("game");