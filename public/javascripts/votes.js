window.addEventListener("DOMContentLoaded", (event) => {
  const upvotes = document.querySelectorAll(".upVote");
  upvotes.forEach((upVote) => {
    hookupVote(upVote);
  });


  const downvotes = document.querySelectorAll(".downVote");
  downvotes.forEach((downVote) => {
    hookdownVote(downVote);
  });
  let answerVotes;

  async function hookVotes() {
    const res = await fetch(`${document.location.href}/votes`)
      .then((res) => res.json())
      .then((data) => {
        answerVotes = data.answerVotes;
        userVotes = data.userVotes;
      });
    console.log(`${document.location.href}/votes`);


    for (let key in answerVotes) {
      document.getElementById(`voteCount-${key}`).innerText =
        answerVotes[key] || "0";
    }
    for (let ans in userVotes) {
      if (userVotes[ans] == true) {
        document.getElementById(`upVote-${ans}`).classList.toggle("voted");
      }
      if (userVotes[ans] == false) {
        document.getElementById(`downVote-${ans}`).classList.toggle("voted");
      }
    }

    for (let ans in userVotes) {
      if (userVotes[ans] == true) {
        document.getElementById(`upVote-${ans}`).classList.toggle("voted")
      }
      if (userVotes[ans] == false) {
        document.getElementById(`downVote-${ans}`).classList.toggle("voted")
      }
    }
  }
  hookVotes();
});

async function hookupVote(upVote) {
  upVote.addEventListener("click", async (e) => {
    let count;
    let voteType;
    e.stopPropagation();
    const answerId = upVote.dataset.answerid;
    const downVoteId = `downVote-${answerId}`;
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
    )
      .then((res) => res.json())
      .then((data) => {
        voteType = data.voteType;
        count = data.count;
      });
    console.log(voteType);
    console.log(count);
    const downVoteEl = document.getElementById(downVoteId);
    let voteCountId = `voteCount-${upVote.dataset.answerid}`;
    let countElem = document.getElementById(voteCountId);
    let num = Number(countElem.innerText);
    if (voteType == null) {
      e.target.classList.toggle("voted", false);
      downVoteEl.classList.toggle("voted", false);
    } else {
      e.target.classList.toggle("voted", voteType);
      downVoteEl.classList.toggle("voted", !voteType);
    }
    countElem.innerText = count;
  });
}

async function hookdownVote(downVote) {
  downVote.addEventListener("click", async (e) => {
    let count;
    let voteType;
    e.stopPropagation();
    const answerId = downVote.dataset.answerid;
    const upVoteId = `upVote-${answerId}`;
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
    )
      .then((res) => res.json())
      .then((data) => {
        voteType = data.voteType;
        count = data.count;
      });
    const upVoteEl = document.getElementById(upVoteId);
    let voteCountId = `voteCount-${downVote.dataset.answerid}`;
    let countElem = document.getElementById(voteCountId);
    let num = Number(countElem.innerText);
    if (voteType == null) {
      e.target.classList.toggle("voted", false);
      upVoteEl.classList.toggle("voted", false);
    } else {
      e.target.classList.toggle("voted", !voteType);
      upVoteEl.classList.toggle("voted", voteType);
    }
    countElem.innerText = count;
  });
}
