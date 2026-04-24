# MedClear

MedClear is a modern, high-end, editorial-style web application that translates complex FDA medication labels into plain English. It is intentionally designed to be clean, readable, and accessible for patients and caregivers who are confused by clinical medication labels.

**Live Demo**: [https://medclear-phi.vercel.app](https://medclear-phi.vercel.app)

## Features

- **Search**: Search for any medication by brand or generic name.
- **Compare**: View two medications side-by-side to understand different risks and warnings.
- **FDA Risk Signal**: A calculation based on the frequency of high-risk terms in the FDA label.
- **Plain English Explanator**: Parses data from the FDA label and presents it in a clean bento-box grid.
- **Ask MedClear AI**: A chat interface that answers questions based *exclusively* on the FDA label data using an LLM.

## Architecture & Style

- Built with React and Vite.
- Plain Vanilla CSS Modules (No Tailwind or UI libraries) to ensure optimal rendering and total control.
- Designed with an architectural, dark-mode blueprint aesthetic inspired by Aether Fox Studios.

## How to Run Locally

You must have Node.js installed.

1. Clone the repository and navigate to the project root:
   ```bash
   git clone https://github.com/Anvesh-ch/medclear.git
   cd medclear
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Setup Environment Variables:
   Create a `.env` file in the root directory and add your Groq API key:
   ```
   VITE_GROQ_API_KEY=your_groq_api_key_here
   ```

4. Run the Dev Server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to the provided localhost URL (e.g., `http://localhost:5173`).

## Disclaimer

Data is sourced dynamically from the US FDA OpenFDA database. This tool is **not medical advice**. Always consult your pharmacist or doctor.
