// v8 assessment layer.
//
// Every headline record carries `plain` (a sentence a policy generalist can follow) and, where a
// claim is made, `example` (one dated, sourced instance from the dataset). The precise wording is
// kept in `precise`. Judgments are templated on counts computed at build time: `{name}` tokens are
// filled from metadata by the interface, so a judgment can never drift from the data it rests on.

export type Basis = "counted" | "documented" | "inferred" | "assumed";
export type PremiseStatus = "held" | "contested" | "retired";

export type Judgment = {
  id: string;
  title: string;
  plain: string;
  precise: string;
  example: { text: string; url: string; officerId?: string; adverseId?: string; positionId?: string };
  basis: Basis;
  confidence: "High" | "Moderate" | "Low";
  premiseIds: string[];
  whatWouldChangeIt: string;
  requires?: string; // metadata path that must be truthy for the judgment to render (e.g. a tracker)
};

export const framework = {
  title: "How this site is built",
  plain: "We start from a fixed chart of the PLA's senior positions and ask, for each one, who holds it and how we know. Names enter the site only through a position. A seat we cannot fill is shown as empty, never hidden. Removed officers go to a separate ledger where we record when they were last seen with their title, the first public sign of trouble, and the formal action, and we measure the gaps. Everything else on the site is a narrow tracker that answers one question from a bounded set of official sources.",
  steps: [
    { step: "Fix the chart first", plain: "A working chart of the PLA's senior positions across nine tiers: the Central Military Commission, its organs, the five theaters, the four services, the Rocket Force bases, the four arms, the armed police and key districts, the thirteen group armies, and the central academies. It is a model, not an official table, and it is revised when a source shows a position we missed." },
    { step: "Fill each seat only from a dated source", plain: "A name goes into a seat only when a source names that person with the exact Chinese title on a date. The role-state label says how good that source is, from a formal appointment down to a legacy record that has not been refreshed." },
    { step: "Record handlers separately from holders", plain: "An officer who is seen doing a job without ever being given the title in public is a handler, not a holder. Chairing a meeting or standing in a protocol position is not authority." },
    { step: "Show every empty seat", plain: "A seat with no public record is displayed as 'no record'. A seat emptied by a removal says who was removed and when. The count of empty seats is a result, not an embarrassment." },
    { step: "Clock the removals", plain: "For every officer in the adverse ledger we look for three dates: the last public appearance with a title, the first concrete public sign of trouble, and the formal action. The day counts between them are computed, never typed, and a missing date stays missing." },
    { step: "Measure narrow things from bounded sources", plain: "Each tracker answers one question from a source set you could re-read yourself: every NPC credentials report, every promotion ceremony, one Central Committee list, five recurring events, every seat that turned over." },
    { step: "Say what each judgment rests on", plain: "Every judgment on the Overview is computed from counts in the position board or the ledger, and lists the premises it depends on. Premises can be contested or retired, and the review log records who said what and what changed." },
  ],
} as const;

