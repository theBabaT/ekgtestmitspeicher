import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

const DebugPage = () => {
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const loadQuestions = async () => {
      const { data, error } = await supabase.from('questions').select('*').order('created_at', { ascending: false });
      if (error) {
        console.error('Fehler beim Laden:', error.message);
      } else {
        setQuestions(data);
      }
    };

    loadQuestions();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>Alle gespeicherten Fragen</h2>
      {questions.length === 0 && <p>Keine Fragen gefunden.</p>}
      {questions.map((q, index) => (
        <div key={q.id || index} style={{ border: '1px solid #ccc', margin: '1em 0', padding: 10 }}>
          <strong>Set:</strong> {q.set} <br />
          <strong>Fragetext:</strong> {q.text} <br />
          <strong>Bild:</strong> <br />
          {q.image_url && <img src={q.image_url} alt="EKG" style={{ maxWidth: '300px' }} />} <br />
          <strong>Antworten:</strong>
          <ol>
            {q.choices?.map((c, i) => (
              <li key={i}>{c}</li>
            ))}
          </ol>
          <strong>Richtige Antwort:</strong> {q.correct} <br />
          <strong>Erklärung:</strong> {q.explanation}
        </div>
      ))}
    </div>
  );
};

export default DebugPage;
