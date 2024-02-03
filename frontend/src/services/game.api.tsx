/* eslint-disable no-useless-catch */
import api from 'services/api';

async function getPlayerHistoric(userId: string) {
  try {
    const result = await api.get(`/battles/historic_battles/${userId}`);
    return result?.data || null;
  } catch (error) {
    throw error;
  }
}

async function getPerformancePlayers(userId: string) {
  try {
    const result = await api.get(`/battles/performance_player/${userId}`);
    return result?.data || null;
  } catch (error) {
    throw error;
  }
}

export const gameService = {
  getPlayerHistoric,
  getPerformancePlayers,
};
