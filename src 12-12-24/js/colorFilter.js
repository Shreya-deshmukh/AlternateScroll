// import { index } from "./index";

// // Function to show the color picker popup
// window.showColorPicker = function () {
//   console.log(showColorPicker, "showColorPicker");
//   document.getElementById("color-picker-popup").classList.remove("hidden");
// };

// // Function to close the color picker popup
// window.closeColorPicker = function () {
//   document.getElementById("color-picker-popup").classList.add("hidden");
// };
// // Function triggered when a color is selected
// window.selectColor = async function (color) {
//   closeColorPicker();
//   const products = await index.populateColumns(color);
//   //   displayProducts(products);
// };

// // Fetch products from Contentful based on the selected color
// async function fetchProductsByColor(color) {
//   const spaceId = "zggawij42o34";
//   const accessToken = "_SSMqARTowTpHiEi6Q3XJE_wPJzaGqhjYPZu-ljMMVM";
//   const contentType = "alternateImageList";

//   const response = await fetch(
//     `https://cdn.contentful.com/spaces/${spaceId}/entries?access_token=${accessToken}&content_type=${contentType}&fields.color=${color}`
//   );
//   const data = await response.json();

//   return data.items.map((item) => ({
//     imageUrl: `https:${
//       data.includes.Asset.find(
//         (asset) => asset.sys.id === item.fields.image.sys.id
//       )?.fields.file.url
//     }`,
//     title: item.fields.title,
//     year: item.fields.year,
//     description: item.fields.description,
//   })); // Adjust based on your Contentful model
//   return data.items.map((item) => item.fields);
// }

// // Dynamically display products in the grid
// function displayProducts(products) {
//   const grid = document.querySelector(".product-grid");
//   grid.innerHTML = ""; // Clear existing products

//   console.log(products, "products");
//   products.forEach((product) => {
//     const productCard = `
//         <div class="product-card">
//           <img src="${product.imageUrl}" alt="${product.title}">
//           <p>${product.title}</p>
//           <span>${product.year}</span>
//         </div>`;
//     grid.innerHTML += productCard;
//   });
// }
