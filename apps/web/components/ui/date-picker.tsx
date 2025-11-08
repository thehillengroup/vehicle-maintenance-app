import { forwardRef, useEffect, useMemo, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { format, parseISO } from "date-fns";
import clsx from "clsx";

import "react-datepicker/dist/react-datepicker.css";

type AllowedValue = string | null | undefined;

interface DatePickerProps {
  name: string;
  defaultValue?: AllowedValue;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  onValueChange?: (value: string | null) => void;
}

const DateInput = forwardRef<HTMLInputElement, { value?: string; onClick?: () => void; placeholder?: string; disabled?: boolean }>(
  ({ value, onClick, placeholder, disabled }, ref) => (
    <input
      ref={ref}
      onClick={onClick}
      value={value ?? ""}
      placeholder={placeholder}
      readOnly
      disabled={disabled}
      className={clsx(
        "w-full cursor-pointer rounded-lg border border-border py-2 pl-3 pr-9 text-sm text-ink shadow-sm outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-200 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-ink-muted",
      )}
    />
  ),
);

DateInput.displayName = "DateInput";

export const DatePicker = ({
  name,
  defaultValue,
  placeholder,
  required,
  disabled,
  minDate,
  maxDate,
  className,
  onValueChange,
}: DatePickerProps) => {
  const initialDate = useMemo(() => {
    if (!defaultValue) return null;
    try {
      return parseISO(defaultValue);
    } catch {
      return null;
    }
  }, [defaultValue]);

  const [selected, setSelected] = useState<Date | null>(initialDate);

  useEffect(() => {
    if (typeof onValueChange === "function") {
      onValueChange(selected ? format(selected, "yyyy-MM-dd") : null);
    }
  }, [selected, onValueChange]);

  return (
    <div className={clsx("relative", className)}>
      <ReactDatePicker
        selected={selected}
        onChange={(date) => setSelected(date)}
        customInput={<DateInput placeholder={placeholder} disabled={disabled} />}
        dateFormat="yyyy-MM-dd"
        placeholderText={placeholder}
        disabled={disabled}
        minDate={minDate}
        maxDate={maxDate}
        calendarClassName="vm-datepicker"
        popperClassName="vm-datepicker-popper"
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        scrollableYearDropdown
        yearDropdownItemNumber={20}
        dayClassName={(date) =>
          clsx(
            "vm-datepicker-day",
            selected && format(selected, "yyyy-MM-dd") === format(date, "yyyy-MM-dd") && "vm-datepicker-day--selected",
          )
        }
      />
      <input
        type="hidden"
        name={name}
        value={selected ? format(selected, "yyyy-MM-dd") : ""}
        required={required}
      />
    </div>
  );
};