export const judgments: Judgment[] = [
  {
    id: "J1",
    title: "Most senior seats have no formally documented holder.",
    plain: "Of the {principalSeats} senior positions we track, only {formalOrDated} have a holder with a formal appointment or a dated official title. {vacantOrHandled} are empty after a removal or are being run by someone who has never been given the title in public, and {noRecord} have no public record at all.",
    precise: "Principal-seat coverage at the cutoff: formal_current + dated_official = {formalOrDated}; adverse_vacancy + held_in_adverse_watch + handled_without_title = {vacantOrHandled}; no_record = {noRecord}; acting_or_inferred = {acting}; stale = {stale}; conflicting = {conflicting}.",
    example: { text: "The Rocket Force commander's seat: three successive commanders (Li Yuchao, Zhou Yaning, Wang Houbin) have been removed since 2023, and Lei Kai, the deputy commander and chief of staff, appears to handle the work without any published appointment.", url: "https://www.news.cn/20251017/eb11aa8c9e0044f3980bda5cd19037a2/c.html", positionId: "POS-SVC-RF-CDR" },
    basis: "counted",
    confidence: "High",
    premiseIds: ["P-ARCHETYPE", "P-SILENCE", "P-TITLE"],
    whatWouldChangeIt: "A wave of formal appointment notices, or evidence that the archetype lists positions that no longer exist.",
  },
  {
    id: "J2",
    title: "Removals have run far ahead of replacements.",
    plain: "{adverseCount} officers are in the adverse ledger. {adverseVacancy} senior seats are empty because their holder was removed. {turnoverSentence}",
    precise: "adverse ledger n = {adverseCount} (confirmed exits {confirmedExits}, unresolved watches {unresolvedWatches}); principal seats in state adverse_vacancy = {adverseVacancy}; {turnoverSentence}",
    example: { text: "Eastern Theater commander: Lin Xiangyang's expulsion was announced on 17 October 2025 and Yang Zhibin was formalized on 22 December 2025, 66 days later. That is the fastest documented refill; most vacated seats have no successor at all.", url: "https://www.news.cn/politics/leaders/20251222/fb1b217000ac46f8812eeaeb3fd5c261/c.html", positionId: "POS-TC-E-CDR" },
    basis: "documented",
    confidence: "High",
    premiseIds: ["P-ARCHETYPE", "P-CLOCKS"],
    whatWouldChangeIt: "Appointment notices that fill the vacated seats, or evidence that seats were filled without any public notice.",
  },
  {
    id: "J3",
    title: "Running a seat without the title is now the normal arrangement.",
    plain: "{handled} senior seats are run by an officer who is seen doing the job but has never been given the title in public, and {acting} more rest on acting or inferred titles. The site records these people as handlers or acting holders, never as principals.",
    precise: "handled_without_title = {handled}; acting_or_inferred = {acting}; handler relationships recorded = {handlerLinks}. An acting label requires literal acting language (代, 代理, 主持工作, 主持日常工作, 履行职责).",
    example: { text: "Zhu Chuansheng, a deputy chief of the Joint Staff, has appeared as the presiding officer of the department since January 2026 after Liu Zhenli's investigation, with no appointment act published.", url: "https://www.news.cn/20260124/d0526e74a7004ca6b29f7431c3b7c623/c.html", officerId: "PLA-1493DE64544D", positionId: "POS-ORG-JSD-DIR" },
    basis: "documented",
    confidence: "Moderate",
    premiseIds: ["P-TITLE", "P-AUDITION"],
    whatWouldChangeIt: "Formalization of the current handlers in place (which would also support the audition premise) or their displacement by newly named principals.",
  },
  {
    id: "J4",
    title: "Trouble is visible in public before it is announced, by a measurable margin.",
    plain: "For the {clockN} removed officers where all three dates are collected, the median gap from the last titled public appearance to the first public sign of trouble is {medianSilence} days, and from the first sign to the formal action {medianProcess} days.",
    precise: "Ledger clock, complete records n = {clockN}: median silenceDays = {medianSilence} (range {minSilence}–{maxSilence}); median processDays = {medianProcess}. Records with any last-appearance date: {withLastAppearance} of {adverseCount}.",
    example: { text: "Miao Hua: suspended for investigation on 28 November 2024, removed from the state CMC on 27 June 2025 (211 days), expelled on 17 October 2025 (323 days after suspension).", url: "https://www.news.cn/20251017/eb11aa8c9e0044f3980bda5cd19037a2/c.html", adverseId: "PLA-E1856D0FF790" },
    basis: "counted",
    confidence: "Moderate",
    premiseIds: ["P-CLOCKS", "P-ABSENCE"],
    whatWouldChangeIt: "More complete records; the medians are reported with their n and will move as the ledger clock fills in.",
    requires: "ledgerClock.complete",
  },
  {
    id: "J5",
    title: "The public record is thin below the top, and thinnest where it matters for a war.",
    plain: "{mapped} of the {officers} officers in the dataset map to a position, but {noClaims} have no claim-scoped source at all, and {staleHolders} mapped holders were last seen with their title before 2025. The group armies, the Rocket Force bases and the theater staff posts are the largest holes.",
    precise: "archetype-mapped officers = {mapped}/{officers}; officers with zero mapped claims = {noClaims}; mapped holders with title freshness pre_2025 = {staleHolders}; no_record principal seats by tier: {noRecordByTier}.",
    example: { text: "All eighteen Rocket Force base commander and political-commissar seats are 'no record' except Base 64, whose commander Yang Guang lost his NPC seat in February 2026.", url: "https://www.news.cn/politics/20260226/d679a70cddd945f1908e371b94c93c48/c.html", positionId: "POS-RFB-64-CDR" },
    basis: "counted",
    confidence: "High",
    premiseIds: ["P-ARCHETYPE", "P-SILENCE"],
    whatWouldChangeIt: "A systematic sweep of provincial and municipal civil-military coverage, which is the search lane for these seats.",
  },
];

export type Premise = {
  id: string;
  premise: string;
  plain: string;
  basis: Basis;
  status: PremiseStatus;
  contestedBy?: string;
  whereUsed: string[];
  discriminatingTest: string;
  ifWrong: string;
};

