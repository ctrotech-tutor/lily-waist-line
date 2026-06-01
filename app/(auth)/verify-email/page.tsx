import { Suspense } from "react"
import VerifyEmailPage from "./verify-email-client"

export default function Page() {
  return (
    <Suspense fallback={null}>
      <VerifyEmailPage />
    </Suspense>
  )
}