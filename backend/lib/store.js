// backend/lib/store.js
// A tiny file-backed JSON "database". No external DB engine required —
// everything lives in backend/data/db.json and is read/written with fs.
// Good enough for a student project; swap for a real DB later if needed.

const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "..", "data", "db.json");

const SEED_JOBS = [
  {
    id: 1,
    title: "Frontend Developer Intern",
    company: "TechNova",
    location: "Jaipur",
    type: "Internship",
    experience: "Fresher",
    category: "Web Development",
    salary: "₹15,000/month",
    skills: ["HTML", "CSS", "JavaScript", "Bootstrap"],
    description:
      "Work with our web team building responsive UI for internal and client-facing dashboards. You'll pair with senior developers, ship real features, and learn our component library.",
    postedAt: "2026-09-02"
  },
  {
    id: 2,
    title: "Software Engineer (Fresher)",
    company: "CodeCraft Labs",
    location: "Bengaluru",
    type: "Full-time",
    experience: "Fresher",
    category: "Software Development",
    salary: "₹5.5 LPA",
    skills: ["Java", "SQL", "DSA"],
    description:
      "Join our backend team building services that power our core product. Strong fundamentals in data structures and SQL are a must; we'll teach you the rest.",
    postedAt: "2026-08-20"
  },
  {
    id: 3,
    title: "Data Analyst Intern",
    company: "InsightWorks",
    location: "Remote",
    type: "Internship",
    experience: "Fresher",
    category: "Data Science",
    salary: "₹12,000/month",
    skills: ["Excel", "SQL", "Python"],
    description:
      "Help turn raw data into dashboards and reports our stakeholders actually use. You'll write SQL queries daily and build small Python scripts for data cleaning.",
    postedAt: "2026-09-10"
  },
  {
    id: 4,
    title: "UI/UX Design Intern",
    company: "PixelCraft Studio",
    location: "Jaipur",
    type: "Internship",
    experience: "Fresher",
    category: "UI/UX Design",
    salary: "₹10,000/month",
    skills: ["Figma", "Adobe XD"],
    description:
      "Design wireframes, prototypes, and polished UI screens for client projects. Portfolio matters more than years of experience here.",
    postedAt: "2026-09-05"
  },
  {
    id: 5,
    title: "Cyber Security Analyst (Fresher)",
    company: "SecureNet Systems",
    location: "Pune",
    type: "Full-time",
    experience: "Fresher",
    category: "Cyber Security",
    salary: "₹4.8 LPA",
    skills: ["Networking", "Linux"],
    description:
      "Monitor network traffic, triage alerts, and assist senior analysts with vulnerability assessments. Comfort with Linux basics is expected.",
    postedAt: "2026-08-28"
  },
  {
    id: 6,
    title: "Digital Marketing Intern",
    company: "BrandBoost Media",
    location: "Remote",
    type: "Internship",
    experience: "Fresher",
    category: "Digital Marketing",
    salary: "₹8,000/month",
    skills: ["SEO", "Content Writing"],
    description:
      "Plan and execute SEO campaigns, write on-brand content, and track performance across channels for our client roster.",
    postedAt: "2026-09-12"
  },
  {
    id: 7,
    title: "Backend Developer Intern",
    company: "ServerStack",
    location: "Hyderabad",
    type: "Internship",
    experience: "Fresher",
    category: "Web Development",
    salary: "₹14,000/month",
    skills: ["Node.js", "MongoDB", "REST APIs"],
    description:
      "Build and document REST APIs powering our mobile and web clients. You'll work directly with our platform team on real production code.",
    postedAt: "2026-09-01"
  },
  {
    id: 8,
    title: "Machine Learning Intern",
    company: "InsightWorks",
    location: "Remote",
    type: "Internship",
    experience: "Fresher",
    category: "Data Science",
    salary: "₹18,000/month",
    skills: ["Python", "Pandas", "scikit-learn"],
    description:
      "Prototype and evaluate ML models for our recommendation pipeline, working closely with the data science lead.",
    postedAt: "2026-09-08"
  },
  {
    id: 9,
    title: "QA / Testing Intern",
    company: "CodeCraft Labs",
    location: "Bengaluru",
    type: "Internship",
    experience: "Fresher",
    category: "Software Development",
    salary: "₹10,000/month",
    skills: ["Manual Testing", "Selenium"],
    description:
      "Write and execute test cases, automate regression checks with Selenium, and work with developers to squash bugs before release.",
    postedAt: "2026-09-15"
  },
  {
    id: 10,
    title: "Graphic Design Intern",
    company: "PixelCraft Studio",
    location: "Jaipur",
    type: "Internship",
    experience: "Fresher",
    category: "UI/UX Design",
    salary: "₹9,000/month",
    skills: ["Photoshop", "Illustrator"],
    description:
      "Create marketing graphics, social assets, and brand collateral for a range of clients across industries.",
    postedAt: "2026-09-18"
  }
];

function defaultDb() {
  return {
    users: [],
    jobs: SEED_JOBS,
    applications: [],
    sessions: [],
    nextUserId: 1,
    nextApplicationId: 1
  };
}

function ensureDb() {
  if (!fs.existsSync(DB_PATH)) {
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(defaultDb(), null, 2));
  }
}

function readDb() {
  ensureDb();
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  try {
    return JSON.parse(raw);
  } catch (err) {
    console.error("db.json was corrupted, resetting to seed data:", err.message);
    const fresh = defaultDb();
    fs.writeFileSync(DB_PATH, JSON.stringify(fresh, null, 2));
    return fresh;
  }
}

function writeDb(db) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

module.exports = { readDb, writeDb, DB_PATH };
