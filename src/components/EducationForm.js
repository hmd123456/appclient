import React, { useState } from 'react';

function EducationForm({ initialData, onNext, onBack, user }) {
  const [form, setForm] = useState({
    degree: '',
    university: '',
    year: '',
    ...initialData
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    onNext(form);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Educational Background</h3>
      <input name="degree" placeholder="Degree" value={form.degree} onChange={handleChange} required />
      <input name="university" placeholder="University" value={form.university} onChange={handleChange} required />
      <input name="year" placeholder="Year" value={form.year} onChange={handleChange} required />
      <button type="button" onClick={onBack}>Back</button>
      <button type="submit">Next</button>
    </form>
  );
}

export default EducationForm;