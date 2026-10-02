import { Suspense } from "react"
import ForgotPasswordPage from "./forgot-password-client"

export default function Page() {
  return (
    <Suspense fallback={null}>
      <ForgotPasswordPage />
    </Suspense>
  )
}