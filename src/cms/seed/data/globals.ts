import type { Block } from "../lexical.ts";

const texts = (...items: string[]) => items.map((text) => ({ text }));
const heading = (kicker: string, title: string, text = "") => ({ kicker, title, text });

export const settings = {
  base: {
    email: "office@i-security.md",
    securityEmail: "security@i-security.md",
    geo: { lat: 47.041823, lng: 28.819017 },
  },
  l: {
    ro: {
      tagline: "Tehnologie. Securitate. Intelligence.",
      address: "str. Columna 170, MD-2004\nChișinău, Republica Moldova",
      hours: "Luni–vineri, 09:00–18:00",
      city: "Chișinău",
    },
    en: {
      tagline: "Technology. Security. Intelligence.",
      address: "170 Columna St., MD-2004\nChișinău, Republic of Moldova",
      hours: "Monday–Friday, 09:00–18:00",
      city: "Chișinău",
    },
    ru: {
      tagline: "Технологии. Безопасность. Аналитика.",
      address: "ул. Колумна 170, MD-2004\nКишинёв, Республика Молдова",
      hours: "Понедельник–пятница, 09:00–18:00",
      city: "Кишинёв",
    },
  },
};

const keyFigure = (icon: string, value: number | null, suffix: string, label: string, isYear = false) => ({
  icon,
  value,
  suffix,
  label,
  isYear,
});
const fact = (icon: string, value: string, label: string) => ({ icon, value, label });
const iconCard = (icon: string, title: string, text: string) => ({ icon, title, text });
const industry = (icon: string, label: string) => ({ icon, label });

