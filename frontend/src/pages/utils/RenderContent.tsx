import * as React from 'react';
import Home from '../Home/home';
import GameOptions from '../GameOptions';
import Register from '../Register';
import HistoricPage from '../HistoricPage';

type MenuItem = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
};

const findMenuItemByKey = (key: string, items: MenuItem[]): MenuItem | null => {
  for (const item of items) {
    if (item.key === key) {
      return item;
    }

    if (item.children) {
      const childItem = findMenuItemByKey(key, item.children);
      if (childItem) {
        return childItem;
      }
    }
  }

  return null;
};

const renderContent = (items: MenuItem[], key: string) => {
  const selectedItem = findMenuItemByKey(key[0], items);
  if (selectedItem) {
    switch (selectedItem.key) {
      case '0':
        return <Home />;
      case '1':
        return <GameOptions />;
      case '2':
        return <Register />;
      case '4':
        return <HistoricPage />;
      // TO DO fazer página para cada opção do menu
      default:
        return null;
    }
  }
  return null;
};

export default renderContent;
