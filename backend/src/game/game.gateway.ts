import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GameService } from './game.service';
import {
    CreateRoom,
    Game,
    MatchPaddle,
    Paddle,
    Player,
    Room,
} from './interfaces/game.interface';
import { BallMoverService } from './ball-mover.service';
import { ScoresService } from './scores.service';
import { PaddlesMoverService } from './paddles-mover.service';

@WebSocketGateway({ cors: { origin: 'http://localhost:3000' } })
export class GamePong implements OnGatewayConnection, OnGatewayDisconnect {
    private game: Game;
    private readonly initialPaddles: MatchPaddle;
    private readonly initialScores;
    private readonly initialBall;

    @WebSocketServer()
    server: Server;

    constructor(private readonly gameService: GameService) {
        this.game = {
            players: {},
            rooms: {},
        };
        this.initialPaddles = {
            player1: { y: 135, playerSpeed: 1.5 },
            player2: { y: 135, playerSpeed: 1.5 },
        };
        this.initialScores = { score1: 0, score2: 0 };
        this.initialBall = {
            x: 580 / 2,
            y: 320 / 2,
            width: 5,
            xDirection: 1,
            yDirection: 1,
            xSpeed: 2.8,
            ySpeed: 2.2,
        };
    }

    handleConnection() {}

    handleDisconnect(client: Socket) {
        const playerId = this.game.players[client.id]?.id;
        const roomId = this.gameService.findRoomByPlayerId(playerId, this.game);

        if (roomId) {
            this.game.rooms[roomId].isRunning = false;
            if (this.game.rooms[roomId].player2) {
                const battle = this.gameService.getDataBattle(
                    roomId,
                    this.game,
                );
                this.gameService.saveBattle(battle);
            }
            this.gameService.removeRoomAndNotify(
                roomId,
                playerId,
                this.game,
                this.server,
            );
            client.leave(roomId);
        }
        if (playerId) {
            delete this.game.players[client.id];
        }
        this.server.emit('game', this.game);
    }

    @SubscribeMessage('CreateRoom')
    handleCreateRoom(
        @MessageBody() { user, guestId }: CreateRoom,
        @ConnectedSocket() client: Socket,
    ) {
        if (!this.game.rooms[client.id]) {
            client.join(client.id);
            this.game.rooms[client.id] = {
                room_id: client.id,
                player1: { ...user },
                player2: null,
                paddles: JSON.parse(JSON.stringify(this.initialPaddles)),
                paddlesService: null,
                scores: JSON.parse(JSON.stringify(this.initialScores)),
                scoresService: null,
                ball: this.initialBall,
                ballService: null,
                isRunning: false,
                level: 1,
                guestId,
            };
            this.server.emit('game', this.game);
            this.server.emit('cleanRoom', this.game.rooms[client.id]);
        }
    }

    @SubscribeMessage('GetInRoom')
    handleGetInRoom(
        @MessageBody() room: Room,
        @ConnectedSocket() client: Socket,
    ) {
        const playerAlreadyInRoom = Object.values(this.game.rooms).find(
            existingRoom =>
                existingRoom.player1.id === room.player2.id ||
                (existingRoom.player2 &&
                    existingRoom.player2.id === room.player2.id),
        );

        if (
            !playerAlreadyInRoom &&
            this.game.rooms[room.room_id].player2 === null
        ) {
            client.join(room.room_id);
            this.game.rooms[room.room_id].player2 = { ...room.player2 };
            this.server.emit('game', this.game);
            this.server
                .to(room.room_id)
                .emit(
                    'players',
                    this.game.rooms[room.room_id].player1,
                    this.game.rooms[room.room_id].player2,
                );
            this.game.rooms[room.room_id].isRunning = true;
        } else {
            console.log('The Player is already in the room:', client.id);
        }
    }

    @SubscribeMessage('requestRoomOpen')
    handleRequestRoomOpen(@ConnectedSocket() client: Socket) {
        if (Object.values(this.game.rooms).length > 0) {
            for (const room in this.game.rooms) {
                if (this.game.rooms[room].player2 === null) {
                    this.server.emit('game', this.game);
                    client.emit('roomOpen', room, this.game);
                    return;
                }
            }
            client.emit('message', 'Não há salas disponíveis no momento!');
        } else {
            client.emit('message', 'Não há salas disponíveis no momento!');
        }
    }

