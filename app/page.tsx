"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, type PanInfo, useScroll, useTransform } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import emailjs from "@emailjs/browser"
import {
  FaTools,
  FaCube,
  FaWind,
  FaEnvelope,
  FaLinkedin,
  FaDumbbell,
  FaGolfBall,
  FaRunning,
  FaSnowboarding,
  FaUtensils,
  FaGithub,
  FaChevronDown,
  FaUniversity,
  FaPython,
  FaFileAlt,
  FaResearchgate,
  FaMapMarkerAlt,
  FaMobileAlt,
  FaInfoCircle,
  FaCog,
  FaCalculator, // Added FaCalculator to replace SiMathworks
  FaMicrosoft, // Added FaMicrosoft to replace SiMicrosoft
} from "react-icons/fa"
import { GiMountainClimbing, GiSoccerBall, GiRaceCar } from "react-icons/gi"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import Header from "@/components/header"
import TransparentDivider from "@/components/TransparentDivider"
import { useLanguage } from "@/contexts/language-context"
import CookieBanner from "@/components/cookie-banner"

// Sprachdaten
const languages = [
  {
    name: { de: "Deutsch", en: "German" },
    level: "L1",
    percentage: 100,
  },
  {
    name: { de: "Englisch", en: "English" },
    level: "C1",
    percentage: 90,
  },
  {
    name: { de: "Französisch", en: "French" },
    level: "A2",
    percentage: 40,
  },
]

// Skills-Daten mit Übersetzungen
const skills = [
  {
    name: {
      de: "CAD Software (CATIA V5, RAMSIS)",
      en: "CAD Software (CATIA V5, RAMSIS)",
    },
    years: 12,
    percentage: 90,
  },
  {
    name: {
      de: "Python (Datenanalyse, Machine Learning)",
      en: "Python (Data Analysis, Machine Learning)",
    },
    years: 6,
    percentage: 80,
  },
  {
    name: {
      de: "MATLAB/Simulink",
      en: "MATLAB/Simulink",
    },
    years: 12,
    percentage: 50,
  },
  {
    name: {
      de: "CFD Software (STAR-CCM+, Ansys CFX/FLUENT)",
      en: "CFD Software (STAR-CCM+, Ansys CFX/FLUENT)",
    },
    years: 7,
    percentage: 60,
  },
  {
    name: {
      de: "Rapid Prototyping (3D Druck)",
      en: "Rapid Prototyping (3D Printing)",
    },
    years: 12,
    percentage: 90,
  },
  {
    name: {
      de: "Microsoft Office",
      en: "Microsoft Office",
    },
    years: 12,
    percentage: 80,
  },
]

// Hobbies-Daten mit Übersetzungen
const hobbies = [
  {
    name: {
      de: "Fußball",
      en: "Soccer",
    },
    icon: <GiSoccerBall />,
  },
  {
    name: {
      de: "Fitness",
      en: "Fitness",
    },
    icon: <FaDumbbell />,
  },
  {
    name: {
      de: "Golf",
      en: "Golf",
    },
    icon: <FaGolfBall />,
  },
  {
    name: {
      de: "Laufen",
      en: "Running",
    },
    icon: <FaRunning />,
  },
  {
    name: {
      de: "Bouldern",
      en: "Bouldering",
    },
    icon: <GiMountainClimbing />,
  },
  {
    name: {
      de: "Wintersport",
      en: "Winter Sports",
    },
    icon: <FaSnowboarding />,
  },
  {
    name: {
      de: "Kochen",
      en: "Cooking",
    },
    icon: <FaUtensils />,
  },
  {
    name: {
      de: "Formel 1",
      en: "Formula 1",
    },
    icon: <GiRaceCar />,
  },
]

// Projektbilder (Slider)
const images = [
  {
    src: "https://urlyaqdfmocz1d9x.public.blob.vercel-storage.com/autoTAXI_1-fITUGHEQRAH4KHAxhEIdPu6oX8Mhju.png",
    alt: "Autonomes Taxi 1",
    title: "autoTAXI - Außenansicht",
  },
  {
    src: "https://urlyaqdfmocz1d9x.public.blob.vercel-storage.com/autoTAXI_2-GrWpdVZ5Isvn14hoBfpRrqlkCKpl0z.png",
    alt: "Autonomes Taxi 2",
    title: "autoTAXI - Innenraum",
  },
  {
    src: "https://urlyaqdfmocz1d9x.public.blob.vercel-storage.com/autoTAXI_3-MIt0Xu2QY9kwGWKgyY6WnJTuKs9onn.png",
    alt: "Autonomes Taxi 3",
    title: "autoTAXI - Innenraum",
  },
  {
    src: "https://urlyaqdfmocz1d9x.public.blob.vercel-storage.com/eVTOL-dUExTGPtRqlMfeFEIVoAFYgCsxUvfy.png",
    alt: "eVTOL",
    title: "eVTOL Projekt",
  },
  {
    src: "https://urlyaqdfmocz1d9x.public.blob.vercel-storage.com/Titel-wQ12vbnC81tCH7HlBbmo1aPbuSyB97.png",
    alt: "Titel",
    title: "Klima Projekte",
  },
  {
    src: "https://urlyaqdfmocz1d9x.public.blob.vercel-storage.com/Klimadummy-rtYfsgbCmNo0zb6PrtETpNrIA1A75p.png",
    alt: "Klimadummy",
    title: "Klimadummy Entwicklung",
  },
  {
    src: "https://urlyaqdfmocz1d9x.public.blob.vercel-storage.com/BMW-hmRcDAF950ZA2LwVFlhNsB3GtW3qW2.png",
    alt: "BMW",
    title: "BMW Forschungsprojekt",
  },
  {
    src: "https://urlyaqdfmocz1d9x.public.blob.vercel-storage.com/SlideCoaster-8yvLmj3jI3JJqmQKjzl3XYVaOUgjNT.jpg",
    alt: "SlideCoaster",
    title: "SlideCoaster Projekt",
  },
]

