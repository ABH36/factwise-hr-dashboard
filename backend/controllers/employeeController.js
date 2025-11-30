const Employee = require('../models/Employee');
exports.getEmployees = async (req, res) => {
  try {
    const { department, search } = req.query;
    let query = {};

    if (department) {
      query.department = department;
    }
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } }, 
        { skills: { $regex: search, $options: 'i' } },
        { designation: { $regex: search, $options: 'i' } }
      ];
    }

    const employees = await Employee.find(query);
    res.json(employees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getStats = async (req, res) => {
  try {
    const totalEmployees = await Employee.countDocuments();
    const activeCount = await Employee.countDocuments({ isActive: true });
    const aggStats = await Employee.aggregate([
      { $group: { 
          _id: null, 
          avgSalary: { $avg: "$salary" }, 
          avgRating: { $avg: "$performanceRating" },
          totalProjects: { $sum: "$projectsCompleted" },
          totalSalary: { $sum: "$salary" } 
      }}
    ]);

    const stats = aggStats[0] || { avgSalary: 0, avgRating: 0, totalProjects: 0, totalSalary: 0 };

    
    const deptDist = await Employee.aggregate([
      { $group: { _id: "$department", count: { $sum: 1 } } }
    ]);

    const monthlySalary = Math.round(stats.totalSalary / 12); 
    const salaryTrend = [
      { name: 'Jan', amt: Math.round(monthlySalary * 0.9) }, 
      { name: 'Feb', amt: Math.round(monthlySalary * 0.92) },
      { name: 'Mar', amt: Math.round(monthlySalary * 0.95) },
      { name: 'Apr', amt: Math.round(monthlySalary * 0.98) },
      { name: 'May', amt: Math.round(monthlySalary * 0.96) },
      { name: 'Jun', amt: monthlySalary } 
    ];

    const recentJoiners = await Employee.find()
      .sort({ createdAt: -1 }) 
      .limit(3)
      .select('name designation createdAt');

    res.json({
      totalEmployees,
      activeCount,
      inactiveCount: totalEmployees - activeCount,
      avgSalary: Math.round(stats.avgSalary || 0),
      avgRating: stats.avgRating?.toFixed(1) || 0,
      totalProjects: stats.totalProjects, 
      deptDist,
      salaryTrend,
      recentActivity: recentJoiners 
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// AI Recommendation Engine 
exports.getRecommendations = async (req, res) => {
  try {
    const employees = await Employee.find({ isActive: true }); 
    const scoredEmployees = employees.map(emp => {
      const score = (emp.performanceRating * 10) + 
                    (emp.projectsCompleted * 2) + 
                    (emp.yearsAtCompany * 1.5);
      
      return { ...emp._doc, score }; 
    });

    const promotion = scoredEmployees
      .filter(e => e.score > 80 && e.performanceRating >= 4.5)
      .sort((a, b) => b.score - a.score); 

    
    const training = scoredEmployees
      .filter(e => e.performanceRating < 4.0)
      .sort((a, b) => a.performanceRating - b.performanceRating);

    const leadership = scoredEmployees
      .filter(e => e.yearsAtCompany >= 5 && e.performanceRating > 4.2);

    res.json({ promotion, training, leadership });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};