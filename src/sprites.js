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
    k.loadSprite("zombie", "zombie.png", {
        sliceX: 7,
        sliceY: 1,
        anims: {
            rise: {
                from: 2,
                to: 5
            }
        }
    });
    k.loadSprite("player", "player.png", {
        sliceX: 10,
        sliceY: 1,
        anims: {
            idle: {
                from: 0,
                to: 1
            },
            shovel: {
                from: 2,
                to: 3
            },
            pray: {
                from: 4,
                to: 5
            },
            run: {
                from: 6,
                to: 7
            },
            jump: {
                from: 8,
                to: 9
            }
        }
    });
};

export default loadSprites;
