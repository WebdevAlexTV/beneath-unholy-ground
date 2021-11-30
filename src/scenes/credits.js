import { AudioManager } from "../audio";
import k from "../kaboom";
import { createButton, initButtons } from "../ui";

const credits = () => {
    const audioManager = new AudioManager();

    k.layers(["obj", "ui"], "obj");

    initButtons();

    const sounds = [
        "Zombie Sounds by artisticdude",
        "Foot Walking Step Soudns by Jute",
        "Wisdom Magic by qubodup",
        "Horror Ambient by Vinrax",
        "Crow Caw by zeroisnotnull",
        "Hits/Punches by Independent.nu",
        "Goblin Scream by spookymodem",
        "Plingy Coin by Fupi",
        "Pain Sounds by EmoPreben",
        "Evil Laugh by AntumDeluge",
        "Level Finish Fanfares by jobromedia",
        "Earthqualt amd open sesame by mieki256"
    ];

    audioManager.play("background_music", { volume: 0.1, loop: true });

    k.add([
        k.rect(k.width(), k.height()),
        k.pos(0, 0),
        k.color(k.rgb(0, 0, 0))
    ]);

    k.add([
        k.text("Credits", { size: 6 }),
        k.pos(k.width() / 2, 16),
        k.origin("center")
    ]);

    const startAt = 24;
    for (let i = 0; i < sounds.length; i++) {
        k.add([
            k.text(sounds[i], { size: 4 }),
            k.pos(10, startAt + i * 3),
            k.origin("left")
        ]);
    }

    createButton(k.width() / 2, k.height() - 8, "Back to Menu", () => { k.go("menu"); });
};

export default credits