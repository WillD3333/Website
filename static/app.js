
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const btn = document.querySelector("#start-btn");
const ul = document.getElementById("resol");

async function loadResolutions() {
    const res = await fetch("/api/resolutions");
    const data = await res.json();
    ul.innerHTML = "";

    data.forEach(item => {
        const li = document.createElement("li");
        li.classList.add("resolution-item");
        li.dataset.id = item.id;

        createResolutionView(li, item.text);
        ul.appendChild(li);
    });
}

function createResolutionView(li, text) {
    li.innerHTML = "";

    const p = document.createElement("p");
    p.textContent = text;

    const actions = document.createElement("div");
    actions.classList.add("actions");

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

    editBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        editResolution(li, p.textContent);
    });

    deleteBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        const res = await fetch(`/api/resolutions/${li.dataset.id}`, { method: "DELETE" });
        if (res.ok) {
            li.remove();
        }
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

    input.addEventListener("keydown", async (e) => {
        if (e.key === "Enter" && input.value.trim() !== "") {
            const res = await fetch(`/api/resolutions/${li.dataset.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: input.value })
            });
            if (res.ok) {
                createResolutionView(li, input.value);
            }
        }
    });

    li.appendChild(input);
    input.focus();
}

btn.addEventListener("click", async () => {
    const li = document.createElement("li");
    li.classList.add("resolution-item");

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Type your resolution...";
    input.classList.add("resolution-input");

    input.addEventListener("keydown", async (e) => {
        if (e.key === "Enter" && input.value.trim() !== "") {
            const res = await fetch("/api/resolutions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: input.value })
            });
            if (res.ok) {
                loadResolutions();
            }
        }
    });

    li.appendChild(input);
    ul.appendChild(li);
    input.focus();
});

loadResolutions();
