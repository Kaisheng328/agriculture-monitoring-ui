import { Theme } from '@mui/material';
import { Components } from '@mui/material/styles/components';
import IconifyIcon from 'components/base/IconifyIcon';
import { darkThemeColors } from 'theme/colors';
const DataGrid: Components<Omit<Theme, 'components'>>['MuiDataGrid'] = {
  defaultProps: {
    slots: {
      columnSortedDescendingIcon: (props) => (
        <IconifyIcon icon="solar:alt-arrow-up-bold" {...props} />
      ),
      columnSortedAscendingIcon: (props) => (
        <IconifyIcon icon="solar:alt-arrow-down-bold" {...props} />
      ),
    },
  },
  styleOverrides: {
    root: ({ theme }) => ({
      border: 'none',
      borderRadius: '0 !important',
      '--DataGrid-rowBorderColor': theme.palette.info.lighter,
      '&:hover, &:focus': {
        '*::-webkit-scrollbar, *::-webkit-scrollbar-thumb': {
          visibility: 'visible',
        },
      },
      '& .MuiDataGrid-scrollbar--vertical': {
        visibility: 'hidden',
      },
      '& .MuiDataGrid-scrollbarFiller': {
        minWidth: 0,
      },
    }),
    row: ({ theme }) => {
      const isDarkMode = theme.palette.mode === 'dark';
      return {
        borderRadius: theme.shape.borderRadius * 1.5,
        '&:nth-of-type(odd)': {
          backgroundColor: isDarkMode ? darkThemeColors.tableRowOdd : theme.palette.background.paper, // Or another light theme color
        },
        '&:nth-of-type(even)': {
          backgroundColor: isDarkMode ? darkThemeColors.tableRowEven : theme.palette.info.main, // Existing light theme even row
        },
        '&:hover': {
          backgroundColor: isDarkMode ? darkThemeColors.surface : theme.palette.info.lighter, // Adjust hover for dark
          // Consider keeping hover consistent or slightly different for even/odd in dark mode if needed
        },
      };
    },
    cell: ({ theme }) => {
      const isDarkMode = theme.palette.mode === 'dark';
      return {
        padding: 0,
        color: isDarkMode ? darkThemeColors.textPrimary : theme.palette.primary.darker,
        fontSize: theme.typography.caption.fontSize,
        fontWeight: 600,
        '&:focus-within': {
        outline: 'none !important',
      },
    }},
    cellCheckbox: {
      justifyContent: 'flex-start',
    },
    columnHeaderCheckbox: {
      '& .MuiDataGrid-columnHeaderTitleContainer': {
        justifyContent: 'flex-start',
      },
    },
    columnHeader: ({ theme }) => {
      const isDarkMode = theme.palette.mode === 'dark';
      return {
        padding: 0,
        borderBottom: 1,
        borderColor: isDarkMode ? darkThemeColors.tableHeader : `${theme.palette.info.main} !important`,
        backgroundColor: isDarkMode ? darkThemeColors.tableHeader : theme.palette.background.paper, // Or another light theme color
        height: '3rem !important',
        '&:focus-within': {
          outline: 'none !important',
        },
      };
    },
    columnHeaderTitle: ({ theme }) => {
      const isDarkMode = theme.palette.mode === 'dark';
      return {
        color: isDarkMode ? darkThemeColors.textPrimary : theme.palette.text.primary,
        fontSize: theme.typography.caption.fontSize,
        fontWeight: 500,
      };
    },
    iconButtonContainer: () => ({
      '& .MuiIconButton-root': {
        backgroundColor: 'transparent !important',
        border: 'none',
      },
    }),
    columnSeparator: {
      display: 'none',
    },
    selectedRowCount: {
      display: 'none',
    },
    sortIcon: ({ theme }) => ({
      fontSize: theme.typography.caption.fontSize,
    }),
    footerContainer: ({ theme }) => {
      const isDarkMode = theme.palette.mode === 'dark';
      return {
        border: 0,
        borderTop: 1,
        borderStyle: 'solid',
        borderColor: isDarkMode ? darkThemeColors.tableHeader : `${theme.palette.info.main} !important`,
        backgroundColor: isDarkMode ? darkThemeColors.surface : theme.palette.background.paper, // Consistent with other surfaces
      };
    },
  },
};

export default DataGrid;
