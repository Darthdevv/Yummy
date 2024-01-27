///<reference types="../@types/jquery" />
"use strict";
const searchContainer = document.getElementById('searchContainer');
const rowData = document.getElementById("rowData");

let categories = [];
let area = [];
let ingredients = [];


displayInputs();
// getIngredients();
// getArea();
// getCategories();

async function getCategories() {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  const meals = await response.json();
  categories = meals.categories;
  console.log(categories);
  displayCategories();
}



function displayCategories() {
  let cols = '';
  categories.map(
    (item) =>
      (cols += `
      <div class="col-md-3">
        <div class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
            <img class="w-100" src="${
              item.strCategoryThumb
            }" alt="" srcset="">
            <div class="meal-layer position-absolute text-center text-black p-2">
                <h3>${item.strCategory}</h3>
                <p>${item.strCategoryDescription
                  .split(" ")
                  .slice(0, 20)
                  .join(" ")}</p>
            </div>
        </div>
      </div>
  `)
  );
  rowData.innerHTML = cols;
}


async function getArea() {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  const meals = await response.json();
  area = meals.meals;
  console.log(area);
  displayArea();
}

function displayArea() {
  let cols = "";
  area.map(
    (item) =>
      (cols += `
      <div class="col-md-3">
        <div class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
          <i class="fa-solid fa-house-laptop fa-4x"></i>
          <h3>${item.strArea}</h3>
        </div>
      </div>
  `)
  );
  rowData.innerHTML = cols; 
}

async function getIngredients() {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  const meals = await response.json();
  ingredients = meals.meals.splice(0,20);
  console.log(ingredients);
  displayIngredients();
}

function displayIngredients() {
  let cols = "";
  ingredients.map(
    (item) =>
      (cols += `
      <div class="col-md-3">
        <div class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
          <i class="fa-solid fa-drumstick-bite fa-4x"></i>
          <h3>${item.strIngredient}</h3>
          <p>${item.strDescription.split(' ').slice(0,20).join(' ')}</p>
        </div>
      </div>
  `)
  );
  rowData.innerHTML = cols;
}


function displayInputs() {
  searchContainer.innerHTML = `
    <div class="row py-4 ">
      <div class="col-md-6 ">
        <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
      </div>
      <div class="col-md-6">
        <input onkeyup="searchByFLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
      </div>
    </div>
  `
  rowData.innerHTML = '';
}