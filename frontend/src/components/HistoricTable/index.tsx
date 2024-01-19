import * as React from 'react';
import { useAuth } from 'hooks/useAuth';
import api from 'services/api';
// import { Button, Modal, Table, Tag } from 'antd';
import { Table } from 'antd';
import type { TableProps } from 'antd';

interface DataType {
  battle_id: number;
  battle_status: string;
  battle_winner: string | null;
  battle_host: string;
  battle_guest: string;
  battle_score_winner: number;
  battle_score_loser: number;
  battle_created_date: string;
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Anfitrião',
    dataIndex: 'battle_host',
    key: 'host',
    render: text => <a>{text}</a>,
  },
  {
    title: 'Adversário',
    dataIndex: 'battle_guest',
    key: 'guest',
    render: text => <a>{text}</a>,
  },
  {
    title: 'Vencedor',
    dataIndex: 'battle_winner',
    key: 'winner',
    render: text => <a>{text}</a>,
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
    title: 'Status',
    dataIndex: 'battle_status',
    key: 'status',
  },
];

const getHistoric = async (userId: string) => {
  try {
    const response = await api.post('/battles/historic_battles', {
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

const HistoricTable: React.FC = () => {
  const user = useAuth()?.user;

  const userPlayer = React.useMemo(() => {
    const newPlayer = {
      id: user?.id ?? '',
      name: user?.name ?? '',
      avatar: user?.avatar ?? null,
    };
    return newPlayer;
  }, [user]);

  const [data, setData] = React.useState<DataType[]>([]);
  const [loading, setLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await getHistoric(userPlayer.id);
        console.log('resp:', resp);
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
    // console.log('loading');
    setLoading(true);
  }, []);

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      rowKey={record => record.battle_id.toString()}
    />
  );
};

export default HistoricTable;
