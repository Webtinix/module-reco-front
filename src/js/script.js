var GLOBAL_CONFIG = [];

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
  // visibilityBlock("list-zone-reco"); remettre celui ci c'est le bon
  visibilityBlock("focus-reco");

  if (listReco.length > 0) {
    //blockListZoneReco.a
    const content = blockListZoneReco.find(".content-list-zone");
    listReco.map((data) => content?.append(cardZone(data)));
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
    //on fera la requête pour récupérer toutes les zones reco de la db ici pour les mettre dans zoneREco
    //
    const zoneReco = [];
    GLOBAL_CONFIG = zoneReco;
    return zoneReco;
  }
}

//ajouter une nouvelle zone
async function addNewZone() {
  //
  visibilityBlock("focus-reco");
}

//modifier une zone reco
async function editZoneReco(id) {
  if (id) {
  }
}

//supprimer une zone reco
async function deleteZoneReco(id) {
  if (id) {
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
                    class="w-52 h-[14rem] max-w-sm p-6 gap-4 flex flex-col items-center justify-center bg-[#98DFEF] bg-opacity-25 border border-gray-200 rounded-lg shadow">
                    <img src="./icons/addButton.png" class="h-40" alt="add Button">
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

/* function focus-reco */

function z() {}
