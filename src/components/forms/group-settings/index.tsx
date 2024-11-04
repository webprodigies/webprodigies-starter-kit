"use client"
import { useGroupSettings } from "@/hooks/groups"

type Props = {
  groupId: string
}

const GroupSettingsForm = ({ groupId }: Props) => {
  const {
    data,
    register,
    errors,
    onUpdate,
    isPending,
    previewIcon,
    previewThumbnail,
    onJsonDescription,
    setJsonDescription,
    setOnDescription,
    onDescription,
  } = useGroupSettings(groupId)

  return (
    <form
      className="flex flex-col h-full w-full items-start gap-y-5"
      onSubmit={onUpdate}
    >
      <div className="flex 2xl:flex-row flex-col gap-10">
        <div className="flex flex-col gap-3 items-start">
          <p>Group Preview</p>
        </div>
      </div>
    </form>
  )
}

export default GroupSettingsForm
