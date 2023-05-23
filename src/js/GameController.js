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
import { characterGenerator, generateTeam, generatePositions, generatePositionedCharacters } from './generators';
import { calcActionPositions, randomItem } from './utils';
import PositionedCharacter from "./PositionedCharacter";
import messages from './messages';
import CharacterTypes from "./CharacterType";
import emoji from "./emoji";
import cursors from "./cursor";


export default class GameController {
    constructor(gamePlay, stateService) {
      this.gamePlay = gamePlay;
      this.stateService = stateService;
      this.gameState = new GameState()

    }
  
    init() {
      this.gamePlay.drawUi(this.gameState.theme)

      this.gamePlay.addNewGameListener(this.onNewGame.bind(this));
      this.gamePlay.addSaveGameListener(this.onSaveGame.bind(this));
      this.gamePlay.addLoadGameListener(this.onLoadGame.bind(this));
      this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
      this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
      this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
      // TODO: add event listeners to gamePlay events
      // TODO: load saved stated from stateService
    }
    onNewGame() {
      this.gameState.round = 1;
      this.gameState.user = new User();
      this.gameState.computer = new Computer();
  
      this.newRoundInit();
      GamePlay.showMessage(messages.code101);
      this.boardUnlocked = true;
    }

    onSaveGame() {
      const save = {
        theme: this.gameState.theme,
        round: this.gameState.round,
        user: {
          player: this.gameState.user.player,
          points: this.gameState.user.points,
        },
        computer: {
          player: this.gameState.computer.player,
          points: this.gameState.computer.points,
        },
        positionedCharacters: this.gameState.positionedCharacters,
        activePlayer: this.gameState.activePlayer,
        statistics: this.gameState.statistics,
      };
  
      this.stateService.save(GameState.from(save));
      GamePlay.showMessage(messages.code102);
    }

    onLoadGame() {
      const load = this.stateService.load();
  
      if (!load) {
        GamePlay.showMessage(messages.code301);
        return false;
      }
  
      this.gameState.user = new User();
      this.gameState.computer = new Computer();
  
      this.gameState.theme = load.theme;
      this.gameState.round = load.round;
      this.gameState.user.player = load.user.player;
      this.gameState.user.points = load.user.points;
      this.gameState.computer.player = load.computer.player;
      this.gameState.computer.points = load.computer.points;
      this.gameState.activePlayer = load.activePlayer;
      this.gameState.statistics = load.statistics;
  
      this.gameState.positionedCharacters = load.positionedCharacters
        .map((positionedCharacter) => {
          const { player, position } = positionedCharacter;
          const {
            type, level, attack, defence, health, maxHealth,
          } = positionedCharacter.character;
          const character = new CharacterTypes[type](level);
          character.attack = attack;
          character.defence = defence;
          character.health = health;
          character.maxHealth = maxHealth;
  
          if (player === load.user.player) {
            this.gameState.user.addCharacter(character);
          } else {
            this.gameState.computer.addCharacter(character);
          }
  
          return { character, position, player };
        });
  
      this.gamePlay.drawUi(this.gameState.theme);
      this.gamePlay.redrawPositions(this.gameState.positionedCharacters);
  
      GamePlay.showMessage(messages.code103);
      if (this.gameState.activePlayer === this.gameState.user.player) {
        this.boardUnlocked = true;
      } else {
        this.activateComputer();
      }
  
      return true;
    }
  
    onCellClick(index) {
      // TODO: react to click
      if (!this.boardUnlocked) {
        GamePlay.showMessage(messages.code301);
        return;
      }
  
      if (!this.isUsersActivePlayer()) {
        GamePlay.showMessage(messages.code302);
        return;
      }
  
      this.actionWithCell(index, () => {
        // Сell is empty, users character is not selected
        GamePlay.showError(messages.code303);
      }, () => {
        // Cell is empty, users character is selected
        if (!this.canMove(index)) {
          GamePlay.showError(messages.code304);
          return;
        }
  
        this.gamePlay.deselectCell(this.selectedCharacter.position);
        this.gamePlay.deselectCell(index);
        this.moveCharacter(index);
        this.activateComputer();
      }, (innerCharacter) => {
        // Сell is not empty, users character is not selected
        if (!this.isInnerUsersCharacter(innerCharacter)) {
          GamePlay.showError(messages.code305);
          return;
        }
  
        this.gamePlay.selectCell(index);
        this.selectCharacter(index, innerCharacter);
      }, (innerCharacter) => {
        // Сell is not empty, users character is selected
        if (this.isInnerUsersCharacter(innerCharacter)) {
          this.gamePlay.deselectCell(this.selectedCharacter.position);
          this.gamePlay.selectCell(index);
          this.selectCharacter(index, innerCharacter);
          return;
        }
  
        if (!this.canAttack(index)) {
          GamePlay.showError(messages.code306);
          return;
        }
  
        this.gamePlay.deselectCell(this.selectedCharacter.position);
        this.gamePlay.deselectCell(index);
        this.attackCharacter(index, innerCharacter, () => {
          if (this.hasRoundWinner()) {
            this.roundUp();
            return;
          }
  
          this.activateComputer();
        });
      });
      
    }
  
