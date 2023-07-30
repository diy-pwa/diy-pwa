import Function from '../../components/Function';

function sayHello(name) {
  return `hello ${name}`;
}

export default {
  component: (...args) => <Function function={sayHello} args={args}></Function>,
  title: 'components/Function',
  tags: ['autodocs'],
};

export const Rich = {
  args: {
    args: ['Rich'],
  },
};

export const Biff = {
  args: {
    args: ['Biff'],
  },
};
