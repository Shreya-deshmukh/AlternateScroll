import { preloadImages } from "./utils";
import { Grid } from "./grid";

export class ProductDisplay {
  constructor() {
    this.SPACE_ID = "zggawij42o34";
    this.ACCESS_TOKEN = "_SSMqARTowTpHiEi6Q3XJE_wPJzaGqhjYPZu-ljMMVM";
    this.CONTENT_TYPE = "alternateImageList";
    this.init();
  }

  async init() {
    // document.addEventListener("DOMContentLoaded", () => {
    if (window.location.pathname === "/") {
      console.log("calling once");
      const columns = await this.populateColumns();
    }
  }

  async fetchColors() {
    console.log("calling fetchcolor");
    const url = `https://cdn.contentful.com/spaces/${this.SPACE_ID}/entries?access_token=${this.ACCESS_TOKEN}&content_type=colorFilters`;
    try {
      const response = await fetch(url);
      const data = await response.json();

      console.log(data, "dddddddddddddddddddddddd");

      const colors = data.items
        .map((item) => ({
          color1: item.fields.color1,
          color2: item.fields.color2,
        }))
        .filter((color) => color.color1 && color.color2);

      console.log(colors, "values");

      const uniqueColors = [...new Set(colors)];

      console.log(uniqueColors);
      localStorage.setItem("color-list", uniqueColors);
      productDisplayInstance.populateColors(uniqueColors);
    } catch (error) {
      console.error("Error fetching colors:", error);
    }
  }

  async populateColors(colors) {
    console.log(colors[0].color1, colors[0].color2, "colorscolors");
    const colorPopup = document.querySelector(".color-popup");
    const mainCircle = document.querySelector(".main-circle");
    colorPopup.innerHTML = "";

    mainCircle.style.background = `linear-gradient(180deg, ${colors[0].color1} 50%, ${colors[0].color2} 50%)`;
    console.log(mainCircle.style.backgroundColor, "hhhyhyyyaaaaaaaaaaaaa");
    // }

    colors.forEach((color, index) => {
      const colorDiv = document.createElement("div");
      colorDiv.className = `color-circle color-${index}`;
      colorDiv.style.background = `linear-gradient(180deg, ${color.color1} 50%, ${color.color2} 50%)`;
      colorDiv.style.border = `1px solid hsla(260,11%,85%,1)`;

      colorDiv.setAttribute("onclick", `selectColor('${color}')`);
      colorPopup.appendChild(colorDiv);

      console.log(index, "index");
      // Set first color as main-circle color
    });
  }

  async fetchContent(searchQuery = "") {
    let url = `https://cdn.contentful.com/spaces/${this.SPACE_ID}/entries?access_token=${this.ACCESS_TOKEN}&content_type=${this.CONTENT_TYPE}`;
    if (searchQuery) {
      url += `&fields.color=${searchQuery}`;
    }
    const response = await fetch(url);
    const data = await response.json();
    return data.items.map((item) => ({
      imageUrl: `https:${
        data.includes.Asset.find(
          (asset) => asset.sys.id === item.fields.image.sys.id
        )?.fields.file.url
      }`,
      title: item.fields.title,
      year: item.fields.year,
      description: item.fields.description,
    }));
  }

  async populateColumns1(color) {
    // alert("inside function 1");
    console.log("calling populate columns");

    const content = await this.fetchContent(color);
    const colorOptions = await this.fetchColors();

    if (content.length <= 6) {
      document.querySelector(".column-wrap--height").style.display = "flex";
      document.querySelector(".column-wrap--height").style.flexDirection =
        "column";
    }

    let column1 = document.getElementById("column-1");
    let column2 = document.getElementById("column-2");

    // Clear the columns if a color filter is applied
    if (color) {
      column1.innerHTML = "";
      column2.innerHTML = "";
      // document.getElementById("column-3")?.innerHTML = ""; // Assuming there's a third column.
    }

    // Optional handling of a third column if necessary
    //  const column3 = document.getElementById("column-3");

    const totalElementInColumn = Math.ceil(content.length / 2);

    content.forEach((item, index) => {
      const figure1 = this.createFigure(item, index);
      const figure2 = this.createFigure(item, index + 1);

      if (index < totalElementInColumn) {
        column1.appendChild(figure1);
      } else if (index < totalElementInColumn * 2) {
        column2.appendChild(figure2);
      }

      // If you want to handle a third column:
      // else if (index < totalElementInColumn * 3) {
      //   column3.appendChild(figure3);
      // }
    });

    // Handle odd number of elements by repeating the first element in column 2
    // if (content.length % 2 === 1) {
    //   const figure = this.createFigure(content[0], 100);
    //   column2.innerHTML += `
    //     <div class="column__item-imgwrap" data-pos="100">
    //       <div class="column__item-img" style="background-image:url(${content[0].imageUrl})"></div>
    //     </div>
    //     <figcaption class="column__item-caption">
    //       <span class="left">${content[0].title}</span>
    //       <span class="right">${content[0].year}</span>
    //     </figcaption>
    //   `;
    // }
    const elements = document.querySelectorAll(".column-wrap");
    elements.forEach((element) => {
      element.style.width = "90%";
    });

    // Populate content div
    const newContent = document.getElementById("contentD");

    content.forEach((item) => {
      const contentItem = document.createElement("div");
      contentItem.classList.add("content__item");
      contentItem.innerHTML = `
        <h2 class="content__item-title">${item.title}</h2>
        <div class="content__item-text" style="text-align: left;">
         <p>${item.year}</p>
          <p>${item.description}</p>
         
        </div>`;
      newContent.appendChild(contentItem);
    });
  }

