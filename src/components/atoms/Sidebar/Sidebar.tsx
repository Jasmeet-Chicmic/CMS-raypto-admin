"use client";

import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { RayptoLogo } from "@/assets";
import { cn } from "@/shared/utils";

import { NavItem, navItems } from "./helpers/constants";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
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
              "flex items-center px-3 py-3 rounded-[5px] sub-menu-item transition-all duration-200 group hover:bg-[#f4f7fe] hover:text-[#a3aed0] dark:text-white dark:hover:bg-gray-700 dark:hover:text-white",
              isActive &&
                "bg-[#EEF2FF] active:bg-[#EEF2FF] dark:bg-[#EEF2FF] sub-menu-item-active hover:text-white dark:hover:bg-[#d5dcf1]",
            )}
            style={{ paddingLeft }}
            onClick={() => setIsOpen(false)}
          >
            <span
              className={`mr-3 list-item-icon transition-transform duration-200 w-[10px] h-[10px] rounded-full
                ${isActive ? "bg-[#4F46E5] dark:bg-[#4F46E5]" : "border-none dark:border-none"}`}
            ></span>
            <span
              className={`flex-1 list-item-text text-[16px] font-medium ${isActive ? "text-[#4F46E5]" : "text-[#A3AED0] dark:text-white"}`}
            >
              {t(item.label)}
            </span>
            {item.badge && (
              <span className="ml-2 px-2 py-1 text-[0.875] font-bold rounded-full bg-red-500 text-white">
                {item.badge}
              </span>
            )}
          </Link>
        ) : (
          <button
            type="button"
            className={cn(
              "flex items-center px-3 py-3 rounded-[5px] cursor-pointer hover:bg-[#f4f7fe] hover:text-[#a3aed0] transition-all duration-200 group dark:text-white dark:hover:bg-gray-700 dark:hover:text-white sidebar-menu-item w-full text-left",
              isActive &&
                "bg-[#4F46E5] text-white hover:bg-[#4F46E5] hover:text-white",
            )}
            style={{ paddingLeft }}
            onClick={() => toggleExpand(item.label)}
          >
            <span className="mr-3 transition-transform duration-200">
              {Icon && (
                <Icon
                  size={24}
                  className={isActive ? "text-white" : "text-[#A3AED0]"}
                />
              )}
            </span>
            <span
              className={`flex-1 text-[16px] font-medium ${isActive ? "text-white" : "text-[#A3AED0] dark:text-white"}`}
            >
              {t(item.label)}
            </span>
            {item.badge && (
              <span className="ml-2 px-2 py-1 text-[0.875] font-bold rounded-full bg-red-500 text-white">
                {item.badge}
              </span>
            )}
            {isExpandable && (
              <div className="ml-2 transition-transform duration-200">
                {expanded[item.label] ? (
                  <ChevronDown
                    size={16}
                    className={isActive ? "text-white" : "text-gray-400"}
                  />
                ) : (
                  <ChevronRight
                    size={16}
                    className={isActive ? "text-white" : "text-gray-400"}
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
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-lg lg:hidden hover:bg-gray-50 transition-colors duration-200"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300 cursor-default"
          onClick={toggleSidebar}
          aria-label="Close sidebar"
          tabIndex={-1}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-72 transform transition-all duration-300 ease-in-out bg-white dark:bg-gray-900",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Logo */}
        <div className="p-[40px_36px_28px] border-b-[1px] border-[#E5E7EB] dark:border-gray-700">
          <div className="flex items-center justify-start">
            {/* <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Zap size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-black dark:text-white">
              Raypto
            </h1> */}
            <Image src={RayptoLogo.src} width={164} height={52} alt="logo" />
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
