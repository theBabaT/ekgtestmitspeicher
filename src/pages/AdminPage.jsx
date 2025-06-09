import React, { useState, useContext } from 'react';
import { QuestionContext } from '../context/QuestionContext.jsx';
import { supabase } from '../supabaseClient';

const AdminPage = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const { sets, addSet } = useContext(QuestionContext);
  const [selectedSet, setSelectedSet] = useState('');
  const [question, setQuestion] = useState({
    image: '',
    text: '',
    choices: ['', '', '', '', ''],
    correct: 0,
    explanation: ''
  });

  const uploadImage = async (file) => {
    const fileName = `${Date.now()}.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from('ekg-bilder').upload(fileName, file);
    if (error) {
      alert('Upload-Fehler');
      return null;
    }
    const { data } = supabase.storage.from('ekg-bilder').getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = await uploadImage(file);
      if (url) setQuestion({ ...question, image: url });
    }
  };

  const handleAddQuestion = async () => {
    if (!selectedSet) return alert('Bitte ein Set auswählen!');
    const { error } = await supabase.from('questions').insert([{
      set: selectedSet,
      text: question.text,
      image_url: question.image,
      choices: question.choices,
      correct: question.correct,
      explanation: question.explanation
    }]);
    if (error) return alert('Fehler beim Speichern: ' + error.message);
    alert('Frage gespeichert!');
    setQuestion({
      image: '',
      text: '',
      choices: ['', '', '', '', ''],
      correct: 0,
      explanation: ''
    });
  };

  if (!loggedIn) {
    return (
      <div>
        <h2>Admin Login</h2>
        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={() => setLoggedIn(password === 'admin123')}>
          Login
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2>Adminbereich</h2>

      {/* Neues Set anlegen */}
      <input
        type="text"
        placeholder="Neues Set"
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            addSet(e.target.value);
            setSelectedSet(e.target.value);
            e.target.value = '';
          }
        }}
      />

      {/* Alle Sets anzeigen */}
      <ul>
        {sets.map((set, i) => (
          <li key={i}>
            <button onClick={() => setSelectedSet(set)}>
              {set} {selectedSet === set ? '✅' : ''}
            </button>
          </li>
        ))}
      </ul>

      <h3>Neue Frage: {selectedSet}</h3>
      <input type="file" onChange={handleImageUpload} />
      <input
        type="text"
        placeholder="Fragetext"
        value={question.text}
        onChange={(e) => setQuestion({ ...question, text: e.target.value })}
      />
      {question.choices.map((c, i) => (
        <input
          key={i}
          type="text"
          placeholder={`Antwort ${i + 1}`}
          value={c}
          onChange={(e) => {
            const choices = [...question.choices];
            choices[i] = e.target.value;
            setQuestion({ ...question, choices });
          }}
        />
      ))}
      <input
        type="number"
        min="0"
        max="4"
        value={question.correct}
        onChange={(e) => setQuestion({ ...question, correct: Number(e.target.value) })}
      />
      <textarea
        placeholder="Erklärung"
        value={question.explanation}
        onChange={(e) => setQuestion({ ...question, explanation: e.target.value })}
      ></textarea>
      <button onClick={handleAddQuestion}>Frage speichern</button>
    </div>
  );
};

export default AdminPage;
