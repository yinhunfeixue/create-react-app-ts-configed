import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React, { ReactElement } from 'react';

interface IDraggerItemProps {
  uid: string | number;
  renderItem: (params: {
    nodeProps: any;
    activatorNodeProps: any;
  }) => ReactElement;
}
/**
 * DraggerItem
 */
const DraggerItem: React.FC<IDraggerItemProps> = (props) => {
  const { uid, renderItem, ...otherProps } = props;
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: uid,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform && { ...transform, scaleY: 1 }),
    transition,
    ...(isDragging ? { position: 'relative', zIndex: 9999 } : {}),
  };

  return renderItem({
    nodeProps: {
      ref: setNodeRef,
      ...otherProps,
      style,
      ...attributes,
    },
    activatorNodeProps: {
      ref: setActivatorNodeRef,
      ...listeners,
      style: { touchAction: 'none', cursor: 'move' },
    },
  });
};
export default DraggerItem;
