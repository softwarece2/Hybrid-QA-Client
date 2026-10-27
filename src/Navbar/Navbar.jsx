import { useMenuItem } from "./menuItems";
import MenuItem from "./MenuItem";

const Navbar = () => {
  const menuList = useMenuItem();

  return (
    <ul className="menus">
      {menuList.map((menu, index) => {
        const depthLevel = 0;
        return <MenuItem items={menu} key={index} depthLevel={depthLevel} />;
      })}
    </ul>
  );
};

export default Navbar;
