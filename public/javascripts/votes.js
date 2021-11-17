window.addEventListener("DOMContentLoaded", (event) => {
  const upvotes = document.querySelectorAll(".upVote");
  upvotes.forEach((upVote) => {
    hookupVote(upVote);
  });

  const downvotes = document.querySelectorAll(".downVote");
  downvotes.forEach((downVote) => {
    hookdownVote(downVote);
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

async function hookdownVote(downVote) {
  downVote.addEventListener("click", async (e) => {
    e.stopPropagation();
    // console.log('DOWN')
    const answerId = downVote.dataset.answerid;
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
