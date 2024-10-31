"use server"
import { CreateGroupSchema } from "@/components/forms/Create-Group/schema"
import { client } from "@/lib/prisma"
import { v4 as uuidv4 } from "uuid"
import { z } from "zod"

export const onGetAffiliateInfo = async (id: string) => {
    try {
        const affiliateInfo = await client.affiliate.findUnique({
            where: {
                id,
            },
            select: {
                Group: {
                    select: {
                        User: {
                            select: {
                                firstname: true,
                                lastname: true,
                                image: true,
                                id: true,
                                stripeId: true,
                            },
                        },
                    },
                },
            },
        })

        if (affiliateInfo) {
            return { status: 200, user: affiliateInfo }
        }

        return { status: 404 }
    } catch (error) {
        return { status: 400 }
    }
}

export const onCreateNewGroup = async (
    userId: string,
    data: z.infer<typeof CreateGroupSchema>,
) => {
    try {
        const created = await client.user.update({
            where: {
                id: userId,
            },
            data: {
                group: {
                    create: {
                        ...data,
                        affiliate: {
                            create: {},
                        },
                        member: {
                            create: {
                                userId: userId,
                            },
                        },
                        channel: {
                            create: [
                                {
                                    id: uuidv4(),
                                    name: "general",
                                    icon: "general",
                                },
                                {
                                    id: uuidv4(),
                                    name: "announcements",
                                    icon: "announcement",
                                },
                            ],
                        },
                    },
                },
            },
            select: {
                id: true,
                group: {
                    select: {
                        id: true,
                        channel: {
                            select: {
                                id: true,
                            },
                            take: 1,
                            orderBy: {
                                createdAt: "asc",
                            },
                        },
                    },
                },
            },
        })

        if (created) {
            return {
                status: 200,
                data: created,
                message: "Group created successfully",
            }
        }
    } catch (error) {
        return {
            status: 400,
            message: "Oops! group creation failed, try again later",
        }
    }
}