  async populateColumns(color) {
    console.log("calling populate columns");

    const content = await this.fetchContent(color);
    const colorOptions = await this.fetchColors();

    if (content.length <= 6) {
      document.querySelector(".column-wrap--height").style.display = "flex";
      document.querySelector(".column-wrap--height").style.flexDirection =
        "column";
    }

    let column1 = document.getElementById("column-1");
    let column2 = document.getElementById("column-2");

    // Clear the columns if a color filter is applied
    if (color) {
      column1.innerHTML = "";
      column2.innerHTML = "";
      // document.getElementById("column-3")?.innerHTML = ""; // Assuming there's a third column.
    }

    // Optional handling of a third column if necessary
    //  const column3 = document.getElementById("column-3");

    const totalElementInColumn = Math.ceil(content.length / 2);

    content.forEach((item, index) => {
      const figure1 = this.createFigure(item, index);
      const figure2 = this.createFigure(item, index + 1);

      if (index < totalElementInColumn) {
        column1.appendChild(figure1);
      } else if (index < totalElementInColumn * 2) {
        column2.appendChild(figure2);
      }

      //populate footer

      const imagesWrapper = document.querySelector(".image-wrapper");

      const card = document.createElement("div");
      card.classList.add("image-card");

      const img = document.createElement("img");
      img.src = item.imageUrl;
      img.alt = item.title;
      img.setAttribute("data-content", item.imageUrl);

      img.setAttribute("img-title", item.title);
      img.setAttribute("img-year", item.year);
      // Create container for title and date
      const info = document.createElement("div");
      info.classList.add("info");

      const title = document.createElement("span");
      title.classList.add("title");
      title.textContent = item.title;

      const date = document.createElement("span");
      date.classList.add("date");
      date.textContent = item.year;

      // Append title and date to the info container
      info.appendChild(title);
      info.appendChild(date);

      // Append img and info to the card
      card.appendChild(img);
      card.appendChild(info);
      imagesWrapper.appendChild(card);
      // If you want to handle a third column:
      // else if (index < totalElementInColumn * 3) {
      //   column3.appendChild(figure3);
      // }
    });

    // Handle odd number of elements by repeating the first element in column 2
    // if (content.length % 2 === 1) {
    //   const figure = this.createFigure(content[0], 100);
    //   column2.innerHTML += `
    //     <div class="column__item-imgwrap" data-pos="100">
    //       <div class="column__item-img" style="background-image:url(${content[0].imageUrl})"></div>
    //     </div>
    //     <figcaption class="column__item-caption">
    //       <span class="left">${content[0].title}</span>
    //       <span class="right">${content[0].year}</span>
    //     </figcaption>
    //   `;
    // }

    // Populate content div
    // const newContent = document.getElementById("contentD");
    // content.forEach((item) => {
    //   const contentItem = document.createElement("div");
    //   contentItem.classList.add("content__item");
    //   contentItem.innerHTML = `
    //     <h2 class="content__item-title">${item.title}</h2>
    //     <div class="content__item-text" style="text-align: left;">
    //      <p>${item.year}</p>
    //       <p>${item.description}</p>

    //     </div>`;
    //   newContent.appendChild(contentItem);
    // });
  }

