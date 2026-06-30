"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, type PanInfo, useScroll, useTransform } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import emailjs from "@emailjs/browser"
import {
  FaCube,
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
  FaFileAlt,
  FaResearchgate,
  FaMapMarkerAlt,
  FaMobileAlt,
  FaCog,
} from "react-icons/fa"
import { GiMountainClimbing, GiSoccerBall, GiRaceCar } from "react-icons/gi"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
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

// Hervorgehobene Kernkompetenz (Spitzen-Skill)
const featuredSkill = {
  name: { de: "Rapid Prototyping & 3D-Druck", en: "Rapid Prototyping & 3D Printing" },
  tagline: {
    de: "Vom CAD-Konzept zum funktionsfähigen Klimadummy – additive Fertigung als Kernhandwerk.",
    en: "From CAD concept to a functional thermal dummy — additive manufacturing as a core craft.",
  },
}

// Skills als Tag-Grid: Primär (Kernkompetenzen) und Sekundär (ergänzend)
const primarySkills = ["STAR-CCM+", "Ansys CFX/FLUENT", "Python (ML/Data)", "MATLAB/Simulink", "CATIA V5", "RAMSIS"]

const secondarySkills = [{ de: "Microsoft Office", en: "Microsoft Office" }]

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
  berufserfahrung: [
    {
      title: {
        de: "ILS Manager (Integrated Logistic Support)",
        en: "ILS Manager (Integrated Logistic Support)",
      },
      year: "08/2026 - Heute",
      active: true,
      parallel: true,
      mainInfo: {
        de: "KNDS Deutschland, München, Bayern, Deutschland",
        en: "KNDS Deutschland, Munich, Bavaria, Germany",
      },
      details: {
        de: "Verantwortung für den Integrated Logistic Support (ILS) komplexer Verteidigungs- und Großsysteme: Planung, Steuerung und Koordination logistischer Unterstützungskonzepte über den gesamten Produktlebenszyklus. Schnittstelle zwischen Engineering, Instandhaltung, Ersatzteilmanagement und Kunde.",
        en: "Responsible for the Integrated Logistic Support (ILS) of complex defense and large-scale systems: planning, steering, and coordination of logistic support concepts across the entire product life cycle. Interface between engineering, maintenance, spare parts management, and the customer.",
      },
    },
    {
      title: {
        de: "Gründer & Experte | Thermischer Komfort & Thermomanagement (HVAC)",
        en: "Founder & Expert | Thermal Comfort & Thermal Management (HVAC)",
      },
      year: "05/2025 - Heute",
      active: true,
      parallel: true,
      mainInfo: {
        de: "ThermalNext, München, Bayern, Deutschland (Hybrid)",
        en: "ThermalNext, Munich, Bavaria, Germany (Hybrid)",
      },
      details: {
        de: "ThermalNext bietet innovative Lösungen im Bereich thermischer Komfort. Unser Fokus liegt auf: Klimadummys & Messsysteme zur objektiven Bewertung thermischen Komforts (Fahrzeuge, eVTOLs, Gebäude), Virtuelle Simulation & KI-Regelung für HVAC- und Energiemanagementsysteme, Komfortorientierte Regelstrategien für mobile und stationäre Anwendungen, Beratung & Projektleitung bei der Integration moderner Thermomanagement-Lösungen. Mit ThermalNext unterstütze ich Unternehmen aus der Automobilbranche, Luftfahrt, Bahntechnik und dem Gebäudesektor, ihre Produkte und Systeme effizienter, komfortabler und nachhaltiger zu gestalten.",
        en: "ThermalNext offers innovative solutions in the field of thermal comfort. Our focus is on: Climate dummies & measurement systems for objective evaluation of thermal comfort (vehicles, eVTOLs, buildings), Virtual simulation & AI control for HVAC and energy management systems, Comfort-oriented control strategies for mobile and stationary applications, Consulting & project management for the integration of modern thermal management solutions. With ThermalNext, I support companies from the automotive, aviation, rail technology, and building sectors to make their products and systems more efficient, comfortable, and sustainable.",
      },
      website: "www.thermalnext.de",
      logo: "/images/thermalnext-logo.png",
    },
    {
      title: {
        de: "Technischer & Kaufmännischer Leiter",
        en: "Technical & Commercial Manager",
      },
      year: "08/2025 - 12/2025",
      mainInfo: {
        de: "Franz Wurm GmbH, Metropolregion München",
        en: "Franz Wurm GmbH, Munich Metropolitan Area",
      },
      details: {
        de: "Die Franz Wurm GmbH ist ein mittelständisches Bauunternehmen im Bereich Rohrleitungs- und Tiefbau (Gas, Wasser, Fernwärme, Kabel). Als Technischer & Kaufmännischer Leiter verantworte ich: Digitalisierung und Optimierung zentraler Prozesse (BPS Bau, Kalkulation, Nachkalkulation, Aufmaß), Einsatz digitaler Tools & KI zur Prozessoptimierung (z. B. Aufmaßerfassung, Zeiterfassung, AMS/BMS), Kosten- und Prozessanalyse inkl. Controlling (Maschinen, Kolonnen, Subunternehmer, Entsorgung), Datenschutz.",
        en: "Franz Wurm GmbH is a medium-sized construction company specializing in pipeline and civil engineering (gas, water, district heating, cables). As Technical & Commercial Manager, I am responsible for: Digitalization and optimization of core processes (BPS construction, calculation, post-calculation, measurement), implementation of digital tools & AI for process optimization (e.g., measurement recording, time tracking, AMS/BMS), cost and process analysis including controlling (machinery, crews, subcontractors, disposal), data protection.",
      },
    },
  ],
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
        de: "Data-Driven Climate Control in Autonomous Electric Vehicles: A Machine Learning Approach to Thermal Comfort and Energy Use",
        en: "Data-Driven Climate Control in Autonomous Electric Vehicles: A Machine Learning Approach to Thermal Comfort and Energy Use",
      },
      authors: "Kipp, M., Wang, R., Schmeling, D., Sheng, Y., & Bengler, K.",
      year: "2026",
      conference: "Building and Environment, Article 114662",
      doi: "10.1016/j.buildenv.2026.114662",
    },
    {
      title: {
        de: "Optimizing Thermal Comfort in Highly Automated Vehicles: An AI-Based HVAC Management Approach with Radiant Panels for Winter Conditions",
        en: "Optimizing Thermal Comfort in Highly Automated Vehicles: An AI-Based HVAC Management Approach with Radiant Panels for Winter Conditions",
      },
      authors: "Kipp, M., Wang, R., & Bengler, K.",
      year: "2026",
      conference: "Energy and Buildings, 357, Article 117113",
      doi: "10.1016/j.enbuild.2026.117113",
    },
    {
      title: {
        de: "Thermal Dummy for Highly Automated Vehicles: Segmentation-Focused CAD Design, Additive Manufacturing and CFD Model",
        en: "Thermal Dummy for Highly Automated Vehicles: Segmentation-Focused CAD Design, Additive Manufacturing and CFD Model",
      },
      authors: "Kipp, M., Khdir, B. M., Sheng, Y., & Bengler, K.",
      year: "2026",
      conference: "Results in Engineering, 30, Article 110455",
      doi: "10.1016/j.rineng.2026.110455",
    },
    {
      title: {
        de: "Adapting DIN EN ISO 14505-2 for Thermal Comfort Assessment in Highly Automated Vehicle Cabins: Effects of Occupant Posture and In-Vehicle Activity on Equivalent-Temperature Comfort Zones",
        en: "Adapting DIN EN ISO 14505-2 for Thermal Comfort Assessment in Highly Automated Vehicle Cabins: Effects of Occupant Posture and In-Vehicle Activity on Equivalent-Temperature Comfort Zones",
      },
      authors: "Kipp, M., & Bengler, K.",
      year: "2026",
      conference: "Indoor Environments, 3(2), Article 100173",
      doi: "10.1016/j.indenv.2026.100173",
    },
    {
      title: {
        de: "Applicability of DIN ISO 14505-2 in short-term Neutral Thermal Comfort Assessment for Highly Automated Vehicles",
        en: "Applicability of DIN ISO 14505-2 in short-term Neutral Thermal Comfort Assessment for Highly Automated Vehicles",
      },
      authors: "Kipp, M., Beji, C., & Bengler, K.",
      year: "2026",
      conference: "IEEE Access",
      doi: "10.1109/ACCESS.2026.3677680",
    },
    {
      title: {
        de: "Thermal Comfort in Autonomous Vehicles: A Survey Study on Activity-Based Preferences and Climate Control Strategies",
        en: "Thermal Comfort in Autonomous Vehicles: A Survey Study on Activity-Based Preferences and Climate Control Strategies",
      },
      authors: "Kipp, M., Sheng, Y., Sözbir, A., & Bengler, K.",
      year: "2026",
      book: {
        de: "HCI International 2025 – Late Breaking Papers (HCII 2025), CCIS 2772, Springer",
        en: "HCI International 2025 – Late Breaking Papers (HCII 2025), CCIS 2772, Springer",
      },
      pages: "15–26",
      doi: "10.1007/978-3-032-12767-9_2",
    },
    {
      title: {
        de: "An Objective Analysis of Using Infrared Panels for Thermal Comfort Assessments in a Vehicle Environment",
        en: "An Objective Analysis of Using Infrared Panels for Thermal Comfort Assessments in a Vehicle Environment",
      },
      authors: "Kipp, M., Jacobs, J., & Bengler, K.",
      year: "2025",
      conference: "IEEE Access, 13",
      pages: "199247–199266",
      doi: "10.1109/ACCESS.2025.3626693",
    },
    {
      title: {
        de: "Thermal Perception and Response to Overwarmed Contact and Surface Heating on Heat-Sensitive-Impaired Individuals in a BMW Vehicle Environment",
        en: "Thermal Perception and Response to Overwarmed Contact and Surface Heating on Heat-Sensitive-Impaired Individuals in a BMW Vehicle Environment",
      },
      authors: "Kipp, M., Hoffmann, F., Koch, P., Glockner, M., & Bengler, K.",
      year: "2023",
      conference: "2023 IEEE International Conference on Systems, Man, and Cybernetics (SMC)",
      pages: "4877–4884",
      doi: "10.1109/SMC53992.2023.10394003",
    },
    {
      title: {
        de: "Evaluation of an Active Cooling Seat Concept in terms of Vehicle Energy Consumption and Passengers' Thermal Comfort",
        en: "Evaluation of an Active Cooling Seat Concept in terms of Vehicle Energy Consumption and Passengers' Thermal Comfort",
      },
      authors: "Kipp, M., Rolle, A., Semmler-Sainsard, S. J., & Bengler, K.",
      year: "2022",
      book: {
        de: "Ventilation 2022: 13th International Industrial Ventilation Conference for Contaminant Control, ASHRAE, Toronto (Kanada), ISBN 9781955515099",
        en: "Ventilation 2022: 13th International Industrial Ventilation Conference for Contaminant Control, ASHRAE, Toronto (Canada), ISBN 9781955515099",
      },
      pages: "335–344",
    },
    {
      title: {
        de: "An Innovative Seat Ventilation Concept: Does the Seat Provide Overall Thermal Comfort in Autonomous Vehicles?",
        en: "An Innovative Seat Ventilation Concept: Does the Seat Provide Overall Thermal Comfort in Autonomous Vehicles?",
      },
      authors: "Kipp, M., Rolle, A., & Bengler, K.",
      year: "2021",
      book: {
        de: "Proceedings of the 21st Congress of the International Ergonomics Association (IEA 2021), LNNS 221, Springer",
        en: "Proceedings of the 21st Congress of the International Ergonomics Association (IEA 2021), LNNS 221, Springer",
      },
      pages: "701–709",
      doi: "10.1007/978-3-030-74608-7_85",
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
            className={`w-2 h-2 rounded-full transition-colors ${index === imageIndex ? "" : "bg-gray-300"}`}
            style={index === imageIndex ? { backgroundColor: ACCENT } : undefined}
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
  const formRef = useRef<HTMLFormElement>(null)
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    website: "", // honeypot field
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formStartTime, setFormStartTime] = useState<number>(0)
  const [sessionToken, setSessionToken] = useState<string>("")
  const [rateLimitInfo, setRateLimitInfo] = useState<{ remainingAttempts: number; resetTime?: number }>({
    remainingAttempts: 3,
  })
  const { t, language } = useLanguage()

  useEffect(() => {
    setFormStartTime(Date.now())
    // Generate session token dynamically
    const generateToken = () => {
      const array = new Uint8Array(32)
      if (typeof window !== "undefined" && window.crypto) {
        window.crypto.getRandomValues(array)
      }
      return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join("")
    }
    setSessionToken(generateToken())
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // 1. Rate Limiting Check
      const checkLimit = () => {
        if (typeof window === "undefined") {
          return { allowed: true, remainingAttempts: 3 }
        }
        const stored = localStorage.getItem("form_submissions")
        const now = Date.now()
        if (!stored) {
          const data = { attempts: 1, firstAttempt: now }
          localStorage.setItem("form_submissions", JSON.stringify(data))
          return { allowed: true, remainingAttempts: 2 }
        }
        const data = JSON.parse(stored)
        if (now - data.firstAttempt > 15 * 60 * 1000) {
          const newData = { attempts: 1, firstAttempt: now }
          localStorage.setItem("form_submissions", JSON.stringify(newData))
          return { allowed: true, remainingAttempts: 2 }
        }
        if (data.attempts >= 3) {
          return { allowed: false, remainingAttempts: 0, resetTime: data.firstAttempt + 15 * 60 * 1000 }
        }
        data.attempts += 1
        localStorage.setItem("form_submissions", JSON.stringify(data))
        return { allowed: true, remainingAttempts: 3 - data.attempts }
      }

      const rateLimitCheck = checkLimit()
      if (!rateLimitCheck.allowed) {
        const resetTime = rateLimitCheck.resetTime
        const minutesLeft = resetTime ? Math.ceil((resetTime - Date.now()) / 60000) : 15
        throw new Error(
          language === "de"
            ? `Zu viele Versuche. Bitte versuchen Sie es in ${minutesLeft} Minuten erneut.`
            : `Too many attempts. Please try again in ${minutesLeft} minutes.`,
        )
      }
      setRateLimitInfo(rateLimitCheck)

      // 2. Honeypot Check
      if (formState.website !== "") {
        console.warn("[Security] Honeypot triggered")
        throw new Error("Invalid submission")
      }

      // 3. Timing Check
      const timeSinceLoad = Date.now() - formStartTime
      if (timeSinceLoad < 3000) {
        console.warn("[Security] Submission too fast")
        throw new Error(
          language === "de"
            ? "Bitte nehmen Sie sich Zeit beim Ausfüllen des Formulars"
            : "Please take your time filling out the form",
        )
      }

      // 4. Session Token Check
      if (sessionToken.length !== 64 || !/^[0-9a-f]+$/i.test(sessionToken)) {
        console.warn("[Security] Invalid session token")
        throw new Error(
          language === "de"
            ? "Sitzung abgelaufen. Bitte laden Sie die Seite neu."
            : "Session expired. Please refresh the page.",
        )
      }

      // 5. Email Validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formState.email)) {
        throw new Error(
          language === "de" ? "Bitte geben Sie eine gültige E-Mail-Adresse ein" : "Please enter a valid email address",
        )
      }

      // 6. Content Validation
      const urlCount = (formState.message.match(/https?:\/\//gi) || []).length
      if (urlCount > 3) {
        console.warn("[Security] Too many URLs")
        throw new Error(
          language === "de"
            ? "Ihre Nachricht enthält verdächtige Inhalte. Bitte überarbeiten Sie sie und versuchen Sie es erneut."
            : "Your message contains suspicious content. Please revise and try again.",
        )
      }

      // 7. Input Sanitization
      const sanitize = (input: string) =>
        input
          .trim()
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
          .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
          .replace(/on\w+\s*=\s*["'][^"']*["']/gi, "")
          .replace(/javascript:/gi, "")

      const sanitizedData = {
        name: sanitize(formState.name),
        email: sanitize(formState.email),
        subject: sanitize(formState.subject),
        message: sanitize(formState.message),
      }

      // EmailJS Send
      const templateParams = {
        subject: sanitizedData.subject,
        from_name: sanitizedData.name,
        message: sanitizedData.message,
        from_email: sanitizedData.email,
        to_email: "manuel-kipp95@hotmail.de",
        submission_time: new Date().toISOString(),
        session_token: sessionToken.substring(0, 8),
      }

      await emailjs.send("service_qzzfofc", "template_korw4qn", templateParams, "4mS8zVA3qnBnIO2ue")

      setIsSubmitted(true)
      setFormState({ name: "", email: "", subject: "", message: "", website: "" })
      setFormStartTime(Date.now())

      // Generate new session token
      const array = new Uint8Array(32)
      if (typeof window !== "undefined" && window.crypto) {
        window.crypto.getRandomValues(array)
      }
      setSessionToken(Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(""))
    } catch (error) {
      console.error("Error sending email:", error)
      setError(
        error instanceof Error ? error.message : language === "de" ? "Ein Fehler ist aufgetreten" : "An error occurred",
      )
    } finally {
      setIsSubmitting(false)
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
            <a href="tel:+4915789558680" className={`text-[#1a365d] hover:underline ${textContainerClass}`}>
              +49 157 89558680
            </a>
          </div>
          <div className="flex items-center space-x-4">
            <FaMapMarkerAlt className="text-2xl text-[#1a365d]" />
            <span className={`text-[#1a365d] ${textContainerClass}`}>München</span>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          {isSubmitted ? (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative"
              role="alert"
            >
              <strong className={`font-bold ${textContainerClass}`}>{t("contact.thankYou")}</strong>
              <span className={`block sm:inline ${textContainerClass}`}> {t("contact.messageSent")}</span>
              <Button variant="outline" onClick={() => setIsSubmitted(false)} className="mt-4">
                {language === "de" ? "Neue Nachricht senden" : "Send new message"}
              </Button>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-2 text-xs text-gray-600 mb-4 pb-3 border-b border-gray-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span>
                  {language === "de" ? "Gesichertes Formular" : "Secured form"} • {rateLimitInfo.remainingAttempts}{" "}
                  {language === "de" ? "Versuche verbleibend" : "attempts remaining"}
                </span>
              </div>

              <div className="absolute opacity-0 pointer-events-none" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input
                  type="text"
                  id="website"
                  name="website"
                  value={formState.website}
                  onChange={handleChange}
                  tabIndex={-1}
                  autoComplete="off"
                />
              </div>

              <div>
                <label htmlFor="name" className={`block text-sm font-medium text-gray-700 ${textContainerClass}`}>
                  {t("contact.name")}
                </label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleChange}
                  required
                  minLength={2}
                  maxLength={100}
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="email" className={`block text-sm font-medium text-gray-700 ${textContainerClass}`}>
                  {t("contact.email")}
                </label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formState.email}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="subject" className={`block text-sm font-medium text-gray-700 ${textContainerClass}`}>
                  {t("contact.subject")}
                </label>
                <Input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formState.subject}
                  onChange={handleChange}
                  required
                  minLength={3}
                  maxLength={200}
                  className="mt-1"
                />
              </div>
              <div>
                <label htmlFor="message" className={`block text-sm font-medium text-gray-700 ${textContainerClass}`}>
                  {t("contact.message")}
                </label>
                <Textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formState.message}
                  onChange={handleChange}
                  required
                  minLength={10}
                  maxLength={5000}
                  className="mt-1"
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm p-3 bg-red-50 rounded-md border border-red-100">{error}</div>
              )}

              <div>
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      {t("contact.sending")}
                    </>
                  ) : (
                    t("contact.send")
                  )}
                </Button>
              </div>

              <div className="pt-3 text-center">
                <a
                  href="https://www.linkedin.com/company/107308583/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center text-[#1a365d] hover:text-[#2a4a7f]"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="w-6 h-6" />
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