// Berufserfahrung, Veröffentlichungen usw.
const erfahrungContent = {
  akademisch: [
    {
      title: {
        de: "Forschungsgruppenleitung Cabin Design",
        en: "Research Group Leader Cabin Design",
      },
      year: "10/2021 - 09/2024",
      mainInfo: {
        de: "Lehrstuhl für Ergonomie (Prof. Dr. phil. Klaus Bengler), Technische Universität München (TUM), Garching",
        en: "Chair of Ergonomics (Prof. Dr. phil. Klaus Bengler), Technical University of Munich (TUM), Garching",
      },
      details: {
        de: "Themeninhalte der Forschungsgruppe sind die anthropometrisch, ergonomisch und klimatisch optimierte Auslegung von Fahrzeug- und Fluggerätkabinen.",
        en: "The research group focuses on the anthropometric, ergonomic, and climate-optimized design of vehicle and aircraft cabins.",
      },
    },
    {
      title: {
        de: "Wissenschaftlicher Mitarbeiter | Doktorand",
        en: "Research Associate | PhD Candidate",
      },
      year: "10/2019 - 09/2024",
      mainInfo: {
        de: "Lehrstuhl für Ergonomie (Prof. Dr. phil. Klaus Bengler), Technische Universität München (TUM), Garching",
        en: "Chair of Ergonomics (Prof. Dr. phil. Klaus Bengler), Technical University of Munich (TUM), Garching",
      },
      details: {
        de: "Entwicklung effizienter Klimatisierungskonzepte für hochautomatisierte Fahrzeuge hinsichtlich Energieverbrauch und thermischen Komforts. Auslegung benutzerfreundlicher und nachhaltiger Interieurs für neue Mobilitätssysteme.",
        en: "Development of efficient air conditioning concepts for highly automated vehicles regarding energy consumption and thermal comfort. Design of user-friendly and sustainable interiors for new mobility systems.",
      },
      dissertation: {
        de: "Objektive Bewertung von Klimatisierungskonzepten in HochAutomatisierten Fahrzeugen: Analyse von Methodiken zur Beurteilung des Thermischen Komforts",
        en: "Objective Evaluation of Air Conditioning Concepts in Highly Automated Vehicles: Analysis of Methods for Assessing Thermal Comfort",
      },
    },
    {
      title: {
        de: "Masterstudium Fahrzeug- und Motorentechnik",
        en: "Master's Degree in Automotive and Engine Technology",
      },
      year: "04/2017 - 06/2019",
      mainInfo: {
        de: "Technische Universität München (TUM), Garching",
        en: "Technical University of Munich (TUM), Garching",
      },
      details: {
        de: "Lehrstuhl für Ergonomie – Prof. Dr. phil. Klaus Bengler. Lehrstuhl für Umformtechnik und Gießereiwesen – Prof. Dr.-Ing Wolfram Volk.",
        en: "Chair of Ergonomics – Prof. Dr. phil. Klaus Bengler. Chair of Metal Forming and Casting – Prof. Dr.-Ing Wolfram Volk.",
      },
      masterarbeit: {
        de: "Entwicklung und Konstruktion eines innovativen Sitzklimatisierungskonzeptes",
        en: "Development and Design of an Innovative Seat Air Conditioning Concept",
      },
    },
    {
      title: {
        de: "Bachelorstudium Maschinenwesen",
        en: "Bachelor's Degree in Mechanical Engineering",
      },
      year: "10/2013 - 05/2017",
      mainInfo: {
        de: "Technische Universität München (TUM), Garching",
        en: "Technical University of Munich (TUM), Garching",
      },
      details: {
        de: "Lehrstuhl für Verbrennungskraftmaschinen – Prof. Dr.-Ing. Georg Wachtmeister.",
        en: "Chair of Internal Combustion Engines – Prof. Dr.-Ing. Georg Wachtmeister.",
      },
      bachelorarbeit: {
        de: "Charakterisierung und phänomenologische Beschreibung des Dual Fuel Brennverfahrens für die Anwendung in einem Erdgas-Großmotor",
        en: "Characterization and Phenomenological Description of the Dual Fuel Combustion Process for Application in a Large Natural Gas Engine",
      },
    },
  ],
  praktisch: [
    {
      title: {
        de: "Studentische Hilfskraft",
        en: "Student Assistant",
      },
      year: "01/2017 - 03/2018",
      mainInfo: {
        de: "Technische Universität München (TUM), Garching",
        en: "Technical University of Munich (TUM), Garching",
      },
      details: {
        de: "Lehrstuhl für Umformtechnik und Gießereiwesen – Prof. Dr.-Ing. Wolfram Volk. Zerstörungsfreie Prüfung hybrider Laminatbleche, Experimentelle und konstruktive Tätigkeiten im Bereich des Scherschneidens.",
        en: "Chair of Metal Forming and Casting – Prof. Dr.-Ing Wolfram Volk. Non-destructive testing of hybrid laminate sheets, experimental and constructive activities in the field of shear cutting.",
      },
      tools: "CATIA V5, Mahr- und Keyence Messtechnik",
    },
    {
      title: {
        de: "Ingenieurspraktikum",
        en: "Engineering Internship",
      },
      year: "04/2016 - 07/2016",
      mainInfo: {
        de: "Magna International, Shanghai, China",
        en: "Magna International, Shanghai, China",
      },
      details: {
        de: "Abteilung Body in White, Doors & Closures, Interior/Exterior. Entwicklung und Konstruktion von Struktur- und Außenhautbauteilen für OEM Fahrzeuge, Simulation von Türkinematiken.",
        en: "Department Body in White, Doors & Closures, Interior/Exterior. Development and design of structural and exterior components for OEM vehicles, simulation of door kinematics.",
      },
      tools: "CATIA V5",
    },
    {
      title: {
        de: "Ingenieurspraktikum",
        en: "Engineering Internship",
      },
      year: "03/2014 - 04/2014",
      mainInfo: {
        de: "Magna International, München",
        en: "Magna International, Munich",
      },
      details: {
        de: "Abteilung Unterflur und Konstruktion. Fehleranalyse und Konstruktion von Strukturelementen, Erstellung von Karosserieplänen der BMW X-Modelle.",
        en: "Department Underbody and Design. Error analysis and design of structural elements, creation of body plans for BMW X models.",
      },
      tools: "CATIA V5",
    },
    {
      title: {
        de: "Vorpraktikum",
        en: "Preliminary Internship",
      },
      year: "08/2013 - 09/2013",
      mainInfo: {
        de: "Magna Steyr Fahrzeugtechnik GmbH & Co. KG, Graz, Österreich",
        en: "Magna Steyr Fahrzeugtechnik GmbH & Co. KG, Graz, Austria",
      },
      details: {
        de: "Metallgrundausbildung, Durchlauf der gesamten Produktion der BMW MINI Modellreihe: Rohbau, Montage, Qualität und Planung.",
        en: "Basic metal training, run through the entire production of the BMW MINI model series: body shop, assembly, quality, and planning.",
      },
    },
  ],
  projekte: [
    {
      title: {
        de: "Forschung- und Entwicklung mit Industrie",
        en: "Research and Development with Industry",
      },
      year: "10/2019 - 09/2024",
      mainInfo: {
        de: "OEMs und Fahrzeugzulieferer (AUDI AG, BMW Group, Gentherm GmbH, ACGO Fendt GmbH)",
        en: "OEMs and Vehicle Suppliers (AUDI AG, BMW Group, Gentherm GmbH, ACGO Fendt GmbH)",
      },
      details: {
        de: "Durchführung von Probandenstudien in der Klimakammer des Fahrzeugprüfstandes, Analyse und Evaluation innovativer Klimatisierungskonzepte, objektive und subjektive Analyse des thermischen Komforts und Energieeffizienz, Anwendung neuer CFD-Methoden zur virtuellen Bewertung der thermischen Eigenschaften im Fahrzeuginnenraum und Abgleich des digitalen Zwillings mit Realversuchen, Konstruktion und additive Fertigung eines segmentierten Klimadummys sowie Aufbau einer anwendungsfähigen GUI in Python.",
        en: "Conducting subject studies in the climate chamber of the vehicle test bench, analysis and evaluation of innovative air conditioning concepts, objective and subjective analysis of thermal comfort and energy efficiency, application of new CFD methods for virtual evaluation of thermal properties in the vehicle interior and comparison of the digital twin with real experiments, design and additive manufacturing of a segmented climate dummy as well as development of a usable GUI in Python.",
      },
      tools: "CATIA V5, Python, CFD Software, 3D Druck, Statistik",
    },
    {
      title: {
        de: "UNICARagil",
        en: "UNICARagil",
      },
      year: "10/2019 - 05/2023",
      mainInfo: {
        de: "Förderprojekt BMBF",
        en: "BMBF Funded Project",
      },
      details: {
        de: "Im Rahmen des vom BMBF geförderten Projekts UNICARagil haben führende deutsche Universitäten und Industriepartner gemeinsam innovative modulare Architekturen für fahrerlose Fahrzeugkonzepte entwickelt. Die Aufgabenpakete umfassten die ergonomische Auslegung, Konstruktion und Fertigung des Innenraums eines autonomen Taxis. Hierbei wurde die anthropometrische Entwicklung unter Einsatz der digitalen Menschmodellierung RAMSIS durchgeführt.",
        en: "As part of the BMBF-funded UNICARagil project, leading German universities and industry partners jointly developed innovative modular architectures for driverless vehicle concepts. The task packages included the ergonomic design, construction, and manufacturing of the interior of an autonomous taxi. The anthropometric development was carried out using the digital human modeling RAMSIS.",
      },
      tools: "CATIA V5, RAMSIS, Rapid Prototyping",
    },
    {
      title: {
        de: "Slidecoaster",
        en: "Slidecoaster",
      },
      year: "10/2019 - 05/2021",
      mainInfo: {
        de: "Förderprojekt ZIM",
        en: "ZIM Funded Project",
      },
      details: {
        de: "Im Projekt Slidecoaster wurde im Rahmen des Innovationsprogramms ZIM in Zusammenarbeit mit der wiegand.waterrides GmbH ein neuartiges Wasserrutschen-System entwickelt, das zusammen mit einem innovativen Bootkonzept ein neuartiges Wasserparkerlebnis bieten soll. Hierbei wurde ein neues ergonomisches Sitzkonzept für ein optimales Beschleunigungsempfinden der Insassen entwickelt und getestet.",
        en: "In the Slidecoaster project, as part of the ZIM innovation program in cooperation with wiegand.waterrides GmbH, a novel water slide system was developed that, together with an innovative boat concept, is intended to offer a novel water park experience. A new ergonomic seating concept for optimal acceleration perception of the occupants was developed and tested.",
      },
      tools: "CATIA V5, RAMSIS, Rapid Prototyping",
    },
  ],
}

