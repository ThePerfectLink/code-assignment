import { fetchDogs } from "./api/fetchDogs.js";
import { getValidUserName } from "./inputs/getValidUserName.js";
import { friends } from "./friend-collections.js";
import { sortedAlphabet } from "./sortedAlphabet.js";
//import {modifierNames, foregroundColorNames} from 'ansi-styles';
import styles from 'ansi-styles';
const MAX_LENGTH = 30;

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
  var date = new Date(Date.parse(data[1]));

  const toShoot = await findBreeds(orderedDogBreeds, data[2].toLowerCase(), dogsPhotographed());
  console.log("\n",styles.blueBright.open, "Here is the list of breeds you need to take photos of:", styles.blueBright.close);
  console.log(" ".repeat(19) + '_'.repeat(MAX_LENGTH));
  for(var dog in toShoot) {
    console.log(styles.green.open, date.toDateString(), styles.green.close, ":" + ' '.repeat(Math.floor(((MAX_LENGTH)-toShoot[dog].length)/2)) + toShoot[dog] + ' '.repeat(Math.ceil(((MAX_LENGTH)-toShoot[dog].length)/2)) + ":");
    date.setDate(date.getDate()+1);
  }
  console.log(" ".repeat(19) + '‾'.repeat(MAX_LENGTH) + '\n');
  main();
}

async function findBreeds(breeds, char, taken) {
  var searchList = [];
  var retList = [];
  var alphabet = sortedAlphabet;
  var startingChar = char;
  alphabet.splice(alphabet.indexOf(startingChar),1);
  for(var i = 0; i < breeds.length - taken.length;) {
    searchList = await getBreedsStartingWith(breeds, startingChar);
    if(searchList) {
      for(var j = 0; j < searchList.length && i < breeds.length - taken.length; j++) {
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
  return await breeds.join('\n').match(reg);
}

main();
