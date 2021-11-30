import { AudioManager } from "../audio";
import k from "../kaboom";
import { createButton, initButtons } from "../ui";

const gameOver = () => {
    const audioManager = new AudioManager();

    k.layers(["obj", "ui"], "obj");

    initButtons();

    audioManager.play("evil_laugh");

    k.add([
        k.rect(k.width(), k.height()),
        k.pos(0, 0),
        k.color(k.rgb(0, 0, 0))
    ]);

    const gameOverText = k.add([
        k.text("Game Over!", {
            size: 12
        }),
        k.pos(k.width() / 2, k.height() / 2),
        k.layer("ui"),
        k.fixed(),
        k.origin("center"),
    ]);

    createButton(k.width() * 0.25, k.height() - 8, "Main Menu", () => { k.go("menu"); });
    createButton(k.width() * 0.75, k.height() - 8, "New Game", () => { k.go("introduction"); });
};

export default gameOver