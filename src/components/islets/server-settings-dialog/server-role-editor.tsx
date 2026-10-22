"use client";
import { Input } from "@/components/ui/input";
import TabGroupButton from "@/components/ui/tab-group/tab-group-button";
import Switch from "@/components/ui/switch";
import { ServerRole } from "@/lib/entities/server";
import { clsx } from "@/lib/utils";
import { PERMISSION_GROUPS, ROLE_COLORS } from "@/lib/utils/permissions";
import React from "react";
import { BsTrash } from "react-icons/bs";

type EditorTab = "display" | "permissions";

const HEX_COLOR = /^#?[0-9a-fA-F]{6}$/;

interface ServerRoleEditorProps {
  role: ServerRole;
  /* The @everyone role keeps its name and colour and cannot be deleted. */
  isDefault: boolean;
  onUpdate: (patch: Partial<ServerRole>) => void;
  onDelete: () => void;
}

export default function ServerRoleEditor({
  role,
  isDefault,
  onUpdate,
  onDelete,
}: ServerRoleEditorProps) {
  const [tab, setTab] = React.useState<EditorTab>("display");
  const [hexDraft, setHexDraft] = React.useState(role.color);

  const handleHexChange = (value: string) => {
    setHexDraft(value);
    if (HEX_COLOR.test(value)) {
      onUpdate({ color: value.startsWith("#") ? value : `#${value}` });
    }
  };

  const togglePermission = (key: string, checked: boolean) => {
    onUpdate({
      permissions: checked
        ? [...role.permissions, key]
        : role.permissions.filter((permission) => permission !== key),
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="truncate text-base font-semibold text-gray-100">
          {role.name}
        </h3>
        {!isDefault && (
          <button
            type="button"
            onClick={onDelete}
            aria-label={`Delete role ${role.name}`}
            className="flex flex-none items-center gap-1 rounded px-2 py-1 text-xs text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <BsTrash fontSize={14} />
            Delete role
          </button>
        )}
      </div>

      <div className="flex gap-2">
        <TabGroupButton
          active={tab === "display"}
          onClick={() => setTab("display")}
        >
          Display
        </TabGroupButton>
        <TabGroupButton
          active={tab === "permissions"}
          onClick={() => setTab("permissions")}
        >
          Permissions
        </TabGroupButton>
      </div>

      {tab === "display" ? (
        <div className="flex flex-col gap-6">
          <label className="flex flex-col gap-1 text-xs font-semibold uppercase text-gray-400">
            Role name
            <Input
              aria-label="Role name"
              className="mt-1 text-sm normal-case text-gray-100 disabled:opacity-60"
              value={role.name}
              disabled={isDefault}
              onChange={(event) => onUpdate({ name: event.target.value })}
            />
          </label>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase text-gray-400">
              Role colour
            </span>
            <p className="text-xs text-gray-400">
              Members with this role get this colour in the member list.
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={isDefault}
                onClick={() => {
                  setHexDraft("");
                  onUpdate({ color: "" });
                }}
                aria-label="Default role colour"
                className={clsx(
                  "h-6 w-6 rounded-full border border-dashed border-gray-500 transition-transform",
                  !role.color && "ring-2 ring-primary",
                  !isDefault && "hover:scale-110",
                )}
              />
              {ROLE_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  disabled={isDefault}
                  onClick={() => {
                    setHexDraft(color);
                    onUpdate({ color });
                  }}
                  aria-label={`Role colour ${color}`}
                  style={{ backgroundColor: color }}
                  className={clsx(
                    "h-6 w-6 rounded-full transition-transform",
                    role.color === color && "ring-2 ring-primary",
                    !isDefault && "hover:scale-110",
                  )}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                aria-label="Custom role colour"
                disabled={isDefault}
                value={role.color || "#99aab5"}
                onChange={(event) => {
                  setHexDraft(event.target.value);
                  onUpdate({ color: event.target.value });
                }}
                className="h-8 w-10 cursor-pointer rounded border border-gray-700 bg-transparent p-0.5 disabled:cursor-not-allowed"
              />
              <Input
                aria-label="Role colour hex"
                className="max-w-[140px] text-sm text-gray-100 disabled:opacity-60"
                placeholder="#99aab5"
                value={hexDraft}
                disabled={isDefault}
                onChange={(event) => handleHexChange(event.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <label className="flex items-start justify-between gap-4">
              <span className="flex flex-col">
                <span className="text-sm text-gray-100">
                  Display role members separately from online members
                </span>
                <span className="text-xs text-gray-400">
                  Members with this role show up in their own group.
                </span>
              </span>
              <Switch
                aria-label="Display role members separately"
                checked={role.hoist}
                onCheckedChange={(checked) => onUpdate({ hoist: checked })}
              />
            </label>
            <label className="flex items-start justify-between gap-4">
              <span className="flex flex-col">
                <span className="text-sm text-gray-100">
                  Allow anyone to @mention this role
                </span>
                <span className="text-xs text-gray-400">
                  Everyone in this server can mention the role.
                </span>
              </span>
              <Switch
                aria-label="Allow anyone to mention this role"
                checked={role.mentionable}
                onCheckedChange={(checked) =>
                  onUpdate({ mentionable: checked })
                }
              />
            </label>
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          {PERMISSION_GROUPS.map((group) => (
            <div key={group.label} className="mb-5">
              <p className="mb-1 text-xs font-semibold uppercase text-gray-400">
                {group.label}
              </p>
              <div className="flex flex-col divide-y divide-white/5">
                {group.permissions.map((permission) => (
                  <div
                    key={permission.key}
                    className="flex items-start justify-between gap-4 py-3"
                  >
                    <span className="flex flex-col">
                      <span className="text-sm text-gray-100">
                        {permission.label}
                      </span>
                      <span className="text-xs text-gray-400">
                        {permission.description}
                      </span>
                    </span>
                    <Switch
                      aria-label={permission.label}
                      checked={role.permissions.includes(permission.key)}
                      onCheckedChange={(checked) =>
                        togglePermission(permission.key, checked)
                      }
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
