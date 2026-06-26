// Centralised copy for the public landing page.
//
// The main version of the site is Cantonese (`zh`, written in colloquial 口語).
// English (`en`) is the toggle. Both objects MUST share the exact same shape —
// components read whichever one matches the active language, so a missing key
// in one language would render `undefined`.
//
// Non-translatable data (images, icons, medal counts, form `value`s sent to the
// backend) stays in the components. Anything a visitor reads lives here.

export type Language = "zh" | "en";

export type Translation = typeof en;

export const en = {
  nav: {
    home: "Home",
    why: "Why Olympiads",
    path: "Path",
    tutors: "Tutors",
    test: "Test",
    join: "Join",
    joinTest: "Join the Test",
    // Label shown ON the toggle button = the language you switch TO.
    switchTo: "中文",
    switchToAria: "切換到中文",
  },
  hero: {
    chip: "Hong Kong",
    title: "Olympiads are the path to the world's top universities.",
    subtitle:
      "One diagnostic test. We choose the right subject. We handle the preparation. Parents take one step — register your child for the Olympiad Thinking Test.",
    limited: "Limited seats for the 18 July test.",
    cta: "Join the Test",
    cardLabel: "Olympiad Thinking Test",
    cardDate: "18 July",
    cardLocation: "Hong Kong",
    cardQuote: "\"No one knows what he is capable of doing until he tries.\"",
  },
  why: {
    chip: "Why Olympiads",
    quote:
      "\"When we see an Olympiad medal on an application, we know we're looking at a student who can think under pressure and stay with a hard problem long after most would give up. That's the kind of mind we're trying to admit.\"",
    attribution: "— Admissions officer, top-10 global university",
  },
  subjects: {
    title: "Six Subjects. One Strongest Direction.",
    subtitle:
      "After the diagnostic test, WestBridge identifies the discipline where the student has the strongest advantage — then handles every step of the preparation.",
    // Order must match the icon list in ImageShowcaseSection.tsx
    items: [
      "Mathematics",
      "Physics",
      "Chemistry",
      "Biology",
      "Informatics / CS",
      "Geography",
    ],
  },
  path: {
    chip: "Student Path",
    title: "From one test to a university-ready profile",
    cta: "Secure Your Spot →",
    // Order must match the `num`/`wide` list in Schedule.tsx
    nodes: [
      { title: "The Thinking Test", caption: "The entry gate" },
      {
        title: "Choose Your Discipline",
        caption: "Math · Physics · Chemistry · Biology · Informatics",
      },
      {
        title: "Preparation",
        caption: "Weekly coaching · problem sets · mock olympiads · mentorship",
      },
      { title: "Win the Olympiad", caption: "Regional → National → International" },
      { title: "Step Into Your Future", caption: "Top-tier university admission" },
    ],
  },
  tutors: {
    chip: "Tutors",
    title: "Coached by Olympiad medalists",
    // Order must match the photo list in TutorsSection.tsx
    list: [
      {
        role: "Math Coach · IMO Silver Medalist",
        bullets: [
          "IMO (International Math Olympiad) Silver Medalist",
          "Studied Computer Science at HKUST",
          "Helps students see the math hidden in everyday problems",
        ],
        quote:
          "Olympiads are a huge advantage even after your bachelor's and master's. Companies are hunting for people who can think like this.",
      },
      {
        role: "Physics Coach · 6 years teaching",
        bullets: [
          "Medalist at IJSO and the Balkan Physics Olympiad",
          "Medalist at International Tuymaada, Zhautykov, and Kazakhstan Republic Physics Olympiad",
          "6 years of teaching experience",
        ],
        quote:
          "Physics rewards students who are willing to stay with a problem after the obvious method fails.",
      },
      {
        role: "Informatics Coach · IOI Bronze",
        bullets: [
          "IOI (International Informatics Olympiad) Bronze Medalist",
          "HKU full scholarship · ICPC regional medalist",
          "Two-time Kazakhstan National Olympiad gold medalist",
        ],
        quote:
          "CS is no longer optional. Students who learn algorithms early understand the world before everyone else catches up.",
      },
    ],
  },
  results: {
    chip: "Results",
    title: "Medals from the same methodology",
    subtitle:
      "Outcomes from students trained through the same methodology and programme model across international, republic, and state-level Olympiads.",
    gold: "Gold",
    silver: "Silver",
    bronze: "Bronze",
    // Order must match the rows in MedalsSection.tsx
    rows: [
      "International (last 2 years)",
      "Republic 2026",
      "Republic 2025",
    ],
  },
  stories: {
    chip: "Success Stories",
    title: "From students trained on the same methodology",
    subtitle:
      "These outcomes come from students trained through the same methodology and programme model across international, republic, and state-level Olympiads.",
    // Order must match the image list in Testimonials.tsx
    list: [
      {
        content:
          "Without a mentor I would have spent months stuck on the wrong problems. Having someone who already walked the road tell me exactly what to fix changed everything.",
        author: "HKPhO Gold 2026",
        role: "Grade 8 student",
      },
      {
        content:
          "EuPhO silver and APhO bronze taught me that the jump is never magic. It is one careful correction after another.",
        author: "EuPhO Silver · APhO Bronze 2026",
        role: "Final-year secondary school student",
      },
      {
        content:
          "I never thought companies would actively search for Olympiad winners even after four years of bachelor's. The skills you build on the way stay with you for life.",
        author: "IOI Bronze Medalist",
        role: "HKU graduate · Huawei",
      },
    ],
  },
  newsletter: {
    chip: "Join the Test",
    detailsTitle: "The Olympiad Thinking Test",
    detailsSubtitle: "One test to discover where your child can win.",
    // Order must match the details list in Newsletter.tsx
    details: [
      { label: "Date", value: "18 July 2026" },
      { label: "Location", value: "Hong Kong" },
      { label: "Price", value: "300 HKD" },
      {
        label: "What it measures",
        value: "Reasoning style, current level, subject preferences",
      },
      { label: "Outcome", value: "The best Olympiad direction for your child" },
      {
        label: "Next step",
        value: "WestBridge handles all preparation from here",
      },
    ],
    countdownTitle: "Test Countdown",
    days: "Days",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
    formBadge: "Join the Test",
    formTitle: "Register your child",
    parentName: "Parent Name",
    parentNamePlaceholder: "Enter parent's full name",
    email: "Email",
    emailPlaceholder: "Enter email address",
    whatsapp: "WhatsApp / Phone",
    whatsappPlaceholder: "Enter WhatsApp or phone number",
    studentName: "Student Name",
    studentNamePlaceholder: "Enter student's full name",
    studentGrade: "Student Grade / Year",
    studentGradePlaceholder: "e.g. Grade 9 / Year 10",
    subject: "Interested Subject",
    subjectPlaceholder: "Select a subject",
    // `value` is sent to the backend and must stay constant across languages.
    subjectOptions: [
      { value: "Math", label: "Math" },
      { value: "Physics", label: "Physics" },
      { value: "Chemistry", label: "Chemistry" },
      { value: "Biology", label: "Biology" },
      { value: "Informatics", label: "Informatics" },
      { value: "Geography", label: "Geography" },
      { value: "Not sure yet", label: "Not sure yet" },
    ],
    background: "Current School / Background",
    backgroundPlaceholder:
      "Current school, grade level, any olympiad experience, and what you're hoping for",
    submit: "Submit",
    submitting: "Submitting...",
    errorRequired: "Please fill in all required fields",
    errorFailed: "Submission failed",
    success: "Registration submitted! We'll be in touch on WhatsApp shortly.",
  },
  footer: {
    name: "WestBridge Olympiad Academy",
    tagline: "Olympiad preparation for ambitious Hong Kong students.",
    privacy: "Privacy Policy",
    location: "Hong Kong",
  },
};

