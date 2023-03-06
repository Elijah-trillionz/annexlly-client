import { useEffect, useState } from 'react';

const LoadingProgressBar = ({ display }: { display: boolean }) => {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    let timer = setInterval(() => {
      if (progress >= 97 && progress <= 99)
        setProgress((_progress) => _progress - 17);
      else setProgress((_progress) => _progress + 1);
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, []);
  return (
    <div
      className={`fixed top-0 left-0 h-1 transition-all bg-secondary w-4 ${
        display ? 'fixed' : 'hidden'
      }`}
      style={{ width: `${progress}%` }}
    />
  );
};

export default LoadingProgressBar;
