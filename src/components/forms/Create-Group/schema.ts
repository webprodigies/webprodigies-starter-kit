import { z } from "zod"

export const CreateGroupSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),

  category: z.string().min(3, { message: "You must select a category" }),
})
