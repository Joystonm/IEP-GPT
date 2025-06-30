module.exports = [
  {
    id: 'cons-1',
    studentId: 'mock-student-1',
    expertId: 'exp-1',
    expertName: 'Dr. Sarah Johnson',
    expertPhoto: 'https://randomuser.me/api/portraits/women/45.jpg',
    type: 'plan-review',
    status: 'completed',
    urgency: 'normal',
    specificQuestions: 'How can I better support executive function skills?',
    requestDate: '2025-06-20T14:30:00Z',
    completedDate: '2025-06-22T10:15:00Z',
    summary: 'Reviewed learning plan for ADHD accommodations. Suggested additional executive function supports and breaking tasks into smaller chunks.',
    feedback: "The plan has strong visual supports, which is excellent. Consider adding more frequent movement breaks and self-monitoring tools. I've attached some specific resources for math anxiety that might help.",
    attachments: ['ADHD_Resources.pdf', 'Executive_Function_Checklist.pdf']
  },
  {
    id: 'cons-2',
    studentId: 'mock-student-3',
    expertId: 'exp-3',
    expertName: 'Dr. Aisha Patel',
    expertPhoto: 'https://randomuser.me/api/portraits/women/65.jpg',
    type: 'specific-question',
    status: 'in-progress',
    urgency: 'urgent',
    specificQuestions: 'What are the best strategies for supporting classroom transitions for a student with autism?',
    requestDate: '2025-06-25T09:45:00Z',
    completedDate: null,
    summary: 'Asked for guidance on sensory accommodations for a student with autism who struggles with classroom transitions.',
    feedback: null,
    attachments: []
  }
];
