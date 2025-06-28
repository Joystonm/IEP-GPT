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
- **Calendar View**: Visualize and manage the 7-day learning plan with drag-and-drop functionality
- **Progress Tracking**: Monitor student engagement and completion of activities

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

4. **Progress Tracking**: Track student engagement and completion of activities throughout the week.

5. **Plan Adaptation**: Generate new plans based on what worked well and what didn't, continuously improving the learning experience.

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

2. Run the setup script to install all dependencies
```bash
node setup.js
```

3. Set up environment variables
   - Create `.env` file in the server directory with your API keys
   - Create `.env` file in the client directory with the API URL

4. Start the development servers
```bash
npm run dev
```

5. If you encounter port conflicts, use the port utility script
```bash
node kill-port.js 5000
```

6. Open your browser and navigate to `http://localhost:3000`

## New Features

### Progress Tracker
Track student engagement and completion of activities throughout the week. The progress tracker allows you to:
- Mark activities as completed
- Rate student engagement for each activity
- Add notes about what worked and what didn't
- Generate adapted plans based on progress data

### Calendar View
Visualize the 7-day learning plan in a calendar format. Features include:
- Week-by-week navigation
- Drag-and-drop functionality to reschedule activities
- Edit activities directly from the calendar
- Visual indicators for today's activities

### Resource Library
Access a curated library of educational resources and teaching strategies. Features include:
- Filter resources by type, age group, and difficulty level
- Search for specific topics or keywords
- Save resources for later reference
- View teaching strategies specific to the student's diagnosis

## Use Cases

- **Schools**: Educators can quickly generate personalized learning plans for neurodiverse students
- **Parents**: Homeschooling parents can access expert-level guidance for supporting their child's unique learning journey
- **Special Education Specialists**: Supplement expertise with AI-generated plans and research-backed resources
- **Educational NGOs**: Scale impact by providing personalized support to more neurodiverse students

## Troubleshooting

### Port Already in Use
If you see an error like `EADDRINUSE: address already in use :::5000`, run:
```bash
node kill-port.js 5000
```

This utility will identify and help you kill processes using port 5000.

### API Connection Issues
Make sure your API keys are correctly set in the `.env` file and that you have internet access to connect to the external APIs (Groq, Tavily, Mem0).

## License

[MIT](LICENSE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