export const premises: Premise[] = [
  { id: "P-ARCHETYPE", premise: "The 179-slot archetype is the right list of senior positions.", plain: "We assume the chart of positions we drew is the set of jobs that matter. It follows the post-2016 structure and the 2024 reorganization of the arms, but it is our model.", basis: "assumed", status: "held", whereUsed: ["J1", "J2", "J5", "Positions board"], discriminatingTest: "An official source names a leader-grade position that is not in the chart, or shows one in the chart no longer exists.", ifWrong: "Coverage counts would mislabel importance: a missing position would be invisible and an abolished one would count as a false gap." },
  { id: "P-SILENCE", premise: "No public record of a holder does not mean the seat is empty.", plain: "Chinese official reporting is selective. When we show 'no record' we mean we could not find a dated source, not that nobody holds the job.", basis: "documented", status: "held", whereUsed: ["J1", "J5", "Positions board"], discriminatingTest: "A later source that fills a 'no record' seat with a holder who had been in place all along confirms the premise; a confirmed long vacancy in a 'no record' seat would weaken it.", ifWrong: "The 'no record' count would understate real vacancies, and the disorder in the system would be worse than the board shows." },
  { id: "P-TITLE", premise: "Only literal acting language supports an acting label; chairing an event is not authority.", plain: "We label someone acting only when the source uses words like 代, 代理, 主持工作, 主持日常工作 or 履行职责. Presiding over a meeting or standing in a protocol slot tells us they were there, not that they hold the job.", basis: "documented", status: "held", whereUsed: ["J1", "J3", "Role states"], discriminatingTest: "An officer we recorded as a handler is later shown by an appointment notice to have held the formal title all along.", ifWrong: "Handlers would be undercounted as principals, and the board would overstate how many seats are unfilled." },
  { id: "P-ABSENCE", premise: "An absence is informative only when the event is high-expectancy, the roster is complete, and peers are present.", plain: "Missing one event proves nothing. Missing an event you always attend, when the report lists everyone who came and your peers are all there, is a signal. That is the rule used to score absences.", basis: "documented", status: "held", whereUsed: ["J4", "Event attendance tracker", "Ledger clock first-signal kind absence_noted"], discriminatingTest: "The true-positive case (He Weidong, April 2025 tree-planting) and the false-positive case (Zhao Leji, March 2025 NPC illness) are the calibration pair; further scored misses either confirm or erode the rule.", ifWrong: "Absence-based first signals would be noise, and the silence-days measure would be biased short." },
  { id: "P-CLOCKS", premise: "Investigation, suspension, state removal, Party expulsion and NPC termination are separate clocks; one date never stands for another.", plain: "A removed officer passes through several separate formal steps on different dates. We record each and never let one substitute for another.", basis: "documented", status: "held", whereUsed: ["J2", "J4", "Ledger clock"], discriminatingTest: "None needed: it is a recording rule, tested by the ledger-clock validity checks.", ifWrong: "Day counts would be incomparable across cases." },
  { id: "P-DENOMINATOR", premise: "Winner biographies give the share of winners who used a route, not the odds that a route wins; without the eligible pool no route can be turned into a probability.", plain: "Knowing that most past CMC members had commanded a theater does not tell you how likely a theater commander is to reach the CMC, because we do not know how many theater commanders were eligible and did not. That is why this site publishes no promotion probabilities.", basis: "documented", status: "held", whereUsed: ["Route evidence", "RQ-1"], discriminatingTest: "A frozen eligible pool for a past cycle would let route lift be estimated; that is research question RQ-1.", ifWrong: "Route prevalence could be read as odds; we do not think it can." },
  { id: "P-SYNC", premise: "Since December 2019, promotion to full general and a theater-leader-grade billet normally coincide.", plain: "In the recent pattern, an officer becomes a full general on the day they get a top job, not years before. So a promotion ceremony usually also tells you about an appointment.", basis: "documented", status: "held", whereUsed: ["Promotion ceremonies tracker"], discriminatingTest: "Two future full-general promotions without a same-day or near-same-day billet change.", ifWrong: "Promotion ceremonies would stop being a proxy for appointment dates." },
  { id: "P-AUDITION", premise: "An acting or handling arrangement is an audition for the seat.", plain: "It is tempting to read a handler as the successor-in-waiting. The evidence so far cuts both ways, so we treat this as contested and measure it rather than assume it.", basis: "assumed", status: "contested", contestedBy: "Internal review of the seat-turnover record: the PAP sequence (Wang Chunning removed; Peng Jingtang handles; Peng transfers; Zhao Dongfang handles) shows rotating bridges, and Zhang Shuguang was promoted upward without converting the Army political-commissar vacancy he had covered.", whereUsed: ["J3 (as a caveat only)"], discriminatingTest: "The seat-turnover tracker's share of handlers formalized in place versus displaced or rotated.", ifWrong: "Handlers would be no guide to succession, and any ranking built on them would be wrong; v8 builds no such ranking." },
  { id: "P-RECERT", premise: "The 2026 all-military senior-cadre course and the 26 supervision measures form a hidden political re-certification gate that sits before ordinary promotion.", plain: "The previous version of this site led with the idea that a 2026 training course for senior cadres was a secret loyalty test deciding who gets promoted. An external expert judged the course probably irrelevant, and nothing in the public record ties any appointment or removal to it. The idea is retired.", basis: "assumed", status: "retired", contestedBy: "External subject-matter review, September 2026: the course is probably irrelevant to selection.", whereUsed: ["Formerly the v7 headline judgment, research frontier RF-01, gap G13 and a P0 collection item; used nowhere in v8"], discriminatingTest: "An appointment or removal that an official source links to course evaluation or to the supervision measures.", ifWrong: "If the premise were in fact right, the site would be missing a selection stage; the course and measure sources remain in the system-source list so the question can be reopened." },
  { id: "P-SPI", premise: "A six-component structural index can order candidates' routes to a seat.", plain: "The previous version scored named officers on a 0–100 index built from analyst-assigned ranges. There was no way to calibrate it, and it invited readers to see probabilities where there were none. It is dropped; the empirical route facts it drew on are kept without scores.", basis: "assumed", status: "retired", contestedBy: "v8 rebuild after the September 2026 review: uncalibrated, and the eligible-pool problem (P-DENOMINATOR) makes any such index unverifiable.", whereUsed: ["Formerly the succession boards; used nowhere in v8"], discriminatingTest: "A calibrated backtest against a frozen eligible pool would justify reintroducing a scored board.", ifWrong: "Nothing on the site depends on it." },
];

