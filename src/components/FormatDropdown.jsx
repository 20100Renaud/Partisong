import { ChevronDown } from "lucide-react";
import Dropdown from "./Dropdown";
import { dropdownStyles, ui } from "../styles/styles";

export default function FormatDropdown({
  value,
  options,
  onChange,
  onApply,
  getOptionValue = (option) => option.value,
  renderValue,
  renderOption,
  className = "",
}) {
  return (
    <div className={`relative flex h-6 ${className}`}>
      {/* APPLY SELECTED FORMAT */}
      <button
        type="button"
        title="Appliquer la mise en forme"
        onMouseDown={(e) => {
          e.preventDefault();
          onApply();
        }}
        className={`
          ${ui.buttonSm}
          w-7 h-6
          !rounded-l-sm
          !rounded-r-none
          border-r-0
        `}
      >
        {renderValue(
          options.find((option) => getOptionValue(option) === value),
        )}
      </button>

      {/* FORMAT DROPDOWN */}
      <Dropdown
        value={value}
        options={options}
        onChange={onChange}
        getOptionValue={getOptionValue}
        className="h-6 w-4"
        triggerClassName={`
          ${ui.buttonSm}
          w-4 h-6 px-0
          !rounded-r-sm
          !rounded-l-none
        `}
        dropdownClassName={`
          ${dropdownStyles.menu}
          top-full left-0 w-32
        `}
        renderTrigger={({ open }) => (
          <ChevronDown
            size={12}
            className={`
                transition-transform
                duration-150
                ${open ? "rotate-180" : ""}
              `}
          />
        )}
        renderOption={({ option, selected }) => (
          <div
            className={`
              ${dropdownStyles.option}
              flex items-center gap-2
              ${
                selected
                  ? dropdownStyles.optionSelected
                  : dropdownStyles.optionDefault
              }
            `}
          >
            {renderOption(option)}
          </div>
        )}
      />
    </div>
  );
}
