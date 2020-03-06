export class Controller {
    constructor(game, view) {
        this.game = game;
        this.view = view;
    }

    handleEvent(event) {
        switch (event.type) {
            case 'mousemove':
                return this.handleMouseMove(event);
            case 'click':
                return this.handleMouseClick(event);
            case 'keydown':
                return this.handleKeyDown(event);
        }
    }

    movePlayerOrCursor(dx, dy) {
        if (this.view.showInventory && dx === 0) {
            this.view.moveInventoryCursor(dy);
        } else if (this.view.showCursor) {
            this.view.moveCursor(dx, dy);
        } else {
            let actionPerformed = this.game.movePlayer(dx, dy);
            if (actionPerformed && this.game.player.activePokerPlayerRole && !this.view.showPokerView) {
                this.view.togglePokerView();
            }

            return actionPerformed;
        }
    }

    handleKeyDown(event) {
        console.log(event.keyCode);
        let player = this.game.player;
        let playerTookAction = false;
        switch (event.keyCode) {
            case 32: // space
                this.game.playerPasses();
                playerTookAction = true;
                break;
            case 33:
                playerTookAction = this.movePlayerOrCursor(1, -1);
                break;
            case 34:
                playerTookAction = this.movePlayerOrCursor(1, 1);
                break;
            case 35:
                playerTookAction = this.movePlayerOrCursor(-1, 1);
                break;
            case 36:
                playerTookAction = this.movePlayerOrCursor(-1, -1);
                break;
            case 37:
                playerTookAction = this.movePlayerOrCursor(-1, 0);
                break;
            case 38:
                playerTookAction = this.movePlayerOrCursor(0, -1);
                break;
            case 39:
                playerTookAction = this.movePlayerOrCursor(1, 0);
                break;
            case 40:
                playerTookAction = this.movePlayerOrCursor(0, 1);
                break;
            case 27: // esc
                this.view.clearControls();
                break;
            case 9: // tab
                event.preventDefault();
                this.view.cycleTargets();
                break;
            case 73: // i
                this.view.toggleInventory();
                break;
            case 80:
                this.view.togglePokerView();
                break;
            case 67: // c
                if (player.activePokerPlayerRole && player.activePokerPlayerRole.canCheck()) {
                    player.activePokerPlayerRole.check();
                    player.activePokerPlayerRole.game.activePlayer = player.activePokerPlayerRole.game.getNextPlayer(player.activePokerPlayerRole, true);
                    playerTookAction = true;
                }
                break;
            case 66: // b
                if (player.activePokerPlayerRole && player.activePokerPlayerRole.canCall()) {
                    player.activePokerPlayerRole.bet(this.view.tempBetValue);
                    player.activePokerPlayerRole.game.activePlayer = player.activePokerPlayerRole.game.getNextPlayer(player.activePokerPlayerRole, true);
                    playerTookAction = true;
                }
                break;
            case 70: // f
                if (player.activePokerPlayerRole && player.activePokerPlayerRole.canFold()) {
                    player.activePokerPlayerRole.fold();
                    player.activePokerPlayerRole.game.activePlayer = player.activePokerPlayerRole.game.getNextPlayer(player.activePokerPlayerRole, true);
                    playerTookAction = true;
                }
                break;
            case 83: // s
                if (player.activePokerPlayerRole && player.activePokerPlayerRole.canReveal()) {
                    player.activePokerPlayerRole.revealCards();
                    player.activePokerPlayerRole.game.activePlayer = player.activePokerPlayerRole.game.getNextPlayer(player.activePokerPlayerRole, true);
                    playerTookAction = true;
                }
                break;
            case 68: // s
                if (player.activePokerPlayerRole && player.activePokerPlayerRole.isDealer() && player.activePokerPlayerRole.game.waitingForDealerAction) {
                    player.activePokerPlayerRole.deal();
                    playerTookAction = true;
                }
                break;
            case 189: // minus
                if (player.activePokerPlayerRole && player.activePokerPlayerRole.canCall()) {
                    this.view.tempBetValue -= 100;
                }
                break;
            case 187: // plus
                if (player.activePokerPlayerRole && player.activePokerPlayerRole.canCall()) {
                    this.view.tempBetValue += 100;
                }
                break;
            case 69: // e
                // equip or unequip
                if (this.view.showInventory) {
                    let selectedItem = player.inventory[this.view.inventoryCursor];
                    if (selectedItem && selectedItem.isWeapon) {
                        if (selectedItem !== player.getCurrentWeapon()) {
                            player.equip(selectedItem);
                            playerTookAction = true;
                        } else {
                            player.unequip();
                            playerTookAction = true;
                        }
                    }
                }
                break;
            case 82: // r
                // reload
                if (player.canReload()) {
                    player.reload();
                    playerTookAction = true;
                }
                break;

        }
        if (playerTookAction) {
            this.game.playTurn();
        }
        this.view.drawMap();
        this.view.drawOverlay();
    }

    handleMouseMove(event) {
        let coords = this.view.display.eventToPosition(event);
        let updated = this.view.updateMouseCoords(coords);
        if (updated) {
            this.view.drawMap();
        }
    }

    handleMouseClick(event) {
        let coords = this.view.display.eventToPosition(event);
        //console.log('You clicked ' + coords);
    }

}