import themes from "./themes";
import Character from './Character';
import Bowman from '../characters/Bowman';
import Swordsman from '../characters/Swordsman';
import Magician from '../characters/Magician';
import Daemon from '../characters/Daemon';
import Undead from '../characters/Undead';
import Vampire from '../characters/Vampire';

import GamePlay from './GamePlay';
import GameState from './GameState';
import { User, Computer } from './Team';
import { generateCharacters, generatePositionedCharacters, characterGenerator } from './generators';
//import { calcActionPositions, randomItem } from './utils';
//import messages from './messages';
//import CharacterTypes from './character-types';


export default class GameController {
    constructor(gamePlay, stateService) {
      this.gamePlay = gamePlay;
      this.stateService = stateService;
    }
  
    init() {
      this.gamePlay.drawUi(themes.prairie)
      // TODO: add event listeners to gamePlay events
      // TODO: load saved stated from stateService
    }
  
    onCellClick(index) {
      // TODO: react to click
    }
  
    onCellEnter(index) {
      // TODO: react to mouse enter
    }
  
    onCellLeave(index) {
      // TODO: react to mouse leave
    }
  }