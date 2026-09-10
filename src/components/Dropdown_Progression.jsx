import { Pencil } from "lucide-react";
import Dropdown from "./Dropdown";
import { dropdownStyles } from "../styles/styles";

export default function Dropdown_Progression({
  value,
  options,
  displayLabel,
  theme,
  onChange,
}) {
  function getBadgeLabel(progression) {
    if (!progression) return "";

    const defaultIsFull =
      progression.label === "Intro" || progression.label === "Final";

    const isFull =
      displayLabel != null ? displayLabel === "full" : defaultIsFull;

    if (isFull) {
      return progression.label;
    }

    const match = progression.label?.match(/\d+$/);
    const number = match?.[0];

    const first = progression.label?.charAt(0).toUpperCase() ?? "";

    return number ? `${first}${number}` : `\u00A0${first}\u00A0`;
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
        left-full -top-0.25
        w-full min-w-28 z-70
      `}
      renderTrigger={({ selected, open }) => (
        <div
          className={`
            ${theme.badgeColor}
            relative overflow-hidden
            rounded-l-xl rounded-br-xl
            px-2 my-1
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
            ${selected ? dropdownStyles.hover : dropdownStyles.selected}
          `}
        >
          {option.label}
        </div>
      )}
    />
  );
}
