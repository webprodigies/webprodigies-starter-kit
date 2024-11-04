"use client"
import {
  onGetGroupInfo,
  onSearchGroups,
  onUpDateGroupSettings,
} from "@/actions/groups"
import { GroupSettingsSchema } from "@/components/forms/group-settings/schema"
import { upload } from "@/lib/uploadcare"
import { supabaseClient } from "@/lib/utils"
import { onOnline } from "@/redux/slices/online-member-slice"
import { onClearSearch, onSearch } from "@/redux/slices/search-slice"
import { AppDispatch } from "@/redux/store"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { JSONContent } from "novel"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch } from "react-redux"
import { toast } from "sonner"
import { z } from "zod"

export const useGroupChatOnline = (userid: string) => {
  const dispatch: AppDispatch = useDispatch()

  useEffect(() => {
    const channel = supabaseClient.channel("tracking")

    channel
      .on("presence", { event: "sync" }, () => {
        const state: any = channel.presenceState()
        console.log(state)
        for (const user in state) {
          dispatch(
            onOnline({
              members: [{ id: state[user][0].member.userid }],
            }),
          )
        }
      })
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          await channel.track({
            member: {
              userid,
            },
          })
        }
      })

    return () => {
      channel.unsubscribe()
    }
  }, [])
}

export const useSearch = (search: "GROUPS" | "POSTS") => {
  const [query, setQuery] = useState<string>("")
  const [debounce, setDebounce] = useState<string>("")

  const dispatch: AppDispatch = useDispatch()

  const onSearchQuery = (e: React.ChangeEvent<HTMLInputElement>) =>
    setQuery(e.target.value)

  useEffect(() => {
    const delayInputTimeoutId = setTimeout(() => {
      setDebounce(query)
    }, 1000)
    return () => clearTimeout(delayInputTimeoutId)
  }, [query, 1000])

  const { refetch, data, isFetched, isFetching } = useQuery({
    queryKey: ["search-data", debounce],
    queryFn: async ({ queryKey }) => {
      if (search === "GROUPS") {
        const groups = await onSearchGroups(search, queryKey[1])
        return groups
      }
    },
    enabled: false,
  })

  if (isFetching)
    dispatch(
      onSearch({
        isSearching: true,
        data: [],
      }),
    )

  if (isFetched)
    dispatch(
      onSearch({
        isSearching: false,
        status: data?.status as number,
        data: data?.groups || [],
        debounce,
      }),
    )

  useEffect(() => {
    if (debounce) refetch()
    if (!debounce) dispatch(onClearSearch())
    return () => {
      debounce
    }
  }, [debounce])

  return { query, onSearchQuery }
}

export const useGroupSettings = (groupid: string) => {
  const { data } = useQuery({
    queryKey: ["group-info"],
    queryFn: () => onGetGroupInfo(groupid),
  })

  const jsonContent = data?.group?.jsonDescription
    ? JSON.parse(data?.group?.jsonDescription as string)
    : undefined

  const [onJsonDescription, setJsonDescription] = useState<
    JSONContent | undefined
  >(jsonContent)

  const [onDescription, setOnDescription] = useState<string | undefined>(
    data?.group?.description || undefined,
  )

  const {
    register,
    formState: { errors },
    reset,
    handleSubmit,
    watch,
    setValue,
  } = useForm<z.infer<typeof GroupSettingsSchema>>({
    resolver: zodResolver(GroupSettingsSchema),
    mode: "onChange",
  })
  const [previewIcon, setPreviewIcon] = useState<string | undefined>(undefined)
  const [previewThumbnail, setPreviewThumbnail] = useState<string | undefined>(
    undefined,
  )

  useEffect(() => {
    const previews = watch(({ thumbnail, icon }) => {
      if (!icon) return
      if (icon[0]) {
        setPreviewIcon(URL.createObjectURL(icon[0]))
      }
      if (thumbnail[0]) {
        setPreviewThumbnail(URL.createObjectURL(thumbnail[0]))
      }
    })
    return () => previews.unsubscribe()
  }, [watch])

  const onSetDescriptions = () => {
    const JsonContent = JSON.stringify(onJsonDescription)
    setValue("jsondescription", JsonContent)
    setValue("description", onDescription)
  }

  useEffect(() => {
    onSetDescriptions()
    return () => {
      onSetDescriptions()
    }
  }, [onJsonDescription, onDescription])

  const { mutate: update, isPending } = useMutation({
    mutationKey: ["group-settings"],
    mutationFn: async (values: z.infer<typeof GroupSettingsSchema>) => {
      if (values.thumbnail && values.thumbnail.length > 0) {
        const uploaded = await upload.uploadFile(values.thumbnail[0])
        const updated = await onUpDateGroupSettings(
          groupid,
          "IMAGE",
          uploaded.uuid,
          `/group/${groupid}/settings`,
        )
        if (updated.status !== 200) {
          return toast("Error", {
            description: "Oops! looks like your form is empty",
          })
        }
      }
      if (values.icon && values.icon.length > 0) {
        console.log("icon")
        const uploaded = await upload.uploadFile(values.icon[0])
        const updated = await onUpDateGroupSettings(
          groupid,
          "ICON",
          uploaded.uuid,
          `/group/${groupid}/settings`,
        )
        if (updated.status !== 200) {
          return toast("Error", {
            description: "Oops! looks like your form is empty",
          })
        }
      }
      if (values.name) {
        const updated = await onUpDateGroupSettings(
          groupid,
          "NAME",
          values.name,
          `/group/${groupid}/settings`,
        )
        if (updated.status !== 200) {
          return toast("Error", {
            description: "Oops! looks like your form is empty",
          })
        }
      }
      console.log("DESCRIPTION")

      if (values.description) {
        const updated = await onUpDateGroupSettings(
          groupid,
          "DESCRIPTION",
          values.description,
          `/group/${groupid}/settings`,
        )
        if (updated.status !== 200) {
          return toast("Error", {
            description: "Oops! looks like your form is empty",
          })
        }
      }
      if (values.jsondescription) {
        const updated = await onUpDateGroupSettings(
          groupid,
          "JSONDESCRIPTION",
          values.jsondescription,
          `/group/${groupid}/settings`,
        )
        if (updated.status !== 200) {
          return toast("Error", {
            description: "Oops! looks like your form is empty",
          })
        }
      }
      if (
        !values.description &&
        !values.name &&
        !values.thumbnail.length &&
        !values.icon.length &&
        !values.jsondescription
      ) {
        return toast("Error", {
          description: "Oops! looks like your form is empty",
        })
      }
      return toast("Success", {
        description: "Group data updated",
      })
    },
  })
  const router = useRouter()
  const onUpdate = handleSubmit(async (values) => update(values))
  if (data?.status !== 200) router.push(`/group/create`)

  return {
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
  }
}
