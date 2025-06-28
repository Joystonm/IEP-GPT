import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const NotFound = () => {
  return (
    <div className="not-found">
      <Header />
      
      <main className="not-found-content">
        <h2>404 - Page Not Found</h2>
        <p>The page you are looking for does not exist.</p>
        <Link to="/" className="home-link">Return to Home</Link>
      </main>
      
      <Footer />
    </div>
  );
};

export default NotFound;
