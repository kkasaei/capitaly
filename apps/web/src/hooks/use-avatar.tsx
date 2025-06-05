import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { forwardRef, useMemo } from "react";

export const UserAvatar = forwardRef<
  HTMLSpanElement,
  {
    name: string;
    avatarUrl?: string | null;
    className?: string;
  }
>(({ name, avatarUrl, className }, ref) => {
  const initials = useMemo(
    () =>
      name
        .split(" ")
        .map((n) => n[0])
        .join(""),
    [name],
  );

  const avatarSrc = useMemo(() => avatarUrl ?? undefined, [avatarUrl]);

  return (
    <Avatar ref={ref} className={`w-10 h-10 ${className ?? ""}`}>
      <AvatarImage src={avatarSrc} sizes="40" />
      <AvatarFallback className="bg-primary/10 text-primary">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
});

UserAvatar.displayName = "UserAvatar";
