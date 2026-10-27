import { useEffect, useRef } from "react";
// import { ArrowRight } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useState } from "react";
import Dropdown from "./Dropdown";
import { Typography } from "@material-ui/core";
//


// ...
const MenuItems = ({ items, depthLevel }) => {
  const [dropdown, setDropdown] = useState(false);



  let ref = useRef();

  useEffect(() => {
    const handler = (event) => {
      if (dropdown && ref.current && !ref.current.contains(event.target)) {
        setDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [dropdown]);

  const onMouseEnter = () => {
    window.innerWidth > 960 && setDropdown(true);
  };

  const onMouseLeave = () => {
    window.innerWidth > 960 && setDropdown(false);
  };

  return (
    <li className="menu-items" ref={ref} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      {items.submenu ? (
        <>
          <button
            // component="button"
            className="button-menu"
            aria-haspopup="menu"
            aria-expanded={dropdown ? "true" : "false"}
            onClick={() => {
              setDropdown((prev) => !prev);
            }}
          >
            <Typography>
              <span style={{ paddingRight: 8 }}>{items.Icon}</span> {items.title}{" "}
              {depthLevel > 0 ? <span>&raquo;</span> : <span className="arrow" />}
            </Typography>
          </button>
          <Dropdown depthLevel={depthLevel} submenus={items.submenu} dropdown={dropdown} />
        </>
      ) : (
        <button component="button" className="button-menu">
          <Typography component={Link} to={items.to}>
            <span style={{ paddingRight: 8 }}>{items.Icon}</span> <span>{items.title}</span>
          </Typography>
        </button>
      )}
    </li>
  );
};

export default MenuItems;
