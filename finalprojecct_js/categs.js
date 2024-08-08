const categurl = "http://localhost:3001/categories";
let categTable = document.getElementById("tbodycateg");
let createBtn = document.getElementById("createbtn");
let saveBtn = document.getElementById("savebtn");
let cancelBtn = document.getElementById("cancelbtn");
let currentId = 1;
let editingCategory = null;

fetch(categurl)
    .then(response => response.json())
    .then(categories => {
        categories.forEach(category => {
            appendCategory(category);
            currentId = categories.id;
        });
        currentId++;
    })
    .catch(error => console.error('Error fetching categories:', error));

createBtn.addEventListener("click", function() {
    createCategoryForm();
});

cancelBtn.addEventListener("click", function() {
    removeForm();
});

saveBtn.addEventListener("click", function() {
    let newId = document.getElementById("newId").value;
    let newName = document.getElementById("newName").value;

    if (!newName.trim()) {
        alert("Category name is required");
        return;
    }

    let newCategory = {
        id: newId,
        name: newName
    };

    if (editingCategory) {
        updateCategory(newCategory);
    } else {
        createCategory(newCategory);
    }
});

function createCategory(newCategory) {
    fetch(categurl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newCategory)
    })
    .then(response => response.json())
    .then(data => {
        appendCategory(data);
        removeForm();
        currentId++;
    })
    .catch(error => console.error('Error creating category:', error));
}

function updateCategory(updatedCategory) {
    fetch(`${categurl}/${updatedCategory.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedCategory)
    })
    .then(response => response.json())
    .then(data => {
        let row = document.querySelector(`tr[data-id='${updatedCategory.id}']`);
        row.innerHTML = `
            <td>${updatedCategory.id}</td>
            <td>${updatedCategory.name}</td>
            <td>
                <button class="editbtn btn btn-primary" data-id="${updatedCategory.id}">Edit</button>
                <button class="removebtn btn btn-danger" data-id="${updatedCategory.id}">Remove</button>
            </td>
        `;
        row.querySelector(".removebtn").addEventListener("click", handleRemove);
        row.querySelector(".editbtn").addEventListener("click", editCategory);
        removeForm();
    })
    .catch(error => console.error('Error updating category:', error));
}

function appendCategory(category) {
    let tr = document.createElement('tr');
    tr.setAttribute('data-id', category.id);
    tr.innerHTML = `
        <td>${category.id}</td>
        <td>${category.name}</td>
        <td>
            <button class="editbtn btn btn-primary" data-id="${category.id}">Edit</button>
            <button class="removebtn btn btn-danger" data-id="${category.id}">Remove</button>
        </td>
    `;
    categTable.appendChild(tr);

    tr.querySelector(".removebtn").addEventListener("click", handleRemove);
    tr.querySelector(".editbtn").addEventListener("click", editCategory);
}

function handleRemove(e) {
    e.preventDefault();
    let id = e.target.getAttribute('data-id');

    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`${categurl}/${id}`, {
                method: "DELETE"
            })
            .then(response => {
                if (response.ok) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "The category has been deleted.",
                        icon: "success"
                    }).then(() => {
                        e.target.closest('tr').remove();
                    });
                } else {
                    Swal.fire({
                        title: "Error!",
                        text: "Unable to delete the category.",
                        icon: "error"
                    });
                }
            })
            .catch(error => {
                console.error('Error deleting category:', error);
                Swal.fire({
                    title: "Error!",
                    text: "An error occurred while deleting the category.",
                    icon: "error"
                });
            });
        }
    });
}

function editCategory(e) {
    e.preventDefault();
    let tr = e.target.closest('tr');
    let id = tr.children[0].innerText;
    let name = tr.children[1].innerText;

    let newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><input type="text" id="newId" class="form-control" value="${id}" readonly></td>
        <td><input type="text" id="newName" class="form-control" value="${name}" placeholder="Category Name"></td>
        <td>
            <button class="updatebtn btn btn-primary">Update</button>
            <button class="cancelbtn btn btn-danger">Cancel</button>
        </td>
    `;

    categTable.replaceChild(newRow, tr);

    newRow.querySelector('.updatebtn').addEventListener("click", function() {
        let newName = document.getElementById("newName").value.trim();
        if (!newName) {
            alert("Category name is required");
            return;
        }

        let updatedCategory = {
            id: id,
            name: newName
        };

        updateCategory(updatedCategory);
        categTable.replaceChild(tr, newRow);
    });

    newRow.querySelector('.cancelbtn').addEventListener("click", function() {
        categTable.replaceChild(tr, newRow);
    });

    createBtn.style.display = 'none';
}

function createCategoryForm() {
    let tr = document.createElement('tr');
    tr.innerHTML = `
        <td><input type="text" id="newId" class="form-control" value="${currentId}" readonly></td>
        <td><input type="text" id="newName" class="form-control" placeholder="Category Name"></td>
        <td>
            
        </td>
    `;
    categTable.appendChild(tr);

    saveBtn.style.display = 'inline-block';
    cancelBtn.style.display = 'inline-block';
    createBtn.style.display = 'none';
}

function removeForm() {
    document.querySelectorAll('#tbodycateg tr').forEach(tr => {
        if (tr.querySelector('#newId')) {
            tr.remove();
        }
    });
    saveBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
    createBtn.style.display = 'inline-block';
    editingCategory = null;
}
