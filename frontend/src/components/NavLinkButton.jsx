import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function NavLinkButton({ to, label, admin }) {
  const path = useLocation().pathname;
  const active = path === to;

  return (
    <Link
      to={to}
      style={{ textDecoration: "none" }}
      className={`
        px-4 py-2 rounded-xl font-semibold transition-all
        shadow-sm hover:shadow-md duration-200
        ${admin ? "bg-yellow-400 text-black" : "bg-gray-200 dark:bg-gray-700"}
        ${active ? "ring-2 ring-blue-500 scale-105" : "opacity-90 hover:opacity-100"}
        text-gray-900 dark:text-gray-200
      `}
    >
      {label}
    </Link>
  );
}
