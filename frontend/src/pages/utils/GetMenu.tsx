type MenuItem = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
};

const getMenuBreadcrumb = (itemKey: string, items: MenuItem[]): string[] => {
  const breadcrumbItems: string[] = [];
  const findMenuItem = (items: any[], key: string): any | undefined => {
    for (const item of items) {
      if (item.key === key) {
        return item;
      } else if (item.children) {
        const foundItem = findMenuItem(item.children, key);
        if (foundItem) {
          breadcrumbItems.push(item.label);
          return foundItem;
        }
      }
    }
    return undefined;
  };

  let selectedItem = findMenuItem(items, itemKey);
  if (selectedItem) {
    breadcrumbItems.push(selectedItem.label);
    while (selectedItem.key !== '1') {
      const parentItem = findMenuItem(items, selectedItem.parentKey);
      if (parentItem) {
        breadcrumbItems.push(parentItem.label);
        selectedItem = parentItem;
      } else {
        break;
      }
    }
  }
  return breadcrumbItems;
};

export default getMenuBreadcrumb;
