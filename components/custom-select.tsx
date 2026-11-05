"use client";

import { useState, useRef, useEffect, useId, useCallback } from "react";
import { ChevronDownIcon, CheckIcon } from "./icons";

export type SelectOption = {
  value: string;
  label: string;
  sublabel?: string;
};

export type CustomSelectProps = {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  "aria-label"?: string;
  className?: string;
  menuClassName?: string;
  size?: "sm" | "md";
  align?: "left" | "right";
  disabled?: boolean;
};

export function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Chọn...",
  id,
  "aria-label": ariaLabel,
  className = "",
  menuClassName = "",
  size = "md",
  align = "left",
  disabled = false,
}: CustomSelectProps) {
  const generatedId = useId();
  const selectId = id || generatedId;
  const listboxId = `${selectId}-listbox`;

  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Sync highlighted item with current selected value when opened
  useEffect(() => {
    if (isOpen) {
      const idx = options.findIndex((opt) => opt.value === value);
      setHighlightedIndex(idx >= 0 ? idx : 0);
    }
  }, [isOpen, options, value]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (isOpen && listRef.current && highlightedIndex >= 0) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement;
      if (item) {
        item.scrollIntoView({ block: "nearest" });
      }
    }
  }, [isOpen, highlightedIndex]);

  // Click outside listener
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleClickOutside);
    return () => {
      document.removeEventListener("pointerdown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = useCallback(
    (val: string) => {
      onChange(val);
      setIsOpen(false);
      triggerRef.current?.focus();
    },
    [onChange]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (isOpen) {
          if (highlightedIndex >= 0 && highlightedIndex < options.length) {
            handleSelect(options[highlightedIndex].value);
          }
        } else {
          setIsOpen(true);
        }
        break;

      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) =>
            prev < options.length - 1 ? prev + 1 : 0
          );
        }
        break;

      case "ArrowUp":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : options.length - 1
          );
        }
        break;

      case "Home":
        if (isOpen) {
          e.preventDefault();
          setHighlightedIndex(0);
        }
        break;

      case "End":
        if (isOpen) {
          e.preventDefault();
          setHighlightedIndex(options.length - 1);
        }
        break;

      case "Escape":
        if (isOpen) {
          e.preventDefault();
          setIsOpen(false);
          triggerRef.current?.focus();
        }
        break;

      case "Tab":
        if (isOpen) {
          setIsOpen(false);
        }
        break;
    }
  };

  const isSmall = size === "sm";

  return (
    <div
      ref={containerRef}
      className={`relative inline-block text-left ${className}`}
    >
      <button
        ref={triggerRef}
        id={selectId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-label={ariaLabel}
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        className={`group inline-flex w-full items-center justify-between gap-2.5 rounded border border-line bg-panel font-medium text-panel-ink outline-none transition-all duration-150 hover:border-line-accent hover:bg-soft focus-visible:border-ink ${
          isSmall ? "px-2.5 py-1 text-[13px]" : "px-3 py-1.5 text-[14px]"
        } ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <span className="truncate flex items-baseline gap-1.5 text-left">
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
          {selectedOption?.sublabel && (
            <span className="text-[12px] font-normal text-muted truncate">
              ({selectedOption.sublabel})
            </span>
          )}
        </span>
        <ChevronDownIcon
          className={`shrink-0 text-muted transition-transform duration-200 group-hover:text-panel-ink ${
            isSmall ? "h-3.5 w-3.5" : "h-4 w-4"
          } ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          aria-label={ariaLabel}
          className={`custom-scrollbar absolute top-full z-50 mt-1 max-h-60 w-max min-w-full max-w-[calc(100vw-2rem)] overflow-y-auto rounded border border-line bg-panel p-1 text-panel-ink shadow-2xl backdrop-blur-md outline-none animate-in fade-in zoom-in-95 duration-100 ${
            align === "right" ? "right-0" : "left-0"
          } ${menuClassName}`}
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isHighlighted = index === highlightedIndex;

            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(option.value)}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`flex w-full items-center justify-between gap-3 rounded px-2.5 py-1.5 text-left transition-colors cursor-pointer select-none ${
                  isSmall ? "text-[12px] sm:text-[13px]" : "text-[13px] sm:text-[14px]"
                } ${
                  isSelected
                    ? "font-semibold text-ink bg-soft"
                    : isHighlighted
                    ? "bg-soft text-panel-ink"
                    : "text-panel-ink"
                }`}
              >
                <div className="flex items-baseline gap-1.5 truncate">
                  <span>{option.label}</span>
                  {option.sublabel && (
                    <span
                      className={`text-[11px] sm:text-[12px] font-normal ${
                        isSelected ? "text-ink/70" : "text-muted"
                      }`}
                    >
                      ({option.sublabel})
                    </span>
                  )}
                </div>

                {isSelected && (
                  <CheckIcon className="h-3.5 w-3.5 shrink-0 text-ink" />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