    onCellEnter(index) {
      // TODO: react to mouse enter
      if (!this.boardUnlocked || !this.isUsersActivePlayer()) {
        this.gamePlay.setCursor('not-allowed');
        return;
      }
  
      this.actionWithCell(index, () => {
        // Сell is empty, users character is not selected
        this.gamePlay.setCursor('not-allowed');
      }, () => {
        // Cell is empty, users character is selected
        if (!this.canMove(index)) {
          this.gamePlay.setCursor('not-allowed');
          return;
        }
  
        this.gamePlay.selectCell(index, 'green');
        this.gamePlay.setCursor('pointer');
      }, (innerCharacter) => {
        // Сell is not empty, users character is not selected
        this.gamePlay.showCellTooltip(innerCharacter.character.message, index);
  
        if (this.isInnerUsersCharacter(innerCharacter)) {
          this.gamePlay.setCursor('pointer');
          return;
        }
  
        this.gamePlay.setCursor('not-allowed');
      }, (innerCharacter) => {
        // Сell is not empty, users character is selected
        this.gamePlay.showCellTooltip(innerCharacter.character.message, index);
  
        if (this.isInnerUsersCharacter(innerCharacter)) {
          this.gamePlay.setCursor('pointer');
          return;
        }
  
        if (!this.canAttack(index)) {
          this.gamePlay.setCursor('not-allowed');
          return;
        }
  
        this.gamePlay.selectCell(index, 'red');
        this.gamePlay.setCursor('crosshair');
      });
    }
  
    onCellLeave(index) {
      // TODO: react to mouse leave
      if (!this.boardUnlocked) return;

    this.gamePlay.hideCellTooltip(index);

    if (this.selectedCharacter && index !== this.selectedCharacter.position) {
      this.gamePlay.deselectCell(index);
    }
    }

    actionWithCell(index, callback1, callback2, callback3, callback4) {
      // Сell is empty, users character is not selected
      if (!this.isInnerCharacter(index) && !this.selectedCharacter) {
        callback1();
        return;
      }
  
      // Cell is empty, users character is selected
      if (!this.isInnerCharacter(index) && this.selectedCharacter) {
        callback2();
        return;
      }
  
      const innerCharacter = this.gameState.positionedCharacters
        .find((positionedCharacter) => positionedCharacter.position === index);
  
      // Сell is not empty, users character is not selected
      if (!this.selectedCharacter) {
        callback3(innerCharacter);
        return;
      }
  
      // Сell is not empty, users character is selected
      if (this.selectedCharacter) {
        callback4(innerCharacter);
      }
    }
  
    selectCharacter(index, innerCharacter) {
      this.selectedCharacter = innerCharacter;
      this.movePositions = calcActionPositions(index, innerCharacter.character.moveRadius, this.gamePlay.boardSize);
      this.attackPositions = calcActionPositions(index, innerCharacter.character.attackRadius, this.gamePlay.boardSize);
    }
  
    moveCharacter(index) {
      this.selectedCharacter.position = index;
      this.selectedCharacter = null;
      this.gamePlay.redrawPositions(this.gameState.positionedCharacters);
    }
  
    attackCharacter(index, innerCharacter, callback) {
      const damage = Math.round(Math.max(
        this.selectedCharacter.character.attack - innerCharacter.character.defence,
        this.selectedCharacter.character.attack * 0.1,
      ));
  
      this.boardUnlocked = false;
      this.gamePlay.showDamage(index, damage).then(() => {
        const characterToAttack = innerCharacter.character;
        characterToAttack.health -= damage;
        this.gameState.positionedCharacters = this.gameState.positionedCharacters
          .filter((positionedCharacter) => positionedCharacter.character.health > 0);
        this.selectedCharacter = null;
        this.gamePlay.redrawPositions(this.gameState.positionedCharacters);
        this.boardUnlocked = true;
        callback();
      });
    }
  
    isInnerCharacter(index) {
      const innerCell = this.gamePlay.cells[index].innerHTML;
      return (innerCell.indexOf('character') !== -1);
    }
  
    isInnerUsersCharacter(innerCharacter) {
      return (innerCharacter.player === this.gameState.user.player);
    }
  
    isUsersActivePlayer() {
      return (this.gameState.activePlayer === this.gameState.user.player);
    }
  
