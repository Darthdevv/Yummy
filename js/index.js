///<reference types="../@types/jquery" />
"use strict";
const searchContainer = document.getElementById('searchContainer');
const contactsContainer = document.getElementById('contactsContainer');
const rowData = document.getElementById("rowData");
let submitBtn;

let categories = [];
let area = [];
let ingredients = [];
let meals = [];
let firstMeal = [];

$(function () {
  searchByName("").then(() => {
    $(".loading-screen").fadeOut(500);
    $("body").css("overflow", "visible");
  });
});

function openSideNav() {
  $(".side-nav-menu").animate(
    {
      left: 0,
    },
    500
  );

  $(".open-close-icon").removeClass("fa-align-justify");
  $(".open-close-icon").addClass("fa-x");

  for (let i = 0; i < 5; i++) {
    $(".links li")
      .eq(i)
      .animate(
        {
          top: 0,
        },
        (i + 5) * 100
      );
  }
}

function closeSideNav() {
  let boxWidth = $(".side-nav-menu .nav-tab").outerWidth();
  $(".side-nav-menu").animate(
    {
      left: -boxWidth,
    },
    500
  );

  $(".open-close-icon").addClass("fa-align-justify");
  $(".open-close-icon").removeClass("fa-x");

  $(".links li").animate(
    {
      top: 300,
    },
    500
  );
}
closeSideNav();

$(document).on("click", ".side-nav-menu i.open-close-icon", function () {
  if ($(".side-nav-menu").css("left") === "0px") {
    closeSideNav();
  } else {
    openSideNav();
  }
});

async function getCategories() {
  rowData.innerHTML = "";
  $(".loading-screen").fadeIn(300);

  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  const meals = await response.json();

  categories = meals.categories;
  displayCategories();
  $(".loading-screen").fadeOut(300);
}



function displayCategories() {
  let cols = '';

  categories.map(
    (item) =>
      (cols += `
      <div class="col-md-3">
        <div onclick="getCategoryMeals('${
          item.strCategory
        }')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
            <img class="w-100" src="${item.strCategoryThumb}" alt="" srcset="">
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
  searchContainer.innerHTML = '';
  contactsContainer.innerHTML = '';
}


async function getArea() {
  rowData.innerHTML = "";
  $(".loading-screen").fadeIn(300);
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
  );
  const meals = await response.json();

  area = meals.meals;
  displayArea();
  $(".loading-screen").fadeOut(300);
}

function displayArea() {
  let cols = "";
  area.map(
    (item) =>
      (cols += `
      <div class="col-md-3">
        <div onclick="getAreaMeals('${item.strArea}')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
          <i class="fa-solid fa-house-laptop fa-4x"></i>
          <h3>${item.strArea}</h3>
        </div>
      </div>
  `)
  );
  rowData.innerHTML = cols;
  searchContainer.innerHTML = "";
  contactsContainer.innerHTML = "";
}

async function getIngredients() {
  rowData.innerHTML = "";
  $(".loading-screen").fadeIn(300);
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
  );
  const meals = await response.json();
  ingredients = meals.meals.splice(0,20);
  displayIngredients();
  $(".loading-screen").fadeOut(300);
}

function displayIngredients() {
  let cols = "";
  ingredients.map(
    (item) =>
      (cols += `
      <div class="col-md-3">
        <div onclick="getIngredientsMeals('${
          item.strIngredient
        }')" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
          <i class="fa-solid fa-drumstick-bite fa-4x"></i>
          <h3>${item.strIngredient}</h3>
          <p>${item.strDescription.split(" ").slice(0, 20).join(" ")}</p>
        </div>
      </div>
  `)
  );
  rowData.innerHTML = cols;
  searchContainer.innerHTML = "";
  contactsContainer.innerHTML = "";
}

async function getCategoryMeals(category) {
  rowData.innerHTML = "";
  $(".loading-screen").fadeIn(300);

  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
  );
  const meals = await response.json();

  displayMeals(meals.meals.slice(0, 20));
  $(".loading-screen").fadeOut(300);
}

async function getAreaMeals(area) {
  rowData.innerHTML = "";
  $(".loading-screen").fadeIn(300);

  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
  );
  const meals = await response.json();

  displayMeals(meals.meals.slice(0, 20));
  $(".loading-screen").fadeOut(300);
}

async function getIngredientsMeals(ingredients) {
  rowData.innerHTML = "";
  $(".loading-screen").fadeIn(300);

  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredients}`
  );
  const meals = await response.json();

  displayMeals(meals.meals.slice(0, 20));
  $(".loading-screen").fadeOut(300);
}

