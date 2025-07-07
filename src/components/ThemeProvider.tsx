'use client';

import {ConfigProvider, Layout, Switch, theme as antdTheme} from 'antd';
import React, { useEffect, useState } from 'react';
import {Content, Header} from "antd/es/layout/layout";

export default function AntdThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  // Synchronise with Tailwind (if used)
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);
  // 🎨 Global class for the app
  const globalThemeClass = isDark
    ? 'bg-gray-900 text-white'
    : 'bg-white text-black';
  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      }}
    >
      <Layout className={`min-h-screen transition-colors duration-300 ${globalThemeClass}`}>
        {/* Navbar */}
        <Header
          className={`flex items-center justify-between px-6 transition-colors duration-300
          ${isDark ? 'text-white' : 'text-black'}
          border-b border-gray-200 dark:border-gray-700`}
          style={{
            backgroundColor: isDark ? '#1f1f1f' : '#ffffff', // ← force la couleur
          }}>
          <h1 className="text-lg font-semibold">🧩 Form builder</h1>
          <div className="flex items-center space-x-2">
            <span className="text-sm">🌞</span>
            <Switch
              checked={isDark}
              onChange={setIsDark}
              checkedChildren="🌙"
              unCheckedChildren="☀️"
            />
          </div>
        </Header>


        {/* Contenu principal */}
        <Content className="p-6">{children}</Content>
      </Layout>
    </ConfigProvider>
  );
}
