"use client";
import { createContext, useContext, useState } from "react";

const EditContext = createContext();

export function EditProvider({ children }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <EditContext.Provider value={{ isEditing, setIsEditing }}>
      {children}
    </EditContext.Provider>
  );
}

export function useEdit() {
  return useContext(EditContext);
}
