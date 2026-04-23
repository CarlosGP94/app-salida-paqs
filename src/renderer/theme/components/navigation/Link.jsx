import { Link as RouterLink } from "react-router-dom";
import { forwardRef } from "react";
import React from "react";

// Comportamiento para usar react-router Link con MUI Link
const LinkBehavior = forwardRef((props, ref) => {
  const { href, ...other } = props;
  // Mapear href (Material UI) -> to (react-router)
  return <RouterLink ref={ref} to={href} {...other} />;
});

// Configuración para MUI Link
const Link = {
  defaultProps: {
    underline: "none",
    component: LinkBehavior,
  },
};

export default Link;
