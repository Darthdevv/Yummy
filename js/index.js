///<reference types="../@types/jquery" />
"use strict";




let categories = [];


getCategories();

async function getCategories() {
  const response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/categories.php`
  );
  const meals = await response.json();
  categories = meals.categories;
  console.log(categories);
  displayData();
}



function displayData() {
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
  document.getElementById('rowData').innerHTML = cols;
}