"use client"

import { useSearch } from "@/hooks/groups"

type Props = {
  className?: string
  inputStyle?: string
  placeholder?: string
  searchType: "GROUPS" | "POSTS"
  iconStyle?: string
  glass?: boolean
}

const Search = ({
  searchType,
  className,
  glass,
  iconStyle,
  inputStyle,
  placeholder,
}: Props) => {

    const { quary, onSearchQuery } = useSearch(searchType)

  return <div>Search</div>
}

export default Search
