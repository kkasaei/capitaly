import * as React from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { FaInbox } from "react-icons/fa"
import { Button } from "@/components/ui/button"

interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title: string
  description: string
  actionLabel?: string
  actionUrl?: string
  actionHandler?: () => void
}

export function EmptyState({
  icon = <FaInbox className="h-10 w-10 text-gray-400" />,
  title,
  description,
  actionLabel,
  actionUrl,
  actionHandler,
  className,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white p-12 text-center",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      {(actionLabel && actionUrl) && (
        <Link
          href={actionUrl}
          className="mt-6 inline-flex items-center rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          {actionLabel}
        </Link>
      )}
      {(actionLabel && actionHandler && !actionUrl) && (
        <Button
          className="mt-6"
          onClick={actionHandler}
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
} 