"use client";
import { clsx } from "@/lib/utils";
import { ListedServer, ServerRole } from "@/lib/entities/server";
import { getServerRoles, isEveryoneRole } from "@/lib/utils/permissions";
import { useServerStore } from "@/state/server-list";
import React from "react";
import { BsPlus } from "react-icons/bs";
import ServerRoleEditor from "./server-role-editor";

const createRoleId = (serverId: string) =>
  `${serverId}-role-${Math.random().toString(36).slice(2, 8)}`;

export default function ServerSettingsRoles({
  server,
}: {
  server: ListedServer;
}) {
  const updateServer = useServerStore((state) => state.updateServer);
  const roles = getServerRoles(server);
  const [selectedRoleId, setSelectedRoleId] = React.useState<string | null>(
    null,
  );

  const selectedRole =
    roles.find((role) => role.id === selectedRoleId) ?? roles[0];

  const saveRoles = (nextRoles: ServerRole[]) =>
    updateServer(server.id, { roles: nextRoles });

  const updateRole = (roleId: string, patch: Partial<ServerRole>) =>
    saveRoles(
      roles.map((role) => (role.id === roleId ? { ...role, ...patch } : role)),
    );

  const handleCreateRole = () => {
    const role: ServerRole = {
      id: createRoleId(server.id),
      name: "new role",
      color: "",
      hoist: false,
      mentionable: false,
      permissions: [],
    };
    saveRoles([...roles, role]);
    setSelectedRoleId(role.id);
  };

  const handleDeleteRole = (roleId: string) => {
    saveRoles(roles.filter((role) => role.id !== roleId));
    setSelectedRoleId(null);
  };

  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <div className="flex flex-none flex-col md:w-56">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase text-gray-400">
            Roles — {roles.length}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCreateRole}
          className="mb-2 flex items-center justify-center gap-1 rounded bg-primary px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#4751be]"
        >
          <BsPlus fontSize={16} />
          Create role
        </button>
        <ul className="flex flex-col gap-1">
          {roles.map((role) => (
            <li key={role.id}>
              <button
                type="button"
                onClick={() => setSelectedRoleId(role.id)}
                className={clsx(
                  "flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm transition-colors",
                  selectedRole?.id === role.id
                    ? "bg-gray-700/60 text-gray-100"
                    : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200",
                )}
              >
                <span
                  className="h-3 w-3 flex-none rounded-full border border-white/10"
                  style={{
                    backgroundColor: role.color || "rgb(153 170 181)",
                  }}
                />
                <span className="truncate">{role.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="min-w-0 flex-1 md:border-l md:border-white/10 md:pl-6">
        {selectedRole ? (
          <ServerRoleEditor
            key={selectedRole.id}
            role={selectedRole}
            isDefault={isEveryoneRole(selectedRole)}
            onUpdate={(patch) => updateRole(selectedRole.id, patch)}
            onDelete={() => handleDeleteRole(selectedRole.id)}
          />
        ) : (
          <p className="text-sm text-gray-400">This server has no roles yet.</p>
        )}
      </div>
    </div>
  );
}
