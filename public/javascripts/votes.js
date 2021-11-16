// let upVotes = document.querySelectorAll(".upVote")

document.querySelectorAll(".upVote").forEach(upVote => {
  addEventListener("click", async (e) => {
    // console.log(e.target)

    const res = await fetch("http://localhost:8080/users", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });
  })
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
