"use client";
import { clsx } from "@/lib/utils";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  "aria-label"?: string;
}

export default function Switch({
  checked,
  onCheckedChange,
  disabled,
  ...props
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={clsx(
        "relative h-6 w-10 flex-none rounded-full transition-colors",
        checked ? "bg-primary" : "bg-gray-600",
        disabled
          ? "cursor-not-allowed opacity-50"
          : checked
            ? "hover:bg-[#4751be]"
            : "hover:bg-gray-500",
      )}
      {...props}
    >
      <span
        className={clsx(
          "absolute top-1 h-4 w-4 rounded-full bg-white transition-all",
          checked ? "left-5" : "left-1",
        )}
      />
    </button>
  );
}
