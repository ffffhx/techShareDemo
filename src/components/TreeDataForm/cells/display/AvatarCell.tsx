import { Avatar } from 'antd';

// 头像资源（使用项目根目录下的 test.jpg）
const avatarUrl = new URL('../../../../test.jpg', import.meta.url).href;

export const AvatarCell = () => {
  return <Avatar size={36} src={avatarUrl} />;
};

