import k from "./kaboom";
import level1 from "./scenes/level1";

import loadSprites from "./sprites";

loadSprites();

k.scene("level1", level1);

k.go("level1");