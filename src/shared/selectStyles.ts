import { StylesConfig } from "react-select";

export const getColorScheme = (isPositive: boolean, isDark: boolean) => {
  if (isPositive) {
    return isDark
      ? {
          background: "#064e3b",
          border: "#065f46",
          hoverBorder: "#059669",
          text: "#34d399",
          optionSelected: "#064e3b",
          optionFocused: "#065f46",
          optionActive: "#065f46",
        }
      : {
          background: "#f0fdf4",
          border: "#bbf7d0",
          hoverBorder: "#86efac",
          text: "#15803d",
          optionSelected: "#f0fdf4",
          optionFocused: "#f0fdf4",
          optionActive: "#dcfce7",
        };
  }

  return isDark
    ? {
        background: "#7f1d1d",
        border: "#991b1b",
        hoverBorder: "#dc2626",
        text: "#f87171",
        optionSelected: "#7f1d1d",
        optionFocused: "#991b1b",
        optionActive: "#991b1b",
      }
    : {
        background: "#fef2f2",
        border: "#fecaca",
        hoverBorder: "#fca5a5",
        text: "#b91c1c",
        optionSelected: "#fef2f2",
        optionFocused: "#fef2f2",
        optionActive: "#fee2e2",
      };
};

export const getStatusSelectStyles = (
  isPositive: boolean,
  isDark: boolean,
): StylesConfig<{ value: boolean; label: string }, false> => {
  const colors = getColorScheme(isPositive, isDark);
  const neutralTextColor = isDark ? "#9ca3af" : "#374151";
  const menuBorder = isDark ? "#374151" : "#e5e7eb";
  const menuBackground = isDark ? "#111827" : "white";

  return {
    control: (provided) => ({
      ...provided,
      minHeight: "32px",
      height: "32px",
      fontSize: "12px",
      borderRadius: "9999px",
      backgroundColor: colors.background,
      borderColor: colors.border,
      boxShadow: "none",
      "&:hover": {
        borderColor: colors.hoverBorder,
      },
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: "0 12px",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: colors.text,
      fontWeight: "600",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: "0 8px 0 0",
      color: colors.text,
      "&:hover": {
        color: colors.text,
      },
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    menu: (provided) => ({
      ...provided,
      borderRadius: "12px",
      overflow: "hidden",
      border: `1px solid ${menuBorder}`,
      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
      backgroundColor: menuBackground,
    }),
    option: (provided, state) => {
      const optionValue = (state.data as { value: boolean })?.value;
      const optionColors = getColorScheme(optionValue, isDark);

      let backgroundColor = "transparent";
      let textColor = neutralTextColor;

      if (state.isSelected) {
        backgroundColor = optionColors.optionSelected;
        textColor = optionColors.text;
      } else if (state.isFocused) {
        backgroundColor = optionColors.optionFocused;
        textColor = optionColors.text;
      }

      return {
        ...provided,
        backgroundColor,
        color: textColor,
        fontSize: "12px",
        cursor: "pointer",
        "&:active": {
          backgroundColor: optionColors.optionActive,
        },
      };
    },
  };
};
