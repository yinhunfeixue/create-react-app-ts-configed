import React from 'react';

interface IModel {
  token?: string;
}

function udateToken(token?: string) {
  const tokenName = 'token';
  if (token) {
    localStorage.setItem(tokenName, token);
  } else {
    localStorage.removeItem(tokenName);
  }
}

const ModelContext = React.createContext<{
  data: IModel;
  setData: (value: Partial<IModel>) => void;
}>({ data: {}, setData: () => {} });

const ModelProvider = (props: { children: React.ReactNode }) => {
  const [data, setData] = React.useState<IModel>({});

  const updateData = (value: Partial<IModel>) => {
    setData({ ...data, ...value });

    if ('token' in value) {
      udateToken(value.token);
    }
  };
  return (
    <ModelContext.Provider value={{ data, setData: updateData }}>
      {props.children}
    </ModelContext.Provider>
  );
};

export { ModelContext, ModelProvider };
export type { IModel };
