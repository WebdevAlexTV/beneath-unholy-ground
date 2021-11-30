import { AudioManager } from "../audio";
import k from "../kaboom";
import { createButton, initButtons } from "../ui";

const menu = () => {
    const audioManager = new AudioManager();

    k.layers(["obj", "ui"], "obj");

    initButtons();

    audioManager.play("background_music", { volume: 0.1, loop: true });

    k.add([
        k.rect(k.width(), k.height()),
        k.pos(0, 0),
        k.color(k.rgb(0, 0, 0))
    ]);

    k.add([
        k.sprite("title"),
        k.pos(k.width() / 2, 20),
        k.origin("center"),
        k.scale(0.5, 0.5)
    ]);

    createButton(k.width() / 2, k.height() / 2, "New Game", () => { k.go("introduction", "menu"); });
    createButton(k.width() / 2, k.height() / 2 + 12, "Controls", () => { k.go("controls", "menu"); });
    createButton(k.width() / 2, k.height() / 2 + 24, "Credits", () => { k.go("credits", "menu"); });

    k.add([
        k.text("Created by WebDevAlex", { size: 4 }),
        k.origin("botright"),
        k.pos(k.width() - 2, k.height() - 2)
    ])
};

export default menu