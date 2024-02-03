import React, { useEffect, useState } from 'react';
import { Card, Progress } from 'antd';
import {
  RightOutlined,
  LeftOutlined,
  SmileOutlined,
  FrownOutlined,
  MehOutlined,
} from '@ant-design/icons';
import { Statistic } from 'antd';
import { PerformancePlayer } from 'interfaces/battle.interface';
import { gameService } from 'services/game.api';
import FailureNotification from 'components/Notification/FailureNotification';
import './style.css';

const Statistics = ({ userId }: { userId: string }) => {
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

  useEffect(() => {
    if (!userId) {
      return;
    }
    gameService
      .getPerformancePlayers(userId)
      .then(res => {
        setPlayerPerformance(res);
      })
      .catch(() => {
        FailureNotification({
          message: 'Ops! Encontramos algumas falhas durante o processo',
          description:
            'Não foi possível carregar as informações. Verifique sua conexão e tente novamente',
        });
      });
  }, [userId]);

  return (
    <>
      <div className="static-group">
        <Card className="static-card">
          <Statistic
            title="Total de batalhas"
            value={playerPerformance.totalBattles}
            prefix={<RightOutlined />}
            suffix={<LeftOutlined />}
            valueStyle={{
              color: '#001529',
              fontSize: '2rem',
              textAlign: 'center',
            }}
          />
        </Card>
        <Card className="static-card">
          <Statistic
            title="Vitórias"
            value={playerPerformance.totalWins}
            prefix={<SmileOutlined style={{ marginRight: '12px' }} />}
            valueStyle={{
              color: '#0958d9',
              fontSize: '2rem',
              textAlign: 'center',
            }}
          />
        </Card>
        <Card className="static-card">
          <Statistic
            title="Derrotas"
            value={playerPerformance.totalLoses}
            prefix={<FrownOutlined style={{ marginRight: '12px' }} />}
            valueStyle={{
              color: '#cf1322',
              fontSize: '2rem',
              textAlign: 'center',
            }}
          />
        </Card>
        <Card className="static-card">
          <Statistic
            title="Empates"
            value={playerPerformance.totalDraws}
            prefix={<MehOutlined style={{ marginRight: '12px' }} />}
            valueStyle={{
              color: '#595959',
              fontSize: '2rem',
              textAlign: 'center',
            }}
          />
        </Card>
      </div>
      <Card className="static-card-lg">
        <p className="static-card-text">Performance</p>
        <div className="static-card-progress">
          <Progress
            type="dashboard"
            percent={playerPerformance.winPercent}
            format={percent => `${percent?.toFixed(2)}% Vitória`}
            strokeColor="#0958d9"
          />
          <Progress
            type="dashboard"
            percent={playerPerformance.losePercent}
            format={percent => `${percent?.toFixed(2)}% Derrota`}
            strokeColor="#cf1322"
          />
          <Progress
            type="dashboard"
            percent={playerPerformance.drawPercent}
            format={percent => `${percent?.toFixed(2)}% Empate`}
            strokeColor="#595959"
          />
        </div>
      </Card>
    </>
  );
};

export default Statistics;
