import k from "./kaboom";

const loadSprites = () => {
    k.loadRoot("./resources/sprites/");
    k.loadSprite("background_sprites", "background_sprites.png", {
        sliceX: 4,
        sliceY: 4,
    });
    k.loadSprite("items", "items.png", {
        sliceX: 5,
        sliceY: 1,
    });
    k.loadSprite("player", "player.png", {
        sliceX: 2,
        sliceY: 1,
        anims: {
            idle: {
                from: 0,
                to: 1
            }
        }
    });
};

export default loadSprites;
