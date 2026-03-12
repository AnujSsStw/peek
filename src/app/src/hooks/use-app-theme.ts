import { AppColors } from '@/constants/colors';
import { useColorScheme } from '@/hooks/use-color-scheme';

export function useAppTheme() {
  const scheme = useColorScheme();
  const theme = scheme === 'unspecified' ? 'light' : scheme;
  return AppColors[theme];
}
