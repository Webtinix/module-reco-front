var GLOBAL_CONFIG_RECO = [];
var CURRENT_ZONE_RECO = {};

$(async function () {
  /* Chargement des tabs principale */

  await initialize();
});

function comeBack() {
  visibilityBlock("list-zone-reco");
}

//fonction init
async function initialize() {
  /*
   * On récupère tous les cards recommandation pour les afficher
   * On passe le block list-zone-reco à visibile pour affichers les zonezs reco récupérer ou le button ajouter une première zone reco
   */

  const listReco = await getZoneReco();
  const blockListZoneReco = $("#list-zone-reco");
  blockListZoneReco?.data("list_reco", listReco);
  resetFocusZone();
  visibilityBlock("list-zone-reco"); // remettre celui ci c'est le bon
  // visibilityBlock("focus-reco");

  if (listReco.length > 0) {
    //blockListZoneReco.a
    const content = blockListZoneReco.find(".content-list-zone");
    listReco.map((data) => content?.append(cardZone(data)));
    content.append(addButton());
  } else {
    blockListZoneReco.find(".content-list-zone")?.append(addButtonemptyZone());
  }
}

//get zone reco ou all zone reco
async function getZoneReco(id) {
  // on récupère les zone reco d'un ou de tous
  if (id) {
    //on peut récuoérer une zone en particulier ici soit avec list_reco attacher à la div #list-zone-reco
    //soit avec une requête directement
  } else {
    //on récupérer toutes les zones reco de la db ici pour les mettre dans zoneREco
    //
    const zoneReco = {
      list_zone_apply: [{ label: "test", value: 1 }],
      list_operateur: [
        { label: "Superieur", value: ">" },
        { label: "Inferieur", value: "<" },
        { label: "Superieur ou égal", value: ">=" },
        { label: "Inferieur ou égal", value: "<=" },
      ],
      list_critere: [
        { label: "Meilleures ventes", value: "Meilleures ventes" },
        { label: "Prix", value: "Prix" },
        { label: "Produit spécifique", value: "Produit spécifique" },
        { label: "Tranche d'âge", value: "Tranche d'âge" },
        { label: "Marque spécifique", value: "Marque spécifique" },
      ],
      list_my_zone_reco: [
        {
          id: 1,
          name: "Reco Home page",
          description: "Aperçu de la description de la zone",
          zone_apply: [{ label: "test", value: 1 }],
          criteres: [
            {
              id: 1,
              enabled: true,
              valeurs: "test",
              critere_value: "Meilleures ventes",
              operateur_value: ">",
              operateur_value_inf: "",
            },
          ],
        },
      ],
    };
    GLOBAL_CONFIG_RECO = zoneReco;
    return zoneReco["list_my_zone_reco"];
  }
}

//ajouter une nouvelle zone
async function addNewZone() {
  //
  resetFocusZone();
  visibilityBlock("focus-reco");
}

//modifier une zone reco
async function editZoneReco(id) {
  if (id) {
    // on récupère l'élément dans la variable global et on modifie les blocs tout en ajouter des évènements
    const data = GLOBAL_CONFIG_RECO["list_my_zone_reco"].find(
      (item) => item.id == id
    );
    if (data) {
      //on met les data de la zone reco en focus ici ça nous aidera bien
      CURRENT_ZONE_RECO = data;
      const zoneForm = $("#content-focus-zone");
      zoneForm?.find(".title_reco")?.text(data.name);
      //les premiers champs du formulaire (Name, desc, zone applicables)
      zoneForm?.find("#name-zone-reco")?.val(data.name);
      zoneForm?.find("#description-zone-reco")?.val(data.description);
      //O charge le select des zones appliquable ici
      const selectPageApply = zoneForm?.find("#select-page-apply");
      selectPageApply.empty();
      const empty = $("<option>")
        .text("Choisissez sur quelle page l'appliquer")
        .val("");
      selectPageApply.append(empty);
      GLOBAL_CONFIG_RECO["list_zone_apply"].map((option, index) => {
        const newOption = $("<option>").text(option.label).val(option.value);
        selectPageApply.append(newOption);
      });
      //pour cette zone reco on parcours ses zones applicables (zone_apply) et on
      //les ajoute à la div à coté du select pour montrer les valeurs
      const pageApplyDiv = zoneForm?.find("#list-page-apply");
      pageApplyDiv.empty();
      data.zone_apply?.map((item, index) => {
        pageApplyDiv.append(cardPageApply(item));
      });

      //les autres champs interactifs (bock critere)
      const configsFields = zoneForm.find(".config-zone-reco");
      configsFields.empty();
      data["criteres"].map((critere, index) => {
        const blockCritere = blockCritereZoneReco(
          critere,
          data["criteres"].length,
          index
        );
        configsFields.append(blockCritere);
      });

      //on affiche la zone du formulaire après avoir bien chargé les bonnes données
      visibilityBlock("focus-reco");
    }
  }
}

