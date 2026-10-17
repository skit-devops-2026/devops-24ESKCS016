# Smart Job Portal

An intuitive, responsive web-based job and internship portal developed as a Full Stack Development (FSD) and DevOps practice project at Swami Keshvanand Institute of Technology, Management & Gramothan (SKIT), Jaipur.

---

## Student & Course Details

- **Author / Student:** Abhishek Baberwal
- **Student ID:** 24ESKCS016
- **Branch & Semester:** B.Tech CSE, Semester V (Session 2026)
- **Course:** DevOps Lab & Full Stack Development
- **Repository:** skit-devops-2026 / devops-24ESKCS016

---

## Project Overview

Smart Job Portal (SmartJobs) allows students, freshers, and professionals to browse available job openings, filter opportunities by role, location, and experience, and manage user authentication via dedicated registration and login interfaces.

The project is structured with a responsive frontend built on HTML5, CSS3, and JavaScript, backed by an automated CI/CD pipeline using GitHub Actions and Jenkins for continuous integration and automated quality testing.

---

## Features

- **Home Page (`index.html`):** Clean hero section, navigation bar, platform highlights, and quick access to job searches.
- **Job Listings (`jobs.html`):** Structured job cards displaying titles, company details, job types (Full-time, Internship, Remote), locations, and apply buttons.
- **User Authentication:**
  - **Login (`login.html`):** User login form with responsive layout, field validation, and navigation links.
  - **Registration (`register.html`):** New user registration form with validation feedback.
- **Responsive Layout (`style.css`, `responsive.css`):** Fully mobile-friendly design adapting to desktops, tablets, and phones.
- **Interactive UI Logic (`main.js`):** Client-side navigation handling, dynamic UI updates, and interactive controls.

---

## Project Structure

```text
mileStone2/
├── .github/
│   └── workflows/
│       └── ci.yml             # GitHub Actions CI workflow (automated tests on push/PR)
├── tests/
│   └── smart-job-portal.test.js # Test suite for portal pages
├── .gitignore                 # Git ignore file for build artifacts and logs
├── Jenkinsfile                # Jenkins declarative pipeline (Checkout & Test stages)
├── index.html                 # Landing page
├── jobs.html                  # Job listings and search page
├── login.html                 # User authentication login page
├── register.html              # New user registration page
├── main.js                    # Client-side JavaScript logic
├── package.json               # Project manifest and npm test configurations
├── package-lock.json          # Dependency lockfile
├── README.md                  # Project documentation
├── responsive.css             # Responsive layout styling
├── style.css                  # Core stylesheet
└── test_project.py            # Automated test suite using Python unittest
```

---

## Getting Started

### Prerequisites

- A modern web browser (Google Chrome, Mozilla Firefox, Microsoft Edge)
- Python 3.8+ (for automated tests)
- Git

### Running Locally

1. Clone the repository:
   ```bash
   git clone git@github.com:skit-devops-2026/devops-24ESKCS016.git
   cd devops-24ESKCS016
   ```

2. Open the project in your browser:
   - Double-click `index.html` or open it with any web server (such as VS Code Live Server or Python `http.server`):
   ```bash
   python -m http.server 3000
   ```
   - Navigate to `http://localhost:3000` to interact with the portal.

---

## Automated Testing

The project includes an automated test suite implemented in `test_project.py` using Python's built-in `unittest` module.

To execute the test suite locally:

```bash
python -m unittest discover -v
```

The test runner validates:
- Existence and integrity of all essential web pages (`index.html`, `jobs.html`, `login.html`, `register.html`).
- Presence of frontend assets (`main.js`, `style.css`, `responsive.css`).
- Proper HTML5 markup structure in the home page.

---

## Continuous Integration & DevOps

### 1. GitHub Actions CI Pipeline (`.github/workflows/ci.yml`)

The CI workflow automatically triggers on every push and pull request to the `main` branch.
- **Environment:** Ubuntu Latest runner
- **Language Setup:** Python 3.x
- **Test Execution:** Runs `python -m unittest discover -v` across the entire repository.
- **Status Reporting:** Provides build pass/fail status directly within GitHub pull requests and commit statuses.

### 2. Jenkins Pipeline (`Jenkinsfile`)

A declarative Jenkinsfile is configured at the root of the repository:
- **Stages:**
  1. `Checkout`: Checks out source code from the configured SCM repository.
  2. `Run Tests`: Automatically executes the automated test suite (`python -m unittest discover -v`).
- **Post-Build Actions:** Emits notification messages for pipeline success or failure.

---

## Branching & Release Strategy

- `main`: Production-ready branch. All changes are merged via Pull Requests.
- `feature/*`: Dedicated branches for individual modules (`feature/jobs-page`, `feature/login-page`, `feature/navbar-improvement`, `feature/registration-page`).
- All merged Pull Requests contain structured descriptions documenting the modifications and scope of changes.