export const home = {
  ro: {
    eyebrow: texts("Securitate cibernetică", "Inginerie software", "Intelligence"),
    title: "Securizăm. Construim.",
    titleAccent: "Analizăm.",
    lead: "Soluții de tehnologie, securitate și intelligence pentru o lume digitală mai sigură și mai rezilientă.",
    kpis: [
      keyFigure("clock", 10, "+", "Ani de experiență"),
      keyFigure("box", 100, "+", "Proiecte livrate"),
      keyFigure("users", 50, "+", "Experți în echipă"),
      keyFigure("box", null, "Partener de încredere", "pentru organizații publice și private"),
    ],
    mapHead: heading(
      "Hartă live a amenințărilor cibernetice",
      "Amenințări cibernetice globale în timp real",
      "O imagine live a amenințărilor cibernetice din întreaga lume, pe baza datelor în timp real din surse globale.",
    ),
    servicesHead: heading(
      "Serviciile noastre",
      "Ce facem",
      "",
    ),
    techHead: heading(
      "Expertiza noastră tehnică",
      "Competențe și tehnologii",
      "",
    ),
    whyHead: heading("De ce Intellect", "Un partener tehnologic de încredere", ""),
    why: [
      iconCard("lock", "Securitate prin design", "Construim cu securitate la fiecare nivel."),
      iconCard("layers", "Expertiză multi-domeniu", "Tehnologie, securitate și intelligence, sub același acoperiș."),
      iconCard("check", "Livrare dovedită", "Un istoric de proiecte reușite pentru organizații critice."),
      iconCard("users", "Parteneriat pe termen lung", "Ne concentrăm pe valoare durabilă și impact măsurabil."),
    ],
    clientsHead: heading("Clienții noștri", "Organizațiile de top ne acordă încrederea", ""),
    aboutHead: heading("Despre Intellect", "Despre Intellect", ""),
    aboutLead:
      "Suntem o companie de tehnologie specializată în inginerie software, securitate cibernetică și soluții de intelligence. Ajutăm organizațiile să-și construiască, să-și protejeze și să-și valorifice capabilitățile digitale pentru a-și îndeplini misiunea.",
    insightsHead: heading("Noutăți și actualizări", "Ultimele analize și noutăți", ""),
    cta: {
      title: "Să construim un viitor digital mai sigur și mai inteligent",
      accent: "",
      text: "Ai un proiect, o provocare sau o idee? Hai să vorbim despre cum putem lucra împreună.",
    },
  },
  en: {
    eyebrow: texts("Cybersecurity", "Software Engineering", "Intelligence"),
    title: "Secure. Build.",
    titleAccent: "Analyze.",
    lead: "Technology, security and intelligence solutions for a safer and more resilient digital world.",
    kpis: [
      keyFigure("clock", 10, "+", "Years of experience"),
      keyFigure("box", 100, "+", "Projects delivered"),
      keyFigure("users", 50, "+", "Experts on the team"),
      keyFigure("box", null, "Trusted partner", "for public and private organizations"),
    ],
    mapHead: heading(
      "Live Cyber Threat Map",
      "Global Cyber Threats in Real Time",
      "A live view of cybersecurity threats around the world, based on real-time intelligence from global sources.",
    ),
    servicesHead: heading(
      "Our Services",
      "What We Do",
      "",
    ),
    techHead: heading(
      "Our Tech Expertise",
      "Skills & Technologies",
      "",
    ),
    whyHead: heading("Why Intellect", "A Trusted Technology Partner", ""),
    why: [
      iconCard("lock", "Security by Design", "We build with security at every layer."),
      iconCard("layers", "Multi-Domain Expertise", "Technology, security and intelligence — under one roof."),
      iconCard("check", "Proven Delivery", "A track record of successful projects for critical organizations."),
      iconCard("users", "Long-Term Partnership", "We focus on lasting value and measurable impact."),
    ],
    clientsHead: heading("Our Customers", "Trusted by Leading Organizations", ""),
    aboutHead: heading("About Intellect", "About Intellect", ""),
    aboutLead:
      "We are a technology company specializing in software engineering, cybersecurity and intelligence solutions. We help organizations build, protect and leverage digital capabilities to achieve their mission.",
    insightsHead: heading("News & Updates", "Latest Insights and Updates", ""),
    cta: {
      title: "Let’s Build a Safer, Smarter Digital Future",
      accent: "",
      text: "Have a project, challenge or idea? Let’s talk about how we can work together.",
    },
  },
  ru: {
    eyebrow: texts("Кибербезопасность", "Разработка ПО", "Аналитика"),
    title: "Защищаем. Создаём.",
    titleAccent: "Анализируем.",
    lead: "Технологии, безопасность и аналитика для более безопасного и устойчивого цифрового мира.",
    kpis: [
      keyFigure("clock", 10, "+", "Лет опыта"),
      keyFigure("box", 100, "+", "Реализованных проектов"),
      keyFigure("users", 50, "+", "Экспертов в команде"),
      keyFigure("box", null, "Надёжный партнёр", "для государственных и частных организаций"),
    ],
    mapHead: heading(
      "Живая карта киберугроз",
      "Глобальные киберугрозы в реальном времени",
      "Актуальная картина киберугроз по всему миру на основе данных из глобальных источников в реальном времени.",
    ),
    servicesHead: heading("Наши услуги", "Что мы делаем", ""),
    techHead: heading(
      "Наша техническая экспертиза",
      "Навыки и технологии",
      "",
    ),
    whyHead: heading("Почему Intellect", "Надёжный технологический партнёр", ""),
    why: [
      iconCard("lock", "Безопасность by design", "Мы закладываем безопасность на каждом уровне."),
      iconCard("layers", "Экспертиза в нескольких областях", "Технологии, безопасность и аналитика под одной крышей."),
      iconCard("check", "Подтверждённый опыт", "Успешные проекты для критически важных организаций."),
      iconCard("users", "Долгосрочное партнёрство", "Мы ориентируемся на долгосрочную ценность и измеримый результат."),
    ],
    clientsHead: heading("Наши клиенты", "Нам доверяют ведущие организации", ""),
    aboutHead: heading("О компании Intellect", "О компании Intellect", ""),
    aboutLead:
      "Мы технологическая компания, специализирующаяся на разработке ПО, кибербезопасности и аналитических решениях. Мы помогаем организациям создавать, защищать и использовать цифровые возможности для достижения своих целей.",
    insightsHead: heading("Новости и обновления", "Последние материалы и новости", ""),
    cta: {
      title: "Давайте вместе строить более безопасное и умное цифровое будущее",
      accent: "",
      text: "Есть проект, задача или идея? Давайте обсудим, как мы можем работать вместе.",
    },
  },
};