export const zh: Translation = {
  nav: {
    home: "主頁",
    why: "點解要奧賽",
    path: "升學路",
    tutors: "導師",
    test: "測試",
    join: "報名",
    joinTest: "即刻報名",
    switchTo: "EN",
    switchToAria: "Switch to English",
  },
  hero: {
    chip: "香港",
    title: "奧林匹克競賽，係通往世界頂尖大學嘅路。",
    subtitle:
      "做一次診斷測試，我哋幫你揀啱科目，仲會負責晒所有準備。家長只係要行一步——幫小朋友報名參加奧林匹克思維測試。",
    limited: "7月18日嘅測試名額有限，要快。",
    cta: "即刻報名",
    cardLabel: "奧林匹克思維測試",
    cardDate: "7月18日",
    cardLocation: "香港",
    cardQuote: "「唔試過，永遠唔知自己有幾叻。」",
  },
  why: {
    chip: "點解要奧賽",
    quote:
      "「當我哋喺申請書上面見到奧林匹克獎牌，就知道呢個學生捱得到壓力，遇到難題都唔會輕易放棄，仲會死咬住唔放。呢種思維，正正係我哋想收嘅學生。」",
    attribution: "——全球十大頂尖大學招生主任",
  },
  subjects: {
    title: "六大科目，揾出你最強嗰個方向。",
    subtitle:
      "做完診斷測試之後，WestBridge 會揾出學生最有優勢嘅學科，然後負責晒之後每一步嘅準備。",
    items: [
      "數學",
      "物理",
      "化學",
      "生物",
      "資訊學 / 電腦科學",
      "地理",
    ],
  },
  path: {
    chip: "學生升學路",
    title: "由一個測試，去到準備好入大學嘅履歷",
    cta: "即刻霸定位 →",
    nodes: [
      { title: "思維測試", caption: "入場第一關" },
      {
        title: "揀啱學科",
        caption: "數學 · 物理 · 化學 · 生物 · 資訊學",
      },
      {
        title: "備戰準備",
        caption: "每週指導 · 練習題 · 模擬奧賽 · 導師輔導",
      },
      { title: "贏得奧賽", caption: "地區賽 → 全國賽 → 國際賽" },
      { title: "踏入未來", caption: "入讀頂尖大學" },
    ],
  },
  tutors: {
    chip: "導師",
    title: "由奧林匹克獎牌得主親自指導",
    list: [
      {
        role: "數學導師 · IMO 銀牌得主",
        bullets: [
          "IMO（國際數學奧林匹克）銀牌得主",
          "喺香港科技大學讀電腦科學",
          "教學生喺日常問題入面睇到背後嘅數學",
        ],
        quote:
          "就算讀完學士、碩士，奧賽經驗一樣係好大優勢。好多公司都搶住要識咁樣思考嘅人。",
      },
      {
        role: "物理導師 · 6 年教學經驗",
        bullets: [
          "IJSO 同巴爾幹物理奧賽獎牌得主",
          "國際 Tuymaada、Zhautykov 同哈薩克全國物理奧賽獎牌得主",
          "6 年教學經驗",
        ],
        quote:
          "物理係獎勵嗰啲就算用咗最直接嘅方法都唔得，但係仍然肯死磕落去嘅學生。",
      },
      {
        role: "資訊學導師 · IOI 銅牌得主",
        bullets: [
          "IOI（國際資訊學奧林匹克）銅牌得主",
          "香港大學全額獎學金 · ICPC 地區賽獎牌得主",
          "兩屆哈薩克全國奧賽金牌得主",
        ],
        quote:
          "電腦科學已經唔再係可有可無。早啲學識演算法嘅學生，會喺其他人追上嚟之前就睇通成個世界。",
      },
    ],
  },
  results: {
    chip: "成績",
    title: "用同一套方法贏返嚟嘅獎牌",
    subtitle:
      "呢啲係用同一套方法同課程模式訓練出嚟嘅學生，喺國際、全國同地區級奧賽攞到嘅成績。",
    gold: "金牌",
    silver: "銀牌",
    bronze: "銅牌",
    rows: [
      "國際賽（近兩年）",
      "全國賽 2026",
      "全國賽 2025",
    ],
  },
  stories: {
    chip: "成功故事",
    title: "嚟自用同一套方法訓練嘅學生",
    subtitle:
      "呢啲成績嚟自用同一套方法同課程模式訓練嘅學生，橫跨國際、全國同地區級奧賽。",
    list: [
      {
        content:
          "如果冇導師，我可能會喺啲錯嘅題目度卡足幾個月。有個行過呢條路嘅人話俾我知到底要改啲乜，真係改變晒一切。",
        author: "HKPhO 金牌 2026",
        role: "中二學生",
      },
      {
        content:
          "EuPhO 銀牌同 APhO 銅牌教曉我，進步從來都唔係靠奇蹟，而係一次又一次細心嘅修正。",
        author: "EuPhO 銀牌 · APhO 銅牌 2026",
        role: "中六應屆學生",
      },
      {
        content:
          "我從來冇諗過，就算讀完四年學士，公司都仲會主動揾奧賽得獎者。沿途練返嚟嘅能力，會跟你一世。",
        author: "IOI 銅牌得主",
        role: "香港大學畢業生 · 華為",
      },
    ],
  },
  newsletter: {
    chip: "報名測試",
    detailsTitle: "奧林匹克思維測試",
    detailsSubtitle: "一個測試，揾出你小朋友最有機會贏嘅地方。",
    details: [
      { label: "日期", value: "2026年7月18日" },
      { label: "地點", value: "香港" },
      { label: "費用", value: "港幣 $300" },
      {
        label: "測試啲乜",
        value: "思考方式、現時程度、科目偏好",
      },
      { label: "結果", value: "最啱你小朋友嘅奧賽方向" },
      {
        label: "下一步",
        value: "之後所有準備都交俾 WestBridge 搞掂",
      },
    ],
    countdownTitle: "測試倒數",
    days: "日",
    hours: "時",
    minutes: "分",
    seconds: "秒",
    formBadge: "報名測試",
    formTitle: "幫小朋友報名",
    parentName: "家長姓名",
    parentNamePlaceholder: "請輸入家長全名",
    email: "電郵",
    emailPlaceholder: "請輸入電郵地址",
    whatsapp: "WhatsApp / 電話",
    whatsappPlaceholder: "請輸入 WhatsApp 或電話號碼",
    studentName: "學生姓名",
    studentNamePlaceholder: "請輸入學生全名",
    studentGrade: "學生年級",
    studentGradePlaceholder: "例如：中三 / Year 10",
    subject: "有興趣嘅科目",
    subjectPlaceholder: "請揀一個科目",
    subjectOptions: [
      { value: "Math", label: "數學" },
      { value: "Physics", label: "物理" },
      { value: "Chemistry", label: "化學" },
      { value: "Biology", label: "生物" },
      { value: "Informatics", label: "資訊學" },
      { value: "Geography", label: "地理" },
      { value: "Not sure yet", label: "仲未決定" },
    ],
    background: "現時學校 / 背景",
    backgroundPlaceholder:
      "現時學校、年級、有冇奧賽經驗，同埋你希望達到啲乜",
    submit: "即刻報名",
    submitting: "提交緊...",
    errorRequired: "請填寫所有必填欄位",
    errorFailed: "提交失敗",
    success: "報名成功！我哋好快會喺 WhatsApp 同你聯絡。",
  },
  footer: {
    name: "WestBridge 奧林匹克學院",
    tagline: "為有志氣嘅香港學生提供奧林匹克備戰訓練。",
    privacy: "私隱政策",
    location: "香港",
  },
};

export const translations: Record<Language, Translation> = { zh, en };
