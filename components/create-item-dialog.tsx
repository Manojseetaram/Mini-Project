"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CreateItemDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (name: string) => void
  type: "file" | "folder"
  parentName?: string
}


export function CreateItemDialog({ isOpen, onClose, onConfirm, type, parentName }: CreateItemDialogProps) {
  const [name, setName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onConfirm(name.trim())
      setName("")
      onClose()
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-lg shadow-lg p-6 w-96 max-w-[90vw]">
        <h2 className="text-lg font-semibold mb-4">
          Create New {type === "file" ? "File" : "Folder"}
          {parentName && <span className="text-sm font-normal text-muted-foreground block">in {parentName}</span>}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <Label htmlFor="item-name">{type === "file" ? "File" : "Folder"} Name</Label>
              <Input
                id="item-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={type === "file" ? "example.tsx" : "folder-name"}
                autoFocus
                className="mt-1"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!name.trim()}>
                Create {type === "file" ? "File" : "Folder"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
