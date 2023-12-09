import React, { useEffect, useState } from 'react';
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

interface MatchProps {
  match: Match;
}

const courtDimensions = { width: 580, height: 320 };

const Court: React.FC<MatchProps> = ({ match }) => {
  // useEffect(() => {
  //   const sendKeyEvent = (e) => {
  //     const { key, type } = e;

  //     switch (key) {
  //       case 'ArrowUp':
  //       case 'ArrowDown':
  //         sendKey(type, key);
  //         e.preventDefault();
  //         break;
  //       default:
  //         break;
  //     }
  //   };
  //   document.addEventListener('keydown', sendKeyEvent);
  //   document.addEventListener('keyup', sendKeyEvent);

  //   return () => {
  //     document.addEventListener('keydown', sendKeyEvent);
  //     document.addEventListener('keyup', sendKeyEvent);
  //   };
  // }, []);

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
          {match.score1}
        </Text>
        <Text
          x={(courtDimensions.width / 2 + 20).toString()}
          y="45"
          style={{
            fill: 'rgba(255, 255, 255, 0.7)',
            fontSize: '50px',
          }}
        >
          {match.score2}
        </Text>
        {match.ball && (
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
