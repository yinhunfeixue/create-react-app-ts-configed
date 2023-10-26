import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Key, ReactNode } from 'react';

interface IDraggerContextProps<T = any> {
  dataSource: T[];
  keyField: string;
  onChange: (data: T[]) => void;
  children: ReactNode;
}

/**
 * DraggerContext
 *
 * @example
 * ```
 * <DraggerContext
 *  dataSource={list}
 *  onChange={(value) => setList(value)}
 *  keyField="id"
 * >
 *  {list.map((item, index) => {
 *    return (
 *      <DraggerItem
 *        key={item.id}
 *        uid={item.id}
 *        renderItem={(params: {
 *          nodeProps: any;
 *          activatorNodeProps: any;
 *        }) => {
 *          return (
 *            <div {...params.nodeProps}>
 *              <DragOutlined {...params.activatorNodeProps} />
 *            </div>
 *          );
 *        }}
 *      />
 *    );
 *  })}
 * </DraggerContext>
 * ```
 */
const DraggerContext = <T extends any = any>(
  props: IDraggerContextProps<T>
) => {
  const { onChange, children, dataSource, keyField } = props;
  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      onChange([]);
      const list = dataSource.concat();
      const match = (item: any, value?: Key) => {
        return value && item[keyField] === value;
      };

      const activeIndex = list.findIndex((item) => match(item, active.id));
      const overIndex = list.findIndex((item) => match(item, over?.id));
      if (activeIndex >= 0 && overIndex >= 0) {
        const result = arrayMove(list, activeIndex, overIndex);
        onChange(result);
      }
    }
  };

  return (
    <DndContext onDragEnd={onDragEnd} modifiers={[restrictToVerticalAxis]}>
      <SortableContext
        items={dataSource.map((item) => (item as any)[keyField])}
        strategy={verticalListSortingStrategy}
      >
        {children}
      </SortableContext>
    </DndContext>
  );
};
export default DraggerContext;