export const about = {
  ro: {
    hero: heading(
      "Despre Intellect",
      "O companie de tehnologie cu mentalitate de securitate",
      "Combinăm ingineria software, securitatea cibernetică și intelligence-ul pentru a construi, proteja și susține organizațiile într-o lume digitală complexă.",
    ),
    facts: [
      fact("clock", "2014", "Fondată"),
      fact("box", "100+", "Proiecte livrate"),
      fact("users", "50+", "Experți"),
      fact("layers", "10+", "Industrii"),
      fact("target", "2", "Divizii principale"),
    ],
    mission:
      "Să construim soluții digitale sigure, inteligente și reziliente, care creează valoare durabilă pentru clienții noștri și pentru societate.",
    vision:
      "Să fim principalul partener regional de tehnologie și securitate cibernetică, recunoscut pentru expertiză, încredere și impact.",
    values: [
      iconCard("handshake", "Încredere", "Confidențialitate și integritate"),
      iconCard("badge", "Excelență", "Standarde înalte în tot ce facem"),
      iconCard("spark", "Inovație", "Tehnologie modernă și învățare continuă"),
      iconCard("target", "Responsabilitate", "Impact real pentru clienți și societate"),
    ],
    industries: [
      industry("gov", "Guvern și sector public"),
      industry("bolt", "Energie și infrastructură critică"),
      industry("signal", "Telecomunicații și IT"),
      industry("bank", "Finanțe și asigurări"),
      industry("health", "Sănătate"),
      industry("building", "Alte companii"),
    ],
    teamHead: heading(
      "Echipa noastră",
      "Oamenii din spatele Intellect",
      "O echipă multidisciplinară de ingineri, specialiști în securitate cibernetică, analiști de intelligence și experți din industrie.",
    ),
    careers: {
      title: "Alătură-te echipei",
      text: "Lucrează la proiecte importante, rezolvă provocări reale și crește alături de o echipă de experți.",
      points: texts(
        "Proiecte pentru instituții și infrastructură critică",
        "Mentorat și certificări plătite",
        "Lucru hibrid, din Chișinău",
      ),
      email: "careers@i-security.md",
    },
  },
  en: {
    hero: heading(
      "About Intellect",
      "A Technology Company with a Security Mindset",
      "We combine software engineering, cybersecurity and intelligence to build, protect and empower organizations in a complex digital world.",
    ),
    facts: [
      fact("clock", "2014", "Founded"),
      fact("box", "100+", "Projects delivered"),
      fact("users", "50+", "Experts"),
      fact("layers", "10+", "Industries"),
      fact("target", "2", "Core divisions"),
    ],
    mission: "To build secure, intelligent and resilient digital solutions that create lasting value for our clients and society.",
    vision: "To be the leading regional technology and cybersecurity partner, recognized for expertise, trust and impact.",
    values: [
      iconCard("handshake", "Trust", "Confidentiality and integrity"),
      iconCard("badge", "Excellence", "High standards in everything we do"),
      iconCard("spark", "Innovation", "Modern technology and continuous learning"),
      iconCard("target", "Responsibility", "Real impact for clients and society"),
    ],
    industries: [
      industry("gov", "Government & Public Sector"),
      industry("bolt", "Energy & Critical Infrastructure"),
      industry("signal", "Telecommunications & IT"),
      industry("bank", "Finance & Insurance"),
      industry("health", "Healthcare"),
      industry("building", "Other Enterprises"),
    ],
    teamHead: heading(
      "Our Team",
      "The People Behind Intellect",
      "A multidisciplinary team of engineers, cybersecurity specialists, intelligence analysts and industry experts.",
    ),
    careers: {
      title: "Join Our Team",
      text: "Work on meaningful projects, solve real challenges and grow with a team of experts.",
      points: texts(
        "Projects for institutions and critical infrastructure",
        "Mentoring and paid certifications",
        "Hybrid work from Chișinău",
      ),
      email: "careers@i-security.md",
    },
  },
  ru: {
    hero: heading(
      "О компании Intellect",
      "Технологическая компания с мышлением безопасности",
      "Мы объединяем разработку ПО, кибербезопасность и аналитику, чтобы создавать, защищать и усиливать организации в сложном цифровом мире.",
    ),
    facts: [
      fact("clock", "2014", "Год основания"),
      fact("box", "100+", "Реализованных проектов"),
      fact("users", "50+", "Экспертов"),
      fact("layers", "10+", "Отраслей"),
      fact("target", "2", "Основных подразделения"),
    ],
    mission:
      "Создавать безопасные, интеллектуальные и устойчивые цифровые решения, которые приносят долгосрочную пользу клиентам и обществу.",
    vision:
      "Быть ведущим региональным партнёром в области технологий и кибербезопасности, которого ценят за экспертизу, доверие и результат.",
    values: [
      iconCard("handshake", "Доверие", "Конфиденциальность и честность"),
      iconCard("badge", "Качество", "Высокие стандарты во всём"),
      iconCard("spark", "Инновации", "Современные технологии и постоянное обучение"),
      iconCard("target", "Ответственность", "Реальная польза для клиентов и общества"),
    ],
    industries: [
      industry("gov", "Государство и госсектор"),
      industry("bolt", "Энергетика и критическая инфраструктура"),
      industry("signal", "Телеком и ИТ"),
      industry("bank", "Финансы и страхование"),
      industry("health", "Здравоохранение"),
      industry("building", "Другие компании"),
    ],
    teamHead: heading(
      "Наша команда",
      "Люди, которые стоят за Intellect",
      "Междисциплинарная команда инженеров, специалистов по кибербезопасности, аналитиков и отраслевых экспертов.",
    ),
    careers: {
      title: "Присоединяйтесь к команде",
      text: "Работайте над важными проектами, решайте реальные задачи и растите вместе с командой экспертов.",
      points: texts(
        "Проекты для госучреждений и критической инфраструктуры",
        "Наставничество и оплачиваемые сертификации",
        "Гибридный формат, Кишинёв",
      ),
      email: "careers@i-security.md",
    },
  },
};

