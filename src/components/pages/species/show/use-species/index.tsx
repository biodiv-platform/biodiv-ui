import useGlobalState from "@hooks/use-global-state";
import React, { createContext, useContext } from "react";

interface SpeciesContextProps {
  species;
  permissions;
  getFieldPermission;
  licensesList;
}

interface CounterProviderProps {
  species;
  permissions;
  licensesList;
  children;
}

const SpeciesContext = createContext<SpeciesContextProps>({} as SpeciesContextProps);

export const SpeciesProvider = ({
  children,
  species,
  permissions,
  licensesList,
  ...rest
}: CounterProviderProps) => {
  const { user } = useGlobalState();

  /**
   * admin can edit anything
   *
   * if user has `speiesContributor` permission then he can
   * - add new field(s) to that species page
   * - update the one's he is contributor to
   *
   */
  const getFieldPermission = ({ contributor = [] as any }) => {
    return (
      permissions.isAdmin ||
      (permissions.isContributor && contributor.map((c) => c.id).includes(user.id))
    );
  };

  return (
    <SpeciesContext.Provider
      value={{
        ...rest,
        species,
        permissions,
        getFieldPermission,
        licensesList
      }}
    >
      {children}
    </SpeciesContext.Provider>
  );
};

export default function useSpecies() {
  return useContext(SpeciesContext);
}
