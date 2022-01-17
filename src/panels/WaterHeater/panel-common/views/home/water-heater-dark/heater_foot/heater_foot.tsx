import React from 'react';
import './heater_foot.less'
import classNames from 'classnames';
import {SvgIcon} from '@components/common/icon';
import sdk from 'qcloud-iotexplorer-h5-panel-sdk';
import {apiControlDeviceData} from '@hooks/useDeviceData';

export function Normal_Foot() {
  const stateSrc = (state: String) => {
    switch (state) {
      case 'standby':
        return '待机';
      case 'heating':
        return '加热';
      case 'warm':
        return '取暖';
      default:
        return '待机';
    }
  };
  const onSwitch = () => {
    apiControlDeviceData({
      power_switch: sdk.deviceData.power_switch === 1 ? 0 : 1
    });
  };
  const onMinus = () => {
    if (sdk.deviceData.power_switch === 1) {
      const current = sdk.deviceData.temp_set ? sdk.deviceData.temp_set : 0;
      if (current > 0) {
        const currentNow = current - 1;
        apiControlDeviceData({temp_set: currentNow});
      }
    }
  };
  const onAdd = () => {
    if (sdk.deviceData.power_switch === 1) {
      const current = sdk.deviceData.temp_set ? sdk.deviceData.temp_set : 0;
      if (current < 50) {
        const currentNow = current + 1;
        apiControlDeviceData({temp_set: currentNow});
      }
    }
  };
  return (
    <article id={'dark_foot'} className={classNames('dark_foot')}>
      <div className="foot_card">
        <div className="foot_botton">
          <div className="botton_span">
            <div onClick={onMinus}><SvgIcon name={'icon-water-heater-subtract-dark'} width={280} height={280}/></div>
            <div onClick={onSwitch}><SvgIcon name={sdk.deviceData.power_switch == 1 && 'icon-water-heater-switch-dark2' || 'icon-water-heater-switch-dark'} width={200} height={200}/></div>
            <div onClick={onAdd}><SvgIcon name={'icon-water-heater-add-dark'} width={280} height={280}/></div>
          </div>
        </div>

        <div className="foot_size">
          <div className="state">
            <div className="state_span">
              <div className="span_top">{sdk.deviceData.water_left ? sdk.deviceData.water_left : 0}L</div>
              <div className="soan_foot">剩余水量</div>
            </div>

            <div className="vertical"></div>

            <div className="state_span">
              <div className="span_top">{sdk.deviceData.work_state ? stateSrc(sdk.deviceData.work_state) : '待机'}</div>
              <div className="soan_foot">工作状态</div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Normal_Foot;