  createFigure(item, index) {
    //alert("2");

    const figure = document.createElement("figure");
    figure.classList.add("column__item");
    figure.innerHTML = `
  <div class="column__item-imgwrap" data-pos="${index}">
   
  <a href="./details22.html?title=${item.title}&year=${item.year}&description=${
      item.description
    }&imageUrl=${encodeURIComponent(item.imageUrl)}" class="column__item-link" >
    <div class="column__item-img" 
         style="background-image: url(${item.imageUrl}); cursor: pointer;" 
       >
    </div>
  </a>
     <div class="column__item-title" style="margin-bottom: 10px;">
    <span class="left-align">${
      item.title
    }</span><span style="text-align:right"> ${item.year}</span>
    </div>
   
  </div>
`;

    return figure;
  }

  // code with show hide image container

  //   createFigure(item, index) {
  //     const figure = document.createElement("figure");
  //     figure.classList.add("column__item");
  //     figure.innerHTML = `
  //   <div class="column__item-imgwrap" data-pos="${index}">

  //     <div class="column__item-img"
  //          style="background-image: url(${item.imageUrl}); cursor: pointer;"
  //          onclick="showPageContent('${item.imageUrl}', '${item.title}', '${item.year}')">
  //     </div>
  //      <div class="column__item-title" style="margin-bottom: 10px;">
  //     <span class="left-align">${item.title}</span><span style="text-align:right"> ${item.year}</span>
  //     </div>

  //   </div>
  // `;

  //     return figure;
  //   }
}

// function closeModal() {
//   const imageModal = document.getElementById("imageModal");
//   imageModal.style.display = "none";
// }

const productDisplayInstance = new ProductDisplay();

async function getImages() {
  const content = await productDisplayInstance.fetchContent("");
  const imagesWrapper = document.querySelector(".image-wrapper");

  content.forEach((item, index) => {
    //populate footer
    console.log("content", item);
    console.log("imagesWrapper", imagesWrapper);
    const card = document.createElement("div");
    card.classList.add("image-card");
    console.log("card", card);

    const img = document.createElement("img");
    img.src = item.imageUrl;
    img.alt = item.title;

    console.log("img", img);
    img.setAttribute("data-content", item.imageUrl);

    img.setAttribute("img-title", item.title);
    img.setAttribute("img-year", item.year);
    // Create container for title and date
    const info = document.createElement("div");
    info.classList.add("info");

    const title = document.createElement("span");
    title.classList.add("title");
    title.textContent = item.title;

    const date = document.createElement("span");
    date.classList.add("date");
    date.textContent = item.year;

    console.log("card", card);
    // Append title and date to the info container
    info.appendChild(title);
    info.appendChild(date);

    // Append img and info to the card
    card.appendChild(img);
    console.log("yha th", img);
    card.appendChild(info);
    console.log("yha info", info);
    imagesWrapper.appendChild(card);
  });
}

function loadFooterImages() {
  let Footerimages = getImages();

  const imagesWrapper = document.querySelector(".image-wrapper");

  const contentDisplay = document.getElementById("content-display");

  const images = document.querySelectorAll(".image-wrapper img");

  const imageModal = document.getElementById("product-image");
  const productTitle = document.querySelector(".product-title");
  const productYear = document.querySelector(".product-subtitle");

  console.log("images", images);
  images.forEach((image) => {
    image.addEventListener("click", function () {
      console.log(image, "inside funct");

      imageModal.style.opacity = 0; // Start fade-out
      setTimeout(() => {
        console.log("image url", image.src, image);
        imageModal.style.backgroundImage = `url(${image.src})`;
        productTitle.textContent = image.getAttribute("img-title");
        productYear.textContent = image.getAttribute("img-year");
        imageModal.style.opacity = 1; // Start fade-in
        const contentURL = image.getAttribute("data-content");

        contentDisplay.innerHTML = `<iframe src="${contentURL}" frameborder="0" style="width: 100%; height: 100%;"></iframe>`;
      }, 300);
      images.forEach((img) => (img.style.opacity = 1)); // Reset all thumbnails
      this.style.opacity = 0.5; // Highlight clicked thumbnail
    });
  });
}

window.showDetails = function (imageUrl, title, year) {
  alert("1");
  const targetUrl = `./details22.html?title=${title}&year=${year}&imageUrl=${encodeURIComponent(
    imageUrl
  )}`;

  // Navigate to the new page
  window.location.href = targetUrl;
};

