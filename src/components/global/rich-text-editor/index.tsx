import { JSONContent } from "novel"
import { FieldErrors } from "react-hook-form"

type Props = {
  content: JSONContent | undefined
  setContent: React.Dispatch<React.SetStateAction<JSONContent | undefined>>
  min: number
  max: number
  name: string
  errors: FieldErrors
  textContent: string | undefined
  setTextContent: React.Dispatch<React.SetStateAction<string | undefined>>
  onEdit?: boolean
  inline?: boolean
  disabled?: boolean
  htmlContent?: string | undefined
  setHtmlContent?: React.Dispatch<React.SetStateAction<string | undefined>>
}

const BlockTextEditor = (props: Props) => {
  return <div>BlockTextEditor</div>
}

export default BlockTextEditor
