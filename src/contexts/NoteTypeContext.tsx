import React from 'react';

const NoteTypeContext = React.createContext({
    noteType: "",
    changeNoteType: "" as any
  });

export default NoteTypeContext;