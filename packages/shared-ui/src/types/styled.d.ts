import 'styled-components';
import type {Theme} from '@scala-cme/shared-redux/types';

declare module 'styled-components' {
  export interface DefaultTheme extends Theme {
    // Extend the theme interface if needed
    _brand: 'DefaultTheme';
  }
}
