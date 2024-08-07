const jsonurl = "http://localhost:3001/categories";
const slidersurl = "http://localhost:8000/sliders";
let selectcat1 = document.getElementById("allcategories");
let slider = document.getElementById("slider");
let sliderBtn = document.getElementById("sliderbtn");
let productBtn = document.getElementById("prdbtn");
let categdiv1 = document.getElementById("categdivnumber732");
let categdiv2 = document.getElementById("categsdivs14");

fetch(jsonurl)
    .then(response => response.json())
    .then(data => {
        data.forEach(prds => {
            const card1 = document.createElement("div")
            card1.className = 'catesmain23';
            card1.innerHTML = `<div class="catesmain23">
                    <div class="catename">
                        <a style="font-family:Cambria, Cochin, Georgia, Times, 'Times New Roman', serif; font-size: 18px; font-weight: 500;">${prds.name}</a>
                        <a style="color: rgb(170, 162, 162); font-family:Cambria, Cochin, Georgia, Times, 'Times New Roman', serif;"></a>
                    </div>
                </div>`
            categdiv2.append(card1);
        })
    })

// async function createCategories() {
//     fetch(jsonurl)
//         .then(response => response.json())
//         .then(data => {
//             console.log(data);
            
//             data.forEach(categ => {
//                 let option = document.createElement("option");
//                 option.value = categ.name;
//                 option.innerText = categ.name;
//                 selectcat1.appendChild(option);
//             });
//         })
// }
        
// createCategories();

sliderBtn.addEventListener("click", function(event) {
    event.preventDefault(); 
    if (slider.style.display === "none" || slider.style.display === "") {
        slider.style.display = "block";
    } else {
        slider.style.display = "none";
    }
});

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('slider').style.display = 'block';
});

const prdsurl = "http://localhost:3000/products";
let prdsCards = document.getElementById("allprdscards")

fetch(prdsurl)
    .then(response => response.json())
    .then(data => {
        data.forEach(prds => {
            const card = document.createElement("div")
            card.className = 'pnimain';
            card.innerHTML = `<div class="pniimage">
                        <img src="${prds.image}" alt="">
                    </div>
                    <div class="pninamerating">
                    <a style="font-family:'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif; font-weight: 600;">${prds.name}</a>
                    <a style="font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif; color: rgb(179, 168, 168); margin-left: 15px;">${prds.category}</a>
                        <div class="stars">
                            <span class="fa fa-star checked"></span>
                            <span class="fa fa-star checked"></span>
                            <span class="fa fa-star checked"></span>
                            <span class="fa fa-star checked"></span>
                            <span class="fa fa-star"></span>
                        </div>
                        <a style="font-family: cursive; margin-top: 7px; color: rgb(47, 197, 47);">By Somebody</a>
                        <div class="pricepni">
                            <a style="font-family: cursive; color: rgb(28, 175, 28); font-weight: 600;">$${prds.price}</a>
                            <a href="#" class="addbut1" style="text-decoration: none; font-family: cursive;"><i style="margin-right: 5px;" class="fa-solid fa-cart-shopping"></i>Add</a>
                        </div>
                    </div>`
            prdsCards.append(card);
        })
    })

let sliderDiv = document.getElementById("slidersmain1");

fetch(slidersurl)
    .then(response => response.json())
    .then(data => {
        data.forEach(datas => {
            let slide = document.createElement("div")
            slide.className = 'sliderstexts'
            slide.innerHTML = `
            <div style="background-image: url(${datas.image}); background-size: cover; height: 550px; border-radius: 20px;" class="carousel-item active">
                <!-- <img src="./randompic1.jpg" class="d-block w-100" alt="Slide 1"> -->
                <div class="sliderstexts">
                    <div class="sliderstextsmain">
                        <a style="font-family: cursive; font-size: 55px; font-weight: 500; color: rgb(37,61,78); font-weight: 500;">${datas.text}</a>
                        <a style="color: white; font-family: sans-serif; margin-top: 20px; font-size: 30px;">${datas.smallText}</a>
                    </div>
                    <div style="margin-left: 200px;" class="stayhomeemailtext">
                        <i style="font-size: 17px; margin-right: 10px; color: gray; margin-left: 15px;" class="fa-regular fa-paper-plane"></i>
                        <input type="text" placeholder="Your Email Address">
                        <button>Subscribe</button>
                    </div>
                </div>
            </div>`;
            sliderDiv.append(slide);    
        })
    })    

