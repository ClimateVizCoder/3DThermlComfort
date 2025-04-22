"use client"

import { useState } from "react"
import { FaEnvelope, FaMobileAlt, FaMapMarkerAlt } from "react-icons/fa"
import { useLanguage } from "../context/LanguageContext"
import { toast } from "sonner"
import emailjs from "@emailjs/browser"
import { Input, Textarea, Button } from "../components/ui"

const ContactSection = () => {
  const [isMessageSent, setIsMessageSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { t } = useLanguage()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsLoading(true)
    const formData = new FormData(event.currentTarget)
    const name = formData.get("name")
    const email = formData.get("email")
    const subject = formData.get("subject")
    const message = formData.get("message")

    try {
      await emailjs.send(
        "service_qzzfofc",
        "template_korw4qn",
        {
          from_name: name,
          from_email: email,
          subject: subject,
          message: message,
          to_email: "manuel-kipp95@hotmail.de",
        },
        "4mS8zVA3qnBnIO2ue",
      )
      setIsMessageSent(true)
      toast.success(t("contact.success"), {
        description: t("contact.messageSent"),
      })
      event.currentTarget.reset()
    } catch (error) {
      console.error("Error sending email:", error)
      toast.error(t("contact.error"), {
        description: t("contact.errorDescription"),
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/2 space-y-4">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-[#1a365d] break-words md:break-normal">{t("contact.getInTouch")}</h2>
            <p className="text-[#1a365d] break-words md:break-normal">{t("contact.message")}</p>
          </div>
          <div className="flex items-center space-x-4">
            <FaEnvelope className="text-2xl text-[#1a365d]" />
            <a
              href="mailto:manuel-kipp95@hotmail.de"
              className="text-[#1a365d] hover:underline break-words md:break-normal"
            >
              manuel-kipp95@hotmail.de
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <FaMobileAlt className="text-2xl text-[#1a365d]" />
            <span className="text-[#1a365d] break-words md:break-normal">+49 015789558680</span>
          </div>
          <div className="flex items-center space-x-4">
            <FaMapMarkerAlt className="text-2xl text-[#1a365d]" />
            <span className="text-[#1a365d] break-words md:break-normal">München</span>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          {isMessageSent ? (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className="font-bold break-words md:break-normal">{t("contact.thankYou")}</strong>
              <span className="block sm:inline break-words md:break-normal"> {t("contact.messageSent")}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 break-words md:break-normal">
                  {t("contact.name")}
                </label>
                <Input type="text" id="name" name="name" required className="mt-1" />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 break-words md:break-normal">
                  {t("contact.email")}
                </label>
                <Input type="email" id="email" name="email" required className="mt-1" />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 break-words md:break-normal"
                >
                  {t("contact.subject")}
                </label>
                <Input type="text" id="subject" name="subject" required className="mt-1" />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 break-words md:break-normal"
                >
                  {t("contact.message")}
                </label>
                <Textarea id="message" name="message" required className="mt-1" />
              </div>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    {t("contact.sending")}
                  </>
                ) : (
                  t("contact.send")
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default ContactSection