export type ResearchQuestion = {
  id: string;
  question: string;
  plain: string;
  artifact: string;
  status: "open" | "in_progress" | "answered";
  progress?: string; // metadata path or free text filled by the interface
  reviewStatus: string;
  searchLane: string;
  gapIds: string[];
  url?: string;
};

export const researchQuestions: ResearchQuestion[] = [
  { id: "RQ-1", question: "Which routes beat the eligible losers, not merely which routes past winners used?", plain: "We know what past CMC members looked like. We do not know who else was eligible and lost. Without that list, no career route can be turned into odds.", artifact: "A frozen list of every full general, service and theater principal, and military Central Committee member at each of the 2012, 2017, 2022 and 2027 selection points, each marked selected or not selected.", status: "in_progress", progress: "cc20", reviewStatus: "Endorsed by the September 2026 external review as the right kind of question.", searchLane: "Xinhua Central Committee lists; promotion ceremonies; official rosters; the Jost and NDU datasets for earlier cycles.", gapIds: ["G14"], url: "https://www.tylerjost.com/data.html" },
  { id: "RQ-2", question: "How long are senior officers publicly visible after trouble starts, and what is the first visible sign?", plain: "For each removed officer: when were they last seen with their title, what was the first public sign something was wrong, and when did the formal action come?", artifact: "The ledger clock: all three dates for every confirmed exit, with a verified source for each.", status: "in_progress", progress: "ledgerClock", reviewStatus: "Proposed by the September 2026 external review.", searchLane: "Xinhua, 81.cn and CCTV event reports naming the officer with an exact title; NPC credential reports; discipline announcements.", gapIds: ["G17"] },
  { id: "RQ-3", question: "How long do vacated seats stay open, and are the officers who cover them formalized or displaced?", plain: "When a senior officer is removed, how many days pass before a successor is formally named, and does the person who covered the job get it?", artifact: "The seat-turnover table: predecessor exit date, successor appointment date, days open, and the handler's outcome, for every principal seat that turned over since 2023.", status: "in_progress", progress: "seatTurnovers", reviewStatus: "Added in v8; tests the audition premise (P-AUDITION).", searchLane: "Promotion ceremonies, appointment notices, first exact-title appearances.", gapIds: ["G02", "G03"] },
  { id: "RQ-4", question: "Which absences are informative?", plain: "Officers miss events all the time. We want to know which recurring events are so regularly attended, and so completely reported, that a miss is worth recording.", artifact: "An attendance matrix for five recurring event families 2023–2026 with complete-roster flags, and every miss scored against what happened to the officer afterwards.", status: "in_progress", progress: "eventAttendance", reviewStatus: "Added in v8; operationalizes the absence rule (P-ABSENCE).", searchLane: "CMC tree-planting, 1 August reception, NPC military delegation, plenum and promotion-ceremony reports.", gapIds: ["G17"] },
  { id: "RQ-5", question: "Who holds the senior seats that have no public record?", plain: "Fifty-odd seats on the board are blank. Each one needs a single dated official source naming the holder, or a note that a sweep was done and found nothing.", artifact: "For every 'no record' seat, one dated source or a dated 'searched, not found' note, starting with the Rocket Force bases, the group armies and the theater chiefs of staff.", status: "open", progress: "noRecord", reviewStatus: "Added in v8; follows directly from the position framework.", searchLane: "Provincial and municipal civil-military coverage (双拥, 军地座谈), unit channels, 81.cn local editions.", gapIds: ["G07", "G12", "G18"] },
  { id: "RQ-6", question: "What share of officers promoted to full general since 2019 have since been removed, and after how long?", plain: "The promotion ceremony is the clearest public signal of trust. How often has that trust been withdrawn, and how quickly?", artifact: "The promotion ledger (every ceremony since December 2019) joined to the adverse ledger, with days from promotion to first signal and to formal action.", status: "in_progress", progress: "promotionCeremonies", reviewStatus: "Added in v8.", searchLane: "Xinhua reports of 中央军委晋升上将军衔仪式.", gapIds: ["G14"] },
];

export type GlossaryEntry = { term: string; zh?: string; plain: string; example?: string };

