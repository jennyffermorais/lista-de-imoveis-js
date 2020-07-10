(function () {
  const URL_RESOURCE =
    "https://raw.githubusercontent.com/jsvini/desafio-frontend/master/assets/api.json";

  function init() {
    requestApi();
  }

  /**
   * Requisita API de opções de imóveis.
   */
  function requestApi() {
    fetch(URL_RESOURCE, { method: "GET", cache: "no-store" })
      .then((res) => {
        var contentType = res.headers.get("content-type");
        if (contentType) {
          return res.json();
        } else {
          throw new Error("errr");
        }
      })
      .then((json) => {
        if (!json || json.errors.length > 0) {
          console.log("Errors: ", json.errors);
          return;
        }

        loadGrid(json.data);
      })
      .catch((err) => {
        if (err == "TypeError: Failed to fetch") return;

        alert("Não foi possivel obter os anuncios");
      });
  }

  /**
   * Carrega grid de cards.
   *
   * @param {object[]} data Array<object> of cards.
   */
  function loadGrid(data) {
    try {
      if (!data || data.length <= 0) {
        console.warn("Warning: Data is empty");
        return;
      }

      let list = document.getElementById("options");

      let fragment = document.createDocumentFragment();

      for (let i = 0; i < 10; i++) {
        let card = createCardTemplate(data[i]);
        fragment.appendChild(card);
      }

      list.appendChild(fragment);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   *  Cria o template dos cards com suas propriedades.
   *
   * @param {object} cardItem
   * @returns DocumentFragment
   */
  function createCardTemplate(cardItem) {
    let tag = "";
    let price = 0;

    if (cardItem.advertisementPrice.sellPrice) {
      tag = "Kaufen";
      price = cardItem.advertisementPrice.sellPrice * 1000;
    } else {
      tag = "Mieten";
      price = cardItem.advertisementPrice.baseRent;
    }

    let template = `    
        <div class="card">
        <button>${tag}</button>
        <img
          src="${
            cardItem.advertisementAssets[0].advertisementThumbnails.inventory_m
              .url
          }"
          alt="Avatar"
          style="width: 100%;"
          class="img-options"
        />
        <div class="cardText">
          <p>${cardItem.title}</p>
          <p style="color: grey; font-size: 12px;"> ${
            cardItem.realestateSummary.address.postalCode
          } ${cardItem.realestateSummary.address.city} / ${
      cardItem.realestateSummary.address.street.split(" ")[0]
    }</p>
          <span style="font-weight: bold;">${price} € </span>
          <span style="color: grey;">${
            cardItem.realestateSummary.numberOfRooms
          } Zimmer | ab ${cardItem.realestateSummary.space.toFixed(2)} m²</span>
        </div>
      </div>`;

    return parseHtml(template);
  }

  /**
   * Converte o template de texto html para nó html.
   *
   * @param {string} template string template
   * @returns DocumentFragment
   */
  function parseHtml(template) {
    let temp = document.createElement("template");
    temp.innerHTML = template;

    return temp.content.cloneNode(true);
  }

  init();
})();
