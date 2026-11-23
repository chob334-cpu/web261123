const average = (list) => {
    let sum = 0;
    for (const m of list) {
        sum += m.rating;
    }
    return sum / list.length;
}
console.log("평균:", average(movies));

const best = (list) => {
    let top = list[0];
    for (const m of list) {
        if (m.rating > top.rating) {
            top = m;
        }
    }
    return top;
}
console.log("최고:", best(movies).title);

const filterByRating = (list, min) => {
    return list.filter(m => m.rating >= min);
}
console.log("8점 이상:", filterByRating(movies, 8).length + "편");

const sorted = sortBy(movies, "rating", true);
console.log("정렬 1위:", sorted[0].title, "/ 원본 1번:", movies[0].title);

const yearsSince = (dateStr) => {
    return new Date().getFullYear() - new Date(dateStr).getFullYear();
}
console.log(yearsSince(best(movies).date) + "년 전 개봉");

const posterUrl = (path, size) => {
    return "https://image.tmdb.org/t/p/" + size + path;
}
console.log(posterUrl(movies[0].poster, "w342"));

// [보너스 1] 찜한 영화 제목 배열을 localStorage에서 불러오고 저장하기
const liked = JSON.parse(localStorage.getItem("liked") || "[]");
function saveLiked() {
    localStorage.setItem("liked", JSON.stringify(liked));
}

// renderCards : 영화 배열 ⇒ 보드에 카드 생성(반환값 없음)
function renderCards(list) {
    const board = document.querySelector(".board");
    board.innerHTML = "";
    for (const m of list) {
        const card = document.createElement("article");
        card.className = "card";
        if (m.rating >= 8) {
            card.classList.add("hot");
        }
        const isLiked = liked.includes(m.title);
        card.innerHTML = `
 <img class="poster" src="${posterUrl(m.poster, "w342")}" alt="${m.title} 포스터">
 <span class="badge">${m.rating}</span>
 <div class="info">
 <h2>${m.title}</h2>    
 <p class="year">${m.year}</p>
 <button class="like ${isLiked ? "liked" : ""}" type="button">♥</button>
 </div>`;
        board.appendChild(card);
    }
    document.getElementById("count").textContent = list.length + "편";
    updateLikeCount();
    if (list.length === 0) {
        board.classList.add("is-empty");
    } else {
        board.classList.remove("is-empty");
    }
}

// sortBy: 영화 배열, 키 이름, 내림차순 여부 정렬한 새 배열(원본은 그대로)
function sortBy(list, key, desc) {
    const copy = [...list];
    copy.sort((a, b) => {
        if (typeof a[key] === "string") return a[key].localeCompare(b[key]);
        return a[key] - b[key];
    });
    if (desc) copy.reverse();
    return copy;
}

// applySort: 선택 상자 값으로 정렬해서 다시 그리기(반환값 없음)
function applySort() {
    renderCards(getView());
}
applySort();

document.getElementById("q").addEventListener("input", (e) => {
    renderCards(getView());
});

document.getElementById("sort").addEventListener("change", applySort);

function getView() {
    const keyword = document.getElementById("q").value.trim().toLowerCase();
    const found = movies.filter(m => m.title.toLowerCase().includes(keyword));
    const key = document.getElementById("sort").value;
    return sortBy(found, key, key !== "title");
}

// 일반 함수(function)에서 this는 이벤트가 등록된 .board를 가리키지만, 화살표 함수에서 this는 상위 스코프(window)를 가리킨다.
// 반면 e.target은 함수 형태와 무관하게 실제 클릭한 요소(♥ 버튼 등)를 가리킨다.
document.querySelector(".board").addEventListener("click", (e) => {
    if (e.target.classList.contains("like")) {
        const title = e.target.closest(".card").querySelector("h2").textContent;
        const idx = liked.indexOf(title);
        if (idx === -1) {
            liked.push(title);
        } else {
            liked.splice(idx, 1);
        }
        saveLiked();
        e.target.classList.toggle("liked");
        updateLikeCount();
    }
});

function updateLikeCount() {
    document.getElementById("likeCount").textContent = liked.length;
}

document.getElementById("q").addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        e.target.value = "";
        renderCards(getView());
    }
});

// [보너스 2] 다크 모드 토글
document.getElementById("themeToggle").addEventListener("click", () => {
    document.body.classList.toggle("dark");
});