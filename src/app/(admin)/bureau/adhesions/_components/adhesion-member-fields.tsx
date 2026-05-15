"use client"

import { Plus, Trash2 } from "lucide-react"
import { z } from "zod"

import type { Member } from "@/app/(public)/adhesion/_schemas/adhesion.schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/helpers/utils"

interface AdhesionMemberFieldsProps {
  readonly members: Member[]
  readonly message: string
  readonly onMembersChange: (members: Member[]) => void
  readonly onMessageChange: (message: string) => void
  readonly className?: string
}

function isValidFrenchPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s/g, "")
  return /^(?:(?:\+|00)33|0)[1-9](?:[0-9]{2}){4}$/.test(cleaned)
}

function isValidEmail(email: string): boolean {
  if (!email || email.trim() === "") return true
  return z.string().email().safeParse(email).success
}

function canAddMemberRow(members: Member[]): boolean {
  const last = members[members.length - 1]
  if (!last) return false
  return (
    last.firstName.trim().length > 0 &&
    last.lastName.trim().length > 0 &&
    isValidFrenchPhone(last.phone.replace(/\s/g, "")) &&
    isValidEmail(last.email ?? "")
  )
}

/**
 * Champs adhérent(s) + message optionnel (formulaire bureau).
 */
export function AdhesionMemberFields({
  members,
  message,
  onMembersChange,
  onMessageChange,
  className,
}: AdhesionMemberFieldsProps) {
  const canAdd = canAddMemberRow(members)

  function updateField(index: number, field: keyof Member, value: string) {
    onMembersChange(
      members.map((member, i) =>
        i === index ? { ...member, [field]: value } : member,
      ),
    )
  }

  function addRow() {
    if (!canAdd) return
    onMembersChange([
      ...members,
      { firstName: "", lastName: "", email: "", phone: "" },
    ])
  }

  function removeRow(index: number) {
    if (members.length <= 1) return
    onMembersChange(members.filter((_, i) => i !== index))
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-3">
        {members.map((member, index) => (
          <div
            key={index}
            className="grid gap-3 rounded-lg border border-border/60 bg-muted/20 p-3 sm:grid-cols-2"
          >
            <div className="space-y-1.5">
              <Label htmlFor={`adhesion-firstName-${index}`}>Prénom</Label>
              <Input
                id={`adhesion-firstName-${index}`}
                value={member.firstName}
                onChange={(e) => updateField(index, "firstName", e.target.value)}
                autoComplete="given-name"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`adhesion-lastName-${index}`}>Nom</Label>
              <Input
                id={`adhesion-lastName-${index}`}
                value={member.lastName}
                onChange={(e) => updateField(index, "lastName", e.target.value)}
                autoComplete="family-name"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`adhesion-phone-${index}`}>Téléphone</Label>
              <Input
                id={`adhesion-phone-${index}`}
                value={member.phone}
                onChange={(e) => updateField(index, "phone", e.target.value)}
                inputMode="tel"
                autoComplete="tel"
                placeholder="06 12 34 56 78"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor={`adhesion-email-${index}`}>Email (optionnel)</Label>
              <Input
                id={`adhesion-email-${index}`}
                type="email"
                value={member.email ?? ""}
                onChange={(e) => updateField(index, "email", e.target.value)}
                autoComplete="email"
              />
            </div>
            {members.length > 1 ? (
              <div className="flex items-end justify-end sm:col-span-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-destructive hover:text-destructive"
                  onClick={() => removeRow(index)}
                  aria-label={`Retirer l'adhérent ${index + 1}`}
                >
                  <Trash2 className="size-4" />
                  Retirer
                </Button>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full sm:w-auto"
        disabled={!canAdd}
        onClick={addRow}
      >
        <Plus className="size-4" />
        Ajouter une personne
      </Button>

      <div className="space-y-1.5">
        <Label htmlFor="adhesion-message">Message (optionnel)</Label>
        <Textarea
          id="adhesion-message"
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          rows={3}
          placeholder="Note interne ou message pour l'équipe…"
          className="resize-none"
        />
      </div>
    </div>
  )
}