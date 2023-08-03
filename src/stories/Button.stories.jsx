import Button from '../../components/Button.jsx';

export default{
    component: Button,
    title: "components/Button"
}


// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary = {
  args: {
    primary: true,
    label: 'Button',
  },
};

export const Secondary = {
  args: {
    label: 'Button',
  },
};

export const Large = {
  args: {
    size: 'large',
    label: 'Button',
  },
};

export const Small = {
  args: {
    size: 'small',
    label: `
This is a long
test    
    `,
    href:"https://google.com"
  },
};

export const Medium = {
  args: {
    size: 'medium',
    label: `Next`,
    primary: 'true',
    href:"https://google.com"
  },
};