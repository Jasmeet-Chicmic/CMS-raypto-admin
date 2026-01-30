"use client";

import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { RayptoLogo, RayptoLogoDark } from "@/assets";
import { cn } from "@/shared/utils";

import { NavItem, navItems } from "./helpers/constants";
import { useTheme } from "next-themes";
import { THEME_TYPE } from "@/shared/constants";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("language");
  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleExpand = (label: string) =>
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));

  // Auto-expand parents if any children are active
  useEffect(() => {
    const autoExpanded: Record<string, boolean> = {};

    const checkAndExpand = (
      items: NavItem[],
      parentChain: string[] = [],
    ): boolean => {
      let foundActive = false;

      for (const item of items) {
        if (item.children) {
          const childActive = checkAndExpand(item.children, [
            ...parentChain,
            item.label,
          ]);
          if (childActive) {
            autoExpanded[item.label] = true;
            parentChain.forEach((label) => {
              autoExpanded[label] = true;
            });
            foundActive = true;
          }
        } else if (
          item.activePaths?.some((path) => pathname.startsWith(path))
        ) {
          foundActive = true;
        }
      }

      return foundActive;
    };

    checkAndExpand(navItems);
    setExpanded(autoExpanded);
    setMounted(true);
  }, [pathname]);

  const renderNavItem = (item: NavItem, depth = 0): React.ReactNode => {
    const isItemActive = (navItem: NavItem): boolean => {
      if (
        navItem.activePaths?.some((path) =>
          path === "/" ? pathname === "/" : pathname.startsWith(path),
        )
      ) {
        return true;
      }
      return navItem.children?.some((child) => isItemActive(child)) || false;
    };

    const isActive = isItemActive(item);
    const isExpandable = item.children && item.children.length > 0;
    const paddingLeft = depth * 16 + 16;
    const Icon = item.icon;

    return (
      <li className="mb-5" key={item.label}>
        {item.path && !isExpandable ? (
          <Link
            href={item.path}
            className={cn(
              "flex items-center px-3 py-3 rounded-[5px] sub-menu-item transition-all duration-200 group",
              isActive
                ? "  sub-menu-item-active"
                : "hover:bg-none hover:text-sidebartext dark:hover:bg-none dark:hover:text-sidebarlinkhovercolor",
            )}
            style={{ paddingLeft }}
            onClick={() => setIsOpen(false)}
          >
            <span
              className={`mr-3 list-item-icon transition-transform duration-200 w-[10px] h-[10px] rounded-full ${isActive ? "bg-primarycolor dark:bg-secondarycolor" : "border-none bg-sidebarlinkcolor "}`}
            ></span>
            <span
              className={cn(
                "flex-1 list-item-text text-[16px] font-medium transition-colors duration-200",
                isActive
                  ? "text-primarycolor hover:text-primarycolor dark:text-secondarycolor dark:hover:text-secondarycolor"
                  : "text-sidebarlinkcolor hover:text-sidebartext dark:text-sidebarlinkcolor dark:hover:text-sidebarlinkhovercolor",
              )}
            >
              {t(item.label)}
            </span>
            {item.badge && (
              <span className="ml-2 px-2 py-1 text-[0.875] font-bold rounded-full bg-bgblue text-white">
                {item.badge}
              </span>
            )}
          </Link>
        ) : (
          <button
            type="button"
            className={cn(
              "group flex items-center px-3 py-3 rounded-[5px] cursor-pointer sidebar-menu-item w-full text-left transition-all duration-200 hover:bg-none dark:hover:bg-none",
              isActive &&
                "bg-transparent hover:bg-sidebarhoverbgcolor dark:hover:bg-none",
            )}
            style={{ paddingLeft }}
            onClick={() => toggleExpand(item.label)}
          >
            <span className="mr-3 transition-transform duration-200">
              {Icon && (
                <Icon
                  size={24}
                  className={cn(
                    "transition-colors duration-200",
                    isActive
                      ? "text-primarycolor dark:text-secondarycolor"
                      : "text-sidebarlinkcolor",
                    "group-hover:text-white",
                  )}
                />
              )}
            </span>
            <span
              className={cn(
                "flex-1 text-[16px] font-medium transition-colors duration-200",
                isActive
                  ? "text-primarycolor dark:text-secondarycolor"
                  : "text-sidebarlinkcolor",
                "group-hover:text-white",
              )}
            >
              {t(item.label)}
            </span>
            {/* {item.badge && (
              <span className="ml-2 px-2 py-1 text-[0.875rem] font-bold rounded-full bg-bgblue text-bgwhite">
                {item.badge}
              </span>
            )} */}
            {isExpandable && (
              <div className="ml-2 transition-transform duration-200">
                {expanded[item.label] ? (
                  <ChevronDown
                    size={16}
                    className={cn(
                      "transition-colors duration-200",
                      isActive
                        ? "text-primarycolor dark:text-secondarycolor"
                        : "text-sidebarlinkcolor",
                      "group-hover:text-white",
                    )}
                  />
                ) : (
                  <ChevronRight
                    size={16}
                    className={cn(
                      "transition-colors duration-200",
                      isActive
                        ? "text-primarycolor dark:text-secondarycolor"
                        : "text-sidebarlinkcolor",
                      "group-hover:text-white",
                    )}
                  />
                )}
              </div>
            )}
          </button>
        )}
        {isExpandable && expanded[item.label] && (
          <ul className="mt-1 space-y-1">
            {item.children?.map((child) => renderNavItem(child, depth + 1))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-bgwhite shadow-lg lg:hidden hover:bg-gray-50 transition-colors duration-200"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 bgbgblack bg-opacity-50 z-40 lg:hidden transition-opacity duration-300 cursor-default"
          onClick={toggleSidebar}
          aria-label="Close sidebar"
          tabIndex={-1}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-72 transform transition-all duration-300 ease-in-out bg-bgprimary dark:bg-darkbgprimary",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Logo */}
        <div className="p-[20px_26px_18px]">
          <div className="flex items-center justify-start">
            {/* <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Zap size={20} className="text-bgwhite" />
            </div>
            <h1 className="text-xl font-bold textbgblack dark:text-sidebartext">
              Raypto
            </h1> */}
            <Image
              src={
                !mounted
                  ? RayptoLogo.src
                  : resolvedTheme === THEME_TYPE.DARK
                    ? RayptoLogo.src
                    : RayptoLogoDark.src
              }
              width={164}
              height={52}
              alt="logo"
              className="max-h-20 max-w-max"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-9 py-4 h-[calc(100vh-128px)] overflow-y-auto custom-scrollbar ">
          <ul className="">{navItems.map((item) => renderNavItem(item))}</ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
