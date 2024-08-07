const jsonurl = "http://localhost:3000/products";
const categurl = "http://localhost:3001/categories";
let prdTable = document.getElementById("tbodyprd");
let createBtn = document.getElementById("createbtn");
let saveBtn = document.getElementById("savebtn");
let cancelBtn = document.getElementById("cancelbtn");
let chooseCategred = document.getElementById("choosecateg24");
let currentId = 0;
let editingProduct = null;

document.addEventListener("DOMContentLoaded", function(e) {
    fetch(jsonurl)
        .then(response => response.json())
        .then(datas => {
            datas.forEach(prd => {
                appendProduct(prd);
                currentId = prd.id; 
            });
            currentId++; 
        });
});

createBtn.addEventListener("click", function() {
    fetch(categurl)
        .then(response => response.json())
        .then(categories => {
            let tr = document.createElement('tr');
            tr.innerHTML = `
                <td><input type="text" id="newId" class="form-control" value="${currentId}" readonly></td>
                <td><input type="text" id="newName" class="form-control" placeholder="Name"></td>
                <td>
                    <select name="category" id="newCategory" class="form-control">
                        <option value="">choose category</option>
                    </select>
                </td>
                <td><input type="number" id="newPrice" class="form-control" placeholder="Price"></td>
                <td><input type="file" id="newImage" class="form-control"></td>
                <td><img id="previewImage" style="width: 50px; height: 50px;"></td>
            `;
            prdTable.appendChild(tr);
            saveBtn.style.display = 'inline-block';
            cancelBtn.style.display = 'inline-block';
            createBtn.style.display = 'none';

            let categorySelect = document.getElementById("newCategory");
            categories.forEach(categ => {
                let option = document.createElement("option");
                option.value = categ.name;
                option.textContent = categ.name;
                categorySelect.appendChild(option);
            });

            document.getElementById("newImage").addEventListener("change", function(event) {
                let reader = new FileReader();
                reader.onload = function() {
                    let previewImage = document.getElementById("previewImage");
                    previewImage.src = reader.result;
                }
                reader.readAsDataURL(event.target.files[0]);
            });
        });
});

cancelBtn.addEventListener("click", function() {
    document.getElementById("newId").parentElement.parentElement.remove();
    saveBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
    createBtn.style.display = 'inline-block';
    chooseCategred.style.display = 'none';
    editingProduct = null;
});

saveBtn.addEventListener("click", function() {
    let newId = document.getElementById("newId").value;
    let newName = document.getElementById("newName").value;
    let newCategory = document.getElementById("newCategory").value;
    let newPrice = document.getElementById("newPrice").value;
    let newImage = document.getElementById("newImage").files[0];

    if (!newName.trim()) {
        chooseCategred.style.display = "flex";
        return;
    }

    if (!newCategory.trim()) {
        chooseCategred.innerText = "choose a category";
        chooseCategred.style.display = "flex";
        return;
    } else {
        chooseCategred.style.display = "none";
    }

    if (newPrice <= 0 || !newPrice) {
        chooseCategred.innerText = "price must be >= 0";
        chooseCategred.style.display = "flex";
        return;
    }

    let reader = new FileReader();
    reader.onload = function() {
        let newProduct = {
            id: newId,
            name: newName,
            category: newCategory,
            price: newPrice,
            image: reader.result
        };

        if (editingProduct) {
            updateProduct(newProduct);
        } else {
            createProduct(newProduct);
        }
    }

    if (newImage) {
        reader.readAsDataURL(newImage);
    } else {
        let newProduct = {
            id: newId,
            name: newName,
            category: newCategory,
            price: newPrice,
            image: editingProduct ? editingProduct.image : ""
        };

        if (editingProduct) {
            updateProduct(newProduct);
        } else {
            Swal.fire({
                title: "Do you want to add product without image?",
                text: "You can edit it if you want",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes!"
            }).then((result) => {
                if (result.isConfirmed) {
                    createProduct(newProduct);
                    Swal.fire({
                        title: "Created!",
                        text: "Your product has been successfully created",
                        icon: "success"
                    });
                }
            });
        }
    }
});

function createProduct(newProduct) {
    fetch(jsonurl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newProduct)
    })
    .then(response => response.json())
    .then(data => {
        appendProduct(data);
        saveBtn.style.display = 'none';
        cancelBtn.style.display = 'none';
        createBtn.style.display = 'inline-block';
        currentId++;
    })
    .catch(error => console.error('Error:', error));
}

