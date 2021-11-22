
window.addEventListener("DOMContentLoaded", (event) => {
  const upvotes = document.querySelectorAll(".upVote");
  upvotes.forEach((upVote) => {
    hookVoteUpOrDown(upVote, true);
  });

  const downvotes = document.querySelectorAll(".downVote");
  downvotes.forEach((downVote) => {
    hookVoteUpOrDown(downVote, false);
  });
  let questionVotes;

  async function hookVotes() {
    try {
      const res = await fetch(`/qVote/q`)
        .then((res) => res.json())
        .then((data) => {
          userVotes = data.userVotes;
          voteHiLows = data.voteHiLows
        });
      for (let q in voteHiLows) {
        let voteCountId = `voteCount-${q}`
        let count = voteHiLows[q]

        hiOrLowVote(voteCountId, count)
      }

      for (let q in userVotes) {
        if (userVotes[q] == true) {
          const $upVote = document.getElementById(`upVote-${q}`);

          if ($upVote) {
            $upVote.classList.toggle("voted")
          }

        }
        if (userVotes[q] == false) {
          const $downVote = document.getElementById(`downVote-${q}`)

          if ($downVote) {
            $downVote.classList.toggle("voted")
          }
        }
      }
      hookVotes();
    } catch (err) {
      console.log('No votes on this page...');
    }
    }
});



async function hookVoteUpOrDown(vote, isUp) {
  vote.addEventListener("click", async (e) => {
    let count;
    let voteType;
    e.stopPropagation();
    const questionId = vote.dataset.questionid;
    const twinId = isUp ? `downVote-${questionId}` : `upVote-${questionId}`
    const route = isUp ? "up" : "down"

    const body = { questionId };
    const res = await fetch(
      `/questions/${questionId}/${route}Votes`,
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
    let voteCountId = `voteCount-${vote.dataset.questionid}`;
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

  if (!countElem) return;

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
