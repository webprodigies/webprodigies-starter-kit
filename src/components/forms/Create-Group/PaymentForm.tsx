"use client"
import { Loader } from "@/components/global/loader"
import { usePayments } from "@/hooks/payment"

type Props = {
    userId: string
    affiliate: boolean
    stripeId?: string
}

const PaymentForm = ({ affiliate, userId, stripeId }: Props) => {
    const {
        onCreateGroup,
        isPending,
        register,
        errors,
        isCategory,
        creatingIntent,
    } = usePayments(userId, affiliate)

    return (
        <Loader loading={creatingIntent}>
            <form className="pt-5" onSubmit={onCreateGroup}></form>
        </Loader>
    )
}

export default PaymentForm
