import Character from "../js/Character";

export default class Vampire extends Character {
    constructor(level) {
        super(level, 'vampire');
        this.attack = 25;
        this.defence = 25;
        this.health = 100;
        this.maxHelth = 100;
        this.moveRadius = 2;
        this.attackRadius = 2
      }
}