    canMove(index) {
      return (this.movePositions.indexOf(index) !== -1);
    }
  
    canAttack(index) {
      return (this.attackPositions.indexOf(index) !== -1);
    }
  
    activateComputer() {
      this.gameState.activePlayer = this.gameState.computer.player;
  
      // Select random computer character
      const computerPositionedCharacter = randomItem(
        this.gameState.positionedCharacters
          .filter((positionedCharacter) => positionedCharacter.player === this.gameState.computer.player),
      );
      this.selectCharacter(computerPositionedCharacter.position, computerPositionedCharacter);
  
      // Computer character is trying to attack users character
      // If an attack is not possible, then computer character moves
      const usersCharacterToAttack = this.getUsersCharacterToAttack();
  
      if (!usersCharacterToAttack) {
        const positionToMoveComputer = this.getPositionToMoveComputer();
        this.moveCharacter(positionToMoveComputer);
        this.gameState.activePlayer = this.gameState.user.player;
        return;
      }
  
      this.attackCharacter(usersCharacterToAttack.position, usersCharacterToAttack, () => {
        if (this.hasRoundWinner()) {
          this.roundUp();
          return;
        }
  
        this.gameState.activePlayer = this.gameState.user.player;
      });
    }
  
    getUsersCharacterToAttack() {
      const usersPositionedCharacters = this.gameState.positionedCharacters
        .filter((positionedCharacter) => positionedCharacter.player === this.gameState.user.player);
  
      return usersPositionedCharacters
        .find((userPositionedCharacter) => (this.attackPositions.indexOf(userPositionedCharacter.position) !== -1));
    }
  
    getPositionToMoveComputer() {
      const allowedMovePositions = this.movePositions
        .filter((movePosition) => !this.isInnerCharacter(movePosition));
  
      return randomItem(allowedMovePositions);
    }
  
    roundUp() {
      const roundWinner = this.hasRoundWinner();
      roundWinner.calcPoints();
      this.gameState.round += 1;
  
      if (this.gameState.round > 4) {
        let gameWinner = this.gameState.user;
  
        if (this.gameState.user.points < this.gameState.computer.points) {
          gameWinner = this.gameState.computer;
        }
  
        this.gameState.statistics.push({
          player: gameWinner.player,
          points: gameWinner.points,
        });
        GamePlay.showMessage(`${messages.code104} ${gameWinner.player} (${gameWinner.points} points)`);
        this.gamePlay.drawUi(this.gameState.theme);
        this.boardUnlocked = false;
        console.log(this.gameState.statistics);
        return;
      }
  
      GamePlay.showMessage(`${messages.code105} ${roundWinner.player} (${roundWinner.points} points)`);
      this.newRoundInit();
    }
  
    hasRoundWinner() {
      if (this.gameState.user.livingCharactersCount === 0) {
        return this.gameState.computer;
      }
  
      if (this.gameState.computer.livingCharactersCount === 0) {
        return this.gameState.user;
      }
  
      return null;
    }
  
    usersTeamUpdate() {
      if (this.gameState.round === 1) {
        this.gameState.user.characters = [new Bowman(1), new Swordsman(1)];
        return;
      }
  
      this.gameState.user.characters.forEach((character) => {
        character.levelUp();
        character.restoreHealth();
      });
  
      if (this.gameState.round === 2) {
        const randomCharacter = characterGenerator(this.gameState.user.allowedTypes, 1).next().value;
        this.gameState.user.addCharacter(randomCharacter);
        return;
      }
      
      /*const randomCharacter = characterGenerator(this.gameState.user.allowedTypes, maxLevel, 2);
      this.gameState.user.addCharacter(randomCharacter);*/
      const maxLevel = this.gameState.round - 1;
      const randomCharacters = generateTeam(this.gameState.user.allowedTypes, maxLevel, 2);
      this.gameState.user.addCharacters(randomCharacters);
    }
  
    computersTeamUpdate() {
      const maxLevel = this.gameState.round;
      const charactersCount = this.gameState.user.livingCharactersCount;
      const randomCharacters = generateTeam(this.gameState.computer.allowedTypes, maxLevel, charactersCount);
      this.gameState.computer.characters = randomCharacters;
    }
  
    newRoundInit() {
      this.gameState.theme = themes[`round${this.gameState.round}`];
      this.gamePlay.drawUi(this.gameState.theme);
  
      this.usersTeamUpdate();
      this.computersTeamUpdate();
  
      this.gameState.positionedCharacters = generatePositionedCharacters(
        this.gameState.user,
        this.gameState.computer,
        this.gamePlay.boardSize,
      );
  
      this.gamePlay.redrawPositions(this.gameState.positionedCharacters);
      this.gameState.activePlayer = this.gameState.user.player;
      this.selectedCharacter = null;
    }
  
  }

  