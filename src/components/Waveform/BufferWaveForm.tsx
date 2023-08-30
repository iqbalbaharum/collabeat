import { PlayerState } from 'lib';
import { useEffect, useRef } from 'react';
import classNames from 'classnames';
import { MutedSpeakerIcon, UnmutedSpeakerIcon } from 'components/Icons/icons';

interface BufferWaveformProps {
  buffer: AudioBuffer;
  playerState: PlayerState;
  isMuted?: boolean;
  isSelecting?: boolean;
  isSelected?: boolean;
  onToggleSound?: (muted: boolean) => void;
  onFinish?: () => void;
  onSelectButtonClicked?: () => void;
  isHidden?: boolean;
}

const BufferWaveform: React.FC<BufferWaveformProps> = ({
  buffer,
  playerState,
  isMuted,
  onToggleSound,
  onFinish,
  isSelecting,
  isSelected,
  onSelectButtonClicked,
  isHidden,
}) => {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadWaveSurfer = async () => {
      if (typeof window === 'undefined') {
        return;
      }

      const { default: WaveSurfer } = await import('wavesurfer.js');

      if (isMounted && waveformRef.current) {
        wavesurferRef.current = WaveSurfer.create({
          container: waveformRef.current,
          waveColor: 'white',
          progressColor: 'red',
          backend: 'WebAudio',
          hideCursor: true,
          normalize: true,
          height: 35,
          barHeight: 10,
          barWidth: 4,
          minPxPerSec: 8,
          fillParent: false,
          scrollParent: false,
        });
        wavesurferRef.current.loadDecodedBuffer(buffer);

        wavesurferRef.current.on('ready', () => {
          switch (playerState) {
            case PlayerState.PLAY:
              wavesurferRef.current?.play();
              break;
            case PlayerState.PAUSED:
              if (wavesurferRef.current?.isPlaying) {
                wavesurferRef.current?.pause();
              }
              break;
            case PlayerState.STOP:
            default:
              wavesurferRef.current?.stop();
              break;
          }
        });

        wavesurferRef.current.on('finish', () => {
          if (onFinish) {
            onFinish();
          }
        });

        wavesurferRef.current.fireEvent('ready');
      }
    };

    (async () => {
      await loadWaveSurfer();
    })
    

    return () => {
      isMounted = false;
      wavesurferRef.current?.destroy();
    };
  }, [playerState]);

  return (
    <div
      className={classNames('flex items-center justify-between', {
        hidden: isHidden,
      })}
    >
      <div ref={waveformRef} />
      {!isSelecting && isSelecting !== undefined && (
        <button className="rounded-full" onClick={() => onToggleSound?.(!isMuted)}>
          {isMuted && <MutedSpeakerIcon />}
          {!isMuted && <UnmutedSpeakerIcon />}
        </button>
      )}
      {isSelecting && isSelecting !== undefined && (
        <button
          className={classNames('rounded-sm px-4 py-2 text-black', {
            'bg-yellow-500': !isSelected,
            'bg-green-500': isSelected,
          })}
          onClick={() => {
            if (onSelectButtonClicked) {
              onToggleSound?.(true);
              onSelectButtonClicked();
            }
          }}
        >
          {!isSelected ? 'Select' : 'Unselect'}
        </button>
      )}
    </div>
  );
};

export default BufferWaveform;
