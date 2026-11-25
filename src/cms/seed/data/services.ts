const texts = (...items: string[]) => items.map((text) => ({ text }));
const approachStep = (title: string, text: string) => ({ title, text });
const faqItem = (q: string, a: string) => ({ q, a });
const guarantee = (icon: string, value: string, label: string) => ({ icon, value, label });
const subService = (icon: string, title: string, text: string) => ({ icon, title, text });

const approach = {
  ro: [
    approachStep("Evaluare", "Identificăm riscurile și lacunele"),
    approachStep("Design", "Construim soluția potrivită"),
    approachStep("Implementare", "Implementăm și integrăm"),
    approachStep("Operare", "Monitorizăm, răspundem, îmbunătățim"),
  ],
  en: [
    approachStep("Assess", "Identify risks and gaps"),
    approachStep("Design", "Build the right solution"),
    approachStep("Implement", "Deploy and integrate"),
    approachStep("Operate", "Monitor, respond, improve"),
  ],
  ru: [
    approachStep("Оценка", "Выявляем риски и пробелы"),
    approachStep("Проектирование", "Создаём подходящее решение"),
    approachStep("Внедрение", "Развёртываем и интегрируем"),
    approachStep("Эксплуатация", "Мониторим, реагируем, улучшаем"),
  ],
};

