import { NavLink } from "react-router-dom";
import { useState } from "react";

function NavItem({ text, route, svg }) {
  return (
    <NavLink to={route}>
      {({ isActive }) => (
        <div className={`${isActive ? "bg-emerald-50" : ""} w-full px-4 py-3 rounded-xl`}>
            <div className={`${isActive ? "filter-[invert(37%)_sepia(33%)_saturate(1263%)_hue-rotate(115deg)_brightness(86%)_contrast(102%)]" : "text-zinc-500"} flex gap-3`}>
                {svg}
                {text}
            </div>
        </div>
      )}
    </NavLink>
  );
}
export default NavItem;
