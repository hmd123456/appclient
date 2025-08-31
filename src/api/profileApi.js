export async function getProfile(email) {
  const res = await fetch(`http://localhost:5000/api/profile?email=${encodeURIComponent(email)}`);
  if (!res.ok) return {};
  return res.json();
}

export async function savePersonalInfo(email, data) {
  await fetch('http://localhost:5000/api/profile/personal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, ...data }),
  });
}

export async function saveEducation(email, data) {
  await fetch('http://localhost:5000/api/profile/education', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, ...data }),
  });
}

export async function uploadFiles(email, files) {
  const formData = new FormData();
  formData.append('email', email);
  Object.entries(files).forEach(([key, file]) => {
    formData.append(key, file);
  });
  await fetch('http://localhost:5000/api/profile/files', {
    method: 'POST',
    body: formData,
  });
}