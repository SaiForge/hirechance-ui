# 🎨 HireChance - Frontend UI

The client application for **HireChance**, built with **React 19**, **Vite**, and **Tailwind CSS v4**.

## 🚀 Features

- **Dynamic Resume Evaluation View**: Upload PDF or DOCX resumes and receive instant ATS readability scores, extracted skill tags, and categorized breakdown metrics.
- **AI Recommendation Viewer**: Interactive cards displaying job title matches, company tiers, location, match percentage, and direct apply links.
- **Candidate Analytics Dashboard**: Track historical resume submissions, score trajectories, and personal improvement insights.
- **Modern Responsive Design**: Glassmorphic styling, smooth micro-interactions, dark/light harmonious color accents, and full mobile responsiveness.
- **Secure Authentication**: Protected routes with JWT session persistence.

## 🛠️ Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM v7
- **Linting**: ESLint 9

## 💻 Local Development

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Set the backend API URL:

```env
VITE_API_URL=http://localhost:8001
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be accessible at `http://localhost:5173`.

### 4. Build for Production

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## 🚢 Deployment

The frontend is configured for automatic deployment to **Azure Static Web Apps** via GitHub Actions workflow `.github/workflows/azure-static-web-apps-jolly-moss-099041b00.yml`.
