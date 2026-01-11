const btn = document.querySelector("#start-btn");
const ul = document.getElementById("resol");

btn.addEventListener("click", () => {
  const li = document.createElement("li");
  li.classList.add("resolution-item");

  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Type your resolution...";
  input.classList.add("resolution-input");

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && input.value.trim() !== "") {
      createResolution(li, input.value);
    }
  });

  li.appendChild(input);
  ul.appendChild(li);
  input.focus();
});

function createResolution(li, text) {
  li.innerHTML = "";

  const p = document.createElement("p");
  p.textContent = text;

  const actions = document.createElement("div");
  actions.classList.add("actions");

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";

  editBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    editResolution(li, p.textContent);
  });

  deleteBtn.addEventListener("click", (e) => {
    e.stopPropagation();  
    li.remove();
  });

  actions.append(editBtn, deleteBtn);
  li.append(p, actions);

  li.addEventListener("click", () => {
    li.classList.toggle("active");
  });
}

function editResolution(li, oldText) {
  li.innerHTML = "";

  const input = document.createElement("input");
  input.type = "text";
  input.value = oldText;
  input.classList.add("resolution-input");

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && input.value.trim() !== "") {
      createResolution(li, input.value);
    }
  });

  li.appendChild(input);
  input.focus();
}
