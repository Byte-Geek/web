import type { Block } from "../lexical.ts";

type Tri = { ro: string; en: string; ru: string };
const translated = (ro: string, en: string, ru: string): Tri => ({ ro, en, ru });

export const technologies: [string, string, string, Tri | string, boolean][] = [
  ["SIEM", "security", "pulse", "Wazuh · Splunk", true],
  ["XDR / EDR", "security", "layers", "endpoint", true],
  ["SOAR", "security", "code", translated("automatizare", "automation", "автоматизация"), true],
  ["NDR", "security", "search", translated("rețea", "network", "сеть"), true],
  ["IDS / IPS", "security", "shield", "Suricata · Snort", true],
  ["Threat Intelligence", "security", "eye", "MISP · OpenCTI", true],
  ["Zero Trust", "security", "lock", "ZTNA", true],
  ["IAM / IdP", "security", "users", "Keycloak", true],
  ["DLP · CASB · SASE", "security", "box", translated("date și acces", "data & access", "данные и доступ"), true],
  ["Pen testing", "security", "target", "Kali · Burp", true],
  ["MITRE ATT&CK", "security", "badge", translated("cadru", "framework", "методология"), true],
  ["OWASP", "security", "check", "ASVS · Top 10", true],
  [".NET", "backend", "code", "ASP.NET Core", true],
  ["Java", "backend", "code", "Spring", true],
  ["Node.js", "backend", "code", "API", true],
  ["PostgreSQL", "backend", "box", translated("date", "data", "данные"), true],
  ["Microservices", "backend", "layers", translated("arhitectură", "architecture", "архитектура"), true],
  ["REST · gRPC", "backend", "pulse", "API", true],
  ["React · Next.js", "frontend", "code", "web", true],
  ["TypeScript", "frontend", "code", translated("limbaj", "language", "язык"), true],
  ["Angular", "frontend", "code", "web", true],
  ["Flutter", "mobile", "layers", "cross-platform", true],
  ["Kotlin", "mobile", "box", "Android", true],
  ["Swift", "mobile", "box", "iOS", true],
  ["Docker", "cloud", "box", translated("containere", "containers", "контейнеры"), true],
  ["Kubernetes", "cloud", "layers", translated("orchestrare", "orchestration", "оркестрация"), true],
  ["AWS · Azure", "cloud", "cloud", "cloud", true],
  ["Terraform", "cloud", "code", "IaC", true],
  ["GitLab CI", "cloud", "pulse", "CI/CD", true],
  ["Python", "data", "code", translated("analiză", "analysis", "анализ"), true],
  ["Elasticsearch", "data", "search", translated("căutare", "search", "поиск"), true],
  ["Kafka", "data", "pulse", translated("fluxuri", "streams", "потоки"), true],
  ["Local LLM", "data", "lock", translated("AI privat", "private AI", "приватный ИИ"), true],
  ["Redis", "backend", "box", "", false],
  ["RabbitMQ", "backend", "pulse", "", false],
  ["Vue", "frontend", "code", "", false],
  ["Ansible", "cloud", "code", "", false],
  ["Grafana", "data", "pulse", "", false],
  ["Prometheus", "cloud", "pulse", "", false],
  ["Nginx", "cloud", "layers", "", false],
  ["MongoDB", "data", "box", "", false],
];

export const team: { name: string; dept: string; featured: boolean; role: Tri }[] = [
  {
    name: "Alexei I.",
    dept: "leadership",
    featured: true,
    role: translated("Director general", "Chief Executive Officer", "Генеральный директор"),
  },
  {
    name: "Elena M.",
    dept: "security",
    featured: true,
    role: translated("Director securitate cibernetică", "Head of Cybersecurity", "Руководитель кибербезопасности"),
  },
  {
    name: "Andrei P.",
    dept: "engineering",
    featured: true,
    role: translated("Director inginerie", "Head of Engineering", "Руководитель разработки"),
  },
  {
    name: "Irina C.",
    dept: "intelligence",
    featured: true,
    role: translated("Director intelligence", "Head of Intelligence", "Руководитель аналитики"),
  },
];

// Logos are uploaded in the CMS; until then the name is shown.
export const clients = ["MAIB", "moldcell", "Moldindconbank", "ANRE", "OCN", "NHEC"];

