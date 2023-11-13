type MenuItem = {
  key: string;
  label: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
};

interface BreadcrumbItem {
  title: React.ReactNode;
}

const getMenuBreadcrumb = (
  itemKey: string,
  items: MenuItem[],
): BreadcrumbItem[] => {
  const breadcrumbItems: BreadcrumbItem[] = [];

  const findMenuItem = (
    items: MenuItem[],
    key: string,
  ): MenuItem | undefined => {
    for (const item of items) {
      if (item.key === key) {
        return item;
      } else if (item.children) {
        const foundItem = findMenuItem(item.children, key);
        if (foundItem) {
          breadcrumbItems.push({ title: item.label });
          return foundItem;
        }
      }
    }
    return undefined;
  };

  let selectedItem = findMenuItem(items, itemKey);
  if (selectedItem) {
    breadcrumbItems.push({ title: selectedItem.label });
    while (selectedItem?.children && selectedItem.children.length > 0) {
      const nextParent: MenuItem = selectedItem.children[0];
      breadcrumbItems.push({ title: nextParent.label });
      selectedItem = nextParent;
    }
  }
  return breadcrumbItems;
};

export default getMenuBreadcrumb;
