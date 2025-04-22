import type React from "react"
import { FaMapMarkerAlt, FaInfoCircle } from "react-icons/fa"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { useLanguage } from "@/contexts/language-context"

interface ErfahrungBlockProps {
  title: string
  content: any[]
}

const ErfahrungBlock: React.FC<ErfahrungBlockProps> = ({ title, content }) => {
  const { language } = useLanguage()

  // Helper function to get the correct language content
  const getLocalizedContent = (content: any) => {
    if (typeof content === "object" && content !== null && (content.de || content.en)) {
      return content[language] || content.de // Fallback to German if translation is missing
    }
    return content
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-2xl font-semibold text-[#1a365d] mb-4">{title}</h3>
      <div className="space-y-4">
        {content.map((item, index) => (
          <Accordion type="single" collapsible className="w-full" key={index}>
            <AccordionItem value={`item-${index}`}>
              <AccordionTrigger className="text-lg font-medium text-[#1a365d] flex justify-between items-center">
                <div className="flex items-center w-full">
                  <span className="text-base text-gray-500 mr-4 whitespace-nowrap">
                    {item.title && item.title.match
                      ? item.title.match(/\d{2}\/\d{4} - \d{2}\/\d{4}/) || item.year
                      : item.year}
                  </span>
                  <span className="text-left">
                    {getLocalizedContent(item.title) && typeof getLocalizedContent(item.title) === "string"
                      ? getLocalizedContent(item.title)
                          .replace(/\d{2}\/\d{4} - \d{2}\/\d{4}/, "")
                          .trim()
                      : getLocalizedContent(item.title)}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {item.mainInfo && (
                  <p className="text-[#1a365d] mt-2 flex items-center text-base">
                    <FaMapMarkerAlt className="mr-2 flex-shrink-0" />
                    <span>
                      {typeof getLocalizedContent(item.mainInfo) === "string"
                        ? getLocalizedContent(item.mainInfo)
                            .replace(/\d{2}\/\d{4} - \d{2}\/\d{4}/, "")
                            .trim()
                        : getLocalizedContent(item.mainInfo)}
                    </span>
                  </p>
                )}
                {item.details && (
                  <p className="text-[#1a365d] mt-2 flex items-start text-base">
                    <FaInfoCircle className="mr-2 mt-1 flex-shrink-0" />
                    <span>{getLocalizedContent(item.details)}</span>
                  </p>
                )}
                {item.tools && (
                  <p className="text-[#1a365d] mt-2 text-base">
                    <strong>Tools:</strong> {item.tools}
                  </p>
                )}
                {item.authors && (
                  <p className="text-[#1a365d] mt-2 text-base">
                    <strong>Autoren:</strong> {item.authors}
                  </p>
                )}
                {item.author && (
                  <p className="text-[#1a365d] mt-2 text-base">
                    <strong>Autor:</strong> {item.author}
                  </p>
                )}
                {item.conference && (
                  <p className="text-[#1a365d] mt-2 text-base">
                    <strong>Konferenz:</strong>{" "}
                    {typeof item.conference === "string" ? item.conference : item.conference[language]}
                  </p>
                )}
                {item.book && (
                  <p className="text-[#1a365d] mt-2 text-base">
                    <strong>Buch:</strong> {typeof item.book === "string" ? item.book : item.book[language]}
                  </p>
                )}
                {item.volume && (
                  <p className="text-[#1a365d] mt-2 text-base">
                    <strong>Band:</strong> {item.volume}
                  </p>
                )}
                {item.pages && (
                  <p className="text-[#1a365d] mt-2 text-base">
                    <strong>Seiten:</strong> {item.pages}
                  </p>
                )}
                {item.publisher && (
                  <p className="text-[#1a365d] mt-2 text-base">
                    <strong>Verlag:</strong> {item.publisher}
                  </p>
                )}
                {item.location && (
                  <p className="text-[#1a365d] mt-2 text-base">
                    <strong>Ort:</strong> {typeof item.location === "string" ? item.location : item.location[language]}
                  </p>
                )}
                {item.doi && (
                  <p className="text-[#1a365d] mt-2 text-base">
                    <strong>DOI:</strong>{" "}
                    <a
                      href={`https://doi.org/${item.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {item.doi}
                    </a>
                  </p>
                )}
                {item.dissertation && (
                  <p className="text-[#1a365d] mt-2 text-base">
                    <strong>Dissertation:</strong>{" "}
                    {typeof item.dissertation === "string" ? item.dissertation : item.dissertation[language]}
                  </p>
                )}
                {item.masterarbeit && (
                  <p className="text-[#1a365d] mt-2 text-base">
                    <strong>Masterarbeit:</strong>{" "}
                    {typeof item.masterarbeit === "string" ? item.masterarbeit : item.masterarbeit[language]}
                  </p>
                )}
                {item.bachelorarbeit && (
                  <p className="text-[#1a365d] mt-2 text-base">
                    <strong>Bachelorarbeit:</strong>{" "}
                    {typeof item.bachelorarbeit === "string" ? item.bachelorarbeit : item.bachelorarbeit[language]}
                  </p>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </div>
  )
}

export default ErfahrungBlock
