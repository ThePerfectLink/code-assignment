import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cacheFileName = "dog-cache.json";
const cacheFilePath = path.join(__dirname, cacheFileName);

export async function fetchDogs() {
  const cachedData = null;
  try{
    cachedData = await readCache();
    return cachedData;
  } catch {
    try {
      const resp = await fetch("https://dog.ceo/api/breeds/list/all");
      const dogList = await resp.json();
      const flatList = await writeCache(dogList);
      return flatList;
    } catch (err) {
      console.log(
        `There was a problem fetching dog breed data from the DogAPI, please try again later`,
      );
      return ;
    }
  }
}

function flatten(data) {
  var out = {};
  for(var grouping in data) {
    if(data[grouping].length != 0) {
      for(var breed in data[grouping]) {
        out[data[grouping][breed] + " " + grouping] = [];
      }
    } else {
      out[grouping] = [];
    }
  }
  return out;
}

async function readCache() {
  return fs.readFileSync(cacheFilePath, 'utf8', (error, data) => {
    if(error) {
      console.log(error);
      return null;
    }
    else if (data.length != 0 ){
      return JSON.parse(JSON.parse(data));
    }
    return null;
  })
}

async function writeCache(data) {
  const flat = flatten(data["message"]);
 
  fs.writeFileSync(cacheFilePath, JSON.stringify(flat));
  return flat;
}
