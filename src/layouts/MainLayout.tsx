import { ReactNode, useState, useEffect } from 'react';
import { Layout, Menu, Button, Avatar, Dropdown, Space } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  UserOutlined,
  LogoutOutlined,
  ShoppingOutlined,
  AppstoreOutlined,
  SettingOutlined,
  MoonOutlined,
  SunOutlined,
  SafetyOutlined,
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { hasPermission } from '@/utils/permissions';
import { motion } from 'framer-motion';
import classNames from 'classnames';
import { useTheme } from '@/hooks/useTheme';

const { Header, Sider, Content } = Layout;

interface MainLayoutProps {
  children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setCollapsed(true);
      }
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
    },
    {
      key: '/inventory',
      icon: <AppstoreOutlined />,
      label: 'Inventory',
      show: hasPermission('inventory.read'),
    },
    {
      key: '/pos',
      icon: <ShoppingOutlined />,
      label: 'POS',
      show: hasPermission('pos.read'),
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: 'Users',
      show: hasPermission('users.read'),
    },
    {
      key: '/roles',
      icon: <SafetyOutlined />,
      label: 'Roles & Permissions',
      show: hasPermission('roles.read'),
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
  ].filter((item) => item.show !== false);

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      logout();
    } else if (key === 'profile') {
      navigate('/profile');
    } else {
      navigate(key);
    }
  };

  const handleSidebarMenuClick = ({ key }: { key: string }) => {
    navigate(key);
    if (isMobile) {
      setCollapsed(true);
    }
  };

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout className="min-h-screen">
      {/* Mobile overlay */}
      {isMobile && !collapsed && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setCollapsed(true)}
        />
      )}
      
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className={classNames('fixed left-0 top-0 bottom-0 h-screen z-50', {
          'shadow-lg': isMobile && !collapsed,
        })}
        theme={theme === 'dark' ? 'dark' : 'light'}
        breakpoint="lg"
        collapsedWidth={isMobile ? 0 : 80}
      >
        <motion.div
          initial={false}
          animate={{ width: collapsed ? (isMobile ? 0 : 80) : 200 }}
          transition={{ duration: 0.2 }}
        >
          <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
            <h1 className={classNames('text-xl font-bold text-primary-600 dark:text-primary-400', {
              'hidden': collapsed,
            })}>
              Electric Store
            </h1>
            <h1 className={classNames('text-xl font-bold text-primary-600 dark:text-primary-400', {
              'hidden': collapsed || isMobile,
            })}>
              ES
            </h1>
          </div>
          <Menu
            theme={theme === 'dark' ? 'dark' : 'light'}
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={handleSidebarMenuClick}
          />
        </motion.div>
      </Sider>
      
      <Layout className={classNames('transition-all duration-200', {
        'ml-0': isMobile || collapsed,
        'ml-[200px]': !isMobile && !collapsed,
        'ml-[80px]': !isMobile && collapsed,
      })}>
        <Header className="bg-white dark:bg-gray-800 px-4 flex items-center justify-between shadow-sm sticky top-0 z-30">
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleSidebar}
            className="text-lg"
          />
          <Space>
            <Button
              type="text"
              icon={theme === 'dark' ? <SunOutlined /> : <MoonOutlined />}
              onClick={toggleTheme}
            />
            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: handleMenuClick,
              }}
              placement="bottomRight"
            >
              <Space className="cursor-pointer">
                <Avatar icon={<UserOutlined />} />
                <span className="hidden md:inline">{user?.username || user?.email}</span>
              </Space>
            </Dropdown>
          </Space>
        </Header>
        <Content className="p-4 md:p-6 bg-gray-50 dark:bg-gray-900 min-h-[calc(100vh-64px)]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </Content>
      </Layout>
    </Layout>
  );
};

