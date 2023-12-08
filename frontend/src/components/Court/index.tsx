import React, { useEffect, useState } from 'react';
import SVG, { Circle, Rect, Line, Text } from 'react-svg-draw';

const courtDimensions = {
  width: 580,
  height: 320,
};

const score1 = '0';
const score2 = '0';

const Court = () => {
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
          {score1}
        </Text>
        <Text
          x={(courtDimensions.width / 2 + 20).toString()}
          y="45"
          style={{
            fill: 'rgba(255, 255, 255, 0.7)',
            fontSize: '50px',
          }}
        >
          {score2}
        </Text>
      </SVG>
    </div>
  );
};

export default Court;
