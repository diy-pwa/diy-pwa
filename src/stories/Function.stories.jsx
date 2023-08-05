import Function from '../../components/Function';

function sayHello(name) {
  return `hello ${name}`;
}

export default {
  component: Function,
  title: 'components/Function',
  tags: ['autodocs'],
  argTypes: {
    // function is the property we want to remove from the UI
    function: {
      table: {
        disable: true,
      },
    },
  },
};

export const Rich = {
  args: {
    function: sayHello,
    args: ['Rich'],
  },
};

export const Biff = {
  args: {
    function: sayHello,
    args: ['Biff'],
  },
};