export const glossary: GlossaryEntry[] = [
  { term: "position", zh: "职位", plain: "A job on the chart, such as 'Eastern Theater commander'. The site's unit of collection." },
  { term: "principal seat", plain: "A position with one occupant that heads an organization or is a fixed seat on a commission: commander, political commissar, chief of staff, department director, CMC member. Bench slots, by contrast, hold several deputies." },
  { term: "archetype", plain: "Our stylized chart of the PLA's senior positions. A model of the structure, revised when sources show a position we missed." },
  { term: "holder", plain: "An officer whom a dated source names with the exact title of a position." },
  { term: "handler", plain: "An officer seen doing a position's work, such as presiding over its meetings, without ever being named with the title. Recorded separately from holders." },
  { term: "coverage state", plain: "What the public record supports for a seat: formal current, dated official, acting or inferred, stale, conflicting, handled without title, vacant after removal, held in adverse watch, or no record." },
  { term: "role state", plain: "How good the source for an officer's displayed title is: formally documented; official title with limited scope; unresolved acting mixture; reported or observed; conflicting reports; legacy record; stale or unknown." },
  { term: "formal current", plain: "A formal appointment or promotion decision, or repeated official naming with a matching rank, supports the title now." },
  { term: "dated official", plain: "An official source gave the title on a date, but continuity or exact authority after that date is not established." },
  { term: "stale", plain: "The last source giving the title is old enough that we do not treat the officer as current." },
  { term: "no record", plain: "We could not find a dated source naming anyone in the seat. It does not mean the seat is empty." },
  { term: "adverse vacancy", plain: "The last known holder of the seat was removed, and no successor has been publicly named." },
  { term: "adverse ledger", zh: "负面台账", plain: "The separate list of officers who were removed, investigated, reported missing, or passed over. Nobody on it can appear as a holder." },
  { term: "unresolved adverse watch", plain: "A ledger entry where trouble is reported but no official action is published: missing from view, or passed over in a Party vote." },
  { term: "last public appearance", plain: "The last dated report naming the officer with their exact title before the first sign of trouble." },
  { term: "first concrete signal", plain: "The earliest dated public sign that something was wrong: a suspension notice, a press report, a replacement named without explanation, or a scored absence." },
  { term: "formal action", plain: "The formal disposition: NPC deputy status terminated, removed from a state office, expelled from the Party and the military." },
  { term: "silence days", plain: "Days from the last public appearance to the first concrete signal." },
  { term: "process days", plain: "Days from the first concrete signal to the formal action." },
  { term: "collection state", plain: "For a ledger record: complete (all three dates verified), partial, or not yet collected." },
  { term: "political commissar", zh: "政治委员", plain: "The Party-political co-leader of a unit, coequal with the commander. Most organizations have both, and the site tracks both seats." },
  { term: "Central Military Commission", zh: "中央军委", plain: "The Party body that commands the armed forces: a chairman (Xi Jinping), vice chairmen and members. A parallel state commission with the same people exists on paper; removals from the two are separate acts." },
  { term: "CMC organ", zh: "军委机关部门", plain: "One of the fifteen departments, commissions and offices that work directly for the commission, such as the Joint Staff Department or the Discipline Inspection Commission." },
  { term: "theater command", zh: "战区", plain: "One of five joint regional commands (Eastern, Southern, Western, Northern, Central). Each has Army, Navy and Air Force components." },
  { term: "arm", zh: "兵种", plain: "The Aerospace Force, Cyberspace Force, Information Support Force and Joint Logistic Support Force, created or reorganized in April 2024 alongside the four services." },
  { term: "grade", zh: "职务等级", plain: "The rank of a job rather than of a person. Theater-leader grade is the top tier below the commission; theater-deputy and corps-leader grades sit below it." },
  { term: "full general", zh: "上将", plain: "The highest active rank. Since 2019 it has usually been conferred on the day an officer takes a theater-leader-grade job." },
  { term: "NPC deputy termination", zh: "罢免全国人大代表职务", plain: "Senior officers sit in the National People's Congress; when their unit's military congress strips that seat, the NPC Standing Committee records it. It is often the first formal, dated sign of a removal." },
  { term: "Central Committee", zh: "中央委员会", plain: "The Party's roughly 370-person governing body, with full members and vote-ordered alternates. Its military members are the pool from which CMC members are drawn." },
  { term: "plenum", zh: "全会", plain: "A full meeting of the Central Committee. Plenums expel members and promote alternates into vacancies, in vote order, which is why being passed over is a signal." },
  { term: "eligible losers", plain: "The officers who were eligible for a seat at a selection point and were not chosen. Without this list, the share of winners who used a route cannot be turned into odds." },
  { term: "route", plain: "A career path to a target seat, such as theater deputy → theater commander → CMC member. The site reports how common a route was among past winners, never how likely it is to win." },
  { term: "claim-scoped source", plain: "A source linked to a specific field and date, with a note on what it does not establish. A URL attached to a dossier is not evidence for every field in it." },
  { term: "source class", plain: "A1 formal Party or state decision; A2 central official or PLA source; A3 other official institutional source; B1 high-quality specialist analysis; B2 credible secondary reconstruction; C or D discovery lead." },
  { term: "acting language", zh: "代 / 代理 / 主持工作", plain: "The words that allow an acting label. Without them, an officer seen running things is a handler." },
  { term: "high-expectancy event", plain: "A recurring event that the officer's peers reliably attend and that is reported with a complete named roster, so a miss can be scored." },
  { term: "identity hold", plain: "A record kept out of the active directory because the person cannot be securely identified, or because two records turned out to be one person." },
  { term: "title freshness", plain: "Days since the last source naming the officer with their title. A re-verification queue is ordered by it." },
];

