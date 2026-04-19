import { useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'

/** Mobile/tablet layout below MUI `md` (default < 900px). */
export function useIsMobileLayout() {
  const theme = useTheme()
  return useMediaQuery(theme.breakpoints.down('md'))
}
