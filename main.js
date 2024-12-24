const enterBook = [];
const RENDER_EVENT = "render-book";
const SAVED_EVENT = "saved-book";
const STORAGE_KEY = "BOOKSHELF-APPS";

function isStorageExist() {
    if (typeof Storage === undefined) {
        alert("Browser tidak mendukung local storage");
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            enterBook.push(book);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(enterBook);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const submitForm = document.getElementById("bookForm");
    const uncompletedBook = document.getElementById("incompleteBookList");
    const completedBook = document.getElementById("completeBookList");

    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        uncompletedBook.innerHTML = " ";
        completedBook.innerHTML = " ";
        addBook();
    });
    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

function addBook() {
    const title = document.getElementById("bookFormTitle").value;
    const author = document.getElementById("bookFormAuthor").value;
    const year = Number(document.getElementById("bookFormYear").value);
    const bookStatus = document.getElementById("bookFormIsComplete").checked;

    const generateID = generateId();
    const bookObject = generateBookObject(
        generateID,
        title,
        author,
        year,
        bookStatus
    );
    enterBook.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete,
    };
}

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBook = document.getElementById("incompleteBookList");
    const completedBook = document.getElementById("completeBookList");
    uncompletedBook.innerHTML = " ";
    completedBook.innerHTML = " ";

    for (const itemBuku of enterBook) {
        const elementBuku = bookList(itemBuku);
        if (!itemBuku.isComplete) {
            uncompletedBook.append(elementBuku);
        } else {
            completedBook.append(elementBuku);
        }
    }
});

function bookList(bookObject) {
    const { id, title, author, year, isComplete } = bookObject;

    const bungkusBuku = document.createElement("div");
    bungkusBuku.setAttribute("data-bookId", id);
    bungkusBuku.setAttribute("data-testid", "bookItem");

    const judul = document.createElement("h3");
    judul.innerText = title;
    judul.setAttribute("data-testid", "bookItemTitle");

    const penulis = document.createElement("p");
    penulis.innerText = `Penulis: ${author}`;
    penulis.setAttribute("data-testid", "bookItemAuthor");

    const tahun = document.createElement("p");
    tahun.innerText = `Tahun: ${year}`;
    tahun.setAttribute("data-testid", "bookItemYear");

    if (bookObject.isComplete) {
        const tombolBelum = document.createElement("button");
        tombolBelum.innerText = "Belum selesai";
        tombolBelum.setAttribute("data-testid", "bookItemIsunCompleteButton");
        tombolBelum.addEventListener("click", function () {
            belumSelesai(bookObject.id);
        });

        const tombolHapus = document.createElement("button");
        tombolHapus.innerText = "Hapus buku";
        tombolHapus.setAttribute("data-testid", "bookItemDeleteButton");
        tombolHapus.addEventListener("click", function () {
            hapusBuku(bookObject.id);
        });

        const tombolEdit = document.createElement("button");
        tombolEdit.innerText = "Edit Buku";
        tombolEdit.setAttribute("data-testid", "bookItemEditButton");

        const bungkusTombol = document.createElement("div");
        bungkusTombol.classList.add("btn-book");
        bungkusTombol.append(tombolBelum, tombolHapus, tombolEdit);

        bungkusBuku.append(judul, penulis, tahun, bungkusTombol);
    } else {
        const tombolSelesai = document.createElement("button");
        tombolSelesai.innerText = "Selesai dibaca";
        tombolSelesai.setAttribute("data-testid", "bookItemIsCompleteButton");
        tombolSelesai.addEventListener("click", function () {
            bukuSelesai(bookObject.id);
        });
        const tombolHapus = document.createElement("button");
        tombolHapus.innerText = "Hapus buku";
        tombolHapus.setAttribute("data-testid", "bookItemDeleteButton");
        tombolHapus.addEventListener("click", function () {
            hapusBuku(bookObject.id);
        });

        const tombolEdit = document.createElement("button");
        tombolEdit.innerText = "Edit Buku";
        tombolEdit.setAttribute("data-testid", "bookItemEditButton");

        const bungkusTombol = document.createElement("div");
        bungkusTombol.classList.add("btn-book");
        bungkusTombol.append(tombolSelesai, tombolHapus, tombolEdit);

        bungkusBuku.append(judul, penulis, tahun, bungkusTombol);
    }

    return bungkusBuku;
}

function bukuSelesai(bookId) {
    const bookTarget = findBook(bookId);

    if (bookId == null) return;

    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function belumSelesai(bookId) {
    const bookTarget = findBook(bookId);

    if (bookId === null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function hapusBuku(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    enterBook.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBook(bookId) {
    for (const itemBuku of enterBook) {
        if (itemBuku.id === bookId) return itemBuku;
    }
    return null;
}

function findBookIndex(bookId) {
    for (const index in enterBook) {
        if (enterBook[index].id === bookId) return index;
    }
    return -1;
}
