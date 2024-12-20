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
    console.log("calling once");

    const warningOverlay = document.getElementById("warning");
    if (window.innerWidth > 768) {
      const colorOptions = await this.fetchColors();
      setTimeout(() => {
        warningOverlay.classList.add("active");
      }, 3000);
    } else {
      warningOverlay.classList.remove("active");
      const columns = await this.populateColumns();
    }

    //    const duplicateImages = await this.duplicateImages();

    document.body.addEventListener("click", (event) => {
      //  expandImage(event);
    });
    // });
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
          color: item.fields.color,
          color1: item.fields.color1,
          color2: item.fields.color2,
        }))
        .filter((color) => color.color1 && color.color2 && color.color);

      console.log(colors, "values");

      const uniqueColors = [...new Set(colors)];

      console.log(uniqueColors, "uuuuuuuuuuu");
      localStorage.setItem("color-list", uniqueColors);
      productDisplayInstance.populateColors(uniqueColors);
    } catch (error) {
      console.error("Error fetching colors:", error);
    }
  }

  async populateColors(colors) {
    const colorPopup = document.querySelector(".color-popup");
    const mainCircle = document.querySelector(".main-circle");
    colorPopup.innerHTML = "";

    mainCircle.style.background = `linear-gradient(180deg, ${colors[0].color1} 50%, ${colors[0].color2} 50%)`;
    console.log(mainCircle.style.backgroundColor, "hhhyhyyyaaaaaaaaaaaaa");
    // }

    colors.forEach((colorItem, index) => {
      const colorDiv = document.createElement("div");
      colorDiv.className = `color-circle color-${index}`;
      colorDiv.style.background = `linear-gradient(180deg, ${colorItem.color1} 50%, ${colorItem.color2} 50%)`;
      colorDiv.style.border = `1px solid hsla(260,11%,85%,1)`;

      colorDiv.setAttribute(
        "onclick",
        `selectColor('${colorItem.color}','${colorItem.color1}','${colorItem.color2}')`
      );
      colorPopup.appendChild(colorDiv);

      // Set first color as main-circle color
    });
  }

  formatDate(dateStr) {
    const date = new Date(dateStr);

    // Define month names for conversion
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Extract day, month, and year from the Date object
    const day = String(date.getDate()).padStart(2, "0"); // Ensure 2-digit day
    const month = monthNames[date.getMonth()]; // Get abbreviated month name
    const year = date.getFullYear(); // Get full year

    // Return formatted date as 'DD MMM YYYY'
    return `${day} ${month} ${year}`;
  }

  async fetchContent(searchQuery = "") {
    let url = `https://cdn.contentful.com/spaces/${this.SPACE_ID}/entries?access_token=${this.ACCESS_TOKEN}&content_type=${this.CONTENT_TYPE}`;
    if (searchQuery) {
      url += `&fields.color=${searchQuery}`;
    }
    const response = await fetch(url);
    const data = await response.json();
    return data.items.map((item) => ({
      // Format the date
      imageUrl: `https:${
        data.includes.Asset.find(
          (asset) => asset.sys.id === item.fields.image.sys.id
        )?.fields.file.url
      }`,
      title: item.fields.title,
      subtitle: item.fields.subheading,
      subtitleSgd: item.fields.sgdSubheading,
      year: item.fields.year ? this.formatDate(item.fields.year) : "",
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
      // document.querySelector(".column-wrap--height").style.flexDirection =
      //   "column";
      document.querySelector(".column-wrap--height").style.scrollStep = 0;
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

    //  const gridInstance = new Grid();
    // gridInstance.lscroll.destroy();
  }

  processContent(content, totalElementInColumn, column1, column2) {
    content.forEach((item, index) => {
      console.log("itemmmmmmmm", item.year);
      const figure1 = this.createFigure(item, index);
      const figure2 = this.createFigure(item, index + 1);

      if (index < totalElementInColumn) {
        column1.appendChild(figure1);
      } else if (index < totalElementInColumn * 2) {
        column2.appendChild(figure2);
      }

      // Populate footer
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
    });
  }

  async populateColumns(color) {
    console.log("calling populate columns");
    document.getElementById("color-picker").style.display = "block";

    const content = await this.fetchContent(color);
    console.log("content*********************", content);
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

    // content.forEach((item, index) => {
    //   console.log("itemmmmmmmm", item.year);
    //   const figure1 = this.createFigure(item, index);
    //   const figure2 = this.createFigure(item, index + 1);

    //   if (index < totalElementInColumn) {
    //     column1.appendChild(figure1);
    //   } else if (index < totalElementInColumn * 2) {
    //     column2.appendChild(figure2);
    //   }

    //   //populate footer

    //   const imagesWrapper = document.querySelector(".image-wrapper");

    //   const card = document.createElement("div");
    //   card.classList.add("image-card");

    //   const img = document.createElement("img");
    //   img.src = item.imageUrl;
    //   img.alt = item.title;
    //   img.setAttribute("data-content", item.imageUrl);

    //   img.setAttribute("img-title", item.title);
    //   img.setAttribute("img-year", item.year);
    //   // Create container for title and date
    //   const info = document.createElement("div");
    //   info.classList.add("info");

    //   const title = document.createElement("span");
    //   title.classList.add("title");
    //   title.textContent = item.title;

    //   const date = document.createElement("span");
    //   date.classList.add("date");
    //   date.textContent = item.year;

    //   // Append title and date to the info container
    //   info.appendChild(title);
    //   info.appendChild(date);

    //   // Append img and info to the card
    //   card.appendChild(img);
    //   card.appendChild(info);
    //   imagesWrapper.appendChild(card);
    //   // If you want to handle a third column:
    //   // else if (index < totalElementInColumn * 3) {
    //   //   column3.appendChild(figure3);
    //   // }
    // });

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

    for (let i = 0; i < 25; i++) {
      // Assuming `content`, `totalElementInColumn`, `column1`, and `column2` are defined
      this.processContent(content, totalElementInColumn, column1, column2);
    }
  }

  // Call this function 20 times

  createFigure(item, index) {
    const dt = `${item.description}`.trim();
    const des = dt.replace(/'/g, "");
    const figure = document.createElement("figure");
    figure.classList.add("column__item");
    figure.innerHTML = `
  <div class="column__item-imgwrap" data-pos="${index}">
   
    <div class="column__item-img" 
         style="background-image: url(${item.imageUrl}); cursor: pointer;" 
         onclick="showPageContent('${item.imageUrl}', '${item.title}', '${item.subtitle}','${item.subtitleSgd}','${item.year}','${des}')">
    </div>
     <div class="column__item-title" style="display: flex; justify-content: space-between;padding:5px 0px;">
    <span style="text-align:left">${item.title}</span><span style="text-align:right"> ${item.year}</span>
    </div>
   
  </div>
`;

    return figure;
  }
}

const productDisplayInstance = new ProductDisplay();

// function closeModal() {
//   const imageModal = document.getElementById("imageModal");
//   imageModal.style.display = "none";
// }

function loadFooterImages() {
  const imagesWrapper = document.querySelector(".image-wrapper");
  // const leftArrow = document.querySelector(".left-arrow");
  // const rightArrow = document.querySelector(".right-arrow");
  const contentDisplay = document.getElementById("content-display");

  // Scroll amount
  let scrollAmount = 0;
  const scrollStep = 100;

  // Left arrow click
  // leftArrow.addEventListener("click", () => {
  //   scrollAmount = Math.max(scrollAmount - scrollStep, 0);
  //   imagesWrapper.style.transform = `translateX(-${scrollAmount}px)`;
  // });

  // Right arrow click
  // rightArrow.addEventListener("click", () => {
  //   const maxScroll =
  //     imagesWrapper.scrollWidth - imagesWrapper.parentElement.clientWidth;
  //   scrollAmount = Math.min(scrollAmount + scrollStep, maxScroll);
  //   imagesWrapper.style.transform = `translateX(-${scrollAmount}px)`;
  // });

  // Handle image click to load content
  const images = document.querySelectorAll(".image-wrapper img");
  // images.forEach((img) => {
  //   img.addEventListener("click", () => {
  //     const contentURL = img.getAttribute("data-content");

  //     // Load the new content
  //     contentDisplay.innerHTML = `<iframe src="${contentURL}" frameborder="0" style="width: 100%; height: 100%;"></iframe>`;
  //   });
  // });

  const imageModal = document.getElementById("product-image");
  const productTitle = document.querySelector(".product-title");
  const productYear = document.querySelector(".product-date");

  images.forEach((image) => {
    image.addEventListener("click", function () {
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

window.showPageContent = function (
  imageUrl,
  title,
  subtitle,
  subtitleSgd,
  year,
  description
) {
  console.log(
    "calling showPageContent....!",
    subtitleSgd,
    subtitle,
    description,
    year,
    "YYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYYyy"
  );

  // const item = JSON.parse(element.replace(/\\'/g, "'").replace(/\\"/g, '"'));

  const pageContent = document.getElementById("pageContent");
  const imageModal = document.getElementById("product-image");
  const column = document.getElementById("columns");
  const colorpicker = document.getElementById("color-picker");
  const productTitle = document.querySelector(".product-title");
  const productSubTitle = document.querySelector(".product-subtitle");
  const productSubTitleSGD = document.querySelector(".product-subtitle-sgd");
  const productYear = document.querySelector(".product-date");
  const productDescription = document.querySelector(".product-description");

  column.style.display = "none";
  colorpicker.style.display = "none";

  imageModal.style.backgroundImage = `url(${imageUrl})`;

  productTitle.textContent = title;
  productSubTitle.textContent = subtitle;
  productSubTitleSGD.textContent = subtitleSgd;
  productDescription.textContent = description;

  productYear.textContent = year;
  // productDescription.textContent = title;
  fetchAds();
  loadFooterImages();
  pageContent.style.display = "block"; // Display the page
};

window.BacktoHome = function () {
  console.log("calling BacktoHome....!");
  const pageContent = document.getElementById("pageContent");
  const imageModal = document.getElementsByClassName("product-image");
  const column = document.getElementById("columns");

  pageContent.style.display = "none";
  column.style.display = "flex";
  document.getElementById("color-picker").style.display = "block";
};

async function fetchAds() {
  try {
    let url = `https://cdn.contentful.com/spaces/zggawij42o34/entries?access_token=_SSMqARTowTpHiEi6Q3XJE_wPJzaGqhjYPZu-ljMMVM&content_type=productAd`;

    const response = await fetch(url);
    const data = await response.json();

    if (data) {
      const ad = data.items[0].fields; // Assuming single ad
      const img = data.includes.Asset[0].fields.file.url;

      // Desktop Ad
      document.getElementById(
        "ad-desktop"
      ).innerHTML = `<a href="${ad.externalLink}" target="_blank">
              <img src="${img}" alt="Desktop Ad">
       </a>
            <img src="${ad.impressionTag}" alt="Desktop Impression Tracker" style="display:none;">`;

      // Mobile Ad
      document.getElementById(
        "ad-mobile"
      ).innerHTML = `<a href="${ad.externalLinkmobile}" target="_blank">
              <img src="${img}" alt="Mobile Ad">
            </a>
            <img src="${ad.impressionTagmobile}" alt="Mobile Impression Tracker" style="display:none;">`;
    }
  } catch (error) {
    console.error("Error fetching ads:", error);
  }
}

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
window.selectColor = async function (color, color1, color2) {
  document.querySelector(".page-container").style.display = "none";

  // closeColorPicker();
  console.log("calling selectcolor", color1, color2);
  const products = await productDisplayInstance.populateColumns1(color);

  console.log(`Selected color: ${color}`);
  // Add any additional logic for selecting the color
  document.querySelector(
    ".main-circle"
  ).style.background = `linear-gradient(180deg, ${color1} 50%, ${color2} 50%)`;

  // Remove selected class from all color elements
  document.querySelectorAll(".color-option").forEach((el) => {
    el.classList.remove("selected");
  });

  // Add selected class to clicked color element
  const selectedColorElement = document.querySelector(
    `[onclick="selectColor('${color}','${color1}','${color2}')"]`
  );
  if (selectedColorElement) {
    selectedColorElement.classList.add("selected");
  }

  document.querySelector(".color-popup").style.display = "none";
  const overlay = document.getElementById("overlay");
  overlay.style.display = "none";

  // displayProducts(products);
};

// Preload images then remove loader (loading class) from body

preloadImages(".column__item-img").then(() => {
  setTimeout(() => {
    document.getElementById("overlay").style.display = "none";

    // document.querySelector("main").style.display = "block";

    document.body.classList.remove("loading");

    // Initialize the grid
    const gridInstance = new Grid(document.querySelector(".columns"));
    // const column1 = document.getElementById("column-1");
    // const column2 = document.getElementById("column-2");

    // const column1Images = column1.innerHTML;
    // const column2Images = column2.innerHTML;

    // setInterval(function () {
    //   column1.innerHTML += column1Images;
    //   column2.innerHTML += column2Images;
    // }, 1000);

    // console.log(column1, "cccooollluuummmnnnn111111");
    // gridInstance.getScrollInstance().update({});

    // const duplcateColumns = productDisplayInstance.duplicateImages();
  }, 3000);
});
