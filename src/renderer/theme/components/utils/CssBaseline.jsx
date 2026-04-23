import echart from "../../styles/echart";
import scrollbar from "../../styles/scrollbar";
import simplebar from "../../styles/simplebar";

const CssBaseline = {
  defaultProps: {},
  styleOverrides: (theme) => ({
    "*, *::before, *::after": {
      margin: 0,
      padding: 0,
    },
    html: {
      scrollBehavior: "smooth",
    },
    body: {
      fontVariantLigatures: "none",
      backgroundColor: theme.palette.info.main,
      ...scrollbar(theme),
    },
    ...simplebar(theme),
    ...echart(),
  }),
};

export default CssBaseline;
