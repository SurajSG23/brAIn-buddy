const RightEditPage = () => {
  const pdfUrl = "https://ik.imagekit.io/zva0kgwne/pdfs/Suraj_Resume_pdf_X72t6Ta-b";

  return (
    <div className="flex flex-col items-center rounded-2xl h-screen p-4 gap-4 bg-[#1A1F2C] border border-white/30 shadow-lg overflow-hidden">
      <div className="relative w-full h-full rounded-xl overflow-hidden shadow-inner bg-[#121621]">
        <iframe 
          src={`https://docs.google.com/gview?url=${encodeURIComponent(pdfUrl)}&embedded=true`}
          className="w-full h-full"
        ></iframe>
      </div>
    </div>
  );
};

export default RightEditPage;