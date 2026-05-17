import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { IconMail, IconPhone } from "@tabler/icons-react"
import {
  MEMBRES_TABLE_HEADER,
  MEMBRES_TABLE_ROW,
  MEMBRES_TABLE_WRAPPER,
} from "./membres-list-layout"

export interface MembresBenevoleRow {
  id: string
  firstName: string
  lastName: string
  email: string | null
  phone: string | null
  image: string | null
  showOnSite: boolean
}

interface MembresBenevolesTableProps {
  rows: MembresBenevoleRow[]
}

function initials(firstName: string, lastName: string) {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase()
}

/** Liste des bénévoles — contact, téléphone, email. */
export function MembresBenevolesTable({ rows }: MembresBenevolesTableProps) {
  if (rows.length === 0) return null

  return (
    <div className={MEMBRES_TABLE_WRAPPER}>
      <div className="min-w-0">
        <div className={MEMBRES_TABLE_HEADER}>
          <span>Bénévole</span>
          <span className="hidden sm:block">Téléphone</span>
          <span className="hidden sm:block">Email</span>
        </div>

        <div className="divide-y divide-border/60">
          {rows.map((person) => {
            const fullName = `${person.firstName} ${person.lastName}`

            return (
              <div key={person.id} className={MEMBRES_TABLE_ROW}>
                <div className="flex min-w-0 items-center gap-3.5">
                  <div className="relative size-9 shrink-0">
                    <Avatar className="size-9 ring-2 ring-border/40">
                      <AvatarImage
                        src={person.image ?? ""}
                        alt={fullName}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-violet-100 to-violet-200 text-xs font-bold text-violet-800 dark:from-violet-900/40 dark:to-violet-800/40 dark:text-violet-300">
                        {initials(person.firstName, person.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <span
                      className={`absolute bottom-0 right-0 size-2.5 rounded-full ring-2 ring-background shadow-sm ${person.showOnSite ? "bg-emerald-400" : "bg-muted-foreground/30"}`}
                      title={
                        person.showOnSite ? "Visible sur le site" : "Masqué du site"
                      }
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">
                      {fullName}
                    </p>
                    {person.phone && (
                      <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground sm:hidden">
                        <IconPhone className="size-3 shrink-0" />
                        {person.phone}
                      </p>
                    )}
                    {person.email && (
                      <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground sm:hidden">
                        <IconMail className="size-3 shrink-0" />
                        {person.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="hidden min-w-0 sm:flex sm:items-center sm:gap-1.5 sm:text-sm sm:text-foreground/80">
                  {person.phone ? (
                    <>
                      <IconPhone className="size-3.5 shrink-0 text-muted-foreground" />
                      <span className="truncate">{person.phone}</span>
                    </>
                  ) : (
                    <span className="text-muted-foreground/40">—</span>
                  )}
                </div>

                <div className="hidden min-w-0 sm:flex sm:items-center sm:gap-1.5 sm:text-sm">
                  {person.email ? (
                    <>
                      <IconMail className="size-3.5 shrink-0 text-muted-foreground" />
                      <span className="truncate text-foreground/80">{person.email}</span>
                    </>
                  ) : (
                    <span className="text-muted-foreground/40">—</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