type CaseL = {
  title: string;
  slug: string;
  summary: string;
  client: string;
  sector: string;
  context: string;
  challenge: string;
  solution: string[];
  results: string[];
};
export const cases: { domain: string; techs: string[]; l: Record<"ro" | "en" | "ru", CaseL> }[] = [
  {
    domain: "security",
    techs: ["SIEM", "XDR / EDR", "SOAR", "IDS / IPS"],
    l: {
      ro: {
        title: "Reziliență cibernetică pentru un operator critic",
        slug: "soc-operator-critic",
        summary: "SOC și procedură de răspuns la incidente pentru un operator de infrastructură critică.",
        client: "Operator de infrastructură critică",
        sector: "Energie",
        context: "Operatorul avea instrumente de securitate dispersate și nicio vedere unificată asupra alertelor.",
        challenge: "Detecția depindea de verificări manuale, iar procedura de răspuns la incidente nu era testată.",
        solution: [
          "Centru de operațiuni de securitate (SOC) cu monitorizare continuă",
          "Corelarea evenimentelor din rețea, servere și stații de lucru",
          "Proceduri de răspuns la incidente, testate în exerciții",
          "Instruirea echipei interne",
        ],
        results: ["Vedere unificată asupra alertelor", "Procedură de răspuns documentată și exersată", "Raportare lunară către conducere"],
      },
      en: {
        title: "Cyber resilience for a critical operator",
        slug: "critical-operator-soc",
        summary: "SOC and incident response procedures for a critical infrastructure operator.",
        client: "Critical infrastructure operator",
        sector: "Energy",
        context: "The operator had scattered security tools and no unified view of alerts.",
        challenge: "Detection relied on manual checks, and the incident response procedure had never been tested.",
        solution: [
          "A security operations centre (SOC) with continuous monitoring",
          "Correlation of events from network, servers and workstations",
          "Incident response procedures, tested in exercises",
          "Training for the in-house team",
        ],
        results: ["A unified view of alerts", "A documented, rehearsed response procedure", "Monthly reporting to management"],
      },
      ru: {
        title: "Киберустойчивость для критического оператора",
        slug: "soc-kriticheskij-operator",
        summary: "SOC и процедуры реагирования на инциденты для оператора критической инфраструктуры.",
        client: "Оператор критической инфраструктуры",
        sector: "Энергетика",
        context: "У оператора были разрозненные средства защиты и не было единой картины оповещений.",
        challenge: "Обнаружение зависело от ручных проверок, а процедура реагирования не проверялась на практике.",
        solution: [
          "Центр мониторинга безопасности (SOC) с непрерывным мониторингом",
          "Корреляция событий сети, серверов и рабочих станций",
          "Процедуры реагирования, отработанные на учениях",
          "Обучение внутренней команды",
        ],
        results: [
          "Единая картина оповещений",
          "Задокументированная и отработанная процедура реагирования",
          "Ежемесячная отчётность руководству",
        ],
      },
    },
  },
  {
    domain: "software",
    techs: ["React · Next.js", "Java", "PostgreSQL", "Kubernetes"],
    l: {
      ro: {
        title: "Platformă digitală pentru servicii publice",
        slug: "platforma-servicii-publice",
        summary: "Portal scalabil, folosit zilnic de cetățeni.",
        client: "Instituție publică",
        sector: "Sector public",
        context: "Cererile cetățenilor se depuneau pe hârtie, cu termene lungi de procesare.",
        challenge: "Un portal care să ducă vârfuri de trafic, să fie accesibil și să protejeze datele personale.",
        solution: [
          "Portal web accesibil, în mai multe limbi",
          "Integrare cu registrele existente",
          "Autentificare securizată și jurnal de audit",
          "Infrastructură scalabilă, cu monitorizare",
        ],
        results: [
          "Cereri depuse online, fără deplasare",
          "Audit de securitate înainte de lansare",
          "Echipa instituției administrează conținutul",
        ],
      },
      en: {
        title: "Digital platform for public services",
        slug: "public-services-platform",
        summary: "A scalable portal used every day by citizens.",
        client: "Public institution",
        sector: "Public sector",
        context: "Citizens filed requests on paper, with long processing times.",
        challenge: "A portal that handles traffic peaks, is accessible and protects personal data.",
        solution: [
          "An accessible, multilingual web portal",
          "Integration with existing registries",
          "Secure authentication and an audit trail",
          "Scalable, monitored infrastructure",
        ],
        results: ["Requests filed online, without travel", "Security audit before launch", "The institution’s team manages the content"],
      },
      ru: {
        title: "Цифровая платформа для госуслуг",
        slug: "platforma-gosuslug",
        summary: "Масштабируемый портал, которым граждане пользуются каждый день.",
        client: "Государственное учреждение",
        sector: "Госсектор",
        context: "Граждане подавали заявления на бумаге, обработка занимала много времени.",
        challenge: "Портал, выдерживающий пиковые нагрузки, доступный и защищающий персональные данные.",
        solution: [
          "Доступный многоязычный веб-портал",
          "Интеграция с существующими реестрами",
          "Защищённая аутентификация и журнал аудита",
          "Масштабируемая инфраструктура с мониторингом",
        ],
        results: ["Заявления подаются онлайн, без визита", "Аудит безопасности до запуска", "Команда учреждения сама управляет контентом"],
      },
    },
  },
  {
    domain: "intelligence",
    techs: ["Python", "Elasticsearch", "Kafka", "Threat Intelligence"],
    l: {
      ro: {
        title: "Platformă OSINT și analiză de risc",
        slug: "platforma-osint",
        summary: "Colectare centralizată de date pentru decizii informate.",
        client: "Companie privată",
        sector: "Servicii financiare",
        context: "Analiștii colectau manual informații din zeci de surse.",
        challenge: "Centralizarea surselor, cu trasabilitate și control al accesului.",
        solution: [
          "Colectare automată din surse deschise",
          "Căutare și corelare într-un singur loc",
          "Fișe de risc cu sursa fiecărei informații",
          "Acces pe roluri și jurnal de audit",
        ],
        results: ["Analiza unui caz pornește dintr-un singur loc", "Fiecare concluzie are sursa atașată"],
      },
      en: {
        title: "OSINT and risk analysis platform",
        slug: "osint-platform",
        summary: "Centralised data collection for informed decisions.",
        client: "Private company",
        sector: "Financial services",
        context: "Analysts gathered information by hand from dozens of sources.",
        challenge: "Centralising sources with traceability and access control.",
        solution: [
          "Automated collection from open sources",
          "Search and correlation in one place",
          "Risk profiles with the source of every item",
          "Role-based access and an audit trail",
        ],
        results: ["Case analysis starts in one place", "Every finding has its source attached"],
      },
      ru: {
        title: "Платформа OSINT и анализа рисков",
        slug: "platforma-osint",
        summary: "Централизованный сбор данных для обоснованных решений.",
        client: "Частная компания",
        sector: "Финансы",
        context: "Аналитики вручную собирали информацию из десятков источников.",
        challenge: "Централизация источников с прослеживаемостью и контролем доступа.",
        solution: [
          "Автоматический сбор из открытых источников",
          "Поиск и корреляция в одном месте",
          "Карточки рисков с источником каждого факта",
          "Ролевой доступ и журнал аудита",
        ],
        results: ["Анализ дела начинается в одном месте", "У каждого вывода есть источник"],
      },
    },
  },
];

