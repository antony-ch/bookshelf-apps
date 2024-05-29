document.addEventListener('DOMContentLoaded', function () {
    const bookForm = document.getElementById('bookForm');
    const incompleteBookshelfList = document.getElementById('incompleteBookshelfList');
    const completeBookshelfList = document.getElementById('completeBookshelfList');
    const searchInput = document.getElementById('searchInput');

    const BOOKS_KEY = 'BOOKSHELF_APP';
    let books = JSON.parse(localStorage.getItem(BOOKS_KEY)) || [];

    function renderBooks() {
        incompleteBookshelfList.innerHTML = '';
        completeBookshelfList.innerHTML = '';

        for (const book of books) {
            const bookElement = createBookElement(book);
            if (book.isComplete) {
                completeBookshelfList.appendChild(bookElement);
            } else {
                incompleteBookshelfList.appendChild(bookElement);
            }
        }
    }

    function createBookElement(book) {
        const bookItem = document.createElement('div');
        bookItem.classList.add('book-item');
        bookItem.innerHTML = `<p><strong>${book.title}</strong> oleh ${book.author} (${book.year})</p>`;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Hapus';
        deleteButton.classList.add('btn-red');
        deleteButton.addEventListener('click', function () {
            showDeleteDialog(book.id);
        });

        const toggleButton = document.createElement('button');
        toggleButton.textContent = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';
        toggleButton.classList.add('btn-green');
        toggleButton.addEventListener('click', function () {
            toggleBookComplete(book.id);
        });

        bookItem.appendChild(toggleButton);
        bookItem.appendChild(deleteButton);

        return bookItem;
    }

    searchInput.addEventListener('input', function () {
        const searchValue = searchInput.value.trim().toLowerCase(); 
        filterBooks(searchValue);
    });

    function filterBooks(searchValue) {
        const bookItems = document.querySelectorAll('.book-item');
        bookItems.forEach(function (bookItem) {
            const bookTitle = bookItem.querySelector('strong').textContent.toLowerCase();
            if (bookTitle.includes(searchValue)) {
                bookItem.style.display = '';
            } else {
                bookItem.style.display = 'none';
            }
        });
    }

    function addBook(book) {
        books.push(book);
        saveBooks();
        renderBooks();
    }

    function showDeleteDialog(bookId) {
        const dialog = document.getElementById('deleteDialog');
        dialog.style.display = 'flex';
    
        const confirmButton = document.getElementById('confirmDelete');
        const cancelButton = document.getElementById('cancelDelete');
    
        confirmButton.onclick = function() {
            deleteBook(bookId);
            dialog.style.display = 'none';
        };
    
        cancelButton.onclick = function() {
            dialog.style.display = 'none';
        };
    }

    function deleteBook(bookId) {
        books = books.filter(book => book.id !== bookId);
        saveBooks();
        renderBooks();
    }

    function toggleBookComplete(bookId) {
        const book = books.find(book => book.id === bookId);
        if (book) {
            book.isComplete = !book.isComplete;
            saveBooks();
            renderBooks();
        }
    }

    function saveBooks() {
        localStorage.setItem(BOOKS_KEY, JSON.stringify(books));
    }

    bookForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const year = document.getElementById('year').value;
        const isComplete = document.getElementById('isComplete').checked;

        const book = {
            id: +new Date(),
            title,
            author,
            year: parseInt(year),
            isComplete
        };

        addBook(book);

        bookForm.reset();
    });

    renderBooks();
});