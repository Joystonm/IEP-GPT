const { consultationService } = require('../services/mongoService');

/**
 * Get consultations by student ID
 * @route GET /api/consultations/student/:studentId
 */
exports.getConsultationsByStudentId = async (req, res) => {
  try {
    const consultations = await consultationService.getConsultationsByStudentId(req.params.studentId);
    res.json({
      success: true,
      data: consultations
    });
  } catch (error) {
    console.error('Error fetching consultations:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch consultations',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Create a new consultation
 * @route POST /api/consultations
 */
exports.createConsultation = async (req, res) => {
  try {
    const consultation = await consultationService.createConsultation(req.body);
    res.status(201).json({
      success: true,
      data: consultation
    });
  } catch (error) {
    console.error('Error creating consultation:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create consultation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

/**
 * Update a consultation
 * @route PUT /api/consultations/:id
 */
exports.updateConsultation = async (req, res) => {
  try {
    const consultation = await consultationService.updateConsultation(req.params.id, req.body);
    if (!consultation) {
      return res.status(404).json({ 
        success: false, 
        message: 'Consultation not found' 
      });
    }
    res.json({
      success: true,
      data: consultation
    });
  } catch (error) {
    console.error('Error updating consultation:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update consultation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
