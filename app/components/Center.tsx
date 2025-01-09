import React, { ReactElement, ReactNode } from "react";

const Center = ({ children , className = "" , centerXOnly=false , centerYOnly = false , col=true} : {children : any , className : string , centerXOnly ?: boolean , centerYOnly ?: boolean , col ?:boolean}) => {
    return (
      <div
        className={`flex ${col && "flex-col"}  ${centerXOnly ? "" : "items-center"} justify-center ${className}`}
      >
        {children}
      </div>
    );
  };
  
  export default Center;