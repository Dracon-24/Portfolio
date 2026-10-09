export interface ProjectSection {
  title: string;
  paragraphs?: string[];
  items?: string[];
}
export interface Project {
  slug: string;
  name: string;
  number: string;
  category: string;

  description: string;
  tags: string[];
  kind: "posture" | "integrity" | "tours";
  github?: string;
  demo?: string;
  architecture: { label: string; detail: string }[];
  sections: ProjectSection[];
}
export const projects: Project[] = [
  {
    slug: "posturector",
    name: "Posturector",
    number: "01",
    category: "Adaptive Systems · Signal Processing",

    kind: "posture",
    description:
      "A personalized lumbar posture monitoring prototype with adaptive calibration, sustained deviation detection, and real time haptic feedback.",
    tags: ["React Native", "TypeScript", "Expo", "Node.js", "SQLite"],
    architecture: [
      { label: "Sense", detail: "Phone accelerometer & gyroscope" },
      { label: "Estimate", detail: "Complementary filtering & body mapping" },
      { label: "Personalize", detail: "Calibration & bounded thresholds" },
      { label: "Respond", detail: "Local detection & haptic feedback" },
      { label: "Learn", detail: "Session metrics & SQLite history" },
    ],
    sections: [
      {
        title: "The problem",
        paragraphs: [
          "A single fixed posture threshold does not account for each person’s baseline. Transient movement can also trigger feedback that is unhelpful. Posturector explores personalized calibration and sustained deviation detection in an engineering prototype.",
        ],
      },
      {
        title: "What works today",
        items: [
          "An Android Expo application reads smartphone IMU sensors and estimates pitch and roll using accelerometer and gyroscope fusion.",
          "Personalized calibration establishes a baseline; stability and persistence filters suppress transient deviations.",
          "A local feedback controller provides vibration feedback and observes completed correction responses.",
          "Bounded, reversible session local adaptation adjusts tolerance and feedback behavior from behavioral evidence.",
          "Completed sessions are uploaded to an Express backend and stored in SQLite; session, daily, and weekly analytics present available data.",
        ],
      },
      {
        title: "My contributions",
        paragraphs: [
          "Developed the sensor processing pipeline, baseline relative detection, calibration, haptic feedback, and adaptive threshold controller. Built the backend and session analysis flow connecting the mobile prototype to persistent history.",
        ],
      },
      {
        title: "A deliberate architecture",
        paragraphs: [
          "The real time sensing, detection, and feedback loop runs locally on the device. The backend handles completed session persistence and history, so a slow network does not delay feedback. Canonical calibration is persisted on device; active session state and failed uploads remain in memory.",
        ],
      },
      {
        title: "Verification & evidence",
        paragraphs: [
          "The supplied project context records 136 passing root tests, 16 passing backend tests, and passing frontend/backend TypeScript checks. These establish deterministic software behavior and compilation at that checkpoint; they do not establish physical device sensor accuracy or clinical effectiveness.",
        ],
      },
      {
        title: "Limitations & next steps",
        items: [
          "The current implementation uses smartphone sensors. ESP32, MPU6050, a vibration motor, and a battery are the intended future hardware platform.",
          "On body calibration repeatability, background execution, battery behavior, and haptic perception require separate device validation.",
          "Physiological fatigue validation and learned weights from Borg RPE or EMG are future research, not verified current integrations.",
          "Failed uploads are retained in memory rather than durable crash recovery storage.",
        ],
      },
    ],
  },
  {
    slug: "medichain",
    name: "MediChain",
    number: "02",
    category: "Backend Engineering · Cryptography",

    kind: "integrity",
    description:
      "A local medical record integrity prototype using content hashes, staff signatures, linked versions, and an auditable history of updates.",
    tags: ["Python", "Flask", "SQLite", "SHA256", "Ed25519"],
    architecture: [
      { label: "Record", detail: "Flask API & browser interface" },
      { label: "Hash", detail: "SHA256 content digest" },
      { label: "Sign", detail: "Ed25519 staff signature" },
      { label: "Link", detail: "Version & audit hash chains" },
      { label: "Verify", detail: "Content and signature checks" },
    ],
    sections: [
      {
        title: "The problem",
        paragraphs: [
          "Medical record updates need an inspectable history and a way to detect altered content. MediChain demonstrates cryptographic integrity checks in a lightweight local system, motivated by settings where continuous connectivity cannot be assumed.",
        ],
      },
      {
        title: "Implemented capabilities",
        items: [
          "SHA256 hashes and Ed25519 digital signatures support content integrity verification.",
          "Staff keys are stored as password encrypted private PEM files; the API provides nonce challenge response primitives.",
          "Hash linked versions track record updates; a separate hash linked audit trail records operations.",
          "Flask REST endpoints and five HTML pages cover registration, record creation and modification, history, logs, and verification.",
          "A separate CLI path demonstrates the workflow with in memory records; the web path persists records in SQLite.",
        ],
      },
      {
        title: "My contributions",
        paragraphs: [
          "Built cryptographic integrity verification, record version links, and audit history tracking. Developed the REST API and browser interface for record workflows and implemented challenge response and encrypted key storage primitives.",
        ],
      },
      {
        title: "Technical approach",
        paragraphs: [
          "Record text is hashed using SHA256. The UTF8 hexadecimal digest is then signed with Ed25519. Verification recomputes the content hash and verifies the signature. Local version links and audit links make selected changes inspectable; there is no distributed consensus or external blockchain anchoring.",
        ],
      },
      {
        title: "Design boundaries",
        paragraphs: [
          "CLI state and database backed web state are separate. Signatures currently protect record text rather than the full version envelope, and local chain links do not provide an independently trusted final chain anchor. These boundaries matter when interpreting what integrity verification proves.",
        ],
      },
      {
        title: "Limitations & next steps",
        items: [
          "This is a demonstration prototype, unsuitable for real medical data in its current state.",
          "Browser login does not complete cryptographic verification and API reads lack server session enforcement; authentication and authorization need hardening.",
          "Canonical signed metadata, authenticated chain heads, transactional appends, and safer rendering are required for stronger integrity guarantees.",
          "Test scripts exist, but the supplied review did not run a complete runtime suite. No production readiness or clinical claims are made.",
        ],
      },
    ],
  },
  {
    slug: "touroholic",
    name: "Touroholic",
    number: "03",
    category: "Full Stack Development · Web Engineering",

    kind: "tours",
    description:
      "A tour discovery, demo booking, and review platform with server rendered pages, role based accounts, and interactive itinerary maps.",
    tags: ["Node.js", "Express", "MongoDB", "Pug", "Leaflet"],
    architecture: [
      { label: "Explore", detail: "Pug pages & interactive maps" },
      { label: "Route", detail: "Express views & REST APIs" },
      { label: "Authorize", detail: "JWT & role permissions" },
      { label: "Operate", detail: "Tours, bookings & reviews" },
      { label: "Persist", detail: "MongoDB & Mongoose models" },
    ],
    sections: [
      {
        title: "The platform",
        paragraphs: [
          "Touroholic lets users browse tours, inspect itineraries, create accounts, make demo reservations, manage profiles, and write reviews. It builds on the Natours course application, with rebranding and improvements to authentication, bookings, review workflows, maps, administration, error handling, and tests.",
        ],
      },
      {
        title: "Key capabilities",
        items: [
          "Tour discovery and detail pages include itinerary stops, guides, dates, and optional data fallbacks.",
          "JWT authentication uses HTTP only cookies with registration, login, password recovery, account updates, and role based access.",
          "Demo reservations include booking history and duplicate booking protection; no real payment or card processing takes place.",
          "Review ownership and rating aggregation support review management workflows.",
          "Leaflet and OpenStreetMap visualize tour locations; administrative tools manage tours, users, bookings, and reviews.",
        ],
      },
      {
        title: "My contributions",
        paragraphs: [
          "Developed and improved MVC based REST APIs, authentication and account flows, demo booking and review management, and interactive itinerary maps. Reworked the application’s branding and strengthened error recovery and regression coverage.",
        ],
      },
      {
        title: "Architecture & decisions",
        paragraphs: [
          "Express controllers render Pug views using Mongoose models for users, tours, reviews, and bookings. Browser JavaScript adds interactive behavior through the same REST APIs. Server rendering keeps page generation close to the backend, while Leaflet provides map interaction without a separate React frontend.",
          "Reservations deliberately use a demo workflow. The application offers booking behavior without implying a financial transaction or a configured payment provider.",
        ],
      },
      {
        title: "Verification",
        paragraphs: [
          "The supplied context records 24 regression tests and nine HTTP/MongoDB integration tests passing at its checkpoint. Coverage includes authentication, concurrent reservations, review ownership, account updates, password resets, administrative authorization, optional tour fields, and malformed requests. This portfolio does not rerun the separate application’s tests.",
        ],
      },
      {
        title: "Scope & future work",
        paragraphs: [
          "Payment processing is intentionally outside the current implementation. External services such as email delivery and database connectivity depend on environment configuration. A production launch would require deployment specific operational validation.",
        ],
      },
    ],
  },
];
