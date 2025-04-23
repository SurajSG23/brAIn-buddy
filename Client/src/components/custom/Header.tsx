const Header = () => {
  return (
    <header className="flex justify-between items-center bg-[#08090c] w-full p-3">
      <div className="flex items-center justify-center">
        <img src="favicon.png" alt="" width={35}/>
        <img src="logo.png" alt="" width={200}/>
      </div>
    </header>
  );
};

export default Header;
