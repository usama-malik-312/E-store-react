import { Spin } from 'antd';

export const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Spin size="large" />
    </div>
  );
};

