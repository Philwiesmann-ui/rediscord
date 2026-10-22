"use client";
import Avatar from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { readIconFile } from "@/lib/utils/image";
import React from "react";

interface ServerIconPickerProps {
  name: string;
  photo: string;
  onChange: (photo: string) => void;
}

/*
 * One server icon with two ways to set it: a file from the computer (scaled
 * down and stored as a data URL) or an image URL.
 */
export default function ServerIconPicker({
  name,
  photo,
  onChange,
}: ServerIconPickerProps) {
  const [error, setError] = React.useState("");
  const isUpload = photo.startsWith("data:");

  const handleFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) {
      return;
    }
    try {
      onChange(await readIconFile(file));
      setError("");
    } catch {
      setError("That file could not be used as a server icon.");
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase text-gray-400">
        Server icon (optional)
      </span>
      <div className="flex items-center gap-3">
        <Avatar size="lg" src={isUpload ? photo : null} alt={name || "icon"} />
        <div className="flex flex-col items-start gap-1">
          <label className="cursor-pointer rounded bg-gray-800 px-3 py-1.5 text-xs font-semibold text-gray-100 transition-colors hover:bg-gray-700">
            Upload image
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
          </label>
          {photo && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="text-xs text-gray-400 transition-colors hover:text-gray-200"
            >
              Remove icon
            </button>
          )}
        </div>
      </div>
      <Input
        className="mt-1 text-sm normal-case text-gray-100"
        placeholder="or paste an image URL"
        value={isUpload ? "" : photo}
        onChange={(event) => onChange(event.target.value)}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  );
}
