/*
 * @Description: 智能锁-表盘
 */
import React, { useEffect, useState } from 'react';
import { Icon } from '@custom/Icon';
import sdk from 'qcloud-iotexplorer-h5-panel-sdk';
export interface DiskProps {
  deviceData: any;
  doControlDeviceData: any;
}

var flag: any = 0;
let i = 0;

export function Disk({
  deviceData,
  doControlDeviceData
}: DiskProps) {

  const lockStatus = {
    0: 'unlocked',
    1: 'locked',
    offline: 'offline'
  };

  const currentColor = (): string => {
    if (deviceData.lock_motor_state == 1) {
      return '#00A884';
    } else {
      return '#DA695C';
    }
  }

  const radius = 120;
  // 周长
  const getPerimeter = 2 * Math.PI * radius;
  // 开屏动画定时器
  let interval: any;
  // 前进计时器
  let forwardInterval: any;
  // 后退计时器
  let fallbackInterval: any;

  useEffect(() => {
    // 开屏动画
    tickAnimation();
  }, []);
  const tickAnimation = () => {
    let perimeter = 2 * Math.PI * radius;
    let circle: any = document.getElementById("circle");
    let indicator: any = document.getElementById("indicator");
    let startIndex: number = 0;
    interval = setInterval(() => {
      startIndex += 5;
      let percent = startIndex / 100;
      circle.setAttribute('stroke-dasharray', perimeter * percent + ' ' + perimeter * (1 - percent));
      let currentAngle = 360 * percent + 270;
      let x = 120 + 120 * Math.cos((currentAngle * Math.PI) / 180);
      let y = 120 + 120 * Math.sin((currentAngle * Math.PI) / 180);
      indicator.setAttribute('cx', x);
      indicator.setAttribute('cy', y);

      if (startIndex >= 100) {
        clearInterval(interval);
      }

    }, 60);
  }

  const forwardAnimation = () => {
    let perimeter = 2 * Math.PI * radius;
    let circle: any = document.getElementById("circle");
    let indicator: any = document.getElementById("indicator");
    forwardInterval = setInterval(() => {
      i += 2;
      let percent = i / 100;
      circle.setAttribute('stroke-dasharray', perimeter * percent + ' ' + perimeter * (1 - percent));
      circle.setAttribute('stroke', deviceData.lock_motor_state == 1 ? '#DA695C' : '#00A884');
      let currentAngle = 360 * percent + 270;
      let x = 120 + 120 * Math.cos((currentAngle * Math.PI) / 180);
      let y = 120 + 120 * Math.sin((currentAngle * Math.PI) / 180);
      indicator.setAttribute('cx', x);
      indicator.setAttribute('cy', y);
      indicator.setAttribute('fill', deviceData.lock_motor_state == 1 ? '#DA695C' : '#00A884');

      if (i >= 100) {
        clearInterval(forwardInterval);
        doControlDeviceData('lock_motor_state', Number(!deviceData.lock_motor_state));
        // 重置
        i = 0
      }

    }, 100);
  }

  const fallbackAnimation = () => {
    let perimeter = 2 * Math.PI * radius;
    let circle: any = document.getElementById("circle");
    let indicator: any = document.getElementById("indicator");
    fallbackInterval = setInterval(() => {
      if (i <= 0) {
        clearInterval(fallbackInterval);
        indicator.setAttribute('fill', currentColor());
        i = 0
        return;
      }
      i -= 2;
      let percent = i / 100;
      circle.setAttribute('stroke-dasharray', perimeter * percent + ' ' + perimeter * (1 - percent));
      circle.setAttribute('stroke', deviceData.lock_motor_state == 1 ? '#DA695C' : '#00A884');
      let currentAngle = 360 * percent + 270;
      let x = 120 + 120 * Math.cos((currentAngle * Math.PI) / 180);
      let y = 120 + 120 * Math.sin((currentAngle * Math.PI) / 180);
      indicator.setAttribute('cx', x);
      indicator.setAttribute('cy', y);
      indicator.setAttribute('fill', deviceData.lock_motor_state == 1 ? '#DA695C' : '#00A884');
    }, 50);
  }

  const handleTouchStart = (e) => {
    console.log('handleTouchStart');
    // e.preventDefault();
    // 如果离线之后的操作不执行
    if (deviceData.lock_motor_state == 2) {
      sdk.tips.showInfo('设备已离线');
      return;
    }

    // if (flag) {
    //   return;
    // }
    // // 设置定时器
    // flag = setInterval(longPress, 0)
    longPress()
  }

  const handleTouchMove = (e) => {
    console.log('handleTouchMove');
  }
  const handleTouchEnd = (e) => {
    console.log('handleTouchEnd');
    e.preventDefault();
    clearInterval(flag)
    flag = 0
    clearInterval(forwardInterval);
    if (i > 0 && i < 100) {
      fallbackAnimation();
    }
    // 如果离线之后的操作不执行
    if (deviceData.lock_motor_state == 2) {
      sdk.tips.showInfo('设备已离线');
      return;
    }
  }

  const longPress = () => {
    // clearInterval(flag)
    // flag = 0;
    clearInterval(fallbackInterval);
    forwardAnimation();
    // console.log(i);
    // if (i > 0 && i < 100) {
    //   clearInterval(forwardInterval);
    //   fallbackAnimation();
    // } else {
    //   // i = 0;
    //   console.log(i);
    //   clearInterval(fallbackInterval);
    //   forwardAnimation();
    // }
  }

  const handleClick = (e) => {
    console.log('onClick');
    e.preventDefault();
    e.stopPropagation();
    sdk.tips.showInfo(deviceData.lock_motor_state == 1 ? '长按关锁' : '长按开锁');
    if (i > 0 && i < 100) {
      clearInterval(forwardInterval);
      clearInterval(fallbackInterval);
      fallbackAnimation();
    }
  }

  return (
    <div
      className="disk"
      onTouchStart={(e) => {handleTouchStart(e)}}
      onTouchMove={e => {handleTouchMove(e)}}
      onTouchEnd={(e) => {handleTouchEnd(e)}}
      onTouchCancel={(e) => {console.log('onTouchCancel');handleTouchEnd(e)}}
      // onClick={(e) => {handleClick(e)}}
    >
      <div className="content-wrap">
        <div className="content">
          <Icon name={lockStatus[deviceData.lock_motor_state || '0']} />
        </div>
      </div>
      <svg
        className="circle"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 240 240"
      >
        <defs>
          <linearGradient id="grad1" x1="1" y1="1" x2="0" y2="0">
            <stop offset="0%" stop-color={currentColor()} stop-opacity="0" />
            <stop offset="100%" stop-color={currentColor()} stop-opacity="1" />
          </linearGradient>
        </defs>
        <circle
          cx={120}
          cy={120}
          r={120}
          stroke="rgba(239, 243, 244, 0.75)"
          stroke-width={2}
          fill="none"
          stroke-linecap="round"
        />
        {deviceData.lock_motor_state != 2 ?
          <>
            <circle
              id='circle'
              cx={120}
              cy={120}
              r={120}
              stroke={currentColor()}
              stroke-width={5}
              fill="none"
              stroke-dasharray={0 + ',' + getPerimeter}
              stroke-dashoffset={getPerimeter}
              stroke-linecap="round"
              transform="matrix(0, -1, 1, 0, 0, 240)"
            >
            </circle>
            <circle
              id='indicator'
              cx={120}
              cy={0}
              r={5}
              fill={currentColor()}
              stroke="none"
            />
          </> : null
        }
      </svg>
    </div>
  );
}
