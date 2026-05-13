import type { TeamMember } from "@/types/association"

/**
 * Rôles reconnus pour la grille bureau publique (libellés issus de `Role.labelFr` / seed).
 * Ordre des tests : du plus spécifique au plus général.
 */
type BureauRoleKind =
  | "president"
  | "vicePresident"
  | "treasurer"
  | "assistantTreasurer"
  | "secretary"
  | "assistantSecretary"
  | "other"

export interface TeamHierarchyBands {
  /** Une seule fiche en tête (le premier par `order` si plusieurs qualifiés). */
  president: TeamMember | undefined
  /** Jusqu’à 2 vice-présidents, triés par `order`. */
  vicePresidents: TeamMember[]
  /** Trésorier puis adjoint (max 2 visibles, tri par type puis `order`). */
  treasury: TeamMember[]
  /** Secrétaire puis adjoint (max 2 visibles). */
  secretary: TeamMember[]
  /** Rôle non reconnu ou places déjà occupées sur la grille stricte. */
  overflow: TeamMember[]
}

/**
 * Chaîne normalisée pour comparaison (minuscules, sans accents ni ponctuation).
 */
function normalizeRoleLabel(role: string): string {
  return role
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^a-z]/g, "")
}

/**
 * Classe le libellé de rôle affiché côté API (ex. « Vice-président(e) »).
 */
export function classifyBureauRoleKind(role: string): BureauRoleKind {
  const n = normalizeRoleLabel(role)

  if (n.includes("vice") && n.includes("presid")) {
    return "vicePresident"
  }
  if (n.includes("presid")) {
    return "president"
  }
  if (n.includes("tresor") && (n.includes("adjoint") || n.includes("adj"))) {
    return "assistantTreasurer"
  }
  if (n.includes("tresor")) {
    return "treasurer"
  }
  if (n.includes("secret") && (n.includes("adjoint") || n.includes("adj"))) {
    return "assistantSecretary"
  }
  if (n.includes("secret")) {
    return "secretary"
  }

  return "other"
}

function sortByOrderThenName(a: TeamMember, b: TeamMember): number {
  if (a.order !== b.order) return a.order - b.order
  return a.name.localeCompare(b.name, "fr", { sensitivity: "base" })
}

function treasurySortKey(m: TeamMember): number {
  const k = classifyBureauRoleKind(m.role)
  if (k === "treasurer") return 0
  if (k === "assistantTreasurer") return 1
  return 9
}

function secretarySortKey(m: TeamMember): number {
  const k = classifyBureauRoleKind(m.role)
  if (k === "secretary") return 0
  if (k === "assistantSecretary") return 1
  return 9
}

/**
 * Répartit les membres visibles en bandes fixes : président, 2 VP, trésorerie (2) et secrétariat (2)
 * — l’UI affiche ces quatre postes sur une seule rangée (ordre : trésorier, adjoint, secrétaire, adjoint).
 */
export function partitionTeamByHierarchy(members: readonly TeamMember[]): TeamHierarchyBands {
  const sorted = [...members].sort(sortByOrderThenName)

  const buckets: Record<BureauRoleKind, TeamMember[]> = {
    president: [],
    vicePresident: [],
    treasurer: [],
    assistantTreasurer: [],
    secretary: [],
    assistantSecretary: [],
    other: [],
  }

  for (const m of sorted) {
    const kind = classifyBureauRoleKind(m.role)
    buckets[kind].push(m)
  }

  const overflow: TeamMember[] = []

  const president =
    buckets.president.length > 0 ? buckets.president[0] : undefined
  if (buckets.president.length > 1) {
    overflow.push(...buckets.president.slice(1))
  }

  const vicePresidents = buckets.vicePresident.slice(0, 2)
  if (buckets.vicePresident.length > 2) {
    overflow.push(...buckets.vicePresident.slice(2))
  }

  const treasuryCandidates: TeamMember[] = [
    ...buckets.treasurer,
    ...buckets.assistantTreasurer,
  ].sort((a, b) => {
    const ra = treasurySortKey(a)
    const rb = treasurySortKey(b)
    if (ra !== rb) return ra - rb
    return sortByOrderThenName(a, b)
  })

  const treasury = treasuryCandidates.slice(0, 2)
  if (treasuryCandidates.length > 2) {
    overflow.push(...treasuryCandidates.slice(2))
  }

  const secretaryCandidates: TeamMember[] = [
    ...buckets.secretary,
    ...buckets.assistantSecretary,
  ].sort((a, b) => {
    const ra = secretarySortKey(a)
    const rb = secretarySortKey(b)
    if (ra !== rb) return ra - rb
    return sortByOrderThenName(a, b)
  })

  const secretary = secretaryCandidates.slice(0, 2)
  if (secretaryCandidates.length > 2) {
    overflow.push(...secretaryCandidates.slice(2))
  }

  overflow.push(...buckets.other)

  return {
    president,
    vicePresidents,
    treasury,
    secretary,
    overflow: overflow.sort(sortByOrderThenName),
  }
}
