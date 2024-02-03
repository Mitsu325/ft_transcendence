import { Injectable } from '@nestjs/common';
import { MatchPaddle, Paddle } from './interfaces/game.interface';

@Injectable()
export class PaddlesMoverService {
    private courtDimensions;

    constructor() {
        this.courtDimensions = { width: 580, height: 320 };
    }

    async movePaddle(
        paddle: Paddle,
        matchPaddles: MatchPaddle,
        player: string,
    ): Promise<MatchPaddle> {
        const updatedPaddles: MatchPaddle = { ...matchPaddles };

        if (paddle.key === 'ArrowUp') {
            if (player === '1') {
                updatedPaddles.player1.y -=
                    5 * matchPaddles.player1.playerSpeed;
            } else {
                updatedPaddles.player2.y -=
                    5 * matchPaddles.player1.playerSpeed;
            }
        } else if (paddle.key === 'ArrowDown') {
            if (player === '1') {
                updatedPaddles.player1.y +=
                    5 * matchPaddles.player1.playerSpeed;
            } else {
                updatedPaddles.player2.y +=
                    5 * matchPaddles.player1.playerSpeed;
            }
        }

        if (player === '1' && updatedPaddles.player1.y < 5)
            updatedPaddles.player1.y = 2;
        if (player === '2' && updatedPaddles.player2.y < 5)
            updatedPaddles.player2.y = 2;
        if (
            player === '1' &&
            updatedPaddles.player1.y > this.courtDimensions.height - 50
        )
            updatedPaddles.player1.y = this.courtDimensions.height - 50;
        if (
            player === '2' &&
            updatedPaddles.player2.y > this.courtDimensions.height - 50
        )
            updatedPaddles.player2.y = this.courtDimensions.height - 50;

        return updatedPaddles;
    }
}
