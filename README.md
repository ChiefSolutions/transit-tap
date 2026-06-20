# 🚍 🚋 Transit Tap

TransitTap is a full-stack showcase monorepo simulating real-time public transport network data. The application mimics
a high-throughput stream of passenger card "taps" across various urban transit networks, including buses and trams. Angular on the frontend and .Net on the backend using Minimal Api.

# 💻 Demo
The app receives server sent events then displays them on a dashboard in a table with cards above the table to filter by event and status. The table also sorts the data, by default the latest events are added at the top. The event streamer is cofigured to send an event every 1-2 seconds. You can see the functionality in the videos below.

### Fetch, Display, Sort and Filter
https://github.com/user-attachments/assets/3d98ecf9-3a68-4c53-8336-509920f11e40

### Keyboard Accessibility
https://github.com/user-attachments/assets/a8cf343e-a8db-4a73-bc12-ab7d40aea17b

## 📁 Repository Structure

This repository is managed as a unified monorepo:

* **`/web`**: An Angular client application providing a dynamic dashboard to visualize live transit metrics, passenger
  flows, and stream activity.
* **`/api`**: A .NET 10 minimal Web API responsible for generating, processing, and streaming the simulated
  transit tap data.

---

## 🛠️ Global Requirements

To run this entire stack locally, make sure you have the following installed:

* [Node.js (v20+)](https://nodejs.org/)
* [.NET 10 SDK](https://dotnet.microsoft.com/download)

---

## 🚀 Getting Started

### 1. Clone the Repository

### 2. Install package in both web and api projects

### 3. Run the api project first, then followed by the client

## 📈 App Metrics
These include: Unit test coverage and lighthouse pageload.

### Unit test coverage:
<img width="1708" height="789" alt="Screenshot 2026-06-19 at 19 36 26" src="https://github.com/user-attachments/assets/f4c43bef-609a-4684-9827-dd4fbf32287e" />

### Lighthouse prod:
<img width="549" height="399" alt="lighthouse-prod" src="https://github.com/user-attachments/assets/a897f1e5-0dfd-44dc-8786-ffe89f1433a9" />

### Lighthouse dev:
<img width="467" height="397" alt="lighthouse-dev" src="https://github.com/user-attachments/assets/beaef069-f843-4dc0-843e-de517095ae6e" />


