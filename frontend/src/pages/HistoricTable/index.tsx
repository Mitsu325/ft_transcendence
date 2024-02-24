import React, { useEffect, useState } from 'react';
import { Table, Modal } from 'antd';
import { BattleHistoric, PerformancePlayer } from 'interfaces/battle.interface';
import { gameService } from 'services/game.api';
import FailureNotification from 'components/Notification/FailureNotification';
import { useParams } from 'react-router';

const HistoricTable = () => {
  const { username: usernameParam } = useParams();
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
      winPercent: 0,
      losePercent: 0,
      drawPercent: 0,
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
    if (!usernameParam) return;

    setLoading(true);

    gameService
      .getPlayerHistoric(usernameParam)
      .then(res => {
        setBattlesHistoric(res);
      })
      .catch(() => {
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
  }, [usernameParam]);

  return (
    <>
      <h1 className="title">Histórico de partidas</h1>
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
            ellipsis: true,
          },
          {
            title: 'Vencedor Score',
            dataIndex: 'scoreWinner',
            key: 'winner_score',
            ellipsis: true,
          },
          {
            title: 'Perdedor Score',
            dataIndex: 'scoreLoser',
            key: 'loser_score',
            ellipsis: true,
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
        locale={{
          emptyText:
            'Você ainda não tem um histórico de partidas de Pong! Que tal começar agora e mostrar suas habilidades na quadra?',
        }}
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
