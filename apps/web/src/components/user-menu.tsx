"use client";

import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { UserAvatar } from "@/hooks/use-avatar";
import { useTheme } from "next-themes";
import {
  HardDriveIcon,
  LogOutIcon,
  MoonIcon,
  SettingsIcon,
  SunIcon,
  UserIcon,
  CreditCardIcon,
  HelpCircleIcon,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SignOutButton, useUser } from "@clerk/nextjs";

interface ColorModeOption {
  value: string;
  label: string;
  icon: React.ElementType;
}

export function UserMenu() {
  const { user } = useUser();
  const { setTheme: setCurrentTheme, theme: currentTheme } = useTheme();
  const [theme, setTheme] = useState<string>(currentTheme ?? "system");

  const colorModeOptions: ColorModeOption[] = [
    {
      value: "system",
      label: "System",
      icon: HardDriveIcon,
    },
    {
      value: "light",
      label: "Light",
      icon: SunIcon,
    },
    {
      value: "dark",
      label: "Dark",
      icon: MoonIcon,
    },
  ];

  return (
    <DropdownMenu.Root modal={false}>
      <DropdownMenuTrigger asChild>
        {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
        <button
          className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary"
          aria-label="User menu"
        >
          <div className="flex gap-4 items-center">
            <UserAvatar
              name={`${user?.firstName} ${user?.lastName}`}
              avatarUrl={user?.imageUrl}
            />
            <div className="text-white">
              {`${user?.firstName} ${user?.lastName}`}
              <span className="block text-xs font-normal opacity-70">
                {user?.primaryEmailAddress?.emailAddress}
              </span>
            </div>
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          {`${user?.firstName} ${user?.lastName}`}
          <span className="block text-xs font-normal opacity-70">
            {user?.primaryEmailAddress?.emailAddress}
          </span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenu.Sub>
          <DropdownMenu.SubTrigger className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground">
            <div className="flex w-full items-center">
              <SunIcon className="mr-2 size-4" />
              Color mode
            </div>
          </DropdownMenu.SubTrigger>
          <DropdownMenu.Portal>
            <DropdownMenu.SubContent className="z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2">
              <DropdownMenuRadioGroup
                value={theme}
                onValueChange={(value) => {
                  setTheme(value);
                  setCurrentTheme(value);
                }}
              >
                {colorModeOptions.map((option) => (
                  <DropdownMenuRadioItem
                    key={option.value}
                    value={option.value}
                    className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    <option.icon className="mr-2 size-4" />
                    {option.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenu.SubContent>
          </DropdownMenu.Portal>
        </DropdownMenu.Sub>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link href="/dashboard/profile">
            <UserIcon className="mr-2 size-4" />
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/dashboard/settings">
            <SettingsIcon className="mr-2 size-4" />
            Account settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/dashboard/billing">
            <CreditCardIcon className="mr-2 size-4" />
            Billing
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link href="/dashboard/support">
            <HelpCircleIcon className="mr-2 size-4" />
            Support
          </Link>
        </DropdownMenuItem>

        <SignOutButton>
          <DropdownMenuItem onSelect={() => "signOut()"}>
            <LogOutIcon className="mr-2 size-4" />
            Logout
          </DropdownMenuItem>
        </SignOutButton>
      </DropdownMenuContent>
    </DropdownMenu.Root>
  );
}
