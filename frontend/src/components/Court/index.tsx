import React from 'react';
import SVG, { Circle, Rect, Line, Text } from 'react-svg-draw';

interface Match {
  matchStatus: string;
  ball: {
    x: number;
    y: number;
    width: number;
    xdirection: number;
    ydirection: number;
    xspeed: number;
    yspeed: number;
  };
  player1: { x: number; y: number };
  player2: { x: number; y: number };
  score1: number;
  score2: number;
  courtDimensions: { width: number; height: number };
}

interface CourtProps {
  matchData: { match: Match };
  onSendKey: (type: string, key: string) => void;
}

const courtDimensions = { width: 580, height: 320 };

const Court: React.FC<CourtProps> = ({ matchData, onSendKey }) => {
  const [match, setMatch] = React.useState<Match>();

  React.useEffect(() => {
    setMatch(matchData.match);
  }, [matchData]);

  React.useEffect(() => {
    const sendKeyEvent = (e: any) => {
      const { key, type } = e;

      switch (key) {
        case 'ArrowUp':
        case 'ArrowDown':
          onSendKey(type, key);
          e.preventDefault();
          break;
      }
    };

    document.addEventListener('keydown', sendKeyEvent);
    document.addEventListener('keyup', sendKeyEvent);

    return () => {
      document.removeEventListener('keydown', sendKeyEvent);
      document.removeEventListener('keyup', sendKeyEvent);
    };
  }, []);

  return (
    <div style={{ position: 'relative' }}>
      <SVG
        width={courtDimensions.width.toString()}
        height={courtDimensions.height.toString()}
      >
        <Rect
          x="0"
          y="0"
          width={courtDimensions.width.toString()}
          height={courtDimensions.height.toString()}
          style={{ fill: 'rgb(0, 0, 0)' }}
        />
        <Line
          x1={(courtDimensions.width / 2).toString()}
          y1="0"
          x2={(courtDimensions.width / 2).toString()}
          y2={courtDimensions.height.toString()}
          strokeDasharray="5,5"
          strokeWidth="5"
          style={{ stroke: 'rgba(255, 255, 255, 0.5)' }}
        />
        <Text
          x={(courtDimensions.width / 2 - 20).toString()}
          y="45"
          style={{
            direction: 'rtl',
            fill: 'rgba(255, 255, 255, 0.7)',
            fontSize: '50px',
          }}
        >
          {match?.score1}
        </Text>
        <Text
          x={(courtDimensions.width / 2 + 20).toString()}
          y="45"
          style={{
            fill: 'rgba(255, 255, 255, 0.7)',
            fontSize: '50px',
          }}
        >
          {match?.score2}
        </Text>
        {match?.ball && (
          <Circle
            cx={match.ball.x.toString()}
            cy={match.ball.y.toString()}
            r={match.ball.width.toString()}
            style={{ fill: '#fff' }}
          />
        )}
      </SVG>
    </div>
  );
};

export default Court;