function updateProduct(updatedProduct) {
    fetch(`${jsonurl}/${updatedProduct.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedProduct)
    })
    .then(response => response.json())
    .then(data => {
        let row = document.querySelector(`tr[data-id='${updatedProduct.id}']`);
        row.innerHTML = `
            <td>${updatedProduct.id}</td>
            <td>${updatedProduct.name}</td>
            <td>${updatedProduct.category}</td>
            <td>${updatedProduct.price}</td>
            <td><img src="${updatedProduct.image}" alt="${updatedProduct.name}" style="width: 50px; height: auto;"></td>
            <td>
                <button class="editbtn btn btn-primary" href="${jsonurl}/${updatedProduct.id}">Edit</button>
                <button class="removebtn btn btn-danger" href="${jsonurl}/${updatedProduct.id}">Remove</button>
            </td>
        `;

        document.querySelector(".removebtn").addEventListener("click", handleRemove);
        document.querySelector(".editbtn").addEventListener("click", EditProduct);
        saveBtn.style.display = 'none';
        cancelBtn.style.display = 'none';
        createBtn.style.display = 'inline-block';
        editingProduct = null;
    })
    .catch(error => console.error('Error:', error));
}

function appendProduct(prd) {
    let tr = document.createElement('tr');
    tr.setAttribute('data-id', prd.id);
    tr.innerHTML = `
        <td>${prd.id}</td>
        <td>${prd.name}</td>
        <td>${prd.category}</td>
        <td>${prd.price}</td>
        <td><img src="${prd.image}" alt="${prd.name}" style="width: 50px; height: auto;"></td>
        <td>
            <button class="editbtn btn btn-primary" href="${jsonurl}/${prd.id}">Edit</button>
            <button class="removebtn btn btn-danger" href="${jsonurl}/${prd.id}">Remove</button>
        </td>
    `;
    prdTable.appendChild(tr);

    tr.querySelector(".removebtn").addEventListener("click", handleRemove);
    tr.querySelector(".editbtn").addEventListener("click", EditProduct);
}

function handleRemove(e) {
    e.preventDefault();
    let url = e.target.getAttribute('href');

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
            fetch(url, {
                method: "DELETE"
            })
            .then(response => {
                if (response.ok) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "The product has been deleted.",
                        icon: "success"
                    }).then(() => {
                        e.target.closest('tr').remove();
                    });
                } else {
                    Swal.fire({
                        title: "Error!",
                        text: "Unable to delete the product.",
                        icon: "error"
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    title: "Error!",
                    text: "An error occurred while deleting the product.",
                    icon: "error"
                });
            });
        }
    });
}

function EditProduct(e) {
    e.preventDefault();
    let tr = e.target.closest('tr');
    let id = tr.children[0].innerText;
    let name = tr.children[1].innerText;
    let category = tr.children[2].innerText;
    let price = tr.children[3].innerText;
    let image = tr.children[4].querySelector('img').src;

    editingProduct = {
        id: id,
        name: name,
        category: category,
        price: price,
        image: image
    };

    let newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><input type="text" id="newId" class="form-control" value="${id}" readonly></td>
        <td><input type="text" id="newName" class="form-control" value="${name}" placeholder="Name"></td>
        <td>
            <select name="category" id="newCategory" class="form-control">
                <option value="">choose category</option>
            </select>
        </td>
        <td><input type="number" id="newPrice" class="form-control" value="${price}" placeholder="Price"></td>
        <td><input type="file" id="newImage" class="form-control"></td>
        <td><img id="previewImage" src="${image}" style="width: 50px; height: auto;"></td>
    `;

    fetch(categurl)
        .then(response => response.json())
        .then(categories => {
            let categorySelect = newRow.querySelector("#newCategory");
            categories.forEach(categ => {
                let option = document.createElement("option");
                option.value = categ.name;
                option.textContent = categ.name;
                if (categ.name === category) {
                    option.selected = true;
                }
                categorySelect.appendChild(option);
            });
        });

    prdTable.replaceChild(newRow, tr);

    newRow.querySelector("#newImage").addEventListener("change", function(e) {
        let reader = new FileReader();
        reader.onload = function() {
            let previewImage = document.getElementById("previewImage");
            previewImage.src = reader.result;
        }
        reader.readAsDataURL(e.target.files[0]);
    });

    saveBtn.style.display = 'inline-block';
    cancelBtn.style.display = 'inline-block';
    createBtn.style.display = 'none';
}