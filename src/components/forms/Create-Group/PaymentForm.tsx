"use client"
import { FormGenerator } from "@/components/global/form-generator"
import { Loader } from "@/components/global/loader"
import { usePayments } from "@/hooks/payment"
import { ErrorMessage } from "@hookform/error-message"
import { CardElement } from "@stripe/react-stripe-js"

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
            <form className="pt-5" onSubmit={onCreateGroup}>
                <div className="px-7 mb-2">
                    <ErrorMessage
                        errors={errors}
                        name={"category"}
                        render={({ message }) => (
                            <p className="text-red-400">
                                {message === "required" ? "" : message}
                            </p>
                        )}
                    />
                </div>
                <div className="px-7">
                    <FormGenerator
                        register={register}
                        name="name"
                        errors={errors}
                        inputType="input"
                        type="text"
                        placeholder="Group Name"
                    />
                </div>

                <div className="px-7 my-3">
                    <CardElement
                        options={{
                            style: {
                                base: {
                                    fontSize: "16px",
                                    color: "#B4B0AE",
                                    "::placeholder": {
                                        color: "#B4B0AE",
                                    },
                                },
                            },
                        }}
                        className="bg-themeBlack border-[1px] border-themeGray outline-none rounded-lg p-3"
                    />
                </div>
            </form>
        </Loader>
    )
}

export default PaymentForm
