```markdown
# Even-Talert-Bot 📅🤖

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**Even-Talert-Bot** is an automated web scraping and calendar automation tool. It continuously monitors specified internet sources for events happening **today**, processes them every two hours, and automatically provisions them into your Google Calendar—smartly checking for duplicates beforehand to keep your schedule clean.

---

## ✨ Features

*   **Smart Web Scraping:** Targets and extracts event data (names, times, descriptions, links) scheduled for the current day.
*   **Automated Sync Cycle:** Runs quietly in the background, fetching fresh data every 2 hours via a built-in cron scheduler.
*   **Intelligent Google Calendar Integration:** Connects directly to the Google Calendar API.
*   **Duplicate Prevention:** Checks your calendar *before* creating a new event. If the event already exists, it skips it to prevent clutter.

---

## 🛠️ Architecture Flow

```text
[Internet Sources] 
       │ (Scrapes data every 2 hours)
       ▼
[Even-Talert-Bot] ──► [Checks Google Calendar]
                               │
                               ├─► Match Found? ──► Skip (No Duplicate)
                               └─► No Match?    ──► Create New Event ✨

```

---

## 🚀 Getting Started

### Prerequisites

* **Runtime:** Node.js (v18+) OR Python (3.10+)
* **Google Cloud Project:** You will need a Google Cloud project with the **Google Calendar API** enabled.
* **OAuth2 Credentials:** Download your `credentials.json` (Service Account or OAuth Client ID) from the Google Cloud Console and place it in the root folder.

### Installation

1. **Clone the repository:**

```bash
   git clone [https://github.com/yourusername/even-talert-bot.git](https://github.com/yourusername/even-talert-bot.git)
   cd even-talert-bot

```

2. **Install dependencies:**

```bash
   # If Node.js:
   npm install

   # If Python:
   pip install -r requirements.txt

```

3. **Configure Environment Variables:**
Create a `.env` file in the root directory:

```env
   GOOGLE_CALENDAR_ID="primary" # Or your specific Calendar ID
   SCRAPE_TARGET_URL="[https://example.com/events-today](https://example.com/events-today)"
   FETCH_INTERVAL_HOURS=2

```

---

## 📖 Usage

### Running Locally

To start the bot and initiate the 2-hour interval scheduler:

```bash
# If Node.js:
npm start

# If Python:
python main.py

```

### How the Duplicate Check Works

The bot queries your Google Calendar for events within the `timeMin` and `timeMax` window of today. It sanitizes and compares the scraped event title/time against existing entries. An event is only created if `$calendar_has_event == false$`.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute to the scraping patterns or scheduling logic.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

```

---

### A quick question to help you finalize the code:
Are you using **Node.js** (like `node-cron` and `puppeteer`/`cheerio`) or **Python** (like `apscheduler` and `BeautifulSoup`) for this project? I can give you the exact `.env` or boilerplate snippets for either if you're setting up the scraping logic right now!

```
