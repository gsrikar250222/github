import { useSyncExternalStore } from 'react'

/** The subject line of the contact form. Service buttons set it before scrolling to the form. */
let subject = 'Client project enquiry'
const listeners = new Set<() => void>()
export const setEnquirySubject = (s: string) => {
  subject = s
  listeners.forEach((l) => l())
}
export const useEnquirySubject = () =>
  useSyncExternalStore(
    (cb) => {
      listeners.add(cb)
      return () => listeners.delete(cb)
    },
    () => subject,
    () => subject,
  )
