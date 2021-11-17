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
      `http://localhost:8080/api/answers/${answerId}/upVotes`,
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then(res => res.json()).then(data => console.log(data));
  });
}

async function hookdownVote(downVote) {
  downVote.addEventListener("click", async (e) => {
    let count;
    let voteType;
    e.stopPropagation();
    // console.log('DOWN')
    const answerId = downVote.dataset.answerid;
    const body = { answerId };
    const res = await fetch(
      `http://localhost:8080/api/answers/${answerId}/downVotes`,
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then(res => res.json()).then(data => {
       voteType = data.voteType;
       count = data.count;
    });
    console.log('SECOND DATA', e.target)
    if (voteType === false) {
      e.target.classList.add("voted")

    } else {
      e.target.classList.remove("voted")
    }
  });
}