const veröffentlichungenContent = {
  paper: [
    {
      title: {
        de: "Thermal perception and response to overwarmed contact and surface heating on heat-sensitive-impaired individuals in a bmw vehicle environment",
        en: "Thermal perception and response to overwarmed contact and surface heating on heat-sensitive-impaired individuals in a bmw vehicle environment",
      },
      authors: "Kipp, M., Hoffmann, F., Koch, P., Glockner, M., & Bengler, K.",
      year: "2023",
      conference: "2023 IEEE International Conference on Systems, Man, and Cybernetics (SMC)",
      pages: "1396–1402",
      doi: "10.1109/SMC53992.2023.10394003",
    },
    {
      title: {
        de: "Evaluation of the seating environment of an autonomous taxi on user needs – an online survey investigation",
        en: "Evaluation of the seating environment of an autonomous taxi on user needs – an online survey investigation",
      },
      authors: "Kipp, M., Guo, C., & Bengler, K.",
      year: "2022",
      conference: "13th International Conference on Applied Human Factors and Ergonomics (AHFE 2022)",
      doi: "10.54941/ahfe1002439",
    },
    {
      title: {
        de: "Evaluation of an Active Cooling Seat Concept in terms of Vehicle Energy Consumption and Passengers' Thermal Comfort",
        en: "Evaluation of an Active Cooling Seat Concept in terms of Vehicle Energy Consumption and Passengers' Thermal Comfort",
      },
      authors: "Kipp, Manuel & Rolle, Andreas & Semmler-Sainsard, Siri & Bengler, Klaus",
      year: "2022",
      conference: {
        de: "Proceedings of the Ventilation 2022: 13th International Industrial Ventilation Conference for Contaminant Control, ASHRAE",
        en: "Proceedings of the Ventilation 2022: 13th International Industrial Ventilation Conference for Contaminant Control, ASHRAE",
      },
    },
    {
      title: {
        de: "An innovative seat ventilation concept: Does the seat provide overall thermal comfort in autonomous vehicles?",
        en: "An innovative seat ventilation concept: Does the seat provide overall thermal comfort in autonomous vehicles?",
      },
      authors: "Kipp, M., Rolle, A., & Bengler, K.",
      year: "2021",
      book: {
        de: "Proceedings of the 21st Congress of the International Ergonomics Association (IEA 2021)",
        en: "Proceedings of the 21st Congress of the International Ergonomics Association (IEA 2021)",
      },
      volume: "221",
      pages: "701–709",
      publisher: "Springer International Publishing",
      doi: "10.1007/978-3-030-74608-7-85",
    },
    {
      title: {
        de: "Requirements for an autonomous taxi and a resulting interior concept",
        en: "Requirements for an autonomous taxi and a resulting interior concept",
      },
      authors: "Kipp, M., Bubb, I., Schwiebacher, J., Schockenhoff, F., Koenig, A., & Bengler, K.",
      year: "2020",
      book: {
        de: "HCI International 2020—Posters",
        en: "HCI International 2020—Posters",
      },
      volume: "1226",
      pages: "374–381",
      publisher: "Springer International Publishing",
      doi: "10.1007/978-3-030-50732-9-50",
    },
  ],
  vorträge: [
    {
      title: {
        de: "Ergonomic Design of a Low-Cost Climate Dummy using RAMSIS: Method for Segmentation of Additive 3D Printed Parts",
        en: "Ergonomic Design of a Low-Cost Climate Dummy using RAMSIS: Method for Segmentation of Additive 3D Printed Parts",
      },
      author: "Kipp, Manuel",
      year: "2024",
      conference: "RAMSIS User Conference 2024",
      location: {
        de: "Kaiserslautern, Deutschland",
        en: "Kaiserslautern, Germany",
      },
    },
    {
      title: {
        de: "UNICARagil-User-Oriented Design of an Autonomous Shuttle Using Digital",
        en: "UNICARagil-User-Oriented Design of an Autonomous Shuttle Using Digital",
      },
      author: "Kipp, Manuel",
      year: "2024",
      conference: {
        de: "Fachtagung; 11. Tage der Ergonomie - ecn e.V.",
        en: "Symposium; 11th Days of Ergonomics - ecn e.V.",
      },
      location: {
        de: "Friedrichshafen, Deutschland",
        en: "Friedrichshafen, Germany",
      },
    },
    {
      title: {
        de: "RAMSIS for the Digital Design of a Climate Dummy in Highly Automated Vehicle Concepts",
        en: "RAMSIS for the Digital Design of a Climate Dummy in Highly Automated Vehicle Concepts",
      },
      author: "Kipp, Manuel",
      year: "2022",
      conference: "RAMSIS User Conference 2022",
      location: {
        de: "Kaiserslautern, Deutschland",
        en: "Kaiserslautern, Germany",
      },
    },
    {
      title: {
        de: "Evaluation of an Active Cooling Seat Concept in terms of Vehicle Energy Consumption and Passengers' Thermal Comfort",
        en: "Evaluation of an Active Cooling Seat Concept in terms of Vehicle Energy Consumption and Passengers' Thermal Comfort",
      },
      authors: "Kipp, Manuel & Semmler-Sainsard, Siri",
      year: "2022",
      conference: {
        de: "hdt Fachtagung Fahrzeugklimatisierung - Kühlen, Heizen und Komfort - Zukunftsorientierte Konzepte 2022",
        en: "hdt Symposium Vehicle Air Conditioning - Cooling, Heating and Comfort - Future-Oriented Concepts 2022",
      },
      location: {
        de: "Essen, Deutschland",
        en: "Essen, Germany",
      },
    },
  ],
}

