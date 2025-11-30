const mongoose = require('mongoose');

const EmployeeSchema = new mongoose.Schema({
  id: { 
    type: String, 
    required: true, 
    unique: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  department: { 
    type: String, 
    required: true 
  },
  designation: { 
    type: String, 
    required: true 
  },
  performanceRating: { 
    type: Number, 
    required: true 
  },
  salary: { 
    type: Number, 
    required: true 
  },
  skills: { 
    type: [String], 
    required: true 
  },
  projectsCompleted: { 
    type: Number, 
    default: 0 
  },
  manager: { 
    type: String 
  },
  yearsAtCompany: { 
    type: Number 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { timestamps: true });
EmployeeSchema.index({ name: 1, department: 1, skills: 1 });

module.exports = mongoose.model('Employee', EmployeeSchema);