export const observationClocks = [
  { clock: "Formal appointment", plain: "An appointment or promotion decision proves the person held the office on that date.", proves: "A de jure act for the named office at the act date", doesNot: "Current functional control, Party status, or freedom from inquiry" },
  { clock: "Title-bearing performance", plain: "A report of the officer doing a duty under the exact printed title proves the title on that date.", proves: "The officer performed a dated duty under the exact printed title", doesNot: "The original appointment date or durable authority beyond the observation" },
  { clock: "Named appearance", plain: "Being named at an event proves presence if the identity is secure, and nothing more.", proves: "Presence at a dated event if identity is secure", doesNot: "Current billet, trust, exoneration, or promotion" },
  { clock: "High-expectancy miss", plain: "Missing an event you always attend, when the roster is complete and peers are present, shifts the odds; it does not prove removal.", proves: "A likelihood shift only when attendance was customary, coverage complete, peers present, and no explanation known", doesNot: "Removal, detention, or guilt from one omission" },
] as const;

export const titleParsingRules = [
  { words: "任命 / 决定任命 / 免去 / 授予 / 晋升", cls: "Formal act", plain: "Appointed, removed, conferred, promoted: a formal status change for the exact office or rank." },
  { words: "主持工作 / 主持日常工作 / 代 / 代理 / 履行职责", cls: "Acting authority", plain: "Running the work, acting, performing the duties: functional authority without the principal title. Never upgraded to the title." },
  { words: "主持会议 / 主持仪式", cls: "Event role only", plain: "Chaired that meeting or ceremony. Says nothing about running the organization." },
  { words: "出席并讲话 / 参加", cls: "Attendance", plain: "Attended, or attended and spoke: a dated appearance, not an appointment." },
  { words: "受习主席委托 / 代表习主席和中央军委", cls: "Delegated mission", plain: "Sent on the chairman's behalf for that mission. Not a general promotion signal." },
  { words: "原 / 曾任 / 时任 / 负责人 / 有关领导", cls: "Historical or anonymous", plain: "Former, once held, then serving, 'the responsible official', 'relevant leaders': never creates a current named record." },
] as const;

export const calibrationCases = [
  { case: "He Weidong · an absence that was informative", first: "Named at the 2024 CMC tree-planting; omitted from the complete peer enumeration at the same event on 2 April 2025", later: "Formally expelled among nine officers on 17 October 2025", plain: "The miss counted because the event template was identical year to year, the report listed everyone who came, and his peers were all there. Even so, it was a signal, not proof.", url: "https://www.news.cn/20250402/28b125b861c74d2b8b20aff50813f962/c.html" },
  { case: "Zhao Leji · an absence that was not", first: "Missed a high-expectancy NPC session on 11 March 2025", later: "An official illness explanation was given and he reappeared in a titled activity the next day", plain: "An explanation plus a quick titled reappearance zeroes out an absence.", url: "https://www.news.cn/politics/2025lh/zb/qh2279/wzsl.html" },
  { case: "Dong Jun · press report, then reappearance", first: "Press report of investigation in November 2024", later: "Official defense-minister duties on 5 and 19 December 2024", plain: "Reappearing in an official role weakens detention or removal hypotheses. It does not prove there was never an inquiry.", url: "https://www.mod.gov.cn/gfbw/jswj/16356223.html" },
  { case: "Miao Hua · four separate clocks", first: "Suspended for investigation on 28 November 2024", later: "Removed from the state CMC on 27 June 2025, 211 days later; expelled 17 October 2025", plain: "Investigation, billet, Party, state office and NPC status each move on their own date. The ledger records all of them.", url: "https://www.mod.gov.cn/gfbw/qwfb/16354907.html" },
  { case: "Zhang Youxia and Liu Zhenli · the state clock lags", first: "Investigations announced 24 January 2026", later: "State-CMC removal on 28 August 2026, 216 days later", plain: "The formal state act can trail the effective loss of command by months, and it says nothing automatic about the Party-office date.", url: "https://www.news.cn/politics/20260828/9f7a67c5059e4e7b8a45a8353c5688c8/c.html" },
  { case: "A mutable leadership page", first: "The same Xinhua leadership page persisted in cached and live states", later: "Current and cached variants showed different military rosters", plain: "A page that changes is one changing source, not two independent ones. Keep the retrieval time and a snapshot.", url: "https://www.news.cn/politics/leaders/" },
] as const;

export const releaseRules = [
  { id: "R-01", title: "Ledger separation", plain: "No stable ID may appear in both the active directory and the adverse ledger." },
  { id: "R-02", title: "Position mapping", plain: "Every active officer is either mapped to a position or listed as outside the archetype with a reason." },
  { id: "R-03", title: "Acting-language firewall", plain: "An acting label requires literal acting language in the source." },
  { id: "R-04", title: "Clock validity", plain: "For every ledger record, last appearance ≤ first signal ≤ formal action, and day counts equal the date differences." },
  { id: "R-05", title: "No typed numbers", plain: "Every count and day figure on the site is computed at build from the data; none is typed into prose." },
  { id: "R-06", title: "Absence admissibility", plain: "An absence becomes a first signal only with a complete roster, a high-expectancy event and peers present." },
  { id: "R-07", title: "Mutable-source discipline", plain: "A live roster page is dated, not cited as timeless." },
  { id: "R-08", title: "Plain language", plain: "Every judgment, question and rule carries a plain statement; headlines contain no probability notation, no not-equal sign, and no undefined term of art." },
  { id: "R-09", title: "Premise accounting", plain: "Every judgment lists premises that exist in the register, and no held judgment depends on a retired premise." },
  { id: "R-10", title: "One canonical build", plain: "The interface data, the public JSON and the CSV come from one build with one ID." },
] as const;

