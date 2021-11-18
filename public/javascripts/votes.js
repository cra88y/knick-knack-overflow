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

    const res = await fetch(`http://localhost:8080/questions/2/votes`).then(res => res.json()).then(data => {
      answerVotes = data.answerVotes;
    });
    console.log(answerVotes)

    for (let key in answerVotes) {
      document.getElementById(`voteCount-${key}`).innerText = answerVotes[key]
      // console.log(answerVotes[key])
    }
  }
  hookVotes()


  // console.log(window.location.href.url)
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


    let voteCountId = `voteCount-${upVote.dataset.answerid}`
    el = document.getElementById(voteCountId).innerText
    let innerHTML = document.getElementById(voteCountId).innerHTML;
    let num = parseInt(innerHTML, 10)

    e.target.classList.toggle("voted")
    if (document.getElementById(downVoteId).classList.contains("voted")) {
      document.getElementById(downVoteId).classList.remove("voted")
    } else {
      // get current value of voteCount and add one to it
      // document.getElementById(voteCountId).innerText =  parseInt(document.getElementById(voteCountId).innerHTML, 10) + 1
      // console.log('VALUE', parseInt(document.getElementById(voteCountId).innerHTML, 10))
      // console.log('EL', document.getElementById(voteCountId))
      
      document.getElementById(voteCountId).innerText = num - 1

    }

    if (document.getElementById(e.target.id).classList.contains("voted")) {
      
      document.getElementById(voteCountId).innerText = num + 1
    }


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

    let voteCountId = `voteCount-${downVote.dataset.answerid}`
    el = document.getElementById(voteCountId).innerText
    let innerHTML = document.getElementById(voteCountId).innerHTML;
    let num = parseInt(innerHTML, 10)

    e.target.classList.toggle("voted");
    if (document.getElementById(upVoteId).classList.contains("voted")) {

      document.getElementById(upVoteId).classList.remove("voted")
    } else {
      document.getElementById(voteCountId).innerText = num + 1

    }

    if (document.getElementById(e.target.id).classList.contains("voted")) {
      
      document.getElementById(voteCountId).innerText = num - 1
    }

    // e.target.classList.remove("voted")

  });
}
