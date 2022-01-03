// Which Pokemon R U?

//form contents
const submitButton = document.querySelector("#submit-character-form");
const pokemonTypeRbs = document.querySelectorAll('input[name="pokemon-type"]');
const holidayRbs = document.querySelectorAll('input[name="holiday"]');
const freeTimeRbs = document.querySelectorAll('input[name="free-time"]');

//pokemon card
let pokemonCard = document.querySelector(".pokemon-card");
let pokemonCardFront = document.querySelector(".pokemon-card-front");
let pokemonCardBack = document.querySelector(".pokemon-card-back");
let pokedexString = document.querySelector("#pokedex-number");
let pokemonName = document.querySelector("#name");
let pokemonImage = document.querySelector("#pokemon-img");
let pokemonType = document.querySelector("#pokemon-type");
let pokemonTypesBox = document.querySelector(".pokemon-types");
let flavorText = document.querySelector(".flavor-text");
let pokemonThumbnail = document.querySelector("#pokemon-thumbnail");
//combat stats
let hp = document.querySelector("#hp");
let spAttack = document.querySelector("#sp-attack");
let attack = document.querySelector("#attack");
let spDefence = document.querySelector("#sp-defence");
let defence = document.querySelector("#defence");
let speed = document.querySelector("#speed");
let ability = document.querySelector("#ability");

//event listeners
submitButton.addEventListener("click", getPokemonByCharacteristics);

// FORM FUNCTIONS //
async function getPokemonByCharacteristics() {
   let initialTypeValues = {
      fire: 0,
      water: 0,
      grass: 0,
   };

   let typeValues = updateTypeValues(initialTypeValues);
   console.log(typeValues)
   let pokemon = chooseMatchingPokemon(typeValues);

   pokemonCard.style.display = "initial";
   updateCard(pokemon);
}

function chooseMatchingPokemon(typeValues) {
   let personType = "unknown";
   let maxValue = -1000;
   for (type in typeValues) {
      if (typeValues[type] > maxValue) {
         maxValue = typeValues[type];
         personType = type;
      }
   }
   let pokemon;
   if (personType === "fire") {
      pokemon = "charizard";
   } else if (personType === "water") {
      pokemon = "squirtle";
   } else if (personType === "grass") {
      pokemon = "bulbasaur";
   }

   return pokemon;
}

function updateTypeValues(typeValues) {
   let updatedTypeValues = updateForTypeQuestion(typeValues);
   updatedTypeValues = updateForHolidayQuestion(updatedTypeValues);
   updatedTypeValues = updateForFreeTimeQuestion(updatedTypeValues);
   return updatedTypeValues;
}

function updateForTypeQuestion(typeValues) {
   let selectedValue;
   for (const rb of pokemonTypeRbs) {
      if (rb.checked) {
         selectedValue = rb.value;
         break;
      }
   }
   typeValues[selectedValue]++;

   return typeValues;
}

function updateForHolidayQuestion(typeValues) {
   let selectedValue;
   for (const rb of holidayRbs) {
      if (rb.checked) {
         selectedValue = rb.value;
         break;
      }
   }
   switch(selectedValue) {
      case "city": typeValues.fire++; break;
      case "beach": typeValues.water++; typeValues.fire += 0.5; break;
      case "mountains": typeValues.grass++; break;
      default: break;
   }
   return typeValues;
}

function updateForFreeTimeQuestion(typeValues) {
   let selectedValue;
   for (const rb of freeTimeRbs) {
      if (rb.checked) {
         selectedValue = rb.value;
         break;
      }
   }
   switch(selectedValue) {
      case "travel": typeValues.fire++; break;
      case "scuba-dive": typeValues.water += 1.1; break;
      case "roam": typeValues.grass+= 1.2; break;
      default: break;
   }
   return typeValues;
}


// CARD FUNCTIONS //

//// updates everything on the pokemon card
async function updateCard(pokemonIdentifier) {
   let pokemon = await getPokemon(pokemonIdentifier);
   console.log(pokemon);
   // create pokemon type and color array
   let pokemonTypeArray = pokemon.types.map((object) => object.type.name);
   let colorArray = pokemonTypeArray.map(typeToColor);
   // card front
   pokedexString.innerText = `Pokedex #${pokemon.id}`;
   pokemonName.innerText = capitaliseString(pokemon.name);
   pokemonImage.src =
      pokemon.sprites.other["official-artwork"]["front_default"];
   updateTypes(pokemonTypeArray, colorArray);
   changeBackgroundColor(colorArray);
   setFlavorText(pokemon);
   // card back
   pokemonThumbnail.src = pokemon.sprites.front_default;
   setCombatStats(pokemon);
   setAbility(pokemon);
}

