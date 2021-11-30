import { AudioManager } from "../audio";
import k from "../kaboom";
import { createButton, initButtons } from "../ui";

const introduction = () => {
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
        k.text("Introduction", { size: 6 }),
        k.pos(k.width() / 2, 16),
        k.origin("center")
    ]);

    const textBlocks = [
        "The cemetery beside your church was corrupted",
        "by an unholy force. The rotten smell is already",
        "reaching your church. You should take a look",
        "what is happening beneath the cemetery and wipe",
        "out the unholy forces of hell.",
        "",
        "May god bless you!"
    ];

    const startAt = 24;
    for (let i = 0; i < textBlocks.length; i++) {
        k.add([
            k.text(textBlocks[i], { size: 5 }),
            k.pos(10, startAt + i * 5),
            k.origin("left")
        ]);
    }

    createButton(k.width() * 0.25, k.height() - 8, "Controls", () => { k.go("controls", "introduction"); });
    createButton(k.width() * 0.75, k.height() - 8, "Start", () => { k.go("game"); });
};

export default introduction