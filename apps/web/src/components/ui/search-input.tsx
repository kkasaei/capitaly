import * as React from "react"
import { SearchIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch: (value: string) => void
  value: string
}

export function SearchInput({
  className,
  onSearch,
  value,
  ...props
}: SearchInputProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)
  
  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = ""
    }
    onSearch("")
  }

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <SearchIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
      </div>
      <Input
        ref={inputRef}
        type="text"
        className={cn(
          "pl-10 pr-10 h-10 w-full rounded-md border border-gray-300 bg-white text-sm text-gray-900 placeholder:text-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500",
          className
        )}
        placeholder="Search..."
        value={value}
        onChange={(e) => onSearch(e.target.value)}
        {...props}
      />
      {value && (
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center pr-3"
          onClick={handleClear}
        >
          <XIcon className="h-4 w-4 text-gray-400 hover:text-gray-500" aria-hidden="true" />
        </button>
      )}
    </div>
  )
} 