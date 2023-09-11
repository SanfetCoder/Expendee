const NavPage = ({iconName, children, onClick}) => {
  return (
    <div
      onClick={onClick}
     className="bottom-nav_page cursor-pointer w-max flex flex-col items-center">
      <div className="flex flex-row items-center justify-center text-xl">
        <ion-icon name={iconName}></ion-icon>
      </div>
      <p className="bottom-nav_page__children text-gray-400">{children}</p>
    </div>
  )
};

export default NavPage;