
window.addEventListener("DOMContentLoaded", (event) => {
  const upvotes = document.querySelectorAll(".upVote");
  upvotes.forEach((upVote) => {
    hookVoteUpOrDown(upVote, true);
  });

  const downvotes = document.querySelectorAll(".downVote");
  downvotes.forEach((downVote) => {
    hookVoteUpOrDown(downVote, false);
  });
  let answerVotes;

  async function hookVotes() {
    
    const res = await fetch(`${document.location.href}/votes`)
      .then((res) => res.json())
      .then((data) => {
        answerVotes = data.answerVotes;
        userVotes = data.userVotes;
        voteHiLows = data.voteHiLows
      });
    console.log('voteHiLows', voteHiLows)
    for (let ans in voteHiLows) {
      let voteCountId = `voteCount-${ans}`
      let count = voteHiLows[ans]

      console.log('votecountid', voteCountId)
      hiOrLowVote(voteCountId, count)
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
  if (document.location.href.includes("questions")) {
    hookVotes();
  }
});



async function hookVoteUpOrDown(vote, isUp) {
  vote.addEventListener("click", async (e) => {
    let count;
    let voteType;
    e.stopPropagation();
    const answerId = vote.dataset.answerid;

    const twinId = isUp ? `downVote-${answerId}` : `upVote-${answerId}`
    const route = isUp ? "up" : "down"


    const body = { answerId };
    const res = await fetch(
      `http://localhost:8080/api/answers/${answerId}/${route}Votes`,
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
        if (data.loggedOut) {
          loggedOut = true
        } else {
          loggedOut = false
        }
      });
    if (loggedOut) {
      window.location.href = "/users/login";
      return
    }
    const toggle = isUp ? voteType : !voteType;
    const toggleTwin = isUp ? !voteType : voteType;
    const twinEl = document.getElementById(twinId);
    let voteCountId = `voteCount-${vote.dataset.answerid}`;
    let countElem = document.getElementById(voteCountId);
    if (voteType == null) {
      e.target.classList.toggle("voted", false);
      twinEl.classList.toggle("voted", false);
    } else {
      e.target.classList.toggle("voted", toggle);
      twinEl.classList.toggle("voted", toggleTwin);
    }

    countElem.innerText = count;

    hiOrLowVote(voteCountId, count)
  });
}

function hiOrLowVote(voteCountId, count) {
  let countElem = document.getElementById(voteCountId);

  if (count < 0) {
    countElem.classList.toggle("lowVote", true);
    countElem.classList.toggle("hiVote", false);
    countElem.classList.toggle("mehVote", false);

  }
  else if (count > 0) {
    countElem.classList.toggle("hiVote", true);
    countElem.classList.toggle("lowVote", false);
    countElem.classList.toggle("mehVote", false);

  } else {
    countElem.classList.toggle("hiVote", true);
    countElem.classList.toggle("lowVote", false);
    countElem.classList.toggle("mehVote", true);

  }

}
