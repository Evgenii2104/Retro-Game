import Character from "../js/Character";

export default class Undead extends Character {
    constructor(...args) {
        super(...args);
        this.attack = 40;
        this.defence = 10;
      }
}