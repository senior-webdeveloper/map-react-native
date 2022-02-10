declare namespace ReactNativeDraggableFlatlist {
  export type RenderItemParams<T> = {
    item: T;
    index: number; // This is technically a "last known index" since cells don't necessarily rerender when their index changes
    drag: () => void;
    isActive: boolean;
  };
}
