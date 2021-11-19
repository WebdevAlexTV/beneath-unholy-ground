import k from "./kaboom";
import game from "./scenes/game";

import loadSprites from "./sprites";
import loadAudio from "./audio";

loadSprites();
loadAudio();

k.scene("game", game);

k.go("game");
