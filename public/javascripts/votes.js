window.addEventListener("DOMContentLoaded", (event) => {
  const upvotes = document.querySelectorAll(".upVote");
  console.log(upvotes);
  upvotes.forEach((upVote) => {
    hookupVote(upVote);
  });
});

async function hookupVote(upVote) {
  upVote.addEventListener("click", async (e) => {
    e.stopPropagation();
    const answerId = upVote.dataset.answerid;
    const body = { answerId };
    const res = await fetch(
      `http://localhost:8080/api/answers/${answerId}/votes`,
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  });
}