//supprimer une zone reco
async function deleteZoneReco(id) {
  if (id) {
    const index = GLOBAL_CONFIG_RECO["list_my_zone_reco"].findIndex(
      (zone) => zone.id === id
    );
    if (index !== -1) {
      GLOBAL_CONFIG_RECO["list_my_zone_reco"].splice(index, 1);
    }
  }
}

//fonction qui gère le bloque actuellement visible selon les interactions sur la page
async function visibilityBlock(toVisible) {
  // Tout les éléments se trouve dans la div home-reco dans index.html
  // on les cache ou on les affiche selon l'id passer en paramètre (l'id de la div passer en paramètre sera chaque fois le seule visible)
  // il ya le bloque qui liste les zones, celui du loader, celui qui permet de modifier la zone, celui qui permet de créer une nouvelle zone
  // On peut rajouter un block loader pour le faire apparaitre pendant les requêtes ou non
  const parent = $("#home-reco");

  if (parent) {
    parent.find(".zone_reco").each(function (index, element) {
      const $element = $(element);
      const id = $element.attr("id");

      if (id === toVisible) {
        $element.removeClass("hidden");
        if (toVisible == "focus-reco") {
          $(".header-zone-reco")?.find(".come-back")?.on("click", comeBack);
        }
      } else {
        $element.addClass("hidden");
      }
    });
  }
}

//Button pour ajouter une première zone reco
function addButtonemptyZone() {
  const button = `
                <button 
                    onclick="addNewZone()"
                    class="w-52 h-[14rem] max-w-sm p-6 gap-4 flex flex-col items-center justify-center bg-[#98DFEF] bg-opacity-25 border border-gray-200 rounded-lg shadow">
                    <img src="./icons/addButton.png" class="h-16" alt="add Button">
                    <span class="text-xl text-[#1D7B8F]  text-center font-bold">Créer une nouvelle zone</span>
                </button>
  `;

  return button;
}

//Button pour ajouter une nouvelle zone reco
function addButton() {
  const button = `
                <button 
                    onclick="addNewZone()"
                    class="w-52 h-[14rem] max-w-sm p-6 gap-4 flex flex-col items-center justify-center">
                    <img src="./icons/addButton.png" class="h-28" alt="add Button">
                </button>
  `;

  return button;
}

//card Zone reco
function cardZone(data) {
  // à patir des donnnées de chaque zone reco on peut créer sa card pour la modifier ou supprimer
  const { name, description, id } = data;

  const card = `
                      <div
                            data-zone-id="${id}"
                            class="card_zone_reco w-52 h-[14rem] max-w-sm p-6 gap-4 flex flex-col items-center justify-center text-center bg-white border border-gray-200 rounded-lg shadow">
                            <span class="text-2xl text-[#1D7B8F] text-center font-bold">Reco Home page</span>
                            <p>Aperçu de la description de la zone</p>
                            <div class="flex w-full justify-center items-center gap-4">
                                <button class="edit-card-reco" onclick="editZoneReco(${id})">
                                    <img src="./icons/crayon.png" alt="edit" class="h-10">
                                </button>
                                <button class="delete-card-reco"  onclick="deleteZoneReco(${id})">
                                    <img src="./icons/cancel.png" alt="delte" class="h-10">
                                </button>
                            </div>
                        </div>
  `;

  return card;
}