//// Gets a pokemon from the API
async function getPokemon(pokemonIdentifier) {
   let response = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${pokemonIdentifier}`,
      {
         headers: { accept: "application/json" },
      }
   );
   return await response.json();
}

function capitaliseString(input) {
   let output;
   if (input === "") {
      output = "";
   } else {
      output = input.charAt(0).toUpperCase() + input.slice(1);
   }
   return output;
}
//// returns a color palette based on the type(s)
function typeToColor(type) {
   switch (type) {
      case "normal":
         return ["#C6C6A7", "#6D6D4E"];
         break;
      case "fire":
         return ["#F5AC78", "#9C531F"];
         break;
      case "grass":
         return ["#A7DB8D", "#4E8234"];
         break;
      case "water":
         return ["#9DB7F5", "#445E9C"];
         break;
      case "bug":
         return ["#C6D16E", "#6D7815"];
         break;
      case "ground":
         return ["#EBD69D", "#927D44"];
         break;
      case "dark":
         return ["#A29288", "#49392F"];
         break;
      case "flying":
         return ["#C6B7F5", "#6D5E9C"];
         break;
      case "ice":
         return ["#BCE6E6", "#638D8D"];
         break;
      case "dragon":
         return ["#A27DFA", "#4924A1"];
         break;
      case "rock":
         return ["#D1C17D", "#786824"];
         break;
      case "poison":
         return ["#C183C1", "#682A68"];
         break;
      case "electric":
         return ["#FAE078", "#A1871F"];
         break;
      case "fighting":
         return ["#D67873", "#7D1F1A"];
         break;
      case "steel":
         return ["#D1D1E0", "#787887"];
         break;
      case "psychic":
         return ["#FA92B2", "#A13959"];
         break;
      case "ghost":
         return ["#A292BC", "#493963"];
         break;
      case "fairy":
         return ["#F4BDC9", "#9B6470"];
         break;
      default:
         return ["#FFF", "#FFF"];
   }
}

//// add types to the DOM
function addTypesToCard(pokemonTypeArray, colorArray) {
   for (let i = 0; i < pokemonTypeArray.length; i++) {
      //add type box and styling
      let typeBox = document.createElement("div");
      typeBox.classList.add("pokemon-type-box");
      typeBox.style.backgroundColor = colorArray[i][1];
      pokemonTypesBox.append(typeBox);
      //add type text and styling
      let typeText = document.createElement("h5");
      typeBox.classList.add("type-text");
      typeText.innerText = pokemonTypeArray[i];
      typeBox.append(typeText);
   }
}

function updateTypes(pokemonTypeArray, colorArray) {
   //remove previous types from DOM
   while (pokemonTypesBox.firstChild) {
      pokemonTypesBox.removeChild(pokemonTypesBox.firstChild);
   }
   //add types to DOM
   addTypesToCard(pokemonTypeArray, colorArray);
}

////changes card background colour based on pokemon type(s)
function changeBackgroundColor(colorArray) {
   let linGrad;
   if (colorArray.length === 1) {
      linGrad = `linear-gradient(30deg, ${colorArray[0][0]}, ${colorArray[0][1]})`;
   } else {
      linGrad = `linear-gradient(-30deg, ${colorArray[0][0]}, ${colorArray[1][0]})`;
   }
   pokemonCardFront.style.background = pokemonCardBack.style.background =
      linGrad;
}

//// add flavor text from new API request
async function setFlavorText(pokemon) {
   let responseSpecies = await fetch(pokemon.species.url);
   let dataSpecies = await responseSpecies.json();

   let flavorTexts = dataSpecies.flavor_text_entries;
   const englishFound = flavorTexts.find(
      (flavorText) => flavorText.language.name === "en"
   );
   const flavorTextString = englishFound.flavor_text;
   flavorText.innerText = flavorTextString
      .replace(/\n/g, " ")
      .replace(/\f/g, " ");
}

function setCombatStats(pokemon) {
   let stats = pokemon.stats;
   hp.innerText = stats[0].base_stat;
   spAttack.innerText = stats[3].base_stat;
   attack.innerText = stats[1].base_stat;
   spDefence.innerText = stats[4].base_stat;
   defence.innerText = stats[2].base_stat;
   speed.innerText = stats[5].base_stat;
}

function setAbility(pokemon) {
   ability.innerText = `Ability: ${capitaliseString(
      pokemon.abilities[0].ability.name
   )}`;
}




