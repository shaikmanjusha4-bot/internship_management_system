// Quick automated backend test script
const testAPI = async () => {
  const BASE_URL = 'http://localhost:5000/api';
  console.log('--- Starting Backend API Test Suite ---');

  // 1. Health check
  const healthRes = await fetch(`${BASE_URL}/health`);
  const healthData = await healthRes.json();
  console.log('1. Health check:', healthData.status === 'OK' ? 'PASS' : 'FAIL');

  // 2. Student Login
  const studentLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'student@ims.com', password: 'student123' }),
  });
  const studentData = await studentLoginRes.json();
  console.log('2. Student Login:', studentData.success ? 'PASS' : 'FAIL');
  const studentToken = studentData.token;

  // 3. Admin Login
  const adminLoginRes = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@ims.com', password: 'admin123' }),
  });
  const adminData = await adminLoginRes.json();
  console.log('3. Admin Login:', adminData.success ? 'PASS' : 'FAIL');
  const adminToken = adminData.token;

  // 4. Student Profile
  const profileRes = await fetch(`${BASE_URL}/users/profile`, {
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  const profileData = await profileRes.json();
  console.log('4. Get Profile:', profileData.user.skills.length > 0 ? 'PASS' : 'FAIL');

  // 5. Recommended Internships
  const recRes = await fetch(`${BASE_URL}/internships/recommended`, {
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  const recData = await recRes.json();
  console.log('5. Recommended Internships:', recData.recommendations.length > 0 ? 'PASS' : 'FAIL');
  if (recData.recommendations.length > 0) {
    const top = recData.recommendations[0];
    console.log(`   Top match: "${top.title}" (${top.skillMatch.matchPercentage}% match)`);
    console.log(`   Matched: [${top.skillMatch.matchedSkills.join(', ')}]`);
    console.log(`   Missing: [${top.skillMatch.missingSkills.join(', ')}]`);
  }

  // 6. Admin Stats
  const statsRes = await fetch(`${BASE_URL}/applications/stats`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const statsData = await statsRes.json();
  console.log('6. Admin Stats:', statsData.success ? 'PASS' : 'FAIL', JSON.stringify(statsData.stats));

  // 7. Student My Applications
  const myAppsRes = await fetch(`${BASE_URL}/applications/my`, {
    headers: { Authorization: `Bearer ${studentToken}` },
  });
  const myAppsData = await myAppsRes.json();
  console.log('7. Student My Applications:', myAppsData.applications.length > 0 ? 'PASS' : 'FAIL');

  console.log('--- All Initial API Checks Completed Successfully! ---');
};

testAPI().catch((err) => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
