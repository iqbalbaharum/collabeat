import { PlayerState, Sheet } from 'lib';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner, PlayIcon, StopIcon } from 'components/Icons/icons';
import BufferWaveform from 'components/Waveform/BufferWaveForm';

interface MusicCardProp {
  name: String;
  description: String;
  sheet: Sheet;
  version: String,
  audioUrls: Array<string>;
  onHandleShareClicked: (datakey: string) => void;
  onHandlePlayClicked: (dataKey: string) => void;
  updatePlayerState: (dataKey: string, state: PlayerState) => void;
  audioState: {
    [key: string]: PlayerState;
  };
  mixedAudio?: AudioBuffer;
}

const MusicCard = (prop: MusicCardProp) => {
  
  const navigate = useNavigate()

  function setButtonIcon(state: PlayerState) {
    switch (state) {
      case PlayerState.LOADING:
        return <LoadingSpinner />;
      case PlayerState.PLAY:
        return <StopIcon />;
      default:
        return <PlayIcon />;
    }
  }

  return (
    <>
      <div className="bg-red-900 rounded-lg px-4 py-2 text-white w-full">
        <div className="flex justify-between">
          <div className="">
            <p className="text-left text-base font-semibold text-[#F6F8FF]">{`Collabeat #${prop.version}`}</p>
            {/* <p className="text-left text-xs text-[#F6F8FF]">
              Started by <span className="text-[#FFE331]">{shortenAddress(prop.sheet.owner.toString())}</span>
            </p> */}
          </div>
          <button
            onClick={() => prop.onHandlePlayClicked(prop.sheet.data_key.toString())}
            className="cursor-pointer rounded-full border border-[#232323] bg-black p-2 md:hover:scale-105"
          >
            {setButtonIcon(prop.audioState[prop.sheet.data_key.toString()])}
          </button>
        </div>

        <div className="mt-4 flex items-center">
          {prop.mixedAudio ? (
            <BufferWaveform
              buffer={prop.mixedAudio}
              playerState={prop.audioState[prop.sheet.data_key.toString()]}
              onFinish={() => prop.updatePlayerState(prop.sheet.data_key.toString(), PlayerState.PAUSED)}
              isHidden={true}
            />
          ) : (
            <></>
          )}
        </div>

        <div className="z-10 flex w-full items-center justify-between gap-2 py-2">
          <button
            onClick={e => navigate(`/editor/${prop.sheet.data_key}`)}
            className="flex cursor-pointer flex-row items-center justify-center gap-2 rounded-3xl bg-[#ff00ae] px-3 py-1 md:hover:scale-105"
          >
            <span>Collaborate</span>
          </button>
          <button
            className="rounded-full bg-[#d000ff] p-1 md:hover:scale-105"
            type="button"
            onClick={() => prop.onHandleShareClicked(`${prop.sheet.data_key}`)}
          >
            <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="#fff">
              <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
              <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
              <g id="SVGRepo_iconCarrier">
                <path
                  d="M9.42857 12.875L14.5714 16.8125M14.5714 7.625L9.42857 11.125M6 12.0357V11.9643C6 11.0175 6.76751 10.25 7.71429 10.25C8.66106 10.25 9.42857 11.0175 9.42857 11.9643V12.0357C9.42857 12.9825 8.66106 13.75 7.71429 13.75C6.76751 13.75 6 12.9825 6 12.0357ZM14.5714 6.78571V6.71429C14.5714 5.76751 15.3389 5 16.2857 5C17.2325 5 18 5.76751 18 6.71429V6.78571C18 7.73249 17.2325 8.5 16.2857 8.5C15.3389 8.5 14.5714 7.73249 14.5714 6.78571ZM14.5714 17.2857V17.2143C14.5714 16.2675 15.3389 15.5 16.2857 15.5C17.2325 15.5 18 16.2675 18 17.2143V17.2857C18 18.2325 17.2325 19 16.2857 19C15.3389 19 14.5714 18.2325 14.5714 17.2857Z"
                  stroke="#fff"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </g>
            </svg>
          </button>
        </div>
      </div>
    </>
  );
};

export default MusicCard;
