import * as React from 'react';
import { useAuth } from 'hooks/useAuth';
import api from 'services/api';
import { Progress, Space } from 'antd';
import {
  RightOutlined,
  LeftOutlined,
  SmileOutlined,
  FrownOutlined,
  MehOutlined,
} from '@ant-design/icons';
import { Col, Row, Statistic } from 'antd';

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

const Statistics: React.FC = () => {
  const user = useAuth()?.user;

  const userPlayer = React.useMemo(() => {
    const newPlayer = {
      id: user?.id ?? '',
    };
    return newPlayer;
  }, [user]);

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
      } catch (error) {
        console.error('Error data:', error);
      }
    };
    fetchData();
  };

  React.useEffect(() => {
    getPerformancePlayer(userPlayer.id);
    // eslint-disable-next-line
  }, []);

  return (
    <>
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '60vh',
        }}
      >
        <div style={{ width: '50%', alignItems: 'center', padding: 10 }}>
          <h2>Total de Batalhas</h2>
          <Row gutter={20} justify="center" style={{ padding: 10 }}>
            <Col span={6}>
              <Statistic
                // title="Total"
                value={playerPerformance?.total_battles}
                prefix={<RightOutlined />}
                suffix={<LeftOutlined />}
                valueStyle={{
                  color: '#000000',
                  fontWeight: 'bold',
                  alignContent: 'center',
                  fontSize: 35,
                }}
              />
            </Col>
          </Row>
          <Row gutter={50} justify="center">
            <Col span={5}>
              <Statistic
                title="Vitórias"
                value={playerPerformance?.total_wins}
                prefix={<SmileOutlined />}
                valueStyle={{
                  color: 'rgb(0, 106, 255)',
                  fontWeight: 'bold',
                  alignContent: 'right',
                  fontSize: 30,
                }}
              />
            </Col>
            <Col span={5}>
              <Statistic
                title="Derrotas"
                value={playerPerformance?.total_loses}
                prefix={<FrownOutlined />}
                valueStyle={{
                  color: 'red',
                  fontWeight: 'bold',
                  alignContent: 'right',
                  fontSize: 30,
                }}
              />
            </Col>
            <Col span={5}>
              <Statistic
                title="Empates"
                value={playerPerformance?.total_draws}
                prefix={<MehOutlined />}
                valueStyle={{
                  color: 'grey',
                  fontWeight: 'bold',
                  alignContent: 'right',
                  fontSize: 30,
                }}
              />
            </Col>
          </Row>
        </div>
        <div
          style={{
            display: 'flex',
            width: '50%',
            padding: 40,
            justifyContent: 'center',
          }}
        >
          <Space wrap size={30}>
            <Progress
              type="circle"
              percent={
                playerPerformance &&
                ((
                  (playerPerformance?.total_wins /
                    playerPerformance?.total_battles) *
                  100
                ).toFixed(2) as unknown as number)
              }
            />
            <Progress
              type="circle"
              percent={
                playerPerformance &&
                ((
                  (playerPerformance?.total_loses /
                    playerPerformance?.total_battles) *
                  100
                ).toFixed(2) as unknown as number)
              }
              strokeColor="red"
            />
            <Progress
              type="circle"
              percent={
                playerPerformance &&
                ((
                  (playerPerformance?.total_draws /
                    playerPerformance?.total_battles) *
                  100
                ).toFixed(2) as unknown as number)
              }
              strokeColor="gray"
            />
          </Space>
        </div>
      </div>
    </>
  );
};

export default Statistics;
