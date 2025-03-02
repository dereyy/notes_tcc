import { useState, useEffect } from "react";
import axios from "axios";  // Tambah axios untuk komunikasi ke backend
import NotesList from "./components/NotesList";

const App = () => {
  const [notes, setNotes] = useState([]);

  // Ambil data notes dari backend
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await axios.get("http://localhost:5000/notes");
        setNotes(response.data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
      }
    };
    fetchNotes();
  }, []);

  const addNote = async (noteData) => {
    try {
      await axios.post("http://localhost:5000/tambah-note", {
        judul: noteData.judul,
        isi: noteData.isi,
        tanggal: new Date().toISOString().split('T')[0]  // Hanya tanggal (tanpa jam)  // Tambah tanggal
      });
      window.location.reload();  // 👈 Refresh otomatis setelah menambah note
    } catch (error) {
      console.error("Gagal menambah note:", error);
    }
  };
  

  // Hapus note dari backend
  const deleteNote = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/hapus-note/${id}`);
      setNotes(notes.filter((note) => note.id !== id));
    } catch (error) {
      console.error("Gagal menghapus note:", error);
    }
  };

  // Edit note di backend
  const editNote = async (id, judulBaru, isiBaru) => {
    try {
      await axios.put(`http://localhost:5000/edit-note/${id}`, {
        judul: judulBaru,
        isi: isiBaru,
      });
      const updatedNotes = notes.map((note) =>
        note.id === id ? { ...note, judul: judulBaru, isi: isiBaru } : note
      );
      setNotes(updatedNotes);
    } catch (error) {
      console.error("Gagal mengedit note:", error);
    }
  };


  return (
    <div className="container">
      <h1>Notes</h1>
      {notes && notes.length > 0 ? (
        <NotesList
          notes={notes}
          handleAddNote={addNote}
          handleDeleteNote={deleteNote}
          handleEditNote={editNote}
        />
      ) : (
        <p>Tidak ada catatan.</p>
      )}
    </div>
  );
  
};

export default App;
