import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, useOutletContext }from "react-router-dom"
import { useAuthState } from "react-firebase-hooks/auth";
import { batch, useDispatch, useSelector } from "react-redux";

import { AppDispatch, RootState } from "../redux/store";
import { addPublicLeagues, addPublicLeagueSeasons } from "../redux/publicContextSlice";

import { auth } from "../Firebase/firebase";

import { ILeague, ILeagueSeason } from "../Interfaces/league";
import { IPlayer } from "../Interfaces/player";
import { ITeam } from "../Interfaces/team";

import { IApiSetUserFirebaseTokenParams, setUserFirebaseToken } from "../ApiCall/users";
import { fetchLeagues, IApiFetchLeaguesParams } from "../ApiCall/leagues";
import { IApiFetchLeagueSeasonsParams, fetchLeagueSeasons } from "../ApiCall/seasons";
import { IApiFetchTeamsParams, fetchTeams } from "../ApiCall/teams";
import { IApiFetchPlayersParams, fetchPlayers } from "../ApiCall/players";

import LoaderInfo from "../Generic/LoaderInfo";

import { getLeagueAndSeason } from "../utils/dataFilter";
import { castNumber } from "../utils/castValues";

// TODO Remove or move those in the AdminApp
type TAdminData = {
  leagueSeason: ILeagueSeason;
  isAdmin: boolean;
}
export function useAdminData() {
  return useOutletContext<TAdminData>()
}

type TPublicContext = {
  league: ILeague;
  leagueSeason: ILeagueSeason;
  leaguePlayers: IPlayer[];
  leagueSeasonTeams: ITeam[];
}



export function usePublicContext() {
  return useOutletContext<TPublicContext>()
}

function PublicApp() {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate()
  
  const [user, loading] = useAuthState(auth);
  const [apiError, changeApiError] = useState<string>('');
  const [adminValidate, setAdminValidate] = useState<boolean>(false);
  const [dataRetrieved, setDataRetrieved] = useState<boolean>(false);
  const [leaguePlayers, setLeaguePlayers] = useState<IPlayer[]>([]);
  const [leagueSeasonTeams, setLeagueSeasonTeams] = useState<ITeam[]>([]);
  
  const statePublicContext = useSelector((state: RootState) => state.publicContext )
  
  const crumbs = location.pathname.split('/')
    .filter((crumb) => crumb !== '');
  const isLeagueSelected = crumbs.length > 0 && castNumber(crumbs[0]) !== 0;
  const [league, leagueSeason] = getLeagueAndSeason(statePublicContext.leagues, statePublicContext.leagueSeasons, isLeagueSelected ? castNumber(crumbs[0]) : 0);
  
  useEffect(() => {
    if ( ! dataRetrieved ) return;
    if( crumbs[0] && ! ( league && leagueSeason) ) {
      navigate('/');
    } 
  },[crumbs, dataRetrieved, league, leagueSeason, navigate])

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
          .catch(error => {
            window.localStorage.clear();
          })
          .finally(() => {
            batch(() => {
              /* setAdminData(true) */
              setAdminValidate(true);
            })
          })
      })
    }
    else {
      window.localStorage.clear();
      setAdminValidate(true);
    }
  }, [user, loading]);

  useEffect(() => {
    if( ! adminValidate ){
      return;
    }
    let listLeagues: ILeague[] = [];
    let listLeagueSeasons: ILeagueSeason[] = [];

    const paramsFetchLeagues: IApiFetchLeaguesParams = {
      allLeagues:true
    }
    fetchLeagues(paramsFetchLeagues)
      .then(response => {
        listLeagues = response.data;
        const leagueIds = listLeagues.map((league) => league.id) || [];
        const paramsFetchLeagueSeasons: IApiFetchLeagueSeasonsParams = {
          leagueIds: leagueIds
        }
        fetchLeagueSeasons(paramsFetchLeagueSeasons)
          .then(response => {
            listLeagueSeasons = response.data;
          })
          .catch(error => {
            batch(() => {
              changeApiError(error);
            })
            
          })
          .finally(() => {
            batch(()=>{
              dispatch(addPublicLeagues(listLeagues));
              dispatch(addPublicLeagueSeasons(listLeagueSeasons));
            })
          });
      })
      .catch(error => {
        
      })
      .finally(() => {
        
      });
  }, [dispatch, adminValidate]);

  useEffect(() => {
    if( leagueSeason === null) {
      if( ! isLeagueSelected ) {
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
    
  },[isLeagueSelected, leagueSeason])

  return (
    <>
      <LoaderInfo
        isLoading={dataRetrieved}
        hasWrapper={true}
        msgError={apiError}
      />
      { dataRetrieved ? (
        <Outlet 
          context={{
            league: league,
            leagueSeason: leagueSeason,
            leaguePlayers: leaguePlayers,
            leagueSeasonTeams: leagueSeasonTeams,
          }} 
        />
      ) : ''}
    </>
  )
}
export default PublicApp;