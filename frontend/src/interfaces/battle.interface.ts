export interface BattleHistoric {
  id: string;
  status: string;
  winnerName: string | null;
  hostName: string;
  hostId: string;
  guestName: string;
  guestId: string;
  scoreWinner: number;
  scoreLoser: number;
  createdAt: Date;
}

export interface PerformancePlayer {
  userId: string;
  name: string;
  totalBattles: number;
  totalWins: number;
  totalLoses: number;
  totalDraws: number;
}
