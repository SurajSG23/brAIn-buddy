import LeftEditPage from './LeftEditPage'
import RightEditPage from './RightEditPage'

const EditPage = () => {
  return (
    <div className='flex flex-row w-full justify-evenly items-center text-white gap-1 max-[850px]:flex-col'>
      <LeftEditPage/>
      <RightEditPage/>
    </div>
  )
}

export default EditPage