async function getMealDetails(mealID) {
  closeSideNav();
  rowData.innerHTML = "";
  $(".loading-screen").fadeIn(300);

  searchContainer.innerHTML = "";
  const respone = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`
  );
  const meals = await respone.json();

  displayMealDetails(meals.meals[0]);
  $(".loading-screen").fadeOut(300);
}


function displayMealDetails(meal) {
  searchContainer.innerHTML = "";

  let ingredients = ``;

  for (let i = 1; i <= 20; i++) {
    if (meal[`strIngredient${i}`]) {
      ingredients += `<li class="alert alert-info m-2 p-1">${
        meal[`strMeasure${i}`]
      } ${meal[`strIngredient${i}`]}</li>`;
    }
  }

  let tags = meal.strTags?.split(",");
  if (!tags) tags = [];

  let tagsStr = "";
  for (let i = 0; i < tags.length; i++) {
    tagsStr += `
        <li class="alert alert-danger m-2 p-1">${tags[i]}</li>`;
  }

  let cols = `
    <div class="col-md-4">
                <img class="w-100 rounded-3" src="${meal.strMealThumb}"
                    alt="">
                    <h2>${meal.strMeal}</h2>
            </div>
            <div class="col-md-8">
                <h2>Instructions</h2>
                <p>${meal.strInstructions}</p>
                <h3><span class="fw-bolder">Area : </span>${meal.strArea}</h3>
                <h3><span class="fw-bolder">Category : </span>${meal.strCategory}</h3>
                <h3>Recipes :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${ingredients}
                </ul>

                <h3>Tags :</h3>
                <ul class="list-unstyled d-flex g-3 flex-wrap">
                    ${tagsStr}
                </ul>

                <a target="_blank" href="${meal.strSource}" class="btn btn-success">Source</a>
                <a target="_blank" href="${meal.strYoutube}" class="btn btn-danger">Youtube</a>
            </div>`;

  rowData.innerHTML = cols;
}

function displaySearchInputs() {
  searchContainer.innerHTML = `
    <div class="row py-4 ">
      <div class="col-md-6 ">
        <input onkeyup="searchByName(this.value)" class="form-control bg-transparent text-white" type="text" placeholder="Search By Name">
      </div>
      <div class="col-md-6">
        <input onkeyup="searchByFirstLetter(this.value)" maxlength="1" class="form-control bg-transparent text-white" type="text" placeholder="Search By First Letter">
      </div>
    </div>
  `
  rowData.innerHTML = '';
  contactsContainer.innerHTML = ''
}

async function searchByName(query) {
  closeSideNav();
  rowData.innerHTML = "";
  $(".loading-screen").fadeIn(300);

  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
  );
  const meal = await response.json();
  meals = meal.meals
  displayMeals(meals);
  $(".loading-screen").fadeOut(300);
}

async function searchByFirstLetter(letter) {
  closeSideNav();
  rowData.innerHTML = "";
  $(".loading-screen").fadeIn(300);

  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
  );
  const meal = await response.json();
  firstMeal = meal.meals;
  displayMealsByFirstLetter();
  $(".loading-screen").fadeOut(300);
}

function displayMeals(arr) {
  let cols = "";
  arr.map((item) => {
    cols += `
        <div class="col-md-3">
                <div onclick="getMealDetails(${item.idMeal})" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${item.strMealThumb}" alt="" srcset="">
                    <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                        <h3>${item.strMeal}</h3>
                    </div>
                </div>
        </div>
        `;
  });
  rowData.innerHTML = cols;
}

function displayMealsByFirstLetter() {
  let cols = "";
  firstMeal.map((item) => {
    cols += `
        <div class="col-md-3">
                <div onclick="getMealDetails(${item.idMeal})" class="meal position-relative overflow-hidden rounded-2 cursor-pointer">
                    <img class="w-100" src="${item.strMealThumb}" alt="" srcset="">
                    <div class="meal-layer position-absolute d-flex align-items-center text-black p-2">
                        <h3>${item.strMeal}</h3>
                    </div>
                </div>
        </div>
        `;
  });
  rowData.innerHTML = cols;
}

function displayContactsInputs() {
  contactsContainer.innerHTML = `
  <div class="contact  d-flex justify-content-center align-items-center">
    <div class="container w-75 ">
      <div class="row g-4">
            <div class="col-md-6">
                <input id="nameInput" onkeyup="inputsValidation()" type="text" class="form-control bg-transparent text-white" placeholder="Enter Your Name">
                <div id="nameAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Special characters and numbers not allowed
                </div>
            </div>
            <div class="col-md-6">
                <input id="emailInput" onkeyup="inputsValidation()" type="email" class="form-control bg-transparent text-white " placeholder="Enter Your Email">
                <div id="emailAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Email not valid *exemple@yyy.zzz
                </div>
            </div>
            <div class="col-md-6">
                <input id="phoneInput" onkeyup="inputsValidation()" type="text" class="form-control bg-transparent text-white " placeholder="Enter Your Phone">
                <div id="phoneAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid Phone Number
                </div>
            </div>
            <div class="col-md-6">
                <input id="ageInput" onkeyup="inputsValidation()" type="number" class="form-control bg-transparent text-white " placeholder="Enter Your Age">
                <div id="ageAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid age
                </div>
            </div>
            <div class="col-md-6">
                <input id="passwordInput" onkeyup="inputsValidation()" type="password" class="form-control bg-transparent text-white " placeholder="Enter Your Password">
                <div id="passwordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid password *Minimum eight characters, at least one letter and one number:*
                </div>
            </div>
            <div class="col-md-6">
                <input id="repasswordInput" onkeyup="inputsValidation()" type="password" class="form-control bg-transparent text-white " placeholder="Repassword">
                <div id="repasswordAlert" class="alert alert-danger w-100 mt-2 d-none">
                    Enter valid repassword 
                </div>
            </div>
        </div>
          <button id="submitBtn" disabled class="btn btn-outline-warning w-100 px-2 mt-3">Submit</button>
      </div>
    </div>
  `;
  searchContainer.innerHTML = '';
  rowData.innerHTML = '';

    submitBtn = document.getElementById("submitBtn")

    document.getElementById("nameInput").addEventListener("focus", () => {
        nameInputTouched = true
    })

    document.getElementById("emailInput").addEventListener("focus", () => {
        emailInputTouched = true
    })

    document.getElementById("phoneInput").addEventListener("focus", () => {
        phoneInputTouched = true
    })

    document.getElementById("ageInput").addEventListener("focus", () => {
        ageInputTouched = true
    })

    document.getElementById("passwordInput").addEventListener("focus", () => {
        passwordInputTouched = true
    })

    document.getElementById("repasswordInput").addEventListener("focus", () => {
        repasswordInputTouched = true
    })
}

let nameInputTouched = false;
let emailInputTouched = false;
let phoneInputTouched = false;
let ageInputTouched = false;
let passwordInputTouched = false;
let repasswordInputTouched = false;

function inputsValidation() {
    if (nameInputTouched) {
        if (nameValidation()) {
            document.getElementById("nameAlert").classList.replace("d-block", "d-none")

        } else {
            document.getElementById("nameAlert").classList.replace("d-none", "d-block")

        }
    }
  
    if (emailInputTouched) {

        if (emailValidation()) {
            document.getElementById("emailAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("emailAlert").classList.replace("d-none", "d-block")

        }
    }

    if (phoneInputTouched) {
        if (phoneValidation()) {
            document.getElementById("phoneAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("phoneAlert").classList.replace("d-none", "d-block")

        }
    }

    if (ageInputTouched) {
        if (ageValidation()) {
            document.getElementById("ageAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("ageAlert").classList.replace("d-none", "d-block")

        }
    }

    if (passwordInputTouched) {
        if (passwordValidation()) {
            document.getElementById("passwordAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("passwordAlert").classList.replace("d-none", "d-block")

        }
    }
  
    if (repasswordInputTouched) {
        if (repasswordValidation()) {
            document.getElementById("repasswordAlert").classList.replace("d-block", "d-none")
        } else {
            document.getElementById("repasswordAlert").classList.replace("d-none", "d-block")

        }
    }

    if (nameValidation() &&
        emailValidation() &&
        phoneValidation() &&
        ageValidation() &&
        passwordValidation() &&
        repasswordValidation()) {
        submitBtn.removeAttribute("disabled")
    } else {
        submitBtn.setAttribute("disabled", true)
    }
}

function nameValidation() {
    return (/^[a-zA-Z ]+$/.test(document.getElementById("nameInput").value))
}

function emailValidation() {
    return (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(document.getElementById("emailInput").value))
}

function phoneValidation() {
    return (/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(document.getElementById("phoneInput").value))
}

function ageValidation() {
    return (/^(0?[1-9]|[1-9][0-9]|[1][1-9][1-9]|200)$/.test(document.getElementById("ageInput").value))
}

function passwordValidation() {
    return (/^(?=.*\d)(?=.*[a-z])[0-9a-zA-Z]{8,}$/.test(document.getElementById("passwordInput").value))
}

function repasswordValidation() {
    return document.getElementById("repasswordInput").value == document.getElementById("passwordInput").value
}