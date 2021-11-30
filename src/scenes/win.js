import { AudioManager } from "../audio";
import k from "../kaboom";
import { createButton, initButtons } from "../ui";

const win = () => {
    const audioManager = new AudioManager();

    k.layers(["obj", "ui"], "obj");

    initButtons();

    audioManager.play("outro_jingle");

    k.add([
        k.rect(k.width(), k.height()),
        k.pos(0, 0),
        k.color(k.rgb(0, 0, 0))
    ]);

    const finishText = k.add([
        k.text("You destroyed the unholy reliquiary!", {
            size: 6
        }),
        k.pos(k.width() / 2, k.height() / 2),
        k.origin("center"),
    ]);

    k.wait(2, () => {
        finishText.text = "Praise the lord!";

        k.wait(2, () => {
            finishText.text = "Amen!";

            k.wait(1, () => {
                finishText.text = "Amen?";

                k.wait(2, () => {
                    finishText.text = "";
                    audioManager.play("evil_laugh");

                    k.wait(1, () => {
                        finishText.text = "Created by WebDevAlex :)";
                        createButton(k.width() / 2, k.height() / 2 + 16, "Main Menu", () => { k.go("menu"); });
                    });
                });
            });
        });

    });

};

export default win