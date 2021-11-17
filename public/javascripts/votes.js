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
    let count;
    let voteType;
    e.stopPropagation();
    const answerId = upVote.dataset.answerid;
    const downVoteId = `downVote-${answerId}`
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
    ).then(res => res.json()).then(data => {
      voteType = data.voteType;
      count = data.count;
    });

    e.target.classList.toggle("voted")
    if (document.getElementById(downVoteId).classList.contains("voted")) {
      document.getElementById(downVoteId).classList.remove("voted")
    }

    // e.target.classList.remove("voted")

  });
}

async function hookdownVote(downVote) {
  downVote.addEventListener("click", async (e) => {
    let count;
    let voteType;
    e.stopPropagation();
    const answerId = downVote.dataset.answerid;
    const upVoteId = `upVote-${answerId}`
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

    e.target.classList.toggle("voted");
    if (document.getElementById(upVoteId).classList.contains("voted")) {

      document.getElementById(upVoteId).classList.remove("voted")
    };

    // e.target.classList.remove("voted")

  });
}
