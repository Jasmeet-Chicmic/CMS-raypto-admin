"use client";

import { Circle, Command, LucideProps, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

import { NavItem, navItems } from "../Sidebar/helpers/constants";

type CommandItem = {
  id: string;
  title: string;
  subtitle?: string;
  icon:
    | React.ForwardRefExoticComponent<
        Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
      >
    | undefined;
  action: () => void;
  category: string;
  keywords?: string[];
  shortcut?: string;
};

type CommandPaletteProps = {
  isOpen: boolean;
  onClose: () => void;
};

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const generateNavCommands = (
    items: NavItem[],
    parentPath = "",
  ): CommandItem[] => {
    const commands: CommandItem[] = [];

    items.forEach((item) => {
      // Add parent item if it has a path
      if (item.path) {
        commands.push({
          id: `nav-${item.path}`,
          title: parentPath ? `${parentPath} ${item.label}` : item.label,
          subtitle: parentPath ? `${parentPath} > ${item.label}` : item.label,
          icon: item.icon,
          category: "Navigation",
          action: () => router.push(item.path!),
          keywords: [item.label.toLowerCase(), "navigate", "go to"],
        });
      }

      // Add children recursively
      if (item.children) {
        const childPath = parentPath
          ? `${parentPath} > ${item.label}`
          : item.label;
        commands.push(...generateNavCommands(item.children, childPath));
      }
    });

    return commands;
  };
  const commands: CommandItem[] = generateNavCommands(navItems);

  const filteredCommands = commands.filter((command) => {
    if (!searchQuery) return true;

    const query = searchQuery.toLowerCase();
    const titleMatch = command.title.toLowerCase().includes(query);
    const subtitleMatch = command.subtitle?.toLowerCase().includes(query);
    const keywordMatch = command.keywords?.some((keyword) =>
      keyword.toLowerCase().includes(query),
    );

    return titleMatch || subtitleMatch || keywordMatch;
  });

  const groupedCommands = filteredCommands.reduce(
    (acc, command) => {
      if (!acc[command.category]) {
        acc[command.category] = [];
      }
      acc[command.category].push(command);
      return acc;
    },
    {} as Record<string, CommandItem[]>,
  );

  const allFilteredCommands = Object.values(groupedCommands).flat();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < allFilteredCommands.length - 1 ? prev + 1 : 0,
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : allFilteredCommands.length - 1,
          );
          break;
        case "Enter":
          e.preventDefault();
          if (allFilteredCommands[selectedIndex]) {
            allFilteredCommands[selectedIndex].action();
            onClose();
          }
          break;
        case "Escape":
          onClose();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, selectedIndex, allFilteredCommands, onClose]);

  if (!isOpen) return null;

  return (
    <button
      type="button"
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-[9999] flex items-center justify-center cursor-default"
      onClick={onClose}
      aria-label="Close command palette"
    >
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4 max-h-[70vh] overflow-hidden dark:bg-gray-800">
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-gray-200">
          <Search className="text-gray-400 mr-3" size={20} />
          <input
            ref={inputRef}
            type="text"
            placeholder="Type a command or search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 outline-none text-gray-900 placeholder-gray-500 bg-transparent py-2 px-3 rounded-lg mr-2 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
          />
          <div className="flex items-center space-x-1 text-[0.875] text-gray-400">
            <kbd className="px-2 py-1 bg-gray-100 rounded text-[0.875] dark:bg-gray-700 dark:text-white">
              ESC
            </kbd>
          </div>
        </div>

        {/* Commands List */}
        <div className="overflow-y-auto max-h-96">
          {Object.keys(groupedCommands).length === 0 ? (
            <div className="px-4 py-8 text-center text-gray-500 dark:text-white">
              <Search
                className="mx-auto mb-3 text-gray-300 dark:text-white"
                size={48}
              />
              <p className="text-gray-500 dark:text-white">No commands found</p>
              <p className="text-sm text-gray-500 dark:text-white">
                Try searching for something else
              </p>
            </div>
          ) : (
            Object.entries(groupedCommands).map(
              ([category, categoryCommands]) => (
                <div key={category}>
                  <div className="px-4 py-2 text-[0.875] font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 border-b border-gray-100 dark:bg-gray-700 dark:text-white">
                    {category}
                  </div>
                  {categoryCommands.map((command) => {
                    const globalIndex = allFilteredCommands.indexOf(command);
                    const Icon = command.icon;
                    return (
                      <button
                        type="button"
                        key={command.id}
                        className={`flex items-center px-4 py-3 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 w-full text-left`}
                        onClick={() => {
                          command.action();
                          onClose();
                        }}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                      >
                        <div className={`mr-3  "text-gray-400"`}>
                          {Icon ? (
                            <Icon size={20} className="text-gray-400" />
                          ) : (
                            <Circle size={10} className="text-gray-400 mr-2" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div
                            className={`font-medium text-gray-900 dark:text-white`}
                          >
                            {command.title}
                          </div>
                          {command.subtitle && (
                            <div className="text-sm text-gray-500 truncate dark:text-gray-400">
                              {command.subtitle}
                            </div>
                          )}
                        </div>
                        {command.shortcut && (
                          <div className="ml-3">
                            <kbd className="px-2 py-1 bg-gray-100 rounded text-[0.875] text-gray-600 dark:bg-gray-700 dark:text-white">
                              {command.shortcut}
                            </kbd>
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              ),
            )
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-200 bg-gray-50 dark:bg-gray-700">
          <div className="flex items-center justify-between text-[0.875rem] text-[#A3AED0] dark:text-white">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-[0.875] dark:bg-gray-700 dark:text-white">
                  ↑↓
                </kbd>
                <span>Navigate</span>
              </div>
              <div className="flex items-center space-x-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-[0.875] dark:bg-gray-700 dark:text-white">
                  ↵
                </kbd>
                <span>Select</span>
              </div>
              <div className="flex items-center space-x-1">
                <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-[0.875] dark:bg-gray-700 dark:text-white">
                  ESC
                </kbd>
                <span>Close</span>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Command size={12} />
              <span>Command Palette</span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
};

export default CommandPalette;
