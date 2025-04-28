interface RightEditPageProps {
  pdfURL: string;
  title: string;
}
const RightEditPage: React.FC<RightEditPageProps> = ({ title, pdfURL }) => {
  return (
    <div className="flex flex-col items-center rounded-2xl h-screen p-2  bg-[#1A1F2C] border border-white/30 shadow-lg overflow-hidden">
      <p className="text-xl">{title}</p>
      <div className="relative w-full h-full rounded-xl overflow-hidden shadow-inner bg-[#121621]">
        <iframe
          src={`https://docs.google.com/gview?url=${encodeURIComponent(
            pdfURL
          )}&embedded=true`}
          className="w-full h-full"
        ></iframe>
      </div>
    </div>
  );
};

export default RightEditPage;
