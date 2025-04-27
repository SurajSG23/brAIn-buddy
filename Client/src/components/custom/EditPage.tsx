import LeftEditPage from "./LeftEditPage";
import RightEditPage from "./RightEditPage";

const EditPage = () => {
  return (
    <div className="flex flex-row w-full justify-evenly items-center text-white gap-1 max-[850px]:flex-col">
      <div className="w-[50%] max-[850px]:w-full">
        <LeftEditPage />
      </div>
      <div className="w-[50%] max-[850px]:w-full">
        <RightEditPage />
      </div>
    </div>
  );
};

export default EditPage;
