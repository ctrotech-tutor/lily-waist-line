import { Suspense } from "react"
import SignupPage from "./signup-page-client"

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SignupPage />
    </Suspense>
  )
}