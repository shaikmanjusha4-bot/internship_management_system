const User = require('../models/User');
const Internship = require('../models/Internship');
const Application = require('../models/Application');

const sampleInternships = [
  {
    title: 'Full Stack Web Developer Intern',
    company: 'TechCorp Solutions',
    description:
      'We are looking for an enthusiastic Full Stack Developer Intern to work with our product engineering team. You will build and optimize user-facing features, develop resilient REST APIs, and integrate database services.',
    location: 'Bangalore (Hybrid)',
    duration: '6 Months',
    stipend: '₹25,000 / month',
    requiredSkills: ['React', 'Node.js', 'MongoDB', 'JavaScript', 'Express'],
    eligibility: 'B.Tech / B.E / MCA / BCA students or recent graduates (2025/2026/2027 batches)',
    applicationDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Python & Data Engineering Intern',
    company: 'DataPulse Analytics',
    description:
      'Join our data science team to extract, clean, and process large datasets. You will write automated Python scripts, build SQL pipelines, and generate actionable business intelligence dashboards.',
    location: 'Remote',
    duration: '3 Months',
    stipend: '₹20,000 / month',
    requiredSkills: ['Python', 'SQL', 'Pandas', 'PostgreSQL'],
    eligibility: 'Passionate students with strong analytical and problem-solving skills',
    applicationDeadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Frontend React Developer Intern',
    company: 'PixelCraft Studios',
    description:
      'Passionate about crafting pixel-perfect, accessible, and high-performance user interfaces? Work directly with senior UI/UX engineers creating sleek modern web apps.',
    location: 'Mumbai',
    duration: '4 Months',
    stipend: '₹18,000 / month',
    requiredSkills: ['React', 'JavaScript', 'Tailwind CSS', 'HTML', 'CSS'],
    eligibility: 'Proficient in modern JavaScript (ES6+) and component-based UI design',
    applicationDeadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Backend Cloud Services Intern',
    company: 'CloudScale Technologies',
    description:
      'Learn cloud-native distributed backend development. You will build microservices, manage MongoDB clusters, implement authentication gateways, and write test suites.',
    location: 'Hyderabad',
    duration: '6 Months',
    stipend: '₹30,000 / month',
    requiredSkills: ['Node.js', 'Express', 'MongoDB', 'Docker', 'AWS'],
    eligibility: 'Computer Science or IT students with foundational backend knowledge',
    applicationDeadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'AI / Machine Learning Research Intern',
    company: 'NeuroSphere AI',
    description:
      'Contribute to our generative AI and NLP pipelines. You will evaluate open-source language models, build fine-tuning workflows, and integrate AI APIs into production systems.',
    location: 'Remote',
    duration: '6 Months',
    stipend: '₹35,000 / month',
    requiredSkills: ['Python', 'PyTorch', 'TensorFlow', 'SQL', 'NLP'],
    eligibility: 'Strong mathematical foundation and proficiency in Python and ML libraries',
    applicationDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
  },
  {
    title: 'Mobile App Developer (React Native) Intern',
    company: 'AppVibe Labs',
    description:
      'Develop cross-platform iOS and Android applications. Integrate mobile hardware APIs, state management, and push notification services.',
    location: 'Pune',
    duration: '3 Months',
    stipend: '₹22,000 / month',
    requiredSkills: ['React Native', 'JavaScript', 'Redux', 'REST APIs'],
    eligibility: 'Hands-on experience with mobile UI components and React principles',
    applicationDeadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
  },
];

const seedDatabase = async (force = false) => {
  const userCount = await User.countDocuments();
  const internshipCount = await Internship.countDocuments();

  if (!force && userCount > 0 && internshipCount > 0) {
    return { seeded: false, message: 'Database already has data. Skipping seed.' };
  }

  if (force) {
    await User.deleteMany({});
    await Internship.deleteMany({});
    await Application.deleteMany({});
  }

  // 1. Create default admin if missing
  let admin = await User.findOne({ email: 'admin@ims.com' });
  if (!admin) {
    admin = await User.create({
      name: 'System Admin',
      email: 'admin@ims.com',
      password: 'admin123',
      role: 'admin',
      college: 'Admin Department',
      degree: 'Administration',
      graduationYear: 2024,
      skills: ['Management', 'Coordination', 'Review'],
    });
  }

  // 2. Create default student if missing
  let student = await User.findOne({ email: 'student@ims.com' });
  if (!student) {
    student = await User.create({
      name: 'Alex Johnson',
      email: 'student@ims.com',
      password: 'student123',
      role: 'student',
      college: 'National Institute of Technology',
      degree: 'B.Tech Computer Science',
      graduationYear: 2026,
      skills: ['Python', 'SQL', 'React', 'JavaScript', 'HTML', 'CSS'],
    });
  }

  // 3. Seed internships if none exist
  let createdInternships = [];
  if (internshipCount === 0 || force) {
    createdInternships = await Internship.insertMany(sampleInternships);
  } else {
    createdInternships = await Internship.find();
  }

  // 4. Seed sample applications if student and internships exist and apps are empty
  const appCount = await Application.countDocuments();
  if ((appCount === 0 || force) && student && createdInternships.length >= 2) {
    await Application.create({
      student: student._id,
      internship: createdInternships[0]._id,
      status: 'Under Review',
      appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    });

    await Application.create({
      student: student._id,
      internship: createdInternships[2]._id,
      status: 'Shortlisted',
      appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    });
  }

  return {
    seeded: true,
    message: 'Sample data successfully seeded (Admin, Student, Internships, Applications).',
  };
};

module.exports = { seedDatabase };
