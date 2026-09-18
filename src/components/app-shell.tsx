import { Link, useRouter } from '@tanstack/react-router';
import { BarChart3, BookOpen, Bot, Flame, LayoutDashboard, LogOut, Menu, ShieldAlert, TrendingUp, UserRound, WalletCards, X, Zap } from 'lucide-react';
import { useState } from 'react';
import { Brand } from './brand';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
const nav=[
 {to:'/dashboard',label:'Overview',icon:LayoutDashboard},{to:'/learn',label:'Learn',icon:BookOpen},{to:'/market',label:'Market Lab',icon:TrendingUp},{to:'/fraud-lab',label:'Fraud Lab',icon:ShieldAlert},{to:'/finance-lab',label:'Money Lab',icon:WalletCards},{to:'/mentor',label:'AI Mentor',icon:Bot},{to:'/analytics',label:'Analytics',icon:BarChart3},{to:'/profile',label:'Profile',icon:UserRound},
] as const;
export function AppShell({children,title,eyebrow}:{children:React.ReactNode;title:string;eyebrow?:string}){
 const [open,setOpen]=useState(false); const router=useRouter(); const queryClient=useQueryClient();
 const signOut=async()=>{await queryClient.cancelQueries();queryClient.clear();await supabase.auth.signOut();router.navigate({to:'/auth',replace:true});};
 return <div className="min-h-screen bg-background text-foreground">
  <aside className={`fixed inset-y-0 left-0 z-50 w-64 border-r border-border bg-sidebar/95 p-4 backdrop-blur-xl transition-transform lg:translate-x-0 ${open?'translate-x-0':'-translate-x-full'}`}>
   <div className="flex items-center justify-between"><Brand/><Button variant="ghost" size="icon" className="lg:hidden" onClick={()=>setOpen(false)}><X/></Button></div>
   <div className="mt-8 rounded-lg border border-primary/20 bg-primary/8 p-3"><div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">LEVEL 4</span><span className="font-semibold text-primary">1,240 XP</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full w-[68%] rounded-full bg-gradient-brand"/></div></div>
   <nav className="mt-6 space-y-1">{nav.map(({to,label,icon:Icon})=><Link key={to} to={to} onClick={()=>setOpen(false)} activeProps={{className:'nav-link-active'}} className="nav-link"><Icon className="size-4"/><span>{label}</span>{label==='AI Mentor'&&<span className="ml-auto size-1.5 rounded-full bg-accent"/>}</Link>)}</nav>
   <div className="absolute inset-x-4 bottom-4"><div className="mb-3 flex items-center gap-3 rounded-lg border border-border bg-card/50 p-3"><div className="grid size-9 place-items-center rounded-md bg-primary/15 text-primary"><Zap className="size-4"/></div><div><p className="text-xs font-medium">7 day streak</p><p className="text-[11px] text-muted-foreground">Keep the momentum</p></div><Flame className="ml-auto size-4 text-accent"/></div><Button variant="ghost" className="w-full justify-start text-muted-foreground" onClick={signOut}><LogOut/>Sign out</Button></div>
  </aside>
  <main className="lg:pl-64"><header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-xl md:px-8"><div className="flex items-center gap-3"><Button variant="ghost" size="icon" className="lg:hidden" onClick={()=>setOpen(true)}><Menu/></Button><div><p className="text-[10px] uppercase tracking-[.18em] text-primary">{eyebrow||'Your journey'}</p><h1 className="text-lg font-semibold">{title}</h1></div></div><div className="flex items-center gap-3"><div className="hidden items-center gap-2 rounded-full border border-border bg-card/50 px-3 py-1.5 text-xs sm:flex"><span className="text-accent">●</span> 480 coins</div><Link to="/profile" className="grid size-9 place-items-center rounded-full bg-gradient-brand text-xs font-bold text-primary-foreground">TS</Link></div></header><div className="mx-auto max-w-[1480px] p-4 md:p-8">{children}</div></main>
 </div>
}
