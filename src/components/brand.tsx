import { Link } from '@tanstack/react-router';
import mark from '@/assets/finquest-mark.png';
export function Brand({ compact=false }: { compact?: boolean }) {
 return <Link to="/" className="inline-flex items-center gap-2.5 font-semibold text-foreground" aria-label="FinQuest home">
  <img src={mark} width={816} height={816} alt="" className="size-9 object-contain" />
  {!compact && <span className="text-lg">Fin<span className="text-gradient">Quest</span></span>}
 </Link>
}