// Sektionen für die Navigation
const sections = [
  { id: "über-mich", title: "Über mich" },
  { id: "skills", title: "Skills" },
  { id: "sprachen", title: "Sprachen" },
  { id: "industrieerfahrung", title: "Industrieerfahrung" },
  { id: "werdegang", title: "Werdegang" },
  { id: "veröffentlichungen", title: "Veröffentlichungen" },
  { id: "interessen", title: "Interessen" },
  { id: "kontakt", title: "Kontakt" },
  { id: "dokumente", title: "Dokumente und Links" },
]

// Aktualisierte Funktion zur Auswahl der Icons anhand des Skill-Namens
const getIcon = (skillName) => {
  if (skillName.includes("CATIA")) {
    return <FaCube />
  }
  if (skillName.includes("Python")) {
    return <FaPython />
  }
  if (skillName.includes("MATLAB")) {
    return <FaCalculator /> // Replaced SiMathworks with FaCalculator
  }
  if (skillName.includes("CFD")) {
    return <FaWind />
  }
  if (skillName.includes("Rapid Prototyping")) {
    return <FaTools />
  }
  if (skillName.includes("Microsoft Office")) {
    return <FaMicrosoft /> // Replaced SiMicrosoft with FaMicrosoft
  }
  return <FaTools />
}

/**
 * ----------------------------
 *     NEUER: DRAG-SLIDER (ProjectImageSlider)
 * ----------------------------
 */
const swipeConfidenceThreshold = 10000
const swipePowerCalc = (offset, velocity) => {
  return Math.abs(offset) * velocity
}

function ProjectImageSlider() {
  const [[page, direction], setPage] = useState([0, 0])
  const imageIndex = Math.abs(page % images.length)

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection])
  }

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  }

  const handleDragEnd = (event, info: PanInfo) => {
    const swipe = swipePowerCalc(info.offset.x, info.velocity.x)
    if (swipe < -swipeConfidenceThreshold) {
      paginate(1)
    } else if (swipe > swipeConfidenceThreshold) {
      paginate(-1)
    }
  }

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="relative h-[400px] mb-4 bg-gray-100 rounded-lg overflow-hidden">
        <motion.h3
          key={`title-${page}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 left-0 right-0 z-10 text-center text-lg font-semibold text-white bg-black bg-opacity-50 py-2 break-words md:break-normal"
        >
          {images[imageIndex].title}
        </motion.h3>
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={handleDragEnd}
          >
            <Image
              src={images[imageIndex].src || "/placeholder.svg"}
              alt={images[imageIndex].alt}
              fill
              className="object-contain rounded-lg"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              draggable="false"
            />
          </motion.div>
        </AnimatePresence>

        <Button
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10"
          size="icon"
          variant="ghost"
          onClick={() => paginate(-1)}
        >
          <ChevronLeft className="h-6 w-6" />
          <span className="sr-only">Previous image</span>
        </Button>

        <Button
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10"
          size="icon"
          variant="ghost"
          onClick={() => paginate(1)}
        >
          <ChevronRight className="h-6 w-6" />
          <span className="sr-only">Next image</span>
        </Button>
      </div>

      <div className="flex justify-center space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${index === imageIndex ? "bg-blue-600" : "bg-gray-300"}`}
            onClick={() => setPage([index, index > imageIndex ? 1 : -1])}
            aria-label={`Gehe zu Bild ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

/**
 * ----------------------------
 *     RESTLICHE KOMPONENTEN
 * ----------------------------
 */

const textContainerClass = "break-words md:break-normal overflow-hidden text-ellipsis"

const HobbiesSection = () => {
  const { language } = useLanguage()

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {hobbies.map((hobby, index) => (
        <motion.div
          key={typeof hobby.name === "string" ? hobby.name : hobby.name[language]}
          className="flex flex-col items-center bg-white p-4 rounded-lg shadow-md"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <motion.div
            className="text-3xl text-[#1a365d] mb-4"
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
          >
            {hobby.icon}
          </motion.div>
          <motion.p
            className={`text-lg font-medium text-[#1a365d] ${textContainerClass}`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.4 }}
          >
            {typeof hobby.name === "string" ? hobby.name : hobby.name[language]}
          </motion.p>
        </motion.div>
      ))}
    </div>
  )
}

