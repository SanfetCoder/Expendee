const NavPage = ({iconName, children}) => {
  return (
    <div className="bottom-nav_page w-max flex flex-col items-center">
      <div className="flex flex-row items-center justify-center text-xl">
        <ion-icon name={iconName}></ion-icon>
      </div>
      <p className="bottom-nav_page__children text-gray-400">{children}</p>
    </div>
  )
};

export default NavPage;