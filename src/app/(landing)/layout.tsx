import React from "react"
import LandingPageNavbar from "./_components/Navbar"

type Props = {}

const LandingPageLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="flex flex-col container relative">
            <LandingPageNavbar />
            {children}
        </div>
    )
}

export default LandingPageLayout