export const legal: Record<"ro" | "en" | "ru", { privacy: Block[]; terms: Block[] }> = {
  ro: {
    privacy: [
      [
        "p",
        "Această politică explică ce date personale colectează INTELLECT prin acest site și cum le folosim. Textul este o ciornă și va fi revizuit juridic înainte de lansare.",
      ],
      ["h2", "Ce date colectăm"],
      [
        "ul",
        [
          "Datele trimise prin formularul de contact: nume, email, telefon (opțional), organizație (opțional) și mesajul.",
          "Statistici agregate de vizitare, fără cookie-uri și fără identificarea persoanei (Cloudflare Web Analytics).",
        ],
      ],
      ["h2", "De ce le folosim"],
      [
        "p",
        "Folosim datele din formular doar pentru a-ți răspunde. Nu le vindem și nu le folosim pentru marketing fără acordul tău separat.",
      ],
      ["h2", "Cât timp le păstrăm"],
      ["p", "Mesajele se păstrează cel mult 24 de luni de la ultima corespondență, apoi se șterg."],
      ["h2", "Cine le procesează"],
      ["ul", ["Cloudflare (găzduire, protecție, anti-spam Turnstile).", "Resend (trimiterea notificării prin email)."]],
      ["h2", "Drepturile tale"],
      ["p", "Poți cere accesul, corectarea sau ștergerea datelor tale scriind la adresa de contact de pe site."],
      ["h2", "Cookie-uri"],
      [
        "p",
        "Site-ul folosește doar stocarea locală a browserului pentru tema aleasă (luminoasă sau întunecată). Nu folosim cookie-uri de urmărire.",
      ],
    ],
    terms: [
      ["p", "Folosind acest site, accepți termenii de mai jos. Textul este o ciornă și va fi revizuit juridic înainte de lansare."],
      ["h2", "Conținutul site-ului"],
      ["p", "Informațiile au caracter general și nu constituie consultanță pentru o situație anume."],
      ["h2", "Harta amenințărilor"],
      [
        "p",
        "Datele hărții provin din surse publice agregate, cu întârziere de până la 5 minute, și sunt oferite fără garanția exactității.",
      ],
      ["h2", "Proprietate intelectuală"],
      ["p", "Textele, grafica și codul site-ului aparțin INTELLECT, cu excepția conținutului terților menționat explicit."],
      ["h2", "Raportarea vulnerabilităților"],
      [
        "p",
        "Dacă descoperi o vulnerabilitate în site, te rugăm să ne scrii la adresa din security.txt și să nu o publici înainte de a o remedia.",
      ],
    ],
  },
  en: {
    privacy: [
      [
        "p",
        "This policy explains what personal data INTELLECT collects through this website and how we use it. This is a draft and will be legally reviewed before launch.",
      ],
      ["h2", "What we collect"],
      [
        "ul",
        [
          "Data you send through the contact form: name, email, phone (optional), organisation (optional) and your message.",
          "Aggregated visit statistics, without cookies and without identifying individuals (Cloudflare Web Analytics).",
        ],
      ],
      ["h2", "Why we use it"],
      ["p", "We use form data only to reply to you. We don’t sell it or use it for marketing without your separate consent."],
      ["h2", "How long we keep it"],
      ["p", "Messages are kept for at most 24 months after the last correspondence, then deleted."],
      ["h2", "Who processes it"],
      ["ul", ["Cloudflare (hosting, protection, Turnstile anti-spam).", "Resend (sending the email notification)."]],
      ["h2", "Your rights"],
      ["p", "You can request access to, correction or deletion of your data by writing to the contact address on this site."],
      ["h2", "Cookies"],
      ["p", "The site only uses your browser’s local storage for your theme choice (light or dark). We don’t use tracking cookies."],
    ],
    terms: [
      ["p", "By using this website you accept the terms below. This is a draft and will be legally reviewed before launch."],
      ["h2", "Website content"],
      ["p", "The information is general in nature and is not advice for any specific situation."],
      ["h2", "Threat map"],
      [
        "p",
        "Map data comes from aggregated public sources with a delay of up to 5 minutes and is provided without any guarantee of accuracy.",
      ],
      ["h2", "Intellectual property"],
      ["p", "The site’s text, graphics and code belong to INTELLECT, except third-party content explicitly credited."],
      ["h2", "Reporting vulnerabilities"],
      [
        "p",
        "If you find a vulnerability in this site, please write to the address in security.txt and don’t publish it before it is fixed.",
      ],
    ],
  },
  ru: {
    privacy: [
      [
        "p",
        "Эта политика объясняет, какие персональные данные INTELLECT собирает через сайт и как мы их используем. Это черновик; текст пройдёт юридическую проверку до запуска.",
      ],
      ["h2", "Какие данные мы собираем"],
      [
        "ul",
        [
          "Данные из формы обратной связи: имя, email, телефон (необязательно), организация (необязательно) и сообщение.",
          "Агрегированную статистику посещений без cookie и без идентификации человека (Cloudflare Web Analytics).",
        ],
      ],
      ["h2", "Зачем мы их используем"],
      [
        "p",
        "Данные из формы мы используем только для ответа вам. Мы не продаём их и не используем для маркетинга без отдельного согласия.",
      ],
      ["h2", "Как долго мы их храним"],
      ["p", "Сообщения хранятся не более 24 месяцев после последней переписки, затем удаляются."],
      ["h2", "Кто их обрабатывает"],
      ["ul", ["Cloudflare (хостинг, защита, антиспам Turnstile).", "Resend (отправка уведомления по email)."]],
      ["h2", "Ваши права"],
      ["p", "Вы можете запросить доступ к своим данным, их исправление или удаление, написав на контактный адрес сайта."],
      ["h2", "Cookie"],
      [
        "p",
        "Сайт использует только локальное хранилище браузера для выбранной темы (светлой или тёмной). Мы не используем отслеживающие cookie.",
      ],
    ],
    terms: [
      ["p", "Пользуясь сайтом, вы принимаете условия ниже. Это черновик; текст пройдёт юридическую проверку до запуска."],
      ["h2", "Содержание сайта"],
      ["p", "Информация носит общий характер и не является консультацией по конкретной ситуации."],
      ["h2", "Карта угроз"],
      ["p", "Данные карты получены из агрегированных открытых источников с задержкой до 5 минут и предоставляются без гарантии точности."],
      ["h2", "Интеллектуальная собственность"],
      ["p", "Тексты, графика и код сайта принадлежат INTELLECT, за исключением явно указанного контента третьих лиц."],
      ["h2", "Сообщения об уязвимостях"],
      ["p", "Если вы обнаружили уязвимость на сайте, напишите на адрес из security.txt и не публикуйте её до исправления."],
    ],
  },
};
