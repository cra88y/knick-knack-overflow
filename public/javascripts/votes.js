// let upVotes = document.querySelectorAll(".upVote")

document.querySelectorAll(".upVote").forEach(upVote => {
  addEventListener("click", async (e) => {
    e.preventDefault();
    e.stopPropagation();
    // console.log(e.target)
    let answerId = e.target.id.slice(7)
    console.log(answerId)
    const body = { answerId }

    const res = await fetch(`http://localhost:8080/api/answers/${answerId}/votes`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      }
    });
    // console.log(res.body)
  })
  // window.location.href = "/"
})






//   addEventListener("click", async (e) => {

//   //- const Answer = 
//   console.log(e.target)


//     // const res = await fetch("http://localhost:8080/users", {
//     //   method: "POST",
//     //   body: JSON.stringify(body),
//     //   headers: {
//     //     "Content-Type": "application/json",
//     //   },
//     // });

// });
