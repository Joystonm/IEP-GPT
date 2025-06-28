# IEP-GPT

## Personalized Learning Plans for Neurodiverse Students

IEP-GPT is an AI-powered platform that helps educators and parents quickly generate and manage personalized 7-day learning plans for neurodiverse students. By leveraging advanced AI technologies, the app creates tailored education plans that address each student's unique strengths, challenges, and learning style.

## Problem Statement

Millions of students with neurodiverse conditions (like ADHD, autism, or dyslexia) struggle to keep up in traditional classrooms. Creating personalized learning plans (IEPs) is essential but time-consuming for teachers and parents, and often lacks expert input or adaptability. There is a need for a smart assistant that helps generate, manage, and evolve tailored learning plans efficiently.

## Key Features

- **Personalized 7-Day Learning Plans**: Generate detailed plans tailored to each student's unique neurodiversity profile
- **Research-Backed Strategies**: Access evidence-based teaching methods and resources specific to each student's needs
- **Progress Memory**: Save student profiles and plans, track progress, and adapt future plans based on what works
- **Accessibility-Focused**: Clean, distraction-free UI with accessibility features like high contrast mode and large text
- **Resource Library**: Curated educational resources and teaching strategies for various neurodiverse conditions

## Tech Stack

### Frontend
- React.js
- React Router
- React Icons
- Axios for API requests
- CSS for styling

### Backend
- Node.js with Express
- Groq API for learning plan generation
- Tavily API for educational resource search
- Mem0 API for data storage and retrieval

## How It Works

1. **User Interface**: Teachers/parents log in and fill out a form with student information including name, age, diagnosis, strengths, struggles, learning style, and attention span.

2. **AI-Powered Plan Generator**: On submission, the backend uses Groq's LLM to generate a 7-day personalized learning plan with daily goals, teaching methods, time blocks, and accommodation suggestions.

3. **Knowledge Enrichment**: Tavily Search enhances the plan with research-backed teaching methods and resources specific to the student's needs.

4. **Progress Memory**: Plans are saved to Mem0 under the student's profile. Users can return anytime, update progress, and generate adapted plans based on what's working.

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- API keys for Groq, Tavily, and Mem0

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/iep-gpt.git
cd iep-gpt
```

2. Install dependencies for both client and server
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables
   - Create `.env` file in the server directory with your API keys
   - Create `.env` file in the client directory with the API URL

4. Start the development servers
```bash
# Start the backend server
cd server
npm run dev

# In a new terminal, start the frontend
cd client
npm start
```

5. Open your browser and navigate to `http://localhost:3000`

## Use Cases

- **Schools**: Educators can quickly generate personalized learning plans for neurodiverse students
- **Parents**: Homeschooling parents can access expert-level guidance for supporting their child's unique learning journey
- **Special Education Specialists**: Supplement expertise with AI-generated plans and research-backed resources
- **Educational NGOs**: Scale impact by providing personalized support to more neurodiverse students

## Project Structure

```
iep-gpt/
├── client/                     # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── assets/             # Images, fonts, logos
│   │   ├── components/         # Reusable React components
│   │   ├── pages/              # Page-level components
│   │   ├── services/           # API handlers (Axios)
│   │   ├── styles/             # CSS files
│   │   ├── App.js
│   │   └── index.js
│
├── server/                     # Backend with Express/Node.js
│   ├── controllers/            # Route logic
│   ├── routes/                 # API endpoints
│   ├── services/               # Groq, Tavily, Mem0 integrations
│   ├── models/                 # DB schema
│   ├── config/                 # API keys, env, DB configs
│   ├── utils/                  # Helper functions
│   ├── app.js                  # Express app setup
│   └── server.js               # Entry point
│
├── .gitignore
├── README.md
└── package.json                # For root-level scripts
```

## Why It's Innovative

- **Personalization at scale**: AI enables customized learning plans for every student, not just a few.
- **Inclusion-focused**: Prioritizes often-overlooked learners with neurodiverse needs.
- **Memory + Search + Generation**: Combines Groq (fast LLM), Tavily (knowledge), and Mem0 (context memory) — a powerful trio.

## License

[MIT](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