/**************  function focus-reco ********************************* */

function cardPageApply(data) {
  const { label, value } = data;
  const card = `
   <div class="px-4 p-1 flex items-center gap-2 bg-[#1D7B8F] rounded">
      <button class="item-zone-apply" data-id_zone="${value}">x</button>
      <span>${label}</span>
  </div>
  `;

  return card;
}

function resetFocusZone() {
  //on fait un reset de la zone du formulaire avec des valeurs par défauts
  CURRENT_ZONE_RECO = {
    id: 0,
    name: "Reco page",
    description: "Aperçu de la description de la zone",
    zone_apply: [],
    criteres: [
      {
        id: 0,
        enabled: true,
        valeurs: "",
        critere_value: "",
        operateur_value: "",
        operateur_value_inf: "",
      },
    ],
  };
  const zoneForm = $("#content-focus-zone");
  zoneForm.find(".title_reco").text("Zone Reco");
  zoneForm.find("select, input, textarea").val("");
  zoneForm.find("#list-page-apply").empty();

  const selectPageApply = zoneForm.find("#select-page-apply");
  selectPageApply.empty();
  const empty = $("<option>")
    .text("Choisissez sur quelle page l'appliquer")
    .val("");
  selectPageApply.append(empty);
  GLOBAL_CONFIG_RECO["list_zone_apply"].map((option, index) => {
    const newOption = $("<option>").text(option.label).val(option.value);
    selectPageApply.append(newOption);
  });

  const configsFields = zoneForm.find(".config-zone-reco");
  configsFields.empty();
  const blockCritere = blockCritereZoneReco(
    CURRENT_ZONE_RECO["criteres"][0],
    1,
    0
  );
  configsFields.append(blockCritere);
}

$(document).on("click", ".btn_add_bloc_critere", function () {
  //ajouter un block critère
  addNewBlockCritere($(this).data("index"));
});
$(document).on("click", ".btn_remove_bloc_critere", function () {
  //retirer un block critère
  removeBlockCritere($(this).data("index"));
});

$(document).on("click", ".item-zone-apply", function () {
  //event pour retirer des zones appliquée
  const value = $(this).data("id_zone");

  const listZoneApply = [...CURRENT_ZONE_RECO["zone_apply"]].filter(
    (item) => item.value != value
  );
  CURRENT_ZONE_RECO["zone_apply"] = listZoneApply;
  //
  const zoneForm = $("#content-focus-zone");
  const pageApplyDiv = zoneForm?.find("#list-page-apply");
  pageApplyDiv.empty();
  CURRENT_ZONE_RECO.zone_apply?.map((item, index) => {
    pageApplyDiv.append(cardPageApply(item));
  });
});

$(document).on("change", "#select-page-apply", function () {
  //event pour le select des zones applicables
  const value = $(this).val();

  const obj = GLOBAL_CONFIG_RECO["list_zone_apply"].find(
    (item) => item.value == value
  );
  if (obj) {
    const new_zone_apply = [...CURRENT_ZONE_RECO["zone_apply"], obj];
    CURRENT_ZONE_RECO["zone_apply"] = new_zone_apply;
    const zoneForm = $("#content-focus-zone");
    const pageApplyDiv = zoneForm?.find("#list-page-apply");
    pageApplyDiv.empty();
    CURRENT_ZONE_RECO.zone_apply?.map((item, index) => {
      pageApplyDiv.append(cardPageApply(item));
    });

    $(this).val("");
  }
});