type PostL = { title: string; slug: string; excerpt: string; body: Block[] };
export const posts: { category: string; date: string; author: number; l: Record<"ro" | "en" | "ru", PostL> }[] = [
  {
    category: "security",
    date: "2026-06-30",
    author: 1,
    l: {
      ro: {
        title: "Peisajul amenințărilor cibernetice în 2026",
        slug: "peisajul-amenintarilor-2026",
        excerpt: "Ce tipuri de atacuri vedem cel mai des și ce pot face organizațiile mici și mari ca să fie pregătite.",
        body: [
          [
            "p",
            "Atacurile nu mai țintesc doar organizațiile mari. Scanările automate verifică fiecare adresă de pe internet în câteva ore, iar o vulnerabilitate publicată dimineața poate fi exploatată până seara.",
          ],
          ["h2", "Ce vedem cel mai des"],
          [
            "ul",
            [
              "**Scanări automate** ale serviciilor expuse: VPN-uri, panouri de administrare, servere de email.",
              "**Phishing țintit**, tot mai convingător, care urmărește conturile cu acces privilegiat.",
              "**Ransomware** precedat de furt de date, ca presiune suplimentară.",
            ],
          ],
          ["h2", "Ce poți face de luni"],
          [
            "ol",
            [
              "Fă inventarul a tot ce e expus pe internet.",
              "Activează autentificarea în doi pași pentru toate conturile de administrare.",
              "Testează restaurarea din backup, nu doar existența lui.",
              "Scrie și exersează procedura de răspuns la incidente.",
            ],
          ],
          ["quote", "Cele mai multe incidente pe care le investigăm încep cu ceva ce organizația nu știa că are expus."],
          ["h2", "NIS2 schimbă responsabilitatea"],
          [
            "p",
            "Directiva NIS2 face conducerea direct responsabilă pentru măsurile de securitate. Pentru multe organizații din România și, treptat, din Moldova, asta înseamnă politici scrise, raportarea incidentelor și evaluări periodice.",
          ],
        ],
      },
      en: {
        title: "The cyber threat landscape in 2026",
        slug: "threat-landscape-2026",
        excerpt: "The attacks we see most often, and what organisations large and small can do to be ready.",
        body: [
          [
            "p",
            "Attacks no longer target only large organisations. Automated scans check every address on the internet within hours, and a vulnerability published in the morning can be exploited by evening.",
          ],
          ["h2", "What we see most often"],
          [
            "ul",
            [
              "**Automated scans** of exposed services: VPNs, admin panels, mail servers.",
              "**Targeted phishing**, increasingly convincing, aimed at privileged accounts.",
              "**Ransomware** preceded by data theft, as extra pressure.",
            ],
          ],
          ["h2", "What you can do on Monday"],
          [
            "ol",
            [
              "Inventory everything exposed to the internet.",
              "Turn on two-factor authentication for all admin accounts.",
              "Test restoring from backup, not just that it exists.",
              "Write and rehearse your incident response procedure.",
            ],
          ],
          ["quote", "Most incidents we investigate start with something the organisation didn’t know it had exposed."],
          ["h2", "NIS2 shifts responsibility"],
          [
            "p",
            "The NIS2 directive makes management directly accountable for security measures. For many organisations in Romania and, gradually, Moldova, that means written policies, incident reporting and regular assessments.",
          ],
        ],
      },
      ru: {
        title: "Ландшафт киберугроз в 2026 году",
        slug: "landshaft-ugroz-2026",
        excerpt: "Какие атаки мы видим чаще всего и что могут сделать большие и малые организации, чтобы быть готовыми.",
        body: [
          [
            "p",
            "Атаки больше не нацелены только на крупные организации. Автоматические сканеры проверяют каждый адрес в интернете за несколько часов, а уязвимость, опубликованную утром, могут использовать уже вечером.",
          ],
          ["h2", "Что мы видим чаще всего"],
          [
            "ul",
            [
              "**Автоматическое сканирование** открытых сервисов: VPN, панелей администрирования, почтовых серверов.",
              "**Целевой фишинг**, всё более убедительный, нацеленный на привилегированные учётные записи.",
              "**Программы-вымогатели**, которым предшествует кража данных для дополнительного давления.",
            ],
          ],
          ["h2", "Что можно сделать уже в понедельник"],
          [
            "ol",
            [
              "Проведите инвентаризацию всего, что доступно из интернета.",
              "Включите двухфакторную аутентификацию для всех административных учётных записей.",
              "Проверьте восстановление из резервной копии, а не только её наличие.",
              "Опишите и отработайте процедуру реагирования на инциденты.",
            ],
          ],
          ["quote", "Большинство расследуемых нами инцидентов начинается с того, о чём организация не знала, что это открыто."],
          ["h2", "NIS2 меняет ответственность"],
          [
            "p",
            "Директива NIS2 делает руководство напрямую ответственным за меры безопасности. Для многих организаций в Румынии и постепенно в Молдове это означает письменные политики, отчётность об инцидентах и регулярные оценки.",
          ],
        ],
      },
    },
  },
  {
    category: "technology",
    date: "2026-06-14",
    author: 2,
    l: {
      ro: {
        title: "AI și automatizare în centrele SOC",
        slug: "ai-automatizare-soc",
        excerpt: "Unde ajută cu adevărat automatizarea într-un SOC și unde decizia trebuie să rămână la un analist.",
        body: [
          [
            "p",
            "Un centru de operațiuni de securitate primește mii de alerte pe zi. Automatizarea nu înlocuiește analiștii, dar le poate lua munca repetitivă.",
          ],
          ["h2", "Unde ajută"],
          [
            "ul",
            [
              "Îmbogățirea alertelor cu context (reputația IP-ului, istoricul utilizatorului).",
              "Gruparea alertelor înrudite într-un singur incident.",
              "Acțiuni de izolare standard, aprobate dinainte.",
            ],
          ],
          ["h2", "Unde nu"],
          [
            "p",
            "Deciziile cu impact asupra activității, cum ar fi oprirea unui sistem de producție, rămân la oameni. Modelele AI pot greși cu încredere, iar costul unei greșeli într-un SOC e mare.",
          ],
        ],
      },
      en: {
        title: "AI and automation in SOC operations",
        slug: "ai-automation-soc",
        excerpt: "Where automation genuinely helps in a SOC, and where the decision must stay with an analyst.",
        body: [
          [
            "p",
            "A security operations centre receives thousands of alerts a day. Automation doesn’t replace analysts, but it can take repetitive work off their hands.",
          ],
          ["h2", "Where it helps"],
          [
            "ul",
            [
              "Enriching alerts with context (IP reputation, user history).",
              "Grouping related alerts into a single incident.",
              "Standard, pre-approved containment actions.",
            ],
          ],
          ["h2", "Where it doesn’t"],
          [
            "p",
            "Decisions that affect operations, such as shutting down a production system, stay with people. AI models can be confidently wrong, and the cost of a mistake in a SOC is high.",
          ],
        ],
      },
      ru: {
        title: "ИИ и автоматизация в SOC",
        slug: "ii-avtomatizaciya-soc",
        excerpt: "Где автоматизация действительно помогает в SOC, а где решение должно оставаться за аналитиком.",
        body: [
          [
            "p",
            "Центр мониторинга безопасности получает тысячи оповещений в день. Автоматизация не заменяет аналитиков, но может снять с них рутинную работу.",
          ],
          ["h2", "Где она помогает"],
          [
            "ul",
            [
              "Обогащение оповещений контекстом (репутация IP, история пользователя).",
              "Объединение связанных оповещений в один инцидент.",
              "Стандартные заранее одобренные действия по изоляции.",
            ],
          ],
          ["h2", "Где нет"],
          [
            "p",
            "Решения, влияющие на работу, например остановка производственной системы, остаются за людьми. Модели ИИ могут уверенно ошибаться, а цена ошибки в SOC высока.",
          ],
        ],
      },
    },
  },
  {
    category: "security",
    date: "2026-05-28",
    author: 2,
    l: {
      ro: {
        title: "Ce am învățat construind un SOC național",
        slug: "lectii-soc-national",
        excerpt: "Lecții practice despre oameni, procese și instrumente, dintr-un proiect de anvergură.",
        body: [
          ["p", "Un SOC se construiește în timp. Instrumentele contează mai puțin decât procesele și oamenii care le folosesc."],
          ["h2", "Trei lecții"],
          [
            "ol",
            [
              "Începe cu sursele de date care contează, nu cu toate.",
              "Scrie procedurile înainte de a cumpăra instrumente.",
              "Măsoară timpul de detecție și de răspuns de la prima zi.",
            ],
          ],
        ],
      },
      en: {
        title: "Lessons from building a national SOC",
        slug: "lessons-national-soc",
        excerpt: "Practical lessons about people, processes and tools from a large-scale project.",
        body: [
          ["p", "A SOC is built over time. Tools matter less than the processes and the people who use them."],
          ["h2", "Three lessons"],
          [
            "ol",
            [
              "Start with the data sources that matter, not all of them.",
              "Write the procedures before you buy tools.",
              "Measure detection and response times from day one.",
            ],
          ],
        ],
      },
      ru: {
        title: "Чему мы научились, создавая национальный SOC",
        slug: "uroki-nacionalnogo-soc",
        excerpt: "Практические уроки о людях, процессах и инструментах из масштабного проекта.",
        body: [
          ["p", "SOC строится постепенно. Инструменты важны меньше, чем процессы и люди, которые ими пользуются."],
          ["h2", "Три урока"],
          [
            "ol",
            [
              "Начинайте с важных источников данных, а не со всех сразу.",
              "Опишите процедуры до покупки инструментов.",
              "Измеряйте время обнаружения и реагирования с первого дня.",
            ],
          ],
        ],
      },
    },
  },
  {
    category: "intelligence",
    date: "2026-05-15",
    author: 4,
    l: {
      ro: {
        title: "Riscuri cibernetice în sectorul energetic",
        slug: "riscuri-sector-energetic",
        excerpt: "De ce sistemele industriale sunt o țintă și cum se protejează fără a opri producția.",
        body: [
          [
            "p",
            "Sistemele industriale au fost proiectate să funcționeze decenii, nu să reziste atacurilor. Conectarea lor la rețelele de birou a creat drumuri noi pentru atacatori.",
          ],
          ["h2", "Primii pași"],
          [
            "ul",
            [
              "Separarea rețelei industriale de cea de birou.",
              "Inventarul echipamentelor și al versiunilor.",
              "Monitorizare pasivă, fără impact asupra producției.",
            ],
          ],
        ],
      },
      en: {
        title: "Cyber risks in the energy sector",
        slug: "energy-sector-risks",
        excerpt: "Why industrial systems are a target, and how to protect them without stopping production.",
        body: [
          [
            "p",
            "Industrial systems were designed to run for decades, not to withstand attacks. Connecting them to office networks created new paths for attackers.",
          ],
          ["h2", "First steps"],
          [
            "ul",
            [
              "Separate the industrial network from the office network.",
              "Inventory equipment and versions.",
              "Passive monitoring with no impact on production.",
            ],
          ],
        ],
      },
      ru: {
        title: "Киберриски в энергетике",
        slug: "kiberriski-energetika",
        excerpt: "Почему промышленные системы — цель и как защитить их, не останавливая производство.",
        body: [
          [
            "p",
            "Промышленные системы проектировались, чтобы работать десятилетиями, а не противостоять атакам. Подключение к офисным сетям открыло злоумышленникам новые пути.",
          ],
          ["h2", "Первые шаги"],
          [
            "ul",
            [
              "Отделить промышленную сеть от офисной.",
              "Провести инвентаризацию оборудования и версий.",
              "Пассивный мониторинг без влияния на производство.",
            ],
          ],
        ],
      },
    },
  },
  {
    category: "company",
    date: "2026-06-08",
    author: 1,
    l: {
      ro: {
        title: "INTELLECT la Forumul Regional de Securitate Cibernetică",
        slug: "forum-regional-securitate",
        excerpt: "Am vorbit despre pregătirea pentru NIS2 și despre colaborarea dintre sectorul public și cel privat.",
        body: [
          [
            "p",
            "Echipa noastră a participat la forumul regional dedicat securității cibernetice, unde am discutat despre pregătirea organizațiilor pentru NIS2.",
          ],
          ["p", "Detaliile evenimentului vor fi completate de echipa de comunicare."],
        ],
      },
      en: {
        title: "INTELLECT at the Regional Cybersecurity Forum",
        slug: "regional-cybersecurity-forum",
        excerpt: "We spoke about NIS2 readiness and public–private collaboration.",
        body: [
          ["p", "Our team took part in the regional cybersecurity forum, where we discussed how organisations can prepare for NIS2."],
          ["p", "Event details will be completed by the communications team."],
        ],
      },
      ru: {
        title: "INTELLECT на Региональном форуме по кибербезопасности",
        slug: "regionalnyj-forum-kiberbezopasnosti",
        excerpt: "Мы рассказали о подготовке к NIS2 и сотрудничестве государства и бизнеса.",
        body: [
          ["p", "Наша команда приняла участие в региональном форуме по кибербезопасности, где мы обсудили подготовку организаций к NIS2."],
          ["p", "Подробности мероприятия дополнит отдел коммуникаций."],
        ],
      },
    },
  },
];
