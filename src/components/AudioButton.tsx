import React from 'react';
import { Button } from 'semantic-ui-react';

type AudioButtonProps = {
  loadAndPlay: (postFunc: (value: string) => void) => void;
};

export const AudioButton: React.FC<AudioButtonProps> = (
  props: AudioButtonProps
) => {
  const playAudio = (value: string) => {
    const audio = new Audio('data:audio/wav;base64,' + value);
    audio.play();
  };
  return (
    <Button basic color="teal" onClick={() => props.loadAndPlay(playAudio)}>
      Play
    </Button>
  );
};
