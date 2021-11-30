import k from "./kaboom";

import game from "./scenes/game";
import win from "./scenes/win";
import menu from "./scenes/menu";
import controls from "./scenes/controls";
import credits from "./scenes/credits";
import introduction from "./scenes/introduction";
import gameOver from "./scenes/gameOver";

import loadSprites from "./sprites";
import loadAudio from "./audio";
import { initButtons } from "./ui";


loadSprites();
loadAudio();
initButtons();

k.scene("game", game);
k.scene("win", win);
k.scene("menu", menu);
k.scene("credits", credits);
k.scene("introduction", introduction);
k.scene("controls", controls);
k.scene("game-over", gameOver);

k.go("menu");
