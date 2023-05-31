import { useEffect } from "react";

import { useAdminContext } from "./AdminApp";

import AdminMenu from "../Menu/AdminMenu";
import AdminBreadcrumb from "../Menu/AdminBreadcrumb";
import CreateSeason from "../Seasons/CreateSeason";

import { setMetas } from "../utils/metaTags";


function LeagueManager() {

  const { league, leagueSeason } = useAdminContext();

  useEffect(() =>{
    setMetas({
      title:`${league.name} ${leagueSeason.name} ${leagueSeason.year} league manager`,
      description:`${league.name} ${leagueSeason.name} manager`
    });
  },[league.name, leagueSeason.name, leagueSeason.year])

  return (
    <>
      <AdminMenu />
      <AdminBreadcrumb />
      <CreateSeason />
    </>
  );
}

export default LeagueManager;