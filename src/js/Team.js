import Character from './Character';
import Bowman from '../characters/Bowman';
import Swordsman from '../characters/Swordsman';
import Magician from '../characters/Magician';
import Daemon from '../characters/Daemon';
import Undead from '../characters/Undead';
import Vampire from '../characters/Vampire';

//const character = [new Swordsman(), new Bowman(), new Magician(), new Daemon(), new Undead(), new Vampire()]

/**
 * Класс, представляющий персонажей команды
 *
 * @todo Самостоятельно продумайте хранение персонажей в классе
 * Например
 * @example
 * ```js
 * const characters = [new Swordsman(2), new Bowman(1)]
 * const team = new Team(characters);
 *
 * team.characters // [swordsman, bowman]
 * ```
 * */
 export default class Team {
  constructor(player, allowedTypes) {
    this.player = player;
    this.allowedTypes = allowedTypes;
    this.members = new Set();
    this.point = 0
    if (!new.target) {
      throw new Error ("Team() must be called with new")
    };
  }

  set characters(characters) {
    this.members.clear();
    characters.forEach((character) => {
      this.members.add(character)
    })
  }

  get characters() {
    return Array.from(this.members);
  }

  get charactersCount() {
    return this.members.size;
  }

  get livingCharacters() {
    return this.characters.filter((character) => character.isLiving());
  }

  get livingCharactersCount() {
    return this.characters.reduce((count, character) => {
      if (character.isLiving()) count += 1;
      return count;
    }, 0);
  }

  addCharacter(character) {
    if (!(character instanceof Character)) {
      throw new Error('Character must be instance of Character or its children');
    }
    this.members.add(character);
  }

  addCharacters(characters) {
    characters.forEach((character) => this.addCharacter(character));
  }

  charactersLevelUp() {
    this.members.forEach((character) => {
      if (character.isLiving()) {
        character.restoreHealth();
        character.levelUp();
      }
    });
  }

  calcPoints() {
    this.points = this.characters.reduce((points, character) => {
      if (character.isLiving()) points += character.health;
      return points;
    }, this.points);
  }

  }

 export class User extends Team {
  constructor() {
    super('user', [Swordsman, Bowman, Magician]);
  }
}

export class Computer extends Team {
  constructor() {
    super('computer', [Daemon, Undead, Vampire]);
  }
}