window.showPageContent = function () {
  const currentUrl = window.location.href;

  // Parse the URL
  const url = new URL(currentUrl);

  // Get the image URL from the query parameters
  const imageUrl = url.searchParams.get("imageUrl"); // Example: ?image=your-image-url
  const title = url.searchParams.get("title"); // Example: ?title=your-title
  const year = url.searchParams.get("year"); // Example: ?year=your-year
  const description = url.searchParams.get("description"); // Example: ?description=your-description
  const imageContainer = document.getElementById("image-container");

  if (imageUrl) {
    const pageContent = document.getElementById("pageContent");
    const imageModal = document.getElementById("product-image");
    const productTitle = document.querySelector(".product-title");
    const productYear = document.querySelector(".product-subtitle");
    const productDescription = document.querySelector(".product-description");

    console.log("imageUrl", imageUrl);
    imageModal.style.backgroundImage = `url(${imageUrl})`;

    productTitle.textContent = title;
    productYear.textContent = year;
    productDescription.textContent = description;
    // productDescription.textContent = description;
    // productDescription.textContent = title;

    loadFooterImages();
  } else {
    // Handle missing or invalid image URL
    // imageContainer.textContent = "No image URL provided.";
  }

  pageContent.style.display = "block"; // Display the page
};

// window.showPageContent = function (imageUrl, title, year) {
//   console.log("calling showPageContent....!");
//   // const item = JSON.parse(element.replace(/\\'/g, "'").replace(/\\"/g, '"'));

//   const pageContent = document.getElementById("pageContent");
//   const imageModal = document.getElementById("product-image");
//   const column = document.getElementById("columns");
//   const productTitle = document.querySelector(".product-title");
//   const productYear = document.querySelector(".product-subtitle");
//   const productDescription = document.querySelector(".product-description");

//   column.style.display = "none";

//   imageModal.style.backgroundImage = `url(${imageUrl})`;

//   productTitle.textContent = title;
//   productYear.textContent = year;
//   // productDescription.textContent = title;

//   loadFooterImages();
//   pageContent.style.display = "block"; // Display the page
// };

// Expand Image in Modal
window.expandImage = function (event) {
  const pageContent = document.getElementById("pageContent");
  const imageModal = document.getElementsByClassName("product-image");

  pageContent.style.display = "block";

  console.log("calling....!");
};

// Close Modal
window.closeModal = function () {
  const imageModal = document.getElementById("imageModal");
  imageModal.style.display = "none";
};

window.toggleColorPopup = function () {
  const popup = document.querySelector(".color-popup");
  const overlay = document.getElementById("overlay");
  const isPopupVisible = popup.style.display === "flex";

  popup.style.display = isPopupVisible ? "none" : "flex";
  // overlay.style.display = isPopupVisible ? "none" : "flex";

  // const popup = document.querySelector(".color-popup");
  // popup.style.display = popup.style.display === "none" ? "block" : "none";
};

window.showColorPicker = function () {
  console.log(showColorPicker, "showColorPicker");
  document.getElementById("color-picker-popup").classList.remove("hidden");
};

// Function to close the color picker popup
window.closeColorPicker = function () {
  document.getElementById("color-picker-popup").classList.add("hidden");
};

// Function triggered when a color is selected
window.selectColor = async function (color) {
  // closeColorPicker();
  console.log("calling selectcolor");
  const products = await productDisplayInstance.populateColumns1(color);

  console.log(`Selected color: ${color}`);
  // Add any additional logic for selecting the color
  document.querySelector(".main-circle").style.backgroundColor = color;

  // Remove selected class from all color elements
  document.querySelectorAll(".color-option").forEach((el) => {
    el.classList.remove("selected");
  });

  // Add selected class to clicked color element
  const selectedColorElement = document.querySelector(
    `[onclick="selectColor('${color}')"]`
  );
  if (selectedColorElement) {
    selectedColorElement.classList.add("selected");
  }

  document.querySelector(".color-popup").style.display = "none";
  const overlay = document.getElementById("overlay");
  overlay.style.display = "none";

  // displayProducts(products);
};

if (window.location.pathname === "/") {
  preloadImages(".column__item-img").then(() => {
    console.log("images preloaded");
    setTimeout(() => {
      document.getElementById("overlay").style.display = "none";

      // document.querySelector("main").style.display = "block";

      document.body.classList.remove("loading");

      // Initialize the grid
      new Grid(document.querySelector(".columns"));
    }, 3000);
  });
} else {
  // alert("This is not the home page");
  document.body.classList.remove("loading");

  showPageContent();
}