export const routeEvidence = {
  title: "What past winners looked like",
  plain: "These are facts about officers who did reach top seats. They tell you which routes were common among winners. They cannot tell you how likely a route is to win, because we do not know how many eligible officers took the same route and lost.",
  caveat: "These frequencies are the share of past winners who used a route. They are not selection odds and cannot be read as any individual's promotion probability. The current purge cycle may also be a break in the pattern, so pre-purge figures are shown for discipline, not prediction.",
  cohorts: [
    { year: "2015", seniorOfficers: 182, measure: "Theater-command deputy-leader grade and above", plain: "Size of the observed senior cohort before the current command structure fully settled." },
    { year: "2021", seniorOfficers: 155, measure: "Theater-command deputy-leader grade and above", plain: "Fifteen per cent smaller after the reforms; the pool below this level is still not public." },
  ],
  cmcTurnover: [
    { cycle: "2012 / 18th", uniformedSeats: 10, retained: 3, entrants: 7, share: "70%" },
    { cycle: "2017 / 19th", uniformedSeats: 6, retained: 3, entrants: 3, share: "50%" },
    { cycle: "2022 / 20th", uniformedSeats: 6, retained: 3, entrants: 3, share: "50%" },
  ],
  entrantRoutes: [
    { route: "Operational principal", count: 9, denominator: 13, share: "69%", plain: "Nine of the thirteen new CMC entrants across three congresses had commanded, or been political commissar of, a theater, region, service or force." },
    { route: "Central functional / control", count: 2, denominator: 13, share: "15%", plain: "Two came from a CMC department, discipline or supervision principal job." },
    { route: "Joint-deputy bridge", count: 2, denominator: 13, share: "15%", plain: "Two were General Staff or Joint Staff deputies who converted to service command almost at the same time." },
  ],
  conversionMatrix: [
    { metric: "31 / 31", label: "one or two prior theater-deputy-grade billets", plain: "Every one of 31 post-2019 three-star promotions had already served at theater-deputy grade. It is the strongest common gate we can see." },
    { metric: "26 / 31", label: "promoted into theater, service, force or PAP principal billets", plain: "The usual destination was a command or political principal job, not a rank on its own." },
    { metric: "14 / 31", label: "political officers", plain: "Nearly half were political commissars. The political route is a full route, not a side door." },
    { metric: "4 years", label: "median first-deputy-to-three-star interval", plain: "Typically about four years at deputy grade before the third star, though public dates are imprecise." },
    { metric: "11 / 13", label: "CMC entrants already full general or admiral", plain: "The other two got the rank within eight days. Rank comes with, or just after, the seat." },
    { metric: "9 / 13", label: "prior full or alternate Central Committee status", plain: "But it varies wildly by cycle: 7 of 7 in 2012, 0 of 3 in 2017, 2 of 3 in 2022." },
  ],
  routes: [
    { target: "Theater commander", numerator: 14, denominator: 14, route: "Prior theater assignments at both corps-leader and theater-deputy grades", plain: "All fourteen theater commanders had done both. Treat it as a gate, not a predictor." },
    { target: "Theater commander", numerator: 10, denominator: 14, route: "Prior theater service-component command", plain: "Ten of fourteen had commanded a theater's Army, Navy or Air Force component first." },
    { target: "Service commander", numerator: 9, denominator: 11, route: "Prior service deputy or theater service-component command", plain: "Nine of eleven service commanders came through one of those two jobs." },
    { target: "2017 uniformed CMC roster", numerator: 5, denominator: 6, route: "Prior theater or service commander or political commissar", plain: "Five of six, but that includes retained members and the sample is tiny." },
  ],
  partySynchronization: [
    { group: "Theater-command leaders", value: "20 / 25", share: "80%", plain: "Most theater-level leaders were full Central Committee members by the time they held the job." },
    { group: "Theater-command deputy leaders", value: "8 / 124", share: "6%", plain: "One echelon down, full membership was rare." },
    { group: "Theater-command deputy leaders", value: "12 / 124", share: "10%", plain: "Alternate membership was also a minority signal at deputy grade." },
    { group: "Leaders carried over from prior CC", value: "3 / 25", share: "12%", plain: "Party status usually arrived with the job, not years before it." },
  ],
  verdicts: [
    { factor: "Formal principal conversion", verdict: "Survives", plain: "Getting the top job and the third star go together; the job is the gate." },
    { factor: "Service-deputy or component route", verdict: "Survives", plain: "Nine of eleven service commanders came through it." },
    { factor: "Prior Central Committee status", verdict: "Narrowed", plain: "Matters near the selecting congress, not as a lifetime credential." },
    { factor: "Generic jointness premium", verdict: "Downgraded", plain: "Joint assignments fell from 61% of the 2015 cohort to 56% in 2021; cross-service tours were 14 of 155. Policy praises jointness; selection does not visibly reward it." },
    { factor: "Technical or platform prominence", verdict: "Rejected alone", plain: "No public case shows a famous pilot, captain or scientist reaching a top seat without first commanding an organization." },
  ],
  sources: [
    { title: "Gray Dragons: Assessing China's Senior Military Leadership", publisher: "NDU Press", url: "https://ndupress.ndu.edu/Portals/68/Documents/stratperspective/china/china-perspectives-16.pdf" },
    { title: "Simultaneous three-star and theater-command leader-grade promotions", publisher: "China Aerospace Studies Institute", url: "https://www.airuniversity.af.edu/CASI/Display/Article/3826912/assessment-of-simultaneous-pla-3-star-and-theater-command-leader-grade-promotio/" },
    { title: "19th Central Committee First Plenum communiqué", publisher: "Xinhua", url: "https://www.news.cn/politics/19cpcnc/2017-10/25/c_1121853954.htm" },
    { title: "20th Central Committee First Plenum communiqué", publisher: "Xinhua", url: "https://www.news.cn/politics/2022-10/23/c_1129075992.htm" },
  ],
} as const;

