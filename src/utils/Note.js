import axios from "axios";
import Swal from "sweetalert2";

export async function getNotes({ token, userInfo, updater }) {
  const userDetails = {
    token,
    userID: userInfo._id,
  };

  let { data } = await axios.post(
    "https://movies-api.routemisr.com/getUserNotes",
    userDetails
  );

  console.log("%c### Your Notes 👇", "background-color: #e2a937; color: #fff");
  console.log(data.Notes);
  if (data.message === "success") {
    updater(data.Notes);
  } else if (data.message === "no notes found") {
    updater([]);
  }
}

export async function addNote({ token, userInfo, updater, noteContent }) {
  let { data } = await axios.post("https://movies-api.routemisr.com/addNote", {
    token,
    citizenID: userInfo._id,
    ...noteContent,
  });

  if (data.message == "success") {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Note added successfully",
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      getNotes({ token, userInfo, updater });
    });
  }
}

export async function deleteNote({ token, userInfo, NoteID, updater }) {
  const deletedNoteInfo = {
    NoteID,
    token,
  };

  let { data } = await axios.delete(
    "https://movies-api.routemisr.com/deleteNote",
    { data: deletedNoteInfo }
  );

  if (data.message == "deleted") {
    console.log("success");
    getNotes({ token, userInfo, updater });
  }
}

export async function updateNote({
  token,
  userInfo,
  NoteID,
  title,
  description,
  updater,
  helpers,
}) {
  const updatedDetails = {
    title,
    desc: description,
    token,
    NoteID,
  };
  let { data } = await axios.put(
    "https://movies-api.routemisr.com/updateNote",
    updatedDetails
  );

  console.log(data);

  if (data.message == "updated") {
    console.log("UPDATED DONE ✅");
    getNotes({ token, userInfo, updater });
    helpers.setNoteStatus(() => checkDescriptionLength(updatedDetails.desc));
    helpers.setReadMoreBtn(() => checkDescriptionLength(updatedDetails.desc));
  }
}

export async function showAddForm({ token, userInfo, updater }) {
  Swal.fire({
    title: "اكتب نوت جديدة 📝",
    html: `
            <label for="title" dir="rtl"  class="form-label">العنوان</label>
            <input type="text" id="title" placeholder="العنوان" dir="rtl"  class="note-title swal2-input m-0 w-100 d-block"/>
            <label for="description" dir="rtl"  class="form-label">الوصف</label>
            <textarea type="text" id="description" placeholder="الوصف" dir="rtl" class="swal2-textarea m-0 w-100 d-block"></textarea>
    `,
    showCancelButton: true,
    confirmButtonText: "ضيف النوت",
    showLoaderOnConfirm: true,
    preConfirm: () => {
      const title = document.getElementById("title");
      const description = document.getElementById("description");
      return { title: title.value, desc: description.value };
    },
    allowOutsideClick: () => !Swal.isLoading(),
  }).then((result) => {
    if (result.isConfirmed) {
      const { title, desc } = result.value;
      addNote({ token, userInfo, updater, noteContent: { title, desc } });
    }
  });
}

export function showDeleteAlert({ token, userInfo, NoteID, updater }) {
  Swal.fire({
    title: "متأكد؟ .. عايز تمسح النوت",
    text: "مش هتقدر ترجّع النوت دي تاني",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#913bd3",
    cancelButtonColor: "#d33",
    confirmButtonText: "متأكد ، امسح النوت",
  }).then((result) => {
    if (result.isConfirmed) {
      deleteNote({ token, userInfo, NoteID, updater });
      Swal.fire("اتمسحت", "تم حذف النوت بنجاح", "success");
    }
  });
}

export function showUpdateForm({
  token,
  userInfo,
  NoteID,
  PrevData,
  updater,
  helpers,
}) {
  Swal.fire({
    title: "Update Your Note 😁",
    html: `
            <label for="title" class="form-label">العنوان</label>
            <input type="text" id="title" dir="rtl"  value="${PrevData.title}" class="note-title swal2-input m-0 w-100 d-block"/>
            <label for="description" class="form-label">الوصف</label>
            <textarea type="text" id="description" dir="rtl"  class="swal2-textarea m-0 w-100 d-block">${PrevData.desc}</textarea>
    `,
    showCancelButton: true,
    confirmButtonText: "حدّث النوت",
    showLoaderOnConfirm: true,
    preConfirm: () => {
      const title = document.getElementById("title");
      const description = document.getElementById("description");
      return { title: title.value, description: description.value };
    },
    allowOutsideClick: () => !Swal.isLoading(),
  }).then((result) => {
    if (result.isConfirmed) {
      const { title, description } = result.value;

      updateNote({
        token,
        userInfo,
        NoteID,
        title,
        description,
        updater,
        helpers,
      });

      Swal.fire({
        position: "center",
        icon: "success",
        title: "تم تحديث النوت بنجاح",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  });
}

export function checkDescriptionLength(description) {
  return description.length > 150;
}
