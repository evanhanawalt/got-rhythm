import React, { useState, useEffect } from "react";
export const useBeatLoop = () => {
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  const [audioSource, setAudioSource] = useState<AudioBufferSourceNode | null>(
    null
  );
  const [gain, setGain] = useState<GainNode | null>(null);
  const [audioData, setAudioData] = useState<ArrayBuffer | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  // arraybuffers are detached when consumed by bufferedsource nodes,
  // so when you go to start the loop, create a new array buffer from the stored audioData
  const copyArraybuffer = (buffer: ArrayBuffer) => {
    const newbuffer = new ArrayBuffer(buffer.byteLength);
    new Uint8Array(newbuffer).set(new Uint8Array(buffer));
    return newbuffer;
  };

  useEffect(() => {
    if (!audioContext) {
      // create the audio context and gain node
      // only when the component is mounted
      const newAudioContext = new window.AudioContext();
      const newGainNode = newAudioContext.createGain();
      newGainNode.connect(newAudioContext.destination);
      setAudioContext(newAudioContext);
      setGain(newGainNode);
    }

    if (audioContext && !audioData) {
      // fetch the audio data when the component is mounted
      // and the audio context is available
      fetch("/beat.wav")
        .then(async (response) => {
          setAudioData(await response.arrayBuffer());
          setLoading(false);
        })
        .catch((e) => {
          console.error(e);
          setError(true);
        });
    }
  }, [audioContext, audioData]);

  const startLoop = () => {
    if (audioSource) {
      // stop and disconnect the current audio source
      // if one exists
      audioSource.stop();
      audioSource.disconnect();
    }

    if (audioData && audioContext && gain) {
      audioContext
        .decodeAudioData(copyArraybuffer(audioData))
        .then((buffer) => {
          const source = audioContext.createBufferSource();
          // connect the source to the gain node
          gain.gain.setValueAtTime(0, audioContext.currentTime);

          source.connect(gain);
          source.buffer = buffer;
          source.loop = true;
          source.start();
          gain.gain.linearRampToValueAtTime(1, audioContext.currentTime + 2);
          setAudioSource(source);
          setPlaying(true);
        })
        .catch((e) => {
          console.error(e);
          setError(true);
        });
    }
  };

  const stopLoop = () => {
    if (audioSource && gain && audioContext) {
      gain.gain.linearRampToValueAtTime(0.01, audioContext.currentTime + 1.5);
      setTimeout(() => {
        audioSource.stop();
        audioSource.disconnect();
      }, 2000);

      setPlaying(false);
    }
  };

  return {
    startLoop,
    stopLoop,
    loading,
    playing,
    error,
  };
};