$(document).on("change", ".isActiveBlock_", function () {
  const index = $(this)
    .closest(".block-critere-zone-reco")
    .attr("critere-index");
  const isChecked = $(this).is(":checked");

  // Mettre à jour l'état activé du critère dans la configuration actuelle
  const critere = CURRENT_ZONE_RECO["criteres"].find(
    (crit) => crit.id == index
  );
  if (critere) {
    critere.enabled = isChecked;
  }
  // Optionnel: Ajouter une logique visuelle pour indiquer l'état activé/désactivé
  // $(this).closest('.block-critere-zone-reco').toggleClass('disabled', !isChecked);
});

$(document).on("change", ".operateur_value_inf", function (event) {
  const selectedValue = event.target.value;
  const index = $(this)
    .closest(".block-critere-zone-reco")
    .attr("critere-index");
  // console.log("index select", index);
  if (index) {
    const dataBlocCritere = CURRENT_ZONE_RECO["criteres"][index];
    const dataDiluer = {
      ...dataBlocCritere,
      operateur_value_inf: selectedValue,
    };
    CURRENT_ZONE_RECO["criteres"][index] = dataDiluer;
  }
});

$(document).on("change", ".operateur_value", function (event) {
  const selectedValue = event.target.value;
  const index = $(this)
    .closest(".block-critere-zone-reco")
    .attr("critere-index");
  // console.log("index select", index);
  if (index) {
    const dataBlocCritere = CURRENT_ZONE_RECO["criteres"][index];
    const dataDiluer = {
      ...dataBlocCritere,
      operateur_value: selectedValue,
    };
    CURRENT_ZONE_RECO["criteres"][index] = dataDiluer;
  }
});

$(document).on("keyup", ".valeurs", function () {
  const val = $(this).val();
  const index = $(this)
    .closest(".block-critere-zone-reco")
    .attr("critere-index");
  // console.log("index select", index);
  if (index) {
    const dataBlocCritere = CURRENT_ZONE_RECO["criteres"][index];
    const dataDiluer = {
      ...dataBlocCritere,
      valeurs: val,
    };
    CURRENT_ZONE_RECO["criteres"][index] = dataDiluer;
  }
});

$(document).on("keyup", ".name-zone-reco", function () {
  const val = $(this).val();
  CURRENT_ZONE_RECO.name = val;
});

$(document).on("keyup", ".description-zone-reco", function () {
  const val = $(this).val();
  CURRENT_ZONE_RECO.description = val;
});

$(document).on("click", "#save-zone-reco", function () {
  if (CURRENT_ZONE_RECO.id == 0) {
    //il faudrait mettre à jour le nouvel id normalement
    GLOBAL_CONFIG_RECO["list_zone_reco"].push(CURRENT_ZONE_RECO);
  } else {
    const zoneIndex = GLOBAL_CONFIG_RECO["list_zone_reco"].findIndex(
      (zone) => zone.id === CURRENT_ZONE_RECO.id
    );
    if (zoneIndex !== -1) {
      GLOBAL_CONFIG_RECO["list_zone_reco"][zoneIndex] = CURRENT_ZONE_RECO;
    }
  }

  $(".come-back").trigger("click");
});

