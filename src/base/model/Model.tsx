import React from 'react';

interface IModel {
  token?: string;
}

const ModelContext = React.createContext<{
  data: IModel;
  setData: React.Dispatch<React.SetStateAction<IModel>>;
}>({ data: {}, setData: () => {} });

const ModelProvider = (props: { children: React.ReactNode }) => {
  const [data, setData] = React.useState({});
  return (
    <ModelContext.Provider value={{ data, setData }}>
      {props.children}
    </ModelContext.Provider>
  );
};

export { ModelContext, ModelProvider };
export type { IModel };
