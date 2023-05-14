import Character from "../js/Character";

export default class Daemon extends Character {
    constructor(level) {
        super(level, 'daemon');
        this.attack = 10;
        this.defence = 10;
        this.health = 100;
        this.maxHelth = 100;
        this.moveRadius = 1;
        this.attackRadius = 4
      }
}