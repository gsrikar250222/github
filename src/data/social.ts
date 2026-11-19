/**
 * SOCIAL & CONTACT — only verified links.
 *
 * Every field left empty is hidden on the site.
 *
 * Contact form:
 *  - If `formEndpoint` is set (e.g. a Formspree / Web3Forms / your own API URL that accepts
 *    JSON POST), the form submits there.
 *  - Otherwise, if `email` is set, the form opens the visitor's mail app with the message pre-filled.
 *  - If neither is set, the form is not rendered (no fake buttons).
 *
 * Resume:
 *  - Put your PDF in /public (e.g. public/resume.pdf) and set `resumeUrl: '/resume.pdf'`.
 *  - "View Resume" / "Download Resume" buttons appear in the hero only once this is set.
 *  - (The admin-panel upload flow from the expansion spec will replace this later.)
 */
export const social = {
  email: 'gsrikar888@gmail.com',
  github: 'https://github.com/gsrikar250222',
  linkedin: 'https://www.linkedin.com/in/g-srikar-babu-845751326/',
  // Phone / WhatsApp (international format, digits only, Indian +91 assumed — change if wrong)
  phone: '918978595225',
  whatsapp: '918978595225',
  formEndpoint: '',
  resumeUrl: '',
}

export const phoneDisplay = '+91 89785 95225'
export const whatsappLink = (text = '') =>
  `https://wa.me/${social.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`

export const contactConfigured = Boolean(social.formEndpoint || social.email || social.whatsapp)
