const Student = require('../models/Student');
const LearningPlan = require('../models/LearningPlan');
const Consultation = require('../models/Consultation');

// Check if we're using mock data
const useMockData = process.env.USE_MOCK_DATA === 'true';

// Student Services
const studentService = {
  async getAllStudents() {
    if (useMockData) {
      console.log('Using mock service for student profiles');
      return require('../mock/students');
    }
    
    try {
      return await Student.find();
    } catch (error) {
      console.error('Error fetching students from MongoDB:', error);
      return require('../mock/students');
    }
  },
  
  async getStudentById(id) {
    if (useMockData) {
      console.log(`Using mock service for data retrieval`);
      const mockStudents = require('../mock/students');
      return mockStudents.find(student => student.id === id) || null;
    }
    
    try {
      return await Student.findById(id);
    } catch (error) {
      console.error(`Error fetching student ${id} from MongoDB:`, error);
      const mockStudents = require('../mock/students');
      return mockStudents.find(student => student.id === id) || null;
    }
  },
  
  async createStudent(studentData) {
    if (useMockData) {
      console.log('Using mock service for student creation');
      return { ...studentData, id: `mock-${Date.now()}` };
    }
    
    try {
      const student = new Student(studentData);
      return await student.save();
    } catch (error) {
      console.error('Error creating student in MongoDB:', error);
      return { ...studentData, id: `mock-${Date.now()}` };
    }
  },
  
  async updateStudent(id, studentData) {
    if (useMockData) {
      console.log(`Using mock service for student update`);
      return { ...studentData, id };
    }
    
    try {
      return await Student.findByIdAndUpdate(id, studentData, { new: true });
    } catch (error) {
      console.error(`Error updating student ${id} in MongoDB:`, error);
      return { ...studentData, id };
    }
  }
};

// Learning Plan Services
const learningPlanService = {
  async getLearningPlansByStudentId(studentId) {
    if (useMockData) {
      console.log(`Using mock service for learning plans`);
      const mockPlans = require('../mock/learningPlans');
      return mockPlans.filter(plan => plan.studentId === studentId);
    }
    
    try {
      return await LearningPlan.find({ studentId });
    } catch (error) {
      console.error(`Error fetching learning plans for student ${studentId} from MongoDB:`, error);
      const mockPlans = require('../mock/learningPlans');
      return mockPlans.filter(plan => plan.studentId === studentId);
    }
  },
  
  async createLearningPlan(planData) {
    if (useMockData) {
      console.log('Using mock service for plan generation');
      return { ...planData, id: `mock-${Date.now()}` };
    }
    
    try {
      const plan = new LearningPlan(planData);
      return await plan.save();
    } catch (error) {
      console.error('Error creating learning plan in MongoDB:', error);
      return { ...planData, id: `mock-${Date.now()}` };
    }
  }
};

// Consultation Services
const consultationService = {
  async getConsultationsByStudentId(studentId) {
    if (useMockData) {
      console.log(`Using mock service for consultations`);
      const mockConsultations = require('../mock/consultations');
      return mockConsultations.filter(consultation => consultation.studentId === studentId);
    }
    
    try {
      return await Consultation.find({ studentId });
    } catch (error) {
      console.error(`Error fetching consultations for student ${studentId} from MongoDB:`, error);
      const mockConsultations = require('../mock/consultations');
      return mockConsultations.filter(consultation => consultation.studentId === studentId);
    }
  },
  
  async createConsultation(consultationData) {
    if (useMockData) {
      console.log('Using mock service for consultation creation');
      return { ...consultationData, id: `cons-${Date.now()}` };
    }
    
    try {
      const consultation = new Consultation(consultationData);
      return await consultation.save();
    } catch (error) {
      console.error('Error creating consultation in MongoDB:', error);
      return { ...consultationData, id: `cons-${Date.now()}` };
    }
  },
  
  async updateConsultation(id, consultationData) {
    if (useMockData) {
      console.log(`Using mock service for consultation update`);
      return { ...consultationData, id };
    }
    
    try {
      return await Consultation.findByIdAndUpdate(id, consultationData, { new: true });
    } catch (error) {
      console.error(`Error updating consultation ${id} in MongoDB:`, error);
      return { ...consultationData, id };
    }
  }
};

module.exports = {
  studentService,
  learningPlanService,
  consultationService
};
