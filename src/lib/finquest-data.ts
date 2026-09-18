import { Landmark, Smartphone, WalletCards, PiggyBank, TrendingUp, PieChart, BadgeIndianRupee, Gauge, ReceiptIndianRupee, ShieldCheck, LockKeyhole } from 'lucide-react';

export const modules = [
  { slug:'banking-basics', title:'Banking Basics', icon:Landmark, progress:100, xp:120, color:'cyan' },
  { slug:'upi-payments', title:'UPI & Digital Payments', icon:Smartphone, progress:72, xp:160, color:'violet' },
  { slug:'budgeting', title:'Budgeting', icon:WalletCards, progress:35, xp:180, color:'blue' },
  { slug:'savings', title:'Savings', icon:PiggyBank, progress:0, xp:140, color:'emerald' },
  { slug:'sip', title:'SIP', icon:TrendingUp, progress:0, xp:220, color:'violet' },
  { slug:'mutual-funds', title:'Mutual Funds', icon:PieChart, progress:0, xp:240, color:'blue' },
  { slug:'fixed-deposits', title:'Fixed Deposits', icon:BadgeIndianRupee, progress:0, xp:130, color:'amber' },
  { slug:'credit-score', title:'Credit Score', icon:Gauge, progress:0, xp:180, color:'cyan' },
  { slug:'taxes', title:'Taxes', icon:ReceiptIndianRupee, progress:0, xp:260, color:'violet' },
  { slug:'insurance', title:'Insurance', icon:ShieldCheck, progress:0, xp:220, color:'emerald' },
  { slug:'digital-security', title:'Digital Security', icon:LockKeyhole, progress:0, xp:200, color:'amber' },
];

export const stocks = [
 { symbol:'TCS', name:'Tata Consultancy', price:4128.40, change:1.84 },
 { symbol:'HDFCBANK', name:'HDFC Bank', price:1734.25, change:0.72 },
 { symbol:'RELIANCE', name:'Reliance Industries', price:2946.80, change:-0.63 },
 { symbol:'INFY', name:'Infosys', price:1876.15, change:2.21 },
];