const ACCENT = "#E63C2D"
const ACCENT_DARK = "#C32A1C"

const isActiveEntry = (item) => Boolean(item.active) || /Heute|Present|Today/i.test(item.year || "")

// Single interactive timeline entry: shows only the essentials, reveals details on hover/click
const TimelineItem = ({ item }) => {
  const { language } = useLanguage()
  const [open, setOpen] = useState(false)
  const active = isActiveEntry(item)
  const role = typeof item.title === "string" ? item.title : item.title[language]
  const employer = item.mainInfo
    ? typeof item.mainInfo === "string"
      ? item.mainInfo
      : item.mainInfo[language]
    : null

  const hasDetails =
    item.details || item.dissertation || item.masterarbeit || item.bachelorarbeit || item.tools || item.website

  return (
    <li
      className="relative pl-6 md:pl-8"
      onMouseEnter={() => hasDetails && setOpen(true)}
      onMouseLeave={() => hasDetails && setOpen(false)}
    >
      {/* Animated node */}
      <motion.span
        aria-hidden="true"
        className={`absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-white ${
          active ? "gold-dot-pulse" : ""
        }`}
        style={{ backgroundColor: active ? ACCENT : "rgba(26,54,93,0.3)" }}
        animate={{ scale: open ? 1.35 : 1 }}
        transition={{ type: "spring", stiffness: 400, damping: 20 }}
      />

      <motion.button
        type="button"
        onClick={() => hasDetails && setOpen((v) => !v)}
        className={`group w-full text-left rounded-lg -ml-2 pl-2 pr-2 py-2 transition-colors ${
          hasDetails ? "cursor-pointer hover:bg-gray-50" : "cursor-default"
        }`}
        aria-expanded={open}
      >
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="text-sm font-semibold whitespace-nowrap" style={{ color: ACCENT }}>
            {item.year}
          </span>
          {item.parallel && (
            <span
              className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
              style={{ color: ACCENT, backgroundColor: "rgba(230,60,45,0.1)", border: `1px solid ${ACCENT}66` }}
            >
              {language === "de" ? "Parallel" : "Concurrent"}
            </span>
          )}
          {active && !item.parallel && (
            <span
              className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
              style={{ color: ACCENT, backgroundColor: "rgba(230,60,45,0.1)", border: `1px solid ${ACCENT}66` }}
            >
              {language === "de" ? "Noch aktiv" : "Ongoing"}
            </span>
          )}
          {hasDetails && (
            <FaChevronDown
              className="ml-auto text-xs text-gray-400 transition-transform duration-300 group-hover:text-gray-600"
              style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          )}
        </div>
        <p className={`mt-1 text-base font-medium ${textContainerClass}`} style={{ color: ACCENT }}>
          {role}
        </p>
        {employer && <p className={`text-lg font-bold text-[#1a365d] ${textContainerClass}`}>{employer}</p>}
      </motion.button>

      {/* Collapsible details */}
      <AnimatePresence initial={false}>
        {open && hasDetails && (
          <motion.div
            key="details"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <div className="pl-2 pt-2 pb-1 border-l-2 ml-1 space-y-2" style={{ borderColor: `${ACCENT}33` }}>
              {item.details && (
                <p className={`text-sm text-gray-600 text-justify pl-3 ${textContainerClass}`}>
                  {typeof item.details === "string" ? item.details : item.details[language]}
                </p>
              )}
              {item.dissertation && (
                <p className={`text-sm text-gray-600 pl-3 ${textContainerClass}`}>
                  <strong className="text-[#1a365d]">{language === "de" ? "Dissertation" : "Dissertation"}:</strong>{" "}
                  {typeof item.dissertation === "string" ? item.dissertation : item.dissertation[language]}
                </p>
              )}
              {item.masterarbeit && (
                <p className={`text-sm text-gray-600 pl-3 ${textContainerClass}`}>
                  <strong className="text-[#1a365d]">{language === "de" ? "Masterarbeit" : "Master's Thesis"}:</strong>{" "}
                  {typeof item.masterarbeit === "string" ? item.masterarbeit : item.masterarbeit[language]}
                </p>
              )}
              {item.bachelorarbeit && (
                <p className={`text-sm text-gray-600 pl-3 ${textContainerClass}`}>
                  <strong className="text-[#1a365d]">
                    {language === "de" ? "Bachelorarbeit" : "Bachelor's Thesis"}:
                  </strong>{" "}
                  {typeof item.bachelorarbeit === "string" ? item.bachelorarbeit : item.bachelorarbeit[language]}
                </p>
              )}
              {item.tools && (
                <p className={`text-sm text-gray-600 pl-3 ${textContainerClass}`}>
                  <strong className="text-[#1a365d]">{language === "de" ? "Werkzeuge" : "Tools"}:</strong> {item.tools}
                </p>
              )}
              {item.website && (
                <p className={`text-sm pl-3 ${textContainerClass}`}>
                  <a
                    href={`https://${item.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:underline"
                    style={{ color: ACCENT }}
                  >
                    {item.website}
                  </a>
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  )
}

// Compact, interactive vertical timeline – essentials by default, details on hover/click
const TimelineBlock = ({ title, content }) => {
  const { language } = useLanguage()
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className={`font-display text-2xl font-semibold text-[#1a365d] leading-relaxed ${textContainerClass}`}>
          {title}
        </h3>
      </div>
      <p className="text-xs text-gray-400 mb-6">
        {language === "de" ? "Für Details auf einen Eintrag tippen oder fahren" : "Tap or hover an entry for details"}
      </p>
      <ol className="relative ml-2 border-l-2 space-y-5" style={{ borderColor: "rgba(230,60,45,0.25)" }}>
        {content.map((item, index) => (
          <TimelineItem key={index} item={item} />
        ))}
      </ol>
    </div>
  )
}

// Card used for publications, talks and industry projects
const InfoCard = ({ item }) => {
  const { language } = useLanguage()
  const title = typeof item.title === "string" ? item.title : item.title[language]
  const people = item.authors || item.author
  const venue = item.conference
    ? typeof item.conference === "string"
      ? item.conference
      : item.conference[language]
    : item.book
      ? typeof item.book === "string"
        ? item.book
        : item.book[language]
      : null
  const location = item.location
    ? typeof item.location === "string"
      ? item.location
      : item.location[language]
    : null
  const mainInfo = item.mainInfo
    ? typeof item.mainInfo === "string"
      ? item.mainInfo
      : item.mainInfo[language]
    : null
  const description = item.details
    ? typeof item.details === "string"
      ? item.details
      : item.details[language]
    : null
  const venueLine = [venue, location, item.pages].filter(Boolean).join(", ")
  return (
    <div className="bg-white rounded-lg shadow-md p-5 flex gap-4 hover:shadow-lg transition-shadow">
      <span
        className="flex-shrink-0 inline-flex items-center justify-center h-8 min-w-[3.5rem] px-2.5 rounded-md text-sm font-semibold whitespace-nowrap"
        style={{ color: ACCENT, backgroundColor: "rgba(184,146,74,0.12)", border: `1px solid ${ACCENT}66` }}
      >
        {item.year}
      </span>
      <div className="flex-1 min-w-0">
        <h4 className={`font-display text-base md:text-lg font-semibold text-[#1a365d] ${textContainerClass}`}>
          {title}
        </h4>
        {people && <p className={`mt-1 text-sm text-gray-500 ${textContainerClass}`}>{people}</p>}
        {mainInfo && <p className={`mt-1 text-sm text-gray-500 ${textContainerClass}`}>{mainInfo}</p>}
        {venueLine && <p className={`mt-1 text-sm italic text-gray-500 ${textContainerClass}`}>{venueLine}</p>}
        {description && (
          <p className={`mt-2 text-sm text-gray-600 text-justify ${textContainerClass}`}>{description}</p>
        )}
        {item.tools && (
          <p className={`mt-2 text-sm text-gray-600 ${textContainerClass}`}>
            <strong className="text-[#1a365d]">{language === "de" ? "Werkzeuge" : "Tools"}:</strong> {item.tools}
          </p>
        )}
        {item.doi && (
          <a
            href={`https://doi.org/${item.doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm font-medium text-white transition-colors hover:brightness-110"
            style={{ backgroundColor: ACCENT }}
          >
            {language === "de" ? "DOI öffnen →" : "Open DOI →"}
          </a>
        )}
      </div>
    </div>
  )
}

// Groups card entries by year, newest year first (used for publications / talks)
const CardListByYear = ({ items }) => {
  const groups: Record<string, any[]> = {}
  items.forEach((it) => {
    const yr = String(it.year)
    groups[yr] = groups[yr] || []
    groups[yr].push(it)
  })
  const years = Object.keys(groups).sort((a, b) => Number(b) - Number(a))
  return (
    <div className="space-y-8">
      {years.map((yr) => (
        <div key={yr}>
          <h4 className="font-display text-xl font-bold text-[#1a365d] mb-3 flex items-center gap-3">
            <span>{yr}</span>
            <span className="h-px flex-1" style={{ backgroundColor: `${ACCENT}4d` }} />
          </h4>
          <div className="space-y-4">
            {groups[yr].map((it, i) => (
              <InfoCard key={i} item={it} />
            ))}
          </div>
        </div>
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
            activeSection === section.id ? "w-4 h-4" : "bg-gray-300 hover:bg-gray-400"
          }`}
          style={activeSection === section.id ? { backgroundColor: ACCENT } : undefined}
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
            backgroundImage: 'url("/images/pexels-photo-1166602.jpeg")',
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
              <a
                href="https://thermalnext.de"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1.5 shadow-sm ring-1 transition-colors hover:bg-white w-fit"
                style={{ borderColor: ACCENT }}
                aria-label="ThermalNext (öffnet in neuem Tab)"
              >
                <Image
                  src="/images/thermalnext-logo.png"
                  alt="ThermalNext"
                  width={96}
                  height={24}
                  className="h-6 w-auto object-contain"
                />
              </a>
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
                  src="/images/manuel-kipp-profile.png"
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
                <div className="text-lg flex flex-col md:flex-row items-start md:space-x-8">
                  <div className="hidden md:block w-1/4 flex-shrink-0 relative group">
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
                  <div className="w-full md:w-3/4">
                    <h2
                      className={`hidden md:block text-3xl md:text-4xl font-semibold text-[#1a365d] mb-6 leading-relaxed ${textContainerClass}`}
                    >
                      {t("aboutMe.title")}
                    </h2>
                    <p className={`text-foreground text-justify mb-4 ${textContainerClass}`}>
                      {t("aboutMe.paragraph1")}
                    </p>
                    <p className={`text-foreground text-justify mb-4 ${textContainerClass}`}>
                      {t("aboutMe.paragraph2")}
                    </p>
                    <p className={`text-foreground text-justify ${textContainerClass}`}>{t("aboutMe.paragraph3")}</p>
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
                <div className="space-y-5">
                  {/* Schwerpunkt – dezent hervorgehoben (gefüllte Pill) */}
                  <div className="flex flex-wrap justify-center gap-3">
                    <motion.span
                      className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-base font-semibold text-white shadow-sm"
                      style={{ backgroundColor: ACCENT }}
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4 }}
                    >
                      <FaCube className="text-sm" />
                      {featuredSkill.name[language]}
                    </motion.span>
                    {primarySkills.map((skill, index) => (
                      <motion.span
                        key={skill}
                        className="inline-flex items-center rounded-full border border-gray-300 bg-white px-5 py-2.5 text-base font-medium text-[#1a365d] transition-colors"
                        whileHover={{ borderColor: ACCENT, color: ACCENT }}
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: (index + 1) * 0.05 }}
                      >
                        {skill}
                      </motion.span>
                    ))}
                    {secondarySkills.map((skill, index) => (
                      <motion.span
                        key={typeof skill === "string" ? skill : skill.de}
                        className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-sm font-medium text-gray-500"
                        initial={{ opacity: 0, y: 12 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: (primarySkills.length + 1 + index) * 0.05 }}
                      >
                        {typeof skill === "string" ? skill : skill[language]}
                      </motion.span>
                    ))}
                  </div>
                  {/* Ehrliche, zurückhaltende Einordnung */}
                  <p className={`text-center text-sm text-gray-500 max-w-2xl mx-auto leading-relaxed ${textContainerClass}`}>
                    {featuredSkill.tagline[language]}
                  </p>
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
                            stroke={ACCENT}
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
                    className="bg-white rounded-lg shadow-lg p-6 md:p-8 relative"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex md:grid md:grid-cols-3 lg:grid-cols-6 gap-8 items-center md:justify-items-center overflow-x-auto no-scrollbar md:overflow-visible">
                      {[
                        { src: "/images/audi-logo.svg", alt: "Audi" },
                        { src: "/images/bmw.svg", alt: "BMW" },
                        {
                          src: "https://urlyaqdfmocz1d9x.public.blob.vercel-storage.com/logo%20fendt-0YxhORcYwjylvclVGIvu4p7OwYtmA2.svg",
                          alt: "Fendt",
                        },
                        { src: "/images/dlr-logo.svg", alt: "DLR" },
                        { src: "/images/logo-20gentherm.png", alt: "Gentherm" },
                        { src: null, alt: "KNDS" },
                      ].map((logo, index) => (
                        <motion.div
                          key={logo.alt}
                          className="flex flex-col items-center flex-shrink-0"
                          initial={{ opacity: 0, x: -50 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                          {logo.src ? (
                            <Image
                              src={logo.src || "/placeholder.svg"}
                              alt={`${logo.alt} Logo`}
                              width={150}
                              height={75}
                              className="object-contain h-[60px] w-auto hover:scale-110 transition-transform duration-200"
                            />
                          ) : (
                            <span className="flex h-[60px] items-center justify-center text-2xl font-bold tracking-wide text-[#1a365d] hover:scale-110 transition-transform duration-200">
                              {logo.alt}
                            </span>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                  {/* Projekte */}
                  <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
                    <h3 className="font-display text-2xl font-semibold text-[#1a365d] mb-6">
                      {t("industryExperience.projects")}
                    </h3>
                    <div className="space-y-4">
                      {erfahrungContent.projekte.map((item, index) => (
                        <InfoCard key={index} item={item} />
                      ))}
                    </div>
                  </div>
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
                  <TimelineBlock title={t("career.professional")} content={erfahrungContent.berufserfahrung} />
                  <TimelineBlock title={t("career.academic")} content={erfahrungContent.akademisch} />
                  <TimelineBlock title={t("career.practical")} content={erfahrungContent.praktisch} />
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
                <div className="space-y-10">
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-[#1a365d] mb-6">
                      {t("publications.paper")}
                    </h3>
                    <CardListByYear items={veröffentlichungenContent.paper} />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl font-semibold text-[#1a365d] mb-6">
                      {t("publications.talks")}
                    </h3>
                    <CardListByYear items={veröffentlichungenContent.vorträge} />
                  </div>
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
                          ? "https://urlyaqdfmocz1d9x.public.blob.vercel-storage.com/cv_ManuelKipp_en_signed.pdf"
                          : "https://urlyaqdfmocz1d9x.public.blob.vercel-storage.com/cv_ManuelKipp_de_signed.pdf"
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
