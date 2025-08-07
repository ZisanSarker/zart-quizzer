"use client"

import { Button } from "@/components/ui/button"
import { GradientButton } from "@/components/ui/gradient-button"
import { Check, Loader2 } from "lucide-react"

interface ProfileFormActionsProps {
  isSaving: boolean
  onSave: () => Promise<boolean>
  onCancel: () => void
}

export function ProfileFormActions({ isSaving, onSave, onCancel }: ProfileFormActionsProps) {
  const handleSave = async () => {
    const success = await onSave()
    if (success) {
      onCancel()
    }
  }

  return (
    <div className="flex justify-end">
      <Button variant="outline" onClick={onCancel} className="mr-2">
        Cancel
      </Button>
      <GradientButton onClick={handleSave} disabled={isSaving}>
        {isSaving ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
          </>
        ) : (
          <>
            <Check className="mr-2 h-4 w-4" /> Save Changes
          </>
        )}
      </GradientButton>
    </div>
  )
} 