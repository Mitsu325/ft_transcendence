import { Injectable } from '@nestjs/common';
import { MatchScore, Room } from './interfaces/game.interface';

@Injectable()
export class ScoresService {
    private courtDimensions;

    constructor() {
        this.courtDimensions = { width: 580, height: 320 };
    }

    async handleScores(room: Room): Promise<MatchScore> {
        const updatedScores: MatchScore = { ...room.scores };

        if (room.ball.x < room.ball.width) {
            updatedScores.score2++;
            room.ball.x = this.courtDimensions.width / 2;
            room.ball.y = this.courtDimensions.height / 2;
        }

        if (room.ball.x > this.courtDimensions.width - room.ball.width) {
            updatedScores.score1++;
            room.ball.x = this.courtDimensions.width / 2;
            room.ball.y = this.courtDimensions.height / 2;
        }
        return updatedScores;
    }
}
