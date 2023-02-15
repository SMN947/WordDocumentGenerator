import React from 'react';
import './style.css';
import WordDocumentGenerator from './WordDocumentGenerator';

export default function App() {
  return (
    <div>
      <h1>WordDocumentGenerator</h1>
      <p>
        add items to a table in an uploaded word and then download it again.
      </p>
      <hr />
      <WordDocumentGenerator />
    </div>
  );
}