function blockCritereZoneReco(data, count, index) {
  const { id, enabled, critere_value } = data;

  const btnMoinsIsVisible = count > 1 ? "" : "hidden";

  const critere = `
   <div class="block-critere-zone-reco grid grid-cols-12 items-center" critere-index="${id}">
        <div class="col-span-4 flex gap-8 items-center w-full">
            <div class="flex flex-col gap-4">
                <button 
                data-index="${index}"
                class="btn_remove_bloc_critere ${btnMoinsIsVisible}"
                > <img src="./icons/moins.png" alt="moins"></button>
                <button type="buttton" data-index="${index}" class="btn_add_bloc_critere"><img src="./icons/plus.png" alt="plus"></button>
            </div>
            <label class="inline-flex items-center mb-5 cursor-pointer">
                <input type="checkbox" value="" name="isActiveBlock_"
                    class="isActiveBlock_ sr-only peer" ${
                      enabled ? "checked" : ""
                    }>
                <div
                    class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300  rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all peer-checked:bg-blue-600">
                </div>
            </label>
            <div class="">
                <label for="select-critere" class="block mb-2 text-[#1D7B8F] ">Critère</label>
                <select 
                    critere-index="${index}"
                    name="select-critere" id=""
                    class="select-critere bg-gray-50 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-fit p-2.5">
                    <option value="">Ajouter un critère</option>
                    ${optionSelect(
                      GLOBAL_CONFIG_RECO["list_critere"],
                      critere_value
                    )}
                </select>
            </div>
        </div>
        <div class="dynamiqueBlock col-span-8">
        ${blockDynamique(data)}
        </div>
        <div class="col-span-12 ${index != count - 1 ? "" : "hidden"}">
            <hr class="h-px my-4 bg-gray-200 border-0">
        </div>
    </div>
  `;
  return critere;
}

function addNewBlockCritere(index) {
  console.log("in add", index);
  if (index == 0 || index) {
    const listCritere = [...CURRENT_ZONE_RECO["criteres"]];

    const newElement = { ...listCritere[index], id: 0 };
    listCritere.splice(index + 1, 0, newElement);

    //on met à jour la variable global
    CURRENT_ZONE_RECO["criteres"] = [...listCritere];

    //on reinit le block des crites
    const zoneForm = $("#content-focus-zone");
    const configsFields = zoneForm.find(".config-zone-reco");
    configsFields.empty();
    listCritere.map((critere, index) => {
      const blockCritere = blockCritereZoneReco(
        critere,
        listCritere.length,
        index
      );
      configsFields.append(blockCritere);
    });
  }
}
function removeBlockCritere(index) {
  if (index == 0 || index) {
    const listCritere = [...CURRENT_ZONE_RECO["criteres"]];
    listCritere.splice(index, 1);

    //on met à jour la variable gloale
    CURRENT_ZONE_RECO["criteres"] = [...listCritere];

    //on reinit le block des crites
    const zoneForm = $("#content-focus-zone");
    const configsFields = zoneForm.find(".config-zone-reco");
    configsFields.empty();
    CURRENT_ZONE_RECO["criteres"].map((critere, index) => {
      const blockCritere = blockCritereZoneReco(
        critere,
        CURRENT_ZONE_RECO["criteres"].length,
        index
      );
      configsFields.append(blockCritere);
    });
  }
}

function optionSelect(list, valueSelected) {
  // return all critere for select
  return list
    .map(
      (critere) => `
    <option value="${critere.value}" ${
        critere.value == valueSelected ? "selected" : ""
      }>
      ${critere.label}
    </option>
  `
    )
    .join("");
}

