const slidersurl = "http://localhost:8000/sliders";
let createBtn = document.getElementById("createbtn");
let prdTable = document.getElementById("tbodyprd");
let saveBtn = document.getElementById("savebtn");
let cancelBtn = document.getElementById("cancelbtn");
let currentId = 1;
let editingSlider = null;

document.addEventListener("DOMContentLoaded", function() {
    fetch(slidersurl)
        .then(response => response.json())
        .then(sliders => {
            sliders.forEach(slider => {
                appendSlider(slider);
            });
            currentId++;
        });
});

createBtn.addEventListener("click", function() {
    createSliderForm();
});

cancelBtn.addEventListener("click", function() {
    removeForm();
});

saveBtn.addEventListener("click", function() {
    let newId = document.getElementById("newId").value;
    let newText = document.getElementById("newText").value;
    let newSmallText = document.getElementById("newSmallText").value;
    let newImage = document.getElementById("newImage").value;

    if (!newText.trim()) {
        alert("Text is required");
        return;
    }

    if (!newImage.trim()) {
        alert("Image URL is required");
        return;
    }

    let newSlider = {
        id: newId,
        text: newText,
        smallText: newSmallText,
        image: newImage
    };

    if (editingSlider) {
        updateSlider(newSlider);
    } else {
        createSlider(newSlider);
    }
});

function createSlider(newSlider) {
    fetch(slidersurl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(newSlider)
    })
    .then(response => response.json())
    .then(data => {
        appendSlider(data);
        removeForm();
        currentId++;
    })
    .catch(error => console.error('Error:', error));
}

function updateSlider(updatedSlider) {
    fetch(`${slidersurl}/${updatedSlider.id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedSlider)
    })
    .then(response => response.json())
    .then(data => {
        let row = document.querySelector(`tr[data-id='${updatedSlider.id}']`);
        row.innerHTML = `
            <td>${updatedSlider.id}</td>
            <td>${updatedSlider.text}</td>
            <td>${updatedSlider.smallText}</td>
            <td><img src="${updatedSlider.image}" alt="Slider Image" style="width: 100px; height: auto;"></td>
            <td>
                <button class="editbtn btn btn-primary" data-id="${updatedSlider.id}">Edit</button>
                <button class="removebtn btn btn-danger" data-id="${updatedSlider.id}">Remove</button>
            </td>
        `;

        row.querySelector(".removebtn").addEventListener("click", handleRemove);
        row.querySelector(".editbtn").addEventListener("click", editSlider);
        removeForm();
    })
    .catch(error => console.error('Error:', error));
}

function appendSlider(slider) {
    let tr = document.createElement('tr');
    tr.setAttribute('data-id', slider.id);
    tr.innerHTML = `
        <td>${slider.id}</td>
        <td>${slider.text}</td>
        <td>${slider.smallText}</td>
        <td><img src="${slider.image}" alt="Slider Image" style="width: 100px; height: auto;"></td>
        <td>
            <button class="editbtn btn btn-primary" data-id="${slider.id}">Edit</button>
            <button class="removebtn btn btn-danger" data-id="${slider.id}">Remove</button>
        </td>
    `;
    prdTable.appendChild(tr);

    tr.querySelector(".removebtn").addEventListener("click", handleRemove);
    tr.querySelector(".editbtn").addEventListener("click", editSlider);
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
            fetch(`${slidersurl}/${id}`, {
                method: "DELETE"
            })
            .then(response => {
                if (response.ok) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "The slider has been deleted.",
                        icon: "success"
                    }).then(() => {
                        e.target.closest('tr').remove();
                    });
                } else {
                    Swal.fire({
                        title: "Error!",
                        text: "Unable to delete the slider.",
                        icon: "error"
                    });
                }
            })
            .catch(error => {
                console.error('Error:', error);
                Swal.fire({
                    title: "Error!",
                    text: "An error occurred while deleting the slider.",
                    icon: "error"
                });
            });
        }
    });
}

function editSlider(e) {
    e.preventDefault();
    let tr = e.target.closest('tr');
    let id = tr.children[0].innerText;
    let text = tr.children[1].innerText;
    let smallText = tr.children[2].innerText;
    let image = tr.children[3].querySelector('img').src;

    let newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td><input type="text" id="newId" class="form-control" value="${id}" readonly></td>
        <td><input type="text" id="newText" class="form-control" value="${text}" placeholder="Text"></td>
        <td><input type="text" id="newSmallText" class="form-control" value="${smallText}" placeholder="Small Text"></td>
        <td><input type="text" id="newImage" class="form-control" value="${image}" placeholder="Image URL"></td>
        <td><img id="previewImage" src="${image}" style="width: 100px; height: auto;"></td>
    `;

    prdTable.replaceChild(newRow, tr);

    document.getElementById("newImage").addEventListener("input", function(e) {
        let previewImage = document.getElementById("previewImage");
        previewImage.src = e.target.value;
    });

    saveBtn.style.display = 'inline-block';
    cancelBtn.style.display = 'inline-block';
    createBtn.style.display = 'none';
    editingSlider = id;
}

function createSliderForm() {
    let tr = document.createElement('tr');
    tr.innerHTML = `
        <td><input type="text" id="newId" class="form-control" value="${currentId}" readonly></td>
        <td><input type="text" id="newText" class="form-control" placeholder="Text"></td>
        <td><input type="text" id="newSmallText" class="form-control" placeholder="Small Text"></td>
        <td><input type="text" id="newImage" class="form-control" placeholder="Image URL"></td>
        <td><img id="previewImage" style="width: 100px; height: auto;"></td>
    `;
    prdTable.appendChild(tr);

    document.getElementById("newImage").addEventListener("input", function(e) {
        let previewImage = document.getElementById("previewImage");
        previewImage.src = e.target.value;
    });

    saveBtn.style.display = 'inline-block';
    cancelBtn.style.display = 'inline-block';
    createBtn.style.display = 'none';
}

function removeForm() {
    document.querySelectorAll('#tbodyprd tr').forEach(tr => {
        if (tr.querySelector('#newId')) {
            tr.remove();
        }
    });
    saveBtn.style.display = 'none';
    cancelBtn.style.display = 'none';
    createBtn.style.display = 'inline-block';
    editingSlider = null;
}