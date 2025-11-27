import * as React from 'react';
import {
  CssVarsProvider,
  extendTheme,
  type Components,
  type Theme,
} from '@mui/material/styles';

export interface AppThemeProps {
  children: React.ReactNode;
  disableCustomTheme?: boolean;
  themeComponents?: Components<Theme>;
}

const baseTheme = extendTheme({
  colorSchemes: {
    light: {},
    dark: {},
  },
});

export default function AppTheme({
  children,
  disableCustomTheme = false,
  themeComponents,
}: AppThemeProps) {
  const memoizedTheme = React.useMemo(() => {
    if (disableCustomTheme || !themeComponents) {
      return baseTheme;
    }

    return extendTheme({
      ...baseTheme,
      components: {
        ...baseTheme.components,
        ...themeComponents,
      },
    });
  }, [disableCustomTheme, themeComponents]);

  return <CssVarsProvider theme={memoizedTheme}>{children}</CssVarsProvider>;
}

