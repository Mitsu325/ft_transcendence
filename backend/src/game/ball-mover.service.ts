import { Injectable } from '@nestjs/common';
import { Room } from './interfaces/game.interface';

@Injectable()
export class BallMoverService {
    private courtDimensions;

    constructor() {
        this.courtDimensions = { width: 580, height: 320 };
    }

    async moveBall(room: Room): Promise<void> {
        const xPos =
            room.ball.x + room.ball.xSpeed * room.ball.xDirection * room.level;
        const yPos =
            room.ball.y + room.ball.ySpeed * room.ball.yDirection * room.level;

        room.ball.x = xPos;
        room.ball.y = yPos;

        if (xPos < 15 || xPos > this.courtDimensions.width - 15) {
            room.scores = await room.scoresService.handleScores(room);
        }

        if (room.ball.x < 15) {
            if (
                room.ball.y > room.paddles.player1.y - 5 &&
                room.ball.y < room.paddles.player1.y + 55
            ) {
                room.ball.xDirection *= -1;
            }
        }

        if (room.ball.x > this.courtDimensions.width - 15) {
            if (
                room.ball.y > room.paddles.player2.y - 5 &&
                room.ball.y < room.paddles.player2.y + 55
            ) {
                room.ball.xDirection *= -1;
            }
        }

        if (
            xPos > this.courtDimensions.width - room.ball.width ||
            xPos < room.ball.width
        ) {
            room.ball.xDirection *= -1;
        }

        if (
            yPos > this.courtDimensions.height - room.ball.width ||
            yPos < room.ball.width
        ) {
            room.ball.yDirection *= -1;
        }
        return void 0;
    }
}
