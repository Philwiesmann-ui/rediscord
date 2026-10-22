"use client";
import ServerIconPicker from "@/components/islets/server-icon-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ListedServer } from "@/lib/entities/server";
import { useServerStore } from "@/state/server-list";
import React from "react";

interface ServerIconDialogProps {
  server: ListedServer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/*
 * Radix unmounts the dialog content while it is closed, so the form is mounted
 * fresh on every open and the draft icon always starts from the saved one.
 */
function ServerIconForm({
  server,
  onClose,
}: {
  server: ListedServer;
  onClose: () => void;
}) {
  const updateServer = useServerStore((state) => state.updateServer);
  const [photo, setPhoto] = React.useState(server.photo);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    updateServer(server.id, { photo: photo.trim() });
    onClose();
  };

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Server icon</DialogTitle>
        <DialogDescription className="text-gray-400">
          Pick an image for {server.name}.
        </DialogDescription>
      </DialogHeader>
      <ServerIconPicker name={server.name} photo={photo} onChange={setPhoto} />
      <DialogFooter>
        <button
          type="button"
          onClick={onClose}
          className="rounded px-3 py-2 text-sm text-gray-300 hover:bg-gray-800"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded bg-primary px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary/80"
        >
          Save icon
        </button>
      </DialogFooter>
    </form>
  );
}

export default function ServerIconDialog({
  server,
  open,
  onOpenChange,
}: ServerIconDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showClose className="border-[1px] border-gray-800">
        <ServerIconForm
          key={`${server.id}-${server.photo}`}
          server={server}
          onClose={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
