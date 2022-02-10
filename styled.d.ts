import 'styled-components/native';

declare module 'styled-components/native' {
  interface Fonts {
    bold: string;
    regular: string;
    light: string;
  }
  interface TextProps {
    'font-size': string;
    'line-height': string;
    'letter-spacing'?: string;
    color: string;
  }
  interface TextStyles {
    normal: TextProps;
    small: TextProps;
    heading: TextProps;
  }
  interface SemanticColors {
    green: string;
    red: string;
    yellow: string;
    blue: string;
  }
  interface AccentColors {
    green: string;
    lightGreen: string;
  }
  interface Colors {
    text: string;
    blue: string;
    textWhite: string;
    backgroundGray: string;
    backgroundWhite: string;
    grayTransparent: string;
    accent: AccentColors;
    semantic: SemanticColors;
    gray: string;
    orange: string;
    blue100: string;
  }
  export interface DefaultTheme {
    fontFamily: Fonts;
    textStyle: TextStyles;
    paddingHorizontal: string;
    paddingVertical: string;
    colors: Colors;
  }
}