function blockDynamique(data) {
  // ce block sont générer dynamiquement
  // Ce block étant dans un formulaire il faudrait résoudre le name des inputs
  // critere_valure représente la valeur du select criter,
  // operateur_value celui du premier select opérateur sinon l'unique
  // operateur_value_inf celui du 2èeme select opérateur sinon pas besoin
  // value répresente la valeur du champs de saisi à chaque fois

  const { critere_value, operateur_value, operateur_value_inf, valeurs } = data;

  switch (critere_value) {
    case "Meilleures ventes":
      return `
      <div class="items-center grid grid-cols-8">
       <label class="inline-flex items-center mb-5 cursor-pointer">
          <input type="checkbox" value="" name=""
              class=" sr-only peer" ${value ? "checked" : ""} >
          <div
              class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300  rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:w-5 after:h-5 after:transition-all peer-checked:bg-blue-600">
          </div>
      </label>
      </div>
      `;
    case "Prix":
      return `
       <div class="items-center grid grid-cols-8 gap-4">
          <!-- conditions -->
          <div class=" col-span-2 w-full">
              <div>
                  <label for="country" class="block  leading-6">Oérateurs</label>
                  <select
                      class="operateur_value block w-full rounded-md border-0 px-3.5 py-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                    <option value="">Choisir parmi les opérateurs</option>
                    ${optionSelect(
                      GLOBAL_CONFIG_RECO["list_operateur"],
                      operateur_value
                    )}
                  </select>
              </div>
          </div>
          <!-- input value -->
          <div class="col-span-2  w-full">
              <div>
                  <label for="" class="block  leading-6">
                      valeurs
                  </label>
                  <input
                      value="${valeurs ?? ""}"
                      placeholder="Saisir la note" type="text" name="valeurs"
                      class="valeurs block w-full rounded-md border-0 px-3.5 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
              </div>
          </div>
      </div>
      `;
    case "Produit spécifique":
      return `
      <div class="items-center grid grid-cols-8 gap-4">
        <!-- conditions -->
        <div class=" col-span-2 w-full">
            <div>
                <label for="country" class="block  leading-6">Oérateurs</label>
                <select
                    class="operateur_value block w-full rounded-md border-0 px-3.5 py-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
                    <option value="">Choisir parmi les opérateurs</option>
                    ${optionSelect(
                      GLOBAL_CONFIG_RECO["list_operateur"],
                      operateur_value
                    )}
                </select>
            </div>
        </div>
        <!-- input value -->
        <div class="col-span-4  w-full">
            <label for="search" class="block  leading-6">Valeurs</label>
            <div class="relative">
                <input value="${
                  valeurs ?? ""
                }" type="search" id="search" placeholder="Saisir une valeur" name="valeurs" 
                    class="valeurs block w-full rounded-md border-0 px-3.5 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                <button type="button"
                    class=" absolute right-0 bottom-0.5 bg-[#98DFEF] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 ">
                    <svg class="w-4 h-4" aria-hidden=" true"
                        xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round"
                            stroke-linejoin="round" stroke-width="2"
                            d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                    </svg>
                </button>
            </div>
        </div>
    </div>
      
      `;
    case "Marque spécifique":
      return `
      
      `;
    case "Tranche d'âge":
      //Le bloc avec les 2 opérateurs + un champ valeurs
      return `
    <div class="items-center grid grid-cols-8">
  <!-- conditions -->
  <div class=" col-span-2 flex flex-col gap-4 w-full">
      <div>
          <label for="country" class="block  leading-6">Opérateurs</label>
          <select
              class="operateur_value block w-full rounded-md border-0 px-3.5 py-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
              <option value="">Choisir parmi les opérateurs</option>
              ${optionSelect(
                GLOBAL_CONFIG_RECO["list_operateur"],
                operateur_value
              )}
          </select>
      </div>
      <div>
          <label for="country" class=" block   leading-6">Opérateurs</label>
          <select
              class="operateur_value_inf block w-full rounded-md border-0 px-3.5 py-2 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
          <option value="">Choisir parmi les opérateurs</option>
              ${optionSelect(
                GLOBAL_CONFIG_RECO["list_operateur"],
                operateur_value_inf
              )}
          </select>
      </div>
  </div>
  <!-- accolades -->
  <div class=" flex justify-center w-full">
      <span class="text-sm font-semibold  ">
          <svg width="97" height="82" class="pt-4 w-full" viewBox="0 0 97 82"
              fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0.911133H68V80.9111H0" stroke="#FFC794"
                  stroke-opacity="0.75" />
              <path d="M97 39.9111H68" stroke="#FFC794" stroke-opacity="0.75" />
          </svg>
      </span>
  </div>
  <!-- input value -->
  <div class="col-span-2  w-full">
      <div>
          <label for="" class="block  leading-6">
              valeurs
          </label>
          <input value="${
            valeurs ?? ""
          }" placeholder="Saisir la note" type="text" name="valeurs"
              class="valeurs block w-full rounded-md border-0 px-3.5 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6">
      </div>
  </div>
  </div>
      `;
    default:
      return `
      `;
  }
}
