console.log("Hello World")
const btn = document.querySelector("#start-btn");
const text = document.querySelector("#test");

btn.addEventListener("click", () => {
  text.textContent = "You clicked the button!";
});

