import {
  gray,
  red,
  green,
  blue,
  skyblue,
  purple,
  yellow,
  white,
  transparentRed,
  transparentGreen,
  transparentYellow,
} from "./colors";

const palette = {
  neutral: {
    main: gray[500],
  },
  primary: {
    main: purple[500],
  },
  secondary: {
    light: skyblue[500],
    main: blue[500],
  },
  info: {
    light: white[100],
    main: white[200],
    dark: white[300],
  },
  success: {
    main: green[500],
  },
  warning: {
    main: yellow[500],
  },
  error: {
    main: red[500],
  },
  text: {
    primary: blue[500],
    secondary: blue[400],
    disabled: gray[500],
  },
  gradients: {
    primary: {
      main: purple[500],
      state: purple[300],
    },
  },
  transparent: {
    success: {
      main: transparentGreen[500],
    },
    warning: {
      main: transparentYellow[500],
    },
    error: {
      main: transparentRed[500],
    },
  },
};

export default palette;
