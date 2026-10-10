import { BookOpen, Calendar, Compass, GraduationCap, HandHeart, History, Map, Users, type LucideIcon } from 'lucide-react'

// Um componente para cada nome aceito em ICONES_GUIA (src/lib/guias.ts).
const ICONES: Record<string, LucideIcon> = {
  map: Map,
  'graduation-cap': GraduationCap,
  'hand-heart': HandHeart,
  compass: Compass,
  history: History,
  'book-open': BookOpen,
  users: Users,
  calendar: Calendar,
}

export function IconeGuia({ icone, className }: { icone: string; className?: string }) {
  const Icone = ICONES[icone] ?? BookOpen
  return <Icone className={className} aria-hidden />
}
