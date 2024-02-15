const container = document.querySelector("#photo-container");
const historyBtn = document.querySelector(".history-btn");
const newRandomBtn = document.querySelector(".new-random");

const localStorageKey = "history";
const history = loadHistory();

const apiKey = process.env.API_KEY;

async function getImage() {
  try {
    const response = await fetch(
      `https://api.unsplash.com/photos/random?client_id=${apiKey}`
    );
    if (!response.ok) {
      throw new Error("Ошибка получения данных");
    }
    const data = await response.json();
    const id = data.id;
    const url = data.urls.small;
    const author = data.user.name;
    const likes = data.likes;
    let userLike = checkUserLike(id);

    container.insertAdjacentHTML(
      "afterbegin",
      `<div class='photo' data-id='${id}' data-like='${userLike}'>
            <img src="${url}" alt="${data.alt_description}">
            <svg class="like-btn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>
            <p class='likes'>${likes}</p>
            <p class='author'>Автор: ${author}</p>
        </div>`
    );

    addItemToHistory(id, url, author, userLike, likes);
  } catch (error) {
    console.log(error.message);
  }
}

newRandomBtn.addEventListener("click", () => {
  container.innerHTML = "";
  getImage();
});

container.addEventListener("click", (e) => {
  if (!e.target.parentElement.classList.contains("like-btn")) {
    return;
  }
  const parentElement = e.target.closest(".photo");
  const likes = parentElement.querySelector(".likes");
  const likeBtn = parentElement.querySelector(".like-btn");
  const ifLike = JSON.parse(parentElement.dataset.like);
  const id = parentElement.dataset.id;
  const change = ifLike ? -1 : 1;
  if (ifLike) {
    likeBtn.classList.remove("active");
  } else {
    likeBtn.classList.add("active");
  }
  likes.textContent = +likes.textContent + change;
  parentElement.dataset.like = !ifLike;
  changeHistoryUserLike(id);
  changeHistoryLikes(id, change);
  saveHistory();
});

historyBtn.addEventListener("click", () => {
  getHIstoryImages();
});

function getHIstoryImages() {
  container.innerHTML = "";
  history.forEach((el) => {
    let likeBtnClass = el.userLike ? "like-btn active" : "like-btn";
    container.insertAdjacentHTML(
      "afterbegin",
      `<div class='photo' data-id='${el.id}' data-like='${el.userLike}'>
            <img  src="${el.url}" alt="history image">
            <svg class="${likeBtnClass}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M47.6 300.4L228.3 469.1c7.5 7 17.4 10.9 27.7 10.9s20.2-3.9 27.7-10.9L464.4 300.4c30.4-28.3 47.6-68 47.6-109.5v-5.8c0-69.9-50.5-129.5-119.4-141C347 36.5 300.6 51.4 268 84L256 96 244 84c-32.6-32.6-79-47.5-124.6-39.9C50.5 55.6 0 115.2 0 185.1v5.8c0 41.5 17.2 81.2 47.6 109.5z"/></svg>
            <p class='likes'>${el.likes}</p>
            <p class='author'>Автор: ${el.author}</p>
        </div>`
    );
  });
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem(localStorageKey));
  return history ? history : [];
}
function checkUserLike(id) {
  history.forEach((el) => {
    if (el.id === id) {
      return el.like;
    }
  });
  return false;
}

function saveHistory() {
  localStorage.setItem(localStorageKey, JSON.stringify(history));
}
function addItemToHistory(id, url, author, userLike, likes) {
  const newItem = { id, url, author, userLike, likes };
  history.push(newItem);
  saveHistory();
}
function changeHistoryLikes(id, change) {
  const photoIndex = history.findIndex((photo) => photo.id === id);
  history[photoIndex].likes = history[photoIndex].likes + change;
}

function changeHistoryUserLike(id) {
  const photoIndex = history.findIndex((photo) => photo.id === id);
  history[photoIndex].userLike = !JSON.parse(history[photoIndex].userLike);
  saveHistory();
}
getImage();
