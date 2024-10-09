import CallToAction from "./_components/CallToAction"

type Props = {}

const page = (props: Props) => {
    return (
        <main className="md:px-10 py-20 flex flex-col gap-36">
            <div>
                <CallToAction />
            </div>
        </main>
    )
}

export default page
