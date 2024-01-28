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
  $(".inner-loading-screen").fadeIn(300);
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  const meals = await response.json();
  categories = meals.categories;
  console.log(categories);
  displayCategories();
  $(".inner-loading-screen").fadeOut(300);
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
  searchContainer.innerHTML = '';
  contactsContainer.innerHTML = '';
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
  searchContainer.innerHTML = "";
  contactsContainer.innerHTML = "";
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
  searchContainer.innerHTML = "";
  contactsContainer.innerHTML = "";
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
  $(".inner-loading-screen").fadeIn(300);

  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`
  );
  const meal = await response.json();
  meals = meal.meals
  displayMeals();
  $(".inner-loading-screen").fadeOut(300);
}

async function searchByFirstLetter(letter) {
  closeSideNav();
  rowData.innerHTML = "";
  $(".inner-loading-screen").fadeIn(300);

  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?f=${letter}`
  );
  const meal = await response.json();
  firstMeal = meal.meals;
  displayMealsByFirstLetter();
  $(".inner-loading-screen").fadeOut(300);
}

function displayMeals() {
  let cols = "";
  meals.map((item) => {
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