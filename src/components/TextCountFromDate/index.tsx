import { formatDuration } from "@/scripts/Utils/DateAndTime/Format";
import React from "react";

export function TextCountdown({
  date,
  updatePeriod,
}: {
  date: Date;
  updatePeriod?: number;
}): React.ReactNode {
  const [timeLeft, setTimeLeft] = React.useState<number>(
    date.getTime() - Date.now(),
  );

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(date.getTime() - Date.now());
    }, updatePeriod ?? 100);

    return () => {
      clearInterval(interval);
    };
  }, [date, updatePeriod]);

  return <>{timeLeft > 0 ? formatDuration(timeLeft, true) : null}</>;
}

export function TextCountup({
  date,
  updatePeriod,
}: {
  date: Date;
  updatePeriod?: number;
}): React.ReactNode {
  const [timeSince, setTimeSince] = React.useState<number>(
    Date.now() - date.getTime(),
  );

  React.useEffect(() => {
    const interval = setInterval(() => {
      setTimeSince(Date.now() - date.getTime());
    }, updatePeriod ?? 100);

    return () => {
      clearInterval(interval);
    };
  }, [date, updatePeriod]);

  return <>{timeSince > 0 ? formatDuration(timeSince, true) : null}</>;
}