const ContactSection = () => {
  const [isMessageSent, setIsMessageSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [honeypot, setHoneypot] = useState("")
  const [formLoadTime, setFormLoadTime] = useState<number>(0)
  const { t } = useLanguage()

  useEffect(() => {
    setFormLoadTime(Date.now())
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (honeypot) {
      console.log("[v0] Spam detected: honeypot field filled")
      toast({
        title: t("contact.errorMessageTitle"),
        description: t("contact.errorMessageDescription"),
        variant: "destructive",
      })
      return
    }

    const timeSinceLoad = Date.now() - formLoadTime
    if (timeSinceLoad < 3000) {
      console.log("[v0] Spam detected: form submitted too quickly")
      toast({
        title: t("contact.errorMessageTitle"),
        description: t("contact.errorMessageDescription"),
        variant: "destructive",
      })
      return
    }

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
      toast({
        title: t("contact.messageSentTitle"),
        description: t("contact.messageSentDescription"),
      })
      event.currentTarget.reset()
      setFormLoadTime(Date.now())
    } catch (error) {
      console.error("Error sending email:", error)
      toast({
        title: t("contact.errorMessageTitle"),
        description: t("contact.errorMessageDescription"),
        variant: "destructive",
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
            <h2 className={`text-2xl font-bold text-[#1a365d] ${textContainerClass}`}>{t("contact.getInTouch")}</h2>
            <p className={`text-[#1a365d] ${textContainerClass}`}>{t("contact.description")}</p>
          </div>
          <div className="flex items-center space-x-4">
            <FaEnvelope className="text-2xl text-[#1a365d]" />
            <a
              href="mailto:manuel-kipp95@hotmail.de"
              className={`text-[#1a365d] hover:underline ${textContainerClass}`}
            >
              manuel-kipp95@hotmail.de
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <FaMobileAlt className="text-2xl text-[#1a365d]" />
            <span className={`text-[#1a365d] ${textContainerClass}`}>+49 015789558680</span>
          </div>
          <div className="flex items-center space-x-4">
            <FaMapMarkerAlt className="text-2xl text-[#1a365d]" />
            <span className={`text-[#1a365d] ${textContainerClass}`}>München</span>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          {isMessageSent ? (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className={`font-bold ${textContainerClass}`}>{t("contact.thankYou")}</strong>
              <span className={`block sm:inline ${textContainerClass}`}> {t("contact.messageSent")}</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="absolute opacity-0 pointer-events-none" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="name" className={`block text-sm font-medium text-gray-700 ${textContainerClass}`}>
                  {t("contact.name")}
                </label>
                <Input type="text" id="name" name="name" required className="mt-1" />
              </div>
              <div>
                <label htmlFor="email" className={`block text-sm font-medium text-gray-700 ${textContainerClass}`}>
                  {t("contact.email")}
                </label>
                <Input type="email" id="email" name="email" required className="mt-1" />
              </div>
              <div>
                <label htmlFor="subject" className={`block text-sm font-medium text-gray-700 ${textContainerClass}`}>
                  {t("contact.subject")}
                </label>
                <Input type="text" id="subject" name="subject" required className="mt-1" />
              </div>
              <div>
                <label htmlFor="message" className={`block text-sm font-medium text-gray-700 ${textContainerClass}`}>
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

const ErfahrungBlock = ({ title, content }) => {
  const { t, language } = useLanguage()
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <h3 className={`text-2xl font-semibold text-[#1a365d] mb-4 leading-relaxed py-1 ${textContainerClass}`}>
        {title}
      </h3>
      {content.map((item, index) => (
        <Accordion type="single" collapsible className="w-full mb-4" key={index}>
          <AccordionItem value={`item-${index}`}>
            <AccordionTrigger
              className={`text-lg font-medium text-[#1a365d] flex justify-between items-center ${textContainerClass}`}
            >
              <div className="flex items-center w-full">
                <span className="text-base text-gray-500 mr-4 whitespace-nowrap">{item.year}</span>
                <span className={`text-left ${textContainerClass}`}>
                  {typeof item.title === "string" ? item.title : item.title[language]}
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              {item.mainInfo && (
                <p className={`text-[#1a365d] mt-2 flex items-center text-base ${textContainerClass}`}>
                  <FaMapMarkerAlt className="mr-2 flex-shrink-0" />
                  <span>{typeof item.mainInfo === "string" ? item.mainInfo : item.mainInfo[language]}</span>
                </p>
              )}
              {item.details && (
                <p className={`text-[#1a365d] mt-2 flex items-start text-base ${textContainerClass}`}>
                  <FaInfoCircle className="mr-2 mt-1 flex-shrink-0" />
                  <span>{typeof item.details === "string" ? item.details : item.details[language]}</span>
                </p>
              )}
              {item.tools && (
                <p className={`text-[#1a365d] mt-2 text-base ${textContainerClass}`}>
                  <strong>{language === "de" ? "Werkzeuge" : "Tools"}:</strong> {item.tools}
                </p>
              )}
              {item.authors && (
                <p className={`text-[#1a365d] mt-2 text-base ${textContainerClass}`}>
                  <strong>{language === "de" ? "Autoren" : "Authors"}:</strong> {item.authors}
                </p>
              )}
              {item.author && (
                <p className={`text-[#1a365d] mt-2 text-base ${textContainerClass}`}>
                  <strong>{language === "de" ? "Autor" : "Author"}:</strong> {item.author}
                </p>
              )}
              {item.conference && (
                <p className={`text-[#1a365d] mt-2 text-base ${textContainerClass}`}>
                  <strong>{language === "de" ? "Konferenz" : "Conference"}:</strong>{" "}
                  {typeof item.conference === "string" ? item.conference : item.conference[language]}
                </p>
              )}
              {item.book && (
                <p className={`text-[#1a365d] mt-2 text-base ${textContainerClass}`}>
                  <strong>{language === "de" ? "Buch" : "Book"}:</strong>{" "}
                  {typeof item.book === "string" ? item.book : item.book[language]}
                </p>
              )}
              {item.volume && (
                <p className={`text-[#1a365d] mt-2 text-base ${textContainerClass}`}>
                  <strong>{language === "de" ? "Band" : "Volume"}:</strong> {item.volume}
                </p>
              )}
              {item.pages && (
                <p className={`text-[#1a365d] mt-2 text-base ${textContainerClass}`}>
                  <strong>{language === "de" ? "Seiten" : "Pages"}:</strong> {item.pages}
                </p>
              )}
              {item.publisher && (
                <p className={`text-[#1a365d] mt-2 text-base ${textContainerClass}`}>
                  <strong>{language === "de" ? "Verlag" : "Publisher"}:</strong> {item.publisher}
                </p>
              )}
              {item.location && (
                <p className={`text-[#1a365d] mt-2 text-base ${textContainerClass}`}>
                  <strong>{language === "de" ? "Ort" : "Location"}:</strong>{" "}
                  {typeof item.location === "string" ? item.location : item.location[language]}
                </p>
              )}
              {item.doi && (
                <p className={`text-[#1a365d] mt-2 text-base ${textContainerClass}`}>
                  <strong>DOI:</strong>{" "}
                  <a
                    href={`https://doi.org/${item.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-blue-600 hover:underline ${textContainerClass}`}
                  >
                    {item.doi}
                  </a>
                </p>
              )}
              {item.dissertation && (
                <p className={`text-[#1a365d] mt-2 text-base ${textContainerClass}`}>
                  <strong>{language === "de" ? "Dissertation" : "Dissertation"}:</strong>{" "}
                  {typeof item.dissertation === "string" ? item.dissertation : item.dissertation[language]}
                </p>
              )}
              {item.masterarbeit && (
                <p className={`text-[#1a365d] mt-2 text-base ${textContainerClass}`}>
                  <strong>{language === "de" ? "Masterarbeit" : "Master's Thesis"}:</strong>{" "}
                  {typeof item.masterarbeit === "string" ? item.masterarbeit : item.masterarbeit[language]}
                </p>
              )}
              {item.bachelorarbeit && (
                <p className={`text-[#1a365d] mt-2 text-base ${textContainerClass}`}>
                  <strong>{language === "de" ? "Bachelorarbeit" : "Bachelor's Thesis"}:</strong>{" "}
                  {typeof item.bachelorarbeit === "string" ? item.bachelorarbeit : item.bachelorarbeit[language]}
                </p>
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  )
}

// Hauptkomponente
const Home: React.FC = () => {
  const { scrollY } = useScroll()
  const opacity = useTransform(scrollY, [0, 300], [1, 0])
  const { t, language, setLanguage } = useLanguage()

  const [isScrolled, setIsScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const sectionRefs = useRef({})

  // Navigation – nur Sektionen (ohne "Sprachen" und "Dokumente")
  const navigationSections = sections.filter((section) => section.id !== "sprachen" && section.id !== "dokumente")

  // Intersection Observer
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -80% 0px",
      threshold: 0,
    }
    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }
    const observer = new IntersectionObserver(observerCallback, observerOptions)
    sections.forEach((section) => {
      const element = document.getElementById(section.id)
      if (element) observer.observe(element)
    })
    return () => observer.disconnect()
  }, [])

  // Scroll-Listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId)
    if (section) section.scrollIntoView({ behavior: "smooth" })
    setIsMenuOpen(false)
  }

  // Vertikale Navigation
  const VerticalNavigation = () => (
    <div
      className="fixed right-4 top-1/2 transform -translate-y-1/2 flex flex-col items-center z-40"
      style={{ height: "40vh", justifyContent: "space-between" }}
    >
      {navigationSections.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className={`w-3 h-3 rounded-full transition-all duration-300 ${
            activeSection === section.id ? "bg-blue-500 w-4 h-4" : "bg-gray-300 hover:bg-blue-300"
          }`}
          aria-label={`Navigiere zu ${section.title}`}
          onClick={(e) => {
            e.preventDefault()
            scrollToSection(section.id)
          }}
        />
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 relative">
      <Header />
      {/* Statischer Hintergrund */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0 z-0 opacity-10"
          style={{
            backgroundImage:
              'url("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/pexels-photo-1166602.jpg-7zqpCiz5UoohzGC5xrSeeQbGzwRy7i.jpeg")',
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed",
          }}
        />
        <motion.div className="absolute inset-0 bg-white/10 z-10" style={{ opacity }} />
      </div>

      {/* Scrollbarer Inhalt */}
      <div className="relative z-20">
        {/* Hero / Header-Bereich */}
        <section className="min-h-screen pt-20 relative overflow-hidden flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-1">
            <motion.div
              className="flex flex-col justify-center"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className={`text-4xl font-bold text-[#1a365d] mb-6 tracking-normal name-title ${textContainerClass}`}>
                <span className="inline-block px-1">Manuel Kipp</span>
              </h2>
              <p className={`text-xl md:text-2xl text-[#1a365d] leading-relaxed ${textContainerClass}`}>
                {t("jobTitles.engineer")}
              </p>
              <p className={`text-lg md:text-xl text-[#1a365d] mt-4 opacity-80 ${textContainerClass}`}>
                {t("jobTitles.phd")}
              </p>
              <div className="flex space-x-4 mt-6">
                <a
                  href="https://www.linkedin.com/in/manuel-kipp-09624b174"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-2xl md:text-3xl text-[#1a365d] hover:text-[#2a4a7f] ${textContainerClass}`}
                >
                  <FaLinkedin />
                </a>
                <a
                  href="mailto:manuel-kipp95@hotmail.de"
                  className={`text-2xl md:text-3xl text-[#1a365d] hover:text-[#2a4a7f] ${textContainerClass}`}
                >
                  <FaEnvelope />
                </a>
                <a
                  href="https://www.mec.ed.tum.de/lfe/team/kipp/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-2xl md:text-3xl text-[#1a365d] hover:text-[#2a4a7f] ${textContainerClass}`}
                >
                  <FaUniversity />
                </a>
                <a
                  href="https://www.researchgate.net/profile/Manuel-Kipp"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-2xl md:text-3xl text-[#1a365d] hover:text-[#2a4a7f] ${textContainerClass}`}
                >
                  <FaResearchgate />
                </a>
              </div>
              <Button onClick={() => scrollToSection("über-mich")} className={`mt-6 w-40 ${textContainerClass}`}>
                {t("Learn More")} <FaChevronDown className="ml-2" />
              </Button>
            </motion.div>
            <motion.div
              className="relative w-full flex justify-center items-center mt-8 md:mt-0"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-full max-w-md">
                <Image
                  src="https://urlyaqdfmocz1d9x.public.blob.vercel-storage.com/ManuelKipp%202-x62cKUq1sJ939s6jYn9RcH0auWTPf5.png"
                  alt="Manuel Kipp Portrait"
                  width={400}
                  height={533}
                  className="rounded-lg shadow-lg"
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Restlicher Inhalt */}
        <main className="space-y-0 pb-12">
          {/* Über mich */}
          <div className="relative">
            <TransparentDivider />
            <section
              id="über-mich"
              ref={(el) => (sectionRefs.current["über-mich"] = el)}
              className="w-full py-16 flex flex-col items-center justify-center relative bg-blue-50"
            >
              <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center mb-8">
                  <div className="hidden md:block"></div>
                  <div className="flex items-center justify-center w-full md:hidden">
                    <FaCog className="text-4xl text-[#1a365d] mr-4" />
                    <h2
                      className={`text-3xl md:text-4xl font-semibold text-[#1a365d] text-center leading-relaxed py-1 ${textContainerClass}`}
                    >
                      {t("aboutMe.title")}
                    </h2>
                    <GiRaceCar className="text-4xl text-[#1a365d] ml-4" />
                  </div>
                </div>
                <div className="text-lg">
                  <div className="hidden md:flex items-start space-x-8">
                    <div className="w-1/4 flex-shrink-0 relative group">
                      <div className="w-32 h-32 relative">
                        <motion.div
                          className="absolute inset-0"
                          initial={{ rotate: 0 }}
                          whileInView={{ rotate: 360 }}
                          viewport={{ once: true }}
                          transition={{ duration: 2, ease: "linear" }}
                        >
                          <FaCog className="text-9xl text-[#1a365d]" />
                        </motion.div>
                        <motion.div
                          className="absolute top-2 left-10"
                          initial={{ rotate: 0 }}
                          whileInView={{ rotate: -360 }}
                          viewport={{ once: true }}
                          transition={{ duration: 2, ease: "linear" }}
                        >
                          <FaCog className="text-8xl text-[#2a4a7f]" />
                        </motion.div>
                        <motion.div
                          className="absolute -bottom-64 -left-4"
                          initial={{ x: -100, opacity: 0 }}
                          whileInView={{ x: 0, opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeOut", delay: 1.0 }}
                        >
                          <GiRaceCar className="text-9xl text-[#1a365d]" />
                        </motion.div>
                        <motion.div
                          className="absolute -bottom-[500px] left-4"
                          initial={{ scale: 0.8, opacity: 0 }}
                          whileInView={{ scale: [1, 1.2, 1], opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, ease: "easeInOut", delay: 1.5, times: [0, 0.5, 1] }}
                        >
                          <FaCube className="text-8xl text-[#2a4a7f]" />
                        </motion.div>
                      </div>
                    </div>
                    <div className="w-3/4">
                      <h2
                        className={`text-3xl md:text-4xl font-semibold text-[#1a365d] mb-6 leading-relaxed ${textContainerClass}`}
                      >
                        {t("aboutMe.title")}
                      </h2>
                      <p className={`text-foreground text-justify mb-4 ${textContainerClass}`}>
                        {t("aboutMe.paragraph1")}
                      </p>
                      <p className={`text-foreground text-justify mb-4 ${textContainerClass}`}>
                        {t("aboutMe.paragraph2")}
                      </p>
                      <p className={`text-foreground text-justify mb-4 ${textContainerClass}`}>
                        {t("aboutMe.paragraph3")}
                      </p>
                      <p className={`text-foreground text-justify ${textContainerClass}`}>{t("aboutMe.paragraph4")}</p>
                    </div>
                  </div>
                  <div className="md:hidden">
                    <p className={`text-foreground text-justify mb-4 ${textContainerClass}`}>
                      {t("aboutMe.paragraph1")}
                    </p>
                    <p className={`text-foreground text-justify mb-4 ${textContainerClass}`}>
                      {t("aboutMe.paragraph2")}
                    </p>
                    <p className={`text-foreground text-justify mb-4 ${textContainerClass}`}>
                      {t("aboutMe.paragraph3")}
                    </p>
                    <p className={`text-foreground text-justify ${textContainerClass}`}>{t("aboutMe.paragraph4")}</p>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Skills */}
          <div className="relative">
            <TransparentDivider />
            <section
              id="skills"
              ref={(el) => (sectionRefs.current["skills"] = el)}
              className="w-full py-16 flex flex-col items-center justify-center relative bg-gray-100"
            >
              <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                <h2
                  className={`text-3xl md:text-4xl font-semibold text-[#1a365d] mb-12 text-center leading-relaxed py-1 ${textContainerClass}`}
                >
                  {t("skills.title")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {skills.map((skill, index) => (
                    <motion.div
                      key={index}
                      className="flex flex-col bg-gray-50 p-6 rounded-lg shadow-md"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <div className="flex items-center space-x-4 mb-4">
                        <span className="text-3xl text-[#1a365d]">
                          {getIcon(typeof skill.name === "string" ? skill.name : skill.name[language])}
                        </span>
                        <p className={`text-lg text-[#1a365d] font-medium ${textContainerClass}`}>
                          {typeof skill.name === "string" ? skill.name : skill.name[language]}
                        </p>
                      </div>
                      <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          className="absolute top-0 left-0 h-full bg-blue-600 rounded-full"
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.percentage}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, ease: "easeInOut" }}
                        />
                      </div>
                      <p className={`text-sm text-gray-600 mt-2 ${textContainerClass}`}>
                        {skill.years} {language === "de" ? "Jahre" : "years"}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Sprachen */}
          <div className="relative">
            <TransparentDivider />
            <section
              id="sprachen"
              ref={(el) => (sectionRefs.current["sprachen"] = el)}
              className="w-full py-16 flex flex-col items-center justify-center relative bg-blue-50"
            >
              <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                <h2
                  className={`text-3xl md:text-4xl font-semibold text-[#1a365d] mb-12 text-center leading-relaxed py-1 ${textContainerClass}`}
                >
                  {t("languages.title")}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {languages.map((lang, index) => (
                    <motion.div
                      key={index}
                      className="flex flex-col items-center bg-white rounded-lg shadow-md p-6"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                    >
                      <div className="relative w-32 h-32">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                          <path
                            d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#e6e6e6"
                            strokeWidth="3"
                          />
                          <motion.path
                            d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="3"
                            initial={{ pathLength: 0 }}
                            whileInView={{ pathLength: lang.percentage / 100 }}
                            viewport={{ once: true }}
                            transition={{ duration: 2, ease: "easeInOut" }}
                          />
                        </svg>
                        <div
                          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center ${textContainerClass}`}
                        >
                          <div className={`text-xl font-semibold ${textContainerClass}`}>{lang.level}</div>
                        </div>
                      </div>
                      <p className={`mt-4 text-lg font-medium ${textContainerClass}`}>{lang.name[language]}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </section>
          </div>

          {/* Industrieerfahrung */}
          <div className="relative">
            <TransparentDivider />
            <section
              id="industrieerfahrung"
              ref={(el) => (sectionRefs.current["industrieerfahrung"] = el)}
              className="w-full py-16 flex flex-col items-center justify-center relative bg-gray-100"
            >
              <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                <h2
                  className={`text-3xl md:text-4xl font-semibold text-[#1a365d] mb-12 text-center leading-relaxed py-1 ${textContainerClass}`}
                >
                  {t("industryExperience.title")}
                </h2>
                <div className="space-y-6">
                  {/* Firmenlogos */}
                  <motion.div
                    className="bg-white rounded-lg shadow-lg p-8 relative"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="absolute top-4 right-4 text-xs text-gray-500 italic">
                      {language === "de" ? "Quelle: Google Bilder" : "Source: Google Images"}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 items-center justify-items-center">
                      {[
                        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Audi_logo-4A5eTiHxrmFhmweoRIaLFyFg5rwKSZ.svg",
                        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/BMW-5p8A8AhmwjnZ7O8mCAe4DjInQkh8yl.svg",
                        "https://urlyaqdfmocz1d9x.public.blob.vercel-storage.com/logo%20fendt-0YxhORcYwjylvclVGIvu4p7OwYtmA2.svg",
                        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/DLR_Logo-T9u28wHPz9qsEtcrjVoqe5a9YDSW2h.svg",
                        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/logo%20gentherm-uqlWTPpNljtgID876PsaFerjShMQhX.png",
                      ].map((src, index) => (
                        <motion.div
                          key={src}
                          className="flex flex-col items-center"
                          initial={{ opacity: 0, x: -50 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          <Image
                            src={src || "/placeholder.svg"}
                            alt={`Company Logo ${index + 1}`}
                            width={150}
                            height={75}
                            className="object-contain hover:scale-110 transition-transform duration-200"
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                  {/* Projekte */}
                  <ErfahrungBlock title={t("industryExperience.projects")} content={erfahrungContent.projekte} />
                  {/* Slider mit Projektbildern */}
                  <div className="bg-white rounded-lg shadow-lg p-8 mt-6">
                    <h3 className={`text-xl font-semibold text-[#1a365d] mb-4 ${textContainerClass}`}>
                      {t("industryExperience.projectImages")}
                    </h3>
                    <ProjectImageSlider />
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Werdegang */}
          <div className="relative">
            <TransparentDivider />
            <section
              id="werdegang"
              ref={(el) => (sectionRefs.current["werdegang"] = el)}
              className="w-full py-16 flex flex-col items-center justify-center relative bg-blue-50"
            >
              <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                <h2
                  className={`text-3xl md:text-4xl font-semibold text-[#1a365d] mb-12 text-center leading-relaxed py-1 ${textContainerClass}`}
                >
                  {t("career.title")}
                </h2>
                <div className="space-y-6">
                  <ErfahrungBlock title={t("career.academic")} content={erfahrungContent.akademisch} />
                  <ErfahrungBlock title={t("career.practical")} content={erfahrungContent.praktisch} />
                </div>
              </div>
            </section>
          </div>

          {/* Veröffentlichungen */}
          <div className="relative">
            <TransparentDivider />
            <section
              id="veröffentlichungen"
              ref={(el) => (sectionRefs.current["veröffentlichungen"] = el)}
              className="w-full py-16 flex flex-col items-center justify-center relative bg-gray-100"
            >
              <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                <h2
                  className={`text-3xl md:text-4xl font-semibold text-[#1a365d] mb-12 text-center leading-relaxed py-1 ${textContainerClass}`}
                >
                  {t("publications.title")}
                </h2>
                <div className="space-y-6">
                  <ErfahrungBlock title={t("publications.paper")} content={veröffentlichungenContent.paper} />
                  <ErfahrungBlock title={t("publications.talks")} content={veröffentlichungenContent.vorträge} />
                </div>
              </div>
            </section>
          </div>

          {/* Interessen */}
          <div className="relative">
            <TransparentDivider />
            <section
              id="interessen"
              ref={(el) => (sectionRefs.current["interessen"] = el)}
              className="w-full py-16 flex flex-col items-center justify-center relative bg-blue-50"
            >
              <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                <h2
                  className={`text-3xl md:text-4xl font-semibold text-[#1a365d] mb-12 text-center leading-relaxed py-1 ${textContainerClass}`}
                >
                  {t("interests.title")}
                </h2>
                <div className="bg-white/50 rounded-lg shadow-md p-8">
                  <HobbiesSection />
                </div>
              </div>
            </section>
          </div>

          {/* Kontakt */}
          <div className="relative">
            <TransparentDivider />
            <section
              id="kontakt"
              ref={(el) => (sectionRefs.current["kontakt"] = el)}
              className="w-full py-16 flex flex-col items-center justify-center relative bg-gray-100"
            >
              <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                <h2
                  className={`text-3xl md:text-4xl font-semibold text-[#1a365d] mb-12 text-center leading-relaxed py-1 ${textContainerClass}`}
                >
                  {t("contact.title")}
                </h2>
                <ContactSection />
              </div>
            </section>
          </div>

          {/* Dokumente und Links */}
          <div className="relative">
            <TransparentDivider />
            <section
              id="dokumente"
              ref={(el) => (sectionRefs.current["dokumente"] = el)}
              className="w-full py-16 flex flex-col items-center justify-center relative bg-blue-50"
            >
              <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                <h2
                  className={`text-3xl md:text-4xl font-semibold text-[#1a365d] mb-12 text-center leading-relaxed py-1 ${textContainerClass}`}
                >
                  {t("documents.title")}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <Button asChild size="lg" className="w-full">
                    <a
                      href={
                        language === "en"
                          ? "https://urlyaqdfmocz1d9x.public.blob.vercel-storage.com/cv_ManuelKipp_wiss_en2_signed-FlzrIhXcNmiOiROs9wF8kqqgN2pgdt.pdf"
                          : "https://urlyaqdfmocz1d9x.public.blob.vercel-storage.com/cv_ManuelKipp_wiss2_signed-Ll0YBORKdoptEr8mgBFCFwpA7jFWK3.pdf"
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center ${textContainerClass}`}
                    >
                      <FaFileAlt className="mr-2" />
                      {t("documents.downloadCV")}
                    </a>
                  </Button>
                  <Button asChild size="lg" className="w-full">
                    <a
                      href="https://www.linkedin.com/in/manuel-kipp-09624b174"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center ${textContainerClass}`}
                    >
                      <FaLinkedin className="mr-2" />
                      LinkedIn
                    </a>
                  </Button>
                  <Button asChild size="lg" className="w-full">
                    <a
                      href="https://www.mec.ed.tum.de/lfe/team/kipp/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center ${textContainerClass}`}
                    >
                      <FaUniversity className="mr-2" />
                      TUM Profil
                    </a>
                  </Button>
                  <Button asChild size="lg" className="w-full">
                    <a
                      href="https://www.researchgate.net/profile/Manuel-Kipp"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center ${textContainerClass}`}
                    >
                      <FaResearchgate className="mr-2" />
                      ResearchGate
                    </a>
                  </Button>
                  <Button asChild size="lg" className="w-full">
                    <a
                      href="https://github.com/ClimateVizCoder/ClimateVizCoder"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center justify-center ${textContainerClass}`}
                    >
                      <FaGithub className="mr-2" />
                      GitHub
                    </a>
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </main>

        {/* Footer */}
        <footer className={`bg-[#1a365d] text-white py-4 text-center relative z-20 ${textContainerClass}`}>
          <p>&copy; {new Date().getFullYear()} Manuel Kipp. Alle Rechte vorbehalten.</p>
        </footer>
      </div>
      <VerticalNavigation />
      <CookieBanner />
    </div>
  )
}

export default Home
