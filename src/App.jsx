import { useState, useEffect } from "react";

export default function App() {
  const [wines, setWines] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("misvinos");
      if (saved) setWines(JSON.parse(saved));
    } catch (e) {
      console.error("Error leyendo localStorage", e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("misvinos", JSON.stringify(wines));
  }, [wines]);

  const resetForm = () => {
    setName("");
    setRating(0);
    setReview("");
    setPhoto(null);
    setEditingIndex(null);
  };

  const saveWine = () => {
    if (!name || rating === 0) return;
    const data = { name, rating, review, photo };

    if (editingIndex !== null) {
      const copy = [...wines];
      copy[editingIndex] = data;
      setWines(copy);
    } else {
      setWines([data, ...wines]);
    }
    resetForm();
  };

  const editWine = (i) => {
    const w = wines[i];
    setName(w.name);
    setRating(w.rating);
    setReview(w.review);
    setPhoto(w.photo);
    setEditingIndex(i);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteWine = (i) => {
    if (!window.confirm("¿Borrar este vino?")) return;
    setWines(wines.filter((_, index) => index !== i));
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result);
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: 16, fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>🍷 MisVinos</h1>

      <div style={{ background: "#fff", padding: 12, borderRadius: 12, marginBottom: 16 }}>
        <input
          placeholder="Nombre del vino"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 8 }}
        />

        <div style={{ textAlign: "center", marginBottom: 8 }}>
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              onClick={() => setRating(n)}
              style={{
                fontSize: 28,
                cursor: "pointer",
                color: n <= rating ? "gold" : "#ccc",
              }}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          placeholder="¿Qué te gustó o no te gustó?"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          style={{ width: "100%", padding: 10, marginBottom: 8 }}
        />

        <input type="file" accept="image/*" capture="environment" onChange={handlePhoto} />

        {photo && <img src={photo} style={{ width: "100%", marginTop: 8, borderRadius: 8 }} />}

        <button onClick={saveWine} style={{ width: "100%", marginTop: 8 }}>
          {editingIndex !== null ? "Guardar cambios" : "Guardar vino"}
        </button>

        {editingIndex !== null && (
          <button onClick={resetForm} style={{ width: "100%", marginTop: 4 }}>
            Cancelar
          </button>
        )}
      </div>

      {wines.map((w, i) => (
        <div key={i} style={{ background: "#fff", padding: 12, borderRadius: 12, marginBottom: 12 }}>
          {w.photo && <img src={w.photo} style={{ width: "100%", borderRadius: 8 }} />}
          <h3>{w.name}</h3>
          <div>
            {[...Array(w.rating)].map((_, x) => (
              <span key={x} style={{ color: "gold" }}>★</span>
            ))}
          </div>
          <p>{w.review}</p>
          <button onClick={() => editWine(i)}>Editar</button>
          <button onClick={() => deleteWine(i)} style={{ marginLeft: 8 }}>Borrar</button>
        </div>
      ))}
    </div>
  );
}
