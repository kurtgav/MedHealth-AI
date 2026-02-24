'use client';

import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserRole } from '../types';
import { User, Settings, LogOut, Stethoscope } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function ProfileDropdown() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session?.user) {
    return null;
  }

  const user = session.user;
  const role = user.role as UserRole;

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const handleDashboard = () => {
    if (role === UserRole.DOCTOR) {
      router.push('/dashboard/doctor');
    } else {
      router.push('/dashboard/patient');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-2 text-white hover:bg-white/10"
        >
          {user.image ? (
            <img
              src={user.image}
              alt={user.name || 'User'}
              className="h-8 w-8 rounded-full"
            />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400/70 to-purple-500/70">
              <User className="h-4 w-4 text-white" />
            </div>
          )}
          <span className="hidden md:block">{user.name || user.email}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56 border-white/10 bg-slate-900 text-white">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name || 'User'}</p>
            <p className="text-xs leading-none text-slate-400">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem
          onClick={handleDashboard}
          className="cursor-pointer text-white focus:bg-white/10"
        >
          <Stethoscope className="mr-2 h-4 w-4" />
          Dashboard
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem className="cursor-pointer text-white focus:bg-white/10">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              <span>Role</span>
            </div>
            <Badge
              variant={role === UserRole.DOCTOR ? 'default' : 'secondary'}
              className={
                role === UserRole.DOCTOR
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                  : 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
              }
            >
              {role}
            </Badge>
          </div>
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer text-white focus:bg-white/10">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-white/10" />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-400 focus:bg-red-500/10"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}



