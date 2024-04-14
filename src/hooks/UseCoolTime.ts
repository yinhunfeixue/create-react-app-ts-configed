import { useCallback, useEffect, useState } from 'react';

interface IUseCoolProps {
  /**
   * 冷却结束时间
   */
  endTime?: number;
}
/**
 * UseCoolTime
 */
function UseCoolTime(props: IUseCoolProps) {
  const { endTime } = props;
  const [coolSeconds, setCoolSeconds] = useState(0);

  const updateSeconds = useCallback(() => {
    const seconds = endTime ? (endTime - Date.now()) / 1000 : 0;
    setCoolSeconds(seconds);
    return seconds;
  }, [endTime]);

  useEffect(() => {
    updateSeconds();
    let timer: any;
    if (endTime) {
      timer = setInterval(() => {
        const result = updateSeconds();
        if (result <= 0) {
          clearInterval(timer);
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [endTime, updateSeconds]);

  return [coolSeconds];
}
export default UseCoolTime;
