import * as React from 'react';
import { useAuth } from 'hooks/useAuth';
import api from 'services/api';
import { Table, Modal } from 'antd';
import { userService } from '../../services/user.api';

interface DataType {
  battle_id: number;
  battle_status: string;
  battle_winner: string | null;
  battle_host: string;
  battle_host_id: string;
  battle_guest: string;
  battle_guest_id: string;
  battle_score_winner: number;
  battle_score_loser: number;
  battle_created_date: Date;
}

interface PerformancePlayer {
  userId: string;
  name: string;
  total_battles: number;
  total_wins: number;
  total_loses: number;
  total_draws: number;
}

const initPerformancePlayer: PerformancePlayer = {
  userId: '',
  name: '',
  total_battles: 0,
  total_wins: 0,
  total_loses: 0,
  total_draws: 0,
};

const HistoricTable: React.FC = () => {
  const user = useAuth()?.user;

  const userPlayer = React.useMemo(() => {
    const newPlayer = {
      id: user?.id ?? '',
    };
    return newPlayer;
  }, [user]);

  const [data, setData] = React.useState<DataType[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [playerPerformance, setPlayerPerformance] =
    React.useState<PerformancePlayer>(initPerformancePlayer);

  const getData = async (userId: string, route: string) => {
    try {
      const response = await api.post(route, {
        userId: userId,
      });
      if (response.data) {
        return response.data;
      } else {
        return null;
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const getPerformancePlayer = (playerId: string) => {
    const fetchData = async () => {
      try {
        const resp = await getData(playerId, '/battles/performance_player');
        setPlayerPerformance(resp);
        setShowModal(true);
      } catch (error) {
        console.error('Error data:', error);
      }
    };
    fetchData();
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await getData(userPlayer.id, '/battles/historic_battles');
        setData(resp);
      } catch (error) {
        console.error('Error data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userPlayer.id]);

  React.useEffect(() => {
    setLoading(true);

    userService.getUsersStatus().then(users => {
      console.log('users status', users);
    });
  }, []);

  return (
    <>
      <Table
        columns={[
          {
            title: 'Data',
            dataIndex: 'battle_created_date',
            key: 'date',
            render: text => {
              const date = new Date(text);
              return date.toLocaleDateString('pt-BR');
            },
          },
          {
            title: 'Anfitrião',
            dataIndex: 'battle_host',
            key: 'host',
            render: (text, record) => (
              <a onClick={() => getPerformancePlayer(record.battle_host_id)}>
                {text}
              </a>
            ),
          },
          {
            title: 'Adversário',
            dataIndex: 'battle_guest',
            key: 'guest',
            render: (text, record) => (
              <a onClick={() => getPerformancePlayer(record.battle_guest_id)}>
                {text}
              </a>
            ),
          },
          {
            title: 'Vencedor',
            dataIndex: 'battle_winner',
            key: 'winner',
          },
          {
            title: 'Vencedor Score',
            dataIndex: 'battle_score_winner',
            key: 'winner_score',
          },
          {
            title: 'Perdedor Score',
            dataIndex: 'battle_score_loser',
            key: 'loser_score',
          },
          {
            title: 'Resultado',
            dataIndex: 'battle_status',
            key: 'status',
          },
        ]}
        dataSource={data}
        loading={loading}
        rowKey={record => record.battle_id.toString()}
      />
      <Modal
        title="Performance do Jogador"
        open={showModal}
        onOk={() => setShowModal(false)}
        onCancel={() => setShowModal(false)}
      >
        <h3>
          {'*** '}
          {playerPerformance?.name && playerPerformance.name.toUpperCase()}
          {' ***'}
        </h3>
        <p>
          Total de Jogos:
          <b>{playerPerformance.total_battles}</b>
        </p>
        <p>
          Vitórias:
          <b>{playerPerformance.total_wins}</b>
        </p>
        <p>
          Derrotas:
          <b>{playerPerformance.total_loses}</b>
        </p>
        <p>
          Empates:
          <b>{playerPerformance.total_draws}</b>
        </p>
        <p>
          Aproveitamento:{' '}
          <b>
            {(
              (playerPerformance.total_wins / playerPerformance.total_battles) *
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