export const services = [
  {
    base: { kind: "main", icon: "code", order: 1 },
    l: {
      ro: {
        title: "Dezvoltare software și transformare digitală",
        slug: "dezvoltare-software",
        summary: "Platforme enterprise, ERP și CRM, aplicații web și mobile, integrare AI.",
        highlights: texts("Platforme enterprise", "Web și mobil", "Integrare AI"),
        kicker: "Software și transformare digitală",
        headline: "Software pentru instituții și companii",
        intro:
          "Proiectăm și construim platforme enterprise, portaluri publice și aplicații mobile, cu securitatea gândită de la prima linie de cod.",
        guarantees: [
          guarantee("lock", "Securitate prin design", "model de amenințări din prima zi"),
          guarantee("box", "Livrare pe etape", "demonstrații la fiecare iterație"),
          guarantee("layers", "Cod predat", "documentație și acces complet"),
          guarantee("users", "Suport după lansare", "aceeași echipă"),
        ],
        subServices: [
          subService("layers", "Platforme enterprise", "ERP, CRM și sisteme interne care se integrează cu ce ai deja."),
          subService("code", "Aplicații web", "Portaluri și servicii digitale rapide, accesibile și sigure."),
          subService("box", "Aplicații mobile", "iOS și Android, native sau cross-platform."),
          subService("spark", "Integrare AI", "Modele locale sau în cloud, cu date care rămân sub controlul tău."),
          subService("cloud", "Modernizare și cloud", "Migrarea sistemelor vechi fără oprirea activității."),
          subService("pulse", "Integrare și API", "Conectăm registre, plăți și servicii externe."),
        ],
        audience: texts(
          "Instituții publice care digitalizează servicii pentru cetățeni",
          "Companii care își înlocuiesc sistemele vechi",
          "Organizații care au nevoie de software auditat din punct de vedere al securității",
        ),
        approach: approach.ro,
        faq: [
          faqItem(
            "Cât durează un proiect tipic?",
            "Un prim modul funcțional ajunge de obicei în producție în câteva luni; stabilim etapele și termenele împreună, după evaluare.",
          ),
          faqItem("Cine deține codul?", "Tu. La final primești codul sursă, documentația și accesul la toate mediile."),
          faqItem(
            "Lucrați cu echipa noastră internă?",
            "Da. Putem conduce proiectul sau putem completa echipa ta cu ingineri și specialiști în securitate.",
          ),
        ],
      },
      en: {
        title: "Software development & digital transformation",
        slug: "software-development",
        summary: "Enterprise platforms, ERP and CRM, web and mobile apps, AI integration.",
        highlights: texts("Enterprise platforms", "Web and mobile", "AI integration"),
        kicker: "Software & digital transformation",
        headline: "Software for institutions and companies",
        intro:
          "We design and build enterprise platforms, public portals and mobile apps, with security considered from the first line of code.",
        guarantees: [
          guarantee("lock", "Secure by design", "threat model from day one"),
          guarantee("box", "Staged delivery", "demos at every iteration"),
          guarantee("layers", "Code handover", "full documentation and access"),
          guarantee("users", "Post-launch support", "the same team"),
        ],
        subServices: [
          subService("layers", "Enterprise platforms", "ERP, CRM and internal systems that integrate with what you already have."),
          subService("code", "Web applications", "Fast, accessible and secure portals and digital services."),
          subService("box", "Mobile apps", "iOS and Android, native or cross-platform."),
          subService("spark", "AI integration", "Local or cloud models, with data that stays under your control."),
          subService("cloud", "Modernisation & cloud", "Migrating legacy systems without stopping operations."),
          subService("pulse", "Integration & APIs", "We connect registries, payments and external services."),
        ],
        audience: texts(
          "Public institutions digitising citizen services",
          "Companies replacing legacy systems",
          "Organisations that need security-reviewed software",
        ),
        approach: approach.en,
        faq: [
          faqItem(
            "How long does a typical project take?",
            "A first working module usually reaches production within a few months; we agree on stages and dates together after the assessment.",
          ),
          faqItem("Who owns the code?", "You do. At the end you receive the source code, documentation and access to every environment."),
          faqItem(
            "Do you work with our in-house team?",
            "Yes. We can lead the project or extend your team with engineers and security specialists.",
          ),
        ],
      },
      ru: {
        title: "Разработка ПО и цифровая трансформация",
        slug: "razrabotka-po",
        summary: "Корпоративные платформы, ERP и CRM, веб- и мобильные приложения, интеграция ИИ.",
        highlights: texts("Корпоративные платформы", "Веб и мобильные", "Интеграция ИИ"),
        kicker: "Разработка и цифровая трансформация",
        headline: "Программное обеспечение для учреждений и компаний",
        intro:
          "Проектируем и создаём корпоративные платформы, государственные порталы и мобильные приложения, закладывая безопасность с первой строки кода.",
        guarantees: [
          guarantee("lock", "Безопасность by design", "модель угроз с первого дня"),
          guarantee("box", "Поэтапная поставка", "демонстрации на каждой итерации"),
          guarantee("layers", "Передача кода", "полная документация и доступы"),
          guarantee("users", "Поддержка после запуска", "та же команда"),
        ],
        subServices: [
          subService("layers", "Корпоративные платформы", "ERP, CRM и внутренние системы, которые интегрируются с существующими."),
          subService("code", "Веб-приложения", "Быстрые, доступные и защищённые порталы и цифровые сервисы."),
          subService("box", "Мобильные приложения", "iOS и Android, нативные или кроссплатформенные."),
          subService("spark", "Интеграция ИИ", "Локальные или облачные модели; данные остаются под вашим контролем."),
          subService("cloud", "Модернизация и облако", "Миграция устаревших систем без остановки работы."),
          subService("pulse", "Интеграции и API", "Подключаем реестры, платежи и внешние сервисы."),
        ],
        audience: texts(
          "Государственные учреждения, цифровизирующие услуги для граждан",
          "Компании, заменяющие устаревшие системы",
          "Организации, которым нужно ПО с проверкой безопасности",
        ),
        approach: approach.ru,
        faq: [
          faqItem(
            "Сколько длится типичный проект?",
            "Первый рабочий модуль обычно выходит в продакшн за несколько месяцев; этапы и сроки согласуем вместе после оценки.",
          ),
          faqItem("Кому принадлежит код?", "Вам. В конце вы получаете исходный код, документацию и доступ ко всем средам."),
          faqItem(
            "Вы работаете с нашей внутренней командой?",
            "Да. Мы можем вести проект или усилить вашу команду инженерами и специалистами по безопасности.",
          ),
        ],
      },
    },
  },
  {
    base: { kind: "main", icon: "shield", order: 2 },
    l: {
      ro: {
        title: "Securitate cibernetică și apărare",
        slug: "securitate-cibernetica",
        summary: "SOC, teste de penetrare, răspuns la incidente și conformitate.",
        highlights: texts("SOC 24/7", "Teste de penetrare", "ISO 27001 și NIS2"),
        kicker: "Securitate cibernetică și apărare",
        headline: "Securitate cibernetică completă pentru o organizație rezilientă",
        intro:
          "Ajutăm organizațiile să prevină, să detecteze, să răspundă și să se recupereze după amenințările cibernetice, asigurând continuitatea activității și conformitatea cu reglementările.",
        guarantees: [
          guarantee("clock", "24/7", "monitorizare"),
          guarantee("pulse", "Răspuns rapid", "la incidente"),
          guarantee("badge", "ISO 27001 · NIS2", "conformitate"),
          guarantee("shield", "Infrastructură critică", "experiență"),
        ],
        subServices: [
          subService("pulse", "SOC și securitate gestionată", "Monitorizare continuă, detecție și răspuns."),
          subService("search", "Teste de penetrare", "Găsim vulnerabilitățile înaintea atacatorilor."),
          subService("shield", "Răspuns la incidente", "Izolare, analiză și recuperare."),
          subService("layers", "Managementul vulnerabilităților", "Evaluare și remediere prioritizată după risc."),
          subService("users", "Virtual CISO", "Conducere strategică și guvernanță a securității."),
          subService("badge", "Conformitate și certificare", "ISO 27001, NIS2, GDPR și aliniere la reglementări."),
        ],
        audience: texts(
          "Operatori de infrastructură critică și servicii esențiale (NIS2)",
          "Bănci, telecom și sector public",
          "Companii fără echipă internă de securitate",
        ),
        approach: approach.ro,
        faq: [
          faqItem(
            "Cât durează un test de penetrare?",
            "De obicei între una și trei săptămâni, în funcție de numărul de aplicații și de rețele. Primești un raport cu riscurile ordonate după impact și pași concreți de remediere.",
          ),
          faqItem(
            "Ne puteți ajuta cu conformitatea NIS2?",
            "Facem analiza decalajelor, scriem politicile lipsă și pregătim organizația pentru audit, inclusiv pentru ISO 27001.",
          ),
          faqItem(
            "Ce se întâmplă dacă suntem atacați acum?",
            "Sună-ne: echipa de răspuns izolează atacul, păstrează dovezile și te ajută să revii la activitate.",
          ),
        ],
      },
      en: {
        title: "Cybersecurity & cyber defence",
        slug: "cybersecurity",
        summary: "SOC, penetration testing, incident response and compliance.",
        highlights: texts("24/7 SOC", "Penetration testing", "ISO 27001 & NIS2"),
        kicker: "Cybersecurity & Cyber Defense",
        headline: "End-to-End Cybersecurity for a Resilient Organization",
        intro:
          "We help organizations prevent, detect, respond to and recover from cyber threats, ensuring business continuity and regulatory compliance.",
        guarantees: [
          guarantee("clock", "24/7", "monitoring"),
          guarantee("pulse", "Rapid response", "to incidents"),
          guarantee("badge", "ISO 27001 · NIS2", "compliance"),
          guarantee("shield", "Critical infrastructure", "experience"),
        ],
        subServices: [
          subService("pulse", "SOC & managed security", "Continuous monitoring, detection and response."),
          subService("search", "Penetration testing", "We find vulnerabilities before attackers do."),
          subService("shield", "Incident response", "Containment, analysis and recovery."),
          subService("layers", "Vulnerability management", "Assessment and risk-prioritised remediation."),
          subService("users", "Virtual CISO", "Strategic security leadership and governance."),
          subService("badge", "Compliance & certification", "ISO 27001, NIS2, GDPR and regulatory alignment."),
        ],
        audience: texts(
          "Critical infrastructure and essential service operators (NIS2)",
          "Banks, telecoms and the public sector",
          "Companies without an in-house security team",
        ),
        approach: approach.en,
        faq: [
          faqItem(
            "How long does a penetration test take?",
            "Usually one to three weeks, depending on the number of applications and networks. You receive a report with risks ranked by impact and concrete remediation steps.",
          ),
          faqItem(
            "Can you help with NIS2 compliance?",
            "We run the gap analysis, write the missing policies and prepare the organisation for audit, including ISO 27001.",
          ),
          faqItem(
            "What if we’re under attack right now?",
            "Call us: the response team contains the attack, preserves evidence and helps you get back to business.",
          ),
        ],
      },
      ru: {
        title: "Кибербезопасность и киберзащита",
        slug: "kiberbezopasnost",
        summary: "SOC, тестирование на проникновение, реагирование на инциденты и соответствие требованиям.",
        highlights: texts("SOC 24/7", "Тесты на проникновение", "ISO 27001 и NIS2"),
        kicker: "Кибербезопасность и киберзащита",
        headline: "Комплексная кибербезопасность для устойчивой организации",
        intro:
          "Мы помогаем организациям предотвращать киберугрозы, обнаруживать их, реагировать и восстанавливаться, обеспечивая непрерывность бизнеса и соответствие требованиям.",
        guarantees: [
          guarantee("clock", "24/7", "мониторинг"),
          guarantee("pulse", "Быстрое реагирование", "на инциденты"),
          guarantee("badge", "ISO 27001 · NIS2", "соответствие"),
          guarantee("shield", "Критическая инфраструктура", "опыт"),
        ],
        subServices: [
          subService("pulse", "SOC и управляемая безопасность", "Непрерывный мониторинг, обнаружение и реагирование."),
          subService("search", "Тестирование на проникновение", "Находим уязвимости раньше злоумышленников."),
          subService("shield", "Реагирование на инциденты", "Изоляция, анализ и восстановление."),
          subService("layers", "Управление уязвимостями", "Оценка и устранение с приоритетом по риску."),
          subService("users", "Виртуальный CISO", "Стратегическое руководство и управление безопасностью."),
          subService("badge", "Соответствие и сертификация", "ISO 27001, NIS2, GDPR и требования регуляторов."),
        ],
        audience: texts(
          "Операторы критической инфраструктуры и основных услуг (NIS2)",
          "Банки, телеком и государственный сектор",
          "Компании без собственной команды безопасности",
        ),
        approach: approach.ru,
        faq: [
          faqItem(
            "Сколько длится тест на проникновение?",
            "Обычно от одной до трёх недель, в зависимости от числа приложений и сетей. Вы получаете отчёт с рисками, упорядоченными по влиянию, и конкретными шагами по устранению.",
          ),
          faqItem(
            "Поможете с соответствием NIS2?",
            "Проводим анализ разрывов, пишем недостающие политики и готовим организацию к аудиту, в том числе по ISO 27001.",
          ),
          faqItem(
            "Что делать, если нас атакуют прямо сейчас?",
            "Звоните нам: команда реагирования изолирует атаку, сохранит доказательства и поможет вернуться к работе.",
          ),
        ],
      },
    },
  },
  {
    base: { kind: "main", icon: "search", order: 3 },
    l: {
      ro: {
        title: "Intelligence și investigații",
        slug: "intelligence-investigatii",
        summary: "Due diligence, OSINT, investigații de fraudă și digitale.",
        highlights: texts("Due diligence", "OSINT", "Investigații digitale"),
        kicker: "Intelligence și investigații",
        headline: "Informație verificată pentru decizii grele.",
        intro:
          "Colectăm și analizăm informații din surse deschise și din urme digitale, ca deciziile tale să se sprijine pe fapte verificate.",
        guarantees: [
          guarantee("lock", "Confidențialitate", "acord de nedivulgare din prima zi"),
          guarantee("search", "Surse legale", "metode documentate"),
          guarantee("check", "Concluzii verificabile", "fiecare afirmație are sursă"),
          guarantee("users", "Analiști dedicați", "un singur responsabil"),
        ],
        subServices: [
          subService("check", "Due diligence", "Verificarea partenerilor, furnizorilor și investițiilor."),
          subService("search", "OSINT", "Analiză din surse deschise, cu metodologie documentată."),
          subService("shield", "Investigații de fraudă", "Reconstituim schemele și identificăm responsabilii."),
          subService("code", "Investigații digitale", "Analiză forensică a dispozitivelor și a urmelor digitale."),
          subService("target", "Analiza riscului", "Evaluarea expunerii reputaționale și operaționale."),
        ],
        audience: texts(
          "Companii înaintea unei achiziții sau a unui parteneriat",
          "Departamente de conformitate și audit intern",
          "Organizații care suspectează o fraudă internă",
        ),
        approach: approach.ro,
        faq: [
          faqItem(
            "Ce surse folosiți?",
            "Doar surse legale: registre publice, date deschise, presă, rețele sociale publice și urme digitale obținute cu acordul tău.",
          ),
          faqItem("Primim un raport?", "Da: un raport cu concluzii, nivel de încredere și sursa fiecărei afirmații."),
        ],
      },
      en: {
        title: "Intelligence & investigations",
        slug: "intelligence-investigations",
        summary: "Due diligence, OSINT, fraud and digital investigations.",
        highlights: texts("Due diligence", "OSINT", "Digital investigations"),
        kicker: "Intelligence & investigations",
        headline: "Verified information for hard decisions.",
        intro: "We collect and analyse open-source information and digital traces so your decisions rest on checked facts.",
        guarantees: [
          guarantee("lock", "Confidentiality", "NDA from day one"),
          guarantee("search", "Lawful sources", "documented methods"),
          guarantee("check", "Verifiable findings", "every claim is sourced"),
          guarantee("users", "Dedicated analysts", "one accountable lead"),
        ],
        subServices: [
          subService("check", "Due diligence", "Vetting partners, suppliers and investments."),
          subService("search", "OSINT", "Open-source analysis with a documented methodology."),
          subService("shield", "Fraud investigations", "We reconstruct schemes and identify those responsible."),
          subService("code", "Digital investigations", "Forensic analysis of devices and digital traces."),
          subService("target", "Risk analysis", "Assessing reputational and operational exposure."),
        ],
        audience: texts(
          "Companies ahead of an acquisition or partnership",
          "Compliance and internal audit teams",
          "Organisations that suspect internal fraud",
        ),
        approach: approach.en,
        faq: [
          faqItem(
            "What sources do you use?",
            "Only lawful ones: public registries, open data, media, public social networks and digital traces obtained with your consent.",
          ),
          faqItem("Do we get a report?", "Yes: a report with findings, confidence levels and the source of every claim."),
        ],
      },
      ru: {
        title: "Аналитика и расследования",
        slug: "analitika-rassledovaniya",
        summary: "Due diligence, OSINT, расследования мошенничества и цифровые расследования.",
        highlights: texts("Due diligence", "OSINT", "Цифровые расследования"),
        kicker: "Аналитика и расследования",
        headline: "Проверенная информация для сложных решений.",
        intro: "Собираем и анализируем данные из открытых источников и цифровые следы, чтобы ваши решения опирались на проверенные факты.",
        guarantees: [
          guarantee("lock", "Конфиденциальность", "NDA с первого дня"),
          guarantee("search", "Законные источники", "документированные методы"),
          guarantee("check", "Проверяемые выводы", "у каждого утверждения есть источник"),
          guarantee("users", "Выделенные аналитики", "один ответственный"),
        ],
        subServices: [
          subService("check", "Due diligence", "Проверка партнёров, поставщиков и инвестиций."),
          subService("search", "OSINT", "Анализ открытых источников по документированной методике."),
          subService("shield", "Расследование мошенничества", "Восстанавливаем схемы и устанавливаем ответственных."),
          subService("code", "Цифровые расследования", "Криминалистический анализ устройств и цифровых следов."),
          subService("target", "Анализ рисков", "Оценка репутационных и операционных рисков."),
        ],
        audience: texts(
          "Компании перед сделкой или партнёрством",
          "Службы комплаенса и внутреннего аудита",
          "Организации, подозревающие внутреннее мошенничество",
        ),
        approach: approach.ru,
        faq: [
          faqItem(
            "Какие источники вы используете?",
            "Только законные: публичные реестры, открытые данные, СМИ, публичные соцсети и цифровые следы, полученные с вашего согласия.",
          ),
          faqItem("Мы получим отчёт?", "Да: отчёт с выводами, уровнем достоверности и источником каждого утверждения."),
        ],
      },
    },
  },
  {
    base: { kind: "main", icon: "finger", order: 4 },
    l: {
      ro: {
        title: "Profilare și poligraf",
        slug: "profilare-poligraf",
        summary: "Analiză comportamentală, evaluarea riscului și examinări poligraf.",
        highlights: texts("Analiză comportamentală", "Evaluarea riscului", "Examinări poligraf"),
        kicker: "Profilare și poligraf",
        headline: "Evaluări de integritate",
        intro:
          "Examinări poligraf și profilare comportamentală pentru angajare și investigații interne, cu acordul persoanei și cu proceduri clare.",
        guarantees: [
          guarantee("check", "Consimțământ scris", "pentru fiecare examinare"),
          guarantee("lock", "Confidențialitate", "rezultate doar pentru client"),
          guarantee("badge", "Examinatori pregătiți", "proceduri standardizate"),
          guarantee("users", "Abordare etică", "respect pentru persoană"),
        ],
        subServices: [
          subService("eye", "Analiză comportamentală", "Interviuri structurate și evaluarea riscului de integritate."),
          subService("finger", "Examinări poligraf", "Pentru angajare sau investigații interne, cu acordul persoanei."),
          subService("target", "Evaluarea riscului de personal", "Pentru poziții sensibile și acces la informații critice."),
          subService("grad", "Instruire", "Pentru echipele de resurse umane și securitate internă."),
        ],
        audience: texts(
          "Bănci și companii cu poziții sensibile",
          "Departamente de securitate internă",
          "Organizații care investighează incidente interne",
        ),
        approach: approach.ro,
        faq: [
          faqItem(
            "Examinarea poligraf e voluntară?",
            "Da. Are loc doar cu acordul scris al persoanei, care poate opri examinarea oricând.",
          ),
          faqItem("Cine primește rezultatele?", "Doar clientul care a solicitat examinarea, în condiții de confidențialitate."),
        ],
      },
      en: {
        title: "Profiling & polygraph",
        slug: "profiling-polygraph",
        summary: "Behavioural analysis, risk assessment and polygraph examinations.",
        highlights: texts("Behavioural analysis", "Risk assessment", "Polygraph examinations"),
        kicker: "Profiling & polygraph",
        headline: "Integrity assessments",
        intro:
          "Polygraph examinations and behavioural profiling for hiring and internal investigations, with the person’s consent and clear procedures.",
        guarantees: [
          guarantee("check", "Written consent", "for every examination"),
          guarantee("lock", "Confidentiality", "results for the client only"),
          guarantee("badge", "Trained examiners", "standardised procedures"),
          guarantee("users", "Ethical approach", "respect for the individual"),
        ],
        subServices: [
          subService("eye", "Behavioural analysis", "Structured interviews and integrity risk assessment."),
          subService("finger", "Polygraph examinations", "For hiring or internal investigations, with the person’s consent."),
          subService("target", "Personnel risk assessment", "For sensitive roles and access to critical information."),
          subService("grad", "Training", "For HR and internal security teams."),
        ],
        audience: texts(
          "Banks and companies with sensitive roles",
          "Internal security departments",
          "Organisations investigating internal incidents",
        ),
        approach: approach.en,
        faq: [
          faqItem(
            "Is the polygraph examination voluntary?",
            "Yes. It only takes place with the person’s written consent, and they can stop it at any time.",
          ),
          faqItem("Who receives the results?", "Only the client who requested the examination, under confidentiality."),
        ],
      },
      ru: {
        title: "Профайлинг и полиграф",
        slug: "profajling-poligraf",
        summary: "Поведенческий анализ, оценка рисков и полиграфные проверки.",
        highlights: texts("Поведенческий анализ", "Оценка рисков", "Полиграфные проверки"),
        kicker: "Профайлинг и полиграф",
        headline: "Проверка благонадёжности",
        intro:
          "Полиграфные проверки и поведенческий профайлинг при найме и внутренних расследованиях, с согласия человека и по чётким процедурам.",
        guarantees: [
          guarantee("check", "Письменное согласие", "для каждой проверки"),
          guarantee("lock", "Конфиденциальность", "результаты только для клиента"),
          guarantee("badge", "Подготовленные полиграфологи", "стандартизированные процедуры"),
          guarantee("users", "Этичный подход", "уважение к человеку"),
        ],
        subServices: [
          subService("eye", "Поведенческий анализ", "Структурированные интервью и оценка риска благонадёжности."),
          subService("finger", "Полиграфные проверки", "При найме или во внутренних расследованиях, с согласия человека."),
          subService("target", "Оценка кадровых рисков", "Для чувствительных должностей и доступа к критической информации."),
          subService("grad", "Обучение", "Для HR и служб внутренней безопасности."),
        ],
        audience: texts(
          "Банки и компании с чувствительными должностями",
          "Службы внутренней безопасности",
          "Организации, расследующие внутренние инциденты",
        ),
        approach: approach.ru,
        faq: [
          faqItem(
            "Проверка на полиграфе добровольная?",
            "Да. Она проводится только с письменного согласия человека, который может остановить её в любой момент.",
          ),
          faqItem("Кто получает результаты?", "Только клиент, заказавший проверку, на условиях конфиденциальности."),
        ],
      },
    },
  },
  {
    base: { kind: "additional", icon: "users", order: 11 },
    l: {
      ro: {
        title: "Virtual CISO",
        slug: "virtual-ciso",
        summary: "Un director de securitate cu normă parțială, pentru echipele fără specialist intern.",
      },
      en: { title: "Virtual CISO", slug: "virtual-ciso", summary: "A part-time security lead for teams without an in-house specialist." },
      ru: {
        title: "Виртуальный CISO",
        slug: "virtualnyy-ciso",
        summary: "Руководитель по безопасности на частичной занятости для команд без штатного специалиста.",
      },
    },
  },
  {
    base: { kind: "additional", icon: "badge", order: 12 },
    l: {
      ro: { title: "ISO 27001 și NIS2", slug: "iso-27001-nis2", summary: "Analiza decalajelor, politici și pregătire pentru audit." },
      en: { title: "ISO 27001 & NIS2", slug: "iso-27001-nis2", summary: "Gap analysis, policies and audit readiness." },
      ru: { title: "ISO 27001 и NIS2", slug: "iso-27001-nis2", summary: "Анализ разрывов, политики и подготовка к аудиту." },
    },
  },
  {
    base: { kind: "additional", icon: "cloud", order: 13 },
    l: {
      ro: {
        title: "Securitate cloud",
        slug: "securitate-cloud",
        summary: "Configurare sigură și monitorizare pentru AWS, Azure și cloud privat.",
      },
      en: {
        title: "Cloud security",
        slug: "cloud-security",
        summary: "Secure configuration and monitoring for AWS, Azure and private cloud.",
      },
      ru: {
        title: "Облачная безопасность",
        slug: "oblachnaya-bezopasnost",
        summary: "Безопасная настройка и мониторинг AWS, Azure и частного облака.",
      },
    },
  },
  {
    base: { kind: "additional", icon: "grad", order: 14 },
    l: {
      ro: {
        title: "Instruire și conștientizare",
        slug: "instruire",
        summary: "Exerciții de phishing și instruire pentru angajați și conducere.",
      },
      en: { title: "Training & awareness", slug: "training", summary: "Phishing exercises and training for staff and leadership." },
      ru: { title: "Обучение и осведомлённость", slug: "obuchenie", summary: "Фишинговые учения и обучение сотрудников и руководства." },
    },
  },
];
