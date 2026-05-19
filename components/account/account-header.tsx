"use client";

import { User, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AccountHeaderSkeleton } from "./account-header-skeleton";

interface AccountHeaderProps {
  fullName: string;
  email: string;
  memberSince: string;
  onEditProfile: () => void;
  className?: string;
  isLoaded?: boolean;
}

export function AccountHeader({
  fullName,
  email,
  memberSince,
  onEditProfile,
  className,
  isLoaded = true,
}: AccountHeaderProps) {
  if (!isLoaded) {
    return (
      <div className={cn("border-b border-border", className)}>
        <div className="py-12 md:py-16 lg:py-20">
          <AccountHeaderSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className={cn("border-b border-border", className)}>
      <div className="py-6 md:py-8 lg:py-10">
        {/* Eyebrow */}
        <div
          className={cn(
            "flex items-center gap-2 mb-6",
            "transition-all duration-700 ease-out",
            isLoaded
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-4"
          )}
        >
          <User className="w-4 h-4 text-[#d4af37]" />

          <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-[#d4af37]">
            Your Profile
          </span>
        </div>

        {/* Divider */}
        <div
          className={cn(
            "w-16 h-px bg-[#d4af37] mb-8",
            "transition-all duration-700 delay-100 ease-out",
            isLoaded
              ? "opacity-100 scale-x-100"
              : "opacity-0 scale-x-0"
          )}
          style={{ transformOrigin: "left" }}
        />

        {/* Content */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            {/* Heading */}
            <h1
              className={cn(
                "font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl",
                "leading-[1.1] tracking-tight text-foreground mb-4",
                "transition-all duration-1000 delay-200 ease-out",
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              )}
            >
              {fullName}
            </h1>

            {/* Supporting Copy */}
            <p
              className={cn(
                "font-sans text-base sm:text-lg text-muted-foreground",
                "leading-relaxed mb-6 max-w-xl",
                "transition-all duration-1000 delay-300 ease-out",
                isLoaded
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              )}
            >
              Manage your personal details, preferences, and order history.
            </p>

            {/* Meta */}
            <div
              className={cn(
                "flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-6",
                "transition-all duration-1000 delay-400 ease-out",
                isLoaded ? "opacity-100" : "opacity-0"
              )}
            >
              <span className="text-sm text-muted-foreground">
                {email}
              </span>

              <div className="hidden sm:block w-1 h-1 rounded-full bg-[#d4af37]" />

              <span className="text-sm text-muted-foreground">
                Member since {memberSince}
              </span>
            </div>
          </div>

          {/* Action */}
          <Button
            onClick={onEditProfile}
            className="w-full sm:w-auto rounded-full bg-[#d4af37] text-black hover:bg-[#d4af37]/90 font-button tracking-wide uppercase"
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit Profile
          </Button>
        </div>
      </div>
    </div>
  );
}