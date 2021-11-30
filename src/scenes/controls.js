import { AudioManager } from "../audio";
import k from "../kaboom";
import { createButton, initButtons } from "../ui";

const controls = (previousScene) => {
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
        k.text("Controls", { size: 6 }),
        k.pos(k.width() / 2, 16),
        k.origin("center")
    ]);

    const textBlocks = [
        "[Arrow Keys] - Movement",
        "[Space] - Jump",
        "[X] + [Arrow Keys] - Digging (not as demon)",
        "[C] - Praying (heal your soul)",
        "[V] - Attack (not as priest)"
    ];

    const startAt = 24;
    for (let i = 0; i < textBlocks.length; i++) {
        k.add([
            k.text(textBlocks[i], { size: 5 }),
            k.pos(10, startAt + i * 5),
            k.origin("left")
        ]);
    }

    createButton(k.width() / 2, k.height() - 8, "Back", () => { k.go(previousScene); });
};

export default controls