import { useEffect, useRef, useState } from "react";

export default function Dropdown({
  value,
  options,
  onChange,
  getOptionValue = (option) => option.value,
  renderTrigger,
  renderOption,
  className = "",
  dropdownClassName = "",
  triggerClassName = "",
  align = "left",
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  // CLOSE ON CLICK OUTSIDE
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const selected = options.find((option) => getOptionValue(option) === value);

  function handleSelect(option) {
    onChange(getOptionValue(option));
    setOpen(false);
  }

  return (
    <div ref={containerRef} className={`relative z-50 ${className}`}>
      {/* TRIGGER */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full ${triggerClassName}`}
      >
        {renderTrigger({
          selected,
          open,
        })}
      </button>

      {/* DROPDOWN */}
      {open && (
        <div
          className={`
            absolute z-[999] mt-1
            ${align === "right" ? "right-0" : "left-0"}
            ${dropdownClassName}
          `}
        >
          {options.map((option) => {
            const optionValue = getOptionValue(option);

            return (
              <button
                key={optionValue}
                type="button"
                onClick={() => handleSelect(option)}
                className="w-full text-left"
              >
                {renderOption({
                  option,
                  selected: optionValue === value,
                })}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
