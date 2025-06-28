import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { FaBrain, FaCalendarAlt, FaSearch, FaChartLine } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="home-page">
      <Header />
      
      <main>
        <section className="hero">
          <div className="hero-content">
            <h1>Personalized Learning Plans for Neurodiverse Students</h1>
            <p className="hero-subtitle">
              IEP-GPT helps educators and parents create customized 7-day learning plans
              that address the unique needs of neurodiverse students.
            </p>
            <Link to="/dashboard" className="cta-button">
              Create Your First Plan
            </Link>
          </div>
        </section>
        
        <section className="how-it-works">
          <div className="container">
            <h2>How It Works</h2>
            
            <div className="steps">
              <div className="step">
                <div className="step-number">1</div>
                <h3>Enter Student Information</h3>
                <p>
                  Provide details about the student's strengths, challenges, 
                  learning style, and specific needs.
                </p>
              </div>
              
              <div className="step">
                <div className="step-number">2</div>
                <h3>AI Generates Learning Plan</h3>
                <p>
                  Our AI creates a personalized 7-day learning plan with daily goals, 
                  teaching methods, and time blocks.
                </p>
              </div>
              
              <div className="step">
                <div className="step-number">3</div>
                <h3>Access Research-Backed Resources</h3>
                <p>
                  Each plan includes evidence-based teaching strategies and 
                  resources specific to the student's needs.
                </p>
              </div>
              
              <div className="step">
                <div className="step-number">4</div>
                <h3>Track Progress & Adapt</h3>
                <p>
                  Update student progress and generate new plans that evolve 
                  with the student's development.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="features">
          <div className="container">
            <h2>Key Features</h2>
            
            <div className="feature-grid">
              <div className="feature-card">
                <div className="feature-icon">
                  <FaBrain />
                </div>
                <h3>Personalized Learning</h3>
                <p>
                  Plans tailored to each student's unique neurodiversity profile, 
                  strengths, and challenges.
                </p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <FaCalendarAlt />
                </div>
                <h3>7-Day Structure</h3>
                <p>
                  Detailed daily schedules with time blocks optimized for the 
                  student's attention span and learning style.
                </p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <FaSearch />
                </div>
                <h3>Research-Backed Methods</h3>
                <p>
                  Teaching strategies and resources supported by the latest 
                  educational research and best practices.
                </p>
              </div>
              
              <div className="feature-card">
                <div className="feature-icon">
                  <FaChartLine />
                </div>
                <h3>Progress Tracking</h3>
                <p>
                  Monitor student development and automatically adapt future 
                  plans based on what works best.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="use-cases">
          <div className="container">
            <h2>Who Can Benefit</h2>
            
            <div className="use-case-grid">
              <div className="use-case">
                <h3>Educators</h3>
                <p>
                  Teachers can quickly generate personalized learning plans for students 
                  with ADHD, autism, dyslexia, and other neurodiverse conditions.
                </p>
              </div>
              
              <div className="use-case">
                <h3>Parents</h3>
                <p>
                  Homeschooling parents can access expert-level guidance for 
                  supporting their child's unique learning journey.
                </p>
              </div>
              
              <div className="use-case">
                <h3>Special Education Specialists</h3>
                <p>
                  Specialists can supplement their expertise with AI-generated 
                  plans and research-backed resources.
                </p>
              </div>
              
              <div className="use-case">
                <h3>Educational NGOs</h3>
                <p>
                  Organizations can scale their impact by providing personalized 
                  support to more neurodiverse students.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        <section className="cta-section">
          <div className="container">
            <h2>Ready to Create Your First Learning Plan?</h2>
            <p>
              Join thousands of educators and parents who are using IEP-GPT to support 
              neurodiverse students in reaching their full potential.
            </p>
            <Link to="/dashboard" className="cta-button">
              Get Started Now
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;

