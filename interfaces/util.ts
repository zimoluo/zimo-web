type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

type ElementType<T> = T extends (infer U)[] ? U : never;
