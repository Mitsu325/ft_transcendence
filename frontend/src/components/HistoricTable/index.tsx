import React, { useEffect, useState } from 'react';
import { useAuth } from 'hooks/useAuth';
import { Table, Modal } from 'antd';
import { BattleHistoric, PerformancePlayer } from 'interfaces/battle.interface';
import { gameService } from 'services/game.api';
import FailureNotification from 'components/Notification/FailureNotification';

const HistoricTable = () => {
  const { user } = useAuth();
  const [battlesHistoric, setBattlesHistoric] = useState<BattleHistoric[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [playerPerformance, setPlayerPerformance] = useState<PerformancePlayer>(
    {
      userId: '',
      name: '',
      totalBattles: 0,
      totalWins: 0,
      totalLoses: 0,
      totalDraws: 0,
    },
  );

  const getPerformancePlayer = (playerId: string) => {
    gameService
      .getPerformancePlayers(playerId || '')
      .then(res => {
        setPlayerPerformance(res);
        setShowModal(true);
      })
      .catch(() => {
        FailureNotification({
          message: 'Ops! Encontramos algumas falhas durante o processo',
          description:
            'Não foi possível carregar as informações. Verifique sua conexão e tente novamente',
        });
      });
  };

  useEffect(() => {
    setLoading(true);

    gameService
      .getPlayerHistoric(user?.id || '')
      .then(res => {
        console.log(res);
        setBattlesHistoric(res);
      })
      .catch(() => {
        console.log('Error');
        FailureNotification({
          message: 'Ops! Encontramos algumas falhas durante o processo',
          description:
            'Não foi possível carregar as informações. Verifique sua conexão e tente novamente',
        });
      })
      .finally(() => {
        setLoading(false);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Table
        columns={[
          {
            title: 'Data',
            dataIndex: 'createdAt',
            key: 'date',
            render: text => {
              const date = new Date(text);
              return date.toLocaleDateString('pt-BR');
            },
          },
          {
            title: 'Anfitrião',
            dataIndex: 'hostName',
            key: 'host',
            render: (text, record) => (
              <a onClick={() => getPerformancePlayer(record.hostId)}>{text}</a>
            ),
          },
          {
            title: 'Adversário',
            dataIndex: 'guestName',
            key: 'guest',
            render: (text, record) => (
              <a onClick={() => getPerformancePlayer(record.guestId)}>{text}</a>
            ),
          },
          {
            title: 'Vencedor',
            dataIndex: 'winnerName',
            key: 'winner',
          },
          {
            title: 'Vencedor Score',
            dataIndex: 'scoreWinner',
            key: 'winner_score',
          },
          {
            title: 'Perdedor Score',
            dataIndex: 'scoreLoser',
            key: 'loser_score',
          },
          {
            title: 'Resultado',
            dataIndex: 'status',
            key: 'status',
          },
        ]}
        dataSource={battlesHistoric}
        loading={loading}
        rowKey={record => record.id.toString()}
      />
      <Modal
        title={`Performance do Jogador - ${playerPerformance?.name}`}
        open={showModal}
        onOk={() => setShowModal(false)}
        onCancel={() => setShowModal(false)}
      >
        <p>
          Total de Jogos: <b>{playerPerformance.totalBattles}</b>
        </p>
        <p>
          Vitórias: <b>{playerPerformance.totalWins}</b>
        </p>
        <p>
          Derrotas: <b>{playerPerformance.totalLoses}</b>
        </p>
        <p>
          Empates: <b>{playerPerformance.totalDraws}</b>
        </p>
        <p>
          Aproveitamento:{' '}
          <b>
            {(
              (playerPerformance.totalWins / playerPerformance.totalBattles) *
              100
            ).toFixed(2)}
          </b>
          %
        </p>
      </Modal>
    </>
  );
};

export default HistoricTable;
