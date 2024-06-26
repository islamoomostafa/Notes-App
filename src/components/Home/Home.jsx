import React, { useContext, useEffect } from "react";
import style from "./Home.module.css";
import Note from "../Note/Note.jsx";
import Loading from "../Loading/Loading.jsx";
import { getNotes, showAddForm } from "../../utils/Note.js";
import { NoteContext } from "../../Context/NoteContext.jsx";
import { UserContext } from "../../Context/UserContext.jsx";

export default function Home({}) {
  const { token, userInfo } = useContext(UserContext);
  const { notes, setNotes } = useContext(NoteContext);

  useEffect(() => {
    getNotes({ token, userInfo, updater: setNotes });
  }, []);

  return (
    <>
      <h2 className="font-Cairo h4 heading">
        <i className="bi bi-folder me-2"></i>نوتاتي
      </h2>
      {notes ? (
        notes.length ? (
          <div className={`${style.notes}`}>
            {notes.map((note) => (
              <Note key={note._id} noteInfo={note} />
            ))}
          </div>
        ) : (
          <div
            className={`${style.empty} d-flex flex-column justify-content-center align-items-center`}
          >
            <h2 className="h5 text-muted">
              <i className="bi bi-stickies ms-2"> </i>
              النوتات هتظهر هنا لما تضيف أي نوت{" "}
            </h2>
            <button
              className="btn btn-main fit-content text-capitalize my-3"
              onClick={() => {
                showAddForm({ token, userInfo, updater: setNotes });
              }}
            >
              <i className="fa-solid fa-plus me-2"></i>نوت جديدة
            </button>
          </div>
        )
      ) : (
        <Loading />
      )}
    </>
  );
}
