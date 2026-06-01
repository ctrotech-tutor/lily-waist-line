import { Loader2 } from"lucide-react";

export default function AdminLoading() {
 return (
 <div className="flex h-full min-h-[60vh] items-center justify-center">
 <div className="flex flex-col items-center gap-3">
 <Loader2 className="h-6 w-6 animate-spin text-secondary" />
 <p className="
text-xs uppercase tracking-widest text-muted-foreground">Loading dashboard</p>
 </div>
 </div>
 );
}
