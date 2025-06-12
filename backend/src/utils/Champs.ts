import * as fs from "fs";
import * as path from "path";

interface Champ {
  name: string;
  role: string;
  position: string[];
  image: string;
  mana: string;
  region: string[];
  date: string;
}

const champs = fs.readFileSync(path.join(__dirname, "../data/Champs.json"));

async function getRandomChamps(): Promise<Champ> {
  const champions = JSON.parse(champs.toString());
  const randomChampion =
    champions.champs[Math.floor(Math.random() * champions.champs.length)];
  return randomChampion;
}

async function getAllChamps(): Promise<Champ[]> {
  const champions = JSON.parse(champs.toString());
  return champions.champs;
}

export { getRandomChamps, getAllChamps };
