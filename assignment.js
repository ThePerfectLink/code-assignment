import { fetchDogs } from "./api/fetchDogs.js";
import { getValidUserName } from "./inputs/getValidUserName.js";
import { friends } from "./friend-collections.js";
import { sortedAlphabet } from "./sortedAlphabet.js";

async function main() {
  const dogBreeds = await fetchDogs();
  if (!dogBreeds) {
    console.log("Could not generate dog breed list, please try again later");
    return;
  }
  var orderedDogBreeds = Object.keys(dogBreeds);
  orderedDogBreeds.sort()

  const dogsPhotographed = () => {
    var list = [];
    for(var friend in friends) {
      list = list.concat(friends[friend]["breedPhotos"]);
    }
    return list;
  }

  // Get inputs from user...
  const data = await getValidUserName();

  // Calculate days amount of days to take photos for 
  var date = Date.parse(data[1]);
  const todaysDate = new Date();
  todaysDate.setHours(0, 0, 0, 0);
  date = (date - todaysDate)/1000/60/60/24;

  const toShoot = await findBreeds(orderedDogBreeds, date, data[2].toLowerCase(), dogsPhotographed());

  console.log(`Here is the list of breeds you need to take photos of: `);
  console.log(toShoot);
  main();
}

async function findBreeds(breeds, cap, char, taken) {
  var searchList = [];
  var retList = [];
  var alphabet = sortedAlphabet;
  let startingChar = char;
  alphabet.splice(alphabet.indexOf(startingChar),1);
  for(var i = 0; i < cap && i < breeds.length;) {
    searchList = await getBreedsStartingWith(breeds, startingChar) || [];
    if(searchList) {
      for(var j = 0; j<searchList.length && i < cap && i < breeds.length; j++) {
        if(!taken.includes(searchList[j]) && !retList.includes(searchList[j])){
          retList.push(searchList[j]);
          i++
        }
      }
    }
    startingChar = alphabet[Math.floor(Math.random()*alphabet.length)];
    alphabet.splice(alphabet.indexOf(startingChar),1);
  }

  return retList;
}

async function getBreedsStartingWith(breeds, char) {
  const charReg = new RegExp(char);
  const reg = new RegExp(/^/.source + charReg.source +/[a-z ]+/.source, 'gm');
  return breeds.join('\n').match(reg);
}

main();
