"use client"

import Lottie from "lottie-react"
import jobHrAnimation from "@/assets/animations/job-hr.json"

export default function AuthPanelAnimation() {
    return (
        <div className="w-full h-[220px] lg:h-[280px]">
            <Lottie
                animationData={jobHrAnimation}
                loop={true}
                autoplay={true}
                className="w-full h-full"
            />
        </div>
    )
}
