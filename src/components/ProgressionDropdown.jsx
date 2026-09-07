import { Pencil } from "lucide-react";
import Dropdown from "./Dropdown";
import { dropdownStyles } from "../styles/styles";

export default function ProgressionDropdown({
  value,
  options,
  displayLabel = "full",
  theme,
  onChange,
}) {
  function getBadgeLabel(progression) {
    if (!progression) return "";

    return displayLabel === "full"
      ? progression.label
      : `${progression.label?.charAt(0)}${progression.position}`;
  }

  return (
    <Dropdown
      value={value}
      options={options}
      onChange={onChange}
      getOptionValue={(option) => option.id}
      className=""
      dropdownClassName={`
        ${dropdownStyles.menu}
        left-22 top-1/2 -translate-y-1/2
        w-full min-w-28
      `}
      renderTrigger={({ selected, open }) => (
        <div
          className={`
            ${theme.badgeColor}
            relative overflow-hidden
            rounded-l-xl rounded-br-xl
            px-2 my-1 rounded
            text-white
            flex items-center justify-between gap-1
            transition-all duration-150
            ${open ? "ring-1 ring-purple-300/60" : ""}
          `}
        >
          <span className="absolute inset-0 bg-black/30 pointer-events-none" />

          <span className="relative z-10 truncate text-left select-none">
            {getBadgeLabel(selected)}
          </span>

          <span className="relative z-10 flex items-center shrink-0">
            <Pencil
              size={12}
              className={`
                transition-transform
                duration-150
                ${open ? "-rotate-135" : ""}
              `}
            />
          </span>
        </div>
      )}
      renderOption={({ option, selected }) => (
        <div
          className={`
            ${dropdownStyles.option}
            ${
              selected
                ? dropdownStyles.hover
                : dropdownStyles.selected
            }
          `}
        >
          {option.label}
        </div>
      )}
    />
  );
}