    @SubscribeMessage('startMatch')
    async handleStartMatch(@MessageBody() room: string) {
        let loopGame: NodeJS.Timeout;

        if (!this.game.rooms[room]) {
            console.log('The room does not exist:', room);
        }

        if (this.game.rooms[room]) {
            this.game.rooms[room].isRunning = true;
            this.game.rooms[room].ballService = new BallMoverService();
            this.game.rooms[room].scoresService = new ScoresService();
            const initD = Date.now() / 2 === 0 ? 1 : -1;
            this.game.rooms[room].ball = {
                ...this.initialBall,
                xDirection: initD,
                yDirection: initD,
            };
            this.game.rooms[room].scores = JSON.parse(
                JSON.stringify(this.initialScores),
            );
            this.game.rooms[room].paddles = JSON.parse(
                JSON.stringify(this.initialPaddles),
            );
            loopGame = setInterval(async () => {
                if (!this.game.rooms[room]?.isRunning) {
                    clearInterval(loopGame);
                    return;
                }
                try {
                    await this.game.rooms[room].ballService.moveBall(
                        this.game.rooms[room],
                    );
                    this.server
                        .to(room)
                        .emit('matchStarted', room, this.game.rooms[room].ball);
                    this.server
                        .to(room)
                        .emit(
                            'matchScores',
                            room,
                            this.game.rooms[room].scores,
                        );
                } catch (error) {}
            }, 1000 / 60);
        } else {
            clearInterval(loopGame);
        }
    }

    @SubscribeMessage('sendKey')
    async handleSendKey(@MessageBody() paddle: Paddle) {
        const player =
            this.game.rooms[paddle.room].player1.id === paddle.player
                ? '1'
                : '2';
        const direction = paddle.type === 'keyup' ? 'STOP' : 'GO';

        if (!this.game.rooms[paddle.room].paddlesService) {
            this.game.rooms[paddle.room].paddlesService =
                new PaddlesMoverService();
        }

        if (this.game.rooms[paddle.room] && direction === 'GO') {
            await this.game.rooms[paddle.room].paddlesService.movePaddle(
                paddle,
                this.game.rooms[paddle.room].paddles,
                player,
            );
            this.server
                .to(paddle.room)
                .emit(
                    'movePadles',
                    paddle.room,
                    this.game.rooms[paddle.room].paddles,
                );
        }
    }

    @SubscribeMessage('sendLevel')
    async handleSendLevel(@MessageBody() matchLevel: any) {
        if (this.game.rooms[matchLevel.room]) {
            this.game.rooms[matchLevel.room].level = matchLevel.level;
            this.server
                .to(matchLevel.room)
                .emit('matchLevel', matchLevel.room, {
                    level: matchLevel.level,
                });
        }
    }

    @SubscribeMessage('leaveRoom')
    handleLeaveRoom(
        @MessageBody() room: { userPlayer: Player; userRoomId: string },
        @ConnectedSocket() client: Socket,
    ) {
        if (this.game.rooms[room.userRoomId]) {
            if (this.game.rooms[room.userRoomId].isRunning) {
                this.game.rooms[room.userRoomId].isRunning = false;

                const battle = this.gameService.getDataBattle(
                    room.userRoomId,
                    this.game,
                );
                this.gameService.saveBattle(battle);
                try {
                    this.server
                        .to(room.userRoomId)
                        .emit(
                            'playerLeftRoom',
                            'GameOver: Player left the room!',
                        );
                } catch (error) {}

                this.gameService.removeRoomAndNotify(
                    room.userRoomId,
                    room.userPlayer.id,
                    this.game,
                    this.server,
                );
            } else {
                delete this.game.rooms[room.userRoomId];
                this.server
                    .to(room.userRoomId)
                    .emit('leaveRoom', { leaveRoom: true });
            }
            client.leave(room.userRoomId);
        } else {
            console.error(`Room not found for user ${room.userPlayer.id}`);
        }
        this.server.emit('game', this.game);
    }

    @SubscribeMessage('PlayerConnected')
    handlePlayerConnected(
        @MessageBody() player: any,
        @ConnectedSocket() client: Socket,
    ) {
        const existingPlayer = this.game.players[client.id];
        const playerAlreadyInGame = Object.values(this.game.players).find(
            existingPlayer => existingPlayer.id === player.id,
        );

        if (!existingPlayer && !playerAlreadyInGame) {
            this.game.players[client.id] = {
                id: player.id,
                name: player.name,
                username: player.username,
                avatar: player.avatar,
            };
        } else {
            console.log('Player with the same ID already exists:', player.id);
        }
        this.server.emit('game', this.game);
    }
}
