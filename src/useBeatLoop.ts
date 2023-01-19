import React, { useState, useEffect, useRef, useCallback } from "react";
const copyArrayBuffer = (input: ArrayBuffer) => {
  let output = new ArrayBuffer(input.byteLength);
  new Uint8Array(output).set(new Uint8Array(input));
  return output;
};
export const useBeatLoop = () => {
  const [loading, setLoading] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  const audioSource = useRef<AudioBufferSourceNode | null>(null);
  const gain = useRef<GainNode | null>(null);
  const audioData = useRef<ArrayBuffer | null>(null);
  const audioContext = useRef<AudioContext | null>(null);

  // Fetch the audio file when the component is mounted
  useEffect(() => {
    fetch("/beat.wav")
      .then(async (response) => {
        audioData.current = await response.arrayBuffer();
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
        setError(true);
      });
  }, []);

  const startLoop = useCallback(() => {
    // create audio context and gain node when the user starts
    if (audioContext.current === null) {
      audioContext.current = new window.AudioContext();
      gain.current = audioContext.current.createGain();
      gain.current.connect(audioContext.current.destination);
    }
    // Stop and disconnect the current audio source, if re-trying
    if (audioSource.current) {
      audioSource.current.stop();
      audioSource.current.disconnect();
    }
    // all audio things set, then go ahead and start
    if (audioData.current && audioContext.current && gain.current) {
      audioContext.current
        .decodeAudioData(copyArrayBuffer(audioData.current))
        .then((buffer) => {
          if (audioData.current && audioContext.current && gain.current) {
            const source = audioContext.current.createBufferSource();
            gain.current.gain.setValueAtTime(
              0,
              audioContext.current.currentTime
            );
            source.connect(gain.current);
            source.buffer = buffer;
            source.loop = true;
            source.start();
            gain.current.gain.linearRampToValueAtTime(
              0.5,
              audioContext.current.currentTime + 2
            );
            audioSource.current = source;
            setPlaying(true);
          }
        })
        .catch((e) => {
          console.error(e);
          setError(true);
        });
    }
  }, []);

  const stopLoop = useCallback(() => {
    if (audioSource.current && gain.current && audioContext.current) {
      gain.current.gain.linearRampToValueAtTime(
        0.01,
        audioContext.current.currentTime + 1.5
      );
      setTimeout(() => {
        if (audioSource.current) {
          audioSource.current.stop();
          audioSource.current.disconnect();
        }
      }, 2000);
      setPlaying(false);
    }
  }, []);

  return {
    startLoop,
    stopLoop,
    loading,
    playing,
    error,
  };
};
