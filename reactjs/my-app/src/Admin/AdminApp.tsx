import { useEffect, useMemo, useState } from "react";
import { batch, useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { Outlet, useLocation, useNavigate, useOutletContext } from "react-router-dom"
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "../Firebase/firebase";

import { RootState } from "../redux/store";

import { ILeague, ILeagueSeason } from "../Interfaces/league";
import { IPlayer } from "../Interfaces/player";
import { ITeam } from "../Interfaces/team";

import { IApiFetchUserLeaguesParams, IApiSetUserFirebaseTokenParams, fetchUserLeagues, setUserFirebaseToken } from "../ApiCall/users";
import { IApiFetchPlayersParams, fetchPlayers } from "../ApiCall/players";
import { IApiFetchTeamsParams, fetchTeams } from "../ApiCall/teams";

import LoaderInfo from "../Generic/LoaderInfo";

import { castNumber } from "../utils/castValues";
import { getLeagueAndSeason } from "../utils/dataFilter";
import { setDefaultAdminMetas } from '../utils/metaTags';
import { addAdminLeagues, addAdminLeagueSeasons } from "../redux/adminContextSlice";
import { quickLinkAdminHome, quickLinkLogin } from "../utils/constants";


type TAdminContext = {
  league: ILeague;
  leagueSeason: ILeagueSeason;
  leaguePlayers: IPlayer[];
  leagueSeasonTeams: ITeam[];
}

export function useAdminData() {
  return useOutletContext<TAdminContext>()
}
export function useAdminContext() {
  return useOutletContext<TAdminContext>()
}
function AdminApp() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  
  const [user, loading] = useAuthState(auth);
  const [adminValidate, setAdminValidate] = useState<boolean>(false);
  const [apiError, changeApiError] = useState<string>('');
  const [dataRetrieved, setDataRetrieved] = useState<boolean>(false);
  const [leaguePlayers, setLeaguePlayers] = useState<IPlayer[]>([]);
  const [leagueSeasonTeams, setLeagueSeasonTeams] = useState<ITeam[]>([]);

  const stateAdminContext = useSelector((state: RootState) => state.adminContext )

  const crumbs = location.pathname.split('/')
    .filter((crumb) => crumb !== '');
  const isLeagueSelected = crumbs.length > 1 && castNumber(crumbs[1]) !== 0;
  const [league, leagueSeason] = getLeagueAndSeason(stateAdminContext.leagues, stateAdminContext.leagueSeasons, isLeagueSelected ? castNumber(crumbs[1]) : 0);
  
  /** Redirect to dashboard when no league is selected */
  
  useEffect(() => {
    if ( ! dataRetrieved ) return;
    if( crumbs[1] && ! ( league && leagueSeason) ) {
      navigate(quickLinkAdminHome.link);
    }
  },[crumbs, dataRetrieved, league, leagueSeason, navigate])


  /** Fetch Admin user data */
  useEffect(() => {
    if (loading) return;
    if (user) {
      user.getIdToken().then(token=>{
        window.localStorage.setItem('userToken', token);

        const paramsSetUserFirebaseToken: IApiSetUserFirebaseTokenParams = {
          email: user.email || '',
          token: token,
        }
        setUserFirebaseToken(paramsSetUserFirebaseToken)
          .then(response => {
            if( location.pathname === quickLinkLogin.link ){
              navigate(quickLinkAdminHome.link);
            }

          })
          .catch(error => {
            window.localStorage.clear();
          })
          .then(() => {
            setAdminValidate(true);
          })
      })
    }
    else {
      window.localStorage.clear();
      navigate(quickLinkLogin.link);
    }
  }, [user, loading, navigate, location]);

  useEffect(() => {
    if( ! adminValidate ){
      return;
    }
      
    let newError: string = '';
    let adminLeagues: ILeague[] = [];
    let adminLeagueSeasons: ILeagueSeason[] = [];

    const paramsUserLeagues: IApiFetchUserLeaguesParams = {}
    fetchUserLeagues(paramsUserLeagues)
      .then(response => {
        if ( response.data.length === 0) {
          newError = "There is no league assigned to your profile. Please advised the admin";
        }
        adminLeagues = response.data.leagues || [];
        adminLeagueSeasons = response.data.leagueSeasons || [];

      })
      .catch((error) => {
        newError = error;
      })
      .finally(() =>{
        batch(() => {
          dispatch(addAdminLeagues(adminLeagues));
          dispatch(addAdminLeagueSeasons(adminLeagueSeasons));
          changeApiError(newError);
        })
      })
      
  }, [adminValidate, dispatch]);

  useEffect(() => {
    if( ! adminValidate ){
      return;
    }
    if( ! isLeagueSelected ) {
      setDataRetrieved(true);
      return;
    }
    if( isLeagueSelected && dataRetrieved)
    {
      return;
    }
    if( leagueSeason === null) {
      if( ! isLeagueSelected && ! dataRetrieved ) {
        setDataRetrieved(true);
      }
      return;
    }
    
    let newError: string = '';
    let newPlayers: IPlayer[] = [];
    let newTeams: ITeam[] = []
    const paramsFetchPlayers: IApiFetchPlayersParams = {
      leagueIds: [leagueSeason.idLeague],
      allPlayers:true
    }
    const paramsFetchTeams: IApiFetchTeamsParams = {
      leagueSeasonIds: [leagueSeason.id]
    }
    Promise.all([fetchPlayers(paramsFetchPlayers), fetchTeams(paramsFetchTeams)])
      .catch((error) => {
        newError = error;
      })
      .then((values) => {
        if( ! values) return;

        newPlayers = values[0].data || [];
        newTeams = values[1].data || [];
      })
      .finally(() => {
        batch(() => {
          changeApiError(newError);
          setLeaguePlayers(newPlayers);
          setLeagueSeasonTeams(newTeams);
          setDataRetrieved(true);
        })
      })
    
  },[adminValidate, crumbs, dataRetrieved, isLeagueSelected, league, leagueSeason])

  useMemo(() => {
    setDefaultAdminMetas();
  },[])
  
  return (
    <>
      <LoaderInfo
        hasWrapper={true}
        msgError={apiError}
        isLoading={dataRetrieved}
      />
      
      {dataRetrieved ? (
        <>
          <Outlet 
            context={{
              league: league,
              leagueSeason: leagueSeason,
              leaguePlayers: leaguePlayers,
              leagueSeasonTeams: leagueSeasonTeams,
            }}
          />
        </>
      ) : ''}
    </>
  )
}
export default AdminApp;