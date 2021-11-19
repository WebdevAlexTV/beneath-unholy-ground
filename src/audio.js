import constants from "./constants";
import k from "./kaboom";

const loadAudio = () => {
  k.loadRoot("./resources/audio/");

  k.loadSound("deamon", "deamon.ogg");
  k.loadSound("holy", "holy.ogg");
  k.loadSound("dig", "dig.ogg");
  k.loadSound("run", "run.ogg");
  k.loadSound("crow", "crow.ogg");
  k.loadSound("background_music", "background_music.ogg");
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
