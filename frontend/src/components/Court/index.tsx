import React from 'react';
import SVG, { Circle, Rect, Line, Text } from 'react-svg-draw';
import {
  MatchPadles,
  Ball,
  // initialBall,
  // initialPadles,
  MatchScores,
} from 'interfaces/gameInterfaces/interfaces';

interface CourtProps {
  roomId: string;
  matchBall: any;
  matchPadles: any;
  matchScores: any;
  onSendKey: (type: string, key: string) => void;
}

const courtDimensions = { width: 580, height: 320 };

const Court: React.FC<CourtProps> = ({
  // roomId,
  matchBall,
  matchPadles,
  matchScores,
  onSendKey,
}) => {
  const [ball, setBall] = React.useState<Ball>();
  const [padles, setPadles] = React.useState<MatchPadles>();
  const [scores, setScores] = React.useState<MatchScores>();

  React.useEffect(() => {
    setBall(matchBall);
  }, [matchBall]);

  React.useEffect(() => {
    setPadles(matchPadles);
  }, [matchPadles]);

  React.useEffect(() => {
    setScores(matchScores);
  }, [matchScores]);

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
        <Rect
          x="5"
          y={padles?.player1.y ? padles?.player1.y.toString() : '135'}
          width="5"
          height="50"
          style={{ fill: 'rgb(255, 255, 255)' }}
        />
        <Rect
          x={(courtDimensions.width - 10).toString()}
          y={padles?.player2.y ? padles?.player2.y.toString() : '135'}
          width="5"
          height="50"
          style={{ fill: 'rgb(255, 255, 255)' }}
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
          {scores?.score1}
        </Text>
        <Text
          x={(courtDimensions.width / 2 + 20).toString()}
          y="45"
          style={{
            fill: 'rgba(255, 255, 255, 0.7)',
            fontSize: '50px',
          }}
        >
          {scores?.score2}
        </Text>
        {ball && (
          <Circle
            cx={ball?.x?.toString() ?? '0'}
            cy={ball?.y?.toString() ?? '0'}
            r={ball?.width?.toString() ?? '0'}
            style={{ fill: '#fff' }}
          />
        )}
      </SVG>
    </div>
  );
};

export default Court;
