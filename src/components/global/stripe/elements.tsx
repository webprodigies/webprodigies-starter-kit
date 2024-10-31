"use client"

import { userStripeElemens } from "@/hooks/payment"
import { Elements } from "@stripe/react-stripe-js"

type StripeElementsProps = {
    children: React.ReactNode
}

export const StripeElements = ({ children }: StripeElementsProps) => {
    const { StripePromise } = userStripeElemens()
    const promise = StripePromise()

    return promise && <Elements stripe={promise}>{children}</Elements>
}