export const forecastLedger = [
  { id: "F-2027-01", window: "2027 Party Congress", plain: "The 2027 Central Military Commission will either restore a balanced body with service and theater commanders, or stay small and weighted to political-control officers. We will be able to tell which from the First Plenum roster.", forecast: "The rebuilt Party CMC will reveal a clear selection regime: balanced institutional representation or a smaller control-heavy body.", confirms: "A formally announced slate with durable military seats and discernible seat purposes.", disconfirms: "Prolonged vacancy management without a coherent institutional pattern.", status: "Open", confidence: "Moderate" },
  { id: "F-2027-02", window: "By end-2027", plain: "Wei Wenhui, a Southern Theater deputy commander who is also a Central Committee alternate, either gets a principal command and full general's rank by the end of 2027 or loses the advantage that combination gives him.", forecast: "Wei Wenhui either clears a principal-command/full-general conversion or loses his strongest route advantage.", confirms: "Official principal appointment paired with rank regularization.", disconfirms: "Continued deputy status after the Party-congress cycle or a named replacement above him.", status: "Open", confidence: "Moderate", officerId: "PLA-E3B1477CCE9D" },
  { id: "F-2027-03", window: "Next Navy appointment cycle", plain: "Zhang Zheng, the Navy chief of staff who appears to run the service's military work, is either formally made commander or stays a staff officer.", forecast: "Zhang Zheng's apparent Navy-headquarters authority converts into a formal service-principal role or does not.", confirms: "Appointment text or repeated official principal naming with a matching rank.", disconfirms: "Another Navy commander appears or Zhang remains staff-limited.", status: "Open", confidence: "Low", officerId: "PLA-0CE77875A7F3" },
  { id: "F-2027-04", window: "Next Joint Staff appointment cycle", plain: "Zhu Chuansheng, the deputy who presides over the Joint Staff, is either formally made chief or reverts to being a bridge.", forecast: "Zhu Chuansheng's handling arrangement formalizes as Joint Staff principal authority or reverts to bridge-incumbent status.", confirms: "Formal chief appointment and rank regularization.", disconfirms: "A different formal chief appears.", status: "Open", confidence: "Low", officerId: "PLA-1493DE64544D" },
  { id: "F-2027-05", window: "Next Rocket Force appointment cycle", plain: "Lei Kai, who appears to handle the Rocket Force's military work, is either formally made commander or someone else is.", forecast: "Lei Kai remains conditional until a formal service-command decision resolves the current chain.", confirms: "Official commander appointment plus durable reappearance in the command chain.", disconfirms: "A different commander is installed or the role signal disappears.", status: "Open", confidence: "Low", officerId: "PLA-B526BB58D0B3" },
  { id: "F-2027-06", window: "By end-2027", plain: "At least one of the officers currently running a service or CMC department without the title will be replaced by someone else rather than confirmed.", forecast: "At least one currently opaque service or CMC-department handler will be displaced rather than formalized.", confirms: "A different principal is formally appointed over a handler.", disconfirms: "All visible handlers convert in place.", status: "Open", confidence: "Moderate" },
] as const;

export const limits = [
  "The public record does not reveal political vetting, internal evaluations, health, full promotion slates, or the eligible pool at any selection point.",
  "Many birth years, grade conversions and current principal appointments remain unresolved; 'no record' is a statement about our sources, not about the seat.",
  "Chinese official reporting is selective and pages can be revised or removed; the Ministry of National Defense and CCDI sites were not reachable from the build environment used for the v8 research pass, so their releases are cited through Xinhua or 81.cn reprints where possible.",
  "Translation can erase the difference between principal, deputy, acting and handling authority; the exact Chinese title controls.",
  "The checked-in repository does not contain the upstream research_v2 extraction that produced the original officer list; that stage is described, not reproduced.",
] as const;
