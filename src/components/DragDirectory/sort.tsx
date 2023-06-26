import React, { ReactNode, useMemo } from 'react';
import classnames from 'classnames';
import {SortableContainer, SortableElement, SortableHandle} from 'react-sortable-hoc';
import arrayMove from 'array-move';

import style from './sort.lees';

export default function Sort(props: React.PropsWithChildren<{
  className?: string,
  items: any[],
  sortItem: (params: { value?: any }) => ReactNode,
  onSortEnd: (params: { oldIndex: number, newIndex: number }) => void,
}>) {

  const { items, sortItem, className, onSortEnd } = props;

  const SortableItem = SortableElement(sortItem);

  const SortableList = SortableContainer(({items}: { items: any[] }) => {
    return (
      <div className={classnames('drag-sort-wrap', { [`${className}`]: !!className })}>
        {items.map((value: any, index) => (
          <SortableItem key={`item-${value}`} index={index} value={value} />
        ))}
      </div>
    );
  })

  return (<SortableList distance={10} items={items} onSortEnd={onSortEnd} />);
}