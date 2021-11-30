import constants from "./constants";
import k from "./kaboom";

const loadAudio = () => {
  k.loadRoot("./resources/audio/");

  k.loadSound("demon", "demon.ogg");
  k.loadSound("holy", "holy.ogg");
  k.loadSound("dig", "dig.ogg");
  k.loadSound("run", "run.ogg");
  k.loadSound("crow", "crow.ogg");
  k.loadSound("player_die", "player_die.ogg");
  k.loadSound("background_music", "background_music.ogg");
  k.loadSound("zombie_idle", "zombie_idle.ogg");
  k.loadSound("zombie_attack", "zombie_attack.ogg");
  k.loadSound("hit", "hit.ogg");
  k.loadSound("coin", "coin.ogg");
  k.loadSound("pain", "pain.ogg");
  k.loadSound("evil_laugh", "evil_laugh.ogg");
  k.loadSound("outro_jingle", "outro_jingle.ogg");
  k.loadSound("earthquake", "earthquake.ogg");
};

export class AudioManager {
  play(audioName, options) {
    return k.play(audioName, {
      volume: constants.audioVolume,
      ...options,
    });
  }
}

export default loadAudio;
