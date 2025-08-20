import React from "react";
import DragScrollX from "../DragScrollX";
import Nuevos from "./Nuevos";
import Contactado from "./Contactado";
import EnElBanco from "./EnElBanco";
import Aprobado from "./Aprobado";
import Rechazado from "./Rechazado";

const DragParent = () => {
  return (
     <>
          <Nuevos />
          <Contactado />
          <EnElBanco />
          <Aprobado />
          <Rechazado />
     </>

  );
};

export default DragParent;