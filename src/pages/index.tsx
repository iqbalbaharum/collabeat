import GenericButton from 'components/Button/GenericButton'
import { PlayIcon } from 'components/Icons/icons'
import SearchInput from 'components/Input/Search'
import MusicItem from 'components/MusicItem'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const json = [
  {
    name: 'CB #1',
    owner: '0x41871CD045BdB7c64F8B97b88500E829c8b8a859',
  },
  {
    name: 'CB #2',
    owner: '0x41871CD045BdB7c64F8B97b88500E829c8b8a859',
  },
  {
    name: 'CB #3',
    owner: '0x41871CD045BdB7c64F8B97b88500E829c8b8a859',
  },
  {
    name: 'CB #4',
    owner: '0x41871CD045BdB7c64F8B97b88500E829c8b8a859',
  },
]
const PageIndex = () => {
  const [data, setData] = useState(json)

  return (
    <>
      <div className="w-4/5 mx-auto">
        <SearchInput />
        <div className="mt-5 w-full">
          <div className="mt-5 mb-2 border border-gray-700 rounded-md px-4 py-2.5 bg-white/10 backdrop-blur">
            <div className="flex gap-2 items-center">
              <h3 className="text-gray-400 text-sm mr-4">Filter</h3>
              <GenericButton name="Top Beat" onClick={() => {}} />
              <GenericButton name="New Beat" onClick={() => {}} />
            </div>
          </div>
          <div className="w-full flex flex-col gap-2">
            {data.map(d => (
              <MusicItem beat={d} />
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default PageIndex
