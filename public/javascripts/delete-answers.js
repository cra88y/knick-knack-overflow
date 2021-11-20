window.addEventListener("DOMContentLoaded", (event) => {
  const deleteBtns = document.querySelectorAll(".delete-ans");
  deleteBtns.forEach((el) => {
    el.addEventListener("click", async (e) => {
      // e.preventDefault();
      e.stopPropagation();
      const answerId = el.dataset.answerid;
      let response;
      const res = await fetch(
        `http://localhost:8080/api/answers/${answerId}/delete`,
        { method: "DELETE" }
      )
        .then((res) => res.json())
        .then((data) => {
          response = data.msg;
        });
      if (response == "success") {
        const parent = document.querySelectorAll(`.answer-${answerId}`)[0];
        parent.remove();
      }
    });
  });
});
